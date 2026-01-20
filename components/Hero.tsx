
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h2 className="text-blue-500 font-futuristic tracking-[0.3em] uppercase mb-4 text-sm md:text-base animate-pulse">
          Frontend Architect & UI Scientist
        </h2>
        <h1 className="text-5xl md:text-8xl font-bold font-futuristic leading-tight mb-8">
          CRAFTING THE <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">DIGITAL FUTURE</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Hi, I'm <span className="text-white font-semibold">Usman</span>. I transform complex ideas into high-performance 
          web experiences using React, TypeScript, and the latest in futuristic UI design.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#projects" className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-400 transition-all transform hover:-translate-y-1">
            View Projects
          </a>
          <a href="#contact" className="glass px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:border-blue-500 transition-all transform hover:-translate-y-1">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
