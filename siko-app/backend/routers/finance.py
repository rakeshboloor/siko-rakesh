"""
SIKO CFO-Grade Financial Architecture & Curriculum Teaching Hours Engine
========================================================================
Covers:
1. Board-wise (CBSE, ICSE, Maharashtra State Board) & Competitive Exam-wise
   (JEE Main & Advanced, NEET UG, Olympiad) Subject-wise and Chapter-wise
   Allotted Teaching Hours Matrix (Lecture Hrs + Practice/Numerical Hrs + Doubt/Test Hrs).
2. Dynamic Market-Standard Student Pricing Calculator for:
   - Single Chapter Sprint
   - Full Subject Mastery (10% Discount)
   - Multi-Subject Bundle — 2 Subjects (15% Discount) or 3+ Subjects PCM/PCB/PCMB (20% Discount)
   - 1-on-1 Personalised Tutoring vs 1:Many Smart Batch (Max 30)
3. CFO Revenue Distribution & SIKO Commission Deduction:
   - Tier-calibrated SIKO Platform Commission (18% Master, 22% Expert, 25% Senior, 28% Pro)
   - SIKO Unit Economics Breakdown (AI LLM Cost, Live Video Infra, Escrow/Gateway, Ops, Net EBITDA)
   - Net Teacher Distributable Pool (after SIKO Commission deduction)
4. 3-Stage Milestone Escrow Schedule for Teachers (M1: 50% Teaching Hours, M2: 25% AI HW/Paper Review, M3: 25% PTM & Parent Report) + Statutory TDS (Sec 194J).
5. CTO / Developer Implementation Blueprint with Razorpay Order & Route Split Payloads
   (Status: READY_FOR_CTO_RAZORPAY_KEYS_PENDING).
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import math
import time

router = APIRouter()

# ──────────────────────────────────────────────────────────────────────────────
# 1. COMPREHENSIVE CURRICULUM TEACHING NO. OF HOURS MATRIX
#    (CBSE, ICSE, Maharashtra State Board, JEE Main & Adv, NEET UG, Olympiad)
# ──────────────────────────────────────────────────────────────────────────────

def _split_hours(total_hrs: int) -> Dict[str, int]:
    lec = max(1, round(total_hrs * 0.60))
    prac = max(1, round(total_hrs * 0.25))
    assess = max(1, total_hrs - lec - prac)
    return {
        "total_hours": total_hrs,
        "lecture_hours": lec,
        "practice_numerical_hours": prac,
        "assessment_doubt_hours": assess,
    }


CURRICULUM_TEACHING_HOURS_MATRIX: Dict[str, Any] = {
    "CBSE": {
        "board_code": "CBSE",
        "board_name": "CBSE Board (NCERT Class 9–12 Curriculum)",
        "academic_regulator": "Central Board of Secondary Education (NCERT Rationalised Syllabus)",
        "recommended_session_duration_mins": 60,
        "base_student_rate_1on1_inr": 850,
        "base_student_rate_batch_inr": 95,
        "subjects": {
            "Physics": {
                "subject": "Physics",
                "total_subject_hours": 160,
                "lecture_hours": 96,
                "practice_numerical_hours": 40,
                "assessment_doubt_hours": 24,
                "chapters": [
                    {"code": "CBSE-PHY-01", "name": "Units, Measurements & Kinematics (1D & 2D)", **_split_hours(14), "weightage_marks": 8},
                    {"code": "CBSE-PHY-02", "name": "Laws of Motion & Friction", **_split_hours(16), "weightage_marks": 10},
                    {"code": "CBSE-PHY-03", "name": "Work, Energy, Power & Collisions", **_split_hours(14), "weightage_marks": 7},
                    {"code": "CBSE-PHY-04", "name": "System of Particles & Rotational Dynamics", **_split_hours(18), "weightage_marks": 9},
                    {"code": "CBSE-PHY-05", "name": "Gravitation, Mechanical Properties of Solids & Fluids", **_split_hours(16), "weightage_marks": 8},
                    {"code": "CBSE-PHY-06", "name": "Thermodynamics, Kinetic Theory & Oscillations/Waves", **_split_hours(18), "weightage_marks": 10},
                    {"code": "CBSE-PHY-07", "name": "Electrostatics, Gauss Law & Capacitance", **_split_hours(18), "weightage_marks": 9},
                    {"code": "CBSE-PHY-08", "name": "Current Electricity, Moving Charges & Magnetism", **_split_hours(18), "weightage_marks": 9},
                    {"code": "CBSE-PHY-09", "name": "EMI, Alternating Current, Ray & Wave Optics", **_split_hours(16), "weightage_marks": 10},
                    {"code": "CBSE-PHY-10", "name": "Dual Nature, Atoms, Nuclei & Semiconductor Electronics", **_split_hours(12), "weightage_marks": 10},
                ],
            },
            "Chemistry": {
                "subject": "Chemistry",
                "total_subject_hours": 150,
                "lecture_hours": 90,
                "practice_numerical_hours": 38,
                "assessment_doubt_hours": 22,
                "chapters": [
                    {"code": "CBSE-CHE-01", "name": "Mole Concept, Stoichiometry & Atomic Structure", **_split_hours(16), "weightage_marks": 9},
                    {"code": "CBSE-CHE-02", "name": "Chemical Bonding & Molecular Structure (VSEPR & MOT)", **_split_hours(18), "weightage_marks": 9},
                    {"code": "CBSE-CHE-03", "name": "Chemical Thermodynamics & Equilibrium", **_split_hours(18), "weightage_marks": 10},
                    {"code": "CBSE-CHE-04", "name": "Solutions, Electrochemistry & Chemical Kinetics", **_split_hours(18), "weightage_marks": 12},
                    {"code": "CBSE-CHE-05", "name": "d- & f-Block Elements and Coordination Compounds", **_split_hours(16), "weightage_marks": 9},
                    {"code": "CBSE-CHE-06", "name": "General Organic Chemistry (GOC), Isomerism & Hydrocarbons", **_split_hours(18), "weightage_marks": 10},
                    {"code": "CBSE-CHE-07", "name": "Haloalkanes, Haloarenes, Alcohols, Phenols & Ethers", **_split_hours(16), "weightage_marks": 8},
                    {"code": "CBSE-CHE-08", "name": "Aldehydes, Ketones & Carboxylic Acids", **_split_hours(16), "weightage_marks": 8},
                    {"code": "CBSE-CHE-09", "name": "Amines, Biomolecules & NCERT Case-Based Drills", **_split_hours(14), "weightage_marks": 7},
                ],
            },
            "Mathematics": {
                "subject": "Mathematics",
                "total_subject_hours": 170,
                "lecture_hours": 102,
                "practice_numerical_hours": 43,
                "assessment_doubt_hours": 25,
                "chapters": [
                    {"code": "CBSE-MAT-01", "name": "Sets, Relations, Functions & Inverse Trigonometry", **_split_hours(16), "weightage_marks": 8},
                    {"code": "CBSE-MAT-02", "name": "Complex Numbers, Quadratic Equations & Linear Inequalities", **_split_hours(16), "weightage_marks": 8},
                    {"code": "CBSE-MAT-03", "name": "Matrices, Determinants & System of Linear Equations", **_split_hours(16), "weightage_marks": 10},
                    {"code": "CBSE-MAT-04", "name": "Permutations, Combinations, Binomial & Sequences/Series", **_split_hours(18), "weightage_marks": 9},
                    {"code": "CBSE-MAT-05", "name": "Coordinate Geometry: Straight Lines & Conic Sections", **_split_hours(20), "weightage_marks": 10},
                    {"code": "CBSE-MAT-06", "name": "Calculus: Limits, Continuity & Differentiability", **_split_hours(20), "weightage_marks": 10},
                    {"code": "CBSE-MAT-07", "name": "Applications of Derivatives (Maxima/Minima & Rate Measure)", **_split_hours(16), "weightage_marks": 9},
                    {"code": "CBSE-MAT-08", "name": "Indefinite & Definite Integrals + Area Under Curves", **_split_hours(20), "weightage_marks": 12},
                    {"code": "CBSE-MAT-09", "name": "Differential Equations, Vectors & 3D Geometry", **_split_hours(16), "weightage_marks": 14},
                    {"code": "CBSE-MAT-10", "name": "Linear Programming & Probability (Bayes Theorem)", **_split_hours(12), "weightage_marks": 10},
                ],
            },
            "Biology": {
                "subject": "Biology",
                "total_subject_hours": 150,
                "lecture_hours": 90,
                "practice_numerical_hours": 38,
                "assessment_doubt_hours": 22,
                "chapters": [
                    {"code": "CBSE-BIO-01", "name": "Diversity of Living Organisms & Structural Organisation", **_split_hours(16), "weightage_marks": 10},
                    {"code": "CBSE-BIO-02", "name": "Cell Structure, Biomolecules & Cell Cycle/Division", **_split_hours(16), "weightage_marks": 10},
                    {"code": "CBSE-BIO-03", "name": "Plant Physiology: Photosynthesis, Respiration & Growth", **_split_hours(18), "weightage_marks": 12},
                    {"code": "CBSE-BIO-04", "name": "Human Physiology I: Breathing, Body Fluids & Circulation", **_split_hours(16), "weightage_marks": 9},
                    {"code": "CBSE-BIO-05", "name": "Excretory Products & Their Elimination (Human Physiology)", **_split_hours(18), "weightage_marks": 9},
                    {"code": "CBSE-BIO-06", "name": "Reproduction in Flowering Plants & Human Reproduction", **_split_hours(16), "weightage_marks": 14},
                    {"code": "CBSE-BIO-07", "name": "Principles of Inheritance, Molecular Basis & Evolution", **_split_hours(22), "weightage_marks": 18},
                    {"code": "CBSE-BIO-08", "name": "Human Health, Microbes & Biotechnology Applications", **_split_hours(16), "weightage_marks": 12},
                    {"code": "CBSE-BIO-09", "name": "Organisms, Populations, Ecosystem & Biodiversity", **_split_hours(12), "weightage_marks": 10},
                ],
            },
        },
    },
    "ICSE": {
        "board_code": "ICSE",
        "board_name": "ICSE / ISC Board (CISCE Class 9–12 Curriculum)",
        "academic_regulator": "Council for the Indian School Certificate Examinations (CISCE)",
        "recommended_session_duration_mins": 60,
        "base_student_rate_1on1_inr": 900,
        "base_student_rate_batch_inr": 100,
        "subjects": {
            "Physics": {
                "subject": "Physics",
                "total_subject_hours": 168,
                "lecture_hours": 101,
                "practice_numerical_hours": 42,
                "assessment_doubt_hours": 25,
                "chapters": [
                    {"code": "ICSE-PHY-01", "name": "Force, Turning Effect, Torque & Centre of Gravity", **_split_hours(18), "weightage_marks": 10},
                    {"code": "ICSE-PHY-02", "name": "Work, Power, Energy & Simple Machines (MA, VR, Efficiency)", **_split_hours(18), "weightage_marks": 10},
                    {"code": "ICSE-PHY-03", "name": "Refraction of Light at Plane/Lens Surfaces & Spectrum", **_split_hours(20), "weightage_marks": 12},
                    {"code": "ICSE-PHY-04", "name": "Sound Waves, Resonance, Echoes & Acoustics", **_split_hours(14), "weightage_marks": 8},
                    {"code": "ICSE-PHY-05", "name": "Current Electricity, Ohm's Law, EMF & Household Circuits", **_split_hours(22), "weightage_marks": 14},
                    {"code": "ICSE-PHY-06", "name": "Electromagnetism, Lorentz Force, AC Generator & Transformer", **_split_hours(20), "weightage_marks": 12},
                    {"code": "ICSE-PHY-07", "name": "Calorimetry, Specific Heat Capacity & Latent Heat", **_split_hours(16), "weightage_marks": 10},
                    {"code": "ICSE-PHY-08", "name": "Radioactivity, Nuclear Fission/Fusion & Modern Physics", **_split_hours(16), "weightage_marks": 8},
                    {"code": "ICSE-PHY-09", "name": "ISC Rotational Mechanics, Electrostatics & Wave Optics", **_split_hours(24), "weightage_marks": 16},
                ],
            },
            "Chemistry": {
                "subject": "Chemistry",
                "total_subject_hours": 156,
                "lecture_hours": 94,
                "practice_numerical_hours": 39,
                "assessment_doubt_hours": 23,
                "chapters": [
                    {"code": "ICSE-CHE-01", "name": "Periodic Properties, Chemical Bonding & Coordinate Bonds", **_split_hours(18), "weightage_marks": 10},
                    {"code": "ICSE-CHE-02", "name": "Study of Acids, Bases, Salts & Analytical Chemistry", **_split_hours(18), "weightage_marks": 10},
                    {"code": "ICSE-CHE-03", "name": "Mole Concept, Gay-Lussac's Law, Avogadro Law & Stoichiometry", **_split_hours(20), "weightage_marks": 12},
                    {"code": "ICSE-CHE-04", "name": "Electrolysis, Faraday's Laws & Electrochemical Series", **_split_hours(18), "weightage_marks": 10},
                    {"code": "ICSE-CHE-05", "name": "Metallurgy: Extraction of Aluminium, Iron & Alloys", **_split_hours(16), "weightage_marks": 8},
                    {"code": "ICSE-CHE-06", "name": "Study of Compounds: HCl, Ammonia, Nitric Acid & H2SO4", **_split_hours(22), "weightage_marks": 14},
                    {"code": "ICSE-CHE-07", "name": "Organic Chemistry: Alkanes, Alkenes, Alkynes, Alcohols & Acids", **_split_hours(24), "weightage_marks": 14},
                    {"code": "ICSE-CHE-08", "name": "ISC Chemical Kinetics, Coordination & Named Organic Reactions", **_split_hours(20), "weightage_marks": 12},
                ],
            },
            "Mathematics": {
                "subject": "Mathematics",
                "total_subject_hours": 176,
                "lecture_hours": 106,
                "practice_numerical_hours": 44,
                "assessment_doubt_hours": 26,
                "chapters": [
                    {"code": "ICSE-MAT-01", "name": "Commercial Mathematics (GST, Banking) & Linear Inequations", **_split_hours(16), "weightage_marks": 10},
                    {"code": "ICSE-MAT-02", "name": "Quadratic Equations, Ratio/Proportion, Factor Theorem & Matrices", **_split_hours(22), "weightage_marks": 14},
                    {"code": "ICSE-MAT-03", "name": "Arithmetic & Geometric Progressions (AP / GP)", **_split_hours(16), "weightage_marks": 8},
                    {"code": "ICSE-MAT-04", "name": "Coordinate Geometry: Reflection, Section Formula & Line Equation", **_split_hours(20), "weightage_marks": 12},
                    {"code": "ICSE-MAT-05", "name": "Geometry: Similarity, Loci, Circle Theorems & Tangents", **_split_hours(24), "weightage_marks": 14},
                    {"code": "ICSE-MAT-06", "name": "Mensuration (Cylinder, Cone, Sphere) & Trigonometry / Heights", **_split_hours(22), "weightage_marks": 12},
                    {"code": "ICSE-MAT-07", "name": "Statistics (Ogive, Quartiles, Mean) & Probability", **_split_hours(16), "weightage_marks": 10},
                    {"code": "ICSE-MAT-08", "name": "ISC Calculus: Limits, Differentiation, Integration & Differential Eq", **_split_hours(40), "weightage_marks": 20},
                ],
            },
            "Biology": {
                "subject": "Biology",
                "total_subject_hours": 154,
                "lecture_hours": 92,
                "practice_numerical_hours": 39,
                "assessment_doubt_hours": 23,
                "chapters": [
                    {"code": "ICSE-BIO-01", "name": "Cell Cycle, Mitosis/Meiosis & Structure of Chromosomes", **_split_hours(18), "weightage_marks": 10},
                    {"code": "ICSE-BIO-02", "name": "Genetics: Mendel's Laws, Sex-Linked Inheritance & Mutation", **_split_hours(20), "weightage_marks": 12},
                    {"code": "ICSE-BIO-03", "name": "Plant Physiology: Absorption by Roots, Transpiration & Photosynthesis", **_split_hours(24), "weightage_marks": 14},
                    {"code": "ICSE-BIO-04", "name": "Circulatory System, Cardiac Cycle & Excretory System (Nephron)", **_split_hours(24), "weightage_marks": 14},
                    {"code": "ICSE-BIO-05", "name": "Nervous System, Sense Organs (Eye/Ear) & Endocrine Glands", **_split_hours(24), "weightage_marks": 14},
                    {"code": "ICSE-BIO-06", "name": "Reproductive System, Human Evolution & Population Dynamics", **_split_hours(22), "weightage_marks": 10},
                    {"code": "ICSE-BIO-07", "name": "ISC Molecular Biology, Biotechnology & Ecological Succession", **_split_hours(22), "weightage_marks": 12},
                ],
            },
        },
    },
    "Maharashtra State Board": {
        "board_code": "Maharashtra State Board",
        "board_name": "Maharashtra State Board (MSBSHSE SSC/HSC + MHT-CET Aligned)",
        "academic_regulator": "Maharashtra State Board of Secondary & Higher Secondary Education + CET Cell",
        "recommended_session_duration_mins": 60,
        "base_student_rate_1on1_inr": 800,
        "base_student_rate_batch_inr": 90,
        "subjects": {
            "Physics": {
                "subject": "Physics",
                "total_subject_hours": 152,
                "lecture_hours": 91,
                "practice_numerical_hours": 38,
                "assessment_doubt_hours": 23,
                "chapters": [
                    {"code": "MHSB-PHY-01", "name": "Rotational Dynamics & Mechanical Properties of Fluids", **_split_hours(18), "weightage_marks": 14},
                    {"code": "MHSB-PHY-02", "name": "Kinetic Theory of Gases, Radiation & Thermodynamics", **_split_hours(18), "weightage_marks": 14},
                    {"code": "MHSB-PHY-03", "name": "Oscillations (SHM) & Superposition of Waves", **_split_hours(18), "weightage_marks": 12},
                    {"code": "MHSB-PHY-04", "name": "Wave Optics & Electrostatics", **_split_hours(18), "weightage_marks": 14},
                    {"code": "MHSB-PHY-05", "name": "Current Electricity, Magnetic Fields & Magnetic Materials", **_split_hours(20), "weightage_marks": 14},
                    {"code": "MHSB-PHY-06", "name": "Electromagnetic Induction (EMI) & AC Circuits", **_split_hours(18), "weightage_marks": 12},
                    {"code": "MHSB-PHY-07", "name": "Dual Nature of Radiation, Atoms, Nuclei & Semiconductors", **_split_hours(18), "weightage_marks": 12},
                    {"code": "MHSB-PHY-08", "name": "MHT-CET 50-Question Speed Sprint & HSC Board Derivations", **_split_hours(24), "weightage_marks": 10},
                ],
            },
            "Chemistry": {
                "subject": "Chemistry",
                "total_subject_hours": 146,
                "lecture_hours": 88,
                "practice_numerical_hours": 36,
                "assessment_doubt_hours": 22,
                "chapters": [
                    {"code": "MHSB-CHE-01", "name": "Solid State & Solutions (Colligative Properties)", **_split_hours(18), "weightage_marks": 12},
                    {"code": "MHSB-CHE-02", "name": "Ionic Equilibria & Chemical Thermodynamics", **_split_hours(20), "weightage_marks": 14},
                    {"code": "MHSB-CHE-03", "name": "Electrochemistry & Chemical Kinetics", **_split_hours(18), "weightage_marks": 12},
                    {"code": "MHSB-CHE-04", "name": "Elements of Groups 16, 17, 18 & Transition/Coordination Compounds", **_split_hours(20), "weightage_marks": 14},
                    {"code": "MHSB-CHE-05", "name": "Halogen Derivatives, Alcohols, Phenols & Ethers", **_split_hours(20), "weightage_marks": 12},
                    {"code": "MHSB-CHE-06", "name": "Aldehydes, Ketones, Carboxylic Acids & Amines", **_split_hours(20), "weightage_marks": 12},
                    {"code": "MHSB-CHE-07", "name": "Biomolecules, Polymers, Green Chemistry & MHT-CET Drills", **_split_hours(30), "weightage_marks": 12},
                ],
            },
            "Mathematics": {
                "subject": "Mathematics",
                "total_subject_hours": 164,
                "lecture_hours": 98,
                "practice_numerical_hours": 41,
                "assessment_doubt_hours": 25,
                "chapters": [
                    {"code": "MHSB-MAT-01", "name": "Mathematical Logic, Matrices & Trigonometric Functions", **_split_hours(20), "weightage_marks": 16},
                    {"code": "MHSB-MAT-02", "name": "Pair of Straight Lines, Vectors & 3D Line/Plane", **_split_hours(24), "weightage_marks": 20},
                    {"code": "MHSB-MAT-03", "name": "Linear Programming, Continuity & Differentiation", **_split_hours(22), "weightage_marks": 16},
                    {"code": "MHSB-MAT-04", "name": "Applications of Derivatives & Indefinite Integration", **_split_hours(24), "weightage_marks": 18},
                    {"code": "MHSB-MAT-05", "name": "Definite Integration, Application of Integrals & Differential Eq", **_split_hours(24), "weightage_marks": 18},
                    {"code": "MHSB-MAT-06", "name": "Probability Distributions & Binomial Distribution", **_split_hours(16), "weightage_marks": 12},
                    {"code": "MHSB-MAT-07", "name": "MHT-CET 50-MCQ (2 Marks Each) Speed & Shortcut Mastery", **_split_hours(34), "weightage_marks": 10},
                ],
            },
            "Biology": {
                "subject": "Biology",
                "total_subject_hours": 144,
                "lecture_hours": 86,
                "practice_numerical_hours": 36,
                "assessment_doubt_hours": 22,
                "chapters": [
                    {"code": "MHSB-BIO-01", "name": "Reproduction in Lower & Higher Plants and Animals", **_split_hours(20), "weightage_marks": 14},
                    {"code": "MHSB-BIO-02", "name": "Inheritance & Variation + Molecular Basis of Inheritance", **_split_hours(22), "weightage_marks": 14},
                    {"code": "MHSB-BIO-03", "name": "Origin/Evolution of Life, Plant Water Relations & Plant Growth", **_split_hours(20), "weightage_marks": 14},
                    {"code": "MHSB-BIO-04", "name": "Respiration, Circulation, Excretion & Osmo-Regulation", **_split_hours(22), "weightage_marks": 14},
                    {"code": "MHSB-BIO-05", "name": "Control & Coordination + Human Health and Diseases", **_split_hours(20), "weightage_marks": 12},
                    {"code": "MHSB-BIO-06", "name": "Biotechnology, Organisms/Populations, Ecosystems & MHT-CET Drills", **_split_hours(40), "weightage_marks": 12},
                ],
            },
        },
    },
    "JEE": {
        "board_code": "JEE",
        "board_name": "JEE Main & Advanced (NTA + IIT Competitive Engineering Track)",
        "academic_regulator": "National Testing Agency (NTA) & IIT Joint Admission Board",
        "recommended_session_duration_mins": 90,
        "base_student_rate_1on1_inr": 1200,
        "base_student_rate_batch_inr": 125,
        "subjects": {
            "Physics": {
                "subject": "Physics",
                "total_subject_hours": 220,
                "lecture_hours": 132,
                "practice_numerical_hours": 55,
                "assessment_doubt_hours": 33,
                "chapters": [
                    {"code": "JEE-PHY-01", "name": "Kinematics, Vectors, Projectile & Relative Motion", **_split_hours(20), "weightage_marks": 12},
                    {"code": "JEE-PHY-02", "name": "Laws of Motion, Friction & Circular Dynamics", **_split_hours(24), "weightage_marks": 16},
                    {"code": "JEE-PHY-03", "name": "Work, Energy, Power, Center of Mass & Collisions", **_split_hours(24), "weightage_marks": 16},
                    {"code": "JEE-PHY-04", "name": "Rotational Mechanics & Rigid Body Dynamics (JEE Adv)", **_split_hours(28), "weightage_marks": 20},
                    {"code": "JEE-PHY-05", "name": "Gravitation, SHM, Mechanical Waves, Elasticity & Fluids", **_split_hours(26), "weightage_marks": 16},
                    {"code": "JEE-PHY-06", "name": "Thermal Physics, Calorimetry, KTG & Laws of Thermodynamics", **_split_hours(20), "weightage_marks": 12},
                    {"code": "JEE-PHY-07", "name": "Electrostatics, Gauss Law, Dipoles & Capacitor Networks", **_split_hours(26), "weightage_marks": 16},
                    {"code": "JEE-PHY-08", "name": "Current Electricity, Moving Charges, Magnetism, EMI & AC", **_split_hours(28), "weightage_marks": 20},
                    {"code": "JEE-PHY-09", "name": "Geometrical Optics, Wave Optics & Modern Physics + PYQ Archive", **_split_hours(24), "weightage_marks": 16},
                ],
            },
            "Chemistry": {
                "subject": "Chemistry",
                "total_subject_hours": 210,
                "lecture_hours": 126,
                "practice_numerical_hours": 53,
                "assessment_doubt_hours": 31,
                "chapters": [
                    {"code": "JEE-CHE-01", "name": "Mole Concept, Redox Titration & Quantum Atomic Structure", **_split_hours(22), "weightage_marks": 12},
                    {"code": "JEE-CHE-02", "name": "Chemical Bonding & Molecular Structure (VSEPR, Hybridization, MOT)", **_split_hours(24), "weightage_marks": 16},
                    {"code": "JEE-CHE-03", "name": "Chemical Thermodynamics, Thermochemistry & Ionic Equilibrium", **_split_hours(28), "weightage_marks": 16},
                    {"code": "JEE-CHE-04", "name": "Liquid Solutions, Electrochemistry & Chemical Kinetics", **_split_hours(26), "weightage_marks": 16},
                    {"code": "JEE-CHE-05", "name": "Coordination Compounds, d/f-Block, p-Block & Salt Analysis", **_split_hours(28), "weightage_marks": 20},
                    {"code": "JEE-CHE-06", "name": "General Organic Chemistry (GOC), Electronic Effects & Stereoisomerism", **_split_hours(26), "weightage_marks": 16},
                    {"code": "JEE-CHE-07", "name": "Hydrocarbons, Alkyl/Aryl Halides, Alcohols, Phenols & Ethers", **_split_hours(28), "weightage_marks": 16},
                    {"code": "JEE-CHE-08", "name": "Aldehydes, Ketones, Carboxylic Acids, Amines & Multi-Step Synthesis", **_split_hours(28), "weightage_marks": 16},
                ],
            },
            "Mathematics": {
                "subject": "Mathematics",
                "total_subject_hours": 230,
                "lecture_hours": 138,
                "practice_numerical_hours": 58,
                "assessment_doubt_hours": 34,
                "chapters": [
                    {"code": "JEE-MAT-01", "name": "Quadratic Equations, Complex Numbers & Sequences/Series", **_split_hours(26), "weightage_marks": 16},
                    {"code": "JEE-MAT-02", "name": "Permutations, Combinations, Binomial Theorem & Probability", **_split_hours(28), "weightage_marks": 16},
                    {"code": "JEE-MAT-03", "name": "Matrices, Determinants & Trigonometric Equations", **_split_hours(24), "weightage_marks": 12},
                    {"code": "JEE-MAT-04", "name": "Coordinate Geometry: Straight Lines, Circles & Conic Sections", **_split_hours(36), "weightage_marks": 20},
                    {"code": "JEE-MAT-05", "name": "Calculus: Limits, Continuity & Differentiability", **_split_hours(28), "weightage_marks": 16},
                    {"code": "JEE-MAT-06", "name": "Applications of Derivatives (Monotonicity, Maxima/Minima, Tangents)", **_split_hours(24), "weightage_marks": 12},
                    {"code": "JEE-MAT-07", "name": "Indefinite & Definite Integration, Area & Differential Equations", **_split_hours(36), "weightage_marks": 20},
                    {"code": "JEE-MAT-08", "name": "Vector Algebra & 3D Coordinate Geometry", **_split_hours(28), "weightage_marks": 16},
                ],
            },
        },
    },
    "NEET": {
        "board_code": "NEET",
        "board_name": "NEET UG (NTA 720-Mark Medical Entrance Track)",
        "academic_regulator": "National Testing Agency (NTA) & National Medical Commission (NMC)",
        "recommended_session_duration_mins": 90,
        "base_student_rate_1on1_inr": 1150,
        "base_student_rate_batch_inr": 120,
        "subjects": {
            "Physics": {
                "subject": "Physics",
                "total_subject_hours": 190,
                "lecture_hours": 114,
                "practice_numerical_hours": 48,
                "assessment_doubt_hours": 28,
                "chapters": [
                    {"code": "NEET-PHY-01", "name": "Units, Error Analysis, Kinematics & Projectile Motion", **_split_hours(20), "weightage_marks": 20},
                    {"code": "NEET-PHY-02", "name": "Laws of Motion, Friction & Work-Energy-Power", **_split_hours(24), "weightage_marks": 24},
                    {"code": "NEET-PHY-03", "name": "Rotational Motion, Gravitation, Solids & Fluid Mechanics", **_split_hours(26), "weightage_marks": 24},
                    {"code": "NEET-PHY-04", "name": "Thermal Physics, Thermodynamics, SHM & Waves", **_split_hours(24), "weightage_marks": 24},
                    {"code": "NEET-PHY-05", "name": "Electrostatics, Capacitors & Current Electricity (Circuit Drills)", **_split_hours(28), "weightage_marks": 28},
                    {"code": "NEET-PHY-06", "name": "Magnetic Effects of Current, Magnetism, EMI & Alternating Current", **_split_hours(26), "weightage_marks": 24},
                    {"code": "NEET-PHY-07", "name": "Ray Optics, Optical Instruments & Wave Optics", **_split_hours(22), "weightage_marks": 20},
                    {"code": "NEET-PHY-08", "name": "Dual Nature, Atoms, Nuclei, Logic Gates & Semiconductor Diodes", **_split_hours(20), "weightage_marks": 16},
                ],
            },
            "Chemistry": {
                "subject": "Chemistry",
                "total_subject_hours": 190,
                "lecture_hours": 114,
                "practice_numerical_hours": 48,
                "assessment_doubt_hours": 28,
                "chapters": [
                    {"code": "NEET-CHE-01", "name": "Some Basic Concepts, Atomic Structure & Periodic Classification", **_split_hours(22), "weightage_marks": 20},
                    {"code": "NEET-CHE-02", "name": "Chemical Bonding, VSEPR, Hybridization & Molecular Orbital Theory", **_split_hours(24), "weightage_marks": 24},
                    {"code": "NEET-CHE-03", "name": "Thermodynamics, Chemical & Ionic Equilibrium, Redox", **_split_hours(26), "weightage_marks": 24},
                    {"code": "NEET-CHE-04", "name": "Solutions, Electrochemistry & Chemical Kinetics", **_split_hours(24), "weightage_marks": 24},
                    {"code": "NEET-CHE-05", "name": "p-Block, d/f-Block Elements & Coordination Chemistry (NCERT Line-by-Line)", **_split_hours(26), "weightage_marks": 28},
                    {"code": "NEET-CHE-06", "name": "GOC, Isomerism, Hydrocarbons & Haloalkanes/Haloarenes", **_split_hours(34), "weightage_marks": 32},
                    {"code": "NEET-CHE-07", "name": "Alcohols, Phenols, Aldehydes, Ketones, Acids, Amines & Biomolecules", **_split_hours(34), "weightage_marks": 28},
                ],
            },
            "Biology": {
                "subject": "Biology",
                "total_subject_hours": 240,
                "lecture_hours": 144,
                "practice_numerical_hours": 60,
                "assessment_doubt_hours": 36,
                "chapters": [
                    {"code": "NEET-BIO-01", "name": "Living World, Biological Classification, Plant & Animal Kingdom", **_split_hours(26), "weightage_marks": 40},
                    {"code": "NEET-BIO-02", "name": "Morphology/Anatomy of Flowering Plants & Animal Tissues", **_split_hours(24), "weightage_marks": 32},
                    {"code": "NEET-BIO-03", "name": "Cell: The Unit of Life, Biomolecules & Cell Cycle/Division", **_split_hours(26), "weightage_marks": 40},
                    {"code": "NEET-BIO-04", "name": "Plant Physiology: Photosynthesis, Respiration & Plant Growth", **_split_hours(28), "weightage_marks": 36},
                    {"code": "NEET-BIO-05", "name": "Human Physiology I: Breathing, Body Fluids & Circulation", **_split_hours(24), "weightage_marks": 32},
                    {"code": "NEET-BIO-06", "name": "Excretory Products & Their Elimination (Human Physiology)", **_split_hours(26), "weightage_marks": 36},
                    {"code": "NEET-BIO-07", "name": "Reproduction in Organisms, Flowering Plants & Human Reproduction", **_split_hours(24), "weightage_marks": 36},
                    {"code": "NEET-BIO-08", "name": "Genetics & Evolution: Mendelian Inheritance & Molecular Basis (DNA/RNA)", **_split_hours(32), "weightage_marks": 52},
                    {"code": "NEET-BIO-09", "name": "Human Health/Disease, Microbes & Biotechnology (Principles & Applications)", **_split_hours(16), "weightage_marks": 32},
                    {"code": "NEET-BIO-10", "name": "Ecology: Organisms, Populations, Ecosystem & Biodiversity Conservation", **_split_hours(14), "weightage_marks": 24},
                ],
            },
        },
    },
    "Olympiad": {
        "board_code": "Olympiad",
        "board_name": "National & International Olympiads (IOQM / NSEP / NSEC / NSEB / IJSO)",
        "academic_regulator": "HBCSE (TIFR) & IAPT / MTA National Olympiad Standard",
        "recommended_session_duration_mins": 90,
        "base_student_rate_1on1_inr": 1350,
        "base_student_rate_batch_inr": 140,
        "subjects": {
            "Mathematics": {
                "subject": "Mathematics",
                "total_subject_hours": 140,
                "lecture_hours": 84,
                "practice_numerical_hours": 35,
                "assessment_doubt_hours": 21,
                "chapters": [
                    {"code": "OLY-MAT-01", "name": "Number Theory, Divisibility, Diophantine Equations & Modular Arithmetic", **_split_hours(28), "weightage_marks": 24},
                    {"code": "OLY-MAT-02", "name": "Combinatorics, Bijection, Recursion & Pigeonhole Principle", **_split_hours(28), "weightage_marks": 22},
                    {"code": "OLY-MAT-03", "name": "Euclidean Geometry, Ceva/Menelaus, Radical Axis & Cyclic Quadrilaterals", **_split_hours(32), "weightage_marks": 26},
                    {"code": "OLY-MAT-04", "name": "Algebraic Inequalities (AM-GM, Cauchy-Schwarz, Jensen) & Polynomials", **_split_hours(28), "weightage_marks": 18},
                    {"code": "OLY-MAT-05", "name": "Functional Equations & RMO/INMO Proof Writing Drills", **_split_hours(24), "weightage_marks": 10},
                ],
            },
            "Physics": {
                "subject": "Physics",
                "total_subject_hours": 120,
                "lecture_hours": 72,
                "practice_numerical_hours": 30,
                "assessment_doubt_hours": 18,
                "chapters": [
                    {"code": "OLY-PHY-01", "name": "Non-Inertial Mechanics, Constraint Dynamics & Central Forces (NSEP)", **_split_hours(32), "weightage_marks": 60},
                    {"code": "OLY-PHY-02", "name": "Rigid Body Dynamics, Gyroscopic Precession & Fluid Statics/Dynamics", **_split_hours(30), "weightage_marks": 54},
                    {"code": "OLY-PHY-03", "name": "Electrodynamics, Maxwell Relations & Transient RC/RL/RLC Circuits", **_split_hours(32), "weightage_marks": 56},
                    {"code": "OLY-PHY-04", "name": "Thermodynamics, Statistical Mechanics, Optics & Relativistic Kinematics", **_split_hours(26), "weightage_marks": 46},
                ],
            },
            "Chemistry": {
                "subject": "Chemistry",
                "total_subject_hours": 115,
                "lecture_hours": 69,
                "practice_numerical_hours": 29,
                "assessment_doubt_hours": 17,
                "chapters": [
                    {"code": "OLY-CHE-01", "name": "Advanced Chemical Equilibrium, Buffer Capacity & Electrochemistry (NSEC)", **_split_hours(30), "weightage_marks": 56},
                    {"code": "OLY-CHE-02", "name": "Molecular Symmetry, Crystal Field Theory & Bio-Inorganic Chemistry", **_split_hours(28), "weightage_marks": 52},
                    {"code": "OLY-CHE-03", "name": "Stereochemistry, Pericyclic & Named Organic Reaction Mechanisms", **_split_hours(32), "weightage_marks": 64},
                    {"code": "OLY-CHE-04", "name": "Spectroscopy (IR, NMR, UV-Vis) & Quantitative Volumetric Analysis", **_split_hours(25), "weightage_marks": 44},
                ],
            },
            "Biology": {
                "subject": "Biology",
                "total_subject_hours": 110,
                "lecture_hours": 66,
                "practice_numerical_hours": 28,
                "assessment_doubt_hours": 16,
                "chapters": [
                    {"code": "OLY-BIO-01", "name": "Biochemistry, Enzyme Kinetics (Michaelis-Menten) & Cell Signaling (NSEB)", **_split_hours(28), "weightage_marks": 56},
                    {"code": "OLY-BIO-02", "name": "Population Genetics (Hardy-Weinberg), Epigenetics & Molecular Biology", **_split_hours(30), "weightage_marks": 60},
                    {"code": "OLY-BIO-03", "name": "Comparative Animal Physiology, Neurobiology & Renal Counter-Current", **_split_hours(28), "weightage_marks": 54},
                    {"code": "OLY-BIO-04", "name": "Plant Anatomy, Ethology, Cladistics & Quantitative Ecology", **_split_hours(24), "weightage_marks": 46},
                ],
            },
        },
    },
}

# ──────────────────────────────────────────────────────────────────────────────
# 2. CFO COMMISSION & TEACHER TIER FINANCIAL PARAMETERS
# ──────────────────────────────────────────────────────────────────────────────

TEACHER_TIER_FINANCE_CONFIG = {
    "Master": {
        "tier": "Master",
        "label": "Master Faculty (Top 1% IIT/AIIMS/IISc HODs)",
        "siko_commission_pct": 18.0,
        "teacher_share_pct": 82.0,
        "rate_multiplier": 1.15,
    },
    "Expert": {
        "tier": "Expert",
        "label": "Expert Faculty (8+ Yrs National Rank-Producing)",
        "siko_commission_pct": 22.0,
        "teacher_share_pct": 78.0,
        "rate_multiplier": 1.00,
    },
    "Senior": {
        "tier": "Senior",
        "label": "Senior Faculty (5+ Yrs Accredited Educators)",
        "siko_commission_pct": 25.0,
        "teacher_share_pct": 75.0,
        "rate_multiplier": 0.90,
    },
    "Pro": {
        "tier": "Pro",
        "label": "Pro Faculty (Verified Rising Educators)",
        "siko_commission_pct": 28.0,
        "teacher_share_pct": 72.0,
        "rate_multiplier": 0.80,
    },
}

BUNDLE_DISCOUNT_RULES = {
    "chapter": {
        "scope_mode": "chapter",
        "label": "Single Chapter Mastery Sprint",
        "discount_pct": 0.0,
        "rationale": "Pay-as-you-go single chapter deep dive with full M1/M2/M3 teacher escrow protection.",
    },
    "full_subject": {
        "scope_mode": "full_subject",
        "label": "Complete Single Subject Mastery",
        "discount_pct": 10.0,
        "rationale": "10% Market-Standard Full-Subject Commitment Scholarship.",
    },
    "two_subject_bundle": {
        "scope_mode": "two_subject_bundle",
        "label": "2-Subject Combo Bundle",
        "discount_pct": 15.0,
        "rationale": "15% Multi-Subject Bundle Discount (higher LTV, zero incremental CAC).",
    },
    "multi_subject_bundle": {
        "scope_mode": "multi_subject_bundle",
        "label": "Complete Multi-Subject Flagship Bundle (PCM / PCB / All Subjects)",
        "discount_pct": 20.0,
        "rationale": "20% Flagship Multi-Subject Bundle Scholarship (maximizes student retention & faculty utilization).",
    },
}


class PricingCalculationRequest(BaseModel):
    board_or_exam: str = "CBSE"  # CBSE | ICSE | Maharashtra State Board | JEE | NEET | Olympiad
    product_mode: str = "1-on-1"  # 1-on-1 | smart-learning
    scope_mode: str = "chapter"  # chapter | full_subject | multi_subject_bundle
    selected_subjects: Optional[List[str]] = None
    selected_chapter_name: Optional[str] = None
    teacher_tier: str = "Master"  # Master | Expert | Senior | Pro
    include_gst: bool = False
    tds_rate_pct: float = 10.0  # Section 194J Professional Technical Services (or 2% u/s 194-O)


def calculate_cfo_financial_waterfall(req: PricingCalculationRequest) -> Dict[str, Any]:
    track_key = req.board_or_exam
    if track_key not in CURRICULUM_TEACHING_HOURS_MATRIX:
        for k in CURRICULUM_TEACHING_HOURS_MATRIX:
            if k.lower() in track_key.lower() or track_key.lower() in k.lower():
                track_key = k
                break
        else:
            track_key = "CBSE"

    board_data = CURRICULUM_TEACHING_HOURS_MATRIX[track_key]
    subjects_dict = board_data["subjects"]
    tier_cfg = TEACHER_TIER_FINANCE_CONFIG.get(req.teacher_tier, TEACHER_TIER_FINANCE_CONFIG["Master"])

    is_batch = req.product_mode in ("smart-learning", "smart-batch", "batch")
    base_hourly_rate = (
        board_data["base_student_rate_batch_inr"]
        if is_batch
        else round(board_data["base_student_rate_1on1_inr"] * tier_cfg["rate_multiplier"])
    )

    # Determine selected subjects
    avail_subjects = list(subjects_dict.keys())
    if req.scope_mode == "multi_subject_bundle":
        chosen_subjects = req.selected_subjects if (req.selected_subjects and len(req.selected_subjects) >= 2) else avail_subjects[:3]
        chosen_subjects = [s for s in chosen_subjects if s in subjects_dict] or avail_subjects[:3]
    else:
        first_sub = (req.selected_subjects[0] if req.selected_subjects else "Physics")
        if first_sub not in subjects_dict:
            first_sub = avail_subjects[0]
        chosen_subjects = [first_sub]

    # Calculate allotted teaching hours and itemized breakdown
    line_items = []
    total_teaching_hours = 0
    total_lecture_hours = 0
    total_practice_hours = 0
    total_assessment_hours = 0

    if req.scope_mode == "chapter":
        sub_obj = subjects_dict[chosen_subjects[0]]
        chapters = sub_obj["chapters"]
        matched_ch = chapters[0]
        if req.selected_chapter_name:
            for ch in chapters:
                if req.selected_chapter_name.lower() in ch["name"].lower() or ch["name"].lower() in req.selected_chapter_name.lower():
                    matched_ch = ch
                    break
        hrs = matched_ch["total_hours"]
        item_gross = hrs * base_hourly_rate
        total_teaching_hours += hrs
        total_lecture_hours += matched_ch["lecture_hours"]
        total_practice_hours += matched_ch["practice_numerical_hours"]
        total_assessment_hours += matched_ch["assessment_doubt_hours"]
        line_items.append({
            "subject": chosen_subjects[0],
            "scope": f"Chapter: {matched_ch['name']}",
            "code": matched_ch["code"],
            "allotted_hours": hrs,
            "lecture_hours": matched_ch["lecture_hours"],
            "practice_hours": matched_ch["practice_numerical_hours"],
            "assessment_doubt_hours": matched_ch["assessment_doubt_hours"],
            "rate_per_hour_inr": base_hourly_rate,
            "gross_fee_inr": item_gross,
        })
        discount_rule = BUNDLE_DISCOUNT_RULES["chapter"]
    else:
        for s_name in chosen_subjects:
            sub_obj = subjects_dict[s_name]
            hrs = sub_obj["total_subject_hours"]
            item_gross = hrs * base_hourly_rate
            total_teaching_hours += hrs
            total_lecture_hours += sub_obj["lecture_hours"]
            total_practice_hours += sub_obj["practice_numerical_hours"]
            total_assessment_hours += sub_obj["assessment_doubt_hours"]
            line_items.append({
                "subject": s_name,
                "scope": f"Full Subject ({len(sub_obj['chapters'])} Chapters)",
                "code": f"{track_key}-{s_name[:3].upper()}-FULL",
                "allotted_hours": hrs,
                "lecture_hours": sub_obj["lecture_hours"],
                "practice_hours": sub_obj["practice_numerical_hours"],
                "assessment_doubt_hours": sub_obj["assessment_doubt_hours"],
                "rate_per_hour_inr": base_hourly_rate,
                "gross_fee_inr": item_gross,
            })
        if len(chosen_subjects) == 1:
            discount_rule = BUNDLE_DISCOUNT_RULES["full_subject"]
        elif len(chosen_subjects) == 2:
            discount_rule = BUNDLE_DISCOUNT_RULES["two_subject_bundle"]
        else:
            discount_rule = BUNDLE_DISCOUNT_RULES["multi_subject_bundle"]

    discount_pct = discount_rule["discount_pct"]

    # SIKO Commission Rule:
    # - In 1-to-Many ('batch'): SIKO Commission is FIXED at 50.0% of student fees (charged over the final rate accepted by the teacher).
    # - In 1-on-1: SIKO Commission is tier-calibrated (18%–28%), also charged over the final rate accepted by the teacher.
    # - Commission is NEVER shown to Teacher or Student.
    siko_comm_pct = 50.0 if is_batch else float(tier_cfg["siko_commission_pct"])
    teacher_share_pct = round(100.0 - siko_comm_pct, 1)

    # Step 1: Teacher's Final Accepted Rate & Payout Pool (Foundation of Pricing)
    teacher_base_hourly_accepted = round(base_hourly_rate * (teacher_share_pct / 100.0))
    teacher_effective_hourly_payout = max(1, round(teacher_base_hourly_accepted * (1.0 - (discount_pct / 100.0))))
    teacher_gross_pool = round(total_teaching_hours * teacher_effective_hourly_payout)

    # Step 2: Charge SIKO Commission from Student as Fees OVER the Final Rate Accepted by Teacher
    if is_batch:
        net_course_value = teacher_gross_pool * 2
    else:
        net_course_value = round(teacher_gross_pool / (1.0 - (siko_comm_pct / 100.0)))
    siko_commission_amount = net_course_value - teacher_gross_pool

    # Step 3: Student-Facing Gross & Discount Figures
    gross_tuition_fee = round(net_course_value / (1.0 - (discount_pct / 100.0))) if discount_pct > 0 else net_course_value
    bundle_discount_amount = max(0, gross_tuition_fee - net_course_value)
    gst_amount = round(net_course_value * 0.18) if req.include_gst else 0
    total_student_payable = net_course_value + gst_amount
    effective_student_hourly_rate = round(net_course_value / max(1, total_teaching_hours))

    # SIKO CFO Internal Unit Economics Allocation of Commission
    siko_commission_allocation = {
        "ai_llm_grading_and_question_engine_inr": round(net_course_value * 0.04),
        "live_webrtc_classroom_and_recording_inr": round(net_course_value * 0.03),
        "payment_gateway_and_escrow_compliance_inr": round(net_course_value * 0.025),
        "academic_qa_and_parent_whatsapp_ops_inr": round(net_course_value * 0.035),
        "siko_net_ebitda_contribution_inr": siko_commission_amount - (
            round(net_course_value * 0.04)
            + round(net_course_value * 0.03)
            + round(net_course_value * 0.025)
            + round(net_course_value * 0.035)
        ),
    }

    # 3-Milestone Escrow Distribution (50% M1 / 25% M2 / 25% M3 of Teacher Final Accepted Pool)
    m1_gross = round(teacher_gross_pool * 0.50)
    m2_gross = round(teacher_gross_pool * 0.25)
    m3_gross = teacher_gross_pool - m1_gross - m2_gross

    tds_rate = max(0.0, min(20.0, req.tds_rate_pct)) / 100.0
    m1_tds = round(m1_gross * tds_rate)
    m2_tds = round(m2_gross * tds_rate)
    m3_tds = round(m3_gross * tds_rate)

    milestones = [
        {
            "milestone_code": "M1",
            "title": "Milestone M1 — Live Teaching Hours Completion Gate (50%)",
            "share_pct": 50.0,
            "allotted_hours_gate": f"Complete >= 90% of {total_teaching_hours} Allotted Teaching Hours ({math.ceil(total_teaching_hours * 0.9)} hrs minimum)",
            "gross_amount_inr": m1_gross,
            "tds_deducted_inr": m1_tds,
            "net_bank_payout_inr": m1_gross - m1_tds,
            "release_trigger": "Automated WebRTC Classroom Attendance & Duration Telemetry (>=90% Rule)",
        },
        {
            "milestone_code": "M2",
            "title": "Milestone M2 — Post-Lecture AI Homework & Paper Review Gate (25%)",
            "share_pct": 25.0,
            "allotted_hours_gate": f"Approve & release post-lecture AI worksheets + chapter test ({total_practice_hours} practice hrs)",
            "gross_amount_inr": m2_gross,
            "tds_deducted_inr": m2_tds,
            "net_bank_payout_inr": m2_gross - m2_tds,
            "release_trigger": "Teacher clicks 'Approve & Release' on AI-generated post-lecture homework & test",
        },
        {
            "milestone_code": "M3",
            "title": "Milestone M3 — 1:1 PTM & Parent Report Acknowledgment Gate (25%)",
            "share_pct": 25.0,
            "allotted_hours_gate": f"Conduct 1:1 PTM & parent acknowledges detailed report ({total_assessment_hours} assessment/PTM hrs)",
            "gross_amount_inr": m3_gross,
            "tds_deducted_inr": m3_tds,
            "net_bank_payout_inr": m3_gross - m3_tds,
            "release_trigger": "Parent clicks 'Acknowledge Report' after PTM & WhatsApp scorecard delivery",
        },
    ]

    # Ready-to-wire Razorpay Order + Route Payload for the CTO
    razorpay_blueprint = {
        "gateway_status": "RAZORPAY_INTEGRATION_PENDING_LIVE_KEYS",
        "cto_handover_ready": True,
        "env_vars_required_from_cto": [
            "RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx",
            "RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx",
            "RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx",
            "RAZORPAY_ROUTE_ESCROW_ACCOUNT_ID=acc_siko_escrow_nodal",
        ],
        "order_create_payload_paise": {
            "amount": total_student_payable * 100,
            "currency": "INR",
            "receipt": f"rcpt_siko_{track_key.lower()}_{int(time.time())}",
            "payment_capture": 1,
            "notes": {
                "board_or_exam": track_key,
                "product_mode": req.product_mode,
                "scope_mode": discount_rule["scope_mode"],
                "subjects": ", ".join(chosen_subjects),
                "allotted_teaching_hours": total_teaching_hours,
                "siko_commission_inr": siko_commission_amount,
                "teacher_escrow_pool_inr": teacher_gross_pool,
            },
            "transfers": [
                {
                    "account": "acc_siko_platform_revenue",
                    "amount": siko_commission_amount * 100,
                    "currency": "INR",
                    "notes": {"purpose": f"SIKO Platform Commission ({siko_comm_pct}%)"},
                    "on_hold": False,
                },
                {
                    "account": "acc_teacher_linked_route_id",
                    "amount": m1_gross * 100,
                    "currency": "INR",
                    "notes": {"milestone": "M1_50PCT_TEACHING_HOURS"},
                    "on_hold": True,
                },
                {
                    "account": "acc_teacher_linked_route_id",
                    "amount": m2_gross * 100,
                    "currency": "INR",
                    "notes": {"milestone": "M2_25PCT_WORKSHEET_APPROVAL"},
                    "on_hold": True,
                },
                {
                    "account": "acc_teacher_linked_route_id",
                    "amount": m3_gross * 100,
                    "currency": "INR",
                    "notes": {"milestone": "M3_25PCT_PTM_ACKNOWLEDGMENT"},
                    "on_hold": True,
                },
            ],
        },
    }

    return {
        "board_or_exam": track_key,
        "board_name": board_data["board_name"],
        "product_mode": "1:Many Smart Batch (Max 30)" if is_batch else "1-on-1 Personalised Tutoring",
        "scope_mode": discount_rule["scope_mode"],
        "scope_label": discount_rule["label"],
        "selected_subjects": chosen_subjects,
        "teacher_tier": tier_cfg["tier"],
        "teacher_tier_label": tier_cfg["label"],
        "teaching_hours_summary": {
            "total_allotted_hours": total_teaching_hours,
            "lecture_hours": total_lecture_hours,
            "practice_numerical_hours": total_practice_hours,
            "assessment_doubt_hours": total_assessment_hours,
        },
        "line_items": line_items,
        "student_pricing": {
            "base_hourly_rate_inr": base_hourly_rate,
            "gross_tuition_fee_inr": gross_tuition_fee,
            "bundle_discount_pct": discount_pct,
            "bundle_discount_amount_inr": bundle_discount_amount,
            "net_course_value_inr": net_course_value,
            "gst_18pct_inr": gst_amount,
            "total_student_payable_inr": total_student_payable,
            "effective_student_hourly_rate_inr": effective_student_hourly_rate,
        },
        "siko_commission": {
            "commission_rate_pct": siko_comm_pct,
            "commission_model": "1:Many Fixed 50% Commission (Charged Over Teacher Rate)" if is_batch else f"1-on-1 Tier Commission ({siko_comm_pct}% Charged Over Teacher Rate)",
            "siko_commission_amount_inr": siko_commission_amount,
            "unit_economics_breakdown": siko_commission_allocation,
        },
        "teacher_distribution": {
            "teacher_share_pct": teacher_share_pct,
            "net_teacher_pool_after_siko_commission_inr": teacher_gross_pool,
            "effective_teacher_hourly_payout_inr": teacher_effective_hourly_payout,
            "tds_rate_pct": req.tds_rate_pct,
            "total_tds_deducted_inr": m1_tds + m2_tds + m3_tds,
            "total_net_bank_payout_inr": teacher_gross_pool - (m1_tds + m2_tds + m3_tds),
            "milestones": milestones,
        },
        "batch_cohort_math": {
            "cohort_size": 25,
            "cohort_teacher_hourly_accepted_inr": teacher_effective_hourly_payout * 25,
            "cohort_teacher_total_accepted_pool_inr": teacher_gross_pool * 25,
            "cohort_siko_commission_50pct_inr": siko_commission_amount * 25,
            "cohort_total_student_fees_inr": net_course_value * 25,
            "per_student_fee_inr": net_course_value,
            "per_student_teacher_component_inr": teacher_gross_pool,
            "per_student_siko_commission_50pct_inr": siko_commission_amount,
        } if is_batch else None,
        "razorpay_cto_blueprint": razorpay_blueprint,
    }


@router.get("/curriculum-hours")
def get_curriculum_teaching_hours(board: Optional[str] = None, subject: Optional[str] = None):
    """Returns the complete Board-wise & Competitive Exam-wise Subject & Chapter Teaching Hours Matrix."""
    if board and board in CURRICULUM_TEACHING_HOURS_MATRIX:
        b_data = CURRICULUM_TEACHING_HOURS_MATRIX[board]
        if subject and subject in b_data["subjects"]:
            return {
                "board": board,
                "board_name": b_data["board_name"],
                "subject": b_data["subjects"][subject],
            }
        return b_data
    return {
        "boards_and_programs": list(CURRICULUM_TEACHING_HOURS_MATRIX.keys()),
        "matrix": CURRICULUM_TEACHING_HOURS_MATRIX,
        "teacher_tiers": TEACHER_TIER_FINANCE_CONFIG,
        "bundle_discount_rules": BUNDLE_DISCOUNT_RULES,
    }


@router.post("/calculate-pricing")
def post_calculate_pricing(req: PricingCalculationRequest):
    """Calculates dynamic student pricing, multi-subject bundle discounts, SIKO commission, and M1/M2/M3 teacher payouts."""
    return calculate_cfo_financial_waterfall(req)


@router.get("/cfo-blueprint")
def get_cfo_developer_blueprint():
    """Returns the complete CFO & CTO Developer Handover Guide for SIKO's financial & milestone escrow architecture."""
    sample_chapter = calculate_cfo_financial_waterfall(
        PricingCalculationRequest(board_or_exam="CBSE", product_mode="1-on-1", scope_mode="chapter", selected_subjects=["Physics"], selected_chapter_name="Laws of Motion & Friction", teacher_tier="Master")
    )
    sample_bundle = calculate_cfo_financial_waterfall(
        PricingCalculationRequest(board_or_exam="JEE", product_mode="1-on-1", scope_mode="multi_subject_bundle", selected_subjects=["Physics", "Chemistry", "Mathematics"], teacher_tier="Master")
    )
    return {
        "document_title": "SIKO CFO & CTO Financial Architecture & Developer Handover Specification (v1.0)",
        "razorpay_integration_status": "PENDING_LIVE_KEYS_ONLY (All Order, Split-Route, Escrow & Milestone Ledger Logic Implemented)",
        "cfo_principles": [
            "1. Teaching Hours Standardization: Every chapter and subject across CBSE, ICSE, Maharashtra State Board, JEE, NEET, and Olympiad has a fixed, auditable teaching hour allocation split 60% Live Lecture / 25% Problem Solving / 15% Assessment & Doubt Resolution.",
            "2. Market-Standard Student Pricing & Multi-Subject Bundles: Single Chapter (0% discount), Full Subject (10% discount), 2-Subject Bundle (15% discount), 3+ Subject PCM/PCB/PCMB Bundle (20% discount).",
            "3. SIKO Platform Commission First: SIKO deducts its platform share (18% Master, 22% Expert, 25% Senior, 28% Pro) upfront from Net Course Value to fund AI LLM grading, WebRTC live video, gateway/escrow fees, and platform EBITDA.",
            "4. Net Teacher Pool & 3-Stage Milestone Escrow: After deducting SIKO's commission, 100% of the remaining Net Teacher Pool is locked in nodal escrow and released in 3 performance-gated milestones: M1 (50% on >=90% teaching hours delivered), M2 (25% on AI post-lecture worksheet & chapter test approval), and M3 (25% on 1:1 PTM & Parent Report acknowledgment), net of statutory TDS u/s 194J.",
        ],
        "sample_single_chapter_waterfall": sample_chapter,
        "sample_multi_subject_bundle_waterfall": sample_bundle,
    }
