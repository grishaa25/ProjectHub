# services/project_service.py

import os
from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database.models.project_models import (
    Milestone,
    Project,
    ProjectResource,
    ProjectTeam,
    TeamMember,
    MilestoneSubmission,
    TeamApplication,
    StudentTeamApplication,
)
from app.database.models.student_models import Student
from app.schemas.project_schemas import (
    MilestoneCreate,
    ProjectCreate,
    ProjectUpdate,
    ProjectTeamCreate,
    MilestoneSubmissionCreate,
)
from app.schemas.enum_schemas import ProjectStatusEnum, TeamStatusEnum


async def create_project(db: Session, project_data: ProjectCreate, professor_id: int):
    """Create a new project with milestones"""
    # Create project
    milestones_data = project_data.milestones
    project_dict = project_data.model_dump(exclude={"milestones"})
    new_project = Project(**project_dict, professor_id=professor_id)
    db.add(new_project)
    db.flush()  # Get project ID without committing

    # Create milestones
    for milestone_data in milestones_data:
        new_milestone = Milestone(
            **milestone_data.model_dump(), project_id=new_project.id
        )
        db.add(new_milestone)

    db.commit()
    db.refresh(new_project)
    return new_project


def get_all_projects_by_professor(db: Session, professor_id: int):
    """Get all projects for a professor"""
    return db.query(Project).filter(Project.professor_id == professor_id).all()


def get_project_by_id(db: Session, project_id: int):
    """Get detailed project information"""
    return db.query(Project).filter(Project.id == project_id).first()


def update_project_status(
    db: Session, project_id: int, status: ProjectStatusEnum, professor_id: int
):
    """Update project status"""
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this project"
        )

    project.status = status
    db.commit()
    db.refresh(project)
    return project


def update_project(
    db: Session, project_id: int, project_update: ProjectUpdate, professor_id: int
):
    """Update project details"""
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this project"
        )

    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project


async def add_resource_to_project(
    db: Session, project_id: int, file: UploadFile, professor_id: int
):
    """Add a resource file to project"""
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this project"
        )

    # Create resources directory if it doesn't exist
    upload_dir = f"uploads/projects/{project_id}/resources"
    os.makedirs(upload_dir, exist_ok=True)

    # Save file
    file_path = f"{upload_dir}/{file.filename}"
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Create resource record
    resource = ProjectResource(
        project_id=project_id,
        filename=file.filename,
        file_path=file_path,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


async def download_resource(db: Session, project_id: int, resource_id: int):
    """Download a project resource"""
    resource = (
        db.query(ProjectResource)
        .filter(
            ProjectResource.id == resource_id,
            ProjectResource.project_id == project_id,
        )
        .first()
    )
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if not os.path.exists(resource.file_path):
        raise HTTPException(status_code=404, detail="Resource file not found")

    return FileResponse(
        resource.file_path,
        filename=resource.filename,
        media_type="application/octet-stream",
    )


def create_team(db: Session, team_data: ProjectTeamCreate, student_id: int):
    """Create a new team for a project"""
    # Verify project exists and doesn't have a team
    project = get_project_by_id(db, team_data.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.team:
        raise HTTPException(status_code=400, detail="Project already has a team")

    # Verify student is the team leader
    if student_id != team_data.leader_id:
        raise HTTPException(status_code=403, detail="Only team leader can create team")

    # Create team
    new_team = ProjectTeam(
        name=team_data.name,
        project_id=team_data.project_id,
        leader_id=team_data.leader_id,
    )
    db.add(new_team)
    db.flush()

    # Add members
    for member_id in team_data.member_ids:
        member = TeamMember(team_id=new_team.id, student_id=member_id)
        db.add(member)

    db.commit()
    db.refresh(project)
    return project


def update_team_status(
    db: Session, team_id: int, status: TeamStatusEnum, professor_id: int
):
    """Update the status of a team application by a professor"""
    # Get the team
    team = db.query(ProjectTeam).filter(ProjectTeam.id == team_id).first()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Get the project
    if not team.project_id:
        raise HTTPException(
            status_code=400, detail="Team is not associated with any project"
        )

    project = db.query(Project).filter(Project.id == team.project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Verify the professor owns the project
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403,
            detail="Only the professor who created the project can update team status",
        )

    # Update team status
    team.status = status

    # If approved, check for other approved teams
    if status == TeamStatusEnum.APPROVED:
        # If there's already an approved team for this project, reject this one
        existing_approved_team = (
            db.query(ProjectTeam)
            .filter(
                ProjectTeam.project_id == project.id,
                ProjectTeam.status == TeamStatusEnum.APPROVED,
                ProjectTeam.id != team.id,
            )
            .first()
        )

        if existing_approved_team:
            raise HTTPException(
                status_code=400, detail="This project already has an approved team"
            )
    elif status == TeamStatusEnum.REJECTED:
        # If rejected, remove the project_id from the team
        team.project_id = None

    # Update the corresponding team application if it exists
    application = (
        db.query(TeamApplication)
        .filter(
            TeamApplication.team_id == team_id, TeamApplication.project_id == project.id
        )
        .first()
    )

    if application:
        application.status = status

    db.commit()
    db.refresh(team)

    return team


def add_milestone_to_project(
    db: Session, project_id: int, milestone_data: MilestoneCreate, professor_id: int
):
    """Add a new milestone to an existing project"""
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this project"
        )

    new_milestone = Milestone(**milestone_data.dict(), project_id=project_id)
    db.add(new_milestone)
    db.commit()
    db.refresh(project)
    return project


def provide_milestone_feedback(
    db: Session,
    milestone_id: int,
    feedback_data: MilestoneSubmissionCreate,
    professor_id: int,
):
    """Provide feedback and grade for a milestone submission"""
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    project = get_project_by_id(db, milestone.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to provide feedback"
        )

    # Get or create submission
    submission = (
        db.query(MilestoneSubmission)
        .filter(
            MilestoneSubmission.milestone_id == milestone_id,
            MilestoneSubmission.team_id == feedback_data.team_id,
        )
        .first()
    )

    if not submission:
        submission = MilestoneSubmission(
            milestone_id=milestone_id,
            team_id=feedback_data.team_id,
        )
        db.add(submission)

    submission.feedback = feedback_data.feedback
    submission.grade = feedback_data.grade
    db.commit()
    db.refresh(submission)
    return submission


def delete_project(db: Session, project_id: int, professor_id: int):
    """Delete a project"""
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this project"
        )

    db.delete(project)
    db.commit()


def get_detailed_project(db: Session, project_id: int):
    """Get detailed project information in the format needed for the frontend"""
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Calculate progress based on milestone submissions if team exists
    progress = 0
    if project.team and project.team.status == TeamStatusEnum.APPROVED:
        total_milestones = len(project.milestones)
        if total_milestones > 0:
            completed_milestones = 0
            for milestone in project.milestones:
                if (
                    milestone.team_submission
                    and milestone.team_submission.team_id == project.team.id
                ):
                    completed_milestones += 1
            progress = int((completed_milestones / total_milestones) * 100)

    # Get the last milestone due date as the project due date
    due_date = None
    if project.milestones:
        due_date = max(milestone.due_date for milestone in project.milestones)

    # Count students in approved teams
    student_count = 0
    if project.team and project.team.status == TeamStatusEnum.APPROVED:
        student_count = len(project.team.members)

    # Format document names
    documents = [resource.filename for resource in project.resources]

    # Format milestones
    formatted_milestones = []
    for milestone in project.milestones:
        formatted_milestones.append(
            {
                "id": milestone.id,
                "title": milestone.title,
                "description": milestone.description,
                "dueDate": milestone.due_date,
            }
        )

    # Format teams
    formatted_teams = []
    if project.team:
        # Get team members with user information
        team_members = []
        for member in project.team.members:
            student = member.student
            user = student.user
            team_members.append(
                {
                    "id": student.id,
                    "name": user.full_name,
                    "email": user.email,
                    "year": student.year.value,
                }
            )

        # Get submitted milestones
        submitted_milestones = []
        for submission in project.team.submissions:
            milestone = submission.milestone
            files = [doc.filename for doc in submission.documents]
            submitted_milestones.append(
                {
                    "milestoneId": milestone.id,
                    "submitted": True,
                    "submissionDate": submission.submitted_at,
                    "files": files,
                    "feedback": submission.feedback,
                    "grade": submission.grade,
                }
            )

        # Add non-submitted milestones
        submitted_milestone_ids = [sm["milestoneId"] for sm in submitted_milestones]
        for milestone in project.milestones:
            if milestone.id not in submitted_milestone_ids:
                submitted_milestones.append(
                    {
                        "milestoneId": milestone.id,
                        "submitted": False,
                        "submissionDate": None,
                        "files": [],
                        "feedback": "",
                        "grade": None,
                    }
                )

        formatted_teams.append(
            {
                "id": project.team.id,
                "name": project.team.name,
                "members": team_members,
                "status": project.team.status.value,
                "submittedMilestones": submitted_milestones,
            }
        )

    # Also include teams that have applied to this project
    team_applications = (
        db.query(TeamApplication).filter(TeamApplication.project_id == project_id).all()
    )

    for application in team_applications:
        team = application.team
        if team.id != getattr(
            project.team, "id", None
        ):  # Skip if it's the already assigned team
            # Get team members
            team_members = []
            for member in team.members:
                student = member.student
                user = student.user
                team_members.append(
                    {
                        "id": student.id,
                        "name": user.full_name,
                        "email": user.email,
                        "year": student.year.value,
                    }
                )

            formatted_teams.append(
                {
                    "id": team.id,
                    "name": team.name,
                    "members": team_members,
                    "status": application.status.value,
                    "submittedMilestones": [],
                }
            )

    # Construct the final detailed project object
    detailed_project = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "status": project.status.value,
        "progress": progress,
        "dueDate": due_date.isoformat() if due_date else None,
        "students": student_count,
        "tags": project.tags,
        "academicYear": project.year.value,
        "documents": documents,
        "milestones": formatted_milestones,
        "teams": formatted_teams,
    }

    return detailed_project


def get_all_students(db: Session):
    """Get all students with their user information"""
    from app.database.models.student_models import Student
    from app.database.models.user_models import User

    students = db.query(Student).join(User).all()

    result = []
    for student in students:
        result.append(
            {
                "id": student.id,
                "name": student.user.full_name,
                "email": student.user.email,
                "year": student.year.value,
                "department": student.department.value,
            }
        )

    return result


def create_student_team(db: Session, team_data: ProjectTeamCreate, student_id: int):
    """Create a new team by a student (without automatic project assignment)"""
    # Create team
    new_team = ProjectTeam(
        name=team_data.name,
        leader_id=student_id,
    )
    db.add(new_team)
    db.flush()

    # Add members
    for member_id in team_data.member_ids:
        member = TeamMember(team_id=new_team.id, student_id=member_id)
        db.add(member)

    db.commit()
    db.refresh(new_team)
    return new_team


def apply_team_to_project(db: Session, application_data: dict, student_id: int):
    """Apply a team to a project"""
    # Verify project exists
    project = get_project_by_id(db, application_data["project_id"])
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Verify team exists and student is the team leader
    team = (
        db.query(ProjectTeam)
        .filter(ProjectTeam.id == application_data["team_id"])
        .first()
    )
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if team.leader_id != student_id:
        raise HTTPException(
            status_code=403, detail="Only team leader can apply to projects"
        )

    # Check if team already has a project
    if team.project_id:
        raise HTTPException(
            status_code=400, detail="Team already assigned to a project"
        )

    # Check if team already applied to this project
    existing_application = (
        db.query(TeamApplication)
        .filter(
            TeamApplication.project_id == application_data["project_id"],
            TeamApplication.team_id == application_data["team_id"],
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=400, detail="Team already applied to this project"
        )

    # Create application
    new_application = TeamApplication(
        project_id=application_data["project_id"],
        team_id=application_data["team_id"],
        motivation=application_data.get("motivation"),
    )

    # Set the project_id on the team
    team.project_id = application_data["project_id"]
    team.status = TeamStatusEnum.PENDING

    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


def approve_team_application(db: Session, application_id: int, professor_id: int):
    """Approve a team application and assign the team to the project"""
    application = (
        db.query(TeamApplication).filter(TeamApplication.id == application_id).first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    project = get_project_by_id(db, application.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to approve this application"
        )

    # Check if project already has an approved team
    if project.team and project.team.status == TeamStatusEnum.APPROVED:
        raise HTTPException(
            status_code=400, detail="Project already has an approved team"
        )

    # Update application status
    application.status = TeamStatusEnum.APPROVED

    # Assign team to project
    team = application.team
    team.project_id = project.id
    team.status = TeamStatusEnum.APPROVED

    # Reject all other applications for this project
    other_applications = (
        db.query(TeamApplication)
        .filter(
            TeamApplication.project_id == project.id,
            TeamApplication.id != application.id,
        )
        .all()
    )

    for other_app in other_applications:
        other_app.status = TeamStatusEnum.REJECTED

    db.commit()
    db.refresh(application)
    return application


def get_available_projects_for_student(db: Session, student_id: int):
    """Get all available projects that the student is eligible for"""
    from app.database.models.student_models import Student

    # Get student information to check eligibility
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get all projects that are open or in progress
    projects = (
        db.query(Project)
        .filter(
            Project.status.in_([ProjectStatusEnum.OPEN, ProjectStatusEnum.IN_PROGRESS])
        )
        .all()
    )

    # Format projects with eligibility information
    result = []
    for project in projects:
        # Check if student has already applied to this project
        has_applied = False
        student_teams = get_student_teams(db, student_id)
        student_team_ids = [team.id for team in student_teams]

        if student_team_ids:
            application = (
                db.query(TeamApplication)
                .filter(
                    TeamApplication.project_id == project.id,
                    TeamApplication.team_id.in_(student_team_ids),
                )
                .first()
            )
            has_applied = application is not None

        # Check if deadline has passed (using the last milestone as deadline)
        deadline_passed = False
        due_date = None
        if project.milestones:
            due_date = max(milestone.due_date for milestone in project.milestones)
            if due_date and due_date < datetime.now().date():
                deadline_passed = True

        # Determine if student is eligible (based on academic year)
        is_eligible = True  # Default to eligible

        # Format project data
        project_data = {
            "id": project.id,
            "title": project.title,
            "summary": project.description,
            "professor": project.professor.user.full_name,
            "department": project.professor.department.value,
            "yearEligibility": [project.year.value],  # Convert to list for frontend
            "teamSize": "2-4",  # Default team size
            "tags": project.tags if project.tags else [],
            "deadline": due_date.isoformat() if due_date else None,
            "isEligible": is_eligible,
            "hasApplied": has_applied,
            "deadlinePassed": deadline_passed,
            "status": project.status.value,
        }

        result.append(project_data)

    return result


def get_student_teams(db: Session, student_id: int):
    """Get all teams that the student is a member of"""
    from app.database.models.project_models import TeamMember

    # Find all team memberships for the student
    team_memberships = (
        db.query(TeamMember).filter(TeamMember.student_id == student_id).all()
    )

    # Get the teams
    team_ids = [membership.team_id for membership in team_memberships]
    teams = db.query(ProjectTeam).filter(ProjectTeam.id.in_(team_ids)).all()

    return teams


def get_team_applications_by_student(db: Session, student_id: int):
    """Get all applications made by the student's teams"""
    # Get teams where student is a member
    teams = get_student_teams(db, student_id)
    team_ids = [team.id for team in teams]

    if not team_ids:
        return []

    # Get applications for these teams
    applications = (
        db.query(TeamApplication).filter(TeamApplication.team_id.in_(team_ids)).all()
    )

    return applications


def withdraw_team_application(db: Session, application_id: int, student_id: int):
    """Withdraw a team application (only team leader can withdraw)"""
    # Get the application
    application = (
        db.query(TeamApplication).filter(TeamApplication.id == application_id).first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Get the team
    team = db.query(ProjectTeam).filter(ProjectTeam.id == application.team_id).first()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if student is the team leader
    if team.leader_id != student_id:
        raise HTTPException(
            status_code=403, detail="Only team leader can withdraw an application"
        )

    # Delete the application
    db.delete(application)
    db.commit()

    return {"detail": "Application withdrawn successfully"}


def get_student_active_projects(db: Session, student_id: int):
    """Get all projects that the student is actively working on"""
    # Get teams where student is a member
    teams = get_student_teams(db, student_id)

    result = []
    for team in teams:
        if team.project_id:
            project = get_project_by_id(db, team.project_id)
            if project:
                team_members = (
                    db.query(TeamMember).filter(TeamMember.team_id == team.id).all()
                )

                members = []
                for member in team_members:
                    student = (
                        db.query(Student)
                        .filter(Student.id == member.student_id)
                        .first()
                    )
                    if student and student.user:
                        members.append(
                            {
                                "id": student.id,
                                "name": student.user.full_name,
                                "email": student.user.email,
                                "initials": "".join(
                                    [
                                        name[0].upper()
                                        for name in student.user.full_name.split()
                                        if name
                                    ]
                                )[:2],
                                "isLeader": member.student_id == team.leader_id,
                            }
                        )

                milestones = (
                    db.query(Milestone)
                    .filter(Milestone.project_id == project.id)
                    .order_by(Milestone.due_date)
                    .all()
                )

                # Include milestone data in response
                milestone_data = []
                for milestone in milestones:
                    submission = (
                        db.query(MilestoneSubmission)
                        .filter_by(milestone_id=milestone.id, team_id=team.id)
                        .first()
                    )
                    milestone_data.append(
                        {
                            "id": milestone.id,
                            "title": milestone.title,
                            "description": milestone.description,
                            "dueDate": milestone.due_date,
                            "isSubmitted": submission is not None,
                            "submissionDate": submission.submitted_at
                            if submission
                            else None,
                        }
                    )

                total_milestones = len(milestones)
                completed_milestones = sum(
                    1
                    for m in milestones
                    if db.query(MilestoneSubmission)
                    .filter_by(milestone_id=m.id, team_id=team.id)
                    .first()
                )
                progress = (
                    int(completed_milestones / total_milestones * 100)
                    if total_milestones > 0
                    else 0
                )

                upcoming_deadlines = []
                for milestone in milestones:
                    submission = (
                        db.query(MilestoneSubmission)
                        .filter_by(milestone_id=milestone.id, team_id=team.id)
                        .first()
                    )
                    if not submission and milestone.due_date:
                        upcoming_deadlines.append(
                            {"milestone": milestone.title, "date": milestone.due_date}
                        )

                is_near_deadline = False
                current_milestone = "Not started"
                if upcoming_deadlines:
                    current_milestone = upcoming_deadlines[0]["milestone"]
                    # Add logic to check if deadline is within 7 days if needed

                project_data = {
                    "id": project.id,
                    "title": project.title,
                    "professor": project.professor.user.full_name
                    if project.professor and project.professor.user
                    else "Unknown",
                    "status": project.status.value,
                    "teamMembers": members,
                    "currentMilestone": current_milestone,
                    "progress": progress,
                    "dueDates": upcoming_deadlines,
                    "isTeamBased": True,
                    "isNearDeadline": is_near_deadline,
                    "isCompleted": project.status == ProjectStatusEnum.COMPLETED,
                    "team": {"id": team.id, "name": team.name},
                    "milestones": milestone_data,  # ✅ Added milestones
                }

                result.append(project_data)

    return result


def get_all_teams(db: Session):
    """Get all teams available for collaboration"""
    teams = db.query(ProjectTeam).all()

    result = []
    for team in teams:
        # Get team members
        team_members = db.query(TeamMember).filter(TeamMember.team_id == team.id).all()

        # Get team leader
        leader = None
        if team.leader_id:
            student = db.query(Student).filter(Student.id == team.leader_id).first()
            if student and student.user:
                leader = student.user.full_name

        # Get project info
        project_titles = []
        if team.project_id:
            project = db.query(Project).filter(Project.id == team.project_id).first()
            if project:
                project_titles.append(project.title)

        # Determine if team is open for new members
        is_open = len(team_members) < 4 and not team.is_locked

        # Format team data
        team_data = {
            "id": team.id,
            "name": team.name,
            "members": len(team_members),
            "max_members": 4,
            "open_positions": [],  # This would need to be added as a field to the team model
            "tags": [],  # This would need to be derived from project or added to team model
            "projects": project_titles,
            "is_open": is_open,
            "leader_id": team.leader_id,
            "leader_name": leader or "Unknown",
        }

        result.append(team_data)

    return result


def get_all_students_with_details(db: Session):
    """Get all students with their skills and interests"""
    students = db.query(Student).all()

    result = []
    for student in students:
        if not student.user:
            continue

        # Get teams the student is part of
        team_memberships = (
            db.query(TeamMember).filter(TeamMember.student_id == student.id).all()
        )

        team_ids = [tm.team_id for tm in team_memberships]

        # Generate initials from full name
        initials = "".join(
            [name[0].upper() for name in student.user.full_name.split() if name]
        )[:2]

        # Format student data
        student_data = {
            "id": student.id,
            "name": student.user.full_name,
            "year": student.year.value if student.year else "Unknown",
            "department": student.department.value if student.department else "Unknown",
            "skills": student.skills or [],
            "interests": student.interests or [],
            "availability": student.availability or "Unknown",
            "avatar": None,  # No avatar storage implemented yet
            "initials": initials,
            "teams": team_ids,
        }

        result.append(student_data)

    return result


def get_student_teams_detailed(db: Session, student_id: int):
    """Get all teams that the student is a member of with detailed information"""
    # Find all team memberships for the student
    team_memberships = (
        db.query(TeamMember).filter(TeamMember.student_id == student_id).all()
    )

    # Get the teams
    team_ids = [membership.team_id for membership in team_memberships]
    teams = db.query(ProjectTeam).filter(ProjectTeam.id.in_(team_ids)).all()

    result = []
    for team in teams:
        # Get team members
        team_members = db.query(TeamMember).filter(TeamMember.team_id == team.id).all()

        # Get team leader
        leader = None
        if team.leader_id:
            student = db.query(Student).filter(Student.id == team.leader_id).first()
            if student and student.user:
                leader = student.user.full_name

        # Get project info
        project_titles = []
        if team.project_id:
            project = db.query(Project).filter(Project.id == team.project_id).first()
            if project:
                project_titles.append(project.title)

        # Determine if team is open for new members
        is_open = len(team_members) < 4 and not team.is_locked

        # Format team data
        team_data = {
            "id": team.id,
            "name": team.name,
            "members": len(team_members),
            "max_members": 4,
            "open_positions": [],  # This would need to be added as a field to the team model
            "tags": [],  # This would need to be derived from project or added to team model
            "projects": project_titles,
            "is_open": is_open,
            "leader_id": team.leader_id,
            "leader_name": leader or "Unknown",
        }

        result.append(team_data)

    return result


def apply_to_team(db: Session, application_data: dict, student_id: int):
    """Apply to join a team"""
    # Verify team exists
    team = (
        db.query(ProjectTeam)
        .filter(ProjectTeam.id == application_data["team_id"])
        .first()
    )
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if student is already a member of the team
    existing_membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == application_data["team_id"],
            TeamMember.student_id == student_id,
        )
        .first()
    )

    if existing_membership:
        raise HTTPException(
            status_code=400, detail="Student is already a member of this team"
        )

    # Check if team is full
    team_members = (
        db.query(TeamMember)
        .filter(TeamMember.team_id == application_data["team_id"])
        .all()
    )

    if len(team_members) >= 4:
        raise HTTPException(status_code=400, detail="Team is already full")

    # Check if student already applied to this team
    existing_application = (
        db.query(StudentTeamApplication)
        .filter(
            StudentTeamApplication.team_id == application_data["team_id"],
            StudentTeamApplication.student_id == student_id,
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=400, detail="Student already applied to this team"
        )

    # Create application
    new_application = StudentTeamApplication(
        team_id=application_data["team_id"],
        student_id=student_id,
        message=application_data.get("message"),
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


def get_student_team_applications(db: Session, student_id: int):
    """Get all team applications made by the student"""
    applications = (
        db.query(StudentTeamApplication)
        .filter(StudentTeamApplication.student_id == student_id)
        .all()
    )

    result = []
    for app in applications:
        team = db.query(ProjectTeam).filter(ProjectTeam.id == app.team_id).first()

        if not team:
            continue

        application_data = {
            "id": app.id,
            "team_id": app.team_id,
            "team_name": team.name,
            "student_id": app.student_id,
            "status": app.status.value,
            "message": app.message,
            "created_at": app.created_at,
        }

        result.append(application_data)

    return result


def get_team_student_applications(db: Session, team_id: int, student_id: int):
    """Get all applications to join a team (only team leader can view)"""
    # Check if student is the team leader
    team = db.query(ProjectTeam).filter(ProjectTeam.id == team_id).first()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if team.leader_id != student_id:
        raise HTTPException(
            status_code=403, detail="Only the team leader can view applications"
        )

    # Get all applications for the team
    applications = (
        db.query(StudentTeamApplication)
        .filter(StudentTeamApplication.team_id == team_id)
        .all()
    )

    result = []
    for app in applications:
        student = db.query(Student).filter(Student.id == app.student_id).first()

        if not student or not student.user:
            continue

        application_data = {
            "id": app.id,
            "team_id": app.team_id,
            "student_id": app.student_id,
            "student_name": student.user.full_name,
            "status": app.status.value,
            "message": app.message,
            "created_at": app.created_at,
        }

        result.append(application_data)

    return result


def approve_student_application(db: Session, application_id: int, student_id: int):
    """Approve a student's application to join a team (only team leader can approve)"""
    # Get the application
    application = (
        db.query(StudentTeamApplication)
        .filter(StudentTeamApplication.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Get the team
    team = db.query(ProjectTeam).filter(ProjectTeam.id == application.team_id).first()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if student is the team leader
    if team.leader_id != student_id:
        raise HTTPException(
            status_code=403, detail="Only the team leader can approve applications"
        )

    # Check if team is full
    team_members = db.query(TeamMember).filter(TeamMember.team_id == team.id).all()

    if len(team_members) >= 4:
        application.status = TeamStatusEnum.REJECTED
        db.commit()
        raise HTTPException(status_code=400, detail="Team is already full")

    # Update application status
    application.status = TeamStatusEnum.APPROVED

    # Add student to team
    new_member = TeamMember(team_id=team.id, student_id=application.student_id)

    db.add(new_member)
    db.commit()

    return {"detail": "Application approved and student added to team"}


def reject_student_application(db: Session, application_id: int, student_id: int):
    """Reject a student's application to join a team (only team leader can reject)"""
    # Get the application
    application = (
        db.query(StudentTeamApplication)
        .filter(StudentTeamApplication.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Get the team
    team = db.query(ProjectTeam).filter(ProjectTeam.id == application.team_id).first()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if student is the team leader
    if team.leader_id != student_id:
        raise HTTPException(
            status_code=403, detail="Only the team leader can reject applications"
        )

    # Update application status
    application.status = TeamStatusEnum.REJECTED
    db.commit()

    return {"detail": "Application rejected"}


def update_student_profile(db: Session, student_id: int, profile_data: dict):
    """Update a student's profile with skills, interests, and availability"""
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Update student profile
    if "skills" in profile_data:
        student.skills = profile_data["skills"]

    if "interests" in profile_data:
        student.interests = profile_data["interests"]

    if "availability" in profile_data:
        student.availability = profile_data["availability"]

    db.commit()
    db.refresh(student)

    return student


def submit_milestone_feedback(
    db: Session, milestone_id: int, team_id: int, feedback_data: dict, professor_id: int
):
    """Submit feedback and grade for a milestone submission"""
    # Get the milestone
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()

    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    # Get the project
    project = db.query(Project).filter(Project.id == milestone.project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Verify the professor owns the project
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403,
            detail="Only the professor who created the project can submit feedback",
        )

    # Get the team
    team = db.query(ProjectTeam).filter(ProjectTeam.id == team_id).first()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Verify the team is assigned to the project
    if team.project_id != project.id:
        raise HTTPException(
            status_code=400, detail="This team is not assigned to the project"
        )

    # Get the milestone submission
    submission = (
        db.query(MilestoneSubmission)
        .filter(
            MilestoneSubmission.milestone_id == milestone_id,
            MilestoneSubmission.team_id == team_id,
        )
        .first()
    )

    if not submission:
        # Create a new submission if one doesn't exist
        submission = MilestoneSubmission(
            milestone_id=milestone_id,
            team_id=team_id,
            submitted_at=datetime.now(timezone.utc),
        )
        db.add(submission)

    # Update feedback and grade
    submission.feedback = feedback_data.get("feedback")

    if "grade" in feedback_data:
        try:
            grade = float(feedback_data["grade"])
            if grade < 0 or grade > 100:
                raise ValueError("Grade must be between 0 and 100")
            submission.grade = grade
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    db.commit()
    db.refresh(submission)

    return submission


def add_project_milestone(
    db: Session, project_id: int, milestone_data: dict, professor_id: int
):
    """Add a new milestone to a project"""
    # Get the project
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Verify the professor owns the project
    if project.professor_id != professor_id:
        raise HTTPException(
            status_code=403,
            detail="Only the professor who created the project can add milestones",
        )

    # Create the milestone
    try:
        due_date = datetime.strptime(milestone_data["due_date"], "%Y-%m-%d").date()
    except (ValueError, KeyError):
        raise HTTPException(
            status_code=400, detail="Invalid due date format. Use YYYY-MM-DD"
        )

    try:
        weightage = float(milestone_data.get("weightage", 0))
        if weightage < 0 or weightage > 100:
            raise ValueError("Weightage must be between 0 and 100")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    new_milestone = Milestone(
        title=milestone_data.get("title"),
        description=milestone_data.get("description"),
        due_date=due_date,
        weightage=weightage,
        project_id=project_id,
    )

    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)

    return new_milestone