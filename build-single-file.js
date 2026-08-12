/**
 * Genera versiones autocontenidas —CSS, JS e imágenes embebidos— para abrir con
 * doble clic o enviar por mail sin la carpeta del proyecto:
 *
 *   casa-kira-prototipo.html       la home
 *   casa-kira-ficha-ejemplo.html   una ficha de producto de muestra
 *
 *   node build-single-file.js
 *
 * Ojo: los 13 links a fichas de la home siguen apuntando a maquinas/<slug>.html.
 * Funcionan si está la carpeta al lado; en el archivo suelto, no. Para recorrer
 * el sitio completo hay que servirlo (ver README).
 */
const fs = require('fs');
const path = require('path');

const DIR_IMG = 'assets/maquinas';

// Mapa nombre de archivo → data URI
const dataUris = {};
let bytesImg = 0;
for (const file of fs.readdirSync(DIR_IMG)) {
  const buf = fs.readFileSync(path.join(DIR_IMG, file));
  bytesImg += buf.length;
  dataUris[file] = 'data:image/gif;base64,' + buf.toString('base64');
}

/**
 * @param {string} src     archivo de entrada
 * @param {string} dest    archivo de salida
 * @param {string} prefijo cómo referencia ese archivo a assets/ ('' o '../')
 */
function autocontenido(src, dest, prefijo) {
  let html = fs.readFileSync(src, 'utf8');
  const a = prefijo + 'assets/';

  // 1. La ruta que el catálogo arma por concatenación, antes que las literales
  //    (el regex de literales matchearía este mismo fragmento)
  html = html.replace(`'<img src="${a}maquinas/'+m.img+'"`, `'<img src="'+IMG[m.img]+'"`);

  // 2. CSS externo → <style> inline
  const css = fs.readFileSync('assets/styles.css', 'utf8');
  const linkCss = `<link rel="stylesheet" href="${a}styles.css">`;
  if (!html.includes(linkCss)) throw new Error('No se encontró el link al CSS en ' + src);
  html = html.replace(linkCss, '<style>\n' + css + '\n</style>');

  // 3. catalogo.js externo → <script> inline, más el mapa de imágenes
  const cat = fs.readFileSync('assets/catalogo.js', 'utf8')
    .replace(/if \(typeof module[^\n]*\n?/, ''); // el export de Node no va al browser
  const scriptCat = `<script src="${a}catalogo.js"></script>`;
  if (!html.includes(scriptCat)) throw new Error('No se encontró el script del catálogo en ' + src);
  html = html.replace(scriptCat,
    '<script>\n' + cat + '\nconst IMG=' + JSON.stringify(dataUris) + ';\n</script>');

  // 4. Imágenes con ruta literal
  let n = 0;
  html = html.replace(new RegExp('src="' + prefijo.replace('.', '\\.') + 'assets/maquinas/([^"]+)"', 'g'), (m, file) => {
    if (!dataUris[file]) throw new Error('Falta la imagen: ' + file);
    n++;
    return 'src="' + dataUris[file] + '"';
  });

  fs.writeFileSync(dest, html);

  const quedan = (html.match(new RegExp(prefijo.replace('.', '\\.') + 'assets/', 'g')) || []).length;
  if (quedan) throw new Error(quedan + ' referencias a assets/ sin resolver en ' + dest);

  console.log(dest.padEnd(32) + (fs.statSync(dest).size / 1024 / 1024).toFixed(2) + ' MB  ('
    + n + ' imágenes literales)');
}

autocontenido('index.html', 'casa-kira-prototipo.html', '');
autocontenido('maquinas/overlock-siruba.html', 'casa-kira-ficha-ejemplo.html', '../');

console.log('Imágenes disponibles: ' + Object.keys(dataUris).length + ' (' + (bytesImg / 1024).toFixed(0) + ' KB)');
