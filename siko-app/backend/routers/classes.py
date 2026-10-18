"""
routers/classes.py

Endpoints:
  GET  /api/classes                 — list classes (filtered by role)
  GET  /api/classes/{id}            — class detail
  POST /api/classes                 — create class (teacher/admin)
  PUT  /api/classes/{id}/complete   — complete class, triggers async AI content generation
  PUT  /api/classes/{id}/cancel     — cancel class
  POST /api/classes/{id}/attendance — mark attendance (teacher only)
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user, require_teacher, require_teacher_or_admin
from database import get_db
from models import (
    AuditLog,
    Attendance,
    Class,
    Notification,
    Student,
    Teacher,
    User,
    Worksheet,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class ClassOut(BaseModel):
    id: str
    teacher_id: Optional[str]
    student_id: Optional[str]
    subject_id: Optional[str]
    chapter_id: Optional[str]
    concept_id: Optional[str]
    journey_id: Optional[str]
    scheduled_at: datetime
    duration_minutes: Optional[int]
    status: str
    notes: Optional[str]
    meeting_url: Optional[str]
    completed_at: Optional[datetime]
    cancelled_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class ClassCreateIn(BaseModel):
    student_id: str
    subject_id: Optional[str] = None
    chapter_id: Optional[str] = None
    concept_id: Optional[str] = None
    journey_id: Optional[str] = None
    scheduled_at: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None
    meeting_url: Optional[str] = None


class AttendanceIn(BaseModel):
    student_present: bool
    teacher_present: bool = True
    notes: Optional[str] = None


class AttendanceOut(BaseModel):
    id: str
    class_id: str
    student_id: Optional[str]
    teacher_id: Optional[str]
    student_present: bool
    teacher_present: bool
    notes: Optional[str]
    marked_at: datetime

    class Config:
        from_attributes = True


class CompleteClassOut(BaseModel):
    class_id: str
    status: str
    completed_at: datetime
    worksheet_id: str
    message: str


# ---------------------------------------------------------------------------
# Background task simulation
# ---------------------------------------------------------------------------


def _trigger_ai_content_generation(
    class_id: str,
    worksheet_id: str,
    db_url: str,
) -> None:
    """
    Background task: trigger AI content generation for the worksheet.
    In production this would call an AI service / queue a Celery task.
    Here we log the intent and mark the worksheet as ai_generated.
    """
    # NOTE: In production, replace with an actual AI pipeline call or task queue.
    # This function runs in a background thread; create a new DB session.
    from database import SessionLocal

    try:
        db = SessionLocal()
        worksheet = db.query(Worksheet).filter(Worksheet.id == worksheet_id).first()
        if worksheet and worksheet.status == "pending_generation":
            worksheet.status = "ai_generated"
            worksheet.updated_at = datetime.now(timezone.utc)
            db.commit()
    except Exception:
        pass
    finally:
        try:
            db.close()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get_class_or_404(class_id: str, db: Session) -> Class:
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
        )
    return cls


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


def _check_class_access(cls: Class, current_user: User, db: Session) -> None:
    """Raise 403 if user has no access to the class."""
    if current_user.role == "admin":
        return
    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student and cls.student_id == student.id:
            return
    if current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if teacher and cls.teacher_id == teacher.id:
            return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have access to this class",
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("", response_model=List[ClassOut])
def list_classes(
    status_filter: Optional[str] = Query(None, alias="status"),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[ClassOut]:
    """
    Return classes visible to the current user:
    - Students see their own classes.
    - Teachers see classes they are assigned to.
    - Admins see all classes.
    """
    q = db.query(Class)

    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            return []
        q = q.filter(Class.student_id == student.id)
    elif current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if not teacher:
            return []
        q = q.filter(Class.teacher_id == teacher.id)
    # admins: no additional filter

    if status_filter:
        q = q.filter(Class.status == status_filter)
    if from_date:
        q = q.filter(Class.scheduled_at >= from_date)
    if to_date:
        q = q.filter(Class.scheduled_at <= to_date)

    return q.order_by(Class.scheduled_at.desc()).offset(offset).limit(limit).all()


@router.get("/{id}", response_model=ClassOut)
def get_class(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ClassOut:
    """Return a single class detail."""
    cls = _get_class_or_404(id, db)
    _check_class_access(cls, current_user, db)
    return cls


@router.post("", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
def create_class(
    payload: ClassCreateIn,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
) -> ClassOut:
    """
    Create a new class.
    Teachers may only create classes for themselves.
    Admins may create classes for any teacher.
    """
    teacher_id: Optional[str] = None
    if current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if not teacher:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Teacher profile not found"
            )
        teacher_id = teacher.id
    # admin: teacher_id remains None unless payload extends to include it

    # Validate student exists
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    new_class = Class(
        teacher_id=teacher_id,
        student_id=payload.student_id,
        subject_id=payload.subject_id,
        chapter_id=payload.chapter_id,
        concept_id=payload.concept_id,
        journey_id=payload.journey_id,
        scheduled_at=payload.scheduled_at,
        duration_minutes=payload.duration_minutes,
        status="scheduled",
        notes=payload.notes,
        meeting_url=payload.meeting_url,
    )
    db.add(new_class)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="class.created",
        entity_type="Class",
        entity_id=new_class.id,
        details={
            "student_id": payload.student_id,
            "scheduled_at": payload.scheduled_at.isoformat(),
        },
    )

    # Notify student
    if student.user_id:
        _send_notification(
            db,
            user_id=student.user_id,
            title="New Class Scheduled",
            body=f"A new class has been scheduled for {payload.scheduled_at.strftime('%d %b %Y, %I:%M %p')}.",
            notification_type="class",
            entity_type="Class",
            entity_id=new_class.id,
        )

    db.commit()
    db.refresh(new_class)
    return new_class


@router.put("/{id}/complete", response_model=CompleteClassOut)
def complete_class(
    id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
) -> CompleteClassOut:
    """
    Mark a class as completed.
    - Sets status = 'completed', completed_at = now
    - Creates a Worksheet record with status = 'pending_generation'
    - Queues background AI content generation task
    - Sends notification to the student
    """
    cls = _get_class_or_404(id, db)

    # Teachers may only complete their own classes
    if current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if not teacher or cls.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only complete your own classes",
            )

    if cls.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Class is already completed"
        )
    if cls.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot complete a cancelled class"
        )

    now = datetime.now(timezone.utc)
    cls.status = "completed"
    cls.completed_at = now

    # Create worksheet record
    worksheet = Worksheet(
        class_id=cls.id,
        teacher_id=cls.teacher_id,
        student_id=cls.student_id,
        subject_id=cls.subject_id,
        chapter_id=cls.chapter_id,
        concept_id=cls.concept_id,
        status="pending_generation",
        created_at=now,
    )
    db.add(worksheet)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="class.completed",
        entity_type="Class",
        entity_id=id,
        details={"completed_at": now.isoformat()},
    )

    # Notify student
    if cls.student_id:
        student = db.query(Student).filter(Student.id == cls.student_id).first()
        if student and student.user_id:
            _send_notification(
                db,
                user_id=student.user_id,
                title="Class Completed",
                body="Your class has been completed. A worksheet is being generated for you.",
                notification_type="class",
                entity_type="Class",
                entity_id=id,
            )

    db.flush()  # Flush to get worksheet.id before background task

    # Queue AI generation background task
    from database import DATABASE_URL
    background_tasks.add_task(
        _trigger_ai_content_generation,
        id,
        worksheet.id,
        DATABASE_URL,
    )

    db.commit()
    db.refresh(worksheet)

    return CompleteClassOut(
        class_id=id,
        status="completed",
        completed_at=now,
        worksheet_id=worksheet.id,
        message="Class completed. AI worksheet generation has been queued.",
    )


@router.put("/{id}/cancel", response_model=ClassOut)
def cancel_class(
    id: str,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
) -> ClassOut:
    """Cancel a scheduled class."""
    cls = _get_class_or_404(id, db)

    if current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if not teacher or cls.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only cancel your own classes",
            )

    if cls.status in ("completed", "cancelled"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Class is already '{cls.status}' and cannot be cancelled",
        )

    now = datetime.now(timezone.utc)
    cls.status = "cancelled"
    cls.cancelled_at = now

    _create_audit(
        db,
        actor_id=current_user.id,
        action="class.cancelled",
        entity_type="Class",
        entity_id=id,
        details={"cancelled_at": now.isoformat()},
    )

    # Notify student
    if cls.student_id:
        student = db.query(Student).filter(Student.id == cls.student_id).first()
        if student and student.user_id:
            _send_notification(
                db,
                user_id=student.user_id,
                title="Class Cancelled",
                body="Your upcoming class has been cancelled. Please contact your teacher for rescheduling.",
                notification_type="class",
                entity_type="Class",
                entity_id=id,
            )

    db.commit()
    db.refresh(cls)
    return cls


@router.post("/{id}/attendance", response_model=AttendanceOut)
def mark_attendance(
    id: str,
    payload: AttendanceIn,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
) -> AttendanceOut:
    """
    Mark attendance for a class.
    Only the teacher assigned to the class may mark attendance.
    Attendance can only be marked for completed classes.
    """
    cls = _get_class_or_404(id, db)

    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher or cls.teacher_id != teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only mark attendance for your own classes",
        )

    if cls.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance can only be marked for completed classes",
        )

    # Check if attendance already recorded
    existing = (
        db.query(Attendance).filter(Attendance.class_id == id).first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance has already been marked for this class",
        )

    now = datetime.now(timezone.utc)
    attendance = Attendance(
        class_id=id,
        student_id=cls.student_id,
        teacher_id=teacher.id,
        student_present=payload.student_present,
        teacher_present=payload.teacher_present,
        notes=payload.notes,
        marked_at=now,
    )
    db.add(attendance)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="class.attendance.marked",
        entity_type="Class",
        entity_id=id,
        details={
            "student_present": payload.student_present,
            "teacher_present": payload.teacher_present,
        },
    )

    db.commit()
    db.refresh(attendance)
    return attendance
