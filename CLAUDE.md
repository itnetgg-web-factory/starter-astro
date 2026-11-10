# CLAUDE.md : starter-astro

Modèle public de la filière Astro + Decap CMS + Cloudflare Workers. N'y écrire aucune information propre à un client, à un compte ou à un hébergement.

## Règles

- Conventions communes : https://github.com/itnetgg-web-factory/socle/blob/main/docs/conventions.md
- Branche `feature/*`, pull request, fusion par squash. Jamais de commit direct sur `main`.
- Aucun secret dans Git : les identifiants Cloudflare et OAuth vivent dans les secrets GitHub.
- Déploiement uniquement sur `workers.dev` tant que le modèle n'est pas validé. Aucune ressource Cloudflare créée sans l'accord de Gérard.
- Les contenus éditables par le client restent dans `src/content/`, séparés des composants.
- Après chaque étape : build local réussi et rendu vérifié avant de proposer la fusion.

## Standards et Skills

- Standards à appliquer : https://github.com/itnetgg-web-factory/socle/tree/main/standards
- Skill Claude Code de la filière : `site-astro` ; livraison : `site-delivery`.
