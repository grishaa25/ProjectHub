import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL="postgresql://user:password@localhost/dbname"
    SECRET_KEY = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()
