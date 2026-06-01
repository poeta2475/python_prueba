/* OmarDev — Control de tema (claro/oscuro)
 * Se carga en <head> (sin defer) para aplicar el tema antes del primer
 * pintado y evitar el "flash" de tema incorrecto.
 */
(function () {
  'use strict';
  const KEY = 'nexapy:theme';

  function preferred() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#0a0b0f');
  }

  // Aplica de inmediato (antes del render)
  apply(preferred());

  // Exponer API y conectar los toggles cuando el DOM esté listo
  window.NexaTheme = {
    get() {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    },
    set(theme) {
      apply(theme);
      try { localStorage.setItem(KEY, theme); } catch (_) {}
    },
    toggle() {
      this.set(this.get() === 'light' ? 'dark' : 'light');
    },
  };

  function wire() {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => window.NexaTheme.toggle());
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
