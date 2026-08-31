import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NepCertificateModal } from '../common/NepCertificate';
import { BookOpen, Award, Clock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const StudentView = () => {
  const { proposals, nepCredits, issueNepCertificate } = useApp();
  const [selectedCert, setSelectedCert] = useState(null);
  const [logForm, setLogForm] = useState({
    studentName: 'Priya Sharma',
    studentRoll: 'BTECH/10042/22',
    hours: '150',
    projectTitle: 'Low-Cost Graphene-Oxide Bio-Char Filter'
  });

  const [issueSuccess, setIssueSuccess] = useState(null);

  const handleIssueCert = (e) => {
    e.preventDefault();
    const created = issueNepCertificate(logForm);
    setIssueSuccess(created);
    setSelectedCert(created);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-teal-900 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="bg-amber-800 text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Student Researcher Portal
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">NEP 2020 Experiential Learning Credit Ledger</h2>
          <p className="text-xs text-amber-100 mt-1 max-w-xl">
            Log research engineering hours, submit 4-stage milestone deliverables, track faculty approvals, and generate official Academic Bank of Credits (ABC) certificates.
          </p>
        </div>

        <div className="bg-amber-950/80 p-4 rounded-xl border border-amber-700/50 text-right hidden sm:block">
          <div className="text-2xl font-black text-amber-400">{nepCredits.length}</div>
          <div className="text-[10px] text-amber-200 font-medium">Issued NEP Certificates</div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <NepCertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}

      {/* Credit Log & Certificate Generation Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleIssueCert} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 md:col-span-1">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Generate NEP Credit Certificate</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={logForm.studentName}
                onChange={e => setLogForm({ ...logForm, studentName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll / Reg Number</label>
              <input
                type="text"
                required
                value={logForm.studentRoll}
                onChange={e => setLogForm({ ...logForm, studentRoll: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Field Research Hours Logged</label>
              <input
                type="number"
                required
                value={logForm.hours}
                onChange={e => setLogForm({ ...logForm, hours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-amber-800"
              />
              <span className="text-[10px] text-slate-400">Equivalent to {(parseInt(logForm.hours || 0)/30).toFixed(1)} NEP Credits (30 hrs = 1 credit)</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Issue NEP 2020 Certificate</span>
            </button>
          </div>
        </form>

        {/* Issued NEP Certificates Ledger */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Issued NEP 2020 Certificates ({nepCredits.length})</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">ABC Bank Compliant</span>
          </h3>

          <div className="space-y-3">
            {nepCredits.map(cert => (
              <div key={cert.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{cert.studentName}</span>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">{cert.studentRoll}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{cert.projectTitle}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{cert.institution} • {cert.issueDate}</div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-amber-800 text-sm">{cert.verifiedCreditsHours} Hours</div>
                    <div className="text-[10px] font-semibold text-emerald-600">{cert.academicCreditsEquivalent} NEP Credits</div>
                  </div>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                    title="View Printable Certificate"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
