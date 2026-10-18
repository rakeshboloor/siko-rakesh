"""SIKO Submissions Router"""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import get_db
from models import Submission, Worksheet, Assessment, AuditLog, User
from auth import get_current_user, require_teacher_or_admin
from services.ai_service import ai_service

router = APIRouter()

class SubmitRequest(BaseModel):
    worksheet_id: Optional[str] = None
    assessment_id: Optional[str] = None
    submission_type: str = "worksheet"
    answers: List[dict] = []

@router.get("/me")
def my_submissions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.student:
        raise HTTPException(status_code=403, detail="Only students can view submissions.")
    subs = db.query(Submission).filter(Submission.student_id == current_user.student.id)\
              .order_by(Submission.submitted_at.desc()).limit(50).all()
    return [{"id": s.id, "submission_type": s.submission_type, "status": s.status,
             "score": s.score, "max_score": s.max_score, "submitted_at": s.submitted_at.isoformat(),
             "worksheet_id": s.worksheet_id, "assessment_id": s.assessment_id} for s in subs]

@router.post("")
def submit(req: SubmitRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.student:
        raise HTTPException(status_code=403, detail="Only students can submit.")

    sub = Submission(
        student_id=current_user.student.id,
        worksheet_id=req.worksheet_id,
        assessment_id=req.assessment_id,
        submission_type=req.submission_type,
        answers=json.dumps(req.answers),
        status="ai_evaluating",
    )
    db.add(sub)
    db.flush()

    # Run AI evaluation immediately (sync for demo; would be async in prod)
    questions = []
    if req.worksheet_id:
        ws = db.query(Worksheet).filter(Worksheet.id == req.worksheet_id).first()
        if ws:
            questions = json.loads(ws.questions or "[]")
    elif req.assessment_id:
        a = db.query(Assessment).filter(Assessment.id == req.assessment_id).first()
        if a:
            questions = json.loads(a.questions or "[]")

    if questions and req.answers:
        result = ai_service.evaluate_submission(questions, req.answers)
        sub.status = "ai_evaluated"
        sub.score = result["score"]
        sub.max_score = 100.0
        sub.ai_feedback = json.dumps(result)
        sub.ai_suggested_result = result["ai_suggested_result"]
    else:
        sub.status = "submitted"

    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="submission", entity_id=sub.id, action="submission_submitted"))
    db.commit()
    db.refresh(sub)
    return {"success": True, "submission_id": sub.id, "status": sub.status,
            "score": sub.score, "message": "Submission received. AI evaluation complete."}

@router.get("/{sub_id}")
def get_submission(sub_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found.")
    if current_user.role == "student" and current_user.student.id != sub.student_id:
        raise HTTPException(status_code=403, detail="Access denied.")
    return {
        "id": sub.id, "status": sub.status, "score": sub.score, "max_score": sub.max_score,
        "submitted_at": sub.submitted_at.isoformat(),
        "ai_feedback": json.loads(sub.ai_feedback or "{}"),
        "teacher_feedback": sub.teacher_feedback,
        "answers": json.loads(sub.answers or "[]"),
    }

@router.get("/pending-review")
def pending_review(current_user: User = Depends(require_teacher_or_admin), db: Session = Depends(get_db)):
    subs = db.query(Submission).filter(Submission.status == "ai_evaluated")\
              .order_by(Submission.submitted_at.desc()).limit(50).all()
    return [{"id": s.id, "student_id": s.student_id, "status": s.status,
             "score": s.score, "submitted_at": s.submitted_at.isoformat()} for s in subs]

@router.put("/{sub_id}/release")
def release_result(sub_id: str, feedback: dict, current_user: User = Depends(require_teacher_or_admin), db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found.")
    sub.status = "completed"
    sub.teacher_feedback = feedback.get("feedback", "")
    sub.score = feedback.get("score", sub.score)
    sub.released_at = datetime.utcnow()
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="submission", entity_id=sub.id, action="submission_result_released"))
    db.commit()
    return {"success": True, "message": "Result released to student."}
