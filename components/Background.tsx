
import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="bg-mesh">
      <div className="bg-grid"></div>
      <div className="bg-noise"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      {/* Floating particles effect using simple divs */}
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
  );
};

export default Background;
