
import React from 'react';

interface Props {
  onChatToggle: () => void;
}

const Navbar: React.FC<Props> = ({ onChatToggle }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#hero" className="text-2xl font-bold font-futuristic tracking-tighter text-blue-500 animate-glow hover:opacity-80 transition-opacity">
          USMAN<span className="text-white">.DEV</span>
        </a>
        <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium">
          <a href="#hero" className="hover:text-blue-400 transition-colors">Origins</a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">Manifesto</a>
          <a href="#skills" className="hover:text-blue-400 transition-colors">System</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">Connect</a>
        </div>
        <button 
          onClick={onChatToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-105 neo-shadow"
        >
          AI Chat
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
