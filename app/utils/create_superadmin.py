# create_superadmin.py
from app.database.db import SessionLocal
from app.utils.security import hash_password
from app.database.models.user_models import User, RoleEnum
from app.database.models.admin_models import Admin

db = SessionLocal()

email = "superadmin@example.com"
password = "SuperSecret123"
username = "superadmin"

existing = db.query(User).filter(User.email == email).first()
if existing:
    print("SuperAdmin already exists.")
else:
    user = User(
        username=username,
        email=email,
        hashed_password=hash_password(password),
        role=RoleEnum.admin
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    admin = Admin(user_id=user.id)
    db.add(admin)
    db.commit()

    print("✅ SuperAdmin created successfully.")
