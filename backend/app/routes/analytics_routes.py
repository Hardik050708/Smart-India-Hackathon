from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict

from ..database import get_db
from ..models import Challenge, Project, Proposal, CreditLedger, DistrictStats, ChallengeStatus, SeverityLevel, FundingStatus, CreditStatus
from ..schemas import DistrictHotspot, AnalyticsOverview

router = APIRouter(prefix="/api/v1/analytics", tags=["Gov Admin Analytics & 24-District Heatmap"])

@router.get("/jharkhand-heatmap", response_model=List[DistrictHotspot])
async def get_jharkhand_heatmap(db: AsyncSession = Depends(get_db)):
    """
    Gov Admin: 24-District Interactive Heatmap Data for Jharkhand.
    Calculates Hotspot Index based on density of critical challenges.
    """
    res = await db.execute(select(DistrictStats))
    district_rows = res.scalars().all()

    hotspots = []
    for d in district_rows:
        # Hotspot score based on critical ratio
        ratio = (d.critical_challenges / max(1, d.total_challenges)) * 100
        hotspot_index = round(min(100.0, ratio * 0.8 + d.total_challenges * 1.5), 1)

        hotspots.append(DistrictHotspot(
            district_name=d.district_name,
            lat=d.lat,
            lon=d.lon,
            total_challenges=d.total_challenges,
            critical_challenges=d.critical_challenges,
            resolved_challenges=d.resolved_challenges,
            active_projects=d.active_projects,
            csr_funds_pledged=d.csr_funds_pledged,
            hotspot_index=hotspot_index
        ))

    return hotspots

@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(db: AsyncSession = Depends(get_db)):
    # Total challenges
    chal_res = await db.execute(select(Challenge))
    challenges = chal_res.scalars().all()

    total_challenges = len(challenges)
    critical_emergencies = sum(1 for c in challenges if c.severity_level == SeverityLevel.CRITICAL or c.is_emergency)
    resolved_count = sum(1 for c in challenges if c.status == ChallengeStatus.RESOLVED)

    # Categories breakdown
    categories: Dict[str, int] = {}
    for c in challenges:
        cat = c.category or "General"
        categories[cat] = categories.get(cat, 0) + 1

    # Active projects
    proj_res = await db.execute(select(Project))
    projects = proj_res.scalars().all()
    in_progress_projects = len(projects)

    # CSR Funds
    prop_res = await db.execute(select(Proposal))
    proposals = prop_res.scalars().all()
    total_csr_funds = sum(p.pledged_amount for p in proposals)

    # Student Credit Hours
    cred_res = await db.execute(select(CreditLedger).where(CreditLedger.status == CreditStatus.VERIFIED))
    verified_credits = cred_res.scalars().all()
    total_student_credits = sum(c.hours for c in verified_credits)

    return AnalyticsOverview(
        total_challenges=total_challenges,
        critical_emergencies=critical_emergencies,
        in_progress_projects=in_progress_projects,
        resolved_count=resolved_count,
        total_csr_funds=total_csr_funds,
        total_student_credits=total_student_credits,
        districts_covered=24,
        top_categories=categories
    )
