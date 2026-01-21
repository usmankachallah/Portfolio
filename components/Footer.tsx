
import React from 'react';
import { useStore } from '../store/useStore.ts';

interface Props {
  onAdminToggle: () => void;
}

const Footer: React.FC<Props> = ({ onAdminToggle }) => {
  const socialLinks = useStore(state => state.socialLinks);
  const theme = useStore(state => state.theme);

  return (
    <footer className={`relative z-10 pt-24 pb-12 px-6 border-t ${
      theme === 'futuristic' 
        ? 'border-white/5 bg-black/20' 
        : 'border-white/5 bg-[#050505]'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="#hero" className="text-xl font-bold font-futuristic tracking-tighter text-blue-500 mb-6 block transition-all hover:opacity-80">
              USMAN<span className="text-white">.DEV</span>
            </a>
            <p className="text-gray-500 text-[10px] leading-relaxed max-w-[220px] uppercase tracking-wider font-medium">
              Architecting high-performance digital interfaces and neural-grade user experiences for the next generation of the web.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-futuristic text-white uppercase tracking-[0.4em] mb-8 font-black">Core_Sectors</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
              <li><a href="#hero" className="hover:text-blue-400 transition-colors">// Home</a></li>
              <li><a href="#origins" className="hover:text-blue-400 transition-colors">// Origins</a></li>
              <li><a href="#manifesto" className="hover:text-blue-400 transition-colors">// Manifesto</a></li>
              <li><a href="#system" className="hover:text-blue-400 transition-colors">// System</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[10px] font-futuristic text-white uppercase tracking-[0.4em] mb-8 font-black">Uplink_Nodes</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
              {socialLinks.map(link => (
                <li key={link.platform}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    {link.platform.toUpperCase()}
                  </a>
                </li>
              ))}
              <li><a href="#connect" className="hover:text-blue-400 transition-colors">Direct_Signal</a></li>
            </ul>
          </div>

          {/* System */}
          <div>
            <h4 className="text-[10px] font-futuristic text-white uppercase tracking-[0.4em] mb-8 font-black">Terminal_Access</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Grid_Status: Online</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Latency: 14ms</span>
              </div>
              <button 
                onClick={onAdminToggle}
                className="mt-4 text-[10px] uppercase tracking-[0.2em] font-black text-blue-500/40 hover:text-blue-400 transition-colors text-left border border-white/5 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                [ System_Override ]
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-medium">
              © 2025 USMAN // ARCHITECT
            </p>
            <div className="hidden md:flex gap-4 text-[8px] text-gray-800 uppercase tracking-[0.3em] font-black">
              <span>Privacy_Protocol</span>
              <span>Terms_of_Access</span>
            </div>
          </div>
          
          <div className="flex gap-8 text-[9px] text-gray-700 uppercase tracking-[0.2em] font-bold">
            <span className="flex items-center gap-2">
               <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
               Neural_Sync: Verified
            </span>
            <span className="flex items-center gap-2">
               <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
               Build: 0x7E3
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
