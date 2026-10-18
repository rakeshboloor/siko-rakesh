"""
routers/audit.py

Endpoints:
  GET /api/audit                          — audit logs (admin only, paginated, filterable)
  GET /api/audit/entity/{type}/{id}       — audit trail for a specific entity
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import require_admin, get_current_user
from database import get_db
from models import AuditLog, User

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class AuditLogOut(BaseModel):
    id: str
    user_id: Optional[str]
    action: str
    entity_type: Optional[str]
    entity_id: Optional[str]
    details: Optional[Dict[str, Any]]
    ip_address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedAuditOut(BaseModel):
    total: int
    limit: int
    offset: int
    items: List[AuditLogOut]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("", response_model=PaginatedAuditOut)
def list_audit_logs(
    entity_type: Optional[str] = Query(None, description="Filter by entity type, e.g. 'User'"),
    action: Optional[str] = Query(None, description="Filter by action, e.g. 'user.profile.updated'"),
    user_id: Optional[str] = Query(None, description="Filter logs by actor user ID"),
    entity_id: Optional[str] = Query(None, description="Filter by entity ID"),
    from_date: Optional[datetime] = Query(None, description="Filter logs after this datetime (ISO 8601)"),
    to_date: Optional[datetime] = Query(None, description="Filter logs before this datetime (ISO 8601)"),
    limit: int = Query(50, le=200),
    offset: int = 0,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> PaginatedAuditOut:
    """
    Admin-only: return paginated audit logs with optional filtering.

    Filterable by:
    - entity_type (e.g. 'User', 'Teacher', 'LearningJourney')
    - action (e.g. 'teacher.offer.accepted')
    - user_id (actor who performed the action)
    - entity_id
    - from_date / to_date (datetime range)
    """
    q = db.query(AuditLog)

    if entity_type:
        q = q.filter(AuditLog.entity_type == entity_type)
    if action:
        q = q.filter(AuditLog.action.ilike(f"%{action}%"))
    if user_id:
        q = q.filter(AuditLog.user_id == user_id)
    if entity_id:
        q = q.filter(AuditLog.entity_id == entity_id)
    if from_date:
        q = q.filter(AuditLog.created_at >= from_date)
    if to_date:
        q = q.filter(AuditLog.created_at <= to_date)

    total = q.count()
    items = q.order_by(AuditLog.created_at.desc()).offset(offset).limit(limit).all()

    return PaginatedAuditOut(
        total=total,
        limit=limit,
        offset=offset,
        items=items,
    )


@router.get("/entity/{entity_type}/{entity_id}", response_model=List[AuditLogOut])
def get_entity_audit_trail(
    entity_type: str,
    entity_id: str,
    limit: int = Query(100, le=500),
    offset: int = 0,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> List[AuditLogOut]:
    """
    Admin-only: return the full audit trail for a specific entity
    identified by its type and ID.
    """
    logs = (
        db.query(AuditLog)
        .filter(
            AuditLog.entity_type == entity_type,
            AuditLog.entity_id == entity_id,
        )
        .order_by(AuditLog.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return logs
