
import React, { useMemo } from 'react';
import { Project } from '../types';
import { useStore } from '../store/useStore';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  const allProjects = useStore((state) => state.projects);
  const setSelectedProject = useStore((state) => state.setSelectedProject);

  // Calculate related projects based on shared tags
  const relatedProjects = useMemo(() => {
    if (!project) return [];

    return allProjects
      .filter((p) => p.id !== project.id) // Exclude current project
      .map((p) => {
        // Count shared tags
        const sharedTags = p.tags.filter((tag) => project.tags.includes(tag)).length;
        return { project: p, sharedCount: sharedTags };
      })
      .filter((p) => p.sharedCount > 0) // Only include projects with at least one shared tag
      .sort((a, b) => b.sharedCount - a.sharedCount) // Sort by relevance
      .slice(0, 3) // Limit to top 3
      .map((p) => p.project);
  }, [project, allProjects]);

  if (!project) return null;

  const handleSwitchProject = (newProject: Project) => {
    setSelectedProject(newProject);
    // Scroll modal content to top
    const modalContent = document.getElementById('project-modal-content');
    if (modalContent) modalContent.scrollTop = 0;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl max-h-[90vh] glass rounded-[2.5rem] overflow-hidden border border-blue-500/20 flex flex-col md:flex-row shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left: Image/Visuals */}
        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden bg-gray-900 border-b md:border-b-0 md:border-r border-white/5">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div 
          id="project-modal-content"
          className="md:w-1/2 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-blue-500/30 bg-gray-950/50"
        >
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map(tag => (
                <span key={tag} className="text-[9px] uppercase font-bold text-blue-400 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-futuristic mb-4 text-white leading-tight">{project.title}</h2>
            <p className="text-gray-400 leading-relaxed text-lg font-light">
              {project.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 mb-12">
            <div>
              <h4 className="text-[10px] font-futuristic text-blue-500 uppercase tracking-[0.4em] mb-4">Development Protocol</h4>
              <ul className="space-y-4">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 shadow-[0_0_8px_#3b82f6]"></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-futuristic text-blue-500 uppercase tracking-[0.4em] mb-4">The Solution Matrix</h4>
              <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-blue-500/20 pl-6 italic">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="mb-12 pt-10 border-t border-white/5">
              <h4 className="text-[10px] font-futuristic text-gray-500 uppercase tracking-[0.4em] mb-6">Further Exploration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProjects.map((rp) => (
                  <button
                    key={rp.id}
                    onClick={() => handleSwitchProject(rp)}
                    className="group flex items-center gap-4 p-3 glass rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all text-left"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={rp.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white mb-1 truncate">{rp.title}</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest truncate">Shared Tech</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
            <a 
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white text-black text-center py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-blue-400 transition-all shadow-xl active:scale-95"
            >
              Uplink Live Demo
            </a>
            <a 
              href={project.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 glass text-white text-center py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:border-blue-500 transition-all active:scale-95"
            >
              Decrypted Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
