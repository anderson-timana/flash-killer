import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import partytown from '@astrojs/partytown';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://capturadoresflashkiller.com',
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind(), 
    sitemap(), 
    compress(), 
    partytown({
      config: {
        proxyUrl: '/api/partytown-proxy',
        forward: ['dataLayer.push'],
        resolveUrl: function (url, location, type) {
          if (url.hostname.includes('google-analytics.com') || 
              url.hostname.includes('googletagmanager.com')) {
            var proxyUrl = new URL('/api/partytown-proxy', location.href);
            proxyUrl.searchParams.set('url', url.href);
            return proxyUrl;
          }
          return url;
        },
      },
    })
  ],
  prefetch: false,
  build: {
    inlineStylesheets: 'always',
  },
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