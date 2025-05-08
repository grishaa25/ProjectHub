"""This is the main entry point for my FastAPI application"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from app.database.models import *
from app.database.db import Base, engine
from app.routes import (
    admin_router,
    auth_router,
    project_router,
    user_router,
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectHub API",
    description="API for Final Year Project Assistance System",
    version="1.0.0",
)

app.include_router(auth_router.router)
app.include_router(admin_router.router)
app.include_router(user_router.router)
app.include_router(project_router.router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(app, port=8000, host="0.0.0.0")
