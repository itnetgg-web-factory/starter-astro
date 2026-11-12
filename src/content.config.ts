// Collections de contenus éditables (Decap CMS au bloc Astro 3/4). Schémas : src/schemas/contenus.ts.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  settingsSchema,
  homeSchema,
  serviceSchema,
  planSchema,
  testimonialSchema,
  pageSchema,
} from './schemas/contenus';

const base = (folder: string) => `./src/content/${folder}`;

export const collections = {
  // Fichiers uniques : un seul document attendu (site.yaml, accueil.yaml).
  reglages: defineCollection({ loader: glob({ pattern: '*.yaml', base: base('reglages') }), schema: settingsSchema }),
  accueil: defineCollection({
    loader: glob({ pattern: '*.yaml', base: base('accueil') }),
    schema: ({ image }) => homeSchema(image),
  }),
  // Listes : un fichier par élément, triées par `order`, masquées si `published: false`.
  prestations: defineCollection({ loader: glob({ pattern: '*.yaml', base: base('prestations') }), schema: serviceSchema }),
  formules: defineCollection({ loader: glob({ pattern: '*.yaml', base: base('formules') }), schema: planSchema }),
  temoignages: defineCollection({ loader: glob({ pattern: '*.yaml', base: base('temoignages') }), schema: testimonialSchema }),
  // Pages simples en Markdown (mentions légales, confidentialité…), servies à /<nom-du-fichier>.
  pages: defineCollection({ loader: glob({ pattern: '*.md', base: base('pages') }), schema: pageSchema }),
};
