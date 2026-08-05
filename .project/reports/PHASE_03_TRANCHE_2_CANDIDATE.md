# Rapport technique — Phase 03, Tranche 2

**Date :** 5 août 2026  
**Responsable technique :** GPT Foundry  
**Base Git de référence :** `ba2871fb2f5ec175b525535f0d31e8f3426a1b23`  
**Base fonctionnelle :** Tranche 1 validée par l’utilisateur sous Foundry VTT 14.365  
**Package :** système Foundry `interface`  
**Version locale :** `0.1.0`  
**Version de schéma persisté :** `1` inchangée  
**Cible :** Foundry VTT `14.365`  
**Statut :** CANDIDATE EN ATTENTE DE TEST UTILISATEUR

## Périmètre livré

- données dérivées non persistées de l’Actor ;
- niveaux de Blessures et Stress ;
- malus d’état dépendant du coefficient mondial ;
- Corps à corps, Distance et Verbal ;
- plafond des valeurs dérivées à `99` ;
- valeur dérivée personnalisée mondiale ;
- bonus d’initiative dérivé de Distance ;
- diagnostics souples de création ;
- acquittement local et non persistant des avertissements ;
- boutons `−1` et `+1` pour Blessures et Stress ;
- Inventaire fondé sur les Items embarqués de l’Actor ;
- zone Armes filtrée sans duplication de donnée ;
- création d’un objet ordinaire ou d’une arme depuis la fiche Actor ;
- ouverture des Items embarqués depuis la fiche ;
- glisser-déposer natif d’Items sur l’ActorSheetV2 ;
- recalcul des dérivés lors des changements de settings concernés ;
- tests unitaires des fonctions pures ;
- protocole de test Foundry V14.365.

## Invariants protégés

- identifiant du système `interface` ;
- version locale `0.1.0` ;
- compatibilité V14 uniquement ;
- Actor.type unique `character` ;
- Item.type unique `equipment` ;
- catégories `ordinary` et `weapon` ;
- Compétences entières de `0` à `100` ;
- Talents entiers de `0` à `30` ;
- Blessures et Stress de `0` à `15` ;
- aucune donnée dérivée persistée ;
- aucun socket, flag, framework ou dépendance ;
- aucun moteur D100 ni Destin opérationnel ;
- aucune restauration de règle Roll20 ;
- aucune modification de la version du schéma persisté.

## Architecture appliquée

Les calculs sont centralisés dans :

```text
scripts/rules/derived-values.mjs
```

Le `TypeDataModel` `CharacterData` exécute les calculs dans `prepareDerivedData()` et expose un champ `derived` déclaré avec :

```text
persisted: false
```

Structure préparée :

```text
system.derived
├── levels
│   ├── wounds
│   └── stress
├── statePenalty
├── scores
│   ├── melee
│   ├── distance
│   ├── verbal
│   └── custom
├── initiativeBonus
└── creation
    ├── skillValues
    ├── skillDistributionRecommended
    ├── talentTotal
    ├── talentTotalRecommended
    └── warnings
```

Les Items embarqués restent la source unique de l’Inventaire. La zone Armes est une vue filtrée des mêmes Items et ne crée aucune copie persistée.

## Choix d’implémentation

### Avertissements de création

Les recommandations restent non bloquantes :

```text
Compétences : 20 / 30 / 30 / 40 / 40 / 50
Talents     : total de 100
```

L’acquittement est mémorisé uniquement dans l’instance de feuille et uniquement pour la signature actuelle de la répartition. Toute modification produisant un nouvel avertissement le fait réapparaître. Aucun flag, setting ou champ Actor n’est ajouté.

### Settings influençant les dérivés

Les changements de :

- `statePenaltyCoefficient` ;
- `customDerived` ;

recalculent les Actors en mémoire et rafraîchissent les feuilles déjà ouvertes. Aucune écriture Actor n’est effectuée.

### Équipement embarqué

Les boutons de création utilisent `Actor.createEmbeddedDocuments("Item", ...)`.

Le glisser-déposer d’un Item est laissé au comportement natif documenté de `ActorSheetV2`. Aucun override d’une méthode protégée n’est ajouté.

Le changement de catégorie s’effectue dans la fiche Item existante. Aucun champ `equipped`, `active` ou assimilé n’est créé.

## Fichiers ajoutés

```text
scripts/rules/derived-values.mjs
tests/unit/derived-values.test.mjs
tests/protocols/TRANCHE_2_FOUNDRY_V14_365.md
.project/reports/PHASE_03_TRANCHE_2_CANDIDATE.md
```

## Fichiers modifiés pour la Tranche 2

```text
README.md
lang/fr.json
scripts/constants.mjs
scripts/data/character-data.mjs
scripts/documents/interface-actor.mjs
scripts/documents/interface-item.mjs
scripts/applications/character-sheet.mjs
scripts/applications/interface-settings-application.mjs
scripts/settings/register-settings.mjs
scripts/interface.mjs
styles/interface.css
templates/actor/character-sheet.hbs
templates/settings/interface-settings.hbs
tests/static/check-project.mjs
tests/static/smoke-import.mjs
```

## Fichiers supprimés

```text
Aucun.
```

## Contrôles exécutés hors Foundry

Commande :

```text
node tests/static/check-project.mjs
```

Résultat obtenu sur la source de la candidate :

```text
OK — 143 contrôles hors Foundry réussis.
Modules JavaScript vérifiés : 12.
Tests unitaires exécutés : 1.
Chargement isolé et enregistrements init simulés : OK.
Validation réelle dans Foundry VTT non effectuée par ce script.
```

Le contrôle couvre notamment :

- validité JSON ;
- identité et compatibilité du manifeste ;
- chemins déclarés ;
- syntaxe des modules et tests ;
- résolution des imports ;
- localisation française ;
- unique élément racine des templates ;
- six Compétences et dix-huit Talents ;
- associations fixes des trois dérivés ;
- recommandations de création ;
- champ dérivé non persisté ;
- chargement isolé et simulation du hook `init` ;
- préparation simulée des données dérivées ;
- exposition de `derived.initiativeBonus` dans `getRollData()` ;
- absence de socket, Roll20, Dice So Nice et dépendance ;
- exécution du test unitaire des fonctions pures.

Tests unitaires couverts :

- paliers `0` à `15` ;
- malus d’état ;
- associations fixes ;
- arrondi inférieur ;
- plafond `99` ;
- valeur personnalisée désactivée ;
- nom vide ;
- doublons ;
- clés inconnues ;
- configuration complète ;
- diagnostics de création ;
- bonus d’initiative ;
- invariance des entrées.

## Non vérifiable hors Foundry

- construction réelle du champ non persisté par le DataModel V14 ;
- rafraîchissement des feuilles lors d’un changement de setting ;
- rendu des nouvelles sections ;
- actions ApplicationV2 ;
- création et ouverture des Items embarqués ;
- glisser-déposer natif ;
- permissions joueur sur les actions ;
- persistance réelle des Documents ;
- comportement après redémarrage ;
- absence d’erreur console dans Foundry.

## Limites connues

- la sauvegarde générale reste manuelle ;
- les boutons Blessures/Stress soumettent la fiche complète avant recalcul ;
- aucun bouton de suppression d’Item n’est ajouté à la fiche Actor ;
- le tri et la conversion par dépôt direct dans la zone Armes ne sont pas ajoutés ;
- aucune formule de dégâts n’est validée ou lancée ;
- l’initiative n’est pas encore lancée ;
- le moteur D100, le Destin, les cartes de chat et la progression restent hors périmètre ;
- le design Roll20 n’est pas encore adapté ;
- aucun test réel Foundry n’est revendiqué.

## Documentation de projet non consolidée

Conformément à la décision utilisateur, cette tranche ne met pas à jour :

```text
.project/TRANSMISSION_CURRENT.md
.project/PROJECT_STATE.md
.project/ROADMAP.md
```

La consolidation sera réalisée à la fin de la tâche ou de la phase concernée.

## Prochaine action unique

Installer la candidate complète, redémarrer Foundry VTT et exécuter :

```text
tests/protocols/TRANCHE_2_FOUNDRY_V14_365.md
```
