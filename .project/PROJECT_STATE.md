# État du projet — Système D100 Interface

**Dernière mise à jour :** 7 août 2026  
**Statut global :** Phase 04 validée — Phase 05 prochaine, à recalibrer  
**Coordinateur :** GPT Pilote  
**Spécialiste principal :** GPT Foundry  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Commit de clôture de la phase 03 :** `72a2d32ff51661e548f3900792fca263e8b75b98`  
**Commit d’intégration du complément compendiums :** `cf83489710fce2e186b0f78bbc25bcdbaf791dec`  
**Base de départ de la phase 04 :** `386c71c5e73f9d9833905430c6d341344cfaf717`  
**Commit technique observé après arbitrage compendiums :** `eb6dc6196a71e3413f851d876a1b617dba3938af`  
**Commit de clôture documentaire de la phase 04 :** à communiquer après intégration et push  
**Identifiant technique :** `interface`  
**Version package :** `0.1.0`  
**Version de schéma :** `1`

## Finalité

Créer un système Foundry VTT générique, léger et orienté narration pour le Système D100 Interface.

## État des phases

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase 02 — Architecture Foundry : VALIDÉE
Phase 03 — Première tranche jouable : VALIDÉE ET CLÔTURÉE
Complément post-clôture — Compendiums d’armes et d’objets : VALIDÉ
Phase 04 — États, Destin et réglages MJ : VALIDÉE
Phase 05 — Conflits, initiative et armes : PROCHAINE, PÉRIMÈTRE À RECALIBRER
Phase 06 — Ergonomie et identité visuelle : PLANIFIÉE, SOCLE PARTIELLEMENT ANTICIPÉ
Phase 07 — Tests et stabilisation : PLANIFIÉE
Phase 08 — Préparation de diffusion : PLANIFIÉE, NON ENGAGÉE
```

## État technique réel

Le système est installable sous Foundry VTT V14 et la base de test réelle reste le build `14.365`.

Sont actuellement produits :

- Actor `character` et Item `equipment` ;
- six Compétences et dix-huit Talents ;
- Blessures, Stress, Destin et progression persistés ;
- valeurs dérivées et malus d’état ;
- settings monde ;
- moteur D100 normal, avantage et désavantage ;
- automatiques, critiques, super-critiques, Destin et marges ;
- assistant de création ;
- fiche Actor et fiche Item ;
- sections Inventaire et Armes ;
- formules de dégâts persistées sur les armes ;
- deux compendiums validés et reconstructibles.

## Phase 04 — résultat

```text
Audit de complétude : TERMINÉ
Lacunes fonctionnelles : AUCUNE
Patch fonctionnel requis : NON
Contrôles hors Foundry : 708 OK
Tests Foundry antérieurs pertinents : VALIDÉS
```

Arbitrages validés :

- confidentialité actuelle du D100 secret Destin acceptée ;
- comportement après baisse du plafond Destin accepté.

## Compendiums — mode développement

Les compendiums restent validés mais sont temporairement inactifs pendant le développement.

```text
system.json
→ aucune propriété packs pendant le développement

packs-src/
→ source d’autorité du contenu

packs/
→ artefacts LevelDB conservés et versionnés

avant candidate / release 1.0.0
→ réactivation
→ reconstruction
→ contrôles
→ tests Foundry
```

Identifiants structurants :

```text
interface.objects
interface.weapons
```

## Conventions de livraison

Les ZIP techniques doivent exclure :

```text
.git/
.gitignore
TODO_evilbram.md
```

`TODO_evilbram.md` est personnel à l’utilisateur et n’est jamais une source d’autorité.

## Éléments ouverts

### Phase 05

- initiative complète ;
- cartes de chat fonctionnelles ;
- sélection des armes depuis le chat ;
- dégâts normaux et maximum ;
- permissions et réutilisation des actions ;
- tests de conflit sans automatisation tactique.

### Plus tard

- identité visuelle finale ;
- progression assistée ;
- Dice So Nice ;
- migrations ;
- concurrence multijoueur globale ;
- stabilisation ;
- publication.

## Sources d’autorité

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
.project/decisions/COMPENDIUMS_SYSTEME_OBJETS_ARMES.md
.project/decisions/GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md
.project/decisions/PHASE_04_ETATS_DESTIN_REGLAGES_MJ.md
```

## Prochaine étape

Après le commit de clôture de la Phase 04, recalibrer la Phase 05 à partir de la base réelle avant tout nouveau développement.
