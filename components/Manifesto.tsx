
import React from 'react';
import ProjectCard from './ProjectCard';
import { useStore } from '../store/useStore';
import { Project } from '../types';

interface Props {
  onProjectSelect: (project: Project) => void;
}

const Manifesto: React.FC<Props> = ({ onProjectSelect }) => {
  const projects = useStore((state) => state.projects);

  return (
    <section id="manifesto" className="min-h-screen py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-sm font-futuristic text-blue-500 uppercase tracking-[0.5em] mb-4">The Work</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-futuristic">DIGITAL MANIFESTO</h3>
          </div>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
            A showcase of digital products where futuristic aesthetics meet high-performance engineering systems.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="animate-in fade-in slide-in-from-bottom-10" 
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
            >
              <ProjectCard 
                project={project} 
                onOpen={onProjectSelect} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
