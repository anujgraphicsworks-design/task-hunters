import React from 'react';

export default function Logo({ className = "h-8", showText = true, textClassName = "" }) {
  return (
    <div className={`inline-flex items-center gap-2.5 cursor-pointer group selection:bg-none ${className}`}>
      {/* Brand Emblem */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500 text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
        <svg viewBox="0 0 100 100" className="w-5 h-5 fill-current">
          <path d="M 50 15 C 30 15 15 30 15 50 C 15 70 30 85 50 85 C 70 85 85 70 85 50 C 85 30 70 15 50 15 Z M 50 25 C 63.8 25 75 36.2 75 50 C 75 63.8 63.8 75 50 75 Z" fillOpacity="0.2"/>
          <path d="M 46 26 C 60 30 68 42 66 57 C 64 70 52 80 38 78 C 36 78 48 68 49 55 C 50 42 42 32 46 26 Z" />
          <polygon points="32,28 68,50 32,72 42,50" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <span className={`font-extrabold text-lg tracking-tight text-slate-900 font-sans lowercase group-hover:text-orange-600 transition-colors ${textClassName}`}>
          task<span className="text-orange-500 font-black">hunters</span>
        </span>
      )}
    </div>
  );
}
