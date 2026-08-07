# TRANSMISSION GPT FOUNDRY → GPT PILOTE — PHASE 04

## États, Destin et réglages MJ

**Projet :** DEV-interface  
**GPT principal :** GPT Foundry  
**Coordination / clôture documentaire :** GPT Pilote  
**Autorité fonctionnelle et tests réels :** utilisateur  
**Branche de référence :** `main`  
**Commit de départ Phase 04 :** `386c71c5e73f9d9833905430c6d341344cfaf717`  
**Version package :** `0.1.0`  
**Version de schéma :** `1`  
**Foundry ciblé :** génération V14  
**Build de test réel documenté :** `14.365`  
**Statut de cette transmission :** **TRAVAIL TECHNIQUE PHASE 04 TERMINÉ — CLÔTURE À DÉCIDER PAR GPT PILOTE APRÈS VALIDATION UTILISATEUR**

---

# 1. Objet de la Phase 04 recalibrée

La Phase 04 n’a pas consisté à réimplémenter les États, le Destin ou les settings.

Son objectif réel était :

1. confronter les spécifications validées au code réel ;
2. identifier ce qui avait déjà été produit et testé pendant la Phase 03 ;
3. isoler uniquement les lacunes réelles ;
4. corriger seulement ces lacunes si nécessaire ;
5. effectuer une validation ciblée du domaine ;
6. transmettre un état consolidé à GPT Pilote.

La Phase 03 et son complément compendiums étaient déjà validés avant l’ouverture de cette phase.

---

# 2. Audit initial de complétude

## DÉJÀ PRODUIT ET TESTÉ

| Exigence Phase 04 | État vérifié |
|---|---|
| Blessures de `0` à `15` | DataModel borné `0–15`, testé sous Foundry |
| Stress de `0` à `15` | DataModel borné `0–15`, testé sous Foundry |
| Conversion en niveaux `0–5` | `calculateStateLevel`, tests unitaires complets des paliers |
| Libellés narratifs d’état | six niveaux Blessures et six niveaux Stress présents et testés |
| Coefficient mondial de malus | setting monde `statePenaltyCoefficient`, défaut `3` |
| Calcul du malus d’état | `(niveau Blessures + niveau Stress) × coefficient` |
| Recalcul après changement du coefficient | `onChange` + `prepareData()` / rerender ; test réel déjà validé |
| Application du malus aux jets D100 | seuil final = base − malus + modificateur situationnel |
| Settings du Destin | gain, cap, chance, minimum critique |
| Menu de configuration MJ | menu `restricted: true` |
| Accumulation de la réserve | moteur du Destin, gain configurable et plafond |
| Remise à zéro après réussite | moteur et tests D100 |
| Intervention automatique du Destin | test secret uniquement si intervention mécaniquement possible |
| Consommation de la réserve | totalité consommée lors d’une intervention réussie |
| Échecs automatiques `96–100` | jamais corrigés par le Destin |
| Amortissement d’un échec critique | minimum configurable, correction conservant l’échec |
| Intégration au moteur D100 | sélection brute → Destin → résultat final → marge |
| Persistance du Destin | écriture sur `system.resources.destiny.value` |
| Permissions directement liées | propriétaire requis pour lancer / modifier ; non-propriétaire refusé |
| Projection publique du Destin | aucun `secretRoll`, chance ou diagnostic interne dans la carte publique |
| Persistance des settings monde | déjà validée pendant les tests précédents |

## PRODUIT MAIS À RETESTER

**Aucun élément principal identifié.**

Le code du domaine Phase 04 n’a pas subi de modification depuis les tests réels qui l’ont validé. Rejouer artificiellement l’intégralité des scénarios Phase 03 n’apporterait pas de preuve supplémentaire proportionnée.

## MANQUANT

**Aucune exigence validée manquante identifiée.**

## REPORTÉ À UNE PHASE ULTÉRIEURE

Restent hors Phase 04 conformément au périmètre :

- cartes de chat finales ;
- dégâts depuis le chat ;
- initiative complète ;
- progression assistée ;
- design graphique final ;
- refonte du halo du Destin ;
- Dice So Nice ;
- migrations générales ;
- tests globaux de concurrence multijoueur ;
- publication / release ;
- compatibilité V15 ;
- renforcement distribué contre les écritures concurrentes.

---

# 3. Arbitrages utilisateur intervenus pendant l’audit

## 3.1 Test secret du Destin exécuté côté client

Le service D100 actuel crée le D100 secret sur le client qui effectue le jet lorsque l’intervention du Destin est mécaniquement possible.

La projection publique ne contient pas :

- la valeur du D100 secret ;
- la chance configurée ;
- le diagnostic d’éligibilité interne.

Un joueur techniquement volontaire pourrait toutefois instrumenter son propre client et observer ce calcul local.

### Décision utilisateur

Ce niveau de confidentialité est **accepté tel quel**.

Raison fonctionnelle :

- la règle de déclenchement est connue des joueurs ;
- l’éventuelle inspection technique du client n’impacte pas l’expérience de jeu recherchée ;
- aucune architecture socket / autorité MJ supplémentaire n’est souhaitée pour ce besoin.

### Conséquence

Ce point n’est **pas une lacune Phase 04** et aucun changement de code n’est demandé.

---

## 3.2 Abaissement du plafond de Destin sous une réserve déjà acquise

Comportement actuel du moteur :

- une réserve déjà supérieure au nouveau plafond existe encore au début du prochain jet ;
- elle peut donc rendre le Destin éligible sur ce jet ;
- si le Destin intervient avec succès ou si le jet réussit naturellement, la réserve revient à `0` ;
- si le jet reste un échec sans intervention, la fonction de gain applique le plafond courant et la réserve revient dans la norme.

Exemple :

```text
réserve existante : 25
nouveau cap        : 10
jet                 : le personnage profite encore de ses 25 pour l’éligibilité
échec sans Destin   : réserve finale ramenée au plafond courant
```

### Décision utilisateur

Ce comportement est **accepté tel quel**.

L’utilisateur considère que le personnage a eu sa chance d’utiliser la réserve acquise sur ce lancer ; si le Destin ne se déclenche pas, le retour au nouveau plafond est acceptable.

### Conséquence

Ce point n’est **pas une lacune Phase 04** et aucun changement de code n’est demandé.

---

# 4. Code réel vérifié

## États et données

### `scripts/data/character-data.mjs`

- `resources.wounds.value` : entier `0–15` ;
- `resources.stress.value` : entier `0–15` ;
- `resources.destiny.value` : entier minimum `0` ;
- `derived` : non persisté ;
- lecture du coefficient mondial pendant `prepareDerivedData()`.

### `scripts/rules/derived-values.mjs`

- niveau : `0` si valeur `0`, sinon `ceil(value / 3)` ;
- malus : somme des deux niveaux × coefficient ;
- aucune persistance du calcul dérivé.

### `scripts/applications/character-sheet.mjs`

Libellés validés présents :

Blessures :

```text
0 Indemne
1 Touché
2 Meurtri
3 Blessé
4 Brisé
5 Critique
```

Stress :

```text
0 Stable
1 Tendu
2 Éprouvé
3 Ébranlé
4 Submergé
5 Rupture
```

## Settings

### `scripts/settings/register-settings.mjs`

Settings monde :

```text
statePenaltyCoefficient
destinyGain
destinyCap
destinyTriggerChance
destinyCriticalMinimum
```

Valeurs par défaut :

```text
coefficient état       : 3
gain Destin            : 5
plafond Destin         : 30
chance déclenchement   : 80
minimum critique       : 15
```

La chance est bornée `0–100`.

Le menu `configuration` est :

```text
restricted: true
```

Le changement de coefficient relance la préparation des Actors et leur rendu.

## Destin et moteur D100

### `scripts/rules/d100/resolve-destiny.mjs`

Vérifiés :

- réussite brute → Destin à `0` ;
- échec automatique → pas de test du Destin ;
- échec critique non automatique → intervention possible selon minimum de réserve ;
- échec ordinaire → intervention uniquement si réserve suffisante ;
- seuil final ≤ `5` → pas de conversion en réussite par Destin ;
- test secret obligatoire uniquement en cas d’éligibilité ;
- test secret réussi → correction + réserve `0` ;
- test secret raté → résultat inchangé + gain plafonné.

### `scripts/services/d100-roll-service.mjs`

Vérifiés :

- permission `canUserModify(..., "update")` avant le jet ;
- malus d’état lu depuis l’Actor dérivé ;
- settings du Destin lus à chaque jet ;
- D100 secret créé uniquement si le moteur annonce l’éligibilité ;
- réserve persistée via `actor.update()` seulement si sa valeur change ;
- carte publique ne reçoit pas le résultat secret ;
- diagnostic complet uniquement loggé / retourné dans le chemin MJ ;
- joueur reçoit une projection publique filtrée.

---

# 5. Tests déjà acquis sous Foundry

La décision de clôture Phase 03 consigne :

```text
Foundry VTT 14.365
T1 à T35 : OK
```

Ces validations réelles couvrent notamment installation, persistance, permissions, jets D100, États et stabilité.

Tests particulièrement pertinents :

## Tranche 2

- **T3** — Blessures, Stress et malus d’état ;
- **T5** — changement du coefficient mondial et recalcul sans rechargement manuel ;
- **T11** — permissions joueur / propriétaire ;
- **T12** — persistance après redémarrage complet.

## Tranche 3

- **T1** — libellés narratifs Blessures et Stress ;
- **T8** — application du malus d’état au seuil D100 ;
- **T10** — accumulation du Destin ;
- **T11** — remise à zéro après réussite ;
- **T12** — intervention visible du Destin et consommation ;
- **T13** — permissions, persistance et stabilité.

Ces tests ne sont pas considérés comme obsolètes : le code fonctionnel concerné n’a pas été modifié depuis leur validation.

---

# 6. Contrôles hors Foundry rejoués pendant la Phase 04

Sur la base de développement intégrant uniquement la désactivation temporaire des compendiums :

```text
node tests/static/check-project.mjs
→ OK — 708 contrôles hors Foundry réussis
→ 22 modules JavaScript vérifiés
→ 3 tests unitaires exécutés
→ chargement isolé et enregistrements init simulés : OK
```

Contrôle ciblé États :

```text
node tests/unit/derived-values.test.mjs
→ OK — calculs dérivés, états et diagnostics de création
```

Contrôle ciblé D100 / Destin :

```text
node tests/unit/d100-engine.test.mjs
→ OK — moteur D100 : T01 à T20 et cas complémentaires réussis
```

Ces contrôles ne remplacent pas les tests Foundry réels déjà consignés.

---

# 7. Modifications réalisées pendant la Phase 04 fonctionnelle

## Code États / Destin / settings

```text
AUCUNE MODIFICATION
```

Aucune lacune démontrée n’a nécessité de patch.

Aucun changement de :

- DataModel ;
- setting ;
- flag ;
- UUID ;
- identifiant ;
- permission ;
- schéma ;
- moteur D100 ;
- comportement du Destin ;
- persistance.

## Opération technique préalable sur les compendiums

Une décision séparée, validée par l’utilisateur, a désactivé temporairement les compendiums pendant le développement.

Les deux seuls fichiers modifiés pour cette opération sont :

```text
system.json
tests/static/check-project.mjs
```

Cette opération ne modifie aucune règle de Phase 04.

Une transmission dédiée à GPT Pilote documente cet arbitrage.

---

# 8. Validation réelle du protocole compendiums pendant cette phase

Sous Foundry V14 build `14.365`, l’utilisateur a constaté :

```text
- compendiums Objets et Armes absents du monde ;
- aucun message rouge ;
- aucune alerte dans la console F12 ;
- après fermeture de Foundry, aucune mise à jour de fichier visible dans GitHub Desktop.
```

Le problème de bruit Git ayant motivé l’arbitrage n’est donc plus observé avec les packs désactivés.

---

# 9. Validation ciblée Phase 04

Compte tenu :

- des tests Foundry Phase 03 déjà acquis ;
- de l’absence de modification du code Phase 04 ;
- des contrôles unitaires rejoués avec succès ;
- des deux arbitrages utilisateur explicitement résolus ;

aucun nouveau scénario fonctionnel lourd n’est justifié.

## Smoke test facultatif si GPT Pilote ou l’utilisateur souhaite une dernière vérification visuelle

Sur un Actor propriétaire :

1. mettre Blessures à `4` et Stress à `7` ;
2. vérifier niveaux `2` et `3`, malus `15` avec coefficient `3` ;
3. passer temporairement le coefficient à `4` et vérifier malus `20` ;
4. remettre le coefficient à `3` ;
5. mettre Destin à `10`, lancer un échec ordinaire éligible et constater le comportement automatique ;
6. obtenir une réussite et vérifier le retour à `0`.

Ce smoke test n’est pas nécessaire pour démontrer une correction, puisqu’aucune correction du domaine n’a été apportée.

---

# 10. Risques et limites restantes

Aucune limite nouvelle n’a été introduite par la Phase 04.

Limites connues conservées :

- le calcul secret du Destin est local au client qui lance le jet ; accepté explicitement par l’utilisateur ;
- pas de verrou distribué global contre deux écritures concurrentes sur le même Actor ;
- cartes de chat encore provisoires ;
- pas de garantie de compatibilité V15 ;
- pas de migration générale ;
- pas de publication.

Le comportement actuel après baisse de `destinyCap` sous une réserve existante est explicitement accepté par l’utilisateur et n’est pas une dette ouverte.

---

# 11. Verdict GPT Foundry

```text
Audit de complétude      : TERMINÉ
Lacunes fonctionnelles   : AUCUNE
Patch Phase 04 requis    : NON
Contrôles hors Foundry   : OK
Tests Foundry antérieurs : VALIDÉS SOUS 14.365
Arbitrages utilisateur   : CONSIGNÉS
Publication              : NON
Clôture Phase 04         : NON EFFECTUÉE PAR GPT FOUNDRY
```

La Phase 04 est **techniquement conforme à son périmètre recalibré**.

GPT Foundry ne la marque pas comme clôturée.

---

# 12. Transmission synthétique à GPT Pilote

```text
Projet :
DEV-interface

Phase :
04 — États, Destin et réglages MJ

Base :
main
386c71c5e73f9d9833905430c6d341344cfaf717
puis opération compendiums Option C validée

Audit :
toutes les exigences Phase 04 sont déjà produites et testées.
Aucune lacune validée n’a été trouvée.

Modifications fonctionnelles Phase 04 :
aucune.

États :
0–15 persistés, niveaux 0–5, libellés narratifs, malus dérivé conformes.

Settings :
coefficient état + quatre paramètres Destin, scope world,
menu réservé MJ, valeurs par défaut conformes.

Destin :
accumulation, plafond, remise à zéro, intervention automatique,
consommation totale, critiques et automatiques conformes.

Confidentialité :
projection publique filtrée.
Le D100 secret est généré côté client qui lance le jet.
Ce niveau de confidentialité est explicitement accepté par l’utilisateur.

Baisse du cap :
une réserve supérieure au nouveau cap reste disponible pour le jet courant ;
si le jet échoue sans intervention, elle revient ensuite dans la norme via le clamp.
Comportement explicitement accepté par l’utilisateur.

Contrôles Phase 04 :
708 contrôles hors Foundry OK.
derived-values.test.mjs OK.
d100-engine.test.mjs OK — T01 à T20 + cas complémentaires.

Tests réels antérieurs :
Foundry 14.365, T1 à T35 validés.
T2/T3 pertinents couvrent États, coefficient, Destin, permissions et persistance.

Compendiums :
arbitrage séparé Option C validé.
Packs désactivés pendant le développement.
Test réel : compendiums absents, aucune erreur F12,
aucune modification visible dans GitHub Desktop après fermeture.
Réactivation obligatoire avant candidate 1.0.0.

Action attendue de GPT Pilote :
consolider les deux arbitrages utilisateur,
mettre à jour l’état / roadmap / transmission,
noter la réactivation obligatoire des compendiums avant 1.0.0,
et clôturer la Phase 04 après validation utilisateur de cette restitution.
```
