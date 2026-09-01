import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLocalizedChallenge, getLocalizedProposal } from '../../data/mockData';
import { GraduationCap, Sparkles, Send, Users, CheckCircle, FileText, Plus, ArrowRight } from 'lucide-react';

export const FacultyLeadView = () => {
  const { challenges, proposals, submitProposal, updateMilestoneStatus, t, language } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [proposalForm, setProposalForm] = useState({
    title: '',
    abstract: '',
    requestedBudget: '250000',
    heiName: 'BIT Mesra',
    facultyLead: 'Dr. Alok Kumar (Professor)',
    facultyEmail: 'alok.kumar@bitmesra.ac.in',
    studentTeam: [
      { name: 'Ananya Roy', roll: 'BTECH/ENV/2026/012', role: 'Team Lead / Chemical Analysis' },
      { name: 'Rahul Verma', roll: 'BTECH/10088/22', role: 'Hardware & Sensor Design' }
    ]
  });

  const [newStudent, setNewStudent] = useState({ name: '', roll: '', role: '' });

  const localizedChallenges = challenges.map(c => getLocalizedChallenge(c, language));
  const localizedProposals = proposals.map(p => getLocalizedProposal(p, language));

  const routedChallenges = localizedChallenges.filter(c => c.status === 'routed' || c.status === 'verified' || c.status === 'reported');

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.roll) return;
    setProposalForm(prev => ({
      ...prev,
      studentTeam: [...prev.studentTeam, newStudent]
    }));
    setNewStudent({ name: '', roll: '', role: '' });
  };

  const handleProposalSubmit = (e) => {
    e.preventDefault();
    if (!selectedChallenge || !proposalForm.title || !proposalForm.abstract) return;

    submitProposal({
      challengeId: selectedChallenge.id,
      challengeTitle: selectedChallenge.title,
      ...proposalForm
    });

    setSelectedChallenge(null);
    setProposalForm({
      title: '',
      abstract: '',
      requestedBudget: '250000',
      heiName: 'BIT Mesra',
      facultyLead: 'Dr. Alok Kumar (Professor)',
      facultyEmail: 'alok.kumar@bitmesra.ac.in',
      studentTeam: [
        { name: 'Ananya Roy', roll: 'BTECH/ENV/2026/012', role: 'Team Lead / Chemical Analysis' },
        { name: 'Rahul Verma', roll: 'BTECH/10088/22', role: 'Hardware & Sensor Design' }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <span className="bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
              <GraduationCap className="w-3 h-3 text-indigo-400" />
              <span>{t.faculty.tag}</span>
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {t.faculty.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.faculty.subtitle}
            </p>
          </div>

          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 text-right shrink-0 shadow-inner">
            <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">{routedChallenges.length}</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">{t.faculty.inboxCount}</div>
          </div>
        </div>
      </div>

      {/* Proposal Draft Wizard Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <form onSubmit={handleProposalSubmit} className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>{language === 'hi' ? 'अनुसंधान एवं इंजीनियरिंग प्रस्ताव तैयार करें' : 'Draft Research & Engineering Proposal'}</span>
              </h3>
              <button onClick={() => setSelectedChallenge(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="bg-indigo-50/70 p-4 rounded-2xl text-xs space-y-1 border border-indigo-100">
              <div className="font-bold text-indigo-950">{language === 'hi' ? 'लक्षित समस्या' : 'Target Challenge'}: {selectedChallenge.title}</div>
              <div className="text-indigo-700">{selectedChallenge.category} &bull; {selectedChallenge.district}</div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'प्रस्तावित परियोजना शीर्षक' : 'Proposal Project Title'} *</label>
                <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? 'उदा. कम लागत वाला ग्राफीन-ऑक्साइड बायो-चार फिल्टर' : 'e.g. Low-Cost Bio-Char Water Filter'}
                  value={proposalForm.title}
                  onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'तकनीकी सारांश एवं कार्यप्रणाली' : 'Technical Abstract & Methodology'} *</label>
                <textarea
                  required
                  rows={3}
                  placeholder={language === 'hi' ? 'अनुसंधान पद्धति, प्रोटोटाइप विनिर्देश और अपेक्षित परिणामों का विवरण दें...' : 'Describe methodology, prototype specifications, and target outcomes...'}
                  value={proposalForm.abstract}
                  onChange={e => setProposalForm({ ...proposalForm, abstract: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'आवश्यक बजट (₹ INR)' : 'Requested Budget (₹ INR)'} *</label>
                <input
                  type="number"
                  required
                  value={proposalForm.requestedBudget}
                  onChange={e => setProposalForm({ ...proposalForm, requestedBudget: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
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
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                {language === 'hi' ? 'प्रस्ताव सबमिट करें' : 'Submit Proposal for CSR Funding'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Routed Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {routedChallenges.map(c => (
          <div key={c.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase">
                  {c.category}
                </span>
                <span className="font-mono text-slate-400 text-[10px]">{c.id}</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{c.description}</p>
              <div className="text-[11px] text-slate-500 font-medium">📍 {c.address} ({c.district})</div>
            </div>

            <button
              onClick={() => setSelectedChallenge(c)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>{t.faculty.acceptChallenge}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
