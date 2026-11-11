// Contenu de la page d'accueil du site de démonstration « Mémento des phases de création d'un site web ».
// Contenu provisoire : il sera déplacé dans src/content/ (éditable dans Decap) au bloc Astro 2/4.
import type { Props as ButtonProps } from '../components/Button.astro';
import type { Plan } from '../components/PriceList.astro';
import type { Testimonial } from '../components/Testimonials.astro';
import type { GalleryImage } from '../components/Gallery.astro';
import cadrage from '../assets/galerie/cadrage.jpg';
import conception from '../assets/galerie/conception.jpg';
import contenus from '../assets/galerie/contenus.jpg';
import realisation from '../assets/galerie/realisation.jpg';
import recette from '../assets/galerie/recette.jpg';
import miseEnLigne from '../assets/galerie/mise-en-ligne.jpg';

export interface Phase {
  title: string;
  description: string;
  deliverables: string[];
}

export const seo = {
  title: "Mémento des phases de création d'un site web, pas à pas",
  description:
    'Cadrage, conception, contenus, réalisation, recette, mise en ligne et suivi : les sept phases pour créer un site web clair, rapide et facile à faire vivre.',
};

export const hero: { eyebrow: string; title: string; lead: string; actions: ButtonProps[] } = {
  eyebrow: 'Mémento',
  title: "Les phases de création d'un site web",
  lead: "Sept étapes, de la première idée au site qui vit sans vous solliciter. Pour savoir à tout moment où en est votre projet et ce qu'il reste à décider.",
  actions: [
    { label: 'Découvrir les phases', href: '#phases' },
    { label: 'Nous contacter', href: '#contact', variant: 'secondary' },
  ],
};

export const phasesSection = {
  title: 'Sept phases, un fil conducteur',
  intro: 'Chaque phase se termine par un livrable vérifiable. On ne passe à la suivante que lorsque le livrable est validé.',
};

export const phases: Phase[] = [
  {
    title: 'Cadrage',
    description: 'Comprendre votre activité, vos visiteurs et ce que le site doit leur permettre de faire.',
    deliverables: ['Objectifs et indicateurs', 'Public visé', 'Choix de la filière technique'],
  },
  {
    title: 'Conception',
    description: "Organiser les pages et les parcours avant d'écrire la moindre ligne de code.",
    deliverables: ['Arborescence', 'Maquettes des pages types', 'Charte graphique'],
  },
  {
    title: 'Contenus',
    description: 'Rassembler et rédiger les textes, les images et les informations pratiques.',
    deliverables: ['Textes relus', 'Images optimisées', 'Mentions légales'],
  },
  {
    title: 'Réalisation',
    description: 'Assembler le site à partir de composants éprouvés, accessibles et rapides.',
    deliverables: ['Site en préproduction', 'Espace de modification des contenus'],
  },
  {
    title: 'Recette',
    description: 'Tout vérifier : affichage mobile, accessibilité, référencement, performances.',
    deliverables: ['Rapport de vérification', 'Corrections validées'],
  },
  {
    title: 'Mise en ligne',
    description: 'Publier le site sur son domaine, avec une sauvegarde et un retour arrière prêts.',
    deliverables: ['Site en production', 'Redirections', 'Suivi des visites'],
  },
  {
    title: 'Suivi',
    description: 'Vous modifiez vos contenus en autonomie ; les mises à jour techniques restent encadrées.',
    deliverables: ["Guide d'édition", 'Récapitulatif des accès et des coûts'],
  },
];

export const pricesSection = {
  title: 'Trois formules pour démarrer',
  intro: 'Le périmètre se fixe au cadrage. Les montants ci-dessous illustrent le composant de tarifs.',
};

export const plans: Plan[] = [
  {
    name: "Page d'atterrissage",
    price: '1 200 €',
    period: 'HT',
    description: 'Une page unique pour présenter une offre et recevoir des demandes.',
    features: ['Une page, cinq sections', 'Contenus modifiables', 'Mise en ligne incluse'],
    cta: { label: 'Demander un devis', href: '#contact' },
  },
  {
    name: 'Site vitrine',
    price: '2 400 €',
    period: 'HT',
    description: "Quelques pages pour présenter votre activité, vos prestations et vos tarifs.",
    features: ["Jusqu'à six pages", 'Galerie et témoignages', 'Référencement de base'],
    highlighted: true,
    cta: { label: 'Demander un devis', href: '#contact' },
  },
  {
    name: 'Accompagnement',
    price: '49 €',
    period: 'HT par mois',
    description: 'Mises à jour techniques, sauvegardes et petites évolutions.',
    features: ['Surveillance et sauvegardes', 'Une heure de modifications par mois'],
    cta: { label: 'En savoir plus', href: '#contact' },
  },
];

export const pricesNote = 'Montants fictifs, affichés pour la démonstration.';

export const testimonialsSection = {
  title: 'Ils ont suivi la méthode',
  intro: 'Témoignages fictifs, affichés pour la démonstration du composant.',
};

export const testimonials: Testimonial[] = [
  {
    quote: 'Nous savions à chaque étape ce qui était décidé et ce qui restait à faire.',
    author: 'Claire',
    role: 'gérante d’un commerce de proximité (exemple)',
  },
  {
    quote: 'Je change mes tarifs et mes photos moi-même, sans craindre de tout casser.',
    author: 'Karim',
    role: 'artisan (exemple)',
  },
  {
    quote: 'La recette nous a évité de découvrir les problèmes après la mise en ligne.',
    author: 'Sophie',
    role: 'responsable d’association (exemple)',
  },
];

export const gallerySection = {
  title: 'Les phases en images',
  intro: 'Illustrations abstraites générées pour la démonstration de la galerie.',
};

export const gallery: GalleryImage[] = [
  { src: cadrage, alt: 'Illustration abstraite de cercles bleus superposés', caption: 'Cadrage' },
  { src: conception, alt: 'Illustration abstraite de cercles verts superposés', caption: 'Conception' },
  { src: contenus, alt: 'Illustration abstraite de cercles orangés superposés', caption: 'Contenus' },
  { src: realisation, alt: 'Illustration abstraite de cercles violets superposés', caption: 'Réalisation' },
  { src: recette, alt: 'Illustration abstraite de cercles roses superposés', caption: 'Recette' },
  { src: miseEnLigne, alt: 'Illustration abstraite de cercles bleu-gris superposés', caption: 'Mise en ligne' },
];

export const contactSection = {
  title: 'Parlons de votre projet',
  intro: 'Une question sur une phase, un projet à cadrer ? Écrivez-nous, réponse sous deux jours ouvrés.',
};
