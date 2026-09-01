import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLocalizedChallenge } from '../../data/mockData';
import { ShieldCheck, CheckCircle2, MapPin, AlertCircle, FileText } from 'lucide-react';

export const LocalBodyView = () => {
  const { challenges, verifyChallengeByLocalBody, t, language } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [inspectionNotes, setInspectionNotes] = useState('');

  const localizedChallenges = challenges.map(c => getLocalizedChallenge(c, language));
  const unverifiedList = localizedChallenges.filter(c => !c.verifiedByLocalBody);
  const verifiedList = localizedChallenges.filter(c => c.verifiedByLocalBody);

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
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <span className="bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>{language === 'hi' ? 'स्थानीय निकाय एवं पंचायत पोर्टल' : 'Local Body / Panchayat Portal'}</span>
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {language === 'hi' ? 'जमीनी सत्यापन एवं फील्ड हस्ताक्षर' : 'Ground Truth Verification & Field Sign-off'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'नागरिकों द्वारा दर्ज की गई समस्याओं की भौतिक सत्यता की पुष्टि करें, जीपीएस सीमाओं की जांच करें और प्रोटोटाइप परीक्षण की अनुशंसा करें।'
                : 'Validate physical authenticity of reported citizen challenges, confirm GPS boundaries, inspect ongoing field-tested engineering prototypes, and sign off for stage completion.'}
            </p>
          </div>

          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 text-right shrink-0 shadow-inner">
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">{unverifiedList.length}</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">
              {language === 'hi' ? 'सत्यापन हेतु लंबित' : 'Pending Inspections'}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <form onSubmit={handleSignOff} className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>{language === 'hi' ? 'भौतिक निरीक्षण सत्यापन एवं डिजिटल हस्ताक्षर' : 'Ground Truth Inspection & Digital Sign-off'}</span>
              </h3>
              <button onClick={() => setSelectedChallenge(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-2xl text-xs space-y-1.5 text-slate-900 border border-blue-100">
              <div className="font-black text-sm text-blue-950">{selectedChallenge.title}</div>
              <div className="text-slate-600 font-medium">{selectedChallenge.address} ({selectedChallenge.district})</div>
              <div className="text-slate-800 text-[11px] pt-1 flex items-center space-x-4 font-mono">
                <span>{language === 'hi' ? 'प्रभावित जनसंख्या' : 'Population'}: <strong>{selectedChallenge.populationAffected}</strong></span>
                <span>{language === 'hi' ? 'AI स्कोर' : 'AI Score'}: <strong className="text-rose-600">{selectedChallenge.priorityScore}/100</strong></span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700">
                {language === 'hi' ? 'आधिकारिक फील्ड निरीक्षण टिप्पणी एवं अनुमोदन *' : 'Official Field Inspection Remarks & Digital Sign-off Stamp *'}
              </label>
              <textarea
                required
                rows={3}
                placeholder={language === 'hi' ? 'स्थल का निरीक्षण किया गया। समस्या की सत्यता प्रमाणित है। समाधान हेतु विश्वविद्यालय को स्वीकृति दी जाती है...' : 'Conducted physical inspection on site. Water contamination confirmed with local Sarpanch. Prototype deployment approved...'}
                value={inspectionNotes}
                onChange={e => setInspectionNotes(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                {language === 'hi' ? 'सत्यापन स्वीकृत करें' : 'Sign Off & Verify'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challenges to verify */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {unverifiedList.map(c => (
          <div key={c.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                  {language === 'hi' ? 'सत्यापन प्रतीक्षारत' : 'Pending Verification'}
                </span>
                <span className="font-mono text-slate-400 text-[10px]">{c.id}</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{c.description}</p>
              <div className="text-[11px] text-slate-500 font-medium">📍 {c.address} ({c.district})</div>
            </div>

            <button
              onClick={() => setSelectedChallenge(c)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'hi' ? 'फील्ड सत्यापन करें' : 'Inspect & Sign Off'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
