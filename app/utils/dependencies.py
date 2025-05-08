from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models.professor_models import Professor
from app.database.models.student_models import Student
from app.database.models.user_models import User
from app.utils.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise credentials_exception
    return user


def get_current_professor(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Professor:
    if current_user.role != "professor":
        raise HTTPException(status_code=403, detail="Only professors allowed")

    professor = db.query(Professor).filter(Professor.user_id == current_user.id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")
    return professor


def get_current_student(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Student:
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students allowed")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
