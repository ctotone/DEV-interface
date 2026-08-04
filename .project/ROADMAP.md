# Roadmap — Système D100 Interface pour Foundry VTT

**Dernière mise à jour :** 4 août 2026  
**Statut :** validée par l’utilisateur  
**Identifiant technique :** `interface`  
**Principe :** une phase planifiée ne prouve pas qu’elle est produite, testée ou validée.

## Phase 00A — Résolution des jets

**Statut :** VALIDÉE

### Objectif

Consolider le noyau D100 avant toute architecture Foundry.

### Livrable d’autorité

```text
.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md
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

**Statut :** PROCHAINE

**GPT principal métier :** GPT JdR  
**Consolidation :** GPT Pilote

### Objectif

Consolider toutes les règles fonctionnelles encore nécessaires à la première version jouable avant de définir leur structure Foundry.

### Périmètre

- création du personnage ;
- compétences et talents ;
- spécialisations et attribution éventuelle de l’avantage ;
- données modifiables du personnage ;
- trois statistiques dérivées utilisées dans les conflits ;
- initiative simple ;
- équipement essentiel ;
- armes comme Items ;
- données et calcul des dégâts ;
- récupération ou évolution des Blessures et du Stress ;
- progression du personnage, uniquement si elle appartient à la première version.

### Hors périmètre

- architecture des Actor, Item, DataModels ou Applications ;
- design définitif des feuilles ;
- ciblage et moteur de combat tactique ;
- automatisation narrative ;
- publication.

### Livrable attendu

Une ou plusieurs spécifications fonctionnelles validées, suffisamment précises pour permettre l’architecture Foundry sans interprétation silencieuse.

---

## Phase 02 — Architecture Foundry

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry

### Objectif

Définir l’architecture technique à partir des règles validées.

### Périmètre pressenti

- version cible de Foundry après vérification de la documentation officielle ;
- Actor et Item nécessaires ;
- données stockées et calculées ;
- paramètres MJ ;
- service ou API interne de jets ;
- cartes de chat ;
- permissions ;
- stratégie minimale de migrations ;
- arborescence technique du système.

### Livrable attendu

Architecture technique validée avant développement substantiel.

---

## Phase 03 — Première tranche jouable

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry

### Objectif

Créer un système minimal installable permettant de créer et gérer un personnage puis de lancer les jets principaux.

### Résultat attendu

- `system.json` fonctionnel ;
- modèle de personnage minimal ;
- fiche de personnage fonctionnelle ;
- données sauvegardées ;
- compétences, talents et jets principaux utilisables ;
- première carte de chat exploitable.

---

## Phase 04 — États, Destin et réglages MJ

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry

### Objectif

Implémenter le noyau complet de Blessures, Stress et Destin ainsi que les valeurs configurables par le MJ.

### Résultat attendu

- états sauvegardés ;
- malus calculés ;
- Destin résolu selon la spécification ;
- paramètres MJ modifiables ;
- valeurs par défaut identifiables et rétablissables ;
- cas de test du noyau exécutables.

---

## Phase 05 — Conflits, initiative et armes

**Statut :** PLANIFIÉE

**GPT principal :** GPT Foundry

### Objectif

Permettre une scène de conflit simple sans créer de moteur tactique complet.

### Périmètre pressenti

- trois statistiques dérivées ;
- initiative simple ;
- Item d’arme ;
- valeurs ou formules de dégâts ;
- jet de conflit par le moteur de jets ordinaire ;
- étude d’un bouton de dégâts dans la carte de chat après une attaque réussie.

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
→ 01 Règles personnage, équipement et conflits
→ 02 Architecture Foundry
→ 03 Première tranche jouable
→ 04 États, Destin et réglages MJ
→ 05 Conflits, initiative et armes
→ 06 Ergonomie et identité visuelle
→ 07 Tests et stabilisation
→ 08 Préparation de diffusion
```

Certaines tâches des phases 04 à 06 pourront être réordonnées si GPT Foundry identifie une dépendance technique concrète. Toute modification importante de la roadmap reste soumise à validation utilisateur.
