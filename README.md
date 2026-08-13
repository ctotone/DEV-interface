# DEV-interface

Dépôt de développement du **Système D100 Interface** pour Foundry VTT.

```text
Identifiant technique              : interface
Dépôt                              : ctotone/DEV-interface
Branche                            : main
Version package                    : 0.1.0
Version schéma                     : 1
Commit de clôture de la phase 03   : 72a2d32ff51661e548f3900792fca263e8b75b98
Commit d’intégration compendiums   : cf83489710fce2e186b0f78bbc25bcdbaf791dec
Commit de clôture Phase 04         : a56d68838a93398fffdb35aa7ee9feed3eb5dc71
Commit pré-test Phase 05 observé   : 0fe3cdbe35e42d4f1c891640a033c1ca02bf98d4
Commit de clôture Phase 05         : à communiquer après push
```

Le commit de clôture historique de la phase 03 est fixé. Le complément compendiums attend son propre commit d’intégration.

## Statut

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase 02 — Architecture Foundry : VALIDÉE
Phase 03 — Première tranche jouable : VALIDÉE ET CLÔTURÉE
Complément post-clôture — Compendiums : VALIDÉ
Phase 04 — États, Destin et réglages MJ : VALIDÉE
Phase 05 — Conflits, initiative et armes : VALIDÉE
Phase 06 — Ergonomie et identité visuelle : VALIDÉE ET CLÔTURÉE
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
- deux compendiums système natifs : **Objets** et **Armes** ;
- 60 objets ordinaires et 42 armes illustrés ;
- des cartes D100 fonctionnelles dans le chat ;
- des cartes de dégâts réutilisables ;
- des snapshots d’armes ;
- des dégâts normaux et maximum ;
- un forçage MJ après échec ;
- une initiative native complète depuis la fiche.


## Compendiums système

Les deux compendiums restent fonctionnellement validés mais sont **désactivés pendant le développement** afin d’éviter les réécritures LevelDB parasites dans Git.

```text
Objets  : interface.objects
Armes   : interface.weapons

Source d’autorité : packs-src/
Builder           : tools/build-compendiums.mjs
Artefacts          : packs/
Manifeste dev      : aucune propriété packs
```

Avant candidate / release `1.0.0`, ils devront obligatoirement être réactivés, reconstruits, contrôlés et testés sous Foundry.

Décision d’autorité :

```text
.project/decisions/GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md
```

## Validations

```text
Phase 03
- Tranches 1, 2, 2B, 3 et 3B : VALIDÉES
- Tests Foundry utilisateur T1 à T35 : OK

Complément compendiums
- Tests Foundry utilisateur T1 à T11 : OK
- Contrôles hors Foundry : 718 OK
- Modules JavaScript vérifiés : 22
- Tests unitaires : 3
```

Les protocoles et rapports techniques sont conservés dans :

```text
.project/reports/
tests/protocols/
```


### Phase 04

```text
Audit de complétude : TERMINÉ
Lacunes fonctionnelles : AUCUNE
Patch fonctionnel : AUCUN
Contrôles hors Foundry : 708 OK
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
├── PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
├── COMPENDIUMS_SYSTEME_OBJETS_ARMES.md
├── GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md
├── PHASE_04_ETATS_DESTIN_REGLAGES_MJ.md
├── PHASE_05_CARTES_CHAT_ERGONOMIE.md
└── PHASE_05_CONFLITS_INITIATIVE_ARMES.md
```

La référence historique des règles est désormais disponible en Markdown :

```text
.project/references/systeme de jeu Interface.md
```

## Organisation

```text
.project/       mémoire, décisions, spécifications et rapports
assets/         images du système
packs/          compendiums LevelDB installables
packs-src/      sources JSON humaines des compendiums
lang/           localisation française
scripts/        données, Documents, règles, services et applications
styles/         styles du système
templates/      feuilles et settings
tests/          contrôles, tests unitaires et protocoles Foundry
```

## Travail restant

### Phase 06 — prochaine

- recalibrer l’existant ergonomique et visuel ;
- identité visuelle finale ;
- cohérence fiche / cartes ;
- halo Destin ;
- accessibilité et lisibilité ;
- responsive et finitions ;
- éventuel choix persistant de thème uniquement si réellement nécessaire.

### Phase 07

- tests globaux ;
- non-régression ;
- multijoueur et concurrence ;
- test simultané F2 non exécuté en Phase 05.

### Avant release 1.0.0

- réactiver les deux compendiums ;
- reconstruire les packs ;
- exécuter les contrôles ;
- tester sous Foundry ;
- préparer seulement ensuite la candidate / release.

## Reprise

Lire dans cet ordre :

```text
.project/TRANSMISSION_CURRENT.md
.project/PROJECT_STATE.md
.project/ROADMAP.md
.project/decisions/PHASE_05_CONFLITS_INITIATIVE_ARMES.md
.project/decisions/PHASE_05_CARTES_CHAT_ERGONOMIE.md
```

Après le commit de clôture Phase 05, ouvrir la Phase 06 par un audit de l’existant ergonomique et visuel.
