// Filtros del catálogo (opción B, barra lateral). La lógica es la misma que en
// la opción A —lo que cambia es el envoltorio—, así que el script busca por
// `data-*` y no por clases: sirve para los dos diseños sin tocar nada.
//
// Mejora progresiva: las tarjetas ya están todas en el HTML, así que sin
// JavaScript se ve el catálogo entero y la barra lateral queda desplegada.

(() => {
  const raiz = document.querySelector<HTMLElement>('[data-filtros]');
  const grilla = document.querySelector<HTMLElement>('[data-grilla]');
  if (!raiz || !grilla) return;

  const items = [...grilla.querySelectorAll<HTMLElement>('[data-item]')];
  const opciones = [...raiz.querySelectorAll<HTMLButtonElement>('[data-f]')];
  const vacio = document.querySelector<HTMLElement>('[data-vacio]');
  const conteo = document.querySelector<HTMLElement>('[data-conteo]');
  const limpiar = raiz.querySelector<HTMLButtonElement>('[data-limpiar]');
  const notaMarca = raiz.querySelector<HTMLElement>('[data-nota-marca]');
  const activos = document.querySelector<HTMLElement>('[data-activos]');
  if (!items.length) return;

  // Las categorías de repuestos no tienen marca: hace falta saber cuáles son
  // para desactivar ese grupo cuando se elige una.
  const catsSinMarca = new Set(
    items.filter((el) => el.dataset.tipo === 'repuesto').map((el) => el.dataset.cat!)
  );

  const validas = {
    cat: new Set(items.map((el) => el.dataset.cat!)),
    marca: new Set(items.map((el) => el.dataset.marca!).filter(Boolean)),
  };

  const estado = { cat: '', marca: '' };

  const coincide = (el: HTMLElement, cat: string, marca: string) =>
    (!cat || el.dataset.cat === cat) && (!marca || el.dataset.marca === marca);

  function pintarOpciones() {
    for (const op of opciones) {
      const grupo = op.dataset.f as 'cat' | 'marca';
      const valor = op.dataset.v!;
      const activo = estado[grupo] === valor;
      op.setAttribute('aria-pressed', String(activo));

      // El contador de cada opción muestra cuántos quedarían si se la eligiera,
      // manteniendo el filtro del otro grupo.
      const n = items.filter((el) =>
        grupo === 'cat' ? coincide(el, valor, estado.marca) : coincide(el, estado.cat, valor)
      ).length;

      const casillero = op.querySelector<HTMLElement>('[data-n]');
      if (casillero) casillero.textContent = String(n).padStart(2, '0');

      // Una opción que no lleva a ningún lado se atenúa, pero sigue clickeable:
      // deshabilitarla deja al visitante encerrado —con una marca elegida, casi
      // todas las categorías darían cero y no habría forma de salir sin limpiar.
      op.dataset.cero = String(n === 0 && !activo);
    }
  }

  function aplicar(escribirUrl = true) {
    // Elegir un rubro de repuestos deja la marca sin sentido: se limpia sola.
    if (estado.cat && catsSinMarca.has(estado.cat)) estado.marca = '';

    let visibles = 0;
    for (const el of items) {
      const ver = coincide(el, estado.cat, estado.marca);
      el.hidden = !ver;
      if (ver) visibles++;
    }

    pintarOpciones();

    if (conteo) {
      conteo.textContent =
        visibles === items.length
          ? `${items.length} productos`
          : `${visibles} de ${items.length} productos`;
    }
    if (vacio) vacio.hidden = visibles > 0;

    const puestos = Number(Boolean(estado.cat)) + Number(Boolean(estado.marca));
    if (limpiar) limpiar.hidden = puestos === 0;
    if (activos) {
      activos.textContent = puestos ? String(puestos) : '';
      activos.hidden = puestos === 0;
    }
    if (notaMarca) notaMarca.hidden = !(estado.cat && catsSinMarca.has(estado.cat));

    if (!escribirUrl) return;
    const url = new URL(location.href);
    estado.cat ? url.searchParams.set('cat', estado.cat) : url.searchParams.delete('cat');
    estado.marca ? url.searchParams.set('marca', estado.marca) : url.searchParams.delete('marca');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  for (const op of opciones) {
    op.addEventListener('click', () => {
      const grupo = op.dataset.f as 'cat' | 'marca';
      const valor = op.dataset.v!;
      // Volver a tocar la opción activa la apaga: es la forma más rápida de deshacer.
      estado[grupo] = estado[grupo] === valor ? '' : valor;
      aplicar();
    });
  }

  limpiar?.addEventListener('click', () => {
    estado.cat = '';
    estado.marca = '';
    aplicar();
  });

  // ── Panel plegable en pantalla angosta ─────────────────────────────────────
  // Sin JS el panel queda abierto, que es el estado utilizable. Con JS se pliega
  // solo cuando la barra lateral no cabe al costado y pasa a estar arriba.
  const panel = raiz.querySelector<HTMLElement>('[data-panel]');
  const boton = raiz.querySelector<HTMLButtonElement>('[data-toggle]');
  if (panel && boton) {
    const angosta = matchMedia('(max-width: 899px)');
    const plegar = (cerrar: boolean) => {
      panel.hidden = cerrar;
      boton.setAttribute('aria-expanded', String(!cerrar));
    };
    plegar(angosta.matches);
    angosta.addEventListener('change', (e) => plegar(e.matches));
    boton.addEventListener('click', () => plegar(!panel.hidden));
  }

  // Estado inicial desde la URL, ignorando valores que no existan.
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat') ?? '';
  const marca = params.get('marca') ?? '';
  if (validas.cat.has(cat)) estado.cat = cat;
  if (validas.marca.has(marca)) estado.marca = marca;
  aplicar(false);
})();
