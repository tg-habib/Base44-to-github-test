import { useEffect, useRef, useState } from 'react';

const HERO_IMG = 'https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_000000006fd471fd89333f3da8a3d975%20(1).png';

export default function About({ settings }) {
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

  const bio = settings?.bio || `I taught myself to code from a phone screen — no laptop, no fancy setup, no degree. Just raw curiosity, midnight sessions on Termux, and an internet connection that barely held up.

Every project I've shipped was built from a mobile device, using AI not as a crutch but as a creative weapon. I don't wait for perfect conditions. I build with whatever I have, wherever I am. That's the vibecoder way — ship first, polish later, never stop.`;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#FFF7F0' }}
    >
      {/* Decorative section number */}
      <div
        className="absolute -left-6 top-12 font-bebas text-[200px] leading-none pointer-events-none select-none"
        style={{ color: '#FF6200', opacity: 0.05 }}
      >
        01
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* Left column — 58% */}
          <div className={`md:col-span-7 ${visible ? 'reveal-left visible' : 'reveal-left'}`}>
            <p className="font-space text-[11px] tracking-[0.12em] uppercase mb-8" style={{ color: '#FF6200' }}>
              01 — ABOUT
            </p>

            <blockquote
              className="font-dm italic text-2xl md:text-[34px] leading-snug mb-10"
              style={{ color: '#1A0A00', transform: 'rotate(-2deg)', transformOrigin: 'left center' }}
            >
              "I don't wait for the right tools.
              <br />I build with whatever I have —
              <br />from a phone screen, at midnight, alone."
            </blockquote>

            <div className="font-syne text-base md:text-lg leading-relaxed space-y-5" style={{ color: '#1A0A00', lineHeight: 1.75 }}>
              {bio.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-10">
              {['10+ Projects Shipped', '100% Mobile'].map((stat) => (
                <span
                  key={stat}
                  className="font-space text-[11px] tracking-[0.08em] px-4 py-2 rounded-full border"
                  style={{ borderColor: '#FF6200', color: '#FF6200' }}
                >
                  {stat}
                </span>
              ))}
              <span
                className="font-space text-[11px] tracking-[0.08em] px-4 py-2 rounded-full border relative group"
                style={{ borderColor: '#FF6200', color: '#FF6200' }}
                title="no shortcuts"
              >
                Selfmade*
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] font-space px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  *no shortcuts
                </span>
              </span>
            </div>
          </div>

          {/* Right column — 42% */}
          <div className={`md:col-span-5 flex justify-center ${visible ? 'reveal-right visible' : 'reveal-right'}`}>
            <div className="relative animate-float">
              <img
                src={HERO_IMG}
                alt="TG Habib"
                className="w-full max-w-sm object-cover"
                style={{
                  clipPath: 'polygon(8% 0%, 100% 4%, 95% 100%, 0% 92%)',
                  filter: 'drop-shadow(8px 12px 24px rgba(255,98,0,0.15))',
                }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}