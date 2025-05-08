from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.schemas.user_schemas import UserCreate
from app.database.db import get_db
from app.database.models.user_models import User, RoleEnum
from app.database.models.admin_models import Admin
from app.services.auth_service import register_user
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/api/admin", tags=["Admin"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = jwt.decode(token, "your-super-secret", algorithms=["HS256"])
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    return user

@router.post("/register_admin")
def register_admin(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only superadmin can register admins")

    if user.role != RoleEnum.admin:
        raise HTTPException(status_code=400, detail="Must be registering an admin")

    return register_user(user, db)

@router.post("/init_superadmin")
def init_superadmin(x_secret_key: str = Header(..., alias="X-Secret-Key"), db: Session = Depends(get_db)):
    if x_secret_key != "dev-super-secret-key":
        raise HTTPException(status_code=403, detail="Unauthorized")

    user_data = UserCreate(
        username="superadmin",
        fullname="admin1",
        email="superadmin@example.com",
        password="SuperSecret123",
        role=RoleEnum.admin
    )
    user = register_user(user_data, db)
    admin = Admin(user_id=user.id)
    db.add(admin)
    db.commit()
    return {"detail": "SuperAdmin created"}