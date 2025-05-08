from sqlalchemy import Column, ForeignKey, Integer, Enum
from sqlalchemy.orm import relationship

from app.database.db import Base

from app.schemas.enum_schemas import TitleEnum, DepartmentEnum

class Professor(Base):
    __tablename__ = "professors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    department = Column(Enum(DepartmentEnum))
    title = Column(Enum(TitleEnum))

    user = relationship("User", back_populates="professor")
    projects = relationship("Project", back_populates="professor")
