
import React from 'react';
import { useStore } from '../store/useStore';

const Origins: React.FC = () => {
  const bio = useStore(state => state.bio);

  return (
    <section id="origins" className="min-h-screen py-32 px-6 flex items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass p-2 rounded-[3rem] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000" 
              alt="Usman" 
              className="w-full h-[600px] object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-futuristic text-blue-500 uppercase tracking-[0.5em] mb-4">Discovery</h2>
            <h3 className="text-4xl md:text-6xl font-bold font-futuristic">THE ORIGINS</h3>
          </div>
          
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
            <p>
              {bio}
            </p>
            <p>
              Driven by the intersection of high-fidelity aesthetics and performance engineering, 
              Usman has spent years mastering the art of the React ecosystem. 
              His work is characterized by "Fluid Logic"—the belief that a user interface 
              should feel like a natural extension of human thought.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold font-futuristic text-white mb-1">5+</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Years Active</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-futuristic text-white mb-1">40+</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Deployments</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Origins;
