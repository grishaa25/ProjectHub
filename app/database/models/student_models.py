from sqlalchemy import Column, ForeignKey, Integer, String, Enum, JSON
from sqlalchemy.orm import relationship

from app.database.db import Base

from app.schemas.enum_schemas import DepartmentEnum, YearEnum

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    department = Column(Enum(DepartmentEnum))
    year = Column(Enum(YearEnum))
    skills = Column(JSON, nullable=True)
    interests = Column(JSON, nullable=True)
    availability = Column(String, nullable=True)

    user = relationship("User", back_populates="student")
