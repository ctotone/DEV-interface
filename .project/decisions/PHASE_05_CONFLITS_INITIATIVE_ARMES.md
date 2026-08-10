# Phase 05 — Conflits, initiative et armes

## Référence

- **Projet :** DEV-interface
- **Statut :** VALIDÉE
- **Date de clôture :** 10 août 2026
- **Version du produit :** `0.1.0`
- **Branche :** `main`
- **Base de départ :** `a56d68838a93398fffdb35aa7ee9feed3eb5dc71`
- **Commit pré-test observé dans l’archive entrante :** `0fe3cdbe35e42d4f1c891640a033c1ca02bf98d4`
- **Commit de clôture documentaire :** à renseigner après intégration et push par l’utilisateur
- **Foundry de référence :** V14 build `14.365`

# 1. Objectif de la phase

Compléter le périmètre réellement restant des conflits, de l’initiative et des armes sans introduire de moteur de combat tactique.

La phase a été recalibrée avant développement afin de ne pas reproduire le socle déjà validé.

# 2. Résultat du recalibrage

Étaient déjà acquis avant le développement principal de Phase 05 :

- valeurs dérivées `Corps à corps`, `Distance`, `Verbal` ;
- moteur D100 ;
- Destin ;
- malus d’état ;
- catégories d’Items ;
- formules de dégâts persistées ;
- bonus d’initiative dérivé ;
- permissions générales ;
- compendiums validés mais désactivés pendant le développement.

Le travail restant a été concentré sur :

```text
cartes de chat fonctionnelles
projection publique / MJ
contrôleur des actions de chat
snapshots d’armes
sélection et jets de dégâts
dégâts maximum
forçage MJ après échec
permissions au moment du clic
initiative complète
tests Foundry
```

# 3. Fonctionnalités validées

## Cartes D100

Architecture native `ChatMessage` :

```text
flags.interface.card
schema = 1
```

Types utilisés :

```text
d100-result
d100-gm-detail
weapon-selector
damage-result
```

Le type `initiative` reste réservé par le contrat mais aucune carte d’initiative custom n’a été ajoutée.

La carte publique présente les informations fonctionnelles validées sans exposer les données secrètes du Destin.

## Cartes de dégâts

Après une réussite de conflit :

- création d’un sélecteur de dégâts indépendant ;
- liste d’armes conservée ;
- carte réutilisable ;
- dégâts normaux ;
- dégâts maximum en cas de critique ou super-critique ;
- résultat projeté dans la même carte visible.

Après un échec :

- le joueur ne peut pas forcer les dégâts ;
- le MJ peut utiliser `Permettre les dégâts`.

Aucune cible, Blessure ou autre donnée de combat n’est modifiée automatiquement.

## Snapshots d’armes

Snapshot persistant :

```text
itemUuid
name
img
damageFormula
formulaValidAtCreation
sort
```

Après réussite, la carte utilise le snapshot pris au moment du conflit.

Après échec forcé par le MJ, les armes actuelles de l’Actor sont relues au moment du clic puis un nouveau snapshot est créé.

## Initiative

Documents natifs conservés :

```text
Actor
Combat
Combatant
```

Formule :

```text
1d10 + @derived.initiativeBonus
initiativeBonus = round(Distance / 10)
```

Blessure et Stress ne modifient pas l’initiative.

Comportement validé depuis la fiche :

```text
aucun Combat actif
→ Initiative non cliquable

Combat actif + Actor absent du tracker
→ Initiative cliquable

clic
→ Actor ajouté au Combat
→ initiative lancée et renseignée
→ action non cliquable une fois présent

Actor retiré du Combat
→ action de nouveau disponible
```

Les égalités sont signalées au MJ sans second critère de départage.

# 4. Décisions ergonomiques intégrées

La décision détaillée reste :

```text
.project/decisions/PHASE_05_CARTES_CHAT_ERGONOMIE.md
```

Couleurs fonctionnelles finales :

```text
échec critique                    #ff0000
échec normal / automatique        #ff006f
super échec critique (100)        #dc00c9
réussite normale / automatique    #009700
réussite critique                 #0082ff
super réussite critique (1)       #f3b600
```

Le halo bleu du Destin est fonctionnel mais jugé trop discret : son affinage est reporté à la phase visuelle.

Un point d’extension de thème `default` existe. Aucune source persistée de thème n’a été décidée.

# 5. Corrections issues des tests réels

## Flags de ChatMessage gelés

Erreur initiale :

```text
TypeError: Cannot assign to read only property 'publicData'
```

Correction validée :

```text
immutabilité interne conservée
→ structuredClone(card) à la frontière ChatMessage
```

Un test de non-régression couvre désormais ce cas.

## Initiative depuis la fiche

Le premier flux ajoutait le Combatant mais ne renseignait pas l’initiative.

Correction finale :

```text
Actor.rollInitiative(...)
→ inspection du Combatant
→ si initiative encore null
   Combat.rollInitiative(combatantId)
```

Le test isolé vérifie également l’absence de double jet.

# 6. Contrôles hors Foundry

Contrôles finaux rejoués :

```text
node tests/static/check-project.mjs
→ 762 contrôles hors Foundry réussis
→ 29 modules JavaScript vérifiés
→ 4 tests unitaires exécutés
→ chargement isolé et init simulée : OK
```

Suites vérifiées séparément :

```text
tests/static/smoke-import.mjs
tests/unit/derived-values.test.mjs
tests/unit/d100-engine.test.mjs
tests/unit/character-creation.test.mjs
tests/unit/phase05-chat-damage.test.mjs
```

Toutes réussissent hors Foundry.

# 7. Tests Foundry utilisateur

Résultats transmis par GPT Foundry :

```text
B1 à B5 : OK
C1 à C5 : OK
D1 à D2 : OK
E1 à E4 : OK
F1 : OK
F2 : NON TESTÉ
Initiative finale : OK
```

Le test F2 de simultanéité multijoueur n’a pas été exécuté car il est difficile à reproduire seul.

Il n’est pas considéré comme validé.

Il est reporté à la phase de tests et stabilisation multijoueur.

# 8. Expérience Codex complémentaire

Un protocole réduit a également été expérimenté avec un GPT opérant sous Codex.

Cette expérience :

- reste complémentaire ;
- ne remplace pas la validation utilisateur ;
- ne modifie pas la décision de clôture de la Phase 05 ;
- relève d’une évaluation méthodologique distincte.

# 9. Limites et reports

- test simultané multijoueur F2 non exécuté ;
- détail secret Destin issu d’un jet joueur non persisté dans un ChatMessage MJ séparé ;
- halo bleu Destin à améliorer visuellement ;
- thèmes / skins : seule la structure d’extension existe, sans persistance ;
- aucune compatibilité V15 garantie ;
- aucune publication engagée.

# 10. Invariants préservés

Aucun changement silencieux sur :

- identifiant package `interface` ;
- UUID ;
- types Actor / Item ;
- schéma métier ;
- migrations ;
- identifiants `interface.objects` et `interface.weapons`.

Aucun socket système nouveau.

Aucun `Combat` ou `Combatant` custom.

Aucune application automatique des dégâts ou des Blessures.

Compendiums :

```text
system.json
→ sans propriété packs

packs-src/
→ non modifié pour la Phase 05

packs/
→ non reconstruit
```

# 11. Décision de clôture

```text
Phase 05 — Conflits, initiative et armes : VALIDÉE
Validation fonctionnelle utilisateur : OUI
Contrôles hors Foundry : OK
Test multijoueur simultané F2 : NON EXÉCUTÉ
Publication : NON
```

F2 reste une limite de preuve explicitement documentée et ne doit jamais être présenté comme testé.

# 12. Conséquences pour la suite

La Phase 06 peut être préparée à partir de la base courante.

Elle devra elle aussi être recalibrée, car la Phase 03 et la Phase 05 ont déjà anticipé une partie de l’ergonomie et des cartes de chat.

Le test simultané multijoueur F2 est reporté à la Phase 07 — Tests et stabilisation.

# 13. Prochaine phase

- **Phase :** 06
- **Titre :** Ergonomie et identité visuelle
- **GPT principal technique :** GPT Foundry
- **Contributeur :** GPT Visuel
- **Première action recommandée :** audit de l’existant visuel et ergonomique avant tout changement.

# 14. Résumé ultra-court

```text
Phase : 05
Objectif : conflits, cartes de chat, dégâts, initiative
Résultat : périmètre fonctionnel produit et validé
Contrôles : 762 OK, 29 modules, 4 suites unitaires
Foundry : tests utilisateur validés sauf F2 non exécuté
Compendiums : toujours désactivés pendant le développement
Statut : VALIDÉE
Suite : Phase 06 à recalibrer
```
