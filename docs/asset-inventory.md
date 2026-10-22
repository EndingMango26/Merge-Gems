# Inventaire graphique et sonore

État au 22 octobre 2026. Les captures examinées sont listées dans `reference-analysis.md` ; les fichiers de recherche ont été conservés hors des ressources publiées. Aucun APK/IPA original n'a été obtenu ni extrait. Le kit presse officiel a ensuite permis d'inspecter localement le trailer de25secondes ; sa chaîne de progression plus courte est conservée comme profil de référence distinct. Aucune licence de redistribution des créations Gram Games/Zynga n'a été trouvée. Le retrait d'une boutique ne transfère pas les droits.

## Ressources livrées

| Ressource | Fichier | Provenance et statut | Fidélité |
|---|---|---|---|
| Gemmes vectorielles | `src/art.ts`, `gemSvg(worldId,rank)` | Redessins propres à partir des captures du designer Sacit Sivri et descriptions wiki. Aucun pixel ou fichier de l'application copié. | Voir détail ci-dessous ; nombreux rangs provisoires. |
| Caisse standard et lunaire | `src/art.ts`, `crateSvg(worldId)` | Redessin ; capture designer1/2/4. | Dessus ocre, corps trapèze brun, diamant/cube crème confirmés ; proportions estimées. |
| Cadeau | `src/art.ts`, `giftSvg()` | Redessin du cadeau bleu/ruban jaune, designer4. | Forme/couleurs observées ; provenance du cadeau et rythme non établis. |
| Icônes menus/monnaie | `src/art.ts`, `iconSvg(name)` | Vecteurs propres ; médaille, engrenage et boutique inspirés des captures. Autres symboles standard propres. | Proportions estimées. Aucune police d'icônes distante. |
| Icône installation | `public/assets/icon.svg`, PNG192/512 et Apple180 | Création technique propre : triangle bleu sur tuile brune. | Icône distincte ; ce n'est pas l'icône originale. |
| Typographie | Police système du navigateur | Aucune police propriétaire embarquée. | Approximation ; police exacte de l'original non identifiée. |
| Sons et musique | Aucun fichier original récupéré ; bips Web Audio optionnels | Sons de remplacement synthétiques, désactivés par défaut, aucune musique ajoutée. | Aucune fidélité sonore établie. |

## Statut des rangs de Gemland (index zéro)

Le rang0 est Stone, le rang38 The One True Gem. Une silhouette observée ne signifie pas un dessin identique au pixel : ces redessins restent des approximations vectorielles.

| Rangs | Référence | Ce qui est connu / provisoire |
|---|---|---|
| 0 Stone | Wiki Gems et trailer officiel20s | Petit galet gris triangle arrondi, trois faces et reflet blanc supérieur observés ; redessin corrigé d’après les frames. |
| 1 Silver, 2 Great Silver | Designer1 screenshot1 | Groupes bleu gris de trois/quatre rochers facettés, petit éclat devant. Redessin d'après image directement vue. |
| 3–5 Gold Bar/Double/Triple Gold | Designer1/4 | Lingots isométriques jaunes/orange, simple/deux/trois confirmés. |
| 6 Sapphire | Designer1/4 | Triangle cyan/bleu incliné et facettes/reflet blanc observés. |
| 7 Rare Sapphire | Designer4 | Triangle bleu cadre argenté et trois spirales observés. |
| 8 Perfect Sapphire | Designer1 | Gemme bleue avec cadre argenté et spirales, silhouette partiellement cachée. Redessin partiel en forme de bouclier à cadre argenté et spirales ; contour détaillé et facettes provisoires, à comparer à une capture dégagée. |
| 9 Ruby | Designer4 et trailer officiel12s | Rubis rectangulaire incliné aux coins biseautés, table quadrangulaire et larges biseaux rouge/rose observés ; redessin corrigé, nuances estimées. |
| 10–11 Rare/Epic Ruby | Famille et noms wiki | Silhouette du rang9 déclinée cadres métal : **provisoire**, pas une apparence originale confirmée. |
| 12 Emerald | Wiki et trailer officiel20s par nom/famille | Ellipse verte lisse inclinée, cabochon vert sombre/vert vif avec reflets blancs. Identité reliée au nom par description wiki ; sa position dans la chaîne du trailer est différente. Facettage polygonal précédent retiré. |
| 13–15 Mystic/Mysterious Stone, Topaz | Noms wiki seulement | Heptagones violets et topaze orange provisoires ; forme/couleur non confirmées. |
| 16 Tiger Eye | Description wiki | Orange bord argenté connu par texte ; ovale/facettes provisoires. |
| 17 Shiny Ruby | Nom wiki seulement | Rubis rouge cadre or provisoire. |
| 18–20 Droplet family | Noms wiki seulement | Gouttes bleues, cadres argent/or : provisoires. |
| 21 Lovely Ruby | Description wiki | Cœur rouge connu par texte. |
| 22–23 Lovely Pink Ruby/Violet Love | Noms/famille wiki | Cœurs rose/violet déduits des noms ; facettes provisoires. |
| 24 Pentagem | Description wiki | Pentagone rose connu par texte. |
| 25–26 Uncommon/Mythical Pentagem | Famille wiki | Cadres argent/or provisoires. |
| 27 Life Stone | Description wiki | Hexagone bleu connu par texte. |
| 28–29 Silver/Great Lifestone | Famille wiki | Cadres argent/or provisoires. |
| 30 Faded Emerald | Description wiki | Octogone olive connu par texte. |
| 31–32 Framed/Golden Emerald | Noms/famille wiki | Cadres argent/or déduits des noms, facettes provisoires. |
| 33–35 Stargem/Silver/Golden Stargem | Noms wiki seulement | Étoiles bleues et cadres argent/or provisoires. |
| 36–38 Royal/Perfect Royal/One True Gem | Noms wiki seulement | Joyaux ornés d'une couronne, formes/couleurs entièrement provisoires. |

## Autres zones

| Zone / rangs | Statut |
|---|---|
| Moonland0/1 | Designer2 : éclat pyramidal irrégulier vert puis rouge avec petit fragment ; redessins d'après image. |
| Moonland2 | Même famille, violet provisoire. |
| Moonland3 | Pyramide rose déduite de la famille et capture du rang4. |
| Moonland4 | Designer3 : deux pyramides rose/mauve sur socles argentés observées ; décors arrondis argentés à la base non reproduits complètement. |
| Moonland5 Waterstone | Designer2 : cube turquoise facetté observé, petits motifs/proportions provisoires. |
| Moonland6–38 | Déclinaisons cubes/cristaux/éclats/prismes/stalagmites/obélisques selon noms wiki ; **provisoires** sans observation de chaque rang. |
| Aztecland0–38 | **Provisoires** : silhouettes propres inspirées uniquement des noms du tableau, pas d'apparence originale confirmée. |
| Goldland | Branches graphiques provisoires uniquement ; ne constituent pas une preuve que cette zone appartient à la version de référence retenue. |

## Sources visuelles directes

Page du designer : https://sacitsivri.com/games/mergegems.html

Captures : https://sacitsivri.com/games/assets/images/mg/screenshot1.jpg , screenshot2.jpg , screenshot3.jpg , screenshot4.jpg (même chemin). Date/version inconnue. Captures avec logo promotionnel, pouvant être compositées.

Images marketing officielles effectivement inspectées :

- https://www.gram.gs/assets/images/subpages/game-details-merge-gems.jpg
- https://www.gram.gs/assets/images/games/merge-gems-game.jpg

Ces deux images illustrent un paysage lunaire bleu sous ciel violet étoilé et gemmes cristal cyan en avant-plan, avec tuiles violettes lumineuses. Ce sont des illustrations marketing, pas des captures attestant l'interface jouable. Elles ne sont pas embarquées.

Descriptions wiki : https://merge-gems.fandom.com/wiki/Gemland_Gems (contenu Gems lu via Exa). La version/date de ces descriptions n'est pas établie.

Police libre téléchargée : https://raw.githubusercontent.com/google/fonts/main/apache/luckiestguy/LuckiestGuy-Regular.ttf ; licence https://raw.githubusercontent.com/google/fonts/main/apache/luckiestguy/LICENSE.txt.


## Complément du trailer officiel, profil court distinct

Source : https://www.gram.gs/assets/GramGames_PressKit.zip , membre `MergeGems!_TrailerVideo.mp4`,25s1920×1080,25fps. Fichier inspecté localement en frames haute qualité, jamais embarqué dans la publication. La date/version de l'application reste inconnue. Le trailer montre Silver→GoldBar et non Silver→GreatSilver ; sa table de prix ne doit pas être appliquée au profil étendu retenu. Les apparences communes **par nom** (Stone,Ruby,Sapphire,Silver) servent de référence complémentaire.

Les frames montrent effectivement des animations : fusion avec halo bleu et pointillés cyan sur les deux cases, flash blanc, particules/étoiles jaunes qui remontent vers la barre XP ; découverte avec rayons jaunes et carte verte. Les durées précises et courbes d'interpolation restent inconnues. Aucun fichier sonore original n'est inclus ; cet agent n'a pas écouté l'audio. Les animations et sons synthétiques de la reconstruction ne doivent pas être annoncés comme identiques à ceux de l'original.

La boutique observée vers13–17s a une bordure framboise, une liste blanche avec lignes bleu pâle, des boutons d'achat verts à deux niveaux et un bouton CLOSE rose dessous. Son cadeau gratuit et ses offres vidéo sont visibles ; leurs règles doivent être établies séparément avant implémentation. Aucun écran de paramètres n'a été ouvert dans ce trailer.
