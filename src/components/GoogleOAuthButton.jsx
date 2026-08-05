import React from 'react';

export default function GoogleOAuthButton({ onGoogleSuccess, onError }) {
  // Google OAuth is disabled until a real OAuth Client ID is configured.
  // The previous implementation was a fake popup that let anyone type any email
  // and get instant access — including admin emails. This was a critical security hole.

  return (
    <button
      type="button"
      disabled
      className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-400 font-extrabold text-xs flex items-center justify-center gap-3 border border-gray-200 cursor-not-allowed opacity-60"
      title="Google Sign-In will be available soon"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path fill="#9CA3AF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#9CA3AF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#9CA3AF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#D1D5DB" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
      <span>Google Sign-In — Coming Soon</span>
    </button>
  );
}
