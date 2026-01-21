
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ContactMessage, Project } from '../types';

type AdminTab = 'overview' | 'projects' | 'skills' | 'messages' | 'system' | 'profile' | 'logs';
type MessageFilter = 'active' | 'archived';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [messageFilter, setMessageFilter] = useState<MessageFilter>('active');
  const [logs, setLogs] = useState<{ time: string; msg: string; type: 'info' | 'warn' | 'crit' }[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const { 
    projects, 
    addProject,
    updateProject,
    deleteProject, 
    skills, 
    updateSkillLevel, 
    bio,
    updateBio,
    aiInstruction,
    updateAiInstruction,
    socialLinks,
    updateSocialLink,
    logout, 
    session,
    updateProfile,
    messages,
    deleteMessage,
    markMessageRead,
    archiveMessage,
    updateMessagePriority
  } = useStore();

  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    fullDescription: '',
    image: '',
    liveLink: '',
    sourceLink: '',
    tags: [],
    challenges: [],
    solution: ''
  });

  const [profileName, setProfileName] = useState(session.user);
  const [profileRole, setProfileRole] = useState(session.role);
  const [profileAvatar, setProfileAvatar] = useState(session.avatar);

  const filteredMessages = messages.filter(m => 
    messageFilter === 'active' ? !m.isArchived : m.isArchived
  );

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  useEffect(() => {
    const initialLogs = [
      { time: '08:42:11', msg: 'Neural gateway handshake successful.', type: 'info' as const },
      { time: '08:42:15', msg: 'Inbound packet filtering active (Level 4).', type: 'info' as const },
      { time: '09:12:03', msg: 'Attempted unauthorized terminal access detected at IP 192.168.1.1.', type: 'warn' as const },
      { time: '10:05:59', msg: 'Automatic bio-recalibration sequence initiated.', type: 'info' as const },
      { time: '10:45:12', msg: 'CRITICAL: Database core temperature rising. Cooling protocol required.', type: 'crit' as const },
    ];
    setLogs(initialLogs);
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileName, profileRole, profileAvatar);
    const newLog = { 
      time: new Date().toLocaleTimeString(), 
      msg: `Identity core updated: ${profileName} // ${profileRole}`, 
      type: 'info' as const 
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleMessageSelect = (id: string) => {
    setSelectedMessageId(id);
    markMessageRead(id);
  };

  const handleArchive = (id: string) => {
    archiveMessage(id);
    setSelectedMessageId(null);
  };

  const handlePriorityChange = (id: string, priority: 'low' | 'medium' | 'high') => {
    updateMessagePriority(id, priority);
    const newLog = { 
      time: new Date().toLocaleTimeString(), 
      msg: `Signal priority recalibrated: ${id} -> ${priority.toUpperCase()}`, 
      type: 'info' as const 
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProjectId) {
      updateProject({
        ...projectForm as Project,
        id: editingProjectId,
      });
      const newLog = { 
        time: new Date().toLocaleTimeString(), 
        msg: `Deployment recalibrated: ${projectForm.title}`, 
        type: 'info' as const 
      };
      setLogs(prev => [newLog, ...prev]);
    } else {
      const newProject: Project = {
        ...projectForm as Project,
        id: `proj_${Date.now()}`,
      };
      addProject(newProject);
      const newLog = { 
        time: new Date().toLocaleTimeString(), 
        msg: `New deployment successful: ${newProject.title}`, 
        type: 'info' as const 
      };
      setLogs(prev => [newLog, ...prev]);
    }
    resetProjectForm();
  };

  const resetProjectForm = () => {
    setIsAddingProject(false);
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      description: '',
      fullDescription: '',
      image: '',
      liveLink: '',
      sourceLink: '',
      tags: [],
      challenges: [],
      solution: ''
    });
  };

  const startEditProject = (project: Project) => {
    setProjectForm({
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription,
      image: project.image,
      liveLink: project.liveLink,
      sourceLink: project.sourceLink,
      tags: project.tags,
      challenges: project.challenges,
      solution: project.solution
    });
    setEditingProjectId(project.id);
    setIsAddingProject(true);
  };

  const renderLogIcon = (type: 'info' | 'warn' | 'crit') => {
    switch (type) {
      case 'crit':
        return (
          <svg className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warn':
        return (
          <svg className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const unreadCount = messages.filter(m => !m.isRead && !m.isArchived).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500 font-mono">
      {/* Header HUD */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-cyan-500/20 pb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2 flex items-center gap-3 text-cyan-500">
            <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></span>
            USMAN_OS <span className="text-gray-600 font-light text-xl">v4.0.2</span>
          </h1>
          <p className="text-xs text-cyan-500/60 uppercase tracking-widest">
            Session: {session.user} // UID: {session.role.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-3 pr-6 border-r border-white/10">
              <img src={session.avatar} alt="Admin" className="w-10 h-10 rounded-full border border-cyan-500/30 object-cover" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 uppercase">System Time</span>
                <span className="text-xs text-cyan-400">{new Date().toLocaleTimeString()}</span>
              </div>
           </div>
           <button 
            onClick={logout}
            className="px-6 py-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black transition-all text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation HUD */}
        <aside className="lg:w-72 space-y-2">
          {[
            { id: 'overview', label: 'SYSTEM_OVERVIEW' },
            { id: 'projects', label: 'DEPLOYMENTS' },
            { id: 'skills', label: 'NEURAL_MATRIX' },
            { id: 'messages', label: 'COMM_LOGS', badge: unreadCount },
            { id: 'system', label: 'CORE_CONFIG' },
            { id: 'profile', label: 'IDENTITY_CORE' },
            { id: 'logs', label: 'SECURITY_LOGS' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`w-full text-left px-6 py-4 border relative group overflow-hidden transition-all ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                  : 'border-white/5 text-gray-500 hover:border-cyan-500/30'
              }`}
            >
              <div className="relative z-10 flex justify-between items-center text-xs uppercase font-bold tracking-widest">
                <div className="flex items-center gap-3">
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-cyan-500 text-black text-[8px] px-1.5 py-0.5 rounded-full font-black">
                      {tab.badge}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && <span className="w-1.5 h-1.5 bg-cyan-500 animate-ping"></span>}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
          
          <div className="mt-12 glass p-6 rounded-2xl border border-white/5">
             <div className="text-[10px] text-gray-500 mb-4 uppercase tracking-[0.2em]">Neural Status</div>
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-cyan-500/80">LATENCY</span>
                   <span className="text-xs text-green-400">14MS</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                   <div className="bg-cyan-500 h-full w-[85%] animate-pulse"></div>
                </div>
             </div>
          </div>
        </aside>

        {/* Dynamic Workspace */}
        <main className="flex-1 glass p-8 rounded-3xl border border-white/5 min-h-[650px] relative overflow-hidden bg-black/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full"></div>
          
          {/* Overview View */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
              <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                <span className="text-cyan-500">_</span>CORE_SYSTEM_METRICS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-white/5 rounded-2xl bg-cyan-500/5 flex flex-col gap-4">
                  <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">Total_Deployments</span>
                  <div className="text-4xl font-bold text-white">{projects.length}</div>
                </div>
                <div className="p-6 border border-white/5 rounded-2xl bg-purple-500/5 flex flex-col gap-4">
                  <span className="text-[10px] text-purple-500/60 uppercase tracking-widest font-bold">Neural_Connections</span>
                  <div className="text-4xl font-bold text-white">{skills.length}</div>
                </div>
                <div className="p-6 border border-white/5 rounded-2xl bg-green-500/5 flex flex-col gap-4">
                  <span className="text-[10px] text-green-500/60 uppercase tracking-widest font-bold">Active_Signals</span>
                  <div className="text-4xl font-bold text-white">{unreadCount}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 border border-white/5 rounded-[2rem] bg-black/40">
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-6 flex justify-between">
                    <span>Recent_Signal_Intercepts</span>
                    <button onClick={() => setActiveTab('messages')} className="text-[9px] hover:text-white transition-colors">VIEW_ALL</button>
                  </h3>
                  <div className="space-y-4">
                    {messages.slice(0, 4).map(msg => (
                      <div key={msg.id} className="flex justify-between items-center p-3 border-b border-white/5 hover:bg-white/5 transition-all group">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-300 group-hover:text-cyan-400 transition-colors">{msg.senderName}</span>
                          <span className="text-[9px] text-gray-600 font-mono">{new Date(msg.timestamp).toLocaleDateString()}</span>
                        </div>
                        <span className={`w-1.5 h-1.5 rounded-full ${msg.priority === 'high' ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : msg.priority === 'medium' ? 'bg-yellow-500 shadow-[0_0_5px_#eab308]' : 'bg-blue-500 shadow-[0_0_5px_#3b82f6]'}`}></span>
                      </div>
                    ))}
                    {messages.length === 0 && <div className="text-[10px] text-gray-700 italic">Static. No inbound signals detected.</div>}
                  </div>
                </div>

                <div className="p-8 border border-white/5 rounded-[2rem] bg-black/40">
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-6">Neural_Sync_Status</h3>
                  <div className="space-y-6">
                    {skills.slice(0, 4).map(skill => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                          <span>{skill.name.toUpperCase()}</span>
                          <span className="text-cyan-500">{skill.level}%</span>
                        </div>
                        <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects View */}
          {activeTab === 'projects' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                  <span className="text-cyan-500">_</span>{editingProjectId ? 'RECONFIGURE_MODULE' : isAddingProject ? 'INITIATE_NEW_DEPLOYMENT' : 'DEPLOYED_MODULES'}
                </h2>
                {!isAddingProject && (
                  <button 
                    onClick={() => setIsAddingProject(true)}
                    className="text-[10px] bg-cyan-500 text-black px-6 py-2 font-bold hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    + NEW_DEPLOYMENT
                  </button>
                )}
              </div>

              {isAddingProject ? (
                <form onSubmit={handleSaveProject} className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-bold">Module_Title</label>
                      <input 
                        required
                        type="text" 
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                        placeholder="Enter project name..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-bold">Primary_Visual_URI</label>
                      <input 
                        required
                        type="text" 
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-cyan-500 uppercase font-bold">Abstract_Summary</label>
                    <input 
                      required
                      type="text" 
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                      placeholder="One-sentence hook..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-cyan-500 uppercase font-bold">Technical_Deep_Dive</label>
                    <textarea 
                      required
                      rows={4}
                      value={projectForm.fullDescription}
                      onChange={(e) => setProjectForm({...projectForm, fullDescription: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none leading-relaxed"
                      placeholder="Full project breakdown..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-bold">Uplink_Demo_URL</label>
                      <input 
                        type="text" 
                        value={projectForm.liveLink}
                        onChange={(e) => setProjectForm({...projectForm, liveLink: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                        placeholder="Live site link..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-bold">Source_Decryption_URL</label>
                      <input 
                        type="text" 
                        value={projectForm.sourceLink}
                        onChange={(e) => setProjectForm({...projectForm, sourceLink: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                        placeholder="GitHub repository link..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-cyan-500 uppercase font-bold">Technology_Stack (Comma separated)</label>
                    <input 
                      type="text" 
                      value={projectForm.tags?.join(', ')}
                      onChange={(e) => setProjectForm({...projectForm, tags: e.target.value.split(',').map(t => t.trim())})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                      placeholder="React, TypeScript, Tailwind..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-xl"
                    >
                      {editingProjectId ? 'APPLY_RECONFIG' : 'COMMIT_TO_GRID'}
                    </button>
                    <button 
                      type="button"
                      onClick={resetProjectForm}
                      className="px-10 py-4 border border-white/10 hover:border-red-500/50 text-gray-500 hover:text-red-500 text-[11px] uppercase font-black tracking-[0.2em] transition-all rounded-xl"
                    >
                      ABORT
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {projects.map(project => (
                    <div key={project.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border border-white/5 rounded-xl hover:bg-white/5 transition-all group gap-4">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded bg-black overflow-hidden border border-cyan-500/20 group-hover:border-cyan-500 transition-colors">
                          <img src={project.image} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity grayscale" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">{project.title}</div>
                          <div className="text-[10px] text-gray-600 font-mono mt-1">{project.tags.join(' // ')}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => startEditProject(project)}
                          className="px-4 py-2 border border-cyan-500/30 text-[10px] hover:bg-cyan-500/10 text-cyan-500 transition-colors uppercase font-bold tracking-widest"
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteProject(project.id)} className="px-4 py-2 border border-red-500/30 text-[10px] text-red-500 hover:bg-red-500/10 transition-colors uppercase font-bold tracking-widest">Purge</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages View */}
          {activeTab === 'messages' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                  <span className="text-cyan-500">_</span>INBOUND_COMMUNICATIONS
                </h2>
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                   <button 
                    onClick={() => { setMessageFilter('active'); setSelectedMessageId(null); }}
                    className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all rounded ${messageFilter === 'active' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-cyan-400'}`}
                   >
                    Active
                   </button>
                   <button 
                    onClick={() => { setMessageFilter('archived'); setSelectedMessageId(null); }}
                    className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all rounded ${messageFilter === 'archived' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-cyan-400'}`}
                   >
                    Archived
                   </button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row h-[550px] border border-white/10 rounded-2xl overflow-hidden bg-black/60 shadow-2xl">
                {/* Message List */}
                <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-black/40">
                  <div className="p-4 border-b border-white/10 bg-black/20 text-[10px] text-gray-500 uppercase font-bold tracking-widest flex justify-between">
                    <span>{messageFilter.toUpperCase()} Signals</span>
                    <span>{filteredMessages.length} Total</span>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {filteredMessages.length === 0 ? (
                      <div className="p-12 text-center text-gray-700 text-[10px] uppercase font-bold tracking-widest">No {messageFilter} signals.</div>
                    ) : (
                      filteredMessages.map(msg => (
                        <button 
                          key={msg.id}
                          onClick={() => handleMessageSelect(msg.id)}
                          className={`w-full p-5 border-b border-white/5 text-left transition-all hover:bg-cyan-500/5 relative group flex items-stretch gap-4 ${selectedMessageId === msg.id ? 'bg-cyan-500/10' : ''}`}
                        >
                          {/* Priority Indicator Bar */}
                          <div className={`w-1 flex-shrink-0 rounded-full my-1 ${
                            msg.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                            msg.priority === 'medium' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                            'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
                          }`}></div>
                          
                          <div className="flex-1 min-w-0 py-1">
                            {!msg.isRead && !msg.isArchived && <div className="absolute top-6 right-5 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4] animate-pulse"></div>}
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold tracking-widest transition-colors ${!msg.isRead && !msg.isArchived ? 'text-cyan-400' : 'text-gray-500'}`}>
                                  {msg.senderName.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-[8px] text-gray-700">{new Date(msg.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className={`text-xs font-bold truncate mb-1 ${!msg.isRead && !msg.isArchived ? 'text-white' : 'text-gray-500'}`}>{msg.subject}</div>
                            <div className="text-[10px] text-gray-600 truncate leading-relaxed">{msg.body}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Message Detail */}
                <div className="flex-1 flex flex-col bg-black/20">
                  {selectedMessage ? (
                    <div className="flex flex-col h-full animate-in fade-in duration-300">
                      <div className="p-8 border-b border-white/10 flex flex-col gap-6 bg-black/40">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white tracking-tight mb-4">{selectedMessage.subject}</h3>
                            <div className="grid grid-cols-1 gap-y-2 text-[10px] font-mono">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 uppercase">Origin:</span>
                                <span className="text-cyan-500/80">{selectedMessage.senderName} &lt;{selectedMessage.senderEmail}&gt;</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 uppercase">Timestamp:</span>
                                <span className="text-gray-400">{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">Adjust Priority:</span>
                            <div className="flex bg-black/60 p-1 rounded-lg border border-white/10 gap-1">
                              {(['low', 'medium', 'high'] as const).map((p) => (
                                <button
                                  key={p}
                                  onClick={() => handlePriorityChange(selectedMessage.id, p)}
                                  className={`px-3 py-1 text-[9px] uppercase font-black tracking-widest transition-all rounded ${
                                    selectedMessage.priority === p 
                                      ? p === 'high' ? 'bg-red-500 text-black shadow-[0_0_10px_#ef4444]' :
                                        p === 'medium' ? 'bg-yellow-500 text-black shadow-[0_0_10px_#eab308]' :
                                        'bg-blue-500 text-black shadow-[0_0_10px_#3b82f6]'
                                      : 'text-gray-600 hover:text-white'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-10 flex-1 overflow-y-auto text-gray-300 text-sm leading-loose whitespace-pre-wrap font-light tracking-wide scrollbar-thin">
                        <div className="mb-6 opacity-30 text-[10px] font-mono select-none">--- START_OF_TRANSMISSION ---</div>
                        {selectedMessage.body}
                        <div className="mt-6 opacity-30 text-[10px] font-mono select-none">--- END_OF_TRANSMISSION ---</div>
                      </div>

                      <div className="p-8 border-t border-white/10 bg-black/60 flex gap-6">
                        {!selectedMessage.isArchived && (
                          <button 
                            onClick={() => handleArchive(selectedMessage.id)}
                            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-xl"
                          >
                            ARCHIVE_TRANSMISSION
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            deleteMessage(selectedMessage.id);
                            setSelectedMessageId(null);
                          }}
                          className={`${selectedMessage.isArchived ? 'flex-1' : 'px-8'} py-4 border border-red-500/30 hover:border-red-500/60 text-red-500 text-[11px] uppercase font-black tracking-[0.2em] transition-all rounded-xl`}
                        >
                          PURGE_SIGNAL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-700 p-12 text-center">
                      <div className="w-16 h-16 mb-8 text-cyan-500/10">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.6em] font-black opacity-40">Waiting for {messageFilter} signal selection</span>
                      <div className="mt-4 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills View */}
          {activeTab === 'skills' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold uppercase tracking-tighter mb-10 flex items-center gap-2 text-cyan-400">
                <span className="text-cyan-500">_</span>NEURAL_SYSTOLIC_LEVELS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map(skill => (
                  <div key={skill.name} className="p-6 border border-white/5 rounded-2xl bg-black/40 group hover:border-cyan-500/20 transition-all">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-300 group-hover:text-cyan-400 transition-colors">{skill.name}</span>
                      <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2 py-1 rounded">{skill.level}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkillLevel(skill.name, parseInt(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core System View */}
          {activeTab === 'system' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12 h-full overflow-y-auto pr-4 scrollbar-thin">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-2 text-cyan-400">
                  <span className="text-cyan-500">_</span>NARRATIVE_CORE_DATA
                </h2>
                <div className="space-y-4">
                   <label className="text-[10px] text-cyan-500 uppercase font-bold">System Bio / Narrative</label>
                   <textarea value={bio} onChange={(e) => updateBio(e.target.value)} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none leading-relaxed" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-2 text-purple-400">
                  <span className="text-purple-500">_</span>NEURAL_ASSISTANT_CONFIG
                </h2>
                <div className="space-y-4">
                   <label className="text-[10px] text-purple-500 uppercase font-bold">AI_System_Instruction</label>
                   <textarea 
                    value={aiInstruction} 
                    onChange={(e) => updateAiInstruction(e.target.value)} 
                    rows={6} 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors resize-none leading-relaxed font-mono" 
                    placeholder="Describe how the AI should behave..."
                  />
                  <p className="text-[9px] text-gray-600 uppercase">Warning: Changes to the neural logic will take effect immediately upon next user query.</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-2 text-cyan-400">
                  <span className="text-cyan-500">_</span>NEURAL_COMM_LINKS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                  {socialLinks.map(link => (
                    <div key={link.platform} className="p-5 border border-white/5 rounded-xl bg-black/20">
                      <span className="text-[10px] text-cyan-500 uppercase font-bold mb-4 block">{link.platform} Module</span>
                      <input type="text" value={link.url} onChange={(e) => updateSocialLink(link.platform, e.target.value)} className="w-full bg-black/60 border-b border-white/10 px-2 py-2 text-xs text-blue-300 focus:outline-none focus:border-cyan-500 font-mono" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile View */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
              <h2 className="text-xl font-bold uppercase tracking-tighter mb-10 flex items-center gap-2 text-cyan-400">
                <span className="text-cyan-500">_</span>IDENTITY_CORE_MANAGEMENT
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div className="flex items-center gap-8 mb-12 p-6 border border-cyan-500/10 rounded-2xl bg-cyan-500/5">
                  <div className="relative group">
                    <img src={profileAvatar} alt="Avatar Preview" className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/30" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                       <span className="text-[8px] text-cyan-400 font-bold uppercase">Sync Img</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase block mb-1">Avatar_Source_URI</label>
                      <input 
                        type="text" 
                        value={profileAvatar} 
                        onChange={(e) => setProfileAvatar(e.target.value)} 
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-blue-300 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-cyan-500 uppercase font-bold">Authorized_Entity_Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-cyan-500 uppercase font-bold">System_Rank_Role</label>
                    <input 
                      type="text" 
                      value={profileRole} 
                      onChange={(e) => setProfileRole(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-xl"
                >
                  Apply_Identity_Changes
                </button>
              </form>
            </div>
          )}

          {/* Security Logs View */}
          {activeTab === 'logs' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
               <h2 className="text-xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-2 text-cyan-400">
                  <span className="text-cyan-500">_</span>SECURITY_EVENT_STREAM
                </h2>
                <div className="flex-1 bg-black/60 rounded-2xl border border-white/5 p-6 font-mono text-xs overflow-y-auto space-y-3 custom-scrollbar">
                   {logs.map((log, i) => (
                     <div key={i} className="flex gap-4 group items-start">
                        <span className="text-gray-600 flex-shrink-0">[{log.time}]</span>
                        <div className="flex gap-2 items-start flex-1">
                          {renderLogIcon(log.type)}
                          <span className={`flex-1 ${
                            log.type === 'crit' ? 'text-red-500 animate-pulse' : 
                            log.type === 'warn' ? 'text-yellow-500' : 
                            'text-cyan-500/80'
                          }`}>
                            {log.msg}
                          </span>
                        </div>
                     </div>
                   ))}
                   <div className="flex gap-4 animate-pulse items-center">
                      <span className="text-gray-600 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                        <span className="text-cyan-400">Listening for inbound transmissions...</span>
                      </div>
                   </div>
                </div>
            </div>
          )}
        </main>
      </div>
      
      <footer className="mt-12 text-center text-[9px] text-gray-700 uppercase tracking-[0.5em] pb-8">
        Terminal UI // Build 0x7E3 // Restricted Access Only
      </footer>
    </div>
  );
};

export default AdminDashboard;
