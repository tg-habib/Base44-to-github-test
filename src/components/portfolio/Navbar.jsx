import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'WORK', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 1px 20px rgba(26,10,0,0.06)' : 'none',
          transform: 'translateY(0)',
          animation: 'slideDown 0.6s 1.2s both',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-bebas text-[26px] tracking-wider"
            style={{ color: '#FF6200' }}
            data-hover
          >
            TG
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, i) => (
              <span key={item.label} className="flex items-center">
                <button
                  onClick={() => scrollTo(item.href)}
                  className="font-space text-[11px] tracking-[0.12em] px-3 py-2 relative group"
                  style={{ color: scrolled ? '#1A0A00' : '#1A0A00' }}
                  data-hover
                >
                  {item.label}
                  <span
                    className="absolute bottom-1 left-3 right-3 h-[1.5px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{ background: '#FF6200', transitionTimingFunction: 'var(--ease-entrance)' }}
                  />
                </button>
                {i < NAV_ITEMS.length - 1 && (
                  <span className="w-1 h-1 rounded-full mx-1" style={{ background: '#FF6200', opacity: 0.4 }} />
                )}
              </span>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(true)}
            data-hover
          >
            <Menu size={22} style={{ color: '#1A0A00' }} />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 transition-all duration-500"
        style={{
          background: '#FF6200',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform: menuOpen ? 'scale(1)' : 'scale(1.1)',
        }}
      >
        <button
          className="absolute top-5 right-5 text-white"
          onClick={() => setMenuOpen(false)}
        >
          <X size={28} />
        </button>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollTo(item.href)}
            className="font-bebas text-white text-5xl tracking-wider hover:opacity-70 transition-opacity"
          >
            {item.label}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}