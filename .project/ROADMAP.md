# Roadmap — Système D100 Interface pour Foundry VTT

**Dernière mise à jour :** 7 août 2026
**Statut :** validée par l’utilisateur
**Identifiant technique :** `interface`
**Principe :** une phase planifiée ne prouve pas qu’elle est produite, testée ou validée.

## Phase 00A — Résolution des jets

**Statut :** VALIDÉE

### Objectif

Consolider le noyau D100 avant toute architecture Foundry.

### Livrable d’autorité

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
```

### Résultat

- arbre complet de résolution consolidé ;
- résultats automatiques, critiques et super-critiques définis ;
- avantage et désavantage définis au niveau du moteur ;
- Blessures, Stress et Destin définis avec valeurs par défaut configurables ;
- marges et données intermédiaires précisées ;
- cas de test fonctionnels minimaux définis.

---

## Phase 00B — Cadrage produit et dépôt

**Statut :** VALIDÉE

### Objectif

Définir le périmètre de la première version jouable, l’organisation documentaire et le mode de travail.

### Résultat

- identifiant technique Foundry fixé à `interface` ;
- dépôt de développement nommé `DEV-interface` ;
- première version jouable cadrée ;
- absence de moteur de combat tactique complet confirmée ;
- armes prévues comme Items portant les dégâts ;
- réglages MJ limités aux valeurs numériques prévues par les règles ;
- organisation documentaire légère autour de `.project/` ;
- échanges de travail par archives ZIP complètes, hors `.git/` et `.gitignore`.

### Livrable de décision

```text
.project/decisions/PHASE_00B_CADRAGE_PRODUIT_ET_DEPOT.md
```

---

## Phase 01 — Personnage, équipement et conflits

**Statut :** VALIDÉE

**GPT principal métier :** GPT JdR
**Consolidation :** GPT Pilote

### Objectif

Consolider toutes les règles fonctionnelles nécessaires à la première version jouable avant de définir leur structure Foundry.

### Résultat

- fiche et création de personnage définies ;
- six compétences et dix-huit talents confirmés ;
- trois valeurs dérivées et une valeur personnalisée optionnelle définies ;
- initiative simple définie ;
- Blessures et Stress précisés sur une échelle de `0 à 15` ;
- équipement et armes définis fonctionnellement ;
- parcours des dégâts dans le chat défini ;
- spécialisations et progression précisées ;
- réserves techniques isolées pour la phase 02 ;
- marges confirmées comme deux valeurs positives ou nulles.

### Livrables

```text
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
.project/decisions/PHASE_01_PERSONNAGE_EQUIPEMENT_CONFLITS.md
```

---

## Phase 02 — Architecture Foundry

**Statut :** VALIDÉE

**GPT principal :** GPT Foundry
**Coordination et consolidation :** GPT Pilote

### Objectif

Traduire les spécifications fonctionnelles validées en architecture technique Foundry sans modifier les règles métier.

### Résultat

- génération Foundry V14 retenue ;
- build `14.365` retenue comme environnement initial de développement et de test ;
- manifeste prévu avec `minimum 14 / verified 14 / maximum 14` ;
- un Actor `character` et un Item `equipment` ;
- TypeDataModels, settings et données dérivées définis ;
- moteur D100 pur et orchestration Foundry séparés ;
- contrat des cartes publiques et MJ défini ;
- confidentialité du Destin définie ;
- architecture des armes, dégâts, initiative et permissions définie ;
- migrations internes et stratégie de tests définies ;
- réserves de faisabilité isolées ;
- aucun import Roll20 ;
- aucune publication autorisée.

### Arbitrages consolidés

- Compétences bornées de `0` à `100` ;
- seuil D100 non clampé à `100` ;
- intervention du Destin signalée par un halo discret ;
- brut, correction et final accessibles au survol ;
- test secret réservé au MJ.

### Livrables

```text
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
.project/decisions/PHASE_02_ARCHITECTURE_FOUNDRY.md
```

---

## Phase 03 — Première tranche jouable

**Statut :** VALIDÉE

**GPT principal :** GPT Foundry  
**Tests réels :** utilisateur

### Objectif

Créer une première base installable, persistante et jouable du système.

### Tranches réalisées

```text
Tranche 1  — Squelette installable : VALIDÉE
Tranche 2  — Données et dérivés : VALIDÉE
Tranche 2B — Adaptation fonctionnelle de la fiche : VALIDÉE
Tranche 3  — Moteur D100 : VALIDÉE
Tranche 3B — Assistant de création et ergonomie complémentaire : VALIDÉE
```

### Résultat

- système installable sous Foundry VTT `14.365` ;
- Actor et Item fonctionnels ;
- données persistées et dérivées ;
- settings mondiaux ;
- moteur D100, Destin et marges ;
- assistant de création ;
- équipement embarqué ;
- première fiche jouable ;
- tests utilisateur T1 à T35 validés.

### Livrable de décision

```text
.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md
```

---


## Complément post-clôture de la phase 03 — Compendiums d’armes et d’objets

**Statut :** VALIDÉ

**GPT principal :** GPT Foundry  
**Tests réels :** utilisateur  
**Commit de clôture historique de la phase 03 :** `72a2d32ff51661e548f3900792fca263e8b75b98`

### Qualification

Ce travail est un complément intercalaire validé. Il ne rouvre pas la phase 03 et n’ouvre pas la phase 04.

### Résultat

- compendium `interface.objects` : 60 objets, 8 dossiers ;
- compendium `interface.weapons` : 42 armes, 3 dossiers ;
- 102 images dédiées et deux bannières ;
- sources lisibles sous `packs-src/` ;
- reconstruction contrôlée avec `tools/build-compendiums.mjs` ;
- descriptions en texte brut ;
- tests Foundry T1 à T11 validés ;
- 718 contrôles hors Foundry réussis.

### Conséquence

La phase 04 partira de la base intégrant ce complément. Les compendiums, leurs identifiants et leur chaîne de production ne doivent pas être recréés.

### Livrables

```text
.project/decisions/COMPENDIUMS_SYSTEME_OBJETS_ARMES.md
.project/reports/COMPENDIUMS_SYSTEME_CANDIDATE.md
tests/protocols/COMPENDIUMS_SYSTEME_FOUNDRY_V14_365.md
```

---

## Phase 04 — États, Destin et réglages MJ

**Statut :** VALIDÉE

**GPT principal :** GPT Foundry  
**Tests réels :** utilisateur

### Résultat

- audit de complétude terminé ;
- aucune lacune fonctionnelle identifiée ;
- aucun patch fonctionnel requis ;
- États, malus, settings et Destin confirmés conformes ;
- confidentialité actuelle du D100 secret Destin acceptée ;
- comportement après baisse du plafond Destin accepté ;
- 708 contrôles hors Foundry réussis ;
- tests Foundry antérieurs pertinents conservés comme preuve.

### Décision de clôture

```text
.project/decisions/PHASE_04_ETATS_DESTIN_REGLAGES_MJ.md
```

### Décision opérationnelle connexe

Les compendiums sont désactivés dans `system.json` pendant le développement afin d’éviter le bruit Git LevelDB.

```text
.project/decisions/GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md
```

Ils devront être réactivés, reconstruits, contrôlés et testés avant la candidate / release `1.0.0`.

---

## Phase 05 — Conflits, initiative et armes

**Statut :** PROCHAINE — PÉRIMÈTRE À RECALIBRER

**GPT principal :** GPT Foundry

### Déjà produit

- Corps à corps, Distance et Verbal ;
- bonus d’initiative dérivé ;
- Items `ordinary | weapon` ;
- sections Inventaire et Armes ;
- formules de dégâts persistées sur les armes ;
- compendium `interface.weapons` validé avec 42 armes ;
- compendium `interface.objects` validé avec 60 objets.

Les compendiums restent désactivés pendant le développement et ne doivent pas être réactivés pour cette phase sans besoin explicite.

### Travail préalable obligatoire

Comparer le périmètre prévu à la base réelle avant toute modification.

Classer chaque exigence comme :

```text
DÉJÀ PRODUIT ET TESTÉ
PRODUIT MAIS À RETESTER
MANQUANT
REPORTÉ
```

### Reste principalement à traiter

- initiative complète dans Foundry ;
- cartes de chat fonctionnelles ;
- sélection des armes depuis le chat ;
- dégâts normaux et maximum ;
- permissions et réutilisation des actions ;
- tests de conflit sans automatisation tactique.

### Hors périmètre

- ciblage ;
- défense automatisée ;
- résistance ;
- armure calculée ;
- portée tactique ;
- application automatique des dégâts.

---

## Phase 06 — Ergonomie et identité visuelle

**Statut :** PLANIFIÉE — SOCLE PARTIELLEMENT ANTICIPÉ

**GPT principal technique :** GPT Foundry  
**Contributeur visuel :** GPT Visuel

### Déjà produit

- adaptation fonctionnelle de la fiche ;
- assistant de création ;
- organisation de l’identité ;
- sections repliables ;
- séparation Armes / Inventaire ;
- premiers assets par défaut ;
- premières règles de lisibilité et d’espacement.

### Reste principalement à traiter

- identité visuelle finale ;
- cartes de chat ;
- cohérence graphique complète ;
- accessibilité ;
- responsive et finitions ;
- arbitrages avec GPT Visuel.

---

## Phase 07 — Tests et stabilisation

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry  
**Tests réels :** utilisateur

### Objectif

Obtenir une candidate stable et jouable.

### Périmètre

- tests fonctionnels globaux ;
- permissions ;
- sauvegarde et rechargement ;
- non-régression ;
- multijoueur et concurrence ;
- correction des blocages ;
- documentation des limites connues.

---

## Phase 08 — Préparation de diffusion

**Statut :** PLANIFIÉE, NON ENGAGÉE

**GPT principal :** GPT Foundry

### Objectif

Préparer une première version publiable seulement lorsque le système est stabilisé.

### Périmètre futur

- nettoyage de l’archive de distribution ;
- exclusion de `.project/` ;
- versionnement ;
- manifeste de distribution ;
- licences et droits ;
- documentation utilisateur ;
- archive candidate ;
- dépôt, branche ou release de diffusion selon décision utilisateur.

---

### Obligation avant candidate / release 1.0.0

- réactiver `interface.objects` et `interface.weapons` dans `system.json` ;
- reconstruire les packs depuis `packs-src/` ;
- exécuter les contrôles ;
- tester les compendiums sous Foundry ;
- vérifier objets, armes, dossiers, images et descriptions avant publication.

## Dépendances principales

```text
00A Résolution des jets
+ 00B Cadrage produit
+ 01 Personnage, équipement et conflits
→ 02 Architecture Foundry
→ 03 Première tranche jouable
→ complément post-clôture : compendiums d’armes et d’objets
→ recalibrage 04–06 selon la base réelle
→ 04 États, Destin et réglages MJ
→ 05 Conflits, initiative et armes
→ 06 Ergonomie et identité visuelle
→ 07 Tests et stabilisation
→ 08 Préparation de diffusion
```

Les anticipations validées de phase 03 font partie de la base réelle. Elles ne doivent pas être refaites ni considérées comme de simples intentions.
