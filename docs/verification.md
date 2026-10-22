# Vérifications exécutées — 22 octobre 2026

## Résultat

`npm test` : **46 tests réussis**, 24 moteur et 22 stockage. `npm run build` : TypeScript et Vite réussis. Les dépendances applicatives sont verrouillées dans `package-lock.json` ; les outils Python optionnels dans `requirements-browser.txt`.

`python3 scripts/browser-check.py` : **16 scénarios réussis**, huit dans Chromium154.0.8037.57 et huit dans WebKit26.5. Le rapport brut est conservé dans [validation/browser-report.json](validation/browser-report.json). Ces tests ont été exécutés sur le build de cache `913f5843821af8731d3c`, sous le préfixe `/Merge-Gems/`.

**Aucun véritable iPhone n’a été testé.** WebKit WPE et l’émulation tactile ne prouvent ni l’installation Safari réelle, ni le sélecteur Fichiers d’iOS, ni la rétention des données par iOS.

## Moteur et sauvegardes

Les tests avec horloge contrôlée vérifient : fusions valides/refusées, déplacement sans duplication, dernier rang préservé, plateau plein, génération et réduction du délai, achat impossible/sans fonds, hausse des prix et exception Silver, grandes valeurs, XP/déblocages, revenus de plusieurs terres, absence d’une heure, absence de double crédit, horloge reculée et indépendance du nombre d’appels par seconde.

Les sauvegardes couvrent validation structurelle et bornes, import/export, migration v1→v2 du format de cette reconstruction, refus des JSON invalides, échec/quota de stockage, sauvegarde précédente, principale absente ou corrompue, conflit de révision, concurrence Web Locks et repli par bail. La migration ne prétend pas importer une sauvegarde du jeu mobile original.

## Parcours navigateur

Nouvelle partie, génération, ouverture, glisser-déposer, découverte, achat refusé et achat réussi, progression, rechargement, français/anglais, téléchargement réel d’un export, import refusé/accepté/invalide et confirmation de nouvelle partie.

Les gestes annulés, les lâchers hors plateau et les fusions impossibles conservent les gemmes. Une deuxième fenêtre reste en lecture seule puis reprend après fermeture de la première. Les échecs de stockage simulés pendant import, réinitialisation et restauration ne remplacent pas la partie ; une perte de session pendant la lecture du fichier refuse son import.

Des appuis tactiles et un glissement tactile sont injectés dans Chromium. WebKit couvre les appuis tactiles et la fusion par deux appuis, ainsi que le glisser-déposer souris. Les paramètres et le plateau sont capturés en français et anglais à320×568,375×667,390×844,430×932 ; aucun débordement de page ou bouton principal hors écran constaté.

## Hors connexion et mises à jour

Chromium recharge en mode réseau désactivé après mise en cache. Dans le WebKit de cet environnement, le mode hors connexion de Playwright provoque une erreur interne avant consultation du service worker : le test arrête donc réellement un serveur HTTP temporaire, puis recharge entièrement depuis le cache. Dans les deux cas, sauvegarde, interface et changement de langue restent disponibles.

Le manifeste, les icônes, le shell, la police et les scripts/styles sont vérifiés sous `/Merge-Gems/`. Une erreur initiale a été corrigée : `Vary: Origin` empêchait la récupération des scripts/styles du cache. `ignoreVary` est limité aux ressources statiques locales précachées.

Le générateur de service worker a aussi été vérifié sur une fixture : empreinte déterministe, invalidation après changement, liste des fichiers complète, nouvelle version en attente, acceptation explicite, recharge du nouveau shell et sauvegarde locale préservée. Les anciens caches sont conservés pour les fenêtres encore ouvertes. Le script de cache ne touche pas au stockage des parties.

## Comparaison visuelle réellement effectuée

Les captures originales du portfolio ont été ouvertes et comparées à des états équivalents, sans intégrer leurs pixels au dépôt :

- Gemland niveau6, XP138/210, 11cases, sept gemmes aux mêmes rangs et positions : **631,2/sec** obtenu, conforme à la source. La case cadeau est laissée vide ; les cadeaux restent inconnus. [Capture de notre jeu](screenshots/gemland-level6.png).
- Moonland niveau2, XP19/46, 7cases, gemme maximale Waterstone et voisinage doublé : **124,8/sec** obtenu, conforme à la source. [Capture de notre jeu](screenshots/moonland-level2.png).

Les caisses et gemmes étaient trop petites lors de la première comparaison : leurs tailles ont été corrigées. Le placement de l’étoile et des monnaies a été corrigé. Une capture WebKit a révélé du texte blanc dans un sélecteur natif clair : une apparence explicite le rend désormais lisible. Les gemmes, la texture du sol, la typographie, les ornements, l’espacement et les animations restent des redessins approximatifs, pas une validation au pixel.

Le trailer officiel a permis de préciser les silhouettes Stone/Ruby/Emerald, les panneaux et les feedbacks de fusion. Son profil économique court est incompatible avec la table étendue retenue ; les sources ne sont pas confondues. Voir [l’analyse du trailer](reference-video-analysis.md).

## Reproduire

```sh
npm ci
npm test
npm run build
python3 -m pip install -r requirements-browser.txt
python3 -m playwright install --with-deps chromium webkit
npm run test:e2e
```

[Détails des outils et du parcours navigateur](browser-verification.md). Les captures générées à chaque lancement restent dans `test-results/` (ignoré par Git). Les deux captures sélectionnées ci-dessus représentent notre jeu et sont conservées pour la revue.

Le script `scripts/fetch-reference-presskit.py` a été exécuté : tailles/CRC et SHA256 des trois références officielles correspondent au registre. Il refuse d’écrire dans le dépôt. Aucun original propriétaire n’entre dans le build. Les tests internes n’établissent pas les valeurs historiques encore provisoires.
