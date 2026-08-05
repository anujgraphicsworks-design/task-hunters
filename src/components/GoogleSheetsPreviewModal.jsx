import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileSpreadsheet, Download, RefreshCw, CheckCircle2, ShieldCheck, X, ExternalLink, Filter } from 'lucide-react';

export default function GoogleSheetsPreviewModal({ onClose }) {
  const { sheetLogs, sheetsConfig } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLogs = sheetLogs.filter(log => {
    if (filterStatus === 'ALL') return true;
    return log.status === filterStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const exportCSV = () => {
    const headers = ['Submission ID', 'Timestamp', 'User Email', 'Task Type', 'Subreddit', 'Target Reddit URL', 'User Submitted Proof URL', 'Reward', 'Status', 'Reviewer Note'];
    const rows = sheetLogs.map(log => [
      log.submissionId,
      `"${log.timestamp}"`,
      `"${log.userEmail}"`,
      log.taskType,
      log.subreddit,
      `"${log.targetUrl}"`,
      `"${log.proofUrl}"`,
      log.reward,
      log.status,
      `"${log.reviewerNote || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `task_hunters_google_sheets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl bg-dark-card border border-dark-border shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Google Sheets Automated Sync Grid</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> API v4 Active
                </span>
              </div>
              <p className="text-xs text-dark-muted font-mono truncate max-w-md">
                Spreadsheet ID: {sheetsConfig.spreadsheetId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-dark-bg border border-dark-border text-dark-muted hover:text-white transition-all ${isRefreshing ? 'animate-spin text-brand-400' : ''}`}
              title="Force Sync Google Sheet API"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500/30 transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-dark-bg text-dark-muted hover:text-white hover:bg-dark-cardHover transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-4 bg-dark-bg p-2.5 rounded-xl border border-dark-border">
          <div className="flex items-center gap-2 text-xs text-dark-muted font-semibold">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
            Filter Status:
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === 'ALL' ? 'bg-brand-500 text-white' : 'text-dark-muted hover:text-white'}`}
            >
              All ({sheetLogs.length})
            </button>
            <button 
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === 'APPROVED' ? 'bg-emerald-500 text-white' : 'text-dark-muted hover:text-white'}`}
            >
              Approved
            </button>
            <button 
              onClick={() => setFilterStatus('PENDING_APPROVAL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white' : 'text-dark-muted hover:text-white'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus('REJECTED')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === 'REJECTED' ? 'bg-rose-500 text-white' : 'text-dark-muted hover:text-white'}`}
            >
              Rejected
            </button>
          </div>

          <span className="text-[11px] text-dark-muted font-mono hidden sm:block">
            Service Account: {sheetsConfig.clientEmail}
          </span>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto rounded-xl border border-dark-border bg-dark-bg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-dark-card border-b border-dark-border text-dark-muted font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Sub ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User Email</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Subreddit</th>
                <th className="py-3 px-4">Proof Link</th>
                <th className="py-3 px-4">Reward</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reviewer Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-dark-muted">
                    No Google Sheet rows logged for this filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-dark-card/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-brand-300 font-semibold">{row.submissionId}</td>
                    <td className="py-3 px-4 text-dark-muted whitespace-nowrap">{row.timestamp}</td>
                    <td className="py-3 px-4 text-white font-medium">{row.userEmail}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 font-bold text-[10px]">
                        {row.taskType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{row.subreddit}</td>
                    <td className="py-3 px-4">
                      <a 
                        href={row.proofUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-[140px]"
                      >
                        {row.proofUrl}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{row.reward}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                        row.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        row.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-muted italic">{row.reviewerNote || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-dark-border/80 flex items-center justify-between text-xs text-dark-muted">
          <span>Showing {filteredLogs.length} synced entries</span>
          <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3.5 h-3.5" /> Direct Google Sheets v4 API Webhook Ready</span>
        </div>

      </div>
    </div>
  );
}
