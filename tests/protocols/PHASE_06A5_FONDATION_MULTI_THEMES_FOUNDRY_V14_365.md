# Protocole Foundry VTT — Phase 06A.5 — Fondation technique multi-thèmes

## Cible

```text
Projet : DEV-interface
Package : interface
Version package : 0.1.0
Foundry VTT : V14
Base de référence avant 6A.5 :
1c8dde5f2f9b8855ca2e886a919619f1b5d1961e
```

## Objectif

Valider dans Foundry que l'ajout de la fondation multi-thèmes :

- ne casse aucun comportement fonctionnel validé ;
- ne provoque aucun changement visuel volontaire majeur ;
- conserve les couleurs fonctionnelles D100 ;
- conserve les états Blessures / Stress ;
- conserve l'initiative ;
- conserve le wizard ;
- conserve les Items ordinary / weapon ;
- conserve les cartes et dégâts ;
- ne crée aucun réglage ou choix de thème visible.

Cette étape ne valide pas encore le futur design de Phase 6B / 6C.

---

# Préparation

1. Faire une sauvegarde du monde de test.
2. Installer/remplacer le dossier du système par la candidate 6A.5.
3. Vérifier que le dossier contient bien :
   - `fonts/Electrolize.woff2`
   - `styles/interface.css`
   - les scripts et templates habituels.
4. Démarrer Foundry VTT V14.
5. Ouvrir le monde de test utilisé en Phase 05.
6. Ouvrir la console navigateur.
7. Vérifier l'absence d'erreur rouge au chargement du système.

Résultat attendu :

```text
système chargé
monde ouvert
aucune erreur nouvelle liée à Interface
aucun menu ou réglage de thème ajouté
```

---

# T01 — Fiche Actor propriétaire

1. Ouvrir un Actor existant en tant que MJ/propriétaire.
2. Vérifier le portrait, l'identité, les Compétences, Blessures, Initiative, Stress.
3. Ouvrir Talents, Combat, Armes et Inventaire.
4. Modifier un champ non critique puis vérifier l'autosave.

Attendu :

- rendu global très proche de la Phase 05 ;
- aucun bloc disparu ;
- aucun changement de police visible imposé par 6A.5 ;
- autosave inchangé ;
- aucune indication de thème visible.

---

# T02 — Blessures / Stress

1. Faire varier Blessures de 0 à 5 paliers.
2. Faire varier Stress de 0 à 5 paliers.
3. Vérifier libellés et couleurs.

Attendu :

- mêmes six couleurs qu'avant 6A.5 ;
- mêmes libellés ;
- mêmes niveaux ;
- aucune valeur persistée supplémentaire.

---

# T03 — Initiative

Tester successivement :

1. aucun Combat actif ;
2. Combat actif et Actor absent ;
3. Actor ajouté au Combat ;
4. Actor retiré du Combat.

Attendu :

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

Aucun changement fonctionnel n'est attendu en 6A.5.

---

# T04 — Item ordinaire

1. Ouvrir un objet ordinaire existant.
2. Vérifier image, nom, catégorie, quantité, description.
3. Modifier quantité ou description.
4. Fermer et rouvrir.

Attendu :

- fonctionnement identique ;
- catégorie `ordinary` conservée ;
- aucune nouvelle donnée visible ;
- aucune nouvelle typographie imposée.

---

# T05 — Arme

1. Ouvrir une arme existante.
2. Vérifier image, nom, catégorie, quantité et formule de dégâts.
3. Modifier un champ non critique puis rouvrir.

Attendu :

- fonctionnement identique ;
- catégorie `weapon` conservée ;
- formule inchangée ;
- aucun nouveau type d'Item.

---

# T06 — Assistant de création

1. Créer un nouvel Actor.
2. Ouvrir l'assistant.
3. Vérifier portrait, identité, jetons, Compétences, Talents, compteurs et récapitulatif.
4. Provoquer volontairement un avertissement de répartition.
5. Tester « Retour », puis rouvrir l'avertissement et confirmer.

Attendu :

- wizard inchangé fonctionnellement ;
- avertissement toujours fonctionnel ;
- aucun choix de thème ;
- aucune modification de la logique pending.

---

# T07 — Réglages système

1. Ouvrir les réglages Interface.
2. Vérifier les valeurs existantes.
3. Ne modifier aucune règle si ce n'est pas nécessaire.
4. Vérifier que le bouton de valeurs par défaut et la sauvegarde se présentent comme avant.

Attendu :

- aucune entrée « thème » ;
- settings existants inchangés ;
- fenêtre rendue normalement.

---

# T08 — Préparation D100

1. Depuis un Talent, lancer un jet.
2. Vérifier la popup de préparation.
3. Tester Désavantage / Normal / Avantage.
4. Tester le slider et un modificateur numérique.
5. Lancer le jet.

Attendu :

- popup fonctionnelle ;
- slider fonctionnel ;
- résultat D100 conforme ;
- aucune différence métier.

---

# T09 — Choix objet / arme

1. Depuis Inventaire, cliquer sur le bouton d'ajout qui ouvre le choix.
2. Vérifier la popup.
3. Annuler.
4. Recommencer et créer un objet.
5. Recommencer et créer une arme.

Attendu :

- popup fonctionnelle ;
- `ordinary` crée un objet ordinaire ;
- `weapon` crée une arme ;
- Item.type reste `equipment`.

---

# T10 — Confirmation suppression

1. Sur une ligne d'Item embarqué, demander la suppression.
2. Annuler une première fois.
3. Recommencer et confirmer sur un Item de test.

Attendu :

- annulation ne supprime rien ;
- confirmation supprime uniquement l'Item choisi ;
- popup fonctionnelle et lisible.

---

# T11 — Carte D100

Produire au moins :

1. réussite normale ;
2. échec normal ;
3. critique si un cas de test connu permet de l'obtenir ;
4. cas avec intervention du Destin si reproductible dans le monde de test.

Attendu :

couleurs fonctionnelles inchangées :

```text
échec critique                    #ff0000
échec normal / automatique        #ff006f
super échec critique (100)        #dc00c9
réussite normale / automatique    #009700
réussite critique                 #0082ff
super réussite critique (1)       #f3b600
```

Le halo Destin doit rester visuellement proche de la Phase 05 ; son amélioration est reportée à 6B/6C.

---

# T12 — Dégâts

1. Obtenir une carte permettant les dégâts.
2. Ouvrir le choix dégâts normaux / maximum lorsqu'il est autorisé.
3. Tester dégâts normaux.
4. Tester dégâts maximum.
5. Vérifier la projection du résultat dans la carte de sélection.

Attendu :

- popup normal/maximum fonctionnelle ;
- snapshot d'arme inchangé ;
- calcul et résultat inchangés ;
- carte réutilisable comme en Phase 05.

---

# T13 — Vérification visuelle rapide des contextes

Dans l'inspecteur DOM, uniquement si l'utilisateur souhaite vérifier la fondation technique :

- Actor : `data-interface-theme="default"` ;
- Item : `data-interface-theme="default"` et `data-interface-item-category="ordinary|weapon"` ;
- wizard : `data-interface-theme="default"` ;
- settings : `data-interface-theme="default"` ;
- cartes de chat : `data-interface-theme="default"` ;
- DialogV2 concernés : classe `interface-theme--default`.

Cette vérification n'est pas nécessaire pour l'usage normal, mais elle confirme la fondation.

---

# Résultat à renvoyer à GPT Foundry

Répondre de préférence sous cette forme :

```text
Foundry : 14.xxx
Monde : existant / neuf
Rôle testé : MJ / joueur

T01 Actor : OK / KO
T02 Blessures-Stress : OK / KO
T03 Initiative : OK / KO
T04 Item ordinaire : OK / KO
T05 Arme : OK / KO
T06 Wizard : OK / KO
T07 Settings : OK / KO
T08 Preroll : OK / KO
T09 Choix objet/arme : OK / KO
T10 Suppression : OK / KO
T11 D100 : OK / KO
T12 Dégâts : OK / KO
T13 Marqueurs DOM : OK / non vérifié

Console :
- aucune erreur
ou
- copier l'erreur exacte

Écart visuel inattendu :
- aucun
ou
- capture + description
```

Ne pas considérer 6A.5 comme validée dans Foundry avant ce retour utilisateur.
