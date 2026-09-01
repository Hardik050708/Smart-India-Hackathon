from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Any

from ..database import get_db
from ..models import Challenge, ChallengeStatus, SeverityLevel, User, UserRole, Institution
from ..schemas import (
    ChallengeCreate, ChallengeUpdate, ChallengeResponse,
    AiAssessmentResult, AiPreviewRequest, ScoreBreakdown
)
from ..auth import get_current_user_optional, get_current_user, require_roles
from ..ai_engine import assess_ai_severity, check_geo_semantic_deduplication, route_challenge_to_smart_hei

router = APIRouter(prefix="/api/v1/challenges", tags=["Challenges & AI Triage"])

@router.post("/ai/assess", response_model=AiAssessmentResult)
async def preview_ai_assessment(payload: AiPreviewRequest):
    """Instant preview of AI 3-Layer Assessment Formula."""
    result = assess_ai_severity(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        population_affected=payload.population_affected,
        duplicate_count=payload.duplicate_count
    )
    return AiAssessmentResult(
        hazard_score=result["hazard_score"],
        urgency_score=result["urgency_score"],
        population_score=result["population_score"],
        duplicate_score=result["duplicate_score"],
        priority_score=result["priority_score"],
        severity_level=result["severity_level"],
        is_emergency=result["is_emergency"],
        matched_keywords=result["matched_keywords"],
        breakdown=ScoreBreakdown(**result["breakdown"])
    )

@router.post("", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
async def create_challenge(
    payload: ChallengeCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Citizen Wizard Submission:
    1. Runs Haversine Geo-Semantic Deduplication (5km radius + >=80% similarity).
    2. Runs AI 3-Layer Severity & Priority Score Calculation.
    3. Runs Smart HEI Routing to match domain specialization.
    """
    # Fetch existing challenges for deduplication
    existing_result = await db.execute(select(Challenge))
    existing_challenges = existing_result.scalars().all()

    dedup_result = check_geo_semantic_deduplication(
        new_lat=payload.lat,
        new_lon=payload.lon,
        new_title=payload.title,
        new_description=payload.description,
        existing_reports=existing_challenges,
        max_radius_km=5.0,
        similarity_threshold=0.80
    )

    duplicate_count = dedup_result["matched_count"]
    duplicate_of_id = dedup_result["primary_match"]["id"] if dedup_result["is_duplicate"] else None

    # AI 3-Layer Severity Assessment
    ai_eval = assess_ai_severity(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        population_affected=payload.population_affected,
        duplicate_count=duplicate_count
    )

    # Smart HEI Routing
    routing_eval = route_challenge_to_smart_hei(
        category=payload.category,
        district=payload.district,
        description=payload.description
    )

    # Find routed HEI in database if present
    hei_res = await db.execute(select(Institution).where(Institution.name.ilike(f"%{routing_eval['primary_hei_short_name']}%")))
    matched_inst = hei_res.scalars().first()
    routed_hei_id = matched_inst.id if matched_inst else None

    # Create new Challenge model
    new_challenge = Challenge(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        district=payload.district,
        lat=payload.lat,
        lon=payload.lon,
        address=payload.address or f"{payload.district}, Jharkhand",
        population_affected=payload.population_affected,
        hazard_score=ai_eval["hazard_score"],
        urgency_score=ai_eval["urgency_score"],
        population_score=ai_eval["population_score"],
        duplicate_score=ai_eval["duplicate_score"],
        priority_score=ai_eval["priority_score"],
        severity_level=ai_eval["severity_level"],
        is_emergency=ai_eval["is_emergency"],
        status=ChallengeStatus.REPORTED,
        reporter_id=current_user.id if current_user else None,
        routed_hei_id=routed_hei_id,
        routed_department=routing_eval["recommended_department"],
        duplicate_of_id=duplicate_of_id,
        evidence_url=payload.evidence_url,
        upvotes=1
    )

    db.add(new_challenge)
    await db.commit()
    await db.refresh(new_challenge)

    return ChallengeResponse.model_validate(new_challenge)

@router.get("", response_model=List[ChallengeResponse])
async def list_challenges(
    district: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    severity: Optional[SeverityLevel] = Query(None),
    status: Optional[ChallengeStatus] = Query(None),
    is_emergency: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Challenge).order_by(Challenge.priority_score.desc(), Challenge.created_at.desc())

    if district:
        query = query.where(Challenge.district.ilike(f"%{district}%"))
    if category:
        query = query.where(Challenge.category.ilike(f"%{category}%"))
    if severity:
        query = query.where(Challenge.severity_level == severity)
    if status:
        query = query.where(Challenge.status == status)
    if is_emergency is not None:
        query = query.where(Challenge.is_emergency == is_emergency)

    result = await db.execute(query)
    challenges = result.scalars().all()
    return [ChallengeResponse.model_validate(c) for c in challenges]

@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(challenge_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalars().first()
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found.")
    return ChallengeResponse.model_validate(challenge)

@router.post("/{challenge_id}/upvote")
async def upvote_challenge(
    challenge_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalars().first()
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found.")

    challenge.upvotes += 1
    await db.commit()
    await db.refresh(challenge)
    return {"status": "success", "upvotes": challenge.upvotes}

@router.patch("/{challenge_id}/verify", response_model=ChallengeResponse)
async def verify_challenge(
    challenge_id: str,
    payload: ChallengeUpdate,
    current_user: User = Depends(require_roles([UserRole.LOCAL_BODY, UserRole.GOV_ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Strict RBAC: Only LOCAL_BODY or GOV_ADMIN can verify grassroots challenges.
    """
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalars().first()
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found.")

    challenge.status = payload.status or ChallengeStatus.VERIFIED
    if payload.local_body_notes:
        challenge.local_body_notes = payload.local_body_notes
    else:
        challenge.local_body_notes = f"Verified by {current_user.full_name} ({current_user.role.value})"

    await db.commit()
    await db.refresh(challenge)
    return ChallengeResponse.model_validate(challenge)
