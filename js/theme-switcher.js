/**
 * Theme Switcher
 * Manages theme switching with localStorage persistence
 */

(function() {
  'use strict';

  // Available themes
  const THEMES = [
    { id: 'minimal', name: 'Minimal', icon: '.' },
    { id: 'terminal', name: 'Terminal', icon: '>' },
    { id: 'amber', name: 'Amber', icon: '*' },
    { id: 'paper', name: 'Paper', icon: '#' },
    { id: 'blueprint', name: 'Blueprint', icon: '+' },
    { id: 'vhs', name: 'VHS', icon: '~' },
    { id: 'midnight', name: 'Midnight', icon: '-' }
  ];

  const STORAGE_KEY = 'germanheller-theme';
  const DEFAULT_THEME = 'minimal';

  let currentThemeIndex = 0;

  /**
   * Get saved theme from localStorage
   */
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch (e) {
      // localStorage not available
      return DEFAULT_THEME;
    }
  }

  /**
   * Save theme to localStorage
   */
  function saveTheme(themeId) {
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Apply theme to document
   */
  function applyTheme(themeId, animate = true) {
    const root = document.documentElement;

    // Find theme index
    const themeIndex = THEMES.findIndex(t => t.id === themeId);
    if (themeIndex === -1) {
      themeId = DEFAULT_THEME;
      currentThemeIndex = 0;
    } else {
      currentThemeIndex = themeIndex;
    }

    // Optional transition overlay
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const overlay = document.querySelector('.theme-transition-overlay');
      if (overlay) {
        overlay.classList.add('is-active');
        setTimeout(() => {
          root.setAttribute('data-theme', themeId);
          setTimeout(() => {
            overlay.classList.remove('is-active');
          }, 200);
        }, 200);
      } else {
        root.setAttribute('data-theme', themeId);
      }
    } else {
      root.setAttribute('data-theme', themeId);
    }

    // Update button text
    updateButtonText(themeId);

    // Save preference
    saveTheme(themeId);

    // Update footer theme indicator
    updateFooterTheme(themeId);
  }

  /**
   * Update theme switcher button text
   */
  function updateButtonText(themeId) {
    const buttons = document.querySelectorAll('.theme-switcher');
    const theme = THEMES.find(t => t.id === themeId);

    buttons.forEach(button => {
      const textEl = button.querySelector('.theme-switcher__text');
      if (textEl && theme) {
        textEl.textContent = theme.name.toUpperCase();
      }
    });
  }

  /**
   * Update footer theme indicator
   */
  function updateFooterTheme(themeId) {
    const footerTheme = document.querySelector('.footer__theme-name');
    const theme = THEMES.find(t => t.id === themeId);

    if (footerTheme && theme) {
      footerTheme.textContent = theme.name;
    }
  }

  /**
   * Cycle to next theme
   */
  function nextTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    applyTheme(THEMES[currentThemeIndex].id);
  }

  /**
   * Set specific theme by ID
   */
  function setTheme(themeId) {
    applyTheme(themeId);
  }

  /**
   * Initialize theme switcher
   */
  function init() {
    // Apply saved theme immediately (no animation)
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme, false);

    // Set up click handlers
    document.querySelectorAll('.theme-switcher').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        nextTheme();
      });
    });

    // Keyboard shortcut: T to cycle themes
    document.addEventListener('keydown', (e) => {
      // Only if not typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 't' || e.key === 'T') {
        nextTheme();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API globally
  window.ThemeSwitcher = {
    setTheme,
    nextTheme,
    getThemes: () => THEMES,
    getCurrentTheme: () => THEMES[currentThemeIndex]
  };

})();
