"""
SIKO Smart Learning Batches Router (1:Many Format)
Enforces 25-30 student capacity rules, enrollment, schedule, and Jitsi integration.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Batch, BatchEnrollment, Teacher, Student, User, AuditLog
from auth import get_current_user, require_admin

router = APIRouter()

class CreateBatchRequest(BaseModel):
    batch_ref: str
    course_name: str
    subject: str
    board: str = "CBSE"
    grade: str = "11"
    exam: str = "JEE Main & Advanced"
    teacher_id: Optional[str] = None
    days_schedule: str = "Mon, Wed, Fri"
    time_slot: str = "7:00 PM IST"
    timezone: str = "IST"
    sessions_count: int = 24
    session_duration: int = 60
    min_capacity: int = 25
    max_capacity: int = 30
    price_inr: float = 14999.0
    price_usd: float = 199.0

class EnrollBatchRequest(BaseModel):
    student_id: Optional[str] = None

@router.get("")
def list_batches(
    subject: Optional[str] = None,
    exam: Optional[str] = None,
    grade: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Batch)
    if subject:
        query = query.filter(Batch.subject.ilike(f"%{subject}%"))
    if exam:
        query = query.filter(Batch.exam.ilike(f"%{exam}%"))
    if grade:
        query = query.filter(Batch.grade == grade)

    batches = query.order_by(Batch.created_at.desc()).all()
    results = []
    for b in batches:
        teacher = b.teacher
        teacher_user = teacher.user if teacher else None
        seats_remaining = max(0, b.max_capacity - b.enrolled_count)
        is_full = b.enrolled_count >= b.max_capacity

        f_name = b.faculty_name or (teacher_user.full_name if teacher_user else "SIKO Faculty")
        f_title = b.faculty_title or "Senior Academic Faculty"
        f_avatar = b.faculty_avatar or "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
        f_tier = b.faculty_tier or (teacher.tier if teacher else "Master")
        f_rating = b.faculty_rating or (teacher.rating if teacher else 4.9)

        results.append({
            "id": b.id,
            "batch_ref": b.batch_ref,
            "product_id": b.batch_ref,
            "course_name": b.course_name,
            "subject": b.subject,
            "board": b.board,
            "grade": b.grade,
            "exam": b.exam,
            "chapter": b.chapter or b.subject,
            "topic": b.chapter or b.subject,
            "student_need": b.student_need or "Conceptual Mastery",
            "teaching_hours": b.teaching_hours or 10,
            "product_type": b.product_type or "Micro Sprint",
            "priority": b.priority or "P0",
            "launch_month": b.launch_month or "Nov-26",
            "source_note": b.source_note,
            "revenue_at_capacity": b.revenue_at_capacity or (b.price_inr * b.max_capacity),
            "teacher": {
                "id": teacher.id if teacher else None,
                "name": f_name,
                "title": f_title,
                "avatar": f_avatar,
                "tier": f_tier,
                "rating": f_rating,
            },
            "teacher_name": f_name,
            "teacher_avatar": f_avatar,
            "teacher_title": f_title,
            "days_schedule": b.days_schedule,
            "time_slot": b.time_slot,
            "timezone": b.timezone,
            "sessions_count": b.sessions_count,
            "session_duration": b.session_duration,
            "min_capacity": b.min_capacity,
            "max_capacity": b.max_capacity,
            "enrolled_count": b.enrolled_count,
            "seats_remaining": seats_remaining,
            "is_full": is_full,
            "status": "full" if is_full else ("almost_full" if seats_remaining <= 5 else b.status),
            "jitsi_room": b.jitsi_room or f"siko-sprint-{b.batch_ref.lower()}",
            "price_inr": b.price_inr,
            "price_usd": round(b.price_inr / 80.0, 1),
            "currency": b.currency,
            "start_date": b.start_date.isoformat() if b.start_date else None,
        })
    return results

@router.get("/{batch_id}")
def get_batch_detail(batch_id: str, db: Session = Depends(get_db)):
    b = db.query(Batch).filter(Batch.id == batch_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Batch not found")

    teacher = b.teacher
    teacher_user = teacher.user if teacher else None
    seats_remaining = max(0, b.max_capacity - b.enrolled_count)

    enrollments = db.query(BatchEnrollment).filter(BatchEnrollment.batch_id == b.id).all()

    return {
        "id": b.id,
        "batch_ref": b.batch_ref,
        "course_name": b.course_name,
        "subject": b.subject,
        "board": b.board,
        "grade": b.grade,
        "exam": b.exam,
        "teacher": {
            "id": teacher.id if teacher else None,
            "name": teacher_user.full_name if teacher_user else "SIKO Faculty",
            "tier": teacher.tier if teacher else "Master",
            "rating": teacher.rating if teacher else 4.9,
        } if teacher else None,
        "days_schedule": b.days_schedule,
        "time_slot": b.time_slot,
        "timezone": b.timezone,
        "sessions_count": b.sessions_count,
        "session_duration": b.session_duration,
        "min_capacity": b.min_capacity,
        "max_capacity": b.max_capacity,
        "enrolled_count": b.enrolled_count,
        "seats_remaining": seats_remaining,
        "is_full": b.enrolled_count >= b.max_capacity,
        "jitsi_room": b.jitsi_room,
        "price_inr": b.price_inr,
        "price_usd": b.price_usd,
        "enrollments": [
            {
                "id": e.id,
                "student_name": e.student_name or "Enrolled Student",
                "enrolled_at": e.enrolled_at.isoformat() if e.enrolled_at else None,
                "status": e.status,
            }
            for e in enrollments
        ]
    }

@router.post("")
def create_batch(req: CreateBatchRequest, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    # Check duplicate
    existing = db.query(Batch).filter(Batch.batch_ref == req.batch_ref).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Batch reference {req.batch_ref} already exists.")

    batch = Batch(
        batch_ref=req.batch_ref,
        course_name=req.course_name,
        subject=req.subject,
        board=req.board,
        grade=req.grade,
        exam=req.exam,
        teacher_id=req.teacher_id,
        days_schedule=req.days_schedule,
        time_slot=req.time_slot,
        timezone=req.timezone,
        sessions_count=req.sessions_count,
        session_duration=req.session_duration,
        min_capacity=req.min_capacity,
        max_capacity=req.max_capacity,
        enrolled_count=0,
        status="open",
        jitsi_room=f"siko-batch-{req.batch_ref.lower().replace(' ', '-')}",
        price_inr=req.price_inr,
        price_usd=req.price_usd,
        start_date=datetime.utcnow()
    )
    db.add(batch)
    db.add(AuditLog(
        actor_id=current_user.id,
        actor_role=current_user.role,
        entity_type="batch",
        entity_id=batch.id,
        action="batch_created",
        event_metadata=str({"batch_ref": req.batch_ref, "capacity": req.max_capacity})
    ))
    db.commit()
    db.refresh(batch)
    return {"success": True, "batch_id": batch.id, "batch_ref": batch.batch_ref}

@router.post("/{batch_id}/enroll")
def enroll_student_in_batch(
    batch_id: str,
    req: EnrollBatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # Rule 3: Enforce maximum capacity (25-30)
    if batch.enrolled_count >= batch.max_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Batch Full! Maximum capacity of {batch.max_capacity} students reached. Please join waitlist or choose another schedule."
        )

    # Determine student ID
    target_student_id = req.student_id
    student_name = current_user.full_name
    if not target_student_id:
        if current_user.student:
            target_student_id = current_user.student.id
        else:
            first_student = db.query(Student).first()
            if first_student:
                target_student_id = first_student.id
                student_name = first_student.user.full_name if first_student.user else "Riya Sharma"

    # Check already enrolled
    existing_enrollment = db.query(BatchEnrollment).filter(
        BatchEnrollment.batch_id == batch.id,
        BatchEnrollment.student_id == target_student_id
    ).first()
    if existing_enrollment:
        return {
            "success": True,
            "message": "Student is already enrolled in this batch.",
            "batch_ref": batch.batch_ref,
            "jitsi_room": batch.jitsi_room,
            "seats_remaining": batch.max_capacity - batch.enrolled_count
        }

    enrollment = BatchEnrollment(
        batch_id=batch.id,
        student_id=target_student_id,
        student_name=student_name,
        status="active"
    )
    db.add(enrollment)
    batch.enrolled_count += 1
    if batch.enrolled_count >= batch.max_capacity:
        batch.status = "full"

    db.add(AuditLog(
        actor_id=current_user.id,
        actor_role=current_user.role,
        entity_type="batch_enrollment",
        entity_id=enrollment.id,
        action="student_enrolled_in_batch",
        event_metadata=str({"batch_ref": batch.batch_ref, "enrolled_now": batch.enrolled_count})
    ))
    db.commit()

    return {
        "success": True,
        "message": f"Successfully enrolled in {batch.course_name} ({batch.batch_ref})!",
        "batch_ref": batch.batch_ref,
        "jitsi_room": batch.jitsi_room,
        "enrolled_count": batch.enrolled_count,
        "seats_remaining": batch.max_capacity - batch.enrolled_count,
    }
