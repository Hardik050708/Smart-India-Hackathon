import React, { useState } from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { LoginModal } from '../auth/LoginModal';
import { AiFormulaModal } from './AiFormulaModal';
import { Landmark, RefreshCw, Smartphone, Tablet, Monitor, LogIn, UserCheck, Cpu, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, currentRole, resetToDefaultData } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const roleConfig = ROLES[currentRole];

  return (
    <>
      <header className="bg-jharkhand-dark text-white sticky top-0 z-40 shadow-lg border-b border-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand & Govt Emblem */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-jharkhand-accent flex items-center justify-center text-jharkhand-dark shadow-md ring-2 ring-amber-300/30">
                <Landmark className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-extrabold text-base sm:text-xl tracking-tight leading-tight">
                    Societal Innovation Collaboration Portal
                  </h1>
                  <span className="hidden lg:inline-block bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-widest shadow-sm">
                    SIH 26043
                  </span>
                </div>
                <p className="text-xs text-teal-200/90 hidden sm:block font-medium">
                  Government of Jharkhand • NEP 2020 Experiential Learning Architecture
                </p>
              </div>
            </div>

            {/* Actions: AI Formula Inspector, User Profile & Indicators */}
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              {/* AI Formula Engine Inspector Button */}
              <button
                onClick={() => setShowAiModal(true)}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 to-teal-500/20 hover:from-amber-500/30 hover:to-teal-500/30 border border-amber-400/50 px-3 py-2 rounded-xl text-amber-300 hover:text-amber-200 text-xs font-bold transition shadow-sm"
                title="Open AI Severity Formula Inspector & Simulator"
              >
                <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden md:inline">AI Formula Simulator</span>
              </button>

              {/* Responsive Device Badges */}
              <div className="hidden xl:flex items-center space-x-1.5 text-teal-300 text-xs bg-teal-950/80 px-3 py-1.5 rounded-full border border-teal-800/60 shadow-inner">
                <Monitor className="w-3.5 h-3.5" />
                <Tablet className="w-3.5 h-3.5" />
                <Smartphone className="w-3.5 h-3.5" />
                <span className="ml-1 text-[11px] font-semibold text-teal-200">PC • iPad • Mobile</span>
              </div>

              {/* Logged in User Badge & Login Modal Button */}
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2.5 bg-teal-950/90 hover:bg-teal-900 border border-teal-700/60 p-1.5 sm:pr-3.5 rounded-2xl transition-all shadow-sm group touch-target"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-teal-500/40 shrink-0"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center space-x-1">
                    <span>{currentUser?.name || 'Logged User'}</span>
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-teal-300/80 font-medium truncate max-w-[120px]">
                    {roleConfig?.title || 'Citizen'}
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-teal-800/60 group-hover:bg-amber-400 group-hover:text-slate-950 text-teal-200 transition">
                  <LogIn className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Data Reset */}
              <button
                onClick={() => {
                  if (window.confirm('Reset all portal data back to original Jharkhand mock dataset?')) {
                    resetToDefaultData();
                  }
                }}
                title="Reset Mock Data"
                className="p-2.5 rounded-xl bg-teal-950/60 hover:bg-teal-900 text-teal-300 hover:text-white transition border border-teal-800/40 touch-target flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* AI Formula Modal */}
      <AiFormulaModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
    </>
  );
};

