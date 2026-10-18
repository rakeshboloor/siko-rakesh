"""
SIKO Academic Health Score Engine
Calculates a multi-factor 0-100 score indicating student consistency, attendance,
homework turnaround, assessment mastery, and PTM engagement.
"""

from typing import Dict, Any

class AcademicHealthScoreEngine:

    @classmethod
    def calculate_health_score(
        cls,
        attendance_pct: float = 95.0,
        homework_submission_pct: float = 88.0,
        assessment_avg_pct: float = 82.0,
        concept_mastery_pct: float = 85.0,
        consistency_index: float = 90.0,
        ptm_participated: bool = True
    ) -> Dict[str, Any]:
        """
        Compute weighted Academic Health Score (0 to 100).
        """
        # Weighted formula
        # Attendance: 30%
        # Homework: 25%
        # Assessment: 25%
        # Concept Mastery: 10%
        # Consistency / PTM: 10%
        w_attendance = (attendance_pct / 100.0) * 30.0
        w_homework   = (homework_submission_pct / 100.0) * 25.0
        w_assessment = (assessment_avg_pct / 100.0) * 25.0
        w_concept    = (concept_mastery_pct / 100.0) * 10.0
        w_consist    = ((consistency_index + (10 if ptm_participated else 0)) / 110.0) * 10.0

        overall = min(100, max(0, int(round(w_attendance + w_homework + w_assessment + w_concept + w_consist))))

        if overall >= 85:
            trend = "Thriving & Strong Momentum"
            status_color = "emerald"
            recommendations = [
                "Maintain consistent class attendance streak.",
                "Take on challenging level-2 problem sets.",
                "Continue strong homework submission discipline."
            ]
        elif overall >= 70:
            trend = "Steady with High Potential"
            status_color = "blue"
            recommendations = [
                "Focus on improving assessment accuracy in timed tests.",
                "Review weak concept video recaps after each session.",
                "Submit homework within 24 hours of class completion."
            ]
        else:
            trend = "Needs Immediate Focus"
            status_color = "amber"
            recommendations = [
                "Schedule a 1:1 revision session with assigned teacher.",
                "Attend upcoming Parent-Teacher Meeting for customized action plan.",
                "Target fundamental concepts before advancing to practice tests."
            ]

        return {
            "overall_score": overall,
            "metrics": {
                "attendance": round(attendance_pct, 1),
                "homework": round(homework_submission_pct, 1),
                "assessment": round(assessment_avg_pct, 1),
                "concept_mastery": round(concept_mastery_pct, 1),
                "consistency": round(consistency_index, 1)
            },
            "trend": trend,
            "status_color": status_color,
            "recommendations": recommendations,
        }

health_score_engine = AcademicHealthScoreEngine()
