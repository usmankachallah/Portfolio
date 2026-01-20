
import React from 'react';
import { useStore } from '../store/useStore';

interface Props {
  onChatToggle: () => void;
  onAdminToggle: () => void;
  isAdminView: boolean;
}

const Navbar: React.FC<Props> = ({ onChatToggle, onAdminToggle, isAdminView }) => {
  const { theme, toggleTheme } = useStore();

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
      theme === 'futuristic' 
        ? 'glass border-white/10 px-6 py-4' 
        : 'bg-[#0a0a0a]/95 backdrop-blur-md border-white/5 px-6 py-3'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#hero" className={`text-2xl font-bold font-futuristic tracking-tighter transition-all ${
          theme === 'futuristic' ? 'text-blue-500 animate-glow' : 'text-white'
        } hover:opacity-80`}>
          USMAN<span className={theme === 'futuristic' ? 'text-white' : 'text-gray-500'}>.DEV</span>
        </a>
        
        <div className="hidden md:flex space-x-8 text-[10px] uppercase tracking-[0.3em] font-bold">
          <a href="#origins" className="hover:text-blue-400 transition-colors">Origins</a>
          <a href="#manifesto" className="hover:text-blue-400 transition-colors">Manifesto</a>
          <a href="#system" className="hover:text-blue-400 transition-colors">System</a>
          <a href="#connect" className="hover:text-blue-400 transition-colors">Connect</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all border ${
              theme === 'futuristic' 
                ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' 
                : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
            }`}
            title={`Switch to ${theme === 'futuristic' ? 'Minimalist' : 'Futuristic'} Mode`}
          >
            {theme === 'futuristic' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button 
            onClick={onAdminToggle}
            className={`hidden sm:block text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
              theme === 'futuristic' 
                ? 'text-cyan-500 border border-cyan-500/20 hover:text-cyan-400' 
                : 'text-gray-500 border border-white/10 hover:border-white/20'
            }`}
          >
            Admin
          </button>

          <button 
            onClick={onChatToggle}
            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all transform hover:scale-105 ${
              theme === 'futuristic' 
                ? 'bg-blue-600 text-white neo-shadow' 
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            AI Chat
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
