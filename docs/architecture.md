# Architecture et contraintes

## Choix technique

Le jeu est une application statique TypeScript sans framework d'interface, compilée par Vite. Le plateau comporte peu d'éléments et ne nécessite pas de moteur 3D ni de serveur. TypeScript vérifie les frontières entre logique, sauvegarde et affichage ; Vite produit les fichiers statiques et leurs chemins sous `/Merge-Gems/`. Les dépendances de développement sont verrouillées dans `package-lock.json`.

- `src/game/` : état sérialisable, règles et opérations déterministes. L'horloge est fournie explicitement aux opérations.
- `src/data/` : paramètres et données économiques, avec provenance et statut des valeurs.
- `src/storage/` : validation, migration, sauvegarde précédente, import/export et coordination des fenêtres.
- Interface et traductions : projection de l'état et commandes vers le moteur. Les animations ne calculent pas les revenus.
- `public/assets/` : ressources locales, redessinées ou accompagnées d'une provenance documentée.

L'inventaire de référence distingue les faits observés, les déductions, les inconnues et les paramètres provisoires. La cohérence du moteur ne prouve pas la fidélité des paramètres à l'original.

## Économie et temps

La monnaie est conservée en millièmes entiers, calculés avec `BigInt` et sérialisés en chaînes décimales. L'affichage abrégé ne sert jamais de base aux achats. Les arrondis de présentation sont séparés des montants comptables. La règle d'arrondi historique, lorsqu'elle n'est pas établie, est signalée comme provisoire dans les données.

Les revenus sont intégrés depuis des horodatages, avec conservation des restes de division. Une reprise consomme la période écoulée une seule fois. Les actions qui modifient la production règlent d'abord la période précédente. Le moteur reçoit l'heure dans les tests ; les tests ne dépendent pas d'attentes réelles. Une horloge reculée ne produit pas de revenu négatif ni de période recréditée.

La sauvegarde ne suppose aucune exécution permanente en arrière-plan. La coordination des onglets vise à réserver les écritures à une seule session. Les limitations de la coordination de secours et les résultats des tests figurent dans le suivi de vérification.

## Installation et cache

`public/manifest.webmanifest` utilise des URL relatives pour l'icône et le point d'entrée. Après compilation, `scripts/build-sw.mjs` parcourt `dist/`, calcule une empreinte du contenu et génère `dist/sw.js`. Il précache tous les fichiers compilés ; un échec de téléchargement interrompt l'installation du nouveau cache.

Le service worker n'intercepte que les requêtes GET de la même origine sous `/Merge-Gems/`. Les navigations utilisent le shell de la version en cache, ce qui évite de mélanger du HTML récent avec des scripts plus anciens lors d'une coupure réseau. Il ne lit et n'efface aucune sauvegarde. Les anciennes ressources sont conservées pour les fenêtres encore ouvertes ; ce choix peut augmenter l'espace utilisé au fil des versions.

Une mise à jour attend par défaut. L'interface peut envoyer `{ type: 'SKIP_WAITING' }` au worker en attente après sauvegarde et acceptation explicite de l'utilisateur, puis recharger lors de `controllerchange`. Aucune activation forcée ne se produit pendant l'installation.

## Commandes

```sh
npm ci
npm test
npm run build
npm run preview
```

L'aperçu est accessible sous `/Merge-Gems/`. `npm run dev` sert le développement sans constituer une preuve d'installation hors connexion. Les vérifications navigateur et l'appareil réellement testé doivent être indiqués dans le rapport de tests ; Chromium ou WebKit ne prouvent pas une exécution sur un véritable iPhone.

## Limites techniques extrêmes

Les sauvegardes acceptent jusqu’à300chiffres par montant et4000achats par rang (limites techniques documentées, non des règles originales). Au-delà des suffixes attestés, l’affichage passe en notation scientifique à trois chiffres significatifs ; cette présentation est provisoire et les calculs conservent la valeur entière. Les règles d’XP non observées, le plafond24cases et les revenus d’absence restent explicitement provisoires dans `rules.ts`.
