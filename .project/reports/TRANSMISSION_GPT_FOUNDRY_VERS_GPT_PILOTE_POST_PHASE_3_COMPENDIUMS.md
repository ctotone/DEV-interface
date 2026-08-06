# Transmission — GPT Foundry vers GPT Pilote

## Travaux postérieurs à la clôture de la Phase 3

**Date :** 6 août 2026  
**Émetteur :** GPT Foundry — Développement Foundry  
**Destinataire :** GPT Pilote — Direction de projets IA  
**Projet :** Système D100 Interface  
**Nature :** transmission opérationnelle post-Phase 3  
**Statut :** travaux réalisés et validés par l’utilisateur dans Foundry VTT  
**Publication :** non engagée

---

# 1. Objet de la transmission

Après la clôture de la Phase 3 par GPT Pilote, une intervention technique indépendante a été réalisée avant l’ouverture de la Phase 4.

Cette intervention a porté sur :

- l’intégration de deux compendiums natifs au système Interface ;
- la création de leurs contenus, dossiers, images et bannières ;
- la mise en place d’une source de vérité reconstructible pour les packs ;
- le renforcement des contrôles automatiques du projet ;
- la correction d’un défaut d’affichage des descriptions ;
- la validation réelle dans Foundry VTT 14.365.

Cette intervention ne rouvre pas la Phase 3 et ne constitue pas à elle seule l’ouverture de la Phase 4.

GPT Pilote doit qualifier son rattachement documentaire : travail intercalaire post-Phase 3, prérequis de Phase 4 ou tranche autonome de contenu système.

---

# 2. Identité et base technique

```text
Type de package : système Foundry VTT
ID du package   : interface
Version package : 0.1.0
Foundry ciblé   : 14.365
Compatibilité manifeste : minimum 14 / verified 14 / maximum 14
Dépôt déclaré   : ctotone/DEV-interface
Branche observée dans l’archive entrante : main
Commit observé dans l’archive entrante :
7d7e7d7cb994951fa41cba9f6520a591900c7dfe
```

Archive entrante utilisée comme base :

```text
interface(20260806-203853).zip
SHA-256 :
552168b76175f4d44385afc7ae99c47bb0146401441d344fc1f651a8cf76f530
```

Candidate finale validée par l’utilisateur :

```text
interface-0.1.0-compendiums-descriptions-texte-brut.zip
SHA-256 :
9010b26f95bdb046ef134bd6a3b1df5ffec61cebeaf40c54bbd6daa656c2a286
Racine de l’archive : interface/
Nombre de fichiers : 299
```

Aucun commit, push, tag, release GitHub ou acte de publication n’a été réalisé par GPT Foundry.

---

# 3. Résultat fonctionnel livré

## 3.1 Compendium Objets

```text
Titre visible : Objets
ID technique  : objects
Collection    : interface.objects
Chemin        : packs/objects
Document      : Item
Type Item     : equipment
Catégorie     : ordinary
Quantité      : 1
Entrées       : 60
Dossiers      : 8
Bannière      : systems/interface/assets/banners/banniere_item.webp
```

Dossiers validés :

```text
EXPLORATION, ORIENTATION
CAMPEMENT ET SURVIE
OUTILS
SOINS ET PROTECTION
COMMUNICATION
INVESTIGATION
INFILTRATION
ÉQUIPEMENT TECHNIQUE
```

## 3.2 Compendium Armes

```text
Titre visible : Armes
ID technique  : weapons
Collection    : interface.weapons
Chemin        : packs/weapons
Document      : Item
Type Item     : equipment
Catégorie     : weapon
Quantité      : 1
Entrées       : 42
Dossiers      : 3
Bannière      : systems/interface/assets/banners/banniere_armes.webp
```

Dossiers validés :

```text
ARMES ANCIENNES
ARMES MODERNES
ARMES FUTURISTES
```

## 3.3 Sources de contenu

Les contenus intégrés proviennent des deux propositions V2 validées pour cette opération :

```text
PROPOSITION_V2_COMPENDIUM_OBJETS_D100_INTERFACE.md
PROPOSITION_V2_COMPENDIUM_ARMES_D100_INTERFACE.md
```

Les prompts de génération d’images ne sont pas intégrés aux descriptions visibles.

## 3.4 Arbitrage particulier

Décision explicite de l’utilisateur :

```text
Nom source initial : Mitrailleuse légère
Nom final intégré  : Mitrailleuse lourde
Formule conservée  : 3D6+1
```

Cette décision modifie le nom de l’entrée intégrée, sans modifier sa formule ni sa description fonctionnelle.

---

# 4. Descriptions en texte brut

La première candidate enregistrait les descriptions sous la forme :

```html
<p>Description de l’objet.</p>
```

La fiche Item actuelle affiche la description dans une zone de texte simple. Les balises étaient donc visibles et inutiles.

Après le retour utilisateur, les 102 descriptions ont été corrigées en texte brut :

```text
Description de l’objet.
```

Le constructeur des packs et le contrôle statique refusent désormais toute balise HTML dans ces descriptions.

Cette correction a été validée par le test Foundry T11.

---

# 5. Données persistées et compatibilité

L’intervention n’introduit aucun changement de :

- DataModel ;
- schéma ;
- version de schéma ;
- type d’Actor ;
- type d’Item ;
- flag ;
- setting ;
- socket ;
- permission personnalisée ;
- dépendance ;
- API publique ;
- migration.

Les nouveaux éléments persistants sont les compendiums eux-mêmes et leurs Documents.

Les identifiants suivants sont désormais structurants et ne doivent pas être renommés silencieusement :

```text
interface.objects
interface.weapons
```

Les IDs des 102 Items et les IDs des 11 dossiers sont stables dans les sources de packs.

---

# 6. Fichiers principaux créés ou modifiés

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
tests/static/smoke-import.mjs

tests/unit/character-creation.test.mjs
tests/unit/d100-engine.test.mjs
tests/unit/derived-values.test.mjs

tests/protocols/COMPENDIUMS_SYSTEME_FOUNDRY_V14_365.md

.project/decisions/COMPENDIUMS_SYSTEME_OBJETS_ARMES.md
.project/reports/COMPENDIUMS_SYSTEME_CANDIDATE.md
.project/references/compendiums/
```

---

# 7. Chaîne de production ajoutée

## 7.1 Sources humaines

Les Documents des compendiums sont conservés sous forme lisible dans :

```text
packs-src/objects/
packs-src/weapons/
```

Ces sources permettent de relire, comparer et modifier le contenu sans travailler directement dans les bases de packs installables.

## 7.2 Construction des packs

```text
tools/build-compendiums.mjs
```

Cet outil reconstruit :

```text
packs/objects/
packs/weapons/
```

Il vérifie notamment :

- le nombre d’Items et de dossiers ;
- les identifiants ;
- les catégories ;
- les formules de dégâts ;
- les chemins d’images ;
- la présence des descriptions ;
- l’absence de balises HTML ;
- la cohérence entre sources et packs produits.

## 7.3 Contrôles du projet

```text
tests/static/check-project.mjs
tests/static/smoke-import.mjs
```

Le premier vérifie les invariants du projet, le manifeste, les chemins, les assets, les packs et plusieurs structures internes.

Le second réalise un chargement isolé des modules JavaScript dans un environnement simulé. Il ne remplace pas Foundry, mais détecte des erreurs d’import ou d’initialisation avant les tests réels.

## 7.4 Tests unitaires

```text
tests/unit/d100-engine.test.mjs
tests/unit/derived-values.test.mjs
tests/unit/character-creation.test.mjs
```

Ils couvrent respectivement :

- le moteur D100 ;
- les valeurs dérivées ;
- des calculs et invariants de création de personnage.

---

# 8. Résultats des contrôles et validations

## 8.1 Contrôles hors Foundry

Résultat final après reconstruction et extraction de l’archive :

```text
Armes  : 42 Items, 3 dossiers, 45 entrées compilées
Objets : 60 Items, 8 dossiers, 68 entrées compilées

Descriptions : 102 textes bruts
Balises HTML : 0

Contrôles hors Foundry : 718 réussis
Modules JavaScript vérifiés : 22
Tests unitaires exécutés : 3
Chargement isolé et enregistrements init simulés : OK
```

## 8.2 Validation réelle Foundry

Environnement déclaré :

```text
Foundry VTT 14.365
Rôle : MJ
```

Résultats utilisateur :

```text
T1 à T10 : OK
T11       : OK
```

Les tests ont couvert :

- le chargement du système sans erreur liée aux packs ;
- les titres et bannières ;
- les 11 dossiers ;
- les 102 entrées ;
- l’arbitrage Mitrailleuse lourde ;
- l’ouverture des Items ;
- les catégories et formules ;
- le glisser-déposer vers un Actor ;
- la séparation Inventaire / Armes ;
- l’indépendance des copies embarquées ;
- la persistance après redémarrage ;
- la présence dans un monde neuf ;
- l’absence de balises HTML visibles.

La candidate est donc validée par l’utilisateur dans Foundry VTT 14.365.

---

# 9. Outillage transversal identifié

L’intervention a confirmé l’intérêt de distinguer :

## 9.1 Outils potentiellement génériques

- validation de manifeste ;
- validation des chemins et assets ;
- test de chargement isolé des modules ;
- structure de tests unitaires ;
- modèle de protocole Foundry ;
- construction de compendiums depuis des sources lisibles ;
- validation des IDs, dossiers, images et descriptions ;
- contrôle d’une archive candidate après extraction ;
- génération de rapports techniques.

## 9.2 Contrôles propres à Interface

- types `character` et `equipment` ;
- catégories `ordinary` et `weapon` ;
- moteur D100 ;
- Compétences et Talents ;
- `flags.interface.creation.pending` ;
- packs `interface.objects` et `interface.weapons` ;
- quantités, formules et comptes propres aux catalogues Interface.

## 9.3 Préconisation

Ne pas transformer immédiatement ces fichiers en framework universel.

Préparer plutôt une extraction progressive :

```text
noyau générique
+ configuration par projet
+ assertions métier propres au projet
```

Un REX séparé est transmis à GPT Architecte afin qu’il évalue l’intérêt d’un espace de stockage transversal privé pour ces outils.

---

# 10. Risques et limites

- La candidate validée n’est pas encore reliée à un nouveau commit communiqué.
- La version package reste `0.1.0` ; aucune décision de changement de version n’a été prise.
- La compatibilité réelle n’est validée que sous Foundry VTT 14.365.
- Les identifiants des packs ne doivent plus être renommés sans migration et analyse d’impact.
- Une reconstruction des packs doit toujours partir de `packs-src/` et être suivie des contrôles.
- Les outils automatiques ne remplacent pas les tests MJ, joueur ou multijoueur.
- Aucun audit de publication, de catalogue Foundry ou de droits des assets n’a été réalisé dans cette intervention.
- Aucune validation joueur ou multijoueur spécifique des compendiums n’a été exécutée ; le périmètre validé est l’usage MJ et le glisser-déposer testé.
- La réutilisabilité des outils dans un autre projet n’est pas encore démontrée par un second cas réel.

---

# 11. Décisions attendues de GPT Pilote

GPT Pilote doit :

1. qualifier cette intervention dans la mémoire du projet ;
2. enregistrer la candidate validée comme nouvelle base réelle de reprise, après confirmation du commit intégré par l’utilisateur ;
3. décider si la Phase 4 démarre directement depuis cette base ;
4. éviter de refaire les compendiums ou leur chaîne de production ;
5. relier le REX d’outillage transversal à GPT Architecte ;
6. ne pas assimiler cette validation à une publication.

---

# 12. Prochaine action utile

```text
Utilisateur
→ intégrer la candidate validée dans le dépôt
→ effectuer le commit et le push selon son workflow
→ communiquer le hash résultant à GPT Pilote

GPT Pilote
→ mettre à jour l’état et la transmission courante
→ qualifier le travail post-Phase 3
→ recalibrer puis ouvrir la Phase 4
```

---

# 13. Fichiers d’autorité à consulter

Dans la candidate :

```text
.project/TRANSMISSION_CURRENT.md
.project/PROJECT_STATE.md
.project/ROADMAP.md
.project/decisions/COMPENDIUMS_SYSTEME_OBJETS_ARMES.md
.project/reports/COMPENDIUMS_SYSTEME_CANDIDATE.md
tests/protocols/COMPENDIUMS_SYSTEME_FOUNDRY_V14_365.md
system.json
```

Référentiels méthodologiques pertinents :

```text
00 - CHARTE GENERALE - Collaboration équipe IA.md
02 - RÉFÉRENTIEL - Pilote.md
04 - RÉFÉRENTIEL - Code.md
05 - RÉFÉRENTIEL - Foundry.md
05.1 - RÉFÉRENTIEL - Foundry - Publication.md
```
