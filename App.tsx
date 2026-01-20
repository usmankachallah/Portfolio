
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Origins from './components/Origins';
import Manifesto from './components/Manifesto';
import System from './components/System';
import Connect from './components/Connect';
import ProjectModal from './components/ProjectModal';
import AiChat from './components/AiChat';
import Background from './components/Background';
import { Project } from './types';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(prev => !prev);

  return (
    <div className={`min-h-screen bg-transparent relative ${selectedProject ? 'overflow-hidden' : ''}`}>
      {/* Dynamic Background Layer */}
      <Background />

      <Navbar onChatToggle={toggleChat} />
      
      <main className="relative z-10">
        <Hero />
        <Origins />
        <Manifesto onProjectSelect={setSelectedProject} />
        <System />
        <Connect />
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-[10px] uppercase tracking-[0.5em] relative z-10">
        <p>© 2025 USMAN // FRONTEND ARCHITECT // ALL SYSTEMS OPERATIONAL</p>
      </footer>

      {/* Modals & AI */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
      <AiChat isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default App;
