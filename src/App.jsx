import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';

function Shell({ children, isDark, onToggleTheme, mobileOpen, onOpenMobile, onCloseMobile, onOpenSettings }) {
  return (
    <div className="bg-brand-bg text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={onCloseMobile} onOpenSettings={onOpenSettings} />

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header isDark={isDark} onToggleTheme={onToggleTheme} onToggleMobileMenu={onOpenMobile} />
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    deviceName: 'Elevator Control System',
    maxFloor: 7,
    updateInterval: 1800,
  });

  useEffect(() => {
    let storedTheme = null;
    try {
      storedTheme = localStorage.getItem('theme');
    } catch (_error) {
      storedTheme = null;
    }

    const supportsMatchMedia = typeof window.matchMedia === 'function';
    const prefersDark = supportsMatchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    const nextIsDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    setIsDark(nextIsDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (_error) {
      // Ignore storage write failures in restricted browser modes.
    }
  }, [isDark]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', mobileOpen);
  }, [mobileOpen]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={(
            <Shell
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
              mobileOpen={mobileOpen}
              onOpenMobile={() => setMobileOpen(true)}
              onCloseMobile={() => setMobileOpen(false)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            >
              <HomePage settings={settings} />
            </Shell>
          )}
        />

        <Route
          path="/stats"
          element={(
            <Shell
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
              mobileOpen={mobileOpen}
              onOpenMobile={() => setMobileOpen(true)}
              onCloseMobile={() => setMobileOpen(false)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            >
              <StatsPage isDark={isDark} />
            </Shell>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(nextSettings) => setSettings(nextSettings)}
      />
    </>
  );
}
