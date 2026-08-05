# Protocole de test — Phase 03, Tranche 2

**Système :** D100 Interface  
**Version locale :** `0.1.0`  
**Foundry VTT :** `14.365`  
**Statut :** candidate en attente de test utilisateur

# 1. Redémarrage Foundry

Après avoir remplacé `Data/systems/interface/` par le dossier `interface/` de l’archive :

1. ferme le monde ;
2. quitte complètement Foundry VTT ;
3. relance Foundry VTT 14.365 ;
4. rouvre le monde utilisé pour la Tranche 1 ;
5. ouvre la console avec `F12`.

Un simple `F5` ou `Shift+F5` n’est pas suffisant pour cette candidate, car les scripts, le `TypeDataModel`, les données dérivées et les feuilles ont changé.

---

## T1 — Conservation des données de la Tranche 1

Ouvre l’Actor et l’Item utilisés pendant les tests de la Tranche 1.

**Résultat attendu :**

- les deux Documents s’ouvrent sans erreur ;
- leurs données persistées sont toujours présentes ;
- aucune migration ni perte de donnée n’est signalée ;
- aucune erreur rouge ne cite `systems/interface/` ;
- la console affiche `D100 Interface | Initialisation de la Tranche 2`.

---

## T2 — Valeurs dérivées fixes

Crée un Actor nommé `Personnage Tranche 2`.

Saisis les Compétences :

```text
Carrure    : 40
Agilité    : 30
Perception : 50
Mental     : 30
Intellect  : 20
Charisme   : 40
```

Saisis les Talents :

```text
Endurance                 : 10
Force brute               : 10
Robustesse                : 10
Agilité corporelle        : 10
Précision                 : 10
Réflexe                   : 10

Acuité sensorielle        : 5
Sixième sens              : 5
Vigilance                 : 5
Décision                  : 5
Détermination             : 5
Équilibre mental          : 5

Créativité                : 0
Érudition                 : 0
Logique                   : 0
Aura                      : 0
Communication expressive : 0
Persuasion                : 0
```

Enregistre la fiche.

**Résultat attendu :**

```text
Corps à corps      : 45
Distance           : 45
Verbal             : 30
Bonus d’initiative : +5
```

Les formules détaillées ne sont pas affichées. Aucun jet n’est déclenché.

---

## T3 — Blessures, Stress et malus d’état

Sur le même Actor, saisis :

```text
Blessures : 4
Stress    : 7
```

Enregistre.

**Résultat attendu :**

```text
Niveau de Blessures : 2
Niveau de Stress    : 3
Coefficient mondial : 3
Malus d’état        : 15
```

Clique ensuite sur le bouton `−` de Blessures.

**Résultat attendu :**

```text
Blessures            : 3
Niveau de Blessures  : 1
Malus d’état         : 12
```

Clique sur le bouton `+` de Blessures.

**Résultat attendu :**

```text
Blessures            : 4
Niveau de Blessures  : 2
Malus d’état         : 15
```

Les boutons `−` et `+` enregistrent la modification. Ils ne déclenchent aucune conséquence narrative, aucun jet et aucune modification du Destin.

---

## T4 — Arrondi inférieur et plafond des dérivés

Sur le même Actor, remplace temporairement :

```text
Carrure : 41
Agilité : 30
```

Conserve les six Talents associés à Carrure et Agilité à `10`, puis enregistre.

**Résultat attendu :**

```text
Corps à corps : 45
```

Le total mathématique intermédiaire vaut `45,5` et doit être arrondi vers le bas.

Teste ensuite :

```text
Carrure : 100
Agilité : 100

Endurance          : 30
Force brute        : 30
Robustesse         : 30
Agilité corporelle : 30
Précision          : 30
Réflexe            : 30
```

Enregistre.

**Résultat attendu :**

```text
Corps à corps : 99
```

La valeur dérivée est plafonnée à `99`.

À la fin de T4, restaure les valeurs de T2 et enregistre.

---

## T5 — Changement du coefficient mondial

Laisse la fiche Actor ouverte avec :

```text
Blessures : 4
Stress    : 7
```

Ouvre **Configuration D100 Interface** et remplace le coefficient de malus d’état par `4`. Enregistre les settings.

**Résultat attendu :**

- la fiche Actor ouverte se met à jour sans `F5` ;
- le malus d’état passe de `15` à `20` ;
- les niveaux restent `2` et `3`.

Restaure ensuite le coefficient à `3`.

**Résultat attendu :**

- le malus revient à `15` sans rechargement manuel.

---

## T6 — Valeur dérivée personnalisée

Dans **Configuration D100 Interface**, active la valeur personnalisée avec :

```text
Nom : Sang-froid

Compétences :
- Carrure
- Intellect

Talents :
- Endurance
- Force brute
- Robustesse
- Créativité
- Érudition
- Logique
```

Enregistre.

**Résultat attendu :**

- la fiche Actor ouverte affiche `Sang-froid : 35` ;
- aucun `F5` n’est nécessaire ;
- la valeur est plafonnée comme les dérivés fixes ;
- aucun jet n’est disponible.

Désactive ensuite la valeur personnalisée sans effacer sa configuration et enregistre.

**Résultat attendu :**

- la carte `Sang-froid` disparaît de la fiche ;
- en rouvrant les settings, son nom et ses sélections sont toujours conservés.

---

## T7 — Création souple et avertissements

Avec les valeurs restaurées de T2, le total des Talents vaut `90`.

**Résultat attendu :**

- la répartition des six Compétences est reconnue comme recommandée ;
- un avertissement indique qu’il reste `10` points de Talents ;
- l’avertissement ne bloque pas l’enregistrement.

Clique sur **J’ai pris connaissance**.

**Résultat attendu :**

- l’avertissement est masqué pour cette répartition dans cette fiche ;
- aucune donnée supplémentaire n’est enregistrée dans l’Actor.

Change ensuite `Carrure` de `40` à `39` et enregistre.

**Résultat attendu :**

- un nouvel avertissement apparaît pour la répartition des Compétences ;
- l’ancien acquittement ne masque pas ce nouvel état.

Restaure `Carrure` à `40`, puis passe `Agilité corporelle` de `10` à `20` afin d’obtenir un total de Talents égal à `100`. Enregistre.

**Résultat attendu :**

- aucun avertissement de création n’est affiché ;
- le total indique `100 / 100`.

---

## T8 — Création d’Items embarqués depuis la fiche

Dans la section Inventaire, clique sur **Ajouter un objet**.

**Résultat attendu :**

- un Item embarqué nommé `Nouvel objet` est créé ;
- sa fiche s’ouvre ;
- sa catégorie initiale est `Objet ordinaire`.

Renomme-le `Lampe embarquée`, mets la quantité à `2`, enregistre et ferme.

Clique ensuite sur **Ajouter une arme**.

**Résultat attendu :**

- un Item embarqué nommé `Nouvelle arme` est créé ;
- sa catégorie initiale est `Arme`.

Renomme-le `Couteau`, saisis `1d6` comme formule de dégâts, enregistre et ferme.

**Résultat attendu sur la fiche Actor :**

- l’Inventaire contient `Lampe embarquée` et `Couteau` ;
- la zone Armes contient uniquement `Couteau` ;
- `Couteau` reste également visible dans l’Inventaire ;
- cliquer sur le nom d’un Item ouvre sa fiche embarquée.

---

## T9 — Glisser-déposer et indépendance de la copie embarquée

Crée dans la barre latérale un Item monde nommé `Copie source`, catégorie `Objet ordinaire`.

Glisse cet Item sur la fiche de `Personnage Tranche 2`.

**Résultat attendu :**

- une copie apparaît dans l’Inventaire de l’Actor ;
- l’Item monde reste présent dans la barre latérale.

Ouvre la copie depuis l’Inventaire et renomme-la `Copie locale`. Enregistre.

**Résultat attendu :**

- l’Item embarqué s’appelle `Copie locale` ;
- l’Item monde s’appelle toujours `Copie source` ;
- les deux Documents sont indépendants.

---

## T10 — Changement de catégorie d’un Item embarqué

Ouvre `Lampe embarquée` depuis l’Inventaire et passe sa catégorie à `Arme`. Enregistre et ferme.

**Résultat attendu :**

- `Lampe embarquée` reste dans l’Inventaire ;
- elle apparaît aussi dans la zone Armes.

Repasse-la en `Objet ordinaire`, enregistre et ferme.

**Résultat attendu :**

- elle reste dans l’Inventaire ;
- elle disparaît de la zone Armes ;
- aucun champ `equipped`, `active` ou équivalent n’apparaît.

---

## T11 — Permissions joueur

Donne à un utilisateur joueur la permission **PROPRIÉTAIRE** sur `Personnage Tranche 2`, puis connecte-toi avec ce joueur.

**Résultat attendu :**

- le joueur peut ouvrir et modifier la fiche ;
- il peut utiliser les boutons Blessures/Stress ;
- il peut ouvrir les Items embarqués ;
- il peut ajouter un objet ou une arme à cet Actor.

Réduis ensuite sa permission à un niveau non propriétaire permettant encore la consultation, puis rouvre la fiche.

**Résultat attendu :**

- les contrôles d’ajout et de modification ne lui permettent plus de modifier l’Actor ;
- aucune erreur rouge ne cite `systems/interface/`.

Si tu ne testes pas cette seconde partie, indique précisément le niveau de permission testé.

---

## T12 — Persistance après redémarrage complet

Ferme le monde, quitte complètement Foundry, relance-le et rouvre le monde.

Ouvre `Personnage Tranche 2`.

**Résultat attendu :**

- les Compétences, Talents, Blessures et Stress sont conservés ;
- les valeurs dérivées sont recalculées avec les mêmes résultats ;
- le malus d’état est correct ;
- les Items embarqués sont toujours présents ;
- les armes apparaissent dans les deux zones prévues ;
- la configuration personnalisée désactivée est toujours conservée dans les settings ;
- aucune erreur rouge ne cite `systems/interface/`.

---

# Hors périmètre de ce protocole

Ne teste pas encore :

- les jets D100 ;
- le lancement réel de l’initiative ;
- le Destin opérationnel ;
- les cartes de chat ;
- les dégâts ;
- la progression ;
- la sauvegarde automatique générale des formulaires ;
- le design Roll20 ;
- la compatibilité V15.

# Format de retour

```text
T1 OK
T2 OK
T3 OK, mais…
T4 NON : …
T5 OK
T6 OK
T7 OK
T8 OK
T9 OK
T10 OK
T11 non testé
T12 OK
```

En cas d’échec, ajoute l’action exacte, le résultat observé et l’erreur complète de la console si elle existe.
