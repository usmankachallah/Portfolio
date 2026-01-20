
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Origins from './components/Origins';
import Manifesto from './components/Manifesto';
import System from './components/System';
import Connect from './components/Connect';
import ProjectModal from './components/ProjectModal';
import AiChat from './components/AiChat';
import Background from './components/Background';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import NotFound from './components/NotFound';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { 
    isAdminView, 
    isAuthenticated,
    toggleAdmin, 
    selectedProject, 
    setSelectedProject, 
    isChatOpen, 
    toggleChat 
  } = useStore();

  const [is404, setIs404] = useState(false);

  useEffect(() => {
    // Simple path-based routing detection
    const checkPath = () => {
      const path = window.location.pathname;
      
      // Allow root and /admin paths
      if (path === '/admin') {
        if (!isAdminView) toggleAdmin();
        setIs404(false);
      } else if (path !== '/' && path !== '') {
        setIs404(true);
      } else {
        setIs404(false);
      }
    };

    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, [isAdminView, toggleAdmin]);

  // 404 View
  if (is404) {
    return <NotFound />;
  }

  // Admin View Logic with Login Protection
  if (isAdminView) {
    if (!isAuthenticated) {
      return <AdminLogin />;
    }
    return (
      <div className="min-h-screen bg-[#02040a] text-cyan-500 font-mono selection:bg-cyan-500 selection:text-black">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-transparent relative ${selectedProject ? 'overflow-hidden' : ''}`}>
      <Background />

      <Navbar onChatToggle={toggleChat} onAdminToggle={toggleAdmin} isAdminView={isAdminView} />
      
      <main className="relative z-10">
        <Hero />
        <Origins />
        <Manifesto onProjectSelect={setSelectedProject} />
        <System />
        <Connect />
      </main>

      <footer className="py-12 border-t border-white/5 text-center relative z-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em]">
            © 2025 USMAN // FRONTEND ARCHITECT // ALL SYSTEMS OPERATIONAL
          </p>
          <button 
            onClick={toggleAdmin}
            className="text-[9px] text-blue-500/40 hover:text-blue-400 transition-colors uppercase tracking-[0.2em] font-bold"
          >
            [ Initiate System Override ]
          </button>
        </div>
      </footer>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
      <AiChat isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default App;
