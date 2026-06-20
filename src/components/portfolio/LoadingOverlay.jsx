import { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center"
      style={{
        background: '#1A0A00',
        animation: 'fadeOut 0.8s 0.4s forwards',
      }}
    >
      <div className="font-bebas text-4xl tracking-widest" style={{ color: '#FF6200' }}>
        TG
      </div>
      <style>{`
        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
}