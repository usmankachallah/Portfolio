
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { setAuthenticated, toggleAdmin } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('scanning');
    
    // Artificial delay for futuristic "scanning" effect
    setTimeout(() => {
      if (password === 'usman_root') {
        setStatus('success');
        setTimeout(() => setAuthenticated(true), 800);
      } else {
        setStatus('error');
        setErrorMsg('ACCESS_DENIED: INVALID_CREDENTIALS');
        setPassword('');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02040a] p-6">
      <div className="max-w-md w-full glass p-8 md:p-12 rounded-[2rem] border border-cyan-500/20 relative overflow-hidden">
        {/* Decorative Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              status === 'scanning' ? 'border-cyan-500 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.5)]' :
              status === 'error' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
              status === 'success' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' :
              'border-cyan-500/30'
            }`}>
              <svg className={`w-8 h-8 ${
                status === 'error' ? 'text-red-500' : 
                status === 'success' ? 'text-green-500' : 
                'text-cyan-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 3c1.268 0 2.39.234 3.41.659m-4.74 4.892A1 1 0 0011 9.501V11m2.739-6.394A10.027 10.027 0 0115 12c0 1.291-.245 2.526-.69 3.656m-8.414.304L3.75 20.25" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold font-futuristic tracking-widest text-cyan-400 mb-2 uppercase">
            {status === 'scanning' ? 'Neural_Syncing...' : 'Terminal_Auth'}
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-8 font-bold">
            Project_Usman // System_Lock
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Key..."
                className={`w-full bg-black/40 border-b-2 px-4 py-3 text-center text-sm font-mono tracking-[0.5em] focus:outline-none transition-all ${
                  status === 'error' ? 'border-red-500 text-red-500' :
                  status === 'success' ? 'border-green-500 text-green-500' :
                  'border-cyan-500/30 focus:border-cyan-500 text-cyan-400'
                }`}
                disabled={status === 'scanning' || status === 'success'}
                autoFocus
              />
              {status === 'error' && (
                <div className="absolute -bottom-6 left-0 w-full text-[9px] text-red-500 font-bold uppercase tracking-widest animate-bounce">
                  {errorMsg}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'scanning' || status === 'success'}
              className="w-full py-4 border border-cyan-500/50 text-xs font-bold uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'scanning' ? 'Verifying...' : 'Initialize_Link'}
            </button>
          </form>

          <button
            onClick={toggleAdmin}
            className="mt-8 text-[9px] text-gray-600 hover:text-cyan-500/50 transition-colors uppercase tracking-[0.2em]"
          >
            [ Abort_Auth_Sequence ]
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
