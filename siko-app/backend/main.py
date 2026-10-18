"""
SIKO Production Backend — FastAPI Application
Full-stack API server with authentication, role-based access,
all business domains, and production-ready architecture.
"""

import os
import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

# ── Add backend directory to path ─────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import create_tables
from routers import auth, users, students, teachers, subjects, journeys
from routers import classes, worksheets, assessments, submissions
from routers import payments, escrow, wallet, notifications, audit
from routers import admin, ai_content, ptm
from routers import batches, diagnostics, teacher_tiers, matching, finance

# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    # Seed demo data
    try:
        from seed import seed_database
        seed_database()
    except Exception as e:
        print(f"[SEED] Warning: {e}")
    yield
    # Shutdown
    print("[SIKO] Server shutting down.")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SIKO Production API",
    version="1.0.0",
    description="Global Education Platform — Your classroom. Your teacher. Your learning journey. Anywhere.",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,          prefix="/api/auth",          tags=["Authentication"])
app.include_router(users.router,         prefix="/api/users",         tags=["Users"])
app.include_router(students.router,      prefix="/api/students",      tags=["Students"])
app.include_router(teachers.router,      prefix="/api/teachers",      tags=["Teachers"])
app.include_router(subjects.router,      prefix="/api/subjects",      tags=["Academic Structure"])
app.include_router(journeys.router,      prefix="/api/journeys",      tags=["Learning Journeys"])
app.include_router(classes.router,       prefix="/api/classes",       tags=["Classes"])
app.include_router(worksheets.router,    prefix="/api/worksheets",    tags=["Worksheets & Assessments"])
app.include_router(assessments.router,   prefix="/api/assessments",   tags=["Assessments"])
app.include_router(submissions.router,   prefix="/api/submissions",   tags=["Submissions"])
app.include_router(payments.router,      prefix="/api/payments",      tags=["Payments"])
app.include_router(escrow.router,        prefix="/api/escrow",        tags=["Escrow & Wallet"])
app.include_router(wallet.router,        prefix="/api/wallet",        tags=["Wallet"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(audit.router,         prefix="/api/audit",         tags=["Audit Logs"])
app.include_router(admin.router,         prefix="/api/admin",         tags=["Admin"])
app.include_router(ai_content.router,    prefix="/api/ai",            tags=["AI Content"])
app.include_router(ptm.router,           prefix="/api/ptm",           tags=["PTM"])
app.include_router(batches.router,       prefix="/api/batches",       tags=["Smart Learning Batches"])
app.include_router(diagnostics.router,   prefix="/api/diagnostics",   tags=["Diagnostics & Learning DNA"])
app.include_router(teacher_tiers.router, prefix="/api/teacher-tiers", tags=["Teacher Tiers"])
app.include_router(matching.router,      prefix="/api/matching",      tags=["AI Teacher Matching"])
app.include_router(finance.router,       prefix="/api/finance",       tags=["CFO Financial & Teaching Hours Engine"])

# ── Teacher Onboarding Auto-Mail Lifecycle Endpoints ──────────────────────────
_TEACHER_AUTO_MAIL_LOGS = []

@app.post("/api/teacher-onboarding/auto-mail", tags=["Teachers"])
async def dispatch_teacher_auto_mail(request: Request):
    try:
        payload = await request.json()
    except Exception:
        payload = {}
    stage = payload.get("stage", "APPLICATION_RECEIVED")
    teacher_name = payload.get("fullName", "Dr. Ananya Sharma")
    email = payload.get("email", "ananya.sharma@iitd.ac.in")
    standards = payload.get("standards", ["Class 11", "Class 12"])
    subjects = payload.get("subjects", ["Physics"])
    boards = payload.get("boards", ["CBSE", "JEE Main & Advanced"])
    approved_rate = payload.get("approvedRate", 1750)
    subject_line = payload.get("subjectLine", f"[SIKO Eduventures] {stage} — {teacher_name}")
    body_preview = payload.get("bodyPreview", "")
    record = {
        "id": f"MAIL-{len(_TEACHER_AUTO_MAIL_LOGS) + 1001}",
        "stage": stage,
        "teacherName": teacher_name,
        "email": email,
        "standards": standards,
        "subjects": subjects,
        "boards": boards,
        "approvedRate": approved_rate,
        "subjectLine": subject_line,
        "bodyPreview": body_preview,
        "status": "DISPATCHED_AND_DELIVERED",
    }
    _TEACHER_AUTO_MAIL_LOGS.insert(0, record)
    return {"status": "ok", "dispatched": True, "mailRecord": record, "totalSent": len(_TEACHER_AUTO_MAIL_LOGS)}

@app.get("/api/teacher-onboarding/auto-mail-logs", tags=["Teachers"])
async def list_teacher_auto_mail_logs():
    return {"status": "ok", "logs": _TEACHER_AUTO_MAIL_LOGS}

# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "SIKO Production API",
        "environment": os.getenv("APP_ENV", "development"),
    }

from fastapi.staticfiles import StaticFiles

# ── Static Frontend Files (Full-Stack SPA & Assets) ───────────────────────────
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


if __name__ == "__main__":
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
