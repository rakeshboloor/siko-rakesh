"""
routers/users.py

Endpoints:
  GET  /api/users/{id}                    — get user profile (own or admin)
  PUT  /api/users/{id}                    — update profile
  GET  /api/users/me/notifications        — get my notifications (unread first)
  PUT  /api/users/notifications/{id}/read — mark notification as read
  GET  /api/users/me/audit               — get my audit history
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from auth import get_current_user, require_admin
from database import get_db
from models import AuditLog, Notification, User

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class UserProfileOut(BaseModel):
    id: str
    email: str
    phone: Optional[str]
    full_name: Optional[str]
    role: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class UserUpdateIn(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    body: str
    notification_type: Optional[str]
    is_read: bool
    entity_type: Optional[str]
    entity_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


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


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get_user_or_404(user_id: str, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


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


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("/me/notifications", response_model=List[NotificationOut])
def get_my_notifications(
    unread_only: bool = False,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[NotificationOut]:
    """Return notifications for the authenticated user, unread first."""
    q = db.query(Notification).filter(Notification.user_id == current_user.id)
    if unread_only:
        q = q.filter(Notification.is_read == False)
    notifications = (
        q.order_by(Notification.is_read.asc(), Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return notifications


@router.get("/me/audit", response_model=List[AuditLogOut])
def get_my_audit(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[AuditLogOut]:
    """Return audit history for the authenticated user."""
    logs = (
        db.query(AuditLog)
        .filter(AuditLog.user_id == current_user.id)
        .order_by(AuditLog.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return logs


@router.get("/{id}", response_model=UserProfileOut)
def get_user_profile(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileOut:
    """
    Return a user profile.
    - A user may fetch their own profile.
    - An admin may fetch any profile.
    """
    if current_user.id != id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to view this profile",
        )
    return _get_user_or_404(id, db)


@router.put("/{id}", response_model=UserProfileOut)
def update_user_profile(
    id: str,
    payload: UserUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileOut:
    """
    Update a user profile.
    - A user may update their own profile.
    - An admin may update any profile.
    """
    if current_user.id != id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this profile",
        )
    user = _get_user_or_404(id, db)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    user.updated_at = datetime.now(timezone.utc)

    _create_audit(
        db,
        actor_id=current_user.id,
        action="user.profile.updated",
        entity_type="User",
        entity_id=id,
        details={"fields": list(update_data.keys())},
    )

    db.commit()
    db.refresh(user)
    return user


@router.put("/notifications/{id}/read", response_model=NotificationOut)
def mark_notification_read(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> NotificationOut:
    """Mark a single notification as read."""
    notif = (
        db.query(Notification)
        .filter(Notification.id == id, Notification.user_id == current_user.id)
        .first()
    )
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        )
    notif.is_read = True
    notif.read_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(notif)
    return notif
