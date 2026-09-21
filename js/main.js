/* ==========================================================================
   C.T.O. — interactions
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- boot sequence ---------------- */
  const bootLines = [
    'INITIALISATION DU TERMINAL CTO...',
    'CHARGEMENT DU PROTOCOLE SÉCURISÉ... [OK]',
    'VÉRIFICATION DE L\'IDENTIFIANT...      [OK]',
    'ÉTABLISSEMENT DE LA LIAISON...         [OK]',
    'ACCÈS AU DOSSIER PUBLIC AUTORISÉ',
    '',
    'BIENVENUE, SURVIVANT.'
  ];

  function runBoot() {
    const el = document.getElementById('boot-lines');
    const screen = document.getElementById('boot-screen');
    if (!el || !screen) return;

    let i = 0;
    function nextLine() {
      if (i >= bootLines.length) {
        setTimeout(() => screen.classList.add('hidden'), 450);
        return;
      }
      const line = bootLines[i];
      const span = document.createElement('div');
      if (line.includes('[OK]')) span.classList.add('ok');
      span.textContent = line;
      el.appendChild(span);
      i++;
      setTimeout(nextLine, line ? 180 + Math.random() * 120 : 120);
    }
    nextLine();
  }

  /* ---------------- typed devise ---------------- */
  function typeDevise() {
    const target = document.getElementById('typed-devise');
    if (!target) return;
    const text = 'Nous tenons la ligne pendant que le monde s\'effondre.';
    let i = 0;
    function tick() {
      target.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) setTimeout(tick, 35);
    }
    setTimeout(tick, 1900);
  }

  /* ---------------- nav ---------------- */
  function initNav() {
    const nav = document.getElementById('site-nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });

    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[data-nav]');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------------- reveal on scroll ---------------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => obs.observe(el));
  }

  /* ---------------- animated counters ---------------- */
  function initCounters() {
    const nums = document.querySelectorAll('.stat-num');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);
        if (el.hasAttribute('data-infinite')) {
          el.textContent = '∞';
          return;
        }
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 900;
        const start = performance.now();
        function frame(now) {
          const p = Math.min(1, (now - start) / duration);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.6 });
    nums.forEach(el => obs.observe(el));
  }

  /* ---------------- ash particles ---------------- */
  function initAsh() {
    const canvas = document.getElementById('ash-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeParticles() {
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        s: 0.15 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 0.3,
        o: 0.1 + Math.random() * 0.35
      }));
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(168,196,119,1)';
      particles.forEach(p => {
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.s;
        p.x += p.drift;
        if (p.y > h) { p.y = -4; p.x = Math.random() * w; }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }

    resize();
    makeParticles();
    window.addEventListener('resize', () => { resize(); makeParticles(); });
    requestAnimationFrame(loop);
  }

  document.addEventListener('DOMContentLoaded', () => {
    runBoot();
    typeDevise();
    initNav();
    initReveal();
    initCounters();
    initAsh();
  });
})();
