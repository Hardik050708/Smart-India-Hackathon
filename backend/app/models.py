import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON, Enum, Index
)
from sqlalchemy.orm import relationship
from .database import Base
import enum

class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    LOCAL_BODY = "LOCAL_BODY"
    HEI_ADMIN = "HEI_ADMIN"
    FACULTY_LEAD = "FACULTY_LEAD"
    STUDENT = "STUDENT"
    INDUSTRY_CSR = "INDUSTRY_CSR"
    GOV_ADMIN = "GOV_ADMIN"

class ChallengeStatus(str, enum.Enum):
    REPORTED = "reported"
    VERIFIED = "verified"
    ROUTED = "routed"
    PROPOSAL_SUBMITTED = "proposal_submitted"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"

class SeverityLevel(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class FundingStatus(str, enum.Enum):
    SEEKING_FUNDING = "seeking_funding"
    PARTIALLY_FUNDED = "partially_funded"
    FULLY_FUNDED = "fully_funded"

class CreditStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    ABC_TRANSFERRED = "ABC_TRANSFERRED"

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CITIZEN)
    district = Column(String(100), nullable=True, default="Ranchi")
    institution_id = Column(String(64), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    institution = relationship("Institution", back_populates="users")
    challenges_reported = relationship("Challenge", back_populates="reporter")
    projects_led = relationship("Project", back_populates="faculty_lead")
    credits_logged = relationship("CreditLedger", foreign_keys="CreditLedger.student_id", back_populates="student")

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    short_name = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    specialization = Column(String(255), nullable=False)
    departments_json = Column(JSON, default=list)  # e.g., ["Environmental Engg", "Civil Engg"]
    domains_json = Column(JSON, default=list)        # e.g., ["Water Quality", "Renewable Energy"]
    faculty_count = Column(Integer, default=50)
    active_projects = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="institution")
    projects = relationship("Project", back_populates="institution")

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(64), primary_key=True, default=lambda: f"CHALLENGE-2026-{uuid.uuid4().hex[:6].upper()}")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False, index=True)
    address = Column(String(255), nullable=True)
    
    # Spatial coordinates & spatial index
    lat = Column(Float, nullable=False, index=True)
    lon = Column(Float, nullable=False, index=True)
    population_affected = Column(Integer, default=100)

    # AI Engine Assessment Breakdown
    hazard_score = Column(Float, default=20.0)
    urgency_score = Column(Float, default=30.0)
    population_score = Column(Float, default=20.0)
    duplicate_score = Column(Float, default=0.0)
    priority_score = Column(Float, default=25.0)
    severity_level = Column(Enum(SeverityLevel), default=SeverityLevel.LOW)
    is_emergency = Column(Boolean, default=False)
    
    # Workflow Status
    status = Column(Enum(ChallengeStatus), default=ChallengeStatus.REPORTED, index=True)
    reporter_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    routed_hei_id = Column(String(64), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    routed_department = Column(String(100), nullable=True)
    duplicate_of_id = Column(String(64), ForeignKey("challenges.id", ondelete="SET NULL"), nullable=True)
    
    evidence_url = Column(String(512), nullable=True)
    upvotes = Column(Integer, default=1)
    local_body_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reporter = relationship("User", back_populates="challenges_reported")
    projects = relationship("Project", back_populates="challenge")
    routed_hei = relationship("Institution", foreign_keys=[routed_hei_id])

    __table_args__ = (
        Index('ix_challenges_lat_lon', 'lat', 'lon'),
    )

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(64), primary_key=True, default=lambda: f"PROJ-2026-{uuid.uuid4().hex[:6].upper()}")
    challenge_id = Column(String(64), ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False)
    faculty_lead_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    hei_id = Column(String(64), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # JSON arrays for student team members and milestone stages
    team_members_json = Column(JSON, default=list) # [{"student_id": "...", "name": "...", "role": "...", "hours": 40}]
    milestones_json = Column(JSON, default=list)   # [{"stage": 1, "name": "Survey", "status": "approved", "credits": 40}]
    status = Column(String(50), default="active")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    challenge = relationship("Challenge", back_populates="projects")
    faculty_lead = relationship("User", back_populates="projects_led")
    institution = relationship("Institution", back_populates="projects")
    proposals = relationship("Proposal", back_populates="project")
    credit_entries = relationship("CreditLedger", back_populates="project")

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String(64), primary_key=True, default=lambda: f"PROP-2026-{uuid.uuid4().hex[:6].upper()}")
    project_id = Column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    csr_partner_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    requested_budget = Column(Float, default=200000.0)
    pledged_amount = Column(Float, default=0.0)
    funding_status = Column(Enum(FundingStatus), default=FundingStatus.SEEKING_FUNDING)
    mentorship_offered = Column(Boolean, default=False)
    mentorship_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="proposals")
    csr_partner = relationship("User", foreign_keys=[csr_partner_id])

class CreditLedger(Base):
    __tablename__ = "credit_ledger"

    id = Column(String(64), primary_key=True, default=lambda: f"NEP-CERT-2026-{uuid.uuid4().hex[:6].upper()}")
    student_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    hours = Column(Integer, default=0)
    task_description = Column(Text, nullable=False)
    verified_by_faculty_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # NEP 2020 Academic Bank of Credits (ABC) credentials
    abc_id = Column(String(100), nullable=True)
    verification_hash = Column(String(128), nullable=True)
    status = Column(Enum(CreditStatus), default=CreditStatus.PENDING)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", foreign_keys=[student_id], back_populates="credits_logged")
    faculty_verifier = relationship("User", foreign_keys=[verified_by_faculty_id])
    project = relationship("Project", back_populates="credit_entries")

class DistrictStats(Base):
    __tablename__ = "district_stats"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    district_name = Column(String(100), unique=True, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    total_challenges = Column(Integer, default=0)
    critical_challenges = Column(Integer, default=0)
    resolved_challenges = Column(Integer, default=0)
    active_projects = Column(Integer, default=0)
    csr_funds_pledged = Column(Float, default=0.0)
