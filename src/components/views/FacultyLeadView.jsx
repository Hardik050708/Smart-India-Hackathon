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

              {/* Build Student Research Team */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.faculty.buildTeam}</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {language === 'hi' ? `${proposalForm.studentTeam.length} सदस्य` : `${proposalForm.studentTeam.length} team member(s)`}
                  </span>
                </div>

                {proposalForm.studentTeam.length > 0 && (
                  <div className="space-y-1.5">
                    {proposalForm.studentTeam.map((st, idx) => (
                      <div key={`${st.roll}-${idx}`} className="flex items-center justify-between gap-2 bg-indigo-50/70 border border-indigo-100 rounded-xl px-3 py-2">
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{st.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{st.roll}{st.role ? ` • ${st.role}` : ''}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProposalForm(prev => ({ ...prev, studentTeam: prev.studentTeam.filter((_, i) => i !== idx) }))}
                          className="text-slate-400 hover:text-rose-600 font-bold shrink-0 px-1"
                          title={language === 'hi' ? 'हटाएं' : 'Remove member'}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder={language === 'hi' ? 'छात्र का नाम' : 'Student Name'}
                    value={newStudent.name}
                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder={language === 'hi' ? 'रोल नंबर' : 'Roll Number'}
                    value={newStudent.roll}
                    onChange={e => setNewStudent({ ...newStudent, roll: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={language === 'hi' ? 'भूमिका' : 'Role'}
                      value={newStudent.role}
                      onChange={e => setNewStudent({ ...newStudent, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddStudent}
                      disabled={!newStudent.name || !newStudent.roll}
                      className="shrink-0 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'जोड़ें' : 'Add'}</span>
                    </button>
                  </div>
                </div>
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

      {routedChallenges.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="font-black text-sm text-slate-800">
            {language === 'hi' ? 'कोई नई रूट की गई चुनौती नहीं' : 'No Challenges Awaiting Acceptance'}
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {language === 'hi'
              ? 'आपके विभाग में सभी रूट की गई समस्याओं का प्रस्ताव तैयार हो चुका है। नई नागरिक रिपोर्टें स्वतः यहां भेजी जाएंगी।'
              : 'Every challenge routed to your department already has a draft proposal. New citizen reports verified by Local Bodies will appear here automatically.'}
          </p>
        </div>
      )}

      {/* Active Proposals & NEP 2020 Milestone Sign-off */}
      {localizedProposals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>
                {language === 'hi'
                  ? `सक्रिय अनुसंधान प्रस्ताव एवं माइलस्टोन (${localizedProposals.length})`
                  : `Active Research Proposals & Milestone Sign-off (${localizedProposals.length})`}
              </span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {language === 'hi' ? '30 क्षेत्रीय घंटे = 1 एनईपी क्रेडिट' : '30 Field Hours = 1.0 NEP Credit'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {localizedProposals.map(p => {
              const funded = p.fundingStatus === 'fully_funded';
              const progress = Math.round(((p.currentStage || 1) / 4) * 100);
              return (
                <div key={p.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${funded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {funded ? (language === 'hi' ? 'पूर्ण वित्तपोषित' : 'Fully Funded') : (language === 'hi' ? 'धन खोजरत' : 'Seeking CSR Funding')}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">{p.id}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{p.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        {p.heiName} • {p.facultyLead}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span>
                      {language === 'hi' ? 'लक्षित समस्या' : 'Target Challenge'}:{' '}
                      <span className="font-mono text-slate-800">{p.challengeId || p.challengeTitle}</span>
                    </span>
                    <span className="font-mono">
                      ₹{((p.pledgedAmount || 0) / 1000).toFixed(0)}K / ₹{((p.requestedBudget || 0) / 1000).toFixed(0)}K
                    </span>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{t.faculty.milestones}</span>
                      <span className="font-mono text-indigo-700">{language === 'hi' ? `चरण ${p.currentStage || 1} / 4` : `Stage ${p.currentStage || 1} of 4`}</span>
                    </div>
                  </div>

                  {/* Milestone Sign-off Rows */}
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {(p.milestones || []).map(m => {
                      const approved = m.status === 'approved';
                      const inReview = m.status === 'in_review';
                      return (
                        <div key={m.stage} className="p-3 flex items-center justify-between gap-2 text-[11px] bg-slate-50/50">
                          <div className="min-w-0 flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono font-black text-[10px] shrink-0 ${approved ? 'bg-emerald-600 text-white' : inReview ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-600'}`}>
                              {m.stage}
                            </span>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 truncate">{m.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {m.creditsLogged || 0} hrs{m.verifiedByFaculty ? ` • ${language === 'hi' ? 'क्रेडिट सत्यापित' : 'credits verified'}` : ''}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {approved ? (
                              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{language === 'hi' ? 'स्वीकृत' : 'Approved'}</span>
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                {inReview && (
                                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                    {language === 'hi' ? 'समीक्षाधीन' : 'In Review'}
                                  </span>
                                )}
                                <button
                                  onClick={() => updateMilestoneStatus(p.id, m.stage, 'approved')}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition flex items-center space-x-1"
                                  title={language === 'hi' ? 'हस्ताक्षर एवं क्रेडिट सत्यापन' : 'Sign off & verify NEP credits'}
                                >
                                  <ArrowRight className="w-3 h-3" />
                                  <span>{language === 'hi' ? 'स्वीकृत' : 'Approve'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {p.studentTeam && p.studentTeam.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {p.studentTeam.map((st, i) => (
                        <span key={`${st.roll}-${i}`} className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          {st.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
