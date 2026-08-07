# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 7 août 2026  
**Coordinateur :** GPT Pilote  
**Spécialiste principal de la prochaine phase :** GPT Foundry  
**Identifiant technique :** `interface`  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Version package :** `0.1.0`  
**Version schéma :** `1`

## Statut

```text
Phases 00A à 04 : VALIDÉES
Complément compendiums : VALIDÉ
Phase 05 : PROCHAINE — À RECALIBRER
Publication : NON ENGAGÉE
```

## Base de reprise

```text
Base de départ Phase 04 :
386c71c5e73f9d9833905430c6d341344cfaf717

Commit technique observé après mise en place du protocole compendiums :
eb6dc6196a71e3413f851d876a1b617dba3938af

Commit de clôture documentaire Phase 04 :
à communiquer après intégration et push utilisateur
```

Après le prochain push, le nouveau hash remplacera l’archive comme base distante de reprise.

## Ordre de lecture

1. présent fichier ;
2. `.project/PROJECT_STATE.md` ;
3. `.project/ROADMAP.md` ;
4. `.project/decisions/PHASE_04_ETATS_DESTIN_REGLAGES_MJ.md` ;
5. `.project/decisions/GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md` ;
6. spécifications 00A, 01 et 02 selon le sujet.

## État stable

- États Blessures / Stress conformes ;
- malus d’état conforme ;
- settings monde conformes ;
- Destin conforme ;
- persistance et permissions du domaine conformes ;
- confidentialité actuelle du Destin acceptée ;
- comportement de baisse du plafond Destin accepté ;
- aucune lacune Phase 04 restante.

## Compendiums pendant le développement

```text
packs non déclarés dans system.json
→ compendiums inactifs

packs-src/
→ source d’autorité

packs/
→ conservé dans l’état validé
```

Ne pas recréer ni réactiver les compendiums pendant le développement sauf besoin explicite de modification ou de test.

### Avant candidate / release 1.0.0

Obligatoire :

1. rétablir les deux déclarations dans `system.json` ;
2. conserver `interface.objects` et `interface.weapons` ;
3. reconstruire via `tools/build-compendiums.mjs` ;
4. exécuter `tests/static/check-project.mjs` ;
5. tester les compendiums sous Foundry ;
6. seulement ensuite préparer la candidate / release.

## Conventions opérationnelles DEV-interface

- écart de hash ZIP / commit : normal sauf divergence réelle ;
- suffixe automatique de ZIP : sans signification fonctionnelle ;
- `.git/` et `.gitignore` : ignorés silencieusement dans les archives entrantes ;
- `TODO_evilbram.md` : personnel, non autoritatif, non modifié, non inclus dans les ZIP livrés ;
- utilisateur : tests réels, commits, push, releases et publication.

## Phase 05 — périmètre à recalibrer

Déjà produit :

- Corps à corps, Distance et Verbal ;
- bonus d’initiative dérivé ;
- Items `ordinary | weapon` ;
- sections Inventaire et Armes ;
- formules de dégâts persistées ;
- compendiums d’objets et d’armes validés, actuellement désactivés.

Reste principalement à examiner :

- initiative complète dans Foundry ;
- cartes de chat fonctionnelles ;
- sélection d’armes depuis le chat ;
- dégâts normaux et maximum ;
- permissions et réutilisation des actions ;
- tests de conflit sans automatisation tactique.

Hors périmètre tactique :

- ciblage ;
- défense automatisée ;
- résistance ;
- armure calculée ;
- portée tactique ;
- application automatique des dégâts.

## Prochaine action exacte

Après communication du commit de clôture Phase 04, ouvrir la Phase 05 par un audit de complétude et un recalibrage du périmètre réel avant toute modification.
