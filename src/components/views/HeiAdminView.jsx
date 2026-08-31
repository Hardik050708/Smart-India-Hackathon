import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CsvUploader } from '../common/CsvUploader';
import { JHARKHAND_HEIS } from '../../utils/heiRouting';
import { Building2, Users, BookOpen, UserPlus, CheckCircle, GraduationCap } from 'lucide-react';

export const HeiAdminView = () => {
  const { facultyRoster, bulkUploadFaculty, proposals } = useApp();
  const [selectedHei, setSelectedHei] = useState(JHARKHAND_HEIS[0]);
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-800 text-purple-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            HEI Administration Portal
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">Higher Education Institution Management</h2>
          <p className="text-xs text-purple-100 mt-1 max-w-xl">
            Oversee departmental project routing, bulk upload faculty PI rosters, manage multidisciplinary mentorship capacities, and audit NEP credit allocations.
          </p>
        </div>

        {/* Institution Selector */}
        <div className="bg-purple-950/80 p-3 rounded-xl border border-purple-700/50">
          <label className="block text-[10px] text-purple-300 uppercase font-semibold mb-1">Active Institution Profile</label>
          <select
            value={selectedHei.id}
            onChange={e => setSelectedHei(JHARKHAND_HEIS.find(h => h.id === e.target.value))}
            className="bg-purple-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-purple-600 focus:outline-none"
          >
            {JHARKHAND_HEIS.map(h => <option key={h.id} value={h.id}>{h.shortName} ({h.district})</option>)}
          </select>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Departments</div>
            <div className="text-lg font-black text-slate-900">{selectedHei.departments.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Faculty PIs</div>
            <div className="text-lg font-black text-slate-900">{facultyRoster.length + selectedHei.facultyCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-teal-100 text-teal-700">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Research</div>
            <div className="text-lg font-black text-slate-900">{proposals.length + selectedHei.activeProjects}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">NEP Credit Hours</div>
            <div className="text-lg font-black text-slate-900">1,420 Hrs</div>
          </div>
        </div>
      </div>

      {/* Bulk Faculty Onboarding Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Institutional Faculty Lead Roster ({facultyRoster.length})</span>
          </h3>

          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showUploader ? 'Hide Uploader' : 'Bulk Upload Faculty CSV'}</span>
          </button>
        </div>

        {showUploader && (
          <CsvUploader
            title="Faculty Roster Bulk CSV Ingestion (NEP 2020 Compliant)"
            sampleHeaders={["Full Name", "Institutional Email", "Department", "Designation", "Capacity"]}
            onImport={(rows) => {
              bulkUploadFaculty(rows);
              setShowUploader(false);
            }}
          />
        )}

        {/* Faculty Roster Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Faculty Name</th>
                  <th className="px-4 py-3">Institutional Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Mentorship Capacity</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facultyRoster.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{fac.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{fac.email}</td>
                    <td className="px-4 py-3 text-slate-700">{fac.dept}</td>
                    <td className="px-4 py-3 text-slate-600">{fac.designation}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{fac.maxCapacity} Teams</td>
                    <td className="px-4 py-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
