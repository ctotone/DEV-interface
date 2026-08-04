# État du projet — Système D100 Interface

**Dernière mise à jour :** 4 août 2026  
**Statut global :** cadrage produit validé, consolidation fonctionnelle restante avant architecture Foundry  
**Coordinateur :** GPT Pilote  
**Spécialiste technique principal prévu :** GPT Foundry  
**Nom court du dépôt :** `DEV-interface`  
**Dépôt de développement :** `ctotone/DEV-interface`  
**Branche de référence :** `main`  
**Commit de référence avant cette mise à jour :** `546be8b109f2355821a02e30090b6ca89e220fc9`  
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
Pas de gestion tactique de portée ou de position
```

La résolution prévue repose sur :

```text
Jet d’initiative simple
→ jet classique sur une statistique dérivée de conflit
→ interprétation par la table
→ dégâts définis par l’arme en cas d’attaque réussie
```

Trois statistiques dérivées des compétences et talents doivent encore être décrites pendant la phase 01.

Une interaction de type « jet de conflit réussi → bouton de dégâts de l’arme dans la carte de chat » est une piste ergonomique à étudier, pas encore une règle technique validée.

## Paramètres MJ

Le projet ne prévoit pas un ensemble de règles modulaires activables.

Le MJ doit seulement pouvoir configurer certaines valeurs numériques prévues par les règles, notamment :

- coefficient de Blessure et de Stress ;
- gain de Destin après échec ;
- plafond de Destin ;
- probabilité de déclenchement ;
- réserve minimale nécessaire pour amortir un échec critique ;
- autres valeurs explicitement validées dans les futures spécifications.

Les valeurs par défaut du noyau de résolution sont fixées dans la spécification fonctionnelle correspondante.

## Principes directeurs validés

- privilégier la solution la plus légère lorsque plusieurs options sont suffisamment proches ;
- conserver la complexité des calculs dans le moteur plutôt qu’à la charge des joueurs ;
- distinguer les règles fonctionnelles de leur future implémentation Foundry ;
- ne pas restaurer silencieusement une ancienne règle issue du PDF ou de la fiche Roll20 ;
- ne pas commencer le développement sur un point de règle encore ouvert ;
- garder une organisation documentaire proportionnée à un projet géré par une seule personne ;
- ne pas transformer le système en moteur tactique ou narratif autoritaire.

## Sources historiques

Les sources historiques sont conservées dans `.project/references/` :

- `Système de jeu Interface.pdf`
- `interface.html`
- `interface.css`
- `translation.json`

Elles décrivent des états antérieurs du système. Elles servent à comprendre son évolution, mais ne priment pas sur les décisions explicitement validées.

## Base fonctionnelle validée

Le noyau de résolution des jets est consolidé dans :

```text
.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md
```

Cette spécification fixe notamment :

- le calcul du seuil ;
- les zones automatiques ;
- les critiques et super-critiques ;
- les modes normal, avantage et désavantage ;
- la sélection du résultat brut ;
- le Destin ;
- le calcul des marges ;
- les paramètres MJ associés ;
- les cas de test fonctionnels minimaux.

## État des phases

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : PROCHAINE
Phases 02 à 08 : PLANIFIÉES
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
- **GPT JdR :** contribution principale attendue pour la consolidation des règles de la phase 01.
- **GPT Foundry :** architecture et développement Foundry lors des phases techniques.
- **GPT Visuel :** contribution future à l’ergonomie et à l’identité visuelle.
- **Autres GPT spécialisés :** contributions ponctuelles selon les besoins validés.

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
- L’arborescence doit rester courte et ne pas anticiper des dossiers sans usage réel.
- Les règles du noyau de résolution validées ne sont pas modifiées sans arbitrage explicite de l’utilisateur.
- Les sources historiques ne doivent pas être utilisées pour restaurer silencieusement une ancienne règle.
- Le futur système Foundry conserve l’identifiant technique `interface`.
