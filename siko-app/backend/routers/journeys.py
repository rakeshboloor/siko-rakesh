"""
routers/journeys.py

Endpoints:
  GET  /api/journeys           — list my journeys (student gets own, teacher gets assigned)
  GET  /api/journeys/{id}      — journey detail
  POST /api/journeys           — create journey (admin or system)
  PUT  /api/journeys/{id}      — update journey
  GET  /api/journeys/{id}/progress — progress breakdown by chapter/concept
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user, require_admin
from database import get_db
from models import AuditLog, Chapter, Concept, LearningJourney, Student, Teacher, User

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class JourneyOut(BaseModel):
    id: str
    student_id: str
    teacher_id: Optional[str]
    subject_id: Optional[str]
    status: str
    total_concepts: Optional[int]
    completed_concepts: Optional[int]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class JourneyCreateIn(BaseModel):
    student_id: str
    teacher_id: Optional[str] = None
    subject_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class JourneyUpdateIn(BaseModel):
    teacher_id: Optional[str] = None
    subject_id: Optional[str] = None
    status: Optional[str] = None
    total_concepts: Optional[int] = None
    completed_concepts: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None


class ConceptProgressOut(BaseModel):
    concept_id: str
    concept_name: str
    is_completed: bool
    completed_at: Optional[datetime]


class ChapterProgressOut(BaseModel):
    chapter_id: str
    chapter_name: str
    total_concepts: int
    completed_concepts: int
    progress_pct: float
    concepts: List[ConceptProgressOut]


class JourneyProgressOut(BaseModel):
    journey_id: str
    overall_total: int
    overall_completed: int
    overall_pct: float
    chapters: List[ChapterProgressOut]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get_journey_or_404(journey_id: str, db: Session) -> LearningJourney:
    j = db.query(LearningJourney).filter(LearningJourney.id == journey_id).first()
    if not j:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Learning journey not found"
        )
    return j


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


def _check_journey_access(journey: LearningJourney, current_user: User, db: Session) -> None:
    """Raise 403 if the current user has no access to this journey."""
    if current_user.role == "admin":
        return
    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student and journey.student_id == student.id:
            return
    if current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if teacher and journey.teacher_id == teacher.id:
            return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have access to this journey",
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("", response_model=List[JourneyOut])
def list_journeys(
    status_filter: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[JourneyOut]:
    """
    Return learning journeys visible to the current user.
    - Students see their own journeys.
    - Teachers see journeys they are assigned to.
    - Admins see all journeys.
    """
    q = db.query(LearningJourney)

    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            return []
        q = q.filter(LearningJourney.student_id == student.id)
    elif current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if not teacher:
            return []
        q = q.filter(LearningJourney.teacher_id == teacher.id)
    # admins: no filter

    if status_filter:
        q = q.filter(LearningJourney.status == status_filter)

    return (
        q.order_by(LearningJourney.created_at.desc()).offset(offset).limit(limit).all()
    )


@router.get("/{id}/progress", response_model=JourneyProgressOut)
def get_journey_progress(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> JourneyProgressOut:
    """
    Return progress breakdown by chapter and concept for the given journey.
    Progress data is read from the journey's metadata or a dedicated progress table.
    """
    journey = _get_journey_or_404(id, db)
    _check_journey_access(journey, current_user, db)

    # If no subject linked, return empty
    if not journey.subject_id:
        return JourneyProgressOut(
            journey_id=id,
            overall_total=0,
            overall_completed=0,
            overall_pct=0.0,
            chapters=[],
        )

    # Load chapters and concepts for the subject
    chapters = (
        db.query(Chapter)
        .filter(Chapter.subject_id == journey.subject_id)
        .order_by(Chapter.order)
        .all()
    )

    # The journey's metadata may contain a "concept_progress" dict
    # keyed by concept_id → {"is_completed": bool, "completed_at": ISO}
    concept_progress_map: Dict[str, Any] = {}
    if journey.metadata and isinstance(journey.metadata, dict):
        concept_progress_map = journey.metadata.get("concept_progress", {})

    chapter_outs: List[ChapterProgressOut] = []
    overall_total = 0
    overall_completed = 0

    for chapter in chapters:
        concepts = (
            db.query(Concept)
            .filter(Concept.chapter_id == chapter.id)
            .order_by(Concept.order)
            .all()
        )
        concept_outs: List[ConceptProgressOut] = []
        ch_total = len(concepts)
        ch_completed = 0
        for concept in concepts:
            progress_entry = concept_progress_map.get(concept.id, {})
            is_completed = bool(progress_entry.get("is_completed", False))
            completed_at_str = progress_entry.get("completed_at")
            completed_at = (
                datetime.fromisoformat(completed_at_str) if completed_at_str else None
            )
            if is_completed:
                ch_completed += 1
            concept_outs.append(
                ConceptProgressOut(
                    concept_id=concept.id,
                    concept_name=concept.name,
                    is_completed=is_completed,
                    completed_at=completed_at,
                )
            )

        ch_pct = round((ch_completed / ch_total * 100), 1) if ch_total > 0 else 0.0
        chapter_outs.append(
            ChapterProgressOut(
                chapter_id=chapter.id,
                chapter_name=chapter.name,
                total_concepts=ch_total,
                completed_concepts=ch_completed,
                progress_pct=ch_pct,
                concepts=concept_outs,
            )
        )
        overall_total += ch_total
        overall_completed += ch_completed

    overall_pct = round((overall_completed / overall_total * 100), 1) if overall_total > 0 else 0.0

    return JourneyProgressOut(
        journey_id=id,
        overall_total=overall_total,
        overall_completed=overall_completed,
        overall_pct=overall_pct,
        chapters=chapter_outs,
    )


@router.get("/{id}", response_model=JourneyOut)
def get_journey(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> JourneyOut:
    """Return a single journey detail."""
    journey = _get_journey_or_404(id, db)
    _check_journey_access(journey, current_user, db)
    return journey


@router.post("", response_model=JourneyOut, status_code=status.HTTP_201_CREATED)
def create_journey(
    payload: JourneyCreateIn,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> JourneyOut:
    """
    Create a new learning journey.
    Admin-only. The system may also invoke this programmatically.
    """
    # Validate student exists
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    journey = LearningJourney(
        student_id=payload.student_id,
        teacher_id=payload.teacher_id,
        subject_id=payload.subject_id,
        status="active",
        total_concepts=0,
        completed_concepts=0,
        event_metadata=payload.metadata or {},
    )
    db.add(journey)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="journey.created",
        entity_type="LearningJourney",
        entity_id=journey.id,
        details={
            "student_id": payload.student_id,
            "teacher_id": payload.teacher_id,
            "subject_id": payload.subject_id,
        },
    )

    db.commit()
    db.refresh(journey)
    return journey


@router.put("/{id}", response_model=JourneyOut)
def update_journey(
    id: str,
    payload: JourneyUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> JourneyOut:
    """
    Update a learning journey.
    Admins can update any field. Teachers can update status and metadata for their own journeys.
    """
    journey = _get_journey_or_404(id, db)

    # Access control
    if current_user.role == "admin":
        pass  # full access
    elif current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if not teacher or journey.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not assigned to this journey",
            )
        # Teachers can only update status and metadata
        restricted_payload = JourneyUpdateIn(
            status=payload.status,
            event_metadata=payload.metadata,
        )
        payload = restricted_payload
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can update journeys",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(journey, field, value)
    journey.updated_at = datetime.now(timezone.utc)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="journey.updated",
        entity_type="LearningJourney",
        entity_id=id,
        details={"fields": list(update_data.keys())},
    )

    db.commit()
    db.refresh(journey)
    return journey
