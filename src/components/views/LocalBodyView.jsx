import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, MapPin, AlertCircle, FileText } from 'lucide-react';

export const LocalBodyView = () => {
  const { challenges, verifyChallengeByLocalBody } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [inspectionNotes, setInspectionNotes] = useState('');

  const unverifiedList = challenges.filter(c => !c.verifiedByLocalBody);
  const verifiedList = challenges.filter(c => c.verifiedByLocalBody);

  const handleSignOff = (e) => {
    e.preventDefault();
    if (!selectedChallenge) return;

    verifyChallengeByLocalBody(selectedChallenge.id, inspectionNotes);
    setSelectedChallenge(null);
    setInspectionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="bg-blue-800 text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Local Body / Panchayat Portal
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">Ground Truth Verification & Field Sign-off</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Validate physical authenticity of reported citizen challenges, confirm GPS boundaries, inspect ongoing field-tested engineering prototypes, and sign off for stage completion.
          </p>
        </div>

        <div className="bg-blue-950/80 p-4 rounded-xl border border-blue-700/50 text-right hidden sm:block">
          <div className="text-2xl font-black text-blue-300">{unverifiedList.length}</div>
          <div className="text-[10px] text-blue-200 font-medium">Pending Inspections</div>
        </div>
      </div>

      {/* Verification Modal / Drawer */}
      {selectedChallenge && (
        <form onSubmit={handleSignOff} className="bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Ground Truth Field Validation Checklist</span>
            </h3>
            <span className="text-xs font-mono text-blue-700">{selectedChallenge.id}</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-xs space-y-1 text-blue-900">
            <div className="font-bold">{selectedChallenge.title}</div>
            <div className="text-blue-700">{selectedChallenge.address} ({selectedChallenge.district})</div>
            <div className="text-blue-600 text-[11px] pt-1">Reported Population Impact: {selectedChallenge.populationAffected} residents</div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block font-semibold text-slate-700">Official Inspection Remarks & Sign-off Notes *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Conducted physical inspection on site. Water contamination confirmed with local Sarpanch. Prototype deployment approved..."
              value={inspectionNotes}
              onChange={e => setInspectionNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedChallenge(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign-off & Confirm Validation</span>
            </button>
          </div>
        </form>
      )}

      {/* Unverified Pending Challenges */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>Pending Verification Inbox ({unverifiedList.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unverifiedList.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Awaiting Sign-off
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{item.address}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedChallenge(item)}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition text-center border border-blue-200"
              >
                Inspect & Validate Ground Truth
              </button>
            </div>
          ))}

          {unverifiedList.length === 0 && (
            <div className="col-span-2 bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-200">
              All reported challenges in your jurisdiction have been validated!
            </div>
          )}
        </div>
      </div>

      {/* Verified List */}
      <div className="space-y-3 pt-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Validated Challenges ({verifiedList.length})</span>
        </h3>

        <div className="space-y-3">
          {verifiedList.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Verified</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Sign-off notes: <span className="italic text-slate-700">"{item.localBodyNotes}"</span>
                </div>
              </div>
              <div className="text-right shrink-0 text-[11px] text-slate-500">
                District: <strong className="text-slate-800">{item.district}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
