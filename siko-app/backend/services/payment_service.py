"""
SIKO Payment Service — Provider Abstraction Layer
Razorpay-ready architecture. Switch provider via PAYMENT_PROVIDER env var.
Production credentials supplied via environment variables only.
"""

import os
import uuid
import hashlib
import hmac
import json
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Dict, Any


# ── Environment ───────────────────────────────────────────────────────────────
PAYMENT_PROVIDER    = os.getenv("PAYMENT_PROVIDER", "mock")   # "razorpay" | "mock"
RAZORPAY_KEY_ID     = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")


# ── Abstract Provider Interface ───────────────────────────────────────────────
class PaymentProvider(ABC):
    @abstractmethod
    def create_order(self, amount_paise: int, currency: str, receipt: str, notes: dict) -> Dict[str, Any]:
        """Create a payment order. Returns provider-specific order dict."""

    @abstractmethod
    def verify_payment(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Verify payment authenticity. Returns True if valid."""

    @abstractmethod
    def create_refund(self, payment_id: str, amount_paise: int, notes: dict) -> Dict[str, Any]:
        """Initiate a refund. Returns refund record."""

    @abstractmethod
    def get_payment(self, payment_id: str) -> Dict[str, Any]:
        """Fetch payment details from provider."""


# ── Mock Provider (Development / Demo) ────────────────────────────────────────
class MockPaymentProvider(PaymentProvider):
    """Used in demo/development mode. Simulates all payment flows."""

    def create_order(self, amount_paise: int, currency: str, receipt: str, notes: dict) -> Dict[str, Any]:
        order_id = "mock_order_" + uuid.uuid4().hex[:12]
        return {
            "id": order_id,
            "entity": "order",
            "amount": amount_paise,
            "amount_paid": 0,
            "amount_due": amount_paise,
            "currency": currency,
            "receipt": receipt,
            "status": "created",
            "notes": notes,
            "created_at": int(datetime.utcnow().timestamp()),
            "_provider": "mock",
        }

    def verify_payment(self, order_id: str, payment_id: str, signature: str) -> bool:
        # In mock mode, accept any payment with "mock_" prefix
        return payment_id.startswith("mock_") or order_id.startswith("mock_")

    def create_refund(self, payment_id: str, amount_paise: int, notes: dict) -> Dict[str, Any]:
        return {
            "id": "mock_refund_" + uuid.uuid4().hex[:12],
            "entity": "refund",
            "amount": amount_paise,
            "currency": "INR",
            "payment_id": payment_id,
            "notes": notes,
            "status": "processed",
            "created_at": int(datetime.utcnow().timestamp()),
            "_provider": "mock",
        }

    def get_payment(self, payment_id: str) -> Dict[str, Any]:
        return {
            "id": payment_id,
            "entity": "payment",
            "amount": 0,
            "currency": "INR",
            "status": "captured",
            "_provider": "mock",
        }


# ── Razorpay Provider (Production) ────────────────────────────────────────────
class RazorpayProvider(PaymentProvider):
    """Production Razorpay integration. Requires live credentials in environment."""

    def __init__(self):
        if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
            raise RuntimeError(
                "Razorpay credentials not configured. "
                "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
            )
        try:
            import razorpay  # optional dependency
            self.client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        except ImportError:
            raise RuntimeError(
                "razorpay package not installed. Run: pip install razorpay"
            )

    def create_order(self, amount_paise: int, currency: str, receipt: str, notes: dict) -> Dict[str, Any]:
        return self.client.order.create({
            "amount": amount_paise,
            "currency": currency,
            "receipt": receipt,
            "notes": notes,
            "payment_capture": 1,
        })

    def verify_payment(self, order_id: str, payment_id: str, signature: str) -> bool:
        if not RAZORPAY_KEY_SECRET:
            return False
        expected = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    def create_refund(self, payment_id: str, amount_paise: int, notes: dict) -> Dict[str, Any]:
        return self.client.payment.refund(payment_id, {
            "amount": amount_paise,
            "notes": notes,
        })

    def get_payment(self, payment_id: str) -> Dict[str, Any]:
        return self.client.payment.fetch(payment_id)


# ── Provider factory ──────────────────────────────────────────────────────────
def get_payment_provider() -> PaymentProvider:
    if PAYMENT_PROVIDER == "razorpay":
        return RazorpayProvider()
    return MockPaymentProvider()


# ── Webhook signature verification ────────────────────────────────────────────
def verify_razorpay_webhook(body: bytes, signature: str) -> bool:
    """Verify Razorpay webhook authenticity."""
    if not RAZORPAY_WEBHOOK_SECRET:
        return False
    expected = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


# ── Amount helpers ────────────────────────────────────────────────────────────
def to_paise(amount_inr: float) -> int:
    """Convert INR float to paise integer."""
    return int(round(amount_inr * 100))


def from_paise(amount_paise: int) -> float:
    """Convert paise integer to INR float."""
    return round(amount_paise / 100, 2)


# ── Idempotency key ───────────────────────────────────────────────────────────
def generate_idempotency_key(booking_id: str, attempt: int = 1) -> str:
    return hashlib.sha256(f"{booking_id}:attempt:{attempt}".encode()).hexdigest()[:32]
