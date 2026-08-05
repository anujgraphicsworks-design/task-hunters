import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBdjoL_Dy4per5vG6l2-kbZ2bHe4UyGkK0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taskhunters-online.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taskhunters-online",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taskhunters-online.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "200332636361",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:200332636361:web:4431c6e3e1110a21595d18",
  measurementId: "G-LP9CTKH9XE"
};

// Initialize Firebase securely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, googleProvider };
