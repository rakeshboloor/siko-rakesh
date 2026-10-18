"""
SIKO Diagnostic Assessment & Learning DNA Router
Provides 20-minute diagnostic questions, scoring, and dynamic Learning DNA updates.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json

from database import get_db
from models import DiagnosticQuestion, DiagnosticAttempt, Student, User, AuditLog
from auth import get_current_user, get_optional_current_user
from services.diagnostic_service import diagnostic_engine
from services.ai_service import ai_service, sanitize_ai_payload

router = APIRouter()

class SubmitDiagnosticRequest(BaseModel):
    subject: Optional[str] = "Physics"
    time_taken_seconds: Optional[int] = 900
    answers: Optional[Any] = None

class GenerateDifficultyQuestionsRequest(BaseModel):
    topic: str
    subject: Optional[str] = "Science"
    grade: Optional[str] = "10"
    exam: Optional[str] = "CBSE"
    difficulty_tier: Optional[str] = "Intermediate"

class EvaluateCustomDiagnosticRequest(BaseModel):
    topic: str
    subject: Optional[str] = "Science"
    answers: Optional[Any] = None
    time_taken_seconds: Optional[int] = 180
    questions: Optional[List[Dict[str, Any]]] = None

class OnboardingDiagnosticRequest(BaseModel):
    subject: Optional[str] = "Mathematics"
    grade: Optional[str] = "11"
    board: Optional[str] = "CBSE"
    exam: Optional[str] = "JEE"
    learning_style: Optional[str] = "Visual & First-Principles Derivation"
    answers: Optional[Any] = None
    questions: Optional[List[Dict[str, Any]]] = None
    student_name: Optional[str] = "Riya Sharma"
    time_taken_seconds: Optional[int] = 420

class JourneyRoadmapRequest(BaseModel):
    subject: Optional[str] = "Mathematics"
    grade: Optional[str] = "11"
    exam: Optional[str] = "JEE"
    learning_dna: Optional[Dict[str, Any]] = None

@router.get("/onboarding-questions")
def get_onboarding_questions(
    subject: str = "Mathematics",
    grade: str = "11",
    board: str = "CBSE",
    exam: str = "JEE",
    learning_style: str = "Visual & First-Principles Derivation"
):
    """
    Synthesizes 5 dynamic, subject-specific diagnostic probe questions
    for the student onboarding flow powered by Gemini/ChatGPT/SIKO Pedagogical Engine.
    """
    return ai_service.generate_onboarding_diagnostic(
        subject=subject,
        grade=grade,
        board=board,
        exam=exam,
        learning_style=learning_style
    )

@router.post("/submit-onboarding")
def submit_onboarding_diagnostic(
    req: OnboardingDiagnosticRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates onboarding diagnostic responses and synthesizes student's
    unique Learning DNA profile and Subject Journey Roadmap.
    """
    student_name = req.student_name or "Riya Sharma"
    if current_user and current_user.full_name:
        student_name = current_user.full_name

    res = ai_service.evaluate_onboarding_diagnostic(
        subject=req.subject or "Mathematics",
        answers=req.answers or {},
        questions=req.questions or [],
        student_name=student_name,
        learning_style=req.learning_style or "Visual & First-Principles Derivation",
        grade=req.grade or "11",
        exam=req.exam or "JEE",
        time_taken_seconds=req.time_taken_seconds or 420
    )

    # Persist Learning DNA into database if user is authenticated or demo student
    if current_user:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student:
            student.learning_dna = res.get("dna")
            student.onboarding_complete = True
            db.commit()

    return res

@router.post("/journey-roadmap")
def get_journey_roadmap(req: JourneyRoadmapRequest):
    """
    Returns the dynamically calibrated academic journey roadmap for the given subject.
    """
    return ai_service.generate_academic_journey_roadmap(
        subject=req.subject or "Mathematics",
        grade=req.grade or "11",
        exam=req.exam or "JEE",
        learning_dna=req.learning_dna
    )

@router.get("/questions")
def get_diagnostic_questions(
    subject: str = "Mathematics",
    grade: str = "11",
    exam: str = "JEE",
    db: Session = Depends(get_db)
):
    sub_lower = (subject or "Mathematics").lower()
    if any(k in sub_lower for k in ["math", "calculus", "algebra", "trig"]):
        norm_sub = "Mathematics"
    elif any(k in sub_lower for k in ["phys", "mechanic", "kinematic", "optics", "motion"]):
        norm_sub = "Physics"
    elif any(k in sub_lower for k in ["chem", "organic", "inorganic", "bonding"]):
        norm_sub = "Chemistry"
    elif any(k in sub_lower for k in ["bio", "nephron", "genetics", "cell", "plant", "physiol"]):
        norm_sub = "Biology"
    else:
        norm_sub = subject

    questions = db.query(DiagnosticQuestion).filter(
        DiagnosticQuestion.subject.ilike(f"%{norm_sub}%")
    ).limit(15).all()

    if questions:
        return sanitize_ai_payload([
            {
                "id": q.id,
                "subject": q.subject,
                "topic": q.topic,
                "subtopic": q.subtopic,
                "question_text": q.question_text,
                "options": json.loads(q.options) if isinstance(q.options, str) else q.options,
                "difficulty": q.difficulty,
                "concept_tested": q.concept_tested,
            }
            for q in questions
        ])

    # Synthesize authentic questions for the exact requested subject
    onboarding_pack = ai_service.generate_onboarding_diagnostic(norm_sub, grade, "CBSE", exam)
    return sanitize_ai_payload([
        {
            "id": f"dyn-{q['id']}",
            "subject": norm_sub,
            "topic": q.get("concept", norm_sub),
            "subtopic": q.get("cognitive_tag", "Core Concept"),
            "question_text": q["question"],
            "options": q["options"],
            "difficulty": q.get("difficulty", "medium"),
            "concept_tested": q.get("concept", norm_sub)
        }
        for q in onboarding_pack.get("questions", [])
    ])

@router.post("/submit")
def submit_diagnostic(
    req: SubmitDiagnosticRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    # Parse answers in whatever format provided
    answers_list = []
    if isinstance(req.answers, list):
        for idx, a in enumerate(req.answers):
            if isinstance(a, dict):
                answers_list.append({
                    "question_id": str(a.get("question_id", f"q{idx+1}")),
                    "selected_option": int(a.get("selected_option", 0))
                })
            elif isinstance(a, (int, str)):
                try:
                    answers_list.append({
                        "question_id": f"q{idx+1}",
                        "selected_option": int(a)
                    })
                except Exception:
                    pass
    elif isinstance(req.answers, dict):
        for k, v in req.answers.items():
            try:
                answers_list.append({
                    "question_id": str(k),
                    "selected_option": int(v) if isinstance(v, (int, str)) and str(v).isdigit() else 0
                })
            except Exception:
                pass

    # Lookup questions if question_id matches DB IDs
    q_ids = [a["question_id"] for a in answers_list]
    db_questions = db.query(DiagnosticQuestion).filter(DiagnosticQuestion.id.in_(q_ids)).all() if q_ids else []
    q_lookup = {
        q.id: {
            "correct_option": q.correct_option,
            "topic": q.topic,
            "concept": q.concept_tested
        }
        for q in db_questions
    }

    # Evaluate using DiagnosticEngine
    eval_result = diagnostic_engine.evaluate_diagnostic(
        answers=answers_list,
        questions_lookup=q_lookup,
        time_taken_seconds=req.time_taken_seconds or 900
    )

    # Save to student record if logged in or fallback student
    student = None
    if current_user and current_user.student:
        student = current_user.student
    elif current_user:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()

    if student:
        student.learning_dna = json.dumps(eval_result["learning_dna"])
        student.diagnostic_done = True

        attempt = DiagnosticAttempt(
            student_id=student.id,
            subject=req.subject,
            score=eval_result["score"],
            total_questions=eval_result["total_questions"],
            accuracy_pct=eval_result["accuracy_pct"],
            time_taken_seconds=req.time_taken_seconds,
            strengths=json.dumps(eval_result["strengths"]),
            weaknesses=json.dumps(eval_result["weaknesses"]),
            learning_dna_snapshot=json.dumps(eval_result["learning_dna"])
        )
        db.add(attempt)
        db.add(AuditLog(
            actor_id=current_user.id,
            actor_role=current_user.role,
            entity_type="diagnostic_attempt",
            entity_id=attempt.id,
            action="diagnostic_assessment_completed",
            event_metadata=json.dumps({"accuracy": eval_result["accuracy_pct"], "subject": req.subject})
        ))
        db.commit()

    return {
        "success": True,
        "score": eval_result["score"],
        "total": eval_result["total_questions"],
        "accuracy_pct": eval_result["accuracy_pct"],
        "score_percentage": eval_result["accuracy_pct"],
        "time_taken_seconds": req.time_taken_seconds or 900,
        "strengths": eval_result["strengths"],
        "weaknesses": eval_result["weaknesses"],
        "learning_dna": eval_result["learning_dna"],
        "dna": eval_result["learning_dna"],
        "message": "Diagnostic assessment completed! Learning DNA updated."
    }

@router.post("/generate-questions")
def generate_difficulty_questions(
    req: GenerateDifficultyQuestionsRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates 4 tailored diagnostic probe questions specifically targeting the student's
    reported topic of difficulty, via Gemini REST API or SIKO Curriculum Engine.
    """
    dna = None
    if current_user and current_user.student and current_user.student.learning_dna:
        try:
            dna = json.loads(current_user.student.learning_dna)
        except Exception:
            pass
    if not dna:
        student = db.query(Student).first()
        if student and student.learning_dna:
            try:
                dna = json.loads(student.learning_dna)
            except Exception:
                pass

    result = ai_service.generate_difficulty_dna_questions(
        topic_of_difficulty=req.topic,
        subject=req.subject or "Science",
        grade=req.grade or "10",
        exam_track=req.exam or "CBSE",
        difficulty_tier=req.difficulty_tier or "Intermediate",
        student_learning_dna=dna
    )
    return result


@router.post("/evaluate-custom")
def evaluate_custom_diagnostic(
    req: EvaluateCustomDiagnosticRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates student answers on their weak topic diagnostic, shows first-principles solutions,
    and dynamically recalibrates their Learning DNA profile in real time.
    """
    questions = req.questions or []
    # If questions not supplied in payload, regenerate them to get reference answers
    if not questions:
        gen = ai_service.generate_difficulty_dna_questions(
            topic_of_difficulty=req.topic,
            subject=req.subject or "Science"
        )
        questions = gen.get("questions", [])

    answers_dict = {}
    if isinstance(req.answers, list):
        for idx, a in enumerate(req.answers):
            if isinstance(a, dict):
                qid = str(a.get("question_id", f"q{idx+1}"))
                opt = int(a.get("selected_index", a.get("selected_option", 0)))
                answers_dict[qid] = opt
            elif isinstance(a, (int, str)) and str(a).isdigit():
                answers_dict[f"q{idx+1}"] = int(a)
    elif isinstance(req.answers, dict):
        for k, v in req.answers.items():
            if isinstance(v, (int, str)) and str(v).isdigit():
                answers_dict[str(k)] = int(v)

    correct_count = 0
    total_count = len(questions) or 4
    solutions = []

    for idx, q in enumerate(questions):
        qid = q.get("id", f"q{idx+1}")
        correct_idx = int(q.get("correct_index", 0))
        selected_idx = answers_dict.get(qid, answers_dict.get(f"q{idx+1}", -1))
        is_correct = (selected_idx == correct_idx)
        if is_correct:
            correct_count += 1

        solutions.append({
            "question_id": qid,
            "question_text": q.get("question_text", ""),
            "options": q.get("options", []),
            "selected_index": selected_idx,
            "correct_index": correct_idx,
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
            "concept_diagnosed": q.get("concept_diagnosed", req.topic),
            "misconception_flagged": q.get("misconception_flagged", "")
        })

    accuracy_pct = round((correct_count / total_count * 100), 1) if total_count > 0 else 0.0

    # Retrieve student record to update Learning DNA
    student = None
    if current_user and current_user.student:
        student = current_user.student
    elif current_user:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        student = db.query(Student).first()

    dna = {}
    if student and student.learning_dna:
        try:
            dna = json.loads(student.learning_dna)
        except Exception:
            dna = {}

    if not dna:
        dna = {
            "overall_mastery_pct": 82.0,
            "accuracy": 82,
            "healthScore": 82,
            "learningSpeed": "Fast",
            "problemSolvingStyle": "Visual Intuition + Stepwise Proof",
            "conceptMastery": 78,
            "strengths": ["Kinematics & Motion"],
            "focusAreas": [req.topic]
        }

    # Dynamically update concept mastery map
    concept_map = dna.get("concept_mastery") or dna.get("conceptMasteryMap") or {}
    concept_map[req.topic] = accuracy_pct
    dna["concept_mastery"] = concept_map

    # Update overall accuracy & health score
    old_acc = float(dna.get("accuracy", 80))
    new_acc = round(old_acc * 0.7 + accuracy_pct * 0.3, 1)
    dna["accuracy"] = new_acc
    dna["overall_mastery_pct"] = new_acc
    dna["conceptMastery"] = round(float(dna.get("conceptMastery", 76)) * 0.7 + accuracy_pct * 0.3, 1)
    dna["healthScore"] = min(98, max(50, round(new_acc * 0.95 + 4)))

    # Update Strengths & Focus Areas based on score
    strengths = dna.get("strengths") or []
    focus_areas = dna.get("focusAreas") or []

    # Clean existing topic entries
    strengths = [s for s in strengths if not s.startswith(req.topic)]
    focus_areas = [f for f in focus_areas if not f.startswith(req.topic)]

    if accuracy_pct >= 75.0:
        strengths.insert(0, f"{req.topic} ({accuracy_pct}%)")
        dna["primary_weakness"] = focus_areas[0] if focus_areas else "Advanced Multi-Concept Problems"
    else:
        focus_areas.insert(0, f"{req.topic} ({accuracy_pct}%)")
        dna["primary_weakness"] = f"{req.topic} (Needs Focused Practice)"

    dna["strengths"] = strengths[:4]
    dna["focusAreas"] = focus_areas[:4]
    dna["recommended_focus"] = f"Targeted revision in {req.topic} with first-principles practice"

    # Persist updated Learning DNA in DB
    if student:
        student.learning_dna = json.dumps(dna)
        student.diagnostic_done = True
        attempt = DiagnosticAttempt(
            student_id=student.id,
            subject=req.subject or "Science",
            score=correct_count,
            total_questions=total_count,
            accuracy_pct=accuracy_pct,
            time_taken_seconds=req.time_taken_seconds or 180,
            strengths=json.dumps([f"{req.topic} ({accuracy_pct}%)"] if accuracy_pct >= 75 else []),
            weaknesses=json.dumps([f"{req.topic} ({accuracy_pct}%)"] if accuracy_pct < 75 else []),
            learning_dna_snapshot=json.dumps(dna)
        )
        db.add(attempt)
        db.commit()

    return {
        "success": True,
        "topic": req.topic,
        "subject": req.subject,
        "score": correct_count,
        "total": total_count,
        "accuracy_pct": accuracy_pct,
        "solutions": solutions,
        "learning_dna": dna,
        "dna": dna,
        "message": f"Diagnostic complete! Your Learning DNA has been dynamically updated for '{req.topic}'."
    }


@router.get("/dna")
def get_learning_dna(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    student = current_user.student if current_user else None
    if not student:
        student = db.query(Student).first()

    dna = json.loads(student.learning_dna or "{}") if student else {}
    if not dna:
        dna = {
            "overall_mastery_pct": 84.5,
            "accuracy": 84,
            "healthScore": 82,
            "learning_style": "Visual & Analytical",
            "learningSpeed": "Fast",
            "speed_profile": "Deliberate & Precise",
            "retention_index": 89,
            "concept_mastery": {
                "Mechanics & Kinematics": 92.0,
                "Rotational Dynamics": 74.5,
                "Work & Energy": 88.0,
                "Electrodynamics": 78.0,
                "Thermodynamics": 85.0
            },
            "strengths": ["Mechanics & Kinematics", "Work & Energy"],
            "focusAreas": ["Rotational Dynamics (74.5%)", "Electrodynamics (78.0%)"],
            "primary_weakness": "Rotational Inertia Multi-Body Problems",
            "recommended_focus": "Moment of Inertia Integration & Angular Momentum Drills",
            "recommended_format": "1:1 Personalised Learning"
        }

    return {
        "student_id": student.id if student else None,
        "learning_dna": dna,
        "dna": dna,
        "diagnostic_done": student.diagnostic_done if student else True
    }
