# Publier et jouer sur iPhone

## GitHub Pages

Les fichiers sont préparés pour `https://EndingMango26.github.io/Merge-Gems/`.
Cette adresse est une cible ; la présence de ce guide ne prouve pas la publication.

1. Ouvrir [la proposition de revue nº1](https://github.com/EndingMango26/Merge-Gems/pull/1). Elle est en brouillon car la fidélité reste incomplète. Pour publier cette version jouable provisoire après examen, utiliser **Ready for review**, puis **Merge pull request**, afin d’intégrer la branche dans `main`. Le workflow doit être sur la branche par défaut pour apparaître dans Actions.
2. Dans le dépôt GitHub, ouvrir **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Ouvrir **Actions → Publish GitHub Pages manually → Run workflow**, choisir `main`, puis lancer.
4. Attendre le succès des deux étapes `build` et `deploy`. Ouvrir l'URL indiquée par l'environnement `github-pages` et vérifier que le jeu charge ses images et démarre.

Le workflow de vérification compile et teste les changements ; il ne publie pas le site. Le workflow Pages est uniquement manuel. Si GitHub refuse la création des workflows, ajouter les deux fichiers de `.github/workflows/` depuis l'interface web après avoir récupéré la branche. Aucun jeton n'a à être ajouté au jeu.

Alternative locale : exécuter `npm ci`, `npm test`, puis `npm run build`. Le dossier `dist/` contient le site statique complet, prêt à être publié sous `/Merge-Gems/`.

## Écran d'accueil de l'iPhone

1. Ouvrir l'URL publiée dans **Safari** et attendre le chargement complet du jeu et de son cache hors connexion.
2. Toucher **Partager → Sur l'écran d'accueil**, puis **Ajouter**. Ouvrir ensuite le jeu depuis sa nouvelle icône.
3. Pour vérifier le mode hors connexion, ouvrir une première fois l'application installée avec le réseau, attendre son chargement, la fermer, puis la rouvrir en mode avion.

L'installation ajoute une icône et une fenêtre dédiée. Elle ne garantit pas la conservation des données si iOS purge le stockage, si le site est effacé ou si le contexte du navigateur change. Safari, l'application installée et un ordinateur peuvent avoir des sauvegardes différentes. Il n'existe aucune synchronisation automatique.

## Sauvegarder et restaurer

Dans les paramètres, choisir **Exporter la sauvegarde**. Sur iPhone, conserver le fichier JSON dans **Fichiers**, éventuellement via la feuille de partage Safari. Vérifier que le fichier apparaît dans le dossier choisi.

Pour restaurer, ouvrir les paramètres du jeu dans le contexte souhaité, choisir **Importer une sauvegarde**, puis sélectionner le JSON dans Fichiers. Le jeu valide le contenu et demande confirmation avant remplacement. Un fichier refusé ne doit pas remplacer la partie en cours. Exporter la partie actuelle avant toute restauration est conseillé.

## Mises à jour et absence

La première visite nécessite le réseau. Après mise en cache, les ressources sont locales. Une nouvelle version du service worker attend l'acceptation de la mise à jour ou la fermeture des anciennes fenêtres ; elle ne supprime pas les sauvegardes. Les anciens caches de ressources sont conservés pour permettre aux fenêtres déjà ouvertes de terminer avec leur version.

iOS suspend le jeu lorsqu'il passe en arrière-plan. Le moteur calcule les revenus au retour depuis les horodatages sauvegardés ; il ne continue pas à tourner en permanence.

# Publish and install on iPhone

After merging the reconstruction branch into `main`, select **Settings → Pages → GitHub Actions**, then run **Actions → Publish GitHub Pages manually**. Wait for `build` and `deploy` to succeed and verify the deployment URL. No deployment is triggered automatically by a push.

Open the published URL in Safari, let the game finish loading, then use **Share → Add to Home Screen → Add**. Open the installed app once with a network connection before testing airplane mode.

Use **Settings → Export save** to keep a JSON copy in Files. Use **Import save** to select that copy and confirm replacement. Saves are local to the device and browser context; Safari, the installed app and a computer do not automatically synchronize. Keep an export before clearing browser data or changing devices.
