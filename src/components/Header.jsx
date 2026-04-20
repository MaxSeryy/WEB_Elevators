import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';

export default function Header({ isDark, onToggleTheme, onToggleMobileMenu, connectionLost }) {
  return (
    <header className="flex items-center px-8 pt-8 pb-4 md:p-8">
      <button
        className="md:hidden w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-400 dark:hover:bg-slate-600 duration-300"
        aria-label="Відкрити меню"
        onClick={onToggleMobileMenu}
      >
        <Menu size={28} />
      </button>

      {connectionLost ? (
        <div className="ml-4 px-3 py-2 rounded-full bg-red-600 text-white text-xs font-semibold tracking-wide uppercase">
          Connection Lost
        </div>
      ) : null}

      <button
        className="ml-auto w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-400 dark:hover:bg-slate-600 transition duration-300"
        aria-label="Toggle dark mode"
        onClick={onToggleTheme}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </header>
  );
}
