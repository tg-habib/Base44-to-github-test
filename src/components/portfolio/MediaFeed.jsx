import { useEffect, useRef, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Play } from 'lucide-react';

export default function MediaFeed({ media, posts }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const publishedMedia = (media || []).filter(m => m.published);
  const publishedPosts = (posts || []).filter(p => p.published);

  const allItems = [
    ...publishedMedia.map(m => ({ ...m, itemType: m.type, date: m.created_date })),
    ...publishedPosts.map(p => ({ ...p, itemType: 'post', date: p.created_date })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const moodColors = {
    update: '#FF6200',
    project: '#C24A00',
    thought: '#FF8C42',
    announcement: '#FF6200',
  };

  return (
    <section ref={sectionRef} id="feed" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#FFF2E8' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-space text-[11px] tracking-[0.12em] uppercase mb-4" style={{ color: '#FF6200' }}>
          03 — FEED
        </p>
        <h2
          className={`font-bebas text-5xl md:text-[80px] tracking-wide leading-none mb-14 ${visible ? 'reveal visible' : 'reveal'}`}
          style={{ color: '#1A0A00' }}
        >
          MEDIA FEED
        </h2>

        {allItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-dm italic text-2xl md:text-3xl" style={{ color: '#9A6A50' }}>
              New drops coming soon
              <span className="inline-block w-2 h-2 rounded-full ml-2 animate-pulse-glow" style={{ background: '#FF6200' }} />
            </p>
          </div>
        ) : (
          <div className={`masonry-grid ${visible ? 'reveal visible' : 'reveal'}`} style={{ transitionDelay: '0.2s' }}>
            {allItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: item.itemType === 'post' ? '#FFFFFF' : 'transparent' }}
              >
                {item.itemType === 'photo' && (
                  <div className="relative overflow-hidden rounded-lg border-2 border-transparent group-hover:border-orange transition-colors">
                    <img
                      src={item.file_url}
                      alt={item.caption || 'Photo'}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {item.itemType === 'video' && (
                  <div
                    className="relative overflow-hidden rounded-lg cursor-pointer border-2 border-transparent group-hover:border-orange transition-colors"
                    onClick={() => setLightbox(item)}
                  >
                    <video
                      src={item.file_url}
                      className="w-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,98,0,0.9)' }}>
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {item.itemType === 'post' && (
                  <div className="p-5 border-l-4" style={{ borderColor: moodColors[item.mood] || '#FF6200' }}>
                    <h4 className="font-syne font-semibold text-base mb-2" style={{ color: '#1A0A00' }}>{item.title}</h4>
                    <p className="font-syne text-sm leading-relaxed" style={{ color: '#1A0A00', opacity: 0.8 }}>{item.body}</p>
                  </div>
                )}

                <div className="px-2 py-2 flex items-center justify-between">
                  {item.caption && (
                    <p className="font-space text-[11px]" style={{ color: '#9A6A50' }}>{item.caption}</p>
                  )}
                  <p className="font-space text-[10px]" style={{ color: '#9A6A50', opacity: 0.7 }}>
                    {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <video
            src={lightbox.file_url}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}