import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { JHARKHAND_DISTRICTS } from '../../data/jharkhandDistricts';
import { calculateAiSeverity } from '../../utils/aiEngine';
import {
  AlertTriangle, MapPin, ThumbsUp, PlusCircle, Sparkles, CheckCircle2,
  ShieldAlert, Search, Filter, Clock, CheckCircle, ArrowRight, Layers, FileText
} from 'lucide-react';

export const CitizenView = () => {
  const { challenges, addChallenge, upvoteChallenge, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my_submissions'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water Quality',
    district: 'Ranchi',
    lat: 23.3441,
    lng: 85.3096,
    address: 'Panchayat Center, Ranchi',
    populationAffected: '500',
    photoAttached: false
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const created = addChallenge(formData);
    setSubmitSuccess(created);
    setShowForm(false);
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
      photoAttached: false
    });
  };

  const handleDistrictChange = (distName) => {
    const matched = JHARKHAND_DISTRICTS.find(d => d.name === distName);
    setFormData(prev => ({
      ...prev,
      district: distName,
      lat: matched ? matched.lat : prev.lat,
      lng: matched ? matched.lng : prev.lng
    }));
  };

  // Filter challenges
  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesTab = activeTab === 'all' || (c.reportedBy && c.reportedBy.includes(currentUser?.name || 'Citizen'));
    return matchesSearch && matchesCat && matchesTab;
  });

  const mySubmissionsCount = challenges.filter(c => c.reportedBy && c.reportedBy.includes(currentUser?.name || 'Citizen')).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-jharkhand-green via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-teal-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                Phase 1 & 2 Execution • Citizen Portal
              </span>
              <span className="bg-teal-800/80 text-teal-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full font-mono">
                Logged as: {currentUser?.name || 'Citizen'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Report & Track Grassroots Societal Problems</h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
              Submit civic, agricultural, environmental or water issues with Leaflet GPS coordinates. Our 3-Layer AI engine screens hazards, calculates severity, deduplicates nearby reports (&le; 5 km radius), and routes them to top Jharkhand HEIs.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-jharkhand-accent hover:bg-amber-400 text-jharkhand-dark font-black px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0 text-sm ring-4 ring-amber-400/20"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{showForm ? 'Close Wizard' : 'Report New Problem'}</span>
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-md space-y-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Problem Report Submitted & AI Analyzed! (ID: {submitSuccess.id})</span>
          </div>
          <div className="text-xs text-emerald-800 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/90 p-3.5 rounded-xl border border-emerald-200">
            <div>AI Priority Score: <strong className="text-emerald-950 font-black">{submitSuccess.priorityScore}/100</strong></div>
            <div>Urgency Tier: <strong className="text-emerald-950 font-black">{submitSuccess.urgencyTier}</strong></div>
            <div>Auto-Routed HEI: <strong className="text-emerald-950 font-black">{submitSuccess.routedHei}</strong></div>
          </div>
        </div>
      )}

      {/* Submission Wizard */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>Submit Problem with GPS Location & AI Screening</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Phase 1 & 2 Workflow</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toxic Groundwater Contamination in Angara Village"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Domain Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District (Jharkhand) *</label>
                  <select
                    value={formData.district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                  >
                    {JHARKHAND_DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the grassroots problem, health hazard indicators, affected population..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Affected Population Est.</label>
                  <input
                    type="number"
                    value={formData.populationAffected}
                    onChange={e => setFormData({ ...formData, populationAffected: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none font-bold text-slate-800"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.photoAttached}
                      onChange={e => setFormData({ ...formData, photoAttached: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>Attach Photo/GPS Evidence</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Map Picker & AI Live Preview Card */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pin GPS Coordinates on Map *</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Lat: {formData.lat.toFixed(4)}, Lng: {formData.lng.toFixed(4)}
                  </span>
                </label>
                <LeafletMap
                  mode="picker"
                  selectedPosition={{ lat: formData.lat, lng: formData.lng }}
                  onPositionPick={({ lat, lng }) => setFormData(prev => ({ ...prev, lat, lng }))}
                  height="180px"
                />
              </div>

              {/* Real-time AI Severity Formula Box */}
              <div className="bg-slate-950 text-white rounded-2xl p-4 space-y-2 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-400 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI 3-Layer Severity Formula</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    liveAi.isEmergency ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-800 text-teal-200'
                  }`}>
                    Priority Score: {liveAi.priorityScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-300 font-mono text-center bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-slate-500">Hazard (40%)</div>
                    <div className="font-bold text-teal-300">{liveAi.breakdown.hazardContribution}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Urgency (35%)</div>
                    <div className="font-bold text-teal-300">{liveAi.breakdown.urgencyContribution}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Pop (15%)</div>
                    <div className="font-bold text-teal-300">{liveAi.breakdown.populationContribution}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Dup (10%)</div>
                    <div className="font-bold text-teal-300">{liveAi.breakdown.duplicateContribution}</div>
                  </div>
                </div>

                {liveAi.isEmergency && (
                  <p className="text-[10px] text-red-400 font-medium flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Score &ge; 85: Triggers high-priority emergency alerts to Govt Admin!</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-jharkhand-green hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-lg transition"
            >
              Submit Problem Report
            </button>
          </div>
        </form>
      )}

      {/* Tabs & Search Filter Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-jharkhand-green text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Jharkhand Challenges ({challenges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_submissions')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'my_submissions'
                ? 'bg-jharkhand-green text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>My Submissions & Status ({mySubmissionsCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search challenges or district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none font-semibold text-slate-700"
          >
            <option value="ALL">All Domains</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Reported Challenges / My Submissions List */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    {item.isEmergency ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>EMERGENCY ALERT ({item.priorityScore})</span>
                      </span>
                    ) : (
                      <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Priority: {item.priorityScore}/100
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{item.id}</span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.description}</p>

                <div className="text-[11px] text-slate-500 flex items-center space-x-3 pt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{item.address} ({item.district})</span>
                  </span>
                </div>

                {/* Status Timeline Bar (Phase 1 'My Submissions' requirement) */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Resolution Progress</span>
                    <span className="text-teal-800 uppercase font-extrabold">{item.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span className={item.status !== 'reported' ? 'text-emerald-600 font-bold' : 'text-slate-800'}>Reported</span>
                    <span className={item.verifiedByLocalBody ? 'text-emerald-600 font-bold' : ''}>Verified</span>
                    <span className={item.status === 'routed' || item.status === 'in_progress' ? 'text-emerald-600 font-bold' : ''}>HEI Routed</span>
                    <span className={item.status === 'in_progress' ? 'text-emerald-600 font-bold' : ''}>Field Testing</span>
                  </div>
                </div>
              </div>

              {/* Routing & Verification Status Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400">Routed HEI Target:</div>
                  <div className="font-bold text-slate-800 text-[11px]">{item.routedHei}</div>
                </div>

                <button
                  onClick={() => upvoteChallenge(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold transition text-xs ${
                    item.upvotedByUser
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Upvote ({item.upvotes})</span>
                </button>
              </div>
            </div>
          ))}

          {filteredChallenges.length === 0 && (
            <div className="col-span-2 bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200 space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">No reported challenges found matching criteria.</p>
              <p className="text-slate-400">Try adjusting search filters or report a new problem above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
