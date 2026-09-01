import asyncio
import os
import uuid
from datetime import datetime, timedelta

from app.database import engine, AsyncSessionLocal, Base
from app.models import (
    User, UserRole, Institution, Challenge, ChallengeStatus, SeverityLevel,
    Project, Proposal, FundingStatus, CreditLedger, CreditStatus, DistrictStats
)
from app.auth import get_password_hash
from app.ai_engine import assess_ai_severity, route_challenge_to_smart_hei

# 24 Districts of Jharkhand with real geographical coordinates
JHARKHAND_24_DISTRICTS = [
    {"name": "Ranchi", "lat": 23.3441, "lon": 85.3096, "challenges": 18, "critical": 4, "resolved": 11, "active": 3, "csr": 4500000},
    {"name": "Dhanbad", "lat": 23.7957, "lon": 86.4304, "challenges": 24, "critical": 8, "resolved": 12, "active": 4, "csr": 6200000},
    {"name": "East Singhbhum", "lat": 22.8046, "lon": 86.2029, "challenges": 16, "critical": 3, "resolved": 10, "active": 3, "csr": 5800000},
    {"name": "Bokaro", "lat": 23.6693, "lon": 86.1511, "challenges": 14, "critical": 3, "resolved": 8, "active": 3, "csr": 3400000},
    {"name": "Hazaribagh", "lat": 23.9925, "lon": 85.3637, "challenges": 11, "critical": 2, "resolved": 7, "active": 2, "csr": 1800000},
    {"name": "Deoghar", "lat": 24.4826, "lon": 86.7012, "challenges": 13, "critical": 2, "resolved": 9, "active": 2, "csr": 2100000},
    {"name": "Giridih", "lat": 24.1856, "lon": 86.3094, "challenges": 15, "critical": 4, "resolved": 8, "active": 3, "csr": 2500000},
    {"name": "Palamu", "lat": 24.0416, "lon": 84.0722, "challenges": 12, "critical": 3, "resolved": 6, "active": 3, "csr": 1900000},
    {"name": "Dumka", "lat": 24.2676, "lon": 87.2489, "challenges": 10, "critical": 1, "resolved": 7, "active": 2, "csr": 1500000},
    {"name": "Ramgarh", "lat": 23.6300, "lon": 85.5100, "challenges": 9, "critical": 2, "resolved": 5, "active": 2, "csr": 2000000},
    {"name": "West Singhbhum", "lat": 22.5667, "lon": 85.8167, "challenges": 14, "critical": 4, "resolved": 7, "active": 3, "csr": 2800000},
    {"name": "Saraikela Kharsawan", "lat": 22.7000, "lon": 85.9300, "challenges": 8, "critical": 1, "resolved": 5, "active": 2, "csr": 1200000},
    {"name": "Godda", "lat": 24.8300, "lon": 87.2100, "challenges": 7, "critical": 1, "resolved": 4, "active": 2, "csr": 900000},
    {"name": "Sahebganj", "lat": 25.2500, "lon": 87.6500, "challenges": 16, "critical": 5, "resolved": 7, "active": 4, "csr": 3100000},
    {"name": "Pakur", "lat": 24.6300, "lon": 87.8500, "challenges": 6, "critical": 1, "resolved": 4, "active": 1, "csr": 800000},
    {"name": "Jamtara", "lat": 23.9600, "lon": 86.8000, "challenges": 8, "critical": 1, "resolved": 6, "active": 1, "csr": 1100000},
    {"name": "Chatra", "lat": 24.2100, "lon": 84.8700, "challenges": 9, "critical": 2, "resolved": 5, "active": 2, "csr": 1300000},
    {"name": "Koderma", "lat": 24.4700, "lon": 85.6000, "challenges": 10, "critical": 2, "resolved": 6, "active": 2, "csr": 1600000},
    {"name": "Latehar", "lat": 23.7400, "lon": 84.5000, "challenges": 13, "critical": 4, "resolved": 6, "active": 3, "csr": 2200000},
    {"name": "Garhwa", "lat": 24.1600, "lon": 83.8100, "challenges": 8, "critical": 2, "resolved": 4, "active": 2, "csr": 1000000},
    {"name": "Lohardaga", "lat": 23.4400, "lon": 84.6800, "challenges": 7, "critical": 1, "resolved": 5, "active": 1, "csr": 850000},
    {"name": "Gumla", "lat": 23.0400, "lon": 84.5400, "challenges": 11, "critical": 2, "resolved": 7, "active": 2, "csr": 1700000},
    {"name": "Simdega", "lat": 22.6100, "lon": 84.5000, "challenges": 6, "critical": 1, "resolved": 4, "active": 1, "csr": 750000},
    {"name": "Khunti", "lat": 23.0700, "lon": 85.2800, "challenges": 9, "critical": 2, "resolved": 5, "active": 2, "csr": 1400000}
]

async def seed_database():
    print("[INIT] Initializing Database Tables & Seeding Realistic Jharkhand Data...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Seed 24 Jharkhand District Statistics
        print("[1/7] Seeding 24 Jharkhand Districts...")
        for dist in JHARKHAND_24_DISTRICTS:
            stats = DistrictStats(
                district_name=dist["name"],
                lat=dist["lat"],
                lon=dist["lon"],
                total_challenges=dist["challenges"],
                critical_challenges=dist["critical"],
                resolved_challenges=dist["resolved"],
                active_projects=dist["active"],
                csr_funds_pledged=float(dist["csr"])
            )
            session.add(stats)

        # 2. Seed Key Jharkhand Institutions (HEIs)
        print("[2/7] Seeding Jharkhand Higher Education Institutions (HEIs)...")
        heis_data = [
            {
                "id": "hei-bit-mesra",
                "name": "Birla Institute of Technology (BIT) Mesra",
                "short_name": "BIT Mesra",
                "district": "Ranchi",
                "specialization": "Water Quality, Remote Sensing, Renewable Energy, Computer Science & AI",
                "departments_json": ["Environmental Engineering", "Electrical & Electronics", "Remote Sensing & GIS", "Computer Science"],
                "domains_json": ["Water Quality", "Renewable Energy", "Solar Microgrids", "Remote Sensing & GIS", "Computer Science & AI"],
                "faculty_count": 142,
                "active_projects": 18
            },
            {
                "id": "hei-iit-dhanbad",
                "name": "Indian Institute of Technology (IIT ISM) Dhanbad",
                "short_name": "IIT ISM Dhanbad",
                "district": "Dhanbad",
                "specialization": "Mining & Environmental Safety, Hydrogeology, Groundwater, Air Pollution",
                "departments_json": ["Environmental Science & Engineering", "Mining Engineering", "Chemical Engineering", "Applied Geology"],
                "domains_json": ["Mining & Environment", "Groundwater", "Hydrogeology", "Air Pollution", "Mine Fire", "Geotechnical"],
                "faculty_count": 215,
                "active_projects": 29
            },
            {
                "id": "hei-nit-jsr",
                "name": "National Institute of Technology (NIT) Jamshedpur",
                "short_name": "NIT Jamshedpur",
                "district": "East Singhbhum",
                "specialization": "Metallurgy, Slag Recycling, Structural Engineering, Rural Infrastructure",
                "departments_json": ["Civil & Environmental Dept", "Metallurgical Engineering", "Mechanical Engineering"],
                "domains_json": ["Metallurgy & Waste Recycling", "Structural Engineering", "Infrastructure", "Road & Bridge"],
                "faculty_count": 130,
                "active_projects": 14
            },
            {
                "id": "hei-bau-kanke",
                "name": "Birsa Agricultural University (BAU) Kanke",
                "short_name": "BAU Kanke",
                "district": "Ranchi",
                "specialization": "Agro-Tech, Soil Health, Organic Farming & Irrigation Systems",
                "departments_json": ["Agronomy", "Soil Science & Agricultural Chemistry", "Agricultural Engineering"],
                "domains_json": ["Agro-Tech", "Soil Health", "Agriculture", "Irrigation", "Crop Protection", "Organic Farming"],
                "faculty_count": 98,
                "active_projects": 22
            },
            {
                "id": "hei-rims-ranchi",
                "name": "Rajendra Institute of Medical Sciences (RIMS) Ranchi",
                "short_name": "RIMS Ranchi",
                "district": "Ranchi",
                "specialization": "Epidemiology, Community Health, Waterborne Disease Control, Sanitation",
                "departments_json": ["Community Medicine & Preventive Healthcare", "Microbiology", "Biochemistry"],
                "domains_json": ["Public Health", "Sanitation", "Healthcare", "Disease Outbreak", "Community Medicine"],
                "faculty_count": 180,
                "active_projects": 12
            },
            {
                "id": "hei-iiit-ranchi",
                "name": "Indian Institute of Information Technology (IIIT) Ranchi",
                "short_name": "IIIT Ranchi",
                "district": "Ranchi",
                "specialization": "Digital E-Governance, IoT Sensor Networks, Citizen Portals & AI",
                "departments_json": ["Computer Science & Engineering", "Electronics & Communication"],
                "domains_json": ["IT & Governance", "IoT Sensor Networks", "Smart City", "Data Analytics"],
                "faculty_count": 45,
                "active_projects": 8
            }
        ]

        for h in heis_data:
            inst = Institution(**h)
            session.add(inst)

        # 3. Seed 7 Distinct Role Users
        print("[3/7] Seeding 7 Role Users (Argon2 Hashed Passwords)...")
        users_data = [
            {
                "id": "usr-citizen-01",
                "email": "citizen@jharkhand.gov.in",
                "password_hash": get_password_hash("Password123!"),
                "full_name": "Birsa Munda (Grassroots Citizen)",
                "role": UserRole.CITIZEN,
                "district": "Ranchi"
            },
            {
                "id": "usr-localbody-01",
                "email": "localbody@jharkhand.gov.in",
                "password_hash": get_password_hash("Password123!"),
                "full_name": "Officer Ramesh Soren (Panchayat Head)",
                "role": UserRole.LOCAL_BODY,
                "district": "Latehar"
            },
            {
                "id": "usr-heiadmin-01",
                "email": "heiadmin@jharkhand.gov.in",
                "password_hash": get_password_hash("Password123!"),
                "full_name": "Prof. S. K. Mahato (Dean R&D, BIT Mesra)",
                "role": UserRole.HEI_ADMIN,
                "district": "Ranchi",
                "institution_id": "hei-bit-mesra"
            },
            {
                "id": "usr-faculty-01",
                "email": "faculty@jharkhand.gov.in",
                "password_hash": get_password_hash("Password123!"),
                "full_name": "Dr. Alok Kumar (Faculty PI & Supervisor)",
                "role": UserRole.FACULTY_LEAD,
                "district": "Ranchi",
                "institution_id": "hei-bit-mesra"
            },
            {
                "id": "usr-student-01",
                "email": "student@jharkhand.gov.in",
                "password_hash": get_password_hash("Password123!"),
                "full_name": "Ananya Roy (B.Tech Environmental Engg)",
                "role": UserRole.STUDENT,
                "district": "Ranchi",
                "institution_id": "hei-bit-mesra"
            },
            {
                "id": "usr-csr-01",
                "email": "csr@jharkhand.gov.in",
                "password_hash": get_password_hash("Password123!"),
                "full_name": "Pooja Verma (Tata Steel CSR Foundation)",
                "role": UserRole.INDUSTRY_CSR,
                "district": "East Singhbhum"
            },
            {
                "id": "usr-govadmin-01",
                "email": "govadmin@jharkhand.gov.in",
                "password_hash": get_password_hash("Password123!"),
                "full_name": "Secretary Hemant Soren (Higher & Technical Education)",
                "role": UserRole.GOV_ADMIN,
                "district": "Ranchi"
            }
        ]

        for u in users_data:
            user = User(**u)
            session.add(user)

        await session.flush()

        # 4. Seed Realistic Societal Challenges with AI Severity Calculations
        print("[4/7] Seeding Realistic Challenges with 3-Layer AI Formula Scores...")
        challenges_seed_raw = [
            {
                "id": "CHALLENGE-2026-001",
                "title": "Severe Arsenic & Heavy Metal Groundwater Contamination in Sahebganj Ganga Basin",
                "description": "Critical toxic arsenic levels exceeding 0.08 mg/L detected in 14 village community borewells along Ganga basin. Immediate drinking water poisoning hazard impacting 4,200 tribal residents.",
                "category": "Water Quality",
                "district": "Sahebganj",
                "lat": 25.2500,
                "lon": 87.6500,
                "address": "Rajmahal Block, Sahebganj",
                "population_affected": 4200,
                "evidence_url": "https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=800",
                "status": ChallengeStatus.IN_PROGRESS,
                "reporter_id": "usr-citizen-01",
                "routed_hei_id": "hei-bit-mesra",
                "routed_department": "Environmental Engineering"
            },
            {
                "id": "CHALLENGE-2026-002",
                "title": "Bridge Structural Fissure & Imminent Collapse on Latehar-Netarhat Ghat Road",
                "description": "Urgent life threatening bridge structural fissure following heavy monsoon washout. Road block emergency isolating 3 panchayats and 1,800 villagers.",
                "category": "Infrastructure & Rural Transport",
                "district": "Latehar",
                "lat": 23.7400,
                "lon": 84.5000,
                "address": "Netarhat Ghat Section, Latehar",
                "population_affected": 1800,
                "evidence_url": "https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800",
                "status": ChallengeStatus.VERIFIED,
                "reporter_id": "usr-citizen-01",
                "routed_hei_id": "hei-nit-jsr",
                "routed_department": "Civil & Environmental Dept"
            },
            {
                "id": "CHALLENGE-2026-003",
                "title": "Underground Coal Mine Fire & Toxic Gas Leak in Jharia Subsidized Zone",
                "description": "Active toxic mine fire methane gas leak and ground subsidence near residential colony. Immediate carbon monoxide and sulfur poisoning threat to 6,500 residents.",
                "category": "Mining & Environment",
                "district": "Dhanbad",
                "lat": 23.7400,
                "lon": 86.4100,
                "address": "Jharia Khas Coal Belt, Dhanbad",
                "population_affected": 6500,
                "evidence_url": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800",
                "status": ChallengeStatus.REPORTED,
                "reporter_id": "usr-citizen-01",
                "routed_hei_id": "hei-iit-dhanbad",
                "routed_department": "Mining Engineering"
            },
            {
                "id": "CHALLENGE-2026-004",
                "title": "Fall Armyworm Pest Infestation Threatening Kharif Maize Crops in Gumla",
                "description": "Severe agro-pest outbreak destroying 350 hectares of indigenous organic maize. Urgent bio-pesticide and drone spray deployment needed for 2,100 farmers.",
                "category": "Agro-Tech",
                "district": "Gumla",
                "lat": 23.0400,
                "lon": 84.5400,
                "address": "Bishunpur Tribal Agri Cluster, Gumla",
                "population_affected": 2100,
                "evidence_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800",
                "status": ChallengeStatus.PROPOSAL_SUBMITTED,
                "reporter_id": "usr-citizen-01",
                "routed_hei_id": "hei-bau-kanke",
                "routed_department": "Agronomy"
            },
            {
                "id": "CHALLENGE-2026-005",
                "title": "Industrial Steel Slag Leaching into Subarnarekha River Basin",
                "description": "High pH chemical effluent and slag waste runoff entering domestic river water intake near industrial outskirts. Impacting 3,500 downstream residents.",
                "category": "Metallurgy & Waste Recycling",
                "district": "East Singhbhum",
                "lat": 22.8000,
                "lon": 86.2000,
                "address": "Adityapur Industrial Zone, Jamshedpur",
                "population_affected": 3500,
                "evidence_url": "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800",
                "status": ChallengeStatus.IN_PROGRESS,
                "reporter_id": "usr-citizen-01",
                "routed_hei_id": "hei-nit-jsr",
                "routed_department": "Metallurgical Engineering"
            }
        ]

        for c_data in challenges_seed_raw:
            ai_eval = assess_ai_severity(
                title=c_data["title"],
                description=c_data["description"],
                category=c_data["category"],
                population_affected=c_data["population_affected"],
                duplicate_count=0
            )

            chal = Challenge(
                id=c_data["id"],
                title=c_data["title"],
                description=c_data["description"],
                category=c_data["category"],
                district=c_data["district"],
                lat=c_data["lat"],
                lon=c_data["lon"],
                address=c_data["address"],
                population_affected=c_data["population_affected"],
                hazard_score=ai_eval["hazard_score"],
                urgency_score=ai_eval["urgency_score"],
                population_score=ai_eval["population_score"],
                duplicate_score=ai_eval["duplicate_score"],
                priority_score=ai_eval["priority_score"],
                severity_level=ai_eval["severity_level"],
                is_emergency=ai_eval["is_emergency"],
                status=c_data["status"],
                reporter_id=c_data["reporter_id"],
                routed_hei_id=c_data["routed_hei_id"],
                routed_department=c_data["routed_department"],
                evidence_url=c_data["evidence_url"],
                upvotes=14
            )
            session.add(chal)

        await session.flush()

        # 5. Seed Collaborative Projects
        print("[5/7] Seeding Live Collaborative Innovation Projects...")
        proj1 = Project(
            id="PROJ-2026-001",
            challenge_id="CHALLENGE-2026-001",
            faculty_lead_id="usr-faculty-01",
            hei_id="hei-bit-mesra",
            title="Solar-Powered Graphene-Sand Arsenic Remediation Unit for Sahebganj",
            description="Developing an ultra-low-cost indigenous water purification filter capable of reducing Arsenic from 0.08 mg/L to < 0.005 mg/L using localized bio-adsorbents.",
            team_members_json=[
                {"student_id": "usr-student-01", "student_name": "Ananya Roy", "roll_number": "BTECH/ENV/2026/012", "role": "Lead Student Researcher", "hours_logged": 120, "abc_id": "ABC-JH-2026-88129"},
                {"student_id": "usr-student-02", "student_name": "Vikram Soren", "roll_number": "BTECH/CIV/2026/045", "role": "Field Testing Fellow", "hours_logged": 95, "abc_id": "ABC-JH-2026-77341"}
            ],
            milestones_json=[
                {"stage": 1, "name": "Baseline Water Sampling & Spectrophotometry", "status": "approved", "credits_allocated": 30},
                {"stage": 2, "name": "Prototype Filter Design & Lab Synthesis", "status": "in_progress", "credits_allocated": 45},
                {"stage": 3, "name": "Community Pilot Installation in Rajmahal Block", "status": "pending", "credits_allocated": 30},
                {"stage": 4, "name": "Panchayat Handover & Water Quality Sign-off", "status": "pending", "credits_allocated": 15}
            ],
            status="active"
        )
        session.add(proj1)

        # 6. Seed CSR Proposals
        print("[6/7] Seeding CSR Marketplace Proposals & Capital Pledges...")
        prop1 = Proposal(
            id="PROP-2026-101",
            project_id="PROJ-2026-001",
            csr_partner_id="usr-csr-01",
            title="Clean Drinking Water Initiative: Sahebganj Ganga Basin Arsenic Filter Deployment",
            requested_budget=350000.0,
            pledged_amount=350000.0,
            funding_status=FundingStatus.FULLY_FUNDED,
            mentorship_offered=True,
            mentorship_notes="Tata Steel CSR R&D team provides specialized materials analysis testing facilities."
        )
        session.add(prop1)

        # 7. Seed NEP 2020 Credit Ledger & ABC Entries
        print("[7/7] Seeding NEP 2020 Academic Credit Ledger with Cryptographic Proofs...")
        credit1 = CreditLedger(
            id="NEP-CERT-2026-001",
            student_id="usr-student-01",
            project_id="PROJ-2026-001",
            hours=120,
            task_description="Conducted field water sampling across 14 tube-wells in Rajmahal, performed spectrophotometry lab analysis, and calibrated graphene adsorbent columns.",
            verified_by_faculty_id="usr-faculty-01",
            abc_id="ABC-JH-2026-88129",
            verification_hash="0x8f3c4e7b1a2d5e9f0c6b3a8d1e4f7a2c5b9e0d3f6a1c8b4e7d2f5a9c0e3b6a1d",
            status=CreditStatus.VERIFIED,
            verified_at=datetime.utcnow() - timedelta(days=2)
        )
        session.add(credit1)

        credit2 = CreditLedger(
            id="NEP-CERT-2026-002",
            student_id="usr-student-01",
            project_id="PROJ-2026-001",
            hours=45,
            task_description="Synthesized porous activated biochar from agricultural waste for secondary filtration column assembly.",
            verified_by_faculty_id="usr-faculty-01",
            abc_id="ABC-JH-2026-88129",
            status=CreditStatus.PENDING
        )
        session.add(credit2)

        await session.commit()
        print("[SUCCESS] Database successfully seeded with 24 Districts, 6 HEIs, 7 Users, Realistic Challenges, Projects, CSR Pledges, and NEP 2020 Credits!")

if __name__ == "__main__":
    asyncio.run(seed_database())
