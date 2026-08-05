import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Clock, Lock, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

export default function PreClaimModal({ task, onClose, onConfirmClaim }) {
  const { formatAmount } = useApp();

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-dark-card border border-brand-500/40 shadow-2xl p-6 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-dark-muted hover:text-white hover:bg-dark-cardHover transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/40 text-xs font-bold flex items-center gap-1.5 shadow-glow-orange-sm">
              <Clock className="w-3.5 h-3.5" />
              6-Hour Task Execution Window
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
              {task.subreddit}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            Claim Task & Start 6-Hour Countdown
          </h3>
          <p className="text-xs text-dark-muted">
            Accept this task to reveal the target Reddit link and copyable text.
          </p>
        </div>

        {/* Task Teaser & Details */}
        <div className="p-4 rounded-2xl bg-dark-bg border border-dark-border space-y-4 mb-6">
          
          <div className="flex items-center justify-between border-b border-dark-border/80 pb-3">
            <div>
              <span className="text-[10px] text-dark-muted font-bold uppercase tracking-wider block">Task Type</span>
              <span className="text-xs font-extrabold text-white">{task.type}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-dark-muted font-bold uppercase tracking-wider block">Reward</span>
              <span className="text-lg font-extrabold text-emerald-400">{formatAmount(task.reward)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-dark-muted font-bold uppercase tracking-wider block">Public Snippet Teaser</span>
            <p className="text-xs text-dark-light font-semibold italic">"{task.teaserText}"</p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <Clock className="w-4 h-4 shrink-0 text-amber-400" />
            <div>
              <span className="font-extrabold block">6-Hour Completion Rule:</span>
              <span>You get exactly 6 Hours (360 mins) to submit proof. If 6 hours pass without proof or if abandoned, the task automatically reverts to the pool for other hunters!</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl bg-dark-bg hover:bg-dark-cardHover border border-dark-border text-dark-muted hover:text-white font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirmClaim(task.id);
              onClose();
            }}
            className="w-2/3 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-orange transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4" />
            Accept Task & Start 6h Timer
          </button>
        </div>

      </div>
    </div>
  );
}
