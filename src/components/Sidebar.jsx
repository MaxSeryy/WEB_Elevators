import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function navClass(isActive) {
  return isActive ? 'brand-normal-a' : 'brand-normal';
}

export default function Sidebar({ mobileOpen, onCloseMobile, onOpenSettings }) {
  return (
    <>
      <div
        className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
        role="button"
        tabIndex={0}
        aria-label="Закрити меню"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            onCloseMobile();
          }
        }}
      />

      <aside className={`mobile-sidebar ${mobileOpen ? 'open' : ''}`} aria-hidden={mobileOpen ? 'false' : 'true'}>
        <div className="mobile-sidebar-top">
          <button
            className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center justify-center"
            aria-label="Закрити меню"
            onClick={onCloseMobile}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="mobile-sidebar-content">
            <h1 className="brand-heading">Elevator<br />Control</h1>
            <nav>
              <ul className="space-y-4">
                <li>
                  <NavLink to="/" className={({ isActive }) => navClass(isActive)} onClick={onCloseMobile}>Головна</NavLink>
                </li>
                <li>
                  <NavLink to="/stats" className={({ isActive }) => navClass(isActive)} onClick={onCloseMobile}>Статистика</NavLink>
                </li>
                <li>
                  <button className="brand-normal" type="button" onClick={() => { onOpenSettings(); onCloseMobile(); }}>
                    Налаштування
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      <aside className="sidebar">
        <div className="p-8 space-y-10">
          <h1 className="brand-heading">Elevator<br />Control</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <NavLink to="/" className={({ isActive }) => navClass(isActive)}>Головна</NavLink>
              </li>
              <li>
                <NavLink to="/stats" className={({ isActive }) => navClass(isActive)}>Статистика</NavLink>
              </li>
              <li>
                <button className="brand-normal" type="button" onClick={onOpenSettings}>
                  Налаштування
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
