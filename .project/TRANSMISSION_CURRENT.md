# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 10 août 2026  
**Coordinateur :** GPT Pilote  
**Prochaine phase :** 06 — Ergonomie et identité visuelle  
**GPT principal technique :** GPT Foundry  
**Contributeur prévu :** GPT Visuel  
**Identifiant technique :** `interface`  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Version package :** `0.1.0`  
**Version schéma :** `1`

## Statut

```text
Phases 00A à 05 : VALIDÉES
Complément compendiums : VALIDÉ
Phase 06 : PROCHAINE — À RECALIBRER
Publication : NON ENGAGÉE
```

## Base de reprise

```text
Commit de clôture Phase 04 :
a56d68838a93398fffdb35aa7ee9feed3eb5dc71

Commit pré-test Phase 05 observé dans l’archive entrante :
0fe3cdbe35e42d4f1c891640a033c1ca02bf98d4

Commit de clôture documentaire Phase 05 :
à communiquer après intégration et push utilisateur
```

Le prochain hash communiqué après push deviendra la base distante de référence de la Phase 06.

## Ordre de lecture

1. présent fichier ;
2. `.project/PROJECT_STATE.md` ;
3. `.project/ROADMAP.md` ;
4. `.project/decisions/PHASE_05_CONFLITS_INITIATIVE_ARMES.md` ;
5. `.project/decisions/PHASE_05_CARTES_CHAT_ERGONOMIE.md` ;
6. `.project/decisions/GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md` ;
7. spécifications 00A, 01 et 02 selon le sujet.

## État stable après Phase 05

- moteur D100, États, Destin et settings conformes ;
- cartes D100 fonctionnelles ;
- projections publiques filtrées ;
- cartes de dégâts réutilisables ;
- snapshots d’armes persistants ;
- dégâts normaux et maximum ;
- forçage MJ après échec ;
- permissions revérifiées au clic ;
- initiative native complète depuis la fiche ;
- aucune application automatique de dégâts ou Blessures ;
- aucune architecture tactique ajoutée.

## Preuve Phase 05

```text
Contrôles hors Foundry : 762 OK
Modules JavaScript : 29
Tests unitaires : 4

Foundry utilisateur :
B1 à B5 : OK
C1 à C5 : OK
D1 à D2 : OK
E1 à E4 : OK
F1 : OK
F2 : NON TESTÉ
Initiative finale : OK
```

Ne jamais présenter F2 comme testé.

## Limites à conserver

- simultanéité multijoueur F2 non testée ;
- détail secret Destin issu d’un jet joueur non persisté dans une carte MJ séparée ;
- halo Destin à reprendre visuellement ;
- thème `default` uniquement, sans source persistée de choix de thème.

## Compendiums pendant le développement

```text
packs non déclarés dans system.json
→ compendiums inactifs

packs-src/
→ source d’autorité

packs/
→ conservé et versionné
```

Ne pas réactiver les compendiums pendant le développement sans besoin explicite.

Avant candidate / release `1.0.0` :

```text
réactiver
→ reconstruire
→ contrôler
→ tester sous Foundry
```

## Conventions opérationnelles DEV-interface

- écart de hash ZIP / commit : normal sauf divergence réelle ;
- suffixe automatique de ZIP : sans signification fonctionnelle ;
- `.git/` et `.gitignore` : ignorés silencieusement dans les archives entrantes ;
- `TODO_evilbram.md` : personnel, non autoritatif, non modifié et non inclus dans les ZIP livrés ;
- utilisateur : tests réels, commits, push, releases et publication.

## Phase 06 — recalibrage attendu

Une partie du socle ergonomique a déjà été produite en Phase 03 et en Phase 05.

Avant toute modification, auditer au minimum :

```text
fiche Actor
fiche Item
assistant de création
cartes D100
cartes de dégâts
halo Destin
thème default
responsive
lisibilité
accessibilité
assets existants
cohérence visuelle globale
```

Le design fonctionnel validé de la Phase 05 ne doit pas être cassé pour une amélioration esthétique gratuite.

Le test simultané multijoueur F2 reste destiné à la Phase 07.

## Prochaine action exacte

Après communication du commit de clôture Phase 05, ouvrir la Phase 06 par un audit de l’existant ergonomique et visuel avant toute modification.
