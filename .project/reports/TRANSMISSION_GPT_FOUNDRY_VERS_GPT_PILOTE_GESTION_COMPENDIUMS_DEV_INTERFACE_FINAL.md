# TRANSMISSION GPT FOUNDRY → GPT PILOTE — GESTION DES COMPENDIUMS DEV-INTERFACE

**Projet :** DEV-interface  
**Dépôt :** `ctotone/DEV-interface`  
**Branche de référence :** `main`  
**Commit de départ vérifié :** `386c71c5e73f9d9833905430c6d341344cfaf717`  
**Version package :** `0.1.0`  
**Foundry ciblé :** génération V14 — build de test projet `14.365`  
**Date :** 7 août 2026  
**Statut de la solution :** **VALIDÉE PAR L’UTILISATEUR**

---

## 1. Problème initial

Le dossier de développement de `DEV-interface` est utilisé directement comme dossier système par Foundry VTT.

Le système contient deux compendiums natifs validés :

- `interface.objects`
- `interface.weapons`

Leur chaîne actuelle est :

```text
packs-src/
→ tools/build-compendiums.mjs
→ packs/
→ déclaration dans system.json
→ Foundry
```

L’utilisateur a observé que l’ouverture et/ou la fermeture de Foundry pouvait faire apparaître des modifications Git dans les dossiers LevelDB compilés de `packs/`, sans modification fonctionnelle volontaire des objets ou des armes.

Cela crée du bruit dans le cycle :

```text
travail GPT
→ ZIP
→ intégration utilisateur
→ Foundry
→ Git
→ commit / push
```

et complique la distinction entre :

- modification fonctionnelle volontaire du contenu ;
- reconstruction volontaire des packs ;
- réécriture physique de fichiers LevelDB par Foundry ;
- différence technique sans changement logique du compendium.

Précision fonctionnelle apportée par l’utilisateur pendant l’arbitrage :

> les compendiums ne sont plus nécessaires pendant la suite de la phase de développement ; ils doivent redevenir opérationnels uniquement lorsqu’on préparera la release finale, notamment la candidate `1.0.0`.

---

## 2. Diagnostic technique

### Observé

- Le problème de modifications parasites de `packs/` lors de cycles Foundry a été signalé par l’utilisateur sur son dossier de développement réel.
- La photographie de travail auditée ne conservait pas, au moment du contrôle, une divergence logique exploitable permettant d’attribuer chaque fichier modifié à un cycle précis d’ouverture/fermeture.
- Le commit GitHub `386c71c5e73f9d9833905430c6d341344cfaf717` a été vérifié comme étant exactement la tête de `main` avant l’opération.

### Vérifié

- `system.json` déclarait bien :
  - `objects` → `packs/objects`
  - `weapons` → `packs/weapons`
- Les dossiers `packs/objects` et `packs/weapons` sont des bases LevelDB composées de plusieurs fichiers.
- `tools/build-compendiums.mjs` :
  - lit `packs-src/objects` et `packs-src/weapons` ;
  - supprime puis reconstruit les dossiers compilés correspondants ;
  - produit et vérifie les structures LevelDB initiales ;
  - compare les données compilées avec les sources JSON.
- La documentation officielle Foundry confirme que, depuis V11, les compendiums utilisent LevelDB sous forme de dossiers contenant plusieurs fichiers, dont certains binaires, et que la fermeture du monde permet notamment à LevelDB de compacter ses données.
- La documentation V14 confirme que `packs` est optionnel dans le manifeste et que chaque entrée déclarée fournit notamment un `name`, un `path`, un `type` et éventuellement un `system` et une `banner`.

Sources officielles consultées :

- Foundry VTT — *Version 11 Content Packaging Changes* : https://foundryvtt.com/article/v11-leveldb-packs/
- Foundry VTT V14 API — `PackageManifestData` : https://foundryvtt.com/api/v14/interfaces/foundry.packages.types.PackageManifestData.html
- Foundry VTT V14 API — `PackageCompendiumData` : https://foundryvtt.com/api/v14/interfaces/foundry.packages.types.PackageCompendiumData.html

### Déduit

Le bruit Git observé est cohérent avec l’utilisation directe de bases LevelDB actives par Foundry : l’état physique de la base peut évoluer sans qu’une modification fonctionnelle volontaire du contenu source soit intervenue.

L’audit n’a pas cherché à prouver une liste universelle de fichiers réécrits à chaque ouverture/fermeture. Ce niveau de reproduction n’est plus nécessaire pour le protocole retenu puisque les packs sont désormais désactivés du manifeste pendant le développement.

### Recommandé puis validé

Ne plus exposer les deux packs à Foundry pendant le développement en supprimant temporairement leur déclaration de `system.json`, tout en conservant intégralement :

- leurs sources ;
- leur builder ;
- leurs identifiants validés ;
- les fichiers compilés déjà versionnés ;
- la capacité de reconstruction et de contrôle avant release.

---

## 3. Source de vérité avant arbitrage

### `packs-src/`

Rôle :

- représentation JSON humaine et contrôlable des contenus ;
- source des 102 Items et 11 dossiers validés ;
- contient les identifiants, noms, descriptions, images et données système utilisées par le builder.

Statut :

- **source d’autorité du contenu des compendiums** ;
- versionnée ;
- ne doit pas être supprimée ni remplacée par les fichiers LevelDB.

### `packs/`

Rôle :

- bases LevelDB compilées consommables par Foundry lorsque les packs sont déclarés ;
- résultat généré par `tools/build-compendiums.mjs`.

Statut avant arbitrage :

- versionné dans Git ;
- physiquement présent dans le système ;
- déclaré dans `system.json` ;
- susceptible d’être réécrit physiquement lors de son utilisation par Foundry.

### `tools/build-compendiums.mjs`

Rôle :

- lire les JSON de `packs-src/` ;
- reconstruire `packs/objects` et `packs/weapons` ;
- contrôler la structure et le contenu produits.

Statut :

- outil versionné ;
- conservé sans modification dans cet arbitrage.

### `system.json`

Rôle :

- manifeste du système ;
- déclare notamment les compendiums que Foundry doit initialiser pour le package.

Avant arbitrage, il déclarait les deux packs validés.

### `tests/static/check-project.mjs`

Rôle :

- contrôle statique du projet ;
- vérification des sources de compendium ;
- vérification des identifiants, contenus, images et dossiers ;
- auparavant, reconstruction systématique des LevelDB à chaque exécution.

Il a été adapté pour distinguer le mode développement sans packs actifs et le futur mode release avec packs actifs.

---

## 4. Solutions envisagées

### Option A — Conserver les packs actifs et versionnés pendant le développement

- **Principe :** ne rien changer à `system.json`; accepter ou nettoyer les différences LevelDB au cas par cas.
- **Avantages :**
  - aucun changement de protocole ;
  - compendiums immédiatement disponibles dans Foundry.
- **Inconvénients :**
  - conserve le bruit Git à l’origine de l’arbitrage ;
  - oblige à distinguer régulièrement réécriture physique et modification fonctionnelle.
- **Risques :**
  - commit accidentel de différences LevelDB parasites ;
  - perte de temps dans les comparaisons.
- **Impact Git :** bruit fréquent possible dans `packs/`.
- **Impact Foundry :** aucun.
- **Impact ZIP :** besoin de contrôler les packs à chaque livraison.
- **Impact future publication :** faible, mais workflow de développement inutilement bruyant.

### Option B — Faire de `packs/` un artefact généré non versionné

- **Principe :** conserver `packs-src/` comme source de vérité, retirer `packs/` du suivi Git et le reconstruire à la demande.
- **Avantages :**
  - supprime durablement le bruit Git LevelDB ;
  - architecture claire source → build → artefact.
- **Inconvénients :**
  - modifie le modèle Git actuel ;
  - demande une adaptation plus large du workflow de build, de contrôle et de livraison.
- **Risques :**
  - oubli de reconstruction dans un workflow mal exécuté ;
  - changement de convention plus important que nécessaire pour le besoin immédiat.
- **Impact Git :** important mais propre à long terme.
- **Impact Foundry :** packs à reconstruire avant usage.
- **Impact ZIP :** le ZIP distribuable doit reconstruire et inclure les packs.
- **Impact future publication :** bonne architecture, mais changement jugé disproportionné pour la phase actuelle.

### Option C — Désactiver temporairement les packs dans le manifeste pendant le développement

- **Principe :** retirer les deux entrées `packs` de `system.json` jusqu’à la préparation de la release `1.0.0`.
- **Avantages :**
  - Foundry ne doit plus initialiser ces compendiums comme packs du système pendant le développement ;
  - aucun changement de modèle Git ;
  - aucun changement des sources ou du builder ;
  - très faible surface de modification ;
  - réactivation simple avant release.
- **Inconvénients :**
  - compendiums indisponibles dans Foundry tant qu’ils ne sont pas réactivés ;
  - obligation documentaire de ne pas oublier leur réactivation.
- **Risques :**
  - oubli de réactivation avant candidate/release.
- **Impact Git :** limité au manifeste et au contrôle statique.
- **Impact Foundry :** les deux packs ne sont plus proposés par le système pendant le développement.
- **Impact ZIP :** les fichiers existants peuvent rester présents ; ils sont simplement non déclarés.
- **Impact future publication :** réactivation, reconstruction et test obligatoires avant la candidate `1.0.0`.

**Option retenue : C.**

---

## 5. Décision explicite de l’utilisateur

```text
Décision utilisateur :
Option C — désactiver temporairement les compendiums dans system.json
pendant la phase de développement.

Raison principale :
Les compendiums ne sont plus nécessaires pendant le développement.
Ils doivent seulement redevenir opérationnels lorsque le développement
sera arrêté pour préparer la release finale / candidate 1.0.0.
Cette solution évite les réécritures parasites de Foundry sans modifier
le modèle Git ni la chaîne de production validée.

Statut :
VALIDÉE PAR L’UTILISATEUR
```

Cette décision :

- complète la convention existante de gestion des compendiums ;
- ne remet pas en cause leur validation fonctionnelle précédente ;
- ne modifie aucun identifiant ;
- ne modifie pas leur contenu ;
- ne modifie pas leur builder ;
- vaut pour **DEV-interface** pendant sa période de développement avant release `1.0.0`.

Les identifiants structurants restent :

- `interface.objects`
- `interface.weapons`

Le commit `386c71c5e73f9d9833905430c6d341344cfaf717`, vérifié sur GitHub comme tête de `main` avant l’opération, constitue le checkpoint de restauration des compendiums actifs avant cette désactivation.

---

## 6. Protocole opérationnel retenu

### Avant développement

```text
system.json
→ aucune propriété packs
→ compendiums système inactifs dans Foundry
```

Conserver sans modification :

```text
packs-src/
tools/build-compendiums.mjs
packs/
identifiants validés
assets des compendiums
```

### Avant lancement Foundry

Aucune reconstruction des compendiums n’est nécessaire.

Le manifeste de développement ne déclare pas `objects` ni `weapons`.

### Pendant le développement

- travailler normalement sur les autres domaines du système ;
- ne pas utiliser les compendiums comme ressource de jeu ;
- ne pas modifier `packs-src/` sans demande fonctionnelle explicite portant sur les compendiums ;
- ne pas modifier les identifiants validés.

### Après fermeture Foundry

`packs/` ne doit normalement plus être ouvert comme pack du système puisque les packs ne sont pas déclarés.

Si des différences apparaissent malgré tout :

- ne pas les considérer automatiquement comme une modification fonctionnelle ;
- vérifier d’abord si `packs-src/` a réellement changé ;
- ne pas committer de variation LevelDB sans cause volontaire identifiée.

### Contrôles hors Foundry pendant le développement

`tests/static/check-project.mjs` :

- accepte l’absence de `manifest.packs` ;
- continue de vérifier intégralement `packs-src/`, les IDs, dossiers, données et images ;
- **ne lance plus le builder LevelDB lorsque les packs sont désactivés** ;
- ne modifie donc plus `packs/` lors des contrôles normaux de développement.

### Avant reconstruction volontaire des compendiums

Une reconstruction n’est nécessaire que :

- si une modification volontaire des compendiums est décidée ;
- ou lors de la préparation de la candidate/release.

La source à modifier reste `packs-src/`.

### Avant création d’un ZIP de développement

- conserver `packs/` dans l’état de la base entrante / commit de référence s’il est déjà présent ;
- ne pas livrer des variations LevelDB produites accidentellement ;
- conserver `packs-src/` et `tools/build-compendiums.mjs` ;
- conserver `system.json` sans propriété `packs` tant que le projet est en mode développement.

Conventions générales maintenues :

- exclure `.git/` ;
- exclure `.gitignore` ;
- exclure `TODO_evilbram.md` ;
- ignorer les suffixes automatiques du nom du ZIP ;
- ne lever une alerte de hash qu’en cas de divergence réelle de contenu, branche ou base.

### Avant commit

Pendant la mise en place de ce protocole, les changements attendus sont uniquement :

```text
system.json
tests/static/check-project.mjs
```

Les variations de `packs/` sans changement fonctionnel volontaire ne doivent pas être commitées.

Les commits et push restent réalisés par l’utilisateur.

### Avant la candidate / release `1.0.0`

Étape obligatoire à inscrire dans la roadmap et les transmissions :

```text
1. rétablir dans system.json les deux déclarations validées :
   - objects
   - weapons

2. conserver exactement :
   interface.objects
   interface.weapons

3. exécuter tools/build-compendiums.mjs

4. exécuter tests/static/check-project.mjs
   → avec packs réactivés, le contrôle relance automatiquement
     la reconstruction et les contrôles LevelDB

5. vérifier les compendiums dans Foundry VTT

6. vérifier objets, armes, dossiers, images et descriptions

7. seulement ensuite préparer la candidate/release
```

---

## 7. Fichiers suivis et fichiers générés

| Chemin | Rôle | Source de vérité | Modifiable manuellement | Généré | Versionné Git | Inclus ZIP |
|---|---|---|---|---|---|---|
| `packs-src/` | Sources JSON des compendiums | **Oui — contenu** | Oui, de façon contrôlée | Non | Oui | Oui |
| `packs/` | Bases LevelDB compilées | Non | Non recommandé | **Oui** | Oui dans le projet actuel | Oui, en conservant l’état validé pendant le dev ; reconstruit pour release |
| `tools/build-compendiums.mjs` | Builder et vérificateur LevelDB | Oui — logique de build | Oui si décision technique | Non | Oui | Oui |
| `system.json` | Manifeste et activation des packs | Oui — déclaration package | Oui, contrôlé | Non | Oui | Oui |
| `tests/static/check-project.mjs` | Contrôles projet et compendiums | Oui — contrôle automatisé | Oui, contrôlé | Non | Oui | Oui |
| `.gitattributes` | Protection binaire de `packs/**` | Oui — règle Git existante | Oui si arbitrage spécifique | Non | Oui | Oui |
| `assets/banners/banniere_item.webp` | Bannière Objets | Oui — asset | Oui si décision visuelle | Non | Oui | Oui |
| `assets/banners/banniere_armes.webp` | Bannière Armes | Oui — asset | Oui si décision visuelle | Non | Oui | Oui |

Aucun identifiant de pack n’a été modifié.

---

## 8. Règles Git

### Modification normale

Pendant le développement général :

- code, templates, styles, tests ou documentation explicitement concernés ;
- `packs-src/` uniquement lors d’une modification volontaire de compendium ;
- `tools/build-compendiums.mjs` uniquement lors d’une modification volontaire de la chaîne de build.

Pour la présente opération :

```text
system.json
tests/static/check-project.mjs
```

sont les deux seuls fichiers modifiés par rapport au commit de référence.

### Modification parasite

Est considérée comme parasite tant qu’aucune modification fonctionnelle du compendium n’a été demandée :

- variation de fichiers LevelDB dans `packs/` ;
- nouveaux journaux ou manifestes LevelDB ;
- compactage ou changement physique n’ayant pas de source correspondante dans `packs-src/`.

### À ignorer opérationnellement

Ne pas intégrer ces différences `packs/` dans un commit de développement sans cause volontaire.

### À reconstruire

`packs/` doit être reconstruit avant validation finale des compendiums et avant release.

### À ne jamais supprimer comme source

Ne jamais supprimer :

- `packs-src/`
- `tools/build-compendiums.mjs`

sur la seule base du fait que les compendiums sont désactivés pendant le développement.

### `.gitignore`

**Aucune règle `.gitignore` n’a été modifiée.**

### `.gitattributes`

**Aucune règle `.gitattributes` n’a été modifiée.**

La règle existante :

```text
packs/** binary
```

reste inchangée.

---

## 9. Règles ZIP et transmission GPT

Pour les ZIP de développement DEV-interface :

- racine obligatoire : `interface/` ;
- exclure `.git/` ;
- exclure `.gitignore` ;
- exclure `TODO_evilbram.md` ;
- un suffixe automatique du ZIP n’a aucune signification fonctionnelle ;
- ne pas signaler un écart de hash s’il n’existe aucune divergence réelle de contenu, branche ou base.

Règles spécifiques aux compendiums :

- `packs-src/` doit être inclus ;
- `tools/build-compendiums.mjs` doit être inclus ;
- `packs/` peut rester inclus dans son état validé existant afin de ne pas provoquer de suppressions Git lors de l’intégration ;
- pendant le développement, `system.json` ne déclare pas les packs ;
- ne pas livrer de variations LevelDB produites uniquement par un contrôle ou une utilisation technique ;
- lors d’une livraison de release, `packs/` devra être reconstruit depuis `packs-src/` après réactivation du manifeste.

Tout GPT technique reprenant DEV-interface doit être informé de cette distinction :

```text
développement
→ packs non déclarés

candidate/release
→ packs réactivés + reconstruits + testés
```

---

## 10. Procédure de modification future d’un compendium

### Modifier un objet

```text
packs-src/objects/<dossier>/<fichier>.json
→ modifier la source
→ contrôler ID, données, description et image
→ reconstruire avec tools/build-compendiums.mjs
→ réactiver temporairement les packs si un test Foundry est nécessaire
→ contrôle statique
→ test Foundry
→ commit utilisateur
```

### Modifier une arme

```text
packs-src/weapons/<dossier>/<fichier>.json
→ modifier la source
→ contrôler ID, catégorie, formule de dégâts, description et image
→ reconstruction
→ contrôle
→ test Foundry
→ commit utilisateur
```

### Modifier un dossier

Modifier le `_Folder.json` correspondant dans `packs-src/`.

Vérifier :

- `_id` ;
- nom ;
- type ;
- parent éventuel ;
- références des Items au dossier.

Puis reconstruire et tester.

### Modifier une image

- modifier ou remplacer l’asset concerné ;
- mettre à jour le champ `img` de la source JSON si le chemin change ;
- vérifier que l’asset existe ;
- reconstruire ;
- tester le rendu dans Foundry.

### Modifier une description

Modifier `system.description` dans la source JSON correspondante, puis reconstruire et contrôler.

### Modifier un identifiant

Les identifiants existants sont structurants.

Ne jamais modifier silencieusement :

- l’ID du pack ;
- l’ID d’un Item ;
- l’ID d’un Folder.

Les identifiants de pack restent :

```text
interface.objects
interface.weapons
```

Tout changement d’identifiant doit faire l’objet d’une analyse d’impact et d’une validation explicite.

---

## 11. Tests réalisés pour valider le protocole

### Tests hors Foundry réalisés

Base de départ recréée depuis le commit Git exact :

```text
386c71c5e73f9d9833905430c6d341344cfaf717
```

Contrôle de syntaxe :

```text
node --check tests/static/check-project.mjs
→ OK
```

Mode développement final, packs désactivés :

```text
node tests/static/check-project.mjs
→ OK — 708 contrôles hors Foundry réussis
→ 22 modules JavaScript vérifiés
→ 3 tests unitaires exécutés
→ chargement isolé et init simulée : OK
```

Vérification supplémentaire :

```text
hash de packs/ avant contrôle
=
hash de packs/ après contrôle
```

Le contrôle de développement ne reconstruit donc plus les LevelDB.

Test sur copie jetable sans aucun dossier `packs/` initial :

```text
system.json sans packs
packs/ absent
→ 708 contrôles réussis
→ packs/ n’est pas recréé
```

Test simulant la future réactivation release, sur copie jetable sans `packs/` initial :

```text
system.json avec les deux déclarations validées
packs/ absent
→ builder exécuté
→ packs reconstruits
→ 718 contrôles réussis
```

Test de garde sur une déclaration volontairement altérée :

```text
name: objects-bad
→ contrôle en échec
→ la réactivation incorrecte est détectée
```

Comparaison finale avec le commit de référence :

```text
fichiers ajoutés   : 0
fichiers supprimés : 0
fichiers modifiés  : 2

- system.json
- tests/static/check-project.mjs
```

Les dossiers `packs/` ont été restaurés exactement à leur état du commit de référence après les tests de reconstruction.

### Tests Foundry réellement exécutés par l’utilisateur

Test réel exécuté par l’utilisateur sous Foundry V14 build `14.365` après intégration du ZIP :

- ouverture du monde utilisant le système DEV-interface ;
- les compendiums système `Objets` et `Armes` ne sont plus présents dans le monde ;
- aucun message d’erreur rouge observé ;
- aucune alerte ou erreur signalée dans la console F12.

Résultat observé :

```text
compendiums système non actifs
+ système chargé sans erreur visible
+ aucune alerte console signalée
```

Après fermeture de Foundry, l’utilisateur a également contrôlé GitHub Desktop : aucune mise à jour de fichier n’est devenue visible. Pour le workflow réel utilisé, aucun bruit Git lié aux compendiums n’a donc été observé après ce cycle.

---

## 12. Limites et risques résiduels

- Le comportement exact fichier par fichier d’un cycle Foundry sur les LevelDB actifs n’a pas été reproduit et catalogué pendant cet arbitrage.
- Cette reproduction n’est plus nécessaire au fonctionnement du protocole retenu, car les packs sont désactivés pendant le développement.
- Le test réel sous Foundry de la désactivation a été réalisé avec succès par l’utilisateur sur le comportement visible et la console.
- Après fermeture de Foundry, aucune modification de fichier n’a été visible dans GitHub Desktop selon le contrôle utilisateur.
- `packs/` reste physiquement présent et versionné dans le projet actuel ; il ne devient pas une nouvelle source de vérité.
- Une exécution manuelle de `tools/build-compendiums.mjs` peut toujours modifier physiquement `packs/`.
- La réactivation des deux packs avant `1.0.0` reste une étape obligatoire et doit être inscrite explicitement dans la roadmap / transmission.
- La publication elle-même n’est pas traitée par cet arbitrage.

---

## 13. Conséquences pour la Phase 04 et les phases suivantes

### Phase 04

Cet arbitrage ne modifie pas le périmètre fonctionnel « États, Destin et réglages MJ ».

Il constitue une opération technique préalable destinée à stabiliser le dossier de développement.

Aucune règle des États, du Destin, du D100, des permissions ou de la persistance n’est modifiée.

### Phases de développement suivantes

Le protocole doit être repris dans les transmissions techniques tant que la candidate `1.0.0` n’est pas préparée :

```text
packs désactivés dans system.json pendant le développement
```

### Documentation projet

GPT Pilote doit inscrire explicitement dans la roadmap / mémoire opérationnelle :

```text
AVANT CANDIDATE 1.0.0 :
réactiver interface.objects et interface.weapons dans system.json,
reconstruire les packs,
exécuter les contrôles,
tester les compendiums sous Foundry.
```

### Dette technique

Aucune nouvelle dette fonctionnelle sur les compendiums n’est ouverte.

Il reste uniquement une obligation opérationnelle de réactivation avant release.

L’éventuelle évolution future vers un modèle `packs/` non versionné n’est pas décidée par ce protocole.

---

## 14. Résumé pour GPT Pilote

```text
Problème :
Foundry pouvait réécrire physiquement les LevelDB des deux compendiums
pendant le développement et créer du bruit Git sans changement fonctionnel volontaire.

Cause :
Les packs étaient déclarés et donc actifs dans system.json.
Ils utilisent des bases LevelDB dont l’état physique peut évoluer.
La séquence exacte de chaque réécriture n’a pas été reproduite,
mais la désactivation rend cette analyse inutile pour le workflow retenu.

Décision utilisateur :
Option C — désactiver temporairement les compendiums dans system.json
jusqu’à la préparation de la candidate/release 1.0.0.

Source de vérité :
packs-src/ pour le contenu.
tools/build-compendiums.mjs pour la reconstruction.

Règle packs/ :
reste physiquement présent et versionné dans l’état actuel,
mais n’est pas actif dans Foundry pendant le développement.
Ne pas committer de variation LevelDB parasite.

Règle packs-src/ :
reste la source d’autorité du contenu.
Ne pas modifier hors changement volontaire de compendium.

Workflow validé :
développement sans manifest.packs
→ contrôles statiques sans reconstruction LevelDB
→ avant 1.0.0 réactivation des deux packs
→ reconstruction
→ contrôles
→ test Foundry
→ candidate/release.

Tests :
708 contrôles hors Foundry réussis en mode développement sans toucher packs/.
Test sans packs/ initial : réussi, aucun pack recréé.
Simulation de réactivation : 718 contrôles réussis et reconstruction correcte.
Déclaration de pack altérée : correctement rejetée.
Test réel Foundry de la désactivation : réussi — compendiums absents du monde, aucun message rouge et aucune alerte console F12 signalée.
Contrôle post-cycle : après fermeture de Foundry, aucune modification de fichier visible dans GitHub Desktop.

Document(s) modifié(s) :
system.json
tests/static/check-project.mjs

Action attendue de GPT Pilote :
consolider cette décision de projet et inscrire dans la roadmap / transmission
la réactivation obligatoire de interface.objects et interface.weapons,
leur reconstruction et leur test Foundry avant la candidate 1.0.0.
```
