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
        />
      </div>
    </div>
  );
};
