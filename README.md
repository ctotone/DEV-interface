# DEV-interface

Dépôt de développement du **Système D100 Interface** pour Foundry VTT.

- **Identifiant technique du système :** `interface`
- **Dépôt de référence :** `ctotone/DEV-interface`
- **Branche de référence :** `main`
- **Commit de référence avant cette mise à jour :** `546be8b109f2355821a02e30090b6ca89e220fc9`

## Statut

```text
Phase 00A — Résolution des jets : VALIDÉE
Phase 00B — Cadrage produit et dépôt : VALIDÉE
Phase suivante : 01 — Personnage, équipement et conflits
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

Le projet ne prévoit pas de moteur de combat tactique complet : pas de ciblage, de résistance, d’armure calculée ni d’automatisation narrative des conséquences.

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
- Les futurs fichiers distribuables du système Foundry seront ajoutés à la racine uniquement lorsqu’ils seront nécessaires.
- `.project/` devra être exclu des futures archives de distribution.
- Aucun sous-dossier supplémentaire n’est créé sans besoin réel.

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
