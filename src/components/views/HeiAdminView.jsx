import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CsvUploader } from '../common/CsvUploader';
import { JHARKHAND_HEIS } from '../../utils/heiRouting';
import { Building2, Users, BookOpen, UserPlus, CheckCircle, GraduationCap } from 'lucide-react';

export const HeiAdminView = () => {
  const { facultyRoster, bulkUploadFaculty, proposals, t, language } = useApp();
  const [selectedHei, setSelectedHei] = useState(JHARKHAND_HEIS[0]);
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <span className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
              <Building2 className="w-3 h-3 text-purple-400" />
              <span>{t.heiAdmin.tag}</span>
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {t.heiAdmin.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.heiAdmin.subtitle}
            </p>
          </div>

          {/* Institution Selector */}
          <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 shrink-0">
            <label className="block text-[10px] text-purple-300 uppercase font-mono font-semibold mb-1">{t.heiAdmin.activeProfile}</label>
            <select
              value={selectedHei.id}
              onChange={e => setSelectedHei(JHARKHAND_HEIS.find(h => h.id === e.target.value))}
              className="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              {JHARKHAND_HEIS.map(h => <option key={h.id} value={h.id}>{h.shortName} ({h.district})</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-700">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t.heiAdmin.departments}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">{selectedHei.departments.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t.heiAdmin.facultyPIs}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">{facultyRoster.length + selectedHei.facultyCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t.heiAdmin.activeResearch}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">{proposals.length + selectedHei.activeProjects}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t.heiAdmin.nepHours}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">1,420 Hrs</div>
          </div>
        </div>
      </div>

      {/* Bulk Faculty Onboarding Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>{t.heiAdmin.facultyRoster} ({facultyRoster.length})</span>
          </h3>

          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showUploader ? (language === 'hi' ? 'अपलोडर छिपाएं' : 'Hide Uploader') : t.heiAdmin.bulkUpload}</span>
          </button>
        </div>

        {showUploader && (
          <CsvUploader
            type="faculty"
            onUploadSuccess={bulkUploadFaculty}
            onClose={() => setShowUploader(false)}
          />
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {facultyRoster.map(f => (
              <div key={f.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{f.name}</div>
                  <div className="text-slate-500">{f.designation} &bull; {f.dept}</div>
                </div>
                <div className="text-right">
                  <span className="bg-purple-100 text-purple-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                    {language === 'hi' ? `मेंटरशिप क्षमता: ${f.maxCapacity}` : `Capacity: ${f.maxCapacity} Teams`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
