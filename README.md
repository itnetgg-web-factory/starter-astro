# starter-astro

Modèle de la **filière B** de l'usine `itnetgg-web-factory` : site statique Astro, contenus éditables avec Decap CMS, déploiement sur Cloudflare Workers via GitHub Actions.

> État : conventions posées (Phase 0). Le code Astro arrive aux blocs Astro 1/4 à 4/4.

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

## Structure prévue

```
src/
  components/   Header, Hero, ServiceCard, PriceList, Gallery, Footer
  layouts/      BaseLayout
  content/      pages, services, témoignages
  pages/
public/
  admin/        interface Decap CMS
```

## Créer un projet client depuis ce modèle

Voir la procédure dans [`socle`](https://github.com/itnetgg-web-factory/socle/blob/main/docs/nouveau-projet-client.md).

## Conventions

Voir [`socle/docs/conventions.md`](https://github.com/itnetgg-web-factory/socle/blob/main/docs/conventions.md).
