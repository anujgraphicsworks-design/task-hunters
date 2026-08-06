import React, { useState } from 'react';
import { useApp, autoDetectSubreddit } from '../context/AppContext';
import BackendControlCenter from './BackendControlCenter';
import {
  UserCheck,
  PlusCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  ShieldCheck,
  History,
  Trash2,
  Timer,
} from 'lucide-react';

export default function ModeratorPage() {
  const {
    user,
    tasks,
    taskHistory,
    approveSubmission,
    rejectSubmission,
    createTask,
    globalRates,
    microtaskers,
    approveMicrotasker,
    revokeMicrotasker,
    resetClaimCooldown,
    deleteUserFromBackend,
    formatAmount,
    theme,
  } = useApp();

  const isDark = theme === 'dark';
  const card = isDark ? 'bg-[#121826] border-[#202B3F]' : 'bg-white border-slate-200 shadow-sm';
  const sub = isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-50 border-slate-200';
  const inp = isDark ? 'bg-[#090D16] border-[#202B3F] text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';
  const tt = isDark ? 'text-white' : 'text-slate-900';
  const tm = isDark ? 'text-slate-400' : 'text-slate-500';
  const divider = isDark ? 'divide-[#202B3F]/60' : 'divide-slate-100';

  const [activeTab, setActiveTab] = useState('QUEUE'); // QUEUE | USERS | HISTORY | ADMIN
  const [rejectReasonMap, setRejectReasonMap] = useState({});

  const pendingTasks = tasks.filter(t => t.status === 'PENDING_APPROVAL');
  const pendingReddit = microtaskers.filter(m => m.redditUsername && !(m.isRedditApproved || m.isApprovedHunter));

  const formatDaysLeft = (expiresMs) => {
    if (!expiresMs) return '7 Days';
    const leftMs = Math.max(0, expiresMs - Date.now());
    const days = Math.floor(leftMs / (24 * 3600 * 1000));
    const hours = Math.floor((leftMs % (24 * 3600 * 1000)) / (3600 * 1000));
    return `${days}d ${hours}h left`;
  };

  const tabs = [
    { id: 'QUEUE', label: `Proof Queue (${pendingTasks.length})`, icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: 'USERS', label: `Users (${pendingReddit.length} pending)`, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'HISTORY', label: 'History', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'ADMIN', label: 'Admin Panel', icon: <PlusCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-5 pb-12">

      {/* Header */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${card}`}>
        <div>
          <h1 className={`text-base font-extrabold ${tt}`}>Moderator Dashboard</h1>
          <p className={`text-xs ${tm}`}>{user.name} · MODERATOR</p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>
          <ShieldCheck className="w-3.5 h-3.5" /> Moderator
        </div>
      </div>

      {/* Tab Bar */}
      <div className={`flex items-center gap-1 p-1 rounded-xl border ${sub} overflow-x-auto`}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === t.id
                ? isDark ? 'bg-[#121826] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                : `${tm} hover:text-violet-400`
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ===== PROOF QUEUE ===== */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${card}`}>
            <h2 className={`text-sm font-extrabold ${tt}`}>Pending Proof Review ({pendingTasks.length})</h2>
            <p className={`text-xs mt-0.5 ${tm}`}>Review user-submitted Reddit proof URLs and approve or reject them.</p>
          </div>

          {pendingTasks.length === 0 ? (
            <div className={`p-12 rounded-xl border text-center ${card}`}>
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className={`text-sm font-bold ${tt}`}>Queue Clear</p>
              <p className={`text-xs ${tm}`}>No pending proof submissions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map(t => (
                <div key={t.id} className={`p-4 rounded-xl border space-y-3 ${card}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>
                        {t.subreddit} · {t.type}
                      </span>
                      <p className={`text-sm font-bold mt-1 ${tt}`}>{t.teaserText}</p>
                    </div>
                    <span className="text-emerald-400 font-extrabold text-sm font-mono shrink-0">{formatAmount(t.reward)}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className={`p-2.5 rounded-lg border text-xs ${sub}`}>
                      <span className={`text-[10px] font-bold uppercase block mb-1 ${tm}`}>Submitted Proof</span>
                      <a href={t.proofUrl} target="_blank" rel="noreferrer" className="text-orange-400 font-mono break-all hover:underline flex items-center gap-1">
                        {t.proofUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <div className={`p-2.5 rounded-lg border text-xs ${sub}`}>
                      <span className={`text-[10px] font-bold uppercase block mb-1 ${tm}`}>Target Post</span>
                      <a href={t.targetPostUrl} target="_blank" rel="noreferrer" className={`font-mono break-all hover:underline flex items-center gap-1 ${tm}`}>
                        {t.targetPostUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      placeholder="Optional reject reason..."
                      value={rejectReasonMap[t.id] || ''}
                      onChange={e => setRejectReasonMap({ ...rejectReasonMap, [t.id]: e.target.value })}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs border ${inp}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => rejectSubmission(t.id, rejectReasonMap[t.id])}
                        className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${isDark ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'}`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => approveSubmission(t.id, 'Approved by Moderator')}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== USERS ===== */}
      {activeTab === 'USERS' && (
        <div className={`p-4 rounded-xl border space-y-3 ${card}`}>
          <div>
            <h2 className={`text-sm font-extrabold ${tt}`}>User Approvals & Management</h2>
            <p className={`text-xs ${tm}`}>{pendingReddit.length} pending Reddit approval</p>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {microtaskers.map(m => {
              const isApproved = m.isRedditApproved || m.isApprovedHunter;
              return (
                <div key={m.id} className={`p-3 rounded-xl border ${sub}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {(m.name || m.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${tt}`}>{m.name || m.email}</span>
                        {m.redditUsername && <span className={`text-[10px] font-mono ${tm}`}>{m.redditUsername}</span>}
                        {isApproved && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">✓ Approved</span>}
                      </div>
                      <p className={`text-[10px] ${tm}`}>{m.email}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                      {m.redditUsername && !isApproved && (
                        <button onClick={() => approveMicrotasker(m.id, m.redditUsername)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 flex items-center gap-1">
                          Approve
                        </button>
                      )}
                      {isApproved && (
                        <button onClick={() => revokeMicrotasker(m.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1">
                          Revoke
                        </button>
                      )}
                      <button
                        onClick={() => { if (confirm(`Reset cooldown for ${m.email}?`)) resetClaimCooldown(m.id); }}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1"
                        title="Reset 4-hour claim cooldown"
                      >
                        <Timer className="w-3 h-3" /> Reset Timer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== HISTORY ===== */}
      {activeTab === 'HISTORY' && (
        <div className={`p-4 rounded-xl border space-y-3 ${card}`}>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h2 className={`text-sm font-extrabold ${tt}`}>7-Day Task History ({taskHistory.length})</h2>
          </div>

          <div className={`rounded-xl border overflow-hidden`}>
            <table className="w-full text-xs text-left border-collapse">
              <thead className={`text-[10px] uppercase font-bold tracking-wider border-b ${isDark ? 'bg-[#090D16] border-[#202B3F] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <tr>
                  <th className="py-2.5 px-3">Subreddit / Type</th>
                  <th className="py-2.5 px-3">Proof URL</th>
                  <th className="py-2.5 px-3">Reward</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Expires</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divider}`}>
                {taskHistory.length === 0 ? (
                  <tr><td colSpan={5} className={`text-center py-10 ${tm}`}>No history records.</td></tr>
                ) : taskHistory.map((item, idx) => (
                  <tr key={item.id || idx} className={isDark ? 'hover:bg-[#182032]' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3">
                      <span className={`font-bold block ${tt}`}>{item.subreddit}</span>
                      <span className={`text-[10px] ${tm}`}>{item.type}</span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[200px] truncate">
                      <a href={item.proofUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:underline font-mono">
                        {item.proofUrl || 'N/A'}
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold font-mono">${(item.reward || 1).toFixed(2)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>{item.status}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-[10px] ${tm}`}>{formatDaysLeft(item.expiresFromHistoryAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== ADMIN PANEL (embedded) ===== */}
      {activeTab === 'ADMIN' && <BackendControlCenter />}

    </div>
  );
}
