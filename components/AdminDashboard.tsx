
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
  const [systemLoad, setSystemLoad] = useState({ cpu: 42, mem: 68 });
  
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

  // Simulate real-time system fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad({
        cpu: Math.floor(40 + Math.random() * 15),
        mem: Math.floor(60 + Math.random() * 10)
      });
    }, 3000);

    const initialLogs = [
      { time: '08:42:11', msg: 'Neural gateway handshake successful.', type: 'info' as const },
      { time: '08:42:15', msg: 'Inbound packet filtering active (Level 4).', type: 'info' as const },
      { time: '09:12:03', msg: 'Attempted unauthorized terminal access detected at IP 192.168.1.1.', type: 'warn' as const },
      { time: '10:05:59', msg: 'Automatic bio-recalibration sequence initiated.', type: 'info' as const },
      { time: '10:45:12', msg: 'CRITICAL: Database core temperature rising. Cooling protocol required.', type: 'crit' as const },
    ];
    setLogs(initialLogs);
    return () => clearInterval(interval);
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

  const CyberPanel: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
    <div className={`relative glass border border-white/10 rounded-2xl overflow-hidden group ${className}`}>
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/40 group-hover:border-cyan-500 transition-colors"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/40 group-hover:border-cyan-500 transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/40 group-hover:border-cyan-500 transition-colors"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/40 group-hover:border-cyan-500 transition-colors"></div>
      
      {title && (
        <div className="bg-white/5 border-b border-white/5 px-6 py-3 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">{title}</span>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 bg-cyan-500/20 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full"></div>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500 font-mono text-gray-400">
      {/* Header HUD */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-cyan-500/20 pb-8 gap-6 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/5 blur-[80px] pointer-events-none"></div>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2 flex items-center gap-3 text-cyan-500 font-futuristic">
            <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
            USMAN_OS <span className="text-gray-600 font-light text-xl tracking-normal">v4.0.2-STABLE</span>
          </h1>
          <div className="flex gap-4">
            <p className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-black">
              Session_ID: {session.user.toUpperCase()}
            </p>
            <p className="text-[10px] text-purple-500/60 uppercase tracking-widest font-black">
              Access_Lvl: {session.role.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-white/10">
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-gray-600 uppercase font-black">Sync_Rate</span>
                <span className="text-xs text-green-400 font-mono">99.9%_OPTIMIZED</span>
              </div>
              <img src={session.avatar} alt="Admin" className="w-12 h-12 rounded-xl border border-cyan-500/30 object-cover shadow-[0_0_15px_rgba(6,182,212,0.1)]" />
           </div>
           <button 
            onClick={logout}
            className="group relative px-6 py-2 border border-red-500/30 text-red-500 hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden rounded-lg"
          >
            <span className="relative z-10">TERM_SESSION</span>
            <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation HUD */}
        <aside className="lg:w-64 space-y-2">
          {NAV_ITEMS.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                if (tab.id === 'analytics') logSystemEvent('Telemetry scan sequence initiated.');
              }}
              className={`w-full text-left px-5 py-4 border relative group overflow-hidden transition-all rounded-xl ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                  : 'border-white/5 text-gray-500 hover:border-cyan-500/30 hover:bg-white/5'
              }`}
            >
              <div className="relative z-10 flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                <div className="flex items-center gap-3">
                  <span className={`${activeTab === tab.id ? 'text-cyan-400' : 'text-gray-600 group-hover:text-cyan-400/70'} transition-colors`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded flex items-center justify-center font-black animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div>}
              </div>
            </button>
          ))}
          
          <div className="mt-12 glass p-6 rounded-2xl border border-white/5 bg-black/40">
             <div className="text-[9px] text-gray-600 mb-6 uppercase tracking-[0.3em] font-black flex justify-between">
               <span>System_Health</span>
               <span className="text-cyan-500">Live</span>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-gray-500">CORE_SYNC</span>
                      <span className="text-cyan-400">{systemLoad.cpu}%</span>
                   </div>
                   <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${systemLoad.cpu}%` }}></div>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-gray-500">NEURAL_LOAD</span>
                      <span className="text-purple-400">{systemLoad.mem}%</span>
                   </div>
                   <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${systemLoad.mem}%` }}></div>
                   </div>
                </div>
             </div>
          </div>
        </aside>

        {/* Dynamic Workspace */}
        <main className="flex-1 min-h-[700px] relative">
          
          {/* Overview View */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CyberPanel title="Total_Deployments" className="bg-cyan-500/5">
                  <div className="flex items-end justify-between">
                    <div className="text-5xl font-black text-white font-futuristic">0{projects.length}</div>
                    <div className="text-[10px] text-cyan-500/60 font-bold mb-1">STABLE</div>
                  </div>
                </CyberPanel>
                <CyberPanel title="Neural_Nodes" className="bg-purple-500/5">
                  <div className="flex items-end justify-between">
                    <div className="text-5xl font-black text-white font-futuristic">{skills.length}</div>
                    <div className="text-[10px] text-purple-500/60 font-bold mb-1">SYNCED</div>
                  </div>
                </CyberPanel>
                <CyberPanel title="Active_Signals" className="bg-green-500/5">
                  <div className="flex items-end justify-between">
                    <div className="text-5xl font-black text-white font-futuristic">{unreadCount}</div>
                    <div className="text-[10px] text-green-500/60 font-bold mb-1">INBOUND</div>
                  </div>
                </CyberPanel>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CyberPanel title="Neural_Data_Stream" className="h-[400px] flex flex-col">
                  <div className="flex-1 space-y-6">
                    {messages.slice(0, 4).map(msg => (
                      <div key={msg.id} className="flex justify-between items-center p-4 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-gray-200 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{msg.senderName}</span>
                          <span className="text-[9px] text-gray-600 font-mono tracking-tighter">{new Date(msg.timestamp).toLocaleDateString()} // SOURCE: {msg.senderEmail}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-black text-gray-700">{msg.priority.toUpperCase()}</span>
                           <span className={`w-2 h-2 rounded-full ${msg.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : msg.priority === 'medium' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'}`}></span>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && <div className="text-[10px] text-gray-700 italic text-center py-20 uppercase tracking-widest font-black">Static. No inbound signals detected.</div>}
                  </div>
                  <button onClick={() => setActiveTab('messages')} className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-[0.4em] transition-all rounded-lg border border-white/5">Expand_Comms_Buffer</button>
                </CyberPanel>

                <CyberPanel title="Neural_Logic_Status">
                  <div className="space-y-8">
                    {skills.slice(0, 5).map(skill => (
                      <div key={skill.name} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black tracking-widest text-gray-500 uppercase">
                          <span>{skill.name}</span>
                          <span className="text-cyan-500 font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setActiveTab('skills')} className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-[0.4em] transition-all rounded-lg border border-white/5">Reconfigure_Matrix</button>
                  </div>
                </CyberPanel>
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Neural_Traffic', value: '12,842', trend: '+12.4%', color: 'cyan' },
                  { label: 'Packet_Flow', value: '45,109', trend: '+8.2%', color: 'purple' },
                  { label: 'Stability_Index', value: '98.9%', trend: '+0.5%', color: 'green' },
                  { label: 'Sync_Time', value: '04:12', trend: '-2.1%', color: 'blue' }
                ].map((stat, i) => (
                  <CyberPanel key={i} className={`bg-${stat.color}-500/5`}>
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-3">{stat.label}</span>
                    <div className="text-3xl font-black text-white font-futuristic mb-1">{stat.value}</div>
                    <span className={`text-[9px] font-mono tracking-tighter flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-blue-400'}`}>
                      {stat.trend} vs PREV_EPOCH
                    </span>
                  </CyberPanel>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CyberPanel title="Neural_Flow_Density" className="lg:col-span-2">
                  <div className="flex items-end justify-between h-56 gap-2">
                    {[35, 65, 45, 85, 95, 75, 45, 65, 55, 35, 25, 65, 85, 45, 35, 95, 85, 75, 55, 45, 65, 85, 95, 65].map((h, i) => (
                      <div key={i} className="flex-1 group relative">
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-700 delay-[${i * 20}ms] group-hover:bg-cyan-400 bg-cyan-500/20`}
                          style={{ height: `${h}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-all font-mono bg-black px-2 py-1 rounded border border-cyan-500/30">
                            {h}k
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8 text-[9px] text-gray-600 font-black uppercase tracking-widest border-t border-white/5 pt-6">
                    <span>00:00</span>
                    <span>SYSTEM_PEAK</span>
                    <span>23:59</span>
                  </div>
                </CyberPanel>

                <CyberPanel title="Ingress_Geometries">
                  <div className="space-y-10 py-4">
                    {[
                      { l: 'MANIFESTO_HUB', v: '65%', c: 'cyan' },
                      { l: 'CORE_ENGINE', v: '28%', c: 'purple' },
                      { l: 'NEURAL_DOCK', v: '7%', c: 'gray' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black tracking-[0.2em]">
                          <span className="text-gray-500">{item.l}</span>
                          <span className={`text-${item.c}-400`}>{item.v}</span>
                        </div>
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                          <div className={`h-full bg-${item.c}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} style={{ width: item.v }}></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-12 p-5 border border-white/10 rounded-2xl bg-black/40">
                      <span className="text-[9px] text-gray-600 uppercase font-black block mb-4 tracking-[0.3em]">Access_Points</span>
                      <div className="space-y-4">
                        {['/manifesto: 14.2k', '/hero_root: 11.8k', '/system_env: 4.1k'].map((pt, i) => (
                          <div key={i} className="flex justify-between text-[10px] font-mono items-center group cursor-default">
                            <span className="text-gray-500 group-hover:text-cyan-500 transition-colors uppercase">{pt.split(':')[0]}</span>
                            <span className="text-white font-black">{pt.split(':')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CyberPanel>
              </div>
            </div>
          )}

          {/* Projects View */}
          {activeTab === 'projects' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 font-futuristic">
                  <span className="text-cyan-500">_</span>{editingProjectId ? 'RECONFIGURE_MODULE' : isAddingProject ? 'INIT_NEW_DEPLOYMENT' : 'DEPLOYED_SYSTEMS'}
                </h2>
                {!isAddingProject && (
                  <button 
                    onClick={() => setIsAddingProject(true)}
                    className="text-[10px] bg-cyan-600 text-black px-8 py-3 font-black hover:bg-cyan-500 transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-lg"
                  >
                    + NEW_DEPLOYMENT
                  </button>
                )}
              </div>

              {isAddingProject ? (
                <CyberPanel title={editingProjectId ? 'EDIT_PROTOCOL' : 'CREATION_PROTOCOL'} className="max-w-4xl mx-auto pb-10">
                  <form onSubmit={handleSaveProject} className="space-y-8 animate-in fade-in zoom-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">Module_Title</label>
                        <input required type="text" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">Visual_Buffer_URI</label>
                        <input required type="text" value={projectForm.image} onChange={(e) => setProjectForm({...projectForm, image: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">System_Abstract</label>
                      <input required type="text" value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">Technical_Specification</label>
                      <textarea required rows={5} value={projectForm.fullDescription} onChange={(e) => setProjectForm({...projectForm, fullDescription: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-all resize-none leading-relaxed font-sans" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">Uplink_URL</label>
                        <input type="text" value={projectForm.liveLink} onChange={(e) => setProjectForm({...projectForm, liveLink: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">Source_Decryption_Key (URL)</label>
                        <input type="text" value={projectForm.sourceLink} onChange={(e) => setProjectForm({...projectForm, sourceLink: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all" />
                      </div>
                    </div>

                    <div className="flex gap-6 pt-6">
                      <button type="submit" className="flex-1 py-5 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded-xl">COMMIT_DEPLOYMENT</button>
                      <button type="button" onClick={resetProjectForm} className="px-10 py-5 border border-white/10 hover:border-red-500/50 text-gray-500 hover:text-red-500 text-[11px] uppercase font-black tracking-[0.3em] transition-all rounded-xl">ABORT_SEQUENCE</button>
                    </div>
                  </form>
                </CyberPanel>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map(project => (
                    <div key={project.id} className="group relative glass p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-cyan-500/5 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-xl bg-black overflow-hidden border border-white/5 group-hover:border-cyan-500/50 transition-colors flex-shrink-0">
                          <img src={project.image} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-lg font-black text-gray-200 group-hover:text-cyan-400 transition-colors font-futuristic uppercase tracking-tight">{project.title}</div>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map(t => (
                              <span key={t} className="text-[8px] font-black uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded text-gray-500 group-hover:text-cyan-500/80 transition-colors">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => startEditProject(project)} className="px-6 py-2 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all rounded-lg">Reconfig</button>
                        <button onClick={() => handlePurgeProject(project.id, project.title)} className="px-6 py-2 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-black transition-all rounded-lg">Purge</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages View */}
          {activeTab === 'messages' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-[700px]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 font-futuristic">
                  <span className="text-cyan-500">_</span>NEURAL_SIGNAL_BUFFER
                </h2>
                <div className="flex bg-black/60 p-1.5 rounded-xl border border-white/10">
                   <button 
                    onClick={() => { setMessageFilter('active'); setSelectedMessageId(null); }}
                    className={`px-6 py-2 text-[10px] uppercase font-black tracking-[0.2em] transition-all rounded-lg ${messageFilter === 'active' ? 'bg-cyan-600 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-cyan-400'}`}
                   >
                    Active
                   </button>
                   <button 
                    onClick={() => { setMessageFilter('archived'); setSelectedMessageId(null); }}
                    className={`px-6 py-2 text-[10px] uppercase font-black tracking-[0.2em] transition-all rounded-lg ${messageFilter === 'archived' ? 'bg-cyan-600 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-cyan-400'}`}
                   >
                    Archived
                   </button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row border border-white/10 rounded-3xl overflow-hidden bg-black/40 shadow-2xl">
                {/* List */}
                <div className="w-full md:w-96 border-r border-white/10 flex flex-col">
                  <div className="p-5 border-b border-white/10 bg-white/5 text-[9px] text-gray-500 uppercase font-black tracking-[0.4em] flex justify-between">
                    <span>{messageFilter}_SIGNALS</span>
                    <span className="text-cyan-500">{filteredMessages.length}_TOTAL</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredMessages.map(msg => (
                      <button 
                        key={msg.id}
                        onClick={() => handleMessageSelect(msg.id)}
                        className={`w-full p-6 border-b border-white/5 text-left transition-all hover:bg-cyan-500/5 relative group flex gap-6 items-stretch ${selectedMessageId === msg.id ? 'bg-cyan-500/10' : ''}`}
                      >
                        <div className={`w-1 flex-shrink-0 rounded-full my-1 ${
                          msg.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                          msg.priority === 'medium' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                          'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
                        }`}></div>
                        
                        <div className="flex-1 min-w-0">
                          {!msg.isRead && !msg.isArchived && <div className="absolute top-6 right-6 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4] animate-pulse"></div>}
                          <div className="flex justify-between items-start mb-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${!msg.isRead ? 'text-cyan-400' : 'text-gray-500'}`}>
                                {msg.senderName}
                             </span>
                             <span className="text-[8px] text-gray-700 font-mono">{new Date(msg.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className={`text-xs font-bold truncate mb-1 ${!msg.isRead ? 'text-white' : 'text-gray-400'}`}>{msg.subject}</div>
                          <div className="text-[10px] text-gray-600 truncate font-mono uppercase tracking-tighter opacity-60">{msg.body}</div>
                        </div>
                      </button>
                    ))}
                    {filteredMessages.length === 0 && <div className="p-20 text-center text-gray-700 text-[10px] uppercase font-black tracking-widest">Buffer_Empty</div>}
                  </div>
                </div>

                {/* Detail */}
                <div className="flex-1 flex flex-col bg-black/60 relative">
                  {selectedMessage ? (
                    <div className="flex flex-col h-full animate-in fade-in duration-500">
                      <div className="p-10 border-b border-white/10 bg-white/5">
                        <div className="flex justify-between items-start">
                          <div className="space-y-6">
                            <h3 className="text-3xl font-black text-white tracking-tighter font-futuristic uppercase">{selectedMessage.subject}</h3>
                            <div className="space-y-2">
                               <div className="text-[10px] font-mono"><span className="text-gray-600 uppercase">Origin_Node:</span> <span className="text-cyan-500">{selectedMessage.senderName} &lt;{selectedMessage.senderEmail}&gt;</span></div>
                               <div className="text-[10px] font-mono"><span className="text-gray-600 uppercase">Ingress_Time:</span> <span className="text-gray-400">{new Date(selectedMessage.timestamp).toLocaleString()}</span></div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                             <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Priority_LVL</span>
                             <div className="flex gap-1.5">
                               {(['low', 'medium', 'high'] as const).map(p => (
                                 <button key={p} onClick={() => handlePriorityChange(selectedMessage.id, p)} className={`w-8 h-8 flex items-center justify-center text-[9px] font-black uppercase rounded-lg border transition-all ${selectedMessage.priority === p ? 'bg-cyan-600 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/5 text-gray-600 hover:text-white hover:border-white/20'}`}>{p[0]}</button>
                               ))}
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-10 flex-1 overflow-y-auto font-sans text-gray-300 text-base leading-relaxed tracking-wide space-y-6">
                         <div className="text-[10px] font-mono text-cyan-500/40 select-none">--- START_ENCRYPTED_SIGNAL ---</div>
                         <div className="whitespace-pre-wrap">{selectedMessage.body}</div>
                         <div className="text-[10px] font-mono text-cyan-500/40 select-none">--- END_ENCRYPTED_SIGNAL ---</div>
                      </div>

                      <div className="p-10 border-t border-white/10 bg-black flex gap-6">
                        {!selectedMessage.isArchived && (
                          <button onClick={() => handleArchive(selectedMessage.id)} className="flex-1 py-5 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.3em] text-[11px] transition-all rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">ARCHIVE_SIGNAL</button>
                        )}
                        <button onClick={() => { deleteMessage(selectedMessage.id); setSelectedMessageId(null); }} className={`${selectedMessage.isArchived ? 'flex-1' : 'px-10'} py-5 border border-red-500/30 hover:bg-red-500 hover:text-black text-red-500 text-[11px] uppercase font-black tracking-[0.3em] transition-all rounded-xl`}>PURGE_DATA</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 group">
                      <div className="w-24 h-24 mb-10 text-cyan-500 group-hover:scale-110 transition-transform duration-1000">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.8em] font-black text-white">Awaiting_Neural_Selection</span>
                      <div className="mt-6 w-48 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills View */}
          {activeTab === 'skills' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 font-futuristic">
                <span className="text-cyan-500">_</span>NEURAL_MATRICES_SYNC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skills.map(skill => (
                  <CyberPanel key={skill.name} className="bg-black/40">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex flex-col">
                        <span className="text-lg font-black uppercase tracking-tight text-white font-futuristic">{skill.name}</span>
                        <span className="text-[9px] text-gray-600 uppercase tracking-widest font-black">{skill.category}_SYSTEM</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-cyan-400 font-mono">{skill.level}%</span>
                        <span className="text-[8px] text-cyan-900 font-black uppercase">SYNC_LEVEL</span>
                      </div>
                    </div>
                    <div className="relative pt-6">
                       <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkillLevel(skill.name, parseInt(e.target.value))} className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                       <div className="flex justify-between mt-4 text-[8px] text-gray-700 font-black uppercase tracking-widest">
                          <span>UNINITIALIZED</span>
                          <span>MASTER_LEVEL</span>
                       </div>
                    </div>
                  </CyberPanel>
                ))}
              </div>
            </div>
          )}

          {/* Core System View */}
          {activeTab === 'system' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12 max-w-4xl h-full overflow-y-auto pr-6 custom-scrollbar">
              <CyberPanel title="NARRATIVE_CORE_DUMP">
                <div className="space-y-4">
                   <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">Identity_Manifesto</label>
                   <textarea value={bio} onChange={(e) => updateBio(e.target.value)} rows={6} className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-all resize-none leading-relaxed font-sans" />
                </div>
              </CyberPanel>

              <CyberPanel title="AI_ASSISTANT_NEURAL_LOGIC" className="bg-purple-500/5">
                <div className="space-y-4">
                   <label className="text-[10px] text-purple-500 uppercase font-black tracking-widest ml-1">System_Heuristic_Prompt</label>
                   <textarea value={aiInstruction} onChange={(e) => updateAiInstruction(e.target.value)} rows={8} className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all font-mono leading-relaxed" placeholder="Describe the neural assistant personality and rules..." />
                   <p className="text-[9px] text-gray-700 uppercase font-black tracking-widest px-1">Note: Logic updates are committed to the neural grid on next session handshake.</p>
                </div>
              </CyberPanel>

              <CyberPanel title="NEURAL_COMM_LINKS">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {socialLinks.map(link => (
                    <div key={link.platform} className="space-y-3">
                      <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">{link.platform}_UPLINK</label>
                      <input type="text" value={link.url} onChange={(e) => updateSocialLink(link.platform, e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-xs text-blue-300 focus:outline-none focus:border-cyan-500 font-mono" />
                    </div>
                  ))}
                </div>
              </CyberPanel>
              <div className="pb-20"></div>
            </div>
          )}

          {/* Profile View */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-10 flex items-center gap-2 font-futuristic">
                <span className="text-cyan-500">_</span>IDENTITY_CORE_CONFIG
              </h2>
              <CyberPanel className="bg-black/60">
                <form onSubmit={handleProfileUpdate} className="space-y-12">
                  <div className="flex flex-col md:flex-row items-center gap-12 pb-10 border-b border-white/5">
                    <div onClick={triggerFileInput} className="relative group cursor-pointer w-40 h-40 flex-shrink-0">
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl group-hover:bg-cyan-500/40 transition-all opacity-0 group-hover:opacity-100"></div>
                      <img src={profileAvatar} alt="Avatar" className="relative z-10 w-full h-full rounded-[2rem] object-cover border-2 border-white/10 group-hover:border-cyan-500 transition-all" />
                      <div className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-[2rem]">
                         <svg className="w-10 h-10 text-cyan-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                         </svg>
                         <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">UPLOAD_CORE</span>
                      </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    
                    <div className="flex-1 space-y-6 w-full">
                       <div className="space-y-2">
                          <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Core_Source_URI</label>
                          <input type="text" value={profileAvatar.startsWith('data:') ? 'LOCAL_BUFFER_LOADED' : profileAvatar} onChange={(e) => setProfileAvatar(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs text-blue-300 focus:outline-none focus:border-cyan-500" placeholder="https://..." />
                       </div>
                       <div className="flex justify-end">
                         <button type="button" onClick={triggerFileInput} className="px-6 py-2 border border-cyan-500/20 text-[9px] font-black uppercase rounded-lg text-cyan-500 hover:bg-cyan-500/10 transition-all tracking-[0.2em]">Manual_Handshake</button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">Authorized_Alias</label>
                      <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-cyan-500 uppercase font-black tracking-widest ml-1">System_Role_Assignment</label>
                      <input type="text" value={profileRole} onChange={(e) => setProfileRole(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.3em] text-[11px] transition-all rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">APPLY_IDENTITY_SYNC</button>
                </form>
              </CyberPanel>
            </div>
          )}

          {/* Security Logs View */}
          {activeTab === 'logs' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full space-y-8">
               <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 font-futuristic text-cyan-500">
                  <span className="text-cyan-500">_</span>SYSTEM_EVENT_HISTORY
                </h2>
                <div className="flex-1 bg-black/80 rounded-[2rem] border border-cyan-500/10 p-10 font-mono text-xs overflow-y-auto space-y-4 custom-scrollbar relative shadow-2xl">
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                   {logs.map((log, i) => (
                     <div key={i} className="flex gap-6 group items-start relative z-10">
                        <span className="text-gray-700 flex-shrink-0 font-bold">[{log.time}]</span>
                        <div className="flex gap-3 items-start flex-1">
                          {renderLogIcon(log.type)}
                          <span className={`flex-1 ${
                            log.type === 'crit' ? 'text-red-500 font-black animate-pulse' : 
                            log.type === 'warn' ? 'text-yellow-500' : 
                            'text-cyan-500/70'
                          }`}>
                            {log.type === 'crit' && '>> '} {log.msg}
                          </span>
                        </div>
                     </div>
                   ))}
                   <div className="flex gap-6 animate-pulse items-center relative z-10 pt-4 border-t border-white/5">
                      <span className="text-gray-700 flex-shrink-0 font-bold">[{new Date().toLocaleTimeString()}]</span>
                      <div className="flex gap-3 items-center">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]"></div>
                        <span className="text-cyan-400 font-black uppercase tracking-widest">Listening_for_inbound_packets...</span>
                      </div>
                   </div>
                </div>
            </div>
          )}
        </main>
      </div>
      
      <footer className="mt-20 text-center text-[10px] text-gray-800 uppercase tracking-[0.6em] pb-10 font-black">
        Terminal_v4.0.2 // (c) USMAN_OS_RESOURCES // RESTRICTED_ZONE
      </footer>
    </div>
  );
};

export default AdminDashboard;
