export default function Footer({ onSecretTap }) {
  return (
    <footer className="py-6 px-6 md:px-10" style={{ background: '#1A0A00' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="font-space text-[11px]" style={{ color: '#9A6A50' }}>
          © 2025 TG Habib
        </span>

        <button
          onClick={onSecretTap}
          className="flex items-center gap-2 focus:outline-none"
          aria-label="decorative dots"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#FF6200', opacity: 0.5 }}
            />
          ))}
        </button>

        <span className="font-space text-[11px]" style={{ color: '#9A6A50' }}>
          Built solo. Powered by vibes.
        </span>
      </div>
    </footer>
  );
}