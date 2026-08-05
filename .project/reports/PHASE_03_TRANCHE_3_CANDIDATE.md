# Rapport technique — Phase 03, Tranche 3 — Moteur D100

**Package :** système Foundry VTT `interface`  
**Version locale :** `0.1.0`  
**Foundry ciblé :** V14, environnement de test utilisateur `14.365`  
**Schéma persisté :** `1`, inchangé  
**Statut :** candidate en attente du test réel et de la validation utilisateur

## 1. Périmètre réalisé

La Tranche 3 ajoute :

- un moteur métier D100 indépendant de Foundry ;
- les modes `normal`, `advantage` et `disadvantage` ;
- la qualification naturelle prioritaire ;
- la sélection avantage/désavantage par qualité mécanique ;
- le départage numérique dans une même qualité ;
- la résolution complète du Destin ;
- le calcul des marges finales ;
- un adaptateur Foundry utilisant `Roll` ;
- une écriture unique et contrôlée de la réserve de Destin ;
- des déclencheurs de jet sur les Compétences, Talents et valeurs dérivées ;
- un sélecteur de Talent lorsqu’une Compétence est cliquée ;
- un message de chat technique provisoire ;
- un diagnostic complet réservé à la console MJ ;
- les tests unitaires déterministes T01 à T20 ;
- le remplacement des bulles de niveau Blessures/Stress par des libellés narratifs colorés selon le palier.

## 2. Invariants protégés

- un jet standard associe toujours une Compétence et un Talent lié ;
- aucun jet de Compétence seule n’est créé ;
- le seuil final n’est pas plafonné entre 0 et 100 ;
- les résultats naturels `1 à 5` et `96 à 100` restent prioritaires ;
- l’avantage et le désavantage sélectionnent par qualité, pas uniquement par valeur ;
- le dé écarté n’est jamais réexaminé par le Destin ;
- le Destin n’intervient jamais sur `96 à 100` ;
- le Destin ne crée ni critique ni réussite automatique ;
- le test secret n’est créé que si une intervention est possible ;
- une résolution produit au maximum une mise à jour de l’Actor ;
- l’écriture Actor précède le message de chat ;
- aucune donnée secrète n’est placée dans le résumé public ou dans des flags ;
- aucun socket, framework ou dépendance externe n’est ajouté ;
- aucun changement de schéma ou migration n’est introduit.

## 3. Architecture mise en œuvre

```text
fiche Actor
→ choix de la source et du mode
→ Roll Foundry 1d100 ou 2d100
→ extraction des résultats naturels
→ moteur pur D100
→ éventuel Roll secret 1d100
→ résolution finale
→ écriture de Destin sur l’Actor
→ message technique public
→ diagnostic complet dans la console MJ
```

Les modules métier ne dépendent ni du DOM, ni des Documents Foundry, ni du chat.

## 4. Déclencheurs de la fiche

### Compétence

Un clic sur le libellé d’une Compétence ouvre une fenêtre proposant uniquement ses trois Talents associés. Le choix lance ensuite le jet Compétence + Talent.

### Talent

Un clic sur le libellé d’un Talent lance directement sa Compétence associée + ce Talent.

### Combat

Un clic sur Corps à corps, Distance, Verbal ou la valeur personnalisée disponible lance directement le seuil dérivé correspondant.

### Mode

La fiche propose Normal, Avantage et Désavantage. Le moteur reçoit le mode choisi mais ne décide pas pourquoi il s’applique.

## 5. Destin

Le service lit à chaque jet :

- réserve actuelle de l’Actor ;
- gain mondial ;
- plafond mondial ;
- probabilité de déclenchement ;
- minimum critique.

Le test secret est effectué avec un `Roll("1d100")` uniquement lorsque le moteur pur confirme l’éligibilité.

Le message public peut montrer :

- le résultat final ;
- l’intervention du Destin ;
- le résultat brut et la correction au survol.

Il ne montre pas :

- le résultat du test secret ;
- la chance ;
- l’éligibilité détaillée ;
- le diagnostic interne.

La console MJ reçoit le résultat métier complet pour les tests de développement. Un joueur reçoit seulement une projection filtrée comme valeur de retour du service.

## 6. Message de chat provisoire

La Tranche 3 utilise encore la carte native du `Roll` Foundry, accompagnée d’un résumé technique.

Limite connue :

- en avantage ou désavantage, la carte native `2d100` affiche son total technique ;
- ce total n’est pas le résultat D100 retenu ;
- la ligne **Résultat final** du résumé constitue la source de vérité ;
- ce rendu sera remplacé par les cartes finales dans la tranche dédiée.

## 7. Fichiers ajoutés

```text
scripts/rules/d100/compute-margin.mjs
scripts/rules/d100/constants.mjs
scripts/rules/d100/qualify-natural.mjs
scripts/rules/d100/qualify-final.mjs
scripts/rules/d100/resolve-d100.mjs
scripts/rules/d100/resolve-destiny.mjs
scripts/rules/d100/select-raw.mjs
scripts/services/d100-roll-service.mjs
tests/protocols/TRANCHE_3_FOUNDRY_V14_365.md
tests/unit/d100-engine.test.mjs
.project/reports/PHASE_03_TRANCHE_3_CANDIDATE.md
```

## 8. Fichiers modifiés

```text
README.md
lang/fr.json
scripts/applications/character-sheet.mjs
scripts/documents/interface-actor.mjs
scripts/interface.mjs
styles/interface.css
templates/actor/character-sheet.hbs
templates/settings/interface-settings.hbs
tests/static/check-project.mjs
tests/static/smoke-import.mjs
```

## 9. Fichiers supprimés

```text
Aucun.
```

## 10. Contrôles hors Foundry

Les contrôles comprennent :

- syntaxe de tous les modules JavaScript ;
- résolution de tous les imports relatifs ;
- chargement isolé du point d’entrée ;
- enregistrements simulés du hook `init` ;
- simulation de `Roll` normal, avantage et Destin ;
- simulation de l’écriture Actor avant publication ;
- vérification de l’absence de secret dans le résumé public ;
- tests unitaires T01 à T20 ;
- tests complémentaires des bornes, paramètres extrêmes et seuils inhabituels ;
- vérification des déclencheurs de la fiche ;
- vérification du schéma persisté inchangé ;
- absence de socket, Roll20, Dice So Nice et dépendance externe ;
- présence des douze libellés narratifs et des six couleurs de palier ;
- absence de l’ancien affichage en bulles numérotées.

## 11. Éléments non vérifiables hors Foundry

- rendu réel de la fenêtre de choix de Talent ;
- évaluation réelle de `Roll` dans V14.365 ;
- affichage exact de la carte native ;
- mise à jour et rerendu réel de l’Actor ;
- persistance réelle du Destin ;
- permissions propriétaire et non-propriétaire ;
- ordre réel des messages dans un monde ;
- comportement multijoueur concurrent ;
- confidentialité face à une inspection volontaire du client ;
- compatibilité avec Dice So Nice.

## 12. Risques et limites

- la présentation de chat est technique et provisoire ;
- le total natif de `2d100` ne représente pas la sélection mécanique ;
- la protection contre les jets simultanés est locale au client ;
- aucun verrou distribué ni socket n’est ajouté ;
- un conflit simultané entre plusieurs clients sur le même Actor reste à tester ;
- le test secret n’est pas publié, mais l’autorité complète d’un MJ distant nécessiterait une architecture multiclient supplémentaire ;
- dégâts, initiative complète et cartes finales restent hors périmètre.

## 13. Validation

Cette candidate n’est pas considérée comme validée avant :

1. installation dans Foundry VTT 14.365 ;
2. exécution du protocole T1 à T13 ;
3. retour utilisateur ;
4. validation explicite de la Tranche 3.


## Correctif — Vue observateur plate

- les comptes sans permission de mise à jour voient les données sous forme de texte ;
- les déclencheurs de jets, contrôles, boutons et éditions d’Items sont absents ;
- le glisser-déposer est bloqué localement ;
- les sections repliables restent utilisables comme navigation locale ;
- l’état des sections n’est ni persisté ni partagé avec le propriétaire ou les autres clients.


## Correctif pré-lancer

- suppression du bandeau permanent **Mode du jet** de la fiche Actor ;
- ajout d’une fenêtre compacte avant chaque jet ;
- mode `Normal` proposé par défaut, avec `Avantage` et `Désavantage` ;
- ajout d’un Bonus / Malus entier temporaire, initialisé à `0` ;
- valeur positive ajoutée au seuil final, valeur négative soustraite ;
- aucune persistance du mode ou du modificateur ;
- déclenchement effectif uniquement avec le bouton **Lancer les dés** ;
- fermeture de la fenêtre sans effet sur le Destin ni le chat.

## Correctif final — Réglette trois positions

Le menu déroulant de mode du pré-lancer est remplacé par une réglette à trois positions :

```text
Désavantage — Normal — Avantage
```

- `Normal` est sélectionné par défaut à chaque ouverture ;
- le contrôle transmet les mêmes valeurs au moteur D100 ;
- aucun schéma, setting, flag ou comportement de résolution n’est modifié ;
- le contrôle est cliquable et utilisable au clavier.



## Correctif final complémentaire — Glissement de la réglette

La réglette de mode accepte désormais un glissement réel à la souris ou au pointeur :

- prise du curseur ou de la piste ;
- déplacement continu ;
- verrouillage sur Désavantage, Normal ou Avantage ;
- conservation du clic sur les libellés et de la navigation clavier ;
- aucune modification du moteur D100 ou des données persistées.
