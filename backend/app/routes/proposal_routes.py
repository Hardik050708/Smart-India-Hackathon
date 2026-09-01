from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from ..database import get_db
from ..models import Proposal, Project, FundingStatus, User, UserRole
from ..schemas import ProposalCreate, ProposalPledge, ProposalMentorship, ProposalResponse
from ..auth import get_current_user, require_roles

router = APIRouter(prefix="/api/v1/proposals", tags=["CSR Marketplace & Proposals"])

@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
async def create_proposal(
    payload: ProposalCreate,
    current_user: User = Depends(require_roles([UserRole.FACULTY_LEAD, UserRole.HEI_ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Faculty submits research/prototype proposal to CSR Marketplace for funding.
    """
    proj_res = await db.execute(select(Project).where(Project.id == payload.project_id))
    project = proj_res.scalars().first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    new_prop = Proposal(
        project_id=payload.project_id,
        title=payload.title,
        requested_budget=payload.requested_budget,
        pledged_amount=0.0,
        funding_status=FundingStatus.SEEKING_FUNDING,
        mentorship_offered=False,
        mentorship_notes=payload.mentorship_notes
    )

    db.add(new_prop)
    await db.commit()
    await db.refresh(new_prop)

    return ProposalResponse.model_validate(new_prop)

@router.get("", response_model=List[ProposalResponse])
async def list_proposals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Proposal).order_by(Proposal.created_at.desc()))
    proposals = result.scalars().all()
    return [ProposalResponse.model_validate(p) for p in proposals]

@router.get("/{proposal_id}", response_model=ProposalResponse)
async def get_proposal(proposal_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Proposal).where(Proposal.id == proposal_id))
    proposal = result.scalars().first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found.")
    return ProposalResponse.model_validate(proposal)

@router.post("/{proposal_id}/pledge", response_model=ProposalResponse)
async def pledge_funds(
    proposal_id: str,
    payload: ProposalPledge,
    current_user: User = Depends(require_roles([UserRole.INDUSTRY_CSR, UserRole.GOV_ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    CSR Action: Pledge CSR capital towards grassroots problem solving.
    """
    result = await db.execute(select(Proposal).where(Proposal.id == proposal_id))
    proposal = result.scalars().first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found.")

    proposal.pledged_amount += payload.pledged_amount
    proposal.csr_partner_id = current_user.id

    if proposal.pledged_amount >= proposal.requested_budget:
        proposal.funding_status = FundingStatus.FULLY_FUNDED
    else:
        proposal.funding_status = FundingStatus.PARTIALLY_FUNDED

    await db.commit()
    await db.refresh(proposal)
    return ProposalResponse.model_validate(proposal)

@router.post("/{proposal_id}/mentorship", response_model=ProposalResponse)
async def offer_mentorship(
    proposal_id: str,
    payload: ProposalMentorship,
    current_user: User = Depends(require_roles([UserRole.INDUSTRY_CSR])),
    db: AsyncSession = Depends(get_db)
):
    """
    CSR Action: Offer industry mentorship & corporate R&D lab support.
    """
    result = await db.execute(select(Proposal).where(Proposal.id == proposal_id))
    proposal = result.scalars().first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found.")

    proposal.mentorship_offered = payload.mentorship_offered
    if payload.mentorship_notes:
        proposal.mentorship_notes = f"{current_user.full_name}: {payload.mentorship_notes}"

    await db.commit()
    await db.refresh(proposal)
    return ProposalResponse.model_validate(proposal)
