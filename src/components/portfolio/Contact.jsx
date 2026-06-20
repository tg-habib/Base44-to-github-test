import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function Contact({ links }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: `Portfolio Contact from ${form.name}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    });
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const socials = [
    { label: 'GitHub', url: links?.github_url || 'https://github.com' },
    { label: 'Telegram', url: links?.telegram_url || 'https://t.me' },
    { label: 'Twitter', url: links?.twitter_url || 'https://twitter.com' },
  ];

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 md:py-32" style={{ background: '#FFF7F0' }}>
      <div className="max-w-xl mx-auto px-6 md:px-10">
        <p className="font-space text-[11px] tracking-[0.12em] uppercase mb-4 text-center" style={{ color: '#FF6200' }}>
          05 — CONTACT
        </p>

        <h2
          className={`font-bebas text-5xl md:text-[80px] tracking-wide leading-none text-center mb-6 ${visible ? 'reveal visible' : 'reveal'}`}
          style={{ color: '#1A0A00' }}
        >
          LET'S BUILD<br />SOMETHING.
        </h2>

        <p className={`font-dm italic text-lg md:text-xl text-center mb-12 ${visible ? 'reveal visible' : 'reveal'}`} style={{ color: '#9A6A50', transitionDelay: '0.15s' }}>
          Got a project, a collab, or just want to say hey —
          I'm one message away.
        </p>

        <form onSubmit={handleSubmit} className={`space-y-8 ${visible ? 'reveal visible' : 'reveal'}`} style={{ transitionDelay: '0.3s' }}>
          {['name', 'email', 'message'].map((field) => (
            <div key={field} className="relative">
              <label
                className="font-space text-[10px] tracking-[0.12em] uppercase absolute -top-4 left-0 transition-all"
                style={{ color: form[field] ? '#FF6200' : '#9A6A50' }}
              >
                {field}
              </label>
              {field === 'message' ? (
                <textarea
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-gray-200 focus:border-orange outline-none py-3 font-syne text-base resize-none transition-colors"
                  style={{ color: '#1A0A00', borderColor: form[field] ? '#FF6200' : undefined }}
                  rows={4}
                  required
                />
              ) : (
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-gray-200 focus:border-orange outline-none py-3 font-syne text-base transition-colors"
                  style={{ color: '#1A0A00', borderColor: form[field] ? '#FF6200' : undefined }}
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-4 font-bebas text-xl tracking-widest text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98] relative overflow-hidden"
            style={{ background: '#FF6200' }}
            disabled={sending}
            data-hover
          >
            {sent ? 'SENT ✓' : sending ? 'SENDING...' : 'SEND IT →'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-8 mt-12">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-space text-[11px] tracking-[0.1em] transition-colors hover:text-orange"
              style={{ color: '#9A6A50' }}
              data-hover
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}