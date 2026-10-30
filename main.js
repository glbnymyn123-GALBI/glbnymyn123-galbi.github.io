// Theme toggle, scroll reveals, the showreel and the film player, copy-email button.
(() => {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Theme (the head script applies a saved choice before first paint) ----------
  const saved = () => {
    try { return localStorage.getItem('theme'); } catch { return null; }
  };
  const save = (value) => {
    try { localStorage.setItem('theme', value); } catch { /* storage unavailable */ }
  };
  const currentTheme = () => root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  const toggle = document.querySelector('[data-theme-toggle]');
  const syncToggle = () => {
    if (!toggle) return;
    const dark = currentTheme() === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    toggle.querySelector('use').setAttribute('href', `assets/icons.svg#i-${dark ? 'sun' : 'moon'}`);
  };
  if (toggle) {
    syncToggle();
    toggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      syncToggle();
    });
    systemDark.addEventListener('change', () => {
      if (!saved()) syncToggle();
    });
  }

  // ---------- Navigation border once the page scrolls ----------
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => nav && nav.toggleAttribute('data-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // ---------- Films: one dialog plays them all, with sound ----------
  const FILMS = {
    marinepulse: { title: 'MarinePulse', length: '1:26' },
    pipeline: { title: 'Narrative monitoring pipeline', length: '1:25' },
    mycan: { title: 'MyCan', length: '0:30' },
    esther: { title: 'Esther Gomelle', length: '0:30' },
  };
  const theater = document.querySelector('[data-theater]');
  const screen = theater && theater.querySelector('video');
  const reel = document.querySelector('[data-reel] video');
  let reelInView = false;

  const playReel = () => {
    if (reel && !reduceMotion && reelInView && !(theater && theater.open)) reel.play().catch(() => {});
  };

  const openFilm = (id) => {
    const film = FILMS[id];
    if (!film || !theater || !screen) return;
    theater.querySelector('[data-theater-title]').textContent = `${film.title} · ${film.length}`;
    screen.poster = `assets/films/${id}-poster.jpg`;
    screen.src = `assets/films/${id}.mp4`;
    if (reel) reel.pause();
    if (typeof theater.showModal === 'function') theater.showModal();
    else theater.setAttribute('open', '');
    screen.play().catch(() => {});
  };

  document.querySelectorAll('[data-open-film]').forEach((trigger) => {
    trigger.addEventListener('click', () => openFilm(trigger.dataset.openFilm));
  });

  if (theater && screen) {
    theater.querySelector('[data-theater-close]').addEventListener('click', () => theater.close());
    // A click on the dimmed backdrop lands on the dialog itself.
    theater.addEventListener('click', (event) => {
      if (event.target === theater) theater.close();
    });
    theater.addEventListener('close', () => {
      screen.pause();
      screen.removeAttribute('src');
      screen.load();
      playReel();
    });
  }

  // ---------- Showreel: a muted loop while on screen; each bar fills while its film shows ----------
  if (reel) {
    const chapters = [...document.querySelectorAll('[data-chapter]')];
    const cuts = [0, 3, 6, 9, 12.4];
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entry]) => {
          reelInView = entry.isIntersecting;
          if (reelInView) playReel();
          else reel.pause();
        },
        { threshold: 0.3 },
      ).observe(reel);
    }
    if (!reduceMotion) {
      const tick = () => {
        const t = reel.currentTime;
        chapters.forEach((chapter, i) => {
          const p = Math.min(1, Math.max(0, (t - cuts[i]) / (cuts[i + 1] - cuts[i])));
          chapter.style.setProperty('--p', p.toFixed(3));
          chapter.toggleAttribute('data-active', t >= cuts[i] && t < cuts[i + 1]);
        });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  // ---------- Copy the email address ----------
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const status = button.parentElement.querySelector('[role="status"]');
    const icon = button.querySelector('use');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        icon.setAttribute('href', 'assets/icons.svg#i-check');
        if (status) status.textContent = 'Copied';
        setTimeout(() => {
          icon.setAttribute('href', 'assets/icons.svg#i-copy');
          if (status) status.textContent = '';
        }, 1800);
      } catch {
        if (status) status.textContent = 'Copy failed. Select the address instead.';
      }
    });
  });
})();
