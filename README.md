# DEV-interface

Dépôt de développement du **Système D100 Interface** pour Foundry VTT.

```text
Identifiant technique : interface
Dépôt                : ctotone/DEV-interface
Branche              : main
Version package      : 0.1.0
Version schéma       : 1
Dernier commit inclus:
0852b3f62fafd2f0128a5ad8e3170eb791aebe39
```

Le commit de clôture de la phase 03 sera renseigné après intégration et push par l’utilisateur.

## Statut

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase 02 — Architecture Foundry : VALIDÉE
Phase 03 — Première tranche jouable : VALIDÉE
Phase 04 — États, Destin et réglages MJ : PROCHAINE, À RECALIBRER
Publication : NON ENGAGÉE
```

## Base jouable actuelle

La version `0.1.0` comprend :

- un système installable sous Foundry VTT V14 ;
- un Actor `character` et un Item `equipment` ;
- les six Compétences et dix-huit Talents ;
- Blessures, Stress, Destin et progression ;
- les valeurs dérivées ;
- les settings mondiaux ;
- les équipements ordinaires et les armes ;
- le moteur D100 normal, avantage et désavantage ;
- les résultats automatiques, critiques et super-critiques ;
- le Destin et les marges ;
- un assistant de création de personnage ;
- une fiche Actor et une fiche Item utilisables ;
- des assets WebP par défaut ;
- un premier rendu technique des jets dans le chat.

## Validation de phase 03

```text
Tranches 1, 2, 2B, 3 et 3B : VALIDÉES
Tests Foundry utilisateur T1 à T35 : OK
Contrôles hors Foundry : 390 OK
Modules JavaScript vérifiés : 22
Tests unitaires : 3
```

Les protocoles et rapports techniques sont conservés dans :

```text
.project/reports/
tests/protocols/
```

## Architecture

```text
Foundry supporté : génération V14
Build testée      : 14.365
Manifest          : minimum 14 / verified 14 / maximum 14
Actor             : character
Item              : equipment
Catégories Item   : ordinary | weapon
```

Principes :

- TypeDataModels V14 ;
- moteur D100 pur et testable ;
- données persistées séparées des données dérivées ;
- settings et flags sous `interface` ;
- Dice So Nice facultatif ;
- migrations internes uniquement ;
- aucun import Roll20 ;
- aucune automatisation tactique ou narrative.

## Décisions de phase 03

La phase a notamment validé :

- `flags.interface.creation.pending` pour les créations non finalisées ;
- la sauvegarde progressive sur l’Actor réel ;
- les Compétences non cliquables dans l’interface ;
- les jets depuis les Talents et valeurs dérivées ;
- la séparation visuelle entre Armes et Inventaire ;
- la suppression confirmée des équipements ;
- les images WebP par défaut ;
- une première adaptation ergonomique de la fiche.

Document d’autorité :

```text
.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
```

## Autorités documentaires

```text
.project/specification/
├── PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
├── PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
└── PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
```

```text
.project/decisions/
├── PHASE_00B_CADRAGE_PRODUIT_ET_DEPOT.md
├── PHASE_01_PERSONNAGE_EQUIPEMENT_CONFLITS.md
├── PHASE_02_ARCHITECTURE_FOUNDRY.md
└── PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
```

La référence historique des règles est désormais disponible en Markdown :

```text
.project/references/systeme de jeu Interface.md
```

## Organisation

```text
.project/       mémoire, décisions, spécifications et rapports
assets/         images du système
lang/           localisation française
scripts/        données, Documents, règles, services et applications
styles/         styles du système
templates/      feuilles et settings
tests/          contrôles, tests unitaires et protocoles Foundry
```

## Travail restant

Les phases suivantes doivent encore traiter ou finaliser :

- le périmètre résiduel des états, du Destin et des settings ;
- les cartes de chat finales ;
- l’initiative ;
- les dégâts ;
- la progression assistée ;
- Dice So Nice ;
- la stabilisation multijoueur ;
- l’identité visuelle finale ;
- la préparation de diffusion.

## Reprise

Lire dans cet ordre :

```text
.project/TRANSMISSION_CURRENT.md
.project/PROJECT_STATE.md
.project/ROADMAP.md
.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
```

Avant tout nouveau développement, recalibrer les phases 04 à 06 afin de ne pas reproduire les éléments déjà validés en phase 03.
