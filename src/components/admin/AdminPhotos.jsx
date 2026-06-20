import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminPhotos({ photos, onRefresh }) {
  const [selected, setSelected] = useState(new Set());

  const togglePublish = async (photo) => {
    await base44.entities.MediaItem.update(photo.id, { published: !photo.published });
    onRefresh();
  };

  const deletePhoto = async (photo) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    await base44.entities.MediaItem.delete(photo.id);
    onRefresh();
  };

  const updateCaption = async (photo, caption) => {
    await base44.entities.MediaItem.update(photo.id, { caption });
    onRefresh();
  };

  const bulkAction = async (action) => {
    const ids = Array.from(selected);
    for (const id of ids) {
      if (action === 'publish') await base44.entities.MediaItem.update(id, { published: true });
      else if (action === 'unpublish') await base44.entities.MediaItem.update(id, { published: false });
      else if (action === 'delete') await base44.entities.MediaItem.delete(id);
    }
    setSelected(new Set());
    onRefresh();
  };

  return (
    <div>
      <h2 className="font-bebas text-3xl tracking-wide mb-4" style={{ color: '#1A0A00' }}>Manage Photos</h2>

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setSelected(new Set(photos.map(p => p.id)))} className="font-space text-[10px] px-3 py-1.5 border rounded" style={{ borderColor: '#e0d0c0' }}>
            Select All
          </button>
          {selected.size > 0 && (
            <>
              <button onClick={() => bulkAction('publish')} className="font-space text-[10px] px-3 py-1.5 rounded text-white" style={{ background: '#FF6200' }}>Publish</button>
              <button onClick={() => bulkAction('unpublish')} className="font-space text-[10px] px-3 py-1.5 border rounded" style={{ borderColor: '#e0d0c0' }}>Unpublish</button>
              <button onClick={() => bulkAction('delete')} className="font-space text-[10px] px-3 py-1.5 rounded text-white bg-red-500">Delete</button>
            </>
          )}
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-dm italic text-xl" style={{ color: '#9A6A50' }}>No photos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative rounded-lg overflow-hidden border group" style={{ borderColor: '#f0e0d0' }}>
              <div className="relative">
                <img src={photo.file_url} alt={photo.caption || ''} className="w-full aspect-square object-cover" />
                {photo.published && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full" style={{ background: '#FF6200' }} />
                )}
                <label className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selected.has(photo.id)}
                    onChange={(e) => {
                      const s = new Set(selected);
                      e.target.checked ? s.add(photo.id) : s.delete(photo.id);
                      setSelected(s);
                    }}
                    className="accent-orange-500 w-4 h-4"
                  />
                </label>
              </div>
              <div className="p-3">
                <input
                  defaultValue={photo.caption || ''}
                  onBlur={(e) => updateCaption(photo, e.target.value)}
                  placeholder="Add caption..."
                  className="w-full font-space text-[11px] bg-transparent outline-none border-b border-transparent focus:border-orange"
                  style={{ color: '#1A0A00' }}
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => togglePublish(photo)} className="font-space text-[10px] flex items-center gap-1" style={{ color: photo.published ? '#FF6200' : '#9A6A50' }}>
                    {photo.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {photo.published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => deletePhoto(photo)} className="font-space text-[10px] flex items-center gap-1 text-red-400 hover:text-red-600 ml-auto">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}