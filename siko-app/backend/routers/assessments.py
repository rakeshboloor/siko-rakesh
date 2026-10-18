"""SIKO Assessments Router"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import Assessment, Notification, AuditLog, User
from auth import get_current_user, require_teacher_or_admin

router = APIRouter()

@router.get("")
def list_assessments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(Assessment)
    if current_user.role == "student":
        q = q.filter(Assessment.status == "released")
    assessments = q.order_by(Assessment.generated_at.desc()).limit(50).all()
    return [{"id": a.id, "title": a.title, "chapter": a.chapter, "status": a.status,
             "total_marks": a.total_marks, "duration_mins": a.duration_mins,
             "generated_at": a.generated_at.isoformat() if a.generated_at else None,
             "released_at": a.released_at.isoformat() if a.released_at else None} for a in assessments]

@router.get("/{assessment_id}")
def get_assessment(assessment_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    a = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    if current_user.role == "student" and a.status != "released":
        raise HTTPException(status_code=403, detail="Assessment not yet released.")
    import json
    return {
        "id": a.id, "title": a.title, "chapter": a.chapter, "status": a.status,
        "concepts": json.loads(a.concepts or "[]"),
        "questions": json.loads(a.questions or "[]") if a.status == "released" or current_user.role in ["teacher","admin"] else [],
        "total_marks": a.total_marks, "duration_mins": a.duration_mins,
        "paper_type": a.paper_type,
        "generated_at": a.generated_at.isoformat() if a.generated_at else None,
        "released_at": a.released_at.isoformat() if a.released_at else None,
    }

@router.put("/{assessment_id}/approve")
def approve_assessment(assessment_id: str, current_user: User = Depends(require_teacher_or_admin), db: Session = Depends(get_db)):
    a = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    a.status = "released"
    a.released_at = datetime.utcnow()
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="assessment", entity_id=a.id, action="assessment_approved"))
    db.commit()
    return {"success": True, "message": "Assessment approved and released to students."}

@router.put("/{assessment_id}/reject")
def reject_assessment(assessment_id: str, current_user: User = Depends(require_teacher_or_admin), db: Session = Depends(get_db)):
    a = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    a.status = "rejected"
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="assessment", entity_id=a.id, action="assessment_rejected"))
    db.commit()
    return {"success": True, "message": "Assessment rejected and sent for regeneration."}
