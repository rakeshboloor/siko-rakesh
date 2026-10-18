"""
routers/teachers.py

Endpoints:
  GET  /api/teachers                              — list approved/active teachers (public)
  GET  /api/teachers/{id}                         — get teacher profile (public)
  GET  /api/teachers/me                           — my teacher profile
  PUT  /api/teachers/me                           — update my teacher profile
  GET  /api/teachers/me/dashboard                 — teacher dashboard
  GET  /api/teachers/me/offer                     — get current pending offer
  POST /api/teachers/me/offer/{offer_id}/accept   — accept offer
  POST /api/teachers/me/offer/{offer_id}/decline  — decline offer
  GET  /api/teachers/me/atc                       — get my ATC
  GET  /api/teachers/me/agreement                 — get current faculty agreement
  POST /api/teachers/me/agreement/accept          — accept faculty agreement
  GET  /api/teachers/me/students                  — list my students
  GET  /api/teachers/me/journeys                  — list my learning journeys
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user, require_teacher, require_teacher_or_admin
from database import get_db
from models import (
    ATC,
    AgreementAcceptance,
    AuditLog,
    Class,
    FacultyAgreement,
    LearningJourney,
    Notification,
    Student,
    Teacher,
    TeacherOffer,
    TeacherOfferAcceptance,
    User,
    Worksheet,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class TeacherOut(BaseModel):
    id: str
    user_id: str
    full_name: Optional[str]
    bio: Optional[str]
    specializations: Optional[List[str]]
    subjects: Optional[List[str]]
    experience_years: Optional[int]
    rating: Optional[float]
    status: str
    avatar_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TeacherUpdateIn(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    specializations: Optional[List[str]] = None
    subjects: Optional[List[str]] = None
    experience_years: Optional[int] = None
    avatar_url: Optional[str] = None


class TeacherOfferOut(BaseModel):
    id: str
    teacher_id: str
    offered_at: datetime
    expires_at: Optional[datetime]
    status: str
    details: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True


class TeacherOfferAcceptanceOut(BaseModel):
    id: str
    offer_id: str
    teacher_id: str
    accepted_at: datetime

    class Config:
        from_attributes = True


class ATCOut(BaseModel):
    id: str
    teacher_id: str
    content: Optional[str]
    issued_at: Optional[datetime]

    class Config:
        from_attributes = True


class FacultyAgreementOut(BaseModel):
    id: str
    version: str
    content: Optional[str]
    effective_from: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True


class AgreementAcceptIn(BaseModel):
    legal_name: str
    confirmed_checkbox_ids: List[str]


class AgreementAcceptanceOut(BaseModel):
    id: str
    teacher_id: str
    agreement_id: str
    legal_name: str
    accepted_at: datetime

    class Config:
        from_attributes = True


class NextClassOut(BaseModel):
    id: str
    scheduled_at: datetime
    student_name: Optional[str]
    subject_name: Optional[str]
    status: str


class WalletSummaryOut(BaseModel):
    balance: float
    pending_earnings: float
    total_earned: float


class DashboardOut(BaseModel):
    next_class: Optional[NextClassOut]
    pending_worksheets: int
    pending_submissions: int
    ai_review_queue: int
    wallet: WalletSummaryOut
    unread_notifications: int


class StudentSummaryOut(BaseModel):
    id: str
    full_name: Optional[str]
    grade_id: Optional[str]
    board_id: Optional[str]

    class Config:
        from_attributes = True


class JourneyOut(BaseModel):
    id: str
    student_id: str
    teacher_id: Optional[str]
    subject_id: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get_teacher_by_user_or_404(user_id: str, db: Session) -> Teacher:
    teacher = db.query(Teacher).filter(Teacher.user_id == user_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Teacher profile not found"
        )
    return teacher


def _get_teacher_or_404(teacher_id: str, db: Session) -> Teacher:
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found"
        )
    return teacher


def _create_audit(
    db: Session,
    *,
    actor_id: str,
    action: str,
    entity_type: str,
    entity_id: str,
    details: Optional[Dict] = None,
) -> None:
    log = AuditLog(
        user_id=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details or {},
    )
    db.add(log)


def _send_notification(
    db: Session,
    *,
    user_id: str,
    title: str,
    body: str,
    notification_type: str = "system",
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
) -> None:
    notif = Notification(
        user_id=user_id,
        title=title,
        body=body,
        notification_type=notification_type,
        is_read=False,
        entity_type=entity_type,
        entity_id=entity_id,
    )
    db.add(notif)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("")
def list_teachers(
    subject: Optional[str] = Query(None, description="Filter by subject name"),
    specialization: Optional[str] = Query(None, description="Filter by specialization"),
    tier: Optional[str] = Query(None, description="Filter by tier"),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    limit: int = Query(20, le=100),
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Public endpoint: list all approved/active teachers.
    Returns rich teacher marketplace profiles.
    """
    import json
    q = db.query(Teacher).filter(Teacher.is_active == True, Teacher.rating > 0)
    if min_rating is not None:
        q = q.filter(Teacher.rating >= min_rating)
    if tier:
        q = q.filter(Teacher.tier.ilike(f"%{tier}%"))

    teachers = q.order_by(Teacher.rating.desc()).offset(offset).limit(limit).all()
    results = []
    for t in teachers:
        u = t.user
        expertise = {}
        if t.expertise:
            try:
                expertise = json.loads(t.expertise) if isinstance(t.expertise, str) else t.expertise
            except Exception:
                expertise = {}

        subs = expertise.get("subjects", [])
        boards = expertise.get("boards", [])
        exams = expertise.get("exams", [])

        if subject and not any(subject.lower() in s.lower() for s in subs):
            continue

        results.append({
            "id": t.id,
            "user_id": t.user_id,
            "full_name": u.full_name if u else "SIKO Faculty",
            "email": u.email if u else None,
            "avatar_url": u.avatar_url if u else None,
            "bio": t.bio,
            "tier": t.tier,
            "rating": t.rating,
            "total_classes": t.total_classes,
            "subjects": subs,
            "boards": boards,
            "exams": exams,
            "specialties": expertise.get("specialties", []),
            "hourly_rate": 3200 if t.tier in ["platinum", "master"] else (2400 if t.tier in ["gold", "lead"] else (1800 if t.tier == "senior" else 1200)),
            "is_active": t.is_active,
            "status": t.application_status or "approved",
            "created_at": t.created_at.isoformat() if t.created_at else None,
        })
    return results


@router.get("/me", response_model=TeacherOut)
def get_my_teacher_profile(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> TeacherOut:
    """Return the authenticated teacher's full profile."""
    return _get_teacher_by_user_or_404(current_user.id, db)


@router.put("/me", response_model=TeacherOut)
def update_my_teacher_profile(
    payload: TeacherUpdateIn,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> TeacherOut:
    """Update the authenticated teacher's profile."""
    teacher = _get_teacher_by_user_or_404(current_user.id, db)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(teacher, field, value)
    teacher.updated_at = datetime.now(timezone.utc)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="teacher.profile.updated",
        entity_type="Teacher",
        entity_id=teacher.id,
        details={"fields": list(update_data.keys())},
    )

    db.commit()
    db.refresh(teacher)
    return teacher


@router.get("/me/dashboard", response_model=DashboardOut)
def get_teacher_dashboard(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> DashboardOut:
    """
    Return aggregated dashboard data for the teacher:
    - Next upcoming class
    - Pending worksheet reviews
    - Pending submission reviews
    - AI content review queue size
    - Wallet summary
    - Unread notification count
    """
    teacher = _get_teacher_by_user_or_404(current_user.id, db)
    now = datetime.now(timezone.utc)

    # Next class
    next_class_obj = (
        db.query(Class)
        .filter(
            Class.teacher_id == teacher.id,
            Class.status == "scheduled",
            Class.scheduled_at >= now,
        )
        .order_by(Class.scheduled_at.asc())
        .first()
    )
    next_class_out: Optional[NextClassOut] = None
    if next_class_obj:
        student_name = None
        if hasattr(next_class_obj, "student") and next_class_obj.student:
            student_name = next_class_obj.student.full_name
        next_class_out = NextClassOut(
            id=next_class_obj.id,
            scheduled_at=next_class_obj.scheduled_at,
            student_name=student_name,
            subject_name=getattr(getattr(next_class_obj, "subject", None), "name", None),
            status=next_class_obj.status,
        )

    # Pending worksheets (ai_generated, waiting for teacher approval)
    pending_worksheets = (
        db.query(Worksheet)
        .filter(
            Worksheet.teacher_id == teacher.id,
            Worksheet.status == "ai_generated",
        )
        .count()
    )

    # AI review queue (worksheets + assessments pending review)
    ai_review_queue = pending_worksheets  # extend with assessment count if model supports it

    # Pending submissions
    from models import Submission

    pending_submissions = (
        db.query(Submission)
        .filter(
            Submission.teacher_id == teacher.id,
            Submission.status == "submitted",
        )
        .count()
    )

    # Wallet summary
    from models import WalletTransaction

    wallet_txns = (
        db.query(WalletTransaction)
        .filter(WalletTransaction.teacher_id == teacher.id)
        .all()
    )
    balance = sum(
        t.amount for t in wallet_txns if getattr(t, "txn_type", None) == "credit"
    ) - sum(t.amount for t in wallet_txns if getattr(t, "txn_type", None) == "debit")
    pending_earnings = sum(
        t.amount for t in wallet_txns if getattr(t, "status", None) == "pending"
    )
    total_earned = sum(
        t.amount for t in wallet_txns if getattr(t, "txn_type", None) == "credit"
    )

    # Unread notifications
    unread_notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        )
        .count()
    )

    return DashboardOut(
        next_class=next_class_out,
        pending_worksheets=pending_worksheets,
        pending_submissions=pending_submissions,
        ai_review_queue=ai_review_queue,
        wallet=WalletSummaryOut(
            balance=balance,
            pending_earnings=pending_earnings,
            total_earned=total_earned,
        ),
        unread_notifications=unread_notifications,
    )


@router.get("/me/offer", response_model=Optional[TeacherOfferOut])
def get_current_pending_offer(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> Optional[TeacherOfferOut]:
    """Return the teacher's current pending offer, if any."""
    teacher = _get_teacher_by_user_or_404(current_user.id, db)
    offer = (
        db.query(TeacherOffer)
        .filter(
            TeacherOffer.teacher_id == teacher.id,
            TeacherOffer.status == "pending",
        )
        .order_by(TeacherOffer.offered_at.desc())
        .first()
    )
    return offer


@router.post("/me/offer/{offer_id}/accept", response_model=TeacherOfferAcceptanceOut)
def accept_offer(
    offer_id: str,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> TeacherOfferAcceptanceOut:
    """
    Accept a pending teacher offer.
    Creates a TeacherOfferAcceptance record, updates offer status to 'accepted',
    and logs an audit entry.
    """
    teacher = _get_teacher_by_user_or_404(current_user.id, db)

    offer = (
        db.query(TeacherOffer)
        .filter(TeacherOffer.id == offer_id, TeacherOffer.teacher_id == teacher.id)
        .first()
    )
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")
    if offer.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Offer is already '{offer.status}' and cannot be accepted",
        )
    if offer.expires_at and offer.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Offer has expired"
        )

    now = datetime.now(timezone.utc)
    acceptance = TeacherOfferAcceptance(
        offer_id=offer.id,
        teacher_id=teacher.id,
        accepted_at=now,
    )
    db.add(acceptance)
    offer.status = "accepted"

    _create_audit(
        db,
        actor_id=current_user.id,
        action="teacher.offer.accepted",
        entity_type="TeacherOffer",
        entity_id=offer.id,
        details={"teacher_id": teacher.id},
    )

    db.commit()
    db.refresh(acceptance)
    return acceptance


@router.post("/me/offer/{offer_id}/decline", status_code=status.HTTP_200_OK)
def decline_offer(
    offer_id: str,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> Dict[str, str]:
    """Decline a pending teacher offer."""
    teacher = _get_teacher_by_user_or_404(current_user.id, db)

    offer = (
        db.query(TeacherOffer)
        .filter(TeacherOffer.id == offer_id, TeacherOffer.teacher_id == teacher.id)
        .first()
    )
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")
    if offer.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Offer is already '{offer.status}'",
        )

    offer.status = "declined"

    _create_audit(
        db,
        actor_id=current_user.id,
        action="teacher.offer.declined",
        entity_type="TeacherOffer",
        entity_id=offer.id,
        details={"teacher_id": teacher.id},
    )

    db.commit()
    return {"message": "Offer declined successfully", "offer_id": offer_id}


@router.get("/me/atc", response_model=ATCOut)
def get_my_atc(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> ATCOut:
    """
    Return the teacher's ATC document.
    Only available after a teacher offer has been accepted.
    """
    teacher = _get_teacher_by_user_or_404(current_user.id, db)

    # Verify offer acceptance exists
    acceptance = (
        db.query(TeacherOfferAcceptance)
        .filter(TeacherOfferAcceptance.teacher_id == teacher.id)
        .first()
    )
    if not acceptance:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ATC is only available after accepting a teacher offer",
        )

    atc = db.query(ATC).filter(ATC.teacher_id == teacher.id).first()
    if not atc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ATC not found for this teacher"
        )
    return atc


@router.get("/me/agreement", response_model=FacultyAgreementOut)
def get_my_agreement(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> FacultyAgreementOut:
    """
    Return the current active faculty agreement.
    Only available after a teacher offer has been accepted.
    """
    teacher = _get_teacher_by_user_or_404(current_user.id, db)

    # Verify offer acceptance
    acceptance = (
        db.query(TeacherOfferAcceptance)
        .filter(TeacherOfferAcceptance.teacher_id == teacher.id)
        .first()
    )
    if not acceptance:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Faculty agreement is only available after accepting a teacher offer",
        )

    agreement = (
        db.query(FacultyAgreement)
        .filter(FacultyAgreement.is_active == True)
        .order_by(FacultyAgreement.effective_from.desc())
        .first()
    )
    if not agreement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No active faculty agreement found"
        )
    return agreement


@router.post("/me/agreement/accept", response_model=AgreementAcceptanceOut)
def accept_agreement(
    payload: AgreementAcceptIn,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> AgreementAcceptanceOut:
    """
    Accept the faculty agreement.
    Prerequisites:
      - A TeacherOfferAcceptance must exist for the teacher.
      - An ATC must exist for the teacher.
      - legal_name must be provided.
      - All required checkbox IDs must be confirmed.
    Creates an AgreementAcceptance, updates teacher status to 'active', and logs audit.
    """
    teacher = _get_teacher_by_user_or_404(current_user.id, db)

    # Check offer acceptance
    offer_acceptance = (
        db.query(TeacherOfferAcceptance)
        .filter(TeacherOfferAcceptance.teacher_id == teacher.id)
        .first()
    )
    if not offer_acceptance:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must accept a teacher offer before accepting the faculty agreement",
        )

    # Check ATC
    atc = db.query(ATC).filter(ATC.teacher_id == teacher.id).first()
    if not atc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ATC must be issued before accepting the faculty agreement",
        )

    # Validate legal name
    if not payload.legal_name or not payload.legal_name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="legal_name is required and cannot be empty",
        )

    # Validate checkboxes
    if not payload.confirmed_checkbox_ids:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="All required checkboxes must be confirmed",
        )

    # Get the active agreement
    agreement = (
        db.query(FacultyAgreement)
        .filter(FacultyAgreement.is_active == True)
        .order_by(FacultyAgreement.effective_from.desc())
        .first()
    )
    if not agreement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No active faculty agreement found"
        )

    # Check if already accepted this version
    existing = (
        db.query(AgreementAcceptance)
        .filter(
            AgreementAcceptance.teacher_id == teacher.id,
            AgreementAcceptance.agreement_id == agreement.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already accepted this faculty agreement",
        )

    now = datetime.now(timezone.utc)
    acceptance = AgreementAcceptance(
        teacher_id=teacher.id,
        agreement_id=agreement.id,
        legal_name=payload.legal_name.strip(),
        confirmed_checkbox_ids=payload.confirmed_checkbox_ids,
        accepted_at=now,
    )
    db.add(acceptance)

    # Update teacher status to active
    teacher.application_status = "active"
    teacher.is_active = True
    teacher.updated_at = now

    _create_audit(
        db,
        actor_id=current_user.id,
        action="teacher.agreement.accepted",
        entity_type="FacultyAgreement",
        entity_id=agreement.id,
        details={
            "teacher_id": teacher.id,
            "agreement_version": agreement.version,
            "legal_name": payload.legal_name.strip(),
            "confirmed_checkbox_ids": payload.confirmed_checkbox_ids,
        },
    )

    _send_notification(
        db,
        user_id=current_user.id,
        title="Welcome to the SIKO Faculty!",
        body="Your faculty agreement has been accepted. You are now an active teacher on SIKO.",
        notification_type="agreement",
        entity_type="FacultyAgreement",
        entity_id=agreement.id,
    )

    db.commit()
    db.refresh(acceptance)
    return acceptance


@router.get("/me/students", response_model=List[StudentSummaryOut])
def get_my_students(
    limit: int = Query(50, le=200),
    offset: int = 0,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> List[StudentSummaryOut]:
    """Return all students assigned to the authenticated teacher."""
    teacher = _get_teacher_by_user_or_404(current_user.id, db)

    # Students are identified via LearningJourneys linking teacher -> student
    journeys = (
        db.query(LearningJourney)
        .filter(LearningJourney.teacher_id == teacher.id)
        .offset(offset)
        .limit(limit)
        .all()
    )
    student_ids = list({j.student_id for j in journeys if j.student_id})
    students = db.query(Student).filter(Student.id.in_(student_ids)).all()
    return students


@router.get("/me/journeys", response_model=List[JourneyOut])
def get_my_journeys(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(50, le=200),
    offset: int = 0,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> List[JourneyOut]:
    """Return all learning journeys assigned to the authenticated teacher."""
    teacher = _get_teacher_by_user_or_404(current_user.id, db)
    q = db.query(LearningJourney).filter(LearningJourney.teacher_id == teacher.id)
    if status_filter:
        q = q.filter(LearningJourney.status == status_filter)
    journeys = q.order_by(LearningJourney.created_at.desc()).offset(offset).limit(limit).all()
    return journeys


@router.get("/{id}", response_model=TeacherOut)
def get_teacher_profile(
    id: str,
    db: Session = Depends(get_db),
) -> TeacherOut:
    """
    Public endpoint: return a single teacher's profile by teacher ID.
    Only returns active teachers.
    """
    teacher = (
        db.query(Teacher)
        .filter(Teacher.id == id, Teacher.is_active == True)
        .first()
    )
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")
    return teacher
