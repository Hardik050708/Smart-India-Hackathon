import React, { useState } from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { LoginModal } from '../auth/LoginModal';
import { AiFormulaModal } from './AiFormulaModal';
import {
  Landmark, RefreshCw, Search, Languages, LogIn, UserCheck,
  Cpu, Sparkles, X, Globe2
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentUser,
    currentRole,
    resetToDefaultData,
    language,
    toggleLanguage,
    t,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const roleConfig = ROLES[currentRole];

  return (
    <>
      <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Brand & Govt Emblem */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md ring-2 ring-emerald-400/30 font-black shrink-0">
                <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <h1 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight leading-tight text-white line-clamp-1">
                    {t.portalTitle}
                  </h1>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block font-medium truncate max-w-sm lg:max-w-md">
                  {t.portalSubtitle}
                </p>
              </div>
            </div>

            {/* Global Search Bar (Desktop / Tablet) */}
            <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Actions: Search (Mobile), Hindi Language Toggle, User Profile */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
              
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Hindi / English Language Switcher Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold text-white transition shadow-sm hover:border-emerald-500/60"
                title={language === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English'}
              >
                <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold tracking-wide">{t.languageToggle}</span>
              </button>

              {/* User Profile / Role Trigger */}
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 p-1 sm:pr-3 rounded-2xl transition shadow-sm group"
                title="View Role & Profile"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser?.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition flex items-center space-x-1">
                    <span className="truncate max-w-[100px]">{currentUser?.name || 'User'}</span>
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold truncate max-w-[100px]">
                    {t.roles[currentRole] || roleConfig?.title || 'Citizen'}
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                  <LogIn className="w-3 h-3" />
                </div>
              </button>

              {/* Reset Data */}
              <button
                onClick={() => {
                  if (window.confirm(language === 'hi' ? 'क्या आप सभी डेटा को रीसेट करना चाहते हैं?' : 'Reset all portal data back to original Jharkhand dataset?')) {
                    resetToDefaultData();
                  }
                }}
                title={t.resetData}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800 flex items-center justify-center shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Global Search Expandable Bar */}
          {showMobileSearch && (
            <div className="md:hidden pb-3 pt-1 animate-in slide-in-from-top-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                {globalSearch && (
                  <button
                    onClick={() => setGlobalSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* AI Formula Modal */}
      <AiFormulaModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
    </>
  );
};
