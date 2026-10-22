# Vérification ciblée du générateur de caisses — 22 octobre 2026

Recherche en lecture seule, suivie du correctif décrit en fin de document. 5 recherches Exa, 32 résultats demandés (pas 32 sources indépendantes). Sources lues et planches d’images réellement inspectées ; aucun nouveau fichier d’application obtenu. Les fichiers temporaires mentionnés ci-dessous restent hors du dépôt et ne sont pas nécessaires au jeu.

## Valeurs numériques

| Valeur | Source et texte exploité | Statut |
|---|---|---|
| Gemland10secondes | https://merge-gems.fandom.com/wiki/Gemland : «crate drop rate of10seconds», upgrade «2.5seconds» | Confirmé dans une source secondaire non datée ; build et nature d’achat de l’upgrade inconnues |
| Moonland20secondes | https://merge-gems.fandom.com/wiki/Moonland : «one box per20seconds» | Confirmé secondaire non daté |
| Réduction5secondes/appui | https://merge-gems.fandom.com/wiki/Gems : «Tapping the free box, which will lower the wait by5second for every tap» | Confirmé dans le texte secondaire seulement ; aucune observation indépendante du delta exact ; ne pas transformer une supposition0.5s/1s en valeur originale |
| Accélération par appui | https://www.gram.gs/game-detail-merge-gems.html : «the faster you tap ... the faster the gems will appear» ; PDF lancement4avril2018 même principe | Confirmé officiel, aucune quantité chiffrée |
| Publicité Moonland | https://www.levelwinner.com/merge-gems-beginners-guide-cheats-tips-tricks-grow-your-gem-collection/ (12juin2018) et https://writerparty.com/party/merge-gems-top-tips-walkthrough-cheats-and-strategy-guide/ (7juin2018) : vidéo double vitesse de drop | Confirmé guides ; offre à laisser retirée, ne pas appliquer un×2gratuit |

Le guide japonais https://xn--cck6a8iub0ex421auct3r3anj4c.com/merge-gems (3octobre2018) dit qu’une jauge du carton se remplit et que les appuis la remplissent plus vite. Aucun chiffre supplémentaire trouvé. Les cinq recherches ne révèlent aucune source indépendante confirmant un autre délai de base ou un autre delta d’appui.

## Observations directes du trailer officiel

Source : https://www.gram.gs/assets/GramGames_PressKit.zip , membre `Press Kit/MergeGems!_TrailerVideo.mp4`, SHA2564fcdf16c9f64deff04d4fa9f97b0af1692a615b0ff26c46104990b01c65490d9. Profil de chaîne courte distinct du catalogue étendu retenu. Les observations graphiques se transfèrent avec cette qualification ; elles ne confirment pas un numéro de build.

1. Contact sheet `/workspace/scratch/trailer-seq-0.jpg` effectivement ouverte : plateau plein6cases dès0.25s (5caisses+Silver). Le badge du générateur continue9→8→7→6→5. La fusion commence vers3s et libère une case. **FULL immédiat dès occupation de toutes les cases contredit cette séquence.**
2. Extractions FFmpeg4images/s de18à24.75s, crops bas gauche, contact sheet `/workspace/scratch/timer-evidence/left-counter-sheet.jpg` effectivement ouverte : badge9à18.25/18.50s,8à18.75–19.50s,7à19.75–20.50s,6à20.75–21.50s,5à21.75–22.50s. Pas d’appui sur le générateur visible sur cette séquence. Le décompte descend d’environ1unité par seconde de fichier ici.
3. **Feedback visuel manquant avant ce correctif** : la caisse brune à l’intérieur de la silhouette pointillée se remplit progressivement depuis le bas : presque vide à9, environ à moitié remplie à5. L’image pleine constante de notre ancien générateur ne reflétait pas la progression du temps.
4. La capture designer Moonland (`designer-2.jpg`) montre FULL dans la grande silhouette du générateur, sans compteur visible. Cela confirme l’existence de cet état, pas sa condition exacte à elle seule.
5. À17.75s le trailer montre badge9 sous boutique ; à18s une transition superpose FULL à une autre scène. Il s’agit d’une coupe/fondu de montage : **ne pas en déduire9→0en0.25seconde, ni FULL immédiat à cet instant**.

## Inconnus

Aucun passage continu inspecté ne montre à la fois expiration0sur plateau plein, attente FULL, libération de case et apparition immédiate de la caisse. Une seule caisse prête conservée est une déduction d’implémentation plausible, pas une règle directement filmée dans ce corpus. Le comportement des appuis sur un plateau plein, l’alignement de phase après blocage, le plafond de caisses en absence, le délai Aztec et la règle d’arrondi du badge restent inconnus.

Le montage utilise des coupes et phases accélérées. Le passage18.25–22.5s est compatible avec une seconde réelle par unité mais ne montre pas un cycle complet10→0→10. Ne pas annoncer une mesure expérimentale du délai de base10s sur ce seul extrait.

## Correction retenue

Corriger les incohérences observables sans inventer une nouvelle durée : garder le badge numérique lorsque le plateau devient plein tant que le délai n’a pas expiré ; reproduire le remplissage visuel. Si le moteur conserve une caisse prête puis la sert à la libération d’une case, documenter cette reprise comme déduite/provisoire. Garder10s/20s et5s/appui qualifiés secondaires tant que l’utilisateur ou une nouvelle référence exploitable n’établit pas l’écart exact de délai.

Le moteur conserve une caisse prête à zéro : ce choix de reprise est déduit/provisoire. La libération d’une case par fusion déclenche sa livraison et démarre un nouveau cycle, sans stock illimité de caisses. Les appuis sur plateau plein restent ignorés faute de preuve suffisante d’un autre comportement. Le compteur tient compte de l’horloge déjà réglée pour ne pas remonter artificiellement lorsque l’heure de l’appareil recule. Le dessin est une silhouette avec remplissage du bas vers le haut ; le badge est détaché de la zone de découpe et les nombres à deux chiffres restent lisibles.
