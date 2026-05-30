/* NexaPy Analytics — Capa de datos cliente (localStorage)
 * Centraliza usuarios, sesión y leads. Sin backend: persistencia local.
 */
(function (global) {
  'use strict';

  const KEYS = {
    users: 'nexapy:users',
    session: 'nexapy:session',
    leads: 'nexapy:leads',
    newsletter: 'nexapy:newsletter',
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  // Hash ligero (NO criptográfico) solo para no guardar la contraseña en claro
  // en una demo. En producción esto vive en el servidor con bcrypt/argon2.
  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16);
  }

  const Store = {
    KEYS,

    // ---- Usuarios ----
    getUsers() {
      return read(KEYS.users, []);
    },
    findUser(email) {
      const e = String(email).trim().toLowerCase();
      return this.getUsers().find((u) => u.email === e) || null;
    },
    createUser({ name, email, password, company }) {
      const e = String(email).trim().toLowerCase();
      if (this.findUser(e)) {
        return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
      }
      const user = {
        id: 'usr_' + Date.now().toString(36),
        name: name.trim(),
        email: e,
        company: (company || '').trim(),
        passwordHash: hash(password),
        createdAt: new Date().toISOString(),
      };
      const users = this.getUsers();
      users.push(user);
      write(KEYS.users, users);
      return { ok: true, user };
    },
    verifyCredentials(email, password) {
      const user = this.findUser(email);
      if (!user) return { ok: false, error: 'No existe una cuenta con ese correo.' };
      if (user.passwordHash !== hash(password)) {
        return { ok: false, error: 'Contraseña incorrecta.' };
      }
      return { ok: true, user };
    },

    // ---- Sesión ----
    startSession(user, remember) {
      const session = {
        userId: user.id,
        name: user.name,
        email: user.email,
        startedAt: Date.now(),
        remember: !!remember,
      };
      write(KEYS.session, session);
      return session;
    },
    getSession() {
      return read(KEYS.session, null);
    },
    endSession() {
      localStorage.removeItem(KEYS.session);
    },
    requireSession(redirect) {
      const s = this.getSession();
      if (!s && redirect) {
        location.href = redirect + '?next=' + encodeURIComponent(location.pathname.split('/').pop());
      }
      return s;
    },

    // ---- Leads (formulario de contacto) ----
    saveLead(lead) {
      const leads = read(KEYS.leads, []);
      leads.push({ ...lead, id: 'lead_' + Date.now().toString(36), at: new Date().toISOString() });
      write(KEYS.leads, leads);
      return true;
    },
    getLeads() {
      return read(KEYS.leads, []);
    },

    // ---- Newsletter ----
    subscribe(email) {
      const e = String(email).trim().toLowerCase();
      const list = read(KEYS.newsletter, []);
      if (list.includes(e)) return { ok: false, error: 'Ese correo ya está suscrito.' };
      list.push(e);
      write(KEYS.newsletter, list);
      return { ok: true };
    },
  };

  global.NexaStore = Store;
})(window);
