
import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'skills'>('projects');
  const { 
    projects, 
    deleteProject, 
    skills, 
    updateSkillLevel, 
    toggleAdmin, 
    session 
  } = useStore();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
      {/* Header HUD */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-cyan-500/20 pb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2 flex items-center gap-3">
            <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></span>
            COMMAND_CENTER <span className="text-gray-600 font-light text-xl">v4.0.2</span>
          </h1>
          <p className="text-xs text-cyan-500/60 uppercase tracking-widest">
            Authorized Access: {session.user}_{session.role}
          </p>
        </div>
        <button 
          onClick={toggleAdmin}
          className="px-6 py-2 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
        >
          Term_Session [ESC]
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Uptime', value: '99.98%', color: 'text-cyan-400' },
          { label: 'Core_Load', value: '14%', color: 'text-green-400' },
          { label: 'Deployments', value: projects.length, color: 'text-purple-400' },
          { label: 'Sync_Status', value: 'Active', color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 border-l-2 border-cyan-500/30 rounded-r-xl">
            <div className="text-[10px] uppercase text-gray-500 mb-2">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation */}
        <aside className="lg:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-6 py-4 border ${activeTab === 'projects' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-white/5 text-gray-500 hover:border-cyan-500/30'} transition-all text-xs uppercase font-bold tracking-widest`}
          >
            Project_Log
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`w-full text-left px-6 py-4 border ${activeTab === 'skills' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-white/5 text-gray-500 hover:border-cyan-500/30'} transition-all text-xs uppercase font-bold tracking-widest`}
          >
            Neural_Matrix
          </button>
        </aside>

        {/* Dynamic Panels */}
        <main className="flex-1 glass p-8 rounded-3xl border border-white/5 min-h-[600px]">
          {activeTab === 'projects' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold uppercase tracking-tighter">Active Deployments</h2>
                <button className="text-[10px] bg-cyan-500 text-black px-4 py-2 font-bold hover:bg-cyan-400 transition-colors uppercase">
                  + New_Entry
                </button>
              </div>
              
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-gray-800 overflow-hidden border border-white/10">
                        <img src={project.image} alt="" className="w-full h-full object-cover grayscale opacity-50" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{project.title}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{project.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border border-cyan-500/30 text-[10px] hover:bg-cyan-500/10 uppercase">Edit</button>
                      <button 
                        onClick={() => deleteProject(project.id)}
                        className="px-3 py-1 border border-red-500/30 text-[10px] text-red-500 hover:bg-red-500/10 uppercase"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tighter mb-8">Neural Matrix Config</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map(skill => (
                  <div key={skill.name} className="p-6 border border-white/5 rounded-2xl bg-[#0a0c12]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold uppercase tracking-widest">{skill.name}</span>
                      <span className="text-xs text-cyan-400 font-mono">{skill.level}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={skill.level} 
                      onChange={(e) => updateSkillLevel(skill.name, parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="mt-2 text-[9px] text-gray-600 uppercase tracking-widest">{skill.category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
