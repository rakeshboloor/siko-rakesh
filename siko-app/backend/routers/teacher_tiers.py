"""
SIKO Teacher Tier Engine Router
Configurable tier architecture, thresholds, student pricing rules, and commission modifiers.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
from models import TeacherTier, User, AuditLog
from auth import require_admin
from services.commission_service import commission_engine

router = APIRouter()

class TierUpdateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    min_experience_yrs: float
    min_classes: int
    rating_threshold: float
    base_hourly_inr: float
    base_hourly_usd: float
    commission_modifier: float = 0.0

@router.get("")
def list_teacher_tiers(db: Session = Depends(get_db)):
    tiers = db.query(TeacherTier).filter(TeacherTier.is_active == True).order_by(TeacherTier.level.asc()).all()
    results = []
    for t in tiers:
        calc = commission_engine.calculate_commission(
            format_type="1:1",
            total_price=t.base_hourly_inr,
            tier_level=t.level,
            rating=t.rating_threshold
        )
        results.append({
            "id": t.id,
            "level": t.level,
            "name": t.name,
            "code": t.code,
            "description": t.description,
            "min_experience_yrs": t.min_experience_yrs,
            "min_classes": t.min_classes,
            "rating_threshold": t.rating_threshold,
            "student_boost_pct": t.student_boost_pct,
            "base_hourly_inr": t.base_hourly_inr,
            "base_hourly_usd": t.base_hourly_usd,
            "badge_label": t.badge_label,
            "badge_color": t.badge_color,
            "platform_commission_rate": calc["platform_rate"],
            "teacher_share_rate": calc["teacher_allocation_rate"],
        })
    return results

@router.get("/calculate")
def calculate_tier_price(
    tier_level: int = 3,
    sessions: int = 12,
    currency: str = "INR",
    db: Session = Depends(get_db)
):
    tier = db.query(TeacherTier).filter(TeacherTier.level == tier_level).first()
    rate = tier.base_hourly_inr if tier else (1200.0 * tier_level * 0.7)
    total_price = rate * sessions

    calc = commission_engine.calculate_commission(
        format_type="1:1",
        total_price=total_price,
        tier_level=tier_level
    )

    return {
        "tier_level": tier_level,
        "tier_name": tier.name if tier else f"Tier {tier_level}",
        "sessions": sessions,
        "rate_per_session": rate,
        "total_student_price": total_price,
        "currency": currency,
        "breakdown": calc
    }
