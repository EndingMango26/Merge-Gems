# Suivi de reconstruction

Travail du 22 octobre 2026. **Reconstruction jouable, fidélité incomplète.** Ce suivi est destiné à permettre une reprise sans recommencer la recherche.

## Inspection initiale

Le dépôt a été cloné à `7501864` depuis `EndingMango26/Merge-Gems`. Branche initiale `main`, seul fichier suivi `README.md`, trois commits existants, aucune modification locale, aucun `AGENTS.md` trouvé dans le dépôt ou ses parents accessibles. Aucun travail existant n’a été supprimé. Branche de travail : `reconstruction/merge-gems-reference`.

Terminal Bash, Git, Node24.19.0, npm11.9.0, Python3/Playwright et Chromium système disponibles. Recherche Exa et connecteur GitHub disponibles ; accès réseau explicite requis par les commandes réseau du bac à sable. Le clone, les commits et les pushes ont réellement réussi. Les secrets n’ont pas été copiés dans le projet.

## Terminé dans cette itération

- Recherche officielle, guides contemporains, wiki et quatre captures du designer ; registre de preuve et contradictions conservés. Trailer officiel récupéré depuis le kit presse et inspecté par images successives ; son profil court est distinct de la table étendue.
- Moteur déterministe à horodatages, fusions, caisses, achats, revenus, XP et trois terres ; catalogue de39rangs.
- Économie entière en millièmes, division et restes, exception Silver, prix par rang centralisés.
- Interface tactile et souris, annulation sans perte, alternative en deux appuis, découverte, boutique et collection.
- Redessins SVG, icônes locales et police libre accompagnée de sa licence.
- Sauvegardes validées/versionnées, migration v1 documentée, copie précédente, import/export avec confirmation et erreurs visibles.
- Session exclusive entre fenêtres ; calcul de reprise après suspension, sans boucle supposée active en arrière-plan.
- Français/anglais, paramètre audio facultatif ; sons synthétiques de remplacement seulement.
- Manifeste, zones sûres, cache hors connexion versionné et mise à jour explicite.
- Compilation statique sous `/Merge-Gems/`, CI et workflow Pages manuel, guides d’installation/restauration.

## Fidélité encore ouverte

| Priorité | À établir ou compléter | Prochaine action concrète |
|---|---|---|
| 1 | Version de référence précise | Comparer le kit presse officiel (chaîne courte) et le corpus designer/wiki (chaîne étendue). Retrouver build/date, sans fusionner leurs économies. |
| 1 | XP par rang, seuils et ordre des cases | Obtenir une partie continue de la version étendue montrant chaque fusion et déblocage. Remplacer les paramètres provisoires avec provenance. |
| 1 | Déblocage Aztec et lianes | Relever condition d’accès, cadence des lianes et effets ; lianes actuellement absentes. |
| 1 | Cadeaux gratuits et succès | Relever probabilités, seuils et récompenses. Aucun remplacement arbitraire n’est accordé. |
| 2 | Revenus et caisses pendant absence | Mesurer plafond, taux et événements dans une version identifiée. Traitement actuel détaillé provisoire. |
| 2 | Catalogue visuel tardif | Captures nettes de chaque rang et de toutes les gemmes Aztec. De nombreux dessins sont encore provisoires. |
| 2 | Son et animations | Observer/écouter les ressources originales accessibles ; ne pas annoncer de fidélité aux bips substitués. |
| 2 | Boutique et menus | Continuer la comparaison avec le trailer en tenant compte de sa version économique différente. Menu de paramètres web spécifique. |
| 3 | Validation appareil | Tester sur un véritable iPhone : installation, Fichiers, import/export, mode avion, verrouillage/reprise et geste avec plusieurs doigts. |

Les publicités et paiements réels restent exclus par décision utilisateur. La boutique en monnaie du jeu reste présente. Les offres monétisées ne deviennent pas des bonus gratuits.

## Enregistrement et publication

- `37ac40e` : preuves et limites, commit local et push vérifiés.
- `71a0a23` : moteur, interface, sauvegardes et PWA, commit local et push vérifiés.
- CI GitHub sur `71a0a23` : succès, https://github.com/EndingMango26/Merge-Gems/actions/runs/39779797009.
- Les commits de vérification et améliorations ultérieurs sont indiqués dans l’historique de la branche. Dernière validation locale :46tests unitaires et16scénarios Chromium/WebKit réussis ; détails dans `verification.md`.
- Aucun merge dans `main`, aucune activation Pages et aucune publication effectués par l’agent.

La cible `https://EndingMango26.github.io/Merge-Gems/` ne doit pas être présentée comme publiée avant un déploiement réussi et une vérification de l’URL. L’utilisateur activera Pages lui-même. Voir `install-iphone.md`.

## Reprendre

Lire d’abord `reference-analysis.md`, `src/data/rules.ts`, `asset-inventory.md` et `verification.md`. Lancer `npm ci`, `npm test`, `npm run build`, puis le parcours navigateur. Toute nouvelle valeur doit porter sa source et son statut ; un test interne vert ne confirme pas sa fidélité historique.
