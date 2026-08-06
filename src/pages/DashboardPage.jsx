import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PreClaimModal from '../components/PreClaimModal';
import RedditAccountSwitcher from '../components/RedditAccountSwitcher';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Search, 
  Lock,
  ArrowRight,
  MessageSquare,
  FileText,
  Timer,
  AlertCircle
} from 'lucide-react';

// Live cooldown countdown hook
function useCooldownTimer(claimCooldownUntil) {
  const [remaining, setRemaining] = useState(() => Math.max(0, claimCooldownUntil - Date.now()));

  useEffect(() => {
    if (!claimCooldownUntil || Date.now() >= claimCooldownUntil) {
      setRemaining(0);
      return;
    }
    const interval = setInterval(() => {
      const left = Math.max(0, claimCooldownUntil - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [claimCooldownUntil]);

  return remaining;
}

function formatCountdown(ms) {
  if (ms <= 0) return null;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

export default function DashboardPage({ setActiveTab, onRequireAuth }) {
  const { 
    isAuthenticated,
    user, 
    tasks, 
    activeClaim, 
    claimTask, 
    formatAmount,
    theme,
    claimCooldownUntil
  } = useApp();

  const isDark = theme === 'dark';
  const cooldownRemaining = useCooldownTimer(claimCooldownUntil || 0);
  const isOnCooldown = cooldownRemaining > 0;
  const cooldownStr = formatCountdown(cooldownRemaining);

  const [selectedTaskForClaim, setSelectedTaskForClaim] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const approvedCount = tasks.filter(t => t.status === 'APPROVED').length;
  const pendingCount = tasks.filter(t => t.status === 'PENDING_APPROVAL').length;

  const filteredTasks = tasks.filter(t => {
    const isAvailableToMe = t.status === 'AVAILABLE' || (activeClaim && activeClaim.taskId === t.id);
    const matchesSearch = t.subreddit.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.teaserText || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type.startsWith(typeFilter);
    return isAvailableToMe && matchesSearch && matchesType;
  });

  const handleClaimClick = (task) => {
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (activeClaim) {
      return; // Already has active claim
    }
    setSelectedTaskForClaim(task);
  };

  const confirmClaim = (targetTaskId) => {
    const idToClaim = targetTaskId || (selectedTaskForClaim && selectedTaskForClaim.id);
    if (idToClaim) {
      claimTask(idToClaim);
      setSelectedTaskForClaim(null);
      if (setActiveTab) setActiveTab('task');
    }
  };

  const cardBg = isDark ? 'bg-[#121826] border-[#202B3F]' : 'bg-white border-slate-200 shadow-sm';
  const subBg = isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-50 border-slate-200';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-[#090D16] border-[#202B3F] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';
  const rowHover = isDark ? 'hover:bg-[#182032]' : 'hover:bg-slate-50/80';
  const divider = isDark ? 'divide-[#202B3F]/60' : 'divide-slate-100';
  const theadBg = isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-50 border-slate-200';

  const getTypeLabel = (type) => {
    if (type === 'REDDIT_COMMENT') return { label: 'Comment', icon: <MessageSquare className="w-3 h-3" /> };
    if (type === 'REDDIT_POST_WITH_COMMENT') return { label: 'Post+Comment', icon: <FileText className="w-3 h-3" /> };
    return { label: 'Post', icon: <FileText className="w-3 h-3" /> };
  };

  // Claim action button component (reused in both table and mobile cards)
  const ClaimButton = ({ task }) => {
    const isClaimedByMe = activeClaim && activeClaim.taskId === task.id;
    const isAvailable = task.status === 'AVAILABLE';

    if (isClaimedByMe) {
      return (
        <button
          onClick={() => setActiveTab && setActiveTab('task')}
          className="px-3 py-1.5 rounded-lg bg-orange-500 text-white font-semibold text-xs inline-flex items-center gap-1 shadow-sm"
        >
          Workspace <ArrowRight className="w-3 h-3" />
        </button>
      );
    }

    if (!isAvailable) {
      return <span className={`text-xs italic ${textMuted}`}>Claimed</span>;
    }

    if (isOnCooldown) {
      return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${
          isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
        }`}>
          <Timer className="w-3 h-3 shrink-0" />
          {cooldownStr}
        </div>
      );
    }

    if (activeClaim) {
      return (
        <span className={`text-xs italic ${textMuted}`}>Task Active</span>
      );
    }

    return (
      <button
        onClick={() => handleClaimClick(task)}
        className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs transition-all shadow-sm"
      >
        Claim Task
      </button>
    );
  };

  return (
    <div className="space-y-5 pb-12 animate-fadeIn">
      
      {/* STATS ROW — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className={`p-4 rounded-xl border flex items-center justify-between ${cardBg}`}>
          <div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider block ${textMuted}`}>Balance</span>
            <span className={`text-lg font-extrabold mt-0.5 block font-mono ${textTitle}`}>{formatAmount(user.balance)}</span>
          </div>
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${cardBg}`}>
          <div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider block ${textMuted}`}>Approved</span>
            <span className={`text-lg font-extrabold mt-0.5 block font-mono ${textTitle}`}>{approvedCount}</span>
          </div>
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${cardBg}`}>
          <div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider block ${textMuted}`}>Pending</span>
            <span className={`text-lg font-extrabold mt-0.5 block font-mono ${textTitle}`}>{pendingCount}</span>
          </div>
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Status card — cooldown or active claim */}
        <div 
          onClick={() => activeClaim && setActiveTab && setActiveTab('task')}
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            isOnCooldown
              ? isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
              : activeClaim 
                ? isDark ? 'bg-orange-500/10 border-orange-500/30 cursor-pointer' : 'bg-orange-50 border-orange-200 cursor-pointer'
                : cardBg
          }`}
        >
          <div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider block ${textMuted}`}>
              {isOnCooldown ? 'Next Claim In' : 'Status'}
            </span>
            <span className={`text-xs font-bold mt-0.5 block font-mono ${
              isOnCooldown ? 'text-amber-500' : activeClaim ? 'text-orange-500' : textMuted
            }`}>
              {isOnCooldown ? cooldownStr : activeClaim ? 'Active Claim' : 'Ready'}
            </span>
          </div>
          <div className={`p-2 rounded-lg ${
            isOnCooldown ? 'bg-amber-500 text-white' : activeClaim ? 'bg-orange-500 text-white' : isDark ? 'bg-[#090D16] text-slate-500' : 'bg-slate-100 text-slate-400'
          }`}>
            {isOnCooldown ? <Timer className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
        </div>

      </div>

      {/* Reddit Account Selector Widget */}
      {isAuthenticated && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${textMuted}`}>Active Reddit Account & Cooldown Manager</span>
          </div>
          <RedditAccountSwitcher />
        </div>
      )}

      {/* Cooldown Banner */}
      {isOnCooldown && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              Claim Cooldown Active — Next task in <span className="font-mono">{cooldownStr}</span>
            </p>
            <p className={`text-[10px] ${textMuted}`}>
              Cooldown is per Reddit account. Switch to another connected Reddit account above to claim a task immediately! You can claim new tasks once your timer finishes even if past tasks are pending review.
            </p>
          </div>
        </div>
      )}

      {/* SEARCH & FILTER BAR */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border ${cardBg}`}>
        <div>
          <h2 className={`text-sm font-extrabold flex items-center gap-2 ${textTitle}`}>
            Task Marketplace
            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono ${isDark ? 'bg-[#090D16] text-orange-400 border-[#202B3F]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {filteredTasks.length} Available
            </span>
          </h2>
          <p className={`text-[10px] mt-0.5 ${textMuted}`}>
            Claim a task to get started. 4-hour cooldown applies between tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-44">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:border-orange-500 border ${inputBg}`}
            />
          </div>

          <div className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-100 border-slate-200'}`}>
            {[['ALL', 'All'], ['REDDIT_COMMENT', 'Comments'], ['REDDIT_POST', 'Posts']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTypeFilter(val)}
                className={`px-2.5 py-1 rounded-md transition-all ${typeFilter === val ? isDark ? 'bg-[#121826] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' : textMuted}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====== DESKTOP TABLE VIEW ====== */}
      <div className={`hidden md:block rounded-xl border overflow-hidden ${cardBg}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead className={`border-b text-slate-400 font-bold uppercase text-[10px] tracking-wider ${theadBg}`}>
            <tr>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Subreddit</th>
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Limit</th>
              <th className="py-3 px-4">Reward</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${divider}`}>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <p className={`text-xs font-bold ${textTitle}`}>No Tasks Available</p>
                  <p className={`text-xs mt-1 ${textMuted}`}>Claimed tasks are hidden from feed.</p>
                </td>
              </tr>
            ) : (
              filteredTasks.map(t => {
                const typeInfo = getTypeLabel(t.type);
                return (
                  <tr key={t.id} className={`transition-all ${rowHover}`}>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase border flex items-center gap-1 w-fit ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {typeInfo.icon}{typeInfo.label}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 font-bold font-mono ${textTitle}`}>{t.subreddit}</td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className={`flex items-center gap-1.5 truncate italic ${textMuted}`}>
                        <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{t.teaserText}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${textMuted}`}>{t.timeLimitMins}m</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-500 font-mono text-sm">{formatAmount(t.reward)}</td>
                    <td className="py-3.5 px-4">
                      {t.status === 'AVAILABLE' && (
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                          Available
                        </span>
                      )}
                      {t.status === 'CLAIMED' && (
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                          Claimed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <ClaimButton task={t} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ====== MOBILE CARD VIEW ====== */}
      <div className="md:hidden space-y-2">
        {filteredTasks.length === 0 ? (
          <div className={`rounded-xl border p-8 text-center ${cardBg}`}>
            <p className={`text-sm font-bold ${textTitle}`}>No Tasks Available</p>
            <p className={`text-xs mt-1 ${textMuted}`}>Check back soon for new tasks.</p>
          </div>
        ) : (
          filteredTasks.map(t => {
            const typeInfo = getTypeLabel(t.type);
            const isClaimedByMe = activeClaim && activeClaim.taskId === t.id;
            return (
              <div
                key={t.id}
                className={`rounded-xl border overflow-hidden ${cardBg} ${isClaimedByMe ? isDark ? 'border-orange-500/40' : 'border-orange-300' : ''}`}
              >
                {/* Orange left stripe for claimed */}
                <div className={`flex items-stretch`}>
                  {isClaimedByMe && (
                    <div className="w-1 bg-orange-500 shrink-0 rounded-l-xl" />
                  )}
                  <div className="flex-1 p-3 space-y-2">
                    {/* Top row: type badge + subreddit + reward */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase border flex items-center gap-1 shrink-0 ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {typeInfo.icon}{typeInfo.label}
                        </span>
                        <span className={`font-bold font-mono text-sm truncate ${textTitle}`}>{t.subreddit}</span>
                      </div>
                      <span className="font-extrabold text-emerald-500 font-mono text-sm shrink-0">{formatAmount(t.reward)}</span>
                    </div>

                    {/* Teaser row */}
                    <div className={`flex items-start gap-1.5 text-xs italic ${textMuted}`}>
                      <Lock className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{t.teaserText}</span>
                    </div>

                    {/* Bottom row: limit + action */}
                    <div className="flex items-center justify-between pt-1 border-t border-dashed border-opacity-30" style={{borderColor: isDark ? '#202B3F' : '#e2e8f0'}}>
                      <span className={`text-[10px] font-mono ${textMuted}`}>⏱ {t.timeLimitMins}m window</span>
                      <ClaimButton task={t} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedTaskForClaim && (
        <PreClaimModal
          task={selectedTaskForClaim}
          onClose={() => setSelectedTaskForClaim(null)}
          onConfirmClaim={confirmClaim}
        />
      )}

    </div>
  );
}
