
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { useStore } from '../store/useStore';
import { Project } from '../types';

interface Props {
  onProjectSelect: (project: Project) => void;
}

const Manifesto: React.FC<Props> = ({ onProjectSelect }) => {
  const projects = useStore((state) => state.projects);
  const theme = useStore((state) => state.theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => tags.add(t)));
    return ['All', ...Array.from(tags).sort()];
  }, [projects]);

  // Filter projects based on selected tag
  const filteredProjects = useMemo(() => {
    if (selectedTag === 'All') return projects;
    return projects.filter(p => p.tags.includes(selectedTag));
  }, [projects, selectedTag]);

  const nextSlide = useCallback(() => {
    if (filteredProjects.length === 0) return;
    setCurrentIndex((prev) => (prev >= filteredProjects.length - 1 ? 0 : prev + 1));
  }, [filteredProjects.length]);

  const prevSlide = useCallback(() => {
    if (filteredProjects.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? filteredProjects.length - 1 : prev - 1));
  }, [filteredProjects.length]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTag]);

  useEffect(() => {
    if (!isAutoPlaying || filteredProjects.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, filteredProjects.length]);

  if (projects.length === 0) return null;

  return (
    <section id="manifesto" className="min-h-screen py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className={`text-[10px] font-futuristic uppercase tracking-[0.5em] mb-4 transition-colors ${
              theme === 'futuristic' ? 'text-blue-500' : 'text-gray-500'
            }`}>The Work</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-futuristic tracking-tighter uppercase">DIGITAL MANIFESTO</h3>
          </div>
          <div className="flex items-center gap-8">
            <p className="hidden md:block text-gray-400 max-w-xs text-xs leading-relaxed text-right uppercase tracking-widest font-bold">
              {filteredProjects.length} Modules in current view.
            </p>
            {/* Carousel Controls */}
            <div className="flex gap-3">
              <button 
                onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  theme === 'futuristic' 
                    ? 'glass text-blue-400 border-blue-500/20 hover:border-blue-500/50' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
                disabled={filteredProjects.length <= 1}
                aria-label="Previous Project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  theme === 'futuristic' 
                    ? 'glass text-blue-400 border-blue-500/20 hover:border-blue-500/50' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
                disabled={filteredProjects.length <= 1}
                aria-label="Next Project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tag Filtering UI */}
        <div className="flex flex-wrap gap-3 mb-12">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setIsAutoPlaying(false);
              }}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                selectedTag === tag
                  ? theme === 'futuristic'
                    ? 'bg-blue-600 text-white neo-shadow border-blue-400'
                    : 'bg-white text-black'
                  : theme === 'futuristic'
                    ? 'glass text-gray-400 border-white/5 hover:border-blue-500/30 hover:text-blue-300'
                    : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* Carousel Viewport */}
        <div className="relative group min-h-[500px]">
          {filteredProjects.length > 0 ? (
            <div className={`overflow-hidden rounded-[2.5rem] transition-all duration-700 ${
              theme === 'minimalist' ? 'bg-[#0a0a0a] border border-white/5' : ''
            }`}>
              <div 
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {filteredProjects.map((project) => (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[2.5rem] border-white/5">
              <div className="w-16 h-16 text-gray-700 mb-6">
                 <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h4 className="text-xl font-futuristic text-gray-500 uppercase tracking-widest">No matching modules found</h4>
              <p className="text-xs text-gray-600 mt-2 uppercase tracking-widest">Select a different neural frequency</p>
            </div>
          )}

          {/* Indicators */}
          {filteredProjects.length > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              {filteredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentIndex(index); setIsAutoPlaying(false); }}
                  className="group relative py-4 flex items-center"
                >
                  <div className={`h-0.5 transition-all duration-500 ${
                    currentIndex === index 
                      ? `w-12 ${theme === 'futuristic' ? 'bg-blue-500' : 'bg-white'}` 
                      : 'w-6 bg-gray-800 group-hover:bg-gray-600'
                  }`}></div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative side gradients */}
      {theme === 'futuristic' && (
        <>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-2/3 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none hidden lg:block"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-2/3 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none hidden lg:block"></div>
        </>
      )}
    </section>
  );
};

export default Manifesto;
