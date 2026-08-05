# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 5 août 2026
**Coordinateur :** GPT Pilote
**Spécialiste principal :** GPT Foundry
**Identifiant technique :** `interface`
**Dépôt :** `ctotone/DEV-interface`
**Branche :** `main`
**Base de référence de la candidate :** `ba2871fb2f5ec175b525535f0d31e8f3426a1b23`
**Développement Foundry :** Tranche 1 produite, correctif 1 en attente de retest

## Finalité

Créer un système Foundry VTT générique, léger et orienté narration pour le Système D100 Interface.

## Statut

```text
Phases 00A, 00B, 01 et 02 : VALIDÉES
Phase 03 — Première tranche jouable : EN COURS
Tranche 1 — Squelette installable : CANDIDATE
Architecture Foundry : VALIDÉE
Code Foundry : PRODUIT POUR LA TRANCHE 1
Contrôles statiques : RÉUSSIS — 100 contrôles
Tests Foundry : PARTIELS — T1 à T3 OK, T4 corrigé et à rejouer
Validation utilisateur : EN ATTENTE
```

## Base de reprise

La candidate technique a été construite depuis :

```text
Dépôt   : ctotone/DEV-interface
Branche : main
Commit  : ba2871fb2f5ec175b525535f0d31e8f3426a1b23
Message : Phase 2 terminée
```

La candidate n’est pas commitée par GPT Foundry. Le prochain commit éventuel sera créé par l’utilisateur après ses tests et sa validation.

## Ordre de lecture

1. présent fichier ;
2. `.project/PROJECT_STATE.md` ;
3. `.project/ROADMAP.md` ;
4. `.project/decisions/PHASE_02_ARCHITECTURE_FOUNDRY.md` ;
5. `.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md` ;
6. spécifications 00A et 01 selon le sujet.

## Autorités actives

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
```

- phase 00A : algorithme détaillé des jets, Destin et marges ;
- phase 01 : personnage, états, valeurs dérivées, équipement, conflits et progression ;
- phase 02 : architecture Foundry et clarifications techniques validées.

## Décisions impératives de phase 02

### Compatibilité

```text
Foundry supporté : génération V14
Build initiale   : 14.365
Manifest         : minimum 14 / verified 14 / maximum 14
V13 / V15        : non déclarées
```

### Données

- Actor unique : `character` ;
- Item unique : `equipment` ;
- catégories : `ordinary | weapon` ;
- Compétences : entiers de `0` à `100` ;
- Talents : entiers de `0` à `30` ;
- seuil D100 non clampé à `100` ;
- données dérivées non persistées.

### Destin et chat

- résultat définitif public ;
- halo ou teinte discrète en cas d’intervention ;
- survol du résultat donnant brut, correction du Destin et final ;
- test secret et détails internes réservés au MJ ;
- aucune donnée secrète dans un message public ;
- flags des cartes sous `flags.interface.card`, schéma `1`.

### Architecture

- TypeDataModels V14 ;
- moteur D100 pur ;
- services d’orchestration ;
- settings mondiaux sous `interface` ;
- Items embarqués ;
- snapshot d’armes sur une réussite ;
- dégâts jamais appliqués automatiquement ;
- initiative native ;
- Dice So Nice facultatif ;
- migrations internes uniquement ;
- aucun import Roll20 ;
- aucun socket ou API publique stable en V1 sans besoin démontré.

## Ne pas modifier sans arbitrage

- les règles validées des phases 00A et 01 ;
- les bornes `0–100` des Compétences et `0–30` des Talents ;
- l’identifiant `interface` ;
- la génération V14 comme compatibilité déclarée ;
- la confidentialité du test de Destin ;
- l’absence d’automatisation tactique et narrative ;
- l’absence d’import Roll20.

## Réserves à tester

- concurrence d’écritures du Destin ;
- propriétaires multiples ;
- égalités d’initiative ;
- formules de dégâts avancées ;
- réduction du plafond de Destin ;
- migrations avec deux MJ ;
- compatibilité des anciennes cartes ;
- intégration Dice So Nice ;
- coût de l’assistant de répartition des Talents.

Une réserve n’est pas un blocage actuel. Elle devient un sujet d’architecture seulement si un test réel démontre un problème.

## Responsabilités

- **Utilisateur :** validation, tests réels, intégration Git, commits, push, version et publication.
- **GPT Pilote :** coordination, consolidation, état, roadmap et transmissions.
- **GPT Foundry :** architecture et développement Foundry.
- **GPT JdR :** règles fonctionnelles déjà produites.
- **GPT Visuel :** contribution future à l’ergonomie et à l’identité.

## Conventions opérationnelles des archives

- un écart de hash peut être normal dans le cycle ZIP → intégration → commit → push ;
- `.git/` et `.gitignore` peuvent être présents dans une archive entrante et sont ignorés silencieusement ;
- un suffixe automatique comme `interface(4).zip` n’est pas un numéro de version ;
- seule une divergence réelle de contenu, de branche ou de projet doit être signalée ;
- les archives restituées excluent `.git/` et `.gitignore` ;
- sauf indication explicite, l’utilisateur ne modifie pas l’archive restituée avant intégration.

## Livrable technique courant

```text
Version locale : 0.1.0
Foundry cible : 14.365
Rapport : .project/reports/PHASE_03_TRANCHE_1_CANDIDATE.md
Protocole : tests/protocols/TRANCHE_1_FOUNDRY_V14_365.md
Contrôle : node tests/static/check-project.mjs
```

La Tranche 1 reste non validée tant que l’utilisateur n’a pas réalisé les tests réels et donné sa validation explicite.

## Ordonnancement du design

```text
Tranche 1  : squelette neutre
Tranche 2  : données affichées et valeurs dérivées nécessaires
Tranche 2B : adaptation raisonnée du HTML/CSS Roll20
Puis        : moteur D100 et cartes de chat
```

La référence Roll20 ne doit apporter aucune règle, donnée persistée ou logique non validée.

## Résultat de test courant

```text
T1 : OK
T2 : OK
T3 : OK
T4 : ÉCHEC sur la première candidate — templates Actor et Item à plusieurs racines
Correctif 1 : produit, contrôlé hors Foundry, en attente de retest T4
```

Le menu de settings a été corrigé préventivement pour la même contrainte V14.

## Prochaine action exacte

Remplacer le dossier système par le correctif 1, effectuer `Shift+F5`, puis reprendre au test T4. Ne pas commencer la Tranche 2 avant validation explicite de la Tranche 1.
