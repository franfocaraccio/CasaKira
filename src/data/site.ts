// Datos de contacto y ayudas de WhatsApp. Fuente única para todo el sitio.

export const SITE = {
  nombre: 'Casa Kira',
  nombreLegal: 'Casa Kira S.R.L.',
  desde: 1967,
  dominio: 'https://casakira.com.ar',
  direccion: 'Av. Forest 888',
  cp: '1427',
  ciudad: 'CABA',
  tel: '+541145532135',
  telHumano: '(54 11) 4553-2135',
  telCorto: '4553-2135',
  whatsapp: '5491131986183',
  whatsappHumano: '(54 9 11) 3198-6183',
  email: 'casakirasrl@casakira.com.ar',
  horario: 'Lunes a viernes de 9 a 12 y de 14 a 17 h',
  horarioSab: 'Sábados de 9 a 12 h',
  tiendaUrl: 'https://www.mercadolibre.com.ar/pagina/maquineriakira',
  instagram: 'https://www.instagram.com/maquineriacasakira/',
  instagramHandle: '@maquineriacasakira',
  facebook: 'https://www.facebook.com/casakirasrl',
  facebookHandle: 'casakirasrl',
  dataFiscal:
    'https://servicios1.afip.gov.ar/clavefiscal/qr/mobilePublicInfo.aspx?req=e1ttZXRob2Q9Z2V0UHVibGljSW5mb11bcGVyc29uYT0yMDM1MzY3MjczOV1bdGlwb2RvbWljaWxpbz0wXVtzZWN1ZW5jaWE9MF1bdXJsPWh0dHA6Ly93d3cuY2FzYWtpcmEuY29tLmFyXX0=',
  tiendas: {
    mercadoLibre: 'https://listado.mercadolibre.com.ar/_CustId_36984787',
    eshop: 'https://eshops.mercadolibre.com.ar/amaq2009/',
    mercadoShop: 'https://amaq2009.mercadoshops.com.ar/',
  },
} as const;

/**
 * Marcas que importamos. Fuente única: la usan el deslizable de la home, el
 * texto de Nosotros, el KPI de marcas y la metadata. Agregar o quitar una acá
 * actualiza todo el sitio.
 */
export const MARCAS = [
  'Mirsew', 'Jack', 'Janome', 'Feiyue', 'Tank', 'Typical',
  'Yamata', 'Brother', 'Pegasus', 'Juki', 'Siruba',
] as const;

/** Las marcas listadas para prosa: "A, B y C". */
export const marcasEnProsa = (): string =>
  `${MARCAS.slice(0, -1).join(', ')} y ${MARCAS[MARCAS.length - 1]}`;

// Links de sección, root-relative para que funcionen desde cualquier página
// (en la home scrollean; en una ficha navegan a la home y scrollean).
export interface NavLink {
  href: string;
  label: string;
  /** Si tiene hijos, en desktop se muestra como desplegable al pasar el mouse. */
  children?: { href: string; label: string }[];
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  {
    href: '/catalogo',
    label: 'Catálogo',
    children: [
      { href: '/catalogo#maquinas', label: 'Máquinas' },
      { href: '/catalogo#repuestos', label: 'Accesorios y repuestos' },
    ],
  },
  { href: '/contacto', label: 'Contacto' },
];

/** Link de WhatsApp, con mensaje ya redactado si se pasa uno. */
export function waLink(texto?: string): string {
  return 'https://wa.me/' + SITE.whatsapp + (texto ? '?text=' + encodeURIComponent(texto) : '');
}

/**
 * Consulta precargada para un modelo. Usa el nombre corto de la categoría, no
 * el comercial completo: "la Overlock Siruba (OVE-SIR)" es como lo pide un
 * cliente, no "la Overlock / puntada de seguridad de alta velocidad Siruba".
 */
export function waModelo(opts: { corto: string; marca: string; ref: string }): string {
  return waLink(`Hola Casa Kira, quería consultar por la ${opts.corto} ${opts.marca} (${opts.ref}).`);
}

export const mapsLink = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SITE.direccion}, ${SITE.ciudad}, Argentina`
  )}`;
