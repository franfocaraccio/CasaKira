// Datos de contacto y ayudas de WhatsApp. Fuente única para todo el sitio.

export const SITE = {
  nombre: 'Casa Kira',
  nombreLegal: 'Casa Kira S.R.L.',
  desde: 1968,
  dominio: 'https://casakira.com.ar',
  direccion: 'Av. Forest 888',
  cp: '1427',
  ciudad: 'CABA',
  tel: '+541145532135',
  telHumano: '(54 11) 4553-2135',
  telCorto: '4553-2135',
  whatsapp: '5491140692393',
  whatsappHumano: '(54 9 11) 4069-2393',
  email: 'casakirasrl@casakira.com.ar',
  horario: 'Lunes a viernes de 9 a 12.30 y de 14 a 18 h',
  horarioSab: 'Sábados de 9 a 12 h',
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

// Links de sección, root-relative para que funcionen desde cualquier página
// (en la home scrollean; en una ficha navegan a la home y scrollean).
export const NAV_LINKS = [
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#maquinas', label: 'Máquinas' },
  { href: '/#repuestos', label: 'Repuestos' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#tienda', label: 'Tienda online' },
  { href: '/#contacto', label: 'Contacto' },
] as const;

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
