from enum import Enum

class TitleEnum(str, Enum):
    ASST_PROF = "Asst. Prof"
    ASSOC_PROF = "Assoc. Prof"
    PROF = "Prof"


class DepartmentEnum(str, Enum):
    CSE = "CSE"
    EEE = "EEE"
    ME = "ME"
    AI = "AI"
    ECE = "ECE"


class YearEnum(str, Enum):
    FIRST = "1st Year"
    SECOND = "2nd Year"
    THIRD = "3rd Year"
    FOURTH = "4th Year"


class ProjectStatusEnum(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class TeamStatusEnum(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"