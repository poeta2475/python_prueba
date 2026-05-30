/* NexaPy Analytics — Lógica de autenticación (login / signup) */
(function () {
  'use strict';
  const { toast, Validate, setFieldError, clearFieldError } = window.NexaUI;
  const Store = window.NexaStore;

  // Si ya hay sesión, ir directo al dashboard
  if (Store.getSession()) {
    location.href = 'dashboard.html';
    return;
  }

  function getNext() {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    return next && /^[\w.-]+\.html$/.test(next) ? next : 'dashboard.html';
  }

  // ---------- LOGIN ----------
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
      toast('Bienvenido de nuevo, ' + res.user.name.split(' ')[0] + '.', 'success');
      setTimeout(() => (location.href = getNext()), 600);
    });
  }

  // ---------- SIGNUP ----------
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const name = signupForm.querySelector('#name');
    const email = signupForm.querySelector('#email');
    const company = signupForm.querySelector('#company');
    const password = signupForm.querySelector('#password');
    const terms = signupForm.querySelector('#terms');
    const meter = signupForm.querySelector('#strengthMeter');
    const meterLabel = signupForm.querySelector('#strengthLabel');

    [name, email, password].forEach((f) => f.addEventListener('input', () => clearFieldError(f)));

    // Medidor de fuerza en vivo
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
        company: company ? company.value : '',
        password: password.value,
      });
      if (!res.ok) {
        setFieldError(email, res.error);
        toast(res.error, 'error');
        return;
      }
      Store.startSession(res.user, true);
      toast('Cuenta creada. ¡Bienvenido a NexaPy!', 'success');
      setTimeout(() => (location.href = 'dashboard.html'), 700);
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
})();
