from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.models.professor_models import Professor
from app.database.models.student_models import Student
from app.database.models.user_models import User
from app.schemas.user_schemas import RoleEnum, UserCreate, UserLogin
from app.utils.logger import get_logger
from app.utils.security import create_access_token, hash_password, verify_password

logger = get_logger(__name__)


def register_user(user_data: UserCreate, db: Session):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed,
        role=user_data.role,
        full_name=user_data.fullname,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if user_data.role == RoleEnum.student:
        student = Student(
            user_id=user.id, department=user_data.department, year=user_data.year
        )
        db.add(student)
    elif user_data.role == RoleEnum.professor:
        professor = Professor(
            user_id=user.id, department=user_data.department, title=user_data.title
        )
        db.add(professor)
    db.commit()
    logger.info("User Created")
    return user


def login_user(user_data: UserLogin, db: Session):
    user = db.query(User).filter(User.email == user_data.email).first()
    logger.info(f"UserData: {user_data}")
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"sub": str(user.id), "role": user.role, "full_name": user.full_name}
    )
    return {"access_token": token}
