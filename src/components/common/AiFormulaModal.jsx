import React, { useState } from 'react';
import { calculateAiSeverity } from '../../utils/aiEngine';
import { Sparkles, ShieldAlert, Cpu, CheckCircle2, Sliders, X, AlertTriangle, ArrowRight } from 'lucide-react';

export const AiFormulaModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [testText, setTestText] = useState('Severe arsenic groundwater contamination in rural handpumps causing toxic poisoning outbreak.');
  const [population, setPopulation] = useState(4500);
  const [duplicateSpike, setDuplicateSpike] = useState(3);

  const evaluation = calculateAiSeverity({
    title: 'Incident Analysis',
    description: testText,
    category: 'Water Quality',
    populationAffected: population,
    duplicateCount: duplicateSpike
  });

  const presets = [
    {
      label: 'Critical Toxic Mine Fire (Dhanbad)',
      text: 'Underground coal mine fire emitting toxic sulfur gas and carbon monoxide near settlement.',
      pop: 8500,
      dup: 4
    },
    {
      label: 'Arsenic Handpump Contamination (Ranchi)',
      text: 'Water samples from 14 handpumps show dangerous arsenic levels causing waterborne disease outbreak.',
      pop: 4500,
      dup: 3
    },
    {
      label: 'Brown Planthopper Pest Infestation (East Singhbhum)',
      text: 'Crop pest infestation damaging 350 hectares of paddy fields. Farmers need organic bio-pesticide sprayers.',
      pop: 1200,
      dup: 1
    },
    {
      label: 'Rural Road Maintenance Suggestion (Bokaro)',
      text: 'Potholes on secondary village road need routine asphalt leveling before monsoon.',
      pop: 200,
      dup: 0
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-6 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-jharkhand-dark via-teal-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-teal-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">AI 3-Layer Severity Assessment Simulator</h3>
                <span className="bg-teal-700/80 text-teal-200 text-[10px] font-mono px-2 py-0.5 rounded-full">SIH 26043 Spec</span>
              </div>
              <p className="text-xs text-teal-200/80">Interactive formula engine & life-safety emergency threshold validator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Preset Buttons */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Load Sample Incident Scenarios:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTestText(preset.text);
                    setPopulation(preset.pop);
                    setDuplicateSpike(preset.dup);
                  }}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition text-xs font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{preset.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Test Text Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Citizen Report Narrative (Layer 1 & 2 Input):</label>
            <textarea
              rows={3}
              value={testText}
              onChange={e => setTestText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              placeholder="Type issue description to screen for hazards..."
            />
          </div>

          {/* Controls: Population & Duplicate Spikes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Population Affected (Scale):</span>
                <span className="font-mono text-teal-700">{population.toLocaleString()} citizens</span>
              </div>
              <input
                type="range"
                min="10"
                max="10000"
                step="100"
                value={population}
                onChange={e => setPopulation(parseInt(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Nearby Duplicate Reports (Spike):</span>
                <span className="font-mono text-teal-700">{duplicateSpike} reports</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={duplicateSpike}
                onChange={e => setDuplicateSpike(parseInt(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
          </div>

          {/* Mathematical Formula Display Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>Mathematical Formula Execution:</span>
              <span className="text-[11px] text-slate-400">SIH ID: 26043 Spec</span>
            </div>

            <div className="text-xs sm:text-sm bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed overflow-x-auto">
              <div>Priority Score = (0.40 &times; {evaluation.hazardScore}) + (0.35 &times; {evaluation.urgencyScore}) + (0.15 &times; {evaluation.populationScore}) + (0.10 &times; {evaluation.duplicateScore})</div>
              <div className="text-teal-400 font-bold mt-1">
                = {evaluation.breakdown.hazardContribution} + {evaluation.breakdown.urgencyContribution} + {evaluation.breakdown.populationContribution} + {evaluation.breakdown.duplicateContribution} = <span className="text-amber-400 text-base">{evaluation.priorityScore} / 100</span>
              </div>
            </div>

            {/* Keyword Match Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Detected Hazard Keywords:</span>
              {evaluation.matchedKeywords.length > 0 ? (
                evaluation.matchedKeywords.map((kw, i) => (
                  <span key={i} className="bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded font-mono text-[10px] border border-rose-700/50">
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">None detected (baseline score applied)</span>
              )}
            </div>
          </div>

          {/* Score Result & Alert Gauge */}
          <div className={`p-5 rounded-2xl border-2 flex items-center justify-between ${
            evaluation.isEmergency
              ? 'bg-red-50 border-red-400 text-red-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center space-x-3.5">
              <div className={`p-3 rounded-2xl ${evaluation.isEmergency ? 'bg-red-600 text-white animate-bounce' : 'bg-emerald-600 text-white'}`}>
                {evaluation.isEmergency ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center space-x-2">
                  <span>Urgency Tier: {evaluation.urgencyTier}</span>
                  {evaluation.isEmergency && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Emergency Alert Triggered (&ge; 85)
                    </span>
                  )}
                </div>
                <p className="text-xs opacity-80 mt-0.5">
                  {evaluation.isEmergency
                    ? 'Automated high-priority broadcast dispatched to District Administration & Local Panchayat.'
                    : 'Classified within normal research queue. Routed to designated HEI department.'}
                </p>
              </div>
            </div>

            <div className="text-right pl-4">
              <div className="text-3xl font-black font-mono">{evaluation.priorityScore}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Priority Score</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
