/* TresDev — Capa de datos cliente (localStorage) */
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

  // Hash ligero (demo). En producción: bcrypt/argon2 en servidor.
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

    // ---- Usuarios (email/password) ----
    getUsers() {
      return read(KEYS.users, []);
    },
    findUser(email) {
      const e = String(email).trim().toLowerCase();
      return this.getUsers().find((u) => u.email === e) || null;
    },
    findUserByGoogleId(googleId) {
      return this.getUsers().find((u) => u.googleId === googleId) || null;
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
    createGoogleUser({ googleId, name, email, picture }) {
      const e = String(email).trim().toLowerCase();
      // Si ya existe con ese Google ID, devolver el mismo usuario
      const byGoogle = this.findUserByGoogleId(googleId);
      if (byGoogle) return { ok: true, user: byGoogle };
      // Si existe cuenta de correo con ese email, vincular Google
      const byEmail = this.findUser(e);
      if (byEmail) {
        byEmail.googleId = googleId;
        byEmail.picture = picture;
        const updated = this.getUsers().map((u) => (u.email === e ? byEmail : u));
        write(KEYS.users, updated);
        return { ok: true, user: byEmail };
      }
      // Usuario nuevo desde Google
      const user = {
        id: 'usr_' + Date.now().toString(36),
        name: name.trim(),
        email: e,
        company: '',
        googleId,
        picture: picture || '',
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
      if (!user.passwordHash) return { ok: false, error: 'Esta cuenta usa Google. Inicia sesión con Google.' };
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
        picture: user.picture || '',
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

    // ---- Leads ----
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
