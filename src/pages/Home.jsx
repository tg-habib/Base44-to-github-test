import { useState, useEffect, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

import FilmGrain from '../components/portfolio/FilmGrain';
import CustomCursor from '../components/portfolio/CustomCursor';
import ScrollProgress from '../components/portfolio/ScrollProgress';
import Particles from '../components/portfolio/Particles';
import LoadingOverlay from '../components/portfolio/LoadingOverlay';
import Navbar from '../components/portfolio/Navbar';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Work from '../components/portfolio/Work';
import MediaFeed from '../components/portfolio/MediaFeed';
import Skills from '../components/portfolio/Skills';
import Contact from '../components/portfolio/Contact';
import Footer from '../components/portfolio/Footer';
import AdminLogin from '../components/admin/AdminLogin';
import AdminPanel from '../pages/AdminPanel';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  // Check existing session
  useEffect(() => {
    const session = localStorage.getItem('habib_session');
    if (session) {
      // Session exists but don't auto-show admin
    }
  }, []);

  // Keyboard shortcut: Ctrl + Shift + H
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        const session = localStorage.getItem('habib_session');
        if (session) {
          setShowAdmin(true);
        } else {
          setShowLogin(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Footer secret tap (5 taps fast)
  const handleSecretTap = useCallback(() => {
    tapCount.current++;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      const session = localStorage.getItem('habib_session');
      if (session) {
        setShowAdmin(true);
      } else {
        setShowLogin(true);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowAdmin(true);
  };

  // Fetch data for portfolio
  const { data: projects = [] } = useQuery({
    queryKey: ['portfolio-projects'],
    queryFn: () => base44.entities.Project.list('display_order'),
  });

  const { data: media = [] } = useQuery({
    queryKey: ['portfolio-media'],
    queryFn: () => base44.entities.MediaItem.list('-created_date'),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['portfolio-posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
  });

  const { data: settingsArr = [] } = useQuery({
    queryKey: ['portfolio-settings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const settings = settingsArr[0] || null;

  if (showAdmin) {
    return <AdminPanel onExit={() => setShowAdmin(false)} />;
  }

  return (
    <div className="relative">
      <LoadingOverlay />
      <FilmGrain />
      <CustomCursor />
      <ScrollProgress />
      <Particles />
      <Navbar />

      <main>
        <Hero />
        <About settings={settings} />
        <Work projects={projects} />
        <MediaFeed media={media} posts={posts} />
        <Skills />
        <Contact links={settings} />
      </main>

      <Footer onSecretTap={handleSecretTap} />

      {showLogin && (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}