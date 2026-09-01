import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { JHARKHAND_DISTRICTS } from '../../data/jharkhandDistricts';
import { calculateAiSeverity } from '../../utils/aiEngine';
import {
  AlertTriangle, MapPin, ThumbsUp, PlusCircle, Sparkles, CheckCircle2,
  ShieldAlert, Search, Filter, Clock, CheckCircle, ArrowRight, ArrowLeft,
  Layers, FileText, Upload, Camera, Cpu, Activity, Info
} from 'lucide-react';

export const CitizenView = () => {
  const { challenges, addChallenge, upvoteChallenge, currentUser, t, globalSearch } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my_submissions'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water Quality',
    district: 'Ranchi',
    lat: 23.3441,
    lng: 85.3096,
    address: 'Panchayat Center, Ranchi',
    populationAffected: '500',
    evidenceFile: null,
    evidencePreview: null
  });

  const [submitSuccess, setSubmitSuccess] = useState(null);

  const categories = [
    'Water Quality',
    'Mining & Environment Safety',
    'Agro-Tech',
    'Renewable Energy',
    'Rural Infrastructure',
    'Healthcare & Sanitation'
  ];

  // Calculate live preview of AI Severity
  const liveAi = calculateAiSeverity({
    title: formData.title || 'Sample Problem Title',
    description: formData.description || 'Sample Problem Description',
    category: formData.category,
    populationAffected: parseInt(formData.populationAffected || 100)
  });

  const handleDistrictChange = (distName) => {
    const matched = JHARKHAND_DISTRICTS.find(d => d.name === distName);
    setFormData(prev => ({
      ...prev,
      district: distName,
      lat: matched ? matched.lat : prev.lat,
      lng: matched ? matched.lng : prev.lng
    }));
  };

  const handleEvidenceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, evidenceFile: file, evidencePreview: previewUrl }));
    }
  };

  const handleNextStep = () => {
    if (wizardStep === 3) {
      setIsAiProcessing(true);
      setWizardStep(4);
      setTimeout(() => {
        setIsAiProcessing(false);
      }, 600);
    } else {
      setWizardStep(prev => Math.min(4, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setWizardStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const created = addChallenge(formData);
    setSubmitSuccess(created);
    setShowWizard(false);
    setWizardStep(1);
    setActiveTab('my_submissions');
    setFormData({
      title: '',
      description: '',
      category: 'Water Quality',
      district: 'Ranchi',
      lat: 23.3441,
      lng: 85.3096,
      address: 'Panchayat Center, Ranchi',
      populationAffected: '500',
      evidenceFile: null,
      evidencePreview: null
    });
  };

  // Combined search (local input + global search in navbar)
  const activeSearch = (globalSearch || searchQuery).toLowerCase();

  // Filter challenges
  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = !activeSearch ||
                          c.title.toLowerCase().includes(activeSearch) ||
                          c.description.toLowerCase().includes(activeSearch) ||
                          c.district.toLowerCase().includes(activeSearch) ||
                          c.category.toLowerCase().includes(activeSearch);
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesTab = activeTab === 'all' || (c.reportedBy && c.reportedBy.includes(currentUser?.name || 'Citizen'));
    return matchesSearch && matchesCat && matchesTab;
  });

  const mySubmissionsCount = challenges.filter(c => c.reportedBy && c.reportedBy.includes(currentUser?.name || 'Citizen')).length;

  return (
    <div className="space-y-6">
      {/* Header Banner - Responsive Aspect Ratio */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400" />
                {t.citizen.tag}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {t.citizen.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.citizen.subtitle}
            </p>
          </div>

          <button
            onClick={() => { setShowWizard(true); setWizardStep(1); }}
            className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 shrink-0 min-h-[44px]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t.citizen.launchWizard}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-start space-x-3 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-emerald-950 text-sm">Challenge Registered: {submitSuccess.id}</div>
            <p className="text-emerald-700 mt-0.5">
              Priority Score: <strong>{submitSuccess.priorityScore}/100</strong>. Routed to <strong>{submitSuccess.routedHei}</strong>.
            </p>
          </div>
          <button onClick={() => setSubmitSuccess(null)} className="text-emerald-700 hover:text-emerald-950 font-bold text-xs">
            ✕
          </button>
        </div>
      )}

      {/* 4-Step Citizen Reporting Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 md:p-8 shadow-2xl border border-slate-200 space-y-5 sm:space-y-6 relative my-auto animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Wizard Header & Stepper */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                    {t.citizen.launchWizard}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Step {wizardStep} of 4: {
                      wizardStep === 1 ? t.citizen.step1 :
                      wizardStep === 2 ? t.citizen.step2 :
                      wizardStep === 3 ? t.citizen.step3 :
                      t.citizen.step4
                    }
                  </h2>
                </div>
                <button
                  onClick={() => setShowWizard(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1.5"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[t.citizen.step1, t.citizen.step2, t.citizen.step3, t.citizen.step4].map((label, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${
                      wizardStep > idx + 1 ? 'bg-emerald-500' :
                      wizardStep === idx + 1 ? 'bg-slate-900' : 'bg-slate-200'
                    }`} />
                    <div className={`text-[9px] sm:text-[10px] font-bold truncate ${
                      wizardStep === idx + 1 ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {idx + 1}. {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Details */}
            {wizardStep === 1 && (
              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.citizen.issueTitle} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t.citizen.issueTitlePlaceholder}
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.citizen.category}</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-800"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.citizen.populationAffected}</label>
                    <input
                      type="number"
                      value={formData.populationAffected}
                      onChange={e => setFormData({ ...formData, populationAffected: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.citizen.description} *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder={t.citizen.descriptionPlaceholder}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Map Selection */}
            {wizardStep === 2 && (
              <div className="space-y-3.5 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.citizen.district}</label>
                    <select
                      value={formData.district}
                      onChange={e => handleDistrictChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-800"
                    >
                      {JHARKHAND_DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.citizen.address}</label>
                    <input
                      type="text"
                      placeholder="e.g., Ward 4, Rajmahal Block"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5 flex-wrap gap-1">
                    <span>{t.citizen.pinMapPrompt} *</span>
                    <span className="font-mono text-emerald-700 text-[10px] sm:text-[11px]">
                      📍 Lat: {formData.lat.toFixed(4)}, Lon: {formData.lng.toFixed(4)}
                    </span>
                  </div>
                  <LeafletMap
                    mode="picker"
                    selectedPosition={{ lat: formData.lat, lng: formData.lng }}
                    onPositionPick={({ lat, lng }) => setFormData(prev => ({ ...prev, lat, lng }))}
                    height="190px"
                    show5kmRadius={true}
                  />
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{t.citizen.radiusHint}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Evidence Upload */}
            {wizardStep === 3 && (
              <div className="space-y-3.5 sm:space-y-4">
                <div className="border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-2xl p-5 sm:p-6 text-center space-y-3 transition bg-slate-50/50">
                  <div className="w-11 h-11 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
                    <Camera className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.citizen.uploadEvidence}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.citizen.uploadHint}</p>
                  </div>
                  <label className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-sm transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.citizen.browseFiles}</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleEvidenceUpload} className="hidden" />
                  </label>
                </div>

                {formData.evidencePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-36 bg-slate-900">
                    <img src={formData.evidencePreview} alt="Evidence Preview" className="w-full h-36 object-cover" />
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      ✓ Evidence Attached
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Step 4: AI Instant Assessment Card */}
            {wizardStep === 4 && (
              <div className="space-y-3.5 sm:space-y-4">
                {isAiProcessing ? (
                  <div className="bg-slate-950 text-white rounded-2xl p-6 text-center space-y-3">
                    <Cpu className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <div className="text-xs font-bold font-mono text-emerald-400">{t.citizen.processingAi}</div>
                    <div className="space-y-1.5 max-w-xs mx-auto">
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 text-white rounded-2xl p-4 sm:p-5 space-y-3 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1.5 font-mono">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>{t.citizen.step4}</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono uppercase tracking-wider ${
                        liveAi.isEmergency ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {t.citizen.priorityScore}: {liveAi.priorityScore}/100 ({liveAi.isEmergency ? 'CRITICAL' : liveAi.urgencyTier})
                      </span>
                    </div>

                    {/* Formula Contribution Matrix */}
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-[10px] font-mono bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-slate-400 text-[9px] sm:text-[10px]">{t.citizen.hazardScore}</div>
                        <div className="text-emerald-400 font-bold text-xs sm:text-sm mt-0.5">{liveAi.breakdown.hazardContribution}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[9px] sm:text-[10px]">{t.citizen.urgencyScore}</div>
                        <div className="text-emerald-400 font-bold text-xs sm:text-sm mt-0.5">{liveAi.breakdown.urgencyContribution}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[9px] sm:text-[10px]">{t.citizen.popScore}</div>
                        <div className="text-emerald-400 font-bold text-xs sm:text-sm mt-0.5">{liveAi.breakdown.populationContribution}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[9px] sm:text-[10px]">{t.citizen.dupScore}</div>
                        <div className="text-emerald-400 font-bold text-xs sm:text-sm mt-0.5">{liveAi.breakdown.duplicateContribution}</div>
                      </div>
                    </div>

                    {liveAi.isEmergency && (
                      <div className="bg-rose-950/40 border border-rose-800/60 p-2.5 rounded-xl text-[10px] sm:text-[11px] text-rose-300 flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{t.citizen.emergencyTrigger}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-200">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition min-h-[40px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.citizen.prevStep}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowWizard(false)}
                  className="px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={wizardStep === 1 && (!formData.title || !formData.description)}
                  className="flex items-center space-x-1.5 px-5 sm:px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition min-h-[40px]"
                >
                  <span>{t.citizen.nextStep}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex items-center space-x-1.5 px-5 sm:px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition min-h-[40px]"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.citizen.submitReport}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Tabs & Search Filter Header */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.citizen.allChallengesTab} ({challenges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_submissions')}
            className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === 'my_submissions'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.citizen.myReportsTab} ({mySubmissionsCount})</span>
          </button>
        </div>

        {/* Local Search & Domain Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs rounded-xl border border-slate-200 focus:outline-none font-semibold text-slate-700 bg-slate-50 shrink-0"
          >
            <option value="ALL">{t.allDomains}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Challenges Bento-Grid View - Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredChallenges.map(item => {
          const isEmergency = Boolean(item.isEmergency || (item.priorityScore && item.priorityScore > 85));
          const score = item.priorityScore || 50;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 relative group overflow-hidden"
            >
              {isEmergency && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isEmergency
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isEmergency ? 'Critical Emergency' : item.category}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Score: {score}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center space-x-1 truncate max-w-[150px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.district}</span>
                  </span>
                  <span className="font-mono text-slate-400 text-[10px]">{item.id}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => upvoteChallenge(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      item.upvotedByUser
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{item.upvotes || 0} {t.citizen.upvotes}</span>
                  </button>

                  <span className="text-[10px] font-bold text-slate-500 capitalize truncate">
                    {t.citizen.status}: <span className="text-slate-800 font-semibold">{item.status ? item.status.replace('_', ' ') : 'Reported'}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-slate-200 text-slate-500 space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-slate-400" />
          <div className="font-bold text-slate-700 text-sm">No Challenges Matched</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or filter domain.</p>
        </div>
      )}
    </div>
  );
};
