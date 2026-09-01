import React from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { motion } from 'framer-motion';
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
  const { currentRole, setCurrentRole, t } = useApp();

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-16 sm:top-20 z-30">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider shrink-0 px-1 hidden lg:block font-mono">
            {t.rbacBarTitle || 'RBAC:'}
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-max">
            {Object.values(ROLES).map((role) => {
              const IconComponent = ICON_MAP[role.icon] || User;
              const isActive = currentRole === role.id;
              const translatedTitle = t.roles ? t.roles[role.id] : role.title;

              return (
                <button
                  key={role.id}
                  onClick={() => setCurrentRole(role.id)}
                  className={`relative flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRoleBg"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{translatedTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
