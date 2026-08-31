/**
 * Pre-populated realistic initial dataset for Societal Innovation Collaboration Portal
 * Covers 7 RBAC roles, 24 districts of Jharkhand, active research projects, NEP credit ledger, and CSR pledges.
 */

export const INITIAL_CHALLENGES = [
  {
    id: 'CHALLENGE-2026-001',
    title: 'High Arsenic & Heavy Metal Contamination in Rural Groundwater',
    description: 'Groundwater samples from 14 handpumps in Angara block show dangerous levels of arsenic (0.08 mg/L) and iron, causing chronic waterborne illnesses among 4,500 villagers.',
    category: 'Water Quality',
    district: 'Ranchi',
    lat: 23.3850,
    lng: 85.4510,
    address: 'Village Getalsud, Angara Block, Ranchi District',
    reportedBy: 'Rameshwar Mahto (Citizen)',
    reportedDate: '2026-08-15',
    populationAffected: 4500,
    duplicateCount: 3,
    hazardScore: 90,
    urgencyScore: 95,
    populationScore: 80,
    duplicateScore: 75,
    priorityScore: 89, // EMERGENCY ALERT (>=85)
    isEmergency: true,
    urgencyTier: 'Critical',
    status: 'routed', // reported, verified, routed, proposal_submitted, funded, in_progress, prototype_field_tested, completed
    verifiedByLocalBody: true,
    localBodyNotes: 'Field inspection completed on Aug 18. Verified arsenic discoloration and health symptoms. Urgently assigned to BIT Mesra Environmental Engineering.',
    routedHei: 'Birla Institute of Technology (BIT) Mesra',
    routedDept: 'Environmental Engineering',
    upvotes: 142,
    upvotedByUser: false
  },
  {
    id: 'CHALLENGE-2026-002',
    title: 'Coal Mine Tailings Runoff Poisoning Damodar River Tributary',
    description: 'Industrial runoff and heavy sediment from abandoned open-cast mines in Jharia coalfield flowing directly into local drinking water stream affecting 8,000 residents.',
    category: 'Mining & Environment Safety',
    district: 'Dhanbad',
    lat: 23.7500,
    lng: 86.4100,
    address: 'Jharia Coal Belt, Zone 4, Dhanbad District',
    reportedBy: 'Sunita Devi (Citizen)',
    reportedDate: '2026-08-18',
    populationAffected: 8000,
    duplicateCount: 4,
    hazardScore: 95,
    urgencyScore: 90,
    populationScore: 100,
    duplicateScore: 100,
    priorityScore: 94, // EMERGENCY ALERT
    isEmergency: true,
    urgencyTier: 'Critical',
    status: 'in_progress',
    verifiedByLocalBody: true,
    localBodyNotes: 'Local Mukhiya confirmed stream toxicity. Heavy metal filtration prototype currently undergoing Stage 2 testing.',
    routedHei: 'Indian Institute of Technology (IIT ISM) Dhanbad',
    routedDept: 'Environmental Science & Engineering',
    upvotes: 210,
    upvotedByUser: true
  },
  {
    id: 'CHALLENGE-2026-003',
    title: 'Severe Crop Pest Infestation Destroying Paddy Crops in Potka',
    description: 'Brown planthopper infestation destroying over 350 hectares of paddy fields. Farmers lack low-cost organic bio-pesticide sprayers and early warning IoT monitoring.',
    category: 'Agro-Tech',
    district: 'East Singhbhum',
    lat: 22.6200,
    lng: 86.2200,
    address: 'Potka Panchayat, East Singhbhum District',
    reportedBy: 'Birsa Munda (Farmer / Citizen)',
    reportedDate: '2026-08-20',
    populationAffected: 1200,
    duplicateCount: 1,
    hazardScore: 40,
    urgencyScore: 75,
    populationScore: 60,
    duplicateScore: 25,
    priorityScore: 54,
    isEmergency: false,
    urgencyTier: 'High',
    status: 'proposal_submitted',
    verifiedByLocalBody: true,
    localBodyNotes: 'Agri-extension officer verified crop damage. Proposal submitted by BAU Kanke team for solar-powered IoT pest trap.',
    routedHei: 'Birsa Agricultural University (BAU) Kanke',
    routedDept: 'Agronomy & Agri-Engineering',
    upvotes: 88,
    upvotedByUser: false
  },
  {
    id: 'CHALLENGE-2026-004',
    title: 'Lack of Cold Chain Storage for Medicinal Forest Produce',
    description: 'Tribal collectors in Netarhat plateau losing 40% of harvested Mahua flowers and medicinal herbs due to lack of off-grid solar cold storage units.',
    category: 'Renewable Energy',
    district: 'Latehar',
    lat: 23.6800,
    lng: 84.2700,
    address: 'Netarhat Tribal Belt, Latehar District',
    reportedBy: 'Soma Oraon (Citizen)',
    reportedDate: '2026-08-22',
    populationAffected: 950,
    duplicateCount: 0,
    hazardScore: 30,
    urgencyScore: 55,
    populationScore: 60,
    duplicateScore: 0,
    priorityScore: 41,
    isEmergency: false,
    urgencyTier: 'Medium',
    status: 'verified',
    verifiedByLocalBody: true,
    localBodyNotes: 'Local panchayat signoff complete. Awaiting faculty lead team assignment.',
    routedHei: 'NIT Jamshedpur',
    routedDept: 'Mechanical Engineering',
    upvotes: 64,
    upvotedByUser: false
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'PROP-2026-101',
    challengeId: 'CHALLENGE-2026-001',
    challengeTitle: 'High Arsenic & Heavy Metal Contamination in Rural Groundwater',
    heiName: 'BIT Mesra',
    facultyLead: 'Dr. Alok Kumar (Professor, Environmental Engg)',
    facultyEmail: 'alok.kumar@bitmesra.ac.in',
    studentTeam: [
      { name: 'Priya Sharma', roll: 'BTECH/10042/22', role: 'Team Lead / Chemical Analysis' },
      { name: 'Rahul Verma', roll: 'BTECH/10088/22', role: 'Hardware & Sensor Design' },
      { name: 'Amit Das', roll: 'BTECH/10105/23', role: 'Field Deployment' }
    ],
    title: 'Low-Cost Graphene-Oxide Bio-Char Filter with Real-Time IoT Water Quality Node',
    abstract: 'A modular, low-energy water purification column utilizing locally sourced agricultural waste bio-char combined with graphene oxide sheets. Achieves 99.4% arsenic removal at under Rs. 0.08 per liter.',
    requestedBudget: 240000, // INR
    pledgedAmount: 240000,
    fundingStatus: 'fully_funded',
    csrPartner: 'Tata Steel Foundation (CSR)',
    currentStage: 3, // Stage 1: Review, Stage 2: Prototype, Stage 3: Field Testing, Stage 4: Deployment
    milestones: [
      { stage: 1, name: 'Problem Definition & Lab Simulation', status: 'approved', creditsLogged: 60, verifiedByFaculty: true },
      { stage: 2, name: 'Prototype Engineering & Multi-Stage Filtration Unit', status: 'approved', creditsLogged: 90, verifiedByFaculty: true },
      { stage: 3, name: 'Field Testing & Ground Deployment in Getalsud Village', status: 'in_review', creditsLogged: 75, verifiedByFaculty: false },
      { stage: 4, name: 'Community Operational Transfer & Public Handover', status: 'pending', creditsLogged: 0, verifiedByFaculty: false }
    ]
  },
  {
    id: 'PROP-2026-102',
    challengeId: 'CHALLENGE-2026-002',
    challengeTitle: 'Coal Mine Tailings Runoff Poisoning Damodar River Tributary',
    heiName: 'IIT ISM Dhanbad',
    facultyLead: 'Dr. Meenakshi Sundaram (HOD, Mining & Env)',
    facultyEmail: 'meenakshi@iitism.ac.in',
    studentTeam: [
      { name: 'Siddharth Roy', roll: '21JE0892', role: 'Hydrogeologist' },
      { name: 'Ananya Singh', roll: '21JE0412', role: 'Environmental Chemistry' }
    ],
    title: 'Floating Bio-Retention Wetlands & Micro-Algae Acid Neutralization Barrier',
    abstract: 'Deploying engineered floating wetland beds constructed with phytoremediating local plant species and alkaline slag barriers to neutralize acid mine drainage in Damodar tributaries.',
    requestedBudget: 450000,
    pledgedAmount: 300000,
    fundingStatus: 'partially_funded',
    csrPartner: 'Coal India Limited (CIL CSR)',
    currentStage: 2,
    milestones: [
      { stage: 1, name: 'Water Chemistry Profiling & Species Selection', status: 'approved', creditsLogged: 80, verifiedByFaculty: true },
      { stage: 2, name: 'Floating Wetland Grid Construction & Micro-Algae Inoculation', status: 'approved', creditsLogged: 100, verifiedByFaculty: true },
      { stage: 3, name: 'Field Stream Pilot Deployment & Water Testing', status: 'pending', creditsLogged: 0, verifiedByFaculty: false },
      { stage: 4, name: 'District Administration Handover & Maintenance Manual', status: 'pending', creditsLogged: 0, verifiedByFaculty: false }
    ]
  }
];

export const INITIAL_NEP_CREDITS = [
  {
    id: 'NEP-CERT-2026-881',
    studentName: 'Priya Sharma',
    studentRoll: 'BTECH/10042/22',
    institution: 'Birla Institute of Technology (BIT) Mesra',
    department: 'Department of Environmental Engineering',
    projectTitle: 'Low-Cost Graphene-Oxide Bio-Char Filter with Real-Time IoT Water Quality Node',
    academicYear: '2025-2026 (Semester VI)',
    verifiedCreditsHours: 150,
    academicCreditsEquivalent: 5.0, // 30 hrs = 1 credit
    facultySupervisor: 'Dr. Alok Kumar',
    status: 'ISSUED',
    verificationHash: '0x8f7a2b91c4d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    issueDate: '2026-08-28',
    abcBankId: 'ABC-JH-2026-90412'
  },
  {
    id: 'NEP-CERT-2026-882',
    studentName: 'Siddharth Roy',
    studentRoll: '21JE0892',
    institution: 'Indian Institute of Technology (IIT ISM) Dhanbad',
    department: 'Department of Environmental Science & Engineering',
    projectTitle: 'Floating Bio-Retention Wetlands & Micro-Algae Acid Neutralization Barrier',
    academicYear: '2025-2026 (Semester VII)',
    verifiedCreditsHours: 180,
    academicCreditsEquivalent: 6.0,
    facultySupervisor: 'Dr. Meenakshi Sundaram',
    status: 'ISSUED',
    verificationHash: '0x3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b',
    issueDate: '2026-08-29',
    abcBankId: 'ABC-JH-2026-77319'
  }
];

export const INITIAL_CSR_PARTNERS = [
  {
    id: 'CSR-01',
    orgName: 'Tata Steel Foundation',
    cinNumber: 'U85300JH2016NPL008912',
    thematicFocus: 'Water Sanitation, Rural Health, Skilling',
    annualBudget: 15000000,
    pledgedTotal: 4800000,
    contactEmail: 'csr@tatasteelfoundation.org'
  },
  {
    id: 'CSR-02',
    orgName: 'Coal India Limited (CIL CSR)',
    cinNumber: 'L10101WB1973GOI028844',
    thematicFocus: 'Mine Reclamation, Environmental Safety, Bio-remediation',
    annualBudget: 25000000,
    pledgedTotal: 9200000,
    contactEmail: 'community.cil@coalindia.in'
  },
  {
    id: 'CSR-03',
    orgName: 'NTPC Foundation',
    cinNumber: 'L40101DL1975GOI007966',
    thematicFocus: 'Rural Electrification, Solar Microgrids, Agro-Tech',
    annualBudget: 12000000,
    pledgedTotal: 3500000,
    contactEmail: 'csr@ntpc.co.in'
  }
];
