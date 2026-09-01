import React, { useState } from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockUsers';
import { api } from '../../services/api';
import {
  User, ShieldCheck, Building2, GraduationCap, BookOpen, Coins,
  Landmark, LogIn, X, Sparkles, KeyRound, CheckCircle2, ArrowRight, Zap
} from 'lucide-react';

const ICON_MAP = {
  User,
  ShieldCheck,
  Building2,
  GraduationCap,
  BookOpen,
  Coins,
  Landmark
};

export const LoginModal = ({ isOpen, onClose }) => {
  const { loginUser } = useApp();
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'form'
  const [email, setEmail] = useState('citizen@jharkhand.gov.in');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleQuickLogin = async (user) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Attempt backend authentication
      try {
        await api.auth.login(user.email, user.password || 'Password123!');
      } catch (err) {
        // Fallback demo switch if backend is starting
        try {
          await api.auth.switchRoleDemo(user.roleId);
        } catch (_) {}
      }

      loginUser(user);
      setSuccessMsg(`Authenticated as ${user.name} (${user.roleId})`);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg(null);
        onClose();
      }, 350);
    } catch (e) {
      loginUser(user);
      setIsLoading(false);
      onClose();
    }
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      let loggedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      try {
        const res = await api.auth.login(email, password);
        if (res.user) {
          loggedUser = {
            roleId: res.user.role,
            name: res.user.full_name,
            title: `${res.user.role} Member`,
            dept: `${res.user.district || 'Ranchi'} District`,
            avatar: loggedUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            email: res.user.email,
            description: `Active ${res.user.role} user in Jharkhand.`
          };
        }
      } catch (err) {
        // Mock fallback if user matches mock list
        if (!loggedUser) {
          throw new Error('Invalid email or password. Please use one of the demo role credentials.');
        }
      }

      if (loggedUser) {
        loginUser(loggedUser);
        setSuccessMsg(`Welcome, ${loggedUser.name}!`);
        setTimeout(() => {
          setIsLoading(false);
          setSuccessMsg(null);
          onClose();
        }, 350);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
      setIsLoading(false);
    }
  };

  const autofillUser = (u) => {
    setEmail(u.email);
    setPassword(u.password || 'Password123!');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header - Linear.app Aesthetic */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex justify-between items-start border-b border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Instant 1-Click Login</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Choose Your Stakeholder Role
            </h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              Experience the portal seamlessly. Click any role below for instant 1-tap sign-in with full RBAC permissions and JWT credentials.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>1-Click Fast Login ({MOCK_USERS.length} Roles)</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Standard Email & Password</span>
          </button>
        </div>

        {/* Success / Error Messages */}
        {successMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 p-3 text-rose-900 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Tab 1: 1-Click Role Login Grid */}
        {activeTab === 'quick' && (
          <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_USERS.map((u) => {
                const roleConfig = ROLES[u.roleId];
                const IconComponent = ICON_MAP[roleConfig?.icon] || User;

                return (
                  <div
                    key={u.roleId}
                    onClick={() => handleQuickLogin(u)}
                    className="group bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500/60 rounded-2xl p-3.5 transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 group-hover:ring-emerald-500 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-950 truncate">
                            {u.name}
                          </h4>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 truncate">{roleConfig?.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{u.dept}</div>
                      </div>
                    </div>

                    <button className="bg-slate-900 group-hover:bg-emerald-500 text-white group-hover:text-slate-950 font-bold text-[11px] px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1 shadow-sm">
                      <span>Login</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Standard Email & Password Form */}
        {activeTab === 'form' && (
          <div className="p-6 sm:p-8 space-y-5">
            {/* Quick Fill Shortcuts */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Autofill Demo Persona:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_USERS.map((u) => (
                  <button
                    key={u.roleId}
                    type="button"
                    onClick={() => autofillUser(u)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                      email === u.email
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {u.roleId}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Authenticating...' : 'Sign In With Credentials'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>7-Role RBAC Authorization &bull; JWT Token Guard</span>
          <span className="font-mono text-emerald-800 font-bold">Govt of Jharkhand</span>
        </div>

      </div>
    </div>
  );
};
