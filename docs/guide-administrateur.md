# Guide administrateur : publications, incidents et restauration

Pour la personne qui assure le support technique du site. Ce guide complète le [guide utilisateur](guide-utilisateur.md), destiné au client, et renvoie à [`decap.md`](decap.md) (authentification, configuration) et à [`deploiement.md`](deploiement.md) (Cloudflare, secrets).

Les commandes `gh` et `wrangler` s'exécutent depuis la copie locale du dépôt du site. Remplacer `<dépôt>` par `itnetgg-web-factory/<nom-du-site>`.

## Comprendre le circuit d'une modification

| Action du client dans Decap | Ce qui se passe dans GitHub |
|---|---|
| **Enregistrer** (premier enregistrement) | Création d'une branche `cms/<collection>/<élément>` (exemple : `cms/formules/accompagnement`) et d'une pull request, avec le libellé `decap-cms/draft` |
| **Enregistrer** (suivants) | Nouveau commit sur la même branche ; la CI repasse |
| Statut **En cours de révision** / **Prêt** | Libellé de la pull request changé en `decap-cms/pending_review` / `decap-cms/pending_publish` |
| **Publier maintenant** | Fusion de la pull request dans `main` (squash), suppression de la branche |
| *(automatique)* | CI sur `main`, puis job **Déploiement (workers.dev)** : le site est en ligne en 2 à 3 minutes |

Un élément Decap correspond à un fichier de `src/content/` et à une seule pull request. Les images téléversées sont ajoutées dans `src/assets/images/` sur la même branche.

`main` est protégée : trois contrôles obligatoires (`controles / Format`, `controles / Secrets`, `Build`) et **branche à jour exigée** avant fusion. Ces deux règles expliquent la plupart des publications refusées.

## Résoudre une publication refusée

Le client voit « Échec de la publication : … ». Commencer par identifier la pull request :

```bash
gh pr list -R <dépôt> --search "head:cms/"     # brouillons Decap ouverts
gh pr checks <n> -R <dépôt>                    # état des contrôles
gh pr view <n> -R <dépôt> --json mergeStateStatus --jq .mergeStateStatus
```

| `mergeStateStatus` | Cause | Solution |
|---|---|---|
| `BLOCKED` avec contrôles en cours | La CI n'a pas fini | Attendre 1 à 2 minutes ; le client republie |
| `BLOCKED` avec un contrôle en échec | Contenu refusé par les schémas (texte trop long, champ manquant, image introuvable) | Lire l'erreur : `gh run view <run> -R <dépôt> --log-failed`. Faire corriger le champ par le client dans Decap (un nouvel enregistrement relance la CI), ou corriger le fichier sur la branche |
| `BEHIND` | Une autre publication a eu lieu depuis la création du brouillon | `gh pr update-branch <n> -R <dépôt>`, attendre la CI, puis le client republie (ou fusionner : voir ci-dessous) |
| `DIRTY` | Conflit : deux brouillons modifiaient le même fichier (souvent `accueil.yaml`) | Résoudre le conflit dans GitHub (*Resolve conflicts*), ou faire supprimer le brouillon par le client (**Supprimer les modifications non publiées**) et lui faire refaire la modification à partir de la version en ligne |
| `CLEAN` | Le refus ne venait pas de GitHub : session expirée ou droits insuffisants | Le client se reconnecte. Vérifier qu'il a le droit d'écriture sur le dépôt et que la GitHub App du site y est installée |

Fusionner soi-même une pull request Decap, une fois les contrôles au vert, est équivalent à « Publier maintenant » :

```bash
gh pr merge <n> -R <dépôt> --squash --delete-branch
```

L'élément disparaît alors de l'onglet **Flux** de Decap. Prévenir le client que sa modification est publiée.

## Publication acceptée mais site inchangé

La fusion a réussi, mais le déploiement a échoué :

```bash
gh run list -R <dépôt> --branch main --limit 3
gh run view <run> -R <dépôt> --log-failed
```

| Erreur dans le job « Déploiement » | Solution |
|---|---|
| `Authentication error [code: 10000]` | Jeton Cloudflare expiré, révoqué ou sans l'autorisation Editor sur le Worker. Créer un nouveau jeton (voir « Jeton de déploiement » dans [`deploiement.md`](deploiement.md)), puis `gh secret set CLOUDFLARE_API_TOKEN --env staging -R <dépôt>` |
| `Cannot use the access token from location [code: 9109]` | Filtre d'adresse IP sur le jeton : le retirer (les adresses de GitHub Actions varient) |
| Erreur réseau ou incident Cloudflare | Relancer plus tard |

Relancer uniquement le job en échec, sans nouvelle fusion :

```bash
gh run rerun <run> -R <dépôt> --failed
```

## Consulter les journaux

| Quoi | Où |
|---|---|
| Contrôles d'une pull request | GitHub > Pull requests > la pull request > *Checks*, ou `gh pr checks <n> -R <dépôt>` |
| Exécutions de la CI et du déploiement | GitHub > Actions, ou `gh run list -R <dépôt>` puis `gh run view <run> -R <dépôt> --log` |
| Versions publiées sur Cloudflare | Tableau de bord Cloudflare > Workers & Pages > le site > *Deployments*, ou `npx wrangler deployments list`. Le message de chaque version donne le commit publié (`Commit <sha>`) |
| Requêtes en direct (dont `/oauth/*`) | `npx wrangler tail`, ou tableau de bord > le site > *Logs* |

Les secrets n'apparaissent jamais dans ces journaux : GitHub masque le jeton (`***`), et les secrets du Worker ne sont pas affichés. Ne jamais les copier dans un ticket, un message ou un fichier du dépôt.

## Restaurer une version précédente

| Situation | Méthode | Délai |
|---|---|---|
| Urgence : le site affiche une erreur grave | **Retour arrière Cloudflare** : `npx wrangler deployments list`, repérer la dernière version saine, puis `npx wrangler rollback <version-id> --message "Motif"`. Ou tableau de bord > *Deployments* > *Rollback* | Quelques secondes |
| Annuler une publication | **Pull request d'annulation** : sur GitHub, ouvrir la pull request publiée et cliquer sur *Revert*, puis fusionner la nouvelle pull request une fois les contrôles au vert. Le site est republié automatiquement | 3 à 5 minutes |
| Rétablir un seul contenu dans un état antérieur | Sur une branche `fix/…` : `git log -- src/content/<fichier>` pour trouver le commit, `git checkout <sha> -- src/content/<fichier>`, puis pull request | 3 à 5 minutes |

**Après un retour arrière Cloudflare, il faut corriger `main`** (annulation par pull request) : la prochaine publication du client republierait sinon la version fautive.

Une restauration ne supprime jamais l'historique : toutes les versions restent dans GitHub (commits) et dans Cloudflare (versions du Worker).

## Prévenir les incidents

- Rappeler au client les trois règles du guide utilisateur, en particulier : **une modification à la fois**, publiée et vérifiée avant la suivante.
- Surveiller les brouillons anciens : `gh pr list -R <dépôt> --search "head:cms/"`. Un brouillon ouvert depuis longtemps finit en `BEHIND` ou en conflit.
- Noter la date d'expiration du jeton Cloudflare et le renouveler avant échéance.
