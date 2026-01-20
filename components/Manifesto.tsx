
import React, { useState, useEffect, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import { useStore } from '../store/useStore';
import { Project } from '../types';

interface Props {
  onProjectSelect: (project: Project) => void;
}

const Manifesto: React.FC<Props> = ({ onProjectSelect }) => {
  const projects = useStore((state) => state.projects);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  if (projects.length === 0) return null;

  return (
    <section id="manifesto" className="min-h-screen py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-sm font-futuristic text-blue-500 uppercase tracking-[0.5em] mb-4">The Work</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-futuristic">DIGITAL MANIFESTO</h3>
          </div>
          <div className="flex items-center gap-8">
            <p className="hidden md:block text-gray-400 max-w-xs text-sm leading-relaxed text-right">
              A chronological sequence of high-performance engineering modules.
            </p>
            {/* Carousel Controls */}
            <div className="flex gap-4">
              <button 
                onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
                className="w-12 h-12 glass rounded-full flex items-center justify-center text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500/50 transition-all active:scale-95"
                aria-label="Previous Project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
                className="w-12 h-12 glass rounded-full flex items-center justify-center text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500/50 transition-all active:scale-95"
                aria-label="Next Project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Carousel Viewport */}
        <div className="relative group">
          <div className="overflow-hidden rounded-[2.5rem]">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projects.map((project) => (
                <div key={project.id} className="w-full flex-shrink-0 px-2 md:px-4">
                  <div className="max-w-4xl mx-auto h-full">
                    <ProjectCard 
                      project={project} 
                      onOpen={onProjectSelect} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="mt-12 flex justify-center items-center gap-4">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => { setCurrentIndex(index); setIsAutoPlaying(false); }}
                className="group relative py-4 flex items-center"
              >
                <div className={`h-0.5 transition-all duration-500 ${currentIndex === index ? 'w-12 bg-blue-500' : 'w-6 bg-gray-800 group-hover:bg-gray-600'}`}></div>
                {currentIndex === index && (
                  <div className="absolute -top-1 left-0 right-0 flex justify-center">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Autoplay Status Indicator */}
          <div className="absolute -bottom-8 right-0 flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-bold">Autoscroll</span>
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`w-8 h-4 rounded-full transition-colors relative ${isAutoPlaying ? 'bg-blue-600' : 'bg-gray-800'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isAutoPlaying ? 'left-4.5' : 'left-0.5'}`}></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative side gradients for focus */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-2/3 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none hidden lg:block"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-2/3 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none hidden lg:block"></div>
    </section>
  );
};

export default Manifesto;
