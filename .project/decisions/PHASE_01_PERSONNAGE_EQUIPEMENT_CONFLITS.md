# Phase 01 — Personnage, équipement et conflits

## Référence

- **Projet :** Système D100 Interface pour Foundry VTT
- **Statut :** VALIDÉE
- **Date d’ouverture :** 5 août 2026
- **Date de clôture fonctionnelle :** 5 août 2026
- **Identifiant technique :** `interface`
- **Dépôt :** `ctotone/DEV-interface`
- **Nom court du dépôt :** `DEV-interface`
- **Branche :** `main`
- **Base de départ :** `d4926487700295843281e1adffd077bf8d56113d`
- **Commit de clôture documentaire :** `90858fdf37839150cca6e6364bedac3aa5e16512`
- **GPT principal métier :** GPT JdR
- **Consolidation :** GPT Pilote

## 1. Objectif de la phase

Consolider les règles fonctionnelles nécessaires à la première version jouable avant leur traduction en architecture Foundry.

## 2. Livrable fonctionnel

```text
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
```

La spécification de phase 00A reste l’autorité détaillée pour l’algorithme du moteur de jets :

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
```

## 3. Périmètre traité

- fiche et identité du personnage ;
- création et validations souples ;
- compétences et talents ;
- valeurs dérivées ;
- initiative ;
- Blessures et Stress ;
- équipement et inventaire ;
- armes et dégâts ;
- spécialisations ;
- expérience et progression ;
- comportements fonctionnels attendus dans le chat ;
- permissions fonctionnelles propriétaire / MJ.

## 4. Décisions fonctionnelles validées

### 4.1 Personnage et création

- six compétences ;
- dix-huit talents fixes ;
- talents plafonnés absolument à `30` ;
- distribution recommandée des compétences : `20 / 30 / 30 / 40 / 40 / 50` ;
- cent points de talents recommandés ;
- écarts signalés mais confirmables ;
- points non dépensés non stockés comme réserve.

### 4.2 Jets et marges

- un jet standard associe toujours une compétence et un talent ;
- la phase 00A conserve l’autorité détaillée sur la résolution ;
- marge de réussite et marge d’échec sont deux valeurs distinctes ;
- chacune est positive ou nulle ;
- seule la marge correspondant à la qualification finale est pertinente ;
- une marge nulle peut ne pas être affichée dans le sous-texte de chat.

### 4.3 Valeurs dérivées

- Corps à corps ;
- Distance ;
- Verbal ;
- une valeur dérivée personnalisée globale optionnelle ;
- plafond commun à `99` ;
- formules validées dans la spécification fonctionnelle.

### 4.4 Initiative

```text
Initiative = 1D10 + arrondi(Distance / 10)
```

- ordre décroissant et stable ;
- égalités départagées par le MJ ;
- Blessures et Stress sans effet ;
- propriétaire et MJ autorisés à lancer ou relancer.

### 4.5 Blessures et Stress

- valeurs brutes de `0 à 15` ;
- niveaux `0 à 5` par paliers de trois ;
- coefficient commun configurable, valeur par défaut `3` ;
- malus appliqué aux jets D100 ;
- aucune conséquence narrative automatique au maximum.

### 4.6 Équipement, armes et dégâts

- type fonctionnel générique `Équipement` ;
- catégories minimales : objet ordinaire et arme ;
- quantité minimale `1` pour l’objet ordinaire ;
- arme avec formule de dégâts facultative ;
- choix d’arme dans le chat après réussite de conflit ;
- option de dégâts maximum après réussite critique ou super critique ;
- possibilité MJ de lancer quand même les dégâts après un échec ;
- aucune application automatique à une cible.

### 4.7 Spécialisations

- texte libre ;
- aucun bonus ni avantage automatique ;
- avantage éventuel accordé uniquement par arbitrage du MJ.

### 4.8 Progression

- jauge intermédiaire manuelle de `0` à `3` ;
- neuf gains au total :
  - trois fois `+5` en Compétence ;
  - trois fois `+15` points de Talents ;
  - trois nouvelles Spécialisations ;
- aucun nouveau cycle automatique ;
- assistance des gains à évaluer techniquement.

## 5. Réserves techniques transférées à la phase 02

- application assistée des gains de Compétence ;
- répartition contrôlée des quinze points de Talents ;
- comportement exact des cartes de chat d’armes et de dégâts ;
- stabilité des égalités d’initiative ;
- configuration de la valeur dérivée personnalisée ;
- présentation du détail Blessures / Stress ;
- permissions Foundry exactes ;
- stratégie de migration depuis les anciennes données Roll20.

Ces réserves ne rouvrent pas les règles validées. Elles concernent leur coût et leur forme d’implémentation.

## 6. Éléments différés

- catalogue complet d’armes ;
- catégories définitives d’armes ;
- formules de dégâts officielles ;
- portées ;
- équilibrage des armes ;
- listes par époque ;
- compendium final ;
- design graphique définitif ;
- localisation ;
- documentation utilisateur finale ;
- publication.

## 7. Contrôles réalisés

- comparaison avec la spécification de phase 00A ;
- clarification des marges ;
- correction du commit de départ indiqué dans le livrable ;
- vérification de la cohérence avec la première version jouable ;
- séparation entre règles validées, réserves techniques et éléments différés ;
- mise à jour de l’état, de la roadmap et de la transmission.

## 8. Tests

Aucun test Foundry n’a été réalisé.

La phase est une consolidation fonctionnelle. Les comportements techniques devront être testés à partir des futures candidates Foundry.

## 9. Décision de clôture

```text
Statut final : PHASE VALIDÉE
Base de départ : d4926487700295843281e1adffd077bf8d56113d
Livrable principal :
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
Commit de clôture : à communiquer par l’utilisateur après intégration
```

## 10. Conséquences pour la suite

La phase 02 peut désormais définir l’architecture Foundry à partir de règles fonctionnelles consolidées.

Elle doit :

- traduire les règles sans en inventer de nouvelles ;
- isoler les choix purement techniques ;
- chiffrer ou qualifier les réserves techniques ;
- préserver la simplicité d’usage ;
- préparer une première tranche jouable testable.

## 11. Prochaine phase

- **Numéro :** 02
- **Titre :** Architecture Foundry
- **GPT principal :** GPT Foundry
- **Objectif principal :** définir l’architecture technique, les modèles de données, les paramètres, les permissions, les cartes de chat et la stratégie de tests avant tout développement.
