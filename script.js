/* NexaPy Analytics — Interactive Scripts */

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger (placeholder for full mobile menu) ──────
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
});

// ── Scroll reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.feature-card, .stat-card, .testimonial-card, .pricing-card, .step, .cta-box'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ── Animated stat counters ────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('es');
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ── Billing toggle (monthly / annual) ────────────────────────
const toggle = document.getElementById('billing-toggle');
const monthlyLabel = document.getElementById('monthly-label');
const annualLabel = document.getElementById('annual-label');

if (toggle) {
  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);

    document.querySelectorAll('.price-amount[data-monthly]').forEach(el => {
      const val = isAnnual ? el.dataset.annual : el.dataset.monthly;
      el.textContent = val ? `$${val}` : el.textContent;
    });
  });
}

// ── Contact form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Mensaje enviado';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Enviar mensaje →';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

// ── Smooth anchor scroll ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
