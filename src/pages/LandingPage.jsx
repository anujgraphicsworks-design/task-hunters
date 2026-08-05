import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Share2, 
  Globe, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles
} from 'lucide-react';

export default function LandingPage({ onExploreTasks, onOpenAuth }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I get paid?",
      a: "Withdraw your earnings via UPI (India-only), Crypto (USDT, SOL, BTC), PayPal, or GCash once your completed task is verified."
    },
    {
      q: "What tasks are available?",
      a: "You can complete simple social media tasks on Reddit, Instagram, X (Twitter), Facebook, App Store reviews, and more."
    },
    {
      q: "Is there a minimum withdrawal amount?",
      a: "The minimum withdrawal limit is $1.00 (or equivalent in ₹ INR / Crypto). Payouts are processed within 24 hours."
    },
    {
      q: "Do I need experience or credit card to join?",
      a: "No! Task Hunters is 100% free to join with zero fees, no experience needed, and no credit card required."
    }
  ];

  const cardBgClass = isDark 
    ? 'bg-[#121722] border-slate-800 text-slate-100 shadow-md' 
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-20 pb-16 animate-fadeIn">
      
      {/* HERO SECTION matching TaskPost.io */}
      <section className="relative pt-12 pb-6 text-center max-w-4xl mx-auto space-y-6">
        
        {/* Ambient Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[220px] blur-[100px] rounded-full pointer-events-none ${
          isDark ? 'bg-orange-500/15' : 'bg-orange-200/50'
        }`} />

        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold shadow-sm ${
          isDark ? 'bg-slate-800 border-slate-700 text-orange-400' : 'bg-white border-slate-200 text-orange-600'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          TaskPost Platform Engine
        </div>

        <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Complete Simple Social Media Tasks & <span className="text-orange-500">Earn Rewards</span>
        </h1>

        <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal ${textMutedClass}`}>
          Complete simple tasks on Reddit, Instagram, X, Facebook, the App Store and more. Withdraw via crypto, PayPal, GCash, or UPI (India). No experience needed.
        </p>

        <p className={`text-xs sm:text-sm max-w-xl mx-auto ${textMutedClass}`}>
          Built for casual earners and power-users alike — clear instructions, fair payouts, and tools that respect your time.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onExploreTasks}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-smooth inline-flex items-center justify-center gap-2 shadow-sm"
          >
            Start Earning Now
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="#how-it-works"
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl border font-bold text-xs transition-smooth inline-flex items-center justify-center gap-2 shadow-sm ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            See How It Works
          </a>
        </div>

      </section>

      {/* 6-FEATURE VALUE PROPOSITION GRID */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Get Paid Your Way</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              PayPal, GCash, UPI (India-only), or crypto — choose the withdrawal method that fits you best.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Simple Social Tasks</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Reddit, Instagram, X, Facebook, App Store and more. Flexible micro-tasks with clear guidelines.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Earn From Anywhere</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Flexible online work on your own schedule from your phone or PC. The perfect side hustle.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Fast Payouts</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Automated proof verification means you receive earnings quickly — no long waiting periods.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Secure Platform</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Industry-standard encryption and rate-limiting keep your user data and earnings completely safe.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Real-Time Tracking</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Monitor earnings, completed tasks, and submission progress live from your personal user dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* THREE SIMPLE STEPS "HOW IT WORKS" */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Complicated Setup</h2>
          <p className={`text-xs sm:text-sm ${textMutedClass}`}>Just sign up, pick your tasks, start earning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/30">Step 01</span>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Sign Up & Verify</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Create your account with Google or email. Link your social account and complete a quick profile setup.
            </p>
            <ul className={`space-y-1.5 text-xs font-medium pt-2 border-t ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Quick 1-Click registration</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Social account linking</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant profile verification</li>
            </ul>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/30">Step 02</span>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Browse & Accept Tasks</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Choose from available tasks across Reddit, Instagram, X, Facebook, App Store and more.
            </p>
            <ul className={`space-y-1.5 text-xs font-medium pt-2 border-t ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Easy task selection</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Clear guidelines & copy text</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Smart task matching</li>
            </ul>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/30">Step 03</span>
            <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>3. Get Paid</h3>
            <p className={`text-xs leading-relaxed ${textMutedClass}`}>
              Submit proof of completion and wait for verification. Once approved, withdraw via crypto, PayPal, GCash, or UPI.
            </p>
            <ul className={`space-y-1.5 text-xs font-medium pt-2 border-t ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Fast verification</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> $1 minimum withdrawal</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multiple withdrawal channels</li>
            </ul>
          </div>

        </div>
      </section>

      {/* SUPPORTED PAYOUT METHODS SECTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="space-y-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Get Paid Your Way</h2>
          <p className={`text-xs sm:text-sm ${textMutedClass}`}>Withdraw your earnings in your preferred currency or payment gateway.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className={`px-5 py-3 rounded-xl border flex items-center gap-2 ${cardBgClass}`}>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>UPI ID (India)</span>
          </div>

          <div className={`px-5 py-3 rounded-xl border flex items-center gap-2 ${cardBgClass}`}>
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>PayPal ($ USD)</span>
          </div>

          <div className={`px-5 py-3 rounded-xl border flex items-center gap-2 ${cardBgClass}`}>
            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>GCash (₱ PHP)</span>
          </div>

          <div className={`px-5 py-3 rounded-xl border flex items-center gap-2 ${cardBgClass}`}>
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Crypto (USDT / SOL / BTC)</span>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
          <p className={`text-xs sm:text-sm ${textMutedClass}`}>Got questions? We've got answers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`rounded-xl border overflow-hidden transition-smooth ${cardBgClass}`}>
              <button
                onClick={() => toggleFaq(idx)}
                className={`w-full p-4 text-left flex items-center justify-between font-bold text-xs focus:outline-none ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180 text-orange-500' : 'text-slate-400'}`} />
              </button>
              {openFaq === idx && (
                <div className={`px-4 pb-4 text-xs leading-relaxed border-t pt-3 ${
                  isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-500'
                }`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER (Removed User Count Line) */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Your Side Hustle Is Waiting. Start Earning Today.</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Complete simple online social media tasks with zero upfront fees, no experience needed, and instant payouts.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-smooth shadow-sm"
            >
              Create Free Account
            </button>
            <button
              onClick={onExploreTasks}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-smooth"
            >
              Browse Active Tasks
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
