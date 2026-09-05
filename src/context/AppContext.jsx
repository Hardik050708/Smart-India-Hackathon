import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CHALLENGES, INITIAL_PROPOSALS, INITIAL_NEP_CREDITS, INITIAL_CSR_PARTNERS } from '../data/mockData';
import { MOCK_USERS } from '../data/mockUsers';
import { TRANSLATIONS } from '../data/translations';
import { calculateAiSeverity } from '../utils/aiEngine';
import { checkGeoSemanticDuplicates } from '../utils/geoDeduplication';
import { routeChallengeToHei } from '../utils/heiRouting';

const AppContext = createContext();

export const ROLES = {
  CITIZEN: { id: 'CITIZEN', title: 'Grassroots Citizen', icon: 'User', badge: 'bg-emerald-100 text-emerald-800' },
  LOCAL_BODY: { id: 'LOCAL_BODY', title: 'Local Body / Panchayat', icon: 'ShieldCheck', badge: 'bg-blue-100 text-blue-800' },
  HEI_ADMIN: { id: 'HEI_ADMIN', title: 'HEI Administrator', icon: 'Building2', badge: 'bg-purple-100 text-purple-800' },
  FACULTY_LEAD: { id: 'FACULTY_LEAD', title: 'Faculty Lead / PI', icon: 'GraduationCap', badge: 'bg-indigo-100 text-indigo-800' },
  STUDENT: { id: 'STUDENT', title: 'Student Researcher', icon: 'BookOpen', badge: 'bg-amber-100 text-amber-800' },
  INDUSTRY_CSR: { id: 'INDUSTRY_CSR', title: 'Industry & CSR Partner', icon: 'Coins', badge: 'bg-teal-100 text-teal-800' },
  GOV_ADMIN: { id: 'GOV_ADMIN', title: 'Govt Admin (Jharkhand)', icon: 'Landmark', badge: 'bg-rose-100 text-rose-800' },
};

export const AppProvider = ({ children }) => {
  // Bilingual Language State ('en' or 'hi')
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('sih_portal_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('sih_portal_lang', next);
      return next;
    });
  };

  // Global search query
  const [globalSearch, setGlobalSearch] = useState('');

  // Currently authenticated user profile
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sih_portal_user');
      return saved ? JSON.parse(saved) : (MOCK_USERS && MOCK_USERS[0] ? MOCK_USERS[0] : null);
    } catch {
      return MOCK_USERS && MOCK_USERS[0] ? MOCK_USERS[0] : null;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('sih_portal_role') || 'CITIZEN';
    } catch {
      return 'CITIZEN';
    }
  });

  const [challenges, setChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem('sih_portal_challenges_v3');
      return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  });

  const [proposals, setProposals] = useState(() => {
    const saved = localStorage.getItem('sih_portal_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [nepCredits, setNepCredits] = useState(() => {
    const saved = localStorage.getItem('sih_portal_nep_credits');
    return saved ? JSON.parse(saved) : INITIAL_NEP_CREDITS;
  });

  const [csrPartners, setCsrPartners] = useState(() => {
    const saved = localStorage.getItem('sih_portal_csr_partners');
    return saved ? JSON.parse(saved) : INITIAL_CSR_PARTNERS;
  });

  const [facultyRoster, setFacultyRoster] = useState([
    { id: 'f1', name: 'Dr. Alok Kumar', email: 'alok.kumar@bitmesra.ac.in', dept: 'Environmental Engineering', designation: 'Professor', maxCapacity: 5 },
    { id: 'f2', name: 'Dr. Meenakshi Sundaram', email: 'meenakshi@iitism.ac.in', dept: 'Mining Engineering', designation: 'HOD & Assoc Prof', maxCapacity: 4 },
    { id: 'f3', name: 'Dr. Rajesh Sinha', email: 'rsinha@nitjsr.ac.in', dept: 'Civil Engineering', designation: 'Asst Professor', maxCapacity: 3 }
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('sih_portal_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sih_portal_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sih_portal_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('sih_portal_challenges_v3', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('sih_portal_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('sih_portal_nep_credits', JSON.stringify(nepCredits));
  }, [nepCredits]);

  useEffect(() => {
    localStorage.setItem('sih_portal_csr_partners', JSON.stringify(csrPartners));
  }, [csrPartners]);

  // Login handler
  const loginUser = (userProfile) => {
    setCurrentUser(userProfile);
    setCurrentRole(userProfile.roleId);
  };

  const switchRole = (roleId) => {
    setCurrentRole(roleId);
    const matchedUser = MOCK_USERS.find(u => u.roleId === roleId);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    }
  };

  // Translation accessor
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Citizen Action: Submit Challenge
  const addChallenge = (newChallengeData) => {
    const duplicateCheck = checkGeoSemanticDuplicates(newChallengeData, challenges);
    const duplicateCount = duplicateCheck.isDuplicate ? duplicateCheck.matchedCount + 1 : 0;

    const aiAssessment = calculateAiSeverity({
      title: newChallengeData.title,
      description: newChallengeData.description,
      category: newChallengeData.category,
      populationAffected: parseInt(newChallengeData.populationAffected || 100),
      duplicateCount
    });

    const heiRouting = routeChallengeToHei(newChallengeData.category, newChallengeData.district);

    const createdChallenge = {
      id: `CHALLENGE-2026-${String(challenges.length + 1).padStart(3, '0')}`,
      ...newChallengeData,
      reportedBy: currentUser ? `${currentUser.name} (${currentUser.title})` : 'Grassroots Citizen',
      reportedDate: new Date().toISOString().split('T')[0],
      populationAffected: parseInt(newChallengeData.populationAffected || 100),
      duplicateCount,
      hazardScore: aiAssessment.hazardScore,
      urgencyScore: aiAssessment.urgencyScore,
      populationScore: aiAssessment.populationScore,
      duplicateScore: aiAssessment.duplicateScore,
      priorityScore: aiAssessment.priorityScore,
      isEmergency: aiAssessment.isEmergency,
      urgencyTier: aiAssessment.urgencyTier,
      status: 'reported',
      verifiedByLocalBody: false,
      localBodyNotes: '',
      routedHei: heiRouting.primaryHei.name,
      routedDept: heiRouting.recommendedDepartment,
      upvotes: 1,
      upvotedByUser: true,
      duplicateWarning: duplicateCheck.isDuplicate ? `Merged with ${duplicateCheck.matchedCount} nearby report(s)` : null
    };

    setChallenges(prev => [createdChallenge, ...prev]);
    return createdChallenge;
  };

  // Upvote challenge
  const upvoteChallenge = (id) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const isUpvoted = c.upvotedByUser;
        return {
          ...c,
          upvotes: isUpvoted ? c.upvotes - 1 : c.upvotes + 1,
          upvotedByUser: !isUpvoted
        };
      }
      return c;
    }));
  };

  // Delete challenge (for accidental submission)
  const deleteChallenge = (id) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    setProposals(prev => prev.filter(p => p.challengeId !== id));
  };

  // Local Body Verification Sign-off
  const verifyChallengeByLocalBody = (id, notes) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'verified',
          verifiedByLocalBody: true,
          localBodyNotes: notes || `Validated by ${currentUser?.name || 'Local Officer'}.`
        };
      }
      return c;
    }));
  };

  // Faculty Lead Submit Proposal
  const submitProposal = (proposalData) => {
    const newProp = {
      id: `PROP-2026-${String(proposals.length + 101)}`,
      requestedBudget: parseInt(proposalData.requestedBudget || 200000),
      pledgedAmount: 0,
      fundingStatus: 'seeking_funding',
      csrPartner: 'Open for CSR Funding',
      currentStage: 1,
      milestones: [
        { stage: 1, name: 'Problem Definition & Survey', status: 'in_review', creditsLogged: 40, verifiedByFaculty: false },
        { stage: 2, name: 'Prototype Design & Testing', status: 'pending', creditsLogged: 0, verifiedByFaculty: false },
        { stage: 3, name: 'Field Validation Sign-off', status: 'pending', creditsLogged: 0, verifiedByFaculty: false },
        { stage: 4, name: 'Public Handover', status: 'pending', creditsLogged: 0, verifiedByFaculty: false }
      ],
      ...proposalData
    };

    setProposals(prev => [newProp, ...prev]);

    setChallenges(prev => prev.map(c => c.id === proposalData.challengeId ? { ...c, status: 'proposal_submitted' } : c));
  };

  // CSR Funding Pledge
  const pledgeCsrFunds = (proposalId, amount, partnerName) => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        const newPledged = p.pledgedAmount + parseInt(amount);
        const isFullyPledged = newPledged >= p.requestedBudget;
        return {
          ...p,
          pledgedAmount: newPledged,
          csrPartner: partnerName || p.csrPartner,
          fundingStatus: isFullyPledged ? 'fully_funded' : 'partially_funded',
          currentStage: Math.max(p.currentStage, 2)
        };
      }
      return p;
    }));

    const prop = proposals.find(p => p.id === proposalId);
    if (prop) {
      setChallenges(prev => prev.map(c => c.id === prop.challengeId ? { ...c, status: 'in_progress' } : c));
    }
  };

  // Milestone Approval
  const updateMilestoneStatus = (proposalId, milestoneStage, newStatus) => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.stage === milestoneStage) {
            return { ...m, status: newStatus, verifiedByFaculty: newStatus === 'approved' };
          }
          return m;
        });

        const nextStage = updatedMilestones.every(m => m.status === 'approved') ? 4 : milestoneStage + 1;

        return {
          ...p,
          milestones: updatedMilestones,
          currentStage: Math.min(4, nextStage)
        };
      }
      return p;
    }));
  };

  // Issue Official NEP Certificate
  const issueNepCertificate = (studentData) => {
    const cert = {
      id: `NEP-CERT-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: studentData.studentName || studentData.name,
      studentRoll: studentData.studentRoll || studentData.roll || 'BTECH/2026/012',
      institution: studentData.institution || 'BIT Mesra',
      department: studentData.department || 'Environmental Engineering',
      projectTitle: studentData.projectTitle || 'Societal Innovation Research',
      academicYear: '2025-2026 (Semester VI)',
      verifiedCreditsHours: parseInt(studentData.hours || 120),
      academicCreditsEquivalent: (parseInt(studentData.hours || 120) / 30).toFixed(1),
      facultySupervisor: studentData.facultySupervisor || 'Dr. Alok Kumar',
      status: 'ISSUED',
      verificationHash: `0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`,
      issueDate: new Date().toISOString().split('T')[0],
      abcBankId: `ABC-JH-2026-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setNepCredits(prev => [cert, ...prev]);
    return cert;
  };

  // Faculty Bulk CSV Parser
  const bulkUploadFaculty = (facultyList) => {
    const formatted = facultyList.map((f, i) => ({
      id: `f_bulk_${Date.now()}_${i}`,
      name: f.name || f['Full Name'] || 'Faculty Lead',
      email: f.email || f['Institutional Email'] || `faculty${i}@hei.ac.in`,
      dept: f.dept || f['Department'] || 'Engineering',
      designation: f.designation || f['Designation'] || 'Assistant Professor',
      maxCapacity: parseInt(f.maxCapacity || f['Capacity'] || 4)
    }));

    setFacultyRoster(prev => [...formatted, ...prev]);
  };

  // Industry Partner Bulk CSV Parser
  const bulkUploadPartners = (partnerList) => {
    const formatted = partnerList.map((p, i) => ({
      id: `csr_bulk_${Date.now()}_${i}`,
      orgName: p.orgName || p['Organization Name'] || 'Corporate Partner',
      cinNumber: p.cinNumber || p['CIN Number'] || 'U10000JH2026PLC001111',
      thematicFocus: p.thematicFocus || p['Thematic Focus'] || 'Rural & Social Development',
      annualBudget: parseInt(p.annualBudget || p['Budget'] || 5000000),
      pledgedTotal: 0,
      contactEmail: p.contactEmail || p['Email'] || 'contact@csr.org'
    }));

    setCsrPartners(prev => [...formatted, ...prev]);
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setChallenges(INITIAL_CHALLENGES);
    setProposals(INITIAL_PROPOSALS);
    setNepCredits(INITIAL_NEP_CREDITS);
    setCsrPartners(INITIAL_CSR_PARTNERS);
    setCurrentUser(MOCK_USERS[0]);
    setCurrentRole('CITIZEN');
  };

  return (
    <AppContext.Provider value={{
      language,
      toggleLanguage,
      t,
      globalSearch,
      setGlobalSearch,
      currentUser,
      currentRole,
      setCurrentRole: switchRole,
      loginUser,
      challenges,
      proposals,
      nepCredits,
      csrPartners,
      facultyRoster,
      addChallenge,
      deleteChallenge,
      upvoteChallenge,
      verifyChallengeByLocalBody,
      submitProposal,
      pledgeCsrFunds,
      updateMilestoneStatus,
      issueNepCertificate,
      bulkUploadFaculty,
      bulkUploadPartners,
      resetToDefaultData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
