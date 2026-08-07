# Phase 05 — Cartes de chat : ergonomie et extensibilité visuelle

**Date :** 7 août 2026  
**Statut :** décision utilisateur intégrée à la Phase 05  
**Base de travail :** `a56d68838a93398fffdb35aa7ee9feed3eb5dc71`

## 1. Carte D100

La carte publique utilise une hauteur naturelle et contient :

- portrait de l’Actor ;
- nom de l’Actor ;
- nom du jet avec son score total entre parenthèses ;
- aucun détail `Compétence + Talent` dans le nom public du jet ;
- ligne `Malus (xx)` uniquement si le malus total est non nul ;
- résultat final D100 mis en avant ;
- qualification ;
- marge uniquement si sa valeur est supérieure à `0`.

Le survol du malus affiche uniquement les composantes non nulles :

```text
Blessure : xx | Stress : xx | Malus de jet : xx
```

Le survol du résultat affiche :

- en avantage / désavantage : les deux résultats naturels ;
- lorsque le Destin intervient : le résultat initial et la correction appliquée.

Lorsque le Destin intervient, la carte reçoit un halo bleu discret.

Couleurs fonctionnelles validées :

```text
échec critique                    #ff0000
échec normal / échec automatique  #ff006f
super échec critique (100)        #dc00c9
réussite normale / automatique    #009700
réussite critique                 #0082ff
super réussite critique (1)       #fffe00
```

Pour un jet standard, le nom public du jet est le Talent sélectionné ; le calcul conserve naturellement la Compétence associée dans la source technique.

## 2. Carte de dégâts

La carte de dégâts est un ChatMessage indépendant du jet D100 initial.

Elle est créée :

- automatiquement après une réussite de conflit ;
- après un échec uniquement lorsque le MJ utilise `Permettre les dégâts`.

L’en-tête conserve la même logique que la carte D100 :

```text
portrait
nom du personnage
Jet de dégâts
```

La liste d’armes reste affichée après résolution.

Un nouveau clic sur une arme :

- effectue un nouveau jet ;
- ne verrouille pas la carte ;
- remplace visuellement le dernier résultat affiché dans cette carte.

Après critique ou super-critique réussi, le clic sur une arme ouvre un petit dialogue proposant :

```text
Dégâts normaux
Dégâts maximum
```

Avant tout jet de dégâts, la zone résultat affiche :

```text
En attente du jet
```

Le résultat affiche :

```text
XX dégâts
```

## 3. Snapshots et réutilisation

Après réussite, la carte de dégâts utilise le snapshot créé au moment du jet de conflit.

Après échec forcé par le MJ, le snapshot est créé depuis les armes actuelles de l’Actor au moment du clic.

Une carte historique ne relit donc pas l’Item d’origine pour sa formule de dégâts.

Les permissions sont revérifiées à chaque clic.

## 4. Projection technique du dernier résultat

Afin de préserver le comportement multijoueur sans introduire de socket ni exiger qu’un joueur puisse modifier un ChatMessage créé par un autre utilisateur :

- le sélecteur d’armes reste un ChatMessage `weapon-selector` ;
- chaque activation crée un ChatMessage natif `damage-result` lié au sélecteur ;
- lorsqu’un sélecteur existe, son dernier `damage-result` est projeté visuellement dans la zone résultat du sélecteur ;
- les enregistrements `damage-result` liés sont masqués comme cartes séparées dans le chat ;
- si le sélecteur parent n’existe plus, le `damage-result` reste capable d’être affiché seul.

Cette structure conserve l’historique technique de chaque jet tout en respectant l’ergonomie validée : une seule carte de dégâts visible et réutilisable.

## 5. Portrait

La source normale est :

```text
actor.img
```

Fallback défensif :

```text
systems/interface/assets/actor/avatar-default.webp
```

Le fichier existe dans le système.

## 6. Skins / thèmes futurs

La Phase 05 ne crée qu’un thème :

```text
default
```

La structure doit cependant permettre qu’un futur thème d’Actor soit réutilisé par :

- la fiche de personnage ;
- les cartes de chat produites pour cet Actor.

Aucune donnée persistée n’est ajoutée maintenant :

- aucun setting ;
- aucun flag ;
- aucune clé de DataModel ;
- aucune migration.

Le choix futur de la source de vérité du thème sera arbitré séparément avant implémentation.

La Phase 05 expose uniquement un point de résolution de thème et `data-interface-theme` dans les représentations concernées.
