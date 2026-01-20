
import React from 'react';
import { Project } from '../types';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl max-h-[90vh] glass rounded-[2.5rem] overflow-hidden border border-blue-500/20 flex flex-col md:flex-row shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left: Image/Visuals */}
        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden bg-gray-900">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="md:w-1/2 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-blue-500">
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase font-bold text-blue-400 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-futuristic mb-4 text-white">{project.title}</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              {project.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-10">
            <div>
              <h4 className="text-sm font-futuristic text-blue-500 uppercase tracking-widest mb-3">Key Challenges</h4>
              <ul className="space-y-3">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-futuristic text-blue-500 uppercase tracking-widest mb-3">The Solution</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
            <a 
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white text-black text-center py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-400 transition-colors"
            >
              Launch Live Site
            </a>
            <a 
              href={project.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 glass text-white text-center py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:border-blue-500 transition-colors"
            >
              Access Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
