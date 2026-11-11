// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique du site : fournie par l'environnement de build (CI), localhost par défaut.
const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  env: {
    schema: {
      // false par défaut : préproduction et sites de test non indexables (standard SEO).
      PUBLIC_SITE_INDEXABLE: envField.boolean({ context: 'client', access: 'public', default: false }),
    },
  },
});
