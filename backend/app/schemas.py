from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from .models import UserRole, ChallengeStatus, SeverityLevel, FundingStatus, CreditStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.CITIZEN
    district: Optional[str] = "Ranchi"
    institution_id: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class RoleSwitchRequest(BaseModel):
    role: UserRole

# Institution Schemas
class InstitutionBase(BaseModel):
    name: str
    short_name: str
    district: str
    specialization: str
    departments_json: List[str] = []
    domains_json: List[str] = []
    faculty_count: int = 50
    active_projects: int = 0

class InstitutionResponse(InstitutionBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# AI Scoring Schemas
class ScoreBreakdown(BaseModel):
    hazard_contribution: float
    urgency_contribution: float
    population_contribution: float
    duplicate_contribution: float

class AiAssessmentResult(BaseModel):
    hazard_score: float
    urgency_score: float
    population_score: float
    duplicate_score: float
    priority_score: float
    severity_level: SeverityLevel
    is_emergency: bool
    matched_keywords: List[str]
    breakdown: ScoreBreakdown

class AiPreviewRequest(BaseModel):
    title: str
    description: str
    category: str
    population_affected: int = 100
    duplicate_count: int = 0

# Challenge Schemas
class ChallengeCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    category: str
    district: str
    lat: float
    lon: float
    address: Optional[str] = None
    population_affected: int = 100
    evidence_url: Optional[str] = None

class ChallengeUpdate(BaseModel):
    status: Optional[ChallengeStatus] = None
    local_body_notes: Optional[str] = None

class ChallengeResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    district: str
    lat: float
    lon: float
    address: Optional[str]
    population_affected: int
    hazard_score: float
    urgency_score: float
    population_score: float
    duplicate_score: float
    priority_score: float
    severity_level: SeverityLevel
    is_emergency: bool
    status: ChallengeStatus
    reporter_id: Optional[str]
    routed_hei_id: Optional[str]
    routed_department: Optional[str]
    duplicate_of_id: Optional[str]
    evidence_url: Optional[str]
    upvotes: int
    local_body_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Project Schemas
class ProjectCreate(BaseModel):
    challenge_id: str
    faculty_lead_id: Optional[str] = None
    title: str
    description: Optional[str] = None

class TeamMember(BaseModel):
    student_id: str
    student_name: str
    roll_number: Optional[str] = None
    role: str = "Research Fellow"
    hours_logged: int = 0
    abc_id: Optional[str] = None

class MilestoneStage(BaseModel):
    stage: int
    name: str
    status: str = "pending" # pending, in_progress, completed, approved
    credits_allocated: int = 30
    deliverable_url: Optional[str] = None

class ProjectTeamUpdate(BaseModel):
    team_members: List[TeamMember]

class ProjectMilestonesUpdate(BaseModel):
    milestones: List[MilestoneStage]

class ProjectResponse(BaseModel):
    id: str
    challenge_id: str
    faculty_lead_id: Optional[str]
    hei_id: Optional[str]
    title: str
    description: Optional[str]
    team_members_json: List[Any]
    milestones_json: List[Any]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Proposal Schemas
class ProposalCreate(BaseModel):
    project_id: str
    title: str
    requested_budget: float = Field(..., gt=0)
    mentorship_notes: Optional[str] = None

class ProposalPledge(BaseModel):
    pledged_amount: float = Field(..., gt=0)

class ProposalMentorship(BaseModel):
    mentorship_offered: bool = True
    mentorship_notes: Optional[str] = None

class ProposalResponse(BaseModel):
    id: str
    project_id: str
    csr_partner_id: Optional[str]
    title: str
    requested_budget: float
    pledged_amount: float
    funding_status: FundingStatus
    mentorship_offered: bool
    mentorship_notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Credit Ledger Schemas
class CreditLogCreate(BaseModel):
    project_id: str
    hours: int = Field(..., gt=0, le=500)
    task_description: str = Field(..., min_length=10)
    abc_id: Optional[str] = None

class CreditVerifyRequest(BaseModel):
    status: CreditStatus # VERIFIED or REJECTED
    abc_id: Optional[str] = None

class CreditLedgerResponse(BaseModel):
    id: str
    student_id: str
    project_id: str
    hours: int
    task_description: str
    verified_by_faculty_id: Optional[str]
    abc_id: Optional[str]
    verification_hash: Optional[str]
    status: CreditStatus
    verified_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class NepCertificateResponse(BaseModel):
    certificate_id: str
    student_name: str
    student_roll: str
    institution_name: str
    department: str
    project_title: str
    verified_hours: int
    academic_credits: float
    faculty_supervisor: str
    abc_bank_id: str
    verification_hash: str
    issued_date: str
    status: str = "ISSUED"

# Analytics Schemas
class DistrictHotspot(BaseModel):
    district_name: str
    lat: float
    lon: float
    total_challenges: int
    critical_challenges: int
    resolved_challenges: int
    active_projects: int
    csr_funds_pledged: float
    hotspot_index: float

class AnalyticsOverview(BaseModel):
    total_challenges: int
    critical_emergencies: int
    in_progress_projects: int
    resolved_count: int
    total_csr_funds: float
    total_student_credits: int
    districts_covered: int
    top_categories: Dict[str, int]
