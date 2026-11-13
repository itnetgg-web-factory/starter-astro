// Tests des schémas de contenus : ce qu'un client peut saisir dans le CMS, et ce qui doit être refusé.
// Lancement : npm test (node --test, sans dépendance).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'astro/zod';
import {
  settingsSchema,
  homeSchema,
  serviceSchema,
  planSchema,
  testimonialSchema,
  pageSchema,
} from '../src/schemas/contenus.ts';

// Bouchon de la fonction image() d'Astro : un chemin non vide.
const home = homeSchema(() => z.string().min(1));

const validSettings = {
  name: 'Mon site',
  locale: 'fr_FR',
  nav: [{ label: 'Contact', href: '/#contact' }],
  legalLinks: [{ label: 'Mentions légales', href: '/mentions-legales' }],
  contact: { email: 'contact@example.com' },
};

const section = { title: 'Titre de section' };
const validHome = {
  seo: {
    title: 'Un titre de page assez long',
    description: 'Une description de page suffisamment longue pour passer la borne minimale.',
  },
  hero: { title: 'Bienvenue', lead: 'Une accroche.' },
  phases: section,
  plans: { ...section, note: 'Prix indicatifs.' },
  testimonials: section,
  gallery: { ...section, images: [{ src: '../../assets/images/a.jpg', alt: 'Une image' }] },
  contact: section,
};

const validService = { title: 'Cadrage', description: 'Comprendre le besoin.', order: 1 };
const validPlan = { name: 'Vitrine', price: '1 000 €', description: 'Un site.', features: ['Six pages'], order: 1 };
const validTestimonial = { quote: 'Très bien.', author: 'Claire', order: 1 };
const validPage = {
  title: 'Mentions légales',
  description: 'Mentions légales du site : éditeur, hébergeur et propriété intellectuelle.',
};

const accepts = (schema, data) => assert.ok(schema.safeParse(data).success, JSON.stringify(schema.safeParse(data).error?.issues));
const rejects = (schema, data) => assert.equal(schema.safeParse(data).success, false);

test('les exemples valides sont acceptés', () => {
  accepts(settingsSchema, validSettings);
  accepts(home, validHome);
  accepts(serviceSchema, validService);
  accepts(planSchema, validPlan);
  accepts(testimonialSchema, validTestimonial);
  accepts(pageSchema, validPage);
});

test('valeurs par défaut : élément publié, formule non mise en avant, listes vides', () => {
  const service = serviceSchema.parse(validService);
  assert.equal(service.published, true);
  assert.deepEqual(service.deliverables, []);
  assert.equal(planSchema.parse(validPlan).highlighted, false);
  assert.deepEqual(home.parse(validHome).hero.actions, []);
});

test('un champ obligatoire manquant est refusé', () => {
  rejects(serviceSchema, { ...validService, title: undefined });
  rejects(planSchema, { ...validPlan, features: [] });
  rejects(home, { ...validHome, seo: undefined });
});

test('un champ inconnu (faute de frappe) est refusé, y compris en profondeur', () => {
  rejects(serviceSchema, { ...validService, titel: 'Cadrage' });
  rejects(settingsSchema, { ...validSettings, contact: { email: 'contact@example.com', telephone: '01' } });
  rejects(home, { ...validHome, gallery: { ...validHome.gallery, imgs: [] } });
});

test('un texte vide ou fait seulement d’espaces est refusé', () => {
  rejects(testimonialSchema, { ...validTestimonial, quote: '   ' });
});

test('une image sans texte alternatif est refusée', () => {
  rejects(home, { ...validHome, gallery: { ...section, images: [{ src: 'a.jpg' }] } });
  rejects(home, { ...validHome, gallery: { ...section, images: [{ src: 'a.jpg', alt: '' }] } });
});

test('les liens doivent être internes, en HTTPS, mailto: ou tel:', () => {
  for (const href of ['/page', '#ancre', 'https://example.com', 'mailto:a@example.com', 'tel:+33123456789']) {
    accepts(settingsSchema, { ...validSettings, nav: [{ label: 'Lien', href }] });
  }
  for (const href of ['http://example.com', 'javascript:alert(1)', 'page']) {
    rejects(settingsSchema, { ...validSettings, nav: [{ label: 'Lien', href }] });
  }
});

test('adresse e-mail et code de langue contrôlés', () => {
  rejects(settingsSchema, { ...validSettings, contact: { email: 'pas-un-email' } });
  rejects(settingsSchema, { ...validSettings, locale: 'fr' });
});

test('bornes SEO : titre et description trop courts ou trop longs refusés', () => {
  rejects(pageSchema, { ...validPage, description: 'Trop court.' });
  rejects(pageSchema, { ...validPage, description: 'x'.repeat(171) });
  rejects(home, { ...validHome, seo: { ...validHome.seo, title: 'x'.repeat(71) } });
});

test('ordre d’affichage : entier positif', () => {
  rejects(serviceSchema, { ...validService, order: 0 });
  rejects(serviceSchema, { ...validService, order: 1.5 });
});

test('un champ facultatif vidé dans Decap ("" ou objet vide) est traité comme absent', () => {
  const testimonial = testimonialSchema.parse({ ...validTestimonial, role: '' });
  assert.equal(testimonial.role, undefined);
  const plan = planSchema.parse({ ...validPlan, period: '  ', cta: { label: '', href: '' } });
  assert.equal(plan.period, undefined);
  assert.equal(plan.cta, undefined);
  assert.equal(pageSchema.parse({ ...validPage, updated: '' }).updated, undefined);
  accepts(home, { ...validHome, hero: { ...validHome.hero, actions: [{ label: 'Voir', href: '#a', variant: '' }] } });
});

test('un champ obligatoire vidé reste refusé, et un objet à moitié rempli aussi', () => {
  rejects(serviceSchema, { ...validService, title: '' });
  rejects(planSchema, { ...validPlan, cta: { label: 'Devis', href: '' } });
});
