from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from ..database import get_db
from ..models import Project, Challenge, ChallengeStatus, User, UserRole
from ..schemas import ProjectCreate, ProjectResponse, ProjectTeamUpdate, ProjectMilestonesUpdate
from ..auth import get_current_user, require_roles

router = APIRouter(prefix="/api/v1/projects", tags=["Projects & Student Teams"])

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    current_user: User = Depends(require_roles([UserRole.HEI_ADMIN, UserRole.FACULTY_LEAD])),
    db: AsyncSession = Depends(get_db)
):
    """
    HEI Action: Accept Challenge & Spawn Collaborative Innovation Project.
    """
    # Verify challenge exists
    chal_res = await db.execute(select(Challenge).where(Challenge.id == payload.challenge_id))
    challenge = chal_res.scalars().first()
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found.")

    # Default milestone stages for NEP 2020 Experiential Learning
    default_milestones = [
        {"stage": 1, "name": "Problem Definition & Baseline Field Survey", "status": "approved", "credits_allocated": 30},
        {"stage": 2, "name": "Prototype Design & Laboratory Testing", "status": "in_progress", "credits_allocated": 45},
        {"stage": 3, "name": "Pilot Field Validation & Citizen Feedback", "status": "pending", "credits_allocated": 30},
        {"stage": 4, "name": "Public Handover & Final Technical Sign-off", "status": "pending", "credits_allocated": 15}
    ]

    new_project = Project(
        challenge_id=payload.challenge_id,
        faculty_lead_id=payload.faculty_lead_id or current_user.id,
        hei_id=current_user.institution_id,
        title=payload.title,
        description=payload.description or challenge.description,
        team_members_json=[],
        milestones_json=default_milestones,
        status="active"
    )

    # Update challenge status to in_progress
    challenge.status = ChallengeStatus.IN_PROGRESS

    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    return ProjectResponse.model_validate(new_project)

@router.get("", response_model=List[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    projects = result.scalars().all()
    return [ProjectResponse.model_validate(p) for p in projects]

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return ProjectResponse.model_validate(project)

@router.patch("/{project_id}/team", response_model=ProjectResponse)
async def update_project_team(
    project_id: str,
    payload: ProjectTeamUpdate,
    current_user: User = Depends(require_roles([UserRole.FACULTY_LEAD, UserRole.HEI_ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Build Student Team for NEP 2020 Experiential Learning Project.
    """
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    project.team_members_json = [tm.model_dump() for tm in payload.team_members]
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)

@router.patch("/{project_id}/milestones", response_model=ProjectResponse)
async def update_project_milestones(
    project_id: str,
    payload: ProjectMilestonesUpdate,
    current_user: User = Depends(require_roles([UserRole.FACULTY_LEAD, UserRole.HEI_ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    project.milestones_json = [m.model_dump() for m in payload.milestones]
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)
