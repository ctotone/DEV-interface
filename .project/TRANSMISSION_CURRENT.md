# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 4 août 2026  
**Coordinateur :** GPT Pilote  
**Dépôt :** `ctotone/DEV-interface`  
**Branche active :** `main`  
**Base technique :** dépôt initial, développement Foundry non commencé

## Finalité

Créer un système Foundry VTT pour le Système D100 Interface, un moteur D100 générique, léger et orienté narration.

## Statut général

```text
Phase 00 — Cadrage : en cours
Phase 00A — Noyau de résolution : validée fonctionnellement
Phase actuelle suivante : consolidation des autres règles
Développement Foundry : non commencé
```

## Base de référence

Pour le noyau de résolution :

```text
.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md
```

Les sources historiques sont conservées dans :

```text
.project/references/
```

Elles ne doivent pas être utilisées pour restaurer silencieusement une ancienne règle.

## Éléments validés

- principes de légèreté et de soutien à la narration ;
- arbre complet de résolution des jets ;
- valeurs par défaut des paramètres d’état et de Destin décrites dans la spécification ;
- vingt cas de test fonctionnels minimaux ;
- organisation documentaire légère autour de `.project/`.

## Décisions impératives

### Ne pas modifier sans confirmation

- les règles validées du noyau de résolution ;
- la hiérarchie entre décisions récentes, spécifications et sources historiques ;
- le rôle de `.project/` comme mémoire interne du dépôt ;
- l’organisation documentaire courte choisie pour ce projet.

### Ne pas supposer

- une version cible de Foundry ;
- une architecture de Documents ou DataModels ;
- une stratégie de publication ;
- une règle pour les points laissés ouverts dans la spécification.

### Ne pas ajouter prématurément

- des dossiers techniques sans usage réel ;
- des sous-dossiers documentaires supplémentaires ;
- des automatismes narratifs non demandés.

## Répartition des responsabilités

- **Utilisateur :** arbitre, valide, teste réellement et publie.
- **GPT Pilote :** coordonne, consolide et maintient la transmission.
- **GPT Foundry :** proposera puis réalisera l’architecture et le développement lors des phases techniques.
- **Actions Git actuelles :** organisation initiale validée ; toute publication ou suppression importante reste soumise à décision utilisateur.

## Problèmes connus et limites

- plusieurs sous-systèmes de règles restent à consolider ;
- la version cible de Foundry n’est pas encore choisie ;
- aucune architecture technique n’est validée ;
- aucun test Foundry n’a encore été réalisé ;
- les points ouverts de la spécification ne doivent pas être comblés silencieusement.

## Livrables actifs

- `.project/PROJECT_STATE.md`
- `.project/ROADMAP.md`
- `.project/TRANSMISSION_CURRENT.md`
- `.project/specification/TRANSMISSION_FOUNDRY_ARBRE_RESOLUTION_JETS_INTERFACE.md`
- `.project/references/Système de jeu Interface.pdf`
- `.project/references/interface.html`
- `.project/references/interface.css`
- `.project/references/translation.json`

## Prochaine action exacte

Consolider les règles encore ouvertes hors noyau de résolution avant de demander à GPT Foundry de proposer l’architecture technique.
