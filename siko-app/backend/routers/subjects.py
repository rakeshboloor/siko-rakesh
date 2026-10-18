"""
routers/subjects.py

Endpoints:
  GET /api/subjects/boards             — list all boards
  GET /api/subjects/grades?board_id=X  — list grades for board
  GET /api/subjects/programs?grade_id=X — list programs for grade
  GET /api/subjects/subjects?program_id=X — list subjects
  GET /api/subjects/chapters?subject_id=X — list chapters with concepts
  GET /api/subjects/structure          — full academic structure as JSON
"""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, selectinload

from auth import get_current_user
from database import get_db
from models import Board, Chapter, Concept, Grade, Program, Subject, User

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class BoardOut(BaseModel):
    id: str
    name: str
    short_name: Optional[str]
    description: Optional[str]

    class Config:
        from_attributes = True


class GradeOut(BaseModel):
    id: str
    board_id: str
    name: str
    level: Optional[int]

    class Config:
        from_attributes = True


class ProgramOut(BaseModel):
    id: str
    grade_id: str
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True


class SubjectOut(BaseModel):
    id: str
    program_id: str
    name: str
    description: Optional[str]
    icon_url: Optional[str]

    class Config:
        from_attributes = True


class ConceptOut(BaseModel):
    id: str
    chapter_id: str
    name: str
    description: Optional[str]
    order: Optional[int]

    class Config:
        from_attributes = True


class ChapterOut(BaseModel):
    id: str
    subject_id: str
    name: str
    description: Optional[str]
    order: Optional[int]
    concepts: List[ConceptOut] = []

    class Config:
        from_attributes = True


# Nested structure models for /structure
class ProgramStructureOut(BaseModel):
    id: str
    name: str
    subjects: List[SubjectOut] = []


class GradeStructureOut(BaseModel):
    id: str
    name: str
    level: Optional[int]
    programs: List[ProgramStructureOut] = []


class BoardStructureOut(BaseModel):
    id: str
    name: str
    short_name: Optional[str]
    grades: List[GradeStructureOut] = []


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get("/boards", response_model=List[BoardOut])
def list_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[BoardOut]:
    """Return all available education boards."""
    return db.query(Board).order_by(Board.name).all()


@router.get("/grades", response_model=List[GradeOut])
def list_grades(
    board_id: str = Query(..., description="Filter grades by board ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[GradeOut]:
    """Return grades for the specified board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    return db.query(Grade).filter(Grade.board_id == board_id).order_by(Grade.level).all()


@router.get("/programs", response_model=List[ProgramOut])
def list_programs(
    grade_id: str = Query(..., description="Filter programs by grade ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[ProgramOut]:
    """Return programs for the specified grade."""
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grade not found")
    return db.query(Program).filter(Program.grade_id == grade_id).order_by(Program.name).all()


@router.get("/subjects", response_model=List[SubjectOut])
def list_subjects(
    program_id: str = Query(..., description="Filter subjects by program ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[SubjectOut]:
    """Return subjects for the specified program."""
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    return db.query(Subject).filter(Subject.program_id == program_id).order_by(Subject.name).all()


@router.get("/chapters", response_model=List[ChapterOut])
def list_chapters(
    subject_id: str = Query(..., description="Filter chapters by subject ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[ChapterOut]:
    """Return chapters (with nested concepts) for the specified subject."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    chapters = (
        db.query(Chapter)
        .filter(Chapter.subject_id == subject_id)
        .options(selectinload(Chapter.concepts))
        .order_by(Chapter.order)
        .all()
    )
    return chapters


@router.get("/structure", response_model=List[BoardStructureOut])
def get_full_structure(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[BoardStructureOut]:
    """
    Return the full academic structure as a nested JSON tree:
    Board → Grades → Programs → Subjects.
    """
    boards = (
        db.query(Board)
        .options(
            selectinload(Board.grades).selectinload(Grade.programs).selectinload(
                Program.subjects
            )
        )
        .order_by(Board.name)
        .all()
    )

    result: List[BoardStructureOut] = []
    for board in boards:
        board_out = BoardStructureOut(
            id=board.id,
            name=board.name,
            short_name=getattr(board, "short_name", None),
            grades=[],
        )
        for grade in sorted(
            getattr(board, "grades", []), key=lambda g: (g.level or 0)
        ):
            grade_out = GradeStructureOut(
                id=grade.id,
                name=grade.name,
                level=getattr(grade, "level", None),
                programs=[],
            )
            for program in getattr(grade, "programs", []):
                program_out = ProgramStructureOut(
                    id=program.id,
                    name=program.name,
                    subjects=[
                        SubjectOut(
                            id=s.id,
                            program_id=s.program_id,
                            name=s.name,
                            description=getattr(s, "description", None),
                            icon_url=getattr(s, "icon_url", None),
                        )
                        for s in getattr(program, "subjects", [])
                    ],
                )
                grade_out.programs.append(program_out)
            board_out.grades.append(grade_out)
        result.append(board_out)
    return result
