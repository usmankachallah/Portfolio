
import { Project, Skill } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Quantum Dashboard',
    description: 'A real-time data visualization platform for high-frequency trading analytics.',
    fullDescription: 'Quantum Dashboard is a cutting-edge analytics tool designed for institutional traders. It processes millions of data points per second to provide sub-millisecond visualizations of market trends.',
    challenges: [
      'Rendering high-frequency data without dropping frames',
      'Implementing complex SVG-based chart interactions',
      'Optimizing React re-renders for deep data structures'
    ],
    solution: 'Used specialized D3.js layers with React refs to bypass the virtual DOM for heavy rendering, combined with Web Workers for data processing.',
    tags: ['React', 'D3.js', 'Tailwind', 'WebWorkers'],
    image: 'https://images.unsplash.com/photo-1551288049-bbda38a5f452?auto=format&fit=crop&q=80&w=800&h=450',
    liveLink: 'https://github.com/google',
    sourceLink: 'https://github.com/google'
  },
  {
    id: '2',
    title: 'Neon Commerce',
    description: 'High-performance headless e-commerce experience with futuristic UI components.',
    fullDescription: 'Neon Commerce redefines the online shopping experience with a focus on speed and immersive UI. It leverages a headless architecture for maximum flexibility.',
    challenges: [
      'Building a custom 3D product viewer',
      'Ensuring 100/100 Lighthouse performance scores',
      'Seamless multi-region state management'
    ],
    solution: 'Architected with Next.js App Router and used Three.js for interactive product visualizations, resulting in a 40% increase in user engagement.',
    tags: ['Next.js', 'TypeScript', 'Three.js', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=450',
    liveLink: 'https://example.com/neon-commerce',
    sourceLink: 'https://github.com/facebook/react'
  },
  {
    id: '3',
    title: 'Neural Portfolio',
    description: 'A generative AI-integrated personal site showing the future of web interaction.',
    fullDescription: 'This very portfolio explores how Large Language Models can act as a bridge between developers and potential clients, providing a personalized interactive experience.',
    challenges: [
      'Integrating Google Gemini API securely',
      'Designing a "cyberpunk-minimalist" design system',
      'Handling real-time streaming AI responses'
    ],
    solution: 'Implemented a custom hook for the Gemini SDK and designed a glassmorphism-heavy UI using Tailwind CSS custom configurations.',
    tags: ['Gemini API', 'React', 'Tailwind', 'Framermotion'],
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800&h=450',
    liveLink: 'https://ai.google.dev/',
    sourceLink: 'https://github.com/google-gemini'
  }
];

export const SKILLS: Skill[] = [
  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'JavaScript', level: 98, category: 'Language' },
  { name: 'HTML/CSS', level: 100, category: 'Language' },
  { name: 'Tailwind CSS', level: 95, category: 'Tool' },
  { name: 'Git/GitHub', level: 85, category: 'Tool' },
  { name: 'Gemini API', level: 80, category: 'Tool' }
];

export const USMAN_BIO = `
Usman is a world-class Senior Frontend Engineer specialized in building high-performance, futuristic user interfaces. 
With deep expertise in React, TypeScript, and modern styling frameworks like Tailwind CSS, he bridges the gap between complex 
backend data and elegant human interaction. He has a passion for AI integration and creative coding.
`;
