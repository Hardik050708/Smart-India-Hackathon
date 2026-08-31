import React from 'react';
import { Award, CheckCircle2, Download, Printer, Shield, X } from 'lucide-react';

export const NepCertificateModal = ({ cert, onClose }) => {
  if (!cert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8">
        {/* Top Actions Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>NEP 2020 Experiential Learning Credit Ledger Certificate</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Frame */}
        <div className="p-8 md:p-12 bg-amber-50/30 border-8 border-double border-teal-900/20 text-slate-900 print:border-none print:p-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-jharkhand-green" />
              <span className="text-xs font-bold uppercase tracking-widest text-teal-800">Higher Education & Skill Development Department</span>
            </div>
            <h2 className="font-extrabold text-2xl md:text-3xl text-jharkhand-dark tracking-tight">GOVERNMENT OF JHARKHAND</h2>
            <p className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wide">
              National Education Policy (NEP) 2020 • Experiential Learning Credit Ledger
            </p>

            <div className="w-24 h-1 bg-amber-500 mx-auto my-6 rounded-full"></div>
          </div>

          <div className="text-center space-y-4 my-6">
            <p className="text-xs text-slate-500 italic">This is to officially certify that</p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-4">
              {cert.studentName}
            </h3>
            <p className="text-xs text-slate-600 font-mono">
              Roll No: <strong className="text-slate-800">{cert.studentRoll}</strong> • Institution: <strong className="text-slate-800">{cert.institution}</strong>
            </p>

            <p className="text-xs text-slate-700 leading-relaxed max-w-lg mx-auto pt-2">
              has successfully completed field engineering research and prototype validation for the societal challenge project:
            </p>

            <div className="bg-white/80 p-4 rounded-xl border border-teal-800/20 shadow-sm max-w-lg mx-auto">
              <p className="font-bold text-xs text-jharkhand-green">{cert.projectTitle}</p>
              <p className="text-[11px] text-slate-500 mt-1">{cert.department}</p>
            </div>
          </div>

          {/* Credit Hours Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto my-6 bg-teal-50/60 p-4 rounded-xl border border-teal-100 text-center">
            <div>
              <div className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider">Verified Research Hours</div>
              <div className="text-xl font-black text-jharkhand-dark mt-0.5">{cert.verifiedCreditsHours} Hrs</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider">NEP Academic Credits</div>
              <div className="text-xl font-black text-amber-600 mt-0.5">{cert.academicCreditsEquivalent} Credits</div>
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="border-t border-slate-200 pt-6 mt-8 grid grid-cols-2 gap-6 items-end text-xs">
            <div>
              <div className="font-semibold text-slate-800">{cert.facultySupervisor}</div>
              <div className="text-[10px] text-slate-500">Faculty Lead / Principal Investigator</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Digitally Verified & Approved</span>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-500 space-y-1">
              <div>ABC Bank ID: <span className="font-semibold text-slate-700">{cert.abcBankId}</span></div>
              <div>Issue Date: <span className="text-slate-700">{cert.issueDate}</span></div>
              <div className="text-[9px] text-slate-400 truncate max-w-[200px] ml-auto" title={cert.verificationHash}>
                Hash: {cert.verificationHash}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
