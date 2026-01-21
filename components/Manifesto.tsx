
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
  const projectsViewMode = useStore((state) => state.projectsViewMode);
  const setProjectsViewMode = useStore((state) => state.setProjectsViewMode);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => tags.add(t)));
    return ['All', ...Array.from(tags).sort()];
  }, [projects]);

  // Filter projects based on selected tag AND search query
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTag && matchesSearch;
    });
  }, [projects, selectedTag, searchQuery]);

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
  }, [selectedTag, searchQuery]);

  useEffect(() => {
    if (!isAutoPlaying || filteredProjects.length <= 1 || projectsViewMode === 'grid') return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, filteredProjects.length, projectsViewMode]);

  if (projects.length === 0) return null;

  return (
    <section id="manifesto" className="min-h-screen py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="flex-1">
            <h2 className={`text-[10px] font-futuristic uppercase tracking-[0.5em] mb-4 transition-colors ${
              theme === 'futuristic' ? 'text-blue-500' : 'text-gray-500'
            }`}>The Work</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-futuristic tracking-tighter uppercase mb-8">DIGITAL MANIFESTO</h3>
            
            {/* Neural Search Input */}
            <div className="relative max-w-md group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder="NEURAL_SEARCH_MODULE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all font-bold ${
                  theme === 'futuristic' ? 'glass' : 'bg-black border-white/10'
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-bold text-gray-600 uppercase tracking-tighter">
                Filtered: {filteredProjects.length}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
            {/* View Mode Toggle */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 glass">
              <button 
                onClick={() => setProjectsViewMode('carousel')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  projectsViewMode === 'carousel' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-white'
                }`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 19h10V5H7v14zm-5-2h4V7H2v10zm16-10v10h4V7h-4z"/>
                </svg>
                Stream
              </button>
              <button 
                onClick={() => setProjectsViewMode('grid')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  projectsViewMode === 'grid' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-white'
                }`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
                </svg>
                Array
              </button>
            </div>

            {/* Carousel Controls (only visible in carousel mode) */}
            {projectsViewMode === 'carousel' && (
              <div className="flex gap-3">
                <button 
                  onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                    theme === 'futuristic' 
                      ? 'glass text-blue-400 border-blue-500/20 hover:border-blue-500/50' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                  disabled={filteredProjects.length <= 1}
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
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tag Filtering UI */}
        <div className="flex flex-wrap gap-2 mb-12">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setIsAutoPlaying(false);
              }}
              className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
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
        
        {/* Project Viewport */}
        <div className="relative min-h-[500px]">
          {filteredProjects.length > 0 ? (
            projectsViewMode === 'carousel' ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {filteredProjects.map((project, idx) => (
                  <div key={project.id} className="animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <ProjectCard 
                      project={project} 
                      onOpen={onProjectSelect} 
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[2.5rem] border-white/5">
              <div className="w-16 h-16 text-gray-700 mb-6">
                 <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h4 className="text-xl font-futuristic text-gray-500 uppercase tracking-widest">No matching modules found</h4>
              <p className="text-xs text-gray-600 mt-2 uppercase tracking-widest">Try adjusting your filter or search query</p>
            </div>
          )}

          {/* Indicators (Carousel only) */}
          {projectsViewMode === 'carousel' && filteredProjects.length > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              {filteredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentIndex(index); setIsAutoPlaying(false); }}
                  className="group relative py-4 flex items-center"
                >
                  <div className={`h-0.5 transition-all duration-500 ${
                    currentIndex === index 
                      ? `w-12 ${theme === 'futuristic' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white'}` 
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
