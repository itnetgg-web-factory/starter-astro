// Schémas des contenus éditables. Tout champ manquant, inconnu ou mal formé fait échouer le build.
// Ce fichier n'importe que Zod : il est testé directement par `npm test` (tests/schemas.test.mjs).
import { z } from 'astro/zod';

/** Texte obligatoire, espaces retirés, longueur maximale. */
const text = (max: number) => z.string().trim().min(1).max(max);

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
  variant: z.enum(['primary', 'secondary']).optional(),
});

/** Référencement : bornes larges pour ne pas bloquer le client, cibles du standard SEO dans les consignes Decap. */
const seo = z.strictObject({
  title: z.string().trim().min(10).max(70),
  description: z.string().trim().min(50).max(170),
});

const sectionIntro = z.strictObject({
  title: text(80),
  intro: text(300).optional(),
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
  footerNote: text(200).optional(),
  contact: z.strictObject({
    email: z.email(),
    phone: text(30).optional(),
    address: text(200).optional(),
    hours: text(120).optional(),
  }),
});

/** `image` : fonction fournie par Astro aux schémas (remplacée par un bouchon dans les tests). */
export const homeSchema = <T extends z.ZodType>(image: () => T) =>
  z.strictObject({
    seo,
    hero: z.strictObject({
      eyebrow: text(40).optional(),
      title: text(90),
      lead: text(300),
      actions: z.array(button).max(2).default([]),
    }),
    phases: sectionIntro,
    plans: z.strictObject({ ...sectionIntro.shape, note: text(200).optional() }),
    testimonials: sectionIntro,
    gallery: z.strictObject({
      ...sectionIntro.shape,
      images: z
        .array(
          z.strictObject({
            src: image(),
            alt: text(200),
            caption: text(80).optional(),
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
  period: text(30).optional(),
  description: text(200),
  features: z.array(text(100)).min(1).max(10),
  highlighted: z.boolean().default(false),
  cta: link.optional(),
  ...listItem,
});

export const testimonialSchema = z.strictObject({
  quote: text(400),
  author: text(60),
  role: text(100).optional(),
  ...listItem,
});

export const pageSchema = z.strictObject({
  title: text(80),
  description: z.string().trim().min(50).max(170),
  updated: z.coerce.date().optional(),
});
