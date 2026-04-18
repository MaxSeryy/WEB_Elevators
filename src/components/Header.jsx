import React from 'react';

export default function Header({ isDark, onToggleTheme, onToggleMobileMenu }) {
  return (
    <header className="flex items-center px-8 pt-8 pb-4 md:p-8">
      <button
        className="md:hidden w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-400 dark:hover:bg-slate-600 duration-300"
        aria-label="Відкрити меню"
        onClick={onToggleMobileMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <button
        className="ml-auto w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-400 dark:hover:bg-slate-600 transition duration-300"
        aria-label="Toggle dark mode"
        onClick={onToggleTheme}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-6 md:w-6 text-slate-800 dark:text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            className={isDark ? 'hidden' : ''}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
          <path
            className={isDark ? '' : 'hidden'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36 6.36-1.42-1.42M7.05 7.05 5.64 5.64m12.72 0-1.41 1.41M7.05 16.95 5.64 18.36M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      </button>
    </header>
  );
}
