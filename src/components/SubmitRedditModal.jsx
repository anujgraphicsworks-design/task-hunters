import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle2, Clock, X, Send, Lock } from 'lucide-react';

export default function SubmitRedditModal({ isOpen, onClose }) {
  const { user, submitRedditUsername } = useApp();
  const [redditInput, setRedditInput] = useState(user.redditUsername || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!redditInput.trim()) return;

    setIsSubmitting(true);
    let formatted = redditInput.trim();
    if (!formatted.startsWith('u/')) {
      formatted = `u/${formatted.replace(/^@/, '')}`;
    }

    submitRedditUsername(formatted);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-dark-card border border-brand-500/40 shadow-2xl p-6 overflow-hidden space-y-6">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-dark-muted hover:text-white hover:bg-dark-cardHover transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/40 text-xs font-bold flex items-center gap-1.5 shadow-glow-orange-sm">
              <Lock className="w-3.5 h-3.5" />
              Reddit ID Verification Required
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            Connect & Submit Reddit ID
          </h3>
          <p className="text-xs text-dark-muted leading-relaxed">
            To prevent bot spam, all microtaskers must submit a valid Reddit Username. An Admin or Moderator will review and approve your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-light">Your Reddit Username (e.g. u/JohnDoe)</label>
            <input
              type="text"
              required
              placeholder="u/your_reddit_username"
              value={redditInput}
              onChange={(e) => setRedditInput(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          {user.redditUsername && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              user.isRedditApproved 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}>
              {user.isRedditApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your Reddit ID (<strong>{user.redditUsername}</strong>) is APPROVED!</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  <span>Current Status: Submitted (<strong>{user.redditUsername}</strong>) - Pending Moderator Approval.</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-dark-bg hover:bg-dark-cardHover border border-dark-border text-dark-muted hover:text-white font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-orange transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              {user.redditUsername ? 'Update & Resubmit ID' : 'Submit ID for Approval'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
