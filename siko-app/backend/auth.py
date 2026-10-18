"""
SIKO Authentication — JWT + Role-based access
"""

import os
import uuid
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import User

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY      = os.getenv("AUTH_SECRET", "siko-dev-secret-change-in-production-" + uuid.uuid4().hex)
ALGORITHM       = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE_MINUTES", "1440"))  # 24h

pwd_context = CryptContext(schemes=["sha256_crypt", "bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


# ── Password helpers ──────────────────────────────────────────────────────────
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT helpers ───────────────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# ── Current user dependency ───────────────────────────────────────────────────
def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise credentials_exception

    payload = verify_token(credentials.credentials)
    if not payload:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if not user_id:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled. Please contact support.")

    return user


def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if not credentials:
        return None
    payload = verify_token(credentials.credentials)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    return db.query(User).filter(User.id == user_id, User.is_active == True).first()


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user


# ── Role checker factory ──────────────────────────────────────────────────────
def require_role(allowed_roles: List[str]):
    """Returns a dependency that enforces one of the given roles."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. This action requires role: {', '.join(allowed_roles)}.",
            )
        return current_user
    return role_checker


# ── Convenience role dependencies ─────────────────────────────────────────────
require_student = require_role(["student"])
require_teacher = require_role(["teacher"])
require_parent  = require_role(["parent"])
require_admin   = require_role(["admin", "super_admin", "founder", "academic_manager", "academic_admin", "finance_admin"])
require_academic_admin = require_role(["admin", "super_admin", "academic_admin", "academic_manager"])
require_finance_admin  = require_role(["admin", "super_admin", "finance_admin"])
require_super_admin    = require_role(["admin", "super_admin"])
require_teacher_or_admin = require_role(["teacher", "admin", "super_admin", "academic_admin", "academic_manager"])
require_student_or_parent = require_role(["student", "parent"])

