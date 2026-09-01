import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLocalizedProposal, getLocalizedPartner } from '../../data/mockData';
import { Coins, CheckCircle, Search, Filter, ShieldCheck, HeartHandshake, Building2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export const IndustryCsrView = () => {
  const { proposals, csrPartners, pledgeCsrFunds, t, language, globalSearch } = useApp();
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState('100000');
  const [selectedPartner, setSelectedPartner] = useState(csrPartners[0]?.orgName || 'Tata Steel Foundation');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const handlePledge = (e) => {
    e.preventDefault();
    if (!selectedProposal || !pledgeAmount) return;

    pledgeCsrFunds(selectedProposal.id, pledgeAmount, selectedPartner);
    setSelectedProposal(null);
    setPledgeAmount('100000');
  };

  const localizedProposals = proposals.map(p => getLocalizedProposal(p, language));
  const localizedPartners = csrPartners.map(p => getLocalizedPartner(p, language));

  const activeSearch = (globalSearch || searchQuery).toLowerCase();

  const filteredProposals = localizedProposals.filter(p => {
    const matchesSearch = !activeSearch ||
                          p.title.toLowerCase().includes(activeSearch) ||
                          p.heiName.toLowerCase().includes(activeSearch) ||
                          p.facultyLead.toLowerCase().includes(activeSearch) ||
                          p.abstract.toLowerCase().includes(activeSearch);
    const matchesStatus = filterStatus === 'ALL' ||
                          (filterStatus === 'seeking' && p.fundingStatus !== 'fully_funded') ||
                          (filterStatus === 'funded' && p.fundingStatus === 'fully_funded');
    return matchesSearch && matchesStatus;
  });

  const totalPledged = proposals.reduce((acc, p) => acc + (p.pledgedAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
              <Sparkles className="w-3 h-3" />
              <span>{t.csr.tag}</span>
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {t.csr.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.csr.subtitle}
            </p>
          </div>

          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 text-right shrink-0 shadow-inner">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 font-mono">
              ₹{(totalPledged / 100000).toFixed(1)} {language === 'hi' ? 'लाख' : 'Lakhs'}
            </div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">{t.csr.totalPledged}</div>
          </div>
        </div>
      </div>

      {/* Pledge Grant Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <form onSubmit={handlePledge} className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span>{t.csr.pledgeGrant}</span>
              </h3>
              <button onClick={() => setSelectedProposal(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl text-xs space-y-1.5 text-slate-900 border border-emerald-100">
              <div className="font-black text-sm text-slate-950">{selectedProposal.title}</div>
              <div className="text-slate-600 font-medium">HEI: <strong>{selectedProposal.heiName}</strong> &bull; Lead PI: <strong>{selectedProposal.facultyLead}</strong></div>
              <div className="text-emerald-950 font-bold pt-1 flex justify-between">
                <span>{t.csr.requested}: ₹{selectedProposal.requestedBudget.toLocaleString()}</span>
                <span>{t.csr.pledged}: ₹{selectedProposal.pledgedAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'सीएसआर भागीदार इकाई चुनें' : 'Select CSR Partner Entity'} *</label>
                <select
                  value={selectedPartner}
                  onChange={e => setSelectedPartner(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {localizedPartners.map(p => <option key={p.id} value={p.orgName}>{p.orgName}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'अनुदान राशि (₹ INR)' : 'Pledge Grant Amount (₹ INR)'} *</label>
                <input
                  type="number"
                  required
                  value={pledgeAmount}
                  onChange={e => setPledgeAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedProposal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
              >
                {t.csr.pledgeGrant}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredProposals.map(p => {
          const isFunded = p.fundingStatus === 'fully_funded';
          const percent = Math.min(100, Math.round((p.pledgedAmount / p.requestedBudget) * 100));

          return (
            <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isFunded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isFunded ? (language === 'hi' ? 'पूर्णतः वित्तपोषित' : 'Fully Funded') : (language === 'hi' ? 'अनुदान अपेक्षित' : 'Seeking Grant')}
                  </span>
                  <span className="font-mono text-slate-400 text-[10px]">{p.id}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{p.title}</h3>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">{p.heiName} &bull; {p.facultyLead}</div>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">{p.abstract}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">{language === 'hi' ? 'अनुदान प्रगति' : 'Funding Progress'}:</span>
                  <span className="text-emerald-700 font-mono">{percent}% (₹{p.pledgedAmount.toLocaleString()} / ₹{p.requestedBudget.toLocaleString()})</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProposal(p)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.csr.pledgeGrant}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
