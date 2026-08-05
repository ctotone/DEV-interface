# Phase 03 — Tranche 2B — Candidate d’adaptation visuelle

## Statut

```text
Candidate technique : produite
Foundry ciblé        : 14.365
Version package      : 0.1.0
Version schéma       : 1 — inchangée
Test réel Foundry    : non effectué par GPT Foundry
Validation utilisateur : en attente
```

## Périmètre réalisé

- adaptation de la disposition historique à une feuille Foundry V14 ;
- groupes visuels rouge, jaune et bleu pour les Compétences ;
- reprise des couleurs sur les Talents associés ;
- bandeau noir Blessures / Initiative / Stress ;
- informations de développement identifiées comme temporaires ;
- blocs repliables Talents, Combat, Spécialisations, Inventaire et Notes ;
- section de développement repliable et fermée par défaut ;
- bandeau Expérience non repliable ;
- affichage de la jauge `0–3` et des neuf cases déjà présentes dans le schéma ;
- enregistrement automatique des feuilles Actor et Item ;
- conservation des sections ouvertes ou fermées pendant les rerendus ;
- maintien du bouton manuel d’enregistrement comme secours ;
- adaptation responsive élémentaire.

## Invariants protégés

- identifiant `interface` ;
- version `0.1.0` ;
- compatibilité V14 uniquement ;
- Actor.type unique `character` ;
- Item.type unique `equipment` ;
- catégories `ordinary` et `weapon` ;
- schéma persisté inchangé ;
- aucune migration ;
- aucune règle métier ajoutée ;
- aucun moteur D100 ;
- aucun Destin opérationnel ;
- aucune automatisation des gains d’XP ;
- aucun socket, flag, setting ou framework ajouté.

## Fichiers modifiés

```text
lang/fr.json
scripts/applications/character-sheet.mjs
scripts/applications/equipment-sheet.mjs
scripts/constants.mjs
styles/interface.css
templates/actor/character-sheet.hbs
templates/item/equipment-sheet.hbs
tests/static/check-project.mjs
tests/static/smoke-import.mjs
```

## Fichiers ajoutés

```text
.project/reports/PHASE_03_TRANCHE_2B_CANDIDATE.md
tests/protocols/TRANCHE_2B_FOUNDRY_V14_365.md
```

## Fichiers supprimés

```text
Aucun.
```

## Contrôles hors Foundry

Commande :

```text
node tests/static/check-project.mjs
```

Résultat obtenu sur la source :

```text
OK — 173 contrôles hors Foundry réussis.
Modules JavaScript vérifiés : 12.
Tests unitaires exécutés : 1.
Chargement isolé et enregistrements init simulés : OK.
```

Les contrôles couvrent notamment :

- validité du manifeste et des JSON ;
- syntaxe des modules ;
- résolution des imports ;
- chargement isolé du point d’entrée ;
- schéma persisté inchangé ;
- groupes de couleur ;
- associations Compétences / Talents ;
- auto-enregistrement Actor et Item ;
- sections repliables ;
- conservation de leur état pendant un rerendu simulé ;
- bandeau États / Initiative ;
- jauge et neuf cases de progression ;
- élément racine unique des templates ;
- clés françaises ;
- absence de socket, dépendance et code externe.

## Non vérifiable hors Foundry

- rendu réel dans le thème Foundry ;
- comportement exact aux différentes tailles de fenêtre ;
- déclenchement réel de l’auto-enregistrement ;
- persistance après fermeture et redémarrage ;
- conservation visuelle du scroll et des blocs dans le client ;
- drag-and-drop réel des Items ;
- permissions en environnement réel ;
- confort d’usage et validation esthétique.

## Limites connues

- les informations de développement sont encore visibles ;
- l’assistant de création séparé n’existe pas ;
- les gains d’XP restent déclaratifs ;
- le bouton manuel d’enregistrement est conservé ;
- aucun design final des cartes de chat ou des jets n’est inclus ;
- aucun test réel dans Foundry n’est revendiqué.


## Correctif 1

- activation du redimensionnement des fiches Actor et Item ;
- correction de la couleur du titre **Armes** ;
- correction de la couleur des noms des armes et objets dans les listes embarquées.
