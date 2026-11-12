# starter-astro

Modèle de la **filière B** de l'usine `itnetgg-web-factory` : site statique Astro, contenus éditables avec Decap CMS, déploiement sur Cloudflare Workers via GitHub Actions.

> État : composants (Astro 1/4) et contenus validés par schémas (Astro 2/4) en place. Decap CMS et déploiement Cloudflare arrivent aux blocs Astro 3/4 et 4/4.

## Pour qui

Landing pages et sites vitrines à structure stable, quand on veut un coût d'hébergement et une maintenance minimaux. Le client modifie textes, images et tarifs dans `/admin` sans IA ni accès au code.

## Pile technique

| Composant | Choix |
|---|---|
| Framework | Astro + TypeScript |
| Contenus | `src/content/` (Markdown, MDX ou JSON) avec schémas validés |
| CMS | Decap CMS (Git-first : chaque modification devient un commit) |
| Hébergement | Cloudflare Workers, d'abord sur `workers.dev` |
| CI/CD | GitHub Actions : contrôles, build, déploiement |

## Démarrer

```bash
npm ci
npm run dev       # http://localhost:4321
npm test          # tests des schémas de contenus
npm run verify    # astro check + tests + build, comme la CI
npm run preview   # sert le site construit (dist/)
```

Node.js : version indiquée dans `.nvmrc`. Variables : voir `.env.example`.

## Structure

```
src/
  components/   Header, Footer, Hero, Section, CardGrid, ServiceCard,
                PriceList, Testimonials, Gallery, Contact, Button
  layouts/      BaseLayout (SEO, Open Graph, JSON-LD, lien d'évitement)
  content/      contenus éditables (YAML et Markdown), voir docs/contenus.md
  schemas/      schémas Zod des contenus, testés par npm test
  lib/          accès aux contenus (documents uniques, listes publiées et triées)
  assets/images images des contenus, optimisées au build (WebP, plusieurs tailles)
  pages/        accueil, pages Markdown ([page].astro), 404, robots.txt
  styles/       jetons de design (couleurs, espacements), thème clair et sombre
public/
  admin/        interface Decap CMS (bloc 3/4)
```

## Composants

Chaque section est un composant paramétré par ses props, sans texte client codé en dur. Les textes viennent de `src/content/` :

| Composant | Rôle |
|---|---|
| `Hero` | Titre principal (`h1`), accroche, appels à l'action |
| `Section` | Section ancrée avec titre `h2` et introduction, fond normal ou alterné |
| `CardGrid` + `ServiceCard` | Prestations ou étapes, avec liste de livrables |
| `PriceList` | Formules et tarifs, formule mise en avant |
| `Testimonials` | Citations avec auteur |
| `Gallery` | Images optimisées, `alt` obligatoire, chargement différé |
| `Contact` | Coordonnées et bouton e-mail (pas de formulaire) |

## Contenus

Tous les textes, images et tarifs sont dans `src/content/`, validés au build par des schémas stricts : un champ manquant, inconnu ou mal formé, ou une image introuvable, fait échouer le build. Détail des collections et de leurs champs : [`docs/contenus.md`](docs/contenus.md).

## Indexation

`PUBLIC_SITE_INDEXABLE` vaut `false` par défaut : `robots.txt` bloque les moteurs et chaque page porte `noindex`. Ne passer à `true` que pour la production validée.

## Créer un projet client depuis ce modèle

Voir la procédure dans [`socle`](https://github.com/itnetgg-web-factory/socle/blob/main/docs/nouveau-projet-client.md).

## Conventions

Voir [`socle/docs/conventions.md`](https://github.com/itnetgg-web-factory/socle/blob/main/docs/conventions.md).
