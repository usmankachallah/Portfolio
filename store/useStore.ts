
import { create } from 'zustand';
import { Project, Skill, ContactMessage } from '../types.ts';
import { PROJECTS as INITIAL_PROJECTS, SKILLS as INITIAL_SKILLS, USMAN_BIO } from '../constants.tsx';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

type Theme = 'futuristic' | 'minimalist';

interface AppState {
  projects: Project[];
  skills: Skill[];
  messages: ContactMessage[];
  bio: string;
  aiInstruction: string;
  socialLinks: SocialLink[];
  isAdminView: boolean;
  isAuthenticated: boolean;
  isChatOpen: boolean;
  theme: Theme;
  selectedProject: Project | null;
  session: {
    user: string;
    role: string;
    avatar: string;
    lastLogin: string;
  };
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setSkills: (skills: Skill[]) => void;
  updateSkillLevel: (name: string, level: number) => void;
  updateBio: (newBio: string) => void;
  updateAiInstruction: (instruction: string) => void;
  updateSocialLink: (platform: string, url: string) => void;
  updateProfile: (name: string, role: string, avatar: string) => void;
  addMessage: (message: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead' | 'isArchived'>) => void;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  archiveMessage: (id: string) => void;
  updateMessagePriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
  toggleAdmin: () => void;
  setAuthenticated: (status: boolean) => void;
  logout: () => void;
  toggleChat: () => void;
  toggleTheme: () => void;
  setSelectedProject: (project: Project | null) => void;
}

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg_1',
    senderName: 'Sarah Jenkins',
    senderEmail: 's.jenkins@techcorp.io',
    subject: 'Visionary Project Collaboration',
    body: "Hi Usman, I saw your Quantum Dashboard project and was blown away by the performance. We're looking for a lead frontend architect for a new stealth startup. Are you open to a neural link sync next week?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    isArchived: false,
    priority: 'high'
  },
  {
    id: 'msg_2',
    senderName: 'Marcus Thorne',
    senderEmail: 'marcus@futureui.com',
    subject: 'Open Source Contribution Inquiry',
    body: "Hey! I'm the maintainer of a popular 3D UI library. I'd love to have your expertise on our core team for the v5.0 release focusing on React 19 features.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    isArchived: false,
    priority: 'medium'
  }
];

const DEFAULT_AI_INSTRUCTION = `
You are Usman's personal AI Assistant. Your goal is to represent Usman to potential employers or collaborators.
Usman is a world-class Senior Frontend Engineer specialized in building high-performance, futuristic user interfaces.
Be professional, modern, and slightly futuristic in your tone. 
Keep answers concise and helpful. 
If asked about Usman's skills, mention React, HTML, CSS, and JS prominently.
Always maintain a helpful and tech-forward persona.
`;

export const useStore = create<AppState>((set) => ({
  projects: INITIAL_PROJECTS,
  skills: INITIAL_SKILLS,
  messages: INITIAL_MESSAGES,
  bio: USMAN_BIO,
  aiInstruction: DEFAULT_AI_INSTRUCTION,
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/kachallahfx', icon: 'linkedin' },
    { platform: 'GitHub', url: 'https://github.com/usmankachallah', icon: 'github' },
    { platform: 'X', url: 'https://x.com/kachallahfx', icon: 'twitter' },
  ],
  isAdminView: false,
  isAuthenticated: false,
  isChatOpen: false,
  theme: 'futuristic',
  selectedProject: null,
  session: {
    user: 'Usman',
    role: 'Root Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    lastLogin: new Date().toISOString(),
  },

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (updatedProject) => set((state) => ({
    projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id)
  })),
  setSkills: (skills) => set({ skills }),
  updateSkillLevel: (name, level) => set((state) => ({
    skills: state.skills.map((s) => s.name === name ? { ...s, level } : s)
  })),
  updateBio: (newBio) => set({ bio: newBio }),
  updateAiInstruction: (aiInstruction) => set({ aiInstruction }),
  updateSocialLink: (platform, url) => set((state) => ({
    socialLinks: state.socialLinks.map(link => 
      link.platform === platform ? { ...link, url } : link
    )
  })),
  updateProfile: (name, role, avatar) => set((state) => ({
    session: { ...state.session, user: name, role, avatar }
  })),
  addMessage: (message) => set((state) => ({
    messages: [
      {
        ...message,
        id: `msg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        isArchived: false
      },
      ...state.messages
    ]
  })),
  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter(m => m.id !== id)
  })),
  markMessageRead: (id) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, isRead: true } : m)
  })),
  archiveMessage: (id) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, isArchived: true } : m)
  })),
  updateMessagePriority: (id, priority) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, priority } : m)
  })),
  toggleAdmin: () => set((state) => {
    if (!state.isAdminView) window.scrollTo(0, 0);
    return { isAdminView: !state.isAdminView };
  }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  logout: () => set({ isAuthenticated: false, isAdminView: false }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'futuristic' ? 'minimalist' : 'futuristic' 
  })),
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
