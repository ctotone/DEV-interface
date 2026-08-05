# Rapport technique — Phase 03, Tranche 1

**Date :** 5 août 2026
**Responsable technique :** GPT Foundry
**Base source :** `ba2871fb2f5ec175b525535f0d31e8f3426a1b23`
**Package :** système Foundry `interface`
**Version locale :** `0.1.0`
**Cible :** Foundry VTT `14.365`
**Statut :** CANDIDATE EN ATTENTE DE TEST UTILISATEUR

## Périmètre livré

- manifeste `system.json` ;
- point d’entrée ES module ;
- localisation française ;
- settings mondiaux validés par l’architecture ;
- menu minimal de settings avec validation croisée ;
- `TypeDataModel` Actor `character` ;
- `TypeDataModel` Item `equipment` ;
- classes Actor et Item minimales ;
- feuilles V14 minimales Actor et Item ;
- templates minimaux ;
- CSS fonctionnel neutre ;
- contrôle statique autonome ;
- protocole Foundry V14.365.

## Éléments volontairement non livrés

- moteur de jets D100 ;
- Destin opérationnel ;
- calculs dérivés ;
- cartes de chat ;
- dégâts ;
- initiative opérationnelle ;
- progression assistée ;
- Dice So Nice ;
- sockets ;
- migrations ;
- design final ;
- publication ou release ;
- compatibilité V15.

## Décision d’ordonnancement du design

La fiche de la Tranche 1 reste fonctionnelle et neutre.

Ordre de travail retenu pour la phase 03 :

```text
Tranche 1  : squelette installable
Tranche 2  : données affichées et valeurs dérivées nécessaires
Tranche 2B : adaptation raisonnée de la référence Roll20
Puis        : moteur D100 et cartes de chat
```

Le HTML/CSS Roll20 est une référence visuelle historique. Il n’est pas une source d’autorité pour les règles, les identifiants ou les données persistées.

## Contrôles exécutés hors Foundry

Commande :

```text
node tests/static/check-project.mjs
```

Résultat obtenu lors de la construction de la candidate :

```text
OK — 100 contrôles hors Foundry réussis.
Modules JavaScript vérifiés : 11.
Chargement isolé et enregistrements init simulés : OK.
Validation réelle dans Foundry VTT non effectuée par ce script.
```

Le contrôle couvre notamment :

- JSON du manifeste et de la langue ;
- identité et compatibilité du package ;
- types uniques Actor et Item ;
- chemins déclarés ;
- syntaxe JavaScript avec `node --check` ;
- résolution des imports relatifs ;
- chargement isolé du point d’entrée avec stubs et simulation du hook `init` ;
- six Compétences et dix-huit Talents ;
- bornes structurantes ;
- catégories d’équipement ;
- clés de localisation statiques ;
- équilibre élémentaire des blocs Handlebars ;
- présence d’un unique élément HTML racine dans chaque template de partie ;
- absence de socket, Roll20, Dice So Nice et dépendance déclarée.

## Retour utilisateur et correctif 1

Premier cycle de test réel sous Foundry VTT 14.365 :

```text
T1 — Détection du système : OK
T2 — Ouverture du monde : OK
T3 — Types de Documents : OK
T4 — Ouverture de la fiche Actor : ÉCHEC
Ouverture de la fiche Item : même échec observé
```

Erreur observée :

```text
Template part "form" must render a single HTML element.
```

Cause identifiée : les templates Actor, Item et settings rendaient plusieurs éléments HTML racine alors que chaque partie Handlebars V14 doit produire un unique élément racine.

Correctif appliqué :

- ajout d’un conteneur racine unique aux trois templates ;
- maintien de la disposition par une adaptation CSS minimale ;
- ajout d’un contrôle statique dédié ;
- protocole renuméroté selon la convention `T1`, `T2`, `T3`, etc.

Le correctif n’a pas modifié le manifeste, les DataModels, les classes, les settings persistés ni les règles. Après remplacement du dossier, un **Shift+F5** suffit pour reprendre au test **T4**.

## Non vérifiable hors Foundry

- découverte du système par Foundry ;
- exécution réelle du hook `init` ;
- enregistrement des TypeDataModels ;
- enregistrement et rendu des feuilles ;
- traitement réel des formulaires DocumentSheetV2 ;
- persistance en base du monde ;
- rendu et comportement du menu ApplicationV2 ;
- permissions du menu pour un joueur ;
- réactions de validation visibles ;
- absence d’erreur dans la console Foundry ;
- comportement après redémarrage.

## Protocole utilisateur

```text
tests/protocols/TRANCHE_1_FOUNDRY_V14_365.md
```

Pour cette candidate, le remplacement du dossier nécessite un **redémarrage complet de Foundry VTT**.

## Risques et limites connus

- les APIs ont été alignées sur la documentation officielle V14.365, mais leur intégration n’est pas validée tant que le test réel n’est pas réalisé ;
- l’initiative déclarée dans le manifeste référence la future donnée dérivée `derived.initiativeBonus`, encore absente de cette tranche ;
- les champs HTML utilisent temporairement des zones de texte simples ;
- aucune migration `0 → 1` n’est exécutée dans cette tranche ;
- le design Roll20 n’est pas encore adapté ;
- les contrôles multijoueurs restent limités au caractère MJ du menu de settings.

## Prochaine action unique

Installer la candidate dans Foundry VTT 14.365, redémarrer complètement l’application et exécuter le protocole de Tranche 1.
