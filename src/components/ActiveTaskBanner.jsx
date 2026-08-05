import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Flame, ArrowRight, AlertTriangle } from 'lucide-react';

export default function ActiveTaskBanner({ onOpenWorkspace }) {
  const { activeClaim, tasks, formatAmount } = useApp();
  const [minsSecs, setMinsSecs] = useState('15:00');
  const [progressPercent, setProgressPercent] = useState(100);

  const activeTask = activeClaim ? tasks.find(t => t.id === activeClaim.taskId) : null;

  useEffect(() => {
    if (!activeClaim || !activeTask) return;

    const totalMs = activeTask.timeLimitMins * 60 * 1000;

    const interval = setInterval(() => {
      const remainingMs = Math.max(0, activeClaim.expiresAt - Date.now());
      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      
      setMinsSecs(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      setProgressPercent((remainingMs / totalMs) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeClaim, activeTask]);

  if (!activeClaim || !activeTask) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl">
      <div className="glass-panel-orange p-4 rounded-2xl shadow-glow-orange flex items-center justify-between border border-brand-500/40 relative overflow-hidden backdrop-blur-xl bg-dark-card/95">
        
        {/* Progress bar line */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-brand-500 transition-all duration-1000 ease-linear" 
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-brand-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-brand-500 text-white font-extrabold text-[10px] uppercase">
                {activeTask.subreddit}
              </span>
              <span className="text-xs text-dark-muted font-medium">Claim Locked</span>
            </div>
            <p className="text-xs font-semibold text-white truncate max-w-xs mt-0.5">
              Reward: <span className="text-emerald-400 font-bold">{formatAmount(activeTask.reward)}</span> • Submit proof before expiration!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-brand-300 font-bold uppercase tracking-wider block">Time Left</span>
            <span className="font-mono text-base font-extrabold text-white">{minsSecs}</span>
          </div>

          <button
            onClick={onOpenWorkspace}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-orange-sm transition-all hover:scale-105"
          >
            Execute Task
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
