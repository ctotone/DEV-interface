# Phase 03 — Première tranche jouable

## Référence

- **Projet :** Système D100 Interface
- **Statut :** VALIDÉE
- **Date d’ouverture :** 5 août 2026
- **Date de clôture fonctionnelle :** 6 août 2026
- **Version du produit :** `0.1.0`
- **Version de schéma :** `1`
- **Branche :** `main`
- **Base de départ :** `ba2871fb2f5ec175b525535f0d31e8f3426a1b23`
- **Dernier commit contenu dans l’archive de clôture :** `0852b3f62fafd2f0128a5ad8e3170eb791aebe39`
- **Commit de clôture documentaire :** `72a2d32ff51661e548f3900792fca263e8b75b98`
- **GPT principal :** GPT Foundry
- **Coordination et consolidation :** GPT Pilote
- **Tests réels :** utilisateur sous Foundry VTT `14.365`

# 1. Objectif de la phase

Produire une première base Foundry réellement installable, persistante et jouable, comprenant la fiche de personnage, les données essentielles, les valeurs dérivées et les jets D100 principaux.

# 2. Résultat obtenu

La phase a produit et validé :

- le système Foundry `interface` installable en V14 ;
- le manifeste, le point d’entrée, la langue française et les settings mondiaux ;
- les DataModels `character` et `equipment` ;
- les feuilles Actor et Item ;
- les Compétences, Talents, états, ressources et données dérivées ;
- les Items embarqués et les catégories `ordinary | weapon` ;
- le moteur D100 pur avec normal, avantage, désavantage, Destin et marges ;
- un premier rendu public technique des jets ;
- un assistant de création de personnage lié à un Actor réel ;
- une première adaptation ergonomique substantielle de la fiche ;
- les assets par défaut des Actors et des équipements ;
- les contrôles de permissions prévus pour les fonctions livrées.

La phase 03 fournit une première tranche jouable. Elle ne constitue pas encore une version complète, stabilisée ou publiable.

# 3. Tranches réalisées

```text
Tranche 1  — Squelette installable : VALIDÉE
Tranche 2  — Données et dérivés : VALIDÉE
Tranche 2B — Adaptation fonctionnelle de la fiche : VALIDÉE
Tranche 3  — Moteur D100 : VALIDÉE
Tranche 3B — Assistant de création et ergonomie complémentaire : VALIDÉE
```

# 4. Évolutions hors cadrage initial validées

Les évolutions suivantes ont été demandées, arbitrées et validées explicitement par l’utilisateur pendant la phase :

- assistant de création de personnage ;
- création immédiate d’un Actor en état d’attente ;
- flag `flags.interface.creation.pending` ;
- sauvegarde progressive et réouverture de l’assistant tant que la création n’est pas finalisée ;
- jetons de répartition des Compétences ;
- compteur des points de Talents ;
- désactivation des jets déclenchés depuis les noms des Compétences ;
- ordre de tabulation direct des champs de Talents ;
- adaptation ergonomique de l’identité, des états et des cartes de Combat ;
- séparation visuelle des sections Armes et Inventaire ;
- images par défaut des Actors et Items ;
- suppression sécurisée des équipements ;
- retrait des éléments provisoires de développement visibles sur la fiche.

Ces éléments deviennent des décisions de projet pour la version `0.1.0`. Ils ne modifient pas automatiquement un référentiel permanent.

# 5. Décisions fonctionnelles consolidées

## 5.1 Création en attente

```text
Création d’un personnage
→ création immédiate d’un Actor character
→ flags.interface.creation.pending = true
→ sauvegarde progressive sur cet Actor
→ fermeture possible sans finalisation
→ réouverture automatique de l’assistant
→ validation finale
→ retrait du flag
→ ouverture de la fiche classique du même Actor
```

Aucun brouillon parallèle et aucun second Actor ne sont créés.

## 5.2 Déclenchement des jets

- les noms de Compétences ne déclenchent plus de jet depuis l’interface ;
- les Talents déclenchent le jet standard avec leur Compétence associée ;
- les valeurs de Combat déclenchent leurs jets dérivés ;
- le code interne du jet de Compétence est conservé sans déclencheur visible.

## 5.3 Inventaire et armes

- tous les équipements restent des Items embarqués ;
- les objets ordinaires apparaissent dans Inventaire ;
- les armes apparaissent dans la section Armes ;
- aucune duplication visuelle n’est affichée ;
- la suppression d’un équipement exige une confirmation explicite.

## 5.4 Assets par défaut

```text
Actor :
systems/interface/assets/actor/avatar-default.webp

Objet ordinaire :
systems/interface/assets/items/item_default.webp

Arme :
systems/interface/assets/items/weapon_default.webp
```

Les images choisies par l’utilisateur restent prioritaires.

# 6. Données et architecture

## État persistant ajouté

```text
flags.interface.creation.pending
```

Ce flag distingue uniquement une création en attente d’un personnage finalisé.

## Invariants conservés

- identifiant du package `interface` ;
- compatibilité déclarée V14 ;
- `Actor.type = character` ;
- `Item.type = equipment` ;
- catégories `ordinary | weapon` ;
- version du package `0.1.0` ;
- version de schéma `1` ;
- aucun socket ;
- aucune dépendance externe ;
- aucune migration ;
- aucun import Roll20 ;
- données dérivées non persistées ;
- moteur D100 séparé du DOM et des Documents.

# 7. Contrôles et tests

## Contrôles hors Foundry

Rejoués lors de la consolidation :

```text
390 contrôles hors Foundry réussis
22 modules JavaScript vérifiés
3 tests unitaires exécutés
chargement isolé et enregistrements init simulés : OK
```

## Tests utilisateur

L’utilisateur a validé sous Foundry VTT `14.365` :

```text
T1 à T35 : OK
```

Ces tests couvrent notamment l’installation, la persistance, les permissions, les feuilles, l’assistant de création, les données, les jets D100, les états, les Items, les assets et les principales retouches ergonomiques.

# 8. Éléments non produits ou non finalisés

Restent hors de la clôture de phase 03 :

- cartes de chat finales ;
- flux complet des dégâts depuis le chat ;
- initiative entièrement intégrée et validée ;
- progression assistée complète ;
- prototype Dice So Nice ;
- migrations d’un monde existant ;
- traitement renforcé des écritures concurrentes ;
- identité visuelle finale ;
- tests globaux de stabilisation ;
- préparation de publication.

# 9. Anticipations sur les phases suivantes

La phase 03 a anticipé une partie de plusieurs phases planifiées :

- **phase 04 :** Blessures, Stress, malus d’état, settings et moteur du Destin ;
- **phase 05 :** valeurs dérivées de conflit, équipements et armes ;
- **phase 06 :** ergonomie de la fiche, assistant de création et premiers assets.

Ces anticipations sont validées comme état réel du produit. Elles ne clôturent pas automatiquement les phases 04 à 06. Leur périmètre restant doit être recalibré avant le prochain développement.

# 10. Problèmes connus et limites

- le rendu de chat actuel reste technique et provisoire ;
- l’absence de verrou distribué laisse subsister un risque de dernière écriture gagnante entre propriétaires concurrents ;
- l’image du prototype Token n’est pas automatiquement synchronisée avec `Actor.img` ;
- la création dans un compendium n’a pas été validée en test réel ;
- aucune publication ou release n’a été engagée.

# 11. Décision de clôture

## Statut final

```text
Phase 03 — Première tranche jouable : VALIDÉE
```

## Motif

Le livrable existe, les tranches annoncées ont été produites, les contrôles hors Foundry réussissent et les tests T1 à T35 ont été validés par l’utilisateur.

## Base de référence obtenue

```text
Branche : main
Commit présent dans l’archive : 0852b3f62fafd2f0128a5ad8e3170eb791aebe39
Travaux de Tranche 3B : présents dans l’arbre de travail
Commit de clôture : 72a2d32ff51661e548f3900792fca263e8b75b98
Version : 0.1.0
```

# 12. Conséquences pour la suite

La phase permet désormais de reprendre le projet depuis une base jouable et testée.

Avant d’ouvrir une nouvelle tranche de développement, la roadmap des phases 04 à 06 doit être recalibrée pour distinguer :

- ce qui est déjà produit et validé ;
- ce qui reste réellement à développer ;
- ce qui relève de la finition, des tests ou du design.

# 13. Prochaine action au moment de la clôture

L’intégration et le push de clôture ont été réalisés par l’utilisateur.

```text
Commit de clôture de la phase 03 :
72a2d32ff51661e548f3900792fca263e8b75b98
```

La phase 04 n’a pas encore été ouverte.

# 14. Addendum post-clôture — Compendiums d’armes et d’objets

## 14.1 Qualification

```text
Nature : complément post-clôture de la phase 03
Statut : VALIDÉ PAR L’UTILISATEUR
Réouverture de la phase 03 : NON
Ouverture de la phase 04 : NON
Publication : NON ENGAGÉE
```

Ce complément enrichit la base jouable avant le recalibrage de la phase 04. Il ne modifie pas le statut historique de la phase 03 ni son commit de clôture.

## 14.2 Base et validation

```text
Commit de clôture historique de la phase 03 :
72a2d32ff51661e548f3900792fca263e8b75b98

Dernier commit observé avant intégration du complément :
7d7e7d7cb994951fa41cba9f6520a591900c7dfe

Commit d’intégration du complément :
à communiquer après intégration et push par l’utilisateur

Foundry réellement testé :
14.365

Tests utilisateur compendiums :
T1 à T11 — OK

Contrôles hors Foundry :
718 réussis
```

## 14.3 Résultat ajouté

Deux compendiums système natifs ont été produits et validés :

```text
Objets
Collection : interface.objects
Contenu    : 60 Items equipment / category ordinary
Dossiers   : 8

Armes
Collection : interface.weapons
Contenu    : 42 Items equipment / category weapon
Dossiers   : 3
```

Les identifiants `interface.objects` et `interface.weapons`, les IDs des 102 Items et les IDs des 11 dossiers sont désormais structurants.

L’arbitrage utilisateur suivant est intégré :

```text
Nom final : Mitrailleuse lourde
Formule   : 3D6+1
```

Les 102 descriptions sont enregistrées en texte brut, sans balises HTML visibles.

## 14.4 Chaîne de production validée

```text
packs-src/
→ sources JSON lisibles et modifiables

tools/build-compendiums.mjs
→ reconstruction contrôlée

packs/
→ bases installables Foundry
```

Une reconstruction doit partir de `packs-src/` puis être suivie des contrôles du projet. Les bases produites ne doivent pas devenir la seule source de vérité éditoriale.

## 14.5 Invariants conservés

Ce complément n’ajoute aucun nouveau :

- DataModel ;
- type d’Actor ou d’Item ;
- setting ;
- flag ;
- socket ;
- schéma ;
- mécanisme de migration ;
- dépendance ;
- contrat d’API publique.

La version package reste `0.1.0` et la version de schéma reste `1`.

## 14.6 Observation méthodologique

**[CANDIDATE D’ÉVOLUTION — outillage transversal Foundry]**

Les outils de validation, de chargement isolé, de tests unitaires, de construction de compendiums et de contrôle d’archive montrent un potentiel de réutilisation.

Ils ne sont pas transformés à ce stade en framework permanent. Leur valeur générique devra être évaluée en fin de projet à partir :

- de leur usage réel sur l’ensemble du projet Interface ;
- du temps et des erreurs économisés ;
- des adaptations propres à Interface ;
- d’un éventuel second projet de comparaison ;
- du REX préparé par GPT Foundry à destination de GPT Architecte.

## 14.7 Conséquence pour la suite

La phase 04 devra partir de la base incluant ce complément. Elle ne devra pas recréer les compendiums, leurs identifiants, leur contenu ni leur chaîne de reconstruction.

