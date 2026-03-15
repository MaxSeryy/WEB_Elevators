(function () {
  var THEME_KEY = 'theme';
  var THEME_QUERY_PARAM = 'theme';
  var WINDOW_NAME_PREFIX = '__app_theme=';

  function readThemeFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var value = params.get(THEME_QUERY_PARAM);
    return value === 'dark' || value === 'light' ? value : null;
  }

  function stripThemeQueryFromUrl() {
    if (typeof history.replaceState !== 'function') {
      return;
    }

    var url = new URL(window.location.href);
    if (!url.searchParams.has(THEME_QUERY_PARAM)) {
      return;
    }

    url.searchParams.delete(THEME_QUERY_PARAM);
    var cleanUrl = url.pathname + (url.search ? url.search : '') + url.hash;
    history.replaceState(null, '', cleanUrl);
  }

  function readThemeFromWindowName() {
    if (!window.name || window.name.indexOf(WINDOW_NAME_PREFIX) !== 0) {
      return null;
    }

    var value = window.name.slice(WINDOW_NAME_PREFIX.length);
    return value === 'dark' || value === 'light' ? value : null;
  }

  function writeThemeToWindowName(themeValue) {
    window.name = WINDOW_NAME_PREFIX + themeValue;
  }

  function readStoredTheme() {
    var queryTheme = readThemeFromUrl();
    if (queryTheme) {
      stripThemeQueryFromUrl();
      return queryTheme;
    }

    try {
      var localTheme = localStorage.getItem(THEME_KEY);
      if (localTheme === 'dark' || localTheme === 'light') {
        return localTheme;
      }
    } catch (_error) {
      // Ignore storage errors and use fallback below.
    }

    return readThemeFromWindowName();
  }

  function isInternalHtmlLink(rawHref) {
    if (!rawHref || rawHref.charAt(0) === '#') {
      return false;
    }

    var lowered = rawHref.toLowerCase();
    if (lowered.indexOf('javascript:') === 0 || lowered.indexOf('mailto:') === 0 || lowered.indexOf('tel:') === 0) {
      return false;
    }

    return true;
  }

  function updateThemeInInternalLinks(themeValue) {
    var links = document.querySelectorAll('a[href]');

    links.forEach(function (link) {
      var rawHref = link.getAttribute('href');
      if (!isInternalHtmlLink(rawHref)) {
        return;
      }

      var targetUrl = new URL(rawHref, window.location.href);
      if (targetUrl.protocol !== window.location.protocol) {
        return;
      }

      if (window.location.protocol !== 'file:' && targetUrl.origin !== window.location.origin) {
        return;
      }

      if (targetUrl.pathname.toLowerCase().indexOf('.html') === -1) {
        return;
      }

      targetUrl.searchParams.set(THEME_QUERY_PARAM, themeValue);
      link.setAttribute('href', targetUrl.href);
    });
  }

  function persistTheme(themeValue) {
    try {
      localStorage.setItem(THEME_KEY, themeValue);
    } catch (_error) {
      // Ignore storage errors and keep fallback persistence.
    }

    writeThemeToWindowName(themeValue);
    updateThemeInInternalLinks(themeValue);
  }

  function initThemeToggle(options) {
    var config = options || {};
    var themeToggleBtn = document.getElementById('theme-toggle');
    var htmlElement = document.documentElement;

    if (!themeToggleBtn) {
      return { setTheme: function () {} };
    }

    var moon = themeToggleBtn.querySelector('[data-icon="moon"]');
    var sun = themeToggleBtn.querySelector('[data-icon="sun"]');
    var storedTheme = readStoredTheme();
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
      persistTheme(isDark ? 'dark' : 'light');
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
