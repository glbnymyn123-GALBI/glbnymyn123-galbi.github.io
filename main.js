// Progressive enhancement only: the page reads fine without this file.
(() => {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Theme toggle: an explicit choice wins over the system setting and is remembered.
  const store = {
    get() {
      try { return localStorage.getItem('theme'); } catch { return null; }
    },
    set(value) {
      try { localStorage.setItem('theme', value); } catch { /* storage unavailable */ }
    },
  };
  const currentTheme = () => root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  const toggle = document.querySelector('[data-theme-toggle]');
  const syncToggle = () => {
    if (!toggle) return;
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${next} theme`);
  };
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set(next);
      syncToggle();
    });
    if (systemDark.addEventListener) systemDark.addEventListener('change', syncToggle);
    syncToggle();
  }

  // Nav gets its hairline once the page leaves the very top.
  const nav = document.querySelector('[data-nav]');
  const sentinel = document.querySelector('[data-top-sentinel]');
  if (nav && sentinel && hasIO) {
    new IntersectionObserver(([entry]) => {
      nav.classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  }

  // Mark the nav link for the section in view. The hero is watched too, so no link
  // stays highlighted after scrolling back to the top.
  const links = [...document.querySelectorAll('.nav__links a')];
  const sections = [document.getElementById('top'), ...links.map((a) => document.querySelector(a.getAttribute('href')))].filter(Boolean);
  if (sections.length && hasIO) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => spy.observe(section));
  }

  // Reveal sections as they enter the viewport.
  if (!reduceMotion && hasIO) {
    root.classList.add('reveal-ready');
    const reveal = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));
  }

  // Copy the email address, with a fallback for browsers without the async clipboard.
  const status = document.querySelector('[data-copy-status]');
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const label = button.querySelector('[data-copy-label]');
    let timer;
    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-copy');
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        field.remove();
      }
      if (label) label.textContent = ok ? 'Copied' : 'Copy failed';
      if (status) status.textContent = ok ? 'Email address copied.' : `Could not copy. The address is ${text}.`;
      button.classList.toggle('is-done', ok);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (label) label.textContent = 'Copy address';
        button.classList.remove('is-done');
      }, 2200);
    });
  });

  // If a screenshot fails to load, show a quiet placeholder instead of a broken image.
  // Only trust the error event: srcset images can report complete with zero width
  // while the browser is still choosing a candidate.
  document.querySelectorAll('img').forEach((img) => {
    const frame = img.closest('.shot, .case__media, .case__phone, .wf');
    if (!frame) return;
    img.addEventListener('error', () => {
      if (!img.naturalWidth) frame.classList.add('is-missing');
    });
    img.addEventListener('load', () => frame.classList.remove('is-missing'));
  });
})();
