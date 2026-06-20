import { useEffect, useRef, useState } from 'react';

const SKILLS = [
  { name: 'React / Vite', level: 8 },
  { name: 'Firebase', level: 7 },
  { name: 'Supabase', level: 7 },
  { name: 'Netlify', level: 8 },
  { name: 'Python', level: 6 },
  { name: 'Telegram Bot API', level: 9 },
  { name: 'Cloudflare', level: 6 },
  { name: 'CSS Animations', level: 8 },
];

const WORDS = [
  { text: 'Termux', size: 'text-xl', rotation: '-3deg', highlight: true },
  { text: 'Dcoder', size: 'text-lg', rotation: '2deg', highlight: false },
  { text: 'AI-Assisted', size: 'text-2xl', rotation: '-1deg', highlight: true },
  { text: 'Mobile-First', size: 'text-xl', rotation: '3deg', highlight: true },
  { text: 'Self-Taught', size: 'text-3xl', rotation: '-2deg', highlight: false },
  { text: 'Solo Builder', size: 'text-2xl', rotation: '1deg', highlight: true },
  { text: 'Vibe Coder', size: 'text-3xl', rotation: '-4deg', highlight: true },
  { text: 'Shipper', size: 'text-xl', rotation: '2deg', highlight: false },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#1A0A00' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-space text-[11px] tracking-[0.12em] uppercase mb-4" style={{ color: '#FF6200' }}>
          04 — SKILLS
        </p>
        <h2
          className={`font-bebas text-5xl md:text-[80px] tracking-wide leading-none mb-16 text-white ${visible ? 'reveal visible' : 'reveal'}`}
        >
          WHAT I<br />WORK WITH
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Skill bars */}
          <div className={`space-y-6 ${visible ? 'reveal-left visible' : 'reveal-left'}`}>
            {SKILLS.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-space text-[11px] tracking-[0.08em] text-white opacity-80">
                    {skill.name}
                  </span>
                  <span className="font-space text-[10px]" style={{ color: '#FF6200' }}>
                    {skill.level}/10
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, j) => (
                    <div
                      key={j}
                      className="h-2 flex-1 rounded-sm transition-all"
                      style={{
                        background: j < skill.level ? '#FF6200' : 'rgba(255,255,255,0.08)',
                        opacity: visible && j < skill.level ? 1 : (j >= skill.level ? 1 : 0.2),
                        transform: visible && j < skill.level ? 'scaleX(1)' : (j >= skill.level ? 'scaleX(1)' : 'scaleX(0)'),
                        transformOrigin: 'left',
                        transition: `opacity 0.3s ${i * 0.1 + j * 0.05}s, transform 0.3s ${i * 0.1 + j * 0.05}s`,
                        transitionTimingFunction: 'var(--ease-entrance)',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Word cloud */}
          <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-5 py-8 ${visible ? 'reveal-right visible' : 'reveal-right'}`}>
            {WORDS.map((word, i) => (
              <span
                key={word.text}
                className={`font-syne font-bold ${word.size} transition-all duration-700`}
                style={{
                  color: word.highlight ? '#FF6200' : 'rgba(255,255,255,0.3)',
                  transform: `rotate(${word.rotation})`,
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}