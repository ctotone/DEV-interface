# Rapport technique — Phase 06A.5 — Fondation multi-thèmes

## Statut

```text
Projet : DEV-interface
Étape : 6A.5
Base : 1c8dde5f2f9b8855ca2e886a919619f1b5d1961e
Branche entrante : main
Foundry ciblé : V14
Base de test documentée : 14.365
Implémentation technique : TERMINÉE
Contrôles hors Foundry : OK
Tests réels Foundry : À FAIRE PAR L'UTILISATEUR
Validation fonctionnelle : NON ENCORE PRONONCÉE
```

Aucun commit, push, release ou publication n'a été réalisé.

---

# 1. Objectif réalisé

6A.5 prépare le système à plusieurs thèmes futurs sans ajouter de choix utilisateur ni de persistance.

L'infrastructure couvre désormais :

- fiche Actor ;
- fiche Item ;
- assistant de création ;
- réglages système ;
- cartes de chat ;
- DialogV2 actifs identifiés pour la Phase 06 ;
- palette Blessures / Stress ;
- couleurs fonctionnelles D100 ;
- halo Destin ;
- distinction ordinary / weapon ;
- infrastructure typographique Electrolize.

Le rendu `default` conserve volontairement les valeurs visuelles de la Phase 05.

---

# 2. Service de thème

Fichier :

```text
scripts/services/theme-service.mjs
```

API interne disponible :

```text
DEFAULT_INTERFACE_THEME
normalizeInterfaceTheme(theme)
resolveInterfaceTheme(subject)
resolveActorTheme(actor)
resolveItemTheme(item)
interfaceThemeClass(theme)
```

Comportement actuel :

```text
resolveInterfaceTheme(...)
resolveActorTheme(...)
resolveItemTheme(...)
→ "default"
```

Aucune source persistée n'est consultée.

Aucun setting, flag ou DataModel de thème n'est créé.

`normalizeInterfaceTheme` protège également l'usage futur d'un identifiant dans des classes/attributs DOM en revenant à `default` si l'identifiant n'est pas un slug simple.

---

# 3. Contextes de thème

## Actor

Déjà existant et conservé :

```html
data-interface-theme="{{theme}}"
```

Résolution :

```text
resolveActorTheme(actor)
```

## Item

Ajout :

```html
data-interface-theme="{{theme}}"
data-interface-item-category="{{itemCategory}}"
```

Résolution :

```text
resolveItemTheme(item)
```

La catégorie est la valeur existante :

```text
system.category = ordinary | weapon
```

Aucun nouveau type d'Item ni aucune donnée n'est créé.

## Assistant de création

Ajout :

```html
data-interface-theme="{{theme}}"
```

Résolution depuis l'Actor en création.

## Réglages

Ajout :

```html
data-interface-theme="{{theme}}"
```

Résolution générique `default`.

## Chat

Les quatre templates Phase 05 conservent :

```html
data-interface-theme="{{theme}}"
```

## DialogV2 actifs

Les dialogues suivants reçoivent un contexte de thème :

- préparation D100 ;
- choix objet ordinaire / arme ;
- confirmation suppression ;
- avertissement de création ;
- choix dégâts normaux / maximum.

Ils reçoivent :

```text
classe : interface-theme--default
contenu : data-interface-theme="default"
```

Le dialogue ancien de choix Talent pour Compétence reste reporté conformément à l'audit.

`FilePicker` n'est pas re-skinné.

---

# 4. Nomenclature des tokens

La couche de thème `default` est explicitement déclarée dans :

```text
styles/interface.css
```

## 4.1 Typographie

```text
--interface-theme-font-ui
--interface-theme-font-display
```

`--interface-theme-font-display` référence Electrolize, mais aucun composant ne consomme encore ce token.

## 4.2 Surfaces et texte

```text
--interface-theme-surface
--interface-theme-surface-strong
--interface-theme-surface-inverse
--interface-theme-text
--interface-theme-text-muted
--interface-theme-text-inverse
--interface-theme-border
--interface-theme-border-strong
--interface-theme-accent
```

## 4.3 Tons fonctionnels

```text
--interface-theme-tone-corps
--interface-theme-tone-ame
--interface-theme-tone-esprit
--interface-theme-tone-neutral
```

## 4.4 Blessures / Stress

```text
--interface-theme-state-0
--interface-theme-state-1
--interface-theme-state-2
--interface-theme-state-3
--interface-theme-state-4
--interface-theme-state-5
```

Valeurs conservées :

```text
0 #7A7F87
1 #718F78
2 #B39A45
3 #C97932
4 #B84A3A
5 #762F3A
```

## 4.5 États d'interaction

```text
--interface-theme-action
--interface-theme-action-hover
--interface-theme-danger
--interface-theme-focus
--interface-theme-disabled-opacity
--interface-theme-readonly-opacity
--interface-theme-error
--interface-theme-success
```

Certains sont préparatoires et ne sont pas encore consommés par tous les composants.

## 4.6 D100

Tokens fonctionnels conservés :

```text
--interface-result-failure                 #ff006f
--interface-result-critical-failure        #ff0000
--interface-result-super-critical-failure  #dc00c9
--interface-result-success                 #009700
--interface-result-critical-success        #0082ff
--interface-result-super-critical-success  #f3b600
```

Aucune valeur n'a changé.

## 4.7 Destin

```text
--interface-destiny-halo
```

Valeur actuelle conservée :

```text
rgba(0, 130, 255, 0.42)
```

La refonte du halo reste une tâche de 6B/6C.

## 4.8 Chat

```text
--interface-theme-card-border
--interface-card-paper
--interface-card-paper-strong
--interface-card-ink
--interface-card-muted
--interface-card-border
--interface-card-action
--interface-card-action-hover
```

Les propriétés `--interface-card-*` restent comme alias de compatibilité.

## 4.9 Alias historiques de la fiche

Conservés afin d'éviter une refonte visuelle en 6A.5 :

```text
--interface-border
--interface-paper
--interface-paper-strong
--interface-ink
--interface-muted
--interface-black
--interface-white
--interface-corps
--interface-ame
--interface-esprit
--interface-neutral
```

Ils pointent maintenant vers les tokens de thème avec les anciennes valeurs en fallback.

---

# 5. Blessures / Stress

Avant 6A.5 :

```text
niveau + libellé + couleur
→ character-sheet.mjs
```

Après 6A.5 :

```text
niveau + libellé
→ character-sheet.mjs

couleur
→ styles/interface.css
→ token --interface-theme-state-N
```

Les six couleurs ont été retirées du JavaScript et le style inline a été retiré du template Actor.

Aucune règle de niveau et aucun libellé n'ont changé.

---

# 6. Electrolize

Chemin décidé par l'utilisateur :

```text
fonts/Electrolize.woff2
```

Déclaration :

```css
@font-face {
  font-family: "Electrolize";
  src: url("../fonts/Electrolize.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
```

Le fichier fourni est intégré tel quel.

Usage visuel actuel :

```text
aucun
```

La police est disponible comme ressource technique pour 6B, mais elle n'est pas appliquée automatiquement à la fiche, aux cartes ou aux dialogs.

Aucun faux Bold n'est imposé.

---

# 7. Fichiers de code / UI modifiés

```text
scripts/applications/character-creation-application.mjs
scripts/applications/character-sheet.mjs
scripts/applications/equipment-sheet.mjs
scripts/applications/interface-settings-application.mjs
scripts/chat/chat-card-controller.mjs
scripts/services/theme-service.mjs

styles/interface.css

templates/actor/character-creation.hbs
templates/actor/character-sheet.hbs
templates/item/equipment-sheet.hbs
templates/settings/interface-settings.hbs

tests/static/check-project.mjs
```

# 8. Fichiers ajoutés

```text
fonts/Electrolize.woff2
tests/unit/theme-foundation.test.mjs
tests/protocols/PHASE_06A5_FONDATION_MULTI_THEMES_FOUNDRY_V14_365.md
.project/reports/AUDIT_GPT_FOUNDRY_PHASE_06_ERGONOMIE_IDENTITE_VISUELLE.md
.project/reports/PHASE_06A5_FONDATION_MULTI_THEMES.md
.project/reports/TRANSMISSION_GPT_FOUNDRY_VERS_GPT_PILOTE_PHASE_06A5_FONDATION_MULTI_THEMES.md
```

---

# 9. Invariants explicitement préservés

Aucune modification de :

```text
system.json
schéma
version de schéma
types Actor
types Item
system.category
settings enregistrés
flags persistés
UUID
permissions
sockets
moteur D100
règles de Destin
initiative
snapshots d'armes
dégâts
logique du wizard
packs-src/
packs/
activation des compendiums
```

`TODO_evilbram.md` n'a pas été utilisé comme source et n'est pas modifié.

---

# 10. Contrôles hors Foundry

À la génération de la candidate :

```text
node tests/static/check-project.mjs
→ OK

node tests/static/smoke-import.mjs
→ OK

node tests/unit/d100-engine.test.mjs
→ OK

node tests/unit/derived-values.test.mjs
→ OK

node tests/unit/character-creation.test.mjs
→ OK

node tests/unit/phase05-chat-damage.test.mjs
→ OK

node tests/unit/theme-foundation.test.mjs
→ OK
```

Le contrôle statique vérifie notamment :

- existence de la police au chemin exact ;
- déclaration `@font-face` ;
- tokens principaux ;
- six tokens d'état ;
- marqueurs Actor / Item / wizard / settings / chat ;
- classes de thème des dialogs actifs ;
- absence de persistance dans le service de thème ;
- sortie des couleurs Blessures/Stress du JavaScript ;
- six couleurs D100 exactes ;
- invariants historiques existants.

---

# 11. Tests Foundry à effectuer

Protocole :

```text
tests/protocols/PHASE_06A5_FONDATION_MULTI_THEMES_FOUNDRY_V14_365.md
```

Test utilisateur requis avant validation :

- Actor ;
- Blessures / Stress ;
- initiative ;
- Item ordinary ;
- Item weapon ;
- wizard ;
- settings ;
- preroll ;
- choix objet / arme ;
- confirmation suppression ;
- warning création ;
- carte D100 ;
- dégâts normaux / maximum.

---

# 12. Risques et limites

## 12.1 Validation visuelle

Aucun rendu Foundry réel n'a été exécuté par GPT Foundry.

La conservation visuelle est donc démontrée statiquement par maintien des valeurs CSS, mais doit être confirmée dans Foundry.

## 12.2 Responsive

6A.5 ne résout pas la faiblesse identifiée des media queries fondées sur le viewport.

Ce sujet reste pour la direction visuelle / intégration 6B-6C.

## 12.3 Sélection de thème

Toujours non arbitrée.

Aucun mécanisme utilisateur n'existe.

## 12.4 Destin sur fiche Actor

Toujours non arbitré.

Aucun indicateur n'a été ajouté.

## 12.5 Talents / clavier

`tabindex="-1"` n'est pas modifié.

## 12.6 Font

Un seul fichier Electrolize Regular 400 est intégré.

Les choix typographiques finaux appartiennent à 6B.

---

# 13. Sortie technique

La candidate 6A.5 est prête pour test Foundry utilisateur.

Elle ne doit pas être qualifiée de « validée » avant exécution du protocole réel.

Après validation utilisateur, GPT Pilote peut consolider 6A.5 et préparer la transmission à GPT Visuel pour 6B.
