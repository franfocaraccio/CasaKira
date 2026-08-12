import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Una máquina = un archivo JSON en src/content/maquinas/.
// Agregar un modelo es agregar un archivo; el id de la entrada es el nombre
// del archivo sin extensión (el slug: overlock-siruba, recta-1-aguja-typical…).
const maquinas = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/maquinas' }),
  schema: z.object({
    nombre: z.string(),
    marca: z.string(),
    categoria: z.string(),
    orden: z.number(),
    ref: z.string(),
    img: z.string(),
    resumen: z.string(),
    chips: z.array(z.string()),
    specs: z.array(z.object({ k: z.string(), v: z.string() })),
    feats: z.array(z.string()),
  }),
});

export const collections = { maquinas };
