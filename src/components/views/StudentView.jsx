import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NepCertificateModal } from '../common/NepCertificate';
import { getLocalizedProposal, getLocalizedCredit } from '../../data/mockData';
import { BookOpen, Award, Clock, CheckCircle2, FileText, ArrowRight, UploadCloud, Layers, Sparkles, CheckCircle } from 'lucide-react';

export const StudentView = () => {
  const { proposals, nepCredits, issueNepCertificate, updateMilestoneStatus, currentUser, t, language } = useApp();
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'credits'
  
  const [logForm, setLogForm] = useState({
    studentName: currentUser?.name || (language === 'hi' ? 'अनन्या रॉय' : 'Ananya Roy'),
    studentRoll: 'BTECH/ENV/2026/012',
    hours: '150',
    projectTitle: 'Low-Cost Graphene-Oxide Bio-Char Filter with Real-Time IoT Water Quality Node',
    institution: 'Birla Institute of Technology (BIT) Mesra',
    department: 'Environmental Engineering & Applied Sciences',
    facultySupervisor: 'Dr. Alok Kumar'
  });

  const [deliverableModal, setDeliverableModal] = useState(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [fileName, setFileName] = useState('Milestone_Technical_Report_v2.pdf');

  const localizedProposals = proposals.map(p => getLocalizedProposal(p, language));
  const localizedCredits = nepCredits.map(cr => getLocalizedCredit(cr, language));

  const handleIssueCert = (e) => {
    e.preventDefault();
    const created = issueNepCertificate(logForm);
    setSelectedCert(getLocalizedCredit(created, language));
  };

  const handleDeliverableSubmit = (e) => {
    e.preventDefault();
    if (!deliverableModal) return;
    updateMilestoneStatus(deliverableModal.proposalId, deliverableModal.stage, 'in_review');
    alert(language === 'hi' 
      ? `माइलस्टोन चरण ${deliverableModal.stage} रिपोर्ट संकाय प्रमुख के अनुमोदन हेतु जमा कर दी गई है!`
      : `Milestone Stage ${deliverableModal.stage} deliverable successfully submitted for Faculty PI review!`
    );
    setDeliverableModal(null);
    setDeliverableNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
              <Award className="w-3 h-3 text-emerald-400" />
              <span>{t.student.tag}</span>
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {t.student.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.student.subtitle}
            </p>
          </div>

          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 text-right shrink-0 shadow-inner">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{localizedCredits.length}</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">{t.student.verifiedCerts}</div>
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <NepCertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}

      {/* Deliverable Submission Modal */}
      {deliverableModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form onSubmit={handleDeliverableSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                <span>{language === 'hi' ? `माइलस्टोन चरण ${deliverableModal.stage} रिपोर्ट सबमिट करें` : `Submit Milestone Stage ${deliverableModal.stage} Deliverable`}</span>
              </h3>
              <button onClick={() => setDeliverableModal(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'संलग्न इंजीनियरिंग फ़ाइल / रिपोर्ट' : 'Attached Engineering File / Report'}</label>
                <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-4 rounded-xl text-center space-y-1">
                  <FileText className="w-7 h-7 text-emerald-600 mx-auto" />
                  <div className="font-bold text-slate-800">{fileName}</div>
                  <div className="text-[10px] text-slate-500">PDF, CAD schematics, or field test dataset (Max 25MB)</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'निष्कर्ष एवं परीक्षण सारांश' : 'Deliverable Summary & Findings'} *</label>
                <textarea
                  required
                  rows={3}
                  placeholder={language === 'hi' ? 'परीक्षण निष्कर्ष, सेंसर रीडिंग या फील्ड टिप्पणियां लिखें...' : 'Summarize results, sensor accuracy readings, or field testing observations...'}
                  value={deliverableNotes}
                  onChange={e => setDeliverableNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setDeliverableModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
              >
                {t.student.submitDeliverable}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 border border-slate-200 shadow-sm flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'milestones'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'सक्रिय प्रोजेक्ट माइलस्टोन' : 'Active Project Milestones'}</span>
        </button>

        <button
          onClick={() => setActiveTab('credits')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'credits'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'एनईपी 2020 क्रेडिट लेज़र एवं प्रमाण पत्र' : 'NEP Credit Ledger & Certificates'}</span>
        </button>
      </div>

      {/* Tab 1: Active Project Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {localizedProposals.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">{p.heiName}</span>
                  <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
                  <div className="text-xs text-slate-500 font-medium">PI: {p.facultyLead}</div>
                </div>
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                  {p.id}
                </span>
              </div>

              {/* 4-Stage Milestones Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {p.milestones.map((m, idx) => {
                  const isDone = m.status === 'approved';
                  const inReview = m.status === 'in_review';

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : inReview
                          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[10px] uppercase">{language === 'hi' ? `चरण ${m.stage}` : `Stage ${m.stage}`}</span>
                          {isDone ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        <div className="font-bold text-xs leading-snug">{m.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{m.creditsLogged} {language === 'hi' ? 'घंटे लॉग किए गए' : 'Hrs Logged'}</div>
                      </div>

                      {!isDone && (
                        <button
                          onClick={() => setDeliverableModal({ proposalId: p.id, stage: m.stage, name: m.name })}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-xl transition"
                        >
                          {t.student.submitDeliverable}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: NEP Credit Certificates */}
      {activeTab === 'credits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {localizedCredits.map(c => (
            <div key={c.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {c.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{c.abcBankId}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{c.projectTitle}</h4>
                  <div className="text-xs text-emerald-700 font-medium">{c.studentName} ({c.studentRoll})</div>
                  <div className="text-[11px] text-slate-500">{c.institution} &bull; {c.department}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'सत्यापित घंटे' : 'Verified Hours'}</span>
                    <strong className="text-slate-900 text-sm">{c.verifiedCreditsHours} Hrs</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'एनईपी क्रेडिट समतुल्य' : 'Academic Credits'}</span>
                    <strong className="text-emerald-700 text-sm">{c.academicCreditsEquivalent} Credits</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(c)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.student.viewCertificate}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
