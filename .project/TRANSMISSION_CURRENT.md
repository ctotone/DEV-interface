# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 5 août 2026  
**Coordinateur :** GPT Pilote  
**Identifiant technique Foundry :** `interface`  
**Dépôt :** `ctotone/DEV-interface`  
**Nom court du dépôt :** `DEV-interface`  
**Branche active :** `main`  
**Commit de référence avant cette mise à jour :** `d4926487700295843281e1adffd077bf8d56113d`  
**Base matérielle de cette mise à jour :** archive complète `interface(3).zip` fournie par l’utilisateur  
**Développement Foundry :** non commencé

## Finalité

Créer un système Foundry VTT pour le Système D100 Interface, un moteur D100 générique, léger et orienté narration.

## Statut général

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase actuelle suivante : 02 — Architecture Foundry
Architecture Foundry : NON COMMENCÉE
Développement Foundry : NON COMMENCÉ
```

## Base de référence

### Base Git connue avant intégration de cette archive

```text
Dépôt : DEV-interface
Branche : main
Commit : d4926487700295843281e1adffd077bf8d56113d
```

Après intégration de cette archive, l’utilisateur communiquera le nouveau hash de commit. Ce hash deviendra la nouvelle base d’autorité Git.

### Sources fonctionnelles

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
```

La phase 00A reste l’autorité détaillée pour le moteur de résolution.  
La phase 01 complète cette base pour les autres données et comportements de la première version.

### Sources historiques

```text
.project/references/
```

Les sources historiques ne doivent pas être utilisées pour restaurer silencieusement une ancienne règle.

## Éléments validés

- identifiant technique du système : `interface` ;
- principes de légèreté et de soutien à la narration ;
- arbre complet de résolution des jets ;
- marges de réussite et d’échec distinctes, positives ou nulles ;
- fiche et création de personnage ;
- six compétences et dix-huit talents ;
- valeurs dérivées et initiative ;
- Blessures et Stress de `0 à 15` par paliers de trois ;
- Destin et paramètres numériques MJ ;
- équipements et armes ;
- parcours des dégâts dans le chat ;
- spécialisations ;
- progression en neuf gains ;
- première version jouable cadrée ;
- conflit sans moteur tactique complet ;
- roadmap des phases 00A à 08 ;
- organisation documentaire légère autour de `.project/` ;
- mode d’échange par archive ZIP complète.

## Décisions impératives

### Ne pas modifier sans confirmation

- les règles validées ;
- l’identifiant technique `interface` ;
- le périmètre de la première version jouable ;
- l’absence de moteur de combat tactique complet ;
- les plafonds et formules fonctionnelles validés ;
- la séparation entre interprétation narrative et qualification mécanique.

### Ne pas supposer

- une conséquence narrative automatique ;
- une application automatique des dégâts ;
- une relation automatique entre spécialisation et avantage ;
- une formule d’arme officielle non fournie ;
- une règle de récupération absente des spécifications ;
- un catalogue ou compendium d’armes définitif ;
- une mécanique modulaire non demandée.

### Ne pas ajouter prématurément

- ciblage ;
- armure ;
- résistance ;
- défense automatisée ;
- portée tactique ;
- structure technique Foundry avant validation de la phase 02 ;
- dossiers techniques sans usage réel.

## Convention d’échange par archive ZIP

- l’archive contient le projet complet ;
- `.git/` est toujours exclu ;
- `.gitignore` est toujours exclu ;
- le GPT retourne une archive complète mise à jour ;
- l’utilisateur intègre, teste, commit et pousse ;
- l’utilisateur communique ensuite le nouveau hash ;
- sauf indication explicite, l’utilisateur ne modifie pas l’archive retournée avant son prochain renvoi.

## Répartition des responsabilités

- **Utilisateur :** autorité finale, validation, tests réels, intégration Git, commits, push et publication.
- **GPT Pilote :** coordination, consolidation, état, roadmap et transmissions.
- **GPT JdR :** phase 01 produite.
- **GPT Foundry :** principal de la phase 02 et des phases techniques.
- **GPT Visuel :** contribution future à la phase 06.

## Dernières modifications produites dans cette archive

### Fichiers modifiés

- `README.md`
- `.project/PROJECT_STATE.md`
- `.project/ROADMAP.md`
- `.project/TRANSMISSION_CURRENT.md`
- `.project/decisions/PHASE_00B_CADRAGE_PRODUIT_ET_DEPOT.md`
- `.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md`

### Fichier ajouté

- `.project/decisions/PHASE_01_PERSONNAGE_EQUIPEMENT_CONFLITS.md`

### Fichiers conservés sans modification

- `.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md`
- les fichiers présents dans `.project/references/`

### Fichiers exclus de l’archive livrée

- `.git/`
- `.gitignore`

## Travail en cours

### Objectif exact

Préparer l’ouverture de la phase 02 consacrée à l’architecture Foundry.

### Déjà fait

- noyau de résolution validé ;
- première version jouable cadrée ;
- règles fonctionnelles de personnage, équipement et conflits validées ;
- marges clarifiées ;
- chronologie documentaire normalisée ;
- phase 01 clôturée fonctionnellement.

### Reste à faire avant le développement

- choisir la version cible de Foundry ;
- définir Actor, Item et modèles de données ;
- définir les settings de monde ;
- définir le contrat du moteur de jets ;
- définir les cartes de chat ;
- définir les permissions ;
- définir la stratégie de migration ;
- préparer le plan de tests techniques.

## Problèmes connus et limites

- la version cible de Foundry n’est pas encore choisie ;
- aucune architecture technique n’est validée ;
- aucun code Foundry n’existe ;
- aucun test Foundry n’a été réalisé ;
- les formules et catalogues d’armes restent différés ;
- plusieurs aides d’interface sont des réserves techniques à évaluer, pas des obligations déjà implémentées.

## Contrôles réalisés sur cette archive

- exclusion de `.git/` ;
- exclusion de `.gitignore` ;
- conservation de la racine `interface/` ;
- conservation des références historiques ;
- conservation sans modification de la spécification 00A ;
- correction de la section des marges dans la spécification 01 ;
- remplacement du hash erroné de la spécification 01 ;
- mise à jour des chemins normalisés ;
- cohérence des statuts entre les fichiers de pilotage ;
- validation de l’archive ZIP produite.

Aucun test Foundry n’a été réalisé : le développement n’a pas commencé.

## Livrables actifs

- `README.md`
- `.project/PROJECT_STATE.md`
- `.project/ROADMAP.md`
- `.project/TRANSMISSION_CURRENT.md`
- `.project/decisions/PHASE_00B_CADRAGE_PRODUIT_ET_DEPOT.md`
- `.project/decisions/PHASE_01_PERSONNAGE_EQUIPEMENT_CONFLITS.md`
- `.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md`
- `.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md`
- `.project/references/`

## Prochaine action exacte

Ouvrir la phase 02 avec GPT Foundry à partir de cette transmission et des deux spécifications fonctionnelles, puis produire une proposition d’architecture avant tout développement.
