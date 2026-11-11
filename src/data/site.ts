// Réglages globaux du site de démonstration.
// Contenu provisoire : il sera déplacé dans src/content/ (éditable dans Decap) au bloc Astro 2/4.
import type { NavItem } from '../components/Header.astro';

export interface SiteSettings {
  name: string;
  locale: string;
  nav: NavItem[];
  legalLinks: NavItem[];
  footerNote?: string;
  contact: {
    email: string;
    phone?: string;
    address?: string;
    hours?: string;
  };
}

export const site: SiteSettings = {
  name: 'Mémento du site web',
  locale: 'fr_FR',
  nav: [
    { label: 'Les phases', href: '/#phases' },
    { label: 'Formules', href: '/#formules' },
    { label: 'Exemples', href: '/#galerie' },
    { label: 'Contact', href: '/#contact' },
  ],
  legalLinks: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Confidentialité', href: '/confidentialite' },
  ],
  footerNote: 'Site de démonstration du modèle starter-astro.',
  contact: {
    email: 'contact@example.com',
    phone: '01 23 45 67 89',
    hours: 'Du lundi au vendredi, de 9 h à 18 h',
  },
};
