"""
SIKO Diagnostic Assessment & Learning DNA Engine
Processes student diagnostic submissions and builds evolving Learning DNA profiles.
"""

from typing import List, Dict, Any

class DiagnosticEngine:

    @classmethod
    def evaluate_diagnostic(
        cls,
        answers: List[Dict[str, Any]],
        questions_lookup: Dict[str, Dict[str, Any]],
        time_taken_seconds: int = 900
    ) -> Dict[str, Any]:
        """
        Evaluate student's answers, identify strengths/weaknesses, and generate Learning DNA.
        """
        total = len(answers)
        correct_count = 0
        topic_scores: Dict[str, Dict[str, int]] = {}

        for ans in answers:
            q_id = ans.get("question_id")
            selected_option = ans.get("selected_option")
            q_data = questions_lookup.get(q_id, {})
            correct_option = q_data.get("correct_option", 0)
            topic = q_data.get("topic", "General")

            if topic not in topic_scores:
                topic_scores[topic] = {"correct": 0, "total": 0}
            topic_scores[topic]["total"] += 1

            if selected_option == correct_option:
                correct_count += 1
                topic_scores[topic]["correct"] += 1

        accuracy = round((correct_count / total * 100), 1) if total > 0 else 0.0

        strengths = []
        weaknesses = []
        concept_mastery = {}

        for topic, stats in topic_scores.items():
            pct = round((stats["correct"] / stats["total"]) * 100, 1)
            concept_mastery[topic] = pct
            if pct >= 70:
                strengths.append(f"{topic} ({pct}%)")
            else:
                weaknesses.append(f"{topic} ({pct}%)")

        # Determine learning DNA characteristics
        speed_category = "Steady Pace"
        if time_taken_seconds < 600:
            speed_category = "Fast Solver"
        elif time_taken_seconds > 1100:
            speed_category = "Deliberate & Thorough"

        learning_style = "Visual & Conceptual" if accuracy >= 70 else "Step-by-Step Guided"
        retention_index = min(98, max(65, int(accuracy * 0.9 + 15)))

        learning_dna = {
            "overall_mastery_pct": accuracy,
            "learning_style": learning_style,
            "speed_profile": speed_category,
            "retention_index": retention_index,
            "concept_mastery": concept_mastery,
            "primary_weakness": weaknesses[0] if weaknesses else "Advanced Problem Solving",
            "recommended_focus": "Foundation Reinforcement & Worked Examples" if accuracy < 60 else "Advanced Exam Tactics & Speed Drills",
            "recommended_format": "1:1 Personalised Learning" if accuracy < 75 else "1:Many Smart Learning Cohort"
        }

        return {
            "score": correct_count,
            "total_questions": total,
            "accuracy_pct": accuracy,
            "time_taken_seconds": time_taken_seconds,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "learning_dna": learning_dna,
        }

diagnostic_engine = DiagnosticEngine()
