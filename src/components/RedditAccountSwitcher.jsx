import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Plus, Trash2, CheckCircle2, Clock, ChevronDown, ShieldCheck } from 'lucide-react';

export default function RedditAccountSwitcher() {
  const { 
    user, 
    submitRedditUsername, 
    deleteRedditUsername, 
    switchActiveRedditAccount,
    accountCooldowns,
    theme 
  } = useApp();

  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [newAccountInput, setNewAccountInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Normalize reddit accounts list
  const rawAccounts = user.redditAccounts || [];
  const accountsList = rawAccounts.map(acc => {
    if (typeof acc === 'string') {
      return { username: acc.startsWith('u/') ? acc : `u/${acc}`, isApproved: true };
    }
    return {
      username: acc.username.startsWith('u/') ? acc.username : `u/${acc.username}`,
      isApproved: acc.isApproved
    };
  });

  // Active account handle
  const activeHandle = user.activeRedditAccount || user.redditUsername || (accountsList[0]?.username || '');

  const formatCountdown = (ms) => {
    if (ms <= 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newAccountInput.trim()) return;
    submitRedditUsername(newAccountInput.trim());
    setNewAccountInput('');
    setIsAdding(false);
  };

  const card = isDark ? 'bg-[#121826] border-[#202B3F]' : 'bg-white border-slate-200 shadow-sm';
  const sub = isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-50 border-slate-200';
  const inp = isDark ? 'bg-[#090D16] border-[#202B3F] text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';
  const tt = isDark ? 'text-white' : 'text-slate-900';
  const tm = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="relative">
      
      {/* Active Account Pill / Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:border-orange-500/50 ${card}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold shrink-0">
            r/
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-extrabold font-mono truncate ${tt}`}>
                {activeHandle || 'No Reddit Account Linked'}
              </span>
              {activeHandle && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  Active
                </span>
              )}
            </div>
            <p className={`text-[10px] ${tm}`}>
              {accountsList.length} linked account{accountsList.length !== 1 ? 's' : ''} (4h cooldown per account)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-orange-400' : tm}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border p-3 shadow-2xl space-y-3 animate-scaleIn ${card}`}>
          
          <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${tm}`}>Select Active Reddit ID</span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Account
            </button>
          </div>

          {/* Inline Add Account Form */}
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="e.g. u/my_reddit_handle"
                value={newAccountInput}
                onChange={e => setNewAccountInput(e.target.value)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs border ${inp}`}
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shrink-0"
              >
                Add
              </button>
            </form>
          )}

          {/* Account List */}
          {accountsList.length === 0 ? (
            <p className={`text-xs italic text-center py-2 ${tm}`}>No Reddit accounts connected yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {accountsList.map(acc => {
                const isCurrent = acc.username.toLowerCase() === activeHandle.toLowerCase();
                const cooldownMs = Math.max(0, (accountCooldowns[acc.username] || 0) - Date.now());
                const cooldownStr = formatCountdown(cooldownMs);

                return (
                  <div
                    key={acc.username}
                    onClick={() => {
                      switchActiveRedditAccount(acc.username);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isCurrent
                        ? isDark ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'
                        : `${sub} hover:border-slate-500/40`
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-orange-500' : 'bg-slate-500'}`} />
                      <span className="font-mono font-bold truncate">{acc.username}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cooldownMs > 0 ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3" /> {cooldownStr}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Ready
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove ${acc.username}?`)) {
                            deleteRedditUsername(acc.username);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className={`text-[10px] italic text-center ${tm}`}>
            💡 Switch accounts to bypass account-level cooldown. All earnings merge into your single wallet balance!
          </p>

        </div>
      )}

    </div>
  );
}
