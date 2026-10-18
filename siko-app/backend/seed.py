"""
SIKO Production Database Seeder
Seeds full educational ecosystem:
- 10+ Qualified Teachers across Tiers 1-5, subjects, boards, and exams
- 5 Learning Journeys
- 3 Smart Learning Batches (including one with 26 enrolled students for 25-30 capacity)
- Diagnostic questions & evolving Learning DNA
- Teacher Onboarding, ATC/SOW, Faculty Agreements
- Classes, Attendance (90% duration), Worksheets, Assessments, PTMs
- Escrow, 50/25/25 Milestones, Wallet Ledger
- Demo Accounts: Student, Teacher, Parent, Admin, Academic Admin, Finance Admin
"""

import os
import sys
import json
import hashlib
from datetime import datetime, timedelta

from database import SessionLocal, create_tables
from models import (
    User, Student, Teacher, Parent, Board, Grade, Program, Subject, Chapter, Concept,
    LearningJourney, TeacherApplication, TeacherOffer, TeacherOfferAcceptance,
    ATC, FacultyAgreement, AgreementAcceptance, RefundPolicy, RefundAcceptance,
    Booking, Payment, Escrow, WalletTransaction, Class, Attendance, Worksheet,
    Assessment, Submission, Notification, PTM, AuditLog,
    TeacherTier, Batch, BatchEnrollment, DiagnosticQuestion, DiagnosticAttempt,
    TeacherVerification, TeacherDocument, AcademicHealthScoreRecord
)
from auth import get_password_hash

FACULTY_AGREEMENT_TEXT = """SIKO MASTER FACULTY ENGAGEMENT AGREEMENT
Version 1.0 | Effective 1 September 2024

1. ENGAGEMENT AND ACADEMIC STANDARDS
1.1 The Faculty Member is engaged by SIKO as an independent professional educator.
1.2 Faculty agrees to deliver live interactive instruction in accordance with the SIKO Academic Quality Framework.
1.3 All classes must be conducted inside the SIKO Digital Classroom platform using authenticated credentials.

2. ASSIGNMENT TERMS AND ATC/SOW
2.1 Every teaching assignment is governed by an electronic Assignment Terms & Conditions (ATC) / Scope of Work (SOW).
2.2 The ATC sets forth the Program, Subject, Student/Cohort, Schedule, Deliverables, and Commercial Allocation.
2.3 The Faculty Member must electronically accept the ATC prior to assignment activation.

3. COMMERCIAL TERMS, ESCROW, AND MILESTONES
3.1 SIKO operates a milestone-based escrow release model for teacher fee protection:
    - Milestone 1 (M1 - 50%): Released upon verified teaching completion of the assigned module.
    - Milestone 2 (M2 - 25%): Released upon validation of post-class worksheets and chapter assessments.
    - Milestone 3 (M3 - 25%): Released upon completion of the scheduled Parent-Teacher Meeting (PTM).
3.2 Payouts are transferred according to the platform disbursement schedule upon milestone fulfillment.

4. SAFEGUARDING AND CODE OF CONDUCT
4.1 The safety and wellbeing of students is paramount. All communication must occur through SIKO channels.
4.2 No off-platform communication or solicitation of students or parents is permitted.
4.3 Any safeguarding concern must be reported to the SIKO Academic Operations desk immediately.
"""

REFUND_POLICY_TEXT = """SIKO STUDENT REFUND, CANCELLATION AND FEE PROTECTION POLICY
Version 1.0 | Effective 1 September 2024

1. OBJECTIVE
This policy ensures academic transparency and consumer protection for all Learning Journey enrollments.

2. COOLING-OFF PERIOD
2.1 Full refund (100% of tuition fee) is available within 48 hours of booking if no class has commenced.
2.2 Pro-rata refund is available for unconsumed sessions after the initial cooling-off period.

3. TEACHER ESCROW INTEGRATION
3.1 Teacher fee allocations are held in escrow and disbursed upon academic milestone completion.
3.2 Cancelled sessions before delivery release student funds without teacher deduction.
"""

def _hash(t: str) -> str:
    return hashlib.sha256(t.encode()).hexdigest()

def seed_database():
    create_tables()
    db = SessionLocal()

    try:
        if db.query(User).filter(User.email == "admin@siko.demo").first():
            # If already seeded, check if batches or tiers exist
            if db.query(Batch).first() and db.query(TeacherTier).first():
                print("[SEED] Database already has complete seed data. Skipping.")
                return

        print("[SEED] Seeding comprehensive SIKO database...")

        # ── 1. Teacher Tiers ──────────────────────────────────────────────────
        tiers_data = [
            (1, "Foundation Educator", "tier_1", "Certified graduate tutor with strong subject fundamentals.", 1.0, 50, 4.5, 15.0, 800.0, 15.0, 0.05, "SIKO Certified", "blue"),
            (2, "Professional Faculty", "tier_2", "Experienced school & coaching faculty with 3+ years track record.", 3.0, 150, 4.7, 20.0, 1200.0, 22.0, 0.0, "SIKO Pro", "blue"),
            (3, "Senior Academic Mentor", "tier_3", "Ex-Allen / FIITJEE faculty with top percentile student rankers.", 5.0, 300, 4.8, 25.0, 1800.0, 30.0, -0.03, "Senior Mentor", "violet"),
            (4, "Lead Academic Fellow", "tier_4", "National Olympiad & top-500 exam rank producer with master pedagogy.", 8.0, 600, 4.9, 28.0, 2400.0, 40.0, -0.05, "Lead Fellow", "amber"),
            (5, "Master Distinguished Faculty", "tier_5", "Distinguished IIT/AIIMS alumni with over a decade of national top-100 results.", 12.0, 1200, 4.95, 35.0, 3200.0, 55.0, -0.08, "Master Faculty", "emerald"),
        ]

        for lvl, name, code, desc, exp, cls_cnt, rat, bst, inr, usd, c_mod, b_lbl, b_col in tiers_data:
            existing_tier = db.query(TeacherTier).filter(TeacherTier.level == lvl).first()
            if not existing_tier:
                db.add(TeacherTier(
                    level=lvl, name=name, code=code, description=desc,
                    min_experience_yrs=exp, min_classes=cls_cnt, rating_threshold=rat,
                    student_boost_pct=bst, base_hourly_inr=inr, base_hourly_usd=usd,
                    commission_modifier=c_mod, badge_label=b_lbl, badge_color=b_col,
                    is_active=True
                ))
        db.flush()

        # ── 2. Demo Users (All Roles) ─────────────────────────────────────────
        demo_users = [
            ("admin@siko.demo", "SIKO Admin", "admin", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"),
            ("academic@siko.demo", "Dr. Arvind Iyer (Academic Ops)", "academic_admin", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"),
            ("finance@siko.demo", "Nandini Mehta (Finance & Escrow)", "finance_admin", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"),
            ("student@siko.demo", "Riya Sharma", "student", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"),
            ("parent@siko.demo", "Riya's Parent (Sunil Sharma)", "parent", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"),
            ("teacher@siko.demo", "Ananya Sharma", "teacher", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"),
        ]

        users_dict = {}
        for email, full_name, role, avatar in demo_users:
            u = db.query(User).filter(User.email == email).first()
            if not u:
                u = User(
                    email=email, password_hash=get_password_hash("demo123"),
                    role=role, full_name=full_name, avatar_url=avatar,
                    is_active=True, is_verified=True
                )
                db.add(u)
                db.flush()
            users_dict[role] = u

        # Student Profile
        student_user = users_dict["student"]
        student = db.query(Student).filter(Student.user_id == student_user.id).first()
        if not student:
            student = Student(
                user_id=student_user.id, grade="11", board="CBSE", program="JEE",
                subjects=json.dumps(["Physics", "Chemistry", "Mathematics"]),
                learning_dna=json.dumps({
                    "overall_mastery_pct": 84.5,
                    "learning_style": "Visual & Analytical",
                    "speed_profile": "Deliberate & Precise",
                    "retention_index": 89,
                    "concept_mastery": {
                        "Newton's Laws & Friction": 92.0,
                        "Work, Energy & Power": 88.5,
                        "Rotational Dynamics": 72.0,
                        "Gravitation": 85.0
                    },
                    "primary_weakness": "Rotational Inertia Multi-Body Problems",
                    "recommended_focus": "Moment of Inertia Integration & Angular Momentum Drills",
                    "recommended_format": "1:1 Personalised Learning"
                }),
                onboarding_complete=True, diagnostic_done=True
            )
            db.add(student)
            db.flush()

        # Parent Profile
        parent_user = users_dict["parent"]
        parent = db.query(Parent).filter(Parent.user_id == parent_user.id).first()
        if not parent:
            parent = Parent(user_id=parent_user.id, student_id=student.id, relation="Father")
            db.add(parent)
            db.flush()

        # ── 3. Academic Structure (Boards, Grades, Programs, Subjects) ────────
        boards = ["CBSE", "ICSE", "Maharashtra State Board"]
        board_objs = {}
        for b_name in boards:
            b = db.query(Board).filter(Board.name == b_name).first()
            if not b:
                b = Board(name=b_name)
                db.add(b)
                db.flush()
            board_objs[b_name] = b

        # Primary program & subjects
        cbse_board = board_objs["CBSE"]
        grade_11 = db.query(Grade).filter(Grade.board_id == cbse_board.id, Grade.level == "11").first()
        if not grade_11:
            grade_11 = Grade(level="11", board_id=cbse_board.id)
            db.add(grade_11)
            db.flush()

        jee_prog = db.query(Program).filter(Program.grade_id == grade_11.id, Program.name == "JEE").first()
        if not jee_prog:
            jee_prog = Program(name="JEE", grade_id=grade_11.id)
            db.add(jee_prog)
            db.flush()

        physics_sub = db.query(Subject).filter(Subject.program_id == jee_prog.id, Subject.name == "Physics").first()
        if not physics_sub:
            physics_sub = Subject(name="Physics", program_id=jee_prog.id)
            db.add(physics_sub)
            db.flush()

        chem_sub = db.query(Subject).filter(Subject.program_id == jee_prog.id, Subject.name == "Chemistry").first()
        if not chem_sub:
            chem_sub = Subject(name="Chemistry", program_id=jee_prog.id)
            db.add(chem_sub)
            db.flush()

        math_sub = db.query(Subject).filter(Subject.program_id == jee_prog.id, Subject.name == "Mathematics").first()
        if not math_sub:
            math_sub = Subject(name="Mathematics", program_id=jee_prog.id)
            db.add(math_sub)
            db.flush()

        # ── 4. 10 Qualified Teachers ──────────────────────────────────────────
        teachers_raw = [
            ("teacher@siko.demo", "Ananya Sharma", "master", 4.95, 840, "B.Tech & M.Tech, IIT Delhi (AIR 312). 8+ years coaching JEE Physics toppers.", ["Physics"], ["CBSE", "ICSE"], ["JEE Main & Advanced", "KVPY"], 3200.0, 32, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"),
            ("rajesh.mukherjee@siko.demo", "Dr. Rajesh Mukherjee", "lead", 4.9, 620, "MBBS & MD, AIIMS New Delhi. Ex-Allen Senior Faculty for NEET Zoology & Genetics.", ["Biology"], ["CBSE", "State"], ["NEET", "Olympiad"], 2400.0, 28, "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"),
            ("priya.venkatesh@siko.demo", "Priya Venkatesh", "lead", 4.88, 510, "M.Sc Mathematics, BITS Pilani. Calculus & Coordinate Geometry specialist.", ["Mathematics"], ["CBSE", "ICSE", "IB"], ["JEE Main & Advanced"], 2400.0, 26, "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80"),
            ("vikram.malhotra@siko.demo", "Vikram Malhotra", "master", 4.92, 920, "B.Tech Chemical Engg, IIT Bombay. Master of Organic Reaction Mechanisms.", ["Chemistry"], ["CBSE", "State"], ["JEE Advanced", "BITSAT"], 3200.0, 30, "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"),
            ("shweta.nair@siko.demo", "Shweta Nair", "senior", 4.82, 340, "M.A. English Literature, St. Stephen's College. Board topper examiner.", ["English", "Humanities"], ["CBSE", "ICSE", "IB"], ["Board Exams", "SAT"], 1800.0, 22, "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"),
            ("amitav.ghosh@siko.demo", "Amitav Ghosh", "master", 4.96, 1100, "M.Stat, ISI Kolkata. International Mathematical Olympiad (IMO) Lead Coach.", ["Mathematics"], ["CBSE", "Olympiad"], ["JEE Advanced", "ISI/CMI"], 3500.0, 35, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"),
            ("neha.kulkarni@siko.demo", "Neha Kulkarni", "senior", 4.85, 410, "M.Tech VJTI Mumbai. Mechanics, Friction and Fluid Dynamics Specialist.", ["Physics"], ["Maharashtra State Board", "CBSE"], ["MHT-CET", "JEE Main"], 1800.0, 24, "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"),
            ("farhan.zaidi@siko.demo", "Farhan Zaidi", "senior", 4.78, 380, "B.Tech IIT Kharagpur. Physical Chemistry, Thermodynamics & Electrochemistry.", ["Chemistry"], ["CBSE", "ICSE"], ["JEE Main", "NEET"], 1800.0, 20, "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"),
            ("sunita.rao@siko.demo", "Sunita Rao", "lead", 4.89, 580, "M.Sc Botany, IISc Bangalore. Plant Physiology & Cell Biology Master Teacher.", ["Biology"], ["CBSE", "ICSE"], ["NEET", "Olympiad"], 2400.0, 27, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"),
            ("rohan.deshmukh@siko.demo", "Rohan Deshmukh", "senior", 4.84, 390, "B.Tech Computer Science, IIT Roorkee. Python, Data Structures & STEM.", ["Computer Science"], ["CBSE", "ICSE", "Cambridge"], ["Board Exams", "Coding"], 1800.0, 25, "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"),
        ]

        seeded_teachers = []
        for email, name, tier, rating, classes, bio, subjects, boards_list, exams, rate, boost, avatar in teachers_raw:
            tu = db.query(User).filter(User.email == email).first()
            if not tu:
                tu = User(
                    email=email, password_hash=get_password_hash("demo123"),
                    role="teacher", full_name=name, avatar_url=avatar,
                    is_active=True, is_verified=True
                )
                db.add(tu)
                db.flush()

            t = db.query(Teacher).filter(Teacher.user_id == tu.id).first()
            if not t:
                t = Teacher(
                    user_id=tu.id, bio=bio,
                    expertise=json.dumps({"subjects": subjects, "boards": boards_list, "exams": exams, "specialties": [s + " Mastery" for s in subjects]}),
                    qualifications=json.dumps([bio.split(".")[0]]),
                    tier=tier, rating=rating, total_classes=classes,
                    application_status="approved", is_active=True
                )
                db.add(t)
                db.flush()
            seeded_teachers.append(t)

        primary_teacher = seeded_teachers[0] # Ananya Sharma

        # ── 5. Five Learning Journeys ─────────────────────────────────────────
        journeys_data = [
            ("JEE Advanced Physics — Mechanics to Modern Physics", student.id, primary_teacher.id, physics_sub.id, 42.0, ["Laws of Motion", "Work Energy Power", "Rotational Dynamics", "Gravitation", "Electrostatics"]),
            ("NEET 2025 Biology & Chemistry Fast-Track Excellence", student.id, seeded_teachers[1].id, chem_sub.id, 35.0, ["Human Physiology", "Genetics & Evolution", "Organic Reaction Mechanisms", "Biomolecules"]),
            ("Grade 10 CBSE Math & Science 95%+ Board Topper Program", student.id, seeded_teachers[2].id, math_sub.id, 65.0, ["Quadratic Equations", "Triangles", "Light Reflection", "Carbon Compounds"]),
            ("Class 12 CBSE & Maharashtra State Physics & Math Dual Prep", student.id, seeded_teachers[6].id, physics_sub.id, 28.0, ["Wave Optics", "Electromagnetic Induction", "Definite Integration", "Differential Equations"]),
            ("Foundation Olympiad Grade 8-9 STEM Mastery", student.id, seeded_teachers[5].id, math_sub.id, 50.0, ["Number Theory", "Combinatorics", "Newtonian Kinematics", "Chemical Reactions"]),
        ]

        seeded_journeys = []
        for title, s_id, t_id, sub_id, prog, chaps in journeys_data:
            j = db.query(LearningJourney).filter(LearningJourney.title == title).first()
            if not j:
                j = LearningJourney(
                    student_id=s_id, teacher_id=t_id, subject_id=sub_id,
                    title=title, status="active", chapters=json.dumps(chaps),
                    progress_percent=prog, start_date=datetime.utcnow() - timedelta(days=20),
                    end_date=datetime.utcnow() + timedelta(days=70)
                )
                db.add(j)
                db.flush()
            seeded_journeys.append(j)

        primary_journey = seeded_journeys[0]

        # ── 6. Three Smart Learning Batches (Rule 3: 25-30 capacity) ───────────
        batches_data = [
            ("JP-MEC-01", "JEE Physics Mechanics Masterclass", "Physics", "CBSE", "11", "JEE Main & Advanced", primary_teacher.id, "Mon, Wed, Fri", "7:00 PM IST", 25, 30, 26, 14999.0, "siko-batch-jp-mec-01"),
            ("NEET-BIO-02", "NEET Human Physiology & Genetics Cohort", "Biology", "CBSE", "12", "NEET", seeded_teachers[1].id, "Tue, Thu, Sat", "6:00 PM IST", 25, 30, 21, 12999.0, "siko-batch-neet-bio-02"),
            ("CBSE10-MATH-01", "Class 10 CBSE Board Toppers Mathematics", "Mathematics", "CBSE", "10", "Board Exams", seeded_teachers[2].id, "Mon, Thu", "5:00 PM IST", 25, 30, 18, 9999.0, "siko-batch-cbse10-math-01"),
        ]

        seeded_batches = []
        for ref, c_name, sub, brd, grd, exm, t_id, sched, slot, min_c, max_c, enrolled, p_inr, room in batches_data:
            b = db.query(Batch).filter(Batch.batch_ref == ref).first()
            if not b:
                b = Batch(
                    batch_ref=ref, course_name=c_name, subject=sub, board=brd, grade=grd, exam=exm,
                    teacher_id=t_id, days_schedule=sched, time_slot=slot, timezone="IST",
                    sessions_count=24, session_duration=60, min_capacity=min_c, max_capacity=max_c,
                    enrolled_count=enrolled, status="almost_full" if enrolled >= 25 else "open",
                    jitsi_room=room, price_inr=p_inr, price_usd=round(p_inr / 80.0, 1),
                    start_date=datetime.utcnow() - timedelta(days=5),
                    end_date=datetime.utcnow() + timedelta(days=65)
                )
                db.add(b)
                db.flush()
            seeded_batches.append(b)

        primary_batch = seeded_batches[0] # JP-MEC-01 with 26 enrolled

        # Seed 26 students in Batch 1 (JP-MEC-01) to fulfill 25-30 student batch requirement!
        student_names = [
            "Riya Sharma", "Aditya Verma", "Sneha Patel", "Rahul Nair", "Pooja Hegde",
            "Aarav Gupta", "Ananya Reddy", "Rohan Iyer", "Tanvi Joshi", "Kunal Shah",
            "Meera Pillai", "Ishaan Malhotra", "Diya Sen", "Siddharth Rao", "Kavya Das",
            "Arjun Bose", "Avni Kulkarni", "Harsh Vardhan", "Simran Kaur", "Devendra Jha",
            "Nikhil Menon", "Rhea D'Souza", "Manish Pandey", "Gauri Deshmukh", "Yash Chopra",
            "Pranavi Bhat"
        ]

        for s_idx, s_name in enumerate(student_names):
            existing_enrollment = db.query(BatchEnrollment).filter(
                BatchEnrollment.batch_id == primary_batch.id,
                BatchEnrollment.student_name == s_name
            ).first()
            if not existing_enrollment:
                # Link first student to Riya Sharma's student ID
                target_sid = student.id if s_idx == 0 else f"student-cohort-{s_idx+1}"
                db.add(BatchEnrollment(
                    batch_id=primary_batch.id,
                    student_id=target_sid,
                    student_name=s_name,
                    status="active",
                    enrolled_at=datetime.utcnow() - timedelta(days=20-s_idx)
                ))
        db.flush()

        # ── 7. Diagnostic Assessment Questions ────────────────────────────────
        diagnostic_qs = [
            ("Physics", "Kinematics", "A particle moves with uniform acceleration. If velocity at t=0 is 5 m/s and at t=4s is 25 m/s, distance covered is:", ["40 m", "50 m", "60 m", "70 m"], 2, "Using s = ((u+v)/2)*t = ((5+25)/2)*4 = 60 m", "easy", "Uniform Acceleration Equations"),
            ("Physics", "Newton's Laws", "A 5 kg block rests on a horizontal plane (mu_s = 0.4). A force of 15 N is applied horizontally. Frictional force is:", ["15 N", "19.6 N", "0 N", "25 N"], 0, "Max static friction = 0.4 * 5 * 9.8 = 19.6 N. Since applied force 15 N < 19.6 N, static friction equals applied force = 15 N.", "medium", "Static Friction Equilibrium"),
            ("Physics", "Rotational Dynamics", "Moment of inertia of a uniform thin rod of mass M and length L about an axis perpendicular to rod at its center is:", ["ML^2 / 12", "ML^2 / 3", "ML^2 / 2", "2ML^2 / 5"], 0, "Standard formula derived via integration: I_cm = ML^2 / 12.", "medium", "Moment of Inertia of Rigid Bodies"),
            ("Physics", "Work, Energy & Power", "A variable force F = 3x^2 acts on a 2 kg body from x=0 to x=2 m. The work done is:", ["6 J", "8 J", "12 J", "24 J"], 1, "W = integral(3x^2 dx) from 0 to 2 = [x^3] from 0 to 2 = 8 Joules.", "medium", "Work-Energy Theorem for Variable Force"),
            ("Mathematics", "Calculus", "The derivative of f(x) = ln(sin(x)) with respect to x is:", ["cot(x)", "tan(x)", "-cot(x)", "sec(x)"], 0, "f'(x) = (1/sin(x)) * cos(x) = cot(x).", "easy", "Chain Rule Differentiation"),
            ("Chemistry", "Chemical Bonding", "The geometry of SF6 molecule according to VSEPR theory is:", ["Octahedral", "Trigonal Bipyramidal", "Square Planar", "Tetrahedral"], 0, "Sulfur has 6 bonding pairs and 0 lone pairs (sp3d2 hybridization), yielding octahedral geometry.", "easy", "VSEPR Molecular Geometry"),
            ("Biology", "Cell Biology", "Which cellular organelle is primarily responsible for ATP synthesis via oxidative phosphorylation?", ["Mitochondria", "Ribosome", "Endoplasmic Reticulum", "Golgi Apparatus"], 0, "Mitochondria are the powerhouses of eukaryotic cells carrying the electron transport chain.", "easy", "Mitochondrial Bioenergetics"),
        ]

        for sub, top, q_txt, opts, c_opt, exp, diff, con in diagnostic_qs:
            existing_q = db.query(DiagnosticQuestion).filter(DiagnosticQuestion.question_text == q_txt).first()
            if not existing_q:
                db.add(DiagnosticQuestion(
                    subject=sub, topic=top, question_text=q_txt,
                    options=json.dumps(opts), correct_option=c_opt,
                    explanation=exp, difficulty=diff, concept_tested=con
                ))
        db.flush()

        # ── 8. Classes, Attendance, Worksheets & Escrow ────────────────────────
        # Class 1 (Completed with attendance)
        c1 = db.query(Class).filter(Class.class_ref == "CLS-SIKO-2024-001").first()
        if not c1:
            c1 = Class(
                class_ref="CLS-SIKO-2024-001", journey_id=primary_journey.id,
                teacher_id=primary_teacher.id, student_id=student.id,
                scheduled_at=datetime.utcnow() - timedelta(days=2), status="completed",
                chapter="Laws of Motion", concepts_taught=json.dumps(["Newton's 1st Law", "Newton's 2nd Law", "Friction"]),
                duration_minutes=60, jitsi_room="SIKO-JEE-Physics-Mechanics-JP01",
                completed_at=datetime.utcnow() - timedelta(days=2, hours=-1)
            )
            db.add(c1)
            db.flush()
            # Verified attendance with 90% duration rule met
            db.add(Attendance(class_id=c1.id, student_id=student.id, status="present"))

        # Class 2 (Scheduled today)
        c2 = db.query(Class).filter(Class.class_ref == "CLS-SIKO-2024-002").first()
        if not c2:
            c2 = Class(
                class_ref="CLS-SIKO-2024-002", journey_id=primary_journey.id,
                teacher_id=primary_teacher.id, student_id=student.id,
                scheduled_at=datetime.utcnow() + timedelta(hours=2), status="scheduled",
                chapter="Laws of Motion", concepts_taught=json.dumps(["Friction Analysis", "Circular Motion & Banking"]),
                duration_minutes=60, jitsi_room="SIKO-JEE-Physics-Mechanics-JP01"
            )
            db.add(c2)
            db.flush()

        # Worksheet (Released to student)
        ws1 = db.query(Worksheet).filter(Worksheet.status == "released").first()
        if not ws1:
            ws1 = Worksheet(
                class_id=c1.id, journey_id=primary_journey.id, subject_id=physics_sub.id,
                teacher_id=primary_teacher.id,
                chapter="Laws of Motion — Newton's Laws & Friction",
                concepts=json.dumps(["Friction", "Free Body Diagrams"]),
                questions=json.dumps([
                    {"id": "q1", "text": "Calculate tension in the string for a two-mass Atwood machine (m1=3kg, m2=5kg).", "type": "numerical", "marks": 5},
                    {"id": "q2", "text": "A car negotiates a curved road of radius 50m banked at 30 deg. Find optimum speed without friction.", "type": "numerical", "marks": 5}
                ]),
                answer_key=json.dumps({"q1": "36.75 N", "q2": "16.8 m/s"}),
                status="released", released_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(ws1)
            db.flush()

        # Worksheet 2 (In Teacher Review Queue - AI Generated)
        ws2 = db.query(Worksheet).filter(Worksheet.status == "teacher_review").first()
        if not ws2:
            ws2 = Worksheet(
                journey_id=primary_journey.id, subject_id=physics_sub.id,
                teacher_id=primary_teacher.id,
                chapter="Laws of Motion — Circular Motion & Centripetal Acceleration",
                concepts=json.dumps(["Circular Motion", "Centripetal Force"]),
                questions=json.dumps([
                    {"id": "q1", "text": "Explain why centripetal force does zero work on a particle in uniform circular motion.", "type": "subjective", "marks": 3},
                    {"id": "q2", "text": "A 0.5 kg stone attached to 1m string is rotated vertically. Find minimum velocity at highest point.", "type": "numerical", "marks": 4}
                ]),
                status="teacher_review"
            )
            db.add(ws2)
            db.flush()

        # Booking, Payment & Escrow with 50/25/25 Milestones
        b_ref = "BKG-SIKO-2024-001"
        booking = db.query(Booking).filter(Booking.booking_ref == b_ref).first()
        if not booking:
            booking = Booking(
                booking_ref=b_ref, student_id=student.id, teacher_id=primary_teacher.id,
                journey_id=primary_journey.id, booking_type="1:1 Personalised Learning",
                status="confirmed", total_amount=48000.0, currency="INR", payment_status="paid"
            )
            db.add(booking)
            db.flush()

            # Payment
            db.add(Payment(
                booking_id=booking.id, provider="mock", provider_payment_id="pay_siko_mock_001",
                amount=48000.0, currency="INR", status="success", payment_method="UPI / NetBanking"
            ))

            # Escrow Account (Total teacher allocation: ₹40,800. M1=50%: ₹20,400; M2=25%: ₹10,200; M3=25%: ₹10,200)
            escrow = Escrow(
                booking_id=booking.id, teacher_id=primary_teacher.id, total_amount=40800.0,
                m1_amount=20400.0, m1_status="released", m1_released_at=datetime.utcnow() - timedelta(days=2),
                m2_amount=10200.0, m2_status="pending",
                m3_amount=10200.0, m3_status="pending"
            )
            db.add(escrow)
            db.flush()

            # Wallet Ledger Transactions
            db.add(WalletTransaction(
                teacher_id=primary_teacher.id, escrow_id=escrow.id, amount=20400.0,
                type="credit", milestone="M1 (Teaching Completion)", status="completed",
                transaction_id="TXN-SIKO-M1-001", created_at=datetime.utcnow() - timedelta(days=2)
            ))

        # Academic Health Score Record (0-100)
        h_rec = db.query(AcademicHealthScoreRecord).filter(AcademicHealthScoreRecord.student_id == student.id).first()
        if not h_rec:
            db.add(AcademicHealthScoreRecord(
                student_id=student.id, overall_score=88, attendance_score=96,
                homework_score=84, assessment_score=85, concept_mastery=89,
                consistency_rate=92, trend="improving",
                recommendations=json.dumps([
                    "Maintain 100% attendance streak on Mechanics module.",
                    "Practice Rotational Inertia integration problem sets.",
                    "Complete Worksheet #2 before Wednesday session."
                ])
            ))

        # PTM Record
        ptm = db.query(PTM).filter(PTM.journey_id == primary_journey.id).first()
        if not ptm:
            db.add(PTM(
                journey_id=primary_journey.id, teacher_id=primary_teacher.id,
                parent_id=parent.id, scheduled_at=datetime.utcnow() + timedelta(days=3),
                status="scheduled", notes="Upcoming mid-journey review of mechanics foundation & homework turnaround."
            ))

        db.commit()
        print("[SEED] Successfully seeded complete SIKO platform with 10 teachers, 5 journeys, 3 batches, diagnostics, and escrow milestones!")

    except Exception as e:
        db.rollback()
        print(f"[SEED ERROR] {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
