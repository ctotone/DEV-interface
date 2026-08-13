# État du projet — Système D100 Interface

**Dernière mise à jour :** 13 août 2026
**Statut global :** Phase 06 validée et clôturée — Phase 07 prochaine
**Coordinateur :** GPT Pilote  
**Spécialiste technique principal :** GPT Foundry  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Commit de clôture de la phase 03 :** `72a2d32ff51661e548f3900792fca263e8b75b98`  
**Commit d’intégration du complément compendiums :** `cf83489710fce2e186b0f78bbc25bcdbaf791dec`  
**Commit de clôture de la phase 04 :** `a56d68838a93398fffdb35aa7ee9feed3eb5dc71`  
**Commit pré-test Phase 05 observé :** `0fe3cdbe35e42d4f1c891640a033c1ca02bf98d4`  
**Commit de clôture documentaire Phase 05 :** à communiquer après intégration et push  
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
Phase 05 — Conflits, initiative et armes : VALIDÉE
Phase 06 — Ergonomie et identité visuelle : VALIDÉE ET CLÔTURÉE
Phase 07 — Tests et stabilisation : PROCHAINE
Phase 08 — Préparation de diffusion : PLANIFIÉE, NON ENGAGÉE
```

## État technique réel

Le système est installable sous Foundry VTT V14 et la base de test réelle documentée reste le build `14.365`.

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
- cartes de chat D100 fonctionnelles ;
- projection publique / MJ filtrée ;
- snapshots d’armes ;
- sélecteur de dégâts réutilisable ;
- dégâts normaux et maximum ;
- forçage MJ après échec ;
- initiative native complète depuis la fiche ;
- deux compendiums validés et reconstructibles, actuellement désactivés pendant le développement.

## Phase 05 — résultat

```text
Développement : TERMINÉ
Validation fonctionnelle utilisateur : OUI
Contrôles hors Foundry : 762 OK
Modules JavaScript vérifiés : 29
Tests unitaires : 4
Test multijoueur simultané F2 : NON EXÉCUTÉ
Publication : NON
```

Le test F2 reste explicitement non validé et est reporté à la Phase 07.

## Compendiums — mode développement

Les compendiums restent validés mais temporairement inactifs :

```text
system.json
→ aucune propriété packs

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

### Phase 06

À recalibrer en tenant compte de l’existant :

- identité visuelle finale ;
- cohérence visuelle fiche / cartes ;
- affinage du halo Destin ;
- accessibilité et lisibilité ;
- responsive et finitions ;
- éventuel arbitrage sur la persistance des thèmes uniquement si un choix de thème utilisateur est réellement introduit.

### Phase 07

- tests fonctionnels globaux ;
- non-régression ;
- permissions et sauvegarde/rechargement ;
- multijoueur ;
- test simultané F2 ;
- concurrence ;
- correction des blocages.

### Phase 08

- préparation de diffusion ;
- réactivation et reconstruction des compendiums ;
- contrôles avant candidate / release `1.0.0` ;
- publication uniquement après décision utilisateur.

## Sources d’autorité principales

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
.project/decisions/PHASE_04_ETATS_DESTIN_REGLAGES_MJ.md
.project/decisions/PHASE_05_CARTES_CHAT_ERGONOMIE.md
.project/decisions/PHASE_05_CONFLITS_INITIATIVE_ARMES.md
.project/decisions/GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md
```

## Prochaine étape

Après le commit de clôture de la Phase 05, cadrer et recalibrer la Phase 06 à partir de la base réelle.


## Phase 06 — clôture

```text
Design : VALIDÉ
Intégration : TERMINÉE
Validation utilisateur Foundry : OUI
Contrôles hors Foundry : 790 OK
Modules JavaScript : 29
Tests unitaires : 5
F2 multijoueur simultané : NON TESTÉ
Publication : NON
```

Le REX ciblé Foundry sur la valeur de GPT Visuel est une activité d'architecture IA séparée et non bloquante pour le projet.

## Prochaine phase

Phase 07 — Tests et stabilisation.
