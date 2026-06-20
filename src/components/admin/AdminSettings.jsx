import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function AdminSettings({ settings, onRefresh, onLock }) {
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [profile, setProfile] = useState({ display_name: '', tagline: '', bio: '' });
  const [links, setLinks] = useState({ github_url: '', telegram_url: '', twitter_url: '' });
  const [saved, setSaved] = useState('');

  useEffect(() => {
    if (settings) {
      setProfile({ display_name: settings.display_name || 'TG Habib', tagline: settings.tagline || 'Selfmade Developer & Vibecoder', bio: settings.bio || '' });
      setLinks({ github_url: settings.github_url || '', telegram_url: settings.telegram_url || '', twitter_url: settings.twitter_url || '' });
    }
  }, [settings]);

  const showSaved = (msg) => { setSaved(msg); setTimeout(() => setSaved(''), 3000); };

  const updatePassword = () => {
    const stored = localStorage.getItem('habib_password');
    const current = stored ? atob(stored) : 'habib2025';
    if (passwords.current !== current) { alert('Current password is incorrect'); return; }
    if (passwords.newPass !== passwords.confirm) { alert('Passwords do not match'); return; }
    if (passwords.newPass.length < 4) { alert('Password too short'); return; }
    localStorage.setItem('habib_password', btoa(passwords.newPass));
    setPasswords({ current: '', newPass: '', confirm: '' });
    showSaved('Password updated!');
  };

  const saveProfile = async () => {
    if (settings?.id) {
      await base44.entities.SiteSettings.update(settings.id, { ...profile, ...links });
    } else {
      await base44.entities.SiteSettings.create({ ...profile, ...links });
    }
    onRefresh();
    showSaved('Profile saved!');
  };

  const saveLinks = async () => {
    if (settings?.id) {
      await base44.entities.SiteSettings.update(settings.id, links);
    } else {
      await base44.entities.SiteSettings.create({ ...profile, ...links });
    }
    onRefresh();
    showSaved('Links saved!');
  };

  const clearAll = async (type) => {
    if (!confirm(`Are you sure? This cannot be undone.`)) return;
    if (type === 'media') {
      const items = await base44.entities.MediaItem.list();
      for (const item of items) await base44.entities.MediaItem.delete(item.id);
    } else if (type === 'posts') {
      const items = await base44.entities.Post.list();
      for (const item of items) await base44.entities.Post.delete(item.id);
    } else if (type === 'all') {
      const media = await base44.entities.MediaItem.list();
      for (const m of media) await base44.entities.MediaItem.delete(m.id);
      const posts = await base44.entities.Post.list();
      for (const p of posts) await base44.entities.Post.delete(p.id);
      const projects = await base44.entities.Project.list();
      for (const pr of projects) await base44.entities.Project.delete(pr.id);
    }
    onRefresh();
    showSaved('Cleared!');
  };

  const inputStyle = "w-full bg-transparent border-b-2 outline-none py-2 font-syne text-sm";

  return (
    <div className="max-w-xl">
      <h2 className="font-bebas text-3xl tracking-wide mb-6" style={{ color: '#1A0A00' }}>Settings</h2>

      {saved && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(255,98,0,0.1)' }}>
          <span className="font-space text-[12px]" style={{ color: '#FF6200' }}>{saved}</span>
        </div>
      )}

      {/* Change Password */}
      <div className="mb-10">
        <h3 className="font-syne font-semibold mb-4" style={{ color: '#1A0A00' }}>Change Password</h3>
        <div className="space-y-3">
          {['current', 'newPass', 'confirm'].map((f) => (
            <input
              key={f}
              type="password"
              value={passwords[f]}
              onChange={(e) => setPasswords({ ...passwords, [f]: e.target.value })}
              placeholder={f === 'current' ? 'Current password' : f === 'newPass' ? 'New password' : 'Confirm new password'}
              className={inputStyle}
              style={{ borderColor: '#e0d0c0', color: '#1A0A00' }}
            />
          ))}
          <button onClick={updatePassword} className="py-2 px-6 font-bebas text-sm tracking-widest text-white rounded-lg" style={{ background: '#FF6200' }}>
            UPDATE PASSWORD
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="mb-10">
        <h3 className="font-syne font-semibold mb-4" style={{ color: '#1A0A00' }}>Profile Settings</h3>
        <div className="space-y-3">
          <input value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} placeholder="Display name" className={inputStyle} style={{ borderColor: '#e0d0c0', color: '#1A0A00' }} />
          <input value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} placeholder="Tagline" className={inputStyle} style={{ borderColor: '#e0d0c0', color: '#1A0A00' }} />
          <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Bio text (About section)" className={inputStyle + ' resize-none'} rows={4} style={{ borderColor: '#e0d0c0', color: '#1A0A00' }} />
          <button onClick={saveProfile} className="py-2 px-6 font-bebas text-sm tracking-widest text-white rounded-lg" style={{ background: '#FF6200' }}>SAVE PROFILE</button>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-10">
        <h3 className="font-syne font-semibold mb-4" style={{ color: '#1A0A00' }}>Social Links</h3>
        <div className="space-y-3">
          <input value={links.github_url} onChange={(e) => setLinks({ ...links, github_url: e.target.value })} placeholder="GitHub URL" className={inputStyle} style={{ borderColor: '#e0d0c0', color: '#1A0A00' }} />
          <input value={links.telegram_url} onChange={(e) => setLinks({ ...links, telegram_url: e.target.value })} placeholder="Telegram URL" className={inputStyle} style={{ borderColor: '#e0d0c0', color: '#1A0A00' }} />
          <input value={links.twitter_url} onChange={(e) => setLinks({ ...links, twitter_url: e.target.value })} placeholder="Twitter URL" className={inputStyle} style={{ borderColor: '#e0d0c0', color: '#1A0A00' }} />
          <button onClick={saveLinks} className="py-2 px-6 font-bebas text-sm tracking-widest text-white rounded-lg" style={{ background: '#FF6200' }}>SAVE LINKS</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mb-10">
        <h3 className="font-syne font-semibold mb-4 text-red-500">Danger Zone</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => clearAll('media')} className="font-space text-[11px] px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50">Clear All Media</button>
          <button onClick={() => clearAll('posts')} className="font-space text-[11px] px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50">Clear All Posts</button>
          <button onClick={() => clearAll('all')} className="font-space text-[11px] px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Reset Everything</button>
        </div>
      </div>

      {/* Lock */}
      <button onClick={onLock} className="font-space text-[11px] px-4 py-2 border rounded-lg" style={{ borderColor: '#e0d0c0', color: '#9A6A50' }}>
        🔒 LOCK SESSION
      </button>
    </div>
  );
}