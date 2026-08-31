import React from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { User, ShieldCheck, Building2, GraduationCap, BookOpen, Coins, Landmark, LogIn, X, Sparkles } from 'lucide-react';

const ICON_MAP = {
  User,
  ShieldCheck,
  Building2,
  GraduationCap,
  BookOpen,
  Coins,
  Landmark
};

export const MOCK_USERS = [
  {
    roleId: 'CITIZEN',
    name: 'Rameshwar Mahto',
    title: 'Grassroots Citizen & Farmer',
    dept: 'Angara Block, Ranchi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    description: 'Report local groundwater contamination, upvote community issues, and track resolution stages.'
  },
  {
    roleId: 'LOCAL_BODY',
    name: 'Suresh Kumar Oraon',
    title: 'Panchayat Development Officer',
    dept: 'Local Municipal Body, Zone 3',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    description: 'Validate ground truth of reported citizen issues and issue field prototype sign-offs.'
  },
  {
    roleId: 'HEI_ADMIN',
    name: 'Dr. Indranil Manna',
    title: 'Vice Chancellor / Admin',
    dept: 'BIT Mesra, Ranchi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    description: 'Oversee institutional research pipelines, manage departments, and bulk upload faculty rosters.'
  },
  {
    roleId: 'FACULTY_LEAD',
    name: 'Dr. Alok Kumar',
    title: 'Professor & Lead PI',
    dept: 'Environmental Engineering, BIT Mesra',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    description: 'Review AI-routed problems, form student research teams, and submit grant proposals.'
  },
  {
    roleId: 'STUDENT',
    name: 'Priya Sharma',
    title: 'Student Engineering Researcher',
    dept: 'B.Tech Environmental Engg (Sem VI)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    description: 'Execute field prototypes, log research hours, and earn official NEP 2020 credit certificates.'
  },
  {
    roleId: 'INDUSTRY_CSR',
    name: 'Rajesh Chintak',
    title: 'Head of CSR Operations',
    dept: 'Tata Steel Foundation',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    description: 'Pledge CSR grant funding, provide equipment/mentorship, and track project milestones.'
  },
  {
    roleId: 'GOV_ADMIN',
    name: 'K. Srinivasan, IAS',
    title: 'Principal Secretary (Higher Education)',
    dept: 'Government of Jharkhand',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    description: 'State-wide 24-district dashboard monitoring, emergency alert intervention, and grant audits.'
  }
];

export const LoginModal = ({ isOpen, onClose }) => {
  const { loginUser } = useApp();

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    loginUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-jharkhand-dark via-teal-900 to-slate-900 text-white p-6 sm:p-8 flex justify-between items-start">
          <div className="space-y-1">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1 w-max">
              <Sparkles className="w-3 h-3" />
              <span>Multi-Role Authentication Portal</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Select Test User Role</h2>
            <p className="text-xs text-teal-200/90 max-w-md">
              Demonstrate the platform from any stakeholder perspective. Click any role below to authenticate instantly with full RBAC permissions.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Selection Grid */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-3">
          {MOCK_USERS.map((u) => {
            const roleConfig = ROLES[u.roleId];
            const IconComponent = ICON_MAP[roleConfig?.icon] || User;

            return (
              <div
                key={u.roleId}
                onClick={() => handleSelectUser(u)}
                className="group bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start space-x-3.5">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-600/20 group-hover:ring-teal-600 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-950">
                        {u.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleConfig.badge}`}>
                        {roleConfig.title}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-teal-700">{u.title} • <span className="text-slate-500">{u.dept}</span></div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{u.description}</p>
                  </div>
                </div>

                <button className="bg-white group-hover:bg-jharkhand-green text-slate-700 group-hover:text-white font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 group-hover:border-teal-600 transition flex items-center space-x-1.5 shrink-0 w-full sm:w-auto justify-center">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login As Role</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Role-Based Access Control (RBAC) Hierarchy • SIH 26043</span>
          <span className="font-mono text-teal-800">State of Jharkhand</span>
        </div>
      </div>
    </div>
  );
};
