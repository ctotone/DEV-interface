# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 4 août 2026  
**Coordinateur :** GPT Pilote  
**Identifiant technique Foundry :** `interface`  
**Dépôt :** `ctotone/DEV-interface`  
**Nom court du dépôt :** `DEV-interface`  
**Branche active :** `main`  
**Commit de référence avant cette mise à jour :** `546be8b109f2355821a02e30090b6ca89e220fc9`  
**Base matérielle de cette mise à jour :** archive complète `interface.zip` fournie par l’utilisateur  
**Développement Foundry :** non commencé

## Finalité

Créer un système Foundry VTT pour le Système D100 Interface, un moteur D100 générique, léger et orienté narration.

## Statut général

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase actuelle suivante : 01 — Personnage, équipement et conflits
Architecture Foundry : NON COMMENCÉE
Développement Foundry : NON COMMENCÉ
```

## Base de référence

### Base Git connue avant intégration de cette archive

```text
Dépôt : DEV-interface
Branche : main
Commit : 546be8b109f2355821a02e30090b6ca89e220fc9
```

### Source fonctionnelle du noyau de résolution

```text
.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md
```

### Sources historiques

```text
.project/references/
```

Les sources historiques ne doivent pas être utilisées pour restaurer silencieusement une ancienne règle.

Après intégration de cette archive, l’utilisateur communiquera le nouveau hash de commit. Ce hash deviendra la nouvelle base d’autorité Git.

## Éléments validés

- identifiant technique du système : `interface` ;
- principes de légèreté et de soutien à la narration ;
- arbre complet de résolution des jets ;
- valeurs par défaut des paramètres d’état et de Destin décrites dans la spécification ;
- première version jouable cadrée ;
- conflit résolu par jets ordinaires, sans moteur tactique complet ;
- initiative simple ;
- armes prévues comme Items portant les dégâts ;
- réglages MJ limités aux valeurs numériques prévues par les règles ;
- roadmap des phases 00A à 08 ;
- organisation documentaire légère autour de `.project/` ;
- mode d’échange par archive ZIP complète.

## Décisions impératives

### Ne pas modifier sans confirmation

- les règles validées du noyau de résolution ;
- l’identifiant technique `interface` ;
- le périmètre de la première version jouable ;
- l’absence de moteur de combat tactique complet ;
- la hiérarchie entre décisions récentes, spécifications et sources historiques ;
- le rôle de `.project/` comme mémoire interne du dépôt ;
- l’organisation documentaire courte choisie pour ce projet.

### Ne pas supposer

- une version cible de Foundry ;
- une architecture de Documents ou DataModels ;
- la formule des trois statistiques dérivées ;
- les règles détaillées de création, progression, équipement et récupération non encore consolidées ;
- le fonctionnement définitif du bouton de dégâts dans la carte de chat ;
- une stratégie de publication ;
- une règle pour les points laissés ouverts dans les spécifications.

### Ne pas ajouter prématurément

- des dossiers techniques sans usage réel ;
- des sous-dossiers documentaires supplémentaires ;
- des automatismes tactiques ou narratifs non demandés ;
- un système de règles modulaires.

## Convention d’échange par archive ZIP

```text
Archive complète fournie par l’utilisateur
→ exclusion de .git/ et .gitignore
→ vérification de la base
→ modifications limitées au périmètre validé
→ mise à jour de .project si nécessaire
→ contrôles disponibles
→ retour d’une archive complète
→ intégration, tests et commit par l’utilisateur
→ communication du nouveau hash
```

Règles associées :

- `.git/` et `.gitignore` sont toujours ignorés ;
- le GPT ne les analyse, ne les modifie et ne les recrée pas dans l’archive ;
- l’utilisateur réalise les commits et les pushes ;
- sauf indication explicite de l’utilisateur, le contenu d’une archive retournée est considéré comme inchangé avant son prochain renvoi ;
- une archive reçue constitue la base matérielle de départ du tour ;
- le hash communiqué après intégration constitue la base d’autorité Git.

## Répartition des responsabilités

- **Utilisateur :** arbitre, valide, teste réellement, intègre les ZIP, crée les commits, pousse et publie.
- **GPT Pilote :** coordonne, consolide, prépare les phases et maintient la mémoire du projet.
- **GPT JdR :** consolidera les règles métier de la phase 01 avec GPT Pilote.
- **GPT Foundry :** proposera puis réalisera l’architecture et le développement lors des phases techniques.
- **GPT Visuel :** contribuera à la phase ergonomique et graphique lorsqu’elle sera ouverte.

## Dernières modifications produites dans cette archive

### Fichiers modifiés

- `README.md`
- `.project/PROJECT_STATE.md`
- `.project/ROADMAP.md`
- `.project/TRANSMISSION_CURRENT.md`

### Fichier ajouté

- `.project/decisions/PHASE_00B_CADRAGE_PRODUIT_ET_DEPOT.md`

### Fichiers conservés sans modification

- `.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md`
- les quatre fichiers de `.project/references/`

### Fichiers exclus

- `.git/`
- `.gitignore`

## Travail en cours

### Objectif exact

Préparer l’ouverture de la phase 01 consacrée aux règles du personnage, de l’équipement et des conflits simples.

### Déjà fait

- noyau de résolution validé ;
- première version jouable cadrée ;
- roadmap validée ;
- dépôt et identifiant technique définis ;
- mémoire documentaire synchronisée dans cette archive.

### Reste à faire avant architecture Foundry

- consolider la création de personnage ;
- préciser les trois statistiques dérivées de conflit ;
- préciser l’initiative ;
- préciser les Items d’équipement et d’arme ;
- préciser les dégâts ;
- préciser la récupération des Blessures et du Stress ;
- décider si la progression appartient à la première version.

## Problèmes connus et limites

- les règles de la phase 01 ne sont pas encore consolidées ;
- la version cible de Foundry n’est pas encore choisie ;
- aucune architecture technique n’est validée ;
- aucun code Foundry n’existe ;
- aucun test Foundry n’a été réalisé ;
- les points ouverts ne doivent pas être comblés silencieusement.

## Contrôles réalisés sur cette archive

- exclusion de `.git/` ;
- exclusion de `.gitignore` ;
- conservation de la racine `interface/` ;
- conservation des quatre références historiques ;
- conservation sans modification de la spécification du noyau de résolution ;
- cohérence des statuts de phases entre les fichiers de pilotage ;
- présence de l’identifiant technique `interface` ;
- présence du commit de référence connu.

Aucun test Foundry n’a été réalisé : le développement n’a pas commencé.

## Livrables actifs

- `README.md`
- `.project/PROJECT_STATE.md`
- `.project/ROADMAP.md`
- `.project/TRANSMISSION_CURRENT.md`
- `.project/decisions/PHASE_00B_CADRAGE_PRODUIT_ET_DEPOT.md`
- `.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md`
- `.project/references/Système de jeu Interface.pdf`
- `.project/references/interface.html`
- `.project/references/interface.css`
- `.project/references/translation.json`

## Prochaine action exacte

Ouvrir la phase 01 et consolider d’abord les règles de création du personnage ainsi que les données que sa fiche doit porter, avant toute traduction en structures Foundry.
