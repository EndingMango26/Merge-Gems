# Recherche ciblée : effet d’un appui sur le générateur

22 octobre 2026. Recherche en lecture seule, aucun changement du code par cet agent.

## Résultat

Aucune source indépendante chiffrée retrouvée pour la réduction exacte par appui. Les recherches « 0.5 », « .5 », « one second », « seconds », « tap » et la recherche japonaise ne confirment ni 0,5 s ni 1 s ni un autre nombre. Elles ne prouvent pas non plus une multiplication temporaire de vitesse. Ne pas présenter l’une de ces options comme originale.

Le témoignage utilisateur du 22 octobre 2026 contredit explicitement l’ancien choix de −5 s. Cette contradiction rend la valeur inadaptée à la version qu’il souhaite retrouver ; elle ne fournit pas à elle seule la nouvelle quantité.

## Sources relues

- https://gram.gs/game-detail-merge-gems.html — primaire, existence de l’accélération par appuis ; aucun delta chiffré.
- https://www.gram.gs/assets/pdf/GramGames_MergeGems!_PressRelease.pdf — primaire, lancement 4 avril 2018 ; même affirmation qualitative.
- https://www.levelwinner.com/merge-gems-beginners-guide-cheats-tips-tricks-grow-your-gem-collection/ — guide 12 juin 2018 ; appuis rapides / plusieurs doigts, aucune durée gagnée par appui.
- https://writerparty.com/party/merge-gems-top-tips-walkthrough-cheats-and-strategy-guide/ — guide 7 juin 2018 ; appuis rapides, aucune durée gagnée par appui.
- https://xn--cck6a8iub0ex421auct3r3anj4c.com/merge-gems — 3/4 octobre 2018 ; décrit une jauge remplie plus vite par les appuis, sans nombre.
- https://merge-gems.fandom.com/wiki/Gems — extraction Exa maintient littéralement « 5 second ». Source secondaire non datée, non corroborée et contredite par utilisateur. L’hypothèse d’un point décimal perdu devant 5 n’est PAS établie. Les URLs publiques `?action=raw`, `?so=search` et API parse/wikitext sont inaccessibles dans l’outil web ; ne pas prétendre avoir inspecté le wikitexte original.
- https://gamematch3.com/app/merge_gems.html — agrégateur décrit approximativement un cycle dix secondes mais pas l’effet chiffré d’un appui. Ne résout pas le problème.

## Vidéos

La recherche de miroirs retourne surtout https://www.youtube.com/watch?v=XLZ8u7AUvL4 (Cipher, 22 octobre 2018) et https://www.youtube.com/watch?v=vqpqjU-48sA (9 juillet 2021). Aucune lecture de leur flux par cet agent. Ne pas présenter leur contenu comme observé. Les limitations d’accès aux vidéos YouTube sont déjà documentées dans `docs/reference-video-analysis.md`.

Le trailer officiel a également été réinspecté : voir la section suivante. Aucun nouvel extrait ne permet de mesurer l’appui.

## Statuts proposés

- Accélération par appui : confirmé primaire.
- −5 s/appui dans la version recherchée : réfuté par le témoignage utilisateur, ancien texte secondaire conservable uniquement comme contradiction historique.
- Quantité ou modèle exact : inconnu tant qu’un passage exploitable ou une précision utilisateur ne l’établit pas.
- Toute quantité choisie en attendant : provisoire, à centraliser et documenter explicitement, sans revendiquer une reproduction exacte.

## Nouvelle inspection du trailer officiel

Source : archive officielle https://www.gram.gs/assets/GramGames_PressKit.zip, entrée Press Kit/MergeGems!_TrailerVideo.mp4. Fichier local vérifié antérieurement SHA256 4fcdf16c9f64deff04d4fa9f97b0af1692a615b0ff26c46104990b01c65490d9. 25 s, 25 fps, 1920×1080.

### Inspection effectivement réalisée

- FFmpeg : planche globale 0–24,5 s, 2 images/s, /workspace/scratch/tap-video/full-sheet.jpg ; ouverte avec view_image.
- FFmpeg : détail du plateau gauche 21,5–22,9 s, 10 images/s, /workspace/scratch/tap-video/end-detail.jpg ; ouvert avec view_image.
- Les gestes promotionnels observés visent caisses, gemmes, boutons de découverte/niveau et achats de la boutique. Aucun appui sur le générateur n’est visible sur ces images. La séquence fine finale montre la main fusionner les Sapphire puis les Rare Sapphire, loin du générateur ; le badge passe passivement de 6 à 5.

### Conclusion et limite

Aucun delta par appui n’est mesurable dans les images inspectées. Le trailer ne valide donc ni −5 s, ni −0,5 s, ni −1 s. La planche globale est un échantillonnage, pas une lecture de tous les 625 frames : on ne prétend pas démontrer qu’aucune image du fichier contient un appui furtif. Le mouvement visible de la main et l’absence de cycle tapé identifiable rendent ce fichier insuffisant pour étalonner la règle demandée.

L’observation utilisateur contredit l’actuel −5 s pour la version souhaitée. Ce paramètre ne doit plus être présenté comme fidèle à sa version. Toute nouvelle quantité faute de vidéo/appui mesuré doit porter le statut provisoire.

## État de la correction

Branche `fix/generator-tap-acceleration`, base `cf38b00` (PR 3 fusionnée). Aucune valeur de remplacement appliquée : la valeur exacte ou le modèle d’accélération restent à établir. Le code actuel contient encore `tapReductionMs: 5000` ; ce comportement est désormais connu comme incompatible avec le retour utilisateur. Une question sur l’effet concret d’un appui a été posée. Ne pas annoncer le problème résolu ni publier cette branche comme correctif de gameplay.
