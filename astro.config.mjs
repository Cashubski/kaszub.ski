import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// One revision date for the sitemap and the JSON-LD dateModified: read from src/data/site.ts.
const revisedISO = /revisedISO: '(\d{4}-\d{2}-\d{2})'/.exec(readFileSync(new URL('./src/data/site.ts', import.meta.url), 'utf8'))?.[1];
if (!revisedISO) throw new Error('revisedISO not found in src/data/site.ts');

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://kaszub.ski',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/\/404(\.html)?$/.test(page),
      changefreq: 'monthly',
      lastmod: new Date(revisedISO),
    }),
  ],
  image: {
    // sharp is the default service; images are resized and served as webp, never upscaled.
    responsiveStyles: false,
  },
});
