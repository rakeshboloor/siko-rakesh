import os
import sys
import json
from datetime import datetime, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, create_tables, engine
from models import Batch, Teacher
import sqlite3

def migrate_batches_columns():
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "siko.db")
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cols = [r[1] for r in cur.execute("PRAGMA table_info(batches)").fetchall()]
        new_cols = [
            ("chapter", "TEXT"),
            ("student_need", "TEXT"),
            ("teaching_hours", "INTEGER DEFAULT 10"),
            ("product_type", "TEXT DEFAULT 'Micro Sprint'"),
            ("priority", "TEXT DEFAULT 'P0'"),
            ("launch_month", "TEXT"),
            ("source_note", "TEXT"),
            ("faculty_name", "TEXT"),
            ("faculty_title", "TEXT"),
            ("faculty_avatar", "TEXT"),
            ("faculty_tier", "TEXT DEFAULT 'Master'"),
            ("faculty_rating", "REAL DEFAULT 4.9"),
            ("revenue_at_capacity", "REAL")
        ]
        for col_name, col_type in new_cols:
            if col_name not in cols:
                cur.execute(f"ALTER TABLE batches ADD COLUMN {col_name} {col_type}")
                print(f"[MIGRATION] Added column {col_name} to batches table")
        conn.commit()
        conn.close()

def populate_smart_batches():
    migrate_batches_columns()
    create_tables()
    db = SessionLocal()

    # Load 41 batches JSON generated earlier
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "smart_batches_data.json")
    if not os.path.exists(json_path):
        json_path = "smart_batches_data.json"

    with open(json_path, "r", encoding="utf-8") as f:
        batches_data = json.load(f)

    # First teacher in DB as fallback reference
    first_teacher = db.query(Teacher).first()
    teacher_id = first_teacher.id if first_teacher else None

    count = 0
    for item in batches_data:
        ref = item["productId"]
        b = db.query(Batch).filter(Batch.batch_ref == ref).first()
        if not b:
            b = Batch(batch_ref=ref)
            db.add(b)

        # Parse start date e.g. "15-Nov-2026"
        try:
            s_date = datetime.strptime(item["startDate"], "%d-%b-%Y")
        except Exception:
            s_date = datetime.utcnow() + timedelta(days=10)

        b.course_name = item["title"]
        b.subject = item["subject"]
        b.board = item["board"]
        b.grade = item["grade"]
        b.exam = item["segment"]
        b.teacher_id = teacher_id
        b.start_date = s_date
        b.end_date = s_date + timedelta(days=item["teachingHours"] * 2)
        b.days_schedule = item["schedule"].split(" IST")[0].strip() if " IST" in item["schedule"] else item["schedule"]
        b.time_slot = item["timeSlot"]
        b.timezone = "IST"
        b.sessions_count = max(4, round(item["teachingHours"] / 1.5))
        b.session_duration = 75
        b.min_capacity = item["minCapacity"]
        b.max_capacity = item["maxCapacity"]
        b.enrolled_count = item["seatsOccupied"]
        b.status = "full" if item["isFull"] else "open"
        b.jitsi_room = item["jitsiRoom"]
        b.price_inr = float(item["price"])
        b.price_usd = round(float(item["price"]) / 80.0, 1)
        b.currency = "INR"

        # Academic sprint fields
        b.chapter = item["chapter"]
        b.student_need = item["studentNeed"]
        b.teaching_hours = item["teachingHours"]
        b.product_type = item["productType"]
        b.priority = item["priority"]
        b.launch_month = item["launchMonth"]
        b.source_note = item["sourceNote"]
        b.faculty_name = item["teacher"]
        b.faculty_title = item["teacherTitle"]
        b.faculty_avatar = item["teacherAvatar"]
        b.faculty_tier = item["teacherTier"]
        b.faculty_rating = float(item["teacherRating"])
        b.revenue_at_capacity = float(item["revenueAtCapacity"])

        count += 1

    db.commit()
    db.close()
    print(f"Successfully seeded and updated all {count} SIKO Exam Sprint batches in database!")

if __name__ == "__main__":
    populate_smart_batches()
