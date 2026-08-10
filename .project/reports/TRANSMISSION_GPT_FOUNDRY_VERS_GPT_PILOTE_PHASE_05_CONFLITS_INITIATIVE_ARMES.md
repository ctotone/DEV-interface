# Transmission GPT Foundry → GPT Pilote — Phase 05 — Conflits, initiative et armes

**Date :** 10 août 2026  
**Projet :** DEV-interface  
**Système :** `interface`  
**Phase :** 05 — Conflits, initiative et armes  
**GPT spécialiste :** GPT Foundry  
**Coordination / clôture :** GPT Pilote  
**Autorité fonctionnelle et validation réelle :** utilisateur  
**Dépôt :** `ctotone/DEV-interface`  
**Branche projet :** `main`  
**Version package :** `0.1.0`  
**Foundry ciblé :** V14  
**Build de référence testé :** 14.365  
**Base de départ communiquée :** `a56d68838a93398fffdb35aa7ee9feed3eb5dc71`

## 1. Statut de transmission

```text
Développement Phase 05 : TERMINÉ
Contrôles hors Foundry : OK
Tests réels Foundry par l’utilisateur : VALIDÉS pour le périmètre réalisable en solo
Validation finale du bouton Initiative : OK
Test multijoueur simultané F2 : NON EXÉCUTÉ
Publication / release : NON ENGAGÉE
Clôture officielle de Phase 05 : À CONSOLIDER PAR GPT PILOTE
```

L’utilisateur vient de confirmer le dernier point bloquant :

```text
Bouton Initiative depuis la fiche
→ fonctionne correctement dans Foundry
```

La Phase 05 peut donc être transmise à GPT Pilote pour consolidation de clôture.

GPT Foundry ne marque pas lui-même la phase comme clôturée.

---

# 2. Candidate technique finale validée

Archive :

```text
interface-phase05-candidate-initiative-roll-fix.zip
```

SHA-256 :

```text
e6e512317c2569bfb27612d66e66a4a8c60fe2afd98a978985f280d5287fa1c1
```

Contrôle d’intégrité de l’archive :

```text
racine : interface/
nombre de fichiers : 330
.git/ : absent
.gitignore : absent
TODO_evilbram.md : absent
system.json > packs : absent
```

Manifeste observé :

```text
id : interface
version : 0.1.0
compatibility.minimum : 14
compatibility.verified : 14
compatibility.maximum : 14
```

Le commit final d’intégration de Phase 05 n’est pas connu de GPT Foundry au moment de cette transmission.

L’utilisateur reste responsable de :

- l’intégration ;
- la création du commit ;
- le push ;
- la communication du nouveau hash ;
- toute release ou publication future.

---

# 3. Recalibrage initial de la Phase 05

L’audit de début de phase a confirmé qu’une partie importante du socle existait déjà :

- valeurs dérivées `Corps à corps`, `Distance`, `Verbal` ;
- moteur D100 ;
- Destin ;
- malus d’état ;
- catégories d’Items ;
- formules de dégâts persistées ;
- bonus d’initiative dérivé ;
- permissions générales ;
- compendiums déjà validés mais volontairement désactivés pendant le développement.

Le travail réellement restant a été concentré sur :

```text
cartes de chat fonctionnelles
projection publique / MJ
contrôleur des actions de chat
snapshots d’armes
sélection et jets de dégâts
dégâts maximum
forçage MJ après échec
permissions au moment du clic
initiative complète
tests réels Foundry
```

Aucun moteur de combat tactique n’a été ajouté.

---

# 4. Fonctionnalités produites

## 4.1 Cartes D100

Architecture native `ChatMessage` avec :

```text
flags.interface.card
schema = 1
```

Types effectivement utilisés :

```text
d100-result
d100-gm-detail
weapon-selector
damage-result
```

Le type `initiative` reste réservé par le contrat mais aucune carte d’initiative custom n’a été ajoutée.

La carte publique comprend notamment :

- portrait Actor ;
- nom Actor ;
- nom public du jet ;
- score total ;
- Malus uniquement si non nul ;
- détail de Malus au survol ;
- résultat D100 ;
- qualification ;
- marge si supérieure à `0` ;
- détail avantage / désavantage au survol ;
- détail public de l’intervention du Destin au survol ;
- hauteur naturelle.

## 4.2 Couleurs fonctionnelles

```text
échec critique                    #ff0000
échec normal / automatique        #ff006f
super échec critique (100)        #dc00c9
réussite normale / automatique    #009700
réussite critique                 #0082ff
super réussite critique (1)       #f3b600
```

La couleur initiale du `1`, `#fffe00`, a été remplacée pendant les tests utilisateur par `#f3b600` pour améliorer la lisibilité sur fond blanc.

## 4.3 Destin

La carte publique ne reçoit pas les données secrètes de diagnostic.

Lorsqu’un test du Destin est résolu depuis un client MJ, une carte séparée `d100-gm-detail` peut être créée et chuchotée aux MJ.

Limite volontaire conservée :

```text
jet initié depuis un client joueur
→ pas de détail secret MJ persistant supplémentaire
```

Aucun nouveau socket ni canal autoritaire n’a été introduit uniquement pour contourner cette limite.

## 4.4 Armes et snapshots

Une arme disponible reste :

```text
Item embarqué
type = equipment
system.category = weapon
```

Snapshot persistant :

```text
itemUuid
name
img
damageFormula
formulaValidAtCreation
sort
```

Après réussite :

```text
snapshot au moment du conflit
→ ancienne carte cohérente même après modification/suppression de l’Item
```

Après échec forcé par le MJ :

```text
armes actuelles de l’Actor au moment du clic
→ nouveau snapshot
```

## 4.5 Dégâts

Après réussite de conflit :

- création automatique d’une carte `Jet de dégâts` indépendante ;
- liste des armes conservée ;
- carte réutilisable ;
- nouveau jet visible dans le même sélecteur ;
- dégâts normaux ;
- dialogue dégâts normaux / dégâts maximum sur critique ou super-critique ;
- absence d’arme explicitement signalée ;
- formule vide ou invalide gérée sans automatisme dangereux.

Aucune cible n’est modifiée.

Aucune Blessure n’est appliquée automatiquement.

## 4.6 Échec de conflit

Le joueur ne peut pas forcer les dégâts.

Le MJ dispose de :

```text
Permettre les dégâts
```

L’action revalide les permissions au moment du clic.

## 4.7 Initiative

Documents natifs conservés :

```text
Actor
Combat
Combatant
```

Formule système :

```text
1d10 + @derived.initiativeBonus
```

avec :

```text
initiativeBonus = round(Distance / 10)
```

Blessure et Stress ne modifient pas l’initiative.

Interaction ajoutée sur la fiche :

```text
aucun Combat actif
→ Initiative non cliquable

Combat actif + Actor absent du tracker
→ Initiative cliquable

clic
→ Actor ajouté au Combat
→ initiative lancée et renseignée
→ action non cliquable une fois présent

Actor retiré du Combat actif
→ action de nouveau disponible
```

Le premier flux testé ajoutait le Combatant sans renseigner l’initiative. Le correctif final conserve l’appel natif Actor puis complète avec `Combat.rollInitiative()` uniquement si le Combatant reste sans initiative, afin d’éviter un double jet.

Les égalités sont signalées au MJ sans second critère de départage.

---

# 5. Fichiers principaux ajoutés

```text
scripts/chat/chat-card-data.mjs
scripts/chat/chat-message-service.mjs
scripts/chat/chat-card-controller.mjs

scripts/services/weapon-snapshot-service.mjs
scripts/services/damage-service.mjs
scripts/services/initiative-service.mjs
scripts/services/theme-service.mjs

templates/chat/d100-result.hbs
templates/chat/d100-gm-detail.hbs
templates/chat/weapon-selector.hbs
templates/chat/damage-result.hbs

tests/unit/phase05-chat-damage.test.mjs
tests/protocols/PHASE_05_CHAT_DEGATS_INITIATIVE_FOUNDRY_V14_365.md

.project/decisions/PHASE_05_CARTES_CHAT_ERGONOMIE.md
.project/reports/PHASE_05_CANDIDATE_TECHNIQUE.md
```

# 6. Fichiers principaux modifiés

```text
scripts/services/d100-roll-service.mjs
scripts/documents/interface-actor.mjs
scripts/interface.mjs
scripts/applications/character-sheet.mjs

templates/actor/character-sheet.hbs
styles/interface.css
lang/fr.json

tests/static/check-project.mjs
tests/static/smoke-import.mjs
```

---

# 7. Corrections intervenues pendant la validation réelle

## 7.1 B1 — flags de ChatMessage gelés

Erreur réelle initiale :

```text
TypeError: Cannot assign to read only property 'publicData'
```

Cause :

- enveloppe interne volontairement gelée ;
- même objet transmis directement au DataModel `ChatMessage` ;
- nettoyage Foundry V14 tentant de réassigner une propriété interne.

Correction :

```text
immutabilité interne conservée
→ structuredClone(card) à la frontière ChatMessage
```

Un test de non-régression reproduit désormais ce cas.

## 7.2 Initiative depuis la fiche

Première version :

```text
action cliquable
→ Actor placé dans le Combat
→ initiative non renseignée
```

Correction finale :

```text
Actor.rollInitiative(...)
→ inspection du Combatant
→ si initiative encore null
   Combat.rollInitiative(combatantId)
```

Le test isolé reproduit explicitement ce comportement avant correction et vérifie aussi l’absence de double jet.

## 7.3 Lisibilité du super critique `1`

Modification validée :

```text
#fffe00
→ #f3b600
```

---

# 8. Contrôles hors Foundry

Dernier contrôle exécuté sur l’archive finale extraite :

```text
node tests/static/check-project.mjs
→ OK — 762 contrôles hors Foundry réussis.
→ Modules JavaScript vérifiés : 29.
→ Tests unitaires exécutés : 4.
→ Chargement isolé et enregistrements init simulés : OK.
```

Les autres contrôles isolés ont également été exécutés avec succès :

```text
tests/static/smoke-import.mjs
tests/unit/derived-values.test.mjs
tests/unit/d100-engine.test.mjs
tests/unit/character-creation.test.mjs
tests/unit/phase05-chat-damage.test.mjs
```

Ces contrôles ne sont pas présentés comme une validation Foundry réelle.

---

# 9. Résultats des tests Foundry — utilisateur

Le protocole principal a été exécuté manuellement par l’utilisateur.

Résultats communiqués :

```text
B1 à B5 : OK
C1 à C5 : OK
D1 à D2 : OK
E1 à E4 : OK
F1 : OK
F2 : NON TESTÉ
Initiative finale : OK
```

Précisions :

### B4 — Destin

Fonctionnement validé.

Observation :

```text
fiche de détail MJ
→ uniquement lorsque le jet déclenchant Destin vient du client MJ
```

Point graphique reporté :

```text
halo bleu Destin trop discret
→ à retravailler pendant la phase design
```

### B5 — couleurs rares

L’utilisateur a validé directement les résultats obtenus lors des essais mais n’a pas cherché à forcer manuellement toutes les occurrences rares.

Les valeurs CSS exactes sont couvertes par les contrôles hors Foundry.

### F1 — clics rapides

Observation :

```text
clics rapides
→ les jets de dégâts sont exécutés à la suite
```

Comportement jugé non gênant par l’utilisateur.

### F2 — simultanéité multijoueur

Non exécuté car trop complexe à reproduire seul.

Ne pas transformer ce point en test validé.

---

# 10. Expérience complémentaire — tests par GPT sous Codex

Pendant la validation, l’utilisateur a testé en parallèle un protocole réduit avec un GPT opérant sous Codex.

Cette expérience reste complémentaire et ne remplace pas la validation utilisateur.

Compte rendu Codex :

```text
T01 : OK
T02 : OK
T03 : OK
T04 : OK
T05 : OK
T06 : PARTIELLEMENT OK
T07 : NON TESTÉ
T08 : NON TESTÉ
T09 : OK
```

Détail T06 :

```text
côté joueur :
- action MJ techniquement présente dans la carte ;
- action masquée ;
- joueur incapable de forcer les dégâts.

côté MJ :
- non testé par Codex dans cette session.
```

Le côté MJ de ce comportement avait déjà été testé manuellement par l’utilisateur.

T07/T08 n’ont pas été exécutés par Codex car ils nécessitaient un changement de contexte / droits vers une session MJ.

Cette expérience fait l’objet d’une demande d’évaluation distincte à GPT Architecte concernant un éventuel futur second protocole de tests destiné à Codex.

---

# 11. Limites et reports connus

## Non testé

```text
F2 — comportement simultané avec plusieurs propriétaires / clients
```

## Limite prudente actuelle

```text
détail secret Destin issu d’un jet joueur
→ pas de ChatMessage secret supplémentaire persistant
```

## Phase design ultérieure

```text
halo bleu Destin
→ trop discret

thèmes / skins
→ structure d’extension préparée
→ aucune persistance décidée
```

La source de vérité future du thème n’est toujours pas arbitrée :

- aucun setting ;
- aucun flag ;
- aucune clé de DataModel ;
- aucune migration.

---

# 12. Invariants préservés

Aucun changement silencieux sur :

- identifiant package `interface` ;
- UUID ;
- types Actor / Item ;
- type de Document ;
- schéma métier existant ;
- migrations ;
- permissions structurantes ;
- compendiums ;
- identifiants `interface.objects` / `interface.weapons`.

Compendiums :

```text
system.json
→ toujours sans propriété packs

packs-src/
→ non modifié pour la Phase 05

packs/
→ non reconstruit
```

Aucune nouvelle architecture socket.

Aucun `Combat` ou `Combatant` custom.

Aucune application automatique de dégâts ou de Blessures.

Aucune publication.

---

# 13. Niveau de preuve

```text
Code écrit : OUI
Analyse statique : OUI
Tests isolés : OUI
Test Foundry réel utilisateur : OUI
Test MJ : OUI sur les cas réalisables en solo
Test joueur : OUI
Test multijoueur simultané F2 : NON
Test Codex complémentaire : OUI, partiel
Validation fonctionnelle utilisateur : OUI
Commit final Phase 05 : NON COMMUNIQUÉ
Push final Phase 05 : NON COMMUNIQUÉ
Publication : NON
```

---

# 14. Action attendue de GPT Pilote

GPT Pilote peut maintenant :

1. consolider la validation de Phase 05 ;
2. enregistrer explicitement les limites restantes ;
3. mettre à jour l’état et la transmission courante du projet ;
4. décider de la clôture officielle de Phase 05 ;
5. conserver F2 comme test multijoueur non exécuté, sans le convertir en validation ;
6. conserver les notes design pour la phase ergonomie / identité visuelle ;
7. demander à l’utilisateur le hash du commit final après intégration / push afin d’établir la nouvelle base technique de reprise ;
8. préparer l’ouverture de la phase suivante selon la roadmap.

Aucune action de release ou de publication n’est demandée par cette transmission.
