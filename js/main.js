/* NexaPy Analytics — Interacciones de la landing */
(function () {
  'use strict';
  const { toast, Validate, setFieldError, clearFieldError } = window.NexaUI;
  const Store = window.NexaStore;

  // ── Navbar: estado scrolled ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Menú móvil funcional ─────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');
  function setMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  }
  if (hamburger) {
    hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  }
  if (backdrop) backdrop.addEventListener('click', () => setMenu(false));
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  // ── Sesión: ajustar nav si hay usuario ──────────────────────
  const session = Store.getSession();
  if (session) {
    document.querySelectorAll('[data-auth="guest"]').forEach((el) => (el.style.display = 'none'));
    document.querySelectorAll('[data-auth="user"]').forEach((el) => {
      el.style.display = '';
      const label = el.querySelector('[data-user-name]');
      if (label) label.textContent = session.name.split(' ')[0];
    });
  } else {
    document.querySelectorAll('[data-auth="user"]').forEach((el) => (el.style.display = 'none'));
  }

  // ── Animaciones (respetando reduced-motion) ──────────────────
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = document.querySelectorAll(
    '.feature-card, .stat-card, .testimonial-card, .pricing-card, .step, .cta-box, .faq-item'
  );
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), Math.min(i, 6) * 70);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // ── Contadores animados ──────────────────────────────────────
  function animateCounter(el) {
    const target = +el.dataset.target;
    if (reduceMotion) {
      el.textContent = target.toLocaleString('es');
      return;
    }
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target).toLocaleString('es');
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('es');
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  // ── Toggle de facturación (mensual / anual) ──────────────────
  const billing = document.getElementById('billing-toggle');
  if (billing) {
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    billing.addEventListener('change', () => {
      const annual = billing.checked;
      monthlyLabel.classList.toggle('active', !annual);
      annualLabel.classList.toggle('active', annual);
      document.querySelectorAll('.price-amount[data-monthly]').forEach((el) => {
        const v = annual ? el.dataset.annual : el.dataset.monthly;
        if (v) el.textContent = '$' + v;
      });
      document.querySelectorAll('.price-period').forEach((p) => {
        if (p.dataset.lock) return;
        p.textContent = annual ? 'COP/mes · facturado anual' : 'COP/mes';
      });
    });
  }

  // ── FAQ acordeón ─────────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.contains('faq-open');
      // cierra los demás (acordeón de un solo abierto)
      document.querySelectorAll('.faq-item.faq-open').forEach((o) => {
        o.classList.remove('faq-open');
        o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('faq-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Newsletter ───────────────────────────────────────────────
  const news = document.getElementById('newsletterForm');
  if (news) {
    news.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = news.querySelector('input[type="email"]');
      clearFieldError(input);
      if (!Validate.email(input.value)) {
        setFieldError(input, 'Introduce un correo válido.');
        return;
      }
      const r = Store.subscribe(input.value);
      if (!r.ok) {
        toast(r.error, 'info');
        return;
      }
      toast('¡Suscrito! Revisa tu correo para confirmar.', 'success');
      input.value = '';
    });
  }

  // ── Formulario de contacto con validación real ───────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const fields = {
      name: form.querySelector('#name'),
      email: form.querySelector('#email'),
      message: form.querySelector('#message'),
    };
    Object.values(fields).forEach(
      (f) => f && f.addEventListener('input', () => clearFieldError(f))
    );

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      if (!Validate.required(fields.name.value)) {
        setFieldError(fields.name, 'El nombre es obligatorio.');
        valid = false;
      }
      if (!Validate.email(fields.email.value)) {
        setFieldError(fields.email, 'Introduce un correo válido.');
        valid = false;
      }
      if (!Validate.minLen(fields.message.value, 10)) {
        setFieldError(fields.message, 'Cuéntanos un poco más (mín. 10 caracteres).');
        valid = false;
      }
      if (!valid) {
        toast('Revisa los campos marcados.', 'error');
        return;
      }

      Store.saveLead({
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        company: (form.querySelector('#company') || {}).value || '',
        plan: (form.querySelector('#plan') || {}).value || '',
        message: fields.message.value.trim(),
      });

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Mensaje enviado';
      btn.classList.add('btn-success');
      btn.disabled = true;
      toast('Gracias, te contactaremos en menos de 2 horas hábiles.', 'success');
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('btn-success');
        btn.disabled = false;
      }, 3500);
    });
  }

  // ── Scroll suave + nav activo ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // ── Barra de progreso de scroll ──────────────────────────────
  const progress = document.getElementById('scrollProgress');
  if (progress) {
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      progress.style.width = (scrolled * 100).toFixed(2) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ── Botón volver arriba ──────────────────────────────────────
  const toTop = document.getElementById('backToTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    );
  }

  // ── Reveal de texto por palabras (hero) ──────────────────────
  if (!reduceMotion) {
    document.querySelectorAll('[data-words]').forEach((el) => {
      const html = el.innerHTML;
      // Solo divide nodos de texto, preserva <br> y <span>
      const parts = el.textContent.trim().split(/\s+/);
      if (el.querySelector('br, span')) return; // estructura compleja: no tocar
      el.innerHTML = parts
        .map((w, i) => `<span class="word" style="animation-delay:${i * 0.06}s">${w}</span>`)
        .join(' ');
    });
  }

  // ── Tilt 3D ──────────────────────────────────────────────────
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Spotlight que sigue el cursor ────────────────────────────
  document.querySelectorAll('.spotlight').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px');
      el.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  // ── Botones magnéticos ───────────────────────────────────────
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
    });
  }

  // ── Tabs de características ───────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-panel').forEach((p) =>
          p.classList.toggle('active', p.dataset.panel === id)
        );
      });
    });
  }

  // ── Calculadora de ROI ───────────────────────────────────────
  const roi = document.getElementById('roiCalc');
  if (roi) {
    const team = roi.querySelector('#roiTeam');
    const hours = roi.querySelector('#roiHours');
    const cost = roi.querySelector('#roiCost');
    const outTeam = roi.querySelector('#outTeam');
    const outHours = roi.querySelector('#outHours');
    const outCost = roi.querySelector('#outCost');
    const resSaved = roi.querySelector('#roiSaved');
    const resHours = roi.querySelector('#roiHoursSaved');
    const resRoi = roi.querySelector('#roiPercent');
    const PLAN_COST = 279000; // Professional/mes por usuario en COP
    const fmtCOP = (n) =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0,
      }).format(n);

    function calcRoi() {
      const people = +team.value;
      const hrs = +hours.value;
      const rate = +cost.value;
      outTeam.textContent = people;
      outHours.textContent = hrs + ' h';
      outCost.textContent = fmtCOP(rate);
      // NexaPy automatiza ~70% del tiempo dedicado a reportes manuales
      const hoursSavedWeek = hrs * 0.7 * people;
      const moneySavedMonth = hoursSavedWeek * 4.33 * rate;
      const investMonth = people * PLAN_COST;
      const net = moneySavedMonth - investMonth;
      const roiPct = investMonth ? (net / investMonth) * 100 : 0;
      resSaved.textContent = fmtCOP(moneySavedMonth);
      resHours.textContent = Math.round(hoursSavedWeek * 4.33).toLocaleString('es-CO') + ' h/mes';
      resRoi.textContent = (roiPct >= 0 ? '+' : '') + Math.round(roiPct).toLocaleString('es-CO') + '%';
    }
    [team, hours, cost].forEach((s) => s.addEventListener('input', calcRoi));
    calcRoi();
  }

  // ── Carrusel de testimonios ──────────────────────────────────
  const carousel = document.getElementById('testiCarousel');
  if (carousel) {
    const track = carousel.querySelector('.testi-track');
    const slides = carousel.querySelectorAll('.testimonial-card');
    const dotsWrap = document.getElementById('testiDots');
    const prev = document.getElementById('testiPrev');
    const next = document.getElementById('testiNext');
    let index = 0;
    let timer;

    // crea dots
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'testi-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
    });
    const dots = dotsWrap.querySelectorAll('.testi-dot');

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
      restart();
    }
    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), 6000);
    }
    prev && prev.addEventListener('click', () => go(index - 1));
    next && next.addEventListener('click', () => go(index + 1));
    restart();
  }

  // Año dinámico en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
