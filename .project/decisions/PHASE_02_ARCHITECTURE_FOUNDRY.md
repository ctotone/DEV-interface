# Phase 02 — Architecture Foundry

## Référence

- **Projet :** Système D100 Interface pour Foundry VTT
- **Statut :** VALIDÉE
- **Date d’ouverture :** 5 août 2026
- **Date de validation :** 5 août 2026
- **Identifiant technique :** `interface`
- **Dépôt :** `ctotone/DEV-interface`
- **Branche :** `main`
- **Base de départ :** `90858fdf37839150cca6e6364bedac3aa5e16512`
- **Commit de clôture documentaire :** à renseigner après intégration et push de cette archive
- **GPT principal :** GPT Foundry
- **Consolidation :** GPT Pilote
- **Développement Foundry :** non commencé

## 1. Objectif de la phase

Traduire les règles fonctionnelles validées des phases 00A et 01 en une architecture technique Foundry suffisamment précise pour autoriser la première tranche de développement, sans modifier les règles métier.

## 2. Livrable d’autorité

```text
.project/specification/PHASE_02_ARCHITECTURE_FOUNDRY_INTERFACE.md
```

## 3. Décisions techniques validées

### 3.1 Version et compatibilité

```text
Génération supportée              : Foundry VTT V14
Build initiale de développement   : 14.365
Build initiale de test            : 14.365
Manifeste                         : minimum 14 / verified 14 / maximum 14
V13                               : non supportée
V15                               : non déclarée
```

La build `14.365` est l’environnement initial de preuve, pas une condition d’installation.

### 3.2 Documents et données

- un seul `Actor.type = character` ;
- un seul `Item.type = equipment` ;
- catégories d’équipement : `ordinary | weapon` ;
- équipements possédés sous forme d’Items embarqués ;
- données persistées séparées des données dérivées ;
- `TypeDataModel` V14 pour Actor et Item ;
- Compétences entières bornées de `0` à `100` ;
- Talents entiers bornés de `0` à `30` ;
- Blessures et Stress bornés de `0` à `15` ;
- valeurs dérivées non persistées et plafonnées à `99` ;
- seuil D100 non clampé à `100`.

### 3.3 Moteur de règles

- moteur D100 pur, indépendant des feuilles, du DOM et des ChatMessages ;
- orchestration Foundry assurée par des services dédiés ;
- résultat interne sérialisable et traité comme immutable ;
- projections publique et MJ séparées ;
- une seule écriture de Destin par résolution ;
- aucun socket en V1 tant qu’un besoin reproductible n’est pas démontré.

### 3.4 Destin et confidentialité

- résultat définitif public ;
- intervention du Destin signalée par une teinte ou un halo discret ;
- survol du résultat donnant accès à la valeur brute, à la correction du Destin et au résultat final ;
- test secret, chance, éligibilité et diagnostic visibles uniquement par le MJ ;
- aucune donnée secrète dans le HTML ou les flags du message public.

### 3.5 Chat, armes et dégâts

- ChatMessages natifs avec templates Handlebars ;
- flags sous `flags.interface.card`, schéma initial `1` ;
- snapshot des armes sur une réussite de conflit ;
- actions de dégâts réutilisables ;
- dégâts jamais appliqués automatiquement à une cible ;
- action de dégâts après échec réservée au MJ.

### 3.6 Initiative, permissions et progression

- `Combat` et `Combatant` natifs ;
- initiative `1d10 + round(Distance / 10)` ;
- égalités arbitrées par le MJ ;
- permissions contrôlées au rendu et au moment de l’action ;
- progression assistée lorsque proportionnée ;
- décocher une case ne retire jamais automatiquement un gain appliqué.

### 3.7 Settings, migrations et intégrations

- settings mondiaux sous le namespace `interface` ;
- version initiale du package : `0.1.0` ;
- version initiale du schéma interne : `1` ;
- migrations internes uniquement, aucun import Roll20 ;
- Dice So Nice facultatif et isolé ;
- aucune API publique stable promise en V1 ;
- aucun compendium, socket ou framework externe créé par anticipation.

## 4. Hors périmètre maintenu

- publication ;
- release ;
- soumission au catalogue Foundry ;
- import Roll20 ;
- compatibilité V13 ou V15 ;
- moteur tactique ;
- ciblage et application automatique des dégâts ;
- design graphique final ;
- compendiums de contenu ;
- migration d’un monde réel avant code testé et sauvegarde.

## 5. Réserves de faisabilité

Restent à tester sans remettre en cause l’architecture validée :

- concurrence de deux écritures de Destin ;
- comportement multijoueur et propriétaires multiples ;
- API et rendu Dice So Nice ;
- formules de dégâts avancées et maximum ;
- anciennes cartes après évolution de schéma ;
- égalités d’initiative ;
- réduction du plafond de Destin ;
- assistance complète à la répartition des quinze points de Talents ;
- migrations avec deux MJ actifs.

Une réserve devient un changement d’architecture seulement si un test réel démontre un blocage.

## 6. Contrôles et preuves

```text
Architecture rédigée                 : oui
Documentation officielle V14 étudiée : oui
Arbitrages utilisateur intégrés      : oui
Code Foundry écrit                   : non
Tests unitaires                      : non
Test Foundry                         : non
Test MJ / joueur / multijoueur       : non
Prototype Dice So Nice               : non
Publication                          : non
```

## 7. Décision de clôture

La phase 02 est validée sur le plan architectural.

Cette validation autorise l’ouverture de la phase 03 et la production de la première tranche de développement. Elle ne prouve aucun fonctionnement dans Foundry et n’autorise aucune publication.

## 8. Conséquences pour la suite

La phase 03 doit commencer par un squelette installable comprenant au minimum :

- `system.json` ;
- point d’entrée ES module ;
- langue française ;
- settings ;
- TypeDataModels minimaux ;
- Actor et Item minimaux ;
- feuilles minimales ;
- protocole d’installation et de test sur Foundry VTT 14.365.

## 9. Prochaine phase

```text
Phase 03 — Première tranche jouable
GPT principal : GPT Foundry
Première étape : Tranche 1 — Squelette installable
```
