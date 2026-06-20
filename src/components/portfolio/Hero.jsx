import { useEffect, useRef, useState } from 'react';

const HERO_IMG = 'https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_000000006fd471fd89333f3da8a3d975%20(1).png';

export default function Hero() {
  const imgRef = useRef(null);
  const sectionRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const mouseOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current || !sectionRef.current) return;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 400, 1);
      const scale = 1 - progress * 0.08;
      const opacity = 1 - progress * 0.8;
      imgRef.current.style.transform = `scale(${scale}) translate(${mouseOffset.current.x}px, ${mouseOffset.current.y}px)`;
      imgRef.current.style.opacity = opacity;
    };

    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseOffset.current = {
        x: ((e.clientX - centerX) / centerX) * 12,
        y: ((e.clientY - centerY) / centerY) * 12,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white"
      id="hero"
    >
      {/* Subtle radial gradient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(255,98,0,0.06), transparent 70%)',
          animation: 'drift 20s ease-in-out infinite alternate',
        }}
      />

      {/* Hero image */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <img
          ref={imgRef}
          src={HERO_IMG}
          alt="TG Habib portrait"
          className="max-h-[90vh] w-auto object-contain will-change-transform"
          style={{
            filter: loaded ? 'blur(0)' : 'blur(20px)',
            transform: loaded ? 'scale(1)' : 'scale(0.96)',
            transition: 'filter 1.2s var(--ease-entrance), transform 1.2s var(--ease-entrance)',
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Bottom left overlay */}
      <div
        className="absolute bottom-10 left-8 md:left-12 z-20"
        style={{ animation: 'fadeInUp 0.8s 0.7s both' }}
      >
        <p className="font-space text-[11px] tracking-[0.12em] uppercase" style={{ color: '#9A6A50' }}>
          HABIB
        </p>
        <p className="font-syne text-[13px] mt-1" style={{ color: '#9A6A50' }}>
          Vibecoder / Selfmade Developer
        </p>
      </div>

      {/* Bottom right scroll indicator */}
      <div
        className="absolute bottom-10 right-8 md:right-12 z-20 vertical-text animate-pulse-glow"
        style={{ animation: 'fadeInUp 0.8s 1.6s both' }}
      >
        <span className="font-space text-[10px] tracking-[0.15em]" style={{ color: '#9A6A50' }}>
          Scroll ↓
        </span>
      </div>

      {/* Ghost text on edge */}
      <div
        className="absolute top-1/2 -right-4 z-10 vertical-text -translate-y-1/2 opacity-[0.04] pointer-events-none"
      >
        <span className="font-space text-[11px] tracking-[0.2em]" style={{ color: '#1A0A00' }}>
          tghabib.com
        </span>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          0% { background-position: 30% 50%; }
          100% { background-position: 70% 40%; }
        }
      `}</style>
    </section>
  );
}