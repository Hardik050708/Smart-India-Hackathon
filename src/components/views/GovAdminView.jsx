import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { CsvUploader } from '../common/CsvUploader';
import { JHARKHAND_DISTRICTS } from '../../data/jharkhandDistricts';
import { getLocalizedChallenge } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Landmark, ShieldAlert, FileSpreadsheet, Activity, Building2, MapPin, Award, Radio, Send, CheckCircle2 } from 'lucide-react';

export const GovAdminView = () => {
  const { challenges, proposals, csrPartners, bulkUploadPartners, t, language } = useApp();
  const [showUploader, setShowUploader] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const localizedChallenges = challenges.map(c => getLocalizedChallenge(c, language));
  const emergencyAlerts = localizedChallenges.filter(c => c.isEmergency);

  // Filter challenges and district stats
  const filteredChallenges = selectedDistrict === 'ALL'
    ? localizedChallenges
    : localizedChallenges.filter(c => c.district.toLowerCase() === selectedDistrict.toLowerCase() || (c.district_hi && c.district_hi.toLowerCase() === selectedDistrict.toLowerCase()));

  // Chart data: Top districts by issues
  const districtChartData = JHARKHAND_DISTRICTS.slice(0, 10).map(d => ({
    name: language === 'hi' ? (d.name_hi || d.name) : d.name,
    issues: d.totalIssues,
    projects: d.activeProjects
  }));

  const categoryChartData = [
    { name: language === 'hi' ? 'जल गुणवत्ता' : 'Water Quality', value: 42, color: '#0f5257' },
    { name: language === 'hi' ? 'खनन सुरक्षा' : 'Mining Safety', value: 38, color: '#ff9f1c' },
    { name: language === 'hi' ? 'कृषि-तकनीक' : 'Agro-Tech', value: 29, color: '#10b981' },
    { name: language === 'hi' ? 'ऊर्जा' : 'Energy', value: 18, color: '#6366f1' },
    { name: language === 'hi' ? 'स्वास्थ्य' : 'Healthcare', value: 15, color: '#ec4899' }
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
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <span className="bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
              <Landmark className="w-3 h-3 text-rose-400" />
              <span>{t.govAdmin.tag}</span>
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {t.govAdmin.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.govAdmin.subtitle}
            </p>
          </div>

          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 text-right shrink-0 shadow-inner">
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{emergencyAlerts.length}</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">{t.govAdmin.emergencyAlerts}</div>
          </div>
        </div>
      </div>

      {/* Emergency Alerts Broadcast Banner */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-rose-50/80 border-2 border-rose-300 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-black text-base text-rose-950 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
              <span>{language === 'hi' ? 'राज्य आपातकालीन अलर्ट सीमा सक्रिय (प्राथमिकता स्कोर ≥ 85)' : 'State Emergency Alert Threshold Triggered (Priority Score ≥ 85)'}</span>
            </h3>
            <span className="bg-rose-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider self-start sm:self-auto font-mono">
              {language === 'hi' ? 'स्वचालित अंतर-एजेंसी प्रसारण' : 'Automated Inter-Agency Broadcast'}
            </span>
          </div>

          {broadcastSent && (
            <div className="bg-emerald-600 text-white p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{language === 'hi' ? 'आपातकालीन सूचना जिला मजिस्ट्रेट, स्थानीय पंचायत और संबंधित विश्वविद्यालय टास्कफोर्स को प्रेषित की गई!' : 'Emergency Dispatch Transmitted to District Magistrate, Local Panchayat & Assigned HEI Taskforce!'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {emergencyAlerts.map(em => (
              <div key={em.id} className="bg-white p-4 rounded-2xl border border-rose-200 text-xs space-y-2 shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between font-black text-rose-950 text-xs">
                    <span>{em.title}</span>
                    <span className="text-rose-600 font-mono font-bold bg-rose-100 px-2 py-0.5 rounded">Score: {em.priorityScore}</span>
                  </div>
                  <div className="text-slate-600 font-medium">{em.address} ({em.district})</div>
                  <div className="text-[11px] text-rose-700 font-bold pt-1">
                    {language === 'hi' ? 'नामित टास्कफोर्स' : 'Assigned Taskforce'}: {em.routedHei} ({em.routedDept})
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleTriggerBroadcast(em)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-xl shadow-sm transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>{t.govAdmin.broadcastDispatch}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GIS Heatmap & District Filtering */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">{t.govAdmin.districtHeatmap}</h3>
            <p className="text-xs text-slate-500">{language === 'hi' ? 'समस्या घनत्व एवं आपातकालीन क्लस्टर का वास्तविक समय स्थानिक नक्शा' : 'Real-time spatial visualization of problem density and emergency clusters.'}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">{language === 'hi' ? 'जिला चुनें' : 'District'}:</span>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-bold text-slate-800 bg-slate-50 focus:outline-none"
            >
              <option value="ALL">{t.allDistricts}</option>
              {JHARKHAND_DISTRICTS.map(d => (
                <option key={d.name} value={d.name}>{language === 'hi' ? (d.name_hi || d.name) : d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <LeafletMap
          mode="heatmap"
          challenges={filteredChallenges}
          height="340px"
          show5kmRadius={true}
          activeDistrict={selectedDistrict === 'ALL' ? undefined : selectedDistrict}
        />
      </div>

      {/* State-wide KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">{language === 'hi' ? 'कुल रिपोर्ट' : 'Citizen Reports'}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">{challenges.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">{language === 'hi' ? 'सक्रिय परियोजना' : 'Active HEI Projects'}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">{proposals.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">{language === 'hi' ? 'सीएसआर भागीदार' : 'CSR Partners'}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">{csrPartners.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">{language === 'hi' ? 'अनुदान वितरित' : 'CSR Grants Disbursed'}</div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
              ₹{(proposals.reduce((acc, p) => acc + (p.pledgedAmount || 0), 0) / 100000).toFixed(1)} L
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts: District Density & Category Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              {language === 'hi' ? 'शीर्ष 10 जिले: समस्या घनत्व' : 'Top 10 Districts: Issue Density'}
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase">
              {language === 'hi' ? 'रिपोर्ट बनाम परियोजना' : 'Reports vs Projects'}
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-30} textAnchor="end" height={54} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
                  contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                />
                <Bar dataKey="issues" name={language === 'hi' ? 'समस्याएं' : 'Reported Issues'} fill="#0f5257" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projects" name={language === 'hi' ? 'सक्रिय परियोजना' : 'Active Projects'} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              {language === 'hi' ? 'क्षेत्रवार वितरण' : 'Problem Domain Split'}
            </h3>
            <Radio className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={72}
                  paddingAngle={2}
                  stroke="none"
                >
                  {categoryChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1">
            {categoryChartData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-800">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corporate / CSR Partner Bulk Onboarding */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? `सीएसआर भागीदार पंजीकरण (${csrPartners.length})` : `Corporate CSR Partner Registry (${csrPartners.length})`}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'उद्योग सीएसआर भागीदारों को थोक सीएसआर CSV के माध्यम से जोड़ें।'
                : 'Bulk-onboard industry CSR partners with their pledged thematic budgets via CSV.'}
            </p>
          </div>

          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{showUploader ? (language === 'hi' ? 'अपलोडर छिपाएं' : 'Hide Uploader') : (language === 'hi' ? 'सीएसआर भागीदार अपलोड करें' : 'Bulk Upload Partner CSV')}</span>
          </button>
        </div>

        {showUploader && (
          <CsvUploader
            type="partner"
            onUploadSuccess={bulkUploadPartners}
            onClose={() => setShowUploader(false)}
          />
        )}

        {csrPartners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {csrPartners.map(p => (
              <div key={p.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 text-xs space-y-1.5">
                <div className="font-bold text-slate-900 truncate">{p.orgName}</div>
                <div className="font-mono text-[10px] text-slate-500 truncate">{p.cinNumber}</div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px] truncate">{p.thematicFocus}</span>
                  <span className="font-mono font-black text-slate-800 shrink-0">₹{(p.annualBudget / 100000).toFixed(1)} L</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
