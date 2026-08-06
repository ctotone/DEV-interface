# Rapport technique — Candidate compendiums système

**Date :** 6 août 2026  
**Package :** système `interface`  
**Version package :** 0.1.0  
**Foundry ciblé :** 14.365  
**Base Git observée :** `7d7e7d7cb994951fa41cba9f6520a591900c7dfe`  
**Publication :** non engagée
**Tests Foundry T1 à T11 :** validés par l’utilisateur

## Périmètre

Création de deux compendiums natifs du système :

```text
interface.objects
interface.weapons
```

## Contenu

```text
Objets
- 60 Items equipment
- category : ordinary
- quantité : 1
- 8 dossiers
- 60 icônes dédiées

Armes
- 42 Items equipment
- category : weapon
- quantité : 1
- 3 dossiers
- 42 icônes dédiées
- formules de dégâts issues de la V2
```

Les deux packs possèdent une bannière déclarée dans `system.json`.

Les 102 descriptions sont stockées en texte brut, sans enveloppe `<p>...</p>`,
afin de correspondre au champ de saisie actuel de la fiche Item. Le constructeur et
les contrôles statiques refusent désormais toute balise HTML dans ces descriptions.

## Arbitrages utilisateur

- titres visibles : `Objets` et `Armes` ;
- IDs : `objects` et `weapons` ;
- dossiers visibles exactement conformes à la décision ;
- `Mitrailleuse légère` remplacée par `Mitrailleuse lourde` ;
- formule `3D6+1` conservée.

## Fichiers créés ou modifiés

```text
system.json
.gitattributes
README.md
packs/objects/
packs/weapons/
packs-src/objects/
packs-src/weapons/
tools/build-compendiums.mjs
tests/static/check-project.mjs
tests/protocols/COMPENDIUMS_SYSTEME_FOUNDRY_V14_365.md
.project/decisions/COMPENDIUMS_SYSTEME_OBJETS_ARMES.md
.project/references/compendiums/
.project/reports/COMPENDIUMS_SYSTEME_CANDIDATE.md
```

## Compilation

Les sources humaines sont conservées en JSON sous `packs-src/`.

`tools/build-compendiums.mjs` reconstruit les deux bases LevelDB sans dépendance
externe, vérifie les CRC32C, relit les WriteBatch et compare chaque clé et valeur
aux sources JSON.

La protection Git suivante a été ajoutée :

```text
packs/** binary
```

## Contrôles hors Foundry

```text
42 armes + 3 dossiers compilés
60 objets + 8 dossiers compilés
102 IDs Item uniques
102 chemins d’images uniques et présents
2 bannières présentes
manifestes de packs cohérents
formules et catégories cohérentes
Mitrailleuse lourde / 3D6+1 vérifiée
```

Le contrôle global du projet a été exécuté après extraction de l’archive :

```text
718 contrôles hors Foundry réussis
22 modules JavaScript vérifiés
3 tests unitaires exécutés
Chargement isolé et enregistrements init simulés : OK
```

## Validation Foundry

Les tests T1 à T11 ont été validés par l’utilisateur sous Foundry VTT 14.365, y compris l’absence de balises HTML visibles dans les fiches et dans leurs copies embarquées.

## Données et compatibilité

Aucun DataModel, schéma, flag, setting, socket, UUID externe ou dépendance n’est
modifié. Les nouveaux UUID de compendium dépendent des IDs persistants
`objects`, `weapons` et des IDs stables des entrées.

## Risques et limites

- les permissions joueur des compendiums restent celles gérées par Foundry ;
- les formules sont conservées telles qu’écrites dans la V2, avec `D` majuscule ;
- les bannières sont utilisées dans leurs dimensions fournies et leur rendu
  final doit être confirmé dans Foundry ;
- les packs ne doivent pas être renommés après validation.
