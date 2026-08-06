import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useApp } from '../context/AppContext';
import GoogleSheetsPreviewModal from './GoogleSheetsPreviewModal';
import SubmitRedditModal from './SubmitRedditModal';
import { 
  Wallet, 
  UserCheck, 
  Settings, 
  FileSpreadsheet, 
  LogIn, 
  LogOut, 
  LayoutGrid, 
  User,
  Server,
  Radio,
  Clock,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenAuth }) {
  const { 
    isAuthenticated,
    user, 
    logoutUser,
    currency, 
    setCurrency, 
    formatAmount, 
    activeClaim,
    isBackendOnline,
    backendLatency,
    theme,
    toggleTheme
  } = useApp();

  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [showRedditModal, setShowRedditModal] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState('');

  useEffect(() => {
    if (!activeClaim) return;
    const interval = setInterval(() => {
      const remainingMs = Math.max(0, new Date(activeClaim.expiresAt || activeClaim.claimedAt).getTime() + (360 * 60 * 1000) - Date.now());
      const hours = Math.floor(remainingMs / 3600000);
      const mins = Math.floor((remainingMs % 3600000) / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);

      if (hours > 0) {
        setTimeLeftStr(`${hours}h ${mins.toString().padStart(2, '0')}m`);
      } else {
        setTimeLeftStr(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeClaim]);

  const shouldShowBalance = isAuthenticated && (activeTab === 'dashboard' || activeTab === 'wallet' || activeTab === 'task');

  const isDark = theme === 'dark';

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-colors border-b ${
        isDark ? 'bg-[#0A0D14]/90 backdrop-blur-md border-slate-800' : 'glass-header border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Main Nav */}
            <div className="flex items-center gap-6">
              <div onClick={() => setActiveTab('landing')} className="cursor-pointer">
                <Logo />
              </div>

              {/* Nav Pills */}
              <nav className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth ${
                    activeTab === 'dashboard'
                      ? isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-900 text-white shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Task Feed
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth flex items-center gap-1.5 ${
                      activeTab === 'wallet'
                        ? isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-900 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    Wallet
                  </button>
                )}

                {/* MODERATOR & ADMIN ONLY TABS */}
                {isAuthenticated && (user.role === 'MODERATOR' || user.role === 'ADMIN') && (
                  <button
                    onClick={() => setActiveTab('mod')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth flex items-center gap-1.5 ${
                      activeTab === 'mod'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : isDark ? 'text-purple-400 bg-purple-500/10 border border-purple-500/30' : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Mod Queue
                  </button>
                )}

                {isAuthenticated && (user.role === 'MODERATOR' || user.role === 'ADMIN') && (
                  <button
                    onClick={() => setActiveTab('backend')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-smooth flex items-center gap-1.5 ${
                      activeTab === 'backend'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : isDark ? 'text-orange-400 bg-orange-500/10 border border-orange-500/30' : 'text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5" />
                    Backend Hub (AI & Tools)
                  </button>
                )}

                {isAuthenticated && user.role === 'ADMIN' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth flex items-center gap-1.5 ${
                      activeTab === 'admin'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : isDark ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Admin Suite
                  </button>
                )}
              </nav>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              
              {/* DUAL DARK / LIGHT MODE TOGGLE BUTTON */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                className={`p-2 rounded-lg border transition-smooth flex items-center gap-1 text-xs font-semibold ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              {/* API Status Dot */}
              {isAuthenticated && (user.role === 'MODERATOR' || user.role === 'ADMIN') && (
                <div 
                  title={isBackendOnline ? `Express Server Active (Latency: ${backendLatency}ms)` : 'Offline Fallback Active'}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <Radio className={`w-3 h-3 ${isBackendOnline ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`} />
                  <span>{isBackendOnline ? `${backendLatency}ms` : 'Offline'}</span>
                </div>
              )}

              {/* Task Claim Timer */}
              {isAuthenticated && activeClaim && (
                <div 
                  onClick={() => setActiveTab('task')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-mono font-semibold cursor-pointer hover:bg-orange-600 transition-smooth shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeftStr || 'Active Task'}</span>
                </div>
              )}

              {/* Google Sheets Data Drawer */}
              {isAuthenticated && (user.role === 'MODERATOR' || user.role === 'ADMIN') && (
                <button
                  onClick={() => setShowSheetsModal(true)}
                  title="Open Admin Google Sheets Data Logs"
                  className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-emerald-600 hover:bg-emerald-500/10 transition-smooth flex items-center gap-1.5 text-xs font-semibold ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Sheets</span>
                </button>
              )}

              {/* Currency Toggle */}
              {isAuthenticated && (
                <div className={`hidden sm:flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 rounded-md transition-smooth ${
                      currency === 'USD' 
                        ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    $
                  </button>
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2 py-0.5 rounded-md transition-smooth ${
                      currency === 'INR' 
                        ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    ₹
                  </button>
                </div>
              )}

              {/* Reddit Verification Status */}
              {isAuthenticated && (
                <div
                  onClick={() => setShowRedditModal(true)}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold cursor-pointer transition-smooth ${
                    user.isRedditApproved || user.role === 'ADMIN' || user.role === 'MODERATOR'
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{user.activeRedditAccount || user.redditUsername || 'Submit Reddit ID'}</span>
                </div>
              )}

              {/* Balance Badge */}
              {shouldShowBalance && (
                <div 
                  onClick={() => setActiveTab('wallet')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer transition-smooth shadow-sm ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="text-xs text-slate-400 font-medium">Balance:</span>
                  <span className="text-xs font-bold text-emerald-500 font-mono">{formatAmount(user.balance)}</span>
                </div>
              )}

              {/* User Profile */}
              {isAuthenticated && (
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold shadow-sm ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[90px]">{user.name || user.email.split('@')[0]}</span>
                </div>
              )}

              {/* Auth Action Button */}
              {!isAuthenticated ? (
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-smooth flex items-center gap-1.5 shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              ) : (
                <button
                  onClick={logoutUser}
                  title="Sign Out"
                  className={`p-1.5 rounded-lg border transition-smooth shadow-sm ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-4 py-2 flex items-center justify-around shadow-lg ${
        isDark ? 'bg-[#0A0D14]/95 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeTab === 'dashboard' ? 'text-orange-500' : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Feed
        </button>

        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
              activeTab === 'wallet' ? 'text-orange-500' : 'text-slate-400'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Wallet
          </button>
        )}

        {isAuthenticated && (user.role === 'MODERATOR' || user.role === 'ADMIN') && (
          <button
            onClick={() => setActiveTab('backend')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
              activeTab === 'backend' ? 'text-orange-500' : 'text-slate-400'
            }`}
          >
            <Server className="w-4 h-4" />
            Backend
          </button>
        )}

        {!isAuthenticated ? (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center gap-1 text-[11px] font-semibold text-orange-500"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        ) : (
          <button
            onClick={logoutUser}
            className="flex flex-col items-center gap-1 text-[11px] font-semibold text-rose-500"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
      </div>

      {showSheetsModal && (
        <GoogleSheetsPreviewModal onClose={() => setShowSheetsModal(false)} />
      )}

      {showRedditModal && (
        <SubmitRedditModal isOpen={showRedditModal} onClose={() => setShowRedditModal(false)} />
      )}
    </>
  );
}
