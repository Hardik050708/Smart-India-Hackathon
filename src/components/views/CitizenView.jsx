import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { JHARKHAND_DISTRICTS } from '../../data/jharkhandDistricts';
import { calculateAiSeverity } from '../../utils/aiEngine';
import { getLocalizedChallenge } from '../../data/mockData';
import {
  AlertTriangle, MapPin, ThumbsUp, PlusCircle, Sparkles, CheckCircle2,
  ShieldAlert, Search, Filter, Clock, CheckCircle, ArrowRight, ArrowLeft,
  Layers, FileText, Upload, Camera, Cpu, Activity, Info, Trash2, Eye, X,
  Users, Calendar, ExternalLink
} from 'lucide-react';

export const CitizenView = () => {
  const { challenges, addChallenge, deleteChallenge, upvoteChallenge, currentUser, t, globalSearch, language } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my_submissions'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);

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
    setWizardStep(prev => Math.min(3, prev + 1));
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

  const isUserSubmission = (item) => {
    if (!item) return false;
    // Strictly personal reports in the "My Reports" tab, never on main page
    return activeTab === 'my_submissions';
  };

  const handleDeleteReport = (e, challengeId) => {
    if (e) e.stopPropagation();
    const confirmMsg = t.citizen.deleteConfirm || (language === 'hi' ? 'क्या आप इस समस्या रिपोर्ट को हटाना चाहते हैं?' : 'Are you sure you want to delete this challenge report?');
    if (window.confirm(confirmMsg)) {
      deleteChallenge(challengeId);
      if (selectedReport && selectedReport.id === challengeId) {
        setSelectedReport(null);
      }
    }
  };

  // Combined search (local input + global search in navbar)
  const activeSearch = (globalSearch || searchQuery).toLowerCase();

  // Localize all challenges according to active language
  const localizedChallenges = challenges.map(c => getLocalizedChallenge(c, language));

  // Filter challenges
  const filteredChallenges = localizedChallenges.filter(c => {
    const matchesSearch = !activeSearch ||
                          c.title.toLowerCase().includes(activeSearch) ||
                          c.description.toLowerCase().includes(activeSearch) ||
                          c.district.toLowerCase().includes(activeSearch) ||
                          c.category.toLowerCase().includes(activeSearch);
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory || c.category_hi === selectedCategory;
    const matchesTab = activeTab === 'all' || (c.reportedBy && c.reportedBy.includes(currentUser?.name || 'Citizen'));
    return matchesSearch && matchesCat && matchesTab;
  });

  const mySubmissionsCount = localizedChallenges.filter(c => c.reportedBy && c.reportedBy.includes(currentUser?.name || 'Citizen')).length;

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
            <div className="font-bold text-emerald-950 text-sm">
              {language === 'hi' ? 'समस्या सफलतापूर्वक दर्ज की गई' : 'Challenge Successfully Registered'}
            </div>
            <p className="text-emerald-700 mt-0.5">
              {language === 'hi'
                ? `आपकी रिपोर्ट संबंधित संस्थान (${submitSuccess.routedHei}) को समाधान हेतु अग्रेषित कर दी गई है।`
                : `Your report has been received and routed to ${submitSuccess.routedHei} for field evaluation.`}
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
                    Step {wizardStep} of 3: {
                      wizardStep === 1 ? t.citizen.step1 :
                      wizardStep === 2 ? t.citizen.step2 :
                      t.citizen.step3
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

              {/* Progress Bar (3 Steps) */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[t.citizen.step1, t.citizen.step2, t.citizen.step3].map((label, idx) => (
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

              {wizardStep < 3 ? (
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
          const userCanDelete = isUserSubmission(item);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedReport(item)}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition duration-200 flex flex-col justify-between space-y-4 group overflow-hidden cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.category}
                  </span>
                  {item.reportedDate && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.reportedDate}
                    </span>
                  )}
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

              <div className="pt-3 border-t border-slate-100 text-xs space-y-2.5">
                <div className="flex items-start space-x-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-tight font-medium truncate">
                    <span>{item.address || item.district}</span>
                  </div>
                </div>

                {/* Card Action Row: Upvotes, View Details, Delete Button */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      upvoteChallenge(item.id);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                      item.upvotedByUser
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={item.upvotedByUser ? 'Remove Upvote' : 'Upvote Challenge'}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${item.upvotedByUser ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    <span>{item.upvotes || 0}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{t.citizen.upvotes}</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                      {t.citizen.viewFullDetails} &rarr;
                    </span>

                    {userCanDelete && (
                      <button
                        onClick={(e) => handleDeleteReport(e, item.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title={t.citizen.deleteReport}
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    )}
                  </div>
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

      {/* Full Problem Description & Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 md:p-8 shadow-2xl border border-slate-200 space-y-5 sm:space-y-6 relative my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedReport.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {selectedReport.district}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug mt-1">
                  {selectedReport.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Complete Full Problem Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.citizen.description}
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                {selectedReport.description}
              </p>
            </div>

            {/* Location & GPS Info */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{selectedReport.address || selectedReport.district}</span>
              </div>
              <div className="text-emerald-800 text-[11px] flex items-center space-x-3">
                <span>GPS Coordinates: {selectedReport.lat?.toFixed(4)}° N, {selectedReport.lng?.toFixed(4)}° E</span>
              </div>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {selectedReport.populationAffected && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{t.citizen.populationAffected}</span>
                  </div>
                  <div className="font-black text-slate-900 text-sm mt-0.5">
                    {selectedReport.populationAffected.toLocaleString()} citizens
                  </div>
                </div>
              )}

              {selectedReport.reportedDate && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Date Reported</span>
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-1">
                    {selectedReport.reportedDate}
                  </div>
                </div>
              )}

              {selectedReport.reportedBy && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Reported By
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-1 truncate">
                    {selectedReport.reportedBy}
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Image Preview if attached */}
            {selectedReport.evidencePreview && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.citizen.evidenceAttached}</span>
                </div>
                <img
                  src={selectedReport.evidencePreview}
                  alt="Evidence"
                  className="rounded-2xl max-h-60 w-full object-cover border border-slate-200 shadow-sm"
                />
              </div>
            )}

            {/* Modal Bottom Actions: Upvote, Delete, Close */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
              <button
                onClick={() => upvoteChallenge(selectedReport.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                  selectedReport.upvotedByUser
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${selectedReport.upvotedByUser ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                <span>{selectedReport.upvotes || 0} {t.citizen.upvotes}</span>
              </button>

              <div className="flex items-center space-x-2">
                {isUserSubmission(selectedReport) && (
                  <button
                    onClick={(e) => handleDeleteReport(e, selectedReport.id)}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>{t.citizen.deleteReport}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
