# État du projet — Système D100 Interface

**Dernière mise à jour :** 5 août 2026  
**Statut global :** conception fonctionnelle validée, phase d’architecture Foundry prête à ouvrir  
**Coordinateur :** GPT Pilote  
**Spécialiste technique principal suivant :** GPT Foundry  
**Nom court du dépôt :** `DEV-interface`  
**Dépôt de développement :** `ctotone/DEV-interface`  
**Branche de référence :** `main`  
**Commit de référence avant cette mise à jour :** `d4926487700295843281e1adffd077bf8d56113d`  
**Identifiant technique Foundry :** `interface`

## Finalité

Créer un système de jeu complet pour Foundry VTT à partir du Système D100 Interface, un moteur D100 générique, léger et orienté narration.

Le système doit soutenir la table sans imposer une interprétation automatique des réussites, échecs, critiques, marges ou conséquences narratives.

## Première version jouable validée

La première version utile doit permettre de :

- créer un personnage ;
- consulter et modifier ses données ;
- effectuer tous les jets principaux ;
- appliquer Blessures, Stress et Destin ;
- gérer l’équipement essentiel ;
- utiliser des armes comme Items ;
- effectuer un jet d’initiative simple ;
- jouer une scène de conflit avec les jets ordinaires du système.

## Modèle de conflit validé

Le système ne gère pas de combat tactique complet.

```text
Pas de cible à sélectionner
Pas de résistance ou défense automatisée
Pas d’armure calculée
Pas de comparaison attaquant/défenseur
Pas de gestion tactique automatisée de portée ou de position
Pas d’application automatique des dégâts
```

La résolution repose sur :

```text
Jet d’initiative simple
→ jet classique sur une valeur dérivée
→ interprétation par la table
→ choix éventuel d’une arme
→ jet de dégâts dans le chat
→ ajustement manuel des états concernés
```

## Noyau fonctionnel validé

### Personnage

- six compétences ;
- dix-huit talents fixes ;
- talents strictement plafonnés à `30` ;
- création recommandée à `20 / 30 / 30 / 40 / 40 / 50` ;
- cent points de talents recommandés ;
- validations de création souples et confirmables.

### Jets

- tout jet standard associe une compétence et un talent ;
- résultats automatiques, critiques et super-critiques définis ;
- avantage et désavantage résolus par qualité mécanique ;
- Destin individuel et paramètres MJ définis ;
- marges de réussite et d’échec distinctes, toujours positives ou nulles.

### Valeurs dérivées et initiative

- Corps à corps ;
- Distance ;
- Verbal ;
- une valeur dérivée personnalisée mondiale optionnelle ;
- valeurs dérivées plafonnées à `99` ;
- initiative : `1D10 + arrondi(Distance / 10)` ;
- Blessures et Stress sans effet sur l’initiative.

### Blessures et Stress

- valeurs brutes de `0 à 15` ;
- conversion en niveaux `0 à 5` par paliers de trois ;
- coefficient commun configurable, valeur par défaut `3` ;
- malus soustrait à tous les jets D100 ;
- aucune conséquence narrative automatique au maximum.

### Équipement, armes et dégâts

- un type fonctionnel générique `Équipement` ;
- catégories minimales : objet ordinaire et arme ;
- arme avec nom, description et formule de dégâts facultative ;
- sélection d’arme proposée dans le chat après une réussite de conflit ;
- option de dégâts maximum sur réussite critique ou super critique ;
- aucune application automatique à une cible.

### Spécialisations et progression

- spécialisations en texte libre ;
- aucun avantage ou bonus automatique ;
- parcours de progression limité à neuf gains :
  - trois gains de Compétence à `+5` ;
  - trois gains de Talents à `+15` points ;
  - trois nouvelles Spécialisations ;
- assistance d’application des gains à évaluer techniquement en phase 02.

## Paramètres MJ

Le projet ne prévoit pas un ensemble de règles modulaires activables.

Le MJ doit pouvoir configurer les valeurs numériques explicitement prévues, notamment :

- coefficient de Blessure et de Stress ;
- gain de Destin après échec ;
- plafond de Destin ;
- probabilité de déclenchement ;
- réserve minimale pour amortir un échec critique ;
- activation et configuration de la valeur dérivée personnalisée.

## Sources d’autorité fonctionnelles

### Phase 00A — Noyau de résolution

```text
.project/specification/PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
```

Autorité détaillée pour :

- le calcul du seuil ;
- la qualification des dés ;
- les modes normal, avantage et désavantage ;
- la sélection du résultat brut ;
- le Destin ;
- le résultat définitif ;
- les marges ;
- les cas de test fonctionnels.

### Phase 01 — Personnage, équipement et conflits

```text
.project/specification/PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
```

Autorité fonctionnelle pour :

- la fiche et la création ;
- les valeurs dérivées ;
- l’initiative ;
- Blessures et Stress ;
- l’équipement et les armes ;
- les dégâts ;
- les spécialisations ;
- l’expérience et la progression ;
- les comportements essentiels du chat.

En cas de différence non explicitement présentée comme une évolution validée, la spécification détaillée de phase 00A reste prioritaire pour le noyau de résolution.

## État des phases

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase 02 — Architecture Foundry : PROCHAINE
Phases 03 à 08 : PLANIFIÉES
```

La roadmap validée se trouve dans `.project/ROADMAP.md`.

## État technique

```text
Architecture Foundry : non définie
Code du système : non commencé
Manifeste system.json : non créé
Version cible de Foundry : non décidée
Version du système : non décidée
Publication : hors périmètre actuel
```

## Responsabilités actuelles

- **Utilisateur :** autorité finale, arbitrages, validation, tests réels, intégration Git et publication.
- **GPT Pilote :** cadrage, coordination, consolidation et transmission.
- **GPT JdR :** phase 01 produite et consolidée.
- **GPT Foundry :** principal de la phase 02 et des phases techniques suivantes.
- **GPT Visuel :** contribution future à l’ergonomie et à l’identité visuelle.

## Convention de travail par archive ZIP

- l’archive échangée contient le projet complet ;
- `.git/` et `.gitignore` sont toujours ignorés et exclus ;
- le GPT retourne une archive complète mise à jour ;
- l’utilisateur réalise les commits et communique le nouveau hash validé ;
- sauf indication explicite contraire, l’utilisateur ne modifie pas le contenu de l’archive entre sa réception et son prochain renvoi ;
- le dernier hash communiqué après intégration devient la nouvelle base d’autorité Git.

## Invariants actuels

- `.project/` contient la mémoire interne du projet et ne doit pas faire partie d’une future archive de distribution.
- Les fichiers de pilotage restent directement à la racine de `.project/`.
- L’arborescence reste courte et n’anticipe pas des dossiers sans usage réel.
- Les règles validées ne sont pas modifiées sans arbitrage explicite de l’utilisateur.
- Les sources historiques ne restaurent jamais silencieusement une ancienne règle.
- Le futur système Foundry conserve l’identifiant technique `interface`.
