# Audit GPT Foundry — Phase 06 — Ergonomie et identité visuelle

## Projet

**Projet :** DEV-interface  
**Phase :** 06 — Ergonomie et identité visuelle  
**Étape :** 6A — Audit ergonomique et technique  
**Date de l'audit :** 10 août 2026  
**GPT principal :** GPT Foundry  
**Contributeur prévu après préparation :** GPT Visuel

---

# 1. État général

```text
Base auditée : 1c8dde5f2f9b8855ca2e886a919619f1b5d1961e
Commit : Phase 5 terminée
Dépôt : ctotone/DEV-interface
Branche : main
État Git : propre
Package : interface
Type : système Foundry VTT
Version package : 0.1.0
Version de schéma : 1
Foundry minimum : 14
Foundry verified : 14
Foundry maximum : 14
Base réelle de test documentée : Foundry VTT 14.365
Phase 06 : OUVERTE — audit 6A terminé
Publication : non engagée
```

L'archive auditée correspond exactement au commit communiqué pour la clôture de Phase 05.

Aucun fichier du système n'a été modifié pendant l'audit.

---

# 2. Évolutions de périmètre confirmées au démarrage de la Phase 06

Les points suivants sont désormais intégrés au cadrage de la Phase 06.

## 2.1 Multi-thèmes

L'utilisateur prévoit à terme plusieurs thèmes disponibles pour la fiche.

Cette perspective avait déjà été anticipée en Phase 05 pour les cartes de chat avec :

```text
default
resolveActorTheme(...)
data-interface-theme
```

Décision de travail pour la Phase 06 :

```text
support technique multi-thèmes
→ à préparer avant la direction visuelle

sélection utilisateur du thème
→ non implémentée maintenant

persistance du thème
→ non arbitrée

setting / flag / DataModel / migration de thème
→ interdits sans arbitrage ultérieur explicite
```

## 2.2 Popups et fenêtres secondaires

Le design de la Phase 06 inclut également les fenêtres secondaires propres au système :

- préparation d'un jet D100 ;
- choix objet ordinaire / arme ;
- confirmation de suppression ;
- avertissements de création ;
- choix dégâts normaux / maximum ;
- autres dialogues réellement atteignables depuis l'interface.

Les fenêtres natives Foundry telles que `FilePicker` restent des interfaces Foundry et ne sont pas à re-skiner comme composants du système.

## 2.3 Items ordinaires et armes

Le design doit distinguer clairement :

- Item ordinaire ;
- arme.

Invariant :

```text
Item.type = equipment
```

La distinction reste portée par :

```text
system.category = ordinary
system.category = weapon
```

Aucun nouveau type d'Item ne doit être créé pour le design.

## 2.4 Police Electrolize

Un fichier externe à la base auditée a été fourni pour la Phase 06 :

```text
Electrolize.woff2
Famille : Electrolize
Style : Regular
Poids réel du fichier : 400
Format : WOFF2
```

La licence SIL Open Font License 1.1 et les informations de copyright ont été fournies et vérifiées en amont par l'utilisateur.

Contrôle technique du fichier fourni :

- famille interne : `Electrolize` ;
- nom PostScript : `Electrolize-Regular` ;
- 222 glyphes ;
- caractères accentués français courants présents ;
- un seul poids réel fourni : Regular 400.

Conséquence pour GPT Visuel :

> Ne pas supposer l'existence d'une graisse Electrolize Bold distincte. Si des poids 700/800 sont demandés avec ce seul fichier, le navigateur pourra synthétiser la graisse.

L'usage exact de la police reste à définir en 6B.

---

# 3. Méthode d'audit

Ont été examinés :

- manifeste `system.json` ;
- `.project/TRANSMISSION_CURRENT.md` ;
- `.project/PROJECT_STATE.md` ;
- `.project/ROADMAP.md` ;
- spécifications 00A, 01 et 02 ;
- décisions Phase 04 et Phase 05 ;
- convention de gestion des compendiums ;
- code réel ;
- applications ;
- templates ;
- CSS ;
- services de thème, initiative, dégâts et chat ;
- traductions françaises ;
- assets ;
- contrôles statiques et tests unitaires existants.

Niveaux de preuve distingués :

```text
lecture du code réel
≠
analyse statique
≠
test isolé
≠
rendu réel dans Foundry
≠
validation utilisateur
```

L'audit ergonomique visuel est donc fondé sur la structure réelle et le CSS, mais les appréciations de rendu devront être confirmées par captures et tests Foundry.

---

# 4. Contrôles exécutés pendant l'audit

## 4.1 Git

```text
branche : main
HEAD : 1c8dde5f2f9b8855ca2e886a919619f1b5d1961e
status : propre
commit : Phase 5 terminée
```

## 4.2 Contrôles hors Foundry

Exécutés sans modification :

```text
node tests/static/check-project.mjs
→ 762 contrôles OK
→ 29 modules JavaScript vérifiés
→ 4 tests unitaires exécutés
→ chargement isolé et init simulé : OK

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
```

Ces contrôles ne constituent pas un test de rendu dans Foundry.

---

# 5. Matrice de l'existant

| Zone | État principal | Fichiers concernés | Comportement validé à protéger | Problème / risque ergonomique | Liberté visuelle | Arbitrage requis |
|---|---|---|---|---|---|---|
| Fiche Actor — structure | FONCTIONNEL À HABILLER | `character-sheet.hbs`, `character-sheet.mjs`, `interface.css` | données, autosave, lecture seule, sections, jets | densité et identité encore provisoires | forte sur l'habillage | non |
| Identité Actor | FONCTIONNEL À HABILLER | mêmes fichiers | portrait, nom, profession, âge | hiérarchie perfectible selon futur style | forte | non |
| Compétences | VALIDÉ À CONSERVER | Actor template/CSS | 6 Compétences, valeurs éditables, noms non cliquables | cartes très fonctionnelles, identité faible | moyenne | non |
| Talents | FONCTIONNEL À HABILLER | Actor template/CSS/JS | Talent cliquable = jet standard, tabulation actuelle | cliquabilité visible surtout au hover ; bouton retiré du tab clavier | moyenne | oui uniquement si changement de tabulation |
| Blessures / Stress | FONCTIONNEL À HABILLER | Actor template/CSS/JS | bornes, niveaux, labels, malus | palette d'états actuellement partiellement codée en JS | moyenne | non pour tokenisation |
| Destin sur fiche Actor | NOUVEL ARBITRAGE NÉCESSAIRE | données Actor, Actor template | mécanique Destin inchangée | aucune réserve de Destin visible actuellement sur la fiche | à définir | oui avant ajout d'un indicateur |
| Initiative — comportement | VALIDÉ À CONSERVER | Actor template, `initiative-service.mjs` | 4 états fonctionnels validés | aucun changement métier autorisé | faible | non |
| Initiative — affordance | À AMÉLIORER | Actor template/CSS | même comportement | état désactivé volontairement à `opacity:1`, donc peu distinguable sans hover | moyenne | non |
| Combat / valeurs dérivées | FONCTIONNEL À HABILLER | Actor template/CSS | cartes cliquables, valeur custom désactivable | état désactivé plus clair que l'initiative | forte | non |
| Armes — liste Actor | FONCTIONNEL À HABILLER | Actor template/CSS | accès Item, formule, suppression, ajout | présentation utilitaire | forte | non |
| Inventaire — liste Actor | FONCTIONNEL À HABILLER | Actor template/CSS | objets ordinaires uniquement, accès Item, suppression | présentation utilitaire | forte | non |
| Spécialisations / Notes | FONCTIONNEL À HABILLER | Actor template/CSS | texte libre | blocs très neutres | forte | non |
| Progression | À AMÉLIORER | Actor template/CSS | données et choix existants | petits contrôles, focus visuel à renforcer | moyenne | non |
| Fiche Item ordinaire | FONCTIONNEL À HABILLER | `equipment-sheet.hbs/.mjs`, CSS | même `equipment`, catégorie ordinary, quantité, description | distinction visuelle faible | forte | non |
| Fiche Item arme | FONCTIONNEL À HABILLER | mêmes fichiers | même `equipment`, catégorie weapon, quantité, formule dégâts | distinction surtout portée par le select et le champ dégâts | forte | non |
| Assistant de création | FONCTIONNEL À HABILLER | `character-creation.hbs/.mjs`, CSS | création pending, réouverture, jetons, diagnostics, validation | très dense ; responsive dépend du viewport global | forte | non |
| Avertissement de création | FONCTIONNEL À HABILLER | `character-creation-application.mjs`, CSS | retour / confirmation | habillage minimal | forte | non |
| Préparation jet D100 | FONCTIONNEL À HABILLER | `character-sheet.mjs`, CSS | mode, slider, modificateur | déjà travaillé mais hors système cohérent de thème | forte | non |
| Choix objet / arme | À AMÉLIORER | `character-sheet.mjs` | choix de catégorie | DialogV2 sans classe thème système | forte | non |
| Confirmation suppression | À AMÉLIORER | `character-sheet.mjs` | confirmation obligatoire | DialogV2 sans classe thème système | forte | non |
| Choix Talent depuis Compétence | REPORTÉ | `character-sheet.mjs` | code interne conservé | dialogue non atteignable depuis l'UI actuelle validée | aucune pour 6B | non |
| Choix dégâts normal / maximum | FONCTIONNEL À HABILLER | `chat-card-controller.mjs`, CSS | choix normal/max | habillage quasi nul | forte | non |
| Réglages système | FONCTIONNEL À HABILLER | settings app/template/CSS | settings monde existants | cohérence visuelle à harmoniser | forte | non |
| Carte D100 | FONCTIONNEL À HABILLER | chat templates/service/CSS | contenu public, flags, permissions, couleurs fonctionnelles | détail brut/correction/final uniquement via `title` | moyenne | non |
| Carte détail MJ | FONCTIONNEL À HABILLER | `d100-gm-detail.hbs`, chat CSS | confidentialité | lecture très technique | forte | non |
| Carte sélection dégâts | FONCTIONNEL À HABILLER | `weapon-selector.hbs`, chat CSS | snapshot, réutilisation, permissions | choix clairs mais présentation utilitaire | forte | non |
| Carte résultat dégâts | FONCTIONNEL À HABILLER | `damage-result.hbs`, chat CSS/controller | résultat persistant/projection | détail secondaire très discret | forte | non |
| Halo Destin | À AMÉLIORER | chat CSS | intervention signalée sans secret supplémentaire | halo actuel trop discret ; même famille de bleu que réussite critique | forte | non |
| Thème `default` | VALIDÉ À CONSERVER | `theme-service.mjs`, Actor/chat | point d'extension, aucune persistance | couverture incomplète des surfaces UI | forte | non |
| Fondation multi-thèmes | À AMÉLIORER | CSS + apps/templates/dialogs | aucun choix utilisateur ajouté | tokens dispersés et couleurs codées en dur | forte | non |
| Responsive applications | À AMÉLIORER | CSS | aucune règle métier | media queries basées sur viewport, pas sur largeur réelle de fenêtre Foundry | moyenne | non |
| Accessibilité concrète | À AMÉLIORER | templates/CSS | sens et interactions | hover `title`, petits boutons, certains focus faibles | moyenne | parfois |
| FilePicker Foundry | REPORTÉ | API Foundry native | fonctionnement natif | hors identité propre du système | aucune | non |
| Compendiums | REPORTÉ | `packs-src/`, `packs/` | convention de dev | inactifs volontairement | hors 6B UI | non |

---

# 6. Audit détaillé — Fiche Actor

## 6.1 Structure actuelle

Application :

```text
InterfaceCharacterSheet
860 × 880 par défaut
redimensionnable
```

Template :

```text
templates/actor/character-sheet.hbs
```

La fiche comprend actuellement :

1. Identité ;
2. Compétences ;
3. bande Blessures / Initiative / Stress ;
4. Talents repliables ;
5. Combat repliable ;
6. Armes repliables ;
7. Spécialisations repliables ;
8. Inventaire repliable ;
9. Notes repliables ;
10. Progression.

La structure fonctionnelle est cohérente et ne nécessite pas une reconstruction.

## 6.2 Identité

État :

```text
FONCTIONNEL À HABILLER
```

Le portrait, le nom, la profession et l'âge sont clairement séparés.

Le portrait est interactif pour un utilisateur ayant le droit d'éditer et statique en lecture seule.

L'habillage peut être largement revu sans toucher au DataModel.

## 6.3 Compétences

État :

```text
VALIDÉ À CONSERVER
```

La disposition en six cartes est stable.

Les noms de Compétences ne déclenchent volontairement plus de jet depuis la fiche.

Les couleurs `corps / ame / esprit` sont actuellement structurelles dans le CSS mais doivent devenir des tokens de thème propres.

## 6.4 Talents

État :

```text
FONCTIONNEL À HABILLER
```

Le nom du Talent est un bouton de jet.

Point ergonomique :

```text
tabindex="-1"
```

Cette décision protège le parcours de tabulation validé des champs numériques, mais rend les boutons de Talent non accessibles par tabulation clavier.

Ne pas modifier silencieusement ce comportement pendant la refonte.

Si l'accessibilité clavier complète des jets devient une exigence, un arbitrage sera nécessaire.

## 6.5 Blessures et Stress

État :

```text
FONCTIONNEL À HABILLER
```

Points positifs :

- valeur numérique ;
- boutons + / − ;
- nom de ressource ;
- état textuel ;
- couleur d'état ;
- `aria-label` décrivant niveau et état.

Le sens n'est donc pas transmis uniquement par couleur.

Problème pour les futurs thèmes :

les six couleurs d'état sont actuellement stockées dans :

```text
scripts/applications/character-sheet.mjs
STATE_PRESENTATION
```

et injectées dans le template comme variable CSS inline.

La logique des niveaux est fonctionnelle.

La couleur est une présentation.

Recommandation 6A.5 :

```text
conserver level + labels en JS
déplacer la palette visuelle vers des tokens CSS sémantiques
```

Aucune donnée persistée ne change.

## 6.6 Destin sur la fiche

État :

```text
NOUVEL ARBITRAGE NÉCESSAIRE
```

La réserve de Destin existe dans les données et fonctionne dans le moteur, mais aucune représentation de cette réserve n'existe actuellement dans `character-sheet.hbs`.

La Phase 06 ne doit pas ajouter silencieusement une jauge, une valeur ou un contrôle.

Avant 6B, il sera utile de décider seulement si le design final doit :

- ne rien afficher ;
- afficher la réserve en lecture seule ;
- prévoir un autre indicateur.

Toute question de rôle autorisé à voir ou modifier cette valeur doit être explicitement décidée.

## 6.7 Initiative

Comportement validé :

```text
aucun Combat actif
→ non cliquable

Combat actif + Actor absent
→ cliquable

Actor présent
→ non cliquable

Actor retiré
→ redevient cliquable
```

Ce comportement est à conserver.

Problème ergonomique démontré par le CSS :

```css
.interface-state-band__initiative-action:disabled {
  cursor: default;
  opacity: 1;
}
```

Le contrôle désactivé garde donc presque la même apparence que le contrôle actif.

La différence apparaît surtout via le hover/focus de l'état actif.

État :

```text
À AMÉLIORER
```

La Phase 06 peut améliorer l'état visuel sans toucher au service d'initiative.

## 6.8 Armes et Inventaire

État :

```text
FONCTIONNEL À HABILLER
```

La décision plus récente de Phase 03 est reflétée dans le code réel :

```text
objets ordinaires → Inventaire
armes → Armes
aucune duplication visuelle
```

Les lignes possèdent :

- vignette ;
- nom cliquable si éditable ;
- quantité ;
- formule pour les armes ;
- suppression avec confirmation.

Les données, catégories et actions doivent rester identiques.

## 6.9 Progression

État :

```text
À AMÉLIORER
```

Les choix sont présents et fonctionnels.

Les cibles sont petites et le focus visuel n'est pas explicitement traité pour tous les contrôles invisibles.

Le design peut améliorer les cibles et le focus sans changer les données.

---

# 7. Audit détaillé — Fiche Item ordinaire / arme

## 7.1 Architecture réelle

Il n'existe qu'un seul type Foundry :

```text
Item.type = equipment
```

Catégories :

```text
ordinary
weapon
```

Même template :

```text
templates/item/equipment-sheet.hbs
```

Même application :

```text
scripts/applications/equipment-sheet.mjs
```

Dimensions par défaut :

```text
560 × 620
```

## 7.2 Item ordinaire

Affiche :

- image ;
- nom ;
- catégorie ;
- quantité ;
- description ;
- autosave ;
- sauvegarde.

La zone de dégâts est remplacée par un hint.

État :

```text
FONCTIONNEL À HABILLER
```

## 7.3 Arme

Affiche en plus :

- formule de dégâts.

État :

```text
FONCTIONNEL À HABILLER
```

## 7.4 Distinction visuelle

Aujourd'hui, l'en-tête affiche toujours le libellé générique `Équipement`.

La différence ordinaire / arme est principalement lisible dans le `select` et dans l'apparition du champ de dégâts.

Pour la direction visuelle, la distinction peut être beaucoup plus forte :

- accent de catégorie ;
- badge ;
- traitement d'image ;
- bandeau ;
- iconographie ;
- traitement de la formule.

Mais sans créer de nouveau type d'Item.

Préparation recommandée en 6A.5 :

```text
data-interface-theme
+
marqueur sémantique de catégorie
```

afin que GPT Visuel puisse distinguer les deux représentations par CSS sans toucher aux données.

---

# 8. Audit détaillé — Assistant de création

Application :

```text
1180 × 900
redimensionnable
```

État :

```text
FONCTIONNEL À HABILLER
```

Les comportements validés sont présents :

- Actor créé avec état pending ;
- réouverture de l'assistant ;
- portrait ;
- répartition de Compétences ;
- jetons recommandés ;
- Talents ;
- compteurs ;
- valeurs dérivées ;
- spécialisations ;
- récapitulatif ;
- avertissements ;
- confirmation finale.

La logique ne doit pas être réécrite pour le design.

## 8.1 Densité

Le wizard présente beaucoup d'informations simultanément.

Le système de six colonnes fonctionne à grande largeur mais devient la principale zone de risque sur petites fenêtres.

## 8.2 Drag and drop

Les jetons de Compétence utilisent le drag and drop.

Ils sont des boutons sémantiques, avec état `aria-pressed` mis à jour.

Il n'existe pas de contrôle clavier dédié pour déplacer un jeton.

Cependant les valeurs de Compétence restent directement éditables au clavier, ce qui fournit une alternative fonctionnelle au geste de drag.

## 8.3 État pending et création

État fonctionnel validé à conserver.

La classe :

```text
is-creating
```

bloque les contrôles pendant la création.

Son retour visuel pourra être renforcé sans toucher au comportement.

---

# 9. Audit détaillé — Cartes D100

État fonctionnel :

```text
VALIDÉ À CONSERVER
```

État graphique :

```text
FONCTIONNEL À HABILLER
```

La carte publique contient :

- portrait ;
- nom Actor ;
- nom du jet ;
- score ;
- malus si présent ;
- résultat principal ;
- qualification ;
- marge ;
- action MJ selon contexte.

Couleurs fonctionnelles validées :

```text
échec critique                    #ff0000
échec normal / automatique        #ff006f
super échec critique (100)        #dc00c9
réussite normale / automatique    #009700
réussite critique                 #0082ff
super réussite critique (1)       #f3b600
```

Ces six couleurs ne sont pas libres pour GPT Visuel.

## 9.1 Hiérarchie

Le résultat principal est déjà fortement hiérarchisé par une taille de `3.2rem`.

La qualification et la marge reprennent la couleur fonctionnelle.

La hiérarchie est exploitable et peut être redessinée sans changer le payload.

## 9.2 Malus

Le total est visible.

Le détail est fourni par `title`.

## 9.3 Destin

Quand le Destin intervient, le `title` du résultat expose :

```text
brut
correction
final
```

Le signal permanent reste un halo.

## 9.4 Problème de hover

Le détail du résultat et le détail du malus reposent sur l'attribut HTML `title` de blocs non focusables.

Il s'agit d'un point d'accessibilité et d'ergonomie à améliorer :

```text
hover souris
→ disponible

clavier / tactile
→ accès au détail non garanti
```

Toute amélioration doit conserver strictement la projection publique déjà filtrée.

---

# 10. Audit détaillé — Cartes de dégâts

État fonctionnel :

```text
VALIDÉ À CONSERVER
```

État graphique :

```text
FONCTIONNEL À HABILLER
```

Le sélecteur contient :

- identité Actor ;
- liste d'armes issue du snapshot ;
- image ;
- nom ;
- état de formule valide/invalide ;
- zone de résultat ;
- message absence d'arme.

Le résultat de dégâts est lié au sélecteur et projeté dans celui-ci.

Le mécanisme de snapshot ne doit pas être modifié.

## 10.1 Formule invalide

Le bouton est désactivé et un texte explicite indique que les dégâts ne sont pas définis.

Le sens n'est donc pas porté uniquement par l'opacité.

## 10.2 Normal / maximum

Lorsqu'autorisé, un dialogue séparé permet le choix.

Cette fenêtre fait désormais partie du périmètre graphique de la Phase 06.

## 10.3 Réutilisabilité

La liste reste utilisable et un nouveau clic peut produire un nouveau résultat.

Le design ne doit pas donner l'impression qu'une carte est verrouillée après un premier jet.

---

# 11. Audit détaillé — Destin

## 11.1 Halo actuel

CSS :

```text
--interface-destiny-halo: rgba(0, 130, 255, 0.42)
```

avec deux `box-shadow`.

État :

```text
À AMÉLIORER
```

La couleur est très proche de la famille chromatique de la réussite critique :

```text
#0082ff
```

Le futur traitement doit donc distinguer :

```text
nature du résultat
≠
intervention du Destin
```

La distinction peut passer par :

- forme ;
- halo ;
- contour ;
- motif ;
- micro-indicateur ;
- combinaison de signaux.

Aucune information secrète supplémentaire ne doit apparaître.

## 11.2 Carte claire / sombre

Le thème actuel de carte impose un fond clair.

Il n'existe pas encore de véritable carte sombre.

La lisibilité du Destin sur un futur thème sombre devra donc être testée lorsqu'un tel thème existera.

---

# 12. Audit détaillé — Popups et fenêtres secondaires

## 12.1 Préparation du jet D100

Atteignable.

Classe système :

```text
interface
interface-preroll-dialog
```

Largeur :

```text
380 px
```

Déjà stylée :

- source ;
- trois modes ;
- slider ;
- modificateur ;
- focus explicite sur les radios invisibles.

Problème :

elle n'expose pas encore de marqueur de thème explicite lié à l'Actor.

## 12.2 Choix objet ordinaire / arme

Atteignable depuis `+` Inventaire.

`DialogV2.wait`.

État graphique :

```text
À AMÉLIORER
```

Pas de classe dédiée `interface` / thème dans l'appel actuel.

## 12.3 Confirmation de suppression

Atteignable depuis les lignes d'Item.

`DialogV2.confirm`.

État graphique :

```text
À AMÉLIORER
```

Pas de classe dédiée de thème dans l'appel actuel.

La confirmation fonctionnelle est un invariant.

## 12.4 Avertissement de création

Atteignable lors d'une répartition hors recommandations.

Classe :

```text
interface
interface-creation-warning-dialog
```

Habillage spécifique très limité.

## 12.5 Choix Talent pour Compétence

Le code du dialogue existe.

Mais le déclenchement visible du jet depuis le nom de Compétence a été retiré et validé.

Le dialogue n'est donc pas une surface active à designer en priorité.

État :

```text
REPORTÉ
```

## 12.6 Choix dégâts normaux / maximum

Atteignable sur réussite critique/super-critique.

Classe :

```text
interface
interface-damage-choice-dialog
```

Le CSS spécifique actuel se limite essentiellement au paragraphe.

État :

```text
FONCTIONNEL À HABILLER
```

## 12.7 FilePicker

Utilisé pour portrait Actor / portrait création / image Item.

Il s'agit d'une application native Foundry.

État :

```text
REPORTÉ
```

Ne pas la re-skiner dans le système.

---

# 13. Audit détaillé — Thème / skin

## 13.1 Ce qui existe

Service :

```text
scripts/services/theme-service.mjs
```

Actuellement :

```text
DEFAULT_INTERFACE_THEME = "default"

resolveActorTheme(...)
→ "default"
```

Actor :

```html
data-interface-theme="{{theme}}"
```

Toutes les cartes de chat :

```html
data-interface-theme="{{theme}}"
```

Chat CSS :

```css
.interface-chat-card[data-interface-theme="default"]
```

## 13.2 Ce qui manque pour une base multi-thèmes cohérente

Absence actuelle de marqueur de thème sur :

- fiche Item ;
- assistant de création ;
- réglages système ;
- plusieurs DialogV2 ;
- autres surfaces hors Actor/chat.

La palette principale de la fiche est déclarée globalement sur :

```css
.interface
```

et non dans une couche de thème `default`.

Plusieurs couleurs de composants sont encore codées directement dans le CSS.

Les couleurs d'états Blessures/Stress sont encore codées dans le JavaScript.

## 13.3 Conclusion

Le support multi-thèmes est :

```text
réel
mais
partiel
```

Il est suffisamment avancé pour être conservé, mais pas suffisamment normalisé pour lancer une direction visuelle multi-thèmes propre sans dette immédiate.

---

# 14. Recommandation formelle — Étape 6A.5

## 14.1 Décision recommandée

```text
6A.5 — Fondation technique multi-thèmes
→ RECOMMANDÉE AVANT GPT VISUEL
```

## 14.2 Objectifs

1. séparer structure/layout et skin ;
2. créer des tokens sémantiques ;
3. faire du thème `default` un thème explicite ;
4. exposer le contexte de thème aux surfaces système utiles ;
5. permettre la distinction Item ordinary / weapon sans nouveau DataModel ;
6. préparer l'intégration d'Electrolize sans décider encore son usage final ;
7. conserver pixel pour pixel autant que raisonnablement possible le rendu actuel pendant cette préparation ;
8. ajouter des contrôles de non-régression statiques sur l'infrastructure de thème.

## 14.3 Ne doit pas créer

```text
aucun setting
aucun flag
aucune clé DataModel
aucune migration
aucun sélecteur utilisateur
aucun UUID
aucun changement de permission
aucune modification du moteur D100
aucune modification du Destin
aucune modification de l'initiative
aucune modification de snapshot
```

## 14.4 Architecture cible de principe

```text
structure / layout
→ composants neutres

tokens sémantiques
→ papier / surface
→ texte / texte secondaire
→ bordure
→ accent
→ corps / âme / esprit
→ états
→ actions
→ danger
→ focus
→ Destin
→ cartes de chat

theme default
→ valeurs des tokens

futur theme X
→ autres valeurs des mêmes tokens
```

La présence de plusieurs thèmes ne doit jamais changer le sens fonctionnel des composants.

---

# 15. Responsive

État :

```text
À AMÉLIORER
```

## 15.1 Ce qui existe

Media queries :

```text
760 px
560 px
980 px
700 px
```

## 15.2 Risque réel

Ces media queries sont basées sur la largeur du viewport du navigateur.

Une fenêtre Foundry peut être redimensionnée indépendamment du viewport.

Exemple :

```text
viewport navigateur : 1920 px
fenêtre Actor : 500 px
```

Dans ce cas, `@media (max-width: 560px)` ne s'active pas forcément.

Conséquence :

le responsive actuel peut fonctionner lorsque tout le navigateur est étroit mais ne pas répondre correctement à une fenêtre Foundry étroite sur un grand écran.

Ce point doit être confirmé dans Foundry.

Pour la Phase 06, il faudra privilégier une stratégie adaptée à la largeur réelle de l'application, par exemple via composants intrinsèques ou container queries si leur usage est compatible avec la cible Foundry.

---

# 16. Accessibilité et lisibilité — risques concrets

L'audit n'est pas une certification.

## Points déjà satisfaisants

- labels textuels pour Blessures et Stress en plus des couleurs ;
- qualification textuelle D100 en plus de la couleur ;
- arme invalide accompagnée d'un texte ;
- boutons +/− avec `aria-label` ;
- boutons ajout/suppression avec `aria-label` ;
- `<details>/<summary>` natifs pour les sections ;
- alt des portraits ;
- focus explicite sur le sélecteur de mode du pré-lancer.

## Points à améliorer

### 16.1 Hover indispensable

Détail D100 :

```text
title sur résultat
```

Détail Malus :

```text
title
```

Ces informations sont difficiles à obtenir au tactile et ne sont pas naturellement atteignables au clavier.

### 16.2 Initiative

L'état non cliquable n'est pas suffisamment explicite visuellement.

### 16.3 Petites cibles

Bouton `+` de section :

```text
1.55rem
```

Suppression Item :

```text
1.75rem
```

Ces cibles sont faibles pour le tactile et peuvent être affinées même pour un usage souris.

### 16.4 Talents

Les boutons de jet sont volontairement retirés du parcours Tab.

Ne pas changer sans arbitrage.

### 16.5 Progression

Les inputs sont visuellement cachés.

L'état sélectionné est visible, mais un traitement `focus-visible` plus explicite sera utile.

---

# 17. Inventaire technique UI

## 17.1 Templates

```text
templates/actor/character-sheet.hbs
templates/actor/character-creation.hbs
templates/item/equipment-sheet.hbs
templates/settings/interface-settings.hbs

templates/chat/d100-result.hbs
templates/chat/d100-gm-detail.hbs
templates/chat/weapon-selector.hbs
templates/chat/damage-result.hbs
```

## 17.2 CSS

```text
styles/interface.css
```

Un seul fichier contient actuellement :

- layout ;
- composants ;
- responsive ;
- couleurs ;
- dialogs ;
- wizard ;
- chat ;
- thème `default` des cartes.

Cela fonctionne pour la V0 actuelle mais justifie une meilleure séparation conceptuelle par tokens avant multiplication des thèmes.

Aucune nécessité immédiate de multiplier physiquement les fichiers CSS n'est démontrée par l'audit ; ce choix peut rester une décision d'implémentation 6A.5.

## 17.3 Applications

```text
InterfaceCharacterSheet
InterfaceEquipmentSheet
InterfaceCharacterCreationApplication
InterfaceSettingsApplication
```

Technologies :

```text
ApplicationV2
ActorSheetV2
ItemSheetV2
HandlebarsApplicationMixin
DialogV2
FilePicker
```

## 17.4 Chat

```text
ChatMessage natif
flags.interface.card
schema = 1
renderChatMessageHTML
```

Types :

```text
d100-result
d100-gm-detail
weapon-selector
damage-result
initiative (réservé, pas de carte custom actuelle)
```

## 17.5 Services avec impact UI

```text
theme-service.mjs
initiative-service.mjs
damage-service.mjs
weapon-snapshot-service.mjs
chat-message-service.mjs
chat-card-controller.mjs
chat-card-data.mjs
```

## 17.6 Traductions

```text
lang/fr.json
267 chaînes terminales
aucune valeur vide détectée
```

## 17.7 Dépendances visuelles réelles

- CSS natif ;
- Handlebars ;
- Font Awesome fourni par l'environnement Foundry pour les icônes `fa-solid` ;
- aucun framework CSS externe ;
- aucune police custom actuellement chargée par le système.

---

# 18. Inventaire des assets

## 18.1 Assets UI / fallback

| Chemin | Dimensions | Format | Usage réel | Statut | Remplaçable sans impact fonctionnel |
|---|---:|---|---|---|---|
| `assets/actor/avatar-default.webp` | 500×500 | WebP | fallback Actor et portrait chat | utilisé | oui si chemin conservé |
| `assets/items/item_default.webp` | 314×314 | WebP | fallback Item ordinary | utilisé | oui si chemin conservé |
| `assets/items/weapon_default.webp` | 314×314 | WebP | fallback Item weapon | utilisé | oui si chemin conservé |
| `assets/banners/banniere_item.webp` | 2172×724 | WebP | aucun usage runtime actuel identifié | dormant | oui |
| `assets/banners/banniere_armes.webp` | 2172×724 | WebP | aucun usage runtime actuel identifié | dormant | oui |
| `assets/system-background.webp` | 1672×941 | WebP | aucun usage runtime autoritatif identifié | dormant | oui |

Si un chemin de fallback est renommé, `scripts/constants.mjs` et les contrôles associés doivent être mis à jour. Pour un simple remplacement graphique au même chemin, aucun changement de donnée persistée n'est nécessaire.

## 18.2 Assets de contenu des compendiums

```text
60 images d'objets
42 images d'armes
total : 102
```

Armes :

```text
42 × 1024×1024
```

Objets :

- mélange de 300×300 environ ;
- 20 images 1024×1024 ;
- quelques écarts 299×300 / 300×299 / 298×300 / 300×298.

Ces images sont liées aux sources `packs-src/`.

Elles sont des assets de contenu, pas des skins UI.

Les compendiums étant volontairement désactivés pendant le développement, aucune refonte de ces 102 images n'est nécessaire pour préparer le thème.

## 18.3 Icônes

Aucun pack d'icônes custom UI n'est présent.

Les icônes actuelles sont principalement des classes Font Awesome de Foundry.

---

# 19. Contraintes à transmettre à GPT Visuel

GPT Visuel peut redessiner :

- identité globale ;
- surfaces ;
- bordures ;
- volumes ;
- typographie ;
- espacements dans les limites du layout fonctionnel ;
- boutons ;
- états visuels ;
- sections repliables ;
- cartes de Compétences/Talents ;
- bande Blessures/Initiative/Stress ;
- présentation Combat ;
- listes Armes / Inventaire ;
- Progression ;
- Item ordinaire ;
- Item arme ;
- assistant de création ;
- réglages ;
- popups système ;
- cartes D100 ;
- cartes MJ ;
- cartes dégâts ;
- halo Destin ;
- usage d'Electrolize ;
- assets fallback si l'utilisateur le décide.

GPT Visuel ne doit pas modifier :

- types Actor/Item ;
- catégories ;
- schéma ;
- settings ;
- flags ;
- permissions ;
- moteur D100 ;
- règles du Destin ;
- snapshot d'armes ;
- formule d'initiative ;
- comportement de l'initiative ;
- logique du wizard ;
- actions de dégâts ;
- confidentialité ;
- réutilisabilité des cartes ;
- couleurs fonctionnelles D100 sans arbitrage.

## Invariants visuels qui doivent survivre à tous les thèmes

Un futur thème doit toujours permettre d'identifier :

- élément cliquable ;
- élément désactivé ;
- focus ;
- danger / suppression ;
- état de ressource ;
- distinction ordinaire / arme ;
- formule de dégâts ;
- succès / échec ;
- critique / super-critique ;
- intervention du Destin ;
- dégâts normaux / maximum ;
- information MJ ;
- message d'erreur / absence ;
- lecture seule.

---

# 20. Captures nécessaires pour GPT Visuel

Les captures devront être réalisées dans Foundry VTT V14 sur la base auditée ou sur la base 6A.5 si celle-ci préserve le rendu.

## Capture A — Actor propriétaire — haut de fiche

```text
largeur fenêtre : 860 px
hauteur : 880 px
montrer :
portrait
identité
6 Compétences
Blessures / Initiative / Stress
```

## Capture B — Actor propriétaire — sections ouvertes

```text
largeur : 860 px
ouvrir :
Talents
Combat
Armes
Inventaire
```

Faire apparaître au moins :

- une arme ;
- un objet ordinaire ;
- une valeur dérivée custom si disponible.

## Capture C — Actor lecture seule

```text
largeur : 860 px
mêmes zones principales
```

Objectif : comparer propriétaire / observateur.

## Capture D — Actor fenêtre étroite

```text
viser environ 560 px de largeur réelle de fenêtre Foundry
```

Objectif : documenter les débordements réels avant correction responsive.

## Capture E — Item ordinaire

```text
560 × 620
```

## Capture F — Arme

```text
560 × 620
avec formule de dégâts visible
```

## Capture G — Assistant de création

```text
1180 × 900
état représentatif avec jetons et Talents renseignés
```

## Capture H — Popups système

Une planche ou plusieurs captures comprenant :

- préparation D100 ;
- choix objet / arme ;
- confirmation suppression ;
- avertissement création ;
- choix dégâts normal / maximum.

## Capture I — D100 réussite ordinaire

Chat à largeur normale.

## Capture J — D100 critique + intervention du Destin

Doit rendre visible le halo actuel.

## Capture K — D100 échec de conflit côté MJ

Avec action :

```text
Permettre les dégâts
```

## Capture L — Carte dégâts

Avec :

- plusieurs armes ;
- une formule invalide si possible ;
- résultat déjà projeté.

## Capture M — Réglages système

Fenêtre complète.

Ces captures couvrent les surfaces réellement utiles sans demander un catalogue de tous les cas D100.

---

# 21. Arbitrages potentiels à conserver pour l'utilisateur

Aucun de ces arbitrages ne bloque la préparation technique 6A.5.

## A1 — Destin sur la fiche Actor

Décider avant la direction visuelle finale si la réserve doit être visible sur la fiche.

## A2 — Source future du choix de thème

À décider uniquement lorsque la fonctionnalité de sélection de thème sera réellement développée.

Possibilités futures non arbitrées :

- monde ;
- utilisateur ;
- Actor ;
- autre source.

Ne rien persister en 6A.5.

## A3 — Accessibilité clavier des boutons Talent

Le `tabindex="-1"` actuel est validé pour le parcours des champs.

Ne le modifier qu'après arbitrage si l'objectif d'accessibilité clavier impose un nouveau parcours.

---

# 22. Recommandation de séquencement

```text
6A — Audit
→ TERMINÉ

6A.5 — Fondation technique multi-thèmes
→ GPT Foundry
→ prochaine étape recommandée

6B — Direction visuelle
→ GPT Visuel

6C — Intégration technique
→ GPT Foundry

6D — Tests et consolidation
→ utilisateur + GPT Foundry
→ clôture GPT Pilote
```

## 22.1 Ce que GPT Visuel devra recevoir

- présent audit ;
- captures A à M utiles ;
- définition des tokens issue de 6A.5 ;
- palette fonctionnelle D100 à conserver ;
- fichier Electrolize et statut de licence transmis par l'utilisateur ;
- contraintes Actor / Item / wizard / chat / dialogs ;
- indication claire de la distinction ordinary / weapon sans nouveau type d'Item.

## 22.2 Ce que GPT Visuel devra produire

- direction visuelle principale ;
- vocabulaire de composants ;
- typographie ;
- traitement Actor ;
- traitement Items ordinary / weapon ;
- traitement assistant ;
- traitement popups ;
- traitement cartes D100/dégâts ;
- traitement Destin ;
- états actifs/inactifs/focus/erreur/lecture seule ;
- règles de déclinaison compatibles avec plusieurs thèmes.

## 22.3 Ce qui reviendra à GPT Foundry

- traduction du design en HTML/CSS ;
- intégration dans ApplicationV2 / sheets / DialogV2 ;
- sécurité des actions ;
- non-régression ;
- responsive ;
- tests Foundry ;
- conservation des invariants ;
- implémentation éventuelle d'un futur sélecteur de thème seulement après arbitrage séparé.

---

# 23. Conclusion de l'audit

La Phase 06 ne part pas d'une interface vide.

La base est fonctionnelle et déjà riche.

Le problème principal avant direction visuelle est maintenant clairement identifié :

> **le système possède un début d'architecture de thème, mais la couche visuelle n'est pas encore suffisamment centralisée ni appliquée à toutes les surfaces pour accueillir proprement plusieurs thèmes.**

La création d'une étape **6A.5 — Fondation technique multi-thèmes** est donc justifiée.

Cette étape peut être réalisée sans :

- modifier le schéma ;
- ajouter de persistance ;
- toucher aux règles ;
- changer les permissions ;
- publier ;
- réactiver les compendiums.

Après 6A.5, GPT Visuel pourra travailler sur une base technique conçue pour recevoir une identité forte sans créer immédiatement une dette de thème.

---

# 24. État à la sortie de 6A

```text
Audit statique : TERMINÉ
Tests hors Foundry : OK
Tests visuels Foundry Phase 06 : NON ENCORE EXÉCUTÉS
Fichiers système modifiés : AUCUN
6A.5 : RECOMMANDÉE ET DÉJÀ ACCEPTÉE PAR L'UTILISATEUR
Prochaine action : implémenter la fondation technique multi-thèmes sans changement visuel volontaire
```
