import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const MOODS = ['update', 'project', 'thought', 'announcement'];

export default function AdminPosts({ posts, onRefresh }) {
  const [form, setForm] = useState({ title: '', body: '', mood: 'update', published: true });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.body) return;
    setSaving(true);
    if (editingId) {
      await base44.entities.Post.update(editingId, form);
    } else {
      await base44.entities.Post.create(form);
    }
    setSaving(false);
    setForm({ title: '', body: '', mood: 'update', published: true });
    setEditingId(null);
    onRefresh();
  };

  const saveDraft = async () => {
    if (!form.title || !form.body) return;
    setSaving(true);
    const data = { ...form, published: false };
    if (editingId) {
      await base44.entities.Post.update(editingId, data);
    } else {
      await base44.entities.Post.create(data);
    }
    setSaving(false);
    setForm({ title: '', body: '', mood: 'update', published: true });
    setEditingId(null);
    onRefresh();
  };

  const editPost = (post) => {
    setForm({ title: post.title, body: post.body, mood: post.mood || 'update', published: post.published });
    setEditingId(post.id);
  };

  const deletePost = async (post) => {
    if (!confirm('Delete this post?')) return;
    await base44.entities.Post.delete(post.id);
    onRefresh();
  };

  return (
    <div>
      <h2 className="font-bebas text-3xl tracking-wide mb-6" style={{ color: '#1A0A00' }}>Posts / Updates</h2>

      {/* Composer */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: '#f0e0d0', background: '#FFFBF7' }}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Post title..."
          className="w-full font-syne text-xl font-semibold bg-transparent border-b-2 outline-none py-2 mb-4"
          style={{ borderColor: '#f0e0d0', color: '#1A0A00' }}
        />
        <textarea
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Write your post..."
          className="w-full font-syne text-base bg-transparent outline-none resize-none"
          style={{ color: '#1A0A00', lineHeight: 1.8, minHeight: '120px' }}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="font-space text-[10px]" style={{ color: '#9A6A50' }}>{form.body.length} chars</span>
        </div>

        {/* Mood pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => setForm({ ...form, mood })}
              className="font-space text-[10px] px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: form.mood === mood ? '#FF6200' : '#e0d0c0',
                background: form.mood === mood ? '#FF6200' : 'transparent',
                color: form.mood === mood ? '#FFFFFF' : '#9A6A50',
              }}
            >
              {mood}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 font-bebas text-lg tracking-widest text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#FF6200' }}
          >
            {editingId ? 'UPDATE POST' : 'PUBLISH NOW'}
          </button>
          <button
            onClick={saveDraft}
            disabled={saving}
            className="font-space text-[11px] px-4 py-2"
            style={{ color: '#9A6A50' }}
          >
            Save as Draft
          </button>
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {(posts || []).map((post) => (
          <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg border" style={{ borderColor: '#f0e0d0' }}>
            <div className="flex-1 min-w-0">
              <p className="font-syne font-semibold text-sm truncate" style={{ color: '#1A0A00' }}>{post.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-space text-[9px]" style={{ color: '#9A6A50' }}>
                  {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : ''}
                </span>
                <span
                  className="font-space text-[9px] px-2 py-0.5 rounded-full"
                  style={{
                    background: post.published ? 'rgba(255,98,0,0.1)' : 'rgba(0,0,0,0.05)',
                    color: post.published ? '#FF6200' : '#9A6A50',
                  }}
                >
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <button onClick={() => editPost(post)} style={{ color: '#9A6A50' }} data-hover><Edit2 size={16} /></button>
            <button onClick={() => deletePost(post)} className="text-red-400 hover:text-red-600" data-hover><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}