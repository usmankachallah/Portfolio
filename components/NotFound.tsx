
import React, { useEffect, useState } from 'react';
import Background from './Background';

const NotFound: React.FC = () => {
  const [glitchText, setGlitchText] = useState('404');
  
  useEffect(() => {
    const chars = '01X_#!?';
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchText(prev => 
          prev.split('').map(c => Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : c).join('')
        );
        setTimeout(() => setGlitchText('404'), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleReturn = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#030712] selection:bg-red-500 selection:text-white">
      <Background />
      
      <div className="relative z-10 text-center px-6">
        <div className="relative inline-block mb-8">
          <h1 className="text-[12rem] md:text-[18rem] font-bold font-futuristic leading-none text-white opacity-10 select-none">
            {glitchText}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-6xl md:text-8xl font-black font-futuristic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-white to-red-500 animate-pulse">
              SIGNAL_LOST
            </h2>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-red-500/30 bg-red-500/10 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-red-500">Error: Sector_Not_Found</span>
          </div>
          
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            The coordinates you provided point to a void in the neural grid. <br />
            Data packets have been dissipated into the digital ether.
          </p>

          <div className="pt-8 flex flex-col items-center gap-4">
            <button 
              onClick={handleReturn}
              className="group relative px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs rounded-xl overflow-hidden transition-all hover:bg-red-500 hover:text-white"
            >
              <span className="relative z-10">Return to Portal</span>
              <div className="absolute inset-0 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </button>
            
            <div className="mt-12 p-4 glass border-red-500/20 rounded-2xl max-w-xs mx-auto">
               <div className="text-[9px] text-red-400/60 font-mono text-left space-y-1">
                  <div>> TRACERT_LOGS: NULL</div>
                  <div>> GATEWAY_STATUS: TIMEOUT</div>
                  <div>> RECOVERY_PROTOCOL: MANUAL_OVERRIDE_REQUIRED</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical scanning line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-red-500/20 absolute animate-[scan_8s_linear_infinite]"></div>
      </div>

      <style>{`
        @keyframes scan {
          from { top: -10%; }
          to { top: 110%; }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
