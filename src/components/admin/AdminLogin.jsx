import { useState } from 'react';
import { Lock } from 'lucide-react';

const DEFAULT_PASSWORD = 'habib2025';

export default function AdminLogin({ onSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem('habib_password');
    const correctPass = stored ? atob(stored) : DEFAULT_PASSWORD;

    if (password === correctPass) {
      const token = Math.random().toString(36).slice(2);
      localStorage.setItem('habib_session', token);
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
      setPassword('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: 'rgba(26,10,0,0.9)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Radial pulse */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,98,0,0.2), transparent 70%)',
          animation: 'radial-pulse 3s ease-in-out infinite',
        }}
      />

      <div
        className={`relative bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl ${error ? 'animate-shake' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,98,0,0.1)' }}
          >
            <Lock size={24} style={{ color: '#FF6200' }} />
          </div>
        </div>

        <h3 className="font-bebas text-3xl tracking-wider text-center mb-6" style={{ color: '#FF6200' }}>
          ADMIN ACCESS
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-lg border-2 font-space text-sm outline-none transition-colors"
            style={{
              borderColor: error ? '#ef4444' : '#e5e5e5',
              background: error ? '#fef2f2' : '#f9f9f9',
            }}
            autoFocus
          />
          <button
            type="submit"
            className="w-full mt-4 py-3 font-bebas text-lg tracking-widest text-white rounded-lg transition-opacity hover:opacity-90"
            style={{ background: '#FF6200' }}
            data-hover
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
}