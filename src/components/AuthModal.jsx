import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, LogIn, UserPlus, CheckSquare, Square, ShieldCheck, Zap } from 'lucide-react';
import Logo from './Logo';
import GoogleOAuthButton from './GoogleOAuthButton';

export default function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'LOGIN' }) {
  const { loginUser, registerUser } = useApp();
  const [mode, setMode] = useState(defaultMode); // 'LOGIN' | 'REGISTER'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (mode === 'LOGIN') {
      const success = loginUser(email, password, rememberMe);
      if (success) {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    } else {
      if (!name) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      const success = registerUser(name, email, password, rememberMe);
      if (success) {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    }
  };

  // Google OAuth is disabled — no handler needed until real OAuth is set up

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo & Title */}
        <div className="text-center space-y-2 mb-5">
          <div className="flex justify-center">
            <Logo showText={true} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {mode === 'LOGIN' ? 'Welcome Back to Task Hunters' : 'Create Task Hunter Account'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'LOGIN' ? 'Sign in to access task marketplace & request payouts' : 'Join thousands of hunters earning daily cash'}
          </p>
        </div>

        {/* Error Notification Badge */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* Google OAuth Authenticator Button */}
        <div className="space-y-3">
          <GoogleOAuthButton />
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-3 text-slate-400 font-bold">Or Email Authenticator</span>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {mode === 'REGISTER' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-500" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-500" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              {rememberMe ? (
                <CheckSquare className="w-4 h-4 text-orange-500" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Stay Logged In (Save Session)</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {mode === 'LOGIN' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {mode === 'LOGIN' ? 'Sign In & Enter Marketplace' : 'Create Hunter Account'}
          </button>

        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-slate-500">
          {mode === 'LOGIN' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('REGISTER')} className="text-orange-600 font-bold hover:underline">
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('LOGIN')} className="text-orange-600 font-bold hover:underline">
                Sign in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
