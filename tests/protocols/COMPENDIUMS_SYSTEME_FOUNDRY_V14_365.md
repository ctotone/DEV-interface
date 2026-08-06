# Redémarrage Foundry

## Préparation

1. Fermer le monde.
2. Quitter complètement Foundry VTT.
3. Remplacer le dossier `Data/systems/interface/` par la candidate complète.
4. Relancer Foundry VTT 14.365.
5. Ouvrir un monde utilisant le système Interface avec un compte MJ.
6. Ouvrir la console F12 et la laisser visible pendant T1.

## T1 — Chargement du système

**Action :** ouvrir le monde puis l’onglet Compendiums.

**Résultat attendu :** aucune erreur rouge liée à `interface`, `objects`,
`weapons`, LevelDB ou aux images.

## T2 — Titres et bannières

**Action :** repérer les deux compendiums du système.

**Résultat attendu :**

```text
Objets
Armes
```

Chaque compendium affiche sa bannière propre.

## T3 — Organisation des dossiers

**Action :** ouvrir les deux compendiums.

**Résultat attendu :**

```text
Objets
├── EXPLORATION, ORIENTATION
├── CAMPEMENT ET SURVIE
├── OUTILS
├── SOINS ET PROTECTION
├── COMMUNICATION
├── INVESTIGATION
├── INFILTRATION
└── ÉQUIPEMENT TECHNIQUE

Armes
├── ARMES ANCIENNES
├── ARMES MODERNES
└── ARMES FUTURISTES
```

## T4 — Comptage et arbitrage Mitrailleuse

**Action :** contrôler les totaux et rechercher « Mitrailleuse ».

**Résultat attendu :**

```text
Objets : 60 entrées
Armes  : 42 entrées
Entrée : Mitrailleuse lourde
Formule : 3D6+1
```

Aucune entrée « Mitrailleuse légère ».

## T5 — Ouverture des entrées

**Action :** ouvrir au moins :

- Corde ;
- Trousse de premiers secours ;
- Épée ou sabre ;
- Mitrailleuse lourde ;
- Canon électromagnétique lourd.

**Résultat attendu :** nom, image, catégorie, quantité, description et formule
des armes sont correctement affichés. Les objets ordinaires n’affichent pas de
formule de dégâts.

## T6 — Glisser-déposer d’un objet

**Action :** glisser « Corde » vers une fiche de personnage propriétaire.

**Résultat attendu :** une copie apparaît uniquement dans Inventaire avec
quantité 1, image et description correctes.

## T7 — Glisser-déposer d’une arme

**Action :** glisser « Épée ou sabre » vers la même fiche.

**Résultat attendu :** une copie apparaît uniquement dans Armes avec quantité 1,
image, description et formule `1D8+1`.

## T8 — Indépendance des copies

**Action :** renommer les deux copies sur l’Actor puis supprimer l’une d’elles.

**Résultat attendu :** les entrées originales des compendiums restent inchangées
et la suppression ne concerne que l’Item embarqué.

## T9 — Redémarrage du monde

**Action :** fermer puis rouvrir le monde.

**Résultat attendu :** les deux compendiums, leurs dossiers, bannières et
102 entrées restent accessibles sans erreur.

## T10 — Monde neuf

**Action :** créer ou ouvrir un monde neuf utilisant uniquement Interface.

**Résultat attendu :** les deux compendiums système sont présents immédiatement
et le glisser-déposer d’un objet et d’une arme fonctionne.

## Validation précédente

Les tests `T1` à `T10` ont été validés par l’utilisateur sous Foundry VTT 14.365.
Ils restent acquis pour ce correctif.

## T11 — Descriptions sans balises visibles

**Action :** ouvrir plusieurs entrées dans les deux compendiums, notamment :

- Carte ;
- Trousse de premiers secours ;
- Épée ou sabre ;
- Mitrailleuse lourde.

**Résultat attendu :** la description contient uniquement le texte du catalogue.
Aucune balise littérale `<p>` ou `</p>` n’est visible avant ou après le texte.
Le glisser-déposer conserve cette description en texte brut sur la copie embarquée.

## Retour ciblé attendu

```text
T11 OK
```
