/**
 * API Service Client for Jharkhand Societal Innovation Collaboration Portal (SIH-26043)
 * Connects frontend views to FastAPI Async Backend with automatic JWT token management.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('sih_portal_jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth & RBAC
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Login failed');
      const data = await res.json();
      localStorage.setItem('sih_portal_jwt', data.access_token);
      return data;
    },

    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Registration failed');
      const data = await res.json();
      localStorage.setItem('sih_portal_jwt', data.access_token);
      return data;
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },

    switchRoleDemo: async (role) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/switch-role-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error('Role switch failed');
      const data = await res.json();
      localStorage.setItem('sih_portal_jwt', data.access_token);
      return data;
    }
  },

  // Challenges & AI Triage
  challenges: {
    previewAi: async (params) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/challenges/ai/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('AI calculation failed');
      return res.json();
    },

    create: async (challengeData) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/challenges`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(challengeData)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to report challenge');
      return res.json();
    },

    list: async (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE_URL}/api/v1/challenges${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch challenges');
      return res.json();
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/challenges/${id}`);
      if (!res.ok) throw new Error('Challenge not found');
      return res.json();
    },

    upvote: async (id) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/challenges/${id}/upvote`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Upvote failed');
      return res.json();
    },

    verify: async (id, payload) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/challenges/${id}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Verification failed (RBAC)');
      return res.json();
    }
  },

  // Projects & Student Teams
  projects: {
    create: async (projectData) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to create project');
      return res.json();
    },

    list: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`);
      if (!res.ok) throw new Error('Project not found');
      return res.json();
    },

    updateTeam: async (id, teamMembers) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}/team`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ team_members: teamMembers })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Team update failed');
      return res.json();
    },

    updateMilestones: async (id, milestones) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}/milestones`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ milestones })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Milestones update failed');
      return res.json();
    }
  },

  // CSR Proposals & Marketplace
  proposals: {
    create: async (proposalData) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/proposals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(proposalData)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to submit proposal');
      return res.json();
    },

    list: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/proposals`);
      if (!res.ok) throw new Error('Failed to fetch proposals');
      return res.json();
    },

    pledge: async (id, amount) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/proposals/${id}/pledge`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ pledged_amount: amount })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Pledge failed');
      return res.json();
    },

    offerMentorship: async (id, notes) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/proposals/${id}/mentorship`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ mentorship_offered: true, mentorship_notes: notes })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Mentorship offer failed');
      return res.json();
    }
  },

  // NEP 2020 Credits & ABC
  credits: {
    logHours: async (creditData) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/credits/log`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(creditData)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to log credit hours');
      return res.json();
    },

    getMyCredits: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/credits/my-credits`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch credits');
      return res.json();
    },

    getPending: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/credits/pending`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch pending credits');
      return res.json();
    },

    verify: async (id, status, abcId) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/credits/${id}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, abc_id: abcId })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Credit verification failed');
      return res.json();
    },

    getCertificate: async (id) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/credits/certificate/${id}`);
      if (!res.ok) throw new Error('Certificate not found');
      return res.json();
    }
  },

  // Gov Admin Analytics & Heatmap
  analytics: {
    getJharkhandHeatmap: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/jharkhand-heatmap`);
      if (!res.ok) throw new Error('Failed to fetch heatmap data');
      return res.json();
    },

    getOverview: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/overview`);
      if (!res.ok) throw new Error('Failed to fetch analytics overview');
      return res.json();
    }
  }
};
