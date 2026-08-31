import React from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { Landmark, RefreshCw, Smartphone, Tablet, Monitor } from 'lucide-react';

export const Navbar = () => {
  const { currentRole, resetToDefaultData } = useApp();
  const roleConfig = ROLES[currentRole];

  return (
    <header className="bg-jharkhand-dark text-white sticky top-0 z-40 shadow-md border-b border-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Govt Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-jharkhand-accent flex items-center justify-center text-jharkhand-dark shadow-sm">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight leading-tight">
                  Societal Innovation Collaboration Portal
                </h1>
                <span className="hidden md:inline-block bg-teal-800 text-teal-200 text-xs px-2 py-0.5 rounded font-mono font-medium">
                  SIH 26043
                </span>
              </div>
              <p className="text-xs text-teal-200/80 hidden sm:block">
                Government of Jharkhand • NEP 2020 Experiential Learning Framework
              </p>
            </div>
          </div>

          {/* Device Responsive Indicators & Active Role */}
          <div className="flex items-center space-x-3">
            {/* Device preview hints */}
            <div className="hidden lg:flex items-center space-x-1 text-teal-300 text-xs bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/50">
              <Monitor className="w-3.5 h-3.5" />
              <Tablet className="w-3.5 h-3.5" />
              <Smartphone className="w-3.5 h-3.5" />
              <span className="ml-1 text-[11px] font-medium">PC • iPad • Mobile</span>
            </div>

            {/* Active Role Badge */}
            <div className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center space-x-1.5 shadow-sm ${roleConfig.badge}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{roleConfig.title}</span>
            </div>

            {/* Data Reset */}
            <button
              onClick={() => {
                if (window.confirm('Reset all portal data back to original Jharkhand mock dataset?')) {
                  resetToDefaultData();
                }
              }}
              title="Reset Mock Data"
              className="p-2 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
