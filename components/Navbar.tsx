
import React from 'react';

interface Props {
  onChatToggle: () => void;
  onAdminToggle: () => void;
  isAdminView: boolean;
}

const Navbar: React.FC<Props> = ({ onChatToggle, onAdminToggle, isAdminView }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#hero" className="text-2xl font-bold font-futuristic tracking-tighter text-blue-500 animate-glow hover:opacity-80 transition-opacity">
          USMAN<span className="text-white">.DEV</span>
        </a>
        <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium">
          <a href="#origins" className="hover:text-blue-400 transition-colors">Origins</a>
          <a href="#manifesto" className="hover:text-blue-400 transition-colors">Manifesto</a>
          <a href="#system" className="hover:text-blue-400 transition-colors">System</a>
          <a href="#connect" className="hover:text-blue-400 transition-colors">Connect</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onAdminToggle}
            className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition-colors border border-cyan-500/20 px-4 py-2 rounded-lg"
          >
            Admin
          </button>
          <button 
            onClick={onChatToggle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-105 neo-shadow"
          >
            AI Chat
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
