
import React from 'react';
import { useStore } from '../store/useStore';

const Hero: React.FC = () => {
  const theme = useStore(state => state.theme);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Subtle radial lights only in futuristic mode */}
      {theme === 'futuristic' && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:1s]"></div>
        </>
      )}
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h2 className={`font-futuristic tracking-[0.4em] uppercase mb-6 text-[10px] md:text-xs transition-all duration-700 ${
          theme === 'futuristic' ? 'text-blue-500 animate-pulse' : 'text-gray-500'
        }`}>
          Frontend Architect & UI Scientist
        </h2>
        <h1 className={`text-5xl md:text-8xl font-bold font-futuristic leading-tight mb-10 transition-all duration-700 ${
          theme === 'minimalist' ? 'tracking-tighter' : ''
        }`}>
          CRAFTING THE <br />
          <span className={theme === 'futuristic' 
            ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' 
            : 'text-white underline decoration-white/10'}>
            DIGITAL FUTURE
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Hi, I'm <span className="text-white font-semibold">Usman</span>. I transform complex ideas into high-performance 
          web experiences using React, TypeScript, and the latest in {theme === 'futuristic' ? 'futuristic' : 'minimalist'} UI design.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <a href="#manifesto" className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all transform hover:-translate-y-1 ${
            theme === 'futuristic' 
              ? 'bg-white text-black hover:bg-blue-400' 
              : 'bg-white text-black hover:bg-gray-200 shadow-xl'
          }`}>
            View Projects
          </a>
          <a href="#connect" className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all transform hover:-translate-y-1 border ${
            theme === 'futuristic' 
              ? 'glass text-white border-white/10 hover:border-blue-500' 
              : 'bg-transparent text-white border-white/20 hover:border-white'
          }`}>
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
