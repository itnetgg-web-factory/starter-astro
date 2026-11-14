# Déploiement sur Cloudflare Workers

Un seul Worker par site sert les fichiers construits (`dist/`) et les routes `/oauth/*` de Decap. Configuration : `wrangler.jsonc`.

## Publication automatique

Le job `deploy` de `.github/workflows/ci.yml` publie le site **après chaque fusion dans `main`**, y compris les contenus publiés par Decap :

1. Il attend que les contrôles (`controles`) et le build passent.
2. Il reconstruit le site avec l'adresse publique (`PUBLIC_SITE_URL`).
3. Il exécute `wrangler deploy`. Le message de la version Cloudflare porte le commit publié.

Il n'y a aucun déploiement depuis une pull request. Les déploiements s'enchaînent sans s'annuler (`concurrency`).

## Configuration

| Élément | Où | Contenu |
|---|---|---|
| Environnement GitHub `staging` | Settings > Environments | Limité à la branche `main` |
| `CLOUDFLARE_API_TOKEN` | Secret de l'environnement `staging` | Jeton API Cloudflare : **Account > Workers Scripts > Edit**, sur le seul compte du site |
| `CLOUDFLARE_ACCOUNT_ID` | Variable de l'environnement `staging` | Identifiant du compte Cloudflare |
| `PUBLIC_SITE_URL` | Variable de l'environnement `staging` | Adresse publique, par exemple `https://<nom>.<sous-domaine>.workers.dev` |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | Secrets du **Worker** (`wrangler secret put`) | GitHub App du site, voir [`decap.md`](decap.md) |
| `ALLOWED_DOMAINS` | `vars` de `wrangler.jsonc` | Domaine du site, seul autorisé à recevoir un jeton GitHub |

Les secrets du Worker sont conservés d'un déploiement à l'autre. Ils ne passent jamais par GitHub.

## Premier déploiement d'un site

1. Choisir le compte Cloudflare (accord de Gérard) et se connecter : `npx wrangler login --use-keyring --scopes account:read user:read workers:write workers_scripts:write workers_tail:read`.
2. Adapter `name` et `ALLOWED_DOMAINS` dans `wrangler.jsonc`.
3. Amorçage : `npm run build`, puis `npx wrangler deploy`. Le Worker est créé et son adresse `workers.dev` s'affiche.
4. Secrets du Worker : `npx wrangler secret put GITHUB_CLIENT_ID`, puis `GITHUB_CLIENT_SECRET`.
5. GitHub App : ajouter `https://<adresse>/oauth/redirect` aux Callback URL.
6. Environnement `staging` : limiter à `main`, créer le secret et les deux variables ci-dessus.
7. Les déploiements suivants passent uniquement par GitHub Actions.

## Revenir en arrière

| Situation | Action |
|---|---|
| Contenu ou code erroné, à corriger proprement | Annuler le commit fautif par une pull request (`git revert`). Après fusion, le site est republié automatiquement |
| Urgence : remettre tout de suite la version précédente | `npx wrangler deployments list` pour repérer la version, puis `npx wrangler rollback <version-id>`. Ou, dans le tableau de bord Cloudflare : Workers > le site > Deployments |

Un retour arrière par Cloudflare ne modifie pas `main`. Il faut ensuite corriger `main` par une pull request : la prochaine fusion republierait la version fautive.

## Vérifier un déploiement

```bash
U=https://<adresse>
curl -sI $U/ | grep -iE "^HTTP|x-frame|strict-transport"   # 200 + en-têtes de sécurité (public/_headers)
curl -s $U/robots.txt                                       # Disallow: / tant que le site n'est pas indexable
curl -sI $U/admin/ | grep -i x-robots                       # noindex sur /admin
```

Journaux en direct : `npx wrangler tail`. Les secrets n'y apparaissent jamais.
