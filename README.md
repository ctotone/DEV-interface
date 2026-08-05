# DEV-interface

Dépôt de développement du **Système D100 Interface** pour Foundry VTT.

```text
Identifiant technique : interface
Dépôt                : ctotone/DEV-interface
Branche              : main
Base de référence    :
ba2871fb2f5ec175b525535f0d31e8f3426a1b23
```

## Statut

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase 02 — Architecture Foundry : VALIDÉE
Phase 03 — Première tranche jouable : EN COURS
Tranche 1 — Squelette installable : VALIDÉE SOUS FOUNDRY 14.365
Tranche 2 — Données et dérivés : CANDIDATE EN ATTENTE DE TEST
Développement Foundry : EN COURS
```

## Candidate actuelle — Tranche 2

La version locale `0.1.0` ajoute au squelette validé :

- états Blessures et Stress ;
- malus d’état mondial ;
- Corps à corps, Distance et Verbal ;
- valeur dérivée personnalisée ;
- bonus d’initiative préparé ;
- diagnostics souples de création ;
- Inventaire et Armes fondés sur les Items embarqués ;
- création et ouverture d’équipements depuis la fiche Actor ;
- tests unitaires des calculs purs.

Les données dérivées sont préparées en mémoire et ne modifient pas le schéma persisté validé.

Installation et test :

```text
tests/protocols/TRANCHE_2_FOUNDRY_V14_365.md
```

Contrôle hors Foundry :

```text
node tests/static/check-project.mjs
```

La Tranche 2 n’est pas validée avant le test réel et la validation explicite de l’utilisateur.

## Première version jouable

La première version doit permettre de :

- créer et gérer un personnage ;
- effectuer les jets D100 principaux ;
- appliquer Blessures, Stress et Destin ;
- utiliser les valeurs dérivées et une initiative simple ;
- gérer l’équipement et les armes ;
- produire les cartes de résultat et les jets de dégâts ;
- jouer une scène de conflit sans moteur tactique complet.

Le système n’automatise ni le ciblage, ni la défense, ni l’armure, ni l’application des dégâts, ni les conséquences narratives.

## Architecture validée

```text
Foundry supporté     : génération V14
Build initiale test  : 14.365
Manifest             : minimum 14 / verified 14 / maximum 14
Actor                : character
Item                 : equipment
Catégories Item      : ordinary | weapon
Version package      : 0.1.0
Version schéma       : 1
```

Principes :

- TypeDataModels V14 ;
- moteur D100 pur et testable ;
- données persistées séparées des données dérivées ;
- settings et flags sous le namespace `interface` ;
- projections publique et MJ séparées ;
- Dice So Nice facultatif ;
- migrations internes uniquement ;
- aucun socket, compendium ou framework ajouté sans besoin démontré.

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
└── PHASE_02_ARCHITECTURE_FOUNDRY.md
```

## Organisation

```text
.project/
├── PROJECT_STATE.md
├── ROADMAP.md
├── TRANSMISSION_CURRENT.md
├── decisions/
├── reports/
├── specification/
└── references/
```

`.project/` contient la mémoire interne du projet et devra être exclu des futures archives de distribution.

## Conventions d’échange

- une différence de hash entre un document, une archive et le dépôt peut être normale dans le cycle ZIP → intégration → commit → push ;
- un suffixe automatique comme `interface(3).zip` ne représente pas une version fonctionnelle ;
- les archives entrantes peuvent contenir `.git/` et `.gitignore`, qui sont ignorés silencieusement ;
- les archives de travail restituées excluent `.git/` et `.gitignore` ;
- sauf indication explicite, l’utilisateur ne modifie pas le contenu d’une archive restituée avant son intégration.

## Reprise

Ordre de lecture :

1. `.project/TRANSMISSION_CURRENT.md`
2. `.project/PROJECT_STATE.md`
3. `.project/ROADMAP.md`
4. la décision de la phase active ;
5. les spécifications concernées.
