from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr
from app.schemas.enum_schemas import TitleEnum, YearEnum, DepartmentEnum


class RoleEnum(str, Enum):
    student = "student"
    professor = "professor"
    admin = "admin"


class UserCreate(BaseModel):
    username: str
    fullname: str
    email: EmailStr
    password: str
    role: RoleEnum
    department: Optional[DepartmentEnum] = None
    year: Optional[YearEnum] = None
    title: Optional[TitleEnum] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
