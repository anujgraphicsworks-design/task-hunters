import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  Send, 
  ShieldCheck, 
  Coins,
  History,
  Building2,
  Trash2,
  Lock
} from 'lucide-react';

export default function WalletPage() {
  const { 
    user, 
    formatAmount, 
    payouts, 
    requestPayout, 
    updatePaymentInfo,
    deleteAccount
  } = useApp();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [upiIdInput, setUpiIdInput] = useState(user.upiId || '');
  const [cryptoAddressInput, setCryptoAddressInput] = useState(user.cryptoAddress || '');
  const [cryptoAddressError, setCryptoAddressError] = useState('');
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('UPI');
  const [withdrawDestination, setWithdrawDestination] = useState('');

  const userPayouts = payouts.filter(p => p.userId === user.id);

  const validatePolygonAddress = (addr) => {
    if (!addr) return '';
    if (!addr.startsWith('0x') || addr.length !== 42) {
      return 'Invalid Polygon address. Must start with 0x and be 42 characters.';
    }
    return '';
  };

  const handleSavePaymentInfo = (e) => {
    e.preventDefault();
    const cryptoErr = validatePolygonAddress(cryptoAddressInput);
    if (cryptoAddressInput && cryptoErr) {
      setCryptoAddressError(cryptoErr);
      return;
    }
    setCryptoAddressError('');
    setIsSavingPayment(true);
    updatePaymentInfo(upiIdInput, cryptoAddressInput);
    setTimeout(() => {
      setIsSavingPayment(false);
      alert("Payment profiles updated successfully!");
    }, 400);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || isNaN(amt)) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }
    if (amt < 1.00) {
      alert("Minimum withdrawal amount is $1.00.");
      return;
    }
    if (!withdrawDestination.trim()) {
      alert("Please enter your target UPI ID or Crypto Wallet Address.");
      return;
    }

    const success = requestPayout(amt, withdrawMethod, withdrawDestination.trim());
    if (success) {
      alert(`Withdrawal request for ${formatAmount(amt)} submitted! Status: PENDING.`);
      setWithdrawAmount('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner & Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Available Balance Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-brand-500/20 via-brand-600/10 to-dark-card border border-brand-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-brand-300 font-bold uppercase tracking-widest block">Available Earnings Balance</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">{formatAmount(user.balance)}</h2>
            <p className="text-xs text-dark-muted">
              Accumulated from approved Reddit task claims. Zero commission fees.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-bg/80 border border-dark-border text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Min Withdrawal: $1.00 / ₹85
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-bg/80 border border-dark-border text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              UPI & Crypto Supported
            </div>
          </div>
        </div>

        {/* Withdrawal Quick Stats */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-dark-muted font-bold uppercase tracking-wider block">Total Payout History</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {formatAmount(userPayouts.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0))}
            </div>
          </div>

          <div className="pt-4 border-t border-dark-border text-xs text-dark-muted flex items-center justify-between">
            <span>Pending Requests:</span>
            <span className="font-extrabold text-amber-400 font-mono">
              {userPayouts.filter(p => p.status === 'PENDING').length} Requests
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: PAYMENT PROFILES (UPI ID & CRYPTO ADDRESS) */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-400" />
              Saved Payment Details
            </h3>
            <p className="text-xs text-dark-muted">
              Configure your default UPI ID and Cryptocurrency wallet destination.
            </p>
          </div>

          <form onSubmit={handleSavePaymentInfo} className="space-y-4">
            
            {/* UPI ID Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" />
                UPI Virtual Payment Address (VPA)
              </label>
              <input
                type="text"
                placeholder="example@upi or mobile@paytm"
                value={upiIdInput}
                onChange={(e) => {
                  setUpiIdInput(e.target.value);
                  if (withdrawMethod === 'UPI') setWithdrawDestination(e.target.value);
                }}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 font-mono transition-colors"
              />
              <span className="text-[10px] text-dark-muted block">Direct manual transfer to GPay, PhonePe, Paytm, BHIM.</span>
            </div>

            {/* Crypto Address Field — USDT Polygon only */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-violet-400" />
                USDT Polygon (MATIC) Wallet Address
              </label>
              <input
                type="text"
                placeholder="0x... (Polygon MATIC network only)"
                value={cryptoAddressInput}
                onChange={(e) => {
                  setCryptoAddressInput(e.target.value);
                  setCryptoAddressError(validatePolygonAddress(e.target.value));
                  if (withdrawMethod === 'CRYPTO') setWithdrawDestination(e.target.value);
                }}
                className={`w-full bg-dark-bg border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none font-mono transition-colors ${
                  cryptoAddressError ? 'border-rose-500 focus:border-rose-500' : 'border-dark-border focus:border-violet-500'
                }`}
              />
              {cryptoAddressError ? (
                <span className="text-[10px] text-rose-400 font-medium block">{cryptoAddressError}</span>
              ) : (
                <span className="text-[10px] text-dark-muted flex items-center gap-1 block">
                  <span className="w-2 h-2 rounded-full bg-violet-500 inline-block"></span>
                  Polygon (MATIC) Network Only — Do NOT use other networks or funds will be lost.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSavingPayment}
              className="w-full py-2.5 rounded-xl bg-dark-bg hover:bg-dark-cardHover border border-dark-border text-white font-bold text-xs transition-colors"
            >
              {isSavingPayment ? 'Saving Profiles...' : 'Save Payment Profiles'}
            </button>

          </form>

          {/* Interactive Simulated UPI QR Code Preview */}
          {upiIdInput && (
            <div className="p-4 rounded-xl bg-dark-bg border border-dark-border flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${encodeURIComponent(upiIdInput)}`} 
                  alt="UPI QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">UPI QR Ready</span>
                <span className="text-xs font-bold text-white font-mono">{upiIdInput}</span>
                <p className="text-[10px] text-dark-muted mt-0.5">Admin scans this QR for manual payout settlement.</p>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: WITHDRAWAL REQUEST FORM */}
        <div className="p-6 rounded-2xl bg-dark-card border border-brand-500/30 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-brand-400" />
              Request Manual Withdrawal
            </h3>
            <p className="text-xs text-dark-muted">
              Submit a payout request to the Admin Payout Queue.
            </p>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Withdrawal Amount ($ USD)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.50"
                  min="5"
                  max={user.balance}
                  required
                  placeholder="5.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 font-mono transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
                  {withdrawAmount ? formatAmount(parseFloat(withdrawAmount) || 0) : '$0.00'}
                </span>
              </div>
            </div>

            {/* Method Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawMethod('UPI');
                    setWithdrawDestination(upiIdInput || user.upiId || '');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    withdrawMethod === 'UPI'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-dark-bg text-dark-muted border-dark-border hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  UPI ID (INR ₹)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWithdrawMethod('CRYPTO');
                    setWithdrawDestination(cryptoAddressInput || user.cryptoAddress || '');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    withdrawMethod === 'CRYPTO'
                      ? 'bg-violet-500/20 text-violet-300 border-violet-500/50'
                      : 'bg-dark-bg text-dark-muted border-dark-border hover:text-white'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  USDT Polygon
                </button>
              </div>
            </div>

            {/* Destination Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Target Payout Destination</label>
              <input
                type="text"
                required
                placeholder={withdrawMethod === 'UPI' ? 'example@upi' : '0x... (Polygon MATIC address)'}
                value={withdrawDestination}
                onChange={(e) => setWithdrawDestination(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 font-mono transition-colors"
              />
              {withdrawMethod === 'CRYPTO' && (
                <p className="text-[10px] text-violet-400 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500 inline-block"></span>
                  Polygon (MATIC) Network Only
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-orange transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              Submit Withdrawal Request
            </button>

          </form>
        </div>

      </div>

      {/* PAYOUT REQUEST HISTORY TABLE */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-brand-400" />
              Payout Request & Settlement History
            </h3>
            <p className="text-xs text-dark-muted">
              Live status updates on your requested UPI and Crypto withdrawals.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dark-border bg-dark-bg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-dark-card border-b border-dark-border text-dark-muted font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {userPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-dark-muted">
                    No withdrawal requests submitted yet.
                  </td>
                </tr>
              ) : (
                userPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-dark-card/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-brand-300 font-semibold">{p.id}</td>
                    <td className="py-3 px-4 text-dark-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        p.method === 'UPI' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {p.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-white max-w-xs truncate">{p.destination}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-400">{formatAmount(p.amount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit ${
                        p.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        p.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {p.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                        {p.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {p.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DATA PRIVACY & ACCOUNT DELETION ZONE */}
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-rose-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Data Privacy & Account Anonymization
            </h3>
            <p className="text-xs text-dark-muted max-w-2xl">
              Permanently delete your account and scrub all personally identifiable information (email, payment addresses, names) from active database records.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-extrabold text-xs border border-rose-500/40 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-dark-bg text-dark-muted text-xs font-bold border border-dark-border hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition-all"
              >
                Confirm Scrub My Data
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
