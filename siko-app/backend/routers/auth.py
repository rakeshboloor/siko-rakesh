"""SIKO Auth Router — Login, logout, token refresh, demo accounts"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

from database import get_db
from models import User, Student, Teacher, Parent, AuditLog, Notification
import json
from auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "student"   # student / teacher / parent
    phone: Optional[str] = None
    grade: Optional[str] = "Grade 11"
    board: Optional[str] = "CBSE"
    subjects: Optional[list] = []


class DemoLoginRequest(BaseModel):
    role: str   # student / teacher / parent / admin


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


def _user_out(user: User) -> dict:
    extra = {}
    if user.student:
        extra["student_id"] = user.student.id
        extra["grade"] = user.student.grade
        extra["board"] = user.student.board
        extra["onboarding_complete"] = user.student.onboarding_complete
    if user.teacher:
        extra["teacher_id"] = user.teacher.id
        extra["tier"] = user.teacher.tier
        extra["application_status"] = user.teacher.application_status
    if user.parent:
        extra["parent_id"] = user.parent.id
        extra["student_id"] = user.parent.student_id
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "is_active": user.is_active,
        **extra,
    }


# ── New User Registration (Student / Teacher / Parent) ────────────────────────
@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    clean_email = req.email.lower().strip()
    if not clean_email or "@" not in clean_email:
        raise HTTPException(status_code=400, detail="Please provide a valid email address.")
    if len(req.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters.")

    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists. Please log in.")

    valid_roles = ("student", "teacher", "parent")
    role = req.role.lower().strip()
    if role not in valid_roles:
        role = "student"

    hashed_pw = get_password_hash(req.password)
    user = User(
        email=clean_email,
        password_hash=hashed_pw,
        role=role,
        full_name=req.full_name.strip(),
        phone=req.phone,
        is_active=True,
    )
    db.add(user)
    db.flush()

    if role == "student":
        student = Student(
            user_id=user.id,
            grade=req.grade or "Grade 11",
            board=req.board or "CBSE",
            program="School & Competitive",
            subjects=json.dumps(req.subjects or ["Physics", "Mathematics"]),
            learning_dna=json.dumps({}),
            onboarding_complete=False,
            diagnostic_done=False,
        )
        db.add(student)
    elif role == "teacher":
        teacher = Teacher(
            user_id=user.id,
            tier="Senior",
            application_status="applied",
            is_active=True,
            expertise=json.dumps({"subjects": req.subjects or ["Physics", "Mathematics"]}),
            qualifications=json.dumps(["Master Degree in Science / Pedagogy"]),
        )
        db.add(teacher)
    elif role == "parent":
        parent = Parent(
            user_id=user.id,
            student_id="",
            relation="Parent / Guardian",
        )
        db.add(parent)

    # Audit log
    audit = AuditLog(
        actor_id=user.id,
        actor_role=user.role,
        entity_type="user",
        entity_id=user.id,
        action="register",
        event_metadata=json.dumps({"ip": request.client.host if request.client else "unknown", "role": role}),
    )
    db.add(audit)

    # Welcome notification
    notif = Notification(
        user_id=user.id,
        title="Welcome to SIKO!",
        body=f"Your {role.capitalize()} account has been created. Start your onboarding journey today.",
        type="system",
        read=False,
    )
    db.add(notif)

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": _user_out(user)}


# ── Regular login ─────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled. Contact support.")

    token = create_access_token({"sub": user.id, "role": user.role})

    # Audit
    log = AuditLog(
        actor_id=user.id, actor_role=user.role,
        entity_type="user", entity_id=user.id,
        action="login",
        event_metadata=str({"ip": request.client.host if request.client else "unknown"}),
    )
    db.add(log)
    db.commit()

    return {"access_token": token, "token_type": "bearer", "user": _user_out(user)}


# ── Demo / quick login (no password needed for demo) ─────────────────────────
@router.post("/demo-login", response_model=TokenResponse)
def demo_login(req: Optional[DemoLoginRequest] = None, role: Optional[str] = None, db: Session = Depends(get_db)):
    role_email_map = {
        "student": "student@siko.demo",
        "teacher": "teacher@siko.demo",
        "parent":  "parent@siko.demo",
        "admin":   "admin@siko.demo",
        "academic_admin": "academic@siko.demo",
        "finance_admin": "finance@siko.demo",
        "super_admin": "admin@siko.demo",
    }
    target_role = (req.role.lower() if req and req.role else None) or (role.lower() if role else "student")
    email = role_email_map.get(target_role)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid role. Choose: student, teacher, parent, admin, academic_admin, finance_admin")


    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Demo account not found. Please ensure the database is seeded.",
        )

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": _user_out(user)}


# ── Get current user ──────────────────────────────────────────────────────────
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return _user_out(current_user)


# ── Logout (client-side token discard — audit event) ─────────────────────────
@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = AuditLog(
        actor_id=current_user.id, actor_role=current_user.role,
        entity_type="user", entity_id=current_user.id,
        action="logout",
    )
    db.add(log)
    db.commit()
    return {"message": "Logged out successfully."}
