import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NepCertificateModal } from '../common/NepCertificate';
import { BookOpen, Award, Clock, CheckCircle2, FileText, ArrowRight, UploadCloud, Layers, Sparkles } from 'lucide-react';

export const StudentView = () => {
  const { proposals, nepCredits, issueNepCertificate, updateMilestoneStatus, currentUser } = useApp();
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'credits'
  
  const [logForm, setLogForm] = useState({
    studentName: currentUser?.name || 'Priya Sharma',
    studentRoll: currentUser?.roll || 'BTECH/10042/22',
    hours: '150',
    projectTitle: 'Low-Cost Graphene-Oxide Bio-Char Filter with Real-Time IoT Water Quality Node',
    institution: 'Birla Institute of Technology (BIT) Mesra',
    department: 'Environmental Engineering & Computer Science',
    facultySupervisor: 'Dr. Alok Kumar (Professor & Dean R&D)'
  });

  const [deliverableModal, setDeliverableModal] = useState(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [fileName, setFileName] = useState('Milestone_Technical_Report_v2.pdf');

  const handleIssueCert = (e) => {
    e.preventDefault();
    const created = issueNepCertificate(logForm);
    setSelectedCert(created);
  };

  const handleDeliverableSubmit = (e) => {
    e.preventDefault();
    if (!deliverableModal) return;
    updateMilestoneStatus(deliverableModal.proposalId, deliverableModal.stage, 'in_review');
    alert(`Milestone Stage ${deliverableModal.stage} deliverable successfully submitted for Faculty PI review!`);
    setDeliverableModal(null);
    setDeliverableNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              Phase 3 Execution • Student Researcher Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">NEP 2020 Experiential Learning Credit Ledger</h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              Execute field engineering tasks, upload 4-stage milestone deliverables, log verified research hours (30 field hours = 1.0 NEP credit), and generate official Academic Bank of Credits (ABC) certificates.
            </p>
          </div>

          <div className="bg-amber-950/90 p-4 sm:p-5 rounded-2xl border border-amber-700/60 text-right shrink-0 shadow-inner">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{nepCredits.length}</div>
            <div className="text-[11px] text-amber-200 font-semibold mt-0.5">Verified NEP Certificates</div>
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <NepCertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}

      {/* Deliverable Submission Modal */}
      {deliverableModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleDeliverableSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-teal-600" />
                <span>Submit Milestone Stage {deliverableModal.stage} Deliverable</span>
              </h3>
              <span className="text-xs font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">{deliverableModal.name}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Attached Engineering File / Report</label>
                <div className="border-2 border-dashed border-teal-300 bg-teal-50/50 p-4 rounded-xl text-center space-y-1">
                  <FileText className="w-8 h-8 text-teal-600 mx-auto" />
                  <div className="font-bold text-slate-800">{fileName}</div>
                  <div className="text-[10px] text-slate-500">PDF, CAD schematics, or field test dataset (Max 25MB)</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deliverable Summary & Field Test Findings *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize results, sensor accuracy readings, or field testing observations..."
                  value={deliverableNotes}
                  onChange={e => setDeliverableNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeliverableModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition"
              >
                Submit for PI Verification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition touch-target ${
            activeTab === 'milestones' ? 'bg-teal-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4-Stage Project Milestones ({proposals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('credits')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition touch-target ${
            activeTab === 'credits' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>NEP Credit Certificate Generator</span>
        </button>
      </div>

      {activeTab === 'milestones' ? (
        /* 4-Stage Project Milestones Execution View */
        <div className="space-y-4">
          {proposals.map(prop => (
            <div key={prop.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-teal-700 font-black bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">{prop.id}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{prop.fundingStatus.replace('_', ' ')}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">{prop.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Faculty PI: {prop.facultyLead} • {prop.heiName}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right shrink-0">
                  <div className="text-xs text-slate-500 font-medium">CSR Grant Backing</div>
                  <div className="text-xs font-black text-slate-900 font-mono">₹{prop.pledgedAmount.toLocaleString()} ({prop.csrPartner})</div>
                </div>
              </div>

              {/* 4-Stage Execution Tracker */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">4-Stage Milestone Deliverable Lifecycle:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {prop.milestones.map((m) => {
                    const isPending = m.status === 'pending';
                    const isInReview = m.status === 'in_review';
                    const isApproved = m.status === 'approved';

                    return (
                      <div
                        key={m.stage}
                        className={`p-4 rounded-2xl border text-xs space-y-2 flex flex-col justify-between ${
                          isApproved ? 'bg-emerald-50/60 border-emerald-200' :
                          isInReview ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[10px] text-slate-500">STAGE {m.stage}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              isApproved ? 'bg-emerald-200 text-emerald-900' :
                              isInReview ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {m.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs">{m.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Est. 40-50 Field Hours</div>
                        </div>

                        <div>
                          {isPending && (
                            <button
                              onClick={() => setDeliverableModal({ proposalId: prop.id, stage: m.stage, name: m.name })}
                              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Submit Deliverable</span>
                            </button>
                          )}
                          {isInReview && (
                            <div className="text-[10px] text-amber-700 font-bold text-center bg-amber-100/80 py-1.5 rounded-lg">
                              Under Faculty Review
                            </div>
                          )}
                          {isApproved && (
                            <div className="text-[10px] text-emerald-700 font-bold text-center bg-emerald-100 py-1.5 rounded-lg flex items-center justify-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified & Signed Off</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* NEP Credit Log & Certificate Generation Card */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={handleIssueCert} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 md:col-span-1">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Generate NEP Credit Certificate</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={logForm.studentName}
                  onChange={e => setLogForm({ ...logForm, studentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Roll / ABC Reg Number</label>
                <input
                  type="text"
                  required
                  value={logForm.studentRoll}
                  onChange={e => setLogForm({ ...logForm, studentRoll: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Research Hours Logged</label>
                <input
                  type="number"
                  required
                  value={logForm.hours}
                  onChange={e => setLogForm({ ...logForm, hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-medium">
                  Formula: {logForm.hours || 0} hrs &divide; 30 = <strong className="text-amber-800 font-bold">{(parseInt(logForm.hours || 0)/30).toFixed(1)} NEP Academic Credits</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Higher Education Institution</label>
                <input
                  type="text"
                  value={logForm.institution}
                  onChange={e => setLogForm({ ...logForm, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>Issue & Print NEP 2020 Certificate</span>
              </button>
            </div>
          </form>

          {/* Issued NEP Certificates Ledger */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official NEP 2020 Credit Ledger ({nepCredits.length})</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic Bank of Credits (ABC)</span>
            </h3>

            <div className="space-y-3">
              {nepCredits.map(cert => (
                <div key={cert.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-amber-400 transition">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{cert.studentName}</span>
                      <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">{cert.studentRoll}</span>
                      <span className="text-[10px] font-mono text-slate-400">{cert.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">{cert.projectTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ABC ID: {cert.abcBankId} • {cert.institution}</div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="font-black text-amber-900 text-sm">{cert.verifiedCreditsHours} Hours</div>
                      <div className="text-[10px] font-black text-emerald-700">{cert.academicCreditsEquivalent} NEP Credits</div>
                    </div>
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                      title="View Printable Certificate"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
