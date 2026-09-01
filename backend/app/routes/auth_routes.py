from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any

from ..database import get_db
from ..models import User, UserRole
from ..schemas import UserCreate, UserLogin, UserResponse, TokenResponse, RoleSwitchRequest
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication & RBAC"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    new_user = User(
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        district=user_in.district,
        institution_id=user_in.institution_id
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "role": new_user.role.value, "email": new_user.email})
    return TokenResponse(access_token=token, token_type="bearer", user=UserResponse.model_validate(new_user))

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email.lower()))
    user = result.scalars().first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token({"sub": user.id, "role": user.role.value, "email": user.email})
    return TokenResponse(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/switch-role-demo", response_model=TokenResponse)
async def switch_role_demo(payload: RoleSwitchRequest, db: AsyncSession = Depends(get_db)):
    """
    Role Switching Helper for Judges / Evaluators / Testing.
    Finds or creates a demo user for the specified role and issues a JWT token.
    """
    role_email = f"demo.{payload.role.value.lower()}@jharkhand.gov.in"
    result = await db.execute(select(User).where(User.email == role_email))
    user = result.scalars().first()

    if not user:
        role_names = {
            UserRole.CITIZEN: "Birsa Munda (Grassroots Citizen)",
            UserRole.LOCAL_BODY: "Officer Ramesh Soren (Panchayat Head)",
            UserRole.HEI_ADMIN: "Prof. S. K. Mahato (Dean R&D, BIT Mesra)",
            UserRole.FACULTY_LEAD: "Dr. Alok Kumar (PI & Faculty Supervisor)",
            UserRole.STUDENT: "Ananya Roy (Student Researcher, B.Tech)",
            UserRole.INDUSTRY_CSR: "Pooja Verma (Tata Steel CSR Lead)",
            UserRole.GOV_ADMIN: "Secretary Hemant Soren (Higher & Technical Education)"
        }
        user = User(
            email=role_email,
            password_hash=get_password_hash("Password123!"),
            full_name=role_names.get(payload.role, f"Demo {payload.role.value}"),
            role=payload.role,
            district="Ranchi"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role.value, "email": user.email})
    return TokenResponse(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))
