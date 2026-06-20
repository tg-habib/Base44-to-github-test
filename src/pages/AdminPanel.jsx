import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Clock } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUpload from '../components/admin/AdminUpload';
import AdminPhotos from '../components/admin/AdminPhotos';
import AdminVideos from '../components/admin/AdminVideos';
import AdminPosts from '../components/admin/AdminPosts';
import AdminProjects from '../components/admin/AdminProjects';
import AdminSettings from '../components/admin/AdminSettings';

export default function AdminPanel({ onExit }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [time, setTime] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: media = [] } = useQuery({
    queryKey: ['admin-media'],
    queryFn: () => base44.entities.MediaItem.list('-created_date'),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => base44.entities.Project.list('display_order'),
  });

  const { data: settingsArr = [] } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const settings = settingsArr[0] || null;
  const photos = media.filter(m => m.type === 'photo');
  const videos = media.filter(m => m.type === 'video');

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
  };

  const lock = () => {
    localStorage.removeItem('habib_session');
    onExit();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); }
      if (e.key === 'Escape') { /* close modals if needed */ }
      if (e.ctrlKey && e.key === 'u') { e.preventDefault(); setActiveTab('upload'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard media={media} posts={posts} projects={projects} onTabChange={setActiveTab} />;
      case 'upload': return <AdminUpload onUploaded={refresh} />;
      case 'photos': return <AdminPhotos photos={photos} onRefresh={refresh} />;
      case 'videos': return <AdminVideos videos={videos} onRefresh={refresh} />;
      case 'posts': return <AdminPosts posts={posts} onRefresh={refresh} />;
      case 'projects': return <AdminProjects projects={projects} onRefresh={refresh} />;
      case 'settings': return <AdminSettings settings={settings} onRefresh={refresh} onLock={lock} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-14 flex-shrink-0" style={{ background: '#FF6200' }}>
        <span className="font-bebas text-xl tracking-wider text-white">TG ADMIN</span>
        <div className="flex items-center gap-6">
          <span className="font-space text-[11px] text-white/80 hidden sm:block">
            <Clock size={12} className="inline mr-1" />{time}
          </span>
          <button
            onClick={onExit}
            className="font-space text-[11px] text-white flex items-center gap-1 hover:opacity-80 transition-opacity"
            data-hover
          >
            <ArrowLeft size={14} /> Exit to Site
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}