"""SIKO Payments Router — Full payment flow with Razorpay abstraction"""

import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from models import Booking, Payment, Escrow, RefundAcceptance, RefundPolicy, AuditLog, Student, User
from auth import get_current_user, require_student_or_parent, require_admin
from services.payment_service import (
    get_payment_provider, to_paise, from_paise,
    generate_idempotency_key, verify_razorpay_webhook
)

router = APIRouter()


class CreateOrderRequest(BaseModel):
    booking_id: Optional[str] = None
    amount: float
    currency: str = "INR"
    booking_type: str = "individual"
    teacher_id: Optional[str] = None
    journey_id: Optional[str] = None
    refund_acceptance_id: Optional[str] = None


class VerifyPaymentRequest(BaseModel):
    booking_id: str
    provider_order_id: str
    provider_payment_id: str
    signature: str


class RecordRefundAcceptanceRequest(BaseModel):
    policy_version: str = "1.0"
    student_name: Optional[str] = None


# ── Record refund policy acceptance (MUST before payment) ────────────────────
@router.post("/refund-acceptance")
def record_refund_acceptance(
    req: RecordRefundAcceptanceRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Record that the user has accepted the refund policy.
    Payment CANNOT proceed without this.
    """
    policy = db.query(RefundPolicy).filter(
        RefundPolicy.version == req.policy_version,
        RefundPolicy.is_active == True,
    ).first()

    if not policy:
        raise HTTPException(status_code=404, detail="Refund policy not found.")

    acceptance = RefundAcceptance(
        user_id=current_user.id,
        student_name=req.student_name or current_user.full_name,
        policy_id=policy.id,
        policy_version=policy.version,
        policy_hash=policy.content_hash,
        accepting_role=current_user.role,
        ip_address=request.client.host if request.client else "unknown",
        user_agent=request.headers.get("user-agent", ""),
    )
    db.add(acceptance)

    # Audit
    db.add(AuditLog(
        actor_id=current_user.id, actor_role=current_user.role,
        entity_type="refund_policy", entity_id=policy.id,
        action="refund_policy_accepted",
        event_metadata=str({
            "policy_version": policy.version,
            "policy_hash": policy.content_hash,
            "acceptance_event_id": acceptance.acceptance_event_id,
        }),
    ))
    db.commit()
    db.refresh(acceptance)

    return {
        "success": True,
        "acceptance_id": acceptance.id,
        "acceptance_event_id": acceptance.acceptance_event_id,
        "policy_version": policy.version,
        "accepted_at": acceptance.accepted_at.isoformat(),
        "message": "Refund policy acceptance recorded. You may proceed to payment.",
    }


# ── Create payment order ───────────────────────────────────────────────────────
@router.post("/create-order")
def create_payment_order(
    req: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a payment order. Requires refund_acceptance_id."""

    # Enforce refund acceptance
    if not req.refund_acceptance_id:
        raise HTTPException(
            status_code=400,
            detail="Refund policy acceptance is required before payment. Please accept the refund policy first.",
        )

    acceptance = db.query(RefundAcceptance).filter(
        RefundAcceptance.id == req.refund_acceptance_id,
        RefundAcceptance.user_id == current_user.id,
    ).first()

    if not acceptance:
        raise HTTPException(
            status_code=400,
            detail="We couldn't verify your policy acceptance. Your payment has not been started. Please accept the refund policy again.",
        )

    # Create booking record
    booking = Booking(
        booking_ref="BKG-" + uuid.uuid4().hex[:8].upper(),
        student_id=current_user.student.id if current_user.student else None,
        teacher_id=req.teacher_id,
        journey_id=req.journey_id,
        booking_type=req.booking_type,
        total_amount=req.amount,
        currency=req.currency,
        status="pending",
        payment_status="unpaid",
        refund_acceptance_id=req.refund_acceptance_id,
    )
    db.add(booking)
    db.flush()

    # Create payment record
    idempotency_key = generate_idempotency_key(booking.id)
    payment = Payment(
        booking_id=booking.id,
        provider=__import__('os').getenv("PAYMENT_PROVIDER", "mock"),
        amount=req.amount,
        currency=req.currency,
        status="pending",
        idempotency_key=idempotency_key,
    )
    db.add(payment)

    # Get provider order
    provider = get_payment_provider()
    try:
        provider_order = provider.create_order(
            amount_paise=to_paise(req.amount),
            currency=req.currency,
            receipt=booking.booking_ref,
            notes={"booking_id": booking.id, "student": current_user.full_name},
        )
        payment.provider_order_id = provider_order["id"]
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Payment provider error: {str(e)}")

    db.commit()

    return {
        "success": True,
        "booking_id": booking.id,
        "booking_ref": booking.booking_ref,
        "provider_order_id": provider_order["id"],
        "amount": req.amount,
        "currency": req.currency,
        "key_id": __import__('os').getenv("RAZORPAY_KEY_ID", "mock"),
        "provider": provider_order.get("_provider", "razorpay"),
    }


# ── Verify payment ─────────────────────────────────────────────────────────────
@router.post("/verify")
def verify_payment(
    req: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify payment signature and update records."""

    booking = db.query(Booking).filter(Booking.id == req.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    payment = db.query(Payment).filter(Payment.booking_id == booking.id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found.")

    # Verify with provider
    provider = get_payment_provider()
    is_valid = provider.verify_payment(
        req.provider_order_id, req.provider_payment_id, req.signature
    )

    if not is_valid:
        payment.status = "failed"
        booking.payment_status = "unpaid"
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed. Please contact support.")

    # Update payment
    payment.status = "success"
    payment.provider_payment_id = req.provider_payment_id
    payment.verified_at = datetime.utcnow()

    # Update booking
    booking.status = "confirmed"
    booking.payment_status = "paid"

    # Create escrow
    if booking.teacher_id:
        m1 = booking.total_amount * 0.50
        m2 = booking.total_amount * 0.25
        m3 = booking.total_amount * 0.25
        escrow = Escrow(
            booking_id=booking.id,
            teacher_id=booking.teacher_id,
            total_amount=booking.total_amount,
            m1_amount=m1, m1_status="pending",
            m2_amount=m2, m2_status="pending",
            m3_amount=m3, m3_status="pending",
        )
        db.add(escrow)

    # Audit
    db.add(AuditLog(
        actor_id=current_user.id, actor_role=current_user.role,
        entity_type="payment", entity_id=payment.id,
        action="payment_success",
        event_metadata=str({"booking_ref": booking.booking_ref, "amount": payment.amount}),
    ))
    db.commit()

    return {
        "success": True,
        "booking_id": booking.id,
        "booking_ref": booking.booking_ref,
        "payment_id": payment.id,
        "payment_status": "success",
        "refund_policy_version": booking.refund_acceptance.policy_version if booking.refund_acceptance_id else None,
        "confirmed_at": datetime.utcnow().isoformat(),
    }


# ── Webhook ────────────────────────────────────────────────────────────────────
@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Razorpay webhook handler with signature verification."""
    body = await request.body()
    signature = request.headers.get("x-razorpay-signature", "")

    if not verify_razorpay_webhook(body, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    import json
    event = json.loads(body)
    event_type = event.get("event")

    # Handle payment.captured
    if event_type == "payment.captured":
        payment_entity = event.get("payload", {}).get("payment", {}).get("entity", {})
        provider_payment_id = payment_entity.get("id")

        payment = db.query(Payment).filter(
            Payment.provider_payment_id == provider_payment_id,
            Payment.webhook_received == False,
        ).first()

        if payment:
            payment.status = "success"
            payment.webhook_received = True
            payment.verified_at = datetime.utcnow()
            db.add(AuditLog(
                entity_type="payment", entity_id=payment.id,
                action="webhook_payment_captured",
                actor_role="system",
            ))
            db.commit()

    return {"status": "ok"}


# ── Get booking detail ────────────────────────────────────────────────────────
@router.get("/booking/{booking_id}")
def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    return {
        "id": booking.id,
        "booking_ref": booking.booking_ref,
        "status": booking.status,
        "payment_status": booking.payment_status,
        "amount": booking.total_amount,
        "currency": booking.currency,
        "created_at": booking.created_at.isoformat() if booking.created_at else None,
    }


# ── Get refund policy ─────────────────────────────────────────────────────────
@router.get("/refund-policy")
def get_refund_policy(db: Session = Depends(get_db)):
    policy = db.query(RefundPolicy).filter(RefundPolicy.is_active == True).first()
    if not policy:
        raise HTTPException(status_code=404, detail="No active refund policy found.")
    return {
        "id": policy.id,
        "version": policy.version,
        "title": policy.title,
        "content": policy.content,
        "content_hash": policy.content_hash,
        "effective_date": policy.effective_date.isoformat() if policy.effective_date else None,
    }
