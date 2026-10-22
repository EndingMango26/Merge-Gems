# Analyse des références de Merge Gems!

État de recherche : 22 octobre 2026. Il s’agit du jeu **Merge Gems! de Gram Games**, iOS `1302018227`, Android `com.gramgames.london.mergegems`, et non d’un homonyme.

## Statuts de preuve

- **Confirmé** : directement visible dans une capture inspectée, ou explicitement écrit dans une source lue. Une mention « confirmé secondaire » confirme ce que dit la page, pas une extraction du logiciel original.
- **Déduit** : calcul ou interprétation appuyé par des observations identifiées.
- **Inconnu** : preuve insuffisante ; ne pas annoncer une fidélité exacte.
- **Provisoire** : choix d’implémentation pour rendre la partie jouable ; ne prétend pas être une règle originale.

La cible de recherche est la période de lancement mondial d’avril 2018 et les guides de juin–octobre 2018. **Aucun numéro de build cohérent n’a pu être établi.** Le wiki n’est pas daté ; les captures du designer peuvent être promotionnelles. Leur rapprochement économique est explicite ci-dessous, pas une preuve de version unique.

## Décisions effectives de la reconstruction

| Élément | Implémentation et statut |
|---|---|
| Fusion et plateau | Deux gemmes identiques produisent le rang suivant ; trois colonnes. Confirmé officiel et visuel. |
| Catalogue | 39 rangs dans chacune des trois terres. Noms et tables W1 ; de nombreuses formes restent provisoires. |
| Monnaie | Montants W1 divisés par 2,5 secondes, déduit et corroboré par trois états chiffrés. Calculs entiers en millièmes. |
| Prix | W1 transcrit sans rééquilibrage, y compris prix du rang26 et exception Silver. Développer les montants abrégés en entiers et arrondir au millième est provisoire ; 1.73k ne prouve pas 1730 exact. |
| Initialisation | Six cases, deux pierres et une caisse ; zéro monnaie ; tutoriel en trois actions : **provisoire**, nouvelle partie originale non observée. |
| XP | Quantité par fusion = rang obtenu (index zéro), **provisoire**. Seuils des niveaux2/6/8 =46/210/354 observés ; autres seuils interpolés/extrapolés provisoires. Paramètres dans `src/data/rules.ts`. |
| Cases | Nombre = niveau+5, plafond24 : formule et plafond **provisoires** ; correspondent aux points observés7/11/13. Première case centrée lorsque nombre modulo3=1 ; forme correspondant aux captures2/4. |
| Générateur | Gemland10s, Moonland20s, -5s/appui : sources secondaires. Aztec20s **provisoire**. Aucune accélération de démonstration. |
| Moonland | Ouverture Gemland8 selon guides ; bonus3×3 ×2 incluant la plus haute gemme, déduit visuellement. En cas d’égalité la première case est retenue : **provisoire**. |
| Aztecland | Accès Gemland16 **provisoire** ; revenus rang8+ déduits ×5/4 ; lianes non implémentées faute de cadence établie. Ce monde n’est pas fidèle à ce stade. |
| Absence | Revenu au taux des gemmes présentes, illimité sans plafond ; caisses jusqu’au plateau plein, événements ultérieurs perdus. Tout ce traitement détaillé est **provisoire** : existence du revenu hors connexion attestée par guides, plafond et caisses non établis. |
| Geste invalide | Retour sans échange ni destruction ; dernier rang38 non fusionnable : **provisoire**. |
| Cadeaux et succès | Existence confirmée, probabilités/seuils/récompenses inconnus. Non implémentés. Le bouton médaille ouvre ici la collection consultable, différence explicite. Aucun bonus gratuit inventé. |
| Publicité et argent réel | Offres, ×2 publicitaire, roulette commerciale et sollicitations absents ; aucun SDK publicitaire/analytique. Boutique en pièces maintenue. |
| Graphismes | Redessins vectoriels indépendants. Catalogue partiellement provisoire ; aucune redistribution des captures ou ressources de l’application. |
| Animations et sons | Feedbacks visuels d’après images successives du trailer officiel (profil court) ; durée/interpolation provisoires. Bips synthétiques optionnels désactivés par défaut, aucune musique originale. |
| Menu triche facultatif | Ajout demandé par l’utilisateur le22octobre2026 : option dans les réglages, bouton en haut à gauche, ajout de pièces/gemmes/niveaux et déblocage des terres. Désactivé par défaut, conservé en sauvegarde ; cette fonction n’est pas attribuée à l’original. |
| Paramètres et langues | Menu web FR/EN, sauvegarde export/import et installation : adaptation pour Safari ; écran original des paramètres non retrouvé. |

Les règles normales permettent de jouer sans offre commerciale. Aucune source lue ne prouve un verrou payant obligatoire. Retirer les succès et cadeaux peut toutefois changer la vitesse de progression : cet écart reste ouvert, sans compensation économique inventée.

Les références lisibles et la transcription source sont conservées dans `src/data/rules.ts`. Les tests de cohérence ne changent jamais le statut de provenance d’une valeur.

## Limites des outils et des fichiers

Le terminal, Node/npm, Git et Chromium fonctionnent. Le réseau du terminal demande l’option réseau de l’environnement ; une première tentative de clone dans le bac à sable a échoué sur le proxy, puis le clone autorisé a réussi. Le connecteur GitHub confirme un droit d’écriture, mais une publication n’est pas déduite de ce droit. Les résultats réels des opérations Git et navigateur figurent dans `project-status.md` et `verification.md`.

Aucun APK/IPA de provenance légitime exploitable n’a été obtenu. Aucun moteur original n’a donc été identifié, aucun code n’a été extrait, **REA n’a pas été installé**. https://github.com/morluto/rea est un outil potentiel pour un futur fichier vérifié, pas une source de Merge Gems!.

Un résultat Giga présenté comme un trailer a conduit à un MP4 public de 80secondes. Après extraction et inspection d’images, il s’agit de **The Elder Scrolls Online: Summerset** : source rejetée, aucune mécanique Merge Gems! n’en est tirée. Les résultats YouTube ne constituent pas des vidéos regardées. Le vrai trailer a ensuite été retrouvé dans le kit presse officiel : voir la section suivante.


## Mise à jour : kit presse officiel et deux profils incompatibles

L’archive publique https://www.gram.gs/assets/GramGames_PressKit.zip a livré une vidéo originale de25s, réellement inspectée par images successives extraites. Détails, SHA256, temps et observations : [analyse vidéo](reference-video-analysis.md). Le téléchargement standard par segments a validé CRC et tailles ; aucun fichier d’application ni REA utilisé. La vidéo, le logo et l’icône originaux restent hors des fichiers distribués, faute de licence de réutilisation dans ce jeu.

**Profil court du trailer** : Stone→Silver→Gold Bar→Double Gold→Sapphire, avec Silver1k/1.73k,GoldBar4.5k,DoubleGold12k,Sapphire35k ; XPniveau1/40,2/46,7/276. **Profil étendu retenu** : Stone→Silver→Great Silver→Gold Bar→Double Gold→Triple Gold→Sapphire, table39rangs et captures designer. Les noms associés aux prix/revenus sont décalés : ces profils ne sont pas fusionnés. Le seuil1=30 actuel et le seuil7=277 restent provisoires du profil étendu, pas des valeurs originales confirmées.

Des apparences communes par nom (Stone,Ruby,Emerald) et feedbacks visuels ont été précisés grâce au trailer : halo cyan des gemmes compatibles, flash de fusion/ouverture, étoileXP montant vers la barre, case apparaissant au déblocage, panneau boutique rose/liste claire/boutonsverts, découverte rubanrose/carteverte. Leur durée/interpolation restent des choix de reconstruction ; le montage promotionnel paraît accéléré. Les chiffres/rangs du profil court ne corrigent pas l’économie étendue. Aucun menu paramètres ou collection n’a été vu ; la collection consultable reste une adaptation web. La piste audio n’a pas pu être écoutée avec les outils disponibles.


---

# Recherche mécaniques et économie — Merge Gems! (Gram Games / Zynga)

Consultation : 22 octobre 2026. Recherche via Exa (160 résultats demandés, nombreux doublons/rejets) et lecture de pages via `web_fetch_exa`. Les captures du portfolio du designer ont été réellement ouvertes avec `view_image`. Aucune vidéo n'a été visionnée dans ce volet de recherche. Une tentative `curl` de la page japonaise a échoué (« Failed to connect to proxy port 8080 ») : le texte disponible a été lu via Exa, pas son HTML ni ses images.

## Identité et période

- **Confirmé, source officielle O1** : titre Merge Gems!, Gram Games, mécanique fusion d'objets identiques, boîtes, tap pour accélérer, monnaie passive, achat de gemmes avec cette monnaie, XP par fusion, augmentation d'espace aux niveaux supérieurs. URL : https://www.gram.gs/game-detail-merge-gems.html (également https://gram.gs/game-detail-merge-gems.html et https://gramgames.net/game-detail-merge-gems.html ; mêmes textes, pas trois confirmations indépendantes).
- **Confirmé, communiqué O2 daté 4 avril 2018** : lancement iOS/Android, cinquième titre Merge!, étoiles gagnées en fusion donnant de l'expérience, trois terres citées (Gem, Moon, Aztec). https://www.gram.gs/assets/pdf/GramGames_MergeGems!_PressRelease.pdf
- Période de travail raisonnable : lancement / guides avril-octobre 2018, avec données wiki non datées à valider. Aucun numéro de build 2018 établi. Ne pas prétendre qu'une table wiki non datée appartient assurément à la même build que les captures portfolio.
- Des catalogues IGDB dérivés (Kotaku, RomCrate) annoncent 10 janvier 2018, contre 4 avril 2018 dans communiqué officiel : possible prélancement, non établi. Le communiqué officiel prévaut pour le lancement mondial.
- Une page de hacks de novembre 2017 mentionne v1.1.0 et ID1302018227, mais distribution modifiée : exclue de la reconstruction et aucun fichier téléchargé. Ce résultat n'établit pas de version de référence sûre.
- ID Android corroboré catalogues : `com.gramgames.london.mergegems`. ID iOS :1302018227. Pas de ressources extraites d'un APK dans ce volet.

## Sources lues

| ID | URL | Nature et période | Utilité / limite |
|---|---|---|---|
| O1 | https://www.gram.gs/game-detail-merge-gems.html | Éditeur, non daté | Mécanique et présentation officielles |
| O2 | https://www.gram.gs/assets/pdf/GramGames_MergeGems!_PressRelease.pdf | Éditeur, 04/04/2018 | Lancement et trois terres |
| G1 | https://www.levelwinner.com/merge-gems-beginners-guide-cheats-tips-tricks-grow-your-gem-collection/ | Guide, Andy Dyson,12/06/2018 | Moon niveau8, pub, achievements |
| G2 | https://writerparty.com/party/merge-gems-top-tips-walkthrough-cheats-and-strategy-guide/ | Guide, Evan Heisenberg,07/06/2018 | Offline, Moon8 approximatif, boosts, pub |
| J1 | https://xn--cck6a8iub0ex421auct3r3anj4c.com/merge-gems | Guide japonais,03-04/10/2018 | Boîtes, XP fusion, boutique, cadeaux |
| J2 | https://xn--cck6a8iub0ex421auct3r3anj4c.com/merge-gems-ahievement | Guide japonais,04/10/2018 | Sept catégories et médailles achievements |
| J3 | https://xn--cck6a8iub0ex421auct3r3anj4c.com/merge-gems-earn-tips | Guide japonais,04/10/2018 | Prix croissants, offline dépend état départ |
| W1 | https://merge-gems.fandom.com/wiki/Gemland_Gems | Wiki secondaire, non daté, renvoie texte «Gems» | Table39rangs, prix, revenus, règles boutique |
| W2 | https://merge-gems.fandom.com/wiki/Moonland_Gems | Wiki secondaire, non daté | Revenus Moon avec format `amount / 2.5` |
| W3 | https://merge-gems.fandom.com/wiki/Gems | Wiki secondaire, non daté | Autre état indexé : tap-5s, cadeau3h, Goldland cité |
| W4 | https://merge-gems.fandom.com/wiki/Gemland | Wiki secondaire, non daté | Caisse10s, upgrade2.5s |
| W5 | https://merge-gems.fandom.com/wiki/Moonland | Wiki secondaire, non daté | Caisse20s, bonus×2 carré3×3 gemme maximale |
| W6 | https://merge-gems.fandom.com/wiki/Aztecland | Wiki secondaire, non daté | Lianes moitié revenu, fusion les retire |
| W7 | https://merge-gems.fandom.com/wiki/Crate | Wiki secondaire, non daté | Boîte carton tap révélant pierre |
| C1 | https://game-solver.com/merge-gems/ | Catalogue/reviews, maj iOS09/10/2023 | Reviews anecdotiques reset lvl20, trois terres ; pas de valeur retenue |
| C2 | https://www.appbrain.com/appstore/merge-gems/ios-1302018227 | Catalogue | Retrait App Store14/04/2024 annoncé, pas règle gameplay |
| C3 | https://merge-gems.en.uptodown.com/android | Catalogue propriétaire,4.10.5 | Identité, distribution déclarée propriétaire ; pas archive analysée |

Les valeurs W1 et W2 sont **confirmées dans la page secondaire exploitée** mais **pas toutes vérifiées directement dans le jeu**. Le fichier `game-data-research.json` conserve ce niveau de preuve, les montants bruts et les trous. Les fragments abrégés (`5.63k`, `1.73k`) ne révèlent pas les unités sous-jacentes exactes ; les développer en entier sert au calcul provisoire et ne récupère pas de précision absente.

## Captures réellement inspectées et déductions économiques

Captures locales fournies par recherche visuelle parent : `scratch/references/designer-1.jpg` à `designer-4.jpg`, portfolio du designer (URL à intégrer par volet visuel).

### Gemland, designer-1

**Confirmé visuellement** : portrait3colonnes,11cases (3+3+3+2), niveau6, XP138/210, monnaie56.17k, total631.2/sec. Gemmes : Perfect Sapphire (rang8, payout1120 affiché),Triple Gold (rang5,130 affiché),Great Silver (rang2,12 affiché) deux exemplaires, Sapphire(rang6),Gold Bar(rang3),Silver(rang1,4affiché). Deux boîtes carton et un cadeau ne produisent pas de monnaie dans ce calcul.

**Déduit** : somme tableW1=1120+130+12+12+270+30+4=1578 ;1578÷2.5=631.2, correspondant exactement au header. L'hypothèse « montant table par2.5secondes » est donc étayée. Cette capture n'est pas un chronométrage du cycle d'animation.

### Moonland, designer-2

**Confirmé visuellement** : niveau2,XP19/46,7cases (1hautcentre+3+3), total124.8/sec. Une Waterstone rang5 en basdroite sur case scintillante affiche292; trois Moonstone rang0 affichent1.3(normal hautgauche),2.6(scintillant basmilieu), une non légendée scintillante hautdroite; deux Crimson Moonstone rang1 (9surcase scintillante hautmilieu; normalbasgauche).

**Déduit**, corroboration indépendante :1.3+2.6+2.6+9+4.5+292=312 ;312÷2.5=124.8. Bonus×2 sur carré3×3 autour de Waterstone max, **incluant Waterstone elle-même**, conformeW5. Le boost ne s'applique pas à basgauche hors carré.

### Gemland, designer-4

**Confirmé visuellement** : niveau8,XP71/354,monnaie5.76m,revenu2.73k/sec vert avec2Xvert.13 cases (1 en haut au centre + 4 rangées de 3). Ruby affiche4.8k,DoubleGold affiche128, soit×2revenusW1. PrésenceSapphire etRareSapphire,TripleGold. Avec×2ads, somme gemmes=(2400+270+130+550+64)×2=6828 par2.5s =>2731.2/sec, affiché2.73k/sec. Troisième corroboration cadence2.5s et démonstration pub×2.

**Inconnu** : ordre précis des cases déverrouillées. Les points (lvl2→7cases,lvl6→11cases,lvl8→13cases) ne permettent pas une formule universelle. Ces captures sont potentiellement mises en scène par designer.

### Découverte, designer-3

**Confirmé visuellement** : overlay «NEW GEM DISCOVERED!»,nom «Double Moon Pyramid»,grand sprite au centre,rayons,encart blanc/vert et validation coche. Aucun revenu/XP additionnel lisible.

## Règles et valeurs

| Règle | Statut / source | Valeur et limites |
|---|---|---|
| Fusion | Confirmé O1/W1 | Deux rang n → un rang n+1 ; swipe/drag ; nombre 2 corroboré par guides/catalogues |
| XP par fusion | Confirmé O1/O2 | Existence ; **quantité inconnue** |
| XP niveaux | Confirmé captures | Niveau 2 dénominateur 46, niveau 6 dénominateur 210, niveau 8 dénominateur 354 ; autres seuils inconnus |
| Argent passif | Confirmé O1 | Augmente avec le rang ; les boîtes ne semblent rien rapporter |
| Cadence monnaie | Déduit W1 + captures | Tableau fournit un revenu par 2.5 s, pas directement par seconde |
| Génération Gemland | Confirmé secondaire W4 | 10 s par boîte ; upgrade 2.5 s mentionné «for some money», nature exacte pas prouvée |
| Génération Moonland | Confirmé secondaire W5 | 20 s par boîte |
| Tap générateur | Confirmé officiel : existence ; secondaire W3 : valeur | Réduit 5 s par appui selon ancien texte W3 ; pas chronométré |
| Boîte ordinaire | Confirmé W1/W7 | Rang 0 ; boîte niveau 2 donne rang 1 ; conditions upgrade non connues |
| Gift Box gratuit | Confirmé secondaire W3/J1 | Dans boutique, 3 h ; début de disponibilité initiale inconnu |
| Gift/Mystery contenu | Confirmé secondaire W1 | Rang aléatoire 1..max(1,n-4), n étant le plus haut découvert ; **probabilités inconnues** |
| Boutique | Confirmé O1/W1 | Monnaie du jeu, prix initiaux par rang indépendants de la zone |
| Boutique disponibilité | Confirmé secondaire W1 | Même plage que Gift/Mystery, posséder au moins une rang 1+ ; maintien après fusion non précisé |
| Prix hausse | Confirmé secondaire W1 ; existence corroborée J3 | +15% par achat ; premier Silver 1000 → affichage 1.73k (exception) ; arrondi exact inconnu |
| Limite ultime | Confirmé table W1 | 39 rangs 0..38 ; comportement de fusion de deux rangs 38 inconnu |
| Moon ouverture | Confirmé guides G1/G2 | Niveau 8 Gemland (G2 dit «around 8») ; non filmé dans notre volet |
| Zones inactives | Confirmé guides G1/G2 | Revenus et boîtes continuent ; argent indépendant ; offline cap non connu |
| Moon bonus | Confirmé secondaire W5 + visuel | ×2 carré 3×3 autour de la gemme actuellement la plus haute, incluant le centre ; égalités, recouvrement, multiplication non connus |
| Aztec lianes | Confirmé secondaire W6 | Apparition dans le temps, revenu divisé par 2 ; fusion les retire ; timing exact inconnu |
| Aztec accès | Inconnu | Troisième terre nommée officiellement, condition non établie |
| Aztec revenus | Secondaire W1 rangs 0..7 ; Déduit/provisoire au-delà | W1 propose généralement ×5/4 Gemland ; ne pas le présenter comme exact pour rangs 8+ |
| Absence | Confirmé G2/J3 | État de départ détermine le revenu ; **cap, taux, arrondis, boîtes/cadeaux offline inconnus** |
| Tutoriel/initialisation | Inconnu | Pas de nouvelle partie inspectée dans ce volet |
| Déplacement invalide | Inconnu | Retour, échange de gemmes, etc. non établis |

Les 39 rangs, tous les prix et revenus transcrits, sont dans `game-data-research.json`.

## Achievements

**Confirmé guides G1/G2/J2** : icône médaille/ruban bleu en bas à gauche ; accomplissement puis bouton vert `CLAIM` ; gain de monnaie. Catégories exactement lues J2 : `Discover … gems`, `Reach … level`, `Buy … Gems`, `Merge … times`, `Tap create … times`, `Open … crates`, `Open … Mystery box`. Bronze → argent → or avec seuils/récompenses croissants. Le guide japonais omet explicitement les nombres parce qu'ils changent. **Seuils et montants inconnus** : aucun ensemble original de valeurs à inventer. Les deux premiers guides ont beaucoup de phrases proches, donc leur indépendance est limitée.

## Monétisation observée

- Vidéo ×2 revenu pendant 2 h (G1/G2), bouton 2X en haut à droite visible ; supprimer l'offre et le boost.
- Vidéo améliorant de rang +1 les récompenses Mystery/Gift (G2), ne pas l'offrir gratuitement.
- Vidéo doublant la cadence des boîtes Moonland (G1/G2), ne pas convertir en bonus permanent.
- Offre pack/pièces liée à un temps limité visible dans designer-1 ; ne pas la reproduire.
- Upgrade boîte Gemland 10 → 2.5 s (W4) n'établit pas clairement s'il coûte des euros ou des pièces ; **ne pas l'offrir gratuitement** en attendant une preuve.
- Progression normale par boîtes 10 s / tap / pièces / fusions possible a priori ; rien dans les sources lues n'établit un blocage payant obligatoire.

## Contradictions et inconnues à conserver

1. Un état indexé W3 cite Goldland, mais W6 dit Aztec finale et le communiqué 2018 ne cite que trois terres. Ne pas ajouter Goldland sans preuve de version.
2. W2 a un en-tête «Production per sec» mais ses cellules affichent «amount / 2.5» ; trois calculs de captures rendent le diviseur 2.5 fortement étayé, mais la provenance de version reste non établie.
3. W1 Moon rangs 27+ portent `?`, W2 les reprend sans `?` ; garder l'incertitude d'origine. Le rapport 9/8 mentionné par W1 ne produit pas exactement plusieurs arrondis Moon de bas rang.
4. Premier Silver 1000 → 1.73k : exception W1 ; arrondi non retrouvé. Les autres achats +15% ne justifient pas d'inventer la précision interne du prix.
5. Prix rang 26 = 1000t contre 130.7t rang 25 ; conserver la transcription, rien n'autorise une correction ou un rééquilibrage.
6. `b` sert à la fois pour billion 10^9 et, plus loin, pour quintillion 10^18 après `a` 10^15 selon W1 ; la source elle-même suggère «oversight». Préférer un moteur décimal exact et documenter le format élargi provisoire.
7. Cases/règles des niveaux, tutoriel, annulation, plateau plein, XP par rang, offline cap, probabilités Mystery, cadence des lianes, ordre de déblocage Aztec, inventaire sons/settings non établis.
8. Aucun APK validé légitimement retrouvé dans ce volet ; aucune chaîne REA installée et aucune extraction de code revendiquée.

## Vidéos repérées mais non regardées

- Cipher, 22/10/2018, «Long Playthrough [GemLand Final]» : https://www.youtube.com/watch?v=XLZ8u7AUvL4
- Cipher, 22/10/2018, «All GemLand Gems» : https://www.youtube.com/watch?v=kl80rXSEq88
- Cipher, 22/10/2018, «All Aztecland Gems» : https://www.youtube.com/watch?v=u1GzSlLGALg
- Résultat «Long Playthrough Part 22» contient un marqueur Golden Stargem 18:36–18:53 ; pas de vidéo ni URL spécifique validée.

Aucune affirmation temporelle ne doit être qualifiée «vue dans une vidéo» sur cette base.

---

# Recherche visuelle Merge Gems! — 22 octobre 2026

## Corpus effectivement examiné

4 captures JPG téléchargées, ouvertes et inspectées avec `view_image` :

- Page : https://sacitsivri.com/games/mergegems.html
- https://sacitsivri.com/games/assets/images/mg/screenshot1.jpg — local `/workspace/scratch/references/designer-1.jpg` (720×1280)
- https://sacitsivri.com/games/assets/images/mg/screenshot2.jpg — local `/workspace/scratch/references/designer-2.jpg` (1152×2048)
- https://sacitsivri.com/games/assets/images/mg/screenshot3.jpg — local `/workspace/scratch/references/designer-3.jpg` (1152×2048)
- https://sacitsivri.com/games/assets/images/mg/screenshot4.jpg — local `/workspace/scratch/references/designer-4.jpg` (1152×2048)

La page du designer identifie Gram Games, iOS/Android, et son rôle Game Design/Monetization Design/QA Manager dans une équipe de trois. Date/version des captures inconnue. Leur présentation comporte le logo Merge Gems! en haut : il peut s'agir de captures promotionnelles composites et non d'une preuve que le logo occupe cet espace pendant une partie réelle. Ne pas reproduire silencieusement cette marge en tant qu'interface confirmée.

Provenance propriétaire Gram Games/Zynga présumée. Aucune licence de redistribution trouvée. Fichiers téléchargés pour comparaison hors dépôt ; ne pas copier les pixels dans le bundle publié. Redessins propres requis.

## Disposition observée

**Confirmé dans captures promotionnelles** : portrait 9:16. Plateau à **3 colonnes**, chaque tuile indépendante, carrée arrondie, épaisse, avec bord inférieur sombre et fine ombre bleu clair sous le volume. Pas de grille tracée. Sol Gemland brun marbré foncé sur fond gris/bleu désaturé. Moonland peut être violet et parfois bleu selon captures (contexte précis inconnu : screenshot2 violet ; screenshot3 bleu derrière voile découverte).

- screenshot1 : niveau 6, XP 138/210, plateau 11 cases : rangées 3+3+3+2 (dernière case droite absente). Monnaie 56.17k, revenu 631.2/sec.
- screenshot4 : niveau 8, XP 71/354, plateau 13 cases : une case centrale isolée en haut, puis quatre rangées pleines de 3. Monnaie 5.76m ; revenu 2.73k vert (boost 2x visible). Ceci ne confirme pas un ordre de déblocage universel, seulement deux états observés.
- screenshot2 Moonland niveau2 XP19/46 : 7 cases : une centrale au-dessus de deux rangées pleines. Plateau plein affiché FULL dans générateur. Fond violet. Certaines tuiles deviennent violet lumineux et portent des étoiles blanches (bonus revenu).

Header : deux compteurs horizontaux en pilule anthracite bord foncé côte à côte, icône monnaie à gauche et texte blanc très gras. Compteur gauche total, droit petit `/sec` près icône, taux au centre. Dessous, étoile jaune orange avec niveau rouge sombre à gauche de barre XP pilule noire, remplie lime diagonales ton sur ton. Texte XP centré blanc.

Footer : bas gauche deux boutons empilés, succès turquoise médaille blanche puis paramètres ardoise engrenage blanc. Générateur central = silhouette caisse hexagonale noire aux pointillés blanc/gris, caisse inférieure brun/ocre, petit compte à rebours dans bulle blanche en haut gauche (7, 5, ou 11 observés). Une bulle blanche/verte avec caisse + flèche haut pointe vers générateur (upgrade). Boutique bas droite gros bouton rose framboise arrondi relief, store blanc. Des boutons latéraux à droite montrent diamant et cube. Monétisation en haut droite 2x et vidéo ; à retirer, sans créer bonus gratuits.

## Dessin des objets effectivement visibles

Trait extérieur presque noir/bordeaux, 2D très propre, épaisseur ~2–4px aux captures 720–1152px ; couleurs saturées, facettes larges et contrastées, reflets blancs/cyan sur bords haut/gauche.

- Stone : non visible ici (description wiki : petite pierre grise, trois faces).
- Silver rang1 : trois pierres bleu/gris facettées, deux moyennes côte à côte et une minuscule devant à droite ; contour bleu nuit. screenshot1 en 3e rangée droite.
- Great Silver rang2 : un gros bloc derrière trois pierres argentées, grand rocher arrière au centre, rochers avant gauche/droite, minuscule devant. screenshot1.
- Gold Bar rang3 : lingot ocre jaune isométrique allongé du bas-gauche vers haut-droite ; toit jaune vif, face avant orange, côté droit ocre ; liseré blanc sur arête supérieur gauche.
- Double Gold rang4 : deux lingots accolés, pas deux rangs.
- Triple Gold rang5 : deux lingots de base avec troisième au-dessus au milieu.
- Sapphire rang6 : triangle bleu cyan arrondi, sommet en haut gauche, pointe droite, pointe bas gauche ; trois facettes principales bleu nuit/cyan/bleu ; reflet blanc le long arête haute. screenshot1 et4.
- Rare Sapphire rang7 : même triangle entouré cadre argent épais, trois coins du cadre en spirale argentée. screenshot4.
- Perfect Sapphire rang8 : gemme bleue quadrangulaire/même famille avec gros cadre métal argenté orné de spirales, screenshot1 en haut milieu ; ne pas déduire silhouette exacte du contour partiellement masqué par revenu.
- Ruby rang9 : rubis rouge carré/octogone incliné, coins tronqués, haut rose clair, face principale rouge, facettes bas/latérales rouge sombre et reflets blancs. screenshot4.
- Moonstone rang0 : pyramide/éclat vert irrégulier, sommet haut droit, base courbe vers bas droite, deux faces vert/ocre, contour noir (screenshot2).
- Crimson Moonstone rang1 : même silhouette rouge/ocre + petit morceau rouge devant à droite.
- Double Moon Pyramid rang4 : découverte screenshot3, grande pyramide rose/mauve sur socle carré argenté et petite pyramide devant/droite ; deux décors demi-cercles argentés à la base de la grande.
- Caisse standard : trapèze brun, dessus jaune ocre, sommet horizontal moins large que milieu, fond brun se rétrécit vers base ; contour bordeaux ; symbole diamant crème/gris dans carré arrondi à l'avant. Caisse Moonland symbole cube.
- Cadeaux : boite bleue ruban jaune/nœud jaune (screenshot4) ou verte ruban rouge/nœud rose (screenshot1). Provenance exacte cadeaux inconnue.

Les revenus transitoires s'affichent en texte blanc gras avec icône pièce devant, et parfois petit `+` vert ; ils dépassent la case. Les étoiles sur bonus Moonland sont blanches à 4 pointes.

## Découverte

Capture3 montre overlay découverte : voile bleu sombre translucide sur écran ; grand ruban framboise en haut avec texte NEW GEM DISCOVERED! blanc gras incliné/cartoon ; rayons jaunes derrière grand objet au centre ; carte inférieure verte arrondie titre Double Moon Pyramid blanc et intérieur blanc, gros bouton confirmation vert avec coche blanche. Animation/durée/son non observés dans image statique.

## Sources identifiées mais pas vues en mouvement

- https://www.youtube.com/watch?v=XLZ8u7AUvL4 — Long Playthrough [GemLand Final], date indexée 22 octobre 2018. Seulement résultat index, pas vidéo regardée.
- https://www.youtube.com/watch?v=rmhKEG-d6hI — Trailer, App Preview, 6 avril 2018 (résultat d'un miroir). Pas vidéo regardée.
- https://www.giga.de/video/01FNRHG1KCH1N39GE6PNDV0SNM — annonce gameplay trailer 4 avril2018, pas vidéo regardée.
- Officiel https://www.gram.gs/game-detail-merge-gems.html lu HTML/Exa ; CSS référence assets/images/subpages/game-details-merge-gems.jpg, assets/images/games/merge-gems-game.jpg ; deux images ensuite téléchargées et inspectées.
- https://merge-gems.fandom.com/wiki/Gemland_Gems : descriptions formes et table. Agent gameplay traite cette source. Fandom direct renvoie 402, Exa peut lire texte. Image originale de chaque rang non encore accessible.

## Limites

Aucun son/musique entendu. Aucune animation observée. Paramètres et boutique non vus. Pas de fichier original APK/IPA acquis ; aucun usage REA justifié. La forme de nombreux rangs et de toutes les gemmes Aztec/Gold reste inconnue à ce stade. La date/version des captures du designer doit rester explicite, sans mélange non signalé avec tables wiki.

## Recherche Exa

5 recherches ×8 + 1 recherche ×6 = sources_reviewed 46 (compte demandé par skill = somme numResults, pas quarante pages lues). Plusieurs résultats répétés, non quarante preuves indépendantes.


## Complément officiel effectivement inspecté

- https://www.gram.gs/assets/images/subpages/game-details-merge-gems.jpg — local official-hero.jpg, 1440×640.
- https://www.gram.gs/assets/images/games/merge-gems-game.jpg — local official-game.jpg, 960×480.

Paysage lunaire bleu, cratères, ciel violet étoilé et horizon rose, trois gemmes cyan facettées disposées sur tuiles violettes lumineuses. Illustrations marketing, pas captures d'une partie : ne pas en déduire la disposition des compteurs ou l'ordre des niveaux. Elles montrent davantage de texture/gradient et un bord noir que les redessins actuels, écart visuel documenté.

## Vérification technique assets redessinés

Le module src/art.ts fournit gemSvg(worldId,rank), crateSvg(worldId), iconSvg(name), giftSvg(). Rangs hors bornes bornés à0..38 ; familles non vérifiées marquées provisoires dans docs/asset-inventory.md. 117 SVG Gemland/Moonland/Aztecland rendus sans erreur avec CairoSVG ; planche Gemland effectivement examinée. Icône installation propre rendue en PNG512/192/180. Aucune copie pixel des captures publiée.
