# Casa Kira — rediseño web

Rediseño del sitio de **Casa Kira S.R.L.** (máquinas de coser y bordar industriales, Av. Forest 888, CABA).

Sitio estático hecho con **Astro + React + Tailwind v4**. Genera HTML plano (bueno para SEO y
velocidad) y usa React sólo en tres "islas" interactivas.

## Comandos

```bash
npm install       # dependencias
npm run dev       # servidor de desarrollo (localhost:4321)
npm run build     # genera el sitio estático en dist/
npm run check     # astro check (tipos)
npm run preview   # sirve dist/ para revisar el build
```

## Estructura

```
src/
  pages/
    index.astro              La home (arma las secciones + el script de realce)
    maquinas/[slug].astro    Genera una ficha por máquina (getStaticPaths)
  layouts/Base.astro         <head>, anti-flash de tema, nav, footer, FAB
  components/
    Nav / Footer / UtilityBar / Fab / Logo / Icon / BrandIcon / MachineCard
    home/                    Hero, Brands, Nosotros, Maquinas, Repuestos, Servicios, Tienda, Contacto
    islands/                 Las 3 islas de React (ver abajo)
  content/maquinas/*.json    Una máquina = un archivo (content collection)
  content.config.ts          Schema (zod) de la collection
  data/
    catalogo.ts   → no; el catálogo vive en content/. Acá:
    categorias.ts            Metadatos de las 7 categorías
    site.ts                  Contacto, tiendas y ayudas de WhatsApp (fuente única)
  styles/global.css          @import tailwindcss + los estilos del sitio
public/assets/               Imágenes y logo (se sirven tal cual)
scripts/gen-content.cjs      One-off: convirtió el catálogo vanilla en la collection
legacy/                      El prototipo vanilla anterior, congelado como referencia
```

### Islas de React (`client:load`)

Sólo lo genuinamente interactivo va en React; el resto es HTML estático.

- **`ThemeToggle`** — el botón de tema. El tema inicial lo fija un script inline en el `<head>`
  (anti-flash); la isla sólo lo invierte y lo persiste.
- **`MobileMenu`** — la hamburguesa y la hoja a pantalla completa (Escape, foco, bloqueo de scroll).
- **`ContactForm`** — validación al salir del campo y foco en el primer error.

Las **pestañas de máquinas NO son React**: los 7 paneles se renderizan estáticos (así el catálogo
queda en el HTML para Google y funciona sin JS) y un script chico sólo cambia cuál se ve.

### Agregar una máquina

Crear un `.json` en `src/content/maquinas/` (el nombre del archivo es el slug de la URL) con los
campos del schema y `npm run build`. Aparece sola en la home y en su ficha `/maquinas/<slug>`.

## Relevamiento del sitio actual (casakira.com.ar)

Estado al 11/08/2026: HTML 4.01 Transitional con layout de tablas, generado con Dreamweaver
(`MM_swapImage`, `AC_RunActiveContent.js`). Ancho fijo de 721 px, sin viewport meta, sin responsive.
El hero es un **`.swf` de Flash** — no se ve en ningún navegador actual.
El certificado TLS está **vencido**, así que el sitio no abre por HTTPS.
Sigue cargando `urchin.js` (Google Analytics discontinuado en 2012).

### Secciones originales y qué se hizo con cada una

| Original | En el prototipo |
|---|---|
| `index.html` — bienvenida, teléfonos, links a Mercado Libre | Hero + sección "Tienda online" |
| `quienes.html` — desde 1968, marcas, post venta | Sección "Nosotros" |
| `productos.html` — 7 categorías de máquinas, 13 modelos | Sección "Máquinas", con tabs por categoría |
| `repuestos.html` — hilos, accesorios, cortantes, motores, soportes | Sección "Repuestos", en bento grid |
| `servicios.html` — post venta, mantenimiento, reparación | Sección "Servicios" |
| `contactos.html` — datos, horarios, formulario | Sección "Contacto" |
| `link/index.html` — **descartada** | Directorio de intercambio de links de los 2000 (Lycos, AddMe, SurfGopher). No aporta información del negocio y hoy son enlaces rotos que perjudican el SEO. |

**Todo el texto de producto y servicio se mantuvo**, reescrito solo en puntuación y redacción
(el original tenía erratas: "Máquina Atracadora de **ata** velocidad", "elementos de fabricación de
**lata** calidad", "Casa Kir a", "Accsesorios", "TORILLOS", "según" escrito "segín").

### Datos de contacto (verificados contra el sitio)

- Av. Forest 888 — (1427) CABA
- Tel/Fax (54 11) 4553-2135 · Cel/WhatsApp (54 9 11) 4069-2393
- casakirasrl@casakira.com.ar
- Lunes a viernes 9 a 12.30 y 14 a 18 h · Sábados 9 a 12 h
- Instagram [@maquineriacasakira](https://www.instagram.com/maquineriacasakira/) · Facebook [casakirasrl](https://www.facebook.com/casakirasrl)

### Catálogo relevado

7 categorías / 13 modelos:

- **Recta 1 aguja** — Typical, Siruba, Yamata
- **Interlock** — Typical, Siruba, Yamata
- **Overlock** — Typical, Siruba, Yamata
- **De poste** — Feiyute (1 y 2 agujas)
- **Atracadora** — Feiyute
- **Ojaladora** — Feiyute
- **Cortadora de tela** — Yamata (6", 8", 10", 12")

Marcas que el sitio declara importar: Typical, Yamata, Brother, Pegasus, Juki, Siruba
(y Feiyute en las fichas de producto).

## Decisiones de diseño

Generadas con el skill `ui-ux-pro-max` y ajustadas al rubro.

- **Estilo:** Swiss Modernism 2.0 + Trust & Authority. Grilla estricta, tipografía grande,
  mucho aire, un solo acento. Es el registro correcto para un proveedor industrial de 58 años:
  precisión y respaldo, no marketing.
- **Motivo gráfico: la puntada.** Las líneas divisorias, el subrayado de "1968", los bullets de
  las fichas y el trazo animado del hero son todos líneas discontinuas (`repeating-linear-gradient`).
  Sale del producto, no de una tendencia.
- **Color: rojo y blanco de la marca.** Rojo `#C1272D` (tomado del logo) sobre blancos y
  neutros fríos. En modo oscuro el rojo se aclara a `#EF4444` — es una variante tonal para
  sostener contraste sobre fondo carbón, no una inversión del color de marca.
  Hay un token aparte, `--accent-on-soft`, para el texto que va sobre fondos rojos
  translúcidos: ahí el fondo se aclara y el rojo pleno cae a 4.13 (bajo AA).
- **Tipografía:** Space Grotesk (títulos, carácter técnico), Inter (texto), JetBrains Mono
  (datos: rpm, pulgadas, teléfonos, referencias). Los números van con `tabular-nums`.
- **Dark mode** con toggle, persistido en `localStorage`, arranca según `prefers-color-scheme`.
  Los dos temas se diseñaron juntos con variantes tonales, no invirtiendo colores.
- **Tratamiento de fotos:** las originales tienen fondos azules distintos entre sí. Se
  desaturan con `filter` para unificarlas y recuperan color al hover. Los hilados quedan
  saturados, porque ahí el color *es* el producto.

### Fichas de producto

Cada uno de los 13 modelos tiene su propia página en `/maquinas/<slug>`, generada por
`src/pages/maquinas/[slug].astro` desde la content collection. Motivo: el trabajo real de este
sitio es aparecer en Google cuando alguien busca "overlock Siruba" o "máquina de coser industrial
Buenos Aires", y una sola página con anchors no se indexa por modelo. Además permite mandarle a un
cliente el link exacto de lo que consultó.

Cada ficha lleva foto, resumen, características completas, tabla de ficha técnica, otros
modelos de su categoría, migas de pan, `title` y `description` propios, `canonical`, Open Graph
y JSON-LD de tipo `Product`.

El nav, el menú mobile y el footer son **componentes únicos** (`Base.astro` los ensambla), así que
no se pueden desincronizar entre páginas.

### WhatsApp precargado

Los botones de las fichas abren WhatsApp con la consulta ya escrita:

> Hola Casa Kira, quería consultar por la Overlock Siruba (OVE-SIR).

Usa el nombre corto de la categoría, no el comercial completo: así habla un cliente. La
referencia entre paréntesis le permite a Casa Kira saber de qué modelo hablan sin repreguntar.

### El logo

El único material disponible es un JPG chico y con artefactos de compresión. No se puede
"mejorar" un raster así: el detalle no está. Lo que se hizo fue **reconstruirlo en vector**,
que es lo que corresponde para un logotipo — nítido a cualquier tamaño, 2 KB, y adaptable al tema.

Método: se midieron las proporciones sobre la imagen del cliente (KIRA tiene un ancho de
**3,05 × el alto de mayúscula**; CASA mide **0,93** de ese alto) y se compararon contra seis
tipografías candidatas midiendo su ancho real en el navegador:

| Fuente | Ancho / alto de mayúscula | Desvío |
|---|---|---|
| Anton | 1,93 | −37 % |
| Bebas Neue | 2,01 | −34 % |
| Fjalla One | 2,07 | −32 % |
| Oswald 700 | 2,49 | −18 % |
| **Archivo Black** | **4,03** | **+32 %** |
| Archivo 800 | 3,76 | +23 % |

Ninguna coincide, porque el original es lettering dibujado, no una fuente. Se eligió
**Archivo Black** por peso y contadores, y el ancho se corrige con `textLength` +
`lengthAdjust="spacingAndGlyphs"`, que fija la medida de forma exacta: el resultado da
**3,00 contra 3,05 del original (−1,5 %)**.

En modo claro lleva contorno oscuro como el original (afinado: el trazo proporcional al
original resultaba el doble de grueso a tamaño de nav). En oscuro el contorno se apaga y el
rojo se aclara.

> **Esto es una aproximación, no el logo de la marca.** Hay que pedirle al cliente el vector
> original (`.ai`, `.eps`, `.pdf` o `.svg`) — quien le hizo la cartelería, las facturas o los
> sellos lo tiene. Si no aparece, la alternativa es vectorizarlo a mano desde un original
> impreso en buena calidad. Además, el `.svg` suelto usa `<text>`: para distribuirlo hay que
> convertir los textos a trazados, o se verá distinto en equipos sin Archivo Black.

### Verificado

- Contraste WCAG AA con la paleta roja: 24/24 sondas en claro, 28/28 en oscuro (medido en el
  navegador, compositando el alfa de cada capa). Botón primario 5,84 en claro y 4,71 en oscuro.
- Sin scroll horizontal ni solapes en el nav a 375, 414, 768, 1024, 1152, 1280 y 1440 px.
- Targets táctiles ≥ 44 px en nav, tabs, botones y campos.
- Tabs con `role="tablist"`, navegación por flechas / Home / End.
- Formulario: validación al `blur`, error debajo del campo, foco automático en el primero que falla.
- Menú mobile con `aria-expanded`, cierre con Escape y bloqueo de scroll.
- `prefers-reduced-motion` desactiva marquee, reveals y contadores.
- **El contenido nunca depende de JS para ser visible.** Los bloques con `.reveal` se ocultan
  sólo si hay JS (clase `.js` en el `<html>`), y si el `IntersectionObserver` no llega a
  reportar nada en 1,5 s se agrega `.reveal-off` y se muestra todo. Antes, 18 bloques arrancaban
  en `opacity:0` y un fallo del observador dejaba la página en blanco.

### Verificado sobre el build de Astro (esta migración)

- `astro build` limpio: 14 páginas (home + 13 fichas) + sitemap. `astro check`: 0 errores.
- Home: las 7 secciones y las 13 fichas quedan en el HTML estático (SEO); 24 imágenes, 0 rotas.
- Las 3 islas hidratan y funcionan: tema (claro↔oscuro), menú mobile (abre/cierra con Escape) y
  formulario (marca los 3 requeridos, enfoca el primero, no navega).
- Ficha: contraste 14/14 en oscuro; WhatsApp precargado; JSON-LD `Product` con imagen absoluta.
- Sin scroll horizontal en 375/768/1024/1280, y el nav conmuta links↔hamburguesa en el breakpoint.

## Stack — implementado

**Astro 7 + React 19 (islas) + Tailwind v4**, contenido en una content collection (JSON por máquina).

- Genera HTML estático: SEO y velocidad, hosting gratis con uso comercial (ver `DESPLIEGUE.md`).
- React sólo en las 3 islas; el resto es HTML estático (cero JS donde no hace falta).
- **Sin CMS**: Casa Kira no edita precios ni modelos por su cuenta. Astro permite enchufar un CMS
  después sin rehacer el modelado.
- Se descartó Next.js (SSR innecesario: no hay app, ni auth, ni datos por usuario) y WordPress.
- `shadcn/ui` todavía no se usa: entra si se agregan buscador con filtros (combobox), lista de
  consulta múltiple (sheet) o FAQ (accordion). React ya está en el stack para cuando toque.

## Pendientes antes de producción

1. **Fotografía nueva.** Las fotos de las fichas de máquina son de 250×167 px: alcanzan
   para maquetar, no para publicar. (Las tres del carrusel de la portada ya están en alta
   resolución y las optimiza Astro; viven en `src/assets/hero/`, no en `public/`.)
2. **El vector original del logo de Casa Kira** (ver arriba) y los logos oficiales de las
   marcas que representa: faltan Juki, Brother, Pegasus y Feiyute; hoy el marquee usa las
   marcas escritas en tipografía. Los de Typical, Siruba y Yamata están en `public/assets/`
   pero en baja resolución.
3. ~~**Backend del formulario.**~~ Resuelto el 2026-08-16 con Web3Forms; ver `DESPLIEGUE.md`.
4. ~~**Certificado TLS** y redirección de HTTP a HTTPS.~~ Resueltos al publicar en
   Cloudflare: el certificado se emite y renueva solo, y HTTP redirige a HTTPS.
5. **Precios y stock.** El sitio delega en Mercado Libre. Las fichas declaran `InStock` en el
   JSON-LD sin precio: hay que confirmar con Casa Kira que la disponibilidad es real, o quitarlo.
6. Confirmar con el cliente: CUIT para el pie, si Singer sigue vigente como marca,
   y si "planchas" y "máquinas de broches" (mencionadas en el home viejo) siguen en venta —
   no tienen sección propia en el sitio actual.

## Pendientes de contenido y funcionalidad

Pedidos del cliente, sin empezar. No hay orden de prioridad todavía.

- **MercadoShop.** Investigar cómo integrarlo al sitio. Hoy la tienda es un enlace
  externo a la página de Mercado Libre (`SITE.tiendaUrl`); hay que ver qué ofrece
  MercadoShop y si conviene embeber, enlazar distinto o replicar el catálogo.
- **Logos de marcas.** Reemplazar el marquee tipográfico por los logos oficiales de las
  11 marcas (ver punto 2 de la lista de arriba, es el mismo trabajo).
- **Sección del certificado.** Darle un lugar propio en el sitio.
- **"Motores bajo consumo" en el catálogo.** Categoría o sección nueva en `/catalogo`.
- **Poner un item con la opinion y experiencia que tuvieron con nuestra empresa.**
