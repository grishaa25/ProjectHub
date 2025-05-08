from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Admin, Professor, Student, User
from app.schemas.user_schemas import RoleEnum


def get_users(db: Session):
    return db.query(User).all()


def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == RoleEnum.student:
        student = db.query(Student).filter(Student.user_id == user.id).first()
        if student:
            db.delete(student)
    elif user.role == RoleEnum.professor:
        prof = db.query(Professor).filter(Professor.user_id == user.id).first()
        if prof:
            db.delete(prof)
    elif user.role == RoleEnum.admin:
        admin = db.query(Admin).filter(Admin.user_id == user.id).first()
        if admin:
            db.delete(admin)
    db.delete(user)
    db.commit()
    return {"detail": f"User {user.username} and related data deleted"}
