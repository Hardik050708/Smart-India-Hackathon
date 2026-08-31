import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, CheckCircle, Search, Filter, ShieldCheck, HeartHandshake } from 'lucide-react';

export const IndustryCsrView = () => {
  const { proposals, csrPartners, pledgeCsrFunds } = useApp();
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState('100000');
  const [selectedPartner, setSelectedPartner] = useState(csrPartners[0]?.orgName || 'Tata Steel Foundation');

  const handlePledge = (e) => {
    e.preventDefault();
    if (!selectedProposal || !pledgeAmount) return;

    pledgeCsrFunds(selectedProposal.id, pledgeAmount, selectedPartner);
    setSelectedProposal(null);
    setPledgeAmount('100000');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="bg-teal-800 text-teal-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Industry & CSR Partner Portal
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">CSR Funding & Mentorship Marketplace</h2>
          <p className="text-xs text-teal-100 mt-1 max-w-xl">
            Evaluate vetted research proposals from Jharkhand HEIs, pledge financial grants, provide technical mentorship, and audit prototype field testing milestones.
          </p>
        </div>

        <div className="bg-teal-950/80 p-4 rounded-xl border border-teal-700/50 text-right hidden sm:block">
          <div className="text-2xl font-black text-teal-300">₹1.85 Cr</div>
          <div className="text-[10px] text-teal-200 font-medium">Total CSR Funds Pledged</div>
        </div>
      </div>

      {/* Pledge Grant Modal */}
      {selectedProposal && (
        <form onSubmit={handlePledge} className="bg-white rounded-2xl p-6 border-2 border-teal-500 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-teal-600" />
              <span>Pledge CSR Grant Funding / Mentorship</span>
            </h3>
            <span className="text-xs font-mono text-teal-700">{selectedProposal.id}</span>
          </div>

          <div className="bg-teal-50 p-4 rounded-xl text-xs space-y-1 text-teal-900">
            <div className="font-bold">{selectedProposal.title}</div>
            <div className="text-teal-700">HEI: {selectedProposal.heiName} • Lead PI: {selectedProposal.facultyLead}</div>
            <div className="text-teal-800 font-bold pt-1">
              Requested: ₹{selectedProposal.requestedBudget.toLocaleString()} • Currently Pledged: ₹{selectedProposal.pledgedAmount.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select CSR Partner Entity *</label>
              <select
                value={selectedPartner}
                onChange={e => setSelectedPartner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800"
              >
                {csrPartners.map(p => <option key={p.id} value={p.orgName}>{p.orgName}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pledge Grant Amount (₹ INR) *</label>
              <input
                type="number"
                required
                value={pledgeAmount}
                onChange={e => setPledgeAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-teal-900"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedProposal(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Coins className="w-4 h-4" />
              <span>Confirm Funding Pledge</span>
            </button>
          </div>
        </form>
      )}

      {/* CSR Active Marketplace Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          Vetted Academic Proposals Seeking CSR Support ({proposals.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposals.map(prop => {
            const fundingPercent = Math.min(100, Math.round((prop.pledgedAmount / prop.requestedBudget) * 100));

            return (
              <div key={prop.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full">
                      {prop.heiName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{prop.id}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{prop.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3">{prop.abstract}</p>

                  {/* Funding Progress Meter */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Grant Coverage</span>
                      <span className="font-bold text-teal-800">
                        ₹{prop.pledgedAmount.toLocaleString()} / ₹{prop.requestedBudget.toLocaleString()} ({fundingPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${fundingPercent}%` }}></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProposal(prop)}
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition text-center shadow"
                >
                  Evaluate & Pledge Grant Funding
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
