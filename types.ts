
export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  challenges: string[];
  solution: string;
  tags: string[];
  image: string;
  liveLink: string;
  sourceLink: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'Frontend' | 'Language' | 'Tool';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
