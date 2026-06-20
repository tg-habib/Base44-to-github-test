import { LayoutDashboard, Upload, Image, Video, FileText, FolderKanban, Settings } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Media', icon: Upload },
  { id: 'photos', label: 'Manage Photos', icon: Image },
  { id: 'videos', label: 'Manage Videos', icon: Video },
  { id: 'posts', label: 'Posts / Updates', icon: FileText },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r" style={{ borderColor: '#f0e0d0', background: '#FFFBF7' }}>
        <div className="p-4 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all"
                style={{
                  background: isActive ? '#FF6200' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#1A0A00',
                }}
                data-hover
              >
                <Icon size={18} />
                <span className="font-syne text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[400] flex items-center justify-around py-2 border-t"
        style={{ background: '#FFFBF7', borderColor: '#f0e0d0' }}
      >
        {TABS.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
              style={{ color: isActive ? '#FF6200' : '#9A6A50' }}
            >
              <Icon size={20} />
              <span className="font-space text-[9px]">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => onTabChange('settings')}
          className="flex flex-col items-center gap-0.5 px-2 py-1"
          style={{ color: activeTab === 'settings' ? '#FF6200' : '#9A6A50' }}
        >
          <Settings size={20} />
          <span className="font-space text-[9px]">Settings</span>
        </button>
      </nav>
    </>
  );
}