# Protocole de test — Phase 03, Tranche 2B

## Environnement attendu

```text
Foundry VTT : 14.365
Système     : interface
Version     : 0.1.0
Monde       : monde de test utilisé pour les Tranches 1 et 2
Rôle        : MJ, sauf mention contraire
```

# 1. Redémarrage Foundry

Cette candidate modifie les classes de feuilles, les templates, la langue et le CSS.

1. Ferme le monde.
2. Quitte complètement Foundry VTT.
3. Remplace `Data/systems/interface/` par le dossier `interface/` du ZIP.
4. Relance Foundry VTT 14.365.
5. Rouvre le monde de test.
6. Ouvre la console avec `F12`.
7. Commence par T1.

---

## T1 — Chargement de la candidate

Ouvre le monde puis la fiche d’un Actor `character` déjà utilisé pendant la Tranche 2.

**Résultat attendu :**

- le monde se charge normalement ;
- la fiche s’ouvre sans erreur ;
- aucune erreur rouge ne cite `systems/interface/` ;
- les données précédemment enregistrées sont présentes ;
- la fiche possède la nouvelle organisation visuelle.

---

## T2 — Identité et groupes de Compétences

Observe le haut de la fiche.

**Résultat attendu :**

- Nom, Âge et Profession sont immédiatement accessibles ;
- les six Compétences sont disposées sur une même zone cohérente ;
- Carrure et Agilité utilisent le groupe rouge ;
- Perception et Mental utilisent le groupe jaune ;
- Intellect et Charisme utilisent le groupe bleu ;
- les valeurs restent lisibles et modifiables.

Réduis ensuite la largeur de la fenêtre.

**Résultat attendu :**

- la fiche se réorganise sans chevauchement majeur ;
- les champs restent accessibles.

---

## T3 — Bandeau Blessures / Initiative / Stress

Observe le bandeau noir situé sous les Compétences.

**Résultat attendu :**

- Blessures est à gauche ;
- Initiative est au centre ;
- Stress est à droite ;
- les boutons `−` et `+` fonctionnent ;
- la valeur brute et le niveau de Blessures ou Stress restent lisibles ;
- le bonus d’initiative est visible ;
- la ligne temporaire de développement affiche le malus d’état et le Destin.

Modifie Blessures ou Stress avec les boutons.

**Résultat attendu :**

- la nouvelle valeur est enregistrée ;
- le niveau et le malus sont recalculés ;
- la fiche ne remonte pas en haut.

---

## T4 — Enregistrement automatique des nombres et listes

Modifie successivement, sans cliquer sur **Enregistrer** :

1. une Compétence ;
2. un Talent ;
3. Blessures ou Stress avec une saisie directe ;
4. la jauge d’Expérience ;
5. une case d’Expérience.

Après chaque modification, ferme puis rouvre la fiche.

**Résultat attendu :**

- chaque valeur valide est conservée automatiquement ;
- les bornes validées restent appliquées ;
- aucune valeur invalide n’est persistée ;
- le bouton **Enregistrer** reste disponible comme secours mais n’est pas nécessaire.

---

## T5 — Enregistrement automatique des textes

Modifie successivement :

1. le Nom ;
2. l’Âge ;
3. la Profession ;
4. les Spécialisations ;
5. les Notes.

Pour chaque champ, saisis le texte puis clique dans une autre zone de la fiche sans utiliser le bouton **Enregistrer**. Ferme ensuite la fiche et rouvre-la.

**Résultat attendu :**

- le texte est enregistré lorsque le champ perd le focus ;
- toutes les modifications sont conservées ;
- aucune sauvegarde n’est déclenchée à chaque caractère pendant la frappe.

---

## T6 — Sections repliables

Teste les blocs suivants :

- Talents ;
- Combat ;
- Spécialisations ;
- Inventaire ;
- Notes ;
- Informations de développement.

Ouvre et ferme plusieurs blocs, puis modifie une valeur afin de provoquer un rerendu.

**Résultat attendu :**

- chaque bloc peut être ouvert ou fermé indépendamment ;
- son état ouvert ou fermé est conservé pendant le rerendu ;
- la position de défilement est conservée ;
- les informations de développement sont fermées par défaut à la première ouverture de la fiche.

---

## T7 — Talents et cohérence des couleurs

Ouvre le bloc **Talents**.

**Résultat attendu :**

- les dix-huit Talents sont présents ;
- chaque groupe de trois Talents reprend la couleur de sa Compétence ;
- les deux groupes liés à Carrure et Agilité sont rouges ;
- les deux groupes liés à Perception et Mental sont jaunes ;
- les deux groupes liés à Intellect et Charisme sont bleus ;
- les valeurs restent bornées de `0` à `30`.

Modifie un Talent puis quitte le champ.

**Résultat attendu :**

- la valeur est enregistrée automatiquement ;
- le total temporaire de création est mis à jour.

---

## T8 — Bloc Combat

Ouvre le bloc **Combat**.

**Résultat attendu :**

- Corps à corps, Distance et Verbal sont visibles ;
- leurs couleurs reprennent rouge, jaune et bleu ;
- la valeur personnalisée apparaît seulement lorsqu’elle est activée dans les settings ;
- les armes embarquées sont listées ;
- une arme peut être créée depuis ce bloc ;
- cliquer sur le nom d’une arme ouvre sa fiche ;
- aucun jet D100 ou jet de dégâts n’est encore déclenché.

---

## T9 — Spécialisations, Inventaire et Notes

Teste les trois blocs correspondants.

**Résultat attendu :**

- Spécialisations contient une zone de texte multiligne ;
- Inventaire affiche tous les Items embarqués ;
- les armes restent visibles dans Inventaire et dans Combat ;
- les boutons d’ajout d’objet et d’arme fonctionnent ;
- Notes contient une zone de texte destinée aux notes libres du joueur ;
- les données sont enregistrées automatiquement à la sortie du champ.

---

## T10 — Fiche Item et enregistrement automatique

Ouvre un Item embarqué, puis effectue les actions suivantes sans utiliser le bouton **Enregistrer** :

1. renomme l’Item puis quitte le champ ;
2. change sa catégorie ;
3. modifie sa quantité ;
4. pour une arme, modifie la formule de dégâts ;
5. modifie la description puis quitte le champ.

Ferme puis rouvre l’Item.

**Résultat attendu :**

- toutes les valeurs valides sont conservées ;
- passer à la catégorie Arme affiche la formule de dégâts ;
- repasser à Objet ordinaire masque la formule sans la supprimer ;
- la fiche Actor reflète les changements ;
- la position de défilement de la fiche Actor reste stable.

---

## T11 — Bandeau Expérience

Observe le bas de la fiche.

**Résultat attendu :**

- le bandeau Expérience n’est pas repliable ;
- la jauge permet de choisir `0`, `1`, `2` ou `3` ;
- trois cases existent pour une amélioration de Compétence ;
- trois cases existent pour une amélioration de Talents ;
- trois cases existent pour une nouvelle Spécialisation ;
- les neuf cases peuvent être cochées ou décochées librement ;
- aucune amélioration n’est appliquée automatiquement dans cette tranche.

Coche plusieurs cases, change la jauge, ferme puis rouvre la fiche.

**Résultat attendu :**

- la jauge et les neuf cases sont conservées.

---

## T12 — Persistance après redémarrage complet

Après les tests précédents :

1. ferme le monde ;
2. quitte complètement Foundry VTT ;
3. relance Foundry ;
4. rouvre le monde ;
5. rouvre l’Actor et un Item modifiés.

**Résultat attendu :**

- toutes les données modifiées sont conservées ;
- l’Actor et l’Item s’ouvrent normalement ;
- aucune erreur rouge ne cite `systems/interface/` ;
- la nouvelle présentation reste fonctionnelle.

---

## Éléments volontairement hors périmètre

L’absence des fonctionnalités suivantes est normale :

- moteur D100 ;
- Destin opérationnel ;
- jets d’initiative ;
- jets de dégâts ;
- assistant de création séparé ;
- application automatique des gains d’XP ;
- cartes de chat ;
- design visuel final ;
- compendium d’équipement ;
- compatibilité Foundry V15.

## Format de retour

```text
T1 OK
T2 OK, mais…
T3 NON : …
T4 OK
...
T12 OK
```


## Correctif 1 — Complément de test

### Action requise : **Shift+F5**

Remplacer le dossier du système puis faire `Shift+F5` dans le monde ouvert.

### T13 — Couleurs du bloc Combat et de l'Inventaire

Ouvre la fiche du personnage puis le bloc **Combat** et le bloc **Inventaire**.

**Résultat attendu :**

- le titre **Armes** est lisible en couleur sombre ;
- les noms des armes possédées sont lisibles en couleur sombre ;
- les noms des objets de l'inventaire sont lisibles en couleur sombre.

### T14 — Redimensionnement de la fiche

Tente de redimensionner la fenêtre de la fiche personnage, puis la fiche d'un objet.

**Résultat attendu :**

- la fiche Actor est redimensionnable ;
- la fiche Item est redimensionnable ;
- le contenu reste utilisable après redimensionnement.
