# État du projet — Système D100 Interface

**Dernière mise à jour :** 5 août 2026
**Statut global :** Tranche 1 en test utilisateur, correctif 1 en attente de retest
**Coordinateur :** GPT Pilote
**Spécialiste principal :** GPT Foundry
**Dépôt :** `ctotone/DEV-interface`
**Branche :** `main`
**Base de référence de la candidate :** `ba2871fb2f5ec175b525535f0d31e8f3426a1b23`
**Identifiant technique :** `interface`

## Finalité

Créer un système Foundry VTT générique, léger et orienté narration pour le Système D100 Interface.

Le système qualifie les résultats mécaniques et facilite leur usage, sans imposer les conséquences narratives.

## État des phases

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase 02 — Architecture Foundry : VALIDÉE
Phase 03 — Première tranche jouable : EN COURS — T1 à T3 OK, T4 corrigé, tranche non validée
Phases 04 à 08 : PLANIFIÉES
```

## Périmètre de la première version

- fiche de personnage ;
- six Compétences et dix-huit Talents ;
- jets normaux, avantage et désavantage ;
- Destin ;
- Blessures et Stress ;
- valeurs dérivées ;
- initiative ;
- progression en neuf gains ;
- équipement et armes ;
- cartes de chat et dégâts ;
- settings mondiaux ;
- permissions propriétaire et MJ ;
- migrations internes de schéma.

## Invariants fonctionnels principaux

### Personnage

- Compétences fixes, entières de `0` à `100` ;
- Talents fixes, entiers de `0` à `30` ;
- création recommandée : `20 / 30 / 30 / 40 / 40 / 50` et cent points de Talents ;
- validations de création souples et confirmables ;
- spécialisations en texte libre.

### Résolution

```text
Seuil de base  = Compétence + Talent
Seuil final    = Seuil de base − Malus d’état
```

- seuil non clampé à `100` ;
- automatiques et critiques définis par la phase 00A ;
- avantage et désavantage résolus par qualité mécanique ;
- marges de réussite et d’échec distinctes, positives ou nulles ;
- aucune conséquence narrative automatique.

### États et Destin

- Blessures et Stress de `0` à `15` ;
- niveaux `0` à `5` par paliers de trois ;
- coefficient commun configurable, défaut `3` ;
- Destin individuel, paramètres mondiaux validés ;
- résultat final public ;
- intervention du Destin signalée par un halo discret ;
- brut, correction et final accessibles au survol ;
- test secret et détails internes réservés au MJ.

### Conflits

- Corps à corps, Distance et Verbal plafonnés à `99` ;
- une valeur dérivée personnalisée mondiale optionnelle ;
- initiative : `1d10 + round(Distance / 10)` ;
- armes comme équipements de catégorie `weapon` ;
- dégâts dans le chat ;
- aucune cible ni application automatique.

## Architecture Foundry validée

```text
Génération supportée : V14
Build initiale       : 14.365
Compatibilité        : minimum 14 / verified 14 / maximum 14
Package              : system
Version initiale     : 0.1.0
Version de schéma    : 1
Actor.type           : character
Item.type            : equipment
```

### Principes

- `TypeDataModel` pour les sous-types Actor et Item ;
- un seul point d’entrée ES module ;
- moteur D100 pur, indépendant des Documents et du DOM ;
- services pour les effets de bord ;
- données dérivées non persistées ;
- Items embarqués comme source de vérité de l’inventaire ;
- cartes de chat natives avec `flags.interface.card` ;
- projection publique sans données secrètes ;
- Dice So Nice facultatif et isolé ;
- migrations internes, sans import Roll20 ;
- aucun socket ou API publique stable en V1 sans besoin démontré.

## Hors périmètre actuel

- publication et release ;
- compatibilité V13 ou V15 ;
- import Roll20 ;
- moteur tactique ;
- ciblage, défense, armure ou application automatique ;
- compendiums finaux ;
- design graphique définitif ;
- localisation autre que la structure française initiale.

## Sources d’autorité

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
```

La phase 00A fait autorité pour l’algorithme des jets.
La phase 01 fait autorité pour le fonctionnel.
La phase 02 fait autorité pour la traduction technique Foundry et les clarifications validées pendant son arbitrage.

## État technique réel

```text
Architecture : VALIDÉE
Code système : TRANCHE 1 PRODUITE
system.json : CRÉÉ
Contrôles statiques : 97 CONTRÔLES HORS FOUNDRY RÉUSSIS
Tests réels Foundry : NON RÉALISÉS
Validation utilisateur : EN ATTENTE
Publication : NON
```

## Risques à tester

- concurrence des écritures de Destin ;
- permissions et propriétaires multiples ;
- égalités d’initiative ;
- formules de dégâts avancées ;
- réduction du plafond de Destin ;
- anciennes cartes après changement de schéma ;
- migrations avec deux MJ ;
- intégration Dice So Nice.

## Convention de travail

Les différences de hash dues au cycle d’échange, les suffixes automatiques de ZIP et la présence de `.git/` ou `.gitignore` dans une archive entrante ne sont pas des anomalies. Ils sont ignorés sauf divergence réelle de contenu, de branche ou de projet.

## Prochaine étape

```text
Phase 03 — Première tranche jouable
Tranche 1 — Candidate à installer et tester sous Foundry VTT 14.365
Protocole — tests/protocols/TRANCHE_1_FOUNDRY_V14_365.md
GPT principal — GPT Foundry
```
