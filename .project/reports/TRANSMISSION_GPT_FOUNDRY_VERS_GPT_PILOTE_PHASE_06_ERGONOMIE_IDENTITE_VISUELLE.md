# Transmission GPT Foundry → GPT Pilote — Clôture Phase 06

**Projet :** D100 Interface  
**Phase :** 06 — Ergonomie et identité visuelle  
**Date :** 13 août 2026  
**GPT principal technique :** GPT Foundry  
**Contributeur visuel :** GPT Visuel  
**Tests réels / validation finale :** utilisateur  
**Identifiant technique :** `interface`  
**Type de package :** système Foundry VTT  
**Version package :** `0.1.0`  
**Version de schéma :** `1`  
**Compatibilité manifeste :** Foundry VTT `minimum 14 / verified 14 / maximum 14`  
**Publication :** NON ENGAGÉE

---

## 1. Statut de clôture

```text
Phase 06 : VALIDÉE UTILISATEUR
Design : VALIDÉ
Intégration technique : TERMINÉE
Contrôles hors Foundry : OK
Tests réels dans Foundry : réalisés au fil de la phase et acceptés par l’utilisateur
Publication : NON
```

La Phase 06 peut être considérée comme clôturée.

La validation utilisateur a été réalisée progressivement pendant toute la phase sur la fiche Actor, l’assistant de création, les Items, les jets D100, les cartes de chat, les dégâts, le Destin, les dialogs et les réglages système.

L’utilisateur a explicitement indiqué avoir testé la fiche sous de nombreux angles, effectué de nombreux jets et modifications, et souhaite considérer cette validation en usage réel comme suffisante sans campagne formelle supplémentaire propre à la Phase 06.

Le test multijoueur simultané `F2`, déjà reporté depuis la Phase 05, **reste non exécuté** et demeure destiné à la Phase 07.

---

## 2. Base technique de reprise

Archive validée de fin de Phase 06 :

```text
interface_phase06C_V1_14.zip
```

SHA-256 :

```text
36175f657cdb624745f3eddcdb6a8ccb02a85dc58a4461312692b207fd2882e0
```

Pour cette séquence de travail, l’archive utilisateur / archive livrée constitue la base technique de référence. Aucun rapprochement avec le dépôt Git n’a été demandé.

Les archives techniques livrées à l’utilisateur excluent désormais systématiquement :

```text
.git/
.gitignore
.gitattributes
TODO_evilbram.md
```

`.project/` reste présent dans les archives de développement. Son exclusion relève de la future préparation de diffusion.

---

## 3. Organisation interne de la Phase 06

La Phase 06 a été menée selon les étapes suivantes :

```text
6A   — audit ergonomique et visuel de l’existant
6A.5 — fondation technique multi-thèmes sans changement visuel
6B   — exploration / direction visuelle avec GPT Visuel
6C   — intégration Foundry du design validé
6D   — validation réelle et consolidation au fil des tests utilisateur
```

Les planches produites par GPT Visuel ont servi de bases de discussion et de référence tonale. Les décisions explicites de l’utilisateur ont toujours primé sur les planches lorsqu’un détail divergeait.

---

## 4. Résultat visuel global

Une identité sombre cohérente a été appliquée à l’ensemble des surfaces système traitées :

- fond graphite / noir technique ;
- texture granuleuse discrète ;
- texte ivoire / clair ;
- liserés rouges pour la hiérarchie des sections ;
- composants sombres avec bordures fines ;
- palette fonctionnelle rouge / or / bleu pour les familles principales ;
- typographie Electrolize ;
- distinction CSS conservée entre police de titre et police de texte courant afin de permettre une évolution ultérieure sans refonte globale.

Le choix de thème reste techniquement préparé, mais aucun setting, flag ou donnée persistée de sélection de thème n’a été ajouté.

---

## 5. Fiche Actor

### 5.1 Structure et identité

La fiche Actor conserve une organisation verticale en une seule colonne.

Éléments validés :

- portrait carré `1:1` ;
- Nom / Profession / Âge restylisés ;
- Âge en grand format ;
- bloc `Blessures / Initiative / Stress` remonté immédiatement sous l’identité ;
- disparition du préfixe `État :` sous Blessures et Stress ;
- suppression de la valeur `+X` sous Initiative ;
- disposition fonctionnelle du bloc Blessures / Initiative / Stress conservée.

### 5.2 Compétences

- titre `COMPÉTENCES` harmonisé avec les autres sections ;
- section finalement rendue **rétractable** sur la fiche Actor ;
- six compétences affichées dans des cartes sombres ;
- familles colorées cohérentes avec Corps / Âme / Esprit ;
- couleurs volontairement moins agressives que lors de la première intégration ;
- infobulles `title` descriptives ajoutées aux six compétences.

### 5.3 Talents

Ordre visuel validé :

```text
Carrure    | Perception | Intellect
Agilité    | Mental     | Charisme
```

La structure `3 x 2` est conservée.

Les dix-huit Talents disposent également d’infobulles descriptives.

### 5.4 Sections

Langage visuel commun validé pour les sections :

- liseré rouge ;
- titre hiérarchisé ;
- sections ouvertes avec contenu décalé de `10px` vers la droite ;
- comportement rétractable conservé lorsqu’il existait.

Ordre principal validé :

```text
Compétences
Talents
Combat
Armes
Inventaire / Objets
Spécialisations
Notes
Progression
```

`Armes` et `Inventaire / Objets` restent voisins afin de regrouper logiquement les objets.

### 5.5 Combat

Les trois valeurs dérivées principales utilisent des cartes sombres :

- Corps à corps — rouge ;
- Distance — or / jaune ;
- Verbal — bleu.

Les boutons `Corps à corps / Distance / Verbal` ont tous le `title` :

```text
Lancer les dés
```

### 5.6 Progression / XP

Le fonctionnement persistant existant est conservé sans nouveau champ ni migration.

Évolutions :

- suppression des textes explicatifs jugés superflus ;
- lorsque l’XP atteint `3`, affichage du message :

```text
XP complet : choisissez un gain ci-dessous, appliquez-le manuellement à votre fiche, puis cochez le choix correspondant.
```

- le message disparaît lorsque l’XP repasse à une valeur différente de `3` ;
- les anciens indicateurs `1 / 2 / 3` des trois choix de gain ont été remplacés par trois cases graphiques ;
- progression imposée de gauche à droite ;
- retour naturel de droite à gauche ;
- mêmes données persistées qu’avant ;
- aucune attribution automatique d’un gain.

---

## 6. Assistant de création de personnage

La fiche de création a été entièrement reskinnée pour rejoindre l’identité de la fiche Actor, sans modifier sa logique métier.

Éléments principaux :

- fond sombre / granuleux ;
- Electrolize ;
- titres avec liseré rouge ;
- compétences, talents et attributs dérivés harmonisés ;
- banque de jetons restylisée ;
- récapitulatif et validation finale restylisés ;
- zones de Spécialisations harmonisées ;
- portrait carré `1:1`.

L’identité de création est équilibrée avec :

```text
portrait 10rem | Nom / Profession | Âge 10rem
```

Le portrait et le bloc Âge ont donc la même largeur.

Le bloc Compétences **n’est pas rétractable dans l’assistant de création**.

Les infobulles descriptives sont présentes sur :

- les six Compétences ;
- les dix-huit Talents.

---

## 7. Items

Le type technique unique reste :

```text
Item : equipment
category : ordinary | weapon
```

Aucun nouveau type d’Item n’a été créé.

### Arme

- identité sombre harmonisée ;
- image carrée ;
- nom ;
- catégorie Arme ;
- formule de dégâts conservée dans la fiche Item ;
- description ;
- quantité retirée de l’affichage de la section Armes de l’Actor car jugée peu pertinente.

### Objet

- identité sombre harmonisée ;
- libellé utilisateur : `Objet` ;
- pas de renommage du type technique ;
- quantité conservée lorsque pertinente ;
- formule de dégâts persistée mais masquée selon le comportement déjà validé.

### Enregistrement

Le bouton `Enregistrer` des fiches Item conserve son texte mais sauvegarde puis ferme la fenêtre.

L’enregistrement automatique du système reste par ailleurs utilisé.

---

## 8. Dialogs et pré-lancer D100

Le langage visuel sombre est harmonisé entre les dialogs.

### Pré-lancer D100

Décisions validées :

- suppression de la réglette / slider ;
- conservation de :
  - Désavantage ;
  - Normal ;
  - Avantage ;
  - Bonus / Malus ;
  - lancement du D100 ;
- mode actif mis en évidence avec une bordure bleue cohérente avec l’action principale.

### Dialogs harmonisés

- ajout à l’inventaire :
  - `Ajouter à l’inventaire...`
  - `Quel type d’objet ajouter à la fiche ?`
  - boutons `Objet / Arme`
- confirmation de suppression ;
- avertissement de points de création ;
- réussite critique :
  - `Réussite critique !`
  - choix `Normaux / Maximum`

Les comportements fonctionnels existants derrière ces dialogs sont conservés.

---

## 9. Cartes de chat D100

Les cartes D100 utilisent désormais une skin sombre cohérente avec le système.

Décisions principales :

- nom du jet avant le gros résultat ;
- nom du jet dans une couleur neutre stable, indépendamment du résultat ;
- résultat mis en évidence par la couleur fonctionnelle ;
- amélioration du contraste des textes ;
- suppression du glyph / doublon visuel parasite signalé lors de la phase ;
- palette réussite / échec adaptée au fond sombre à partir du nuancier validé.

Les catégories fonctionnelles réussite / échec / critiques / super-critiques ne sont pas modifiées.

---

## 10. Destin

La logique fonctionnelle et les informations projetées du Destin n’ont pas été modifiées.

Le rendu visuel final validé pour signaler son intervention est :

```css
.interface-chat-card--destiny {
  border: 2px solid rgb(11 180 245);
}
```

Le halo existant reste complémentaire au contour.

Ce choix remplace le halo seul jugé trop discret.

---

## 11. Dégâts — flux des trois cartes

La Phase 06 introduit une évolution fonctionnelle ciblée du rendu des dégâts.

Flux validé :

```text
Carte 1
→ résultat du jet D100

Carte 2
→ sélection d’arme

Carte 3
→ résultat autonome des dégâts
```

### Carte 2 — sélection d’arme

- carte de chat, pas popup ;
- nom de l’Actor ;
- texte `Choisir arme` ;
- liste verticale ;
- image + nom uniquement ;
- pas de formule visible ;
- bordure blanche au repos ;
- bordure rouge au hover ;
- aucun état de sélection persistant ;
- armes sans formule visibles mais désactivées ;
- carte toujours visible et réutilisable.

Le mécanisme existant de snapshot d’armes est conservé.

### Carte 3 — dégâts

Chaque clic valide sur une arme de la carte 2 :

```text
→ crée une nouvelle carte 3
→ ne supprime aucune ancienne carte
→ ne remplace aucune ancienne carte
→ ne verrouille pas la carte 2
```

La carte 3 finale comprend :

- nom de l’Actor ;
- titre `DÉGÂTS` ;
- gros total de dégâts ;
- nom de l’arme ;
- image de l’arme agrandie et déportée sur la droite ;
- image légèrement inclinée ;
- tache de sang décorative au-dessus de l’illustration ;
- aucune mention `Arme utilisée` ;
- aucune formule de dégâts affichée.

Si le mode Maximum a été choisi :

```text
Dégâts max. activés
```

est affiché dans un bloc distinct en bas à droite.

En mode normal, aucune mention n’est affichée.

Le choix `Normaux / Maximum` reste conditionné par la logique critique existante.

---

## 12. Réglages système

Les réglages système ont reçu une skin sombre rapide, sans modification de disposition ni de logique :

- fond sombre ;
- panneaux harmonisés ;
- titres avec liseré rouge ;
- champs sombres ;
- fieldsets harmonisés ;
- message Destin harmonisé ;
- boutons de footer restylisés.

La couleur des valeurs de champs a été corrigée pour reprendre la lisibilité des champs de la fiche Actor.

L’utilisateur a validé les réglages système tels quels.

---

## 13. Fichiers principalement concernés pendant la Phase 06

Les modifications de la phase ont principalement touché :

```text
styles/interface.css

templates/actor/character-sheet.hbs
templates/actor/character-creation.hbs
templates/item/equipment-sheet.hbs

templates/chat/d100-result.hbs
templates/chat/weapon-selector.hbs
templates/chat/damage-result.hbs

templates/settings/interface-settings.hbs

scripts/constants.mjs
scripts/applications/character-sheet.mjs
scripts/applications/character-creation-application.mjs
scripts/applications/equipment-sheet.mjs
scripts/chat/chat-card-controller.mjs
scripts/chat/chat-message-service.mjs

lang/fr.json
tests/static/check-project.mjs
```

Cette liste décrit les principaux points d’intégration de la phase ; elle ne doit pas être utilisée comme inventaire Git exhaustif sans comparaison de dépôt.

---

## 14. Invariants techniques conservés

Aucun changement silencieux n’a été apporté aux éléments structurants suivants :

```text
id système : interface
Actor type : character
Item type : equipment
version schéma : 1
settings monde existants
flags structurants
UUID
permissions
API publique
structure de compendium
identifiants compendium
migrations
```

Sont également conservés :

- moteur D100 ;
- logique des États ;
- Destin fonctionnel ;
- confidentialité / projection des informations ;
- snapshots d’armes ;
- dégâts normaux / maximum ;
- initiative ;
- permissions existantes ;
- absence d’application automatique des Blessures ;
- absence de moteur tactique ajouté.

---

## 15. Compendiums

Les compendiums validés restent en mode développement et ne sont pas réactivés par la Phase 06.

Identifiants protégés :

```text
interface.objects
interface.weapons
```

Avant une future candidate / release `1.0.0`, il reste obligatoire de :

```text
réactiver les compendiums dans le manifeste
→ reconstruire depuis packs-src/
→ contrôler
→ tester dans Foundry
```

Cette action ne relève pas de la clôture de Phase 06.

---

## 16. Tests et niveaux de preuve

### Contrôles automatisés sur la base finale

```text
790 contrôles hors Foundry : OK
29 modules JavaScript vérifiés
5 tests unitaires exécutés
chargement isolé / enregistrements init simulés : OK
```

### Validation réelle Foundry

Réalisée par l’utilisateur au fil des itérations, notamment sur :

- fiche Actor ;
- fiche de création ;
- modifications de valeurs ;
- jets D100 ;
- modes de jet ;
- cartes de chat ;
- sélection d’arme ;
- génération des cartes de dégâts ;
- dégâts normaux / maximum ;
- Destin ;
- dialogs ;
- réglages système.

L’utilisateur considère ces essais suffisants pour valider la Phase 06.

### Non testé / reporté

```text
F2 — simultanéité multijoueur : NON TESTÉ
```

Ne pas présenter F2 comme validé.

---

## 17. Points explicitement reportés

### Phase 07 — Tests et stabilisation

La prochaine phase officielle reste la Phase 07.

Elle doit notamment couvrir :

- tests fonctionnels globaux si nécessaires ;
- non-régression ;
- permissions ;
- sauvegarde / rechargement ;
- multijoueur ;
- concurrence ;
- test simultané `F2` ;
- correction des blocages réellement observés.

La Phase 07 ne doit pas rouvrir gratuitement les décisions visuelles validées en Phase 06.

### Phase 08 — Préparation de diffusion

Toujours non engagée.

Elle devra traiter notamment :

- nettoyage de l’archive publique ;
- exclusion de `.project/` ;
- réactivation des compendiums ;
- reconstruction / contrôle des packs ;
- manifeste de distribution ;
- droits / licences ;
- documentation publique ;
- versionnement et candidate ;
- publication uniquement sur décision explicite de l’utilisateur.

---

## 18. Décisions à considérer comme validées

Pour les reprises futures :

1. la Phase 06 est visuellement validée ;
2. l’identité sombre actuelle est la référence V1 ;
3. Electrolize est utilisée globalement, avec séparation technique titre / corps conservée ;
4. Compétences est rétractable sur l’Actor mais pas dans l’assistant de création ;
5. `Blessures / Initiative / Stress` reste au-dessus de Compétences ;
6. la carte 2 de sélection d’arme reste réutilisable ;
7. chaque clic valide crée une nouvelle carte 3 de dégâts ;
8. aucune carte 3 précédente n’est supprimée ou remplacée ;
9. le rendu final de la carte 3 est validé ;
10. le signal visuel final du Destin est le contour bleu `2px solid rgb(11 180 245)` ;
11. les réglages système sont validés tels quels ;
12. aucun choix de thème persistant n’est introduit à ce stade.

---

## 19. Prochaine action recommandée à GPT Pilote

Mettre à jour la mémoire du projet pour refléter :

```text
Phase 06 — VALIDÉE
Phase 07 — PROCHAINE
```

Puis préparer, lorsque l’utilisateur souhaite reprendre :

```text
Phase 07 — Tests et stabilisation
```

avec priorité au test multijoueur / concurrence `F2` encore non exécuté, sans refaire les validations visuelles déjà acquises.

---

# Fin de transmission

**Base visuelle et fonctionnelle validée de Phase 06 :** `interface_phase06C_V1_14.zip`  
**Publication :** non engagée  
**Prochaine phase officielle :** Phase 07 — Tests et stabilisation
