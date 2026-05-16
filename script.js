/* ============================================================
   NEON NOIR — interactions
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Code rain (canvas) ---------- */
  function initCodeRain() {
    const canvas = $('#codeRain');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const FONT_SIZE = 16;
    const CHARS = '01010101アァカサタナハマヤャラワABCDEF0123456789'.split('');

    let width = 0, height = 0, columns = 0, drops = [], dpr = 1;
    let running = true;
    let rafId = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width  = canvas.clientWidth  = canvas.parentElement.clientWidth;
      height = canvas.clientHeight = canvas.parentElement.clientHeight;
      canvas.width  = Math.floor(width  * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
      ctx.font = `${FONT_SIZE}px JetBrains Mono, monospace`;
      ctx.textBaseline = 'top';
    }

    function drawFrame(fade = 0.08) {
      ctx.fillStyle = `rgba(10, 6, 18, ${fade})`;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columns; i++) {
        const ch = CHARS[(Math.random() * CHARS.length) | 0];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // head glyph (cyan)
        ctx.fillStyle = '#22e5ff';
        ctx.shadowColor = '#22e5ff';
        ctx.shadowBlur = 6;
        ctx.fillText(ch, x, y);

        // trail glyph above (magenta)
        ctx.fillStyle = 'rgba(255, 46, 154, 0.85)';
        ctx.shadowColor = '#ff2e9a';
        ctx.shadowBlur = 8;
        const above = CHARS[(Math.random() * CHARS.length) | 0];
        ctx.fillText(above, x, y - FONT_SIZE);

        // soft far trail (faded magenta)
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 122, 196, 0.35)';
        ctx.fillText(CHARS[(Math.random() * CHARS.length) | 0], x, y - FONT_SIZE * 3);

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      ctx.shadowBlur = 0;
    }

    function loop() {
      if (!running) return;
      drawFrame();
      rafId = requestAnimationFrame(loop);
    }

    resize();

    if (prefersReduced) {
      // single static-looking frame
      ctx.fillStyle = 'rgba(10, 6, 18, 1)';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < columns; i++) {
        const x = i * FONT_SIZE;
        for (let j = 0; j < Math.floor(height / FONT_SIZE); j += 4) {
          ctx.fillStyle = 'rgba(255, 46, 154, 0.35)';
          ctx.fillText(CHARS[(Math.random() * CHARS.length) | 0], x, j * FONT_SIZE);
        }
      }
      return;
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        loop();
      }
    });

    // Pause when hero is off-screen
    const heroEl = $('#hero');
    if (heroEl && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (!running) {
                running = true;
                loop();
              }
            } else {
              running = false;
              cancelAnimationFrame(rafId);
            }
          });
        },
        { threshold: 0.01 }
      );
      io.observe(heroEl);
    }

    loop();
  }

  /* ---------- Smooth nav + active link ---------- */
  function initSmoothNav() {
    const nav = $('#siteNav');
    if (!nav) return;

    nav.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      nav.classList.remove('nav--open');
      const burger = $('.nav__burger', nav);
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  }

  /* ---------- Burger ---------- */
  function initBurger() {
    const nav = $('#siteNav');
    const burger = $('.nav__burger', nav);
    if (!nav || !burger) return;

    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const selectors = [
      '.section__head',
      '.card',
      '.stat',
      '.keycard',
      '.channel',
      '.hero__content > *',
      '.operatives__copy > *',
    ];
    const targets = $$(selectors.join(','));
    targets.forEach((el) => el.classList.add('reveal'));

    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, idx) => {
          if (e.isIntersecting) {
            // small stagger for siblings
            const delay = (idx % 4) * 80;
            setTimeout(() => e.target.classList.add('is-visible'), delay);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Glitch nudge ---------- */
  function initGlitch() {
    if (prefersReduced) return;
    const title = $('.hero__title.glitch');
    if (!title) return;

    function burst() {
      title.classList.add('glitch--burst');
      setTimeout(() => title.classList.remove('glitch--burst'), 450);
    }

    const tick = () => {
      burst();
      const next = 3500 + Math.random() * 4000;
      setTimeout(tick, next);
    };
    setTimeout(tick, 1800);
  }

  /* ---------- Scroll spy ---------- */
  function initScrollSpy() {
    const sections = $$('main section[id]');
    const links = $$('.nav__links a[href^="#"]');
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    const linkFor = (id) => links.find((a) => a.getAttribute('href') === `#${id}`);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const link = linkFor(e.target.id);
          if (!link) return;
          if (e.isIntersecting) {
            links.forEach((l) => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'true');
          }
        });
      },
      { threshold: 0.45 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Contact form ---------- */
  function initChannel() {
    const form = $('.channel');
    const ack  = $('.channel__ack');
    const ackText = $('.ack__text', ack);
    const errEl = $('.channel__error', form);
    if (!form || !ack || !ackText) return;

    function typeOut(text) {
      if (prefersReduced) {
        ackText.textContent = text;
        return;
      }
      ackText.textContent = '';
      let i = 0;
      const timer = setInterval(() => {
        ackText.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(timer);
      }, 28);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errEl.textContent = '';

      const data = new FormData(form);
      // honeypot
      if ((data.get('website') || '').toString().trim() !== '') return;

      const name    = (data.get('name')    || '').toString().trim();
      const handle  = (data.get('handle')  || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !handle || !message) {
        errEl.textContent = '// transmission incomplete — all fields required.';
        return;
      }

      form.hidden = true;
      ack.hidden = false;
      typeOut('Channel established. Stand by — an operative will respond on your handle.');
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  function boot() {
    initCodeRain();
    initSmoothNav();
    initBurger();
    initReveal();
    initGlitch();
    initScrollSpy();
    initChannel();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
