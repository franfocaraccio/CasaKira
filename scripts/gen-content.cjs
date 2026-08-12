/**
 * One-off: convierte el catálogo vanilla (legacy) en la content collection de
 * Astro. Emite un JSON por máquina en src/content/maquinas/ y la config de
 * categorías en src/data/categorias.ts.
 *
 *   node scripts/gen-content.cjs
 *
 * A partir de acá, la fuente de verdad son esos archivos: agregar una máquina
 * es agregar un JSON. Este script queda sólo como registro de la conversión.
 */
const fs = require('fs');
const path = require('path');

// catalogo.js quedó como .js bajo un package con "type": "module", así que
// require() lo interpretaría como ESM y su module.exports no se ve. Lo
// ejecutamos explícitamente como CommonJS.
const src = fs.readFileSync(path.join('legacy', 'assets', 'catalogo.js'), 'utf8');
const mod = { exports: {} };
new Function('module', 'exports', src)(mod, mod.exports);
const { CATEGORIAS } = mod.exports;

const outMaquinas = path.join('src', 'content', 'maquinas');
fs.mkdirSync(outMaquinas, { recursive: true });

let n = 0;
for (const cat of CATEGORIAS) {
  cat.modelos.forEach((m, i) => {
    const entry = {
      nombre: m.nombre,
      marca: m.marca,
      categoria: cat.id,
      orden: i + 1,
      ref: m.ref,
      img: m.img,
      resumen: m.resumen,
      chips: m.chips,
      specs: m.specs.map(([k, v]) => ({ k, v })),
      feats: m.feats,
    };
    fs.writeFileSync(
      path.join(outMaquinas, m.slug + '.json'),
      JSON.stringify(entry, null, 2) + '\n'
    );
    n++;
  });
}

const cats = CATEGORIAS.map((c, i) => ({
  id: c.id, slug: c.slug, nombre: c.nombre, corto: c.corto,
  titulo: c.titulo, intro: c.intro, orden: i + 1,
}));

const ts = `// Generado por scripts/gen-content.cjs — metadatos de las categorías de máquinas.
// Estables y pocas, por eso van como config y no como content collection.

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  /** Nombre corto para el mensaje de WhatsApp ("la Overlock Siruba"). */
  corto: string;
  titulo: string;
  intro: string;
  orden: number;
}

export const CATEGORIAS: Categoria[] = ${JSON.stringify(cats, null, 2)};

export const categoriaPorId = (id: string): Categoria | undefined =>
  CATEGORIAS.find((c) => c.id === id);
`;
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync(path.join('src', 'data', 'categorias.ts'), ts);

console.log('Máquinas (JSON): ' + n + ' en ' + outMaquinas);
console.log('Categorías: src/data/categorias.ts (' + cats.length + ')');
