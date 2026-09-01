import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Download, Printer, Shield, X, QrCode } from 'lucide-react';

export const NepCertificateModal = ({ cert, onClose }) => {
  const { language } = useApp();
  if (!cert) return null;

  const handlePrint = () => {
    window.print();
  };

  const isHi = language === 'hi';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-6 print-certificate-container">
        {/* Top Actions Bar */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isHi ? 'एनईपी 2020 अनुभवात्मक शिक्षण क्रेडिट प्रमाण पत्र' : 'NEP 2020 Experiential Learning Credit Certificate'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'प्रिंट / पीडीएफ सहेजें' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Frame */}
        <div className="p-8 sm:p-12 bg-amber-50/20 border-8 border-double border-emerald-950/20 text-slate-900 print:border-none print:p-4 relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 -z-0">
            <Shield className="w-96 h-96 text-emerald-950" />
          </div>

          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-emerald-600" />
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-950 font-mono">
                {isHi ? 'उच्च एवं तकनीकी शिक्षा विभाग' : 'Department of Higher & Technical Education'}
              </span>
            </div>
            <h2 className="font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
              {isHi ? 'झारखंड सरकार' : 'GOVERNMENT OF JHARKHAND'}
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider font-mono">
              {isHi ? 'राष्ट्रीय शिक्षा नीति (एनईपी) 2020 • अनुभवात्मक शिक्षण क्रेडिट लेज़र' : 'National Education Policy (NEP) 2020 • Experiential Learning Credit Ledger'}
            </p>

            <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400 mx-auto my-6 rounded-full"></div>
          </div>

          <div className="relative z-10 text-center space-y-4 my-6">
            <p className="text-xs text-slate-500 italic">
              {isHi ? 'यह आधिकारिक रूप से प्रमाणित एवं अभिलिखित किया जाता है कि' : 'This is to officially certify and record that'}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-8">
              {cert.studentName}
            </h3>
            <p className="text-xs text-slate-700 font-mono font-medium">
              {isHi ? 'अनुक्रमांक / पंजीयन संख्या' : 'Roll / Reg No'}: <strong className="text-slate-950 font-bold bg-amber-100/70 px-2 py-0.5 rounded">{cert.studentRoll}</strong> &bull; {isHi ? 'संस्थान' : 'Institution'}: <strong className="text-slate-950 font-bold">{cert.institution}</strong>
            </p>

            <p className="text-xs text-slate-700 leading-relaxed max-w-lg mx-auto pt-2">
              {isHi
                ? 'ने सामाजिक नवाचार अनुसंधान परियोजना के अंतर्गत अनुभवात्मक क्षेत्रीय अनुसंधान, हार्डवेयर प्रोटोटाइप एवं स्थानीय निकाय जमीनी परीक्षण को सफलतापूर्वक पूर्ण किया है:'
                : 'has completed experiential field research, hardware prototyping, and local body ground truth testing for the societal challenge project:'}
            </p>

            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-900/20 shadow-sm max-w-lg mx-auto">
              <p className="font-black text-xs sm:text-sm text-emerald-800">{cert.projectTitle}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{cert.department}</p>
            </div>
          </div>

          {/* Credit Hours Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-4 max-w-md mx-auto my-6 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 text-center shadow-inner">
            <div>
              <div className="text-[10px] font-black text-emerald-950 uppercase tracking-wider font-mono">
                {isHi ? 'सत्यापित अनुसंधान घंटे' : 'Verified Research Hours'}
              </div>
              <div className="text-2xl font-black text-slate-950 mt-0.5 font-mono">{cert.verifiedCreditsHours} {isHi ? 'घंटे' : 'Hrs'}</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-emerald-950 uppercase tracking-wider font-mono">
                {isHi ? 'एनईपी अकादमिक क्रेडिट' : 'NEP Academic Credits'}
              </div>
              <div className="text-2xl font-black text-amber-600 mt-0.5 font-mono">{cert.academicCreditsEquivalent} {isHi ? 'क्रेडिट' : 'Credits'}</div>
            </div>
          </div>

          {/* QR Code & Verification Footnote */}
          <div className="relative z-10 border-t border-slate-300 pt-6 mt-8 grid grid-cols-3 gap-4 items-end text-xs">
            <div className="space-y-0.5">
              <div className="font-extrabold text-slate-900 text-xs">{cert.facultySupervisor}</div>
              <div className="text-[10px] text-slate-500 font-medium">{isHi ? 'संकाय प्रमुख / प्रधान शोधकर्ता' : 'Faculty Lead / Principal Investigator'}</div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isHi ? 'डिजिटल रूप से सत्यापित एवं हस्ताक्षरित' : 'Digitally Verified & Signed'}</span>
              </div>
            </div>

            {/* Simulated Visual QR Badge */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1">{isHi ? 'सत्यापन हेतु स्कैन करें' : 'Scan to Verify'}</div>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-600 space-y-1">
              <div>{isHi ? 'एबीसी बैंक आईडी' : 'ABC Bank ID'}: <strong className="text-slate-900">{cert.abcBankId}</strong></div>
              <div>{isHi ? 'जारी तिथि' : 'Issue Date'}: <span className="text-slate-800">{cert.issueDate}</span></div>
              <div className="text-[8px] text-slate-400 truncate max-w-[160px] ml-auto font-mono" title={cert.verificationHash}>
                Hash: {cert.verificationHash}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
