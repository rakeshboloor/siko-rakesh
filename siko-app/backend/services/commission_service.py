"""
SIKO Merit Commission & Escrow Engine
Calculates dynamic teacher share and 3-milestone escrow distribution (M1=50%, M2=25%, M3=25%).
Rules:
- 1:Many Smart Learning default platform commission = 50%
- 1:1 Personalised Learning uses Merit Commission Engine (tier, tenure, rating, student gain)
- Never hard-coded in business views. Fully auditable.
"""

from typing import Dict, Any

class MeritCommissionEngine:
    # Base platform commission by teacher tier level
    TIER_BASE_COMMISSION = {
        1: 0.30,  # Tier 1 Foundation: 30% platform, 70% teacher
        2: 0.25,  # Tier 2 Professional: 25% platform, 75% teacher
        3: 0.20,  # Tier 3 Senior: 20% platform, 80% teacher
        4: 0.15,  # Tier 4 Lead: 15% platform, 85% teacher
        5: 0.12,  # Tier 5 Master: 12% platform, 88% teacher
    }

    @classmethod
    def calculate_commission(
        cls,
        format_type: str,
        total_price: float,
        tier_level: int = 3,
        tenure_months: int = 6,
        rating: float = 4.8,
        avg_student_gain_pct: float = 20.0
    ) -> Dict[str, Any]:
        """
        Calculate platform commission, teacher allocation, and M1/M2/M3 milestone amounts.
        """
        if format_type.lower() in ["1:many", "batch", "smart_learning"]:
            # Rule 6: 1:Many default platform commission = 50%
            platform_rate = 0.50
            pricing_model = "fixed_batch_50_50"
        else:
            # Rule 7: 1:1 uses Merit Commission Engine
            base_rate = cls.TIER_BASE_COMMISSION.get(tier_level, 0.20)
            modifiers = 0.0

            # Tenure discount on platform fee
            if tenure_months >= 12:
                modifiers -= 0.02
            if tenure_months >= 24:
                modifiers -= 0.01

            # High rating modifier
            if rating >= 4.9:
                modifiers -= 0.01

            # Student score improvement bonus modifier
            if avg_student_gain_pct >= 25.0:
                modifiers -= 0.02

            # Floor platform commission at 10%
            platform_rate = max(0.10, base_rate + modifiers)
            pricing_model = f"merit_tier_{tier_level}_adjusted"

        teacher_allocation_rate = 1.0 - platform_rate
        platform_fee = round(total_price * platform_rate, 2)
        teacher_total_allocation = round(total_price * teacher_allocation_rate, 2)

        # Rule 5: Milestone model: M1 = 50%, M2 = 25%, M3 = 25%
        m1_amount = round(teacher_total_allocation * 0.50, 2)
        m2_amount = round(teacher_total_allocation * 0.25, 2)
        m3_amount = round(teacher_total_allocation - (m1_amount + m2_amount), 2)  # Handles penny rounding

        return {
            "format": format_type,
            "total_price": total_price,
            "platform_rate": round(platform_rate, 4),
            "platform_fee": platform_fee,
            "teacher_allocation_rate": round(teacher_allocation_rate, 4),
            "teacher_total_allocation": teacher_total_allocation,
            "pricing_model": pricing_model,
            "milestones": {
                "m1": {
                    "name": "Teaching Delivery Gate",
                    "percentage": 50,
                    "amount": m1_amount,
                    "trigger": "Scheduled classes marked complete with concepts and attendance logged."
                },
                "m2": {
                    "name": "Academic Quality Gate",
                    "percentage": 25,
                    "amount": m2_amount,
                    "trigger": "Assigned worksheets & assessments evaluated and released."
                },
                "m3": {
                    "name": "PTM & Accountability Gate",
                    "percentage": 25,
                    "amount": m3_amount,
                    "trigger": "Parent-Teacher meeting completed and progress report filed."
                }
            }
        }

commission_engine = MeritCommissionEngine()
