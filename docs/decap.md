# Decap CMS : édition des contenus

Le client modifie textes, images et tarifs dans `/admin`, sans toucher au code. Chaque modification devient un commit dans le dépôt, validé par la CI avant publication.

## Architecture

| Élément | Rôle |
|---|---|
| `public/admin/index.html` | Charge Decap CMS 3.17.3 depuis jsDelivr, version exacte et empreinte d'intégrité (SRI) |
| `public/admin/config.yml` | Collections et champs, alignés sur `src/schemas/contenus.ts` (voir [`contenus.md`](contenus.md)) |
| `public/admin/demarrage.js` | Démarre Decap avec l'adresse du site comme serveur d'authentification |
| `worker/oauth.js` | Authentification GitHub : copie épinglée de [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) (MIT), servie sur `/oauth/*` |
| `wrangler.jsonc` | Un seul Worker par site : fichiers statiques de `dist/` + routes `/oauth/*` |

Le site reste statique : seules les routes `/oauth/authorize` et `/oauth/redirect` exécutent du code.

## Connexion des éditeurs

L'authentification passe par une **GitHub App** propre au site, installée sur le seul dépôt du site :

- l'éditeur se connecte avec **son compte GitHub nominatif**, protégé par la double authentification ;
- il doit avoir le droit d'écriture sur le dépôt du site, et rien d'autre (ni l'organisation, ni Cloudflare) ;
- le jeton délivré ne donne accès qu'aux dépôts où l'application est installée, avec les seules permissions *Contents* et *Pull requests* ; il expire après 8 heures (Decap redemande alors une connexion).

### Créer la GitHub App d'un site

1. Organisation > Settings > Developer settings > GitHub Apps > **New GitHub App**.
2. Nom : `Decap <site>` (34 caractères maximum, unique sur GitHub). Homepage URL : l'adresse du dépôt.
3. Callback URL : `https://<adresse-du-site>/oauth/redirect` (en local : `http://localhost:8787/oauth/redirect`).
4. Cocher **Expire user authorization tokens**. Décocher *Request user authorization during installation*, *Enable Device Flow* et *Webhook > Active*.
5. Repository permissions : **Contents : Read and write**, **Pull requests : Read and write** (Metadata passe en lecture seule automatiquement). Rien d'autre.
6. Where can this GitHub App be installed : **Only on this account**.
7. Créer, noter le **Client ID**, générer un **client secret**.
8. **Install App** > l'organisation > *Only select repositories* > le dépôt du site.
9. Renseigner `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` et `ALLOWED_DOMAINS` : `.dev.vars` en local (voir `.dev.vars.example`), secrets du Worker en ligne. Jamais dans Git.

## Publication : flux éditorial

`publish_mode: editorial_workflow` : une modification n'arrive jamais directement sur `main`.

1. **Brouillon** : Decap crée une branche `cms/…` et une pull request.
2. La CI vérifie le contenu (schémas, build). Une erreur de saisie bloque la publication.
3. **Publier** : Decap fusionne la pull request (squash), ce qui déclenche le déploiement.

`main` étant protégée (contrôles obligatoires, branche à jour), la publication échoue tant que la CI n'a pas fini ; il suffit de réessayer une minute plus tard.

## Travailler en local

| Commande | Usage |
|---|---|
| `npm run dev` + `npm run cms:local` | Decap modifie directement les fichiers du disque, sans GitHub ni connexion (`local_backend`). Pour mettre au point les collections |
| `npm run worker:dev` | Build, puis le Worker sur `http://localhost:8787` : site, `/admin` et vraie connexion GitHub (nécessite `.dev.vars`) |

En local, Decap annonce le domaine `demo.decapcms.org` au Worker : `ALLOWED_DOMAINS` doit contenir `localhost, demo.decapcms.org`.

## Mettre à jour

- **Decap** : changer la version dans `public/admin/index.html` et recalculer l'empreinte (`openssl dgst -sha384 -binary decap-cms.js | openssl base64 -A`) à partir du fichier de l'archive npm.
- **Authentification** : relire la nouvelle version de `sveltia-cms-auth`, remplacer le code de `worker/oauth.js` et mettre à jour le commit cité en en-tête.
