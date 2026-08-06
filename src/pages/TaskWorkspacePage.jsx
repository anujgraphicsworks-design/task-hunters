import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Flame, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  Trash2,
  ArrowLeft,
  Folder
} from 'lucide-react';

export default function TaskWorkspacePage({ setActiveTab }) {
  const { 
    activeClaim, 
    tasks, 
    cancelClaim, 
    submitProof, 
    formatAmount,
    user 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [remainingMs, setRemainingMs] = useState(360 * 60 * 1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeTask = activeClaim ? tasks.find(t => t.id === activeClaim.taskId) : null;

  useEffect(() => {
    if (!activeClaim || !activeTask) return;

    const interval = setInterval(() => {
      const left = Math.max(0, activeClaim.expiresAt - Date.now());
      setRemainingMs(left);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeClaim, activeTask]);

  if (!activeClaim || !activeTask) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-dark-card border border-dark-border flex items-center justify-center mx-auto text-dark-muted">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-white">No Active Task Claim Locked</h2>
        <p className="text-xs text-dark-muted">
          You currently have no active claimed task. Visit the task marketplace to claim a Reddit task.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-glow-orange transition-all"
        >
          Go to Task Feed
        </button>
      </div>
    );
  }

  // Formatting Countdown (Hours : Mins : Secs)
  const totalMs = (activeTask.timeLimitMins || 360) * 60 * 1000;
  const progressPercent = (remainingMs / totalMs) * 100;
  const hours = Math.floor(remainingMs / (3600 * 1000));
  const mins = Math.floor((remainingMs % (3600 * 1000)) / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);
  const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isUrgent = hours === 0 && mins < 10;

  const handleCopyText = () => {
    navigator.clipboard.writeText(activeTask.contentToPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (!proofUrlInput.trim()) {
      alert("Please enter your live Reddit submission URL.");
      return;
    }

    setIsSubmitting(true);
    const success = submitProof(proofUrlInput.trim());
    setIsSubmitting(false);

    if (success) {
      alert("Proof submitted successfully! Your submission has been logged to Google Sheets and sent to Moderator Review.");
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-xs text-dark-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-brand-400" />
          Claim Locked ({activeTask.subreddit})
        </span>
      </div>

      {/* REAL-TIME COUNTDOWN TIMER WIDGET */}
      <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-all ${
        isUrgent ? 'bg-rose-500/10 border-rose-500/50 shadow-glow-orange' : 'bg-dark-card border-brand-500/40'
      }`}>
        
        {/* Horizontal Animated Progress Bar */}
        <div 
          className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${
            isUrgent ? 'bg-rose-500' : 'bg-brand-500'
          }`} 
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-brand-400 font-extrabold uppercase tracking-widest block">
              Active 6-Hour Task Execution Session
            </span>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {activeTask.subreddit} Reddit Task
              <span className="text-emerald-400 text-base font-extrabold">({formatAmount(activeTask.reward)})</span>
            </h2>
            <p className="text-xs text-dark-muted">
              Complete posting on Reddit and submit your proof link before the 6-hour countdown expires.
            </p>
          </div>

          {/* Large Digital Clock Ticker */}
          <div className="flex items-center gap-4 bg-dark-bg p-3.5 rounded-xl border border-dark-border">
            <div className="text-right">
              <span className="text-[10px] text-dark-muted font-bold uppercase tracking-wider block">Time Remaining</span>
              <span className={`font-mono text-3xl font-extrabold tracking-wider ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-brand-400'}`}>
                {timeStr}
              </span>
            </div>
            <Clock className={`w-8 h-8 ${isUrgent ? 'text-rose-400 animate-spin' : 'text-brand-500'}`} />
          </div>
        </div>

      </div>

      {/* STEP BY STEP UNLOCKED EXECUTION GUIDE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Direct Target & Copy Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Step 1: Direct Target Post URL */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
                Open Target Reddit Submission
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold">Unlocked</span>
            </div>

            <p className="text-xs text-dark-muted">
              Click below to navigate directly to the target thread in {activeTask.subreddit}.
            </p>

            <a
              href={activeTask.targetPostUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-dark-bg border border-dark-border text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center justify-between hover:border-cyan-500/40 transition-all group"
            >
              <span className="truncate max-w-md">{activeTask.targetPostUrl}</span>
              <ExternalLink className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Step 2: Copy Exact Reddit Text */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
                Copy Required Reddit Content
              </h3>
              
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : '1-Click Copy'}
              </button>
            </div>

            <p className="text-xs text-dark-muted">
              Paste this exact text into your Reddit comment or post without altering wording.
            </p>

            <div className="p-4 rounded-xl bg-dark-bg border border-dark-border font-mono text-xs text-brand-100 leading-relaxed relative select-all">
              {activeTask.contentToPost}
            </div>

            {activeTask.driveLink && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-amber-400" /> Task Images & Attachments (Google Drive)
                  </span>
                  <a
                    href={activeTask.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Google Drive Images
                  </a>
                </div>
                <p className="text-[11px] text-amber-200/80 font-medium">
                  Use the images/media from this Google Drive folder when completing your post task.
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Submit Live Proof Link Form */}
          <form onSubmit={handleSubmitProof} className="p-6 rounded-2xl bg-dark-card border border-brand-500/30 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
              Submit Live Reddit Proof Link
            </h3>

            <p className="text-xs text-dark-muted">
              Paste your live Reddit comment or post permalink (e.g. <code className="text-brand-300">https://www.reddit.com/r/.../comment/xyz</code>).
            </p>

            {user?.activeRedditAccount && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs">
                <span className="text-dark-muted text-[11px]">Submitting with Reddit ID:</span>
                <span className="font-mono font-extrabold text-orange-400">{user.activeRedditAccount}</span>
              </div>
            )}

            <div className="space-y-2">
              <input
                type="url"
                required
                placeholder="https://www.reddit.com/r/technology/comments/..."
                value={proofUrlInput}
                onChange={(e) => setProofUrlInput(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 font-mono transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to abandon this task? It will revert back to the public pool and start a 4-hour cooldown for your active Reddit account.")) {
                    cancelClaim(activeTask.id);
                    setActiveTab('dashboard');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Abandon Task
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-glow-orange transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Logging to Sheets...' : 'Submit Proof & Log to Google Sheets'}
              </button>
            </div>
          </form>

        </div>

        {/* Right Column: Platform Guidelines */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Task Execution Guidelines
            </h4>

            <ul className="space-y-3 text-xs text-dark-muted">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Reddit account must be <strong>at least 30 days old</strong> with positive karma.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Comment must remain live. Removed or deleted comments will be rejected during moderation.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Do not modify or alter the provided text copy.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Submissions are automatically synced to Google Sheets v4 API for audit trails.</span>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              Failing to submit within 6 hours will release your lock automatically back to the marketplace.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
