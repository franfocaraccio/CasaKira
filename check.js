/** Verificación de las fichas generadas. node check.js */
const fs = require('fs');
const { CATEGORIAS } = require('./assets/catalogo.js');

let fallas = 0;
const chk = (n, c) => { if (!c) fallas++; console.log((c ? '  ok  ' : 'FALLA ') + n); };

const f = fs.readFileSync('maquinas/overlock-siruba.html', 'utf8');

console.log('--- estructura ---');
chk('nav completo', f.includes('</header>') && f.includes('nav__links'));
chk('sheet único y completo', (f.match(/<div class="sheet"/g) || []).length === 1 && f.includes('sheet__foot'));
chk('footer completo', f.includes('</footer>') && f.includes('afip-badge'));
chk('fab único', (f.match(/class="fab"/g) || []).length === 1);
chk('sin bloque hero filtrado', !f.includes('hero__grid'));

console.log('--- rutas ---');
chk('assets siempre con ../', !/(src|href)="assets\//.test(f));
chk('anchors apuntan al home', f.includes('../index.html#contacto'));
chk('sin anchors de sección sueltos', !/href="#(nosotros|maquinas|servicios|tienda|contacto)"/.test(f));
chk('css externo enlazado', f.includes('../assets/styles.css'));

console.log('--- SEO ---');
chk('title propio', /<title>Overlock \/ puntada de seguridad de alta velocidad Siruba — Casa Kira/.test(f));
chk('canonical', f.includes('rel="canonical"'));
chk('og:image', f.includes('og:image'));
chk('JSON-LD Product', f.includes('"@type":"Product"'));
try { JSON.parse(f.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]); chk('JSON-LD parsea', true); }
catch (e) { chk('JSON-LD parsea', false); }

console.log('--- WhatsApp precargado ---');
const wa = f.match(/https:\/\/wa\.me\/5491140692393\?text=([^"]+)/);
chk('link con mensaje', !!wa);
if (wa) console.log('        → ' + decodeURIComponent(wa[1]));

console.log('--- etiquetas balanceadas ---');
for (const t of ['div', 'section', 'article', 'a', 'ul', 'table']) {
  const abre = (f.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length;
  const cierra = (f.match(new RegExp('</' + t + '>', 'g')) || []).length;
  chk(t + ': ' + abre + ' abiertas / ' + cierra + ' cerradas', abre === cierra);
}

console.log('--- las 13 fichas ---');
const todos = CATEGORIAS.flatMap(c => c.modelos);
let sinArchivo = 0, sinWA = 0, linksRotos = [];
for (const m of todos) {
  const p = 'maquinas/' + m.slug + '.html';
  if (!fs.existsSync(p)) { sinArchivo++; continue; }
  const h = fs.readFileSync(p, 'utf8');
  if (!h.includes('wa.me/5491140692393?text=')) sinWA++;
  // los links relativos entre fichas tienen que existir
  for (const href of [...h.matchAll(/href="([a-z0-9-]+\.html)"/g)].map(x => x[1])) {
    if (!fs.existsSync('maquinas/' + href)) linksRotos.push(m.slug + ' → ' + href);
  }
}
chk('las 13 existen', sinArchivo === 0);
chk('las 13 con WhatsApp precargado', sinWA === 0);
chk('sin links internos rotos', linksRotos.length === 0);
if (linksRotos.length) console.log('        ' + linksRotos.join('\n        '));

// index → fichas
const idx = fs.readFileSync('index.html', 'utf8');
chk('index enlaza maquinas/<slug>.html', idx.includes("'maquinas/'+m.slug+'.html'"));

console.log('\n' + (fallas ? fallas + ' FALLAS' : 'Todo OK'));
process.exit(fallas ? 1 : 0);
