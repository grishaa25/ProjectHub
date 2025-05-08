from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models.admin_models import Admin
from app.database.models.professor_models import Professor
from app.database.models.student_models import Student
from app.services import user_service

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return user_service.get_users(db)


@router.delete("/users/{id}")
def delete_user(id: int, db: Session = Depends(get_db)):
    return user_service.delete_user(id, db)


@router.get("/students")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()


@router.get("/professors")
def get_professors(db: Session = Depends(get_db)):
    return db.query(Professor).all()


@router.get("/admins")
def get_admins(db: Session = Depends(get_db)):
    return db.query(Admin).all()
