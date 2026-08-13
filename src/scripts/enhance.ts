// Mejoras progresivas compartidas por la home y el catálogo. Cada bloque se
// activa sólo si sus elementos existen en la página, así el mismo módulo sirve
// en cualquier ruta. El contenido siempre es visible sin JS; esto sólo anima y
// cablea interacciones opcionales.

// ── Pestañas de máquinas: los paneles ya están en el HTML; esto sólo cambia
//    cuál se muestra, con navegación por flechas / Home / End. ────────────────
(() => {
  const tablist = document.getElementById('tablist');
  if (!tablist) return;
  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('.tab')];

  function select(idx: number, focus: boolean) {
    tabs.forEach((t, i) => {
      const on = i === idx;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls')!);
      if (panel) (panel as HTMLElement).hidden = !on;
    });
    if (focus) tabs[idx].focus();
    tabs[idx].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => select(i, false)));
  tablist.addEventListener('keydown', (e) => {
    const cur = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (cur + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (cur - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== null) {
      e.preventDefault();
      select(next, true);
    }
  });
})();

// ── Sección activa en el nav ─────────────────────────────────────────────────
(() => {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav__link')];
  const idOf = (a: HTMLAnchorElement) => (a.getAttribute('href') || '').split('#')[1];
  const sections = links.map((a) => document.getElementById(idOf(a))).filter(Boolean) as HTMLElement[];
  if (!sections.length) return;
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.setAttribute('aria-current', idOf(a) === en.target.id ? 'true' : 'false'));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
})();

// ── Reveal al scrollear + contadores. El contenido es visible por defecto;
//    esto sólo lo anima. Si el observer no reporta nada, se muestra todo. ──────
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [...document.querySelectorAll<HTMLElement>('.reveal')];
  if (reduce) {
    items.forEach((el) => (el.dataset.in = 'true'));
    return;
  }

  let fired = false;
  const io = new IntersectionObserver(
    (entries, obs) => {
      fired = true;
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          setTimeout(() => ((e.target as HTMLElement).dataset.in = 'true'), i * 70);
          obs.unobserve(e.target);
        });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
  setTimeout(() => {
    if (!fired) {
      document.documentElement.classList.add('reveal-off');
      io.disconnect();
    }
  }, 1500);

  const nums = [...document.querySelectorAll<HTMLElement>('[data-count]')];
  const cio = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const end = Number((e.target as HTMLElement).dataset.count);
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - t0) / 1800, 1);
          e.target.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((n) => cio.observe(n));
})();

// ── Spotlight: el resplandor rojo sigue al puntero, en los KPIs del hero y en
//    las tarjetas de servicios. Sólo en hover (en táctil no dispara). ──────────
(() => {
  const cards = [...document.querySelectorAll<HTMLElement>('.stat, .f-card')];
  if (!cards.length) return;
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
})();

// ── Carrusel del catálogo: pasa de un slide a otro con fundido. Los slides ya
//    vienen en el HTML; acá sólo se decide cuál se muestra. Avanza solo, y se
//    detiene mientras el visitante tiene el mouse o el foco encima. ────────────
(() => {
  const root = document.querySelector<HTMLElement>('[data-carousel]');
  if (!root) return;
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-dot]')];
  if (slides.length < 2) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let actual = 0;
  let timer = 0;

  function mostrar(i: number) {
    actual = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const on = n === actual;
      s.dataset.active = String(on);
      // El slide oculto sale del orden de tabulación y del árbol accesible.
      if (on) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
      s.tabIndex = on ? 0 : -1;
    });
    dots.forEach((d, n) => d.setAttribute('aria-selected', String(n === actual)));
  }

  const detener = () => {
    if (timer) {
      clearInterval(timer);
      timer = 0;
    }
  };
  const arrancar = () => {
    if (reduce) return; // con "reducir movimiento" no avanza solo
    detener();
    timer = window.setInterval(() => mostrar(actual + 1), 5000);
  };

  dots.forEach((d, n) => d.addEventListener('click', () => { mostrar(n); arrancar(); }));
  root.querySelector('[data-prev]')?.addEventListener('click', () => { mostrar(actual - 1); arrancar(); });
  root.querySelector('[data-next]')?.addEventListener('click', () => { mostrar(actual + 1); arrancar(); });
  root.addEventListener('mouseenter', detener);
  root.addEventListener('mouseleave', arrancar);
  root.addEventListener('focusin', detener);
  root.addEventListener('focusout', arrancar);

  mostrar(0);
  arrancar();
})();
