"""
schemas.py
----------
Pydantic v1-compatible schemas for all SIKO API request/response types.
All schemas use ``orm_mode = True`` (Pydantic v1) / ``from_attributes = True`` (Pydantic v2)
so they can be built directly from SQLAlchemy model instances.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

try:
    # Pydantic v2
    from pydantic import BaseModel, ConfigDict, EmailStr

    _PYDANTIC_V2 = True
except ImportError:
    from pydantic import BaseModel  # type: ignore
    from pydantic import EmailStr  # type: ignore

    _PYDANTIC_V2 = False


# ---------------------------------------------------------------------------
# Base config helper
# ---------------------------------------------------------------------------


class _OrmBase(BaseModel):
    """Shared base that enables ORM serialisation for both Pydantic v1 and v2."""

    if _PYDANTIC_V2:
        model_config = ConfigDict(from_attributes=True)
    else:

        class Config:
            orm_mode = True


# ===========================================================================
# Auth
# ===========================================================================


class LoginRequest(BaseModel):
    """Payload for POST /api/auth/login."""

    email: str
    password: str


class UserOut(_OrmBase):
    """Public user representation returned in auth and profile endpoints."""

    id: str
    email: str
    role: str
    full_name: str
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class LoginResponse(BaseModel):
    """Response body for a successful login."""

    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ===========================================================================
# Student
# ===========================================================================


class StudentProfileOut(_OrmBase):
    """Student extended profile."""

    id: str
    user_id: str
    grade: Optional[str] = None
    board: Optional[str] = None
    program: Optional[str] = None
    learning_dna: Optional[Dict[str, Any]] = None
    onboarding_complete: bool
    user: Optional[UserOut] = None


class StudentProfileUpdate(BaseModel):
    """Fields a student may update on their own profile."""

    grade: Optional[str] = None
    board: Optional[str] = None
    program: Optional[str] = None
    learning_dna: Optional[Dict[str, Any]] = None
    onboarding_complete: Optional[bool] = None


# ===========================================================================
# Teacher
# ===========================================================================


class TeacherProfileOut(_OrmBase):
    """Teacher extended profile."""

    id: str
    user_id: str
    bio: Optional[str] = None
    expertise: Optional[List[str]] = None
    tier: str
    rating: float
    application_status: Optional[str] = None
    is_active: bool
    user: Optional[UserOut] = None


class TeacherProfileUpdate(BaseModel):
    """Fields a teacher may update on their own profile."""

    bio: Optional[str] = None
    expertise: Optional[List[str]] = None


# ===========================================================================
# Board / Grade / Program / Subject / Chapter / Concept
# ===========================================================================


class BoardOut(_OrmBase):
    id: str
    name: str


class GradeOut(_OrmBase):
    id: str
    level: int
    board_id: str


class ProgramOut(_OrmBase):
    id: str
    name: str
    grade_id: str


class SubjectOut(_OrmBase):
    id: str
    name: str
    program_id: str


class ChapterOut(_OrmBase):
    id: str
    name: str
    subject_id: str
    order_index: int


class ConceptOut(_OrmBase):
    id: str
    name: str
    chapter_id: str
    description: Optional[str] = None


# ===========================================================================
# Learning Journey
# ===========================================================================


class LearningJourneyOut(_OrmBase):
    """Learning journey summary returned to any authorised user."""

    id: str
    student_id: str
    teacher_id: Optional[str] = None
    subject_id: Optional[str] = None
    status: str
    chapters: Optional[List[Any]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class LearningJourneyCreate(BaseModel):
    """Payload to start a new learning journey."""

    student_id: str
    teacher_id: Optional[str] = None
    subject_id: Optional[str] = None
    chapters: Optional[List[Any]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


# ===========================================================================
# Teacher Onboarding
# ===========================================================================


class TeacherApplicationOut(_OrmBase):
    id: str
    teacher_id: str
    status: str
    created_at: datetime


class TeacherOfferOut(_OrmBase):
    """Full offer details returned to the teacher and admin."""

    id: str
    teacher_id: str
    application_id: Optional[str] = None
    subject: Optional[str] = None
    board: Optional[str] = None
    grade: Optional[str] = None
    program: Optional[str] = None
    teacher_rate: Optional[float] = None
    currency: str
    commission_rate: Optional[float] = None
    teacher_allocation: Optional[float] = None
    m1_amount: Optional[float] = None
    m2_amount: Optional[float] = None
    m3_amount: Optional[float] = None
    sessions: Optional[int] = None
    session_duration: Optional[int] = None
    schedule: Optional[Dict[str, Any]] = None
    timezone: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str
    created_at: datetime


class TeacherOfferAcceptanceOut(_OrmBase):
    id: str
    offer_id: str
    teacher_id: str
    accepted_at: datetime
    ip_address: Optional[str] = None
    acceptance_event_id: Optional[str] = None
    status: str


class ATCOut(_OrmBase):
    """Assignment-to-class contract output."""

    id: str
    teacher_id: str
    student_id: Optional[str] = None
    offer_id: Optional[str] = None
    program: Optional[str] = None
    exam: Optional[str] = None
    board: Optional[str] = None
    grade: Optional[str] = None
    subject: Optional[str] = None
    chapters: Optional[List[Any]] = None
    concepts: Optional[List[Any]] = None
    format: Optional[str] = None
    sessions: Optional[int] = None
    hours: Optional[float] = None
    schedule: Optional[Dict[str, Any]] = None
    timezone: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    teacher_rate: Optional[float] = None
    teacher_allocation: Optional[float] = None
    m1: Optional[float] = None
    m2: Optional[float] = None
    m3: Optional[float] = None
    deliverables: Optional[List[Any]] = None
    special_terms: Optional[str] = None
    status: str
    created_at: datetime


# ===========================================================================
# Legal Documents
# ===========================================================================


class FacultyAgreementOut(_OrmBase):
    id: str
    version: str
    title: str
    content_hash: Optional[str] = None
    effective_date: datetime
    is_active: bool


class AgreementAcceptanceOut(_OrmBase):
    id: str
    teacher_id: str
    agreement_id: str
    atc_id: Optional[str] = None
    offer_acceptance_id: Optional[str] = None
    legal_name: Optional[str] = None
    acceptance_event_id: Optional[str] = None
    accepted_at: datetime
    timezone: str
    document_hash: Optional[str] = None
    atc_hash: Optional[str] = None
    offer_snapshot: Optional[Dict[str, Any]] = None
    status: str


class RefundPolicyOut(_OrmBase):
    id: str
    version: str
    title: str
    content_hash: Optional[str] = None
    effective_date: datetime
    is_active: bool


class RefundAcceptanceOut(_OrmBase):
    id: str
    user_id: str
    student_id: Optional[str] = None
    order_id: Optional[str] = None
    policy_id: str
    accepted_at: datetime
    policy_hash: Optional[str] = None
    acceptance_event_id: Optional[str] = None
    status: str


# ===========================================================================
# Booking & Payments
# ===========================================================================


class BookingOut(_OrmBase):
    """Booking summary."""

    id: str
    student_id: str
    teacher_id: Optional[str] = None
    journey_id: Optional[str] = None
    status: str
    total_amount: Optional[float] = None
    currency: str
    payment_status: str
    refund_acceptance_id: Optional[str] = None
    created_at: datetime


class BookingCreate(BaseModel):
    student_id: str
    teacher_id: Optional[str] = None
    journey_id: Optional[str] = None
    total_amount: Optional[float] = None
    currency: str = "INR"
    refund_acceptance_id: Optional[str] = None


class PaymentOut(_OrmBase):
    id: str
    booking_id: str
    provider: Optional[str] = None
    provider_order_id: Optional[str] = None
    provider_payment_id: Optional[str] = None
    amount: Optional[float] = None
    currency: str
    status: str
    payment_method: Optional[str] = None
    created_at: datetime
    verified_at: Optional[datetime] = None


class EscrowOut(_OrmBase):
    id: str
    booking_id: str
    teacher_id: Optional[str] = None
    total_amount: Optional[float] = None
    m1_amount: Optional[float] = None
    m1_status: str
    m1_released_at: Optional[datetime] = None
    m2_amount: Optional[float] = None
    m2_status: str
    m2_released_at: Optional[datetime] = None
    m3_amount: Optional[float] = None
    m3_status: str
    m3_released_at: Optional[datetime] = None


class WalletTransactionOut(_OrmBase):
    id: str
    teacher_id: str
    escrow_id: Optional[str] = None
    amount: float
    type: str
    milestone: Optional[str] = None
    status: str
    transaction_id: Optional[str] = None
    created_at: datetime


# ===========================================================================
# Classes & Attendance
# ===========================================================================


class ClassOut(_OrmBase):
    """Single class session output."""

    id: str
    journey_id: str
    teacher_id: Optional[str] = None
    student_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    status: str
    chapter: Optional[str] = None
    concepts: Optional[List[Any]] = None
    duration_minutes: int
    notes: Optional[str] = None


class ClassCreate(BaseModel):
    journey_id: str
    teacher_id: Optional[str] = None
    student_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    chapter: Optional[str] = None
    concepts: Optional[List[Any]] = None
    duration_minutes: int = 60
    notes: Optional[str] = None


class AttendanceOut(_OrmBase):
    id: str
    class_id: str
    student_id: str
    status: str


# ===========================================================================
# Worksheets & Assessments
# ===========================================================================


class WorksheetOut(_OrmBase):
    """Worksheet output — questions omitted by default (see full endpoint)."""

    id: str
    class_id: Optional[str] = None
    journey_id: str
    subject_id: Optional[str] = None
    chapter: Optional[str] = None
    concepts: Optional[List[Any]] = None
    difficulty_mix: Optional[Dict[str, Any]] = None
    status: str
    ai_quality_flags: Optional[Dict[str, Any]] = None
    generated_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    released_at: Optional[datetime] = None
    teacher_id: Optional[str] = None


class WorksheetDetailOut(WorksheetOut):
    """Full worksheet including questions and answer key."""

    questions: Optional[List[Any]] = None
    answer_key: Optional[List[Any]] = None


class AssessmentOut(_OrmBase):
    id: str
    journey_id: str
    subject_id: Optional[str] = None
    chapter: Optional[str] = None
    concepts: Optional[List[Any]] = None
    paper_type: Optional[str] = None
    status: str
    generated_at: Optional[datetime] = None
    released_at: Optional[datetime] = None
    teacher_id: Optional[str] = None


class AssessmentDetailOut(AssessmentOut):
    questions: Optional[List[Any]] = None
    answer_key: Optional[List[Any]] = None


class QuestionBankItemOut(_OrmBase):
    id: str
    board: Optional[str] = None
    grade: Optional[str] = None
    exam: Optional[str] = None
    subject: Optional[str] = None
    chapter: Optional[str] = None
    concept: Optional[str] = None
    question_text: str
    options: Optional[List[Any]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    question_type: Optional[str] = None
    difficulty: Optional[str] = None
    ai_confidence: Optional[float] = None
    teacher_status: str
    usage_count: int
    created_at: datetime


# ===========================================================================
# Submissions
# ===========================================================================


class SubmissionOut(_OrmBase):
    id: str
    student_id: str
    worksheet_id: Optional[str] = None
    assessment_id: Optional[str] = None
    submission_type: Optional[str] = None
    answers: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None
    submitted_at: datetime
    status: str
    score: Optional[float] = None
    ai_feedback: Optional[Dict[str, Any]] = None
    teacher_feedback: Optional[str] = None
    ai_suggested_result: Optional[str] = None


class SubmissionCreate(BaseModel):
    student_id: str
    worksheet_id: Optional[str] = None
    assessment_id: Optional[str] = None
    submission_type: Optional[str] = None
    answers: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None


# ===========================================================================
# Notifications
# ===========================================================================


class NotificationOut(_OrmBase):
    id: str
    user_id: str
    title: str
    body: Optional[str] = None
    type: Optional[str] = None
    read: bool
    entity_id: Optional[str] = None
    entity_type: Optional[str] = None
    created_at: datetime


# ===========================================================================
# Audit Log
# ===========================================================================


class AuditLogOut(_OrmBase):
    id: str
    event_id: Optional[str] = None
    actor_id: Optional[str] = None
    actor_role: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    action: str
    timestamp: datetime
    status: str
    metadata: Optional[Dict[str, Any]] = None


# ===========================================================================
# PTM
# ===========================================================================


class PTMOut(_OrmBase):
    id: str
    journey_id: str
    teacher_id: Optional[str] = None
    parent_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    summary: Optional[str] = None
    acknowledged_at: Optional[datetime] = None


class PTMCreate(BaseModel):
    journey_id: str
    teacher_id: Optional[str] = None
    parent_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    notes: Optional[str] = None


# ===========================================================================
# Generic response wrappers
# ===========================================================================


class PaginatedResponse(BaseModel):
    """Generic paginated list wrapper."""

    total: int
    page: int
    page_size: int
    items: List[Any]


class MessageResponse(BaseModel):
    """Simple status message response."""

    message: str
    success: bool = True
