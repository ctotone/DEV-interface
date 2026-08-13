# Phase 07 — Finitions, stabilisation et gel pré-1.0.0

## Référence

- **Projet :** DEV-interface / Système Interface
- **Statut :** VALIDÉE ET CLÔTURÉE
- **Date de clôture :** 13 août 2026
- **Version du produit :** `1.0.0`
- **Branche DEV :** `main`
- **Commit de clôture Phase 06 :** `39ae4e11c553a10ca04dce0efeecb461c86ae16f`
- **Dernier commit DEV communiqué avant correctif final des assets :** `e5796091dac6cf6f6991ca9e893faf4d6014c84e`
- **Commit DEV final :** à renseigner après intégration et push utilisateur de l'archive finale
- **Dépôt PROD :** `https://github.com/ctotone/interface-ga`
- **Commit PROD final communiqué :** `665d698a686fcbd6d0d519390a9b7b5e5d9864bc`
- **Tag / release :** `1.0.0`
- **Release :** `https://github.com/ctotone/interface-ga/releases/tag/1.0.0`
- **Foundry testé :** V14.365

# 1. Objectif de la phase

Finaliser le système après la Phase 06, stabiliser la base, intégrer les derniers éléments nécessaires à la première version complète, geler le contenu pré-1.0.0 et obtenir une installation propre depuis le dépôt PROD.

# 2. Résultat

La Phase 07 aboutit à une version `1.0.0` installable et validée depuis le dépôt PROD.

Validation utilisateur rapportée :

```text
Installation neuve depuis manifeste distant : OK
Système Interface 1.0.0                      : OK
Background système                           : OK
Actor                                        : OK
Item                                         : OK
Jets D100                                    : OK
Compendium Objets                            : OK
Compendium Armes                             : OK
Compendium Manuel du joueur                  : OK
Images des compendiums                       : OK
Manuel du joueur / 8 pages                   : OK
```

# 3. Identité finale

```text
ID technique : interface
Nom affiché  : Système Interface
Version      : 1.0.0
Auteur       : Evilbram
```

Background validé :

```text
systems/interface/assets/system-background.webp
```

# 4. Compendiums finaux

```text
interface.objects
→ Item
→ 60 entrées / 8 dossiers

interface.weapons
→ Item
→ 42 entrées / 3 dossiers

interface.manual
→ JournalEntry
→ 1 Journal / 8 pages
```

Sources d'autorité :

```text
packs-src/objects/
packs-src/weapons/
packs-src/manual/
```

Artefacts runtime :

```text
packs/objects/
packs/weapons/
packs/manual/
```

Le builder `tools/build-compendiums.mjs` gère désormais les trois packs.

# 5. Correctif final des assets

La première installation distante a révélé des chemins d'images non sûrs dans les compendiums.

Correctif validé :

```text
51 fichiers normalisés
24 images Objets
27 images Armes
```

Convention appliquée :

```text
ASCII
minuscules
espaces → tirets
accents supprimés
caractères spéciaux supprimés ou remplacés
```

Les références `img` des 102 Items ont été alignées puis les packs Objets et Armes reconstruits.

# 6. Distribution PROD

Le distributif PROD est construit par liste blanche.

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

Éléments DEV exclus :

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

Manifeste public final :

```text
version  : 1.0.0
url      : https://github.com/ctotone/interface-ga
manifest : https://raw.githubusercontent.com/ctotone/interface-ga/main/system.json
download : https://github.com/ctotone/interface-ga/releases/download/1.0.0/interface-1.0.0.zip
```

# 7. Contrôles finaux

Contrôles techniques rapportés côté DEV :

```text
913 / 913 contrôles hors Foundry : OK
29 modules JavaScript vérifiés
5 tests unitaires : OK
Smoke test D100 : OK
Assets compendium avec noms non sûrs : 0
```

Les tests Foundry réels post-installation distante ont été validés par l'utilisateur.

# 8. Point connu non requalifié

Aucune preuve nouvelle de test du scénario multijoueur simultané `F2` n'est fournie dans la transmission de clôture.

Il reste donc :

```text
F2 — simultanéité multijoueur : NON TESTÉ / risque accepté pour 1.0.0
```

Ce point n'empêche pas la clôture de la 1.0.0 personnelle validée par l'utilisateur.

# 9. Phase 08 initialement prévue

Les objectifs initialement planifiés pour la Phase 08 — nettoyage distributif, manifeste, compendiums finaux, dépôt PROD, release et test d'installation — ont été réalisés dans le prolongement direct de la clôture 1.0.0.

Pour la version `1.0.0`, il ne reste donc pas de Phase 08 séparée à ouvrir.

```text
Phase 08 planifiée
→ objectifs absorbés par la séquence finale de Phase 07 / release 1.0.0
→ aucun travail 1.0.0 restant
```

# 10. Décision de clôture

```text
Phase 07 : VALIDÉE ET CLÔTURÉE
Version 1.0.0 : PRODUITE
Dépôt PROD : ALIMENTÉ
Release 1.0.0 : PRODUITE
Installation depuis PROD : TESTÉE ET VALIDÉE UTILISATEUR
Publication Foundry officielle : NON REQUISE / NON ENGAGÉE
```

Toute nouvelle modification fonctionnelle ou corrective ouvre désormais une nouvelle version du système.

# 11. Base de référence

## PROD

```text
Dépôt  : https://github.com/ctotone/interface-ga
Branche: main
Commit : 665d698a686fcbd6d0d519390a9b7b5e5d9864bc
Tag    : 1.0.0
Release: https://github.com/ctotone/interface-ga/releases/tag/1.0.0
```

## DEV

L'archive finale DEV fournie constitue la base matérielle de clôture en attente de son commit Git final après intégration utilisateur.

Le futur hash DEV doit être ajouté aux documents de projet après push.

# 12. Prochaine action

Communiquer à GPT Pilote le hash du push DEV final correspondant à l'archive consolidée.
