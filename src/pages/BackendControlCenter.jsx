import React, { useState, useEffect } from 'react';
import { useApp, autoDetectSubreddit } from '../context/AppContext';
import GoogleSheetsPreviewModal from '../components/GoogleSheetsPreviewModal';
import EditTaskModal from '../components/EditTaskModal';
import WhatsAppImagePasteZone from '../components/WhatsAppImagePasteZone';
import AIMemoryBaseModal from '../components/AIMemoryBaseModal';
import { parseCampaignPrompt } from '../utils/aiTaskAgent';
import { synthesizePostWithAgent } from '../utils/aiPostAgent';
import { parseExcelOrCsvFile } from '../utils/excelMemoryAgent';
import { 
  Activity, 
  Server, 
  Database, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  FileSpreadsheet, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Send, 
  Download, 
  RefreshCw, 
  Search, 
  Sliders, 
  UserPlus, 
  Trash2, 
  Edit3,
  Wand2, 
  Flame, 
  Cpu, 
  Terminal, 
  ExternalLink,
  DollarSign,
  Clock,
  Layers,
  Sparkles,
  Zap,
  Radio,
  Workflow,
  Globe,
  Lock,
  UserCheck,
  UserX,
  Award,
  Bot,
  Play,
  Rocket,
  Image,
  FolderPlus,
  Bookmark,
  Key,
  Upload,
  FileText,
  Brain
} from 'lucide-react';

export default function BackendControlCenter() {
  const { 
    user, 
    tasks, 
    createTask, 
    deleteTask,
    payouts, 
    markPayoutPaid, 
    rejectPayout, 
    formatAmount,
    sheetsConfig,
    setSheetsConfig,
    globalRates,
    updateGlobalRates,
    authorizedAdmins,
    authorizedMods,
    addAuthorizedAdmin,
    addAuthorizedMod,
    removeAuthorizedAdmin,
    removeAuthorizedMod,
    sheetLogs,
    microtaskers,
    fetchAllUsersFromBackend,
    deleteUserFromBackend,
    approveMicrotasker,
    revokeMicrotasker,
    theme
  } = useApp();

  useEffect(() => {
    if (fetchAllUsersFromBackend) {
      fetchAllUsersFromBackend();
    }
  }, []);

  const isDark = theme === 'dark';
  const cardBgClass = isDark ? 'bg-[#121826] border-[#202B3F] text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardBgClass = isDark ? 'bg-[#090D16] border-[#202B3F] text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900';
  const inputBgClass = isDark ? 'bg-[#090D16] border-[#202B3F] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';
  const textTitleClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500';

  const [activeBackendSubtab, setActiveBackendSubtab] = useState('AI_AGENT'); // 'AI_AGENT' | 'MICROTASKERS' | 'TELEMETRY' | 'DB_MANAGER' | 'CREATE_TASK' | 'GMAIL_AUTH' | 'PAYOUTS'
  const [aiAgentMode, setAiAgentMode] = useState('POST_AGENT'); // 'POST_AGENT' | 'COMMENT_AGENT' | 'EXCEL_AGENT'
  const [copiedId, setCopiedId] = useState(null);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Excel Memory State
  const [excelTasks, setExcelTasks] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');

  // Agent 1 State (Comment Agent)
  const [aiPrompt, setAiPrompt] = useState('Create 3 Reddit comment tasks for r/technology targeting https://www.reddit.com/r/technology/comments/ai_agent_scaling encouraging scalable microservice discussions');

  // Agent 2 State (Complex Post & Media Agent)
  const [postProductUrl, setPostProductUrl] = useState('https://swagsupply.x.yupoo.com/albums/235246337?uid=1');
  const [postBrandMemory, setPostBrandMemory] = useState('take data from link and excel sheets');
  const [postPhotos, setPostPhotos] = useState([]);
  const [postPhotoInput, setPostPhotoInput] = useState('01_hero_overview.jpg, 02_installation_detail.jpg, 03_finished_result.jpg');

  // Saved Memory Presets
  const [savedMemories, setSavedMemories] = useState([
    { id: 1, name: 'Fashion & Reps Review', text: 'take data from link and excel sheets' },
    { id: 2, name: 'Auto Repair & Off-Road', text: 'Focus on suspension durability, 3-inch lift, target r/Wrangler and r/JeepZJ, sound like an authentic car enthusiast sharing an honest review without hype words' },
    { id: 3, name: 'Tech & SaaS App Launch', text: 'Highlight clean UI, fast load speed, free tier benefits, target r/SideProject and r/technology, sound like a passionate solo developer sharing a launch update' }
  ]);

  const [autoDeployMode, setAutoDeployMode] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTerminalLogs, setAiTerminalLogs] = useState([
    '🤖 [AI AGENT SUITE v3.0]: Backend Task Generator Agents active (WhatsApp Copy-Paste Image Engine & AI Memory Base Ready).'
  ]);
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState([]);

  // Sync postPhotos array to string representation for aiPostAgent
  useEffect(() => {
    if (postPhotos.length > 0) {
      const names = postPhotos.map(p => p.name).join(', ');
      setPostPhotoInput(names);
    }
  }, [postPhotos]);

  // Microtaskers Filter State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');

  // Server Metrics Simulation
  const [serverMetrics, setServerMetrics] = useState({
    uptimeSecs: 24910,
    apiLatencyMs: 12,
    dbQueryCount: 3840,
    activeLocksCount: tasks.filter(t => t.status === 'CLAIMED').length,
    sheetsSyncStatus: 'ONLINE (API v4)',
  });

  // Database Explorer Controls
  const [dbTableSelect, setDbTableSelect] = useState('USERS');
  const [dbSearchQuery, setDbSearchQuery] = useState('');

  // Forms State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newModEmail, setNewModEmail] = useState('');

  // New Task Form
  const [taskType, setTaskType] = useState('REDDIT_COMMENT');
  const [subredditInput, setSubredditInput] = useState('');
  const [targetPostUrlInput, setTargetPostUrlInput] = useState('');
  const [teaserTextInput, setTeaserTextInput] = useState('');
  const [contentToPostInput, setContentToPostInput] = useState('');
  const [driveLinkInput, setDriveLinkInput] = useState('');
  const [rewardInput, setRewardInput] = useState(globalRates.commentRate);
  const [timeLimitMinsInput, setTimeLimitMinsInput] = useState(globalRates.defaultTimerMins);
  const [guidelinesInput, setGuidelinesInput] = useState('Account age > 30 days. Comment must stay live.');

  // Sheets Config Form
  const [sheetsForm, setSheetsForm] = useState({ ...sheetsConfig });

  // Filtered microtaskers list
  const [userManagementView, setUserManagementView] = useState('ALL_USERS'); // 'ALL_USERS' | 'REDDIT_APPROVALS'

  const filteredMicrotaskers = microtaskers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          m.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          (m.redditUsername && m.redditUsername.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
                          (m.upiId && m.upiId.toLowerCase().includes(userSearchQuery.toLowerCase()));
    const matchesStatus = userStatusFilter === 'ALL' ||
                          (userStatusFilter === 'APPROVED' && (m.isApprovedHunter || m.isRedditApproved)) ||
                          (userStatusFilter === 'PENDING' && !(m.isApprovedHunter || m.isRedditApproved));
    return matchesSearch && matchesStatus;
  });

  // Users who submitted a Reddit ID (for the Reddit Approval section)
  const redditSubmittedUsers = microtaskers.filter(m => m.redditUsername && m.redditUsername.trim() !== '');
  const pendingRedditApprovals = redditSubmittedUsers.filter(m => !(m.isApprovedHunter || m.isRedditApproved));
  const approvedRedditUsers = redditSubmittedUsers.filter(m => m.isApprovedHunter || m.isRedditApproved);

  const approvedHuntersCount = microtaskers.filter(m => m.isApprovedHunter || m.isRedditApproved).length;
  const pendingHuntersCount = microtaskers.filter(m => !(m.isApprovedHunter || m.isRedditApproved)).length;
  const googleUsersCount = microtaskers.filter(m => m.authProvider === 'GOOGLE').length;
  const emailUsersCount = microtaskers.filter(m => m.authProvider !== 'GOOGLE').length;

  // Update telemetry metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setServerMetrics(prev => ({
        ...prev,
        uptimeSecs: prev.uptimeSecs + 1,
        apiLatencyMs: Math.floor(10 + Math.random() * 6),
        dbQueryCount: prev.dbQueryCount + Math.floor(Math.random() * 4),
        activeLocksCount: tasks.filter(t => t.status === 'CLAIMED').length,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleExcelFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFileName(file.name);
    setIsAiGenerating(true);

    setAiTerminalLogs(prev => [
      ...prev,
      `\n📁 [EXCEL AGENT]: Loading file: "${file.name}"...`,
      `🔍 [AGENT]: Processing spreadsheet content & binary structure...`
    ]);

    try {
      const parsedTasks = await parseExcelOrCsvFile(file);
      setExcelTasks(parsedTasks);
      setIsAiGenerating(false);

      setAiTerminalLogs(prev => [
        ...prev,
        `🧠 [EXCEL AGENT]: Successfully trained AI memory on ${parsedTasks.length} tasks from "${file.name}"!`,
        `✅ [AGENT]: Learned task rules, payout rates, and copy patterns.`
      ]);

      if (autoDeployMode && parsedTasks.length > 0) {
        setAiTerminalLogs(prev => [
          ...prev,
          `🚀 [AUTO-DEPLOY]: Automatically deploying all ${parsedTasks.length} Excel tasks to live marketplace...`
        ]);

        parsedTasks.forEach(t => createTask(t));
      }
    } catch (err) {
      console.error(err);
      setIsAiGenerating(false);
      setAiTerminalLogs(prev => [
        ...prev,
        `❌ [ERROR]: Unable to parse file "${file.name}". Please ensure it is a valid .xlsx, .csv, or .txt spreadsheet.`
      ]);
    }
  };

  const handleDeployExcelTasks = () => {
    if (excelTasks.length === 0) return;
    excelTasks.forEach(t => createTask(t));
    setAiTerminalLogs(prev => [
      ...prev,
      `✅ [MANUAL DEPLOY]: Deployed all ${excelTasks.length} Excel Memory tasks to live marketplace!`
    ]);
    alert(`Successfully deployed ${excelTasks.length} tasks from Excel file to live marketplace!`);
  };

  const handleSaveMemoryPreset = () => {
    if (!postBrandMemory.trim()) return;
    const name = prompt("Enter a name for this Brand Memory Preset:", "My Campaign Style");
    if (name) {
      setSavedMemories(prev => [...prev, { id: Date.now(), name, text: postBrandMemory }]);
    }
  };

  const handleRunCommentAgent = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiGenerating(true);
    setAiTerminalLogs(prev => [
      ...prev,
      `\n⚡ [AI COMMENT AGENT]: Processing input batch...`,
      `🔍 [AGENT]: Parsing target Subreddit & Reddit permalink structure...`
    ]);

    setTimeout(() => {
      const generated = parseCampaignPrompt(aiPrompt, globalRates);
      setAiGeneratedTasks(generated);

      setAiTerminalLogs(prev => [
        ...prev,
        `🧠 [AGENT]: Synthesized ${generated.length} Comment Tasks with direct copy text.`,
      ]);

      if (autoDeployMode) {
        setAiTerminalLogs(prev => [
          ...prev,
          `🚀 [AUTO-DEPLOY]: Publishing ${generated.length} tasks directly to Express REST API & SQLite DB...`
        ]);

        generated.forEach(t => createTask(t));

        setTimeout(() => {
          setAiTerminalLogs(prev => [
            ...prev,
            `✅ [SUCCESS]: All ${generated.length} Comment Tasks are LIVE in Marketplace!`
          ]);
          setIsAiGenerating(false);
        }, 1000);
      } else {
        setIsAiGenerating(false);
      }
    }, 1200);
  };

  const handleRunPostAgent = (e) => {
    e.preventDefault();
    if (!postProductUrl.trim() && !postBrandMemory.trim()) return;

    const photoListStr = postPhotos.length > 0
      ? postPhotos.map(p => p.name).join(', ')
      : postPhotoInput;

    setIsAiGenerating(true);
    setAiTerminalLogs(prev => [
      ...prev,
      `\n⚡ [AI POST AGENT v3.0]: Reading Product URL: ${postProductUrl}`,
      `🧠 [AI MEMORY BASE]: Ingested Custom Rules (Titles, Flairs, Subreddits & Body Layouts)`,
      `🧠 [USER MEMORY]: Utilizing Loaded Campaign Memory: "${postBrandMemory.slice(0, 50)}..."`,
      `📷 [AGENT]: Processing ${postPhotos.length || 3} Pasted WhatsApp Images & Auto-Sequencing in Google Drive (01, 02, 03)...`,
      `✍️ [AGENT]: Synthesizing non-humanish, organic Reddit Post Title, Flair & Body Copy...`
    ]);

    setTimeout(() => {
      const generatedPostTask = synthesizePostWithAgent({
        productUrl: postProductUrl,
        brandMemory: postBrandMemory,
        imageLinksInput: photoListStr,
        globalRates
      });

      if (generatedPostTask) {
        setAiGeneratedTasks([generatedPostTask]);

        setAiTerminalLogs(prev => [
          ...prev,
          `✅ [AGENT]: Applied Flair: ${generatedPostTask.flair || '[QC]'}`,
          `✅ [AGENT]: Created Post Title: "${generatedPostTask.postTitle}"`,
          `📁 [AGENT]: Generated Google Drive Link: ${generatedPostTask.driveFolderLink}`,
          `📸 [AGENT]: Photo Order Sequenced: ${photoListStr}`
        ]);

        if (autoDeployMode) {
          setAiTerminalLogs(prev => [
            ...prev,
            `🚀 [AUTO-DEPLOY]: Auto-Deploying Reddit Post Task to Express REST API & Database...`
          ]);

          createTask(generatedPostTask);

          setTimeout(() => {
            setAiTerminalLogs(prev => [
              ...prev,
              `✅ [SUCCESS]: Reddit Post Task (${generatedPostTask.subreddit}) is LIVE in Marketplace with Google Drive photo links!`
            ]);
            setIsAiGenerating(false);
          }, 1000);
        } else {
          setIsAiGenerating(false);
        }
      }
    }, 1800);
  };

  const handleDeploySingleTask = (task) => {
    createTask(task);
    setAiGeneratedTasks(prev => prev.filter(t => t.id !== task.id));
    setAiTerminalLogs(prev => [
      ...prev,
      `✅ [MANUAL DEPLOY]: Published AI Task ${task.id} (${task.subreddit}) to live marketplace!`
    ]);
  };

  const handleUrlChange = (url) => {
    setTargetPostUrlInput(url);
    const detected = autoDetectSubreddit(url);
    if (detected) {
      setSubredditInput(detected);
    }
  };

  const handleDeleteTaskConfirm = (taskId, subreddit) => {
    if (window.confirm(`Are you sure you want to delete task ${taskId} (${subreddit}) from database server?`)) {
      deleteTask(taskId);
    }
  };

  const handleAddAdminEmail = (e) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    addAuthorizedAdmin(newAdminEmail.trim());
    setNewAdminEmail('');
  };

  const handleAddModEmail = (e) => {
    e.preventDefault();
    if (!newModEmail) return;
    addAuthorizedMod(newModEmail.trim());
    setNewModEmail('');
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!targetPostUrlInput || !contentToPostInput) {
      alert("Please enter target Reddit URL and copy text.");
      return;
    }

    const sub = subredditInput || autoDetectSubreddit(targetPostUrlInput) || 'r/reddit';

    createTask({
      type: taskType,
      subreddit: sub,
      targetPostUrl: targetPostUrlInput,
      teaserText: teaserTextInput || contentToPostInput || `Reddit task in ${sub}`,
      contentToPost: contentToPostInput,
      driveLink: driveLinkInput,
      reward: rewardInput,
      timeLimitMins: timeLimitMinsInput,
      guidelines: guidelinesInput,
    });

    setSubredditInput('');
    setTargetPostUrlInput('');
    setTeaserTextInput('');
    setContentToPostInput('');
    setDriveLinkInput('');
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportTableCSV = () => {
    let headers = [];
    let rows = [];
    let filename = 'backend_export.csv';

    if (dbTableSelect === 'USERS') {
      headers = ['ID', 'Name', 'Email', 'Role', 'Reddit ID', 'Status', 'Karma', 'Tasks Done', 'Earnings ($)'];
      rows = microtaskers.map(m => [m.id, `"${m.name}"`, m.email, m.role, `"${m.redditUsername || ''}"`, m.isApprovedHunter || m.isRedditApproved ? 'APPROVED_HUNTER' : 'PENDING', m.redditKarma, m.tasksCompleted, m.earnings]);
      filename = `microtaskers_database_${Date.now()}.csv`;
    } else if (dbTableSelect === 'TASKS') {
      headers = ['ID', 'Type', 'Subreddit', 'Target URL', 'Reward', 'Time Limit (m)', 'Status'];
      rows = tasks.map(t => [t.id, t.type, t.subreddit, `"${t.targetPostUrl}"`, t.reward, t.timeLimitMins, t.status]);
      filename = `tasks_database_${Date.now()}.csv`;
    } else if (dbTableSelect === 'PAYOUTS') {
      headers = ['ID', 'User Email', 'Amount', 'Method', 'Destination', 'Status'];
      rows = payouts.map(p => [p.id, p.userEmail, p.amount, p.method, `"${p.destination}"`, p.status]);
      filename = `payouts_database_${Date.now()}.csv`;
    } else {
      headers = ['Sub ID', 'Timestamp', 'User Email', 'Type', 'Subreddit', 'Proof URL', 'Status'];
      rows = sheetLogs.map(s => [s.submissionId, `"${s.timestamp}"`, s.userEmail, s.taskType, s.subreddit, `"${s.proofUrl}"`, s.status]);
      filename = `sheets_logs_${Date.now()}.csv`;
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* ULTRA-PREMIUM BACKEND HEADER BANNER */}
      <div className={`p-8 rounded-3xl border relative overflow-hidden transition-smooth ${
        isDark 
          ? 'bg-gradient-to-br from-[#121826] via-[#182032] to-[#090D16] border-orange-500/40 text-white shadow-glow-orange' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        
        {/* Glow Effects */}
        <div className={`absolute top-0 right-0 w-96 h-96 blur-[130px] rounded-full pointer-events-none ${
          isDark ? 'bg-orange-500/10' : 'bg-orange-200/40'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border ${
                isDark ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' : 'bg-orange-50 text-orange-600 border-orange-200'
              }`}>
                <Bot className="w-4 h-4 text-orange-500 animate-bounce" />
                Backend Autonomous AI Agent Suite v3.0
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${
                isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Copy-Paste Images Enabled
              </span>
              <button 
                onClick={() => setShowMemoryModal(true)}
                className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> 🧠 Feed AI Memory Base
              </button>
            </div>

            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3 ${textTitleClass}`}>
              Task Hunters Supreme AI Backend Engine
              <Sparkles className="w-6 h-6 text-amber-500" />
            </h1>
            <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${textMutedClass}`}>
              Upload past Excel task sheets into AI memory, copy-paste WhatsApp images directly into photo packages, synthesize organic Reddit posts, and manage live database records.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`p-4 rounded-2xl border text-center min-w-[110px] ${
              isDark ? 'bg-[#090D16]/90 border-[#202B3F] shadow-lg' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${textMutedClass}`}>Excel Memory</span>
              <span className="text-lg font-extrabold text-emerald-500 font-mono">{excelTasks.length} Learned</span>
            </div>

            <div className={`p-4 rounded-2xl border text-center min-w-[110px] ${
              isDark ? 'bg-[#090D16]/90 border-[#202B3F] shadow-lg' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${textMutedClass}`}>Approved Hunters</span>
              <span className="text-lg font-extrabold text-emerald-500 font-mono">{approvedHuntersCount}</span>
            </div>

            <div className={`p-4 rounded-2xl border text-center min-w-[110px] ${
              isDark ? 'bg-[#090D16]/90 border-[#202B3F] shadow-lg' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${textMutedClass}`}>Active Claims</span>
              <span className="text-lg font-extrabold text-amber-500 font-mono">{serverMetrics.activeLocksCount}</span>
            </div>
          </div>

        </div>

        {/* SUBTAB NAVIGATION BAR */}
        <div className="mt-8 pt-6 border-t border-dark-border/80 flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveBackendSubtab('AI_AGENT')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeBackendSubtab === 'AI_AGENT'
                ? 'bg-brand-500 text-white shadow-glow-orange scale-105'
                : 'bg-dark-bg/80 text-dark-muted hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <Bot className="w-4 h-4 text-brand-400" />
            🤖 AI Task Suite & WhatsApp Media
          </button>

          <button
            onClick={() => setActiveBackendSubtab('MICROTASKERS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeBackendSubtab === 'MICROTASKERS'
                ? 'bg-brand-500 text-white shadow-glow-orange scale-105'
                : 'bg-dark-bg/80 text-dark-muted hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Reddit ID & Microtaskers Hub ({microtaskers.length})
          </button>

          <button
            onClick={() => setActiveBackendSubtab('TELEMETRY')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeBackendSubtab === 'TELEMETRY'
                ? 'bg-brand-500 text-white shadow-glow-orange scale-105'
                : 'bg-dark-bg/80 text-dark-muted hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            System Telemetry & Health
          </button>

          <button
            onClick={() => setActiveBackendSubtab('DB_MANAGER')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeBackendSubtab === 'DB_MANAGER'
                ? 'bg-brand-500 text-white shadow-glow-orange scale-105'
                : 'bg-dark-bg/80 text-dark-muted hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            Visual Database Explorer
          </button>

          <button
            onClick={() => setActiveBackendSubtab('CREATE_TASK')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeBackendSubtab === 'CREATE_TASK'
                ? 'bg-brand-500 text-white shadow-glow-orange scale-105'
                : 'bg-dark-bg/80 text-dark-muted hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-brand-400" />
            Manual Task Creator & Edit
          </button>

          <button
            onClick={() => setActiveBackendSubtab('GMAIL_AUTH')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeBackendSubtab === 'GMAIL_AUTH'
                ? 'bg-brand-500 text-white shadow-glow-orange scale-105'
                : 'bg-dark-bg/80 text-dark-muted hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            Gmail Role Whitelist
          </button>

          <button
            onClick={() => setActiveBackendSubtab('PAYOUTS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeBackendSubtab === 'PAYOUTS'
                ? 'bg-brand-500 text-white shadow-glow-orange scale-105'
                : 'bg-dark-bg/80 text-dark-muted hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            Payout Hub ({payouts.filter(p => p.status === 'PENDING').length})
          </button>

        </div>

      </div>

      {/* SUBTAB 1: DUAL AI TASK GENERATOR AGENT SUITE WITH EXCEL MEMORY ENGINE */}
      {activeBackendSubtab === 'AI_AGENT' && (
        <div className="space-y-6">
          
          {/* Agent Mode Selector Switcher */}
          <div className="flex items-center justify-between bg-dark-card p-4 rounded-2xl border border-dark-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-400" />
                Select AI Agent Engine:
              </span>
              <div className="flex items-center bg-dark-bg p-1 rounded-xl border border-dark-border text-xs font-bold">
                <button
                  onClick={() => setAiAgentMode('POST_AGENT')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    aiAgentMode === 'POST_AGENT' ? 'bg-cyan-500 text-white font-extrabold shadow-sm' : 'text-dark-muted hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Agent 2: Complex Post & Media Agent (WhatsApp Copy-Paste)
                </button>
                <button
                  onClick={() => setAiAgentMode('EXCEL_AGENT')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    aiAgentMode === 'EXCEL_AGENT' ? 'bg-emerald-500 text-white font-extrabold shadow-sm' : 'text-dark-muted hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel Memory File Ingestion Agent (.xlsx / .csv)
                </button>
                <button
                  onClick={() => setAiAgentMode('COMMENT_AGENT')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    aiAgentMode === 'COMMENT_AGENT' ? 'bg-brand-500 text-white font-extrabold shadow-sm' : 'text-dark-muted hover:text-white'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Agent 1: Multi-Link Comment Batch Agent
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Feed Memory Base Button */}
              <button
                onClick={() => setShowMemoryModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all shadow-glow-orange-sm"
              >
                <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
                Feed Memory to AI Base
              </button>

              {/* Auto Deploy Toggle */}
              <div 
                onClick={() => setAutoDeployMode(!autoDeployMode)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
                  autoDeployMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-dark-bg text-dark-muted border-dark-border'
                }`}
              >
                <Rocket className={`w-3.5 h-3.5 ${autoDeployMode ? 'text-emerald-400 animate-pulse' : ''}`} />
                <span>{autoDeployMode ? 'Auto-Deploy ON' : 'Manual Approval'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* AGENT 2: COMPLEX POST & MEDIA SYNTHESIS AGENT */}
            {aiAgentMode === 'POST_AGENT' && (
              <div className="lg:col-span-2 p-8 rounded-3xl bg-dark-card border border-cyan-500/40 space-y-6 shadow-glow-orange">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                    Complex Post Content & Media Synthesis Agent
                  </h3>
                  <p className="text-xs text-dark-muted">
                    Reads product URL + brand memory instructions, copy-pastes WhatsApp images directly into photo packages, and generates ordered Google Drive links (01, 02, 03).
                  </p>
                </div>

                {/* Brand Memory Presets Bar */}
                <div className="p-3.5 rounded-2xl bg-dark-bg border border-dark-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4" /> Saved Brand Memory Presets
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMemoryModal(true)}
                      className="text-amber-400 hover:underline text-[11px] font-extrabold flex items-center gap-1"
                    >
                      <Brain className="w-3 h-3 text-amber-400" /> + Feed AI Memory Base
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {savedMemories.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPostBrandMemory(m.text)}
                        className="px-3 py-1.5 rounded-xl bg-dark-card hover:bg-dark-cardHover border border-dark-border text-white text-xs font-bold transition-all text-left"
                      >
                        ⚡ {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleRunPostAgent} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-light">Product URL / Target Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://swagsupply.x.yupoo.com/albums/235246337?uid=1"
                      value={postProductUrl}
                      onChange={(e) => setPostProductUrl(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-dark-light">Brand Memory & Custom Instructions</label>
                      <span className="text-[10px] text-emerald-400 font-bold">⚡ Applied directly to AI synthesis</span>
                    </div>
                    <textarea
                      rows={3}
                      required
                      placeholder="take data from link and excel sheets..."
                      value={postBrandMemory}
                      onChange={(e) => setPostBrandMemory(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
                    />
                  </div>

                  {/* WhatsApp Direct Copy-Paste Dropzone Component */}
                  <WhatsAppImagePasteZone 
                    photos={postPhotos} 
                    setPhotos={setPostPhotos} 
                  />

                  <button
                    type="submit"
                    disabled={isAiGenerating}
                    className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-orange transition-all disabled:opacity-50"
                  >
                    {isAiGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Synthesizing Non-Humanish Post & Google Drive Media Package...
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-5 h-5 text-amber-300" />
                        Synthesize & Deploy Reddit Post Task with Media Agent
                      </>
                    )}
                  </button>
                </form>

                {/* Generated Task Preview Cards */}
                {aiGeneratedTasks.length > 0 && !autoDeployMode && (
                  <div className="space-y-4 pt-4 border-t border-dark-border">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Generated Post Task Preview ({aiGeneratedTasks.length})
                    </h4>
                    {aiGeneratedTasks.map(task => (
                      <div key={task.id} className="p-4 rounded-2xl bg-dark-bg border border-dark-border space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-cyan-400">{task.subreddit} • {task.type}</span>
                          <span className="font-bold text-emerald-400">${task.reward.toFixed(2)}</span>
                        </div>
                        <h5 className="text-sm font-extrabold text-white">Title: "{task.postTitle}"</h5>
                        <p className="text-xs font-mono text-dark-muted bg-dark-card p-3 rounded-xl whitespace-pre-wrap">{task.contentToPost}</p>
                        <button
                          onClick={() => handleDeploySingleTask(task)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-glow-green flex items-center gap-1.5 ml-auto"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          Deploy to Live Marketplace
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* EXCEL MEMORY FILE INGESTION AGENT */}
            {aiAgentMode === 'EXCEL_AGENT' && (
              <div className="lg:col-span-2 p-8 rounded-3xl bg-dark-card border border-emerald-500/40 space-y-6 shadow-glow-orange">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                    Excel & CSV Spreadsheet Memory Training Agent
                  </h3>
                  <p className="text-xs text-dark-muted">
                    Upload your manual task Excel files (`.xlsx`, `.csv`, `.txt`). The AI Agent will read your spreadsheet, train its memory on your historical tasks, and auto-deploy them.
                  </p>
                </div>

                {/* File Upload Box */}
                <div className="p-8 rounded-2xl bg-dark-bg border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 transition-all text-center space-y-4">
                  <Upload className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Upload Manual Task Excel File (.xlsx / .csv)</h4>
                    <p className="text-xs text-dark-muted">Drag & drop your Excel file here or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls, .txt, .tsv"
                    onChange={handleExcelFileUpload}
                    className="hidden"
                    id="excelFileInput"
                  />
                  <label
                    htmlFor="excelFileInput"
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer shadow-glow-green transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    Select Excel / CSV File
                  </label>
                  {excelFileName && (
                    <div className="pt-2 text-xs font-mono font-bold text-emerald-300">
                      Loaded File: {excelFileName} ({excelTasks.length} tasks ingested into memory)
                    </div>
                  )}
                </div>

                {/* Parsed Excel Tasks Review Table */}
                {excelTasks.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-dark-border">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Tasks Ingested from Excel ({excelTasks.length})
                      </h4>
                      <button
                        onClick={handleDeployExcelTasks}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-glow-green flex items-center gap-1.5"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        Deploy All {excelTasks.length} Excel Tasks
                      </button>
                    </div>

                    <div className="rounded-xl border border-dark-border bg-dark-bg overflow-hidden max-h-64 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse font-mono">
                        <thead className="bg-dark-card border-b border-dark-border text-dark-muted font-bold text-[10px] uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Subreddit</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Required Copy Snippet</th>
                            <th className="py-2.5 px-3">Reward</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border/60">
                          {excelTasks.map(t => (
                            <tr key={t.id} className="hover:bg-dark-card/50">
                              <td className="py-2.5 px-3 font-bold text-white">{t.subreddit}</td>
                              <td className="py-2.5 px-3 text-brand-300">{t.type}</td>
                              <td className="py-2.5 px-3 text-dark-light truncate max-w-xs">{t.contentToPost}</td>
                              <td className="py-2.5 px-3 font-bold text-emerald-400">${t.reward.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* AGENT 1: MULTI-LINK COMMENT BATCH AGENT */}
            {aiAgentMode === 'COMMENT_AGENT' && (
              <div className="lg:col-span-2 p-8 rounded-3xl bg-dark-card border border-brand-500/40 space-y-6 shadow-glow-orange">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Bot className="w-6 h-6 text-brand-400" />
                    Multi-Link Reddit Comment Batch Agent
                  </h3>
                  <p className="text-xs text-dark-muted">
                    Input paired Reddit URLs and exact comment lines. Auto-detects subreddits and sets direct copy text without prefixes.
                  </p>
                </div>

                <form onSubmit={handleRunCommentAgent} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-light font-mono">Paired Reddit Links & Comment Content Batch</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="https://www.reddit.com/r/JeepZJ/comments/...\nI didn’t know this was a thing. Thank you so much.\n\nhttps://www.reddit.com/r/RockAuto/comments/...\ni had no idea i could repair this myself."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border rounded-2xl p-4 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 leading-relaxed font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAiGenerating}
                    className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-orange transition-all disabled:opacity-50"
                  >
                    {isAiGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        AI Comment Agent Processing Batch...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        Generate & Deploy Comment Tasks
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Sidebar: AI Agent Execution Socket Logs */}
            <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs border-b border-dark-border pb-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Terminal className="w-4 h-4 text-brand-400" />
                  AI Agent Terminal Execution Logs
                </div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> SUITE READY
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-dark-bg text-dark-light text-xs space-y-2.5 overflow-auto max-h-[480px] leading-relaxed shadow-inner">
                {aiTerminalLogs.map((log, idx) => (
                  <p key={idx} className={log.includes('SUCCESS') || log.includes('LIVE') ? 'text-emerald-400 font-bold' : log.includes('AGENT') ? 'text-cyan-300' : 'text-brand-300'}>
                    {log}
                  </p>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB: MICROTASKERS & USER MANAGEMENT HUB */}
      {activeBackendSubtab === 'MICROTASKERS' && (
        <div className="space-y-6">

          {/* SECTION TOGGLE TABS */}
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-dark-card border border-dark-border">
            <button
              onClick={() => setUserManagementView('ALL_USERS')}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                userManagementView === 'ALL_USERS'
                  ? 'bg-brand-500 text-white shadow-glow-orange'
                  : 'text-dark-muted hover:text-white hover:bg-dark-bg'
              }`}
            >
              <Globe className="w-4 h-4" />
              All Registered Users ({microtaskers.length})
            </button>
            <button
              onClick={() => setUserManagementView('REDDIT_APPROVALS')}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                userManagementView === 'REDDIT_APPROVALS'
                  ? 'bg-emerald-500 text-white shadow-glow-green'
                  : 'text-dark-muted hover:text-white hover:bg-dark-bg'
              }`}
            >
              <Award className="w-4 h-4" />
              Reddit ID Approvals ({redditSubmittedUsers.length})
              {pendingRedditApprovals.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                  {pendingRedditApprovals.length} NEW
                </span>
              )}
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: ALL REGISTERED USERS (Master Database) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {userManagementView === 'ALL_USERS' && (
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-400" />
                    All Registered Users — Master Database
                  </h3>
                  <p className="text-xs text-dark-muted">
                    Every user who signed up on your site — via Google Auth or Email & Password. Edit, view, or delete accounts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchAllUsersFromBackend && fetchAllUsersFromBackend()}
                    className="px-3 py-1.5 rounded-xl bg-brand-500/15 text-brand-300 border border-brand-500/30 text-xs font-extrabold hover:bg-brand-500/25 transition-all flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-dark-bg border border-dark-border text-center">
                  <div className="text-xl font-extrabold text-white">{microtaskers.length}</div>
                  <div className="text-[10px] text-dark-muted font-bold uppercase">Total Users</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <div className="text-xl font-extrabold text-blue-300">{googleUsersCount}</div>
                  <div className="text-[10px] text-blue-400 font-bold uppercase">Google Auth</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/30 text-center">
                  <div className="text-xl font-extrabold text-slate-300">{emailUsersCount}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Email/Password</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-xl font-extrabold text-emerald-300">{approvedHuntersCount}</div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Approved Hunters</div>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or Reddit ID..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Users Table */}
              <div className="rounded-2xl border border-dark-border bg-dark-bg overflow-auto max-h-[500px] shadow-lg">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="bg-dark-card border-b border-dark-border text-dark-muted font-bold uppercase text-[10px] tracking-wider sticky top-0">
                    <tr>
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Site Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Auth Method</th>
                      <th className="py-3.5 px-4">Reddit ID</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Balance</th>
                      <th className="py-3.5 px-4">Joined</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/60">
                    {(userSearchQuery
                      ? microtaskers.filter(m =>
                          m.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          m.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          (m.redditUsername && m.redditUsername.toLowerCase().includes(userSearchQuery.toLowerCase()))
                        )
                      : microtaskers
                    ).length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-12 text-dark-muted">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      (userSearchQuery
                        ? microtaskers.filter(m =>
                            m.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            m.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            (m.redditUsername && m.redditUsername.toLowerCase().includes(userSearchQuery.toLowerCase()))
                          )
                        : microtaskers
                      ).map((m, idx) => (
                        <tr key={m.id} className="hover:bg-dark-card/50 transition-colors">
                          <td className="py-3.5 px-4 text-dark-muted font-bold">{idx + 1}</td>
                          <td className="py-3.5 px-4 text-white font-extrabold">
                            {m.name || m.email.split('@')[0]}
                          </td>
                          <td className="py-3.5 px-4 text-cyan-400">{m.email}</td>
                          <td className="py-3.5 px-4">
                            {m.authProvider === 'GOOGLE' ? (
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold text-[10px]">🔵 GOOGLE</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 border border-slate-500/40 font-bold text-[10px]">📧 EMAIL</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {m.redditUsername ? (
                              <span className="font-bold text-amber-300">{m.redditUsername}</span>
                            ) : (
                              <span className="text-dark-muted italic text-[10px]">Not submitted</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              m.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              m.role === 'MODERATOR' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              'bg-dark-card text-dark-muted border border-dark-border'
                            }`}>
                              {m.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400">${(m.balance || 0).toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-[10px] text-dark-muted">
                            {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {m.role !== 'ADMIN' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to DELETE user "${m.name || m.email}"? This cannot be undone.`)) {
                                    deleteUserFromBackend(m.id);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold text-[10px] hover:bg-rose-500/30 transition-all flex items-center gap-1 ml-auto"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: REDDIT ID APPROVAL REQUESTS */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {userManagementView === 'REDDIT_APPROVALS' && (
            <div className="p-8 rounded-3xl bg-dark-card border border-emerald-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Reddit ID Approval Requests
                  </h3>
                  <p className="text-xs text-dark-muted">
                    Users who submitted their Reddit username for approval. Approve or reject their Reddit ID to allow them to claim tasks.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    {pendingRedditApprovals.length} Pending
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {approvedRedditUsers.length} Approved
                  </span>
                </div>
              </div>

              {/* PENDING APPROVALS TABLE */}
              {pendingRedditApprovals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Pending Reddit ID Approvals ({pendingRedditApprovals.length})
                  </h4>
                  <div className="rounded-2xl border border-amber-500/30 bg-dark-bg overflow-auto max-h-[400px] shadow-lg">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 font-bold uppercase text-[10px] tracking-wider sticky top-0">
                        <tr>
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">Site Username</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Submitted Reddit ID</th>
                          <th className="py-3 px-4">Auth Method</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/60">
                        {pendingRedditApprovals.map((m, idx) => (
                          <tr key={m.id} className="hover:bg-amber-500/5 transition-colors">
                            <td className="py-3.5 px-4 text-dark-muted font-bold">{idx + 1}</td>
                            <td className="py-3.5 px-4 text-white font-extrabold">
                              {m.name || m.email.split('@')[0]}
                            </td>
                            <td className="py-3.5 px-4 text-cyan-400">{m.email}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs">
                                {m.redditUsername}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {m.authProvider === 'GOOGLE' ? (
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">GOOGLE</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 font-bold text-[10px]">EMAIL</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => approveMicrotasker(m.id, m.redditUsername)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => revokeMicrotasker(m.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/25 transition-all flex items-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete user "${m.name || m.email}" entirely?`)) {
                                      deleteUserFromBackend(m.id);
                                    }
                                  }}
                                  className="px-2 py-1.5 rounded-lg bg-dark-bg text-dark-muted border border-dark-border text-xs font-bold hover:text-rose-400 hover:border-rose-500/30 transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {pendingRedditApprovals.length === 0 && (
                <div className="text-center py-10 text-dark-muted text-xs font-mono">
                  ✅ No pending Reddit ID approval requests. All caught up!
                </div>
              )}

              {/* APPROVED USERS TABLE */}
              {approvedRedditUsers.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-dark-border">
                  <h4 className="text-sm font-extrabold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Approved Reddit Users ({approvedRedditUsers.length})
                  </h4>
                  <div className="rounded-2xl border border-emerald-500/30 bg-dark-bg overflow-auto max-h-[400px] shadow-lg">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead className="bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px] tracking-wider sticky top-0">
                        <tr>
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">Site Username</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Approved Reddit ID</th>
                          <th className="py-3 px-4">Auth Method</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/60">
                        {approvedRedditUsers.map((m, idx) => (
                          <tr key={m.id} className="hover:bg-emerald-500/5 transition-colors">
                            <td className="py-3.5 px-4 text-dark-muted font-bold">{idx + 1}</td>
                            <td className="py-3.5 px-4 text-white font-extrabold">
                              {m.name || m.email.split('@')[0]}
                            </td>
                            <td className="py-3.5 px-4 text-cyan-400">{m.email}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs">
                                {m.redditUsername} ✓
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {m.authProvider === 'GOOGLE' ? (
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">GOOGLE</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 font-bold text-[10px]">EMAIL</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => revokeMicrotasker(m.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/25 transition-all flex items-center gap-1"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  Revoke Approval
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete user "${m.name || m.email}" entirely?`)) {
                                      deleteUserFromBackend(m.id);
                                    }
                                  }}
                                  className="px-2 py-1.5 rounded-lg bg-dark-bg text-dark-muted border border-dark-border text-xs font-bold hover:text-rose-400 hover:border-rose-500/30 transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* SUBTAB: SYSTEM TELEMETRY */}
      {activeBackendSubtab === 'TELEMETRY' && (
        <div className="space-y-8">
          
          <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-brand-400" />
                  Live System Node Architecture Telemetry
                </h3>
                <p className="text-xs text-dark-muted">
                  Interactive real-time map of client web requests, Node.js Express server, SQLite database, and Google Sheets webhook.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Systems Nominal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              
              <div className="p-5 rounded-2xl bg-dark-bg border border-dark-border space-y-3 relative group hover:border-brand-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Node 01</span>
                  <Globe className="w-4 h-4 text-brand-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-white">Client Frontend Web</div>
                  <div className="text-xs text-brand-300 font-mono font-bold">Vite + React 18</div>
                </div>
                <div className="pt-2 text-[10px] text-dark-muted border-t border-dark-border/80 flex items-center justify-between">
                  <span>Port: 3000</span>
                  <span className="text-emerald-400 font-bold">Connected</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-bg border border-dark-border space-y-3 relative group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Node 02</span>
                  <Server className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-white">Express REST Server</div>
                  <div className="text-xs text-emerald-400 font-mono font-bold">http://localhost:5000</div>
                </div>
                <div className="pt-2 text-[10px] text-dark-muted border-t border-dark-border/80 flex items-center justify-between">
                  <span>GET /api/admin/users</span>
                  <span className="text-emerald-400 font-bold">Port 5000</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-bg border border-dark-border space-y-3 relative group hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Node 03</span>
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-white">Prisma SQLite DB</div>
                  <div className="text-xs text-cyan-300 font-mono font-bold">server/prisma/dev.db</div>
                </div>
                <div className="pt-2 text-[10px] text-dark-muted border-t border-dark-border/80 flex items-center justify-between">
                  <span>ORM v5.10.2</span>
                  <a href="http://localhost:5555" target="_blank" rel="noreferrer" className="text-brand-400 hover:underline font-bold">GUI 5555</a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-bg border border-dark-border space-y-3 relative group hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Node 04</span>
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-white">6-Hour Timer Daemon</div>
                  <div className="text-xs text-amber-300 font-mono font-bold">Interval: 10s Active</div>
                </div>
                <div className="pt-2 text-[10px] text-dark-muted border-t border-dark-border/80 flex items-center justify-between">
                  <span>Auto Pool Revert</span>
                  <span className="text-emerald-400 font-bold">Running</span>
                </div>
              </div>

            </div>
          </div>

          <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4 font-mono">
            <div className="flex items-center justify-between text-xs border-b border-dark-border pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Terminal className="w-4 h-4 text-brand-400" />
                Live Express Server Logs & Webhook Stream
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> LIVE SOCKET
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-dark-bg text-dark-light text-xs space-y-2.5 overflow-auto max-h-64 leading-relaxed shadow-inner">
              <p className="text-emerald-400">⚡ [SERVER]: Task Hunters Express Backend Server running on http://localhost:5000</p>
              <p className="text-cyan-400">🔑 [PRIMARY ADMIN]: Whitelisted Admin connected via secure backend</p>
              <p className="text-brand-300">🤖 [AI SUITE v3.0]: Dual AI Agents + WhatsApp Copy-Paste Image Engine active</p>
              <p className="text-amber-400">🔥 [DAEMON]: 6-Hour Task Execution Expiration Daemon active (interval 10s)</p>
              <p className="text-dark-muted">POST /api/auth/login 200 OK (12ms) - Primary Admin authenticated</p>
              <p className="text-emerald-400">🌐 [SHEETS API v4]: Connected to Spreadsheet ID: {sheetsConfig.spreadsheetId}</p>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB: VISUAL DATABASE EXPLORER WITH USERS / MICROTASKERS OPTION */}
      {activeBackendSubtab === 'DB_MANAGER' && (
        <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Visual Database Explorer, Users & Task Management
              </h3>
              <p className="text-xs text-dark-muted">
                Inspect, edit, and delete raw backend database records for Users, Tasks, Payout Requests, and Google Sheets logs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportTableCSV}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV Data
              </button>

              <a
                href="http://localhost:5555"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-glow-orange transition-all"
              >
                Launch Prisma Studio GUI
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-bg p-3.5 rounded-2xl border border-dark-border">
            
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-dark-muted">Select Table:</span>
              <button
                onClick={() => setDbTableSelect('USERS')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${dbTableSelect === 'USERS' ? 'bg-brand-500 text-white shadow-sm font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Microtaskers Users ({microtaskers.length})
              </button>
              <button
                onClick={() => setDbTableSelect('TASKS')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${dbTableSelect === 'TASKS' ? 'bg-brand-500 text-white shadow-sm font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setDbTableSelect('PAYOUTS')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${dbTableSelect === 'PAYOUTS' ? 'bg-brand-500 text-white shadow-sm font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Payout Requests ({payouts.length})
              </button>
              <button
                onClick={() => setDbTableSelect('LOGS')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${dbTableSelect === 'LOGS' ? 'bg-brand-500 text-white shadow-sm font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Sheets Logs ({sheetLogs.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search table records..."
                value={dbSearchQuery}
                onChange={(e) => setDbSearchQuery(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
              />
            </div>

          </div>

          <div className="rounded-2xl border border-dark-border bg-dark-bg overflow-auto max-h-96 shadow-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-dark-card border-b border-dark-border text-dark-muted font-bold uppercase text-[10px] tracking-wider">
                {dbTableSelect === 'USERS' && (
                  <tr>
                    <th className="py-3.5 px-4">User ID</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Auth Method</th>
                    <th className="py-3.5 px-4">Reddit ID</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Balance</th>
                    <th className="py-3.5 px-4">Reddit Status</th>
                    <th className="py-3.5 px-4 text-right">Approval Action</th>
                  </tr>
                )}
                {dbTableSelect === 'TASKS' && (
                  <tr>
                    <th className="py-3.5 px-4">Task ID</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Subreddit</th>
                    <th className="py-3.5 px-4">Target URL</th>
                    <th className="py-3.5 px-4">Reward</th>
                    <th className="py-3.5 px-4">Timer</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                )}
                {dbTableSelect === 'PAYOUTS' && (
                  <tr>
                    <th className="py-3.5 px-4">Payout ID</th>
                    <th className="py-3.5 px-4">User Email</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Destination</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                )}
                {dbTableSelect === 'LOGS' && (
                  <tr>
                    <th className="py-3.5 px-4">Sub ID</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">User Email</th>
                    <th className="py-3.5 px-4">Task Type</th>
                    <th className="py-3.5 px-4">Subreddit</th>
                    <th className="py-3.5 px-4">Proof Link</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-dark-border/60">
                {dbTableSelect === 'USERS' && microtaskers.map(m => (
                  <tr key={m.id} className="hover:bg-dark-card/50 transition-colors">
                    <td className="py-3.5 px-4 text-brand-300 font-bold truncate max-w-[100px]">{m.id}</td>
                    <td className="py-3.5 px-4 text-white font-bold">{m.name}</td>
                    <td className="py-3.5 px-4 text-cyan-400">{m.email}</td>
                    <td className="py-3.5 px-4">
                      {m.authProvider === 'GOOGLE' ? (
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold text-[10px]">GOOGLE</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 border border-slate-500/40 font-bold text-[10px]">EMAIL/PASS</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-300">{m.redditUsername || 'None'}</td>
                    <td className="py-3.5 px-4 font-bold">{m.role}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">${(m.balance || 0).toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      {m.isApprovedHunter || m.isRedditApproved ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">APPROVED</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">PENDING</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!(m.isApprovedHunter || m.isRedditApproved) ? (
                        <button
                          onClick={() => approveMicrotasker(m.id, m.redditUsername)}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-sm"
                        >
                          Approve Reddit ID
                        </button>
                      ) : (
                        <button
                          onClick={() => revokeMicrotasker(m.id)}
                          className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs hover:bg-rose-500/30 transition-all"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {dbTableSelect === 'TASKS' && tasks.map(t => (
                  <tr key={t.id} className="hover:bg-dark-card/50 transition-colors">
                    <td className="py-3.5 px-4 text-brand-300 font-bold">{t.id}</td>
                    <td className="py-3.5 px-4">{t.type}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{t.subreddit}</td>
                    <td className="py-3.5 px-4 text-cyan-400 truncate max-w-xs">{t.targetPostUrl}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">${t.reward.toFixed(2)}</td>
                    <td className="py-3.5 px-4">{t.timeLimitMins}m</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-dark-card border border-dark-border font-bold text-[10px]">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTask(t)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/25 transition-all inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTaskConfirm(t.id, t.subreddit)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/25 transition-all inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {dbTableSelect === 'PAYOUTS' && payouts.map(p => (
                  <tr key={p.id} className="hover:bg-dark-card/50 transition-colors">
                    <td className="py-3.5 px-4 text-brand-300 font-bold">{p.id}</td>
                    <td className="py-3.5 px-4 text-white">{p.userEmail}</td>
                    <td className="py-3.5 px-4 font-bold text-cyan-400">{p.method}</td>
                    <td className="py-3.5 px-4 text-dark-light truncate max-w-xs">{p.destination}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">${p.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-dark-card border border-dark-border font-bold text-[10px]">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {dbTableSelect === 'LOGS' && sheetLogs.map((s, idx) => (
                  <tr key={idx} className="hover:bg-dark-card/50 transition-colors">
                    <td className="py-3.5 px-4 text-brand-300 font-bold">{s.submissionId}</td>
                    <td className="py-3.5 px-4 text-dark-muted">{s.timestamp}</td>
                    <td className="py-3.5 px-4 text-white">{s.userEmail}</td>
                    <td className="py-3.5 px-4">{s.taskType}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{s.subreddit}</td>
                    <td className="py-3.5 px-4 text-cyan-400 truncate max-w-xs">{s.proofUrl}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUBTAB: TASK CREATION, EDIT & DELETION ENGINE */}
      {activeBackendSubtab === 'CREATE_TASK' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-brand-400" />
                6-Hour Task Creation Engine
              </h3>
              <p className="text-xs text-dark-muted">
                Pasting a target Reddit link automatically parses the subreddit name (`r/sub`).
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Task Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTaskType('REDDIT_COMMENT');
                      setRewardInput(globalRates.commentRate);
                    }}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      taskType === 'REDDIT_COMMENT'
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                        : 'bg-dark-bg text-dark-muted border-dark-border'
                    }`}
                  >
                    Reddit Comment Task (${globalRates.commentRate.toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTaskType('REDDIT_POST');
                      setRewardInput(globalRates.postRate);
                    }}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      taskType === 'REDDIT_POST'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-dark-bg text-dark-muted border-dark-border'
                    }`}
                  >
                    Reddit Post Task (${globalRates.postRate.toFixed(2)})
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-dark-light">Target Reddit URL</label>
                  {subredditInput && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Wand2 className="w-3.5 h-3.5" /> Auto-Detected: {subredditInput}
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://www.reddit.com/r/technology/comments/..."
                  value={targetPostUrlInput}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-light">Subreddit (e.g. r/technology)</label>
                  <input
                    type="text"
                    required
                    placeholder="r/technology"
                    value={subredditInput}
                    onChange={(e) => setSubredditInput(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-light">Reward Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={rewardInput}
                    onChange={(e) => setRewardInput(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Public Pre-Claim Teaser Snippet</label>
                <input
                  type="text"
                  placeholder="Drop an insightful comment on web3 micro-tasks..."
                  value={teaserTextInput}
                  onChange={(e) => setTeaserTextInput(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Exact Required Copy Text</label>
                <textarea
                  rows={3}
                  required
                  placeholder="The exact text user must copy and paste on Reddit..."
                  value={contentToPostInput}
                  onChange={(e) => setContentToPostInput(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Google Drive Link (Post Images / Assets)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={driveLinkInput}
                  onChange={(e) => setDriveLinkInput(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-orange transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Publish Task to Live Marketplace
              </button>

            </form>
          </div>

          {/* Active Tasks Sidebar with Edit & Delete */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Active Tasks ({tasks.length})
              </h4>
              <div className="space-y-2.5 max-h-96 overflow-auto pr-1">
                {tasks.length === 0 ? (
                  <p className="text-xs text-dark-muted italic py-4 text-center">No active tasks in database.</p>
                ) : (
                  tasks.map(t => (
                    <div key={t.id} className="p-3 rounded-2xl bg-dark-bg border border-dark-border text-xs flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-white block">{t.subreddit}</span>
                        <span className="text-[10px] text-dark-muted">{t.type} • ${t.reward.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingTask(t)}
                          className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all"
                          title="Edit Task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTaskConfirm(t.id, t.subreddit)}
                          className="p-2 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-all"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB: GMAIL ROLE WHITELIST */}
      {activeBackendSubtab === 'GMAIL_AUTH' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-3xl bg-dark-card border border-amber-500/30 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Authorized Admin Gmail Whitelist
              </h3>
              <p className="text-xs text-dark-muted">
                Gmail addresses with full ADMIN control center privileges.
              </p>
            </div>

            <form onSubmit={handleAddAdminEmail} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="admin.gmail@gmail.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Admin
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {authorizedAdmins.map(email => (
                <div key={email} className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-300 font-bold">{email}</span>
                  <button
                    onClick={() => removeAuthorizedAdmin(email)}
                    className="p-1 rounded text-dark-muted hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-dark-card border border-purple-500/30 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Authorized Moderator Gmail Whitelist
              </h3>
              <p className="text-xs text-dark-muted">
                Gmail addresses with MODERATOR moderation & creation privileges.
              </p>
            </div>

            <form onSubmit={handleAddModEmail} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="mod.gmail@gmail.com"
                value={newModEmail}
                onChange={(e) => setNewModEmail(e.target.value)}
                className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Mod
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {authorizedMods.map(email => (
                <div key={email} className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between text-xs">
                  <span className="font-mono text-purple-300 font-bold">{email}</span>
                  <button
                    onClick={() => removeAuthorizedMod(email)}
                    className="p-1 rounded text-dark-muted hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB: MANUAL PAYOUT SETTLEMENT HUB */}
      {activeBackendSubtab === 'PAYOUTS' && (
        <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Manual Payout Approval & Settlement Hub
            </h3>
            <p className="text-xs text-dark-muted">
              Review withdrawal requests, copy UPI / Crypto addresses, and settle user balances.
            </p>
          </div>

          <div className="rounded-2xl border border-dark-border bg-dark-bg overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-dark-card border-b border-dark-border text-dark-muted font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Payout ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Destination Address</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/60">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-dark-muted font-mono">
                      No payout requests in system.
                    </td>
                  </tr>
                ) : (
                  payouts.map(p => (
                    <tr key={p.id} className="hover:bg-dark-card/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-brand-300 font-semibold">{p.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-white block">{p.userName}</span>
                        <span className="text-[10px] text-dark-muted">{p.userEmail}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          p.method === 'UPI' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white text-xs truncate max-w-xs">{p.destination}</span>
                          <button
                            onClick={() => copyToClipboard(p.destination, p.id)}
                            className="p-1.5 rounded bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-colors"
                          >
                            {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-400">{formatAmount(p.amount)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          p.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          p.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => rejectPayout(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/25 transition-all"
                            >
                              Reject & Refund
                            </button>
                            <button
                              onClick={() => markPayoutPaid(p.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-glow-green transition-all"
                            >
                              Mark as Paid
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-dark-muted italic">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Embedded Live Google Sheets Logs Modal */}
      {showSheetsModal && (
        <GoogleSheetsPreviewModal onClose={() => setShowSheetsModal(false)} />
      )}

      {/* AI Agent Memory Base Learning Modal */}
      <AIMemoryBaseModal
        isOpen={showMemoryModal}
        onClose={() => setShowMemoryModal(false)}
      />

      {/* Live Task Edit Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

    </div>
  );
}
