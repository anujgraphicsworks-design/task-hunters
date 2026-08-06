import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Discord SVG logo
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export default function DiscordGateModal() {
  const { user, submitDiscordUsername, theme } = useApp();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate Discord username: letters, numbers, underscores, dots — 2-32 chars
  const validate = (val) => {
    const clean = val.trim();
    if (!clean) return 'Please enter your Discord username.';
    if (clean.length < 2) return 'Username must be at least 2 characters.';
    if (clean.length > 32) return 'Username must be 32 characters or less.';
    // Accept new Discord usernames (no #discriminator) or legacy format
    if (!/^[a-zA-Z0-9_.]{2,32}$/.test(clean)) {
      return 'Only letters, numbers, underscores, and dots are allowed.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(input);
    if (err) { setError(err); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await submitDiscordUsername(input.trim());
      setSuccess(true);
    } catch (e) {
      setError('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Full-screen overlay — no close button, pointer events block everything */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: isDark ? 'rgba(5,7,14,0.92)' : 'rgba(248,248,252,0.90)' }}>
      
      {/* Card */}
      <div className={`w-full max-w-sm rounded-2xl border overflow-hidden shadow-2xl animate-scaleIn ${isDark ? 'bg-[#121826] border-[#202B3F]' : 'bg-white border-slate-200'}`}>
        
        {/* Top purple discord stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />

        <div className="p-7 space-y-5">
          
          {/* Icon + Title */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg text-white">
              <DiscordIcon />
            </div>
            <div>
              <h2 className={`text-lg font-extrabold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                One More Step
              </h2>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Hi <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name || user.email}</span>!<br />
                Please link your Discord username to continue.<br />
                This lets us contact you about tasks and payouts.
              </p>
            </div>
          </div>

          {/* Success state */}
          {success ? (
            <div className={`flex flex-col items-center gap-3 py-4 rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg">✓</div>
              <div className="text-center">
                <p className={`text-sm font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Discord Linked!</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading your dashboard…</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Input */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Discord Username
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold select-none pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>@</span>
                  <input
                    type="text"
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="yourusername"
                    value={input}
                    onChange={e => { setInput(e.target.value); if (error) setError(''); }}
                    className={`w-full rounded-xl pl-7 pr-4 py-2.5 text-sm font-medium focus:outline-none border transition-colors ${
                      error
                        ? isDark ? 'bg-[#090D16] border-rose-500 text-white' : 'bg-slate-50 border-rose-400 text-slate-900'
                        : isDark ? 'bg-[#090D16] border-[#202B3F] text-white placeholder-slate-600 focus:border-violet-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500'
                    }`}
                    maxLength={32}
                  />
                </div>
                {error && (
                  <p className="text-[11px] text-rose-400 font-medium">{error}</p>
                )}
                <p className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  New format: username (no # tag needed) · e.g. <span className="font-mono">coolhunter99</span>
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !input.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                ) : (
                  <><DiscordIcon />Continue to Platform</>
                )}
              </button>

            </form>
          )}

          {/* Footer note */}
          <p className={`text-center text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            This field is required for all Task Hunters members.
          </p>
        </div>
      </div>
    </div>
  );
}
