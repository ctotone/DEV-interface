# Phase 05 — Candidate technique — Conflits, initiative et armes

**Date :** 7 août 2026  
**Statut :** candidate technique — validation réelle Foundry en attente  
**Système :** `interface`  
**Version package :** `0.1.0`  
**Foundry ciblé :** V14  
**Build de référence :** 14.365  
**Branche de base :** `main`  
**Commit de base :** `a56d68838a93398fffdb35aa7ee9feed3eb5dc71`

## 1. Périmètre réalisé

La candidate complète le périmètre restant identifié lors de l’audit initial de Phase 05 :

- cartes D100 natives basées sur `ChatMessage` ;
- `flags.interface.card` avec `schema = 1` ;
- projection publique distincte du diagnostic secret du Destin ;
- cartes `d100-result`, `d100-gm-detail`, `weapon-selector`, `damage-result` ;
- contrôleur d’actions via `renderChatMessageHTML` ;
- revalidation de permission au moment du clic ;
- snapshots d’armes conformes au contrat validé ;
- sélection d’armes et jets de dégâts normaux ;
- dégâts maximum après critique / super-critique ;
- forçage MJ après échec avec snapshot des armes actuelles ;
- absence d’automatisation sur cible, Blessure ou canevas ;
- signalement MJ des égalités d’initiative sans remplacer les Documents natifs ;
- point d’extension de thème commun fiche / cartes, sans persistance ni migration.

Le type de carte `initiative` reste réservé par le contrat de schéma. La candidate ne crée pas de carte d’initiative personnalisée : le tracker et les Documents natifs `Combat` / `Combatant` restent l’interface fonctionnelle de l’initiative.

## 2. Décisions visuelles intégrées

La carte D100 suit le croquis et les arbitrages utilisateur :

- portrait à gauche ;
- nom du personnage ;
- nom public du jet sans représentation `Compétence + Talent` ;
- score total affiché entre parenthèses ;
- malus affiché uniquement lorsqu’il est non nul ;
- détail non nul du malus au survol ;
- résultat final central ;
- détail avantage / désavantage au survol ;
- détail public de l’intervention du Destin au survol ;
- halo bleu discret en cas d’intervention du Destin ;
- marge uniquement si supérieure à `0` ;
- hauteur naturelle ;
- six familles de couleurs fonctionnelles exactes.

La carte de dégâts :

- est indépendante de la carte D100 ;
- conserve la même logique d’en-tête ;
- affiche les armes avec leurs icônes ;
- reste réutilisable ;
- conserve la liste après le jet ;
- projette le dernier résultat dans la même carte visible ;
- propose un petit dialogue `Dégâts normaux` / `Dégâts maximum` lorsque le résultat de conflit l’autorise.

## 3. Architecture du dernier résultat de dégâts

Le sélecteur d’armes reste un `ChatMessage` persistant.

Chaque activation autorisée crée un nouveau `damage-result` lié au sélecteur par `parentMessageId`. Lorsque le sélecteur parent existe, le dernier résultat est projeté visuellement dans sa zone de résultat et la carte enfant est masquée comme entrée indépendante.

Cette structure évite d’exiger qu’un joueur modifie un `ChatMessage` créé par un autre utilisateur et conserve une trace native de chaque résultat sans ajouter de nouvelle architecture de communication.

Ce comportement multijoueur doit encore être validé dans Foundry réel.

## 4. Confidentialité du Destin

Le message public ne reçoit pas :

- le jet secret ;
- la chance secrète ;
- l’éligibilité interne ;
- le diagnostic MJ.

Lorsqu’un test du Destin est résolu depuis un client MJ, une carte `d100-gm-detail` séparée est créée et chuchotée aux MJ.

Lorsqu’un test est résolu depuis un client joueur, cette candidate ne persiste pas de détail secret supplémentaire : aucune donnée secrète n’est copiée dans le message public. Cette limitation prudente évite de présumer un mécanisme multijoueur supplémentaire non validé.

## 5. Snapshots d’armes

Le snapshot persistant contient uniquement :

```text
itemUuid
name
img
damageFormula
formulaValidAtCreation
sort
```

Après réussite de conflit, le snapshot est créé au moment du jet et la carte historique n’a pas besoin de relire l’Item.

Après échec forcé par le MJ, les armes sont relues depuis l’Actor au moment du clic puis un nouveau snapshot est créé.

## 6. Thèmes / skins

Un seul thème est implémenté :

```text
default
```

La résolution du thème est isolée dans un service et la fiche comme les cartes exposent `data-interface-theme`.

Aucun choix de thème n’est persisté :

- aucun setting ;
- aucun flag ;
- aucune clé de DataModel ;
- aucune migration.

Une future implémentation de skins pourra donc choisir sa source de vérité après arbitrage utilisateur sans réécrire la logique D100 ou dégâts.

## 7. Initiative

La candidate conserve :

```text
initiative = 1d10 + @derived.initiativeBonus
initiativeBonus = round(Distance / 10)
```

Aucun malus d’état n’est ajouté à l’initiative.

Aucune sous-classe custom de `Combat` ou `Combatant` n’est créée.

Un hook informe les clients MJ lorsqu’une initiative mise à jour produit une égalité. Aucun second critère de départage n’est appliqué.

## 8. Fichiers principaux ajoutés

```text
scripts/chat/chat-card-data.mjs
scripts/chat/chat-message-service.mjs
scripts/chat/chat-card-controller.mjs
scripts/services/weapon-snapshot-service.mjs
scripts/services/damage-service.mjs
scripts/services/initiative-service.mjs
scripts/services/theme-service.mjs

templates/chat/d100-result.hbs
templates/chat/d100-gm-detail.hbs
templates/chat/weapon-selector.hbs
templates/chat/damage-result.hbs

tests/unit/phase05-chat-damage.test.mjs
tests/protocols/PHASE_05_CHAT_DEGATS_INITIATIVE_FOUNDRY_V14_365.md

.project/decisions/PHASE_05_CARTES_CHAT_ERGONOMIE.md
```

## 9. Fichiers principaux modifiés

```text
scripts/services/d100-roll-service.mjs
scripts/documents/interface-actor.mjs
scripts/interface.mjs
scripts/applications/character-sheet.mjs
templates/actor/character-sheet.hbs
styles/interface.css
lang/fr.json
tests/static/check-project.mjs
tests/static/smoke-import.mjs
```

## 10. Contrôles exécutés hors Foundry

Résultat final :

```text
node tests/static/check-project.mjs
→ OK — 758 contrôles hors Foundry réussis
→ 29 modules JavaScript vérifiés
→ 4 tests unitaires exécutés
→ chargement isolé et enregistrements init simulés OK
```

Contrôles unitaires exécutés séparément :

```text
derived-values.test.mjs
→ OK

d100-engine.test.mjs
→ T01 à T20 + cas complémentaires OK

character-creation.test.mjs
→ OK

phase05-chat-damage.test.mjs
→ OK
```

Smoke isolé :

```text
tests/static/smoke-import.mjs
→ OK
```

Ces contrôles ne constituent pas une validation dans Foundry VTT.

## 11. Éléments inchangés volontairement

- `system.json` reste sans propriété `packs` ;
- `packs-src/` n’est pas modifié ;
- `packs/` n’est pas reconstruit ;
- aucun compendium n’est réactivé ;
- aucun socket système n’est ajouté ;
- aucun DataModel n’est modifié ;
- aucun schéma persistant n’est modifié ;
- aucun setting existant n’est renommé ;
- aucun UUID n’est modifié ;
- aucune migration n’est ajoutée ;
- aucune publication n’est effectuée.

`TODO_evilbram.md` reste hors autorité et hors livrable.

## 12. Tests réels Foundry requis

Le protocole associé doit être exécuté par l’utilisateur sous Foundry VTT 14.365.

Priorités :

1. rendu réel des cartes dans le ChatLog ;
2. tooltips, halo et six couleurs ;
3. création automatique du sélecteur après conflit réussi ;
4. dialogue critique et dégâts maximum ;
5. réutilisation de la même carte visible ;
6. snapshots après renommage / modification / suppression d’Item ;
7. forçage MJ après échec ;
8. perte d’ownership après création ;
9. double clic et test avec deux clients propriétaires ;
10. initiative native, égalité et Combatant sans Actor.

## 13. Risques et limites avant validation

- la projection multijoueur du dernier `damage-result` dans le sélecteur parent doit être validée dans le DOM réel de Foundry V14 ;
- les formules de Roll avancées et `maximize: true` doivent être vérifiées avec les formules réellement utilisées par le système ;
- le détail MJ persistant du Destin n’est actuellement créé que pour une résolution effectuée sur un client MJ ;
- le rendu graphique a été contrôlé statiquement mais pas observé dans le ChatLog réel ;
- l’initiative a été contrôlée statiquement / en test isolé mais pas encore testée avec un Combat réel.

## 14. État de phase

```text
code écrit                    : oui
analyse statique              : oui
tests isolés                  : oui
test réel Foundry             : non
test MJ                       : non
test joueur                   : non
test multijoueur              : non
validation fonctionnelle      : non
publication                   : non
Phase 05 clôturée             : non
```

La prochaine action est l’exécution du protocole Foundry par l’utilisateur, puis correction éventuelle avant transmission finale au GPT Pilote.
