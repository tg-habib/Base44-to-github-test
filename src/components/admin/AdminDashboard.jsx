import { Image, Video, FileText, FolderKanban, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard({ media, posts, projects, onTabChange }) {
  const photos = (media || []).filter(m => m.type === 'photo');
  const videos = (media || []).filter(m => m.type === 'video');

  const stats = [
    { label: 'Total Photos', value: photos.length, icon: Image },
    { label: 'Total Videos', value: videos.length, icon: Video },
    { label: 'Total Posts', value: (posts || []).length, icon: FileText },
    { label: 'Projects', value: (projects || []).length, icon: FolderKanban },
  ];

  const recentItems = [
    ...photos.slice(0, 2).map(p => ({ ...p, itemType: 'Photo' })),
    ...videos.slice(0, 2).map(v => ({ ...v, itemType: 'Video' })),
    ...(posts || []).slice(0, 2).map(p => ({ ...p, itemType: 'Post' })),
  ].sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0)).slice(0, 6);

  return (
    <div>
      <h2 className="font-bebas text-3xl tracking-wide mb-6" style={{ color: '#1A0A00' }}>Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl p-5 border" style={{ borderColor: '#f0e0d0', background: '#FFFBF7' }}>
              <Icon size={20} style={{ color: '#FF6200' }} />
              <p className="font-bebas text-3xl mt-2" style={{ color: '#1A0A00' }}>{s.value}</p>
              <p className="font-space text-[10px] tracking-[0.08em]" style={{ color: '#9A6A50' }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <h3 className="font-syne font-semibold text-lg mb-4" style={{ color: '#1A0A00' }}>Recently Published</h3>
      {recentItems.length === 0 ? (
        <p className="font-syne text-sm" style={{ color: '#9A6A50' }}>No content yet. Start uploading!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {recentItems.map((item) => (
            <div key={item.id} className="rounded-lg p-3 border" style={{ borderColor: '#f0e0d0' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-space text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,98,0,0.1)', color: '#FF6200' }}>
                  {item.itemType}
                </span>
                <span className="font-space text-[9px]" style={{ color: '#9A6A50' }}>
                  {item.created_date ? format(new Date(item.created_date), 'MMM d') : ''}
                </span>
              </div>
              <p className="font-syne text-sm truncate" style={{ color: '#1A0A00' }}>
                {item.caption || item.title || item.name || 'Untitled'}
              </p>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-syne font-semibold text-lg mb-4" style={{ color: '#1A0A00' }}>Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        {[
          { label: '+ Upload Photo', tab: 'upload' },
          { label: '+ Upload Video', tab: 'upload' },
          { label: '+ New Post', tab: 'posts' },
          { label: '+ New Project', tab: 'projects' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => onTabChange(action.tab)}
            className="font-space text-[11px] tracking-[0.06em] px-4 py-2.5 rounded-lg border transition-all hover:border-orange"
            style={{ borderColor: '#f0e0d0', color: '#FF6200' }}
            data-hover
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}