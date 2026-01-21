
import React, { useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Origins from './components/Origins.tsx';
import Manifesto from './components/Manifesto.tsx';
import System from './components/System.tsx';
import Connect from './components/Connect.tsx';
import Footer from './components/Footer.tsx';
import ProjectModal from './components/ProjectModal.tsx';
import AiChat from './components/AiChat.tsx';
import Background from './components/Background.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import { useStore } from './store/useStore.ts';

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

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        if (!isAdminView) toggleAdmin();
      } else if (path === '/' || path === '') {
        if (isAdminView) toggleAdmin();
      }
    };

    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, [isAdminView, toggleAdmin]);

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

      <Footer onAdminToggle={toggleAdmin} />

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
      <AiChat isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default App;
