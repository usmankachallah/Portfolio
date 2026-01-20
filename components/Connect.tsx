
import React from 'react';

const Connect: React.FC = () => {
  return (
    <section id="connect" className="min-h-screen py-32 px-6 flex items-center">
      <div className="max-w-4xl mx-auto w-full glass p-12 md:p-24 rounded-[4rem] text-center border border-blue-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-all duration-1000"></div>
        
        <div className="relative z-10">
          <h2 className="text-blue-500 font-futuristic tracking-[0.5em] uppercase mb-6 text-sm">Synchronize</h2>
          <h3 className="text-4xl md:text-7xl font-bold font-futuristic mb-10 tracking-tighter">INITIATE CONNECTION</h3>
          <p className="text-gray-400 text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Available for high-stakes projects and visionary collaborations. 
            The neural link is open for your transmission.
          </p>
          
          <div className="flex flex-col items-center gap-10">
            <a href="mailto:contact@usman.dev" className="group relative inline-flex items-center justify-center px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-[0.3em] transition-all transform hover:scale-105 neo-shadow overflow-hidden">
              <span className="relative z-10">Send Transmission</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            
            <div className="flex gap-8 text-sm font-medium uppercase tracking-[0.4em]">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all hover:tracking-[0.6em]">LinkedIn</a>
              <span className="text-gray-800">/</span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all hover:tracking-[0.6em]">GitHub</a>
              <span className="text-gray-800">/</span>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all hover:tracking-[0.6em]">X</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connect;
