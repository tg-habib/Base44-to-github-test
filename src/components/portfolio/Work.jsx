import { useEffect, useRef, useState } from 'react';
import ProjectCard from './ProjectCard';

const DEFAULT_PROJECTS = [
  { id: 1, name: 'Kotha Blog', description: 'Full-stack Bengali blog platform with realtime content', tech_stack: ['Supabase', 'Netlify', 'React'], live_url: '#', visible: true },
  { id: 2, name: 'VoiceMaker Bot', description: 'Telegram bot that converts MP3 files to voice messages', tech_stack: ['Python', 'Telegram API'], live_url: '#', visible: true },
  { id: 3, name: 'FuelPing', description: 'Realtime fuel price alert notification bot', tech_stack: ['Firebase', 'Node.js'], live_url: '#', visible: true },
  { id: 4, name: 'AURA', description: 'Link-in-bio tool with cinematic dark UI', tech_stack: ['React', 'Vite', 'CSS'], live_url: '#', visible: true },
  { id: 5, name: 'NekoGuard', description: 'Telegram group management & moderation bot', tech_stack: ['Python', 'Telegram API'], live_url: '#', visible: true },
  { id: 6, name: 'PhotoPass AI', description: 'Mobile passport photo generator powered by AI', tech_stack: ['AI', 'React', 'Cloudflare'], live_url: '#', visible: true },
];

const CARD_SIZES = ['large', 'small', 'equal', 'equal', 'wide', 'wide'];

export default function Work({ projects }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const displayProjects = projects && projects.length > 0
    ? projects.filter(p => p.visible !== false)
    : DEFAULT_PROJECTS;

  return (
    <section ref={sectionRef} id="work" className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Ghost text */}
      <div className="absolute top-1/3 -left-2 vertical-text opacity-[0.04] pointer-events-none select-none">
        <span className="font-space text-[11px] tracking-[0.2em]" style={{ color: '#1A0A00' }}>tghabib.com</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-space text-[11px] tracking-[0.12em] uppercase mb-4" style={{ color: '#FF6200' }}>
          02 — WORK
        </p>
        <h2
          className={`font-bebas text-6xl md:text-[100px] tracking-wide leading-none mb-14 ${visible ? 'reveal visible' : 'reveal'}`}
          style={{ color: '#1A0A00' }}
        >
          SELECTED<br />PROJECTS
        </h2>

        <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${visible ? 'reveal visible' : 'reveal'}`} style={{ transitionDelay: '0.2s' }}>
          {displayProjects.map((project, i) => (
            <ProjectCard
              key={project.id || i}
              project={project}
              index={i}
              size={CARD_SIZES[i % CARD_SIZES.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}