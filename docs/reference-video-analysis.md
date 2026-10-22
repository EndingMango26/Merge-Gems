# Vidéos et archive officielle — vérification du 22 octobre 2026

## Résultat : une vidéo officielle réellement obtenue et inspectée

Source d'entrée : https://www.gram.gs/press.html

Archive publique liée par l'éditeur : https://www.gram.gs/assets/GramGames_PressKit.zip

Le lien affiche encore «DOWNLOAD PRESS KIT (197 MB)», mais le serveur annonce 299 579 907 octets. En-têtes HTTP : type `application/zip`, `Last-Modified: Wed, 26 Feb 2025 08:40:53 GMT`, prise en charge standard `Accept-Ranges: bytes`. Cette date est celle du fichier servi, pas une preuve de date de création du contenu.

Méthode effectivement exécutée : lecture des 65 557 derniers octets par HTTP Range ; lecture de l'annuaire central ZIP de 70 entrées ; téléchargement des seuls segments contenant trois fichiers Merge Gems ; décompression Deflate standard et validation de la taille et du CRC32 contre l'annuaire central. Aucun programme d'application, protection ou mécanisme de déchiffrement analysé. Aucun outil REA installé.

| Entrée officielle ZIP | Taille décompressée | SHA256 |
|---|---:|---|
| `Press Kit/MergeGems!_TrailerVideo.mp4` | 30 702 075 | `4fcdf16c9f64deff04d4fa9f97b0af1692a615b0ff26c46104990b01c65490d9` |
| `Press Kit/MergeGems!_AppIcon.png` | 864 266 | `45c1f7ecff3e68dff23342233ebae175ed99d324e57b1f1c9e7f356c1507fb52` |
| `Press Kit/MergeGems!_Logo.png` | 261 689 | `0d1195cea32b24a6032fba93cd82889acd48ba8477f6b6d8d1062d207973552f` |

Fichiers d'analyse locaux : `/workspace/scratch/official-kit/`. Index : `/workspace/scratch/presskit-index.json`. Script initial : `/workspace/scratch/extract-presskit.py`. Script autonome livré et vérifié : `scripts/fetch-reference-presskit.py` (références enregistrées hors du dépôt uniquement). Ils ne sont pas ajoutés aux ressources distribuées du jeu. La mise à disposition dans un kit presse n'établit pas d'autorisation de réutilisation de ces ressources dans notre jeu public.

`ffprobe` exécuté : vidéo 1920×1080, 25 images/s, durée 25.000000 s, piste audio présente. L'identité Merge Gems a été validée par inspection des images extraites : logo, gemmes, plateau et écrans du vrai jeu.

Images réellement ouvertes avec `view_image` : contact sheet globale `/workspace/scratch/official-trailer-contact.jpg`, séquence de 16 images de 0 à3.75s `/workspace/scratch/trailer-seq-0.jpg`, autres séquences et images haute résolution aux temps 1,6,8,8.6,9.2,9.4,9.6,9.7,10.2s. Ce constat repose sur des images successives effectivement inspectées ; aucun lecteur audiovisuel continu n'a été utilisé.

## Deux profils de référence incompatibles à ne pas fusionner silencieusement

La bande-annonce est liée depuis le site officiel avec les contenus de lancement. La presse du 4 avril 2018 intègre aussi une vidéo YouTube (`CR7ks_xXFF0`), mais l'équivalence binaire avec ce fichier du kit n'a pas été vérifiée. On désigne donc prudemment ce contenu «profil court de la bande-annonce officielle, période lancement supposée».

La reconstruction retient comme référence principale le **profil étendu de 39 rangs documenté par le portfolio designer et le wiki**. Numéro de build exact non établi. Les données de la bande-annonce constituent un profil séparé, pas des corrections automatiques au profil étendu.

| Rang du profil court | Forme/nom observé | Prix affiché boutique vers13s | Revenu affiché / déduit | Différence profil étendu |
|---:|---|---:|---|---|
|0|Stone|Non proposé|1.2 affiché ; 0.48/sec déduit|Même nom et montant de base|
|1|Silver|1.73k (achats déjà faits)|4 affiché ;1.6/sec déduit|Même nom ; prix courant ne prouve pas prix initial|
|2|Gold Bar|4.5k|12 affiché vers9.4s ;4.8/sec déduit|Profil étendu a **Great Silver** à ce rang/prix ; Gold Bar est rang3|
|3|Double Gold|12k|30 déduit du total42.4/sec à9.7s avec GoldBar12+Sapphire64|Profil étendu a **Gold Bar** à ce rang/prix ; Double Gold rang4|
|4|Sapphire|35k|64 affiché à9.2s|Profil étendu a **Double Gold** à ce rang/prix ; Sapphire rang6|

La boutique du trailer ne contient pas Great Silver ou Triple Gold dans les quatre premières lignes observées. À4.5s deux Silver se fusionnent directement en Gold Bar. À9.6s deux Gold Bar deviennent Double Gold. Ce sont des preuves directes d'une chaîne plus courte, pas une erreur à corriger en recopiant des prix sur des noms du profil étendu.

Les chiffres par rang ressemblent aux débuts du tableau wiki, mais les noms/sprites associés diffèrent : il faut donc indexer par profil et ne jamais transférer des noms ou revenus de l'un à l'autre sans qualification.

## Observations temporelles et visuelles exactes

| Temps dans le fichier | Observation réellement visible | Niveau de preuve et conséquence |
|---|---|---|
|0.25 s|Niveau 1, XP 2/40, 32 pièces, 1.6/sec ; 6 cases en 3×2 ; 5 caisses et Silver|Confirmé dans le trailer ; partie déjà commencée, **pas état initial prouvé**|
|0.75–2 s|La main touche successivement les caisses ; disparition de la caisse, éclat doré, petits fragments, gemme qui apparaît ; l'ouverture des 5 caisses laisse XP 2/40|Confirmé trailer ; **pas d'XP à l'ouverture** dans ce profil|
|0.25–3.75 s|Petit badge du générateur :9 puis8,7,6,5 au fil de la séquence, même avec plateau plein|Déduit : nombre de secondes restantes, pas niveau de caisse|
|2.5–3 s|Stone glissée vers Stone ; cases des autres Stone avec halo cyan clair et bord pointillé blanc pendant le geste|Confirmé trailer ; feedback des cibles compatibles|
|3–3.25 s|Fusion Stone→Silver : éclat au point de fusion, étoile et texte +1, traînée de particules/étoiles vers la barre XP ; XP2→3|Confirmé trailer ; résultat rang1 donne1XP dans ce profil|
|3.75–4.25 s|Autre Stone→Silver, +1 ; XP3→4|Confirmé trailer|
|4.5–4.75 s|Silver+Silver→Gold Bar ; overlay «NEW ITEM DISCOVERED!», rayons derrière sprite, nom sur vert, coche verte sur encart blanc|Confirmé trailer ; même genre d'overlay mais texte différent du portfolio «NEW GEM DISCOVERED!»|
|8 s|Autre séquence, niveau1, XP37/40, 1.23k pièces, 38.4/sec ;6cases ;2GoldBar,1Sapphire,2Silver|Confirmé trailer ; coupe de montage, **pas continuation économique du début**|
|8.6 s|Deux Silver→GoldBar, +2XP ; XP39/40|Confirmé trailer ; résultat rang2 donne2XP|
|9.4–9.7 s|Deux GoldBar→DoubleGold, +3XP ; niveau1 XP39/40 devient niveau2 XP2/46 ;6cases deviennent7 avec nouvelle case au centre en haut|Confirmé trailer ; seuils1=40 et2=46 dans ce profil ; reliquat XP préservé|
|9.6–9.9 s|Déblocage de case : apparition depuis le haut, rayons verticaux dorés et particules ; cases existantes décalées vers le bas pour faire place|Confirmé trailer ; durée exacte du jeu non établie|
|10.2 s|Modal «LEVEL UP!», «MORE SPACE HAS BEEN UNLOCKED», encart blanc/vert, coche verte ; fond assombri bleu|Confirmé trailer|
|12–16 s|Boutique : GiftBox! et bouton FREE, bandeau rose, liste claire, achats verts, bouton CLOSE ; chaîne courte et prix ci-dessus|Confirmé trailer ; contenus monétisés à retirer, cadeau gratuit normal à distinguer|
|18–24 s|Plateau avancé :12cases en3×4, niveau7 XP68/276 puis71/276 puis83/276 ; gemmes dorées/rouges/bleues/vertes ; drag, fusions, découverte|Confirmé par inspection détaillée de research_visuals, voir `trailer-visual-research.md` ; pas15cases comme initialement supposé sur contact sheet réduite|

Les temps ci-dessus sont les positions dans le fichier publicitaire. La vidéo utilise des transitions, coupes et possiblement une accélération du gameplay. **Aucune durée exacte d'animation ou de génération n'est calibrée à partir du temps du montage.** Le badge de génération semble s'écouler plus vite que le temps du fichier ; ne pas remplacer les10s des sources par une mesure brute de cette bande-annonce.

Les revenus du profil court corroborent un calcul par2.5s : Silver4/2.5=1.6/sec ; Silver4+Stone1.2=5.2/2.5=2.08/sec ;2GoldBar12+Sapphire64+2Silver4=96/2.5=38.4/sec ; DoubleGold30+GoldBar12+Sapphire64=106/2.5=42.4/sec. Les images suggèrent des paiements par gemme à des phases différentes (popups1.2,4,12,etc.), mais l'alignement des phases et le temps réel ne peuvent pas être établis précisément depuis ce montage.

## Son : limite effective

Une piste audio est présente. Les8premières secondes ont été extraites en WAV mono16kHz (`scratch/trailer-audio-first8.wav`). L'essai de transmission à l'outil audio a renvoyé textuellement «audio content omitted because you do not support audio input». **Aucune écoute validée** : aucune mélodie, instrument, musique de jeu ou son de fusion n'est identifié dans ce volet. Une bande-son publicitaire ne prouverait de toute façon pas qu'elle se joue en partie. Aucun son original recopié.

## Essais inaccessibles et faux positif écarté

- https://www.youtube.com/watch?v=rmhKEG-d6hI :HTTP403.
- https://www.youtube.com/embed/rmhKEG-d6hI :échec tunnel proxy403 (`CONNECT tunnel failed, response403`).
- https://www.topgames.com/walkthrough/Merge-Gems-All-Gemland-Gems :HTML accessible ; embed exclusif `https://www.youtube.com/embed/kl80rXSEq88`, pas de média MP4 local.
- Lecteur public `youtube-nocookie.com` :HTML accessible ; sans référent, Error153 (`EMBEDDER_IDENTITY_MISSING_REFERRER`). Avec contexte référent public Topgames, aperçu OK mais réponse de lecture finale Error152-18 (`PLAYABILITY_ERROR_CODE_EMBEDDER_IDENTITY_DENIED`), sans flux vidéo. Aucun contournement poursuivi après ce refus.
- Chromium vers Topgames échoue `net::ERR_CERT_AUTHORITY_INVALID` avec proxy configuré ; vérification TLS conservée.
- **FAUX POSITIF** https://www.giga.de/video/01FNRHG1KCH1N39GE6PNDV0SNM :métadonnées génériques «Ankündigungs-GameplayTrailer»,04/04/2018 ; MP4 direct effectivement téléchargé https://reels-cdn.stroeermb.de/341873638/v4/1080p.mp4 mais identité invalidée par contact sheet :**The Elder Scrolls Online:Summerset**, pas Merge Gems. Fichier local renommé `rejected-ESO-Summerset-trailer.mp4`, aucune observation retenue pour Merge Gems.

## Transferts justifiés par le niveau de preuve

Les feedbacks visuels (halos de fusion, étoile XP, fond/modal, particules de déblocage) peuvent guider des redessins, en étant documentés comme observations du profil court. Les valeurs XP, prix, rangs, état initial et conditions d'accès ne sont **pas transposés silencieusement** au profil étendu sélectionné. La date exacte et le numéro de build restent inconnus. La source officielle rend sa consultation publique possible, sans établir le droit d'en redistribuer les éléments dans un jeu remplaçant l'original.

---

# Vrai trailer officiel Merge Gems! — observations visuelles

Source : https://www.gram.gs/assets/GramGames_PressKit.zip , membre `MergeGems!_TrailerVideo.mp4`. Récupération agent research_gameplay, fichier local `/workspace/scratch/official-kit/MergeGems!_TrailerVideo.mp4`. Fichier effectivement inspecté par frames extraites FFmpeg et view_image. 25.000s,1920×1080,25fps,H264+AAC. Date/version application inconnue. L'archive a aussi AppIcon.png/Logo.png ; droits propriétaires, non publiés dans reconstruction.

## Identité et profil

Bon jeu confirmé par logo Merge Gems!, caisses, gemmes Silver/GoldBar/Sapphire/Ruby et écrans. Le précédent lien Giga était mal attribué et montrait ESO Summerset ; il est exclu.

**Ce trailer montre un profil de progression plus court que les captures du designer et le wiki.** Il ne faut pas appliquer ses rangs/prix au profil étendu39rangs retenu pour la reconstruction. Les formes communes par nom peuvent servir de référence complémentaire (Ruby,Stone,Silver,Emerald).

## Boutique 12.5–17.5s

Frames haute qualité extraites sous `/workspace/scratch/references/official-frames/shop-01.png` à `shop-10.png`,2frames/s à partir de12s. Frames1,3,5,7,9 réellement vues.

-12s : overlay `NEW ITEM DISCOVERED!`, Ruby. Grand ruban rose framboise et texte blanc ; rayons autour du joyau. Carte verte dessous avec nom Ruby, fond blanc et bouton confirmation vert avec coche blanche. Fond du jeu voilé bleu sombre. Rubis rectangle à coins biseautés incliné, rouge et reflets blanc/rose, grande table quadrangulaire et biseaux larges. Cet aspect correspond aussi au Ruby du portfolio designer4.
-13s : boutique panneau rose framboise aux coins très arrondis ; header cadeau vert/rouge avec `GIFT BOX!`, bouton vert `FREE` en hautdroite. Liste interne blanche, défilante, lignes bleu trèspâle arrondies et bord gris. Image et nom gris foncé à gauche ; bouton achat à droite, vert clair enhaut `BUY`, vert sombre enbas pièce+prix blanc. Bouton `CLOSE` rose placé à droite sous le panneau (pas croix enhaut dans cette version).
-13s prix visibles : Silver1.73k, GoldBar4.5k, DoubleGold12k, Sapphire35k. GreatSilver et TripleGold absents de cette chaîne. Ce n'est PAS le tableau étendu actuel où4.5k=GreatSilver et35k=DoubleGold.
-Une offre vidéo orange `Free!` apparaît à côté GoldBar ; à supprimer dans version personnelle, sans transformer enbonus illimité.
-14–16s main promotionnelle achète Silver plusieursfois ; prix Silver passe1.73k→1.98k/1.99k(lectureobstruée)→2.28k. GoldBar4.5k→5.18k. Cela corrobore une hausse15%arrondie à2décimales dans ce profil, ne confirme pas le détail d'arrondi interne.

## Plateau et formes18–22s

Frames late-05.png(18s),late-09.png(20s),late-13.png(22s) réellement vues.

-Plateau12cases3colonnes×4rangées,niveau7 XP68/276 puis71/276 puis83/276. Aucun plateau15cases vu dans ces frames. Pas de nouvel espace visible aprèslvl7.
-Les cases ont de petits tas de pièces dorées décoratifs enbas à gauche et à droite. Les cases portfolio étudiées sont marbrées sans ces pièces : autre écart de version/apparence.
-Niveau7 remplitbarreXPvertlime,header7et total~358.85k,taux710.24→712.48→717.28selonfusions.
-Emerald : cabochon ovale vert trèslisse, incliné de~20° versdroite. Centre vert trèsfoncé/noir enhaut, bord et bas vert vif. Reflets blancs/gris courbes concentrés dans la moitié supérieure gauche. **Pas facettage polygonal.** Nom Emerald relié par description wiki ellipseverte, mais pasnomaffiché directement dans cette séquence ; identité par famille déduite.
-Stone : petitgalet gris à3faces, silhouette trianglearrondi (sommet blanc enhautdroite), contour noir ; nettementpluspetit que lesgemmes avancées. Aspectparticulièrementvisible20s(row3gauche).
-Silver : deuxpierres bleugris arrondies avec petitfragment devant ; pas tétraèdres réguliers. Mêmetype que designer1,formeparnomconfirmée.
-Sapphire : triangle bleu auxcoinsarrondis, longuefacecyan, bordhauteurblanc et facettesaugradient. RareSapphire mêmegemme cadreargent avec3spirales. Cesformesconfirment designer1/4.
-Ruby : rectanglebevelrouge comme popup12s et designer4.

## Animations effectivement observées par frames

À20s une fusion GoldBar sélectionne les deuxcases via halo bleu et contour pointillé cyan. Le lingot glissé est dessiné audessus des deuxcases, destination flashblanc circulaire ; une pièce+12blanc flotteprèsdupointdefusion. À22s, fusiondeSapphire : étoiles jaunes, petitéclatsjaunes et une traînée d'étoiles remonte versbarreXP. La capture finale de la destinationmontre RareSapphire. Ce sont des observationsdeframes ; durée exacte, interpolation et courbes restent inconnues sansanalyseplusfine deshorodatages. Animationguidemainblanche propreautrailer, paspreuve d'untutorielréel identique.

## Réglages/collection

Engrenagevisible basgauche mais jamaisouvert dansframesexaminées. Aucun écran paramètres confirmé. `GROW YOUR COLLECTION!` est un sloganmarketing àcôtéduplateau, paspreuve d'un écrancollection. Aucun écranavancéMoon/Aztec vu danscesframes. Aucunevalidation sonore effectuée par cetagent.
