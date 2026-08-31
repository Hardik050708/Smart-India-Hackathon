import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { CsvUploader } from '../common/CsvUploader';
import { JHARKHAND_DISTRICTS } from '../../data/jharkhandDistricts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Landmark, ShieldAlert, FileSpreadsheet, Activity, Building2, MapPin, Award } from 'lucide-react';

export const GovAdminView = () => {
  const { challenges, proposals, csrPartners, bulkUploadPartners } = useApp();
  const [showUploader, setShowUploader] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const emergencyAlerts = challenges.filter(c => c.isEmergency);

  // Chart data: Issues per district
  const districtChartData = JHARKHAND_DISTRICTS.slice(0, 10).map(d => ({
    name: d.name,
    issues: d.totalIssues,
    projects: d.activeProjects
  }));

  const categoryChartData = [
    { name: 'Water Quality', value: 42, color: '#0f5257' },
    { name: 'Mining Safety', value: 38, color: '#ff9f1c' },
    { name: 'Agro-Tech', value: 29, color: '#10b981' },
    { name: 'Energy', value: 18, color: '#6366f1' },
    { name: 'Healthcare', value: 15, color: '#ec4899' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-950 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="bg-rose-800 text-rose-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Government of Jharkhand • State Monitoring
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">State-wide 24-District Innovation Dashboard</h2>
          <p className="text-xs text-rose-100 mt-1 max-w-xl">
            Real-time GIS emergency heatmaps, district-level problem density monitoring, grant distribution auditing, and corporate partner onboarding.
          </p>
        </div>

        <div className="bg-rose-950/80 p-4 rounded-xl border border-rose-700/50 text-right hidden sm:block">
          <div className="text-2xl font-black text-rose-400">{emergencyAlerts.length}</div>
          <div className="text-[10px] text-rose-200 font-medium">Critical Emergency Alerts (&ge;85)</div>
        </div>
      </div>

      {/* Emergency Alerts Bar */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-red-900 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />
              <span>State Emergency Alert Threshold Triggered (Priority Score &ge; 85)</span>
            </h3>
            <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              Immediate Intervention Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emergencyAlerts.map(em => (
              <div key={em.id} className="bg-white p-3.5 rounded-xl border border-red-200 text-xs space-y-1 shadow-sm">
                <div className="flex justify-between font-bold text-red-900">
                  <span>{em.title}</span>
                  <span className="text-red-600 font-mono">Score: {em.priorityScore}</span>
                </div>
                <div className="text-slate-600">{em.address} ({em.district})</div>
                <div className="text-[10px] text-red-700 font-semibold pt-1">
                  Matched HEI Response: {em.routedHei} ({em.routedDept})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* State Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Distribution Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm lg:col-span-2 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>Top Jharkhand Districts by Societal Challenge Density</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="issues" fill="#0f5257" radius={[4, 4, 0, 0]} name="Reported Issues" />
                <Bar dataKey="projects" fill="#ff9f1c" radius={[4, 4, 0, 0]} name="Active HEI Projects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Challenge Domain Breakdown</h3>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {categoryChartData.map(c => (
              <div key={c.name} className="flex justify-between items-center text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span className="text-slate-700">{c.name}</span>
                </span>
                <span className="font-bold text-slate-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State Interactive Map */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>Interactive 24-District GIS Map & Emergency Hotspots</span>
        </h3>
        <LeafletMap mode="viewer" challenges={challenges} height="320px" />
      </div>

      {/* Corporate Partner Bulk CSV Ingestion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-rose-600" />
            <span>Registered Industry & CSR Partners ({csrPartners.length})</span>
          </h3>

          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{showUploader ? 'Hide Uploader' : 'Bulk Ingest CSR Partners CSV'}</span>
          </button>
        </div>

        {showUploader && (
          <CsvUploader
            title="Industry / CSR Partner Bulk CSV Ingestion Portal"
            sampleHeaders={["Organization Name", "CIN Number", "Thematic Focus", "Annual CSR Budget", "Contact Email"]}
            onImport={(rows) => {
              bulkUploadPartners(rows);
              setShowUploader(false);
            }}
          />
        )}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Partner Organization</th>
                  <th className="px-4 py-3">CIN / Reg No</th>
                  <th className="px-4 py-3">Thematic Focus</th>
                  <th className="px-4 py-3">Annual CSR Budget</th>
                  <th className="px-4 py-3 text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {csrPartners.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.orgName}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{p.cinNumber}</td>
                    <td className="px-4 py-3 text-slate-700">{p.thematicFocus}</td>
                    <td className="px-4 py-3 font-bold text-rose-900">₹{p.annualBudget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">{p.contactEmail}</td>
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
