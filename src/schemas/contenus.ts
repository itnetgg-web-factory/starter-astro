// Schémas des contenus éditables. Tout champ manquant, inconnu ou mal formé fait échouer le build.
// Ce fichier n'importe que Zod : il est testé directement par `npm test` (tests/schemas.test.mjs).
import { z } from 'astro/zod';

/** Texte obligatoire, espaces retirés, longueur maximale. */
const text = (max: number) => z.string().trim().min(1).max(max);

/**
 * Valeur vide envoyée par Decap CMS quand un champ facultatif est effacé : `""`, ou objet dont
 * tous les champs sont vides. Elle est traitée comme absente plutôt que de faire échouer le build.
 */
const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '') ||
  (typeof value === 'object' && !Array.isArray(value) && Object.values(value).every(isEmpty));

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (isEmpty(value) ? undefined : value), schema.optional());

/** Lien interne (/…, #…), externe en HTTPS, e-mail ou téléphone. */
const href = z
  .string()
  .trim()
  .regex(/^(\/|#|https:\/\/|mailto:|tel:)/, 'Lien attendu : /page, #ancre, https://…, mailto: ou tel:');

const link = z.strictObject({
  label: text(40),
  href,
});

const button = z.strictObject({
  label: text(40),
  href,
  variant: optional(z.enum(['primary', 'secondary'])),
});

/** Référencement : bornes larges pour ne pas bloquer le client, cibles du standard SEO dans les consignes Decap. */
const seo = z.strictObject({
  title: z.string().trim().min(10).max(70),
  description: z.string().trim().min(50).max(170),
});

const sectionIntro = z.strictObject({
  title: text(80),
  intro: optional(text(300)),
});

/** Champs communs aux éléments de liste (prestations, formules, témoignages). */
const listItem = {
  order: z.number().int().min(1).max(99),
  published: z.boolean().default(true),
};

export const settingsSchema = z.strictObject({
  name: text(60),
  locale: z.string().regex(/^[a-z]{2}_[A-Z]{2}$/, 'Format attendu : fr_FR'),
  nav: z.array(link).min(1).max(7),
  legalLinks: z.array(link).max(5),
  footerNote: optional(text(200)),
  contact: z.strictObject({
    email: z.email(),
    phone: optional(text(30)),
    address: optional(text(200)),
    hours: optional(text(120)),
  }),
});

/** `image` : fonction fournie par Astro aux schémas (remplacée par un bouchon dans les tests). */
export const homeSchema = <T extends z.ZodType>(image: () => T) =>
  z.strictObject({
    seo,
    hero: z.strictObject({
      eyebrow: optional(text(40)),
      title: text(90),
      lead: text(300),
      actions: z.array(button).max(2).default([]),
    }),
    phases: sectionIntro,
    plans: z.strictObject({ ...sectionIntro.shape, note: optional(text(200)) }),
    testimonials: sectionIntro,
    gallery: z.strictObject({
      ...sectionIntro.shape,
      images: z
        .array(
          z.strictObject({
            src: image(),
            alt: text(200),
            caption: optional(text(80)),
          }),
        )
        .max(24),
    }),
    contact: sectionIntro,
  });

export const serviceSchema = z.strictObject({
  title: text(60),
  description: text(300),
  deliverables: z.array(text(80)).max(8).default([]),
  ...listItem,
});

export const planSchema = z.strictObject({
  name: text(40),
  price: text(20),
  period: optional(text(30)),
  description: text(200),
  features: z.array(text(100)).min(1).max(10),
  highlighted: z.boolean().default(false),
  cta: optional(link),
  ...listItem,
});

export const testimonialSchema = z.strictObject({
  quote: text(400),
  author: text(60),
  role: optional(text(100)),
  ...listItem,
});

export const pageSchema = z.strictObject({
  title: text(80),
  description: z.string().trim().min(50).max(170),
  updated: optional(z.coerce.date()),
});
