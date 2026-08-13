import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://capturadoresflashkiller.com',
  output: 'static',
  trailingSlash: 'always',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind(), 
    sitemap(), 
    compress()
  ],
  prefetch: false,
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
    imageService: 'compile'
  }
});
