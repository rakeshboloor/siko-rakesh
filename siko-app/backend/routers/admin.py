"""SIKO Admin Router — Full operational visibility and controls"""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import (User, Student, Teacher, TeacherApplication, TeacherOffer,
                    AgreementAcceptance, LearningJourney, Class, Worksheet,
                    Assessment, Payment, Escrow, AuditLog, Notification)
from auth import require_admin

router = APIRouter()

# ── Overview KPIs ──────────────────────────────────────────────────────────────
@router.get("/overview")
def overview(current_user = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        "total_students": db.query(Student).count(),
        "total_teachers": db.query(Teacher).filter(Teacher.is_active == True).count(),
        "total_journeys": db.query(LearningJourney).count(),
        "active_journeys": db.query(LearningJourney).filter(LearningJourney.status == "active").count(),
        "total_classes": db.query(Class).count(),
        "classes_today": db.query(Class).filter(Class.status == "scheduled").count(),
        "total_payments": db.query(Payment).count(),
        "successful_payments": db.query(Payment).filter(Payment.status == "success").count(),
        "content_pending_review": db.query(Worksheet).filter(Worksheet.status == "teacher_review").count(),
        "teacher_applications": {
            "applied": db.query(TeacherApplication).filter(TeacherApplication.status == "applied").count(),
            "screening": db.query(TeacherApplication).filter(TeacherApplication.status == "screening").count(),
            "interview": db.query(TeacherApplication).filter(TeacherApplication.status == "interview").count(),
            "offer_pending": db.query(TeacherApplication).filter(TeacherApplication.status == "offer_pending").count(),
            "active": db.query(TeacherApplication).filter(TeacherApplication.status == "active").count(),
        }
    }

# ── Teacher Applications ───────────────────────────────────────────────────────
@router.get("/teacher-applications")
def teacher_applications(current_user = Depends(require_admin), db: Session = Depends(get_db)):
    apps = db.query(TeacherApplication).order_by(TeacherApplication.created_at.desc()).all()
    result = []
    for a in apps:
        teacher = a.teacher
        user = teacher.user if teacher else None
        result.append({
            "id": a.id, "status": a.status,
            "teacher_id": teacher.id if teacher else None,
            "teacher_name": user.full_name if user else "Unknown",
            "teacher_email": user.email if user else None,
            "tier": teacher.tier if teacher else None,
            "rating": teacher.rating if teacher else None,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "updated_at": a.updated_at.isoformat() if a.updated_at else None,
            "stage_data": json.loads(a.stage_data or "{}"),
        })
    return result

@router.get("/teacher-applications/{app_id}")
def teacher_application_detail(app_id: str, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    app = db.query(TeacherApplication).filter(TeacherApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    teacher = app.teacher
    user = teacher.user if teacher else None
    offers = [{
        "id": o.id, "status": o.status, "subject": o.subject,
        "teacher_rate": o.teacher_rate, "sessions": o.sessions,
        "created_at": o.created_at.isoformat() if o.created_at else None,
    } for o in (app.offers or [])]
    
    agreement_status = "not_started"
    if teacher:
        acc = db.query(AgreementAcceptance).filter(AgreementAcceptance.teacher_id == teacher.id).first()
        if acc:
            agreement_status = "signed"
        elif any(o.status == "accepted" for o in (app.offers or [])):
            agreement_status = "offer_accepted_agreement_pending"
    
    return {
        "id": app.id, "status": app.status,
        "teacher_name": user.full_name if user else None,
        "teacher_email": user.email if user else None,
        "teacher_bio": teacher.bio if teacher else None,
        "expertise": json.loads(teacher.expertise or "{}") if teacher else {},
        "tier": teacher.tier if teacher else None,
        "stage_data": json.loads(app.stage_data or "{}"),
        "notes": app.notes,
        "offers": offers,
        "agreement_status": agreement_status,
        "created_at": app.created_at.isoformat() if app.created_at else None,
    }

@router.put("/teacher-applications/{app_id}/status")
def update_application_status(app_id: str, body: dict, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    app = db.query(TeacherApplication).filter(TeacherApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    new_status = body.get("status")
    
    # Cannot mark active without signed agreement
    if new_status == "active":
        teacher = app.teacher
        if teacher:
            acc = db.query(AgreementAcceptance).filter(AgreementAcceptance.teacher_id == teacher.id).first()
            if not acc:
                raise HTTPException(status_code=400, 
                    detail="Cannot activate teacher. Faculty Agreement not yet signed.")
    
    app.status = new_status
    if app.teacher:
        app.teacher.application_status = new_status
        if new_status == "active":
            app.teacher.is_active = True
    
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="teacher_application", entity_id=app.id,
                    action=f"application_status_changed_to_{new_status}"))
    db.commit()
    return {"success": True, "status": new_status}

# ── Create Teacher Offer ────────────────────────────────────────────────────────
@router.post("/teacher-offer")
def create_teacher_offer(body: dict, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    from models import TeacherOffer
    from datetime import datetime
    offer = TeacherOffer(
        teacher_id=body["teacher_id"],
        application_id=body.get("application_id"),
        subject=body.get("subject"),
        board=body.get("board"),
        grade=body.get("grade"),
        program=body.get("program"),
        learning_journey=body.get("learning_journey"),
        teaching_format=body.get("teaching_format", "Individual"),
        sessions=body.get("sessions", 0),
        session_duration=body.get("session_duration", 60),
        timezone=body.get("timezone", "IST"),
        teacher_rate=body.get("teacher_rate"),
        currency=body.get("currency", "INR"),
        commission_rate=body.get("commission_rate", 0.15),
        teacher_allocation=1 - body.get("commission_rate", 0.15),
        m1_amount=body.get("m1_amount"),
        m2_amount=body.get("m2_amount"),
        m3_amount=body.get("m3_amount"),
        deliverables=json.dumps(body.get("deliverables", [])),
        special_terms=body.get("special_terms"),
        status="pending",
    )
    db.add(offer)
    
    # Update application status
    if body.get("application_id"):
        app = db.query(TeacherApplication).filter(TeacherApplication.id == body["application_id"]).first()
        if app:
            app.status = "offer_pending"
            if app.teacher:
                app.teacher.application_status = "offer_pending"
    
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="teacher_offer", entity_id=offer.id,
                    action="offer_created",
                    event_metadata=json.dumps({"rate": body.get("teacher_rate"), "subject": body.get("subject")})))
    db.commit()
    db.refresh(offer)
    return {"success": True, "offer_id": offer.id, "message": "Offer created and sent to teacher."}

# ── Content Governance ─────────────────────────────────────────────────────────
@router.get("/content-review")
def content_review(current_user = Depends(require_admin), db: Session = Depends(get_db)):
    worksheets = db.query(Worksheet).order_by(Worksheet.generated_at.desc()).limit(50).all()
    return {
        "worksheets": [{
            "id": w.id, "chapter": w.chapter, "status": w.status,
            "ai_confidence": w.ai_confidence,
            "generated_at": w.generated_at.isoformat() if w.generated_at else None,
        } for w in worksheets],
        "stats": {
            "ai_generated": db.query(Worksheet).filter(Worksheet.status == "ai_generated").count(),
            "ai_checked": db.query(Worksheet).filter(Worksheet.status == "ai_checked").count(),
            "teacher_review": db.query(Worksheet).filter(Worksheet.status == "teacher_review").count(),
            "approved": db.query(Worksheet).filter(Worksheet.status == "approved").count(),
            "released": db.query(Worksheet).filter(Worksheet.status == "released").count(),
        }
    }

# ── Payments & Finance ─────────────────────────────────────────────────────────
@router.get("/payments")
def payments(current_user = Depends(require_admin), db: Session = Depends(get_db)):
    pmts = db.query(Payment).order_by(Payment.created_at.desc()).limit(100).all()
    return [{
        "id": p.id, "booking_id": p.booking_id, "provider": p.provider,
        "amount": p.amount, "currency": p.currency, "status": p.status,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    } for p in pmts]

@router.get("/escrow")
def all_escrows(current_user = Depends(require_admin), db: Session = Depends(get_db)):
    escrows = db.query(Escrow).limit(100).all()
    return [{
        "id": e.id, "teacher_id": e.teacher_id, "total_amount": e.total_amount,
        "m1_status": e.m1_status, "m2_status": e.m2_status, "m3_status": e.m3_status,
    } for e in escrows]

# ── Users management ───────────────────────────────────────────────────────────
@router.get("/users")
def list_users(current_user = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).limit(200).all()
    return [{
        "id": u.id, "email": u.email, "role": u.role,
        "full_name": u.full_name, "is_active": u.is_active,
        "created_at": u.created_at.isoformat() if u.created_at else None,
    } for u in users]

@router.put("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: str, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_active = not user.is_active
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="user", entity_id=user.id,
                    action="user_active_toggled",
                    event_metadata=str({"is_active": user.is_active})))
    db.commit()
    return {"success": True, "is_active": user.is_active}
