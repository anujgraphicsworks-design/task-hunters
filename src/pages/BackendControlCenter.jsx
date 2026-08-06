import React, { useState, useEffect, useRef } from 'react';
import { useApp, autoDetectSubreddit } from '../context/AppContext';
import EditTaskModal from '../components/EditTaskModal';
import { parseCampaignPrompt } from '../utils/aiTaskAgent';
import {
  PlusCircle, CheckCircle2, XCircle, RefreshCw, Search,
  Trash2, Edit3, DollarSign, Clock, Users, ShieldCheck,
  UserCheck, UserX, MessageSquare, FileText, Zap, Send,
  Wand2, AlertCircle, Settings, CreditCard, ChevronDown,
  ChevronUp, Timer
} from 'lucide-react';

export default function BackendControlCenter() {
  const {
    user,
    tasks,
    createTask,
    updateTask,
    deleteTask,
    payouts,
    markPayoutPaid,
    rejectPayout,
    formatAmount,
    globalRates,
    updateGlobalRates,
    authorizedAdmins,
    authorizedMods,
    addAuthorizedAdmin,
    addAuthorizedMod,
    removeAuthorizedAdmin,
    removeAuthorizedMod,
    microtaskers,
    fetchAllUsersFromBackend,
    deleteUserFromBackend,
    approveMicrotasker,
    revokeMicrotasker,
    resetClaimCooldown,
    theme,
  } = useApp();

  useEffect(() => { if (fetchAllUsersFromBackend) fetchAllUsersFromBackend(); }, []);

  const isDark = theme === 'dark';
  const card = isDark ? 'bg-[#121826] border-[#202B3F]' : 'bg-white border-slate-200 shadow-sm';
  const sub = isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-50 border-slate-200';
  const inp = isDark ? 'bg-[#090D16] border-[#202B3F] text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';
  const tt = isDark ? 'text-white' : 'text-slate-900';
  const tm = isDark ? 'text-slate-400' : 'text-slate-500';
  const divider = isDark ? 'divide-[#202B3F]/60' : 'divide-slate-100';
  const rowHover = isDark ? 'hover:bg-[#182032]' : 'hover:bg-slate-50';
  const theadBg = isDark ? 'bg-[#090D16] border-[#202B3F]' : 'bg-slate-50 border-slate-200';

  // Active tab
  const [tab, setTab] = useState('CREATE_TASK'); // CREATE_TASK | USERS | PAYOUTS | SETTINGS

  // ==================== CREATE TASK STATE ====================
  // taskMode: COMMENT | POST_WITH_COMMENT | POST_ONLY
  const [taskMode, setTaskMode] = useState('COMMENT');

  // Shared fields
  const [subredditInput, setSubredditInput] = useState('');
  const [targetPostUrlInput, setTargetPostUrlInput] = useState('');
  const [teaserTextInput, setTeaserTextInput] = useState('');
  const [rewardInput, setRewardInput] = useState(globalRates.commentRate || 1.00);
  const [timeLimitMinsInput, setTimeLimitMinsInput] = useState(globalRates.defaultTimerMins || 240);
  const [guidelinesInput, setGuidelinesInput] = useState('Account age > 30 days. Comment/post must stay live.');
  const [driveLinkInput, setDriveLinkInput] = useState('');

  // Comment task fields
  const [commentContent, setCommentContent] = useState('');

  // Post task fields
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postLinkUrl, setPostLinkUrl] = useState('');
  const [postCommentContent, setPostCommentContent] = useState(''); // for POST_WITH_COMMENT only

  // AI Comment Agent
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiLogs, setAiLogs] = useState(['🤖 AI Comment Agent ready. Enter a prompt and click Generate.']);
  const [editingTask, setEditingTask] = useState(null);
  const logsEndRef = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiLogs]);

  const handleUrlChange = (url) => {
    setTargetPostUrlInput(url);
    const detected = autoDetectSubreddit(url);
    if (detected) setSubredditInput(detected);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (taskMode === 'COMMENT') {
      if (!targetPostUrlInput || !commentContent) {
        alert('Please fill in the Target Post URL and Comment content.');
        return;
      }
      const sub = subredditInput || autoDetectSubreddit(targetPostUrlInput) || 'r/reddit';
      createTask({
        type: 'REDDIT_COMMENT',
        subreddit: sub,
        targetPostUrl: targetPostUrlInput,
        teaserText: teaserTextInput || commentContent.substring(0, 80) + '...',
        contentToPost: commentContent,
        driveLink: driveLinkInput,
        reward: rewardInput,
        timeLimitMins: timeLimitMinsInput,
        guidelines: guidelinesInput,
      });
    } else if (taskMode === 'POST_WITH_COMMENT') {
      if (!postTitle || !postBody || !postCommentContent) {
        alert('Please fill in Title, Body, and the Comment to post.');
        return;
      }
      const sub = subredditInput || 'r/reddit';
      createTask({
        type: 'REDDIT_POST_WITH_COMMENT',
        subreddit: sub,
        targetPostUrl: targetPostUrlInput || '',
        postTitle: postTitle,
        postBody: postBody,
        teaserText: teaserTextInput || postTitle,
        contentToPost: postCommentContent,
        driveLink: driveLinkInput || postLinkUrl,
        reward: rewardInput,
        timeLimitMins: timeLimitMinsInput,
        guidelines: guidelinesInput,
      });
    } else {
      // POST_ONLY
      if (!postTitle || !postBody) {
        alert('Please fill in Title and Body.');
        return;
      }
      const sub = subredditInput || 'r/reddit';
      createTask({
        type: 'REDDIT_POST_ONLY',
        subreddit: sub,
        targetPostUrl: targetPostUrlInput || '',
        postTitle: postTitle,
        postBody: postBody,
        teaserText: teaserTextInput || postTitle,
        contentToPost: postBody,
        driveLink: driveLinkInput || postLinkUrl,
        reward: rewardInput,
        timeLimitMins: timeLimitMinsInput,
        guidelines: guidelinesInput,
      });
    }

    // Reset form
    setCommentContent(''); setPostTitle(''); setPostBody('');
    setPostLinkUrl(''); setPostCommentContent('');
    setTargetPostUrlInput(''); setTeaserTextInput('');
    setSubredditInput(''); setDriveLinkInput('');
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiLogs(prev => [...prev, `📡 Running prompt: "${aiPrompt}"`]);
    try {
      const generated = await parseCampaignPrompt(aiPrompt);
      if (Array.isArray(generated) && generated.length > 0) {
        for (const t of generated) {
          await createTask(t);
          setAiLogs(prev => [...prev, `✅ Created: ${t.subreddit} — ${t.teaserText?.substring(0, 60)}...`]);
        }
        setAiLogs(prev => [...prev, `🎯 Done! ${generated.length} task(s) deployed.`]);
      } else {
        setAiLogs(prev => [...prev, '⚠️ No tasks generated. Try a more specific prompt.']);
      }
    } catch (err) {
      setAiLogs(prev => [...prev, `❌ Agent error: ${err.message}`]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ==================== USERS STATE ====================
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('ALL'); // ALL | PENDING | APPROVED
  const [expandedUser, setExpandedUser] = useState(null);

  const filteredUsers = microtaskers.filter(m => {
    const matchSearch =
      (m.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (m.redditUsername || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (m.discordUsername || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchFilter =
      userFilter === 'ALL' ||
      (userFilter === 'PENDING' && !(m.isRedditApproved || m.isApprovedHunter)) ||
      (userFilter === 'APPROVED' && (m.isRedditApproved || m.isApprovedHunter));
    return matchSearch && matchFilter;
  });

  const pendingCount = microtaskers.filter(m => m.redditUsername && !(m.isRedditApproved || m.isApprovedHunter)).length;

  // ==================== PAYOUTS STATE ====================
  const pendingPayouts = payouts.filter(p => p.status === 'PENDING');
  const allPayouts = payouts;

  // ==================== SETTINGS STATE ====================
  const [ratesForm, setRatesForm] = useState({ ...globalRates });
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newModEmail, setNewModEmail] = useState('');

  const tabs = [
    { id: 'CREATE_TASK', label: 'Create Task', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'USERS', label: 'Users', icon: <Users className="w-4 h-4" />, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'PAYOUTS', label: 'Payouts', icon: <CreditCard className="w-4 h-4" />, badge: pendingPayouts.length > 0 ? pendingPayouts.length : null },
    { id: 'SETTINGS', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const inputClass = `w-full rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-orange-500 border ${inp}`;
  const labelClass = `block text-xs font-semibold mb-1 ${tm}`;
  const sectionCard = `rounded-xl border p-4 space-y-3 ${card}`;

  return (
    <div className="space-y-5 pb-12 animate-fadeIn">

      {/* Header */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${card}`}>
        <div>
          <h1 className={`text-base font-extrabold ${tt}`}>Admin Control Panel</h1>
          <p className={`text-xs ${tm}`}>{user.name} · {user.role}</p>
        </div>
        <button
          onClick={() => fetchAllUsersFromBackend && fetchAllUsersFromBackend()}
          className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 ${sub} ${tm} hover:text-orange-400`}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Tab Bar */}
      <div className={`flex items-center gap-1 p-1 rounded-xl border ${sub} overflow-x-auto`}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative ${
              tab === t.id
                ? isDark ? 'bg-[#121826] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                : `${tm} hover:text-orange-400`
            }`}
          >
            {t.icon}{t.label}
            {t.badge && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-extrabold leading-none">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ===================== CREATE TASK TAB ===================== */}
      {tab === 'CREATE_TASK' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* Task Creation Form */}
          <div className={`${sectionCard} xl:col-span-1`}>
            <div>
              <h2 className={`text-sm font-extrabold ${tt}`}>Create New Task</h2>
              <p className={`text-xs ${tm}`}>Select task type, fill in details, and publish.</p>
            </div>

            {/* Task Mode Selector */}
            <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${sub}`}>
              {[
                { id: 'COMMENT', label: 'Comment', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { id: 'POST_WITH_COMMENT', label: 'Post + Comment', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'POST_ONLY', label: 'Post Only', icon: <FileText className="w-3.5 h-3.5" /> },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setTaskMode(m.id)}
                  className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                    taskMode === m.id
                      ? isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-orange-50 text-orange-600 border border-orange-200'
                      : `${tm}`
                  }`}
                >
                  {m.icon}{m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">

              {/* Subreddit + URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Subreddit</label>
                  <input
                    type="text"
                    placeholder="r/technology"
                    value={subredditInput}
                    onChange={e => setSubredditInput(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {taskMode === 'COMMENT' ? 'Target Post URL *' : 'Reference URL (optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="https://reddit.com/r/.../comments/..."
                    value={targetPostUrlInput}
                    onChange={e => handleUrlChange(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* COMMENT TASK FIELDS */}
              {taskMode === 'COMMENT' && (
                <div>
                  <label className={labelClass}>Comment to Post *</label>
                  <textarea
                    rows={4}
                    placeholder="The exact comment the user should post..."
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              )}

              {/* POST + COMMENT TASK FIELDS */}
              {taskMode === 'POST_WITH_COMMENT' && (
                <>
                  <div>
                    <label className={labelClass}>Post Title *</label>
                    <input type="text" placeholder="Title of the Reddit post to create" value={postTitle} onChange={e => setPostTitle(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Post Body *</label>
                    <textarea rows={3} placeholder="Body/text content of the post..." value={postBody} onChange={e => setPostBody(e.target.value)} className={`${inputClass} resize-none`} />
                  </div>
                  <div>
                    <label className={labelClass}>Comment to Post on That Post *</label>
                    <textarea rows={3} placeholder="Comment the user should leave on their own post..." value={postCommentContent} onChange={e => setPostCommentContent(e.target.value)} className={`${inputClass} resize-none`} />
                  </div>
                  <div>
                    <label className={labelClass}>Link URL (optional — for link posts)</label>
                    <input type="text" placeholder="https://..." value={postLinkUrl} onChange={e => setPostLinkUrl(e.target.value)} className={inputClass} />
                  </div>
                </>
              )}

              {/* POST ONLY TASK FIELDS */}
              {taskMode === 'POST_ONLY' && (
                <>
                  <div>
                    <label className={labelClass}>Post Title *</label>
                    <input type="text" placeholder="Title of the Reddit post to create" value={postTitle} onChange={e => setPostTitle(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Post Body *</label>
                    <textarea rows={4} placeholder="Body/text content of the post..." value={postBody} onChange={e => setPostBody(e.target.value)} className={`${inputClass} resize-none`} />
                  </div>
                  <div>
                    <label className={labelClass}>Link URL (optional — for link posts)</label>
                    <input type="text" placeholder="https://..." value={postLinkUrl} onChange={e => setPostLinkUrl(e.target.value)} className={inputClass} />
                  </div>
                </>
              )}

              {/* Shared: Teaser + Drive Link */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Teaser Preview (blurred)</label>
                  <input type="text" placeholder="Short preview shown to users..." value={teaserTextInput} onChange={e => setTeaserTextInput(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Drive/Asset Link</label>
                  <input type="text" placeholder="https://drive.google.com/..." value={driveLinkInput} onChange={e => setDriveLinkInput(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Reward + Timer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Reward ($)</label>
                  <input type="number" step="0.5" min="0.5" value={rewardInput} onChange={e => setRewardInput(parseFloat(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Time Limit (mins)</label>
                  <input type="number" min="30" step="30" value={timeLimitMinsInput} onChange={e => setTimeLimitMinsInput(parseInt(e.target.value))} className={inputClass} />
                </div>
              </div>

              {/* Guidelines */}
              <div>
                <label className={labelClass}>Guidelines</label>
                <input type="text" value={guidelinesInput} onChange={e => setGuidelinesInput(e.target.value)} className={inputClass} />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                Publish {taskMode === 'COMMENT' ? 'Comment' : taskMode === 'POST_WITH_COMMENT' ? 'Post+Comment' : 'Post Only'} Task
              </button>
            </form>
          </div>

          {/* Right column: AI Agent + Active Tasks */}
          <div className="space-y-4">

            {/* AI Comment Agent */}
            <div className={sectionCard}>
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-orange-400" />
                <h2 className={`text-sm font-extrabold ${tt}`}>AI Comment Agent</h2>
              </div>
              <p className={`text-xs ${tm}`}>Auto-generates comment tasks from a natural language prompt.</p>
              <textarea
                rows={3}
                placeholder="e.g. Create 3 comment tasks for r/technology targeting https://reddit.com/... about AI scaling"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                className={`${inputClass} resize-none`}
              />
              <button
                onClick={handleAiGenerate}
                disabled={isAiGenerating || !aiPrompt.trim()}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                {isAiGenerating ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating...</> : <><Zap className="w-3.5 h-3.5" />Run AI Agent</>}
              </button>
              {/* Agent log */}
              <div className={`rounded-lg border p-2 max-h-28 overflow-y-auto font-mono text-[10px] space-y-0.5 ${sub}`}>
                {aiLogs.map((l, i) => (
                  <div key={i} className={`${l.startsWith('❌') ? 'text-rose-400' : l.startsWith('✅') ? 'text-emerald-400' : l.startsWith('🎯') ? 'text-orange-400' : tm}`}>{l}</div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Active Tasks List */}
            <div className={sectionCard}>
              <div className="flex items-center justify-between">
                <h2 className={`text-sm font-extrabold ${tt}`}>Active Tasks ({tasks.filter(t => t.status === 'AVAILABLE' || t.status === 'CLAIMED').length})</h2>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {tasks.filter(t => t.status !== 'APPROVED' && t.status !== 'REJECTED').length === 0 ? (
                  <p className={`text-xs text-center py-4 ${tm}`}>No active tasks.</p>
                ) : tasks.filter(t => t.status !== 'APPROVED' && t.status !== 'REJECTED').map(t => (
                  <div key={t.id} className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border ${sub}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                          t.status === 'AVAILABLE' ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : t.status === 'CLAIMED' ? isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100'
                          : isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>{t.status}</span>
                        <span className={`text-xs font-bold font-mono truncate ${tt}`}>{t.subreddit}</span>
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 ${tm}`}>{t.teaserText}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setEditingTask(t)} className={`p-1.5 rounded-lg border ${sub} ${tm} hover:text-orange-400`}><Edit3 className="w-3 h-3" /></button>
                      <button onClick={() => { if (confirm('Delete this task?')) deleteTask(t.id); }} className={`p-1.5 rounded-lg border ${sub} text-rose-400 hover:bg-rose-500/10`}><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== USERS TAB ===================== */}
      {tab === 'USERS' && (
        <div className={sectionCard}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className={`text-sm font-extrabold ${tt}`}>User Management</h2>
              <p className={`text-xs ${tm}`}>{microtaskers.length} total · {pendingCount} pending Reddit approval</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${tm}`} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className={`pl-8 pr-3 py-1.5 rounded-lg border text-xs ${inp} w-44`}
                />
              </div>
              <div className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${sub}`}>
                {['ALL', 'PENDING', 'APPROVED'].map(f => (
                  <button key={f} onClick={() => setUserFilter(f)} className={`px-2 py-1 rounded-md ${userFilter === f ? isDark ? 'bg-[#121826] text-white' : 'bg-white text-slate-900' : tm}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <p className={`text-xs text-center py-8 ${tm}`}>No users found.</p>
            ) : filteredUsers.map(m => {
              const isExpanded = expandedUser === m.id;
              const isApproved = m.isRedditApproved || m.isApprovedHunter;
              return (
                <div key={m.id} className={`rounded-xl border overflow-hidden ${sub}`}>
                  {/* Main Row */}
                  <div className="flex items-center gap-3 p-3">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {(m.name || m.email || '?')[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-bold truncate ${tt}`}>{m.name || m.email}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                          m.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : m.role === 'MODERATOR' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                          : isDark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>{m.role}</span>
                        {isApproved && <span className="text-[10px] px-1.5 py-0.5 rounded border font-bold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">✓ Approved</span>}
                      </div>
                      <p className={`text-[10px] truncate ${tm}`}>{m.email}</p>
                      <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono mt-0.5">
                        {m.discordUsername && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                            Discord: @{m.discordUsername}
                          </span>
                        )}
                        {m.redditUsername && (
                          <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                            Reddit: {m.redditUsername}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {m.redditUsername && !isApproved && (
                        <button onClick={() => approveMicrotasker(m.id, m.redditUsername)} title="Approve Reddit" className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20">
                          <UserCheck className="w-3 h-3" />
                        </button>
                      )}
                      {isApproved && (
                        <button onClick={() => revokeMicrotasker(m.id)} title="Revoke Approval" className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20">
                          <UserX className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : m.id)}
                        className={`p-1.5 rounded-lg border ${sub} ${tm}`}
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Actions */}
                  {isExpanded && (
                    <div className={`border-t px-3 py-2 flex flex-wrap gap-2 ${isDark ? 'border-[#202B3F] bg-[#0A0D14]' : 'border-slate-200 bg-slate-100/50'}`}>
                      <button
                        onClick={() => { if (confirm(`Reset claim cooldown for ${m.email}?`)) resetClaimCooldown(m.id); }}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                      >
                        <Timer className="w-3 h-3" /> Reset Cooldown
                      </button>
                      <button
                        onClick={() => { if (confirm(`Permanently delete ${m.email}?`)) deleteUserFromBackend(m.id); }}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3 h-3" /> Delete User
                      </button>
                      <div className={`text-[10px] font-mono ${tm} flex items-center gap-1`}>
                        Balance: <span className="text-emerald-400 font-extrabold">{formatAmount(m.balance || 0)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== PAYOUTS TAB ===================== */}
      {tab === 'PAYOUTS' && (
        <div className={sectionCard}>
          <div>
            <h2 className={`text-sm font-extrabold ${tt}`}>Payout Queue</h2>
            <p className={`text-xs ${tm}`}>{pendingPayouts.length} pending · {allPayouts.filter(p => p.status === 'PAID').length} paid</p>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className={`border-b text-[10px] uppercase font-bold tracking-wider ${theadBg} ${tm}`}>
                <tr>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divider}`}>
                {allPayouts.length === 0 ? (
                  <tr><td colSpan={6} className={`text-center py-10 ${tm}`}>No payout requests yet.</td></tr>
                ) : allPayouts.map(p => (
                  <tr key={p.id} className={`transition-all ${rowHover}`}>
                    <td className={`py-2.5 px-3 font-semibold ${tt}`}>
                      <div>{p.userName || p.userEmail}</div>
                      <div className={`text-[10px] ${tm}`}>{p.userEmail}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                        p.method === 'UPI' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                      }`}>{p.method}</span>
                    </td>
                    <td className={`py-2.5 px-3 font-mono max-w-[140px] truncate ${tm}`}>{p.destination}</td>
                    <td className="py-2.5 px-3 font-extrabold text-emerald-500 font-mono">{formatAmount(p.amount)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400'
                        : p.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-amber-500/10 text-amber-400'
                      }`}>{p.status}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {p.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => markPayoutPaid(p.id)} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-[11px] font-bold">Paid</button>
                          <button onClick={() => rejectPayout(p.id)} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-[11px] font-bold">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== SETTINGS TAB ===================== */}
      {tab === 'SETTINGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Global Rates */}
          <div className={sectionCard}>
            <h2 className={`text-sm font-extrabold ${tt}`}>Global Payout Rates</h2>
            <div className="space-y-3">
              {[
                { label: 'Comment Task Rate ($)', key: 'commentRate', step: 0.5 },
                { label: 'Post Task Rate ($)', key: 'postRate', step: 0.5 },
                { label: 'Default Timer (mins)', key: 'defaultTimerMins', step: 30 },
              ].map(field => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    type="number"
                    step={field.step}
                    min={field.step}
                    value={ratesForm[field.key]}
                    onChange={e => setRatesForm(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                    className={inputClass}
                  />
                </div>
              ))}
              <button
                onClick={() => { updateGlobalRates(ratesForm); }}
                className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
              >
                Save Rates
              </button>
            </div>
          </div>

          {/* Admin & Mod Management */}
          <div className="space-y-4">
            {/* Admins */}
            <div className={sectionCard}>
              <h2 className={`text-sm font-extrabold ${tt}`}>Authorized Admins</h2>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="admin@email.com"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <button onClick={() => { if (newAdminEmail) { addAuthorizedAdmin(newAdminEmail); setNewAdminEmail(''); }}} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold">Add</button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {authorizedAdmins.map(e => (
                  <div key={e} className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${sub}`}>
                    <span className={`text-xs font-mono ${tt}`}>{e}</span>
                    <button onClick={() => removeAuthorizedAdmin(e)} className="text-rose-400 hover:text-rose-300"><XCircle className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Moderators */}
            <div className={sectionCard}>
              <h2 className={`text-sm font-extrabold ${tt}`}>Authorized Moderators</h2>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="mod@email.com"
                  value={newModEmail}
                  onChange={e => setNewModEmail(e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <button onClick={() => { if (newModEmail) { addAuthorizedMod(newModEmail); setNewModEmail(''); }}} className="px-3 py-2 rounded-xl bg-violet-500/80 hover:bg-violet-600 text-white text-xs font-bold">Add</button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {authorizedMods.map(e => (
                  <div key={e} className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${sub}`}>
                    <span className={`text-xs font-mono ${tt}`}>{e}</span>
                    <button onClick={() => removeAuthorizedMod(e)} className="text-rose-400 hover:text-rose-300"><XCircle className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updated) => { updateTask(updated); setEditingTask(null); }}
        />
      )}

    </div>
  );
}
