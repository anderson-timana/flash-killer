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
  trailingSlash: 'ignore',
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
    format: 'directory',
    inlineStylesheets: 'always',
    imageService: 'compile'
  }
});