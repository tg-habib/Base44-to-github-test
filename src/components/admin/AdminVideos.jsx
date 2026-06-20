import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Trash2, Eye, EyeOff, Play } from 'lucide-react';

export default function AdminVideos({ videos, onRefresh }) {
  const [preview, setPreview] = useState(null);

  const togglePublish = async (video) => {
    await base44.entities.MediaItem.update(video.id, { published: !video.published });
    onRefresh();
  };

  const deleteVideo = async (video) => {
    if (!confirm('Delete this video? This cannot be undone.')) return;
    await base44.entities.MediaItem.delete(video.id);
    onRefresh();
  };

  const updateCaption = async (video, caption) => {
    await base44.entities.MediaItem.update(video.id, { caption });
    onRefresh();
  };

  return (
    <div>
      <h2 className="font-bebas text-3xl tracking-wide mb-6" style={{ color: '#1A0A00' }}>Manage Videos</h2>

      {videos.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-dm italic text-xl" style={{ color: '#9A6A50' }}>No videos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="rounded-lg overflow-hidden border" style={{ borderColor: '#f0e0d0' }}>
              <div className="relative cursor-pointer" onClick={() => setPreview(video)}>
                <video src={video.file_url} className="w-full aspect-video object-cover" muted preload="metadata" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,98,0,0.9)' }}>
                    <Play size={18} className="text-white ml-0.5" />
                  </div>
                </div>
                {video.published && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full" style={{ background: '#FF6200' }} />
                )}
              </div>
              <div className="p-3">
                <input
                  defaultValue={video.caption || ''}
                  onBlur={(e) => updateCaption(video, e.target.value)}
                  placeholder="Add caption..."
                  className="w-full font-space text-[11px] bg-transparent outline-none border-b border-transparent focus:border-orange"
                  style={{ color: '#1A0A00' }}
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => togglePublish(video)} className="font-space text-[10px] flex items-center gap-1" style={{ color: video.published ? '#FF6200' : '#9A6A50' }}>
                    {video.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {video.published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => deleteVideo(video)} className="font-space text-[10px] flex items-center gap-1 text-red-400 hover:text-red-600 ml-auto">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <video src={preview.file_url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}