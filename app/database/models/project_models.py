from datetime import datetime, timezone
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
)
from sqlalchemy.orm import relationship

from app.database.db import Base
from app.schemas.enum_schemas import YearEnum, ProjectStatusEnum, TeamStatusEnum

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    year = Column(Enum(YearEnum), nullable=False)
    tags = Column(JSON, nullable=True)
    status = Column(
        Enum(ProjectStatusEnum),
        default=ProjectStatusEnum.OPEN,
    )

    professor_id = Column(Integer, ForeignKey("professors.id"))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    professor = relationship("Professor", back_populates="projects")
    team = relationship("ProjectTeam", back_populates="project", uselist=False, cascade="all, delete")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete")
    resources = relationship("ProjectResource", back_populates="project", cascade="all, delete")
    team_applications = relationship("TeamApplication", back_populates="project", cascade="all, delete")


class ProjectResource(Base):
    __tablename__ = "project_resources"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    project = relationship("Project", back_populates="resources")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    due_date = Column(Date)
    weightage = Column(Float, nullable=False)  # % of total project
    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="milestones")
    team_submission = relationship("MilestoneSubmission", back_populates="milestone", uselist=False)


class MilestoneSubmission(Base):
    __tablename__ = "milestone_submissions"

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("project_teams.id"))
    milestone_id = Column(Integer, ForeignKey("milestones.id"), unique=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    grade = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)

    milestone = relationship("Milestone", back_populates="team_submission")
    team = relationship("ProjectTeam", back_populates="submissions")
    documents = relationship("SubmissionDocument", back_populates="submission", cascade="all, delete")


class SubmissionDocument(Base):
    __tablename__ = "submission_documents"

    id = Column(Integer, primary_key=True)
    submission_id = Column(Integer, ForeignKey("milestone_submissions.id"))
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.now(timezone.utc))

    submission = relationship("MilestoneSubmission", back_populates="documents")


class ProjectTeam(Base):
    __tablename__ = "project_teams"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), unique=True)
    leader_id = Column(Integer, ForeignKey("students.id"))
    is_locked = Column(Boolean, default=False)
    status = Column(
        Enum(TeamStatusEnum),
        default=TeamStatusEnum.PENDING,
    )

    project = relationship("Project", back_populates="team")
    members = relationship("TeamMember", back_populates="team", cascade="all, delete")
    submissions = relationship("MilestoneSubmission", back_populates="team")
    team_applications = relationship("TeamApplication", back_populates="team", cascade="all, delete")

    def validate_member_count(self, key, member):
        if len(self.members) >= 4:
            raise ValueError("Team cannot have more than 4 members")
        return member


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("project_teams.id"))
    student_id = Column(Integer, ForeignKey("students.id"))

    team = relationship("ProjectTeam", back_populates="members")
    student = relationship("Student")


class TeamApplication(Base):
    __tablename__ = "team_applications"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    team_id = Column(Integer, ForeignKey("project_teams.id"))
    status = Column(
        Enum(TeamStatusEnum),
        default=TeamStatusEnum.PENDING,
    )
    motivation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    project = relationship("Project", back_populates="team_applications")
    team = relationship("ProjectTeam", back_populates="team_applications")


class StudentTeamApplication(Base):
    __tablename__ = "student_team_applications"

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("project_teams.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    status = Column(
        Enum(TeamStatusEnum),
        default=TeamStatusEnum.PENDING,
    )
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    team = relationship("ProjectTeam")
    student = relationship("Student")
