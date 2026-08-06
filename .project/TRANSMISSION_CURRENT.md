# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 6 août 2026  
**Coordinateur :** GPT Pilote  
**Spécialiste principal de la phase clôturée :** GPT Foundry  
**Identifiant technique :** `interface`  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Dernier commit contenu dans l’archive :** `0852b3f62fafd2f0128a5ad8e3170eb791aebe39`  
**Commit de clôture de phase 03 :** à communiquer après intégration et push

## Finalité

Créer un système Foundry VTT générique, léger et orienté narration pour le Système D100 Interface.

## Statut

```text
Phases 00A, 00B, 01, 02 et 03 : VALIDÉES
Tranches 1, 2, 2B, 3 et 3B : VALIDÉES
Version package : 0.1.0
Version schéma : 1
Tests Foundry utilisateur T1 à T35 : OK
Contrôles hors Foundry : 390 OK
Publication : NON ENGAGÉE
```

## Base de reprise

Utiliser l’archive complète issue de la clôture de phase 03.

```text
Dépôt : ctotone/DEV-interface
Branche : main
Commit présent dans l’archive : 0852b3f62fafd2f0128a5ad8e3170eb791aebe39
Travaux de Tranche 3B : présents et validés dans l’arbre de travail
Commit de clôture : à renseigner après le push utilisateur
```

Un décalage temporaire entre le hash documentaire, le ZIP et le dernier push est normal dans le cycle d’échange du projet.

## Ordre de lecture

1. présent fichier ;
2. `.project/PROJECT_STATE.md` ;
3. `.project/ROADMAP.md` ;
4. `.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md` ;
5. `.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md` ;
6. spécifications 00A et 01 selon le sujet.

## État stable obtenu

- système installable sous Foundry V14 ;
- Actor `character` et Item `equipment` ;
- feuilles Actor et Item ;
- six Compétences, dix-huit Talents et ressources ;
- données dérivées et settings mondiaux ;
- moteur D100 complet pour normal, avantage et désavantage ;
- Destin et marges ;
- assistant de création avec `flags.interface.creation.pending` ;
- Items embarqués, Inventaire et Armes ;
- assets WebP par défaut ;
- première ergonomie fonctionnelle de la fiche ;
- permissions validées pour les usages testés.

## Décisions impératives de phase 03

### Création

```text
Créer un personnage
→ créer immédiatement un Actor character
→ poser flags.interface.creation.pending = true
→ sauvegarder progressivement sur cet Actor
→ retirer le flag à la validation finale
→ ouvrir la fiche classique du même Actor
```

### Jets

- les Compétences ne sont pas cliquables dans l’interface actuelle ;
- les Talents lancent le jet standard associé ;
- les valeurs de Combat lancent les jets dérivés ;
- le seuil n’est pas plafonné à `100`.

### Inventaire

- les objets ordinaires sont affichés dans Inventaire ;
- les armes sont affichées dans Armes ;
- aucune duplication visuelle ;
- suppression après confirmation explicite.

### Données et architecture

- Compétences : `0 à 100` ;
- Talents : `0 à 30` ;
- Actor unique : `character` ;
- Item unique : `equipment` ;
- catégories : `ordinary | weapon` ;
- version de schéma : `1` ;
- aucun socket, import Roll20 ou dépendance externe.

## Éléments non finalisés

- cartes de chat définitives ;
- dégâts depuis le chat ;
- initiative complète ;
- progression assistée ;
- Dice So Nice ;
- migrations ;
- verrouillage des écritures concurrentes ;
- identité visuelle finale ;
- stabilisation et publication.

## Anticipations à prendre en compte

La phase 03 a anticipé :

- une grande partie de la phase 04 ;
- une partie du socle de la phase 05 ;
- une partie importante de l’ergonomie prévue en phase 06.

Ne pas recommencer ces éléments. Recalibrer le reste des phases 04 à 06 à partir de la base réelle.

## Responsabilités

- **Utilisateur :** tests réels, validation, intégration Git, commits, push, version et publication.
- **GPT Pilote :** coordination, consolidation, roadmap et transmissions.
- **GPT Foundry :** développement et tests techniques Foundry.
- **GPT Visuel :** contribution future à l’identité visuelle lorsque la phase correspondante sera ouverte.

## Conventions opérationnelles des archives

- les archives entrantes peuvent contenir `.git/` et `.gitignore` ;
- un suffixe automatique dans le nom du ZIP n’indique pas une version fonctionnelle ;
- un écart de hash n’est signalé que s’il révèle une divergence réelle de contenu ou de branche ;
- les archives livrées par les GPT sont complètes et n’annoncent jamais un commit ou un push non réalisé.

## Référence historique

La version PDF historique a été remplacée par :

```text
.project/references/systeme de jeu Interface.md
```

## Prochaine action exacte

Après intégration et push, communiquer le nouveau hash de clôture à GPT Pilote, puis recalibrer la phase 04 avant toute nouvelle tranche de développement.
