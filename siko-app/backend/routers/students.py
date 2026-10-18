"""
routers/students.py

Endpoints:
  GET  /api/students/me              — get my student profile
  PUT  /api/students/me              — update student profile
  POST /api/students/me/onboarding   — complete onboarding
  GET  /api/students/me/dashboard    — student dashboard
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user, require_student
from database import get_db
from models import (
    AuditLog,
    Booking,
    Class,
    LearningJourney,
    Notification,
    Student,
    Submission,
    User,
    Worksheet,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class StudentProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: Optional[str]
    grade_id: Optional[str]
    board_id: Optional[str]
    program_id: Optional[str]
    subject_ids: Optional[List[str]]
    learning_dna: Optional[Dict[str, Any]]
    onboarding_complete: bool
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class StudentUpdateIn(BaseModel):
    full_name: Optional[str] = None
    grade_id: Optional[str] = None
    board_id: Optional[str] = None
    program_id: Optional[str] = None
    subject_ids: Optional[List[str]] = None
    learning_dna: Optional[Dict[str, Any]] = None
    avatar_url: Optional[str] = None


class OnboardingIn(BaseModel):
    grade_id: str
    board_id: str
    program_id: str
    subject_ids: List[str]
    learning_dna: Optional[Dict[str, Any]] = None


class NextClassOut(BaseModel):
    id: str
    scheduled_at: datetime
    subject_name: Optional[str]
    teacher_name: Optional[str]
    status: str


class JourneyProgressOut(BaseModel):
    journey_id: str
    subject_name: Optional[str]
    total_concepts: int
    completed_concepts: int
    progress_pct: float


class DashboardOut(BaseModel):
    next_class: Optional[NextClassOut]
    journey_progress: List[JourneyProgressOut]
    pending_worksheets: int
    pending_submissions: int
    unread_notifications: int


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get_student_or_404(user_id: str, db: Session) -> Student:
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found"
        )
    return student


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


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("/me", response_model=StudentProfileOut)
def get_my_student_profile(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
) -> StudentProfileOut:
    """Return the authenticated student's profile."""
    return _get_student_or_404(current_user.id, db)


@router.put("/me", response_model=StudentProfileOut)
def update_my_student_profile(
    payload: StudentUpdateIn,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
) -> StudentProfileOut:
    """Update the authenticated student's profile fields."""
    student = _get_student_or_404(current_user.id, db)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    student.updated_at = datetime.now(timezone.utc)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="student.profile.updated",
        entity_type="Student",
        entity_id=student.id,
        details={"fields": list(update_data.keys())},
    )

    db.commit()
    db.refresh(student)
    return student


@router.post("/me/onboarding", response_model=StudentProfileOut)
def complete_onboarding(
    payload: OnboardingIn,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
) -> StudentProfileOut:
    """
    Complete the student onboarding flow.
    Sets grade/board/program/subjects/learning_dna and flips onboarding_complete=True.
    """
    student = _get_student_or_404(current_user.id, db)

    if student.onboarding_complete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Onboarding already completed",
        )

    student.grade_id = payload.grade_id
    student.board_id = payload.board_id
    student.program_id = payload.program_id
    student.subject_ids = payload.subject_ids
    if payload.learning_dna:
        student.learning_dna = payload.learning_dna
    student.onboarding_complete = True
    student.updated_at = datetime.now(timezone.utc)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="student.onboarding.completed",
        entity_type="Student",
        entity_id=student.id,
        details={
            "grade_id": payload.grade_id,
            "board_id": payload.board_id,
            "program_id": payload.program_id,
            "subject_count": len(payload.subject_ids),
        },
    )

    # Send a welcome notification
    notif = Notification(
        user_id=current_user.id,
        title="Welcome to SIKO!",
        body="Your profile is set up. Let's start learning!",
        notification_type="system",
        is_read=False,
    )
    db.add(notif)

    db.commit()
    db.refresh(student)
    return student


@router.get("/me/dashboard", response_model=DashboardOut)
def get_student_dashboard(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
) -> DashboardOut:
    """
    Return aggregated dashboard data for the student:
    - Next upcoming class
    - Learning journey progress per journey
    - Count of pending (unreleased) worksheets
    - Count of pending submission reviews
    - Count of unread notifications
    """
    student = _get_student_or_404(current_user.id, db)
    now = datetime.now(timezone.utc)

    # ---- Next class ----
    next_class_obj = (
        db.query(Class)
        .filter(
            Class.student_id == student.id,
            Class.status == "scheduled",
            Class.scheduled_at >= now,
        )
        .order_by(Class.scheduled_at.asc())
        .first()
    )
    next_class_out: Optional[NextClassOut] = None
    if next_class_obj:
        next_class_out = NextClassOut(
            id=next_class_obj.id,
            scheduled_at=next_class_obj.scheduled_at,
            subject_name=getattr(next_class_obj.subject, "name", None)
            if hasattr(next_class_obj, "subject")
            else None,
            teacher_name=getattr(
                getattr(next_class_obj, "teacher", None), "full_name", None
            ),
            status=next_class_obj.status,
        )

    # ---- Journey progress ----
    journeys = (
        db.query(LearningJourney)
        .filter(LearningJourney.student_id == student.id)
        .all()
    )
    journey_progress: List[JourneyProgressOut] = []
    for j in journeys:
        total = j.total_concepts if hasattr(j, "total_concepts") and j.total_concepts else 0
        completed = j.completed_concepts if hasattr(j, "completed_concepts") and j.completed_concepts else 0
        pct = round((completed / total * 100), 1) if total > 0 else 0.0
        journey_progress.append(
            JourneyProgressOut(
                journey_id=j.id,
                subject_name=getattr(getattr(j, "subject", None), "name", None),
                total_concepts=total,
                completed_concepts=completed,
                progress_pct=pct,
            )
        )

    # ---- Pending worksheets (not yet released to student) ----
    pending_worksheets = (
        db.query(Worksheet)
        .filter(
            Worksheet.student_id == student.id,
            Worksheet.status != "released",
        )
        .count()
    )

    # ---- Pending submissions (awaiting teacher review) ----
    pending_submissions = (
        db.query(Submission)
        .filter(
            Submission.student_id == student.id,
            Submission.status == "submitted",
        )
        .count()
    )

    # ---- Unread notifications ----
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
        journey_progress=journey_progress,
        pending_worksheets=pending_worksheets,
        pending_submissions=pending_submissions,
        unread_notifications=unread_notifications,
    )
