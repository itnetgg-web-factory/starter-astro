// Démarrage de Decap CMS. La configuration de config.yml est complétée ici :
// l'authentification GitHub passe par le Worker du site lui-même (routes /oauth/*),
// quelle que soit l'adresse (wrangler dev en local, workers.dev, domaine du client).
window.CMS.init({
  config: {
    backend: {
      base_url: window.location.origin,
    },
  },
});
