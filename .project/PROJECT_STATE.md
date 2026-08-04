# État du projet — Système D100 Interface

**Dernière mise à jour :** 4 août 2026  
**Statut global :** cadrage et consolidation fonctionnelle en cours  
**Coordinateur :** GPT Pilote  
**Spécialiste technique principal prévu :** GPT Foundry  
**Dépôt de développement :** `ctotone/DEV-interface`  
**Branche de référence :** `main`

## Finalité

Créer un système de jeu complet pour Foundry VTT à partir du Système D100 Interface, un moteur générique, léger et orienté narration.

Le système doit soutenir la narration sans imposer une interprétation automatique des réussites, échecs, critiques ou marges.

## Principes directeurs validés

- privilégier la solution la plus légère lorsque plusieurs options sont suffisamment proches ;
- conserver la complexité des calculs dans le moteur plutôt qu’à la charge des joueurs ;
- distinguer les règles fonctionnelles de leur future implémentation Foundry ;
- ne pas restaurer silencieusement une ancienne règle issue du PDF ou de la fiche Roll20 ;
- ne pas commencer le développement sur un point de règle encore ouvert ;
- garder une organisation documentaire proportionnée à un projet géré par une seule personne.

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

- **Utilisateur :** autorité finale, arbitrages, validation, tests réels et publication.
- **GPT Pilote :** cadrage, coordination, consolidation et transmission.
- **GPT Foundry :** architecture et développement Foundry lors des phases techniques.
- **Autres GPT spécialisés :** contributions ponctuelles selon les phases.

## Invariants actuels

- `.project/` contient la mémoire interne du projet et ne doit pas faire partie d’une future archive de distribution.
- Les fichiers de pilotage restent directement à la racine de `.project/`.
- L’arborescence doit rester courte et ne pas anticiper des dossiers sans usage réel.
- Les règles du noyau de résolution validées ne sont pas modifiées sans arbitrage explicite de l’utilisateur.
