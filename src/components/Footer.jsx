import React from 'react';
import Logo from './Logo';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <footer className={`w-full border-t mt-20 py-10 transition-colors ${
      isDark ? 'bg-[#0A0D14] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Logo />
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Decentralized micro-task marketplace for Reddit comments and posts with 6-hour execution timers.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Google Sheets Sync Active
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Platform</h4>
            <ul className={`space-y-2 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-orange-500 transition-colors">Task Marketplace</button></li>
              <li><button onClick={() => setActiveTab('wallet')} className="hover:text-orange-500 transition-colors">User Wallet & Payouts</button></li>
              <li><button onClick={() => setActiveTab('landing')} className="hover:text-orange-500 transition-colors">How It Works</button></li>
            </ul>
          </div>

          {/* Col 3: Task Security */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Task Engine</h4>
            <ul className={`space-y-2 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-orange-500" /> Pre-Claim Privacy</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-orange-500" /> 6-Hour Claim Locks</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Proofs</li>
            </ul>
          </div>

          {/* Col 4: Payments */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Supported Payouts</h4>
            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Payouts processed within 24 hours. Zero platform fees.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold text-emerald-500 ${isDark ? 'bg-[#121826] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                UPI ID (₹)
              </span>
              <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold text-blue-500 ${isDark ? 'bg-[#121826] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                USDT (TRC20)
              </span>
              <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold text-purple-500 ${isDark ? 'bg-[#121826] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                SOL / BTC
              </span>
            </div>
          </div>

        </div>

        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4 font-medium ${
          isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <p>© {new Date().getFullYear()} Task Hunters Platform.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Reddit Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
