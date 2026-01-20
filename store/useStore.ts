
import { create } from 'zustand';
import { Project, Skill } from '../types';
import { PROJECTS as INITIAL_PROJECTS, SKILLS as INITIAL_SKILLS } from '../constants';

interface AppState {
  projects: Project[];
  skills: Skill[];
  isAdminView: boolean;
  isAuthenticated: boolean;
  isChatOpen: boolean;
  selectedProject: Project | null;
  session: {
    user: string;
    role: string;
    lastLogin: string;
  };
  
  // Actions
  setProjects: (projects: Project[]) => void;
  deleteProject: (id: string) => void;
  setSkills: (skills: Skill[]) => void;
  updateSkillLevel: (name: string, level: number) => void;
  toggleAdmin: () => void;
  setAuthenticated: (status: boolean) => void;
  logout: () => void;
  toggleChat: () => void;
  setSelectedProject: (project: Project | null) => void;
}

export const useStore = create<AppState>((set) => ({
  projects: INITIAL_PROJECTS,
  skills: INITIAL_SKILLS,
  isAdminView: true, // Set to true by default to open the admin login page
  isAuthenticated: false,
  isChatOpen: false,
  selectedProject: null,
  session: {
    user: 'Usman',
    role: 'Root Architect',
    lastLogin: new Date().toISOString(),
  },

  setProjects: (projects) => set({ projects }),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id)
  })),
  setSkills: (skills) => set({ skills }),
  updateSkillLevel: (name, level) => set((state) => ({
    skills: state.skills.map((s) => s.name === name ? { ...s, level } : s)
  })),
  toggleAdmin: () => set((state) => {
    if (!state.isAdminView) window.scrollTo(0, 0);
    return { isAdminView: !state.isAdminView };
  }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  logout: () => set({ isAuthenticated: false, isAdminView: false }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
