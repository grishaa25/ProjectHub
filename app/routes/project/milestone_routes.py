"""Milestone-related routes."""

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.db import get_db
from app.utils.dependencies import get_current_professor, get_current_student
from app.schemas.project_schemas import (
    MilestoneCreate,
    MilestoneSubmissionCreate,
    GradeSubmissionRequest
)
from app.services.project.milestone_service import (
    add_milestone_to_project,
    provide_milestone_feedback,
    submit_milestone,
    get_student_active_milestones,
    get_milestone_submissions,
    update_milestone_submission_grade
)

router = APIRouter()


@router.post("/{project_id}/milestones", response_model=dict)
def add_milestone_route(
    project_id: int,
    milestone: MilestoneCreate,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Add a new milestone to an existing project"""
    return add_milestone_to_project(db, project_id, milestone, professor.id)


@router.post("/milestones/{milestone_id}/feedback")
def provide_milestone_feedback_route(
    milestone_id: int,
    feedback_data: MilestoneSubmissionCreate,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Provide feedback and grade for a milestone submission"""
    return provide_milestone_feedback(db, milestone_id, feedback_data, professor.id)


@router.post("/milestones/submit", response_model=dict)
async def submit_milestone_endpoint(
    milestone_id: int = Form(...),
    team_id: int = Form(...),
    submission_text: str = Form(""),
    files: List[UploadFile] = File(None),
    links: List[str] = Form(None),
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    """Submit a milestone for a team"""
    return submit_milestone(
        db=db,
        milestone_id=milestone_id,
        team_id=team_id,
        submission_text=submission_text,
        files=files,
        links=links,
        student_id=student.id
    )


@router.get("/student/milestones", response_model=List[dict])
def get_student_milestones_endpoint(
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    """Get all active milestones for a student's projects"""
    return get_student_active_milestones(db, student.id)


@router.get("/professor/submissions", response_model=List[dict])
def get_professor_submissions_endpoint(
    project_id: Optional[int] = None,
    db: Session = Depends(get_db),
    professor = Depends(get_current_professor)
):
    """Get all milestone submissions for a professor, optionally filtered by project"""
    return get_milestone_submissions(db, professor.id, project_id)


@router.post("/submissions/{submission_id}/grade", response_model=dict)
def grade_submission_endpoint(
    submission_id: int,
    payload: GradeSubmissionRequest,
    db: Session = Depends(get_db),
    professor = Depends(get_current_professor)
):
    """Grade a milestone submission"""
    return update_milestone_submission_grade(db, submission_id, payload.grade, payload.feedback, professor.id)
