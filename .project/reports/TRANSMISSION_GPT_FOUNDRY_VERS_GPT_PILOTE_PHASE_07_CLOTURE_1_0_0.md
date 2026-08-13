# Transmission GPT Foundry → GPT Pilote — Phase 07 — Clôture pré-1.0.0 / Release 1.0.0

## 1. Projet

```text
Projet DEV        : DEV-interface
Branche DEV       : main
Dernier hash DEV communiqué avant correctif final des assets :
e5796091dac6cf6f6991ca9e893faf4d6014c84e

Dépôt PROD        : https://github.com/ctotone/interface-ga
Branche PROD      : main
Hash PROD final communiqué :
665d698a686fcbd6d0d519390a9b7b5e5d9864bc

Version publiée   : 1.0.0
Tag               : 1.0.0
Release           : https://github.com/ctotone/interface-ga/releases/tag/1.0.0
Archive release   : interface-1.0.0.zip
Manifest install  : https://raw.githubusercontent.com/ctotone/interface-ga/refs/heads/main/system.json
Foundry testé     : V14.365
```

Le hash DEV ci-dessus est le dernier hash communiqué **avant** le correctif final des noms d’assets. Une archive DEV finale complète est fournie avec cette transmission ; son futur hash Git devra être ajouté après push utilisateur.

---

## 2. Résultat global de la Phase 07

La Phase 07 a abouti à une **release 1.0.0 installable depuis GitHub et validée sous Foundry**.

Validation utilisateur finale :

```text
Installation neuve depuis le manifeste distant : OK
Système Interface 1.0.0                       : OK
Background système                            : OK
Actor                                         : OK
Item                                          : OK
Jets D100                                     : OK
Compendium Objets                             : OK
Compendium Armes                              : OK
Compendium Manuel du joueur                   : OK
Images des compendiums                        : OK
Manuel du joueur / 8 pages                    : OK
```

Le système a été installé depuis :

```text
https://raw.githubusercontent.com/ctotone/interface-ga/refs/heads/main/system.json
```

L’utilisateur a confirmé que l’installation et les tests rapides post-installation sont corrects.

---

## 3. Identité publique finale

```text
ID technique      : interface
Nom affiché       : Système Interface
Version           : 1.0.0
Auteur            : Evilbram
Dépôt public      : https://github.com/ctotone/interface-ga
Bugs / Issues     : https://github.com/ctotone/interface-ga/issues
```

Background système :

```text
systems/interface/assets/system-background.webp
```

Le chemin initial `assets/system-background.webp` provoquait un 404 depuis la racine HTTP Foundry. Le chemin corrigé ci-dessus a été testé et validé.

---

## 4. Compendiums finaux

Les trois compendiums sont réactivés dans la 1.0.0 :

```text
interface.objects
→ Item
→ 60 entrées / 8 dossiers

interface.weapons
→ Item
→ 42 entrées / 3 dossiers

interface.manual
→ JournalEntry
→ 1 Journal / 8 JournalEntryPage
```

Déclaration du manuel :

```json
{
  "name": "manual",
  "label": "Manuel du joueur",
  "path": "packs/manual",
  "type": "JournalEntry",
  "system": "interface",
  "banner": "systems/interface/assets/banners/banniere_manuel.webp"
}
```

ID technique du pack :

```text
interface.manual
```

Journal source :

```text
Manuel du joueur
Journal ID : W6E3cLgBaV4cuhPU
Pages      : 8
```

Le manuel a été exporté depuis le monde DEV sans liens UUID/Compendium, ce qui a facilité sa conversion en source de pack.

---

## 5. Évolution du builder de compendiums

`tools/build-compendiums.mjs` a été étendu pour gérer désormais :

```text
objects
weapons
manual
```

Point technique important découvert pendant la phase : les `JournalEntryPage` d’un compendium LevelDB doivent être écrites comme Documents embarqués séparés, avec des clés du type :

```text
!journal.pages!<journalId>.<pageId>
```

Le premier essai écrivait les pages uniquement dans le JSON du parent ; Foundry affichait donc le JournalEntry mais sans ses pages. Le builder a été corrigé, puis le Manuel a été validé sous Foundry.

Sources d’autorité conservées :

```text
packs-src/objects/
packs-src/weapons/
packs-src/manual/
```

Artefacts construits :

```text
packs/objects/
packs/weapons/
packs/manual/
```

---

## 6. Correctif final des noms d’images

La première installation distante de la 1.0.0 a révélé que certaines images des packs Objets/Armes ne se chargeaient plus après distribution.

Cause : noms de fichiers contenant des espaces et/ou des caractères accentués/spéciaux.

Correctif :

```text
51 fichiers normalisés
→ 24 images Objets
→ 27 images Armes
```

Convention appliquée :

```text
ASCII
minuscules
espaces → tirets
accents supprimés
apostrophes/caractères spéciaux supprimés ou remplacés
```

Exemples :

```text
3.arc court.webp
→ 3.arc-court.webp

5.Mallette étanche.webp
→ 5.mallette-etanche.webp

3.fusil d'assaut.webp
→ 3.fusil-d-assaut.webp
```

Les références `img` des 102 Items ont été mises à jour dans `packs-src/`, puis `objects` et `weapons` ont été reconstruits.

Un contrôle statique supplémentaire empêche désormais la réintroduction de chemins d’assets de compendium non sûrs.

Stratégie de publication retenue par l’utilisateur : **remplacement de la première release/tag 1.0.0** plutôt que création d’une 1.0.1, la diffusion venant juste de commencer.

La release 1.0.0 corrigée a ensuite été recréée et l’installation distante a été revalidée avec succès.

---

## 7. Méthode Git / Foundry désormais utilisée

Afin d’éviter les modifications LevelDB « fantômes » dans GitHub Desktop :

```text
Dépôt Git DEV
→ stocké hors du dossier Foundry

Data/systems/interface
→ copie dédiée aux tests Foundry
```

Workflow adopté :

```text
candidate GPT Foundry
→ copie dans Data/systems/interface
→ copie dans dépôt Git DEV
→ tests Foundry
→ fermeture complète Foundry
→ archive de la copie réellement testée
→ contrôle des LevelDB
→ intégration de l’état validé
```

`.git/` n’est jamais fourni dans les archives GPT Foundry.

`TODO_evilbram.md` reste personnel, non autoritatif et exclu des archives produites.

---

## 8. Distribution PROD

Le package PROD a été construit par **liste blanche**.

Contenu runtime conservé :

```text
system.json
assets/
fonts/
lang/
packs/
scripts/
styles/
templates/
```

Éléments DEV exclus du distributif :

```text
.project/
tests/
tools/
packs-src/
.git/
.gitattributes
TODO_evilbram.md
README.md
```

Le `system.json` public final contient :

```text
version  : 1.0.0
author   : Evilbram
url      : https://github.com/ctotone/interface-ga
bugs     : https://github.com/ctotone/interface-ga/issues
manifest : https://raw.githubusercontent.com/ctotone/interface-ga/main/system.json
download : https://github.com/ctotone/interface-ga/releases/download/1.0.0/interface-1.0.0.zip
```

L’installation réellement validée par l’utilisateur utilise la variante équivalente :

```text
https://raw.githubusercontent.com/ctotone/interface-ga/refs/heads/main/system.json
```

---

## 9. Contrôles techniques finaux côté DEV

Après intégration des nouveaux noms d’images et alignement de la base DEV sur la version 1.0.0 :

```text
Contrôles hors Foundry : 913 / 913 OK
Modules JavaScript     : 29 vérifiés
Tests unitaires        : 5 OK
Smoke test D100        : OK
Assets compendium avec noms non sûrs : 0
```

Les tests Foundry réels restent l’autorité supérieure et ont été validés par l’utilisateur après installation distante.

---

## 10. Archive DEV finale fournie

Une archive complète DEV est préparée séparément.

Elle contient notamment :

```text
.project/
README.md
.gitattributes
assets/
fonts/
lang/
packs/
packs-src/
scripts/
styles/
templates/
tests/
tools/
system.json
```

Elle exclut :

```text
.git/
TODO_evilbram.md
```

Caractéristiques importantes :

- nouveaux noms d’images sûrs intégrés ;
- `packs-src` cohérents avec ces nouveaux chemins ;
- LevelDB `packs/` issus de la copie testée sous Foundry après correctif ;
- manifeste DEV aligné sur la version finale `1.0.0` ;
- `PACKAGE_VERSION` DEV aligné sur `1.0.0` ;
- contrôles statiques adaptés à la version 1.0.0.

Le hash du prochain push DEV devra être communiqué à Pilote après intégration utilisateur.

---

## 11. Points à consolider par GPT Pilote

GPT Pilote peut maintenant :

1. clôturer la Phase 07 ;
2. enregistrer la release `1.0.0` comme première version PROD validée ;
3. mettre à jour `PROJECT_STATE.md` ;
4. mettre à jour `ROADMAP.md` ;
5. mettre à jour `TRANSMISSION_CURRENT.md` ;
6. enregistrer le futur hash DEV correspondant à l’archive finale après push ;
7. définir la prochaine phase éventuelle après la 1.0.0.

Aucun travail supplémentaire n’est requis sur la release 1.0.0 à l’issue de cette transmission.

Toute nouvelle modification fonctionnelle ou corrective devra désormais ouvrir une nouvelle version selon l’importance du changement.
