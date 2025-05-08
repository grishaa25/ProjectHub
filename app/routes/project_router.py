# api/project_routes.py

from typing import List, Dict, Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models.professor_models import Professor
# from app.database.models.project_models import TeamApplication
from app.database.models.student_models import Student
from app.database.models.user_models import User
from app.utils.dependencies import get_current_professor, get_current_student, get_current_user
from app.schemas.project_schemas import (
    ProjectCreate,
    ProjectOut,
    ProjectResourceOut,
    ProjectUpdate,
    ProjectTeamCreate,
    ProjectTeamOut,
    MilestoneCreate,
    MilestoneSubmissionCreate,
    TeamApplicationCreate,
    TeamApplicationOut,
    StudentOut,
    TeamApplicationRequest,
    MilestoneOut,
)
from app.schemas.enum_schemas import ProjectStatusEnum, TeamStatusEnum
from app.services.project_service import (
    add_milestone_to_project,
    add_resource_to_project,
    create_project,
    create_team,
    create_student_team,
    delete_project,
    download_resource,
    get_all_projects_by_professor,
    get_detailed_project,
    apply_team_to_project,
    approve_team_application,
    update_project,
    update_project_status,
    update_team_status,
    provide_milestone_feedback,
    get_available_projects_for_student,
    get_student_teams,
    get_team_applications_by_student,
    withdraw_team_application,
    get_student_active_projects,
    get_all_teams,
    get_all_students_with_details,
    get_student_teams_detailed,
    apply_to_team,
    get_student_team_applications,
    get_team_student_applications,
    approve_student_application,
    reject_student_application,
    update_student_profile,
    add_project_milestone,
    submit_milestone_feedback,
)

from app.routes.project.milestone_routes import router as milestone_router

router = APIRouter(prefix="/api/projects", tags=["Projects"])

# Include milestone routes
router.include_router(milestone_router)

@router.post("/create", response_model=ProjectOut)
async def create_project_route(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Create a new project with milestones"""
    return await create_project(db, project, professor.id)


@router.get("/list", response_model=List[ProjectOut])
def get_professor_projects(
    db: Session = Depends(get_db), professor=Depends(get_current_professor)
):
    """Get all projects created by the professor"""
    return get_all_projects_by_professor(db, professor.id)


@router.get("/get/{project_id}", response_model=Dict[str, Any])
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get detailed project information including team, milestones, and resources"""
    detailed_project = get_detailed_project(db, project_id)
    if not detailed_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return detailed_project


@router.patch("/update/{project_id}/status")
def update_project_status_route(
    project_id: int,
    status: ProjectStatusEnum,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Update project status"""
    return update_project_status(db, project_id, status, professor.id)


@router.patch("/teams/status/{team_id}")
def update_team_status_route(
    team_id: int,
    status: TeamStatusEnum,
    db: Session = Depends(get_db),
    professor: Professor = Depends(get_current_professor),
):
    """Update team status (approve/reject)"""
    return update_team_status(db, team_id, status, professor.id)


@router.put("/update/{project_id}", response_model=ProjectOut)
def update_project_route(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Update project details"""
    return update_project(db, project_id, project_update, professor.id)


@router.post("/resources/{project_id}", response_model=ProjectResourceOut)
async def upload_resource(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Upload a resource file to the project"""
    return await add_resource_to_project(db, project_id, file, professor.id)


@router.get("/download/{project_id}/resources/{resource_id}")
async def download_resource_route(
    project_id: int,
    resource_id: int,
    db: Session = Depends(get_db),
):
    """Download a project resource"""
    return await download_resource(db, project_id, resource_id)


@router.post("/create/{project_id}/team", response_model=ProjectOut)
def create_team_route(
    project_id: int,
    team: ProjectTeamCreate,
    db: Session = Depends(get_db),
    student=Depends(get_current_student),
):
    """Create a new team for a project"""
    if team.project_id != project_id:
        raise HTTPException(status_code=400, detail="Project ID mismatch")
    return create_team(db, team, student.id)


@router.post("/create/{project_id}/milestones", response_model=ProjectOut)
def add_milestone_route(
    project_id: int,
    milestone: MilestoneCreate,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Add a new milestone to an existing project"""
    return add_milestone_to_project(db, project_id, milestone, professor.id)


@router.post("/provide-feedback/{milestone_id}/feedback")
def provide_milestone_feedback_route(
    milestone_id: int,
    feedback_data: MilestoneSubmissionCreate,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Provide feedback and grade for a milestone submission"""
    return provide_milestone_feedback(db, milestone_id, feedback_data, professor.id)


@router.delete("/delete/{project_id}")
def delete_project_route(
    project_id: int,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Delete a project"""
    delete_project(db, project_id, professor.id)
    return {"detail": "Project deleted"}


# Student endpoints
# @router.get("/students/all", response_model=List[StudentInfo])
# def get_students_list(db: Session = Depends(get_db)):
#     """Get all students for team formation"""
#     return get_all_students(db)


@router.post("/teams/create", response_model=ProjectTeamOut)
def create_student_team_route(
    team: ProjectTeamCreate,
    db: Session = Depends(get_db),
    student=Depends(get_current_student),
):
    """Create a new team (without assigning to a project yet)"""
    if team.leader_id != student.id:
        raise HTTPException(
            status_code=403,
            detail="You can only create a team with yourself as the leader",
        )
    return create_student_team(db, team, student.id)

@router.post("/teams/apply", response_model=TeamApplicationOut)
def apply_to_project_route(
    application: TeamApplicationCreate,
    db: Session = Depends(get_db),
    student=Depends(get_current_student),
):
    """Apply a team to a project"""
    application_data = application.model_dump()
    return apply_team_to_project(db, application_data, student.id)


@router.post("/applications/{application_id}/approve")
def approve_application_route(
    application_id: int,
    db: Session = Depends(get_db),
    professor=Depends(get_current_professor),
):
    """Approve a team application (professor only)"""
    return approve_team_application(db, application_id, professor.id)


# Student project endpoints
@router.get("/available", response_model=List[Dict[str, Any]])
def get_available_projects(
    db: Session = Depends(get_db), student=Depends(get_current_student)
):
    """Get all available projects that the student is eligible for"""
    return get_available_projects_for_student(db, student.id)


@router.get("/student/teams", response_model=List[ProjectTeamOut])
def get_student_teams_route(
    db: Session = Depends(get_db), student=Depends(get_current_student)
):
    """Get all teams that the student is a member of"""
    return get_student_teams(db, student.id)


@router.get("/applications", response_model=List[TeamApplicationOut])
def get_team_applications(
    db: Session = Depends(get_db), student=Depends(get_current_student)
):
    """Get all applications made by the student's teams"""
    return get_team_applications_by_student(db, student.id)


@router.post("/applications/withdraw/{application_id}")
def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    student=Depends(get_current_student),
):
    """Withdraw a team application (only team leader can withdraw)"""
    return withdraw_team_application(db, application_id, student.id)


@router.get("/student/active", response_model=List[Dict[str, Any]])
def get_active_projects(
    db: Session = Depends(get_db), student=Depends(get_current_student)
):
    """Get all projects that the student is actively working on"""
    return get_student_active_projects(db, student.id)


# Collaborator Finder endpoints
@router.get("/teams/all", response_model=List[dict])
def get_all_teams_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all teams available for collaboration"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return get_all_teams(db)


@router.get("/students/all", response_model=List[dict])
def get_all_students_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all students with their skills and interests"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return get_all_students_with_details(db)


@router.get("/teams/student", response_model=List[dict])
def get_student_teams_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all teams that the student is a member of"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return get_student_teams_detailed(db, student.id)


@router.post("/student/teams/apply", response_model=dict)
def apply_to_team_endpoint(
    application_data: TeamApplicationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Apply to join a team"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    # Override the student_id in the application data with the current student's ID
    application_dict = application_data.dict()
    application_dict["student_id"] = student.id
    
    return apply_to_team(db, application_dict, student.id)


@router.get("/teams/applications", response_model=List[dict])
def get_student_applications_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all team applications made by the student"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return get_student_team_applications(db, student.id)


@router.get("/teams/applications/{team_id}", response_model=List[dict])
def get_team_applications_endpoint(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all applications to join a team (only team leader can view)"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return get_team_student_applications(db, team_id, student.id)


@router.post("/teams/applications/{application_id}/approve", response_model=dict)
def approve_application_endpoint(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Approve a student's application to join a team (only team leader can approve)"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return approve_student_application(db, application_id, student.id)


@router.post("/teams/applications/{application_id}/reject", response_model=dict)
def reject_application_endpoint(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Reject a student's application to join a team (only team leader can reject)"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return reject_student_application(db, application_id, student.id)


@router.put("/students/profile", response_model=StudentOut)
def update_student_profile_endpoint(
    profile_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a student's profile with skills, interests, and availability"""
    # Verify the user is a student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    return update_student_profile(db, student.id, profile_data)


@router.post("/{project_id}/milestones", response_model=MilestoneOut)
def add_milestone_endpoint(
    project_id: int,
    milestone_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_professor),
):
    """Add a new milestone to a project"""
    return add_project_milestone(db, project_id, milestone_data, current_user.id)


@router.post("/milestones/{milestone_id}/feedback", response_model=dict)
def submit_milestone_feedback_endpoint(
    milestone_id: int,
    team_id: int,
    feedback_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_professor),
):
    """Submit feedback and grade for a milestone submission"""
    return submit_milestone_feedback(db, milestone_id, team_id, feedback_data, current_user.professor.id)
