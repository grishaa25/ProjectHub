from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.database.db import Base
import enum

class RoleEnum(str, enum.Enum):
    student = "student"
    professor = "professor"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)

    student = relationship("Student", back_populates="user", uselist=False)
    professor = relationship("Professor", back_populates="user", uselist=False)
    admin = relationship("Admin", back_populates="user", uselist=False)
