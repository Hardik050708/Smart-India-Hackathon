import React from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { User, ShieldCheck, Building2, GraduationCap, BookOpen, Coins, Landmark } from 'lucide-react';

const ICON_MAP = {
  User,
  ShieldCheck,
  Building2,
  GraduationCap,
  BookOpen,
  Coins,
  Landmark
};

export const RoleSwitcher = () => {
  const { currentRole, setCurrentRole } = useApp();

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider shrink-0 px-2 hidden md:block">
            Test Role:
          </div>

          <div className="flex items-center space-x-1.5 min-w-max">
            {Object.values(ROLES).map((role) => {
              const IconComponent = ICON_MAP[role.icon] || User;
              const isActive = currentRole === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setCurrentRole(role.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-jharkhand-green text-white shadow-sm ring-2 ring-teal-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-jharkhand-accent' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{role.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
