# Décision de projet — Gestion des compendiums pendant le développement

## Référence

- **Projet :** DEV-interface
- **Statut :** VALIDÉE
- **Date :** 7 août 2026
- **Branche :** `main`
- **Base de départ :** `386c71c5e73f9d9833905430c6d341344cfaf717`
- **Commit technique observé après application :** `eb6dc6196a71e3413f851d876a1b617dba3938af`
- **Publication :** non engagée

# 1. Problème

Foundry VTT peut réécrire physiquement les bases LevelDB des compendiums actifs pendant les cycles de développement, créant des modifications Git parasites sans changement fonctionnel volontaire du contenu.

Le dossier de développement étant utilisé directement comme dossier système Foundry, ce bruit perturbait la lecture de l’état réel du projet.

# 2. Décision utilisateur

```text
Option C — désactiver temporairement les compendiums dans system.json
pendant le développement.

Réactivation obligatoire :
avant la candidate / release 1.0.0.
```

Cette décision vaut pour DEV-interface pendant la période de développement.

Elle ne remet pas en cause la validation fonctionnelle antérieure des compendiums.

# 3. Source de vérité

```text
packs-src/
→ source d’autorité humaine des contenus

tools/build-compendiums.mjs
→ reconstruction et vérification

packs/
→ artefacts LevelDB compilés, conservés et versionnés
```

Les identifiants structurants restent :

```text
interface.objects
interface.weapons
```

Ils ne doivent pas être renommés sans analyse d’impact et validation explicite.

# 4. Protocole de développement

Pendant le développement :

- `system.json` ne contient pas de propriété `packs` ;
- Foundry ne charge pas `interface.objects` ni `interface.weapons` ;
- `packs-src/` reste conservé et versionné ;
- `packs/` reste physiquement présent et versionné dans son état validé ;
- `tools/build-compendiums.mjs` reste disponible ;
- `tests/static/check-project.mjs` contrôle les sources mais ne reconstruit pas LevelDB lorsque les packs sont désactivés ;
- une variation de `packs/` sans changement volontaire correspondant dans `packs-src/` est considérée comme parasite et ne doit pas être commitée.

# 5. ZIP de développement

Les livraisons techniques doivent :

- conserver `packs-src/` ;
- conserver `tools/build-compendiums.mjs` ;
- conserver `packs/` dans son état validé existant ;
- conserver `system.json` sans déclaration des packs ;
- exclure `.git/` ;
- exclure `.gitignore` ;
- exclure `TODO_evilbram.md`.

# 6. Modification volontaire d’un compendium

```text
modifier packs-src/
→ contrôler les IDs, données et assets
→ reconstruire avec tools/build-compendiums.mjs
→ réactiver temporairement les packs si un test Foundry est nécessaire
→ exécuter les contrôles
→ tester sous Foundry
→ commit utilisateur
```

# 7. Étape obligatoire avant candidate / release 1.0.0

```text
1. rétablir dans system.json les déclarations objects et weapons ;
2. conserver exactement interface.objects et interface.weapons ;
3. exécuter tools/build-compendiums.mjs ;
4. exécuter tests/static/check-project.mjs ;
5. vérifier les compendiums sous Foundry VTT ;
6. vérifier objets, armes, dossiers, images et descriptions ;
7. seulement ensuite préparer la candidate / release.
```

# 8. Validation du protocole

Contrôles rapportés par GPT Foundry :

```text
708 contrôles hors Foundry en mode développement : OK
22 modules JavaScript vérifiés
3 tests unitaires exécutés
chargement isolé / init simulée : OK
packs/ inchangé après contrôle : vérifié
simulation de réactivation : 718 contrôles OK
déclaration de pack incorrecte : rejetée comme attendu
```

Test utilisateur réel sous Foundry VTT `14.365` :

- compendiums absents ;
- système chargé sans erreur visible ;
- aucune alerte console F12 signalée ;
- après fermeture, aucune modification visible dans GitHub Desktop.

# 9. Limites

- `packs/` reste versionné ; il ne devient pas la source d’autorité ;
- une exécution manuelle du builder peut modifier `packs/` ;
- la réactivation avant `1.0.0` est une obligation opérationnelle à ne pas oublier ;
- la publication n’est pas traitée par cette décision.

# 10. Statut

```text
Décision : VALIDÉE PAR L’UTILISATEUR
Périmètre : DEV-interface
Dette fonctionnelle : AUCUNE
Obligation future : réactivation + reconstruction + tests avant 1.0.0
```
