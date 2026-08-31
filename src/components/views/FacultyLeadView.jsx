import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Sparkles, Send, Users, CheckCircle, FileText, Plus } from 'lucide-react';

export const FacultyLeadView = () => {
  const { challenges, proposals, submitProposal, updateMilestoneStatus } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [proposalForm, setProposalForm] = useState({
    title: '',
    abstract: '',
    requestedBudget: '250000',
    heiName: 'BIT Mesra',
    facultyLead: 'Dr. Alok Kumar (Professor)',
    facultyEmail: 'alok.kumar@bitmesra.ac.in',
    studentTeam: [
      { name: 'Priya Sharma', roll: 'BTECH/10042/22', role: 'Team Lead / Chemical Analysis' },
      { name: 'Rahul Verma', roll: 'BTECH/10088/22', role: 'Hardware & Sensor Design' }
    ]
  });

  const [newStudent, setNewStudent] = useState({ name: '', roll: '', role: '' });

  const routedChallenges = challenges.filter(c => c.status === 'routed' || c.status === 'verified' || c.status === 'reported');

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
        { name: 'Priya Sharma', roll: 'BTECH/10042/22', role: 'Team Lead / Chemical Analysis' },
        { name: 'Rahul Verma', roll: 'BTECH/10088/22', role: 'Hardware & Sensor Design' }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="bg-indigo-800 text-indigo-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Faculty Lead / PI Portal
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">AI-Routed Challenges & Proposal Wizard</h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-xl">
            Review challenges routed by the AI engine to your university department, form multidisciplinary student research teams, submit research proposals for CSR funding, and verify NEP credit hours.
          </p>
        </div>

        <div className="bg-indigo-950/80 p-4 rounded-xl border border-indigo-700/50 text-right hidden sm:block">
          <div className="text-2xl font-black text-indigo-300">{routedChallenges.length}</div>
          <div className="text-[10px] text-indigo-200 font-medium">Routed Challenges Inbox</div>
        </div>
      </div>

      {/* Proposal Draft Wizard Modal */}
      {selectedChallenge && (
        <form onSubmit={handleProposalSubmit} className="bg-white rounded-2xl p-6 border-2 border-indigo-500 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Draft Research & Engineering Proposal</span>
            </h3>
            <span className="text-xs font-mono text-indigo-700">{selectedChallenge.id}</span>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl text-xs space-y-1">
            <div className="font-bold text-indigo-900">Target Challenge: {selectedChallenge.title}</div>
            <div className="text-indigo-700">Category: {selectedChallenge.category} • Location: {selectedChallenge.district}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Low-Cost Graphene-Oxide Bio-Char Filter with Real-Time IoT Water Quality Node"
                value={proposalForm.title}
                onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requested CSR Grant Budget (₹ INR) *</label>
                <input
                  type="number"
                  required
                  value={proposalForm.requestedBudget}
                  onChange={e => setProposalForm({ ...proposalForm, requestedBudget: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-indigo-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Lead / PI Name</label>
                <input
                  type="text"
                  disabled
                  value={proposalForm.facultyLead}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-100 border border-slate-300 font-semibold text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Abstract & Methodology *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe prototype engineering methodology, deployment strategy, hardware/software design..."
                value={proposalForm.abstract}
                onChange={e => setProposalForm({ ...proposalForm, abstract: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            {/* Student Research Team Builder */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Student Research Team ({proposalForm.studentTeam.length} members)</span>
                </span>
                <span className="text-[10px] text-indigo-600">NEP 2020 Experiential Learning Eligible</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Student Name"
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  placeholder="Roll / Reg No"
                  value={newStudent.roll}
                  onChange={e => setNewStudent({ ...newStudent, roll: e.target.value })}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                />
                <div className="flex space-x-1">
                  <input
                    type="text"
                    placeholder="Role (e.g. Hardware Lead)"
                    value={newStudent.role}
                    onChange={e => setNewStudent({ ...newStudent, role: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddStudent}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                {proposalForm.studentTeam.map((st, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{st.name} ({st.roll})</span>
                    <span className="text-[11px] text-indigo-600 font-medium">{st.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setSelectedChallenge(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit Proposal to CSR Marketplace</span>
            </button>
          </div>
        </form>
      )}

      {/* AI Routed Challenges Inbox */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900">
          AI-Routed Challenge Inbox for Your Department ({routedChallenges.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routedChallenges.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    Matched: {item.routedHei} ({item.routedDept})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
              </div>

              <button
                onClick={() => setSelectedChallenge(item)}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition text-center border border-indigo-200"
              >
                Draft Research Proposal & Form Student Team
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Submitted Proposals & Milestone Review */}
      <div className="space-y-3 pt-4">
        <h3 className="font-bold text-sm text-slate-900">
          Active Institutional Proposals & Milestone Deliverables ({proposals.length})
        </h3>

        <div className="space-y-4">
          {proposals.map(prop => (
            <div key={prop.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold">{prop.id}</span>
                  <h4 className="font-bold text-sm text-slate-900">{prop.title}</h4>
                  <p className="text-xs text-slate-500">Lead PI: {prop.facultyLead} • {prop.heiName}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-indigo-900">Grant Budget: ₹{prop.requestedBudget.toLocaleString()}</div>
                  <div className="text-[10px] font-semibold text-emerald-600">Pledged: ₹{prop.pledgedAmount.toLocaleString()} ({prop.csrPartner})</div>
                </div>
              </div>

              {/* 4-Stage Milestone Verification Bar */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Project Milestone Lifecycle (NEP Credit Approval):</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {prop.milestones.map(m => (
                    <div key={m.stage} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Stage {m.stage}</span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          m.status === 'in_review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 text-[11px] line-clamp-2">{m.name}</div>
                      {m.status === 'in_review' && (
                        <button
                          onClick={() => updateMilestoneStatus(prop.id, m.stage, 'approved')}
                          className="w-full mt-1 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                        >
                          Approve Stage & Credits
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
