/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./public/**/*.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-bg': '#f8fafc',
        'brand-panel': '#cbd5e1',
        'brand-card': '#e2e8f0',
        'brand-accent': '#3b82f6',
        'brand-door-open': '#dc2626',
        'brand-door-closed': '#16a34a',
        // for dark
        'brand-dark-bg': '#0f172a',
        'brand-dark-panel': '#1e293b',
        'brand-dark-card': '#334155',
      },
      borderRadius: {
        'defrad': '16px',
      }
    },
  },
  plugins: [],
}