// Rubros de repuestos, accesorios e insumos. No son modelos concretos como las
// máquinas —no tienen ficha ni referencia—, así que viven acá como config y no
// en una content collection.
//
// El texto sale del prototipo vanilla (`legacy/index.html`), que a su vez lo
// tomó del `repuestos.html` original. La versión Astro se había quedado sin
// "Motores" ni "Soportes"; acá vuelven.

export interface Repuesto {
  id: string;
  /** Nombre corto: es el que va en el filtro. */
  nombre: string;
  titulo: string;
  resumen: string;
  tags: string[];
  img: string;
}

export const REPUESTOS: Repuesto[] = [
  {
    id: 'hilados',
    nombre: 'Hilados',
    titulo: 'Hilados 100% poliéster para coser y bordar',
    resumen:
      'Gran variedad de títulos y colores, de gran resistencia. Para bordar, más de 300 colores en telas livianas y pesadas.',
    tags: ['Coser', 'Bordar', '300+ colores'],
    img: 'Hilos.gif',
  },
  {
    id: 'accesorios',
    nombre: 'Accesorios',
    titulo: 'Accesorios y repuestos para tu máquina',
    resumen: 'Todo tipo de accesorios y repuestos para máquinas de coser y bordar.',
    tags: [
      'Guías', 'Prensatelas', 'Cuchillas', 'Bobinas', 'Cortadores',
      'Dientes', 'Protectores de aguja', 'Barras de aguja', 'Aparejos', 'Chapas',
    ],
    img: 'Accesorio.gif',
  },
  {
    id: 'herramientas',
    nombre: 'Herramientas',
    titulo: 'Cortantes, pinzas y abridores de costura',
    resumen: 'Herramientas de taller para el trabajo diario y el mantenimiento de la máquina.',
    tags: [
      'Tijeras', 'Cortantes', 'Pinzas especiales',
      'Abridores de costura', 'Destornilladores', 'Tuercas y tornillos',
    ],
    img: 'Tijeras.gif',
  },
  {
    id: 'motores',
    nombre: 'Motores',
    titulo: 'Motores y pedaleras',
    resumen:
      'Para todo tipo de máquinas, industriales y hogareñas. Con y sin pedalera. Originales, nuevos y usados.',
    tags: ['Industriales', 'Hogareñas', 'Nuevos y usados'],
    img: 'Motores.gif',
  },
  {
    id: 'soportes',
    nombre: 'Soportes',
    titulo: 'Soportes y bases',
    resumen:
      'Patas para mesas, soportes con distintos modelos de pedal y venta de pedaleras. Bases originales con diferentes calados según modelo.',
    tags: ['Nuevos y usados', 'Trabajos a medida'],
    img: 'Soportes.gif',
  },
];
