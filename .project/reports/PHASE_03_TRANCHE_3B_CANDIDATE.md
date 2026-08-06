# Rapport technique — Phase 03, Tranche 3B — Assistant de création en attente

**Package :** système Foundry VTT `interface`  
**Version locale :** `0.1.0`  
**Foundry ciblé :** V14, environnement utilisateur `14.365`  
**Base source :** branche `main`, commit `0852b3f62fafd2f0128a5ad8e3170eb791aebe39`  
**Schéma persisté :** `1`, inchangé  
**Statut :** candidate ergonomique complémentaire après validation utilisateur de T1 à T27

## 1. Origine de l’évolution

La Tranche 3B n’appartenait pas au cadrage initial. Elle a été ajoutée pendant la Phase 3 sur instruction explicite de l’utilisateur.

Les adaptations suivantes ont également été arbitrées et validées par l’utilisateur :

- création immédiate d’un Actor incomplet ;
- persistance du flag `flags.interface.creation.pending = true` ;
- réouverture automatique de la pré-fiche tant que la création n’est pas finalisée ;
- sauvegarde progressive de toutes les données saisies sur l’Actor existant ;
- suppression du flag au clic final sur **Créer le personnage** ;
- compteur de Talents affiché directement dans le bloc Talents ;
- désactivation des jets depuis les libellés de Compétences ;
- conservation du code interne de jet de Compétence pour une éventuelle réactivation future ;
- enchaînement clavier direct entre les champs numériques des Talents ;
- centrage des cartes de Combat avec dimensions homogènes et sans étirement.

Ces changements sont des décisions projet utilisateur, pas des initiatives fonctionnelles autonomes.

## 2. Cycle de vie retenu

```text
Créer un acteur
→ création immédiate d’un Actor type character
→ flags.interface.creation.pending = true
→ ouverture de la pré-fiche
→ sauvegarde progressive dans les champs normaux de l’Actor
→ fermeture possible sans finalisation
→ nouveau clic sur l’Actor
→ réouverture de la pré-fiche
→ Créer le personnage
→ contrôle des recommandations
→ éventuelle confirmation souple
→ suppression du flag creation.pending
→ ouverture de la fiche classique
```

La fermeture par la croix ne supprime pas l’Actor et ne finalise pas la création.

## 3. Données persistées pendant l’attente

La pré-fiche met à jour l’Actor existant :

```text
name
img
system.identity.age
system.identity.profession
system.identity.specializations
system.skills.*
system.talents.*
flags.interface.creation.pending = true
```

Les champs métier existants restent la source de vérité. Aucun brouillon parallèle n’est créé.

Les éléments suivants restent calculés ou temporaires :

- dérivés ;
- diagnostics de recommandations ;
- compteurs ;
- associations visuelles des jetons ;
- état de glisser-déposer ;
- disposition de la fenêtre.

## 4. Finalisation

Au clic sur **Créer le personnage** :

1. les dernières valeurs valides sont enregistrées ;
2. les recommandations sont contrôlées ;
3. les écarts restent informatifs et peuvent être validés ;
4. `actor.unsetFlag("interface", "creation.pending")` retire l’état d’attente ;
5. la pré-fiche se ferme ;
6. la fiche classique du même Actor s’ouvre.

Aucun second Actor n’est créé.

## 5. Permissions

- MJ ou propriétaire : pré-fiche modifiable tant que le flag existe ;
- observateur : fiche classique plate en lecture seule ;
- aucune synchronisation par socket ajoutée ;
- en cas de modification simultanée par deux propriétaires, la dernière mise à jour reçue par Foundry prévaut.

## 6. Compteur de Talents

Le total est désormais visible à deux endroits :

```text
Bloc Talents
→ Points de Talents attribués : X / 100

Récapitulatif
→ X / 100
→ points disponibles
```

Les deux projections utilisent le même diagnostic calculé et se mettent à jour ensemble.

## 7. Compétences non cliquables

Sur la fiche classique :

- les noms des Compétences sont des libellés statiques ;
- aucune action `data-action="rollSkill"` n’est exposée dans le template ;
- aucun survol de lien ni pré-lancer ne part depuis une Compétence ;
- les champs numériques restent modifiables par le propriétaire ;
- Talents et dérivés restent les déclencheurs de jets.

La fonction interne `rollSkillAction` et son raccordement applicatif sont conservés, mais aucun élément d’interface ne les appelle.

## 8. Ajustements ergonomiques finaux

### Ordre de tabulation des Talents

Les boutons de jet de Talent restent cliquables à la souris, mais sont retirés de l’ordre de tabulation avec `tabindex="-1"`.

Les champs numériques conservent l’ordre du DOM défini par `TALENT_GROUPS` :

```text
Endurance
→ Force brute
→ Robustesse
→ Agilité corporelle
→ Précision
→ Réflexe
→ groupes suivants
```

Aucune donnée, règle ni sauvegarde n’est modifiée.

### Cartes de Combat

Le conteneur des dérivés de la fiche classique utilise un groupe flexible centré. Chaque carte conserve une emprise fixe de `10rem` et une hauteur minimale identique de `4.8rem`.

Une ligne incomplète reste centrée. Les cartes ne remplissent plus artificiellement toute la largeur disponible.

## 9. Retouches ergonomiques de la fiche Actor

### Talents

- retrait du compteur `X / 100` dans le titre repliable ;
- conservation du total dans les zones où il reste utile ;
- réduction contrôlée des espacements internes ;
- boutons de jet et champs numériques toujours utilisables ;
- ordre de tabulation T17 conservé.

### Armes

- section repliable autonome, distincte de Combat ;
- petit bouton `+` dans le titre avec infobulle **Ajouter une arme** ;
- affichage exclusif des Items `equipment` de catégorie `weapon` ;
- aucune duplication dans Inventaire.

### Inventaire

- affichage exclusif des objets ordinaires ;
- retrait du compteur d’Items dans le titre ;
- retrait des deux gros boutons ;
- petit bouton `+` dans le titre ;
- dialogue proposant **Ajouter un objet** ou **Ajouter une arme** ;
- création des Items par le mécanisme embarqué déjà existant.

### Spécialisations et Notes

Les textes secondaires suivants sont retirés de la fiche :

```text
Une spécialisation par ligne
Notes libres du joueur
```

Les données et zones de texte restent inchangées.

### Marge générale

La racine visuelle de la fiche Actor reçoit une marge intérieure régulière. Les blocs ne touchent plus les bords de la fenêtre et conservent un pourtour clair, sans modifier la structure des Documents ni le comportement du défilement.

## 10. Images par défaut des Documents

Les assets fournis par l’utilisateur sont utilisés sans renommage :

```text
assets/actor/avatar-default.webp
assets/items/item_default.webp
assets/items/weapon_default.webp
```

### Actor

Un nouvel `Actor.type = character` créé depuis le répertoire reçoit :

```text
img = systems/interface/assets/actor/avatar-default.webp
```

Un portrait explicitement fourni à la création reste prioritaire. Les Actors existants ne sont pas modifiés.

### Items embarqués

La création depuis la fiche Actor applique directement :

```text
category = ordinary
→ systems/interface/assets/items/item_default.webp

category = weapon
→ systems/interface/assets/items/weapon_default.webp
```

La fiche Item affiche l’image à gauche du nom et permet de la remplacer via le `FilePicker`. Les sections Inventaire et Armes affichent la vignette persistée dans `Item.img`.

Aucune migration n’est appliquée aux Items déjà existants.

## 11. Nouvelle passe de disposition de la fiche

Cette passe répond à des instructions explicites de l’utilisateur et étend à nouveau le périmètre ergonomique de la Tranche 3B.

### Talents et Combat

- chaque titre de groupe de Talents rappelle désormais la valeur de sa Compétence, par exemple `Carrure — 40` ;
- ce rappel utilise la valeur persistée dans `system.skills.*` et ne crée aucune nouvelle donnée ;
- le sous-titre « Valeurs dérivées » est retiré du bloc Combat ;
- les cartes, valeurs et jets de Combat restent inchangés.

### Suppression des équipements

Chaque ligne d’objet ordinaire ou d’arme dispose d’un bouton de suppression compact.

La suppression suit obligatoirement ce cycle :

```text
clic sur la corbeille
→ confirmation DialogV2
→ Annuler : aucune modification
→ Supprimer : suppression définitive de l’Item embarqué concerné
```

L’action reste réservée à un utilisateur autorisé à modifier l’Actor. Aucun bouton n’est rendu pour un observateur.

### Identité

Le bloc supérieur suit le croquis utilisateur :

```text
Portrait
│
├── Nom puis Profession au centre
└── Âge sur toute la hauteur à droite
```

Les cadres du croquis ne sont pas reproduits littéralement. Le rendu utilise les bordures, fonds et espacements de la fiche existante.

### Blessures, Initiative et Stress

Le bandeau noir est réorganisé en trois zones :

```text
Blessures + état + contrôles
│ Initiative centrée │
contrôles + Stress + état
```

Les niveaux, couleurs, bornes et calculs restent inchangés. La ligne de diagnostic « Développement / Malus d’état / Destin » et la section de développement provisoire sont retirées de l’interface, sans supprimer les données ni le moteur associé.

### Nettoyage visuel et assets

- retrait du texte d’aide au glisser-déposer dans Inventaire ;
- augmentation de 10 px de la marge intérieure générale sur écran normal ;
- suppression de `item_default.png` et `weapon_default.png` ;
- conservation exclusive des versions WebP pour les images d’équipement.

## 12. Invariants protégés

- identifiant du package `interface` inchangé ;
- `Actor.type = character` inchangé ;
- DataModel et version de schéma inchangés ;
- aucune migration ;
- aucun setting ;
- aucun socket ;
- aucune dépendance ;
- aucun UUID modifié ;
- dérivés toujours calculés ;
- portrait toujours stocké dans `Actor.img` ;
- Actors existants sans le flag inchangés ;
- moteur D100, Destin et pré-lancer inchangés.

## 13. Fichiers principalement modifiés

```text
README.md
assets/actor/avatar-default.webp
assets/items/item_default.webp
assets/items/weapon_default.webp
scripts/constants.mjs
scripts/documents/interface-actor.mjs
scripts/applications/character-creation-application.mjs
scripts/applications/character-sheet.mjs
scripts/applications/equipment-sheet.mjs
templates/actor/character-creation.hbs
templates/actor/character-sheet.hbs
templates/item/equipment-sheet.hbs
styles/interface.css
tests/static/check-project.mjs
tests/static/smoke-import.mjs
tests/protocols/TRANCHE_3B_FOUNDRY_V14_365.md
.project/reports/PHASE_03_TRANCHE_3B_CANDIDATE.md
```

## 14. Contrôles hors Foundry

- syntaxe de tous les modules JavaScript ;
- résolution des imports ;
- manifeste et identité du package ;
- enregistrement simulé des feuilles et DataModels ;
- création simulée d’un Actor avec le flag en attente ;
- sauvegarde simulée du nom, de l’identité, des Compétences et Talents ;
- fermeture simulée avec conservation du flag ;
- réouverture simulée de l’assistant ;
- redirection simulée de la fiche selon la présence du flag ;
- retrait simulé du flag ;
- présence du compteur de Talents dans son bloc ;
- absence de déclencheur `rollSkill` dans le template ;
- conservation des déclencheurs Talent et Combat ;
- tests unitaires des jetons et du moteur D100 ;
- retrait des boutons de Talent de l’ordre de tabulation ;
- ordre fonctionnel des champs de Talents conservé ;
- centrage et dimensions fixes des cartes de Combat ;
- présence d’une section Armes autonome ;
- séparation stricte des armes et objets ordinaires dans le contexte de rendu ;
- dialogue de choix de catégorie depuis Inventaire ;
- absence des compteurs et textes secondaires demandés ;
- marge intérieure globale de la fiche ;
- compacité contrôlée des groupes de Talents ;
- présence et chemins des trois assets WebP par défaut ;
- affectation simulée du portrait Actor par défaut ;
- affectation simulée des images différentes pour objet et arme ;
- affichage et remplacement de l’image dans la fiche Item ;
- affichage des vignettes dans Inventaire et Armes ;
- rappel des valeurs de Compétence dans les titres de groupes de Talents ;
- suppression du sous-titre de Combat et du texte d’aide Inventaire ;
- présence d’une suppression sécurisée avec confirmation `DialogV2` ;
- nouvelle disposition Identité et bandeau Blessures / Initiative / Stress ;
- retrait des éléments de développement provisoires de la fiche ;
- absence des PNG d’équipement et conservation des WebP.

## 15. Tests réels

Validés par l’utilisateur :

```text
T1 à T27 : OK
```

À exécuter sur cette candidate :

```text
T28 — rappel des Compétences dans Talents
T29 — Combat sans sous-titre
T30 — suppression sécurisée d’un objet
T31 — suppression sécurisée d’une arme
T32 — Inventaire épuré
T33 — nouvelle disposition Identité
T34 — bandeau Blessures / Initiative / Stress
T35 — respiration renforcée et assets WebP
```

## 16. Risques et limites

- les retouches T28 à T35 doivent encore être testées dans Foundry VTT 14.365 ;
- la suppression d’un Item est définitive après confirmation et doit être vérifiée avec un Actor de test ;
- la fermeture sauvegarde les valeurs valides présentes dans la pré-fiche ;
- une valeur hors bornes ne peut pas être persistée comme brouillon valide ;
- aucune gestion de verrou n’est ajoutée entre deux propriétaires modifiant simultanément le même Actor ;
- l’image du prototype Token n’est pas modifiée avec `Actor.img` ;
- la création dans un compendium n’a pas été testée dans Foundry réel.

## 17. Validation attendue

Cette passe ergonomique pourra être validée après :

1. installation de la candidate ;
2. exécution de T28 à T35 dans Foundry VTT 14.365 ;
3. correction d’éventuels défauts ;
4. validation explicite de l’utilisateur.
