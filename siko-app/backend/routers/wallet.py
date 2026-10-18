"""SIKO Wallet Router"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import WalletTransaction, Escrow, User
from auth import get_current_user

router = APIRouter()

@router.get("/me")
def my_wallet(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.teacher:
        raise HTTPException(status_code=403, detail="Only teachers have a wallet.")
    txns = db.query(WalletTransaction).filter(
        WalletTransaction.teacher_id == current_user.teacher.id
    ).order_by(WalletTransaction.created_at.desc()).limit(100).all()
    
    available = sum(t.amount for t in txns if t.type == "credit") - \
                sum(t.amount for t in txns if t.type == "debit")
    escrows = db.query(Escrow).filter(Escrow.teacher_id == current_user.teacher.id).all()
    in_escrow = sum(
        (e.m1_amount if e.m1_status == "pending" else 0) +
        (e.m2_amount if e.m2_status == "pending" else 0) +
        (e.m3_amount if e.m3_status == "pending" else 0)
        for e in escrows
    )
    return {
        "available": round(available, 2),
        "in_escrow": round(in_escrow, 2),
        "currency": "INR",
        "transactions": [{
            "id": t.id, "amount": t.amount, "type": t.type,
            "milestone": t.milestone, "description": t.description,
            "status": t.status, "created_at": t.created_at.isoformat() if t.created_at else None,
        } for t in txns],
    }
