# État du projet — Système D100 Interface

**Dernière mise à jour :** 6 août 2026  
**Statut global :** Phase 03 validée — clôture documentaire préparée  
**Coordinateur :** GPT Pilote  
**Spécialiste principal de la phase clôturée :** GPT Foundry  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Dernier commit contenu dans l’archive :** `0852b3f62fafd2f0128a5ad8e3170eb791aebe39`  
**Commit de clôture de phase 03 :** à communiquer après intégration et push  
**Identifiant technique :** `interface`  
**Version package :** `0.1.0`  
**Version de schéma :** `1`

## Finalité

Créer un système Foundry VTT générique, léger et orienté narration pour le Système D100 Interface.

Le système qualifie les résultats mécaniques et facilite leur usage sans imposer les conséquences narratives.

## État des phases

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase 02 — Architecture Foundry : VALIDÉE
Phase 03 — Première tranche jouable : VALIDÉE
Phase 04 — États, Destin et réglages MJ : PROCHAINE, PÉRIMÈTRE À RECALIBRER
Phase 05 — Conflits, initiative et armes : PLANIFIÉE, SOCLE PARTIELLEMENT ANTICIPÉ
Phase 06 — Ergonomie et identité visuelle : PLANIFIÉE, SOCLE PARTIELLEMENT ANTICIPÉ
Phase 07 — Tests et stabilisation : PLANIFIÉE
Phase 08 — Préparation de diffusion : PLANIFIÉE, NON ENGAGÉE
```

## État technique réel

Le système est installable et a été testé par l’utilisateur sous Foundry VTT `14.365`.

Il comprend actuellement :

- un Actor `character` et un Item `equipment` ;
- les six Compétences et dix-huit Talents ;
- Blessures, Stress, Destin et progression persistés ;
- les valeurs dérivées et le malus d’état calculés ;
- les settings mondiaux prévus par l’architecture ;
- les équipements embarqués et les catégories `ordinary | weapon` ;
- le moteur D100 normal, avantage et désavantage ;
- la qualification des automatiques, critiques et super-critiques ;
- le Destin et les marges ;
- un rendu public technique provisoire des jets ;
- un assistant de création avec état d’attente persistant ;
- une fiche Actor et une fiche Item utilisables ;
- des assets par défaut en WebP ;
- une première adaptation ergonomique substantielle.

## Validation de phase 03

```text
Tranches 1, 2, 2B, 3 et 3B : VALIDÉES
Tests Foundry utilisateur T1 à T35 : OK
Contrôles hors Foundry : 390 OK
Modules JavaScript vérifiés : 22
Tests unitaires : 3
```

## Invariants fonctionnels

### Personnage

- Compétences fixes, entières de `0` à `100` ;
- Talents fixes, entiers de `0` à `30` ;
- création recommandée : `20 / 30 / 30 / 40 / 40 / 50` et cent points de Talents ;
- recommandations souples et confirmables ;
- spécialisations en texte libre ;
- création en attente suivie par `flags.interface.creation.pending`.

### Résolution

```text
Seuil de base = Compétence + Talent
Seuil final   = Seuil de base − Malus d’état
```

- seuil non clampé à `100` ;
- automatiques et critiques définis par la phase 00A ;
- avantage et désavantage résolus par qualité mécanique ;
- marges de réussite et d’échec distinctes ;
- aucune conséquence narrative automatique.

### États et Destin

- Blessures et Stress de `0` à `15` ;
- niveaux `0` à `5` par paliers de trois ;
- coefficient commun configurable, défaut `3` ;
- Destin individuel et paramètres mondiaux ;
- résultat final public ;
- test secret et détails internes réservés au MJ.

### Conflits

- Corps à corps, Distance et Verbal plafonnés à `99` ;
- valeur dérivée personnalisée mondiale optionnelle ;
- initiative prévue : `1d10 + round(Distance / 10)` ;
- armes comme équipements `weapon` ;
- aucune cible ni application automatique des dégâts.

## Architecture Foundry

```text
Génération supportée : V14
Build de test        : 14.365
Compatibilité        : minimum 14 / verified 14 / maximum 14
Package              : system
Actor.type           : character
Item.type            : equipment
```

Principes :

- TypeDataModels V14 ;
- un seul point d’entrée ES module ;
- moteur D100 pur ;
- services pour les effets de bord ;
- données dérivées non persistées ;
- Items embarqués comme source de vérité ;
- settings et flags sous `interface` ;
- Dice So Nice facultatif ;
- migrations internes seulement ;
- aucun import Roll20 ;
- aucun socket ou API publique stable sans besoin démontré.

## Éléments ouverts

- cartes de chat finales ;
- dégâts depuis le chat ;
- initiative complète ;
- progression assistée ;
- prototype Dice So Nice ;
- migrations ;
- concurrence d’écriture ;
- identité visuelle finale ;
- stabilisation globale ;
- publication.

## Anticipations de roadmap

La phase 03 a déjà produit une partie des phases 04 à 06. Ces phases restent ouvertes tant que leur périmètre restant n’a pas été recalibré et validé.

## Sources d’autorité

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
```

La référence historique des règles est désormais :

```text
.project/references/systeme de jeu Interface.md
```

## Prochaine étape

Après le commit de clôture de phase 03, recalibrer la phase 04 à partir de l’état réel avant tout nouveau développement.
