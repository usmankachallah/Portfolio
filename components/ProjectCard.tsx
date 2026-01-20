
import React from 'react';
import { Project } from '../types';

interface Props {
  project: Project;
  onOpen: (project: Project) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onOpen }) => {
  return (
    <div 
      onClick={() => onOpen(project)}
      className="cursor-pointer glass rounded-2xl overflow-hidden group transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2"
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60"></div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
           <div className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest scale-90 group-hover:scale-100 transition-transform">
              Review Protocol
           </div>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] uppercase font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded backdrop-blur-md border border-blue-500/30">
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="text-[9px] uppercase font-bold bg-white/10 text-gray-300 px-2 py-1 rounded backdrop-blur-md">
              +{project.tags.length - 2}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors font-futuristic">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 group-hover:text-white transition-colors">
          <span>Explore Mission</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
