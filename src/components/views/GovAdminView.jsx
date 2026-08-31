import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { CsvUploader } from '../common/CsvUploader';
import { JHARKHAND_DISTRICTS } from '../../data/jharkhandDistricts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Landmark, ShieldAlert, FileSpreadsheet, Activity, Building2, MapPin, Award, Radio, Send, CheckCircle2 } from 'lucide-react';

export const GovAdminView = () => {
  const { challenges, proposals, csrPartners, bulkUploadPartners } = useApp();
  const [showUploader, setShowUploader] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const emergencyAlerts = challenges.filter(c => c.isEmergency);

  // Filter challenges and district stats
  const filteredChallenges = selectedDistrict === 'ALL'
    ? challenges
    : challenges.filter(c => c.district.toLowerCase() === selectedDistrict.toLowerCase());

  // Chart data: Top districts by issues
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

  const handleTriggerBroadcast = (alertItem) => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-red-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-rose-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-rose-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              Phase 4 Execution • State Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">State-wide 24-District Innovation Dashboard</h2>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              Real-time GIS emergency heatmaps, district-level problem density monitoring, automated high-priority emergency alerts (Priority Score &ge; 85), grant distribution auditing, and corporate partner onboarding.
            </p>
          </div>

          <div className="bg-rose-950/90 p-4 sm:p-5 rounded-2xl border border-rose-700/60 text-right shrink-0 shadow-inner">
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{emergencyAlerts.length}</div>
            <div className="text-[11px] text-rose-200 font-semibold mt-0.5">Critical Emergency Alerts (&ge;85)</div>
          </div>
        </div>
      </div>

      {/* Emergency Alerts Broadcast Banner */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-400 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-black text-base text-red-950 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />
              <span>State Emergency Alert Threshold Triggered (Priority Score &ge; 85)</span>
            </h3>
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider self-start sm:self-auto">
              Automated Inter-Agency Broadcast
            </span>
          </div>

          {broadcastSent && (
            <div className="bg-emerald-600 text-white p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Emergency Dispatch Transmitted to District Magistrate, Local Panchayat & Assigned HEI Taskforce!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {emergencyAlerts.map(em => (
              <div key={em.id} className="bg-white p-4 rounded-2xl border border-red-200 text-xs space-y-2 shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between font-black text-red-950 text-xs">
                    <span>{em.title}</span>
                    <span className="text-red-600 font-mono font-bold bg-red-100 px-2 py-0.5 rounded">Score: {em.priorityScore}</span>
                  </div>
                  <div className="text-slate-600 font-medium">{em.address} ({em.district})</div>
                  <div className="text-[11px] text-red-700 font-bold pt-1">
                    Assigned Taskforce: {em.routedHei} ({em.routedDept})
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleTriggerBroadcast(em)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Dispatch Emergency Alert SMS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 24-District Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-bold text-slate-800">Filter By Jharkhand District:</span>
        </div>

        <select
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
        >
          <option value="ALL">All 24 Districts (Statewide)</option>
          {JHARKHAND_DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name} (Pop: {d.population})</option>)}
        </select>
      </div>

      {/* State Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Distribution Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>Top Jharkhand Districts by Societal Challenge Density</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px' }} />
                <Bar dataKey="issues" fill="#0f5257" radius={[6, 6, 0, 0]} name="Reported Issues" />
                <Bar dataKey="projects" fill="#ff9f1c" radius={[6, 6, 0, 0]} name="Active HEI Projects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Challenge Domain Breakdown</h3>

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

          <div className="space-y-1.5 text-xs">
            {categoryChartData.map(c => (
              <div key={c.name} className="flex justify-between items-center text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span className="text-slate-700 font-medium">{c.name}</span>
                </span>
                <span className="font-black text-slate-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State Interactive Map */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>Interactive 24-District GIS Map & Emergency Hotspots</span>
        </h3>
        <LeafletMap mode="viewer" challenges={filteredChallenges} height="360px" />
      </div>

      {/* Corporate Partner Bulk CSV Ingestion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-rose-600" />
            <span>Registered Industry & CSR Partners ({csrPartners.length})</span>
          </h3>

          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1.5"
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

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Partner Organization</th>
                  <th className="px-5 py-3.5">CIN / Reg No</th>
                  <th className="px-5 py-3.5">Thematic Focus</th>
                  <th className="px-5 py-3.5">Annual CSR Budget</th>
                  <th className="px-5 py-3.5 text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {csrPartners.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-extrabold text-slate-900">{p.orgName}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 font-medium">{p.cinNumber}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{p.thematicFocus}</td>
                    <td className="px-5 py-3.5 font-black text-rose-950 font-mono">₹{p.annualBudget.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-500">{p.contactEmail}</td>
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
