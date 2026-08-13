// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://casakira.com.ar',
  integrations: [
    react(),
    // Las páginas de prototipo quedan fuera del sitemap: son pruebas de diseño
    // y no deben competir en Google con las páginas reales.
    sitemap({ filter: (page) => !page.includes('/prototipo-') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
