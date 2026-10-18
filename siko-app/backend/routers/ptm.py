"""SIKO PTM Router"""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import PTM, AuditLog, User
from auth import get_current_user, require_teacher_or_admin

router = APIRouter()

@router.get("")
def list_ptms(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(PTM)
    if current_user.role == "teacher" and current_user.teacher:
        q = q.filter(PTM.teacher_id == current_user.teacher.id)
    elif current_user.role == "parent" and current_user.parent:
        q = q.filter(PTM.parent_id == current_user.parent.id)
    ptms = q.order_by(PTM.scheduled_at.desc()).limit(20).all()
    return [{
        "id": p.id, "status": p.status,
        "scheduled_at": p.scheduled_at.isoformat() if p.scheduled_at else None,
        "notes": p.notes, "summary": p.summary,
        "acknowledged_at": p.acknowledged_at.isoformat() if p.acknowledged_at else None,
    } for p in ptms]

@router.get("/{ptm_id}")
def get_ptm(ptm_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(PTM).filter(PTM.id == ptm_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="PTM not found.")
    return {
        "id": p.id, "status": p.status, "notes": p.notes, "summary": p.summary,
        "recommendations": p.recommendations,
        "scheduled_at": p.scheduled_at.isoformat() if p.scheduled_at else None,
        "acknowledged_at": p.acknowledged_at.isoformat() if p.acknowledged_at else None,
    }

@router.post("")
def create_ptm(body: dict, current_user: User = Depends(require_teacher_or_admin), db: Session = Depends(get_db)):
    from datetime import datetime
    p = PTM(
        journey_id=body.get("journey_id"),
        teacher_id=current_user.teacher.id if current_user.teacher else None,
        parent_id=body.get("parent_id"),
        scheduled_at=datetime.fromisoformat(body["scheduled_at"]) if body.get("scheduled_at") else None,
        notes=body.get("notes"),
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"success": True, "ptm_id": p.id}

@router.put("/{ptm_id}/complete")
def complete_ptm(ptm_id: str, body: dict, current_user: User = Depends(require_teacher_or_admin), db: Session = Depends(get_db)):
    p = db.query(PTM).filter(PTM.id == ptm_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="PTM not found.")
    p.status = "completed"
    p.summary = body.get("summary", "")
    p.recommendations = body.get("recommendations", "")
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="ptm", entity_id=p.id, action="ptm_completed"))
    db.commit()
    return {"success": True}

@router.put("/{ptm_id}/acknowledge")
def acknowledge_ptm(ptm_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only parents can acknowledge PTMs.")
    p = db.query(PTM).filter(PTM.id == ptm_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="PTM not found.")
    p.acknowledged_at = datetime.utcnow()
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="ptm", entity_id=p.id, action="ptm_acknowledged"))
    db.commit()
    return {"success": True, "acknowledged_at": p.acknowledged_at.isoformat()}
