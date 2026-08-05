# Roadmap — Système D100 Interface pour Foundry VTT

**Dernière mise à jour :** 5 août 2026  
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

**Statut :** PROCHAINE

**GPT principal :** GPT Foundry

### Objectif

Créer la première base installable et testable du système, puis progresser vers une fiche personnage fonctionnelle.

### Première étape

```text
Tranche 1 — Squelette installable
```

- manifeste `system.json` ;
- point d’entrée ES module ;
- langue française ;
- settings ;
- TypeDataModels minimaux ;
- Actor et Item minimaux ;
- feuilles minimales ;
- test d’installation sur Foundry VTT 14.365.

### Résultat attendu de la phase

- système installable ;
- création d’un Actor personnage ;
- données essentielles éditables ;
- compétences et talents utilisables ;
- valeurs dérivées calculées ;
- jets principaux fonctionnels ;
- première carte de chat ;
- sauvegarde et rechargement vérifiés.

---

## Phase 04 — États, Destin et réglages MJ

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry

### Objectif

Implémenter les états et paramètres numériques du noyau.

### Résultat attendu

- Blessures et Stress de `0 à 15` ;
- conversion en niveaux ;
- coefficient configurable ;
- Destin complet ;
- paramètres MJ et restauration des valeurs par défaut ;
- détails de calcul consultables ;
- tests fonctionnels du noyau.

---

## Phase 05 — Conflits, initiative et armes

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry

### Objectif

Permettre une scène de conflit simple sans créer de moteur tactique complet.

### Périmètre

- valeurs dérivées de conflit ;
- initiative simple ;
- Items d’équipement et d’arme ;
- formules de dégâts ;
- choix d’arme depuis le chat ;
- dégâts normaux et maximum ;
- absence de ciblage et d’application automatique ;
- réutilisation des actions autorisées.

### Hors périmètre

- ciblage ;
- défense automatisée ;
- résistance ;
- armure calculée ;
- portée tactique ;
- positionnement automatisé.

---

## Phase 06 — Ergonomie et identité visuelle

**Statut :** PLANIFIÉE

**GPT principal technique :** GPT Foundry  
**Contributeur visuel :** GPT Visuel

### Objectif

Améliorer la fluidité des feuilles et des cartes de chat sans alourdir l’usage.

### Périmètre pressenti

- hiérarchie des informations ;
- navigation de la fiche ;
- interactions de jet ;
- cartes de chat ;
- paramètres MJ ;
- identité graphique ;
- accessibilité et lisibilité ;
- adaptation raisonnée des références Roll20.

---

## Phase 07 — Tests et stabilisation

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry  
**Tests réels :** utilisateur

### Objectif

Obtenir une candidate stable et jouable.

### Périmètre

- tests fonctionnels ;
- tests Foundry ;
- permissions ;
- sauvegarde et rechargement ;
- non-régression ;
- tests utilisateur en partie ;
- correction des blocages ;
- documentation des limites connues.

---

## Phase 08 — Préparation de diffusion

**Statut :** PLANIFIÉE, NON ENGAGÉE

**GPT principal :** GPT Foundry

### Objectif

Préparer une première version publiable seulement lorsque le système est stabilisé.

### Périmètre futur

- nettoyage de l’archive ;
- exclusion de `.project/` ;
- versionnement ;
- manifeste de distribution ;
- licences et droits ;
- documentation utilisateur ;
- archive candidate ;
- dépôt, branche ou release de diffusion selon décision utilisateur.

---

## Dépendances principales

```text
00A Résolution des jets
+ 00B Cadrage produit
+ 01 Personnage, équipement et conflits
→ 02 Architecture Foundry
→ 03 Première tranche jouable
→ 04 États, Destin et réglages MJ
→ 05 Conflits, initiative et armes
→ 06 Ergonomie et identité visuelle
→ 07 Tests et stabilisation
→ 08 Préparation de diffusion
```

Certaines tâches des phases 03 à 06 pourront être réordonnées si GPT Foundry identifie une dépendance technique concrète. Toute modification importante de la roadmap reste soumise à validation utilisateur.
