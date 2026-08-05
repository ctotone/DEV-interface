# Phase 00B — Cadrage produit et dépôt

## Référence

- **Projet :** Système D100 Interface pour Foundry VTT
- **Statut :** VALIDÉE
- **Date d’ouverture :** 4 août 2026
- **Date de clôture fonctionnelle :** 4 août 2026
- **Identifiant technique :** `interface`
- **Dépôt :** `ctotone/DEV-interface`
- **Nom court du dépôt :** `DEV-interface`
- **Branche :** `main`
- **Base de départ :** `546be8b109f2355821a02e30090b6ca89e220fc9`
- **Commit de clôture documentaire :** `d4926487700295843281e1adffd077bf8d56113d`

## 1. Objectif de la phase

Définir le périmètre de la première version jouable, la place des conflits, le rôle des paramètres MJ, l’organisation documentaire et le mode d’échange des fichiers.

## 2. Contexte

Le noyau de résolution des jets a été consolidé pendant la phase 00A.

Avant d’ouvrir l’architecture Foundry, il fallait déterminer :

- ce que la première version doit réellement permettre de jouer ;
- si un moteur de combat complet est nécessaire ;
- ce qui relève de règles modulaires ou de simples paramètres MJ ;
- comment conserver la mémoire du projet sans créer une arborescence disproportionnée ;
- comment échanger la base complète lorsque les actions Git directes ne sont pas retenues.

## 3. Périmètre traité

- première version jouable ;
- modèle général des conflits ;
- initiative ;
- armes et dégâts ;
- paramètres MJ ;
- identifiant technique ;
- dépôt de développement ;
- organisation de `.project/` ;
- protocole d’échange par ZIP ;
- roadmap générale.

## 4. Hors périmètre

- règles détaillées de création de personnage ;
- formule des trois statistiques dérivées ;
- structure exacte des armes ;
- formule des dégâts ;
- récupération des états ;
- architecture Actor, Item ou DataModel ;
- version cible de Foundry ;
- design définitif ;
- publication.

Ces éléments sont reportés vers les phases 01, 02 et suivantes.

## 5. Décisions validées

### 5.1 Première version jouable

La première version doit permettre de :

- créer et gérer un personnage ;
- effectuer les jets principaux ;
- appliquer Blessures, Stress et Destin ;
- gérer l’équipement essentiel ;
- utiliser des armes comme Items ;
- lancer une initiative simple ;
- jouer une scène de conflit résolue avec les jets ordinaires.

### 5.2 Absence de combat tactique complet

Le système ne prévoit pas :

- de ciblage ;
- de résistance ou défense automatisée ;
- d’armure calculée ;
- de comparaison attaquant/défenseur ;
- de gestion tactique de portée ou de position.

Les conflits sont résolus par des jets classiques sur trois statistiques dérivées qui seront détaillées pendant la phase 01.

### 5.3 Armes et dégâts

Les armes seront des Items spécifiques contenant les informations nécessaires aux dégâts.

L’idée de relier un jet de conflit réussi à un bouton de dégâts dans la carte de chat est conservée comme piste ergonomique à étudier pendant les phases Foundry. Elle n’est pas encore une obligation technique.

### 5.4 Paramètres MJ

Le système ne comporte pas de règles modulaires au sens d’options activables ou désactivables.

Le MJ dispose de réglages numériques pour les valeurs déjà prévues par les règles, notamment les paramètres de Blessures, Stress et Destin.

### 5.5 Identifiant technique

```text
interface
```

Cet identifiant est destiné au futur manifeste Foundry et aux structures techniques du système.

### 5.6 Dépôt de développement

```text
Nom court : DEV-interface
Dépôt : ctotone/DEV-interface
Branche : main
```

### 5.7 Organisation documentaire

La mémoire du projet est regroupée dans `.project/` avec une structure courte :

```text
.project/
├── PROJECT_STATE.md
├── ROADMAP.md
├── TRANSMISSION_CURRENT.md
├── decisions/
├── specification/
└── references/
```

Les fichiers de pilotage restent à la racine de `.project/`.

Les quatre références historiques restent directement dans `.project/references/`.

Aucun sous-dossier supplémentaire n’est créé sans besoin concret.

### 5.8 Échange par archives ZIP

Les échanges portent sur une archive complète du projet.

- `.git/` est toujours ignoré et exclu ;
- `.gitignore` est toujours ignoré et exclu ;
- le GPT retourne une archive complète mise à jour ;
- l’utilisateur réalise l’intégration Git, les commits et les pushes ;
- sauf indication explicite, l’utilisateur ne modifie pas le contenu de l’archive avant de la renvoyer ;
- le hash communiqué après intégration devient la nouvelle base d’autorité Git.

### 5.9 Roadmap

La roadmap validée comprend les phases suivantes :

```text
00A — Résolution des jets
00B — Cadrage produit et dépôt
01 — Personnage, équipement et conflits
02 — Architecture Foundry
03 — Première tranche jouable
04 — États, Destin et réglages MJ
05 — Conflits, initiative et armes
06 — Ergonomie et identité visuelle
07 — Tests et stabilisation
08 — Préparation de diffusion
```

## 6. Critères de réussite

- [x] première version jouable définie ;
- [x] absence de moteur tactique confirmée ;
- [x] rôle des armes et dégâts cadré ;
- [x] nature des paramètres MJ clarifiée ;
- [x] identifiant technique défini ;
- [x] dépôt et branche identifiés ;
- [x] organisation documentaire validée ;
- [x] protocole ZIP validé ;
- [x] roadmap validée.

## 7. Contrôles réalisés

- cohérence entre `PROJECT_STATE.md`, `ROADMAP.md` et `TRANSMISSION_CURRENT.md` ;
- présence de l’identifiant `interface` ;
- présence du commit de départ ;
- exclusion de `.git/` et `.gitignore` de l’archive livrée ;
- conservation sans modification de la spécification 00A et des quatre références historiques.

## 8. Tests utilisateur

Aucun test Foundry : le développement n’a pas commencé.

Les décisions de périmètre et la roadmap ont été validées explicitement par l’utilisateur.

## 9. Éléments ouverts

- règles détaillées de création ;
- trois statistiques dérivées ;
- initiative exacte ;
- structure des armes ;
- dégâts ;
- récupération des états ;
- progression éventuelle ;
- interaction finale entre jet réussi et dégâts dans la carte de chat.

## 10. Décision de clôture

```text
Statut final : PHASE VALIDÉE
Base de départ : commit 546be8b109f2355821a02e30090b6ca89e220fc9
Livrable de clôture : archive complète actualisée
Commit de clôture : d4926487700295843281e1adffd077bf8d56113d
```

## 11. Conséquences pour la suite

Cette phase permet d’ouvrir la consolidation des règles restantes sans ambiguïté sur le produit recherché.

Elle impose pour la suite :

- de ne pas concevoir un moteur de combat tactique ;
- de ne pas ajouter de système modulaire non demandé ;
- de consolider les règles de personnage et de conflit avant l’architecture Foundry ;
- de conserver une organisation documentaire légère ;
- de maintenir le mode d’échange par archive complète.

## 12. Prochaine phase

- **Numéro :** 01
- **Titre :** Personnage, équipement et conflits
- **Objectif principal :** consolider toutes les règles nécessaires à la première version jouable avant leur traduction technique.
- **Première action recommandée :** formaliser la création du personnage et les données portées par sa fiche.
