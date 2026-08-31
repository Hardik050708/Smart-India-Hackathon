import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { JHARKHAND_DISTRICTS } from '../../data/jharkhandDistricts';
import { calculateAiSeverity } from '../../utils/aiEngine';
import { AlertTriangle, MapPin, ThumbsUp, PlusCircle, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CitizenView = () => {
  const { challenges, addChallenge, upvoteChallenge } = useApp();

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-jharkhand-green to-teal-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-teal-800 text-teal-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Grassroots Citizen Portal
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">Report a Societal Problem in Your District</h2>
          <p className="text-xs text-teal-100 mt-1 max-w-xl">
            Submit grassroots civic, agricultural, environmental or water issues. Our 3-Layer AI engine automatically calculates hazard severity, deduplicates reports, and routes them to top Jharkhand HEIs.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-jharkhand-accent hover:bg-amber-500 text-jharkhand-dark font-extrabold px-5 py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0 text-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{showForm ? 'Close Form' : 'Report New Problem'}</span>
        </button>
      </div>

      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Problem Submitted & AI Analyzed! (ID: {submitSuccess.id})</span>
          </div>
          <div className="text-xs text-emerald-700 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/80 p-3 rounded-xl border border-emerald-100">
            <div>AI Priority Score: <strong className="text-emerald-900">{submitSuccess.priorityScore}/100</strong></div>
            <div>Urgency Tier: <strong className="text-emerald-900">{submitSuccess.urgencyTier}</strong></div>
            <div>Auto-Routed HEI: <strong className="text-emerald-900">{submitSuccess.routedHei}</strong></div>
          </div>
        </div>
      )}

      {/* Citizen Problem Submission Wizard Modal / Box */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>Submit Societal Challenge with AI Severity Screening</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Step 1 of 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toxic Groundwater Contamination in Angara Village"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District (Jharkhand) *</label>
                  <select
                    value={formData.district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    {JHARKHAND_DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the grassroots problem, health impact, or affected population details..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Affected Population Est.</label>
                  <input
                    type="number"
                    value={formData.populationAffected}
                    onChange={e => setFormData({ ...formData, populationAffected: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.photoAttached}
                      onChange={e => setFormData({ ...formData, photoAttached: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Attach Photo/GPS Evidence</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Map Picker & AI Live Preview Card */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pin GPS Coordinates on Map *</span>
                  <span className="text-[10px] text-slate-400 font-mono">
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

              {/* Real-time AI Severity Scoring Box */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-400 font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Severity Engine Preview</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    liveAi.isEmergency ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-800 text-teal-200'
                  }`}>
                    Score: {liveAi.priorityScore}/100 ({liveAi.urgencyTier})
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-300 font-mono text-center bg-slate-950 p-2 rounded-lg">
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
                  <p className="text-[10px] text-red-400 flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Score &ge; 85: Triggers immediate Govt Admin & Emergency Alert!</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-jharkhand-green hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Submit Problem to Portal
            </button>
          </div>
        </form>
      )}

      {/* Reported Challenges List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            Active Reported Challenges in Jharkhand ({challenges.length})
          </h3>
          <span className="text-xs text-slate-500">Click upvote to prioritize local solutions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    {item.isEmergency ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>CRITICAL EMERGENCY ({item.priorityScore})</span>
                      </span>
                    ) : (
                      <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Priority: {item.priorityScore}/100
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.description}</p>

                <div className="text-[11px] text-slate-500 flex items-center space-x-3 pt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item.address} ({item.district})</span>
                  </span>
                </div>
              </div>

              {/* Routing & Verification Status Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400">Routed HEI Target:</div>
                  <div className="font-semibold text-slate-800 text-[11px]">{item.routedHei}</div>
                </div>

                <button
                  onClick={() => upvoteChallenge(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                    item.upvotedByUser
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Upvote ({item.upvotes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
