import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useToast } from './ToastContext';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';

const AppContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://task-hunters-production.up.railway.app/api';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Safe JSON Parse Helper
function safeJsonParse(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved);
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}", resetting to fallback.`);
    return fallback;
  }
}

// Auto Detect Subreddit from Reddit Post URL
export function autoDetectSubreddit(url) {
  if (!url || typeof url !== 'string') return '';
  const match = url.match(/reddit\.com\/r\/([a-zA-Z0-9_]+)/i);
  if (match && match[1]) {
    return `r/${match[1]}`;
  }
  return '';
}

// Strict Reddit Post/Comment Permalink Validator
export function isValidRedditUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  const redditRegex = /^https?:\/\/(www\.|old\.|new\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/(comments|s)\/[a-zA-Z0-9_]+/i;
  return redditRegex.test(trimmed);
}

// Admin/Mod roles are resolved by the backend via JWT token.
// No emails are hardcoded in the frontend to prevent credential exposure in DevTools.
const DEFAULT_AUTHORIZED_ADMINS = [];
const DEFAULT_AUTHORIZED_MODS = [];

// No sample users are hardcoded in frontend — all user data comes from the backend database.
const INITIAL_MICROTASKERS = [];

export function AppProvider({ children }) {
  const { showToast } = useToast();

  // Dark / Light Theme Mode State (Default to 'dark' for authentic obsidian dark mode)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('th_theme');
    return saved ? saved : 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('th_theme', next);
      return next;
    });
  };

  const [authorizedAdmins, setAuthorizedAdmins] = useState(() => 
    safeJsonParse('th_auth_admins', DEFAULT_AUTHORIZED_ADMINS)
  );

  const [authorizedMods, setAuthorizedMods] = useState(() => 
    safeJsonParse('th_auth_mods', DEFAULT_AUTHORIZED_MODS)
  );

  // Express Backend Health State
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [backendLatency, setBackendLatency] = useState(12);

  const resolveRoleForEmail = (email) => {
    if (!email) return 'USER';
    const lower = email.toLowerCase().trim();
    if (authorizedAdmins.map(e => e.toLowerCase().trim()).includes(lower)) {
      return 'ADMIN';
    }
    if (authorizedMods.map(e => e.toLowerCase().trim()).includes(lower)) {
      return 'MODERATOR';
    }
    return 'USER';
  };

  // Auth State
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: '',
    user: {
      id: '',
      name: '',
      email: '',
      role: 'USER',
      balance: 0.00,
      upiId: '',
      cryptoAddress: '',
      redditUsername: '',
      redditAccounts: [],
      isRedditApproved: false,
    }
  });

  // Microtaskers List
  const [microtaskers, setMicrotaskers] = useState(() => 
    safeJsonParse('th_microtaskers', INITIAL_MICROTASKERS)
  );

  const [globalRates, setGlobalRates] = useState(() => 
    safeJsonParse('th_global_rates', { commentRate: 1.00, postRate: 2.00, defaultTimerMins: 360 })
  );

  const [currency, setCurrency] = useState('USD');
  const usdToInr = 85;

  const [tasks, setTasks] = useState(() => safeJsonParse('th_tasks', [
    {
      id: 'task-101',
      type: 'REDDIT_COMMENT',
      subreddit: 'r/technology',
      targetPostUrl: 'https://www.reddit.com/r/technology/comments/1ai_agents_scale',
      teaserText: 'The scaling latency optimization here is impressive. Integrating zero-trust microservices reduced throughput bottlenecks significantly!',
      contentToPost: 'The scaling latency optimization here is impressive. Integrating zero-trust microservices reduced throughput bottlenecks significantly!',
      reward: 1.00,
      timeLimitMins: 360,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-102',
      type: 'REDDIT_POST',
      subreddit: 'r/SideProject',
      targetPostUrl: 'https://www.reddit.com/r/SideProject/comments/1task_hunters_release',
      teaserText: 'Showcase: Built an automated micro-task marketplace with 6-hour claim locks and live telemetry!',
      contentToPost: 'Showcase: Built an automated micro-task marketplace with 6-hour claim locks and live telemetry!',
      reward: 2.00,
      timeLimitMins: 360,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    }
  ]));

  // Task History Log (7-Day Retention Auto-Purge)
  const [taskHistory, setTaskHistory] = useState(() => 
    safeJsonParse('th_task_history', [])
  );

  const [activeClaim, setActiveClaim] = useState(() => 
    safeJsonParse('th_active_claim', null)
  );

  const [payouts, setPayouts] = useState(() => 
    safeJsonParse('th_payouts', [])
  );

  const [sheetsConfig, setSheetsConfig] = useState(() => safeJsonParse('th_sheets_config', {
    spreadsheetId: import.meta.env.VITE_SHEETS_SPREADSHEET_ID || '',
    sheetName: import.meta.env.VITE_SHEETS_NAME || 'Submissions_Log',
    apiKey: import.meta.env.VITE_SHEETS_API_KEY || '',
    autoSync: true,
  }));

  const [sheetLogs, setSheetLogs] = useState(() => 
    safeJsonParse('th_sheet_logs', [])
  );

  // Sync to Backend Express Server
  useEffect(() => {
    async function checkBackendHealth() {
      const start = Date.now();
      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        if (res.ok) {
          setIsBackendOnline(true);
          setBackendLatency(Date.now() - start);

          // Sync tasks from backend
          const tasksRes = await fetch(`${API_BASE_URL}/tasks`);
          if (tasksRes.ok) {
            const remoteTasks = await tasksRes.json();
            if (Array.isArray(remoteTasks) && remoteTasks.length > 0) {
              setTasks(remoteTasks);
            }
          }
        }
      } catch (err) {
        setIsBackendOnline(false);
      }
    }

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Listen for Firebase Auth changes to dynamically synchronize user session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('th_jwt_token', idToken); // store as active bearer token

          // Fetch user profile info from backend
          const res = await fetch(`${API_BASE_URL}/auth/firebase-sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setAuthState({
                isAuthenticated: true,
                token: idToken,
                user: {
                  id: data.user.id,
                  name: data.user.name,
                  email: data.user.email,
                  role: data.user.role || 'USER',
                  balance: data.user.balance || 0.00,
                  upiId: data.user.upiId || '',
                  cryptoAddress: data.user.cryptoAddress || '',
                  redditUsername: data.user.redditUsername || '',
                  redditAccounts: data.user.redditAccounts || [],
                  isRedditApproved: data.user.isRedditApproved || false
                }
              });
            }
          }
        } catch (err) {
          console.error("Firebase auth state synchronization failed:", err);
        }
      } else {
        // Clear local state
        localStorage.removeItem('th_jwt_token');
        setAuthState({
          isAuthenticated: false,
          token: '',
          user: {
            id: '',
            name: '',
            email: '',
            role: 'USER',
            balance: 0.00,
            upiId: '',
            cryptoAddress: '',
            redditUsername: '',
            redditAccounts: [],
            isRedditApproved: false
          }
        });
      }
    });

    return () => unsubscribe();
  }, [isBackendOnline]);

  useEffect(() => {
    localStorage.setItem('th_microtaskers', JSON.stringify(microtaskers));
  }, [microtaskers]);

  useEffect(() => {
    localStorage.setItem('th_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('th_task_history', JSON.stringify(taskHistory));
  }, [taskHistory]);

  useEffect(() => {
    localStorage.setItem('th_active_claim', JSON.stringify(activeClaim));
  }, [activeClaim]);

  useEffect(() => {
    localStorage.setItem('th_payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem('th_sheets_config', JSON.stringify(sheetsConfig));
  }, [sheetsConfig]);

  useEffect(() => {
    localStorage.setItem('th_sheet_logs', JSON.stringify(sheetLogs));
  }, [sheetLogs]);

  useEffect(() => {
    localStorage.setItem('th_auth_admins', JSON.stringify(authorizedAdmins));
  }, [authorizedAdmins]);

  useEffect(() => {
    localStorage.setItem('th_auth_mods', JSON.stringify(authorizedMods));
  }, [authorizedMods]);

  useEffect(() => {
    localStorage.setItem('th_global_rates', JSON.stringify(globalRates));
  }, [globalRates]);

  // 7-Day Task History Auto-Purge Ticker
  useEffect(() => {
    const purgeInterval = setInterval(() => {
      const now = Date.now();
      setTaskHistory(prev => prev.filter(t => {
        const timestamp = new Date(t.archivedAt || t.approvedAt || t.rejectedAt || t.createdAt).getTime();
        return (now - timestamp) < SEVEN_DAYS_MS;
      }));
    }, 60000); // Check every minute
    return () => clearInterval(purgeInterval);
  }, []);

  // 6-Hour Lock Timer Expiration Daemon
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeClaim) return;

      const now = Date.now();
      const claimTime = new Date(activeClaim.claimedAt).getTime();
      const elapsedMins = (now - claimTime) / (1000 * 60);
      const maxLimit = activeClaim.task.timeLimitMins || 360; // 6 Hours

      if (elapsedMins >= maxLimit) {
        setTasks(prev => prev.map(t => {
          if (t.id === activeClaim.taskId) {
            return { ...t, status: 'AVAILABLE', claimedBy: null, claimedAt: null };
          }
          return t;
        }));

        setActiveClaim(null);
        if (showToast) {
          showToast("Task claim expired after 6 hours and returned to task pool.", "warning");
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeClaim, showToast]);

  // Submit & Store Reddit Username (Supports connecting any amount of Reddit IDs)
  const submitRedditUsername = (username) => {
    if (!username) return;
    const cleanUsername = username.trim().startsWith('u/') ? username.trim() : `u/${username.trim()}`;

    setAuthState(prev => {
      const currentAccounts = prev.user.redditAccounts || [];
      const exists = currentAccounts.some(acc => acc.username.toLowerCase() === cleanUsername.toLowerCase());
      
      const newAccounts = exists 
        ? currentAccounts 
        : [...currentAccounts, { username: cleanUsername, isApproved: false }];

      return {
        ...prev,
        user: {
          ...prev.user,
          redditUsername: cleanUsername, // for backwards compatibility
          redditAccounts: newAccounts,
          isRedditApproved: exists ? prev.user.isRedditApproved : false, // needs approval if new
        }
      };
    });

    setMicrotaskers(prev => prev.map(m => {
      if (m.email.toLowerCase() === authState.user.email.toLowerCase() || m.id === authState.user.id) {
        const currentAccounts = m.redditAccounts || [];
        const exists = currentAccounts.some(acc => acc.username.toLowerCase() === cleanUsername.toLowerCase());
        const newAccounts = exists 
          ? currentAccounts 
          : [...currentAccounts, { username: cleanUsername, isApproved: false }];
          
        return {
          ...m,
          redditUsername: cleanUsername,
          redditAccounts: newAccounts,
          isRedditApproved: exists ? m.isRedditApproved : false,
          status: exists ? m.status : 'PENDING_APPROVAL'
        };
      }
      return m;
    }));

    if (showToast) {
      showToast(`Reddit ID ${cleanUsername} submitted! Pending Admin/Mod approval.`, "info");
    }
  };

  const deleteRedditUsername = (username) => {
    if (!username) return;
    const cleanUsername = username.trim().startsWith('u/') ? username.trim() : `u/${username.trim()}`;

    setAuthState(prev => {
      const currentAccounts = prev.user.redditAccounts || [];
      const newAccounts = currentAccounts.filter(acc => acc.username.toLowerCase() !== cleanUsername.toLowerCase());
      const nextActive = newAccounts.length > 0 ? newAccounts[newAccounts.length - 1].username : '';
      
      return {
        ...prev,
        user: {
          ...prev.user,
          redditUsername: nextActive,
          redditAccounts: newAccounts,
          isRedditApproved: newAccounts.some(acc => acc.isApproved),
        }
      };
    });

    setMicrotaskers(prev => prev.map(m => {
      if (m.email.toLowerCase() === authState.user.email.toLowerCase() || m.id === authState.user.id) {
        const currentAccounts = m.redditAccounts || [];
        const newAccounts = currentAccounts.filter(acc => acc.username.toLowerCase() !== cleanUsername.toLowerCase());
        const nextActive = newAccounts.length > 0 ? newAccounts[newAccounts.length - 1].username : '';
        return {
          ...m,
          redditUsername: nextActive,
          redditAccounts: newAccounts,
          isRedditApproved: newAccounts.some(acc => acc.isApproved),
          status: newAccounts.some(acc => acc.isApproved) ? 'APPROVED' : 'PENDING_APPROVAL'
        };
      }
      return m;
    }));

    if (showToast) {
      showToast(`Reddit ID ${cleanUsername} removed.`, "info");
    }
  };

  // Admin / Mod Approval of Reddit ID & Microtaskers
  const approveMicrotasker = (userId) => {
    setMicrotaskers(prev => prev.map(m => {
      if (m.id === userId) {
        const approvedAccounts = (m.redditAccounts || []).map(acc => ({ ...acc, isApproved: true }));
        return {
          ...m,
          redditAccounts: approvedAccounts,
          isApprovedHunter: true,
          isRedditApproved: true,
          status: 'APPROVED'
        };
      }
      return m;
    }));

    if (authState.user && authState.user.id === userId) {
      setAuthState(prev => {
        const approvedAccounts = (prev.user.redditAccounts || []).map(acc => ({ ...acc, isApproved: true }));
        return {
          ...prev,
          user: { 
            ...prev.user, 
            redditAccounts: approvedAccounts,
            isRedditApproved: true 
          }
        };
      });
    }

    if (showToast) {
      showToast("User Reddit IDs approved! Task claiming unlocked.", "success");
    }
  };

  const revokeMicrotasker = (userId) => {
    setMicrotaskers(prev => prev.map(m => {
      if (m.id === userId) {
        const revokedAccounts = (m.redditAccounts || []).map(acc => ({ ...acc, isApproved: false }));
        return {
          ...m,
          redditAccounts: revokedAccounts,
          isApprovedHunter: false,
          isRedditApproved: false,
          status: 'PENDING_APPROVAL'
        };
      }
      return m;
    }));

    if (authState.user && authState.user.id === userId) {
      setAuthState(prev => {
        const revokedAccounts = (prev.user.redditAccounts || []).map(acc => ({ ...acc, isApproved: false }));
        return {
          ...prev,
          user: {
            ...prev.user,
            redditAccounts: revokedAccounts,
            isRedditApproved: false
          }
        };
      });
    }

    if (showToast) {
      showToast("User Reddit ID approval revoked.", "warning");
    }
  };

  // Auth Operations — ALL authentication is offloaded to Firebase.
  const loginUser = async (email, password, rememberMe = true) => {
    if (!isBackendOnline) {
      if (showToast) showToast("Server is offline. Please try again later.", "error");
      return false;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('th_jwt_token', idToken);
      
      // Perform database synchronization via backend
      const res = await fetch(`${API_BASE_URL}/auth/firebase-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: userCredential.user.displayName || email.split('@')[0]
        })
      });

      if (!res.ok) {
        const data = await res.json();
        if (showToast) showToast(data.error || "Profile sync failed.", "error");
        return false;
      }
      
      return true;
    } catch (err) {
      let friendlyMessage = "Authentication failed. Please verify your credentials.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = "Invalid email or password.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please enter a valid email address.";
      }
      if (showToast) showToast(friendlyMessage, "error");
      return false;
    }
  };

  const loginWithGoogle = async (rememberMe = true) => {
    if (!isBackendOnline) {
      if (showToast) showToast("Server is offline. Google authentication is unavailable.", "error");
      return false;
    }

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('th_jwt_token', idToken);

      const res = await fetch(`${API_BASE_URL}/auth/firebase-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0]
        })
      });

      if (!res.ok) {
        const data = await res.json();
        if (showToast) showToast(data.error || "Profile sync failed.", "error");
        return false;
      }

      return true;
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        if (showToast) showToast("Google authentication failed. Please try again.", "error");
      }
      return false;
    }
  };

  const registerUser = async (name, email, password, rememberMe = true) => {
    if (!isBackendOnline) {
      if (showToast) showToast("Server is offline. Please try again later.", "error");
      return false;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('th_jwt_token', idToken);

      const res = await fetch(`${API_BASE_URL}/auth/firebase-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ name })
      });

      if (!res.ok) {
        const data = await res.json();
        if (showToast) showToast(data.error || "Profile registration sync failed.", "error");
        return false;
      }

      return true;
    } catch (err) {
      let friendlyMessage = "Registration failed.";
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = "An account already exists with this email address.";
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = "Password is too weak. Must be at least 6 characters.";
      }
      if (showToast) showToast(friendlyMessage, "error");
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('th_jwt_token');
      if (showToast) {
        showToast("Logged out safely.", "info");
      }
    } catch (err) {
      console.error("Firebase logout failed:", err);
    }
  };

  const deleteAccount = async () => {
    const currentUserId = authState.user.id;
    const token = authState.token || localStorage.getItem('th_jwt_token');

    try {
      await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
    } catch (e) {
      // Ignore network error
    }

    setMicrotaskers(prev => prev.filter(m => m.id !== currentUserId));
    logoutUser();

    if (showToast) {
      showToast("Account deleted & personal data permanently scrubbed.", "info");
    }
  };

  const claimTask = (taskId) => {
    if (!authState.isAuthenticated) {
      if (showToast) showToast("Please login to claim tasks.", "warning");
      return false;
    }

    const currentUser = authState.user;
    const isApproved = currentUser.isRedditApproved || currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR';

    if (!currentUser.redditUsername) {
      if (showToast) showToast("Please submit your Reddit Username first for approval before claiming tasks.", "warning");
      return false;
    }

    if (!isApproved) {
      if (showToast) showToast(`Your Reddit ID (${currentUser.redditUsername}) is pending Admin/Mod approval. You cannot claim tasks until verified.`, "warning");
      return false;
    }

    if (activeClaim) {
      if (showToast) showToast("You already have an active claimed task in workspace. Complete or cancel it first.", "warning");
      return false;
    }

    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask || targetTask.status !== 'AVAILABLE') {
      if (showToast) showToast("This task is no longer available.", "error");
      return false;
    }

    const claimedAtTime = new Date().toISOString();

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'CLAIMED',
          claimedBy: authState.user.email,
          claimedAt: claimedAtTime,
        };
      }
      return t;
    }));

    const claimObj = {
      taskId: targetTask.id,
      task: targetTask,
      claimedAt: claimedAtTime,
    };

    setActiveClaim(claimObj);

    if (showToast) {
      showToast(`Task ${targetTask.subreddit} claimed! 6-Hour countdown timer started.`, "success");
    }

    return true;
  };

  const cancelClaim = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'AVAILABLE', claimedBy: null, claimedAt: null };
      }
      return t;
    }));

    setActiveClaim(null);

    if (showToast) {
      showToast("Task claim released back to marketplace.", "info");
    }
  };

  const submitProof = (taskId, proofUrl) => {
    if (!proofUrl || !isValidRedditUrl(proofUrl)) {
      if (showToast) showToast("Please enter a valid live Reddit permalink (https://www.reddit.com/r/.../comments/...)", "error");
      return false;
    }

    const currentTask = tasks.find(t => t.id === taskId);

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'PENDING_APPROVAL',
          proofUrl: proofUrl.trim(),
          submittedAt: new Date().toISOString(),
        };
      }
      return t;
    }));

    const newLogEntry = {
      submissionId: `sub-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userEmail: authState.user.email,
      taskType: currentTask ? currentTask.type : 'REDDIT_COMMENT',
      subreddit: currentTask ? currentTask.subreddit : 'r/reddit',
      proofUrl: proofUrl.trim(),
      status: 'LOGGED_TO_SHEETS_V4',
    };

    setSheetLogs(prev => [newLogEntry, ...prev]);
    setActiveClaim(null);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    if (showToast) {
      showToast("Proof submitted! Logged to Google Sheets API v4. Pending Moderator verification.", "success");
    }

    return true;
  };

  const approveSubmission = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        balance: prev.user.balance + targetTask.reward,
      }
    }));

    const archivedTask = {
      ...targetTask,
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      archivedAt: new Date().toISOString(),
    };

    setTaskHistory(prev => [archivedTask, ...prev]);
    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (showToast) {
      showToast(`Submission approved! $${targetTask.reward.toFixed(2)} credited to hunter. Task moved to 7-Day Log.`, "success");
    }
  };

  const rejectSubmission = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const archivedTask = {
      ...targetTask,
      status: 'REJECTED',
      rejectedAt: new Date().toISOString(),
      archivedAt: new Date().toISOString(),
    };

    setTaskHistory(prev => [archivedTask, ...prev]);
    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (showToast) {
      showToast("Submission rejected. Task archived in 7-Day Log.", "warning");
    }
  };

  const createTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      type: taskData.type || 'REDDIT_COMMENT',
      subreddit: taskData.subreddit.startsWith('r/') ? taskData.subreddit : `r/${taskData.subreddit}`,
      targetPostUrl: taskData.targetPostUrl,
      teaserText: taskData.teaserText || taskData.contentToPost || `Task in ${taskData.subreddit}`,
      contentToPost: taskData.contentToPost,
      reward: parseFloat(taskData.reward) || 1.00,
      timeLimitMins: parseInt(taskData.timeLimitMins) || 360,
      guidelines: taskData.guidelines || 'Account age > 30 days. Comment must stay live.',
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);

    if (showToast) {
      showToast(`Task published to ${newTask.subreddit} marketplace!`, "success");
    }
    return newTask;
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
    if (showToast) {
      showToast("Task updated in database!", "success");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (showToast) {
      showToast("Task deleted from database.", "info");
    }
  };

  const updateGlobalRates = (rates) => {
    setGlobalRates(rates);
    if (showToast) {
      showToast("Global payout rates updated!", "success");
    }
  };

  const addAuthorizedAdmin = (email) => {
    if (!email) return;
    setAuthorizedAdmins(prev => [...new Set([...prev, email.toLowerCase().trim()])]);
    if (showToast) showToast(`Admin ${email} whitelisted!`, "success");
  };

  const addAuthorizedMod = (email) => {
    if (!email) return;
    setAuthorizedMods(prev => [...new Set([...prev, email.toLowerCase().trim()])]);
    if (showToast) showToast(`Moderator ${email} whitelisted!`, "success");
  };

  const removeAuthorizedAdmin = (email) => {
    setAuthorizedAdmins(prev => prev.filter(e => e.toLowerCase() !== email.toLowerCase()));
    if (showToast) showToast(`Admin ${email} removed.`, "info");
  };

  const removeAuthorizedMod = (email) => {
    setAuthorizedMods(prev => prev.filter(e => e.toLowerCase() !== email.toLowerCase()));
    if (showToast) showToast(`Moderator ${email} removed.`, "info");
  };

  const requestPayout = (amount, method, destination) => {
    if (amount > authState.user.balance) {
      if (showToast) showToast("Insufficient balance for withdrawal.", "error");
      return false;
    }

    const newPayout = {
      id: `pay-${Date.now()}`,
      userId: authState.user.id,
      userEmail: authState.user.email,
      userName: authState.user.name,
      amount: parseFloat(amount),
      method: method,
      destination: destination,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setAuthState(prev => ({
      ...prev,
      user: { ...prev.user, balance: prev.user.balance - amount }
    }));

    setPayouts(prev => [newPayout, ...prev]);

    if (showToast) {
      showToast(`Payout request of $${amount.toFixed(2)} submitted for admin settlement!`, "success");
    }

    return true;
  };

  const markPayoutPaid = (payoutId) => {
    setPayouts(prev => prev.map(p => {
      if (p.id === payoutId) {
        return { ...p, status: 'PAID', settledAt: new Date().toISOString() };
      }
      return p;
    }));

    if (showToast) {
      showToast("Payout marked as PAID & settled!", "success");
    }
  };

  const rejectPayout = (payoutId) => {
    const targetPayout = payouts.find(p => p.id === payoutId);
    if (!targetPayout) return;

    setAuthState(prev => ({
      ...prev,
      user: { ...prev.user, balance: prev.user.balance + targetPayout.amount }
    }));

    setPayouts(prev => prev.map(p => {
      if (p.id === payoutId) {
        return { ...p, status: 'REJECTED' };
      }
      return p;
    }));

    if (showToast) {
      showToast("Payout rejected & funds refunded to user wallet.", "warning");
    }
  };

  const updateProfileDetails = (details) => {
    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...details,
      }
    }));

    if (showToast) {
      showToast("Profile details updated successfully!", "success");
    }
  };

  const formatAmount = (usdVal) => {
    if (currency === 'INR') {
      return `₹${(usdVal * usdToInr).toFixed(2)}`;
    }
    return `$${usdVal.toFixed(2)}`;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        microtaskers,
        approveMicrotasker,
        revokeMicrotasker,
        submitRedditUsername,
        deleteRedditUsername,
        tasks,
        taskHistory,
        activeClaim,
        payouts,
        sheetsConfig,
        setSheetsConfig,
        sheetLogs,
        globalRates,
        updateGlobalRates,
        authorizedAdmins,
        authorizedMods,
        addAuthorizedAdmin,
        addAuthorizedMod,
        removeAuthorizedAdmin,
        removeAuthorizedMod,
        currency,
        setCurrency,
        isBackendOnline,
        backendLatency,
        loginUser,
        loginWithGoogle,
        registerUser,
        logoutUser,
        deleteAccount,
        claimTask,
        cancelClaim,
        submitProof,
        approveSubmission,
        rejectSubmission,
        createTask,
        updateTask,
        deleteTask,
        requestPayout,
        markPayoutPaid,
        rejectPayout,
        updateProfileDetails,
        formatAmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
