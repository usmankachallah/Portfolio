
import React, { useState, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';

const System: React.FC = () => {
  const skills = useStore((state) => state.skills);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const chartData = skills.filter(s => s.category !== 'Tool').map(s => ({
    subject: s.name,
    A: isVisible ? s.level : 0,
    fullMark: 100,
  }));

  return (
    <section 
      id="system" 
      ref={sectionRef}
      className="min-h-screen py-32 px-6 relative flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-16">
          <h2 className="text-sm font-futuristic text-blue-500 uppercase tracking-[0.5em] mb-4">The Engine</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-futuristic">CORE SYSTEM ARCHITECTURE</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="glass p-8 rounded-[3rem] h-[500px] border border-blue-500/10 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Space Grotesk' }} />
                <Radar
                  name="Usman"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                  className="transition-all duration-1000 ease-out"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(skill => (
              <div key={skill.name} className="glass p-6 rounded-2xl flex flex-col justify-between group hover:border-blue-500/30 transition-all border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg font-futuristic tracking-tight">{skill.name}</span>
                  <span className="text-blue-400 text-xs font-mono">{isVisible ? skill.level : 0}%</span>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-[1500ms] ease-out group-hover:shadow-[0_0_15px_#3b82f6]"
                    style={{ width: isVisible ? `${skill.level}%` : '0%' }}
                  ></div>
                </div>
                <div className="mt-4 text-[10px] uppercase text-gray-500 tracking-[0.3em] font-medium">{skill.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default System;
