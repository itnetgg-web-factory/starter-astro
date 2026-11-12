// Accès aux contenus : documents uniques obligatoires, listes publiées et triées.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

/** Réglages du site (src/content/reglages/site.yaml). Le build échoue si le fichier manque. */
export async function getSettings() {
  const entry = await getEntry('reglages', 'site');
  if (!entry) throw new Error('Contenu manquant : src/content/reglages/site.yaml');
  return entry.data;
}

/** Page d'accueil (src/content/accueil/accueil.yaml). Le build échoue si le fichier manque. */
export async function getHome() {
  const entry = await getEntry('accueil', 'accueil');
  if (!entry) throw new Error('Contenu manquant : src/content/accueil/accueil.yaml');
  return entry.data;
}

type ListCollection = 'prestations' | 'formules' | 'temoignages';

/** Éléments publiés d'une liste, triés par `order` puis par identifiant. */
export async function getPublished<C extends ListCollection>(collection: C): Promise<CollectionEntry<C>['data'][]> {
  const entries = await getCollection(collection, ({ data }) => data.published);
  return entries
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id))
    .map((entry) => entry.data);
}
