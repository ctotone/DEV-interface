# ARCHITECTURE FOUNDRY — SYSTÈME D100 INTERFACE

**Phase :** 02 — Architecture Foundry  
**Statut :** ARCHITECTURE VALIDÉE  
**Date :** 5 août 2026  
**Propriétaire et autorité finale :** utilisateur  
**GPT principal :** GPT Foundry — Développement Foundry  
**Coordination et consolidation :** GPT Pilote — Direction de projets IA  
**Dépôt :** `ctotone/DEV-interface`  
**Branche de référence :** `main`  
**Commit de référence :** `90858fdf37839150cca6e6364bedac3aa5e16512`  
**Message du commit :** `Phase 1 terminée`  
**Identifiant technique Foundry :** `interface`  
**Développement Foundry :** non commencé  
**Validation utilisateur :** 5 août 2026  
**Effet de cette validation :** autoriser la préparation de la première tranche de développement, sans autoriser une publication

---

# 0. Fonction du document

Ce document traduit les règles fonctionnelles validées des phases 00A et 01 en une architecture technique Foundry VTT.

Il définit :

- la version Foundry ciblée ;
- le contrat du futur `system.json` ;
- les types d’Actor et d’Item ;
- les données persistées et dérivées ;
- les paramètres de monde ;
- le contrat du moteur D100 ;
- la séparation entre résultat public et informations secrètes du Destin ;
- les cartes de chat ;
- les dégâts ;
- l’initiative ;
- les permissions ;
- la stratégie de migration interne ;
- les points d’entrée Foundry ;
- l’organisation des fichiers ;
- la stratégie de tests ;
- les limites et réserves de faisabilité.

Ce document ne contient pas le code du système.

Sa validation autorise le développement ultérieur. Elle ne vaut ni validation du code, ni validation dans Foundry, ni candidate de publication.

---

# 1. Légende d’autorité

Les éléments du document sont classés comme suit.

## 1.1 Exigence validée

Une **[EXIGENCE VALIDÉE]** provient des spécifications fonctionnelles validées ou d’un arbitrage explicite de l’utilisateur.

Elle ne doit pas être modifiée silencieusement pendant le développement.

## 1.2 Recommandation technique

Une **[RECOMMANDATION TECHNIQUE]** traduit une exigence en architecture Foundry.

Elle devient une décision de projet si l’utilisateur valide le présent document.

## 1.3 Réserve de faisabilité

Une **[RÉSERVE DE FAISABILITÉ]** signale un comportement souhaité dont la mise en œuvre exacte exige un prototype ou un test réel dans Foundry.

Elle ne doit pas être présentée comme acquise avant ce test.

## 1.4 Point différé

Un **[POINT DIFFÉRÉ]** reste hors de la présente tranche.

Il ne doit pas être implémenté par anticipation.

## 1.5 Arbitrages de consolidation

Les arbitrages utilisateur intégrés lors de la consolidation par GPT Pilote sont :

```text
Compatibilité Foundry     : génération V14
Build initiale de test    : 14.365
Import Roll20             : aucun
Destin public             : halo discret + détail au survol
Détail secret du Destin   : MJ uniquement
Compétences               : entiers de 0 à 100
Seuil D100                : non plafonné à 100
```

---

# 2. Base de référence et hiérarchie des sources

## 2.1 Base technique

La base d’autorité est :

```text
Dépôt       : ctotone/DEV-interface
Branche     : main
Commit      : 90858fdf37839150cca6e6364bedac3aa5e16512
Message     : Phase 1 terminée
Package     : système Foundry VTT
Identifiant : interface
```

Les décalages occasionnels entre le hash inscrit dans une archive documentaire et le dernier push sont un effet connu de la méthode de travail. Les suffixes automatiques des archives, par exemple `interface(4).zip`, ne sont pas des numéros de version du système.

## 2.2 Documents fonctionnels prioritaires

L’ordre d’autorité appliqué à cette architecture est :

1. décision explicite actuelle de l’utilisateur ;
2. phase 00A pour l’algorithme détaillé des jets ;
3. phase 01 pour le personnage, l’équipement, les conflits et la progression ;
4. décision de clôture de phase 01 ;
5. état, transmission et roadmap ;
6. références historiques Roll20 uniquement lorsque les sources validées ne définissent pas un détail visuel ou un inventaire de données.

## 2.3 Statut des références Roll20

**[EXIGENCE VALIDÉE]**

Aucun import Roll20 n’est prévu.

Les anciens fichiers HTML et CSS servent uniquement :

- à identifier les données historiquement présentes sur la fiche ;
- à fournir une base visuelle pour la future conception des feuilles ;
- à éviter de repartir de zéro pour le design.

Ils ne définissent pas :

- un format de migration ;
- une compatibilité ;
- un schéma à reproduire ;
- une règle métier ;
- une ancienne automatisation à restaurer.

En cas de contradiction, les spécifications validées priment.

---

# 3. Périmètre architectural de la première version jouable

## 3.1 Inclus

**[EXIGENCE VALIDÉE]**

La première version jouable doit pouvoir fournir :

- une fiche de personnage ;
- les six Compétences fixes ;
- les dix-huit Talents fixes ;
- les données d’identité ;
- Blessures, Stress et Destin ;
- les valeurs dérivées ;
- les jets D100 normaux, avec avantage ou désavantage ;
- les marges ;
- la progression bornée à neuf gains ;
- des Items d’équipement ;
- les armes et leurs formules de dégâts ;
- une carte publique de résultat ;
- les actions de dégâts autorisées ;
- une initiative simple ;
- les paramètres mondiaux validés ;
- les contrôles propriétaire et MJ ;
- un socle de migrations internes ;
- un fonctionnement sans Dice So Nice ;
- une intégration facultative de Dice So Nice lorsqu’elle est testée.

## 3.2 Hors périmètre

**[EXIGENCE VALIDÉE]**

Sont exclus :

- l’import Roll20 ;
- le ciblage automatique ;
- la défense ou la résistance automatique ;
- l’armure calculée ;
- l’application automatique des dégâts ;
- la comparaison attaquant/défenseur ;
- la portée tactique ;
- les déplacements ou effets de canevas automatisés ;
- la mort, l’incapacité, la panique ou la récupération automatiques ;
- un moteur tactique complet ;
- les compendiums de contenu final ;
- la publication ;
- la compatibilité V13 ;
- la compatibilité V15 non testée ;
- une dépendance obligatoire à Dice So Nice.

## 3.3 Principe de proportion

**[RECOMMANDATION TECHNIQUE]**

La V1 utilise les Documents natifs de Foundry et le minimum de sous-types nécessaires.

Elle ne crée pas :

- de Document personnalisé ;
- de Combat personnalisé ;
- de ChatMessage personnalisé ;
- de socket système ;
- de compendium vide ;
- de type d’Actor ou d’Item anticipé ;
- de framework externe.

---

# 4. Version Foundry et politique de compatibilité

## 4.1 Version cible

**[EXIGENCE VALIDÉE]**

```text
Génération ciblée             : Foundry VTT V14
Build de développement initial: 14.365
Build de test initiale        : 14.365
Compatibilité déclarée        : génération V14 uniquement
Compatibilité V13             : non
Compatibilité V15             : non déclarée
```

Foundry VTT `14.365`, publiée le 15 juillet 2026, constitue l’environnement concret de référence pour les premiers développements et tests. Elle n’est pas une condition d’installation : le contrat de compatibilité porte sur la génération V14.

## 4.2 Compatibilité du manifeste

**[RECOMMANDATION TECHNIQUE VALIDÉE]**

Le manifeste de développement déclare la génération V14 sans se limiter à une build précise :

```json
"compatibility": {
  "minimum": "14",
  "verified": "14",
  "maximum": "14"
}
```

Les champs `minimum` et `maximum` limitent l’installation et l’activation à la génération V14. Le champ `verified` reste exprimé au niveau de la génération. La build `14.365` demeure l’environnement initial de preuve et doit être mentionnée dans les rapports de test.

Cette politique interdit V13 et empêche qu’un monde utilisant `interface` soit migré vers une génération future non encore prise en charge.

## 4.3 API publiques

**[RECOMMANDATION TECHNIQUE]**

Le système privilégie exclusivement les API publiques documentées pour V14.

Toute utilisation ultérieure d’une API protégée, interne ou privée exigera :

- une absence démontrée d’alternative publique ;
- une justification ;
- une version testée ;
- une couverture de tests ;
- une stratégie de remplacement ;
- une validation de l’utilisateur si le risque de compatibilité devient structurant.

Aucune API interne n’est retenue dans la présente architecture.

---

# 5. Identité du package et manifeste

## 5.1 Identité stable

**[EXIGENCE VALIDÉE]**

```text
Type de package       : system
Identifiant           : interface
Dossier Foundry       : interface
Namespace settings    : interface
Namespace flags       : interface
Namespace socket futur: system.interface
Dépôt                 : ctotone/DEV-interface
```

L’identifiant `interface` ne doit pas être renommé silencieusement.

## 5.2 Version initiale

**[RECOMMANDATION TECHNIQUE]**

La première version locale de développement sera :

```text
0.1.0
```

Cette version indique un système non publié et encore instable.

La version pourra évoluer avant toute candidate. Elle ne constitue pas une version publique.

## 5.3 Manifeste de développement proposé

Le manifeste suivant est une structure cible. Il ne doit être créé qu’après validation de l’architecture.

```json
{
  "id": "interface",
  "title": "D100 Interface",
  "type": "system",
  "version": "0.1.0",
  "description": "Système D100 générique, léger et orienté narration.",
  "compatibility": {
    "minimum": "14",
    "verified": "14",
    "maximum": "14"
  },
  "esmodules": [
    "scripts/interface.mjs"
  ],
  "styles": [
    "styles/interface.css"
  ],
  "languages": [
    {
      "lang": "fr",
      "name": "Français",
      "path": "lang/fr.json"
    }
  ],
  "documentTypes": {
    "Actor": {
      "character": {
        "htmlFields": [
          "identity.notes"
        ]
      }
    },
    "Item": {
      "equipment": {
        "htmlFields": [
          "description"
        ]
      }
    }
  },
  "initiative": "1d10 + @derived.initiativeBonus",
  "media": []
}
```

## 5.4 Champs volontairement absents du manifeste initial

**[RECOMMANDATION TECHNIQUE]**

Les champs suivants restent absents tant que leur valeur réelle n’est pas validée :

- `authors` ;
- `url` ;
- `manifest` ;
- `download` ;
- `bugs` ;
- `changelog` ;
- `license` ;
- `readme` ;
- `packs` ;
- `packFolders` ;
- `relationships` ;
- `socket` ;
- `background`.

Leur absence empêche d’inventer une identité publique, une URL, une licence, une dépendance ou une politique de publication.

## 5.5 Langue

**[RECOMMANDATION TECHNIQUE]**

Le français est la langue source de l’interface.

Même si la localisation multilingue est différée, les libellés visibles doivent être placés dans `lang/fr.json` dès la première tranche afin d’éviter une migration ultérieure de chaînes codées en dur.

---

# 6. Documents et sous-types

## 6.1 Actor

**[RECOMMANDATION TECHNIQUE]**

Un seul sous-type d’Actor est créé :

```text
Actor.type = character
```

Il représente le personnage joueur.

Aucun type distinct n’est créé pour :

- PNJ ;
- créature ;
- véhicule ;
- groupe.

Un éventuel besoin futur fera l’objet d’une décision et d’une migration.

## 6.2 Item

**[RECOMMANDATION TECHNIQUE]**

Un seul sous-type d’Item est créé :

```text
Item.type = equipment
```

Une propriété persistée distingue :

```text
system.category = ordinary
system.category = weapon
```

Cette structure conserve l’unité fonctionnelle de l’Équipement et évite deux DataModels presque identiques.

## 6.3 Items embarqués

**[RECOMMANDATION TECHNIQUE]**

Les équipements possédés sont des Items embarqués dans l’Actor.

Conséquences :

- l’Actor est la source de vérité de son inventaire ;
- une copie depuis un compendium devient un Item local indépendant ;
- une modification de la copie locale ne modifie pas le compendium ;
- l’inventaire n’est pas dupliqué dans une chaîne de texte de l’Actor ;
- une arme est visible dans l’inventaire et, en plus, dans la zone Armes.

## 6.4 Présentation Inventaire / Armes

**[RECOMMANDATION TECHNIQUE]**

Tous les Items embarqués apparaissent dans l’Inventaire.

Les Items dont `system.category === "weapon"` apparaissent également dans la zone Armes.

Aucun booléen supplémentaire du type `equipped`, `active` ou `shownAsWeapon` n’est ajouté en V1, car aucune règle validée ne demande de masquer une arme de cette zone.

Le glisser-déposer vers la zone Armes peut convertir la catégorie en `weapon`. Le glisser-déposer ou tri dans l’Inventaire ne retire pas cette catégorie : l’Inventaire contient toujours tous les Items.

---

# 7. Principes du modèle de données

## 7.1 Séparation obligatoire

**[RECOMMANDATION TECHNIQUE]**

```text
donnée persistée
→ TypeDataModel
→ préparation des données dérivées
→ contexte de feuille
→ rendu
```

Ne doivent pas être persistés sans raison :

- niveaux de Blessures et de Stress ;
- malus d’état ;
- valeurs dérivées ;
- bonus d’initiative ;
- totaux de création ;
- avertissements ;
- listes filtrées pour l’affichage ;
- libellés ;
- classes CSS.

## 7.2 Technologie V14

Les sous-types `character` et `equipment` utilisent des classes dérivées de :

```text
foundry.abstract.TypeDataModel
```

Elles sont déclarées dans `system.json`, puis enregistrées dans `CONFIG.Actor.dataModels` et `CONFIG.Item.dataModels` pendant le hook `init`.

L’ancien modèle fondé sur `template.json` n’est pas retenu.

## 7.3 Validation et nettoyage

**[RECOMMANDATION TECHNIQUE]**

Les bornes explicitement validées sont appliquées dans les DataFields.

Les contraintes non définies par les règles ne sont pas inventées.

En particulier :

- les Talents sont des entiers de `0` à `30` ;
- Blessures et Stress sont des entiers de `0` à `15` ;
- la jauge est un entier de `0` à `3` ;
- la quantité est un entier d’au moins `1` ;
- les Compétences sont des entiers de `0` à `100` ;
- aucun clamp générique du seuil D100 n’est ajouté ;
- les seuils supérieurs à `100` ne sont pas rabattus silencieusement.

---

# 8. DataModel de l’Actor `character`

## 8.1 Structure persistée cible

```text
system
├── identity
│   ├── age
│   ├── profession
│   ├── specializations
│   └── notes
├── skills
│   ├── carrure
│   ├── agilite
│   ├── perception
│   ├── mental
│   ├── intellect
│   └── charisme
├── talents
│   ├── endurance
│   ├── forceBrute
│   ├── robustesse
│   ├── agiliteCorporelle
│   ├── precision
│   ├── reflexe
│   ├── acuiteSensorielle
│   ├── sixiemeSens
│   ├── vigilance
│   ├── decision
│   ├── determination
│   ├── equilibreMental
│   ├── creativite
│   ├── erudition
│   ├── logique
│   ├── aura
│   ├── communicationExpressive
│   └── persuasion
├── resources
│   ├── wounds
│   │   └── value
│   ├── stress
│   │   └── value
│   └── destiny
│       └── value
└── progression
    ├── gauge
    ├── skillGains
    │   ├── first
    │   ├── second
    │   └── third
    ├── talentGains
    │   ├── first
    │   ├── second
    │   └── third
    └── specializationGains
        ├── first
        ├── second
        └── third
```

Le nom du personnage reste dans `Actor.name`. Il n’est pas dupliqué sous `system`.

## 8.2 Dictionnaire de données

| Chemin | Type | Initiale | Validation | Nature |
|---|---:|---:|---|---|
| `identity.age` | chaîne | vide | aucune sémantique imposée | persistée |
| `identity.profession` | chaîne | vide | texte libre | persistée |
| `identity.specializations` | chaîne multiligne | vide | texte libre | persistée |
| `identity.notes` | HTML assaini | vide | HTMLField | persistée |
| `skills.*` | nombre entier | `0` | min `0`, max `100` | persistée |
| `talents.*` | nombre entier | `0` | min `0`, max `30` | persistée |
| `resources.wounds.value` | nombre entier | `0` | min `0`, max `15` | persistée |
| `resources.stress.value` | nombre entier | `0` | min `0`, max `15` | persistée |
| `resources.destiny.value` | nombre entier | `0` | min `0`, plafond mondial appliqué par service | persistée |
| `progression.gauge` | nombre entier | `0` | min `0`, max `3` | persistée |
| `progression.*Gains.*` | booléen | `false` | aucune automatisation cachée | persistée |

## 8.3 Spécialisations

**[RECOMMANDATION TECHNIQUE]**

Les spécialisations sont conservées dans un champ texte multiligne unique.

Chaque ligne peut représenter une spécialisation.

Cette solution :

- respecte le caractère libre des spécialisations ;
- évite d’inventer une structure métier ;
- permet un affichage simple ;
- reste migrable vers une liste structurée si une règle future le justifie.

## 8.4 Notes et descriptions riches

**[RECOMMANDATION TECHNIQUE]**

`identity.notes` et `Item.system.description` utilisent des `HTMLField`.

Le manifeste les déclare dans `htmlFields` afin que Foundry assainisse le contenu enregistré.

Les autres champs libres restent des chaînes simples.

## 8.5 Compétences

**[EXIGENCE VALIDÉE]**

Les six Compétences sont fixes.

Chaque Compétence est un entier compris entre :

```text
0 et 100
```

Le plafond de `100` est absolu. Il s’applique à la saisie manuelle, à la progression et à toute écriture automatisée.

**[RECOMMANDATION TECHNIQUE VALIDÉE]**

Le DataModel, les formulaires et les services de progression appliquent les bornes `0` et `100`.

Ce plafond concerne la valeur de Compétence. Il ne crée aucun clamp du seuil D100, qui peut dépasser `100` après addition d’un Talent.

## 8.6 Talents

**[EXIGENCE VALIDÉE]**

Les dix-huit Talents sont fixes et strictement bornés de `0` à `30`.

La borne est appliquée :

- dans le DataModel ;
- dans les contrôles de formulaire ;
- dans les services de progression ;
- dans toute mise à jour automatisée.

## 8.7 Destin et plafond dynamique

**[RECOMMANDATION TECHNIQUE]**

Le DataField garantit une valeur entière non négative.

Le plafond dépend d’un setting mondial et ne peut donc pas être une borne statique du schéma.

Toutes les écritures de Destin passent par un service unique qui :

- lit le plafond actuel ;
- calcule la valeur cible ;
- applique le clamp ;
- effectue une seule mise à jour de l’Actor ;
- retourne la valeur réellement persistée.

Une modification manuelle depuis la feuille applique le même service.

---

# 9. Données dérivées de l’Actor

## 9.1 Structure transitoire

**[RECOMMANDATION TECHNIQUE]**

Pendant `prepareDerivedData`, le système construit une propriété non persistée :

```text
system.derived
├── levels
│   ├── wounds
│   └── stress
├── statePenalty
├── scores
│   ├── melee
│   ├── distance
│   ├── verbal
│   └── custom
├── initiativeBonus
└── creation
    ├── skillValues
    ├── skillDistributionRecommended
    ├── talentTotal
    ├── talentTotalRecommended
    └── warnings
```

Dans le contexte de jet, le chemin utilisé peut être exposé simplement comme :

```text
@derived.initiativeBonus
```

La classe d’Actor adapte `getRollData()` au chemin réellement utilisé par le manifeste sans modifier les données sources.

## 9.2 Niveaux de Blessures et Stress

**[EXIGENCE VALIDÉE]**

```text
0       → niveau 0
1 à 3   → niveau 1
4 à 6   → niveau 2
7 à 9   → niveau 3
10 à 12 → niveau 4
13 à 15 → niveau 5
```

Formule technique :

```text
niveau(0) = 0
niveau(n) = ceil(n / 3) pour n > 0
```

## 9.3 Malus d’état

**[EXIGENCE VALIDÉE]**

```text
statePenalty =
(woundsLevel + stressLevel)
× statePenaltyCoefficient
```

Le coefficient vient d’un setting mondial.

Ce malus s’applique aux jets D100 et ne s’applique pas à l’initiative.

## 9.4 Valeurs dérivées fixes

**[EXIGENCE VALIDÉE]**

```text
Corps à corps =
floor(
  moyenne(Carrure, Agilité)
  + moyenne(des six Talents associés)
)

Distance =
floor(
  moyenne(Perception, Mental)
  + moyenne(des six Talents associés)
)

Verbal =
floor(
  moyenne(Intellect, Charisme)
  + moyenne(des six Talents associés)
)
```

Chaque valeur est plafonnée à `99`.

Le calcul est centralisé dans une fonction pure. La feuille, l’initiative et les jets ne recopient pas les formules.

## 9.5 Valeur dérivée personnalisée

**[EXIGENCE VALIDÉE]**

La configuration mondiale peut définir :

- activation ;
- nom ;
- deux Compétences distinctes ;
- six Talents distincts ;
- conservation de la configuration lorsqu’elle est désactivée.

Formule :

```text
floor(
  moyenne(des deux Compétences)
  + moyenne(des six Talents)
)
```

Plafond : `99`.

**[RECOMMANDATION TECHNIQUE]**

Une configuration incomplète ou contenant des doublons est conservée, mais elle est considérée invalide et ne peut pas être utilisée dans un jet.

L’activation ne peut être enregistrée comme effective tant que la configuration n’est pas complète.

## 9.6 Bonus d’initiative

**[EXIGENCE VALIDÉE]**

```text
initiativeBonus = round(Distance / 10)
initiative = 1d10 + initiativeBonus
```

---

# 10. DataModel de l’Item `equipment`

## 10.1 Structure persistée cible

```text
system
├── description
├── category
├── quantity
└── damage
    └── formula
```

## 10.2 Dictionnaire de données

| Chemin | Type | Initiale | Validation | Nature |
|---|---:|---:|---|---|
| `description` | HTML assaini | vide | HTMLField | persistée |
| `category` | chaîne | `ordinary` | `ordinary` ou `weapon` | persistée |
| `quantity` | nombre entier | `1` | minimum `1` | persistée |
| `damage.formula` | chaîne | vide | validation à l’usage par le moteur de dés | persistée |

Le nom et l’image sont fournis par les champs natifs `Item.name` et `Item.img`.

## 10.3 Changement de catégorie

**[RECOMMANDATION TECHNIQUE]**

Le passage d’`ordinary` à `weapon` ne fabrique pas de formule de dégâts.

Le passage de `weapon` à `ordinary` ne supprime pas silencieusement la formule existante. La feuille la masque dans la présentation ordinaire, mais la donnée reste disponible si la catégorie est restaurée.

Cette conservation évite une perte de donnée lors d’une erreur de manipulation.

## 10.4 Formule de dégâts

**[EXIGENCE VALIDÉE]**

La formule est facultative et utilise la syntaxe de Roll de Foundry.

**[RECOMMANDATION TECHNIQUE]**

La formule n’est pas évaluée pendant la préparation du Document.

Elle est validée au moment de l’action de dégâts.

Une formule vide ou invalide :

- n’empêche pas de conserver l’Item ;
- n’exécute aucun Roll ;
- affiche une notification explicite à l’utilisateur autorisé ;
- ne crée pas de résultat trompeur.

---

# 11. Settings de monde

## 11.1 Principes

**[EXIGENCE VALIDÉE]**

Les paramètres de règles sont communs au monde et modifiables par le MJ.

**[RECOMMANDATION TECHNIQUE]**

Ils utilisent :

```text
namespace : interface
scope     : world
restricted: true pour le menu
```

Un menu ApplicationV2 dédié regroupe les paramètres afin de permettre une validation croisée.

## 11.2 Registre des settings

| Clé stable | Type | Défaut | Validation |
|---|---|---:|---|
| `statePenaltyCoefficient` | entier | `3` | min `0` |
| `destinyGain` | entier | `5` | min `0` |
| `destinyCap` | entier | `30` | min `0` |
| `destinyTriggerChance` | entier | `80` | min `0`, max `100` |
| `destinyCriticalMinimum` | entier | `15` | min `0` |
| `customDerived` | objet structuré | désactivé | validation croisée |
| `schemaVersion` | entier caché | `0` | géré par migrations |

Ces identifiants sont des propositions structurantes. Leur validation les rend stables.

## 11.3 Structure de `customDerived`

```json
{
  "enabled": false,
  "name": "",
  "skills": [],
  "talents": []
}
```

Contraintes :

- exactement deux clés distinctes dans `skills` pour être valide ;
- exactement six clés distinctes dans `talents` pour être valide ;
- toutes les clés doivent appartenir aux listes fixes ;
- le nom doit être non vide pour l’usage ;
- désactiver ne vide pas la configuration.

## 11.4 Réduction du plafond de Destin

**[RECOMMANDATION TECHNIQUE À VALIDER]**

Si le MJ diminue `destinyCap` sous la valeur détenue par un ou plusieurs Actors :

1. le menu calcule le nombre d’Actors concernés ;
2. il présente explicitement l’impact ;
3. le MJ confirme ou annule ;
4. en cas de confirmation, le setting est enregistré ;
5. les réserves concernées sont ramenées au nouveau plafond dans une opération contrôlée ;
6. un rapport indique le nombre de Documents modifiés.

Le changement ne doit pas produire un écrasement silencieux.

## 11.5 Rechargement

Les paramètres de calcul sont lus à chaque résolution et à chaque préparation des données.

Ils ne nécessitent pas de rechargement complet, sauf contrainte technique démontrée pendant l’implémentation.

---

# 12. Architecture du moteur D100

## 12.1 Séparation des responsabilités

**[RECOMMANDATION TECHNIQUE]**

Le moteur métier est indépendant :

- des feuilles ;
- du DOM ;
- des ChatMessages ;
- de Dice So Nice ;
- des permissions ;
- des mises à jour de Documents.

Chaîne cible :

```text
collecte et validation des entrées
→ création du ou des Roll Foundry
→ extraction des résultats naturels
→ moteur pur D100
→ décision de mise à jour du Destin
→ écriture Actor
→ projections publique et MJ
→ ChatMessages
→ animation facultative
```

## 12.2 Modules purs

```text
rules/d100/qualify-natural
rules/d100/select-raw
rules/d100/resolve-destiny
rules/d100/qualify-final
rules/d100/compute-margin
rules/d100/resolve-d100
```

Chaque fonction reçoit des données simples et retourne des données sérialisables.

## 12.3 Modes

```text
normal
advantage
disadvantage
```

Le moteur reçoit le mode.

Il ne décide jamais si la situation accorde un avantage ou un désavantage.

## 12.4 Sources de seuil

Le contrat distingue :

```text
standard
→ une Compétence + un Talent

derived
→ une valeur dérivée déjà calculée
```

Dans les deux cas :

```text
finalThreshold = baseThreshold - statePenalty
```

Aucun autre modificateur circonstanciel n’est introduit dans cette phase.

## 12.5 Entrée métier normalisée

```json
{
  "schema": 1,
  "source": {
    "kind": "standard",
    "key": "carrure:endurance",
    "label": "Carrure + Endurance",
    "baseValue": 50,
    "skillKey": "carrure",
    "talentKey": "endurance"
  },
  "mode": "normal",
  "state": {
    "woundsValue": 0,
    "woundsLevel": 0,
    "stressValue": 0,
    "stressLevel": 0,
    "coefficient": 3,
    "penalty": 0
  },
  "threshold": {
    "base": 50,
    "final": 50
  },
  "destiny": {
    "before": 0,
    "gain": 5,
    "cap": 30,
    "triggerChance": 80,
    "criticalMinimum": 15
  },
  "naturalValues": [42],
  "context": {
    "kind": "general"
  }
}
```

Pour une source dérivée, `skillKey` et `talentKey` sont absents et `source.key` identifie `melee`, `distance`, `verbal` ou `custom`.

## 12.6 Qualification naturelle

**[EXIGENCE VALIDÉE]**

Ordre de priorité :

```text
1       → super réussite critique automatique
2 à 5   → réussite automatique
96 à 98 → échec automatique
99      → échec critique automatique
100     → super échec critique automatique
autres  → comparaison au seuil
double  → critique si le résultat comparé réussit ou échoue
```

Les propriétés suivantes restent séparées :

```text
success
automatic
critical
superCritical
```

`automatic` n’est pas un rang autonome.

## 12.7 Rang de qualité

Pour la sélection avantage/désavantage :

```text
super réussite critique
réussite critique
réussite
échec
échec critique
super échec critique
```

À rang identique :

```text
avantage     → plus petite valeur
désavantage → plus grande valeur
```

Le dé écarté n’est jamais réexaminé par le Destin.

## 12.8 Résolution du Destin

**[EXIGENCE VALIDÉE]**

Le Destin :

- est individuel ;
- commence à `0` ;
- n’est pas volontaire ;
- utilise toute la réserve lorsqu’il intervient ;
- ne modifie jamais `96` à `100` ;
- effectue un test secret uniquement lorsqu’une intervention est mécaniquement possible ;
- augmente après un échec final sans intervention ;
- revient à `0` après un succès ;
- ne crée pas une réussite automatique ou critique.

### Échec ordinaire non automatique

Éligibilité :

```text
finalThreshold > 5
destiny.before >= naturalSelected - finalThreshold
```

Si le test secret réussit :

```text
résultat définitif = finalThreshold
si finalThreshold est un double :
  résultat définitif = finalThreshold - 1
destiny.after = 0
qualification finale = réussite ordinaire non automatique
```

Sinon :

```text
résultat définitif = résultat naturel sélectionné
destiny.after = min(destiny.before + destinyGain, destinyCap)
```

### Échec critique non automatique

Éligibilité :

```text
destiny.before >= destinyCriticalMinimum
```

Si le test secret réussit, le double est cassé tout en conservant un échec :

```text
essayer naturalSelected - 1
si cette valeur réussit :
  utiliser naturalSelected + 1
destiny.after = 0
qualification finale = échec ordinaire
```

Sinon :

```text
résultat définitif = résultat naturel sélectionné
destiny.after = min(destiny.before + destinyGain, destinyCap)
```

## 12.9 Aléa du test secret

**[RECOMMANDATION TECHNIQUE]**

Le moteur pur reçoit un fournisseur d’aléa injecté.

Il ne contient pas d’appel direct à `Math.random()`.

Les tests peuvent injecter une valeur déterministe.

L’adaptateur Foundry utilise une API publique d’aléa vérifiée pendant l’implémentation. L’API exacte n’est pas figée dans ce document tant qu’elle n’a pas été testée dans V14.365.

## 12.10 Marges

**[EXIGENCE VALIDÉE]**

```text
marge de réussite =
max(0, floor((finalThreshold - finalResult) / 10))

marge d’échec =
max(0, floor((finalResult - finalThreshold) / 10))
```

Une seule marge est active selon l’issue finale.

## 12.11 Sortie métier complète

Le résultat interne sérialisable contient au minimum :

```text
schema
mode
source
state
threshold
naturalResults[]
selectedIndex
rawResult
rawQualification
destiny.before
destiny.eligible
destiny.tested
destiny.secretRoll
destiny.triggered
destiny.intervention
destiny.correction
destiny.after
finalResult
finalQualification
margin.kind
margin.value
context
```

Le résultat interne complet n’est pas automatiquement public.

## 12.12 Immutabilité

**[RECOMMANDATION TECHNIQUE]**

Le résultat retourné par le moteur est traité comme immutable.

Les projections de chat sont produites par copie filtrée.

Aucune carte de chat ne recalcule la règle à partir de son HTML.

---

# 13. Orchestration Foundry du jet

## 13.1 Service unique

Un service de résolution orchestre :

1. l’Actor cible ;
2. les permissions ;
3. la source de seuil ;
4. le mode ;
5. les settings ;
6. le Roll naturel ;
7. le moteur pur ;
8. l’écriture du Destin ;
9. les données publiques ;
10. les données MJ ;
11. les ChatMessages ;
12. l’intégration facultative Dice So Nice.

## 13.2 Roll naturel

**[RECOMMANDATION TECHNIQUE]**

```text
normal                    → 1d100
avantage ou désavantage  → 2d100
```

Un seul objet Roll représente le jet naturel afin de conserver les dés réellement produits par Foundry.

Le moteur extrait les résultats de ses termes ; il ne recrée pas des nombres à partir du total.

## 13.3 Écriture du Destin

Une résolution produit au maximum une mise à jour de l’Actor pour le Destin.

L’écriture est effectuée avant la création de la carte publique afin que la carte indique la valeur réellement persistée.

En cas d’échec d’écriture :

- la carte de résultat n’est pas publiée comme si l’état avait été enregistré ;
- l’utilisateur reçoit une erreur ;
- le Roll naturel peut être conservé dans les logs de diagnostic sans prétendre que la résolution est finalisée.

## 13.4 Risque de concurrence

**[RÉSERVE DE FAISABILITÉ]**

Foundry ne fournit pas ici de garantie d’écriture atomique optimiste entre deux clients lançant simultanément le même Actor.

La V1 ne crée pas de socket par anticipation.

Le protocole de test doit vérifier :

- joueur et MJ lançant au même instant ;
- deux clients propriétaires ;
- deux échecs modifiant le Destin ;
- un succès et un échec concurrents.

Si un écrasement reproductible est constaté, l’architecture devra être amendée vers une résolution autoritaire, probablement confiée à un MJ actif avec communication socket.

## 13.5 Seuils inhabituels

**[EXIGENCE VALIDÉE]**

Le moteur ne clamp pas le seuil entre `0` et `100`.

Les résultats naturels automatiques restent prioritaires.

Le traitement complémentaire des seuils supérieurs à `100`, au-delà de ces priorités, n’est pas enrichi par une règle inventée.

---

# 14. Confidentialité du Destin et projections de données

## 14.1 Décision de visibilité

**[EXIGENCE VALIDÉE]**

```text
résultat définitif                         → public
intervention du Destin                     → signal visuel public discret
résultat brut et correction du Destin      → accessibles au survol du résultat
test secret, chance et détails internes    → MJ uniquement
design graphique exact                     → phase de design de la carte
```

La carte conserve une lecture immédiate légère : une teinte ou un halo discret indique que le Destin est intervenu, sans ajouter un bloc d’information permanent.

Le survol du résultat fournit un second niveau de lecture, selon une formulation compacte du type :

```text
Brut : 68 — Destin : −15 — Final : 53
```

Le libellé exact, les couleurs et l’intensité visuelle seront affinés ultérieurement. Le message public ne contient jamais le résultat du test secret, sa chance, l’éligibilité interne ou le diagnostic réservé au MJ.

## 14.2 Limite des flags publics

**[RECOMMANDATION TECHNIQUE]**

Masquer une information dans le HTML ne suffit pas à la rendre secrète si elle reste présente dans les flags d’un ChatMessage public.

Le message public ne doit donc contenir ni :

- valeur du test secret ;
- chance exacte testée ;
- détail d’éligibilité réservé au MJ ;
- motif interne d’échec du Destin ;
- données techniques non destinées aux joueurs.

## 14.3 Deux projections

Le service construit :

### Projection publique

```text
source
mode
seuil
dés naturels nécessaires à la lecture
résultat brut sélectionné
correction publique du Destin lorsqu’il intervient
résultat définitif
qualification publique
marge
destinyIntervened
destinyAfter si la réserve est affichable
contexte de conflit
snapshot d’armes autorisé
```

### Projection MJ

```text
toutes les données publiques
éligibilité
test secret
valeur secrète
chance
raison de non-intervention
correction
réserve avant/après
diagnostic technique utile
```

## 14.4 Persistance du détail MJ

**[RECOMMANDATION TECHNIQUE]**

Le détail secret n’est jamais enregistré dans le message public.

Lorsqu’un test du Destin est effectué, une projection MJ peut être conservée dans un ChatMessage chuchoté aux MJ, avec une présentation compacte.

La décision visuelle finale — message séparé visible dans le journal ou détail consultable autrement — est différée à la phase de design des cartes.

L’invariant de sécurité est déjà fixé : aucun payload secret dans le message public.

---

# 15. Contrat des cartes de chat

## 15.1 Nature

Les cartes sont des représentations de ChatMessages natifs.

Le système utilise :

- des templates Handlebars ;
- des flags sous le namespace `interface` ;
- le hook public `renderChatMessageHTML` ;
- des actions déclaratives, sans JavaScript inline ;
- des contrôles de permission dans chaque gestionnaire.

## 15.2 Clé de flag proposée

**[RECOMMANDATION TECHNIQUE]**

```text
flags.interface.card
```

Structure commune :

```json
{
  "schema": 1,
  "type": "d100-result",
  "actorUuid": "Actor.…",
  "publicData": {}
}
```

Types initiaux :

```text
d100-result
d100-gm-detail
weapon-selector
damage-result
initiative
```

Cette clé devient persistante après validation et ne doit plus être renommée sans migration.

## 15.3 Carte `d100-result`

Elle affiche fonctionnellement :

- Actor et source du jet ;
- mode normal, avantage ou désavantage ;
- seuil ;
- dés naturels ;
- dé sélectionné ;
- résultat définitif ;
- réussite, échec, critique ou super-critique ;
- caractère automatique lorsqu’il est public et pertinent ;
- marge ;
- halo ou teinte discrète lorsque le Destin intervient ;
- détail compact au survol du résultat : valeur brute, correction du Destin et résultat final ;
- actions de dégâts selon le contexte et les permissions.

La présence du halo et du survol est validée. La hiérarchie graphique précise, les couleurs, icônes, formulations et animations restent différées.

## 15.4 Réutilisation des actions

**[EXIGENCE VALIDÉE]**

Les boutons restent réutilisables.

Chaque activation produit un nouveau résultat ou sélecteur ; elle ne remplace pas l’ancienne carte.

## 15.5 Contrôle au clic

Chaque gestionnaire :

1. récupère le ChatMessage ;
2. valide `flags.interface.card.schema` ;
3. valide le type ;
4. résout l’Actor ;
5. vérifie que l’Actor existe ;
6. vérifie la permission actuelle ;
7. valide la donnée ou le snapshot ;
8. exécute l’action ;
9. notifie clairement toute impossibilité.

Masquer un bouton n’est jamais le seul contrôle.

---

# 16. Armes et dégâts dans le chat

## 16.1 Source des armes

Une arme disponible est un Item embarqué de type `equipment` dont :

```text
system.category === "weapon"
```

## 16.2 Snapshot lors d’une réussite de conflit

**[RECOMMANDATION TECHNIQUE]**

Au moment de créer la carte de réussite, le service enregistre un snapshot public minimal des armes disponibles :

```text
itemUuid
name
img
damageFormula
formulaValidAtCreation
sort
```

Le snapshot permet à une ancienne carte de rester reproductible si l’Item est ensuite renommé, modifié ou supprimé.

L’action de dégâts utilise la formule du snapshot, pas la formule actuelle de l’Item.

Cette décision protège la cohérence historique du chat.

## 16.3 Réussite ordinaire

Après une réussite de conflit :

- le propriétaire et le MJ peuvent choisir une arme du snapshot ;
- une formule valide produit un Roll de dégâts ;
- aucune cible n’est modifiée ;
- aucune Blessure n’est appliquée automatiquement.

## 16.4 Critique et super-critique

Après un critique ou super-critique réussi :

- l’action de dégâts normaux est disponible ;
- l’action de dégâts maximum est disponible ;
- les deux créent une nouvelle carte de dégâts.

## 16.5 Échec

Après un échec :

- aucun joueur ne peut forcer les dégâts ;
- le MJ voit l’action « Lancer quand même les dégâts » ;
- cette action crée une nouvelle sélection publique ;
- la sélection utilise les armes actuelles de l’Actor au moment du clic, puis en crée un snapshot.

## 16.6 Absence d’arme

La carte indique explicitement qu’aucune arme n’est disponible.

Aucun bouton vide ou inactif ambigu n’est rendu.

## 16.7 Validation et maximum

**[RECOMMANDATION TECHNIQUE]**

Avant évaluation :

```text
Roll.validate(formula)
```

Dégâts normaux :

```text
new Roll(formula).evaluate()
```

Dégâts maximum :

```text
new Roll(formula).evaluate({ maximize: true })
```

L’utilisation exacte des signatures est vérifiée lors de l’implémentation V14.365.

## 16.8 Formules avancées

**[RÉSERVE DE FAISABILITÉ]**

Le maximum doit être testé sur :

- dés simples ;
- plusieurs dés ;
- modificateurs ;
- valeurs négatives ;
- parenthèses ;
- formules comportant des termes avancés ;
- formules invalides.

La compatibilité avec toute extension de syntaxe ajoutée par un module tiers n’est pas garantie.

---

# 17. Initiative

## 17.1 Documents utilisés

**[RECOMMANDATION TECHNIQUE]**

La V1 utilise les Documents natifs :

```text
Combat
Combatant
Actor
```

Aucune sous-classe de Combat ou Combatant n’est retenue.

## 17.2 Formule

**[EXIGENCE VALIDÉE]**

```text
1d10 + round(Distance / 10)
```

Le manifeste fournit :

```json
"initiative": "1d10 + @derived.initiativeBonus"
```

L’Actor fournit le chemin correspondant dans ses roll data.

## 17.3 Permission

Le propriétaire de l’Actor et le MJ peuvent :

- lancer ;
- relancer ;
- voir le détail du D10 et du bonus.

Un utilisateur non propriétaire ne le peut pas.

## 17.4 Ordre et égalités

**[EXIGENCE VALIDÉE]**

L’ordre est décroissant et les égalités sont départagées par le MJ.

**[RECOMMANDATION TECHNIQUE]**

La V1 ne remplace pas une méthode de tri protégée de Foundry.

Elle ne dépend pas d’un ordre natif particulier entre égalités, car la documentation et l’implémentation peuvent évoluer.

En cas d’égalité :

- la carte ou le tracker signale l’égalité ;
- le MJ utilise les outils natifs pour modifier, relancer ou fixer l’initiative ;
- le système n’invente pas de second critère.

## 17.5 Blessures et Stress

Le malus d’état ne touche jamais l’initiative.

---

# 18. Feuilles et Applications

## 18.1 Technologies

**[RECOMMANDATION TECHNIQUE]**

Les feuilles V14 utilisent :

```text
HandlebarsApplicationMixin(ActorSheetV2)
HandlebarsApplicationMixin(ItemSheetV2)
```

Elles sont enregistrées pendant `init` avec :

```text
DocumentSheetConfig.registerSheet
```

Le menu des settings utilise ApplicationV2.

## 18.2 Responsabilités de la feuille Actor

La feuille :

- présente les données ;
- prépare les intentions ;
- délègue les calculs aux services ;
- ne contient pas le moteur D100 ;
- ne recalcule pas les valeurs dérivées ;
- ne décide pas du Destin ;
- ne contourne pas les permissions.

## 18.3 Responsabilités de la feuille Item

La feuille :

- édite le nom natif ;
- édite la description ;
- édite la catégorie ;
- édite la quantité ;
- édite la formule de dégâts ;
- signale une formule invalide sans empêcher la sauvegarde ;
- masque les contrôles d’arme pour un objet ordinaire sans supprimer la formule.

## 18.4 Avertissements de création

**[EXIGENCE VALIDÉE]**

La création recommande :

```text
Compétences : 20 / 30 / 30 / 40 / 40 / 50
Talents     : total de 100
```

**[RECOMMANDATION TECHNIQUE]**

La feuille affiche un avertissement non bloquant.

Elle ne persiste pas un stock de points non dépensés.

La confirmation est une interaction de feuille ; elle ne modifie pas le schéma.

## 18.5 Progression

**[RECOMMANDATION TECHNIQUE À VALIDER]**

Les neuf cases suivent la consommation déclarative des gains.

Un assistant peut :

- proposer une Compétence et ajouter `+5` ;
- proposer une répartition totale de `+15` entre Talents en respectant le plafond ;
- faciliter l’ajout d’une ligne de spécialisation ;
- cocher la case correspondante.

Décocher une case ne retire jamais automatiquement une valeur déjà appliquée.

La case et les valeurs restent sous la responsabilité du joueur et de la table, conformément au suivi manuel validé.

L’assistance complète à la répartition des quinze points peut être différée si son coût empêche la première tranche jouable ; la modification manuelle et les contrôles de plafond restent alors disponibles.

---

# 19. Permissions

## 19.1 Principe

**[RECOMMANDATION TECHNIQUE]**

Les contrôles utilisent les méthodes publiques de permission des Documents, par exemple `testUserPermission` ou `canUserModify`, selon l’action.

Ils sont appliqués :

- dans le rendu ;
- dans le gestionnaire ;
- juste avant toute écriture.

## 19.2 Matrice fonctionnelle

| Action | Observateur | Propriétaire | MJ |
|---|---:|---:|---:|
| Voir une fiche autorisée par Foundry | selon ownership | oui | oui |
| Modifier l’identité | non | oui | oui |
| Modifier Compétences et Talents | non | oui | oui |
| Modifier Blessures et Stress | non | oui | oui |
| Modifier le Destin manuellement | non | oui | oui |
| Gérer les spécialisations | non | oui | oui |
| Gérer les Items embarqués | non | oui | oui |
| Gérer jauge et cases | non | oui | oui |
| Lancer un jet D100 | non | oui | oui |
| Lancer ou relancer l’initiative | non | oui | oui |
| Lancer des dégâts après réussite | non | oui | oui |
| Forcer les dégâts après échec | non | non | oui |
| Voir le détail secret du Destin | non | non | oui |
| Modifier les settings mondiaux | non | non | oui |
| Exécuter une migration mondiale | non | non | oui |

## 19.3 Propriétaires multiples

Les permissions Foundry réelles font autorité.

Le système ne suppose pas qu’un Actor possède un seul propriétaire.

Le risque de double action est couvert par les tests multijoueurs.

---

# 20. Hooks et cycle de vie

## 20.1 `init`

Responsabilités :

- enregistrer les TypeDataModels ;
- enregistrer les classes Document si nécessaires ;
- enregistrer les feuilles ;
- enregistrer les settings ;
- configurer les ressources de Token uniquement si validées ;
- exposer une API système minimale si un besoin public est décidé.

Aucune migration mondiale n’est exécutée dans `init`.

## 20.2 `ready`

Responsabilités :

- vérifier la version de schéma ;
- désigner un seul MJ actif pour proposer une migration ;
- afficher les alertes de configuration ;
- initialiser les intégrations facultatives.

Un joueur ne lance jamais une migration.

## 20.3 `renderChatMessageHTML`

Responsabilités :

- reconnaître les cartes `interface` ;
- filtrer ou masquer les actions selon l’utilisateur ;
- attacher les gestionnaires ;
- ne pas recalculer le résultat ;
- ne pas révéler de payload secret.

## 20.4 Hooks Documents

Les hooks de création ou mise à jour ne doivent pas dupliquer les actions déjà réalisées par les services.

Aucune mise à jour automatique en boucle ne doit être introduite pour recalculer des données dérivées.

## 20.5 Socket

**[RECOMMANDATION TECHNIQUE]**

```text
socket: absent
```

Aucun message socket n’est nécessaire au périmètre actuel.

Un socket ne sera ajouté qu’après preuve d’un besoin multijoueur non couvert par les opérations de Document ou les ChatMessages.

---

# 21. Flags et identifiants persistants

## 21.1 Namespace

```text
flags.interface
```

## 21.2 Clé initiale

```text
flags.interface.card
```

Elle est réservée aux cartes de chat.

## 21.3 Interdictions

Le système ne doit pas utiliser les flags comme duplication des données de l’Actor ou de l’Item.

Ne doivent pas être stockés en flags d’Actor :

- Compétences ;
- Talents ;
- Blessures ;
- Stress ;
- Destin ;
- progression ;
- équipement.

Ces données appartiennent aux DataModels.

## 21.4 Version des données de chat

Chaque carte contient :

```text
schema: 1
```

Le renderer doit refuser proprement une version inconnue et afficher un message dégradé plutôt que produire une action erronée.

---

# 22. Dice So Nice

## 22.1 Statut

**[EXIGENCE VALIDÉE]**

Dice So Nice est facultatif.

Le système doit fonctionner complètement lorsque le module est absent ou désactivé.

## 22.2 Couche d’intégration

**[RECOMMANDATION TECHNIQUE]**

Toute logique Dice So Nice est isolée dans :

```text
scripts/integrations/dice-so-nice.mjs
```

Le moteur D100, la persistance et les cartes ne dépendent pas de ce fichier.

## 22.3 Résultat naturel et résultat définitif

Le besoin souhaité est :

- conserver les valeurs naturelles dans les données ;
- montrer le résultat définitif lorsque le Destin intervient ;
- éviter une double animation ;
- ne jamais modifier la règle pour satisfaire l’animation.

## 22.4 Réserve

**[RÉSERVE DE FAISABILITÉ]**

L’API exacte et le moment d’interception doivent être prototypés sur la version active de Dice So Nice compatible V14.365.

Aucune signature d’API tierce n’est figée dans cette architecture.

Si le prototype ne permet pas d’afficher proprement le résultat définitif sans altérer la donnée naturelle :

- le système conserve le fonctionnement natif ;
- la carte affiche clairement le résultat définitif ;
- l’intégration est déclarée partielle ;
- aucune dépendance n’est ajoutée au manifeste.

---

# 23. Stratégie de migrations internes

## 23.1 Portée

**[EXIGENCE VALIDÉE]**

La stratégie couvre uniquement les évolutions internes de `interface`.

Elle ne couvre aucune donnée Roll20.

## 23.2 Version de schéma

Setting caché :

```text
interface.schemaVersion
```

Valeur initiale avant première migration :

```text
0
```

Version du premier schéma installé :

```text
1
```

La version du package et la version du schéma sont distinctes.

## 23.3 Deux niveaux

### Migration de forme locale

`TypeDataModel.migrateData` traite :

- renommage d’un champ ;
- coercition d’une valeur ;
- adaptation locale d’un Actor ou Item.

Elle doit rester sûre pour une donnée source complète comme pour un delta de mise à jour.

### Migration mondiale orchestrée

Un service dédié traite :

- changements sémantiques ;
- plusieurs Documents liés ;
- settings ;
- normalisation en lot ;
- rapport de migration.

## 23.4 Autorité d’exécution

Un seul MJ actif exécute la migration.

Règle proposée :

- seuls les MJ actifs sont candidats ;
- l’identifiant utilisateur trié en premier devient l’autorité temporaire ;
- les autres MJ n’exécutent rien ;
- un verrou de setting ou une vérification de version empêche une double exécution.

Cette stratégie doit être testée avec deux MJ connectés.

## 23.5 Propriétés obligatoires

Chaque migration est :

- numérotée ;
- ordonnée ;
- idempotente ;
- journalisée ;
- testée sur copie ;
- interrompable sur erreur ;
- sans suppression silencieuse ;
- accompagnée d’un bilan.

## 23.6 Données destructives

Une migration destructive exige une décision spécifique.

Par défaut :

1. copier vers la nouvelle structure ;
2. conserver temporairement l’ancienne donnée lorsqu’elle ne nuit pas ;
3. vérifier le monde ;
4. supprimer ultérieurement dans une migration distincte et validée.

## 23.7 ChatMessages

Les anciennes cartes utilisent leur `schema`.

La stratégie privilégiée est une compatibilité de rendu limitée plutôt qu’une réécriture massive du chat.

Une migration de ChatMessages ne sera créée que si une action persistée ne peut plus fonctionner autrement.

## 23.8 Sauvegarde et retour arrière

Avant migration d’un monde existant :

- arrêt des joueurs ;
- sauvegarde complète des User Data ou du monde ;
- duplication du monde si possible ;
- exécution sur copie ;
- contrôle ;
- restauration de la sauvegarde en cas d’échec.

Le code ne doit jamais présenter une migration comme réversible sans sauvegarde réelle.

---

# 24. Organisation des fichiers

## 24.1 Arborescence cible

```text
interface/
├── system.json
├── scripts/
│   ├── interface.mjs
│   ├── config.mjs
│   ├── constants.mjs
│   ├── data/
│   │   ├── character-data.mjs
│   │   ├── equipment-data.mjs
│   │   └── fields.mjs
│   ├── documents/
│   │   ├── interface-actor.mjs
│   │   └── interface-item.mjs
│   ├── rules/
│   │   ├── derived-values.mjs
│   │   └── d100/
│   │       ├── qualify-natural.mjs
│   │       ├── select-raw.mjs
│   │       ├── resolve-destiny.mjs
│   │       ├── qualify-final.mjs
│   │       ├── compute-margin.mjs
│   │       └── resolve-d100.mjs
│   ├── services/
│   │   ├── roll-service.mjs
│   │   ├── damage-service.mjs
│   │   ├── initiative-service.mjs
│   │   ├── permission-service.mjs
│   │   └── weapon-snapshot-service.mjs
│   ├── applications/
│   │   ├── character-sheet.mjs
│   │   ├── equipment-sheet.mjs
│   │   └── interface-settings-application.mjs
│   ├── chat/
│   │   ├── chat-message-service.mjs
│   │   └── chat-card-controller.mjs
│   ├── settings/
│   │   └── register-settings.mjs
│   ├── integrations/
│   │   └── dice-so-nice.mjs
│   └── migrations/
│       ├── index.mjs
│       └── schema-1.mjs
├── templates/
│   ├── actor/
│   │   └── character-sheet.hbs
│   ├── item/
│   │   └── equipment-sheet.hbs
│   ├── settings/
│   │   └── interface-settings.hbs
│   └── chat/
│       ├── d100-result.hbs
│       ├── d100-gm-detail.hbs
│       ├── weapon-selector.hbs
│       ├── damage-result.hbs
│       └── initiative.hbs
├── styles/
│   └── interface.css
├── lang/
│   └── fr.json
└── tests/
    ├── unit/
    ├── fixtures/
    └── protocols/
```

## 24.2 Point d’entrée

`scripts/interface.mjs` est le seul ES module chargé par le manifeste.

Il importe les composants et enregistre les hooks.

## 24.3 Frontières

```text
rules
→ aucune dépendance DOM ou Foundry Document

data
→ schémas et préparation

documents
→ intégration Actor/Item

services
→ orchestration et effets de bord

applications
→ interaction et rendu de feuilles

chat
→ projections et actions ChatMessage

integrations
→ modules facultatifs

migrations
→ transformations versionnées
```

## 24.4 Fichiers non créés en V1

Aucun dossier `packs/`, `assets/`, `socket/` ou `api/` n’est créé tant qu’il n’a pas une responsabilité réelle.

---

# 25. API système publique

## 25.1 Position initiale

**[RECOMMANDATION TECHNIQUE]**

Aucune API publique stable n’est promise en V1.

Les feuilles et services internes peuvent utiliser un namespace privé au package, sans garantie externe.

## 25.2 Évolution

Une API exposée sous `game.interface` ou `game.system.api` constituerait un contrat public.

Elle ne sera créée qu’après définition :

- des méthodes ;
- des entrées ;
- des sorties ;
- des permissions ;
- des erreurs ;
- de la stabilité ;
- de la compatibilité.

---

# 26. Stratégie de tests

## 26.1 Niveaux de preuve

Le projet distinguera :

```text
code écrit
analyse statique
test unitaire
test isolé avec adaptateur
test dans Foundry
test MJ
test joueur
test multijoueur
test monde neuf
test monde existant
test de migration
validation fonctionnelle
candidate
publication
```

Aucun niveau ne remplace le suivant.

## 26.2 Tests unitaires du moteur D100

Les cas T01 à T20 de la phase 00A sont repris comme base obligatoire.

Couverture supplémentaire :

- bornes `1`, `2`, `5`, `6`, `95`, `96`, `98`, `99`, `100` ;
- doubles réussis et échoués ;
- super-critiques ;
- priorité des automatiques ;
- avantage entre qualités différentes ;
- désavantage entre qualités différentes ;
- départage numérique à qualité égale ;
- dé écarté non réutilisé ;
- seuil négatif ;
- seuil nul ;
- seuil `5` ;
- seuil supérieur à `100` sans clamp ;
- Destin insuffisant ;
- Destin exactement suffisant ;
- seuil double lors de la correction ;
- critique cassé vers le bas ;
- critique cassé vers le haut ;
- réserve au plafond ;
- gain `0` ;
- plafond `0` ;
- chance `0` ;
- chance `100` ;
- minimum critique `0` ;
- marges inférieures à dix ;
- marges multiples de dix ;
- invariance des entrées.

## 26.3 Tests des valeurs dérivées

- toutes les associations fixes ;
- arrondi par `floor` ;
- plafond `99` ;
- configuration personnalisée désactivée ;
- nom vide ;
- Compétences dupliquées ;
- Talents dupliqués ;
- clés inconnues ;
- configuration complète ;
- conservation après désactivation ;
- initiative avec Distance aux bornes d’arrondi.

## 26.4 Tests des DataModels

- création d’un Actor minimal ;
- création d’un Item minimal ;
- valeur initiale ;
- Compétence `-1`, `0`, `100`, `101` ;
- Talent `-1`, `0`, `30`, `31` ;
- Blessure et Stress hors bornes ;
- quantité `0` ;
- HTML assaini ;
- conversion de catégorie sans suppression de formule ;
- sauvegarde et rechargement.

## 26.5 Tests des settings

- valeurs par défaut ;
- permission MJ ;
- refus joueur ;
- validation croisée personnalisée ;
- changement de coefficient ;
- réduction du plafond de Destin ;
- annulation de la réduction ;
- lot d’Actors concernés ;
- cohérence après rechargement.

## 26.6 Tests des cartes de chat

- carte normale ;
- avantage ;
- désavantage ;
- Destin absent ;
- Destin testé sans intervention ;
- Destin intervenu ;
- absence de secret dans HTML public ;
- absence de secret dans flags publics ;
- détail MJ inaccessible au joueur ;
- ancienne carte réaffichée ;
- type ou schema inconnu ;
- Actor supprimé ;
- Item supprimé ;
- permission retirée après création ;
- bouton réutilisé ;
- plusieurs clics rapides.

## 26.7 Tests des dégâts

- aucune arme ;
- arme sans formule ;
- formule invalide ;
- formule valide ;
- dégâts normaux ;
- dégâts maximum ;
- critique ;
- super-critique ;
- échec joueur ;
- échec MJ ;
- snapshot après modification de l’Item ;
- aucun Actor cible modifié ;
- aucune application automatique de Blessures.

## 26.8 Tests d’initiative

- propriétaire ;
- MJ ;
- non-propriétaire ;
- premier jet ;
- relance ;
- bonus exact ;
- absence de malus d’état ;
- Combatant sans Actor ;
- égalité ;
- ordre décroissant ;
- modification manuelle par le MJ.

## 26.9 Tests multijoueurs

Configuration minimale :

```text
1 MJ
1 joueur propriétaire
1 joueur non propriétaire
```

Configuration de risque :

```text
2 MJ actifs
2 clients propriétaires du même Actor
```

Scénarios :

- jet simultané ;
- double clic ;
- mise à jour concurrente du Destin ;
- migration avec deux MJ ;
- action de chat au même instant ;
- retrait d’ownership pendant l’affichage.

## 26.10 Tests Dice So Nice

- module absent ;
- module désactivé ;
- module actif ;
- jet normal ;
- avantage ;
- désavantage ;
- Destin sans intervention ;
- Destin avec intervention ;
- résultat naturel conservé ;
- résultat définitif affiché ;
- absence de double animation ;
- erreur du module sans rupture du jet.

## 26.11 Tests de migration

- monde neuf ;
- monde clone ;
- `schemaVersion = 0` ;
- migration `0 → 1` ;
- deuxième exécution sans changement ;
- erreur sur un Document ;
- rapport incomplet ;
- deux MJ ;
- sauvegarde ;
- restauration.

---

# 27. Protocole Foundry minimal pour l’utilisateur

Après production du code, l’utilisateur devra tester sur Foundry VTT 14.365.

## 27.1 Monde neuf

1. installer le système localement ;
2. créer un monde de test vide ;
3. ouvrir en MJ ;
4. vérifier l’absence d’erreur console ;
5. créer un Actor `character` ;
6. fermer et rouvrir la fiche ;
7. recharger le monde ;
8. vérifier la persistance ;
9. créer un Item `equipment` ;
10. l’embarquer dans l’Actor ;
11. tester les jets ;
12. tester l’initiative ;
13. tester le chat ;
14. tester les settings.

## 27.2 Joueur

1. créer un utilisateur joueur ;
2. donner OWNER sur un Actor ;
3. vérifier les actions autorisées ;
4. vérifier les actions interdites ;
5. retirer OWNER ;
6. vérifier que les anciens boutons de chat ne contournent pas la permission.

## 27.3 Multijoueur

1. ouvrir deux navigateurs ;
2. connecter MJ et joueur ;
3. lancer simultanément ;
4. contrôler le Destin final ;
5. répéter avec deux propriétaires ;
6. relever toute divergence ou écrasement.

Les résultats attendus détaillés seront produits avec chaque tranche de développement.

---

# 28. Ordre de développement recommandé après validation

## Tranche 1 — Squelette installable

- `system.json` ;
- point d’entrée ;
- langue française ;
- settings ;
- TypeDataModels ;
- Actor et Item minimaux ;
- feuilles minimales ;
- test d’installation V14.365.

## Tranche 2 — Données et dérivés

- six Compétences ;
- dix-huit Talents ;
- états ;
- valeurs dérivées ;
- création souple ;
- équipement embarqué ;
- tests de persistance.

## Tranche 3 — Moteur D100

- fonctions pures ;
- T01 à T20 ;
- adaptateur Roll ;
- Destin ;
- écriture Actor ;
- tests unitaires.

## Tranche 4 — Chat et dégâts

- projections publique/MJ ;
- cartes ;
- snapshots d’armes ;
- dégâts normaux et maximum ;
- permissions ;
- tests joueur/MJ.

## Tranche 5 — Initiative et progression

- initiative native ;
- progression ;
- assistants proportionnés ;
- tests d’égalité et de permissions.

## Tranche 6 — Intégrations et robustesse

- prototype Dice So Nice ;
- tests multijoueurs ;
- migrations ;
- documentation ;
- candidate interne.

Chaque tranche doit rester testable et produire un commit cohérent.

---

# 29. Risques et limites

## 29.1 Risques structurants

- écrasement concurrent du Destin ;
- fuite d’un secret par des flags publics ;
- comportement variable des égalités d’initiative ;
- formules de dégâts avancées ;
- API tierce Dice So Nice ;
- anciennes cartes après changement de schéma ;
- perte de données lors d’une réduction du plafond ;
- confusion entre carte de chat et source de vérité.

## 29.2 Mesures prévues

- moteur pur ;
- service d’écriture unique ;
- projections séparées ;
- aucune donnée secrète publique ;
- pas d’API protégée ;
- snapshots de dégâts ;
- version de carte ;
- migration idempotente ;
- tests multijoueurs ;
- intégration tierce isolée ;
- sauvegarde avant migration.

## 29.3 Limites assumées de V1

- pas de verrou distribué ;
- pas de socket ;
- pas d’import ;
- pas de combat automatisé ;
- pas d’API publique ;
- pas de compendium final ;
- pas de garantie V15 ;
- présentation visuelle encore à concevoir ;
- Dice So Nice non garanti avant prototype.

---

# 30. Sources officielles vérifiées

Consultation : 5 août 2026.

## Foundry VTT

- Release V14.365 : `https://foundryvtt.com/releases/14.365`
- Documentation API V14 : `https://foundryvtt.com/api/v14/`
- Schéma du manifeste système : `https://foundryvtt.com/api/v14/interfaces/foundry.packages.types.SystemManifestData.html`
- Gestion et compatibilité des packages : `https://foundryvtt.com/article/package-management/`
- Introduction au développement de système : `https://foundryvtt.com/article/system-development/`
- System Data Models : `https://foundryvtt.com/article/system-data-models/`
- Feuilles V14 : `https://foundryvtt.com/api/v14/modules/foundry.applications.sheets.html`
- Settings : `https://foundryvtt.com/api/v14/classes/foundry.helpers.ClientSettings.html`
- ChatMessage : `https://foundryvtt.com/api/v14/classes/foundry.documents.ChatMessage.html`
- Hook de rendu du chat : `https://foundryvtt.com/api/v14/functions/hookEvents.renderChatMessageHTML.html`
- Actor : `https://foundryvtt.com/api/v14/classes/foundry.documents.Actor.html`
- Combat : `https://foundryvtt.com/api/v14/classes/foundry.documents.Combat.html`
- Roll : `https://foundryvtt.com/api/v14/classes/foundry.dice.Roll.html`
- Migrations : `https://foundryvtt.com/article/migration/`

## Dice So Nice

- Page officielle Foundry : `https://foundryvtt.com/packages/dice-so-nice/`

La documentation tierce exacte devra être revérifiée lors du prototype.

---

# 31. Décisions rendues par la validation de ce document

La validation globale de cette architecture approuve notamment :

```text
Foundry cible                         : génération V14
Build initiale de développement/test   : 14.365
Compatibilité manifeste                : minimum 14 / verified 14 / maximum 14
Actor.type                            : character
Item.type                             : equipment
Catégories                            : ordinary | weapon
Roll20                                : aucun import
Settings namespace                    : interface
Flags namespace                       : interface
Flag de carte                         : flags.interface.card
Version initiale de carte             : 1
Version initiale de schéma            : 1
Version initiale du package           : 0.1.0
Socket                                : absent en V1
Dice So Nice                          : facultatif
Détail secret du Destin               : jamais dans le message public
Signal public du Destin                : halo discret + détail brut/correction/final au survol
Spécialisations                       : texte multiligne
Compétences                           : entiers de 0 à 100
Seuil D100                            : non clampé à 100
Inventaire                            : Items embarqués
Zone Armes                            : projection des Items weapon
Ancienne carte de réussite            : snapshot d’armes
Échec forcé par le MJ                 : armes actuelles au moment du clic
Décocher une case de progression      : ne retire pas automatiquement les gains
Égalités d’initiative                 : arbitrage MJ, pas d’override protégé
Migrations                            : internes à Foundry uniquement
API publique                          : aucune promesse en V1
```

---

# 32. Clôture de la phase 02

L’utilisateur a validé cette architecture le 5 août 2026 avec les arbitrages consolidés suivants :

- compatibilité déclarée à la génération V14, avec `14.365` comme environnement initial de développement et de test ;
- aucun import Roll20 ;
- intervention du Destin signalée publiquement par un halo discret et détaillable au survol, sans révéler le test secret ;
- Compétences bornées absolument de `0` à `100`, sans clamp du seuil D100.

Les recommandations techniques structurantes deviennent des décisions de projet. Les réserves de faisabilité restent explicitement ouvertes jusqu’aux prototypes et tests correspondants.

La validation de phase 02 autorise la Tranche 1.

Elle n’autorise pas :

- une publication ;
- une migration d’un monde réel ;
- une release ;
- une soumission au catalogue ;
- une modification de règle métier.

---

# 33. État des preuves au moment de la rédaction

```text
Règles fonctionnelles lues             : oui
Archive et base Git identifiées         : oui
Documentation officielle V14 vérifiée   : oui
Architecture rédigée                    : oui
Code écrit                              : non
Analyse syntaxique de code système      : non applicable
Tests unitaires                         : non
Test dans Foundry 14.365                : non
Test MJ                                 : non
Test joueur                             : non
Test multijoueur                        : non
Test monde neuf                         : non
Test monde existant                     : non
Test de migration                       : non
Prototype Dice So Nice                  : non
Validation fonctionnelle architecture   : oui — utilisateur, 5 août 2026
Publication                             : non
```
