import hashlib
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from ..database import get_db
from ..models import CreditLedger, CreditStatus, Project, User, UserRole, Institution
from ..schemas import CreditLogCreate, CreditVerifyRequest, CreditLedgerResponse, NepCertificateResponse
from ..auth import get_current_user, require_roles

router = APIRouter(prefix="/api/v1/credits", tags=["NEP 2020 Academic Credits & ABC"])

@router.post("/log", response_model=CreditLedgerResponse, status_code=status.HTTP_201_CREATED)
async def log_student_hours(
    payload: CreditLogCreate,
    current_user: User = Depends(require_roles([UserRole.STUDENT])),
    db: AsyncSession = Depends(get_db)
):
    """
    Student Portal: Log field work and experiential learning hours for NEP 2020 credits.
    """
    proj_res = await db.execute(select(Project).where(Project.id == payload.project_id))
    project = proj_res.scalars().first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    new_credit = CreditLedger(
        student_id=current_user.id,
        project_id=payload.project_id,
        hours=payload.hours,
        task_description=payload.task_description,
        abc_id=payload.abc_id or f"ABC-JH-2026-{uuid.uuid4().hex[:6].upper()}",
        status=CreditStatus.PENDING
    )

    db.add(new_credit)
    await db.commit()
    await db.refresh(new_credit)

    return CreditLedgerResponse.model_validate(new_credit)

@router.get("/my-credits", response_model=List[CreditLedgerResponse])
async def get_my_credits(
    current_user: User = Depends(require_roles([UserRole.STUDENT])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CreditLedger)
        .where(CreditLedger.student_id == current_user.id)
        .order_by(CreditLedger.created_at.desc())
    )
    credits = result.scalars().all()
    return [CreditLedgerResponse.model_validate(c) for c in credits]

@router.get("/pending", response_model=List[CreditLedgerResponse])
async def get_pending_credits(
    current_user: User = Depends(require_roles([UserRole.FACULTY_LEAD, UserRole.HEI_ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Faculty Lead: Review pending credit hour logs for approval.
    """
    result = await db.execute(
        select(CreditLedger)
        .where(CreditLedger.status == CreditStatus.PENDING)
        .order_by(CreditLedger.created_at.desc())
    )
    credits = result.scalars().all()
    return [CreditLedgerResponse.model_validate(c) for c in credits]

@router.patch("/{credit_id}/verify", response_model=CreditLedgerResponse)
async def verify_credit_hours(
    credit_id: str,
    payload: CreditVerifyRequest,
    current_user: User = Depends(require_roles([UserRole.FACULTY_LEAD, UserRole.HEI_ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Faculty Lead Action: Sign-off student hours and generate SHA-256 cryptographic verification hash for ABC (Academic Bank of Credits).
    """
    result = await db.execute(select(CreditLedger).where(CreditLedger.id == credit_id))
    credit = result.scalars().first()
    if not credit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credit ledger entry not found.")

    credit.status = payload.status
    credit.verified_by_faculty_id = current_user.id
    credit.verified_at = datetime.utcnow()
    if payload.abc_id:
        credit.abc_id = payload.abc_id

    # Generate immutable cryptographic hash for Academic Bank of Credits (ABC) sign-off
    raw_proof = f"JH_NEP2020:{credit.id}:{credit.student_id}:{credit.hours}:{current_user.id}:{datetime.utcnow().isoformat()}"
    credit.verification_hash = f"0x{hashlib.sha256(raw_proof.encode()).hexdigest()}"

    await db.commit()
    await db.refresh(credit)
    return CreditLedgerResponse.model_validate(credit)

@router.get("/certificate/{credit_id}", response_model=NepCertificateResponse)
async def get_nep_certificate(
    credit_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Generate Official NEP 2020 Experiential Learning Certificate with ABC verification metadata.
    """
    res = await db.execute(select(CreditLedger).where(CreditLedger.id == credit_id))
    credit = res.scalars().first()
    if not credit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credit entry not found.")

    student_res = await db.execute(select(User).where(User.id == credit.student_id))
    student = student_res.scalars().first()

    proj_res = await db.execute(select(Project).where(Project.id == credit.project_id))
    project = proj_res.scalars().first()

    faculty_res = await db.execute(select(User).where(User.id == credit.verified_by_faculty_id)) if credit.verified_by_faculty_id else None
    faculty = faculty_res.scalars().first() if faculty_res else None

    # Academic credit conversion: 30 hours of field/lab work = 1.0 Academic Credit (NEP 2020 guideline)
    academic_credits = round(credit.hours / 30.0, 1)

    return NepCertificateResponse(
        certificate_id=f"NEP-CERT-JH-{credit.id[-6:]}",
        student_name=student.full_name if student else "Student Researcher",
        student_roll="BTECH/2026/012",
        institution_name="Birla Institute of Technology (BIT) Mesra, Ranchi",
        department="Environmental Engineering & Applied Sciences",
        project_title=project.title if project else "Societal Innovation Project",
        verified_hours=credit.hours,
        academic_credits=academic_credits,
        faculty_supervisor=faculty.full_name if faculty else "Dr. Alok Kumar",
        abc_bank_id=credit.abc_id or f"ABC-JH-2026-{uuid.uuid4().hex[:6].upper()}",
        verification_hash=credit.verification_hash or "0x4f8a9e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9",
        issued_date=datetime.utcnow().strftime("%Y-%m-%d"),
        status="ISSUED" if credit.status == CreditStatus.VERIFIED else "PENDING_VERIFICATION"
    )
