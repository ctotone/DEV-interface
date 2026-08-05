# Protocole utilisateur — Phase 03, Tranche 1

## Candidate

```text
Système : D100 Interface
Identifiant : interface
Version locale : 0.1.0
Foundry ciblé : 14.365
Compatibilité déclarée : minimum 14 / verified 14 / maximum 14
Statut : candidate de Tranche 1, non validée
```

Ce protocole vérifie uniquement le squelette installable. Il ne valide pas les jets D100, le Destin opérationnel, les dégâts, l’initiative, les cartes de chat, la progression assistée ou le design final.

---

## 1. Type de rechargement requis pour cette livraison

### Pour installer ou remplacer cette candidate

**Relancer totalement Foundry VTT.**

La livraison modifie le manifeste, le point d’entrée ES module, les TypeDataModels, les classes de Documents, les settings et l’enregistrement des feuilles. Un simple `F5` ou `Shift+F5` ne constitue donc pas un test fiable de cette candidate.

Procédure :

1. fermer le monde de test ;
2. quitter complètement Foundry VTT ;
3. remplacer le dossier du système ;
4. relancer Foundry VTT ;
5. rouvrir le monde de test.

### Repère pour les livraisons suivantes

| Fichiers modifiés | Action minimale indiquée |
|---|---|
| `system.json`, JavaScript, DataModels, classes, settings | redémarrage complet de Foundry |
| templates `.hbs`, CSS ou langue uniquement | `Shift+F5` dans le monde |
| aucune modification de fichier, simple vérification d’affichage | `F5` peut suffire |

Pour chaque future archive, GPT Foundry précisera de nouveau l’action adaptée.

---

## 2. Installation propre

1. Fermer complètement Foundry VTT.
2. Ouvrir le répertoire de données utilisateur de Foundry.
3. Aller dans `Data/systems/`.
4. Sauvegarder puis retirer tout ancien dossier `interface` utilisé pour les tests.
5. Décompresser l’archive livrée.
6. Copier son dossier racine `interface/` dans `Data/systems/`.
7. Vérifier le chemin exact :

```text
Data/systems/interface/system.json
```

Il ne doit pas exister de niveau supplémentaire tel que :

```text
Data/systems/interface/interface/system.json
```

8. Relancer Foundry VTT 14.365.

### Résultat attendu

Dans l’écran de configuration, **D100 Interface** apparaît parmi les systèmes installés avec la version `0.1.0`.

### En cas d’échec

Ne pas poursuivre. Relever :

- le message affiché par Foundry ;
- les erreurs de la console `F12` ;
- le chemin réel du dossier installé ;
- une capture de l’entrée du système si elle apparaît partiellement.

---

## 3. Création du monde de test

1. Créer un monde neuf nommé par exemple `Interface - Test Tranche 1`.
2. Choisir le système **D100 Interface**.
3. Lancer le monde avec un compte MJ.
4. Ouvrir la console avec `F12`.

### Résultats attendus

- le monde se charge ;
- aucune erreur rouge liée à `systems/interface/` n’apparaît ;
- la console contient le message :

```text
D100 Interface | Initialisation de la Tranche 1
```

Des avertissements généraux de Foundry ou d’autres modules ne comptent pas comme une erreur du système, sauf s’ils citent `interface` ou un fichier de cette archive.

---

## 4. Types de Documents disponibles

### Actor

1. Ouvrir l’onglet **Acteurs**.
2. Créer un Actor.
3. Observer la liste des types proposée.

Résultat attendu : le seul type fourni par le système est **Personnage** (`character`).

### Item

1. Ouvrir l’onglet **Objets**.
2. Créer un Item.
3. Observer la liste des types proposée.

Résultat attendu : le seul type fourni par le système est **Équipement** (`equipment`).

---

## 5. Fiche Personnage minimale

1. Créer un Actor `Personnage test`.
2. Ouvrir sa fiche.
3. Vérifier la présence des sections :
   - Identité ;
   - Compétences ;
   - Talents ;
   - Ressources ;
   - Notes.
4. Saisir :
   - âge : `32` ;
   - profession : `Enquêteur` ;
   - spécialisations : `Archives, filature` ;
   - Carrure : `40` ;
   - Agilité : `55` ;
   - Endurance : `12` ;
   - Réflexe : `18` ;
   - Blessures : `3` ;
   - Stress : `6` ;
   - Destin : `10` ;
   - une phrase dans Notes.
5. Cliquer sur **Enregistrer**.
6. Fermer puis rouvrir la fiche.

### Résultats attendus

- la fiche s’ouvre sans erreur ;
- les six Compétences sont présentes ;
- les dix-huit Talents sont présents ;
- toutes les valeurs saisies sont conservées ;
- aucun jet n’est déclenché en cliquant sur les libellés ou champs ;
- l’apparence reste volontairement simple et neutre.

---

## 6. Bornes des Compétences et Talents

### Valeurs limites acceptées

1. Mettre Carrure à `0`.
2. Mettre Agilité à `100`.
3. Mettre Endurance à `0`.
4. Mettre Réflexe à `30`.
5. Enregistrer, fermer et rouvrir.

Résultat attendu : les quatre valeurs limites sont conservées.

### Valeurs hors limites refusées

1. Tenter `101` dans une Compétence.
2. Tenter `31` dans un Talent.
3. Tenter une valeur négative.
4. Tenter une valeur décimale comme `12,5` ou `12.5`.

### Résultat attendu

Le formulaire ou la validation du DataModel empêche l’enregistrement de la valeur invalide. Après fermeture et réouverture, aucune valeur hors bornes ou non entière ne doit être persistée.

Noter précisément le comportement observé : blocage natif du navigateur, notification Foundry, remise à l’ancienne valeur ou autre réaction.

---

## 7. Ressources minimales

1. Vérifier que Blessures et Stress acceptent `0` et `15`.
2. Tenter `16` puis une valeur négative.
3. Vérifier que Destin accepte un entier positif.
4. Enregistrer et rouvrir.

### Résultats attendus

- Blessures et Stress restent bornés de `0` à `15` ;
- Destin reste un entier de minimum `0` ;
- aucun effet mécanique, malus ou jet de Destin n’est déclenché dans cette tranche.

---

## 8. Fiche Équipement minimale

### Objet ordinaire

1. Créer un Item `Lampe`.
2. Vérifier la catégorie initiale.
3. Saisir quantité `2` et une description.
4. Enregistrer, fermer et rouvrir.

Résultats attendus :

- la catégorie initiale est **Objet ordinaire** (`ordinary`) ;
- la quantité et la description sont conservées ;
- la quantité minimale est `1`.

### Arme

1. Passer la catégorie à **Arme** (`weapon`).
2. Enregistrer puis rouvrir.
3. Saisir la formule `1d6+1`.
4. Enregistrer puis rouvrir.

Résultats attendus :

- le champ de formule de dégâts apparaît pour une arme ;
- la catégorie et la formule sont persistées ;
- aucun jet de dégâts n’est possible dans cette tranche.

### Conservation lors du retour en objet ordinaire

1. Repasser l’Item en **Objet ordinaire**.
2. Enregistrer puis rouvrir.
3. Repasser en **Arme** et enregistrer si nécessaire pour rafraîchir la fiche.

Résultat attendu : la formule `1d6+1` n’a pas été supprimée silencieusement ; elle redevient visible lorsque l’Item est de nouveau une arme.

---

## 9. Settings mondiaux

1. Ouvrir **Configuration des paramètres** du monde.
2. Repérer **Configuration D100 Interface**.
3. Ouvrir le menu.

### Valeurs attendues à l’ouverture

```text
Coefficient de malus d’état : 3
Gain de Destin : 5
Plafond de Destin : 30
Probabilité de déclenchement : 80
Réserve critique minimale : 15
Valeur dérivée personnalisée : désactivée
```

### Persistance numérique

1. Saisir respectivement `4`, `6`, `40`, `75`, `20`.
2. Enregistrer.
3. Rouvrir le menu.

Résultat attendu : les cinq nouvelles valeurs sont conservées.

### Validation numérique

1. Tenter une valeur négative.
2. Tenter `101` pour la probabilité de déclenchement.

Résultat attendu : une notification française refuse la configuration et les valeurs invalides ne sont pas enregistrées.

### Valeur dérivée personnalisée

1. Activer l’option.
2. Donner le nom `Sang-froid`.
3. Sélectionner exactement deux Compétences.
4. Sélectionner exactement six Talents.
5. Enregistrer puis rouvrir.

Résultat attendu : la configuration est conservée.

Puis recommencer avec un nom vide, une seule Compétence ou cinq Talents.

Résultat attendu : une notification française refuse la configuration invalide.

### Valeurs recommandées

1. Cliquer sur **Charger les valeurs recommandées**.
2. Vérifier que le formulaire affiche `3 / 5 / 30 / 80 / 15` et désactive la valeur personnalisée.
3. Vérifier que son nom et ses sélections ne sont pas effacés.
4. Cliquer sur **Enregistrer les paramètres**.
5. Rouvrir le menu et réactiver la valeur personnalisée.

Résultat attendu : le bouton charge d’abord les valeurs numériques recommandées dans le formulaire ; elles ne deviennent persistantes qu’après l’enregistrement explicite. Désactiver la valeur personnalisée conserve sa configuration.

---

## 10. Permissions minimales du menu

1. Si un utilisateur joueur est disponible, se connecter avec ce compte.
2. Ouvrir les paramètres du monde.

Résultat attendu : le menu mondial **Configuration D100 Interface** est réservé au MJ et n’est pas modifiable par le joueur.

Ce test ne valide pas encore l’ensemble des permissions multijoueurs des Actors, Items, jets ou cartes.

---

## 11. Persistance après redémarrage complet

1. Fermer le monde.
2. Quitter totalement Foundry VTT.
3. Relancer Foundry VTT.
4. Rouvrir le monde.
5. Rouvrir l’Actor, l’Item et le menu de settings.

### Résultat attendu

Toutes les données valides enregistrées sont conservées après redémarrage.

---

## 12. Éléments volontairement absents

Ne pas signaler comme anomalie de Tranche 1 l’absence de :

- clics de jets D100 ;
- avantage ou désavantage ;
- Destin opérationnel ;
- calculs dérivés ;
- malus d’état ;
- initiative fonctionnelle ;
- progression assistée ;
- cartes de chat ;
- dégâts exécutables ;
- Dice So Nice ;
- design adapté de Roll20 ;
- éditeur de texte riche final ;
- migration d’un monde existant ;
- compatibilité V15.

L’initiative présente dans le manifeste correspond à l’architecture future, mais sa donnée dérivée n’est pas encore produite. Ne pas lancer de combat comme test fonctionnel de cette tranche.

---

## 13. Retour de test demandé

Pour chaque anomalie, fournir :

```text
Numéro du test :
Étape exacte :
Résultat observé :
Résultat attendu :
Erreur console complète :
Capture si utile :
Le problème persiste après redémarrage complet : oui / non
```

Pour valider la Tranche 1, confirmer au minimum :

```text
Installation : OK / KO
Ouverture du monde : OK / KO
Actor character : OK / KO
Item equipment : OK / KO
Persistance : OK / KO
Settings : OK / KO
Console sans erreur interface : OK / KO
Validation explicite de la Tranche 1 : OUI / NON
```
