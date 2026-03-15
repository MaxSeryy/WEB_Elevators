(function () {
  function initThemeToggle(options) {
    var config = options || {};
    var themeToggleBtn = document.getElementById('theme-toggle');
    var htmlElement = document.documentElement;

    if (!themeToggleBtn) {
      return { setTheme: function () {} };
    }

    var moon = themeToggleBtn.querySelector('[data-icon="moon"]');
    var sun = themeToggleBtn.querySelector('[data-icon="sun"]');
    var storedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function syncIcons(isDark) {
      if (!moon || !sun) {
        return;
      }

      moon.classList.toggle('hidden', isDark);
      sun.classList.toggle('hidden', !isDark);
    }

    function setTheme(isDark) {
      htmlElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      syncIcons(isDark);

      if (typeof config.onThemeChange === 'function') {
        config.onThemeChange(isDark);
      }
    }

    setTheme(storedTheme ? storedTheme === 'dark' : prefersDark);

    themeToggleBtn.addEventListener('click', function () {
      setTheme(!htmlElement.classList.contains('dark'));
    });

    return { setTheme: setTheme };
  }

  window.AppTheme = {
    initThemeToggle: initThemeToggle,
  };
})();
