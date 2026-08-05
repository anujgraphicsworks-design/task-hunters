import React from 'react';
import { Target } from 'lucide-react';

export default function Logo({ className = "h-8", showText = true, textClassName = "" }) {
  return (
    <div className={`inline-flex items-center gap-2.5 cursor-pointer group selection:bg-none ${className}`}>
      {/* Brand Emblem */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
        <Target className="w-4 h-4 text-white" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <span className={`font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-sans lowercase group-hover:text-orange-500 transition-colors ${textClassName}`}>
          task<span className="text-orange-500 font-black">hunters</span>
        </span>
      )}
    </div>
  );
}
