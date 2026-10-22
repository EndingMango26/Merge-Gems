# Vérification navigateur reproductible

Le script `scripts/browser-check.py` teste le site compilé sous `/Merge-Gems/` et lance puis arrête son propre serveur d'aperçu. Il n'ajoute aucun point d'accès de débogage au jeu. Les cas nécessitant une progression avancée injectent, avant le premier chargement, une sauvegarde de test conforme au format public.

```sh
npm ci
npm run build
python3 -m pip install -r requirements-browser.txt
python3 -m playwright install --with-deps chromium webkit
python3 scripts/browser-check.py
```

Les dépendances Python et les navigateurs servent uniquement aux tests. Ils ne sont pas téléchargés par les joueurs et ne figurent pas dans le site publié. Si Chromium est déjà installé, le script peut utiliser son exécutable système. `--browser chromium` ou `--browser webkit` limite la vérification à un moteur. Le port par défaut est `4173` ; `MERGE_GEMS_TEST_PORT` permet de le changer.

Des exécutables configurés peuvent être sélectionnés avec `MERGE_GEMS_CHROMIUM_PATH` et `MERGE_GEMS_WEBKIT_PATH`. Le script respecte `PLAYWRIGHT_BROWSERS_PATH` et `LD_LIBRARY_PATH`. Dans l'environnement cloud de développement de cette session, les binaires WebKit et leurs bibliothèques absentes ont été téléchargés et extraits sous `/tmp`, sans installation système. Les chemins temporaires sont reconnus comme solution locale de secours ; ils ne sont pas des dépendances du jeu.

## Couverture

- Nouvelle partie, accélération du générateur, ouverture de caisse, fusion par glisser-déposer, découverte et achat refusé sans monnaie suffisante.
- Achat réussi et augmentation du compteur d'achats, rechargement, téléchargement réel du JSON, import invalide, refus d'import, import confirmé et refus de réinitialisation.
- Annulation de pointeur, lâcher hors plateau, fusion sur une caisse refusée, conservation des gemmes, progression avec déblocage de case, seconde fenêtre en lecture seule et reprise après fermeture de la première.
- Échec d'écriture simulé : réinitialisation, import et restauration d'une sauvegarde précédente conservent les données courantes ; perte de session pendant la lecture d'un fichier refusée avant remplacement.
- Installation du service worker, manifeste et icônes sous le bon préfixe, rechargement sans serveur disponible, conservation de la sauvegarde et changement de langue hors connexion.
- Appuis tactiles sur générateur et caisses. Chromium vérifie également un vrai parcours de toucher via le protocole d'entrée du navigateur ; WebKit utilise les appuis tactiles de Playwright et la fusion par deux appuis.
- Dimensions `320×568`, `375×667`, `390×844` et `430×932`, en français et en anglais : absence de débordement de la page, boutons principaux dans l'écran et captures du plateau et des paramètres.
- États de comparaison en anglais : Gemland niveau 6 et Moonland niveau 2 au ratio `360×640`, d'après les captures du portfolio répertoriées dans l'analyse de référence. Le cadeau aléatoire de la capture Gemland est laissé vide : ce système n'est pas reproduit avec une probabilité inventée.

- Menu triche : désactivation initiale sur anciennes sauvegardes, activation dans les réglages, position du bouton en haut à gauche, conservation au rechargement et export/import, ajout de monnaie et de gemme, niveau, déblocage et changement de terres, traduction FR/EN et masquage sans perte des changements.

- Générateur avec horloge contrôlée :10s et20s, compteur et jauge sur plateau plein, état prêt, fusion libérant une case, aucun stock illimité, appui, échéance exacte et rechargement sans double livraison.

## Résultats et limites

Le résultat du dernier lancement est écrit dans `test-results/browser-report.json`, avec les versions des navigateurs, chaque scénario et son statut. Les captures, JSON exportés et diagnostics d'échec sont conservés dans `test-results/`, ignoré par Git. Un scénario en échec ou un navigateur indisponible fait terminer le script avec un code non nul.

Le mode hors connexion de Playwright Chromium est utilisé directement. Dans le WebKit WPE de cet environnement, `context.set_offline(True)` provoque une erreur interne de navigation avant de consulter le service worker. Le test WebKit utilise donc un serveur HTTP local temporaire, attend l'installation complète du cache, arrête réellement ce serveur, puis recharge. Cette méthode vérifie que le jeu se recharge avec son origine réseau indisponible ; elle ne transforme pas WPE en Safari iOS.

Une erreur constatée pendant les vérifications a été corrigée : les réponses de Vite portent `Vary: Origin`, ce qui empêchait le cache de retrouver les scripts et styles chargés avec `crossorigin`. Le service worker ignore cette variation pour les ressources statiques locales précachées. L'empreinte de cache inclut le générateur afin qu'une correction du worker utilise elle aussi un nouveau cache.

Ces tests ne constituent pas une validation sur un véritable iPhone. L'installation depuis Safari, les zones de sécurité matérielles, le sélecteur Fichiers et la conservation effective du stockage par iOS doivent encore être vérifiés sur l'appareil. Les tests internes ne prouvent pas que les valeurs provisoires correspondent à l'économie historique.
