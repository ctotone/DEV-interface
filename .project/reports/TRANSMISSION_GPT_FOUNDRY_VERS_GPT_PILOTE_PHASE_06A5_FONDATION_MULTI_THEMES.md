# Transmission — GPT Foundry → GPT Pilote — Phase 06A.5 Fondation multi-thèmes

## Projet

```text
DEV-interface
Phase 06 — Ergonomie et identité visuelle
Étape 6A.5 — Fondation technique multi-thèmes
```

## Base entrante

```text
Dépôt : ctotone/DEV-interface
Branche : main
Commit : 1c8dde5f2f9b8855ca2e886a919619f1b5d1961e
Titre : Phase 5 terminée
```

## Mission reçue

Préparer une fondation transverse de skinning avant GPT Visuel, sans changement visuel volontaire, sans sélection utilisateur de thème et sans persistance.

Mission exécutée.

---

# 1. Résultat

La candidate 6A.5 dispose désormais :

- d'un thème `default` explicite ;
- de tokens sémantiques centralisés ;
- d'un contexte de thème Actor ;
- d'un contexte de thème Item ;
- d'un contexte de thème wizard ;
- d'un contexte de thème settings ;
- du contexte déjà présent sur les cartes chat ;
- de contextes sur les DialogV2 actifs de la Phase 06 ;
- d'un marqueur CSS `ordinary|weapon` sur la fiche Item ;
- de la palette Blessures/Stress déplacée du JS vers le thème CSS ;
- d'Electrolize techniquement intégrée sans usage visuel imposé ;
- d'un test unitaire dédié ;
- de contrôles statiques renforcés.

---

# 2. Décision utilisateur intervenue pendant 6A.5

Chemin final de la police :

```text
interface/fonts/Electrolize.woff2
```

Le premier nom de fichier envisagé a été abandonné avant livraison.

Le nom interne CSS reste :

```text
Electrolize
```

La licence SIL Open Font License 1.1 avait été vérifiée et communiquée par l'utilisateur avant intégration.

---

# 3. Invariants

Non modifiés :

- schéma ;
- `system.json` ;
- Actor / Item types ;
- catégorie `ordinary|weapon` ;
- settings persistés ;
- flags ;
- moteur D100 ;
- Destin ;
- initiative ;
- snapshots ;
- dégâts ;
- wizard ;
- permissions ;
- sockets ;
- compendiums ;
- `packs-src/`.

Aucun choix utilisateur de thème n'existe encore.

Aucun setting/flag/DataModel/migration de thème n'a été créé.

---

# 4. Couleurs protégées

D100 inchangé :

```text
#ff0000
#ff006f
#dc00c9
#009700
#0082ff
#f3b600
```

Blessures / Stress inchangés visuellement dans les valeurs :

```text
#7A7F87
#718F78
#B39A45
#C97932
#B84A3A
#762F3A
```

Le halo Destin conserve :

```text
rgba(0, 130, 255, 0.42)
```

Son amélioration reste pour 6B/6C.

---

# 5. Contrôles techniques

Contrôles hors Foundry : OK.

Le rapport détaillé est :

```text
.project/reports/PHASE_06A5_FONDATION_MULTI_THEMES.md
```

Le protocole réel est :

```text
tests/protocols/PHASE_06A5_FONDATION_MULTI_THEMES_FOUNDRY_V14_365.md
```

---

# 6. Statut de validation

```text
Code écrit : OUI
Analyse statique : OUI
Tests unitaires : OUI
Smoke import : OUI
Test réel Foundry : NON ENCORE
Validation fonctionnelle utilisateur : NON ENCORE
Phase 06 clôturée : NON
```

GPT Pilote ne doit donc pas considérer 6A.5 comme validée avant le retour du protocole utilisateur.

---

# 7. Prochaine séquence recommandée

```text
utilisateur
→ intégrer la candidate
→ exécuter le protocole 6A.5 dans Foundry V14
→ retourner les résultats à GPT Foundry

si anomalie
→ correction ciblée GPT Foundry
→ nouveau test

si OK
→ validation utilisateur de 6A.5
→ consolidation GPT Pilote
→ préparation du brief/captures pour GPT Visuel
→ Phase 6B
```

## Éléments destinés ensuite à GPT Visuel

Après validation/consolidation :

- audit 6A ;
- fondation 6A.5 ;
- nomenclature des tokens ;
- contraintes fonctionnelles ;
- captures Foundry ;
- palette D100 ;
- asset `fonts/Electrolize.woff2` ;
- statut licence communiqué par l'utilisateur.

GPT Visuel ne doit pas inventer une nouvelle architecture de thème ni introduire de persistance.

---

# 8. Arbitrages restant ouverts

Aucune réponse implicite n'a été apportée à :

```text
A1 — Destin visible ou non sur la fiche Actor
A2 — future source/persistance du choix de thème
A3 — tabulation des Talents
```

Ils restent sous autorité utilisateur.

---

# 9. Action demandée à GPT Pilote

Après validation Foundry utilisateur :

1. consolider 6A.5 ;
2. conserver la séparation support multi-thèmes / choix utilisateur ;
3. préparer le passage à GPT Visuel ;
4. ne pas clôturer la Phase 06 ;
5. maintenir les arbitrages A1/A2/A3 ouverts.
