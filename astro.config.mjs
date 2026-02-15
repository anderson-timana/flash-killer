import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://capturadoresflashkiller.com',
  integrations: [tailwind(), sitemap(), compress()],
  redirects: {
    '/contacto': '/contactanos',
    '/cotiza': '/contactanos',
    '/faqs': '/contactanos',
    '/insectocutor-industrial': '/productos/insectocutor-industrial',
    '/trampas-adhesivas-para-insectos': '/productos/trampas-adhesivas-para-insectos',
    '/tubos-fluorescentes-matamoscas': '/productos/fluorescentes-uv-matamoscas',
    '/balastros-electricos-lamparas-uv': '/productos/balastros-electricos-lamparas-uv',
    '/trampas-luz-uv-para-insectos': '/productos/trampas-luz-uv-para-insectos',
    '/productos/tubos-fluorescentes-matamoscas': '/productos/fluorescentes-uv-matamoscas',
  }
});
