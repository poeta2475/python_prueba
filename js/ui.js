/* OmarDev — utilidades de UI compartidas: toasts + validación */
(function (global) {
  'use strict';

  // ---- Toast ----
  let container;
  function ensureContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    return container;
  }
  function toast(message, type = 'info', timeout = 4000) {
    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    const icon = { success: '✓', error: '!', info: 'i' }[type] || 'i';
    el.innerHTML = '<span class="toast-icon">' + icon + '</span><span>' + message + '</span>';
    ensureContainer().appendChild(el);
    requestAnimationFrame(() => el.classList.add('toast--show'));
    const close = () => {
      el.classList.remove('toast--show');
      setTimeout(() => el.remove(), 300);
    };
    setTimeout(close, timeout);
    el.addEventListener('click', close);
  }

  // ---- Validadores ----
  const Validate = {
    email(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
    },
    required(v) {
      return String(v).trim().length > 0;
    },
    minLen(v, n) {
      return String(v).trim().length >= n;
    },
    // Devuelve fuerza 0..4 de una contraseña
    passwordStrength(v) {
      let s = 0;
      if (v.length >= 8) s++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      return s;
    },
  };

  // Marca un campo con error y muestra mensaje en su .field-error asociado
  function setFieldError(input, message) {
    const group = input.closest('.form-group') || input.parentElement;
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    let err = group.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      group.appendChild(err);
    }
    err.textContent = message;
  }
  function clearFieldError(input) {
    const group = input.closest('.form-group') || input.parentElement;
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    const err = group.querySelector('.field-error');
    if (err) err.textContent = '';
  }

  global.NexaUI = { toast, Validate, setFieldError, clearFieldError };
})(window);
