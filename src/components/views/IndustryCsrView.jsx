import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, CheckCircle, Search, Filter, ShieldCheck, HeartHandshake, Building2, TrendingUp } from 'lucide-react';

export const IndustryCsrView = () => {
  const { proposals, csrPartners, pledgeCsrFunds } = useApp();
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState('100000');
  const [selectedPartner, setSelectedPartner] = useState(csrPartners[0]?.orgName || 'Tata Steel Foundation');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'seeking' | 'funded'

  const handlePledge = (e) => {
    e.preventDefault();
    if (!selectedProposal || !pledgeAmount) return;

    pledgeCsrFunds(selectedProposal.id, pledgeAmount, selectedPartner);
    setSelectedProposal(null);
    setPledgeAmount('100000');
  };

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.heiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.facultyLead.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' ||
                          (filterStatus === 'seeking' && p.fundingStatus !== 'fully_funded') ||
                          (filterStatus === 'funded' && p.fundingStatus === 'fully_funded');
    return matchesSearch && matchesStatus;
  });

  const totalPledged = proposals.reduce((acc, p) => acc + (p.pledgedAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-teal-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-teal-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              Phase 3 Execution • CSR & Industry Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">CSR Funding & Mentorship Marketplace</h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
              Evaluate vetted research proposals from Jharkhand HEIs (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur), pledge financial grant support, provide technical mentorship, and audit 4-stage milestone deliverables.
            </p>
          </div>

          <div className="bg-teal-950/90 p-4 sm:p-5 rounded-2xl border border-teal-700/60 text-right shrink-0 shadow-inner">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">₹{(totalPledged / 100000).toFixed(1)} Lakhs</div>
            <div className="text-[11px] text-teal-200 font-semibold mt-0.5">Total CSR Grant Funds Pledged</div>
          </div>
        </div>
      </div>

      {/* Pledge Grant Modal */}
      {selectedProposal && (
        <form onSubmit={handlePledge} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-teal-600" />
              <span>Pledge CSR Grant Funding & Technical Mentorship</span>
            </h3>
            <span className="text-xs font-mono text-teal-700">{selectedProposal.id}</span>
          </div>

          <div className="bg-teal-50/80 p-4 rounded-2xl text-xs space-y-1.5 text-teal-950 border border-teal-100">
            <div className="font-black text-sm">{selectedProposal.title}</div>
            <div className="text-teal-800 font-medium">HEI: {selectedProposal.heiName} • Lead PI: {selectedProposal.facultyLead}</div>
            <div className="text-teal-900 font-bold pt-1">
              Requested: ₹{selectedProposal.requestedBudget.toLocaleString()} • Currently Pledged: ₹{selectedProposal.pledgedAmount.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select CSR Partner Entity *</label>
              <select
                value={selectedPartner}
                onChange={e => setSelectedPartner(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                {csrPartners.map(p => <option key={p.id} value={p.orgName}>{p.orgName}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pledge Grant Amount (₹ INR) *</label>
              <input
                type="number"
                required
                value={pledgeAmount}
                onChange={e => setPledgeAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-teal-950 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setSelectedProposal(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
            >
              <Coins className="w-4 h-4" />
              <span>Confirm Grant Funding Pledge</span>
            </button>
          </div>
        </form>
      )}

      {/* Search & Status Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterStatus === 'ALL' ? 'bg-teal-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            All Academic Proposals ({proposals.length})
          </button>
          <button
            onClick={() => setFilterStatus('seeking')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterStatus === 'seeking' ? 'bg-teal-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Open for Funding
          </button>
          <button
            onClick={() => setFilterStatus('funded')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterStatus === 'funded' ? 'bg-teal-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Fully Funded
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search proposals, HEI or PI..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
          />
        </div>
      </div>

      {/* CSR Active Marketplace Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProposals.map(prop => {
            const fundingPercent = Math.min(100, Math.round((prop.pledgedAmount / prop.requestedBudget) * 100));

            return (
              <div key={prop.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-teal-100 text-teal-900 font-extrabold px-3 py-0.5 rounded-full">
                      {prop.heiName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{prop.id}</span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{prop.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{prop.abstract}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Lead PI: {prop.facultyLead}</p>

                  {/* Funding Progress Meter */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Grant Coverage</span>
                      <span className="font-black text-teal-900">
                        ₹{prop.pledgedAmount.toLocaleString()} / ₹{prop.requestedBudget.toLocaleString()} ({fundingPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: `${fundingPercent}%` }}></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProposal(prop)}
                  className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-black text-xs rounded-xl transition text-center shadow-md"
                >
                  Evaluate & Pledge Grant Support
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
