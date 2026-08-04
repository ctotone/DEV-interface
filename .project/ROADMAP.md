# Roadmap — Système D100 Interface pour Foundry VTT

**Dernière mise à jour :** 4 août 2026  
**Statut :** première roadmap de cadrage  
**Principe :** les phases restent adaptables ; une phase prévue ne prouve pas qu’elle est réalisée.

## Phase 00 — Cadrage général

**Statut :** en cours

Objectifs :

- définir la finalité et le périmètre du système Foundry ;
- organiser la mémoire du projet ;
- identifier les sources historiques et les bases d’autorité ;
- préparer les phases de consolidation fonctionnelle.

## Phase 00A — Noyau de résolution des jets

**Statut :** validée fonctionnellement

Livrable :

```text
.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md
```

Résultat :

- arbre de résolution consolidé ;
- paramètres de base validés ;
- vingt cas de test fonctionnels définis ;
- points encore ouverts explicitement séparés.

## Phase 00B — Consolidation des autres règles

**Statut :** à ouvrir

Périmètre pressenti :

- création de personnage ;
- compétences et talents ;
- spécialisations ;
- progression et expérience ;
- initiative ;
- combat ;
- dégâts ;
- blessures et stress hors calcul déjà validé ;
- inventaire et équipement ;
- autres règles issues de la pratique réelle.

Livrable attendu :

```text
un ou plusieurs fichiers de spécification fonctionnelle validés
```

## Phase 01 — Architecture fonctionnelle Foundry

**Statut :** future

Objectifs :

- identifier les types de Documents nécessaires ;
- définir les données à stocker et les données calculées ;
- définir le périmètre d’une première version utile ;
- relever les dépendances entre règles, fiches, jets et paramètres MJ ;
- choisir la version cible de Foundry après vérification de la documentation officielle.

GPT principal : GPT Foundry.

## Phase 02 — Socle technique

**Statut :** future

Objectifs pressentis :

- créer le manifeste du système ;
- poser l’arborescence technique minimale ;
- définir les modèles de données ;
- préparer les migrations et réglages nécessaires ;
- mettre en place le noyau de résolution testable.

## Phase 03 — Fiches et interactions principales

**Statut :** future

Objectifs pressentis :

- fiche de personnage ;
- actions de jet ;
- états Blessure et Stress ;
- Destin ;
- affichage dans le chat ;
- paramètres MJ.

## Phase 04 — Sous-systèmes complémentaires

**Statut :** future

Périmètre à définir selon les règles consolidées :

- combat et dégâts ;
- initiative ;
- inventaire ;
- progression ;
- spécialisations ;
- autres automatismes validés.

## Phase 05 — Direction visuelle et ergonomie

**Statut :** future

GPT principal pressenti : GPT Visuel ou GPT Foundry selon le sous-chantier.

Le travail visuel partira des besoins validés et des références Roll20, sans porter automatiquement les contraintes de l’ancienne fiche.

## Phase 06 — Tests et stabilisation

**Statut :** future

Objectifs :

- tests fonctionnels ;
- tests Foundry ;
- non-régression ;
- tests utilisateur ;
- documentation des limites ;
- préparation d’une version candidate.

## Phase 07 — Préparation de publication

**Statut :** future et non engagée

Cette phase traitera seulement lorsque nécessaire :

- nettoyage de l’archive ;
- exclusion de `.project/`;
- versionnement ;
- manifeste de distribution ;
- licences et droits ;
- dépôt ou branche publique ;
- release et publication.
