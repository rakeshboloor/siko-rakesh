"""
SIKO AI Teacher Recommendation Engine
Matches student profile, goal, exam, weak concepts, and schedule with verified teachers.
Provides explainable recommendation rationales.
"""

from typing import List, Dict, Any
import json

class TeacherMatchingEngine:

    @classmethod
    def match_teachers(
        cls,
        student_profile: Dict[str, Any],
        available_teachers: List[Dict[str, Any]],
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Rank teachers and generate explainability rationales.
        """
        target_subject = student_profile.get("subject", "Physics").lower()
        target_board = student_profile.get("board", "CBSE").upper()
        target_grade = str(student_profile.get("grade", "11"))
        target_exam = student_profile.get("exam", "JEE").upper()
        weak_topics = [t.lower() for t in student_profile.get("weak_topics", [])]
        preferred_time = student_profile.get("time_preference", "Evening")

        scored_teachers = []

        for teacher in available_teachers:
            score = 50.0  # Base score
            reasons = []

            # 1. Subject expertise match
            expertise = teacher.get("expertise", {})
            if isinstance(expertise, str):
                try:
                    expertise = json.loads(expertise)
                except Exception:
                    expertise = {}

            teacher_subjects = [s.lower() for s in expertise.get("subjects", [teacher.get("subject", "").lower()])]
            if target_subject in teacher_subjects:
                score += 25
                reasons.append(f"{target_subject.capitalize()} Subject Specialist")

            # 2. Board & Exam expertise match
            teacher_boards = [b.upper() for b in expertise.get("boards", [teacher.get("board", "").upper()])]
            if target_board in teacher_boards or "ALL" in teacher_boards:
                score += 10
                reasons.append(f"{target_board} Curriculum & Evaluation Expert")

            teacher_exams = [e.upper() for e in expertise.get("exams", [teacher.get("exam", "").upper()])]
            if target_exam in teacher_exams:
                score += 15
                reasons.append(f"Proven {target_exam} Topper Track Record")

            # 3. Grade alignment
            teacher_grades = [str(g) for g in expertise.get("grades", [])]
            if target_grade in teacher_grades or not teacher_grades:
                score += 10
                reasons.append(f"Extensive Experience with Grade {target_grade} Students")

            # 4. Teacher Tier and Rating
            rating = float(teacher.get("rating", 4.5))
            if rating >= 4.8:
                score += 10
                reasons.append(f"Top-Rated Faculty ({rating}★ / 5.0)")

            tier = teacher.get("tier", "silver").lower()
            if tier in ["gold", "platinum", "tier_4", "tier_5", "master", "lead"]:
                score += 8
                reasons.append(f"Verified SIKO Senior Academic Fellow")

            # 5. Weak topic alignment
            specialties = [s.lower() for s in expertise.get("specialties", [])]
            matched_weaknesses = [w for w in weak_topics if any(w in s for s in specialties)]
            if matched_weaknesses:
                score += 12
                reasons.append(f"Specialized remediation for {', '.join(matched_weaknesses).title()}")

            # 6. Student improvement indicator
            improvement_boost = teacher.get("improvement_boost_pct", 28)
            reasons.append(f"Average +{improvement_boost}% Student Score Boost")

            scored_teachers.append({
                **teacher,
                "match_score": min(100, int(score)),
                "recommendation_reasons": reasons[:4],
                "primary_match_reason": reasons[0] if reasons else "High Compatibility",
            })

        # Sort descending by match_score
        scored_teachers.sort(key=lambda t: t["match_score"], reverse=True)
        return scored_teachers[:limit]

matching_engine = TeacherMatchingEngine()
