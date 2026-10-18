"""
SIKO AI Teacher Matching Router
Provides explainable 1:1 teacher recommendations based on student goals, board, exam, and weaknesses.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json

from database import get_db
from models import Teacher, User, Student
from auth import get_current_user
from services.matching_service import matching_engine

router = APIRouter()

class MatchingRequest(BaseModel):
    subject: str = "Physics"
    board: str = "CBSE"
    grade: str = "11"
    exam: str = "JEE"
    weak_topics: List[str] = []
    time_preference: str = "Evening"
    limit: int = 6

@router.post("/recommendations")
def get_recommendations(
    req: MatchingRequest,
    db: Session = Depends(get_db)
):

    # Fetch approved teachers
    teachers = db.query(Teacher).filter(Teacher.is_active == True).all()
    teacher_dicts = []

    for t in teachers:
        u = t.user
        expertise = json.loads(t.expertise or "{}") if isinstance(t.expertise, str) else (t.expertise or {})
        teacher_dicts.append({
            "id": t.id,
            "name": u.full_name if u else "SIKO Faculty",
            "avatar": u.avatar_url if u else None,
            "bio": t.bio,
            "expertise": expertise,
            "tier": t.tier,
            "rating": t.rating,
            "total_classes": t.total_classes,
            "hourly_rate": 1800 if t.tier in ["platinum", "master"] else (1500 if t.tier in ["gold", "lead"] else 1200),
            "improvement_boost_pct": 28 if t.tier in ["platinum", "master"] else 22,
        })

    student_profile = {
        "subject": req.subject,
        "board": req.board,
        "grade": req.grade,
        "exam": req.exam,
        "weak_topics": req.weak_topics,
        "time_preference": req.time_preference,
    }

    matched = matching_engine.match_teachers(
        student_profile=student_profile,
        available_teachers=teacher_dicts,
        limit=req.limit
    )

    return {
        "student_criteria": student_profile,
        "matches_count": len(matched),
        "teachers": matched
    }
