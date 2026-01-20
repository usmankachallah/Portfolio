
import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const Connect: React.FC = () => {
  const addMessage = useStore(state => state.addMessage);
  const socialLinks = useStore(state => state.socialLinks);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate encryption/transmission delay
    setTimeout(() => {
      addMessage({
        senderName: formData.name,
        senderEmail: formData.email,
        subject: formData.subject || 'Direct Signal',
        body: formData.message,
        priority: 'medium'
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section id="connect" className="min-h-screen py-32 px-6 flex items-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-blue-500 font-futuristic tracking-[0.5em] uppercase mb-6 text-sm">Synchronize</h2>
          <h3 className="text-5xl md:text-7xl font-bold font-futuristic mb-10 tracking-tighter leading-tight">
            INITIATE <br /> CONNECTION
          </h3>
          <p className="text-gray-400 text-xl mb-12 font-light leading-relaxed max-w-md">
            Available for high-stakes projects and visionary collaborations. 
            The neural link is open for your transmission.
          </p>
          
          <div className="flex gap-6">
            {socialLinks.map(link => (
              <a 
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all transform hover:-translate-y-1"
                aria-label={link.platform}
              >
                <i className={`fab fa-${link.platform.toLowerCase()} text-xl`}></i>
                {link.platform === 'LinkedIn' && <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
                {link.platform === 'GitHub' && <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
                {link.platform === 'X' && <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="glass p-10 md:p-14 rounded-[3rem] border border-blue-500/20 relative overflow-hidden">
          {formStatus === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/30">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-futuristic font-bold mb-4">UPLINK SUCCESSFUL</h4>
              <p className="text-gray-400 font-light">Your signal has been received by the core. <br /> Response pending processing.</p>
              <button 
                onClick={() => setFormStatus('idle')}
                className="mt-10 text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400"
              >
                Send Another Transmission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Identity</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Comm Channel</label>
                  <input 
                    required
                    type="email" 
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Transmission Subject</label>
                <input 
                  type="text" 
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Message Body</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe the collaboration mission..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
              
              <button 
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] neo-shadow flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {formStatus === 'sending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Encrypting...
                  </>
                ) : (
                  'Transmit Signal'
                )}
              </button>
              
              <div className="text-center pt-4">
                <span className="text-[9px] text-gray-700 uppercase tracking-[0.5em] font-bold animate-pulse">
                  Terminal_v4.0.2 // Secure_Handshake
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Connect;
