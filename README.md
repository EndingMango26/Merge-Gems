# Merge Gems! — reconstruction web

Version jouable indépendante pour Safari sur iPhone, en français et en anglais. Sans serveur, compte, publicité, paiement réel ou suivi. Sauvegarde locale et installation hors connexion.

**Ce n’est pas encore une reproduction exacte ni complète.** Les captures et sources retrouvées établissent une partie de l’interface et de l’économie ; l’XP complète, certains déblocages, les cadeaux, les succès, les lianes aztèques et de nombreuses ressources restent inconnus ou provisoires. Voir [l’analyse des références](docs/reference-analysis.md), [l’inventaire des ressources](docs/asset-inventory.md) et [le suivi](docs/project-status.md).

Merge Gems! et les créations originales appartiennent à leurs ayants droit Gram Games/Zynga. Ce projet n’est pas affilié à ces sociétés. Les ressources du jeu mobile et les captures propriétaires ne sont pas distribuées dans l’application.

## Développement

Node.js 22.12+ ou 24 recommandé.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

L’aperçu est disponible sur `http://localhost:4173/Merge-Gems/`. `dist/` contient l’application statique avec cache versionné, manifeste et icônes. Le service worker est activé uniquement sur le build de production. `npm run test:e2e` demande Python3, Playwright Python et les navigateurs décrits dans [la vérification](docs/verification.md).

## Jouer sur iPhone

La cible prévue est **https://EndingMango26.github.io/Merge-Gems/**. Cette adresse ne constitue pas une preuve de publication.

1. Intégrer la branche de reconstruction après revue.
2. Dans GitHub, **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Dans **Actions → Publish GitHub Pages manually → Run workflow**, sélectionner la branche intégrée et lancer.
4. Attendre le succès du déploiement puis vérifier l’URL.
5. Ouvrir dans Safari, attendre le chargement complet, puis **Partager → Sur l’écran d’accueil**.

Le workflow de publication n’est déclenché que manuellement. [Guide iPhone et Pages](docs/install-iphone.md).

## Partie et sauvegarde

Appuyer sur le générateur accélère les caisses. Toucher une caisse l’ouvre. Glisser une gemme sur une gemme identique les fusionne ; deux appuis successifs sur les cases fonctionnent aussi. La boutique utilise les pièces produites par les gemmes. Les terres possèdent des monnaies distinctes.

Dans **Paramètres**, changer la langue, exporter un JSON dans Fichiers ou importer une partie. Un import ou une nouvelle partie exige une confirmation. Un fichier invalide ne remplace pas la partie. Une erreur de stockage est signalée et ne crée jamais silencieusement une nouvelle sauvegarde. Exportez régulièrement : Safari, l’application installée et un ordinateur ne sont pas synchronisés.

## Documentation

- [Sources, preuves, inconnues et paramètres provisoires](docs/reference-analysis.md)
- [Architecture, économie et horodatages](docs/architecture.md)
- [Ressources et droits](docs/asset-inventory.md)
- [Tests réellement exécutés](docs/verification.md)
- [Travail terminé et prochaines actions](docs/project-status.md)
