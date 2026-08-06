# Redémarrage Foundry

**Système :** D100 Interface  
**Version locale :** `0.1.0`  
**Foundry VTT ciblé :** `14.365`  
**Base source :** commit `0852b3f62fafd2f0128a5ad8e3170eb791aebe39`  
**Statut :** candidate ergonomique et assets par défaut — Tranche 3B

Les tests **T1 à T27 sont acquis**. Cette passe cible la nouvelle disposition de la fiche, la suppression sécurisée des équipements et le retrait des éléments de développement provisoires.

1. Ferme le monde.
2. Quitte complètement Foundry VTT.
3. Remplace `Data/systems/interface/` par le dossier `interface/` de la nouvelle archive.
4. Relance Foundry VTT 14.365.
5. Rouvre le monde de test.
6. Ouvre une fiche finalisée comme propriétaire, puis comme observateur.

# Tests

## T19 — Bloc Talents compact

Ouvre le bloc **Talents** sur une fiche finalisée.

**Résultat attendu :**

- aucun compteur `100 / 100` n’apparaît à droite du titre ;
- les six groupes restent lisibles et clairement séparés ;
- les trois Talents de chaque groupe sont plus rapprochés verticalement ;
- les champs numériques restent faciles à sélectionner ;
- le clic sur le nom d’un Talent ouvre toujours le pré-lancer ;
- l’ordre de tabulation validé en T17 reste inchangé.

## T20 — Section Armes autonome

Ouvre puis referme la section **Armes**.

Clique sur le petit bouton `+` placé à côté de son titre.

**Résultat attendu :**

- Armes est une section repliable indépendante de Combat ;
- son état de repli reste local à la fiche ouverte ;
- le survol du `+` indique **Ajouter une arme** ;
- le clic crée un nouvel Item de catégorie Arme et ouvre sa fiche ;
- l’arme apparaît uniquement dans la section Armes ;
- le bloc Combat et ses jets restent inchangés.

## T21 — Ajout depuis Inventaire et séparation des catégories

Clique sur le petit bouton `+` placé à côté du titre **Inventaire**.

Choisis d’abord **Ajouter un objet**, puis recommence et choisis **Ajouter une arme**.

**Résultat attendu :**

- une petite fenêtre demande quel type d’équipement ajouter ;
- l’objet ordinaire apparaît uniquement dans Inventaire ;
- l’arme apparaît uniquement dans Armes ;
- aucun Item n’est dupliqué visuellement ;
- les deux gros boutons d’ajout ont disparu ;
- aucun compteur d’objets n’apparaît dans le titre Inventaire.

## T22 — Textes secondaires retirés

Observe les titres **Spécialisations** et **Notes**.

**Résultat attendu :**

- « Une spécialisation par ligne » n’est plus affiché ;
- « Notes libres du joueur » n’est plus affiché ;
- les zones de texte restent présentes et sauvegardent leurs données comme avant.

## T23 — Respiration générale de la fiche

Observe l’ensemble de la fiche, puis réduis et agrandis légèrement la fenêtre.

**Résultat attendu :**

- les blocs ne touchent plus les bords gauche et droit de la fiche ;
- un pourtour clair régulier laisse respirer la composition ;
- l’identité, les sections repliables et la zone d’expérience restent alignées ;
- le défilement vertical reste utilisable ;
- la vue Observateur conserve la même marge et reste non interactive ;
- aucune erreur rouge ne cite `systems/interface/`.

## T24 — Portrait Actor par défaut

Depuis le répertoire des Actors, crée un nouveau personnage.

**Résultat attendu :**

- l’Actor est créé immédiatement avec la pré-fiche ;
- le portrait affiché est `assets/actor/avatar-default.webp` ;
- fermer puis rouvrir l’Actor conserve ce portrait ;
- choisir ensuite un autre portrait remplace normalement l’image par défaut ;
- aucune erreur rouge ne cite un chemin d’asset manquant.

## T25 — Image par défaut d’un objet

Depuis Inventaire, clique sur `+` puis choisis **Ajouter un objet**.

**Résultat attendu :**

- la fiche de l’objet s’ouvre avec `assets/items/item_default.webp` ;
- l’image apparaît à gauche du nom dans la fiche Item ;
- l’objet apparaît avec la même vignette dans Inventaire ;
- l’objet n’apparaît pas dans Armes.

## T26 — Image par défaut d’une arme

Depuis Armes, clique sur `+`.

**Résultat attendu :**

- la fiche de l’arme s’ouvre avec `assets/items/weapon_default.webp` ;
- l’image apparaît à gauche du nom dans la fiche Item ;
- l’arme apparaît avec la même vignette dans Armes ;
- l’arme n’apparaît pas dans Inventaire.

## T27 — Remplacement de l’image d’un équipement

Dans la fiche de l’objet ou de l’arme créée précédemment, clique sur son image et choisis un autre fichier.

**Résultat attendu :**

- le navigateur de fichiers Foundry s’ouvre ;
- l’image choisie remplace l’image par défaut sur l’Item ;
- la vignette correspondante se met à jour sur la fiche Actor après rerendu ;
- changer le nom, la quantité ou la formule de dégâts continue de s’enregistrer normalement ;
- aucun autre Item ne change d’image.

## T28 — Rappel des Compétences dans Talents

Ouvre le bloc **Talents** puis modifie une Compétence dans le bloc supérieur.

**Résultat attendu :**

- chaque titre affiche son score, par exemple `Carrure — 40` ;
- les six valeurs correspondent aux Compétences actuelles ;
- modifier une Compétence met à jour le rappel après le rerendu automatique ;
- les jets de Talent et l’ordre de tabulation restent inchangés.

## T29 — Combat sans sous-titre

Ouvre le bloc **Combat**.

**Résultat attendu :**

- le texte « Valeurs dérivées » a disparu du titre ;
- les cartes de Combat restent centrées, homogènes et cliquables ;
- les valeurs et pré-lancers restent inchangés.

## T30 — Suppression sécurisée d’un objet

Dans **Inventaire**, clique sur l’icône de suppression d’un objet existant.

**Résultat attendu :**

- une confirmation nomme l’objet concerné et précise que la suppression est irréversible ;
- choisir **Annuler** conserve l’objet ;
- recommencer puis choisir **Supprimer** retire définitivement l’Item ;
- aucun autre Item n’est modifié.

## T31 — Suppression sécurisée d’une arme

Dans **Armes**, répète le test précédent avec une arme.

**Résultat attendu :**

- la confirmation concerne la bonne arme ;
- l’annulation conserve l’arme ;
- la validation retire uniquement cette arme ;
- l’observateur ne voit aucun bouton de suppression.

## T32 — Inventaire épuré

Ouvre **Inventaire**.

**Résultat attendu :**

- le texte « Tu peux glisser un Item depuis… » n’est plus affiché ;
- le bouton `+`, les vignettes, les noms et les quantités restent fonctionnels ;
- le glisser-déposer d’un Item reste possible malgré le retrait du texte d’aide.

## T33 — Nouvelle disposition Identité

Observe le bloc supérieur en mode propriétaire puis observateur.

**Résultat attendu :**

- le portrait occupe la colonne gauche ;
- Nom et Profession sont superposés dans la colonne centrale ;
- Âge occupe la colonne droite sur toute la hauteur ;
- l’ensemble reprend la disposition du croquis sans cadre technique disgracieux ;
- l’édition et la lecture seule restent fonctionnelles.

## T34 — Bandeau Blessures / Initiative / Stress

Observe puis utilise le bandeau noir.

**Résultat attendu :**

- Blessures est à gauche avec son état et ses contrôles ;
- Initiative est centrée et séparée visuellement ;
- Stress est à droite, avec les contrôles avant son libellé ;
- les valeurs et états continuent de se mettre à jour ;
- la ligne « Développement / Malus d’état / Destin » et la section de développement provisoire ont disparu ;
- aucune donnée de Destin ou de malus n’a été effacée du personnage.

## T35 — Respiration renforcée et assets

Observe le pourtour de la fiche et ouvre la console.

**Résultat attendu :**

- la marge générale est visiblement plus large qu’en T23 ;
- tous les blocs restent alignés et accessibles ;
- aucun fichier PNG par défaut n’est demandé ;
- les portraits et équipements utilisent toujours les WebP ;
- aucune erreur rouge ne cite un asset manquant.

Réponse attendue :

```text
T28 OK
T29 OK
T30 OK
T31 OK
T32 OK
T33 OK
T34 OK
T35 OK
```
