import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import TaskWorkspacePage from './pages/TaskWorkspacePage';
import WalletPage from './pages/WalletPage';
import ModeratorPage from './pages/ModeratorPage';
import AdminPage from './pages/AdminPage';
import BackendControlCenter from './pages/BackendControlCenter';
import ActiveTaskBanner from './components/ActiveTaskBanner';
import AuthModal from './components/AuthModal';
import { useApp } from './context/AppContext';

export default function App() {
  const { activeClaim, isAuthenticated, user, theme } = useApp();
  const [activeTab, setActiveTab] = useState('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Automatically redirect user into platform as soon as authentication state becomes true
  useEffect(() => {
    if (isAuthenticated) {
      setIsAuthModalOpen(false);
      
      if (activeTab === 'landing') {
        if (user.role === 'ADMIN') {
          setActiveTab('backend');
        } else if (user.role === 'MODERATOR') {
          setActiveTab('mod');
        } else {
          setActiveTab('dashboard');
        }
      }
    }
  }, [isAuthenticated, user?.role]);

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleTabChange = (tabName) => {
    if (!isAuthenticated && (tabName === 'dashboard' || tabName === 'wallet' || tabName === 'task' || tabName === 'backend' || tabName === 'admin' || tabName === 'mod')) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' 
        ? 'dark bg-[#0A0D14] text-slate-100 selection:bg-orange-500/30 selection:text-orange-400' 
        : 'bg-[#FAFAFC] text-slate-900 selection:bg-orange-500/20 selection:text-orange-600'
    }`}>
      
      {/* Sticky Top Header */}
      <Header activeTab={activeTab} setActiveTab={handleTabChange} onOpenAuth={handleOpenAuth} />

      {/* Floating Active Task Claim Timer Banner */}
      {activeClaim && activeTab !== 'task' && (
        <ActiveTaskBanner onNavigateToTask={() => handleTabChange('task')} />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'landing' && (
          <LandingPage 
            onExploreTasks={() => handleTabChange('dashboard')} 
            onOpenAuth={handleOpenAuth} 
          />
        )}
        
        {activeTab === 'dashboard' && (
          <DashboardPage 
            setActiveTab={handleTabChange} 
            onOpenAuth={handleOpenAuth} 
          />
        )}

        {activeTab === 'task' && (
          <TaskWorkspacePage 
            setActiveTab={handleTabChange} 
          />
        )}

        {activeTab === 'wallet' && <WalletPage />}

        {activeTab === 'mod' && <ModeratorPage />}

        {activeTab === 'admin' && <AdminPage />}

        {activeTab === 'backend' && <BackendControlCenter />}
      </main>

      {/* App Footer */}
      <Footer />

      {/* Auth Modal Popup */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuth} 
        onSuccess={handleAuthSuccess} 
      />

    </div>
  );
}
