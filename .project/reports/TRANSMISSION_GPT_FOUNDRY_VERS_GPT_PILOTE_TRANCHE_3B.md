# Transmission GPT Foundry → GPT Pilote

**Projet :** Système D100 Interface  
**Package Foundry :** système  
**Identifiant technique :** `interface`  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Date de transmission :** 6 août 2026  
**Spécialiste sortant :** GPT Foundry  
**Destinataire :** GPT Pilote  
**Objet :** fin du travail technique de la Tranche 3B et remise pour consolidation / clôture de phase

---

## 1. Statut transmis

```text
Phase 03 — Première tranche jouable : EN COURS
Tranche 1 : VALIDÉE
Tranche 2 : VALIDÉE
Tranche 2B : VALIDÉE
Tranche 3 : VALIDÉE
Tranche 3B : DÉVELOPPEMENT TERMINÉ ET VALIDÉ PAR L’UTILISATEUR
Clôture de phase : À EFFECTUER PAR GPT PILOTE
Publication : NON ENGAGÉE
```

GPT Foundry ne prononce pas la clôture de phase.  
Le présent document transmet à GPT Pilote la base technique, les validations, les écarts de périmètre autorisés et les points de consolidation.

---

## 2. Base technique remise

### Archive remise par l’utilisateur

```text
Fichier : interface(10).zip
SHA-256 : 796896422bf1f324fbec68572f729521c4e18a85718f95fc48eb727a15002636
```

### État Git observé dans l’archive

```text
Branche : main
HEAD : 0852b3f62fafd2f0128a5ad8e3170eb791aebe39
Message : Phase 3 - Tranche 3 terminée
```

Les modifications de la Tranche 3B sont présentes dans l’arbre de travail mais ne sont pas incluses dans un nouveau commit dans cette archive.

### Attention de reprise

L’archive contient une copie imbriquée :

```text
interface/interface/
```

Cette copie est plus ancienne que la racine principale et ne doit pas être utilisée comme source de vérité ni ajoutée au prochain commit.

La source technique courante est :

```text
interface/
```

à l’exclusion de :

```text
interface/.git/
interface/interface/
```

Le fichier utilisateur `TODO_evilbram.md` est hors cadrage projet et ne doit pas être utilisé comme autorité fonctionnelle.

---

## 3. Version et compatibilité

```text
Version package : 0.1.0
Version de schéma : 1
Foundry minimum : 14
Foundry verified : 14
Foundry maximum : 14
Build réellement testé : 14.365
Actor.type : character
Item.type : equipment
Catégories Item : ordinary | weapon
Langue source : français
```

Aucun abandon de compatibilité ni changement d’identité du package.

---

## 4. Autorisation explicite des évolutions hors cadrage initial

La Tranche 3B et plusieurs retouches ergonomiques n’étaient pas prévues sous cette forme dans le cadrage initial.

**Tous les ajouts et adaptations ci-dessous ont été demandés, précisés, arbitrés et validés explicitement par l’utilisateur pendant le développement.**

Ils ne constituent pas une dérive autonome de GPT Foundry.

Cela concerne notamment :

- l’assistant de création de personnage ;
- la création immédiate d’un Actor en état d’attente ;
- le flag `flags.interface.creation.pending` ;
- la réouverture de l’assistant tant que la création n’est pas finalisée ;
- l’harmonisation du bloc Identité ;
- les jetons de répartition des Compétences ;
- le compteur de points de Talents ;
- la désactivation des jets déclenchés depuis les noms de Compétences ;
- l’ordre de tabulation des Talents ;
- les retouches de disposition générale de la fiche ;
- les sections Armes et Inventaire séparées ;
- les images par défaut des Actors et Items ;
- la suppression sécurisée des équipements ;
- le nouveau bandeau Blessures / Initiative / Stress ;
- le retrait des éléments provisoires de développement de l’interface.

---

## 5. Fonctionnalités livrées et validées

### Assistant de création

- création immédiate d’un `Actor.type = character` ;
- application de `flags.interface.creation.pending = true` ;
- ouverture de la pré-fiche liée à l’Actor réel ;
- sauvegarde progressive des données saisies ;
- fermeture sans finalisation possible ;
- réouverture automatique de la pré-fiche depuis le répertoire des Actors ;
- accès au MJ et au propriétaire ;
- absence d’édition pour l’observateur ;
- contrôle souple des recommandations ;
- retrait du flag lors de la validation finale ;
- ouverture ultérieure de la fiche classique ;
- absence de création d’un second Actor.

### Données de création

- Nom ;
- portrait ;
- Profession ;
- Âge ;
- six Compétences ;
- dix-huit Talents ;
- Spécialisations ;
- valeurs dérivées calculées en direct ;
- récapitulatif de création.

### Répartition

- jetons Compétences `20 / 30 / 30 / 40 / 40 / 50` ;
- saisie numérique conservée comme source de vérité ;
- gestion correcte des valeurs dupliquées ;
- cent points de Talents ;
- compteur mis à jour en direct ;
- ordre de tabulation fonctionnel entre les dix-huit champs.

### Fiche de personnage

- identité organisée avec portrait à gauche, Nom et Profession au centre, Âge à droite ;
- bandeau Blessures / Initiative / Stress réorganisé ;
- cartes de Combat centrées et non étirées ;
- rappel du score de Compétence dans chaque titre de groupe de Talents ;
- Compétences affichées comme libellés non cliquables ;
- Talents et valeurs de Combat toujours utilisables pour les jets ;
- marges générales renforcées ;
- sections repliables conservées ;
- vue Observateur plate et non interactive conservée.

### Armes et Inventaire

- section Armes autonome et repliable ;
- Inventaire réservé aux objets ordinaires ;
- aucune duplication visuelle ;
- petit bouton d’ajout dans les titres ;
- choix Objet / Arme depuis Inventaire ;
- images et vignettes affichées ;
- suppression par icône compacte ;
- confirmation explicite avant suppression définitive ;
- aucune action de suppression pour un observateur.

### Assets par défaut

```text
Actor :
systems/interface/assets/actor/avatar-default.webp

Objet ordinaire :
systems/interface/assets/items/item_default.webp

Arme :
systems/interface/assets/items/weapon_default.webp
```

Les versions PNG ont été supprimées.  
Les images choisies par l’utilisateur restent prioritaires.

---

## 6. Données persistées et invariants

### Nouvel état persistant validé

```text
flags.interface.creation.pending
```

Ce flag sert uniquement à distinguer une création en attente d’un personnage finalisé.

### Champs existants utilisés

- `Actor.img` ;
- `Item.img` ;
- données d’identité existantes ;
- Compétences existantes ;
- Talents existants ;
- Spécialisations existantes ;
- Items embarqués existants.

### Aucun changement

- aucun nouveau DataModel ;
- aucune modification de schéma ;
- aucune migration ;
- aucun setting ;
- aucun socket ;
- aucune dépendance ;
- aucun UUID ;
- aucun nouveau type d’Actor ou d’Item ;
- aucun changement du moteur D100 ;
- aucun changement des formules dérivées ;
- aucune publication.

Les Actors existants sans le flag restent inchangés.

---

## 7. Tests réalisés

### Tests Foundry réels

**Tests T1 à T35 : tous validés par l’utilisateur sous Foundry VTT 14.365.**

Les validations couvrent notamment :

- installation et ouverture ;
- assistant de création ;
- création en attente ;
- réouverture MJ / propriétaire ;
- observateur ;
- finalisation ;
- Compétences et Talents ;
- tabulation ;
- cartes de Combat ;
- sections Armes et Inventaire ;
- ajout, image et suppression des Items ;
- assets WebP ;
- identité ;
- bandeau Blessures / Initiative / Stress ;
- marges et rendu général.

### Contrôles hors Foundry rejoués sur l’archive remise

```text
OK — 390 contrôles hors Foundry réussis.
Modules JavaScript vérifiés : 22.
Tests unitaires exécutés : 3.
Chargement isolé et enregistrements init simulés : OK.
```

Ces contrôles ne remplacent pas les tests Foundry, déjà réalisés par l’utilisateur.

---

## 8. Fichiers principalement concernés

```text
README.md
assets/actor/avatar-default.webp
assets/items/item_default.webp
assets/items/weapon_default.webp
lang/fr.json
scripts/constants.mjs
scripts/interface.mjs
scripts/documents/interface-actor.mjs
scripts/applications/character-creation-application.mjs
scripts/applications/character-sheet.mjs
scripts/applications/equipment-sheet.mjs
scripts/rules/character-creation.mjs
templates/actor/character-creation.hbs
templates/actor/character-sheet.hbs
templates/item/equipment-sheet.hbs
styles/interface.css
tests/static/check-project.mjs
tests/static/smoke-import.mjs
tests/unit/character-creation.test.mjs
tests/protocols/TRANCHE_3B_FOUNDRY_V14_365.md
.project/reports/PHASE_03_TRANCHE_3B_CANDIDATE.md
```

---

## 9. Documents de projet à consolider par GPT Pilote

Les documents suivants sont antérieurs à l’état réel de la Tranche 3B et doivent être actualisés lors de la consolidation :

```text
.project/TRANSMISSION_CURRENT.md
.project/PROJECT_STATE.md
.project/ROADMAP.md
README.md
```

Le rapport technique le plus récent est :

```text
.project/reports/PHASE_03_TRANCHE_3B_CANDIDATE.md
```

Le protocole consolidé est :

```text
tests/protocols/TRANCHE_3B_FOUNDRY_V14_365.md
```

---

## 10. Points à ne pas confondre

```text
Travail technique terminé
≠ phase clôturée par GPT Pilote

Tests Foundry validés
≠ commit Git créé

Archive remise
≠ release publiée
```

Aucune release GitHub, publication Foundry ou inscription au catalogue n’a été réalisée ni demandée.

---

## 11. Action attendue de GPT Pilote

1. prendre acte de la validation utilisateur de la Tranche 3B ;
2. intégrer les évolutions hors cadrage comme décisions utilisateur explicites ;
3. consolider l’état, la roadmap et la transmission courante ;
4. déterminer avec l’utilisateur le commit de référence de clôture ;
5. prononcer ou non la clôture de phase selon son propre processus ;
6. orienter la suite du projet.

---

## 12. Conclusion de GPT Foundry

```text
Travail technique Tranche 3B : TERMINÉ
Tests Foundry T1 à T35 : VALIDÉS UTILISATEUR
Contrôles hors Foundry : RÉUSSIS
Migration : AUCUNE
Publication : AUCUNE
Clôture de phase : REMISE À GPT PILOTE
```
