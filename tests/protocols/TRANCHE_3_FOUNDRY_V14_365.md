# Protocole de test — Phase 03, Tranche 3 — Moteur D100

**Système :** D100 Interface  
**Version locale :** `0.1.0`  
**Foundry VTT :** `14.365`  
**Statut :** candidate non validée

# 1. Redémarrage Foundry

Cette candidate ajoute de nouveaux modules JavaScript, le moteur D100, l’adaptateur `Roll` et les déclencheurs de la fiche.

1. Ferme le monde.
2. Quitte complètement Foundry VTT.
3. Remplace `Data/systems/interface/` par le dossier `interface/` de la nouvelle archive.
4. Relance Foundry VTT 14.365.
5. Rouvre le monde de test.
6. Ouvre la console avec `F12`.
7. Ouvre la fiche de Camille.

Les valeurs ci-dessous supposent que Camille conserve les statistiques de test fournies précédemment :

```text
Carrure 50
Endurance 10
Force brute 8

Blessures 6 → niveau 2
Stress 9    → niveau 3
Coefficient d’état 3
Malus d’état total 15
```

# Tests

## T1 — Libellés narratifs Blessures et Stress

Observe le bandeau noir sous les Compétences avec les valeurs de Camille :

```text
Blessures : 6
Stress : 9
```

**Résultat attendu :**

- les anciennes six bulles numérotées ne sont plus affichées ;
- sous Blessures, un petit libellé encadré et arrondi affiche **Meurtri** ;
- sous Stress, un petit libellé encadré et arrondi affiche **Ébranlé** ;
- les deux libellés utilisent la couleur correspondant au palier ;
- modifier les valeurs met automatiquement à jour le texte et la couleur ;
- les libellés n’ajoutent aucun effet mécanique supplémentaire.

Vérifie rapidement les extrêmes :

```text
Blessures : 0  → Indemne
Blessures : 15 → Critique
Stress : 0     → Stable
Stress : 15    → Rupture
```

Remets ensuite Blessures à `6` et Stress à `9` avant de poursuivre.


## T2 — Fiche allégée et ouverture du pré-lancer

Observe le haut de la fiche Actor.

**Résultat attendu :**

- la fiche s’ouvre sans erreur ;
- aucun bandeau permanent **Mode du jet** n’est affiché ;
- les noms des Compétences sont cliquables ;
- les noms des Talents sont cliquables ;
- les cartes Corps à corps, Distance et Verbal sont cliquables ;
- cliquer sur un Talent ouvre une petite fenêtre de préparation ;
- cette fenêtre propose :
  - le mode `Normal`, `Avantage` ou `Désavantage` ;
  - un champ **Bonus / Malus** ;
  - un bouton **Lancer les dés** ;
- `Normal` et `0` sont sélectionnés par défaut ;
- aucune erreur rouge ne cite `systems/interface/`.

## T3 — Jet direct depuis un Talent

Clique sur le texte **Endurance**.

Dans la fenêtre de préparation :

```text
Mode : Normal
Bonus / Malus : 0
```

Clique sur **Lancer les dés**.

**Résultat attendu :**

- un seul D100 est lancé ;
- un message apparaît dans le chat ;
- sa source indique `Carrure + Endurance` ;
- les dés naturels, le résultat brut retenu, le seuil final, le résultat final, la qualification et la marge sont affichés ;
- avec les valeurs de Camille ci-dessus, le seuil final est `45` :
  `50 + 10 - 15 + 0 = 45` ;
- la position de défilement de la fiche reste stable.

## T4 — Jet depuis une Compétence

Clique sur le texte **Carrure**.

**Résultat attendu :**

- une première fenêtre demande de choisir un Talent associé ;
- elle propose uniquement Endurance, Force brute et Robustesse ;
- choisir **Force brute** ouvre ensuite la fenêtre de préparation du jet ;
- avec `Normal` et `0`, cliquer sur **Lancer les dés** lance `Carrure + Force brute` ;
- le seuil final est `43` :
  `50 + 8 - 15 + 0 = 43`.

Ferme ensuite la fenêtre de choix ou la fenêtre de préparation sans lancer.

**Résultat attendu :**

- aucun jet n’est lancé ;
- aucune donnée n’est modifiée.

## T5 — Jets dérivés de combat

Ouvre le bloc **Combat** et clique successivement sur Corps à corps, Distance et Verbal.

Pour chaque jet, garde `Normal` et `0`, puis clique sur **Lancer les dés**.

**Résultat attendu :**

- chaque clic ouvre d’abord la fenêtre de préparation ;
- chaque validation lance un D100 ;
- la source du message correspond à la valeur dérivée choisie ;
- le malus d’état est soustrait à la valeur dérivée ;
- avec les données de Camille :
  - Corps à corps : `53 - 15 + 0 = 38` ;
  - Distance : `40 - 15 + 0 = 25` ;
  - Verbal : `27 - 15 + 0 = 12`.

Aucun jet de dégâts n’est déclenché.

## T6 — Avantage depuis le pré-lancer

Clique sur un Talent, sélectionne **Avantage** dans la fenêtre de préparation, laisse le Bonus / Malus à `0`, puis lance.

**Résultat attendu :**

- deux D100 naturels sont lancés ;
- le message indique les deux valeurs ;
- le résultat brut retenu est l’issue mécaniquement la plus favorable ;
- si les deux dés ont la même qualité, le plus petit est retenu ;
- le mode affiché dans le message est **Avantage**.

**Important pour cette tranche :** le total numérique de la carte native `2d100` est seulement le total technique des deux dés. La source de vérité est la ligne **Résultat final** du résumé D100.

## T7 — Désavantage depuis le pré-lancer

Clique sur un Talent, sélectionne **Désavantage**, laisse le Bonus / Malus à `0`, puis lance.

**Résultat attendu :**

- deux D100 naturels sont lancés ;
- le résultat brut retenu est l’issue mécaniquement la plus défavorable ;
- si les deux dés ont la même qualité, le plus grand est retenu ;
- le mode affiché est **Désavantage** ;
- un échec critique ne peut pas être écarté au profit d’un échec ordinaire.

Le prochain jet doit de nouveau proposer **Normal** par défaut.

## T8 — Application du malus d’état

Mets temporairement :

```text
Blessures : 0
Stress : 0
```

Clique sur **Endurance**.

**Résultat attendu :**

- le seuil final devient `60` :
  `Carrure 50 + Endurance 10 - malus 0`.

Remets ensuite :

```text
Blessures : 6
Stress : 9
```

Relance **Endurance**.

**Résultat attendu :**

- le seuil revient à `45` ;
- les changements sont enregistrés automatiquement ;
- la fiche ne remonte pas en haut.

## T9 — Qualifications observées

Sur les jets déjà produits, compare le résultat naturel et la qualification affichée.

**Résultat attendu :**

- `1` est une super réussite critique automatique ;
- `2 à 5` sont des réussites automatiques ;
- `96 à 98` sont des échecs automatiques ;
- `99` est un échec automatique critique ;
- `100` est un super échec critique ;
- un double entre `11` et `88` est critique selon qu’il réussit ou échoue ;
- les autres valeurs sont comparées au seuil final.

Il n’est pas nécessaire de relancer jusqu’à obtenir toutes ces valeurs : les vingt cas déterministes T01 à T20 sont couverts par les tests unitaires livrés.

## T10 — Accumulation du Destin

Dans le bloc **Développement**, mets le Destin à `0`.

Utilise de préférence le jet **Verbal**, dont le seuil est faible, jusqu’à obtenir un échec final sans intervention.

**Résultat attendu :**

- après l’échec final, le Destin passe de `0` à `5` ;
- un nouvel échec final sans intervention ajoute encore `5` ;
- la réserve ne dépasse jamais le plafond mondial ;
- la valeur est persistée sur l’Actor avant la publication du message de chat.

## T11 — Remise à zéro du Destin après réussite

Mets manuellement le Destin à `10`, puis effectue des jets jusqu’à obtenir une réussite finale.

**Résultat attendu :**

- après la réussite, le Destin revient à `0` ;
- aucune dépense volontaire du Destin n’est demandée ;
- le joueur et le MJ ne choisissent pas si le Destin intervient.

## T12 — Intervention visible du Destin

Dans les settings D100, mets temporairement :

```text
Probabilité de déclenchement : 100
Gain de Destin : 5
Plafond de Destin : 30
Réserve critique minimale : 15
```

Sur la fiche de Camille :

1. mets le Destin à `30` ;
2. utilise `Carrure + Endurance` en mode Normal ;
3. recommence si nécessaire jusqu’à obtenir un échec non automatique suffisamment proche du seuil ;
4. si une réussite remet la réserve à zéro, remets simplement le Destin à `30` avant le jet suivant.

**Résultat attendu lorsqu’une intervention devient possible :**

- le message indique discrètement que **le Destin est intervenu** ;
- le résultat final est corrigé ;
- le Destin passe à `0` ;
- le survol du résultat final affiche :
  `résultat brut / correction du Destin / résultat final` ;
- le message public ne montre ni le résultat du test secret, ni sa chance, ni son éligibilité détaillée ;
- aucune seconde écriture concurrente n’est produite par un double clic rapide.

Rétablis ensuite la probabilité à `80`.

## T13 — Permissions, persistance et stabilité

Avec un compte joueur propriétaire, lance un jet depuis un Talent.

**Résultat attendu :**

- le jet est autorisé ;
- le message apparaît ;
- le Destin du personnage peut être mis à jour.

Avec un compte non propriétaire, tente le même jet.

**Résultat attendu :**

- le jet est refusé ;
- une notification française indique l’absence de permission ;
- aucune carte et aucune modification de Destin ne sont produites.

Enfin :

1. ferme le monde ;
2. redémarre complètement Foundry ;
3. rouvre le monde et la fiche ;
4. vérifie le Destin et les messages précédents.

**Résultat attendu :**

- la réserve persistée est conservée ;
- les anciennes cartes techniques restent visibles ;
- la fiche s’ouvre normalement ;
- aucune erreur rouge liée à `interface` n’apparaît.

Sans second compte disponible, indique simplement :

```text
T13 permissions non testées ; persistance OK
```

## T14 — Vue observateur plate et repli local

Connecte-toi avec un compte **Observateur** sur Camille, puis ouvre sa fiche.

**Résultat attendu :**

- Nom, Âge, Profession, Compétences, Talents, Blessures, Stress, Destin, Spécialisations, Notes et XP sont affichés comme du texte, pas comme des champs modifiables ;
- aucun sélecteur Normal / Avantage / Désavantage n’est affiché ;
- aucun libellé de Compétence ou Talent ne réagit au survol et aucun jet ne peut être lancé ;
- les dérivés de combat ne sont pas des boutons ;
- les noms des armes et objets ne permettent pas d’ouvrir leur fiche ;
- aucun bouton `+`, `−`, création, enregistrement ou accusé de lecture n’est présent ;
- aucun glisser-déposer d’Item n’est accepté ;
- le curseur reste normal sur les zones non interactives.

Ouvre et ferme ensuite plusieurs sections repliables, par exemple **Talents**, **Combat**, **Inventaire** et **Notes**.

**Résultat attendu :**

- les sections restent repliables pour cet observateur ;
- leur état est propre à ce client et à cette fenêtre ;
- aucun Document, flag ou setting n’est modifié ;
- la fiche du propriétaire, ouverte simultanément sur un autre compte, ne change pas d’état ;
- fermer puis rouvrir la fiche observateur peut réinitialiser l’état local sans effet sur le personnage.


## T15 — Bonus positif et malus négatif

Avec Camille à Blessures `6` et Stress `9`, clique sur **Endurance**.

Premier jet :

```text
Mode : Normal
Bonus / Malus : 10
```

**Résultat attendu :**

- le seuil final est `55` :
  `50 + 10 - 15 + 10 = 55` ;
- la carte technique indique un modificateur `+10` ;
- la valeur n’est pas enregistrée sur Camille.

Deuxième jet :

```text
Mode : Normal
Bonus / Malus : -10
```

**Résultat attendu :**

- le seuil final est `35` :
  `50 + 10 - 15 - 10 = 35` ;
- la carte technique indique un modificateur `-10` ;
- rouvrir ensuite la fenêtre affiche de nouveau `0`.

## T16 — Annulation du pré-lancer

Clique sur un Talent puis ferme la fenêtre avec la croix, sans cliquer sur **Lancer les dés**.

**Résultat attendu :**

- aucun dé n’est lancé ;
- aucun message de chat n’est créé ;
- le Destin ne change pas ;
- la fiche reste utilisable.

## T17 — Pré-lancer sur le Combat

Clique sur **Corps à corps**.

Configure :

```text
Mode : Avantage
Bonus / Malus : 5
```

Lance les dés.

**Résultat attendu :**

- deux D100 sont lancés ;
- le mode est Avantage ;
- le seuil final est `43` :
  `53 - 15 + 5 = 43` ;
- aucun jet de dégâts n’est déclenché.

## T18 — Valeur temporaire et fiche allégée

Ferme puis rouvre la fiche de Camille.

**Résultat attendu :**

- le bandeau permanent de mode reste absent ;
- aucun choix précédent de mode ou Bonus / Malus n’a été persisté ;
- chaque nouvelle fenêtre de préparation repart sur `Normal` et `0` ;
- la position de défilement et l’enregistrement automatique de la fiche restent fonctionnels.

# Format de retour

```text
T1 OK
T2 OK
T3 OK, mais…
T4 NON : …
...
T13 OK
T14 OK
...
T18 OK
```

# Hors périmètre normal de cette tranche

- cartes de chat finales ;
- design final du halo du Destin ;
- dégâts d’armes ;
- initiative complète ;
- Dice So Nice ;
- progression assistée ;
- arbitrage automatique de l’avantage ou du désavantage ;
- socket ou autorité MJ distribuée ;
- compatibilité Foundry V15.

## T19 — Réglette à trois positions

Clique sur **Endurance** et observe la fenêtre de préparation.

**Résultat attendu :**

- le menu déroulant du mode de jet a disparu ;
- une réglette affiche, de gauche à droite :
  **Désavantage — Normal — Avantage** ;
- le curseur est placé au centre sur **Normal** à chaque nouvelle ouverture ;
- cliquer sur **Désavantage** déplace le curseur à gauche et applique une teinte rouge discrète ;
- cliquer sur **Avantage** déplace le curseur à droite et applique une teinte verte discrète ;
- cliquer sur **Normal** replace le curseur au centre ;
- la réglette est utilisable au clavier avec Tabulation puis les flèches ;
- le champ Bonus / Malus et le bouton **Lancer les dés** restent présents.

Ferme la fenêtre sans lancer puis rouvre-la.

**Résultat attendu :**

- la réglette revient sur **Normal** ;
- le Bonus / Malus revient à `0`.

## T20 — Régression du lancement

Effectue trois jets depuis **Endurance** :

```text
Jet 1 : Désavantage, Bonus / Malus 0
Jet 2 : Normal, Bonus / Malus 5
Jet 3 : Avantage, Bonus / Malus -5
```

**Résultat attendu :**

- Désavantage lance deux D100 et retient l’issue mécaniquement défavorable ;
- Normal lance un seul D100 et utilise un seuil de `50` avec Camille :
  `50 + 10 - 15 + 5 = 50` ;
- Avantage lance deux D100 et utilise un seuil de `40` :
  `50 + 10 - 15 - 5 = 40` ;
- la carte technique indique le mode et le modificateur réellement sélectionnés ;
- le Destin et les autres règles continuent de fonctionner normalement ;
- aucune erreur rouge ne cite `systems/interface/`.



## T21 — Glissement réel de la réglette

Clique sur **Endurance** pour ouvrir la fenêtre de préparation.

1. place la souris sur le curseur central de la réglette ;
2. maintiens le bouton gauche ;
3. fais glisser le curseur jusqu’à **Désavantage** ;
4. sans fermer la fenêtre, fais-le ensuite glisser jusqu’à **Avantage** ;
5. relâche la souris ;
6. saisis `-5` dans Bonus / Malus et lance le jet.

**Résultat attendu :**

- le curseur suit le déplacement de la souris ;
- la position active change pendant le glissement ;
- la réglette se verrouille sur l’une des trois positions seulement ;
- le mode final est **Avantage** ;
- deux D100 sont lancés ;
- le seuil final est `40` avec Camille :
  `50 + 10 - 15 - 5 = 40` ;
- le clic simple sur les trois libellés fonctionne toujours ;
- la navigation clavier fonctionne toujours ;
- aucune erreur rouge ne cite `systems/interface/`.

Rouvre ensuite une nouvelle fenêtre de préparation.

**Résultat attendu :**

- le curseur revient au centre sur **Normal** ;
- Bonus / Malus revient à `0`.
