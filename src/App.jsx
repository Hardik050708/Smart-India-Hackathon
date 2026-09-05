import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

// 7 Role Views
import { CitizenView } from './components/views/CitizenView';
import { LocalBodyView } from './components/views/LocalBodyView';
import { HeiAdminView } from './components/views/HeiAdminView';
import { FacultyLeadView } from './components/views/FacultyLeadView';
import { StudentView } from './components/views/StudentView';
import { IndustryCsrView } from './components/views/IndustryCsrView';
import { GovAdminView } from './components/views/GovAdminView';

const MainContent = () => {
  const { currentRole } = useApp();

  const renderActiveView = () => {
    switch (currentRole) {
      case 'CITIZEN':
        return <CitizenView key="CITIZEN" />;
      case 'LOCAL_BODY':
        return <LocalBodyView key="LOCAL_BODY" />;
      case 'HEI_ADMIN':
        return <HeiAdminView key="HEI_ADMIN" />;
      case 'FACULTY_LEAD':
        return <FacultyLeadView key="FACULTY_LEAD" />;
      case 'STUDENT':
        return <StudentView key="STUDENT" />;
      case 'INDUSTRY_CSR':
        return <IndustryCsrView key="INDUSTRY_CSR" />;
      case 'GOV_ADMIN':
        return <GovAdminView key="GOV_ADMIN" />;
      default:
        return <CitizenView key="CITIZEN" />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRole}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {renderActiveView()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-teal-600 selection:text-white">
        <Navbar />
        <MainContent />
        <footer className="mt-auto bg-slate-950 text-slate-400 border-t border-slate-900 py-8 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Societal Innovation Collaboration Portal • Government of Jharkhand</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
              Smart India Hackathon 2026 • Problem Statement ID: 26043 • NEP 2020 Experiential Learning Framework • State-wide 24-District Integration Architecture
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
