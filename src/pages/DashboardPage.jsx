import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PreClaimModal from '../components/PreClaimModal';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Search, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage({ setActiveTab, onRequireAuth }) {
  const { 
    isAuthenticated,
    user, 
    tasks, 
    activeClaim, 
    claimTask, 
    formatAmount,
    theme 
  } = useApp();

  const isDark = theme === 'dark';

  const [selectedTaskForClaim, setSelectedTaskForClaim] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const approvedCount = tasks.filter(t => t.status === 'APPROVED').length;
  const pendingCount = tasks.filter(t => t.status === 'PENDING_APPROVAL').length;

  const filteredTasks = tasks.filter(t => {
    const isAvailableToMe = t.status === 'AVAILABLE' || (activeClaim && activeClaim.taskId === t.id);
    const matchesSearch = t.subreddit.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.teaserText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return isAvailableToMe && matchesSearch && matchesType;
  });

  const handleClaimClick = (task) => {
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (activeClaim) {
      alert("You already have an active claimed task! Complete or release it before claiming another.");
      return;
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

  const cardBgClass = isDark ? 'bg-[#121826] border-[#202B3F] shadow-md' : 'bg-white border-slate-200 shadow-sm';
  const textTitleClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBgClass = isDark ? 'bg-[#090D16] border-[#202B3F] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border flex items-center justify-between ${cardBgClass}`}>
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${textMutedClass}`}>Balance</span>
            <span className={`text-xl font-extrabold mt-0.5 block font-mono ${textTitleClass}`}>{formatAmount(user.balance)}</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${cardBgClass}`}>
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${textMutedClass}`}>Approved Tasks</span>
            <span className={`text-xl font-extrabold mt-0.5 block font-mono ${textTitleClass}`}>{approvedCount}</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${cardBgClass}`}>
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${textMutedClass}`}>Pending Review</span>
            <span className={`text-xl font-extrabold mt-0.5 block font-mono ${textTitleClass}`}>{pendingCount}</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => activeClaim && setActiveTab && setActiveTab('task')}
          className={`p-4 rounded-xl border shadow-sm flex items-center justify-between transition-smooth ${
            activeClaim 
              ? isDark ? 'bg-orange-500/10 border-orange-500/30 cursor-pointer' : 'bg-orange-50 border-orange-200 cursor-pointer' 
              : cardBgClass
          }`}
        >
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${textMutedClass}`}>Execution Status</span>
            <span className={`text-xs font-bold mt-0.5 block ${activeClaim ? 'text-orange-500' : textMutedClass}`}>
              {activeClaim ? '1 Active Claim' : '6h Timer Window'}
            </span>
          </div>
          <div className={`p-2.5 rounded-lg ${activeClaim ? 'bg-orange-500 text-white' : isDark ? 'bg-[#090D16] text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
            <Clock className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* SEARCH & FILTER BAR */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border ${cardBgClass}`}>
        <div>
          <h2 className={`text-base font-extrabold flex items-center gap-2 ${textTitleClass}`}>
            Task Marketplace
            <span className={`px-2 py-0.5 rounded-md border text-xs font-mono ${isDark ? 'bg-[#090D16] text-orange-400 border-[#202B3F]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {filteredTasks.length} Available
            </span>
          </h2>
          <p className={`text-xs mt-0.5 ${textMutedClass}`}>
            Claimed tasks are automatically hidden from other users. You receive 6 hours to submit proof.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-52">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
            <input
              type="text"
              placeholder="Search subreddit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:border-orange-500 ${inputBgClass}`}
            />
          </div>

          <div className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition-smooth ${typeFilter === 'ALL' ? isDark ? 'bg-[#121826] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' : textMutedClass}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('REDDIT_COMMENT')}
              className={`px-2.5 py-1 rounded-md transition-smooth ${typeFilter === 'REDDIT_COMMENT' ? isDark ? 'bg-[#121826] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' : textMutedClass}`}
            >
              Comments
            </button>
            <button
              onClick={() => setTypeFilter('REDDIT_POST')}
              className={`px-2.5 py-1 rounded-md transition-smooth ${typeFilter === 'REDDIT_POST' ? isDark ? 'bg-[#121826] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' : textMutedClass}`}
            >
              Posts
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className={`hidden md:block rounded-xl border overflow-hidden ${cardBgClass}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead className={`border-b text-slate-400 font-bold uppercase text-[10px] tracking-wider ${isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-50 border-slate-200'}`}>
            <tr>
              <th className="py-3 px-4">Task Type</th>
              <th className="py-3 px-4">Subreddit</th>
              <th className="py-3 px-4">Teaser Preview</th>
              <th className="py-3 px-4">Time Limit</th>
              <th className="py-3 px-4">Reward</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-[#202B3F]/60' : 'divide-slate-100'}`}>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <p className={`text-xs font-bold ${textTitleClass}`}>No Reddit Tasks Available in Marketplace</p>
                  <p className={`text-xs mt-1 ${textMutedClass}`}>Claimed tasks are automatically hidden from feed.</p>
                </td>
              </tr>
            ) : (
              filteredTasks.map(t => {
                const isClaimedByMe = activeClaim && activeClaim.taskId === t.id;
                const isAvailable = t.status === 'AVAILABLE';

                return (
                  <tr key={t.id} className={`transition-smooth ${isDark ? 'hover:bg-[#182032]' : 'hover:bg-slate-50/80'}`}>
                    
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase border ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {t.type === 'REDDIT_COMMENT' ? 'Comment' : 'Post'}
                      </span>
                    </td>

                    <td className={`py-3.5 px-4 font-bold font-mono ${textTitleClass}`}>
                      {t.subreddit}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className={`flex items-center gap-1.5 truncate italic ${textMutedClass}`}>
                        <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{t.teaserText}</span>
                      </div>
                    </td>

                    <td className={`py-3.5 px-4 font-mono ${textMutedClass}`}>
                      {t.timeLimitMins}m
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-500 font-mono text-sm">
                      {formatAmount(t.reward)}
                    </td>

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
                      {isClaimedByMe ? (
                        <button
                          onClick={() => setActiveTab && setActiveTab('task')}
                          className="px-3 py-1.5 rounded-lg bg-orange-500 text-white font-semibold text-xs inline-flex items-center gap-1 shadow-sm"
                        >
                          Workspace
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : isAvailable ? (
                        <button
                          onClick={() => handleClaimClick(t)}
                          className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-smooth shadow-sm"
                        >
                          Claim Task
                        </button>
                      ) : (
                        <span className={`text-xs italic ${textMutedClass}`}>Claimed</span>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
