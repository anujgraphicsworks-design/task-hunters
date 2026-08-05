import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle2, Clock, X, Send, Lock, Trash2, Plus } from 'lucide-react';

export default function SubmitRedditModal({ isOpen, onClose }) {
  const { user, submitRedditUsername, deleteRedditUsername } = useApp();
  const [redditInput, setRedditInput] = useState('');
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
    setRedditInput('');
    setIsSubmitting(false);
  };

  const accounts = user.redditAccounts || (user.redditUsername ? [{ username: user.redditUsername, isApproved: user.isRedditApproved }] : []);

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
              Reddit ID Manager
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            Connect Reddit Accounts
          </h3>
          <p className="text-xs text-dark-muted leading-relaxed">
            Submit any number of Reddit usernames you own. An Admin or Moderator will review and approve each account for claiming tasks.
          </p>
        </div>

        {/* List of currently connected accounts */}
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-dark-light uppercase tracking-wider">Connected Accounts ({accounts.length})</h4>
          {accounts.length === 0 ? (
            <p className="text-xs text-dark-muted italic">No Reddit accounts connected yet.</p>
          ) : (
            accounts.map((acc, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border"
              >
                <div className="flex items-center gap-2">
                  {acc.isApproved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  )}
                  <span className="text-xs font-mono font-bold text-white">{acc.username}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    acc.isApproved 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {acc.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <button
                  onClick={() => deleteRedditUsername(acc.username)}
                  className="p-1 text-dark-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Form to add a new account */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-dark-border">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-light">Add Reddit Username (e.g. u/JohnDoe)</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="u/username"
                value={redditInput}
                onChange={(e) => setRedditInput(e.target.value)}
                className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 font-mono"
              />
              <button
                type="submit"
                disabled={isSubmitting || !redditInput.trim()}
                className="px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-orange transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-dark-bg hover:bg-dark-cardHover border border-dark-border text-dark-muted hover:text-white font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
