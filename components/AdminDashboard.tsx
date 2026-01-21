
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore.ts';
import { Project } from '../types.ts';

type AdminTab = 'overview' | 'projects' | 'skills' | 'messages' | 'system' | 'profile' | 'logs' | 'analytics';
type MessageFilter = 'active' | 'archived';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [messageFilter, setMessageFilter] = useState<MessageFilter>('active');
  const [logs, setLogs] = useState<{ time: string; msg: string; type: 'info' | 'warn' | 'crit' }[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const logSystemEvent = (msg: string, type: 'info' | 'warn' | 'crit' = 'info') => {
    const newLog = { 
      time: new Date().toLocaleTimeString(), 
      msg, 
      type 
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileName, profileRole, profileAvatar);
    logSystemEvent(`Identity core updated: ${profileName} // ${profileRole}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
        logSystemEvent(`Local image buffer loaded into identity core: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
    logSystemEvent(`Signal priority recalibrated: ${id} -> ${priority.toUpperCase()}`);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProjectId) {
      updateProject({
        ...projectForm as Project,
        id: editingProjectId,
      });
      logSystemEvent(`Deployment recalibrated: ${projectForm.title}`);
    } else {
      const newProject: Project = {
        ...projectForm as Project,
        id: `proj_${Date.now()}`,
      };
      addProject(newProject);
      logSystemEvent(`New deployment successful: ${newProject.title}`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePurgeProject = (id: string, title: string) => {
    if (confirm(`INITIATE PURGE: Are you sure you want to remove ${title} from the grid?`)) {
      deleteProject(id);
      logSystemEvent(`Deployment purged from grid: ${title}`, 'warn');
    }
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

  const NAV_ITEMS = [
    { 
      id: 'overview', 
      label: 'SYSTEM_OVERVIEW', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      )
    },
    { 
      id: 'analytics', 
      label: 'ANALYTICS_CORE', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z"/>
        </svg>
      )
    },
    { 
      id: 'projects', 
      label: 'DEPLOYMENTS', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      )
    },
    { 
      id: 'skills', 
      label: 'NEURAL_MATRIX', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
        </svg>
      )
    },
    { 
      id: 'messages', 
      label: 'COMM_LOGS', 
      badge: unreadCount,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      )
    },
    { 
      id: 'system', 
      label: 'CORE_CONFIG', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.44c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.44c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'IDENTITY_CORE', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      )
    },
    { 
      id: 'logs', 
      label: 'SECURITY_LOGS', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 3H6c-1.1 0-2 .9-2 2v14c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V9l-7-7zm0 1.5L18.5 10H13V4.5zM17 19H7v-2h10v2zm0-4H7v-2h10v2zm-3-4H7V9h7v2z"/>
        </svg>
      )
    },
  ];

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
          {NAV_ITEMS.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                if (tab.id === 'analytics') logSystemEvent('Telemetry scan sequence initiated.');
              }}
              className={`w-full text-left px-6 py-4 border relative group overflow-hidden transition-all ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                  : 'border-white/5 text-gray-500 hover:border-cyan-500/30'
              }`}
            >
              <div className="relative z-10 flex justify-between items-center text-xs uppercase font-bold tracking-widest">
                <div className="flex items-center gap-3">
                  <span className={`${activeTab === tab.id ? 'text-cyan-400' : 'text-gray-600 group-hover:text-cyan-400/70'} transition-colors`}>
                    {tab.icon}
                  </span>
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

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
              <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                <span className="text-cyan-500">_</span>TELEMETRY_CORE_STREAM
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 border border-white/10 rounded-2xl bg-cyan-500/5 group">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Neural_Traffic</span>
                  <div className="text-3xl font-bold text-white mb-1">12,842</div>
                  <span className="text-[10px] text-green-400 font-mono tracking-tighter flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                    </svg>
                    +12.4% vs prev_epoch
                  </span>
                </div>
                <div className="p-5 border border-white/10 rounded-2xl bg-purple-500/5 group">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Packet_Flow</span>
                  <div className="text-3xl font-bold text-white mb-1">45,109</div>
                  <span className="text-[10px] text-green-400 font-mono tracking-tighter flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                    </svg>
                    +8.2% vs prev_epoch
                  </span>
                </div>
                <div className="p-5 border border-white/10 rounded-2xl bg-red-500/5 group">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Dissipation_Rate</span>
                  <div className="text-3xl font-bold text-white mb-1">24.1%</div>
                  <span className="text-[10px] text-red-400 font-mono tracking-tighter flex items-center gap-1">
                    <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                    </svg>
                    -3.1% (Stability Increased)
                  </span>
                </div>
                <div className="p-5 border border-white/10 rounded-2xl bg-blue-500/5 group">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Sync_Duration</span>
                  <div className="text-3xl font-bold text-white mb-1">04:12</div>
                  <span className="text-[10px] text-blue-400 font-mono tracking-tighter">Avg_Session_Units</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 border border-white/5 rounded-[2rem] bg-black/40 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-30"></div>
                  <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-12 flex justify-between">
                    <span>Active_Neural_Signal_Density</span>
                    <span className="text-gray-600 font-mono text-[9px]">Last_24_Cycles</span>
                  </h3>
                  
                  <div className="flex items-end justify-between h-48 gap-2">
                    {[35, 65, 45, 85, 95, 75, 45, 65, 55, 35, 25, 65, 85, 45, 35, 95, 85, 75, 55, 45, 65, 85, 95, 65].map((h, i) => (
                      <div key={i} className="flex-1 group relative">
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-700 delay-[${i * 20}ms] group-hover:bg-white bg-cyan-500/20`}
                          style={{ height: `${h}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                            {h}k
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6 text-[8px] text-gray-700 font-mono border-t border-white/5 pt-4">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                  </div>
                </div>

                <div className="p-8 border border-white/5 rounded-[2rem] bg-black/40">
                  <h3 className="text-xs font-bold text-purple-500 uppercase tracking-[0.2em] mb-8">Access_Geometries</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">DESKTOP_ACCESS</span>
                        <span className="text-purple-400">65%</span>
                      </div>
                      <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">MOBILE_ACCESS</span>
                        <span className="text-cyan-400">28%</span>
                      </div>
                      <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">NEURAL_DOCK</span>
                        <span className="text-gray-300">7%</span>
                      </div>
                      <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-600" style={{ width: '7%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 p-5 border border-white/5 rounded-2xl bg-white/5">
                    <span className="text-[9px] text-gray-600 uppercase font-black block mb-4 tracking-widest">Top_Ingress_Points</span>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] items-center">
                        <span className="text-gray-500 truncate mr-2">/manifesto</span>
                        <span className="text-white font-mono">14.2k</span>
                      </div>
                      <div className="flex justify-between text-[10px] items-center">
                        <span className="text-gray-500 truncate mr-2">/hero</span>
                        <span className="text-white font-mono">11.8k</span>
                      </div>
                      <div className="flex justify-between text-[10px] items-center">
                        <span className="text-gray-500 truncate mr-2">/system_engine</span>
                        <span className="text-white font-mono">4.1k</span>
                      </div>
                    </div>
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
                <form onSubmit={handleSaveProject} className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-4xl mx-auto pb-20">
                  {editingProjectId && (
                    <div className="p-4 border border-cyan-500/30 bg-cyan-500/10 rounded-xl mb-6 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">ACTIVE_EDIT_MODE: {projectForm.title}</span>
                      <button type="button" onClick={resetProjectForm} className="text-[9px] text-gray-500 hover:text-white uppercase font-bold tracking-widest">Abort_Edit</button>
                    </div>
                  )}

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

                  <div className="space-y-2">
                    <label className="text-[10px] text-cyan-500 uppercase font-bold">Development_Challenges (Comma separated)</label>
                    <input 
                      type="text" 
                      value={projectForm.challenges?.join(', ')}
                      onChange={(e) => setProjectForm({...projectForm, challenges: e.target.value.split(',').map(t => t.trim())})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                      placeholder="Challenge 1, Challenge 2..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-cyan-500 uppercase font-bold">Solution_Matrix</label>
                    <textarea 
                      rows={3}
                      value={projectForm.solution}
                      onChange={(e) => setProjectForm({...projectForm, solution: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none leading-relaxed"
                      placeholder="How were challenges overcome..."
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
                          className="px-4 py-2 border border-cyan-500/30 text-[10px] hover:bg-cyan-500/10 text-cyan-500 transition-colors uppercase font-bold tracking-widest rounded-lg"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handlePurgeProject(project.id, project.title)}
                          className="px-4 py-2 border border-red-500/30 text-[10px] text-red-500 hover:bg-red-500/10 transition-colors uppercase font-bold tracking-widest rounded-lg"
                        >
                          Purge
                        </button>
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
                  <div 
                    onClick={triggerFileInput}
                    className="relative group cursor-pointer"
                  >
                    <img src={profileAvatar} alt="Avatar Preview" className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/30" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                       <svg className="w-6 h-6 text-cyan-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                       </svg>
                       <span className="text-[8px] text-cyan-400 font-bold uppercase">Upload</span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase block mb-1">Avatar_Source_URI</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={profileAvatar.startsWith('data:') ? 'LOCAL_BUFFER_LOADED' : profileAvatar} 
                          onChange={(e) => setProfileAvatar(e.target.value)} 
                          className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-blue-300 focus:outline-none focus:border-cyan-500/50"
                          placeholder="https://..."
                        />
                        <button 
                          type="button"
                          onClick={triggerFileInput}
                          className="px-3 py-2 border border-cyan-500/30 text-[9px] uppercase font-bold text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors"
                        >
                          Local_File
                        </button>
                      </div>
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
