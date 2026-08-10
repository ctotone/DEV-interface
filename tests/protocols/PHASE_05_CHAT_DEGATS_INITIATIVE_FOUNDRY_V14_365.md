# Protocole Foundry — Phase 05 — Chat, dégâts et initiative

**Version ciblée :** Foundry VTT V14  
**Build de référence :** 14.365  
**Statut :** à exécuter par l’utilisateur  
**Précondition :** sauvegarde du monde de test avant essais multijoueurs.

## A. Préparation

1. Installer la candidate Phase 05 dans le dossier `Data/systems/interface`.
2. Démarrer Foundry VTT 14.365.
3. Ouvrir un monde utilisant `interface`.
4. Vérifier l’absence d’erreur console au chargement.
5. Préparer :
   - un MJ ;
   - un joueur propriétaire d’un Actor ;
   - si possible un joueur non propriétaire ;
   - un Actor avec portrait, valeurs D100 connues et au moins deux armes ;
   - une arme avec formule valide ;
   - une arme sans formule ou avec formule volontairement invalide.

Résultat attendu : le système se charge ; aucun compendium `interface.objects` ou `interface.weapons` n’est attendu pendant le développement.

## B. Carte D100 standard

### B1 — Jet normal

1. Depuis la fiche, lancer un jet standard.
2. Contrôler la carte.

Attendu :

- portrait à gauche ;
- nom de l’Actor ;
- nom du Talent sous forme `Nom du jet (score)` ;
- aucune représentation `Compétence + Talent` ;
- résultat D100 central ;
- qualification ;
- marge seulement si elle est supérieure à `0` ;
- hauteur adaptée au contenu.

### B2 — Malus

1. Produire un état avec Blessures et/ou Stress.
2. Ajouter si utile un malus manuel de jet.
3. Lancer.
4. Survoler `Malus (xx)`.

Attendu :

- la ligne n’existe pas lorsque tous les malus sont nuls ;
- elle existe lorsque le total est non nul ;
- le survol ne montre que les composantes non nulles parmi :
  - `Blessure : xx` ;
  - `Stress : xx` ;
  - `Malus de jet : xx`.

### B3 — Avantage / désavantage

1. Lancer une fois avec avantage.
2. Lancer une fois avec désavantage.
3. Survoler le grand résultat.

Attendu : les deux résultats naturels sont affichés dans l’infobulle.

### B4 — Destin

1. Configurer un cas où le Destin peut intervenir.
2. Obtenir une intervention.
3. Contrôler la carte publique.
4. Survoler le résultat.

Attendu :

- léger halo bleu ;
- résultat définitif affiché ;
- infobulle avec résultat initial et correction du Destin ;
- aucun jet secret, chance secrète ou diagnostic MJ dans la carte publique.

Pour un jet effectué depuis un client MJ, contrôler la carte chuchotée
`Détail MJ — Destin`.

Attendu : le diagnostic secret n’est visible que par les MJ.

Pour un jet effectué depuis un client joueur, aucun détail secret persistant
supplémentaire n’est créé par cette candidate : sans canal autoritaire/socket,
le joueur auteur d’un whisper pourrait voir son propre message. Le secret ne
doit donc jamais être copié dans un ChatMessage public pour contourner cette
limite.

### B5 — Couleurs

Forcer ou reproduire les six familles suivantes :

```text
échec critique                    #ff0000
échec normal / automatique        #ff006f
super échec critique (100)        #dc00c9
réussite normale / automatique    #009700
réussite critique                 #0082ff
super réussite critique (1)       #f3b600
```

Attendu : résultat, qualification et marge éventuelle utilisent la famille de couleur correspondante.

## C. Conflit et carte de dégâts

### C1 — Réussite ordinaire

1. Lancer `Corps à corps`, `Distance` ou `Verbal`.
2. Obtenir une réussite.

Attendu :

- une carte D100 est créée ;
- une seconde carte `Jet de dégâts` est créée automatiquement ;
- elle contient portrait, nom du personnage et liste des armes ;
- la zone basse indique `En attente du jet`.

### C2 — Dégâts normaux et réutilisation

1. Cliquer une arme valide.
2. Noter le résultat.
3. Cliquer de nouveau la même arme.

Attendu :

- chaque clic produit un nouveau Roll ;
- la liste d’armes reste visible ;
- un seul résultat est visible dans le sélecteur ;
- le second résultat remplace visuellement le premier ;
- aucune cible, Blessure ou autre Actor n’est modifié.

### C3 — Critique / super-critique

1. Obtenir une réussite critique.
2. Cliquer une arme.
3. Choisir `Dégâts normaux`.
4. Recliquer et choisir `Dégâts maximum`.
5. Refaire sur une super-réussite critique.

Attendu :

- un petit dialogue apparaît ;
- le choix normal effectue le Roll normal ;
- le choix maximum maximise la formule ;
- la carte reste réutilisable.

Tester au minimum :

```text
1d6
2d6+3
1d8-1
(1d6+2)
```

Si une formule avancée se comporte différemment de l’attendu dans Foundry, relever la formule exacte et le résultat.

### C4 — Aucune arme

1. Retirer toutes les armes de l’Actor.
2. Obtenir une réussite de conflit.

Attendu : la carte indique explicitement `Aucune arme disponible.` et ne présente aucun bouton vide.

### C5 — Formule vide / invalide

1. Tester une arme sans formule.
2. Tester une formule invalide.

Attendu :

- arme visible mais non lançable ;
- indication `Dégâts non définis` ou notification explicite ;
- aucune erreur silencieuse ;
- aucune modification de cible.

## D. Snapshot historique

### D1 — Réussite

1. Obtenir une réussite de conflit avec une arme `A`, formule connue.
2. Laisser la carte de dégâts ouverte.
3. Renommer l’Item `A`, changer sa formule puis éventuellement le supprimer.
4. Cliquer l’ancienne entrée de la carte.

Attendu : le nom, l’image et la formule utilisés restent ceux du snapshot créé au moment du conflit.

### D2 — Échec forcé MJ

1. Obtenir un échec de conflit.
2. Avant d’autoriser les dégâts, modifier les armes actuelles de l’Actor.
3. En MJ, cliquer `Permettre les dégâts`.

Attendu : la nouvelle carte utilise les armes **actuelles au moment du clic**, puis son propre snapshot.

## E. Permissions

### E1 — Propriétaire

Attendu :

- peut lancer D100 ;
- peut lancer/rejouer les dégâts d’un sélecteur autorisé ;
- peut lancer/rejouer son initiative par les outils natifs.

### E2 — Spectateur / non-propriétaire

1. Afficher une ancienne carte contenant des actions.
2. Vérifier qu’aucun dégât n’est lançable.

Attendu : aucun contournement d’ownership.

### E3 — Perte d’ownership après création

1. Créer une carte de dégâts avec un joueur propriétaire.
2. Le MJ retire l’ownership.
3. Le joueur clique une arme de l’ancienne carte.

Attendu : action refusée au moment du clic.

### E4 — Échec de conflit

Attendu :

- joueur : aucun bouton `Permettre les dégâts` utilisable ;
- MJ : bouton visible ;
- le MJ peut créer le sélecteur.

## F. Clics rapides et multijoueur

### F1 — Double clic local

Double-cliquer rapidement une arme.

Attendu : l’action locale ne doit pas ouvrir/lancer deux fois simultanément la même opération.

### F2 — Deux propriétaires

Avec deux clients propriétaires du même Actor :

1. afficher le même sélecteur ;
2. lancer chacun un dégât ;
3. observer les deux clients.

Attendu :

- les deux actions autorisées sont enregistrées ;
- le dernier résultat reçu est projeté dans la même carte visible ;
- aucun socket système n’est requis ;
- aucune erreur de permission sur la mise à jour d’un message créé par un autre utilisateur.

## G. Initiative native

### G1 — Initiative depuis la fiche et formule

1. Ouvrir la fiche d’un personnage propriétaire alors qu’aucun Combat n’est actif.
2. Vérifier que l’affichage `Initiative` n’est pas cliquable.
3. Le MJ crée/active un Combat depuis le tracker.
4. Vérifier que `Initiative` devient cliquable sur la fiche tant que le personnage n’est pas dans le Combat.
5. Vérifier la valeur `Distance` et calculer manuellement `round(Distance / 10)`.
6. Cliquer sur `Initiative` depuis la fiche.

Attendu :

- le personnage est ajouté au Combat Tracker ;
- son initiative est lancée avec :

```text
1d10 + round(Distance / 10)
```

- le malus Blessure/Stress n’intervient pas ;
- une fois le personnage présent dans le Combat, `Initiative` redevient non cliquable ;
- supprimer le personnage du Combat rend de nouveau l’action disponible tant que le Combat reste actif.

### G2 — Relance et permissions

Tester :

- propriétaire ;
- MJ ;
- non-propriétaire ;
- relance.

Attendu : les permissions natives respectent la matrice de Phase 05.

### G3 — Égalité

1. Obtenir ou fixer la même initiative pour deux Combatants.

Attendu :

- le MJ reçoit un signalement de l’égalité ;
- aucun second critère de règle n’est inventé ;
- le MJ peut utiliser les outils natifs pour modifier, relancer ou fixer l’initiative.

### G4 — Combatant sans Actor

Créer si possible un Combatant sans Actor et tester le tracker.

Attendu : aucune erreur du système `interface`.

## H. Contrôle final

Vérifier en console et dans le monde :

- aucune erreur répétée ;
- aucune Blessure appliquée automatiquement ;
- aucune cible modifiée ;
- aucun effet canevas automatique ;
- aucun compendium réactivé ;
- anciennes cartes sans ownership ne contournent pas les permissions.

Noter pour chaque anomalie :

```text
rôle
étape
Actor concerné
résultat observé
résultat attendu
erreur console complète
```
