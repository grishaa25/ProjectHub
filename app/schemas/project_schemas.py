# schemas/project.py

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.enum_schemas import YearEnum, ProjectStatusEnum, TeamStatusEnum, DepartmentEnum


class ProjectResourceCreate(BaseModel):
    filename: str
    file_path: str


class ProjectResourceOut(BaseModel):
    id: int
    filename: str
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class SubmissionDocumentCreate(BaseModel):
    filename: str
    file_path: str


class SubmissionDocumentOut(BaseModel):
    id: int
    filename: str
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: date
    weightage: float = Field(..., gt=0, le=100)  # Percentage between 0-100


class MilestoneSubmissionCreate(BaseModel):
    team_id: int
    feedback: Optional[str] = None
    grade: Optional[float] = Field(None, ge=0, le=100)


class MilestoneSubmissionResponse(BaseModel):
    id: int
    team_id: int
    milestone_id: int
    submitted_at: datetime
    grade: Optional[float] = None
    feedback: Optional[str] = None
    submission_text: Optional[str] = None

    class Config:
        from_attributes = True


class MilestoneSubmissionOut(BaseModel):
    id: int
    submitted_at: datetime
    grade: Optional[float]
    feedback: Optional[str]
    documents: List[SubmissionDocumentOut]
    submission_text: Optional[str] = None

    class Config:
        from_attributes = True


class MilestoneOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    due_date: date
    weightage: float
    project_id: int
    team_submission: Optional[MilestoneSubmissionOut]

    class Config:
        from_attributes = True

class StudentOut(BaseModel):
    id: int
    user_id: int
    department: DepartmentEnum
    year: YearEnum
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    availability: Optional[str] = None

class TeamMemberOut(BaseModel):
    id: int
    student_id: int
    student: StudentOut  # Contains nested user info

    class Config:
        from_attributes = True


class ProjectTeamCreate(BaseModel):
    name: str
    project_id: Optional[int] = None
    leader_id: int
    member_ids: List[int] = Field(..., min_items=1, max_items=4)


class ProjectTeamOut(BaseModel):
    id: int
    name: str
    leader_id: int
    is_locked: bool
    status: TeamStatusEnum
    members: List[TeamMemberOut]

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    title: str
    description: str
    year: YearEnum
    tags: Optional[List[str]] = None
    milestones: List[MilestoneCreate]


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    year: Optional[YearEnum] = None
    tags: Optional[List[str]] = None
    status: Optional[ProjectStatusEnum] = None


class ProjectOut(BaseModel):
    id: int
    title: str
    description: str
    year: YearEnum
    tags: Optional[List[str]]
    status: ProjectStatusEnum
    professor_id: int
    created_at: datetime
    team: Optional[ProjectTeamOut]
    milestones: List[MilestoneOut]
    resources: List[ProjectResourceOut]

    class Config:
        from_attributes = True


# New schemas to match the desired JSON format
class StudentInfo(BaseModel):
    id: int
    name: str
    email: str
    year: str
    department: str
    skills: List[str] = []
    interests: List[str] = []
    availability: Optional[str] = None
    avatar: Optional[str] = None
    initials: str = ""

    class Config:
        from_attributes = True


class MilestoneInfo(BaseModel):
    id: int
    title: str
    description: str
    dueDate: date

    class Config:
        from_attributes = True


class SubmittedMilestoneInfo(BaseModel):
    milestoneId: int
    submitted: bool
    submissionDate: Optional[datetime] = None
    files: List[str] = []
    feedback: Optional[str] = None
    grade: Optional[float] = None

    class Config:
        from_attributes = True


class TeamMemberInfo(BaseModel):
    id: int
    name: str
    email: str
    year: str

    class Config:
        from_attributes = True


class TeamInfo(BaseModel):
    id: int
    name: str
    members: List[TeamMemberInfo]
    status: str
    submittedMilestones: List[SubmittedMilestoneInfo] = []

    class Config:
        from_attributes = True


class DetailedProjectOut(BaseModel):
    id: int
    title: str
    description: str
    status: str
    progress: Optional[int] = None
    dueDate: Optional[date] = None
    students: Optional[int] = None
    tags: Optional[List[str]] = None
    academicYear: str
    documents: List[str] = []
    milestones: List[MilestoneInfo] = []
    teams: List[TeamInfo] = []

    class Config:
        from_attributes = True


# Team application schema
class TeamApplicationCreate(BaseModel):
    project_id: int
    team_id: int
    motivation: Optional[str] = None


class TeamApplicationOut(BaseModel):
    id: int
    project_id: int
    team_id: int
    status: TeamStatusEnum
    motivation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Collaborator Finder schemas
class TeamListItem(BaseModel):
    id: int
    name: str
    members: int
    max_members: int = 4
    open_positions: List[str] = []
    tags: List[str] = []
    projects: List[str] = []
    is_open: bool = True
    leader_id: int
    leader_name: str

    class Config:
        from_attributes = True


class StudentListItem(BaseModel):
    id: int
    name: str
    year: str
    department: str
    skills: List[str] = []
    interests: List[str] = []
    availability: Optional[str] = None
    avatar: Optional[str] = None
    initials: str
    teams: List[int] = []

    class Config:
        from_attributes = True


class TeamApplicationRequest(BaseModel):
    team_id: int
    student_id: int
    message: Optional[str] = None


class TeamApplicationResponse(BaseModel):
    id: int
    team_id: int
    student_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class GradeSubmissionRequest(BaseModel):
    grade: float
    feedback: str