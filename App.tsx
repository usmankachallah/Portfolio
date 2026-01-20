
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import SkillsSection from './components/SkillsSection';
import AiChat from './components/AiChat';
import Background from './components/Background';
import { PROJECTS } from './constants';
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
        {/* Hero Section */}
        <Hero />

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="animate-in fade-in slide-in-from-left-10 duration-700">
                <h2 className="text-sm font-futuristic text-blue-500 uppercase tracking-[0.5em] mb-4">The Work</h2>
                <h3 className="text-4xl md:text-5xl font-bold font-futuristic">SELECTED DEPLOYMENTS</h3>
              </div>
              <p className="text-gray-400 max-w-sm text-sm leading-relaxed animate-in fade-in slide-in-from-right-10 duration-700">
                A showcase of digital products where futuristic aesthetics meet high-performance engineering systems.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECTS.map((project, index) => (
                <div 
                  key={project.id} 
                  className="animate-in fade-in slide-in-from-bottom-10" 
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
                >
                  <ProjectCard 
                    project={project} 
                    onOpen={setSelectedProject} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <SkillsSection />

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-4xl mx-auto glass p-8 md:p-16 rounded-[2.5rem] text-center border border-blue-500/20 shadow-2xl shadow-blue-500/5 relative overflow-hidden group">
            {/* Subtle internal glow for the contact card */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="text-blue-500 font-futuristic tracking-[0.5em] uppercase mb-6 text-sm">Synchronize</h2>
              <h3 className="text-4xl md:text-6xl font-bold font-futuristic mb-8">INITIATE CONNECTION</h3>
              <p className="text-gray-400 text-lg mb-10 font-light">
                Available for high-stakes projects and visionary collaborations. 
                Let's build the interfaces of tomorrow, today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:contact@usman.dev" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all transform hover:scale-105 neo-shadow">
                  Send Transmission
                </a>
                <div className="flex gap-4 justify-center items-center px-4">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                  <span className="text-gray-700">/</span>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                  <span className="text-gray-700">/</span>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">X</a>
                </div>
              </div>
            </div>
          </div>
        </section>
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
