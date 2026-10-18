"""
routers/worksheets.py
SIKO Worksheets Router — Full AI workflow: generation, review queue, approval, release, regeneration.
"""

import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user, require_teacher, require_teacher_or_admin
from database import get_db
from models import (
    Assessment,
    AuditLog,
    Class,
    Escrow,
    LearningJourney,
    Notification,
    Student,
    Teacher,
    User,
    WalletTransaction,
    Worksheet,
)
from services.ai_service import ai_service

router = APIRouter()


class WorksheetApproveIn(BaseModel):
    teacher_notes: Optional[str] = None
    notes: Optional[str] = None


class WorksheetRejectIn(BaseModel):
    reason: Optional[str] = None
    notes: Optional[str] = None


def _format_worksheet(ws: Worksheet, role: str = "student") -> dict:
    try:
        questions = json.loads(ws.questions or "[]")
    except Exception:
        questions = []
    try:
        concepts = json.loads(ws.concepts or "[]")
    except Exception:
        concepts = []
    try:
        diff_mix = json.loads(ws.difficulty_mix or "{}")
    except Exception:
        diff_mix = {}
    try:
        quality_flags = json.loads(ws.ai_quality_flags or "[]")
    except Exception:
        quality_flags = []
    try:
        answer_key = json.loads(ws.answer_key or "[]") if role in ["teacher", "admin"] else []
    except Exception:
        answer_key = []

    return {
        "id": ws.id,
        "class_id": ws.class_id,
        "journey_id": ws.journey_id,
        "subject_id": ws.subject_id,
        "teacher_id": ws.teacher_id,
        "chapter": ws.chapter or "Mechanics & Motion",
        "concepts": concepts,
        "questions": questions,
        "questions_count": len(questions),
        "answer_key": answer_key,
        "difficulty_mix": diff_mix,
        "estimated_mins": ws.estimated_mins or 25,
        "status": ws.status or "released",
        "ai_quality_flags": quality_flags,
        "ai_confidence": ws.ai_confidence or 0.88,
        "teacher_notes": ws.teacher_notes,
        "generated_at": ws.generated_at.isoformat() if ws.generated_at else None,
        "reviewed_at": ws.reviewed_at.isoformat() if ws.reviewed_at else None,
        "released_at": ws.released_at.isoformat() if ws.released_at else None,
        "due_date": ws.due_date.isoformat() if ws.due_date else None,
        "created_at": ws.created_at.isoformat() if ws.created_at else None,
    }


@router.get("/review-queue")
def get_review_queue(
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
):
    """
    Return all worksheets and assessments awaiting teacher review.
    """
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    teacher_id = teacher.id if teacher else None

    # Worksheets in review
    q_ws = db.query(Worksheet).filter(Worksheet.status.in_(["ai_generated", "teacher_review", "pending_review"]))
    if teacher_id and current_user.role == "teacher":
        q_ws = q_ws.filter((Worksheet.teacher_id == teacher_id) | (Worksheet.teacher_id == None))
    worksheets = q_ws.order_by(Worksheet.created_at.desc()).all()

    # Assessments in review
    q_asmt = db.query(Assessment).filter(Assessment.status.in_(["ai_generated", "teacher_review", "pending_review"]))
    if teacher_id and current_user.role == "teacher":
        q_asmt = q_asmt.filter((Assessment.teacher_id == teacher_id) | (Assessment.teacher_id == None))
    assessments = q_asmt.order_by(Assessment.generated_at.desc()).all()

    items = []
    for ws in worksheets:
        try:
            q_list = json.loads(ws.questions or "[]")
        except Exception:
            q_list = []
        items.append({
            "type": "worksheet",
            "id": ws.id,
            "title": f"Worksheet: {ws.chapter or 'Core Concepts'}",
            "chapter": ws.chapter or "Mechanics",
            "status": ws.status,
            "questions_count": len(q_list),
            "ai_confidence": round(ws.ai_confidence or 0.87, 2),
            "estimated_mins": ws.estimated_mins or 25,
            "created_at": ws.created_at.isoformat() if ws.created_at else None,
        })

    for a in assessments:
        try:
            q_list = json.loads(a.questions or "[]")
        except Exception:
            q_list = []
        items.append({
            "type": "assessment",
            "id": a.id,
            "title": a.title or f"Assessment: {a.chapter}",
            "chapter": a.chapter or "General",
            "status": a.status,
            "total_marks": a.total_marks or 100,
            "duration_mins": a.duration_mins or 180,
            "paper_type": a.paper_type or "chapter_test",
            "ai_confidence": 0.89,
            "created_at": a.generated_at.isoformat() if a.generated_at else None,
        })

    return items


@router.get("")
def list_worksheets(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List worksheets based on role:
    - Students see released worksheets.
    - Teachers and Admins see all worksheets.
    """
    q = db.query(Worksheet)

    if current_user.role == "student":
        q = q.filter(Worksheet.status == "released")
    elif current_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if teacher:
            q = q.filter((Worksheet.teacher_id == teacher.id) | (Worksheet.teacher_id == None))

    if status_filter:
        q = q.filter(Worksheet.status == status_filter)

    worksheets = q.order_by(Worksheet.created_at.desc()).limit(100).all()
    return [_format_worksheet(ws, current_user.role) for ws in worksheets]


@router.get("/{id}")
def get_worksheet(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return single worksheet details."""
    ws = db.query(Worksheet).filter(Worksheet.id == id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Worksheet not found.")

    if current_user.role == "student" and ws.status != "released":
        raise HTTPException(status_code=403, detail="Worksheet not yet released by teacher.")

    return _format_worksheet(ws, current_user.role)


@router.put("/{id}/approve")
def approve_worksheet(
    id: str,
    payload: Optional[WorksheetApproveIn] = None,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
):
    """Teacher approves and releases AI-generated worksheet to student."""
    ws = db.query(Worksheet).filter(Worksheet.id == id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Worksheet not found.")

    now = datetime.now(timezone.utc)
    ws.status = "released"
    ws.reviewed_at = now
    ws.released_at = now
    if payload and (payload.teacher_notes or payload.notes):
        ws.teacher_notes = payload.teacher_notes or payload.notes

    # Automated Escrow Milestone Payout Linkage
    milestone_released = False
    payout_amount = 4500.0
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    teacher_id = ws.teacher_id or (teacher.id if teacher else None)
    if teacher_id:
        escrow = db.query(Escrow).filter(Escrow.teacher_id == teacher_id).first()
        if escrow:
            if escrow.m2_status == "pending":
                escrow.m2_status = "released"
                escrow.m2_released_at = now
                payout_amount = escrow.m2_amount or 4500.0
                milestone_released = True
            elif escrow.m1_status == "pending":
                escrow.m1_status = "released"
                escrow.m1_released_at = now
                payout_amount = escrow.m1_amount or 6000.0
                milestone_released = True

            if milestone_released:
                db.add(WalletTransaction(
                    teacher_id=teacher_id,
                    escrow_id=escrow.id,
                    amount=payout_amount,
                    type="credit",
                    milestone="M2",
                    description=f"Automated Milestone Release: Worksheet Approval for '{ws.chapter}'",
                    status="completed"
                ))

    # Broadcast notification to enrolled students
    students = db.query(Student).all()
    for s in students[:5]:
        if s.user_id:
            db.add(Notification(
                user_id=s.user_id,
                title="New Worksheet Released!",
                body=f"Your teacher has released the practice worksheet for '{ws.chapter}'. Complete it before the deadline.",
                type="worksheet_released",
                entity_id=ws.id,
                entity_type="worksheet",
            ))

    db.add(AuditLog(
        actor_id=current_user.id,
        actor_role=current_user.role,
        entity_type="worksheet",
        entity_id=ws.id,
        action="worksheet_approved_and_released",
        event_metadata=json.dumps({"chapter": ws.chapter, "notes": ws.teacher_notes, "milestone_released": milestone_released, "payout_amount": payout_amount})
    ))
    db.commit()
    db.refresh(ws)
    return {
        "success": True,
        "message": f"Worksheet for '{ws.chapter}' approved and released to students. Milestone payout of ₹{payout_amount:,.0f} released automatically.",
        "payout_released": milestone_released,
        "payout_amount": payout_amount,
        "worksheet": _format_worksheet(ws, current_user.role)
    }


@router.put("/{id}/reject")
def reject_worksheet(
    id: str,
    payload: Optional[WorksheetRejectIn] = None,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
):
    """Teacher rejects AI worksheet with feedback notes."""
    ws = db.query(Worksheet).filter(Worksheet.id == id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Worksheet not found.")

    reason = (payload.reason or payload.notes) if payload else "Teacher requested adjustments."
    ws.status = "rejected"
    ws.teacher_notes = reason

    db.add(AuditLog(
        actor_id=current_user.id,
        actor_role=current_user.role,
        entity_type="worksheet",
        entity_id=ws.id,
        action="worksheet_rejected",
        event_metadata=json.dumps({"reason": reason})
    ))
    db.commit()
    return {"success": True, "message": "Worksheet rejected and marked for revision."}


@router.put("/{id}/regenerate")
def regenerate_worksheet(
    id: str,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
):
    """Regenerate worksheet questions with AI."""
    ws = db.query(Worksheet).filter(Worksheet.id == id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Worksheet not found.")

    try:
        concepts = json.loads(ws.concepts or "[]")
    except Exception:
        concepts = []

    res = ai_service.generate_worksheet(
        subject="Physics",
        chapter=ws.chapter or "Laws of Motion",
        concepts=concepts,
        grade="11",
        board="CBSE",
        question_count=5,
    )
    if res["success"]:
        content = res["content"]
        ws.questions = json.dumps(content["questions"])
        ws.answer_key = json.dumps(content["answer_key"])
        ws.difficulty_mix = json.dumps(content.get("difficulty_mix", {}))
        ws.status = "teacher_review"
        ws.ai_confidence = content.get("ai_confidence", 0.90)
        db.add(AuditLog(
            actor_id=current_user.id,
            actor_role=current_user.role,
            entity_type="worksheet",
            entity_id=ws.id,
            action="worksheet_ai_regenerated"
        ))
        db.commit()
        db.refresh(ws)
        return {
            "success": True,
            "message": "Worksheet regenerated by AI. Ready for teacher review.",
            "worksheet": _format_worksheet(ws, current_user.role)
        }

    raise HTTPException(status_code=500, detail="Failed to regenerate worksheet.")
