"""
routers/notifications.py

Endpoints:
  GET    /api/notifications           — my notifications
  PUT    /api/notifications/{id}/read — mark single notification read
  PUT    /api/notifications/read-all  — mark all notifications read
  DELETE /api/notifications/{id}      — delete a notification
"""

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Notification, User

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


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
    read_at: Optional[datetime]

    class Config:
        from_attributes = True


class MarkAllReadResponse(BaseModel):
    updated_count: int
    message: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("", response_model=List[NotificationOut])
def get_my_notifications(
    unread_only: bool = Query(False, description="If true, return only unread notifications"),
    notification_type: Optional[str] = Query(None, description="Filter by notification type"),
    limit: int = Query(50, le=200),
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[NotificationOut]:
    """
    Return the authenticated user's notifications.
    Unread notifications appear first; within each group sorted by created_at desc.
    """
    q = db.query(Notification).filter(Notification.user_id == current_user.id)

    if unread_only:
        q = q.filter(Notification.is_read == False)
    if notification_type:
        q = q.filter(Notification.notification_type == notification_type)

    notifications = (
        q.order_by(Notification.is_read.asc(), Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return notifications


@router.put("/read-all", response_model=MarkAllReadResponse)
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MarkAllReadResponse:
    """Mark all unread notifications as read for the authenticated user."""
    now = datetime.now(timezone.utc)
    updated = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        )
        .all()
    )
    count = len(updated)
    for notif in updated:
        notif.is_read = True
        notif.read_at = now

    db.commit()
    return MarkAllReadResponse(
        updated_count=count,
        message=f"{count} notification(s) marked as read",
    )


@router.put("/{id}/read", response_model=NotificationOut)
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
    if not notif.is_read:
        notif.is_read = True
        notif.read_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(notif)
    return notif


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Delete a notification belonging to the authenticated user."""
    notif = (
        db.query(Notification)
        .filter(Notification.id == id, Notification.user_id == current_user.id)
        .first()
    )
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        )
    db.delete(notif)
    db.commit()
