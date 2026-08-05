# SPÉCIFICATION FONCTIONNELLE — SYSTÈME D100 INTERFACE

**Statut :** consolidation fonctionnelle validée  
**Date :** 5 août 2026  
**Propriétaire et autorité finale :** utilisateur  
**GPT rédacteur :** GPT JdR — Création et continuité  
**Destination :** transmission à GPT Pilote puis préparation du développement Foundry  
**Identifiant technique du système :** `interface`  
**Dépôt de référence :** `DEV-interface`  
**Branche de référence communiquée :** `main`  
**Commit de référence communiqué :** `d4926487700295843281e1adffd077bf8d56113d`

---

# 1. OBJET DU DOCUMENT

Ce document consolide les règles fonctionnelles validées pour le système D100 **Interface** avant sa poursuite avec GPT Pilote et sa future mise en œuvre dans Foundry VTT.

Il décrit :

- les données de la fiche de personnage ;
- la création de personnage ;
- les jets D100 ;
- les réussites, échecs, critiques et marges ;
- l’avantage et le désavantage ;
- le Destin ;
- les valeurs dérivées ;
- l’initiative ;
- les Blessures et le Stress ;
- l’inventaire, les armes et les dégâts ;
- les spécialisations ;
- la progression et l’expérience ;
- les comportements fonctionnels attendus ;
- les réserves techniques encore à examiner.

Ce document remplace les anciennes règles contradictoires présentes dans la fiche Roll20 historique lorsqu’une décision plus récente est indiquée ici.

Pour le noyau détaillé de résolution des jets, la spécification de phase 00A reste l’autorité de référence. Le présent document la complète et ne la remplace que lorsqu’une évolution est explicitement validée.

---

# 2. PRINCIPES D’AUTORITÉ

L’utilisateur conserve l’autorité finale sur :

- les règles ;
- l’équilibrage ;
- les arbitrages de table ;
- les spécialisations ;
- les avantages et désavantages accordés ;
- le rythme d’expérience ;
- les contenus de compendium ;
- les décisions techniques visibles en jeu.

Les choix documentés ci-dessous sont considérés comme validés.

Les éléments marqués **Réserve technique** sont retenus comme comportements souhaités, mais leur coût de mise en œuvre devra être évalué avant développement définitif.

Les éléments marqués **Différé** sont hors périmètre de cette phase.

---

# 3. PÉRIMÈTRE ET HORS PÉRIMÈTRE

## 3.1 Inclus

- fiche de personnage joueur ;
- données et validations de création ;
- moteur de résolution D100 ;
- Destin ;
- états Blessures et Stress ;
- valeurs dérivées ;
- initiative ;
- équipement et armes ;
- résolution et affichage des dégâts ;
- progression et expérience ;
- comportements essentiels dans le chat.

## 3.2 Différé

Les éléments suivants ne doivent pas être conçus ni équilibrés pendant cette phase :

- catalogue complet d’armes ;
- catégories définitives d’armes ;
- formules de dégâts officielles ;
- portées ;
- équilibrage des armes ;
- listes par époque ;
- compendium final d’armes ;
- équilibre détaillé des équipements ;
- mise en page visuelle définitive ;
- choix techniques Foundry précis ;
- architecture de code ;
- publication du système.

---

# 4. FICHE DE PERSONNAGE

## 4.1 Identité

La fiche comporte au minimum :

- nom ;
- âge ;
- profession ;
- spécialisation ;
- inventaire ;
- notes.

La profession et la spécialisation sont des champs de texte libre.

La spécialisation n’est pas liée automatiquement à une compétence, un talent ou une mécanique.

## 4.2 Compétences

Le personnage possède six compétences :

1. Carrure
2. Agilité
3. Perception
4. Mental
5. Intellect
6. Charisme

## 4.3 Talents

Le personnage possède dix-huit talents fixes, répartis par groupes de trois.

### Carrure

- Endurance
- Force brute
- Robustesse

### Agilité

- Agilité corporelle
- Précision
- Réflexe

### Perception

- Acuité sensorielle
- Sixième sens
- Vigilance

### Mental

- Décision
- Détermination
- Équilibre mental

### Intellect

- Créativité
- Érudition
- Logique

### Charisme

- Aura
- Communication expressive
- Persuasion

## 4.4 Plafond des talents

Chaque talent est strictement compris entre `0` et `30`.

Le plafond de `30` est absolu.

Il ne peut être dépassé :

- à la création ;
- par l’expérience ;
- par une récompense ;
- par une option de fiche ;
- par un réglage MJ ;
- par un autre effet du système.

---

# 5. CRÉATION DE PERSONNAGE

## 5.1 Répartition recommandée des compétences

Les valeurs recommandées sont :

```text
20 / 30 / 30 / 40 / 40 / 50
```

Elles sont réparties entre les six compétences.

Cette répartition est recommandée, mais la validation doit rester souple.

Une répartition différente est signalée et doit pouvoir être confirmée.

## 5.2 Répartition recommandée des talents

Le personnage dispose de :

```text
100 points de talents
```

Ces points sont répartis librement entre les dix-huit talents.

Chaque talent reste plafonné à `30`.

La fiche signale une répartition différente du total recommandé et permet sa confirmation.

## 5.3 Points non dépensés

Les points de création non dépensés doivent être signalés.

Ils ne constituent pas une réserve persistante.

Ils ne sont pas stockés comme une ressource du personnage.

---

# 6. PRINCIPE DES JETS D100

## 6.1 Association obligatoire

Un jet standard utilise toujours :

```text
une compétence + un talent associé
```

Il n’existe pas de jet standard fondé uniquement sur une compétence.

Le joueur choisit le talent associé qui lui semble pertinent et peut expliquer son choix.

Le MJ valide ce choix ou impose le talent approprié si la situation l’exige.

## 6.2 Seuil de base

```text
Seuil de base = Compétence + Talent
```

## 6.3 Seuil final

```text
Seuil final = Seuil de base − Malus d’état
```

D’autres modificateurs situationnels peuvent être appliqués selon l’arbitrage de la table.

## 6.4 Réussite ordinaire

Le jet réussit lorsque le résultat final du D100 est inférieur ou égal au seuil final, sauf règle automatique contraire.

Le jet échoue lorsque le résultat est supérieur au seuil final, sauf règle automatique contraire.

---

# 7. RÉSULTATS AUTOMATIQUES ET CRITIQUES

## 7.1 Réussites automatiques

- `1` : réussite super critique automatique ;
- `2 à 5` : réussite automatique.

## 7.2 Échecs automatiques

- `96 à 98` : échec automatique ;
- `99` : échec critique automatique ;
- `100` : échec super critique automatique.

Ces résultats ne sont jamais annulés par un seuil supérieur.

## 7.3 Doubles

Les doubles naturels du D100 sont critiques selon le résultat normal du jet.

Exemples :

```text
11, 22, 33, 44, 55, 66, 77, 88
```

- si le double est une réussite : réussite critique ;
- si le double est un échec : échec critique.

Les règles automatiques de `1 à 5` et `96 à 100` restent prioritaires.

---

# 8. MARGES

Les marges sont calculées à partir du seuil final et du résultat final retenu, après toutes les étapes de résolution.

Elles utilisent des dizaines complètes et ignorent le reliquat.

## 8.1 Marge de réussite

```text
Marge de réussite =
max(0, plancher((Seuil final − Résultat final) / 10))
```

## 8.2 Marge d’échec

```text
Marge d’échec =
max(0, plancher((Résultat final − Seuil final) / 10))
```

Les deux marges sont toujours positives ou nulles.

Seule la marge correspondant à la qualification finale du jet est pertinente :

- après une réussite, utiliser la marge de réussite ;
- après un échec, utiliser la marge d’échec.

Une marge de `0` signifie que le résultat ne possède aucune dizaine complète d’écart. Le sous-texte de marge peut alors ne pas être affiché.

La qualification automatique reste prioritaire sur la comparaison numérique. Par exemple, une réussite automatique numériquement supérieure au seuil conserve une marge de réussite de `0`.

---

# 9. AVANTAGE ET DÉSAVANTAGE

## 9.1 Jet

En avantage ou désavantage, le joueur lance deux D100.

## 9.2 Sélection en avantage

Le système conserve d’abord le résultat possédant la meilleure qualité mécanique.

Ordre général :

1. réussite super critique ;
2. réussite critique ;
3. réussite automatique ;
4. réussite ordinaire ;
5. échec ordinaire ;
6. échec critique ;
7. échec super critique.

Lorsque les deux résultats ont la même qualité mécanique, le résultat numérique le plus bas est retenu.

## 9.3 Sélection en désavantage

Le système conserve d’abord le résultat possédant la pire qualité mécanique.

Lorsque les deux résultats ont la même qualité mécanique, le résultat numérique le plus élevé est retenu.

## 9.4 Spécialisations et avantage

Une spécialisation n’accorde pas automatiquement l’avantage.

Elle peut toutefois justifier régulièrement un avantage lorsque la fiction et le contexte le permettent.

Cette décision appartient au MJ.

Le système ne doit pas automatiser cette relation.

---

# 10. DESTIN

## 10.1 Nature

Le Destin est une réserve individuelle.

Valeur initiale :

```text
0
```

Gain après un échec final sans utilisation réussie du Destin :

```text
+5
```

Plafond :

```text
30
```

## 10.2 Déclenchement

Le Destin possède une probabilité secrète de déclenchement de `80 %`, uniquement lorsqu’une intervention est mécaniquement possible.

Le déclenchement n’est pas choisi manuellement par le joueur.

## 10.3 Consommation

Lorsqu’il intervient, le Destin consomme toute la réserve disponible.

Lorsqu’il transforme le résultat avec succès, la réserve revient à `0`.

Un succès naturel remet également le Destin à `0`.

## 10.4 Limites

Le Destin ne peut jamais modifier les résultats naturels de `96 à 100`.

Il ne transforme jamais un échec en réussite critique.

Il ne transforme jamais un échec critique en réussite.

## 10.5 Effets possibles

### Échec ordinaire

Un échec ordinaire peut devenir une réussite ordinaire.

### Échec critique non automatique

Un échec critique fondé sur un double peut devenir un échec ordinaire.

Cette correction nécessite une réserve minimale de :

```text
15
```

### Échecs automatiques

Les résultats `96 à 100` restent inchangés.

---

# 11. VALEURS DÉRIVÉES

Les formules exactes sont cachées aux joueurs.

Les valeurs finales restent visibles et utilisables.

Toutes les valeurs dérivées sont plafonnées à `99`.

## 11.1 Corps à corps

```text
Corps à corps =
plancher(
  (Carrure + Agilité) / 2
  +
  moyenne des six talents associés à Carrure et Agilité
)
```

## 11.2 Distance

```text
Distance =
plancher(
  (Perception + Mental) / 2
  +
  moyenne des six talents associés à Perception et Mental
)
```

## 11.3 Verbal

```text
Verbal =
plancher(
  (Intellect + Charisme) / 2
  +
  moyenne des six talents associés à Intellect et Charisme
)
```

## 11.4 Valeur dérivée personnalisée optionnelle

Le monde peut activer une seule valeur dérivée personnalisée globale.

Configuration :

- nom libre ;
- deux compétences distinctes ;
- six talents distincts ;
- talents choisis librement parmi les dix-huit talents.

Formule :

```text
Valeur personnalisée =
plancher(
  moyenne des deux compétences
  +
  moyenne des six talents sélectionnés
)
```

Plafond :

```text
99
```

La configuration doit être complète et valide pour être utilisable.

Elle est globale au monde.

Lorsqu’elle est désactivée, sa configuration est conservée.

Lorsqu’elle est active, sa valeur est visible et peut être lancée.

---

# 12. INITIATIVE

## 12.1 Formule

```text
Initiative = 1D10 + arrondi(Distance / 10)
```

## 12.2 Affichage

Le résultat final est affiché.

Un détail ou survol doit permettre de consulter :

- le résultat du D10 ;
- le bonus issu de Distance ;
- le total.

## 12.3 Blessures et Stress

Les Blessures et le Stress n’affectent pas l’initiative.

## 12.4 Déroulement

- l’initiative est lancée une fois au début d’un conflit ;
- l’ordre est décroissant ;
- l’ordre reste stable ;
- le MJ peut décider de ne pas utiliser d’initiative ;
- l’initiative est individuelle ;
- le propriétaire du personnage et le MJ peuvent lancer ou relancer l’initiative.

## 12.5 Égalités

Le MJ départage les égalités.

Lorsque cela est techniquement raisonnable, l’ordre de clic initial des résultats à égalité est préservé.

À défaut, le MJ décide manuellement.

---

# 13. BLESSURES ET STRESS

## 13.1 Nature

Blessures et Stress sont deux mécaniques parallèles.

Elles possèdent :

- des significations narratives différentes ;
- la même structure mathématique ;
- les mêmes limites.

## 13.2 Valeurs

Chaque valeur est comprise entre :

```text
0 et 15
```

Le système applique un clamp strict.

## 13.3 Contrôles

Chaque valeur dispose :

- d’un champ numérique éditable ;
- d’un bouton discret `−1` ;
- d’un bouton discret `+1`.

Le propriétaire du personnage et le MJ peuvent les modifier.

## 13.4 Paliers

```text
0       → niveau 0
1 à 3   → niveau 1
4 à 6   → niveau 2
7 à 9   → niveau 3
10 à 12 → niveau 4
13 à 15 → niveau 5
```

Équivalent :

```text
Niveau = plafond(Valeur / 3)
```

avec `0` donnant `0`.

## 13.5 Coefficient de malus

Coefficient par défaut :

```text
3
```

Ce coefficient est configurable par le MJ au niveau du monde.

Il est commun aux Blessures et au Stress.

## 13.6 Malus total

```text
Malus d’état =
(
  plafond(Blessures / 3)
  +
  plafond(Stress / 3)
)
× coefficient
```

Ce malus est soustrait du seuil final de tous les jets D100.

Il ne modifie pas l’initiative.

## 13.7 Affichage

La fiche affiche le malus total.

Un détail discret présente séparément :

- le niveau de Blessures ;
- le niveau de Stress ;
- le coefficient ;
- le calcul final.

## 13.8 Absence d’automatismes narratifs

Atteindre `15` ne déclenche automatiquement aucune règle de :

- mort ;
- inconscience ;
- incapacité ;
- panique ;
- perte de contrôle ;
- récupération automatique.

Ces conséquences relèvent de la fiction et du MJ.

---

# 14. ÉQUIPEMENT ET INVENTAIRE

## 14.1 Type d’objet portable

Tous les objets portables utilisent un type générique :

```text
Équipement
```

Catégories minimales :

- objet ordinaire ;
- arme.

## 14.2 Objet ordinaire

Champs minimaux :

- nom ;
- description ;
- quantité.

La quantité est un entier positif.

Minimum :

```text
1
```

Il n’existe pas de système de :

- poids ;
- capacité ;
- encombrement ;
- tags obligatoires.

## 14.3 Inventaire

La zone Inventaire représente :

- la possession ;
- la quantité ;
- le stockage pratique des objets.

## 14.4 Zone Armes

La zone Armes représente :

- les armes actuellement présentées comme utilisables ;
- leur accès rapide ;
- leur formule de dégâts éventuelle.

La quantité n’est pas affichée dans cette zone.

Un même objet peut apparaître dans l’Inventaire et dans la zone Armes.

Aucune décrémentation ou synchronisation automatique n’est imposée entre ces deux présentations.

Le déplacement ou dépôt dans une zone contrôle principalement la présentation de l’objet.

---

# 15. ARMES

## 15.1 Données minimales

Une arme possède :

- un nom ;
- une description ;
- une formule de dégâts facultative.

Elle ne stocke pas une valeur dérivée de combat.

Le choix entre Corps à corps et Distance dépend de la fiction et de l’action, pas d’un champ imposé sur l’arme.

## 15.2 Formule de dégâts

La formule de dégâts est un texte libre compatible avec le moteur de dés.

Elle peut être absente.

Une formule vide ou invalide ne produit :

- aucun jet ;
- aucun calcul de maximum.

L’arme reste utilisable narrativement.

## 15.3 Compendium

Une arme provenant d’un compendium est copiée localement sur la fiche.

Cette copie devient modifiable.

Elle ne reste pas synchronisée avec le compendium d’origine.

---

# 16. RÉSOLUTION DES DÉGÂTS

## 16.1 Après une réussite de conflit

Après un jet de conflit réussi, le message de chat propose les armes présentes dans la zone Armes.

Le joueur ou le MJ choisit l’arme appropriée.

Si l’arme possède une formule valide, les dégâts peuvent être lancés.

Sans formule valide, le message indique que les dégâts ne sont pas définis.

## 16.2 Après un échec

Un échec ne propose pas directement la liste publique des armes.

Le MJ dispose d’une commande :

```text
Lancer quand même les dégâts
```

Cette commande crée un nouveau message public de sélection d’arme.

## 16.3 Critiques

Lors d’une réussite critique ou super critique, le message propose :

- les dégâts normaux ;
- une option de dégâts maximum.

Le calcul du maximum dépend de la validité de la formule.

## 16.4 Absence d’armes

Lorsque la zone Armes est vide, le message indique qu’aucune arme n’est disponible.

Le système n’invente pas de formule de dégâts improvisée.

## 16.5 Réutilisation

Les boutons de dégâts restent réutilisables.

Ils sont accessibles au propriétaire du personnage et au MJ.

## 16.6 Application des dégâts

Le résultat de dégâts apparaît dans le chat.

Les dégâts ne sont jamais appliqués automatiquement à une cible.

Il n’existe pas d’automatisme de ciblage ou de modification de fiche adverse.

Le MJ ou le propriétaire ajuste manuellement Blessures ou Stress sur la fiche concernée.

---

# 17. SPÉCIALISATIONS

## 17.1 Nature

Les spécialisations sont des textes libres définis entre le joueur et le MJ.

Le système ne contient aucun catalogue restrictif.

Le système ne vérifie pas :

- les doublons ;
- les intitulés ;
- la largeur du domaine ;
- la cohérence de la formulation ;
- la relation avec une compétence ;
- la relation avec un talent.

## 17.2 Effet

Une spécialisation n’accorde automatiquement :

- aucun bonus fixe ;
- aucun avantage ;
- aucun changement de seuil ;
- aucune nouvelle mécanique.

Elle peut justifier un avantage lorsque le MJ estime que la situation le permet.

Cette conséquence reste narrative, contextuelle et entièrement arbitrée à la table.

## 17.3 Saisie

Les spécialisations sont ajoutées manuellement dans un champ de texte libre.

Plusieurs spécialisations peuvent être saisies, par exemple une par ligne.

---

# 18. EXPÉRIENCE ET PROGRESSION

## 18.1 Principe général

Le système utilise :

- une jauge intermédiaire en trois étapes ;
- neuf choix d’amélioration ;
- trois occurrences de chaque catégorie.

La cadence d’attribution relève exclusivement du MJ.

Le système ne définit pas :

- le rythme des récompenses ;
- les causes narratives d’un gain ;
- la fréquence par séance ;
- la quantité habituelle attribuée ;
- le stockage d’excédents ;
- une règle de dépassement de jauge.

## 18.2 Jauge intermédiaire

Valeurs :

```text
0 / 1 / 2 / 3
```

Le MJ peut :

- faire progresser cette jauge ;
- accorder directement un gain complet d’XP.

La fiche ne remet pas automatiquement la jauge à zéro.

Le joueur effectue lui-même cette remise à zéro lorsque cela correspond à la décision de la table.

## 18.3 Les neuf choix

Le parcours complet contient :

```text
3 × amélioration de Compétence
3 × amélioration de Talents
3 × nouvelle Spécialisation
```

Chaque case spécifique ne peut représenter qu’un gain consommé.

Le joueur peut librement cocher ou décocher les cases de sa propre fiche.

Le système ne verrouille pas ces cases derrière une autorisation MJ.

La responsabilité du suivi réel appartient au joueur et à la table.

## 18.4 Fin de progression

Lorsque les neuf cases sont cochées, la progression mécanique standard du personnage est terminée.

Aucun nouveau cycle automatique n’est prévu.

## 18.5 Gain de Compétence

Chaque case correspond à :

```text
+5 dans une compétence choisie
```

Les trois gains peuvent être appliqués à la même compétence.

Exemple maximal standard :

```text
Compétence initiale : 50
Trois gains : +15
Compétence finale : 65
Talent maximal : 30
Seuil brut : 95
```

## 18.6 Gain de Talents

Chaque case correspond à :

```text
+15 points à répartir librement entre les talents
```

Règles :

- les quinze points sont répartis intégralement ;
- ils peuvent être répartis entre un ou plusieurs talents ;
- chaque valeur est entière ;
- aucun talent ne dépasse `30`.

Avec la création recommandée et les trois gains possibles, le personnage passe de `100` à `145` points de talents au maximum standard.

La capacité théorique totale étant de `540`, aucun traitement spécial de reliquat ou de manque de place n’est nécessaire.

## 18.7 Gain de Spécialisation

Chaque case correspond à l’ajout d’une nouvelle spécialisation décidée entre le joueur et le MJ.

Le joueur saisit manuellement le texte.

Le système ne contrôle pas cette saisie et n’y associe aucun effet automatique.

## 18.8 Automatisation souhaitée

### Comportement cible

Le gain de Compétence et le gain de Talents doivent idéalement pouvoir être appliqués automatiquement après sélection.

#### Compétence

- choisir l’une des six compétences ;
- appliquer `+5` ;
- confirmer l’opération.

#### Talents

- afficher les dix-huit talents ;
- répartir exactement quinze points ;
- empêcher chaque talent de dépasser `30` ;
- appliquer les modifications ensemble.

### Réserve technique

La faisabilité et la lourdeur de cette assistance devront être évaluées au moment de la conception Foundry.

Si la mise en œuvre est disproportionnée pour la première version, l’application manuelle peut être retenue temporairement sans modifier la règle de progression.

La spécialisation reste toujours manuelle.

---

# 19. PRINCIPES D’INTERFACE

## 19.1 Propriété de la fiche

Le joueur ne doit pas sentir sa fiche excessivement verrouillée.

Le propriétaire du personnage conserve la possibilité de :

- corriger ses cases d’expérience ;
- modifier les champs autorisés ;
- ajuster manuellement la jauge ;
- saisir ses spécialisations ;
- gérer ses équipements.

## 19.2 Validations souples

Les recommandations de création sont contrôlées sans devenir des interdictions absolues.

Les écarts sont signalés puis confirmables.

## 19.3 Automatisation mesurée

L’automatisation doit :

- éviter les erreurs évidentes ;
- simplifier les calculs ;
- améliorer la lisibilité ;
- ne pas confisquer l’arbitrage du MJ ;
- ne pas imposer une séquence inutile au joueur ;
- rester proportionnée au bénéfice réel.

---

# 20. POINTS À TRANSMETTRE À GPT PILOTE

## 20.1 Phase fonctionnelle

La conception fonctionnelle principale est terminée.

Les règles ci-dessus sont considérées comme validées.

## 20.2 Réserves techniques à organiser

GPT Pilote devra notamment prévoir une future étude avec GPT Foundry sur :

1. l’application assistée des gains d’expérience ;
2. le coût de l’interface de répartition des quinze points de talents ;
3. le comportement des messages de chat liés aux armes et dégâts ;
4. la conservation d’un ordre stable en initiative ;
5. la configuration globale de la valeur dérivée personnalisée ;
6. la présentation compacte du détail Blessures / Stress ;
7. les permissions propriétaire / MJ ;
8. la migration éventuelle depuis les anciennes données Roll20.

## 20.3 Éléments différés à maintenir hors périmètre

- compendium d’armes ;
- catalogue et équilibrage des dégâts ;
- listes par époque ;
- design graphique final ;
- contenu de démonstration ;
- publication ;
- localisation ;
- documentation utilisateur finale.

## 20.4 Prochaine phase recommandée

```text
Consolidation par GPT Pilote
→ découpage en phases
→ spécification technique avec GPT Foundry
→ architecture des données
→ prototype fonctionnel
→ tests
→ ajustements
```

---

# 21. SYNTHÈSE DES INVARIANTS

```text
6 compétences
18 talents fixes
1 compétence + 1 talent pour tout jet standard
Talents plafonnés absolument à 30

Seuil final =
Compétence + Talent − Malus d’état

Blessures et Stress :
0 à 15
paliers de 3
coefficient commun configurable
aucun effet sur l’initiative

Initiative :
1D10 + arrondi(Distance / 10)

Progression :
jauge manuelle 0 à 3
3 × +5 Compétence
3 × +15 Talents
3 × nouvelle Spécialisation
aucun nouveau cycle après les neuf gains

Spécialisations :
texte libre
aucun bonus automatique
avantage éventuel selon arbitrage MJ

Dégâts :
chat séparé
jamais appliqués automatiquement
aucun ciblage automatique
```

---

# 22. STATUT FINAL DE LA PHASE

La phase de conception fonctionnelle du système D100 Interface est clôturable sur le fond.

La reprise peut être confiée à GPT Pilote à partir de ce document.

La prochaine décision structurante ne concerne plus l’équilibrage général des règles, mais leur organisation technique et leur ordre d’implémentation.
