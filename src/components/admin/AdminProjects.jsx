import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Trash2, Edit2, Eye, EyeOff, X } from 'lucide-react';

export default function AdminProjects({ projects, onRefresh }) {
  const [form, setForm] = useState({ name: '', description: '', tech_stack: [], live_url: '', visible: true, display_order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm({ ...form, tech_stack: [...form.tech_stack, tagInput.trim()] });
    setTagInput('');
  };

  const removeTag = (idx) => {
    setForm({ ...form, tech_stack: form.tech_stack.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async () => {
    if (!form.name) return;
    setSaving(true);
    if (editingId) {
      await base44.entities.Project.update(editingId, form);
    } else {
      await base44.entities.Project.create({ ...form, display_order: (projects || []).length });
    }
    setSaving(false);
    setForm({ name: '', description: '', tech_stack: [], live_url: '', visible: true, display_order: 0 });
    setEditingId(null);
    onRefresh();
  };

  const editProject = (p) => {
    setForm({ name: p.name, description: p.description || '', tech_stack: p.tech_stack || [], live_url: p.live_url || '', visible: p.visible !== false, display_order: p.display_order || 0 });
    setEditingId(p.id);
  };

  const deleteProject = async (p) => {
    if (!confirm('Delete this project?')) return;
    await base44.entities.Project.delete(p.id);
    onRefresh();
  };

  const toggleVisibility = async (p) => {
    await base44.entities.Project.update(p.id, { visible: !p.visible });
    onRefresh();
  };

  return (
    <div>
      <h2 className="font-bebas text-3xl tracking-wide mb-6" style={{ color: '#1A0A00' }}>Projects</h2>

      {/* Form */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: '#f0e0d0', background: '#FFFBF7' }}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Project name"
          className="w-full font-syne text-lg font-semibold bg-transparent border-b-2 outline-none py-2 mb-4"
          style={{ borderColor: '#f0e0d0', color: '#1A0A00' }}
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short description..."
          className="w-full font-syne text-sm bg-transparent outline-none resize-none mb-4"
          style={{ color: '#1A0A00' }}
          rows={2}
        />

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-3">
          {form.tech_stack.map((tag, i) => (
            <span key={i} className="font-space text-[10px] px-2 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(255,98,0,0.1)', color: '#FF6200' }}>
              {tag}
              <button onClick={() => removeTag(i)}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add tech tag + Enter"
            className="flex-1 font-space text-[11px] bg-transparent border-b outline-none py-1"
            style={{ borderColor: '#e0d0c0', color: '#1A0A00' }}
          />
        </div>

        <input
          type="url"
          value={form.live_url}
          onChange={(e) => setForm({ ...form, live_url: e.target.value })}
          placeholder="Live URL (optional)"
          className="w-full font-space text-[11px] bg-transparent border-b outline-none py-2 mb-4"
          style={{ borderColor: '#e0d0c0', color: '#1A0A00' }}
        />

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-3 font-bebas text-lg tracking-widest text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: '#FF6200' }}
        >
          {editingId ? 'UPDATE PROJECT' : 'SAVE PROJECT'}
        </button>
      </div>

      {/* Projects list */}
      <div className="space-y-3">
        {(projects || []).map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-lg border" style={{ borderColor: '#f0e0d0' }}>
            <div className="flex-1 min-w-0">
              <p className="font-syne font-semibold text-sm" style={{ color: '#1A0A00' }}>{p.name}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(p.tech_stack || []).map((t) => (
                  <span key={t} className="font-space text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,98,0,0.1)', color: '#FF6200' }}>{t}</span>
                ))}
              </div>
            </div>
            <button onClick={() => toggleVisibility(p)} style={{ color: p.visible !== false ? '#FF6200' : '#9A6A50' }}>
              {p.visible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={() => editProject(p)} style={{ color: '#9A6A50' }}><Edit2 size={16} /></button>
            <button onClick={() => deleteProject(p)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}