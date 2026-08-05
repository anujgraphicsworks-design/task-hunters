import React, { useState } from 'react';
import { useApp, autoDetectSubreddit } from '../context/AppContext';
import GoogleSheetsPreviewModal from '../components/GoogleSheetsPreviewModal';
import BackendControlCenter from './BackendControlCenter';
import { 
  UserCheck, 
  PlusCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Wand2, 
  Clock,
  ShieldCheck,
  Server,
  Activity,
  Database,
  History,
  Trash2
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
    sheetLogs
  } = useApp();

  const [activeModSubtab, setActiveModSubtab] = useState('QUEUE'); // 'QUEUE' | 'HISTORY' | 'CREATE_TASK' | 'BACKEND'
  const [copiedId, setCopiedId] = useState(null);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [rejectReasonMap, setRejectReasonMap] = useState({});

  // Task Creation Form
  const [taskType, setTaskType] = useState('REDDIT_COMMENT');
  const [subredditInput, setSubredditInput] = useState('');
  const [targetPostUrlInput, setTargetPostUrlInput] = useState('');
  const [teaserTextInput, setTeaserTextInput] = useState('');
  const [contentToPostInput, setContentToPostInput] = useState('');
  const [rewardInput, setRewardInput] = useState(globalRates.commentRate);
  const [timeLimitMinsInput, setTimeLimitMinsInput] = useState(globalRates.defaultTimerMins);
  const [guidelinesInput, setGuidelinesInput] = useState('Account age > 30 days. Comment must stay live.');

  const pendingTasks = tasks.filter(t => t.status === 'PENDING_APPROVAL');

  const handleUrlChange = (url) => {
    setTargetPostUrlInput(url);
    const detected = autoDetectSubreddit(url);
    if (detected) {
      setSubredditInput(detected);
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!targetPostUrlInput || !contentToPostInput) {
      alert("Please complete required task fields.");
      return;
    }

    const sub = subredditInput || autoDetectSubreddit(targetPostUrlInput) || 'r/reddit';

    createTask({
      type: taskType,
      subreddit: sub,
      targetPostUrl: targetPostUrlInput,
      teaserText: teaserTextInput || `Reddit task in ${sub}`,
      contentToPost: contentToPostInput,
      reward: rewardInput,
      timeLimitMins: timeLimitMinsInput,
      guidelines: guidelinesInput,
    });

    setSubredditInput('');
    setTargetPostUrlInput('');
    setTeaserTextInput('');
    setContentToPostInput('');
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDaysLeft = (expiresMs) => {
    if (!expiresMs) return '7 Days';
    const leftMs = Math.max(0, expiresMs - Date.now());
    const days = Math.floor(leftMs / (24 * 3600 * 1000));
    const hours = Math.floor((leftMs % (24 * 3600 * 1000)) / (3600 * 1000));
    return `${days}d ${hours}h left until auto-delete`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header Bar with Subtab Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-dark-card border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-extrabold text-white">Moderator Control Suite</h2>
          </div>
          <p className="text-xs text-dark-muted">
            Review Reddit submission proofs, view 7-day task history, create tasks, and inspect backend server.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subtab Navigation Buttons */}
          <div className="flex items-center bg-dark-bg p-1 rounded-xl border border-dark-border text-xs font-semibold">
            <button
              onClick={() => setActiveModSubtab('QUEUE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModSubtab === 'QUEUE' ? 'bg-purple-600 text-white font-bold' : 'text-dark-muted hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Proof Queue ({pendingTasks.length})
            </button>

            <button
              onClick={() => setActiveModSubtab('HISTORY')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModSubtab === 'HISTORY' ? 'bg-purple-600 text-white font-bold' : 'text-dark-muted hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              7-Day Task History ({taskHistory.length})
            </button>

            <button
              onClick={() => setActiveModSubtab('CREATE_TASK')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModSubtab === 'CREATE_TASK' ? 'bg-purple-600 text-white font-bold' : 'text-dark-muted hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Task
            </button>

            <button
              onClick={() => setActiveModSubtab('BACKEND')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModSubtab === 'BACKEND' ? 'bg-brand-500 text-white font-bold shadow-glow-orange-sm' : 'text-brand-400 hover:text-brand-300'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Backend Engine
            </button>
          </div>

          <button
            onClick={() => setShowSheetsModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Sheets Data
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PROOF REVIEW QUEUE */}
      {activeModSubtab === 'QUEUE' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">
              Pending Proof Review Queue ({pendingTasks.length})
            </h3>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-dark-card border border-dark-border space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Proof Queue Empty</h4>
              <p className="text-xs text-dark-muted">No pending user submissions waiting for moderator review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingTasks.map(t => (
                <div key={t.id} className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                        {t.subreddit} • {t.type}
                      </span>
                      <h4 className="text-sm font-extrabold text-white mt-1">{t.teaserText}</h4>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-dark-muted block">Reward</span>
                      <span className="text-lg font-extrabold text-emerald-400">${t.reward.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                      <span className="text-dark-muted font-bold block uppercase text-[10px]">Submitted Proof URL</span>
                      <a href={t.proofUrl} target="_blank" rel="noreferrer" className="text-brand-400 font-mono font-bold truncate block hover:underline flex items-center gap-1">
                        {t.proofUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                      <span className="text-dark-muted font-bold block uppercase text-[10px]">Target Reddit Post</span>
                      <a href={t.targetPostUrl} target="_blank" rel="noreferrer" className="text-cyan-400 font-mono font-bold truncate block hover:underline flex items-center gap-1">
                        {t.targetPostUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="Optional reject reason (e.g. comment deleted)..."
                      value={rejectReasonMap[t.id] || ''}
                      onChange={(e) => setRejectReasonMap({ ...rejectReasonMap, [t.id]: e.target.value })}
                      className="w-full sm:w-auto flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-purple-500"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => rejectSubmission(t.id, rejectReasonMap[t.id])}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/25 transition-all flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => approveSubmission(t.id, 'Approved by Moderator')}
                        className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-glow-green transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Credit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: 7-DAY TASK HISTORY LOG (AUTO-PURGE) */}
      {activeModSubtab === 'HISTORY' && (
        <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                7-Day Task History Log (Auto-Purge Daemon Active)
              </h3>
              <p className="text-xs text-dark-muted">
                Approved & rejected tasks remain in audit history for 7 days before being automatically purged from memory & database.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              7-Day Retention Active
            </span>
          </div>

          <div className="rounded-2xl border border-dark-border bg-dark-bg overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-dark-card border-b border-dark-border text-dark-muted font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Task ID</th>
                  <th className="py-3.5 px-4">Subreddit & Type</th>
                  <th className="py-3.5 px-4">Submitted Proof</th>
                  <th className="py-3.5 px-4">Reward</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Reviewed By</th>
                  <th className="py-3.5 px-4 text-right">Auto-Delete Countdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/60">
                {taskHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-dark-muted font-mono">
                      No completed task history records in 7-day retention log.
                    </td>
                  </tr>
                ) : (
                  taskHistory.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-dark-card/50 transition-colors">
                      <td className="py-3.5 px-4 text-brand-300 font-bold">{item.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-white block">{item.subreddit}</span>
                        <span className="text-[10px] text-dark-muted">{item.type}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <a href={item.proofUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline font-mono truncate max-w-xs block">
                          {item.proofUrl || 'No link'}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">${(item.reward || 1).toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] ${
                          item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-white font-semibold">{item.reviewedBy || 'Moderator'}</td>
                      <td className="py-3.5 px-4 text-right text-amber-300 font-extrabold">
                        {formatDaysLeft(item.expiresFromHistoryAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUBTAB 3: TASK CREATION SUITE */}
      {activeModSubtab === 'CREATE_TASK' && (
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-400" />
              Moderator Task Creation Suite
            </h3>
            <p className="text-xs text-dark-muted">
              Target URLs automatically detect the subreddit name (`r/sub`).
            </p>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Task Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTaskType('REDDIT_COMMENT');
                    setRewardInput(globalRates.commentRate);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    taskType === 'REDDIT_COMMENT'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-dark-bg text-dark-muted border-dark-border'
                  }`}
                >
                  Reddit Comment Task (${globalRates.commentRate.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTaskType('REDDIT_POST');
                    setRewardInput(globalRates.postRate);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    taskType === 'REDDIT_POST'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-dark-bg text-dark-muted border-dark-border'
                  }`}
                >
                  Reddit Post Task (${globalRates.postRate.toFixed(2)})
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-dark-light">Target Reddit URL</label>
                {subredditInput && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Wand2 className="w-3.5 h-3.5" /> Auto-Detected: {subredditInput}
                  </span>
                )}
              </div>
              <input
                type="url"
                required
                placeholder="https://www.reddit.com/r/technology/comments/..."
                value={targetPostUrlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Subreddit (e.g. r/technology)</label>
                <input
                  type="text"
                  required
                  placeholder="r/technology"
                  value={subredditInput}
                  onChange={(e) => setSubredditInput(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Reward Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.25"
                  required
                  value={rewardInput}
                  onChange={(e) => setRewardInput(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Public Pre-Claim Teaser Snippet</label>
              <input
                type="text"
                placeholder="Drop an insightful comment on web3 micro-tasks..."
                value={teaserTextInput}
                onChange={(e) => setTeaserTextInput(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Exact Required Copy Text</label>
              <textarea
                rows={3}
                required
                placeholder="The exact text user must copy and paste on Reddit..."
                value={contentToPostInput}
                onChange={(e) => setContentToPostInput(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-purple transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Publish Task to Live Marketplace
            </button>

          </form>
        </div>
      )}

      {/* SUBTAB 4: EMBEDDED BACKEND CONTROL CENTER */}
      {activeModSubtab === 'BACKEND' && (
        <BackendControlCenter />
      )}

      {/* Google Sheets Modal */}
      {showSheetsModal && (
        <GoogleSheetsPreviewModal onClose={() => setShowSheetsModal(false)} />
      )}

    </div>
  );
}
