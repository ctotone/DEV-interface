# État du projet — Système D100 Interface

**Dernière mise à jour :** 6 août 2026  
**Statut global :** Phase 03 clôturée — complément post-clôture des compendiums validé  
**Coordinateur :** GPT Pilote  
**Spécialiste principal du complément :** GPT Foundry  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Commit de clôture de la phase 03 :** `72a2d32ff51661e548f3900792fca263e8b75b98`  
**Dernier commit observé avant intégration du complément :** `7d7e7d7cb994951fa41cba9f6520a591900c7dfe`  
**Commit d’intégration du complément :** à communiquer après intégration et push  
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
Phase 03 — Première tranche jouable : VALIDÉE ET CLÔTURÉE
Complément post-clôture — Compendiums d’armes et d’objets : VALIDÉ
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
- deux compendiums système natifs ;
- 60 objets ordinaires répartis dans 8 dossiers ;
- 42 armes réparties dans 3 dossiers ;
- une chaîne reconstructible `packs-src/ → build-compendiums → packs/`.

## Validations

### Phase 03

```text
Tranches 1, 2, 2B, 3 et 3B : VALIDÉES
Tests Foundry utilisateur T1 à T35 : OK
```

### Complément compendiums

```text
Tests Foundry utilisateur T1 à T11 : OK
Contrôles hors Foundry : 718 OK
Modules JavaScript vérifiés : 22
Tests unitaires : 3
Chargement isolé et initialisation simulée : OK
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

### Compendiums

```text
interface.objects
→ 60 Items equipment / ordinary

interface.weapons
→ 42 Items equipment / weapon
```

- les identifiants des packs ne doivent pas être renommés silencieusement ;
- les sources éditables résident dans `packs-src/` ;
- les packs installables sont reconstruits avec `tools/build-compendiums.mjs` ;
- les 102 descriptions sont en texte brut ;
- aucune publication n’est engagée.

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
- moteur D100 pur ;
- données dérivées non persistées ;
- Items embarqués comme source de vérité des inventaires ;
- settings et flags sous `interface` ;
- Dice So Nice facultatif ;
- migrations internes seulement ;
- aucun import Roll20 ;
- aucun socket ou contrat d’API publique sans besoin démontré.

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
- droits et audit de publication des assets ;
- publication.

## Observation méthodologique

**[CANDIDATE D’ÉVOLUTION — outillage transversal Foundry]**

L’outillage construit pendant le projet pourra être évalué en fin de projet. Aucune extraction permanente ni généralisation n’est validée à ce stade. Un REX de GPT Foundry à destination de GPT Architecte est annoncé.

## Sources d’autorité

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
.project/decisions/COMPENDIUMS_SYSTEME_OBJETS_ARMES.md
```

## Prochaine étape

Intégrer et pousser le complément validé, communiquer son hash à GPT Pilote, puis recalibrer la phase 04 à partir de cette nouvelle base réelle.
