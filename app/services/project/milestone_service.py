from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, UploadFile
import os
from sqlalchemy.orm import Session

from app.database.models.project_models import (
    Milestone,
    MilestoneSubmission,
    Project,
    ProjectTeam,
    SubmissionDocument,
    TeamMember
)
from app.database.models.user_models import User
from app.database.models.student_models import Student
from app.database.models.professor_models import Professor
from app.schemas.project_schemas import (
    MilestoneCreate,
    MilestoneSubmissionCreate,
)
from app.utils.file_utils import save_upload_file


def add_milestone_to_project(
    db: Session, project_id: int, milestone: MilestoneCreate, professor_id: int
) -> dict:
    """Add a new milestone to an existing project."""
    # Check if project exists and belongs to the professor
    project = db.query(Project).filter(
        Project.id == project_id, Project.professor_id == professor_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or you don't have permission")
    
    # Create new milestone
    new_milestone = Milestone(
        title=milestone.title,
        description=milestone.description,
        due_date=milestone.due_date,
        weightage=milestone.weightage,
        project_id=project_id
    )
    
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    
    return {"message": "Milestone added successfully", "milestone_id": new_milestone.id}


def provide_milestone_feedback(
    db: Session, milestone_id: int, feedback_data: MilestoneSubmissionCreate, professor_id: int
) -> dict:
    """Provide feedback and grade for a milestone submission."""
    # Check if milestone exists
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    # Check if professor has permission (owns the project)
    project = db.query(Project).filter(
        Project.id == milestone.project_id, Project.professor_id == professor_id
    ).first()
    if not project:
        raise HTTPException(status_code=403, detail="You don't have permission to provide feedback for this milestone")
    
    # Check if submission exists
    submission = db.query(MilestoneSubmission).filter(
        MilestoneSubmission.milestone_id == milestone_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="No submission found for this milestone")
    
    # Update submission with feedback and grade
    submission.feedback = feedback_data.feedback
    submission.grade = feedback_data.grade
    
    db.commit()
    db.refresh(submission)
    
    return {"message": "Feedback provided successfully"}


def add_project_milestone(
    db: Session, project_id: int, milestone_data: dict, professor_id: int
) -> dict:
    """Add a new milestone to a project."""
    return add_milestone_to_project(
        db, 
        project_id, 
        MilestoneCreate(**milestone_data), 
        professor_id
    )


def submit_milestone_feedback(
    db: Session, milestone_id: int, team_id: int, feedback_data: dict, professor_id: int
) -> dict:
    """Submit feedback and grade for a milestone submission."""
    return provide_milestone_feedback(
        db, 
        milestone_id, 
        MilestoneSubmissionCreate(**feedback_data), 
        professor_id
    )


def get_milestone_by_id(db: Session, milestone_id: int) -> Optional[Milestone]:
    """Get a milestone by its ID."""
    return db.query(Milestone).filter(Milestone.id == milestone_id).first()


def get_team_milestones(db: Session, team_id: int) -> List[Milestone]:
    """Get all milestones for a team's project."""
    team = db.query(ProjectTeam).filter(ProjectTeam.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return db.query(Milestone).filter(Milestone.project_id == team.project_id).all()


def get_student_active_milestones(db: Session, student_id: int) -> List[dict]:
    """Get all active milestones for a student's projects."""
    # Find teams the student is a member of
    team_ids = db.query(TeamMember.team_id).filter(TeamMember.student_id == student_id).all()
    team_ids = [team_id[0] for team_id in team_ids]
    
    if not team_ids:
        return []
    
    # Get projects for these teams
    teams = db.query(ProjectTeam).filter(ProjectTeam.id.in_(team_ids)).all()
    project_ids = [team.project_id for team in teams]
    
    # Get milestones for these projects
    milestones = db.query(Milestone).filter(Milestone.project_id.in_(project_ids)).all()
    
    # Get submission status for each milestone
    result = []
    for milestone in milestones:
        submission = db.query(MilestoneSubmission).filter(
            MilestoneSubmission.milestone_id == milestone.id,
            MilestoneSubmission.team_id.in_(team_ids)
        ).first()
        
        # Find the team for this milestone's project
        team = next((t for t in teams if t.project_id == milestone.project_id), None)
        
        result.append({
            "id": milestone.id,
            "title": milestone.title,
            "description": milestone.description,
            "due_date": milestone.due_date,
            "weightage": milestone.weightage,
            "project_id": milestone.project_id,
            "team_id": team.id if team else None,
            "submitted": submission is not None,
            "grade": submission.grade if submission else None,
            "feedback": submission.feedback if submission else None,
            "submission_date": submission.submitted_at if submission else None
        })
    
    return result


def submit_milestone(
    db: Session, 
    milestone_id: int, 
    team_id: int, 
    submission_text: str,
    files: List[UploadFile] = None,
    links: List[str] = None,
    student_id: int = None
) -> dict:
    """Submit a milestone for a team."""
    # Verify the milestone exists
    milestone = get_milestone_by_id(db, milestone_id)
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    # Verify the team exists and is associated with the milestone's project
    team = db.query(ProjectTeam).filter(
        ProjectTeam.id == team_id,
        ProjectTeam.project_id == milestone.project_id
    ).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found or not associated with this project")
    
    # If student_id is provided, verify student is a member of the team
    if student_id:
        is_member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.student_id == student_id
        ).first()
        
        if not is_member:
            raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    # Check if milestone is already submitted
    existing_submission = db.query(MilestoneSubmission).filter(
        MilestoneSubmission.milestone_id == milestone_id
    ).first()
    
    if existing_submission:
        raise HTTPException(status_code=400, detail="This milestone has already been submitted")
    
    # Check if milestone deadline has passed
    if milestone.due_date and datetime.now(timezone.utc).date() > milestone.due_date:
        raise HTTPException(status_code=400, detail="Milestone deadline has passed")
    
    # Create the submission
    submission = MilestoneSubmission(
        team_id=team_id,
        milestone_id=milestone_id,
        submitted_at=datetime.now(timezone.utc),
        feedback=None,  # Will be filled by professor later
        grade=None      # Will be filled by professor later
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    # Save uploaded files if any
    if files:
        upload_dir = os.path.join("uploads", "milestone_submissions", str(submission.id))
        os.makedirs(upload_dir, exist_ok=True)
        
        for file in files:
            file_path = save_upload_file(file, upload_dir)
            document = SubmissionDocument(
                submission_id=submission.id,
                filename=file.filename,
                file_path=file_path
            )
            db.add(document)
    
    # Save links in the submission text if provided
    final_submission_text = submission_text or ""
    if links:
        final_submission_text += "\n\nLinks:\n" + "\n".join(links)
    
    submission.submission_text = final_submission_text
    db.commit()
    
    return {
        "message": "Milestone submitted successfully",
        "submission_id": submission.id
    }


def get_milestone_submissions(db: Session, professor_id: int, project_id: Optional[int] = None) -> List[dict]:
    """Get all milestone submissions for a professor, optionally filtered by project."""
    # Verify professor exists
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")
    
    # Build query for projects owned by this professor
    query = db.query(Project).filter(Project.professor_id == professor_id)
    
    # Filter by project_id if provided
    if project_id:
        query = query.filter(Project.id == project_id)
    
    projects = query.all()
    if not projects:
        return []
    
    project_ids = [project.id for project in projects]
    
    # Get all milestones for these projects
    milestones = db.query(Milestone).filter(Milestone.project_id.in_(project_ids)).all()
    if not milestones:
        return []
    
    milestone_ids = [milestone.id for milestone in milestones]
    
    # Get all submissions for these milestones
    submissions = db.query(MilestoneSubmission).filter(
        MilestoneSubmission.milestone_id.in_(milestone_ids)
    ).all()
    
    # Create a lookup dictionary for milestones and teams
    milestone_lookup = {m.id: m for m in milestones}
    
    teams = db.query(ProjectTeam).filter(ProjectTeam.project_id.in_(project_ids)).all()
    team_lookup = {t.id: t for t in teams}
    
    # Build response
    result = []
    for submission in submissions:
        milestone = milestone_lookup.get(submission.milestone_id)
        team = team_lookup.get(submission.team_id)
        
        if not milestone or not team:
            continue
        
        # Get team members
        team_members_query = db.query(
            TeamMember, Student, User
        ).join(
            Student, TeamMember.student_id == Student.id
        ).join(
            User, Student.user_id == User.id
        ).filter(
            TeamMember.team_id == team.id
        ).all()
        
        team_members = [
            {
                "id": member[0].id,
                "student_id": member[1].id,
                "name": member[2].full_name,
                "email": member[2].email
            }
            for member in team_members_query
        ]
        
        # Get submission documents
        documents = db.query(SubmissionDocument).filter(
            SubmissionDocument.submission_id == submission.id
        ).all()
        
        submission_docs = [
            {
                "id": doc.id,
                "filename": doc.filename,
                "file_path": doc.file_path,
                "uploaded_at": doc.uploaded_at
            }
            for doc in documents
        ]
        
        result.append({
            "submission_id": submission.id,
            "milestone_id": milestone.id,
            "milestone_title": milestone.title,
            "project_id": milestone.project_id,
            "team_id": team.id,
            "team_name": team.name,
            "team_members": team_members,
            "submitted_at": submission.submitted_at,
            "grade": submission.grade,
            "feedback": submission.feedback,
            "documents": submission_docs,
            "is_graded": submission.grade is not None
        })
    
    return result


def update_milestone_submission_grade(
    db: Session, 
    submission_id: int, 
    grade: float, 
    feedback: str, 
    professor_id: int
) -> dict:
    """Update the grade and feedback for a milestone submission."""
    # Get the submission
    submission = db.query(MilestoneSubmission).filter(MilestoneSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Verify professor has permission to grade this submission
    milestone = db.query(Milestone).filter(Milestone.id == submission.milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    project = db.query(Project).filter(
        Project.id == milestone.project_id,
        Project.professor_id == professor_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=403, detail="You don't have permission to grade this submission")
    
    # Update the submission
    submission.grade = grade
    submission.feedback = feedback
    
    db.commit()
    db.refresh(submission)
    
    return {
        "message": "Submission graded successfully",
        "submission_id": submission.id,
        "grade": submission.grade,
        "feedback": submission.feedback
    }