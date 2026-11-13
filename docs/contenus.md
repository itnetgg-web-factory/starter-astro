# Contenus éditables

Les contenus vivent dans `src/content/`, un dossier par collection. Les schémas sont dans `src/schemas/contenus.ts` et la déclaration des collections dans `src/content.config.ts`. La configuration de Decap CMS (`public/admin/config.yml`) suit ce document ; son fonctionnement est décrit dans [`decap.md`](decap.md).

## Règles communes

- **Champs vides** : un champ facultatif effacé dans Decap (`""` ou bouton vide) est traité comme absent.
- **Validation stricte** : un champ obligatoire manquant, un champ inconnu (faute de frappe), un texte vide, un lien non conforme ou une image introuvable font échouer le build. Le site en ligne n'est donc jamais remplacé par une version cassée.
- **Liens acceptés** : `/page`, `#ancre`, `https://…`, `mailto:…`, `tel:…`. Le `http://` et le `javascript:` sont refusés.
- **Images** : dans `src/assets/images/`, référencées depuis un contenu par l'alias `@assets/images/photo.jpg` (défini dans `tsconfig.json`, compris par Astro et par Decap). Texte alternatif obligatoire. Astro les convertit en WebP en plusieurs tailles.
- **Listes** (prestations, formules, témoignages) : un fichier par élément, trié par `order` (entier de 1 à 99), masqué si `published: false`. Une section dont la liste est vide n'est pas affichée.

## Collections

| Collection | Fichiers | Type Decap prévu | Contenu |
|---|---|---|---|
| `reglages` | `site.yaml` | fichier unique | Nom du site, langue, menu, liens légaux, note de pied de page, coordonnées |
| `accueil` | `accueil.yaml` | fichier unique | SEO, présentation, titres et introductions des sections, galerie |
| `prestations` | `<nom>.yaml` | dossier | Étapes ou prestations : titre, description, livrables |
| `formules` | `<nom>.yaml` | dossier | Tarifs : nom, prix, période, description, inclus, mise en avant, bouton |
| `temoignages` | `<nom>.yaml` | dossier | Citation, auteur, fonction |
| `pages` | `<nom>.md` | dossier | Pages simples en Markdown, servies à `/<nom>` (mentions légales, confidentialité) |

## Champs et limites

### `reglages/site.yaml`

| Champ | Obligatoire | Règle |
|---|---|---|
| `name` | oui | 60 caractères max |
| `locale` | oui | format `fr_FR` |
| `nav` | oui | 1 à 7 liens `{ label, href }` |
| `legalLinks` | oui | 5 liens max |
| `footerNote` | non | 200 caractères max |
| `contact.email` | oui | adresse valide |
| `contact.phone`, `contact.address`, `contact.hours` | non | texte court |

### `accueil/accueil.yaml`

| Champ | Obligatoire | Règle |
|---|---|---|
| `seo.title` | oui | 10 à 70 caractères (cible : 50 à 60) |
| `seo.description` | oui | 50 à 170 caractères (cible : 140 à 160) |
| `hero.title`, `hero.lead` | oui | 90 et 300 caractères max |
| `hero.eyebrow` | non | 40 caractères max |
| `hero.actions` | non | 2 boutons max `{ label, href, variant }`, `variant` : `primary` ou `secondary` |
| `phases`, `testimonials`, `contact` | oui | `{ title, intro }`, introduction facultative |
| `plans` | oui | `{ title, intro, note }` |
| `gallery` | oui | `{ title, intro, images }`, 24 images max `{ src, alt, caption }` |

### Listes

| Collection | Champs obligatoires | Champs facultatifs |
|---|---|---|
| `prestations` | `title` (60), `description` (300), `order` | `deliverables` (8 max), `published` |
| `formules` | `name` (40), `price` (20), `description` (200), `features` (1 à 10), `order` | `period`, `highlighted`, `cta { label, href }`, `published` |
| `temoignages` | `quote` (400), `author` (60), `order` | `role`, `published` |

### `pages/<nom>.md`

En-tête : `title` (80), `description` (50 à 170), `updated` (date, facultative). Le corps est en Markdown, avec des intertitres de niveau 2 (`##`) : le titre de niveau 1 est généré à partir de `title`.

## Tests

`npm test` vérifie les schémas sur des exemples valides et invalides (`tests/schemas.test.mjs`). La CI lance ces tests avant le build.
