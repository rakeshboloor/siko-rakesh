"""
SIKO — Clean Production SQLAlchemy Models
All relationships verified, no reserved column names.
"""

import uuid
import json
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Text, Enum as SAEnum, Index
)
from sqlalchemy.orm import relationship
from database import Base


def new_id():
    return str(uuid.uuid4())


def now():
    return datetime.utcnow()


# ─────────────────────────────────────────────────────────────────────────────
# 1. User
# ─────────────────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id            = Column(String, primary_key=True, default=new_id)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role          = Column(String(50), nullable=False)   # student/teacher/parent/admin/founder/counsellor/academic_manager
    full_name     = Column(String(255), nullable=False)
    phone         = Column(String(20))
    avatar_url    = Column(String(512))
    is_active     = Column(Boolean, default=True)
    is_verified   = Column(Boolean, default=False)
    created_at    = Column(DateTime, default=now)
    updated_at    = Column(DateTime, default=now, onupdate=now)

    student       = relationship("Student", back_populates="user", uselist=False, foreign_keys="Student.user_id")
    teacher       = relationship("Teacher", back_populates="user", uselist=False, foreign_keys="Teacher.user_id")
    parent        = relationship("Parent",  back_populates="user", uselist=False, foreign_keys="Parent.user_id")
    notifications = relationship("Notification", back_populates="user")
    audit_logs    = relationship("AuditLog", back_populates="actor", foreign_keys="AuditLog.actor_id")


# ─────────────────────────────────────────────────────────────────────────────
# 2. Student
# ─────────────────────────────────────────────────────────────────────────────
class Student(Base):
    __tablename__ = "students"

    id                  = Column(String, primary_key=True, default=new_id)
    user_id             = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    grade               = Column(String(10))
    board               = Column(String(50))
    program             = Column(String(50))
    subjects            = Column(Text, default="[]")
    learning_dna        = Column(Text, default="{}")
    onboarding_complete = Column(Boolean, default=False)
    diagnostic_done     = Column(Boolean, default=False)
    created_at          = Column(DateTime, default=now)

    user        = relationship("User", back_populates="student", foreign_keys=[user_id])
    journeys    = relationship("LearningJourney", back_populates="student")
    parents     = relationship("Parent", back_populates="student")
    bookings    = relationship("Booking", back_populates="student")
    classes     = relationship("Class", back_populates="student")
    submissions = relationship("Submission", back_populates="student")
    attendances = relationship("Attendance", back_populates="student")


# ─────────────────────────────────────────────────────────────────────────────
# 3. Teacher
# ─────────────────────────────────────────────────────────────────────────────
class Teacher(Base):
    __tablename__ = "teachers"

    id                 = Column(String, primary_key=True, default=new_id)
    user_id            = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    bio                = Column(Text)
    expertise          = Column(Text, default="{}")
    qualifications     = Column(Text, default="[]")
    tier               = Column(String(20), default="bronze")
    rating             = Column(Float, default=0.0)
    total_classes      = Column(Integer, default=0)
    application_status = Column(String(50), default="applied")
    is_active          = Column(Boolean, default=False)
    created_at         = Column(DateTime, default=now)

    user         = relationship("User", back_populates="teacher", foreign_keys=[user_id])
    applications = relationship("TeacherApplication", back_populates="teacher")
    offers       = relationship("TeacherOffer", back_populates="teacher")
    journeys     = relationship("LearningJourney", back_populates="teacher")
    classes      = relationship("Class", back_populates="teacher")
    worksheets   = relationship("Worksheet", back_populates="teacher")
    wallet_txns  = relationship("WalletTransaction", back_populates="teacher")
    escrows      = relationship("Escrow", back_populates="teacher")
    atcs         = relationship("ATC", back_populates="teacher")
    agreement_acceptances = relationship("AgreementAcceptance", back_populates="teacher")


# ─────────────────────────────────────────────────────────────────────────────
# 4. Parent
# ─────────────────────────────────────────────────────────────────────────────
class Parent(Base):
    __tablename__ = "parents"

    id         = Column(String, primary_key=True, default=new_id)
    user_id    = Column(String, ForeignKey("users.id"), nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    relation   = Column(String(50), default="parent")
    created_at = Column(DateTime, default=now)

    user    = relationship("User",    back_populates="parent",  foreign_keys=[user_id])
    student = relationship("Student", back_populates="parents", foreign_keys=[student_id])
    ptms    = relationship("PTM", back_populates="parent")


# ─────────────────────────────────────────────────────────────────────────────
# 5. Academic Structure
# ─────────────────────────────────────────────────────────────────────────────
class Board(Base):
    __tablename__ = "boards"
    id     = Column(String, primary_key=True, default=new_id)
    name   = Column(String(100), unique=True, nullable=False)
    grades = relationship("Grade", back_populates="board")


class Grade(Base):
    __tablename__ = "grades"
    id       = Column(String, primary_key=True, default=new_id)
    level    = Column(String(5), nullable=False)
    board_id = Column(String, ForeignKey("boards.id"), nullable=False)
    board    = relationship("Board", back_populates="grades")
    programs = relationship("Program", back_populates="grade")


class Program(Base):
    __tablename__ = "programs"
    id       = Column(String, primary_key=True, default=new_id)
    name     = Column(String(50), nullable=False)
    grade_id = Column(String, ForeignKey("grades.id"), nullable=False)
    grade    = relationship("Grade", back_populates="programs")
    subjects = relationship("Subject", back_populates="program")


class Subject(Base):
    __tablename__ = "subjects"
    id         = Column(String, primary_key=True, default=new_id)
    name       = Column(String(100), nullable=False)
    program_id = Column(String, ForeignKey("programs.id"), nullable=False)
    program    = relationship("Program", back_populates="subjects")
    chapters   = relationship("Chapter", back_populates="subject")
    journeys   = relationship("LearningJourney", back_populates="subject")
    worksheets = relationship("Worksheet", back_populates="subject")
    assessments= relationship("Assessment", back_populates="subject")


class Chapter(Base):
    __tablename__ = "chapters"
    id          = Column(String, primary_key=True, default=new_id)
    name        = Column(String(200), nullable=False)
    subject_id  = Column(String, ForeignKey("subjects.id"), nullable=False)
    order_index = Column(Integer, default=0)
    subject     = relationship("Subject", back_populates="chapters")
    concepts    = relationship("Concept", back_populates="chapter")


class Concept(Base):
    __tablename__ = "concepts"
    id          = Column(String, primary_key=True, default=new_id)
    name        = Column(String(200), nullable=False)
    description = Column(Text)
    chapter_id  = Column(String, ForeignKey("chapters.id"), nullable=False)
    chapter     = relationship("Chapter", back_populates="concepts")


# ─────────────────────────────────────────────────────────────────────────────
# 6. Learning Journey
# ─────────────────────────────────────────────────────────────────────────────
class LearningJourney(Base):
    __tablename__ = "learning_journeys"

    id               = Column(String, primary_key=True, default=new_id)
    student_id       = Column(String, ForeignKey("students.id"), nullable=False)
    teacher_id       = Column(String, ForeignKey("teachers.id"))
    subject_id       = Column(String, ForeignKey("subjects.id"))
    title            = Column(String(255))
    status           = Column(String(30), default="draft")
    chapters         = Column(Text, default="[]")
    progress_percent = Column(Float, default=0.0)
    start_date       = Column(DateTime)
    end_date         = Column(DateTime)
    created_at       = Column(DateTime, default=now)

    student     = relationship("Student",  back_populates="journeys")
    teacher     = relationship("Teacher",  back_populates="journeys")
    subject     = relationship("Subject",  back_populates="journeys")
    classes     = relationship("Class",    back_populates="journey")
    worksheets  = relationship("Worksheet",   back_populates="journey")
    assessments = relationship("Assessment",  back_populates="journey")
    bookings    = relationship("Booking",     back_populates="journey")
    ptms        = relationship("PTM",         back_populates="journey")


# ─────────────────────────────────────────────────────────────────────────────
# 7. Teacher Application & Offer
# ─────────────────────────────────────────────────────────────────────────────
class TeacherApplication(Base):
    __tablename__ = "teacher_applications"

    id         = Column(String, primary_key=True, default=new_id)
    teacher_id = Column(String, ForeignKey("teachers.id"), nullable=False)
    status     = Column(String(50), default="applied")
    stage_data = Column(Text, default="{}")
    notes      = Column(Text)
    created_at = Column(DateTime, default=now)
    updated_at = Column(DateTime, default=now, onupdate=now)

    teacher = relationship("Teacher", back_populates="applications")
    offers  = relationship("TeacherOffer", back_populates="application")


class TeacherOffer(Base):
    __tablename__ = "teacher_offers"

    id                = Column(String, primary_key=True, default=new_id)
    teacher_id        = Column(String, ForeignKey("teachers.id"), nullable=False)
    application_id    = Column(String, ForeignKey("teacher_applications.id"))
    subject           = Column(String(100))
    board             = Column(String(50))
    grade             = Column(String(10))
    program           = Column(String(50))
    learning_journey  = Column(String(255))
    chapters          = Column(Text, default="[]")
    concepts          = Column(Text, default="[]")
    teaching_format   = Column(String(50))
    sessions          = Column(Integer, default=0)
    session_duration  = Column(Integer, default=60)
    schedule          = Column(Text, default="{}")
    timezone          = Column(String(50), default="IST")
    start_date        = Column(DateTime)
    end_date          = Column(DateTime)
    teacher_rate      = Column(Float)
    currency          = Column(String(10), default="INR")
    commission_rate   = Column(Float)
    teacher_allocation= Column(Float)
    m1_amount         = Column(Float)
    m2_amount         = Column(Float)
    m3_amount         = Column(Float)
    deliverables      = Column(Text, default="[]")
    special_terms     = Column(Text)
    status            = Column(String(20), default="pending")
    offer_version     = Column(String(20), default="1.0")
    created_at        = Column(DateTime, default=now)

    teacher     = relationship("Teacher",             back_populates="offers")
    application = relationship("TeacherApplication",  back_populates="offers")
    acceptance  = relationship("TeacherOfferAcceptance", back_populates="offer", uselist=False)
    atc         = relationship("ATC", back_populates="offer", uselist=False)


class TeacherOfferAcceptance(Base):
    __tablename__ = "teacher_offer_acceptances"

    id                  = Column(String, primary_key=True, default=new_id)
    offer_id            = Column(String, ForeignKey("teacher_offers.id"), nullable=False)
    teacher_id          = Column(String, ForeignKey("teachers.id"), nullable=False)
    offered_rate        = Column(Float)
    currency            = Column(String(10))
    commission_output   = Column(Float)
    teacher_allocation  = Column(Float)
    accepted_at         = Column(DateTime, default=now)
    ip_address          = Column(String(50))
    user_agent          = Column(String(512))
    acceptance_event_id = Column(String, default=new_id)
    offer_version       = Column(String(20))
    status              = Column(String(20), default="accepted")

    offer = relationship("TeacherOffer", back_populates="acceptance")


# ─────────────────────────────────────────────────────────────────────────────
# 8. ATC / SOW
# ─────────────────────────────────────────────────────────────────────────────
class ATC(Base):
    __tablename__ = "atcs"

    id                = Column(String, primary_key=True, default=new_id)
    atc_reference     = Column(String(50), unique=True)
    teacher_id        = Column(String, ForeignKey("teachers.id"), nullable=False)
    student_name      = Column(String(255))
    batch_name        = Column(String(255))
    offer_id          = Column(String, ForeignKey("teacher_offers.id"))
    program           = Column(String(50))
    exam              = Column(String(50))
    board             = Column(String(50))
    grade             = Column(String(10))
    subject           = Column(String(100))
    learning_journey  = Column(String(255))
    chapters          = Column(Text, default="[]")
    concepts          = Column(Text, default="[]")
    format            = Column(String(50))
    sessions          = Column(Integer)
    hours             = Column(Float)
    schedule          = Column(Text, default="{}")
    timezone          = Column(String(50))
    start_date        = Column(DateTime)
    end_date          = Column(DateTime)
    teacher_rate      = Column(Float)
    currency          = Column(String(10), default="INR")
    teacher_allocation= Column(Float)
    m1                = Column(Float)
    m2                = Column(Float)
    m3                = Column(Float)
    deliverables      = Column(Text, default="[]")
    special_terms     = Column(Text)
    content_hash      = Column(String(64))
    status            = Column(String(20), default="draft")
    created_at        = Column(DateTime, default=now)

    teacher  = relationship("Teacher",     back_populates="atcs")
    offer    = relationship("TeacherOffer", back_populates="atc")
    agreement_acceptances = relationship("AgreementAcceptance", back_populates="atc")


# ─────────────────────────────────────────────────────────────────────────────
# 9. Faculty Agreement
# ─────────────────────────────────────────────────────────────────────────────
class FacultyAgreement(Base):
    __tablename__ = "faculty_agreements"

    id             = Column(String, primary_key=True, default=new_id)
    version        = Column(String(20), nullable=False)
    title          = Column(String(255), nullable=False)
    content        = Column(Text, nullable=False)
    content_hash   = Column(String(64))
    effective_date = Column(DateTime)
    is_active      = Column(Boolean, default=True)
    created_at     = Column(DateTime, default=now)

    acceptances = relationship("AgreementAcceptance", back_populates="agreement")


class AgreementAcceptance(Base):
    __tablename__ = "agreement_acceptances"

    id                   = Column(String, primary_key=True, default=new_id)
    teacher_id           = Column(String, ForeignKey("teachers.id"), nullable=False)
    agreement_id         = Column(String, ForeignKey("faculty_agreements.id"), nullable=False)
    atc_id               = Column(String, ForeignKey("atcs.id"))
    offer_acceptance_id  = Column(String)
    legal_name           = Column(String(255), nullable=False)
    acceptance_event_id  = Column(String, default=new_id)
    accepted_at          = Column(DateTime, default=now)
    timezone             = Column(String(50))
    ip_address           = Column(String(50))
    user_agent           = Column(String(512))
    document_hash        = Column(String(64))
    atc_hash             = Column(String(64))
    offer_snapshot       = Column(Text)
    checkboxes_completed = Column(Text, default="[]")
    status               = Column(String(20), default="signed")

    teacher   = relationship("Teacher",          back_populates="agreement_acceptances")
    agreement = relationship("FacultyAgreement", back_populates="acceptances")
    atc       = relationship("ATC",              back_populates="agreement_acceptances")


# ─────────────────────────────────────────────────────────────────────────────
# 10. Refund Policy
# ─────────────────────────────────────────────────────────────────────────────
class RefundPolicy(Base):
    __tablename__ = "refund_policies"

    id             = Column(String, primary_key=True, default=new_id)
    version        = Column(String(20), nullable=False)
    title          = Column(String(255), nullable=False)
    content        = Column(Text, nullable=False)
    content_hash   = Column(String(64))
    effective_date = Column(DateTime)
    is_active      = Column(Boolean, default=True)
    created_at     = Column(DateTime, default=now)

    acceptances = relationship("RefundAcceptance", back_populates="policy")


class RefundAcceptance(Base):
    __tablename__ = "refund_acceptances"

    id                  = Column(String, primary_key=True, default=new_id)
    user_id             = Column(String, ForeignKey("users.id"), nullable=False)
    student_name        = Column(String(255))
    order_id            = Column(String)
    policy_id           = Column(String, ForeignKey("refund_policies.id"), nullable=False)
    accepted_at         = Column(DateTime, default=now)
    ip_address          = Column(String(50))
    user_agent          = Column(String(512))
    policy_version      = Column(String(20))
    policy_hash         = Column(String(64))
    acceptance_event_id = Column(String, default=new_id)
    accepting_role      = Column(String(50))
    status              = Column(String(20), default="accepted")

    policy = relationship("RefundPolicy", back_populates="acceptances")


# ─────────────────────────────────────────────────────────────────────────────
# 11. Booking & Payment
# ─────────────────────────────────────────────────────────────────────────────
class Booking(Base):
    __tablename__ = "bookings"

    id                   = Column(String, primary_key=True, default=new_id)
    booking_ref          = Column(String(50), unique=True)
    student_id           = Column(String, ForeignKey("students.id"), nullable=False)
    teacher_id           = Column(String, ForeignKey("teachers.id"))
    journey_id           = Column(String, ForeignKey("learning_journeys.id"))
    booking_type         = Column(String(50))
    status               = Column(String(20), default="pending")
    total_amount         = Column(Float)
    currency             = Column(String(10), default="INR")
    payment_status       = Column(String(20), default="unpaid")
    refund_acceptance_id = Column(String, ForeignKey("refund_acceptances.id"))
    notes                = Column(Text)
    created_at           = Column(DateTime, default=now)

    student          = relationship("Student",         back_populates="bookings")
    journey          = relationship("LearningJourney", back_populates="bookings")
    payments         = relationship("Payment",         back_populates="booking")
    escrow           = relationship("Escrow",          back_populates="booking", uselist=False)
    refund_acceptance= relationship("RefundAcceptance", foreign_keys=[refund_acceptance_id])


class Payment(Base):
    __tablename__ = "payments"

    id                  = Column(String, primary_key=True, default=new_id)
    booking_id          = Column(String, ForeignKey("bookings.id"), nullable=False)
    provider            = Column(String(50), default="mock")
    provider_order_id   = Column(String(255))
    provider_payment_id = Column(String(255))
    amount              = Column(Float, nullable=False)
    currency            = Column(String(10), default="INR")
    status              = Column(String(20), default="pending")
    payment_method      = Column(String(50))
    idempotency_key     = Column(String(100), unique=True)
    webhook_received    = Column(Boolean, default=False)
    verified_at         = Column(DateTime)
    created_at          = Column(DateTime, default=now)

    booking = relationship("Booking", back_populates="payments")


# ─────────────────────────────────────────────────────────────────────────────
# 12. Escrow & Wallet
# ─────────────────────────────────────────────────────────────────────────────
class Escrow(Base):
    __tablename__ = "escrows"

    id             = Column(String, primary_key=True, default=new_id)
    booking_id     = Column(String, ForeignKey("bookings.id"), nullable=False, unique=True)
    teacher_id     = Column(String, ForeignKey("teachers.id"), nullable=False)
    total_amount   = Column(Float)
    m1_amount      = Column(Float)
    m1_status      = Column(String(30), default="pending")
    m1_released_at = Column(DateTime)
    m2_amount      = Column(Float)
    m2_status      = Column(String(30), default="pending")
    m2_released_at = Column(DateTime)
    m3_amount      = Column(Float)
    m3_status      = Column(String(30), default="pending")
    m3_released_at = Column(DateTime)
    created_at     = Column(DateTime, default=now)

    booking      = relationship("Booking",           back_populates="escrow")
    teacher      = relationship("Teacher",           back_populates="escrows")
    transactions = relationship("WalletTransaction", back_populates="escrow")


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id             = Column(String, primary_key=True, default=new_id)
    teacher_id     = Column(String, ForeignKey("teachers.id"), nullable=False)
    escrow_id      = Column(String, ForeignKey("escrows.id"))
    amount         = Column(Float, nullable=False)
    type           = Column(String(10))   # credit / debit
    milestone      = Column(String(10))
    description    = Column(String(255))
    status         = Column(String(30), default="completed")
    transaction_id = Column(String(100), unique=True, default=new_id)
    created_at     = Column(DateTime, default=now)

    teacher = relationship("Teacher", back_populates="wallet_txns")
    escrow  = relationship("Escrow",  back_populates="transactions")


# ─────────────────────────────────────────────────────────────────────────────
# 13. Classes & Attendance
# ─────────────────────────────────────────────────────────────────────────────
class Class(Base):
    __tablename__ = "classes"

    id               = Column(String, primary_key=True, default=new_id)
    class_ref        = Column(String(50))
    journey_id       = Column(String, ForeignKey("learning_journeys.id"))
    teacher_id       = Column(String, ForeignKey("teachers.id"))
    student_id       = Column(String, ForeignKey("students.id"))
    scheduled_at     = Column(DateTime)
    status           = Column(String(20), default="scheduled")
    chapter          = Column(String(255))
    concepts_taught  = Column(Text, default="[]")
    duration_minutes = Column(Integer, default=60)
    jitsi_room       = Column(String(255))
    class_notes      = Column(Text)
    completed_at     = Column(DateTime)
    created_at       = Column(DateTime, default=now)

    journey    = relationship("LearningJourney", back_populates="classes")
    teacher    = relationship("Teacher",         back_populates="classes")
    student    = relationship("Student",         back_populates="classes")
    attendance = relationship("Attendance",      back_populates="cls")
    worksheets = relationship("Worksheet",       back_populates="cls")


class Attendance(Base):
    __tablename__ = "attendances"

    id         = Column(String, primary_key=True, default=new_id)
    class_id   = Column(String, ForeignKey("classes.id"), nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    status     = Column(String(20), default="absent")
    marked_at  = Column(DateTime, default=now)

    cls     = relationship("Class",   back_populates="attendance")
    student = relationship("Student", back_populates="attendances")


# ─────────────────────────────────────────────────────────────────────────────
# 14. Content — Worksheets & Assessments
# ─────────────────────────────────────────────────────────────────────────────
class Worksheet(Base):
    __tablename__ = "worksheets"

    id              = Column(String, primary_key=True, default=new_id)
    class_id        = Column(String, ForeignKey("classes.id"))
    journey_id      = Column(String, ForeignKey("learning_journeys.id"))
    subject_id      = Column(String, ForeignKey("subjects.id"))
    teacher_id      = Column(String, ForeignKey("teachers.id"))
    chapter         = Column(String(255))
    concepts        = Column(Text, default="[]")
    questions       = Column(Text, default="[]")
    answer_key      = Column(Text, default="[]")
    difficulty_mix  = Column(Text, default="{}")
    estimated_mins  = Column(Integer, default=30)
    status          = Column(String(30), default="ai_generated")
    ai_quality_flags= Column(Text, default="[]")
    ai_confidence   = Column(Float)
    teacher_notes   = Column(Text)
    generated_at    = Column(DateTime, default=now)
    reviewed_at     = Column(DateTime)
    released_at     = Column(DateTime)
    due_date        = Column(DateTime)
    created_at      = Column(DateTime, default=now)

    cls         = relationship("Class",           back_populates="worksheets")
    journey     = relationship("LearningJourney", back_populates="worksheets")
    subject     = relationship("Subject",         back_populates="worksheets")
    teacher     = relationship("Teacher",         back_populates="worksheets")
    submissions = relationship("Submission",      back_populates="worksheet")


class Assessment(Base):
    __tablename__ = "assessments"

    id              = Column(String, primary_key=True, default=new_id)
    journey_id      = Column(String, ForeignKey("learning_journeys.id"))
    subject_id      = Column(String, ForeignKey("subjects.id"))
    teacher_id      = Column(String, ForeignKey("teachers.id"))
    title           = Column(String(255))
    chapter         = Column(String(255))
    concepts        = Column(Text, default="[]")
    questions       = Column(Text, default="[]")
    answer_key      = Column(Text, default="[]")
    paper_type      = Column(String(50), default="chapter_test")
    total_marks     = Column(Integer, default=100)
    duration_mins   = Column(Integer, default=180)
    status          = Column(String(30), default="ai_generated")
    ai_quality_flags= Column(Text, default="[]")
    generated_at    = Column(DateTime, default=now)
    released_at     = Column(DateTime)
    due_date        = Column(DateTime)

    journey     = relationship("LearningJourney", back_populates="assessments")
    subject     = relationship("Subject",         back_populates="assessments")
    submissions = relationship("Submission",      back_populates="assessment")


# ─────────────────────────────────────────────────────────────────────────────
# 15. Question Bank
# ─────────────────────────────────────────────────────────────────────────────
class QuestionBankItem(Base):
    __tablename__ = "question_bank"

    id             = Column(String, primary_key=True, default=new_id)
    board          = Column(String(50))
    grade          = Column(String(10))
    exam           = Column(String(50))
    subject        = Column(String(100))
    chapter        = Column(String(255))
    concept        = Column(String(255))
    question_text  = Column(Text, nullable=False)
    options        = Column(Text, default="[]")
    correct_answer = Column(Text)
    explanation    = Column(Text)
    question_type  = Column(String(30))
    difficulty     = Column(String(10))
    learning_obj   = Column(Text)
    ai_confidence  = Column(Float)
    teacher_status = Column(String(20), default="pending")
    usage_count    = Column(Integer, default=0)
    source         = Column(String(100), default="ai_generated")
    created_at     = Column(DateTime, default=now)


# ─────────────────────────────────────────────────────────────────────────────
# 16. Submissions
# ─────────────────────────────────────────────────────────────────────────────
class Submission(Base):
    __tablename__ = "submissions"

    id                  = Column(String, primary_key=True, default=new_id)
    student_id          = Column(String, ForeignKey("students.id"), nullable=False)
    worksheet_id        = Column(String, ForeignKey("worksheets.id"))
    assessment_id       = Column(String, ForeignKey("assessments.id"))
    submission_type     = Column(String(50))
    answers             = Column(Text, default="[]")
    file_path           = Column(String(512))
    submitted_at        = Column(DateTime, default=now)
    status              = Column(String(30), default="submitted")
    score               = Column(Float)
    max_score           = Column(Float)
    ai_feedback         = Column(Text, default="{}")
    ai_suggested_result = Column(Float)
    teacher_feedback    = Column(Text)
    released_at         = Column(DateTime)

    student    = relationship("Student",    back_populates="submissions")
    worksheet  = relationship("Worksheet",  back_populates="submissions")
    assessment = relationship("Assessment", back_populates="submissions")


# ─────────────────────────────────────────────────────────────────────────────
# 17. Notifications
# ─────────────────────────────────────────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"

    id          = Column(String, primary_key=True, default=new_id)
    user_id     = Column(String, ForeignKey("users.id"), nullable=False)
    title       = Column(String(255), nullable=False)
    body        = Column(Text)
    type        = Column(String(50))
    read        = Column(Boolean, default=False)
    entity_id   = Column(String)
    entity_type = Column(String(50))
    created_at  = Column(DateTime, default=now)

    user = relationship("User", back_populates="notifications")


# ─────────────────────────────────────────────────────────────────────────────
# 18. PTM
# ─────────────────────────────────────────────────────────────────────────────
class PTM(Base):
    __tablename__ = "ptms"

    id              = Column(String, primary_key=True, default=new_id)
    journey_id      = Column(String, ForeignKey("learning_journeys.id"))
    teacher_id      = Column(String, ForeignKey("teachers.id"))
    parent_id       = Column(String, ForeignKey("parents.id"))
    scheduled_at    = Column(DateTime)
    status          = Column(String(20), default="scheduled")
    notes           = Column(Text)
    summary         = Column(Text)
    recommendations = Column(Text)
    acknowledged_at = Column(DateTime)
    created_at      = Column(DateTime, default=now)

    journey = relationship("LearningJourney", back_populates="ptms")
    parent  = relationship("Parent",          back_populates="ptms")


# ─────────────────────────────────────────────────────────────────────────────
# 19. Audit Log  (NOTE: column named 'event_metadata' not 'metadata' — reserved)
# ─────────────────────────────────────────────────────────────────────────────
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id             = Column(String, primary_key=True, default=new_id)
    event_id       = Column(String, default=new_id, unique=True)
    actor_id       = Column(String, ForeignKey("users.id"))
    actor_role     = Column(String(50))
    entity_type    = Column(String(100))
    entity_id      = Column(String)
    action         = Column(String(100), nullable=False)
    timestamp      = Column(DateTime, default=now)
    status         = Column(String(30), default="success")
    event_metadata = Column(Text, default="{}")    # NOT 'metadata' — reserved by SQLAlchemy

    actor = relationship("User", back_populates="audit_logs", foreign_keys=[actor_id])

    __table_args__ = (
        Index("ix_audit_entity", "entity_type", "entity_id"),
        Index("ix_audit_actor",  "actor_id",    "timestamp"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 20. Teacher Tier Engine
# ─────────────────────────────────────────────────────────────────────────────
class TeacherTier(Base):
    __tablename__ = "teacher_tiers"

    id                  = Column(String, primary_key=True, default=new_id)
    level               = Column(Integer, unique=True, nullable=False)
    name                = Column(String(50), nullable=False)
    code                = Column(String(20), unique=True, nullable=False)
    description         = Column(Text)
    min_experience_yrs  = Column(Float, default=1.0)
    min_classes         = Column(Integer, default=50)
    rating_threshold    = Column(Float, default=4.5)
    student_boost_pct   = Column(Float, default=15.0)
    base_hourly_inr     = Column(Float, default=1200.0)
    base_hourly_usd     = Column(Float, default=25.0)
    commission_modifier = Column(Float, default=0.0)
    badge_label         = Column(String(50), default="Verified")
    badge_color         = Column(String(20), default="blue")
    is_active           = Column(Boolean, default=True)
    created_at          = Column(DateTime, default=now)


# ─────────────────────────────────────────────────────────────────────────────
# 21. Smart Learning Batches (1:Many Format, 25-30 Students)
# ─────────────────────────────────────────────────────────────────────────────
class Batch(Base):
    __tablename__ = "batches"

    id               = Column(String, primary_key=True, default=new_id)
    batch_ref        = Column(String(50), unique=True, nullable=False)
    course_name      = Column(String(255), nullable=False)
    subject          = Column(String(100), nullable=False)
    board            = Column(String(50), default="CBSE")
    grade            = Column(String(20), default="11")
    exam             = Column(String(50), default="JEE Main & Advanced")
    teacher_id       = Column(String, ForeignKey("teachers.id"))
    start_date       = Column(DateTime)
    end_date         = Column(DateTime)
    days_schedule    = Column(String(100), default="Mon, Wed, Fri")
    time_slot        = Column(String(50), default="7:00 PM IST")
    timezone         = Column(String(50), default="IST")
    sessions_count   = Column(Integer, default=24)
    session_duration = Column(Integer, default=60)
    min_capacity     = Column(Integer, default=25)
    max_capacity     = Column(Integer, default=30)
    enrolled_count   = Column(Integer, default=0)
    status           = Column(String(30), default="open")
    jitsi_room       = Column(String(255))
    price_inr        = Column(Float, default=14999.0)
    currency         = Column(String(10), default="INR")
    chapter          = Column(String(255))
    student_need     = Column(String(255))
    teaching_hours   = Column(Integer, default=10)
    product_type     = Column(String(50), default="Micro Sprint")
    priority         = Column(String(10), default="P0")
    launch_month     = Column(String(20))
    source_note      = Column(Text)
    faculty_name     = Column(String(255))
    faculty_title    = Column(String(255))
    faculty_avatar   = Column(String(512))
    faculty_tier     = Column(String(50), default="Master")
    faculty_rating   = Column(Float, default=4.9)
    revenue_at_capacity = Column(Float)
    created_at       = Column(DateTime, default=now)

    teacher     = relationship("Teacher", foreign_keys=[teacher_id])
    enrollments = relationship("BatchEnrollment", back_populates="batch")


class BatchEnrollment(Base):
    __tablename__ = "batch_enrollments"

    id          = Column(String, primary_key=True, default=new_id)
    batch_id    = Column(String, ForeignKey("batches.id"), nullable=False)
    student_id  = Column(String, ForeignKey("students.id"), nullable=False)
    student_name= Column(String(255))
    enrolled_at = Column(DateTime, default=now)
    status      = Column(String(30), default="active")

    batch   = relationship("Batch", back_populates="enrollments")
    student = relationship("Student", foreign_keys=[student_id])


# ─────────────────────────────────────────────────────────────────────────────
# 22. Diagnostic Assessment Engine & Learning DNA
# ─────────────────────────────────────────────────────────────────────────────
class DiagnosticQuestion(Base):
    __tablename__ = "diagnostic_questions"

    id             = Column(String, primary_key=True, default=new_id)
    subject        = Column(String(100), nullable=False)
    topic          = Column(String(100), nullable=False)
    subtopic       = Column(String(100))
    grade          = Column(String(20), default="11")
    exam           = Column(String(50), default="JEE")
    question_text  = Column(Text, nullable=False)
    options        = Column(Text, default="[]")
    correct_option = Column(Integer, default=0)
    explanation    = Column(Text)
    difficulty     = Column(String(20), default="medium")
    concept_tested = Column(String(100))


class DiagnosticAttempt(Base):
    __tablename__ = "diagnostic_attempts"

    id                    = Column(String, primary_key=True, default=new_id)
    student_id            = Column(String, ForeignKey("students.id"), nullable=False)
    subject               = Column(String(100), default="Physics")
    score                 = Column(Integer, default=0)
    total_questions       = Column(Integer, default=10)
    accuracy_pct          = Column(Float, default=0.0)
    time_taken_seconds    = Column(Integer, default=1200)
    strengths             = Column(Text, default="[]")
    weaknesses            = Column(Text, default="[]")
    learning_dna_snapshot = Column(Text, default="{}")
    created_at            = Column(DateTime, default=now)

    student = relationship("Student", foreign_keys=[student_id])


# ─────────────────────────────────────────────────────────────────────────────
# 23. Teacher Verification & Documents (9-Step Pipeline)
# ─────────────────────────────────────────────────────────────────────────────
class TeacherVerification(Base):
    __tablename__ = "teacher_verifications"

    id           = Column(String, primary_key=True, default=new_id)
    teacher_id   = Column(String, ForeignKey("teachers.id"), nullable=False)
    step_number  = Column(Integer, default=1)
    step_name    = Column(String(100), nullable=False)
    status       = Column(String(30), default="pending")
    score        = Column(Float)
    notes        = Column(Text)
    reviewer_id  = Column(String)
    completed_at = Column(DateTime)
    created_at   = Column(DateTime, default=now)

    teacher = relationship("Teacher", foreign_keys=[teacher_id])


class TeacherDocument(Base):
    __tablename__ = "teacher_documents"

    id           = Column(String, primary_key=True, default=new_id)
    teacher_id   = Column(String, ForeignKey("teachers.id"), nullable=False)
    doc_type     = Column(String(50), nullable=False)
    file_name    = Column(String(255), nullable=False)
    file_url     = Column(String(512), nullable=False)
    status       = Column(String(30), default="verified")
    uploaded_at  = Column(DateTime, default=now)
    verified_at  = Column(DateTime)

    teacher = relationship("Teacher", foreign_keys=[teacher_id])


# ─────────────────────────────────────────────────────────────────────────────
# 24. Academic Health Score (0-100 Tracking)
# ─────────────────────────────────────────────────────────────────────────────
class AcademicHealthScoreRecord(Base):
    __tablename__ = "academic_health_scores"

    id              = Column(String, primary_key=True, default=new_id)
    student_id      = Column(String, ForeignKey("students.id"), nullable=False)
    overall_score   = Column(Integer, default=85)
    attendance_score= Column(Integer, default=92)
    homework_score  = Column(Integer, default=80)
    assessment_score= Column(Integer, default=84)
    concept_mastery = Column(Integer, default=86)
    consistency_rate= Column(Integer, default=88)
    trend           = Column(String(20), default="improving")
    recommendations = Column(Text, default="[]")
    calculated_at   = Column(DateTime, default=now)

    student = relationship("Student", foreign_keys=[student_id])
