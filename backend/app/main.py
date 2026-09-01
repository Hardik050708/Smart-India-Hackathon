import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .database import engine, Base
from .routes import (
    auth_router,
    challenge_router,
    project_router,
    proposal_router,
    credit_router,
    analytics_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Cleanup resources on shutdown
    await engine.dispose()

app = FastAPI(
    title="Jharkhand Societal Innovation Collaboration Portal (SIH-26043)",
    description="Full-stack AI-Driven Platform connecting Citizens, HEIs, CSR/Industry, and Local Bodies for the Government of Jharkhand.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js / Vite / React frontend clients
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(auth_router)
app.include_router(challenge_router)
app.include_router(project_router)
app.include_router(proposal_router)
app.include_router(credit_router)
app.include_router(analytics_router)

@app.get("/", tags=["Health & Status"])
async def root():
    return {
        "portal": "Jharkhand Societal Innovation Collaboration Portal",
        "problem_statement_id": "SIH-26043",
        "status": "operational",
        "version": "1.0.0",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/health", tags=["Health & Status"])
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ai_engine": "active"
    }
