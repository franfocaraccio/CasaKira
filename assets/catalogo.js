/**
 * Catálogo de máquinas de Casa Kira.
 * Fuente única: la usa index.html para las pestañas y build.js para generar
 * las fichas de /maquinas/. El contenido es el que publica el sitio actual,
 * corregido sólo en redacción y puntuación.
 *
 * Al migrar a Astro, cada modelo pasa a ser un archivo en content collections
 * con estos mismos campos.
 */
const WHATSAPP = '5491140692393';
const TEL = '+541145532135';

const CATEGORIAS = [
  {
    id: 'recta', slug: 'recta-1-aguja', nombre: 'Recta 1 aguja', corto: 'Recta 1 aguja',
    titulo: 'Recta pespunteadora de 1 aguja',
    intro: 'Alta velocidad para pespunte general, de telas finas a materiales extra pesados.',
    modelos: [
      {
        marca: 'Typical', img: 'Typical-Recta.gif', ref: 'REC-TYP',
        slug: 'recta-1-aguja-typical',
        nombre: 'Recta pespunteadora 1 aguja de alta velocidad',
        resumen: 'Pespunte de calidad superior hasta 5000 rpm, sin ruido ni vibraciones, con lubricación en aluminio.',
        chips: ['5000 rpm', 'Lubricación en aluminio'],
        specs: [['Velocidad máxima', '5000 rpm (según modelo)'], ['Tipo de puntada', 'Pespunte'], ['Agujas', '1'], ['Lubricación', 'Automática, cuerpo en aluminio'], ['Alimentación', 'Adelante y reversa']],
        feats: [
          'Puntada de calidad superior, sin ruido ni vibraciones tanto a altas como a bajas velocidades, con un máximo de 5000 rpm (según modelo).',
          'El mecanismo de alimentación reduce al mínimo la diferencia de longitud de puntada entre altas y bajas velocidades, y en alimentación hacia adelante o en reversa.',
          'Sistema de lubricación realizado en aluminio, de máxima durabilidad y confiabilidad.'
        ]
      },
      {
        marca: 'Siruba', img: 'Siruba-Recta.gif', ref: 'REC-SIR',
        slug: 'recta-1-aguja-siruba',
        nombre: 'Recta pespunteadora 1 aguja de alta velocidad',
        resumen: 'Para materiales finos y extra pesados —camisas, trajes, jeans, cuero— con corte de hilo automático.',
        chips: ['Corte de hilo automático', 'Brazo y base ampliados'],
        specs: [['Tipo de puntada', 'Pespunte'], ['Agujas', '1'], ['Corte de hilo', 'Automático'], ['Materiales', 'De finos a extra pesados'], ['Brazo y base', 'Ampliados']],
        feats: [
          'Para costura de materiales finos y extra pesados: camisas, trajes, jeans, plástico y cuero.',
          'Mecanismo de costura superior.',
          'Cortado de hilo automático, que da mayor eficiencia y reduce los tiempos de producción.',
          'Mayor tamaño de brazo y base, que facilita la operación de la máquina.'
        ]
      },
      {
        marca: 'Yamata', img: 'Yamata-Recta.gif', ref: 'REC-YAM',
        slug: 'recta-1-aguja-yamata',
        nombre: 'Recta pespunteadora 1 aguja de alta velocidad',
        resumen: 'Para algodón y materiales pesados y sintéticos, con aceite automático de dos vías y bajo nivel de ruido.',
        chips: ['Aceite automático 2 vías', 'Bajo nivel de ruido'],
        specs: [['Tipo de puntada', 'Pespunte'], ['Agujas', '1'], ['Lubricación', 'Automática de dos vías con recuperación'], ['Materiales', 'Algodón, pesados y sintéticos'], ['Ruido', 'Bajo en funcionamiento']],
        feats: [
          'Para fibras de desgaste (algodón) y también materiales pesados y sintéticos.',
          'Fuente de aceite de alimentación automática de dos vías, con dispositivo de recuperación.',
          'Funciona con facilidad en puntadas rápidas.',
          'Produce poco ruido durante el funcionamiento.'
        ]
      }
    ]
  },
  {
    id: 'interlock', slug: 'interlock', nombre: 'Interlock', corto: 'Interlock',
    titulo: 'Interlock de alta velocidad',
    intro: 'Doble costura, dobladillado y terminaciones sobre todo tipo de soporte.',
    modelos: [
      {
        marca: 'Typical', img: 'Typical-Interlok.gif', ref: 'INT-TYP',
        slug: 'interlock-typical',
        nombre: 'Interlock de alta velocidad',
        resumen: 'Mecanismo avanzado de conducción y ajuste de precisión, para doble costura en hombros y mangas.',
        chips: ['Ajuste de precisión'],
        specs: [['Aplicación', 'Doble costura, hombros y mangas'], ['Ajuste', 'De precisión, según el operador'], ['Conducción', 'Mecanismo avanzado'], ['Materiales', 'Todo tipo de soporte']],
        feats: [
          'Mecanismo avanzado de conducción.',
          'Las estructuras de los mecanismos de ajuste están realizadas con materiales de alta calidad y permiten el ajuste preciso según los requerimientos del operador.',
          'Conveniente para todas las clases de costura y doble costura, en hombros y mangas de diferentes soportes.'
        ]
      },
      {
        marca: 'Siruba', img: 'Siruba-Interlok.gif', ref: 'INT-SIR',
        slug: 'interlock-siruba',
        nombre: 'Interlock de base plana y alta velocidad',
        resumen: 'Base plana para costura general y dobladillado, con corta hilos neumático o eléctrico y rodillo de arrastre.',
        chips: ['Corta hilos neumático/eléctrico', 'Rodillo de arrastre'],
        specs: [['Base', 'Plana'], ['Aplicación', 'Costura general y dobladillado'], ['Corta hilos', 'Superior e inferior, neumático o eléctrico'], ['Arrastre', 'Rodillo trasero'], ['Accesorios', 'Ribeteador, alforzas, elásticos, pasacintos']],
        feats: [
          'Base plana y alta velocidad, para costura general y dobladillado.',
          'Corta hilos superior e inferior de tipo neumático o eléctrico (según modelo), y rodillo de arrastre trasero.',
          'Excelente performance y posibilidad de adicionar accesorios: ribeteador de cintas, costuras laterales, alforzas, elásticos y pasacintos.'
        ]
      },
      {
        marca: 'Yamata', img: 'Yamata-Interlok.gif', ref: 'INT-YAM',
        slug: 'interlock-yamata',
        nombre: 'Interlock de alta velocidad',
        resumen: 'Ideal para ropa interior, deportiva y camisetas, con servomotor y dosificador automático de aceite.',
        chips: ['Servomotor', 'Dosificador de aceite'],
        specs: [['Aplicación', 'Ropa interior, deportiva y camisetas'], ['Motor', 'Servomotor'], ['Lubricación', 'Dosificador automático'], ['Corte', 'Dispositivo elevable'], ['Presión de pie', 'Con función automática']],
        feats: [
          'Ideal para coser ropa interior, ropa deportiva y camisetas.',
          'Dosificador automático de aceite que mantiene el equipo limpio de impurezas.',
          'Adopta servomotor: permite subir y bajar el dispositivo de corte, con función de presión de pie y sistema exacto de orientación. Fácil de operar.'
        ]
      }
    ]
  },
  {
    id: 'overlock', slug: 'overlock', nombre: 'Overlock', corto: 'Overlock',
    titulo: 'Overlock de alta velocidad',
    intro: 'Puntada de seguridad y terminación de bordes hasta 7500 rpm.',
    modelos: [
      {
        marca: 'Typical', img: 'Tyoical-Overlok.gif', ref: 'OVE-TYP',
        slug: 'overlock-typical',
        nombre: 'Overlock de alta velocidad',
        resumen: 'Hasta 7500 rpm para telas ligeras y medio pesadas, con protector movible de aguja y lubricación automática.',
        chips: ['7500 rpm', 'Lubricación automática'],
        specs: [['Velocidad máxima', '7500 rpm'], ['Materiales', 'Telas ligeras y medio pesadas'], ['Agujas', '2 rectas, doble alzador'], ['Protector de aguja', 'Movible, se activa sólo si es necesario'], ['Lubricación', 'Automática']],
        feats: [
          'Conveniente para coser telas ligeras y medio pesadas. Velocidad extra rápida: 7500 rpm.',
          'Componentes y materiales de fabricación de alta resistencia y durabilidad.',
          'Protector movible de aguja que se activa solamente si es necesario, eliminando el salto de puntada.',
          'Sistema de lubricación automático, que reduce la suciedad al máximo.',
          'Dos agujas rectas y doble alzadores: realiza el borde que ata y cose simultáneamente.'
        ]
      },
      {
        marca: 'Siruba', img: 'Siruba-oVERLOK.gif', ref: 'OVE-SIR',
        slug: 'overlock-siruba',
        nombre: 'Overlock / puntada de seguridad de alta velocidad',
        resumen: 'Puntada de seguridad a 7500 rpm, con impulsión directa de la barra de aguja y cortador neumático.',
        chips: ['7500 rpm', 'Impulsión directa'],
        specs: [['Velocidad máxima', '7500 rpm'], ['Puntada', 'Overlock / de seguridad'], ['Barra de aguja', 'Impulsión directa'], ['Cortador de hilo', 'Neumático vertical y horizontal'], ['Salto de puntada', 'Sistema de prevención']],
        feats: [
          'Overlock / puntada de seguridad de alta velocidad, 7500 rpm.',
          'Impulsión directa de la barra de la aguja, para coser regulando según la media de la tela.',
          'Cortador de hilo neumático vertical y horizontal.',
          'Sistema para evitar el salto de puntada.',
          'Elementos de fabricación de alta calidad y resistencia. Admite el agregado de varios accesorios.'
        ]
      },
      {
        marca: 'Yamata', img: 'Yamata-oVERLOK.gif', ref: 'OVE-YAM',
        slug: 'overlock-yamata',
        nombre: 'Overlock de alta velocidad',
        resumen: 'Para materiales de peso medio, con puntada bajo tensión óptima incluso a 6500 rpm.',
        chips: ['6500 rpm', 'Lubricado automático'],
        specs: [['Velocidad máxima', '6500 rpm'], ['Materiales', 'De peso medio'], ['Puntada', 'Bajo tensión'], ['Lubricación', 'Automática']],
        feats: [
          'Conveniente para materiales de peso medio.',
          'Puntada de costura bajo tensión, con resultados óptimos incluso a altas velocidades (6500 rpm).',
          'Lubricado automático de excelente funcionamiento.'
        ]
      }
    ]
  },
  {
    id: 'poste', slug: 'de-poste', nombre: 'De poste', corto: 'máquina de poste',
    titulo: 'Máquina de poste, 1 y 2 agujas',
    intro: 'Punto de cadena para marroquinería y calzado.',
    modelos: [
      {
        marca: 'Feiyute', img: 'Yamata-pOSTE.gif', ref: 'POS-FEI',
        slug: 'de-poste-feiyute',
        nombre: 'Máquina de poste de 1 y 2 agujas',
        resumen: 'Punto de cadena de 1 y 2 agujas, ideal para trabajos en cuero: zapatos, sandalias y marroquinería.',
        chips: ['1 y 2 agujas', 'Punto de cadena'],
        specs: [['Agujas', '1 y 2'], ['Puntada', 'Punto de cadena'], ['Aplicación', 'Cuero: zapatos, sandalias'], ['Soporte', 'Sistema pilar-soporte']],
        feats: [
          'Costura de punto de cadena, de 1 y 2 agujas.',
          'Ideal para realizar trabajos en cuero: zapatos, sandalias y afines.',
          'Excelente sistema de pilar-soporte, de fácil operatividad.',
          'Construida con materiales durables y confiables.'
        ]
      }
    ]
  },
  {
    id: 'atracadora', slug: 'atracadora', nombre: 'Atracadora', corto: 'Atracadora',
    titulo: 'Atracadora de alta velocidad',
    intro: 'Refuerzo de puntos de tensión en jeans, uniformes y lencería.',
    modelos: [
      {
        marca: 'Feiyute', img: 'Yamata-Atracadora.gif', ref: 'ATR-FEI',
        slug: 'atracadora-feiyute',
        nombre: 'Atracadora de alta velocidad',
        resumen: 'Refuerza puntos de tensión en jeans, uniformes y lencería, con cabezal ajustable en largo y ancho.',
        chips: ['Cabezal ajustable', 'Lubricación concentrada'],
        specs: [['Aplicación', 'Jeans, uniformes, ropa de trabajo, lencería'], ['Cabezal', 'Largo y ancho ajustables'], ['Pedal', 'Presión automática'], ['Lubricación', 'Sistema concentrado'], ['Régimen', 'Recomendada a altas velocidades']],
        feats: [
          'Refuerza las partes tirantes de conjuntos, pantalones vaqueros, uniformes, ropa de trabajo y lencería, y los extremos redondeados del ojal.',
          'La longitud y el ancho del cabezal se pueden ajustar fácilmente.',
          'Condensador de ajuste automático del hilo de rosca, presión de pedal automática y sistema concentrado de lubricación.',
          'Se recomienda la utilización del equipo a altas velocidades.'
        ]
      }
    ]
  },
  {
    id: 'ojaladora', slug: 'ojaladora', nombre: 'Ojaladora', corto: 'Ojaladora',
    titulo: 'Ojaladora de alta velocidad',
    intro: 'Ojales prolijos y firmes en telas delgadas y gruesas.',
    modelos: [
      {
        marca: 'Feiyute', img: 'Yamata-Ojaladora.gif', ref: 'OJA-FEI',
        slug: 'ojaladora-feiyute',
        nombre: 'Ojaladora de alta velocidad',
        resumen: 'Ojales en algodón, fibra y paño, con puntada plana o de triángulo y tijera automática.',
        chips: ['Puntada plana y de triángulo', 'Tijera automática'],
        specs: [['Materiales', 'Algodón, fibra y paño; telas delgadas y gruesas'], ['Puntadas', 'Plana y de triángulo'], ['Ojal', 'Largo y ancho ajustables'], ['Tijera', 'Automática'], ['Lubricación', 'Con sistema lubricante']],
        feats: [
          'Alta velocidad. Se aplica a la confección de ojales en todas las clases de soporte: algodón, fibra y paño, en telas delgadas y gruesas.',
          'Puede coser dos tipos de puntada, plana y de triángulo, manteniendo la costura prolija y firme.',
          'La longitud y anchura de los ojales y la cantidad de puntadas son ajustables.',
          'Cuenta con tijera automática y sistema lubricante.'
        ]
      }
    ]
  },
  {
    id: 'cortadora', slug: 'cortadora-de-tela', nombre: 'Cortadora de tela', corto: 'Cortadora de tela',
    titulo: 'Máquina recta para corte de tela',
    intro: 'Corte limpio, recto y curvilíneo en 6, 8, 10 y 12 pulgadas.',
    modelos: [
      {
        marca: 'Yamata', img: 'Yamata-Cortetela.gif', ref: 'COR-YAM',
        slug: 'cortadora-de-tela-yamata',
        nombre: 'Máquina recta para corte de tela',
        resumen: 'Corte recto y curvilíneo en 6, 8, 10 y 12 pulgadas, con dispositivo de cuchillo automático.',
        chips: ['6" · 8" · 10" · 12"', 'Cuchillo automático'],
        specs: [['Medidas', '6, 8, 10 y 12 pulgadas'], ['Materiales', 'Algodón, cuero, lana, lino y sintéticos'], ['Corte', 'Recto y curvilíneo'], ['Cuchillo', 'Dispositivo automático'], ['Ruido', 'Bajo, funcionamiento estable']],
        feats: [
          'Corte de tela en 6, 8, 10 y 12 pulgadas.',
          'Conveniente para algodón, cuero, género de lana, lino y fibras sintéticas.',
          'Realiza cortes limpios, rectos y curvilíneos.',
          'Funcionamiento con poco ruido, estable, fácil de operar y de alta eficacia.',
          'Cuenta con dispositivo de cuchillo automático.'
        ]
      }
    ]
  }
];

/** Link de WhatsApp con el mensaje ya redactado. */
function waLink(texto) {
  return 'https://wa.me/' + WHATSAPP + (texto ? '?text=' + encodeURIComponent(texto) : '');
}

/**
 * Consulta precargada para un modelo puntual. Usa el nombre corto de la
 * categoría, no el comercial completo: "la Overlock Siruba (OVE-SIR)" es como
 * lo pide un cliente, "la Overlock / puntada de seguridad de alta velocidad
 * Siruba" no lo dice nadie.
 */
function waModelo(m, cat) {
  const nombre = cat ? (cat.corto || cat.nombre) : m.nombre;
  return waLink('Hola Casa Kira, quería consultar por la ' + nombre + ' ' + m.marca + ' (' + m.ref + ').');
}

if (typeof module !== 'undefined') module.exports = { CATEGORIAS, WHATSAPP, TEL, waLink, waModelo };
