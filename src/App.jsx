import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { RoleSwitcher } from './components/common/RoleSwitcher';

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
        return <CitizenView />;
      case 'LOCAL_BODY':
        return <LocalBodyView />;
      case 'HEI_ADMIN':
        return <HeiAdminView />;
      case 'FACULTY_LEAD':
        return <FacultyLeadView />;
      case 'STUDENT':
        return <StudentView />;
      case 'INDUSTRY_CSR':
        return <IndustryCsrView />;
      case 'GOV_ADMIN':
        return <GovAdminView />;
      default:
        return <CitizenView />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {renderActiveView()}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
        <Navbar />
        <RoleSwitcher />
        <MainContent />
        <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <p className="font-semibold text-slate-300">Societal Innovation Collaboration Portal • Government of Jharkhand</p>
            <p className="text-[11px] text-slate-500">Smart India Hackathon 2026 • Problem Statement ID: 26043 • NEP 2020 Framework</p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
