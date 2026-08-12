/**
 * Genera una ficha HTML por cada modelo en maquinas/<slug>.html
 *
 *   node build.js
 *
 * El nav, el menú mobile y el footer se recortan de index.html en vez de
 * duplicarlos, así hay una sola fuente de verdad mientras el sitio siga en
 * HTML plano. Al migrar a Astro esto lo reemplaza un layout.
 */
const fs = require('fs');
const path = require('path');
const { CATEGORIAS, TEL, waLink, waModelo } = require('./assets/catalogo.js');

const OUT = 'maquinas';
const index = fs.readFileSync('index.html', 'utf8');

// ── Recortar los bloques comunes de index.html ────────────────────────────
function recortar(desde, hasta, nombre) {
  const i = index.indexOf(desde);
  const j = index.indexOf(hasta, i);
  if (i < 0 || j < 0) throw new Error('No se pudo recortar: ' + nombre);
  return index.slice(i, j + hasta.length);
}

// Rutas relativas: las fichas viven un nivel más abajo, y los anchors de
// secciones apuntan al home, no a la propia ficha.
function reubicar(html) {
  return html
    .replace(/(src|href)="assets\//g, '$1="../assets/')
    .replace(/href="#(inicio|nosotros|maquinas|repuestos|servicios|tienda|contacto)"/g, 'href="../index.html#$1"');
}

const utility = reubicar(recortar('<div class="utility">', '</div>\n</div>', 'utility'));
const nav     = reubicar(recortar('<header class="nav" id="nav">', '</header>', 'nav'));
const sheet   = reubicar(recortar('<div class="sheet" id="sheet"', '<!-- ══════════════════ HERO', 'sheet')
                  .replace('<!-- ══════════════════ HERO', ''));
const footer  = reubicar(recortar('<footer class="footer">', '</footer>', 'footer'));
const fab     = reubicar(recortar('<a class="fab" id="fab"', '</a>', 'fab'));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const flecha = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const iconoWA = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.9 11.9 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411m-8.47 18.336h-.004a9.9 9.9 0 0 1-5.031-1.378l-.361-.214-3.741.975 1.005-3.639-.235-.374a9.86 9.86 0 0 1-1.516-5.26c.002-5.45 4.455-9.885 9.942-9.885a9.86 9.86 0 0 1 7.022 2.9 9.78 9.78 0 0 1 2.909 6.99c-.003 5.45-4.456 9.885-9.99 9.885"/></svg>';

// El toggle de tema debe aplicarse antes del primer pintado, o la ficha
// aparece en claro un instante antes de saltar a oscuro.
const antiFlash = `<script>(function(){try{var t=localStorage.getItem('casakira-theme');`
  + `document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}})()</script>`;

function ficha(cat, m) {
  const titulo = `${m.nombre} ${m.marca}`;
  const hermanos = cat.modelos.filter(o => o.slug !== m.slug);
  const otros = CATEGORIAS.filter(c => c.id !== cat.id).flatMap(c => c.modelos.map(o => ({ ...o, cat: c }))).slice(0, 3);
  const relacionados = hermanos.length ? hermanos.map(o => ({ ...o, cat })) : otros;

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: titulo, sku: m.ref, description: m.resumen,
    brand: { '@type': 'Brand', name: m.marca },
    category: cat.titulo,
    // Los datos estructurados necesitan URL absoluta: una ruta relativa no la
    // resuelve el rastreador.
    image: 'https://casakira.com.ar/assets/maquinas/' + m.img,
    url: 'https://casakira.com.ar/maquinas/' + m.slug + '.html',
    offers: {
      '@type': 'Offer', availability: 'https://schema.org/InStock',
      priceCurrency: 'ARS',
      seller: { '@type': 'Organization', name: 'Casa Kira S.R.L.' }
    }
  };

  return `<!DOCTYPE html>
<html lang="es-AR" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)} — Casa Kira</title>
<meta name="description" content="${esc(m.resumen)} Venta y servicio técnico en Casa Kira, Av. Forest 888, CABA.">
<link rel="canonical" href="https://casakira.com.ar/maquinas/${m.slug}.html">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(titulo)} — Casa Kira">
<meta property="og:description" content="${esc(m.resumen)}">
<meta property="og:image" content="https://casakira.com.ar/assets/maquinas/${m.img}">
<meta property="og:locale" content="es_AR">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23C1272D'/%3E%3Ctext x='32' y='47' font-family='Arial Black,Impact,sans-serif' font-size='44' font-weight='900' fill='%23fff' text-anchor='middle'%3EK%3C/text%3E%3C/svg%3E">
<meta name="theme-color" content="#C1272D">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
${antiFlash}
</head>
<body>

<a class="skip-link" href="#main">Saltar al contenido</a>

${utility}

${nav}

${sheet}

<main id="main">
  <div class="wrap">
    <nav aria-label="Migas de pan">
      <ol class="breadcrumb">
        <li><a href="../index.html">Inicio</a></li>
        <li><a href="../index.html#maquinas">Máquinas</a></li>
        <li><a href="../index.html#maquinas">${esc(cat.nombre)}</a></li>
        <li><span aria-current="page">${esc(m.marca)}</span></li>
      </ol>
    </nav>

    <div class="pdp">
      <div>
        <div class="photo-panel">
          <img src="../assets/maquinas/${m.img}" alt="${esc(titulo)}" width="250" height="167">
          <span class="photo-panel__tag">${esc(cat.nombre)} · ${esc(m.marca)}</span>
        </div>
      </div>

      <div>
        <p class="pdp__brand">${esc(m.marca)}</p>
        <h1>${esc(m.nombre)}</h1>
        <p class="pdp__resumen">${esc(m.resumen)}</p>

        <div class="chips" style="margin-top:var(--s-5)">
          ${m.chips.map(c => `<span class="chip">${esc(c)}</span>`).join('\n          ')}
        </div>

        <div class="pdp__cta">
          <a class="btn btn--primary" href="${waModelo(m, cat)}" target="_blank" rel="noopener">
            ${iconoWA} Consultar por WhatsApp
          </a>
          <a class="btn btn--ghost" href="tel:${TEL}">Llamar al 4553-2135</a>
        </div>

        <dl class="pdp__meta">
          <div><dt>Referencia</dt><dd class="mono">${esc(m.ref)}</dd></div>
          <div><dt>Categoría</dt><dd>${esc(cat.nombre)}</dd></div>
          <div><dt>Marca</dt><dd>${esc(m.marca)}</dd></div>
        </dl>
      </div>
    </div>

    <div class="pdp-detalle">
      <section>
        <h2>Características</h2>
        <ul class="feat-list" style="font-size:.9375rem">
          ${m.feats.map(f => `<li>${esc(f)}</li>`).join('\n          ')}
        </ul>
      </section>

      <section>
        <h2>Ficha técnica</h2>
        <table class="spec-table">
          <tbody>
            ${m.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </section>
    </div>

    <section class="related">
      <div class="related__head">
        <h2>${hermanos.length ? 'Otros modelos de ' + esc(cat.nombre).toLowerCase() : 'También te puede servir'}</h2>
        <a class="link-arrow" href="../index.html#maquinas">Ver todo el catálogo ${flecha}</a>
      </div>
      <div class="machines">
        ${relacionados.map(o => `<article class="m-card">
          <a class="m-card__media" href="${o.slug}.html" tabindex="-1" aria-hidden="true">
            <img src="../assets/maquinas/${o.img}" alt="${esc(o.nombre + ' ' + o.marca)}" width="640" height="440" loading="lazy">
            <span class="m-card__brand">${esc(o.marca)}</span>
          </a>
          <div class="m-card__body">
            <h3 class="m-card__title"><a class="m-card__link" href="${o.slug}.html">${esc(o.nombre)} ${esc(o.marca)}</a></h3>
            <div class="chips">${o.chips.map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>
            <div class="m-card__foot">
              <span class="m-card__ref">${esc(o.ref)}</span>
              <span class="link-arrow">Ver ficha ${flecha}</span>
            </div>
          </div>
        </article>`).join('\n        ')}
      </div>
    </section>
  </div>

  <section class="cta-band">
    <div class="tech-grid" aria-hidden="true" style="mask-image:radial-gradient(ellipse 70% 90% at 80% 50%,#000 20%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 70% 90% at 80% 50%,#000 20%,transparent 100%)"></div>
    <div class="wrap cta-band__in">
      <div>
        <h2>¿Querés verla funcionando?</h2>
        <p>Pasá por Av. Forest 888 o escribinos: te asesoramos sin cargo sobre el modelo que mejor se adapta a tu producción.</p>
      </div>
      <div class="cta-band__actions">
        <a class="btn btn--ink" href="${waModelo(m, cat)}" target="_blank" rel="noopener">Consultar por esta máquina</a>
        <a class="btn btn--ink-ghost" href="../index.html#contacto">Ver datos de contacto</a>
      </div>
    </div>
  </section>
</main>

${footer}

${fab}

<script src="../assets/catalogo.js"></script>
<script>
/* Tema, menú mobile y FAB — el catálogo y las pestañas no aplican acá. */
(function(){
  const root=document.documentElement, KEY='casakira-theme', btn=document.getElementById('theme-toggle');
  function setTheme(t){
    root.dataset.theme=t;
    const next=t==='dark'?'claro':'oscuro';
    btn.setAttribute('aria-label','Cambiar a modo '+next);
    btn.setAttribute('title','Cambiar a modo '+next);
  }
  setTheme(root.dataset.theme||'light');
  btn.addEventListener('click',()=>{
    const t=root.dataset.theme==='dark'?'light':'dark';
    setTheme(t); localStorage.setItem(KEY,t);
  });

  const nav=document.getElementById('nav'), fab=document.getElementById('fab');
  let ticking=false;
  addEventListener('scroll',()=>{
    if(ticking) return; ticking=true;
    requestAnimationFrame(()=>{
      const y=scrollY;
      nav.dataset.scrolled=y>8?'true':'false';
      fab.dataset.show=y>600?'true':'false';
      ticking=false;
    });
  },{passive:true});

  const sheet=document.getElementById('sheet'), burger=document.getElementById('burger');
  function setOpen(o){
    sheet.dataset.open=String(o);
    burger.setAttribute('aria-expanded',String(o));
    document.body.style.overflow=o?'hidden':'';
    if(o) sheet.querySelector('.sheet__link').focus();
  }
  burger.addEventListener('click',()=>setOpen(true));
  document.getElementById('sheet-close').addEventListener('click',()=>{setOpen(false);burger.focus();});
  sheet.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.dataset.open==='true'){setOpen(false);burger.focus();}});
})();
</script>
</body>
</html>
`;
}

// ── Generar ───────────────────────────────────────────────────────────────
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
const generados = [];
for (const cat of CATEGORIAS) {
  for (const m of cat.modelos) {
    fs.writeFileSync(path.join(OUT, m.slug + '.html'), ficha(cat, m));
    generados.push(m.slug);
    n++;
  }
}

// Sitemap, que el sitio actual tampoco tiene
const urls = ['https://casakira.com.ar/', ...generados.map(s => 'https://casakira.com.ar/maquinas/' + s + '.html')];
fs.writeFileSync('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(u => '  <url><loc>' + u + '</loc></url>').join('\n')
  + '\n</urlset>\n');

console.log('Fichas generadas : ' + n + ' en ' + OUT + '/');
console.log('Sitemap          : sitemap.xml (' + urls.length + ' URLs)');
