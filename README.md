# DEV-interface

Dépôt de développement du **Système D100 Interface** pour Foundry VTT.

- **Identifiant technique du système :** `interface`
- **Dépôt de référence :** `ctotone/DEV-interface`
- **Branche de référence :** `main`
- **Commit de référence avant cette mise à jour :** `d4926487700295843281e1adffd077bf8d56113d`

## Statut

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase 01 — Personnage, équipement et conflits : VALIDÉE
Phase suivante : 02 — Architecture Foundry
Développement Foundry : NON COMMENCÉ
```

## Finalité de la première version jouable

La première version doit permettre de :

- créer un personnage et gérer ses données ;
- effectuer les jets principaux ;
- appliquer Blessures, Stress et Destin ;
- gérer l’équipement essentiel ;
- utiliser des armes comme Items ;
- lancer une initiative simple ;
- jouer une scène de conflit résolue avec les jets ordinaires du système.

Le projet ne prévoit pas de moteur de combat tactique complet : pas de ciblage, de résistance automatisée, d’armure calculée ni d’application automatique des dégâts.

## Organisation

```text
.project/
├── PROJECT_STATE.md
├── ROADMAP.md
├── TRANSMISSION_CURRENT.md
├── decisions/
├── specification/
└── references/
```

- `.project/` contient la mémoire interne, les décisions, les transmissions, les spécifications et les sources historiques.
- Les fichiers de pilotage restent directement à la racine de `.project/`.
- Aucun sous-dossier supplémentaire n’est créé sans besoin réel.
- `.project/` devra être exclu des futures archives de distribution du système.

## Spécifications fonctionnelles actives

```text
.project/specification/
├── PHASE_00A_TRANSMISSION_FOUNDRY_RESOLUTION_JETS_INTERFACE.md
└── PHASE_01_SPECIFICATION_FONCTIONNELLE_PERSONNAGE_EQUIPEMENT_CONFLITS_INTERFACE.md
```

La phase 00A reste l’autorité détaillée pour l’algorithme des jets, le Destin et les marges.  
La phase 01 complète cette base pour le personnage, les valeurs dérivées, l’initiative, les états, l’équipement, les armes, les dégâts et la progression.

## Convention d’échange par archive ZIP

Les échanges de travail portent sur une archive complète du projet.

- le dossier `.git/` est toujours ignoré et exclu ;
- le fichier `.gitignore` est toujours ignoré et exclu ;
- GPT Pilote ou le GPT spécialisé retourne une archive complète mise à jour ;
- l’utilisateur réalise l’intégration Git, les commits et les pushes ;
- sauf indication explicite de l’utilisateur, le contenu d’une archive retournée est considéré comme inchangé avant son prochain renvoi.

## Reprise du projet

Ordre de lecture recommandé :

1. `.project/TRANSMISSION_CURRENT.md`
2. `.project/PROJECT_STATE.md`
3. `.project/ROADMAP.md`
4. les décisions utiles dans `.project/decisions/`
5. les spécifications concernées dans `.project/specification/`
