"""SIKO Escrow Router"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import Escrow, WalletTransaction, AuditLog, User
from auth import get_current_user, require_admin, require_teacher_or_admin

router = APIRouter()

@router.get("/me")
def my_escrow(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.teacher:
        raise HTTPException(status_code=403, detail="Only teachers can view escrow.")
    escrows = db.query(Escrow).filter(Escrow.teacher_id == current_user.teacher.id).all()
    return [{
        "id": e.id, "booking_id": e.booking_id, "total_amount": e.total_amount,
        "m1_amount": e.m1_amount, "m1_status": e.m1_status, "m1_released_at": e.m1_released_at.isoformat() if e.m1_released_at else None,
        "m2_amount": e.m2_amount, "m2_status": e.m2_status, "m2_released_at": e.m2_released_at.isoformat() if e.m2_released_at else None,
        "m3_amount": e.m3_amount, "m3_status": e.m3_status, "m3_released_at": e.m3_released_at.isoformat() if e.m3_released_at else None,
        "created_at": e.created_at.isoformat() if e.created_at else None,
    } for e in escrows]

@router.post("/{escrow_id}/release/{milestone}")
def release_milestone(escrow_id: str, milestone: str, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    e = db.query(Escrow).filter(Escrow.id == escrow_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Escrow not found.")
    
    amount = 0.0
    if milestone == "m1" and e.m1_status == "pending":
        e.m1_status = "released"; e.m1_released_at = datetime.utcnow(); amount = e.m1_amount
    elif milestone == "m2" and e.m2_status == "pending":
        e.m2_status = "released"; e.m2_released_at = datetime.utcnow(); amount = e.m2_amount
    elif milestone == "m3" and e.m3_status == "pending":
        e.m3_status = "released"; e.m3_released_at = datetime.utcnow(); amount = e.m3_amount
    else:
        raise HTTPException(status_code=400, detail=f"Milestone {milestone} not pending or invalid.")

    txn = WalletTransaction(
        teacher_id=e.teacher_id, escrow_id=e.id,
        amount=amount, type="credit", milestone=milestone.upper(),
        description=f"Milestone {milestone.upper()} released",
    )
    db.add(txn)
    db.add(AuditLog(actor_id=current_user.id, actor_role=current_user.role,
                    entity_type="escrow", entity_id=e.id,
                    action=f"milestone_{milestone}_released",
                    event_metadata=str({"amount": amount})))
    db.commit()
    return {"success": True, "milestone": milestone.upper(), "amount": amount, "message": f"₹{amount:,.0f} released to teacher wallet."}
