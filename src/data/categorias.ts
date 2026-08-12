// Generado por scripts/gen-content.cjs — metadatos de las categorías de máquinas.
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

export const CATEGORIAS: Categoria[] = [
  {
    "id": "recta",
    "slug": "recta-1-aguja",
    "nombre": "Recta 1 aguja",
    "corto": "Recta 1 aguja",
    "titulo": "Recta pespunteadora de 1 aguja",
    "intro": "Alta velocidad para pespunte general, de telas finas a materiales extra pesados.",
    "orden": 1
  },
  {
    "id": "interlock",
    "slug": "interlock",
    "nombre": "Interlock",
    "corto": "Interlock",
    "titulo": "Interlock de alta velocidad",
    "intro": "Doble costura, dobladillado y terminaciones sobre todo tipo de soporte.",
    "orden": 2
  },
  {
    "id": "overlock",
    "slug": "overlock",
    "nombre": "Overlock",
    "corto": "Overlock",
    "titulo": "Overlock de alta velocidad",
    "intro": "Puntada de seguridad y terminación de bordes hasta 7500 rpm.",
    "orden": 3
  },
  {
    "id": "poste",
    "slug": "de-poste",
    "nombre": "De poste",
    "corto": "máquina de poste",
    "titulo": "Máquina de poste, 1 y 2 agujas",
    "intro": "Punto de cadena para marroquinería y calzado.",
    "orden": 4
  },
  {
    "id": "atracadora",
    "slug": "atracadora",
    "nombre": "Atracadora",
    "corto": "Atracadora",
    "titulo": "Atracadora de alta velocidad",
    "intro": "Refuerzo de puntos de tensión en jeans, uniformes y lencería.",
    "orden": 5
  },
  {
    "id": "ojaladora",
    "slug": "ojaladora",
    "nombre": "Ojaladora",
    "corto": "Ojaladora",
    "titulo": "Ojaladora de alta velocidad",
    "intro": "Ojales prolijos y firmes en telas delgadas y gruesas.",
    "orden": 6
  },
  {
    "id": "cortadora",
    "slug": "cortadora-de-tela",
    "nombre": "Cortadora de tela",
    "corto": "Cortadora de tela",
    "titulo": "Máquina recta para corte de tela",
    "intro": "Corte limpio, recto y curvilíneo en 6, 8, 10 y 12 pulgadas.",
    "orden": 7
  }
];

export const categoriaPorId = (id: string): Categoria | undefined =>
  CATEGORIAS.find((c) => c.id === id);
