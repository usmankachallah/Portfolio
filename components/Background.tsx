
import React from 'react';
import { useStore } from '../store/useStore';

const Background: React.FC = () => {
  const theme = useStore(state => state.theme);

  return (
    <div className={`bg-mesh transition-colors duration-1000 ${theme === 'minimalist' ? 'bg-[#050505]' : ''}`}>
      <div className={`bg-grid transition-opacity duration-1000 ${theme === 'minimalist' ? 'opacity-20' : 'opacity-100'}`}></div>
      <div className="bg-noise"></div>
      
      {/* Visual elements only show in futuristic mode */}
      <div className={`transition-all duration-1000 ${theme === 'futuristic' ? 'opacity-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-500/10"
              style={{
                width: Math.random() * 4 + 'px',
                height: Math.random() * 4 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `drift ${Math.random() * 10 + 10}s infinite linear`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Background;
