/* OmarDev — Lógica de autenticación (login / signup + Google OAuth) */
(function () {
  'use strict';
  const { toast, Validate, setFieldError, clearFieldError } = window.NexaUI;
  const Store = window.NexaStore;

  // ── Configuración Google OAuth ──────────────────────────────────────────
  // Para activar Google: crea un proyecto en console.cloud.google.com,
  // habilita "Google Identity", crea un OAuth 2.0 Web Client y añade
  // tu dominio (https://poeta2475.github.io) como Authorized JavaScript origin.
  // Reemplaza la cadena vacía con tu client_id real.
  const GOOGLE_CLIENT_ID = '';
  // ────────────────────────────────────────────────────────────────────────

  if (Store.getSession()) {
    location.href = 'index.html';
    return;
  }

  function getNext() {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    return next && /^[\w.-]+\.html$/.test(next) ? next : 'index.html';
  }

  // ── Google OAuth ─────────────────────────────────────────────────────────
  function decodeJWT(token) {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch (_) {
      return null;
    }
  }

  function handleGoogleCredential(response) {
    const payload = decodeJWT(response.credential);
    if (!payload) {
      toast('Error al procesar la respuesta de Google.', 'error');
      return;
    }
    const res = Store.createGoogleUser({
      googleId: payload.sub,
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      picture: payload.picture || '',
    });
    if (!res.ok) {
      toast(res.error, 'error');
      return;
    }
    Store.startSession(res.user, true);
    toast('¡Bienvenido, ' + res.user.name.split(' ')[0] + '!', 'success');
    setTimeout(() => (location.href = getNext()), 600);
  }

  function initGoogle() {
    if (!GOOGLE_CLIENT_ID || !window.google) return;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
    });
  }

  function triggerGoogleSignIn() {
    if (!GOOGLE_CLIENT_ID) {
      toast('Google OAuth no está configurado aún. Usa correo y contraseña.', 'info');
      return;
    }
    if (!window.google) {
      toast('Cargando Google… intenta de nuevo en un momento.', 'info');
      loadGoogleScript(function () { google.accounts.id.prompt(); });
      return;
    }
    google.accounts.id.prompt();
  }

  function loadGoogleScript(cb) {
    if (window.google) { if (cb) cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = function () { initGoogle(); if (cb) cb(); };
    document.head.appendChild(s);
  }

  // Botón Google
  var googleBtn = document.getElementById('googleSignInBtn');
  if (googleBtn) {
    if (GOOGLE_CLIENT_ID) loadGoogleScript();
    googleBtn.addEventListener('click', triggerGoogleSignIn);
  }

  // ── Login (email/password) ────────────────────────────────────────────────
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const email = loginForm.querySelector('#email');
    const password = loginForm.querySelector('#password');
    [email, password].forEach((f) => f.addEventListener('input', () => clearFieldError(f)));

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      if (!Validate.email(email.value)) {
        setFieldError(email, 'Introduce un correo válido.');
        ok = false;
      }
      if (!Validate.required(password.value)) {
        setFieldError(password, 'Introduce tu contraseña.');
        ok = false;
      }
      if (!ok) return;

      const res = Store.verifyCredentials(email.value, password.value);
      if (!res.ok) {
        setFieldError(password, res.error);
        toast(res.error, 'error');
        return;
      }
      Store.startSession(res.user, loginForm.querySelector('#remember')?.checked);
      toast('¡Bienvenido de nuevo, ' + res.user.name.split(' ')[0] + '!', 'success');
      setTimeout(() => (location.href = getNext()), 600);
    });
  }

  // ── Signup (email/password) ───────────────────────────────────────────────
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const name = signupForm.querySelector('#name');
    const email = signupForm.querySelector('#email');
    const password = signupForm.querySelector('#password');
    const terms = signupForm.querySelector('#terms');
    const meter = signupForm.querySelector('#strengthMeter');
    const meterLabel = signupForm.querySelector('#strengthLabel');

    [name, email, password].forEach((f) => f.addEventListener('input', () => clearFieldError(f)));

    if (password && meter) {
      const labels = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Excelente'];
      const colors = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'];
      password.addEventListener('input', () => {
        const s = password.value ? Validate.passwordStrength(password.value) : 0;
        meter.style.width = (s / 4) * 100 + '%';
        meter.style.background = colors[s];
        if (meterLabel) meterLabel.textContent = password.value ? labels[s] : '';
      });
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      if (!Validate.minLen(name.value, 2)) {
        setFieldError(name, 'Introduce tu nombre.');
        ok = false;
      }
      if (!Validate.email(email.value)) {
        setFieldError(email, 'Introduce un correo válido.');
        ok = false;
      }
      if (!Validate.minLen(password.value, 8)) {
        setFieldError(password, 'La contraseña debe tener al menos 8 caracteres.');
        ok = false;
      } else if (Validate.passwordStrength(password.value) < 2) {
        setFieldError(password, 'Usa mayúsculas, números o símbolos para reforzarla.');
        ok = false;
      }
      if (terms && !terms.checked) {
        toast('Debes aceptar los términos para continuar.', 'error');
        ok = false;
      }
      if (!ok) return;

      const res = Store.createUser({
        name: name.value,
        email: email.value,
        company: '',
        password: password.value,
      });
      if (!res.ok) {
        setFieldError(email, res.error);
        toast(res.error, 'error');
        return;
      }
      Store.startSession(res.user, true);
      toast('¡Cuenta creada! Bienvenido, ' + res.user.name.split(' ')[0] + '.', 'success');
      setTimeout(() => (location.href = 'index.html'), 700);
    });
  }

  // Mostrar/ocultar contraseña
  document.querySelectorAll('.toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Ocultar' : 'Ver';
      btn.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  });

  // Si llegan con ?g=1 (desde CTA de Google en index), disparar Google directamente
  if (new URLSearchParams(location.search).get('g') === '1' && GOOGLE_CLIENT_ID) {
    loadGoogleScript(function () { google.accounts.id.prompt(); });
  }
})();
