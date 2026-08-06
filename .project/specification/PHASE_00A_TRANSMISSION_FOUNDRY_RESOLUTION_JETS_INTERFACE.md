# Transmission à GPT Foundry — Arbre de résolution des jets

## Référence

- **Projet :** Système D100 Interface
- **Phase d’origine :** 00A — Consolidation et équilibrage du système de jeu
- **Objet :** spécification fonctionnelle du noyau de résolution des jets
- **Statut des règles décrites :** validées par l’utilisateur dans la branche de travail
- **Statut du présent fichier :** produit par GPT Pilote, à conserver comme transmission fonctionnelle
- **Destinataire principal :** GPT Foundry
- **Date :** 4 août 2026
- **Développement Foundry :** non commencé dans cette phase

---

# 1. Finalité de la transmission

Ce document transmet à GPT Foundry l’arbre de résolution consolidé des jets du système D100 Interface.

Il décrit précisément :

- le calcul du seuil ;
- la qualification des résultats naturels ;
- la résolution d’un jet normal, avec avantage ou avec désavantage ;
- la sélection du résultat brut ;
- la mécanique individuelle du Destin ;
- le calcul du résultat définitif ;
- le calcul des marges ;
- les paramètres de partie accessibles au MJ ;
- les informations fonctionnelles à conserver pour l’affichage et les futurs contrôles.

Ce document constitue une **spécification fonctionnelle**. Il ne fixe pas encore :

- l’architecture technique Foundry ;
- les classes, Documents ou DataModels ;
- le format de stockage définitif ;
- l’API de jet ;
- le rendu graphique final ;
- l’intégration technique exacte avec Dice So Nice.

Ces choix relèveront de la phase Foundry.

---

# 2. Sources et hiérarchie de travail

La consolidation s’appuie sur trois états successifs du système :

1. le manuel PDF initial ;
2. la fiche Roll20 en HTML, CSS et JavaScript ;
3. la pratique actuelle aux tables, complétée par les décisions explicites prises durant la phase 00A.

Fichiers historiques fournis :

- `systeme de jeu Interface.md`
- `interface.html`
- `interface.css`
- `translation.json`

En cas d’écart, les décisions explicites validées pendant la phase 00A priment sur le PDF et sur l’ancien code Roll20.

GPT Foundry ne doit pas restaurer silencieusement une ancienne valeur observée dans les sources historiques.

---

# 3. Principes directeurs validés

## 3.1 Légèreté d’utilisation

Lorsque plusieurs solutions sont suffisamment proches en cohérence et en équilibre, le système retient celle qui demande le moins :

- de calculs visibles ;
- de consultation ;
- de négociation ;
- d’arbitrage pendant la partie.

Le moteur peut réaliser une logique interne précise, mais le joueur doit recevoir un résultat clair.

## 3.2 Le système ne dirige pas la narration

Le moteur qualifie mécaniquement un jet.

Il peut produire notamment :

- réussite ou échec ;
- automatique ou non ;
- critique ou non ;
- super-critique ou non ;
- marge ;
- intervention ou non du Destin.

Il ne doit pas imposer :

- une description ;
- une prouesse précise ;
- une catastrophe précise ;
- une conséquence narrative ;
- une table générique obligatoire d’effets critiques.

Le MJ et la table interprètent les résultats selon la situation.

## 3.3 Le calcul complexe reste dans le moteur

Le joueur ne doit pas avoir à reconstruire les étapes internes.

Le système doit toutefois conserver les valeurs intermédiaires nécessaires :

- à la vérification ;
- au survol ;
- au diagnostic ;
- aux futurs tests ;
- à l’affichage détaillé éventuel.

---

# 4. Terminologie normative

## 4.1 Seuil de base

```text
Seuil de base = Compétence + Talent
```

## 4.2 Malus d’état

```text
Malus d’état = (niveaux de Blessure + niveaux de Stress) × coefficient d’état
```

Valeur par défaut validée du coefficient :

```text
3
```

## 4.3 Seuil final

```text
Seuil final = Seuil de base - Malus d’état
```

D’autres ajustements pourront être ajoutés ultérieurement s’ils sont validés.

Leur présence éventuelle ne doit pas être supposée dans la première implémentation sans décision de projet.

## 4.4 Dés naturels

Valeurs réellement générées par le ou les D100.

- jet normal : un résultat naturel ;
- avantage : deux résultats naturels ;
- désavantage : deux résultats naturels.

## 4.5 Résultat brut retenu

Dé sélectionné après l’éventuelle résolution de l’avantage ou du désavantage, avant toute intervention du Destin.

## 4.6 Résultat définitif

Valeur obtenue après l’éventuelle intervention du Destin.

Le résultat définitif sert :

- à la qualification finale ;
- au calcul de la marge ;
- à l’affichage principal du jet.

## 4.7 Réserve de Destin

Valeur propre à un personnage.

Elle n’est jamais partagée entre plusieurs personnages.

---

# 5. Paramètres de partie validés

## 5.1 Blessures et Stress

| Paramètre | Valeur par défaut | Statut |
|---|---:|---|
| Malus par niveau de Blessure | `-3` | validé |
| Malus par niveau de Stress | `-3` | validé |
| Niveaux actuels de Blessure | `0 à 5` | base actuelle |
| Niveaux actuels de Stress | `0 à 5` | base actuelle |
| Malus cumulé maximal actuel | `-30` | conséquence des valeurs actuelles |

Exemple :

```text
Seuil de base : 60
Blessures : 2
Stress : 1
Coefficient : 3

Malus d’état : (2 + 1) × 3 = 9
Seuil final : 60 - 9 = 51
```

Le coefficient doit être modifiable depuis les paramètres MJ.

## 5.2 Destin

| Paramètre | Valeur par défaut | Statut |
|---|---:|---|
| Gain après un échec final | `+5` | validé |
| Plafond de réserve | `30` | validé |
| Probabilité de déclenchement | `80 %` | validé |
| Réserve minimale pour amortir un échec critique | `15` | validé |
| Réserve individuelle | oui | validé |
| Réserve fractionnable | non | validé |
| Consommation lors d’une intervention | totalité | validé |

Ces valeurs doivent être accessibles au MJ sans modification du code.

Le tableau de bord MJ devra permettre au minimum :

- de voir la valeur actuelle ;
- de la modifier ;
- d’identifier la valeur recommandée par défaut ;
- de rétablir facilement les valeurs par défaut.

---

# 6. Qualification des résultats naturels

La symétrie suivante est validée comme règle centrale.

| Résultat naturel | Qualification |
|---:|---|
| `1` | réussite automatique et **super réussite critique** |
| `2 à 5` | réussite automatique |
| `6 à 95` | résolution normale par comparaison au seuil final |
| `11, 22, 33…` | critique selon la réussite ou l’échec |
| `96 à 98` | échec automatique |
| `99` | échec automatique et échec critique |
| `100` | échec automatique et **super échec critique** |

## 6.1 Comparaison normale

Hors résultats automatiques :

```text
Résultat naturel <= Seuil final
→ réussite

Résultat naturel > Seuil final
→ échec
```

## 6.2 Doubles naturels

Un double prend la nature du résultat obtenu.

```text
Double réussi
→ réussite critique

Double échoué
→ échec critique
```

Exemples :

```text
Seuil final : 45
Résultat naturel : 33
→ réussite critique
```

```text
Seuil final : 25
Résultat naturel : 33
→ échec critique
```

## 6.3 Résultats automatiques

```text
1 à 5
→ réussite automatique

96 à 100
→ échec automatique
```

## 6.4 Super-critiques

```text
1
→ super réussite critique

100
→ super échec critique
```

Le système doit conserver cette qualification sans lui associer automatiquement une conséquence narrative.

---

# 7. Modes de jet reçus par le moteur

Le moteur reçoit un mode déjà déterminé :

```text
normal
avantage
désavantage
```

Cette transmission ne définit pas :

- pourquoi le mode a été choisi ;
- comment une spécialisation est jugée applicable ;
- comment le MJ formule une demande de jet ;
- comment plusieurs circonstances sont arbitrées ;
- comment avantage et désavantage seraient attribués ou cumulés.

Ces sujets sont volontairement hors périmètre.

Le moteur doit uniquement résoudre le mode reçu.

---

# 8. Jet normal

```text
Lancer 1D100
→ qualifier le résultat naturel
→ ce résultat devient le résultat brut retenu
```

---

# 9. Avantage et désavantage

## 9.1 Avantage

```text
Lancer 2D100
→ qualifier séparément chaque dé
→ conserver l’issue mécaniquement la plus favorable
```

## 9.2 Désavantage

```text
Lancer 2D100
→ qualifier séparément chaque dé
→ conserver l’issue mécaniquement la plus défavorable
```

## 9.3 Hiérarchie de qualité

Ordre du meilleur au pire :

1. super réussite critique ;
2. réussite critique ;
3. réussite ;
4. échec ;
5. échec critique ;
6. super échec critique.

Les propriétés `automatique` et `critique` restent conservées dans les données du résultat.

## 9.4 Avantage : exemple

```text
Seuil final : 50
Dés naturels : 43 et 44

43 → réussite
44 → réussite critique

Résultat brut retenu : 44
```

Même si `44` est numériquement supérieur, il constitue la meilleure issue mécanique.

## 9.5 Désavantage : exemple

```text
Seuil final : 50
Dés naturels : 55 et 56

55 → échec critique
56 → échec

Résultat brut retenu : 55
```

Le désavantage ne doit pas permettre d’échapper à un critique.

## 9.6 Départage dans une même qualité

Lorsque les deux dés produisent la même qualité :

```text
Avantage
→ conserver la valeur numérique la plus basse

Désavantage
→ conserver la valeur numérique la plus haute
```

Exemples :

```text
Seuil final : 50
Avantage : 31 et 42
→ deux réussites
→ résultat retenu : 31
```

```text
Seuil final : 50
Désavantage : 63 et 78
→ deux échecs
→ résultat retenu : 78
```

Si les deux valeurs sont identiques, l’une d’elles est retenue sans conséquence fonctionnelle particulière.

## 9.7 Conséquence pour le Destin

Le dé écarté n’est jamais réexaminé.

```text
Deux dés naturels
→ sélection du résultat brut
→ le Destin examine uniquement ce résultat brut
```

---

# 10. Référence statistique de l’avantage et du désavantage

Cette section explique l’équilibre recherché. Elle ne constitue pas une étape supplémentaire du moteur.

Pour une probabilité normale de réussite `p` :

```text
Avantage = 1 - (1 - p)²
Désavantage = p²
```

| Probabilité normale | Avec avantage | Avec désavantage |
|---:|---:|---:|
| 5 % | 9,75 % | 0,25 % |
| 10 % | 19 % | 1 % |
| 20 % | 36 % | 4 % |
| 30 % | 51 % | 9 % |
| 40 % | 64 % | 16 % |
| 50 % | 75 % | 25 % |
| 60 % | 84 % | 36 % |
| 70 % | 91 % | 49 % |
| 80 % | 96 % | 64 % |
| 90 % | 99 % | 81 % |
| 95 % | 99,75 % | 90,25 % |

Intention validée :

- l’effet est fort lorsque l’issue est incertaine ;
- il est plus faible lorsqu’une action est déjà très facile ou très difficile ;
- une spécialisation ou un avantage ne remplace pas un faible niveau général.

La sélection par qualité mécanique ne modifie pas la probabilité globale de réussite par rapport à la sélection classique du plus bas ou du plus haut ; elle protège seulement la cohérence des critiques.

---

# 11. Mécanique du Destin

## 11.1 Intention

Le Destin sert à amortir progressivement une série d’échecs.

Il agit comme un petit coup de pouce discret.

Il ne doit pas :

- améliorer une réussite déjà obtenue ;
- fabriquer une réussite critique ;
- fabriquer une réussite automatique ;
- annuler un échec automatique ;
- être dépensé volontairement par le joueur ;
- être déclenché volontairement par le MJ ;
- devenir une réserve tactique partagée.

## 11.2 Réserve individuelle

Chaque personnage possède sa propre réserve.

Valeur initiale :

```text
0
```

Après un échec final pendant lequel le Destin n’a pas été utilisé :

```text
Réserve nouvelle = min(Réserve actuelle + 5, 30)
```

Lorsqu’il intervient :

```text
Réserve nouvelle = 0
```

La réserve n’est pas fractionnable.

Exemple :

```text
Réserve actuelle : 20
Correction nécessaire : 4
Destin utilisé

→ les 20 points sont consommés
→ réserve nouvelle : 0
```

## 11.3 Test secret de déclenchement

Probabilité par défaut :

```text
80 %
```

Le test est effectué en interne.

Il ne doit être lancé que si une intervention est mécaniquement possible.

Aucun test inutile ne doit être généré lorsque :

- la réserve est insuffisante ;
- le résultat appartient à une zone protégée ;
- le seuil interdit une transformation en réussite ;
- le Destin ne peut modifier aucune qualification.

---

# 12. Destin après une réussite brute

Si le résultat brut retenu est une réussite :

```text
→ le Destin n’intervient pas
→ le résultat brut devient le résultat définitif
→ la réserve de Destin est remise à 0
```

Cette règle s’applique à :

- une réussite ordinaire ;
- une réussite automatique ;
- une réussite critique ;
- une super réussite critique.

Le Destin ne sert jamais à améliorer la qualité d’une réussite.

---

# 13. Destin après un échec automatique

Si le résultat brut retenu est compris entre `96` et `100` :

```text
→ le Destin ne peut pas intervenir
→ le résultat brut devient le résultat définitif
→ l’échec automatique est conservé
→ la réserve augmente de 5, maximum 30
```

Cas particuliers :

```text
96 à 98
→ échec automatique

99
→ échec automatique et critique

100
→ super échec critique
```

Le Destin ne peut ni neutraliser ni diminuer ces résultats.

---

# 14. Destin après un échec ordinaire non automatique

## 14.1 Correction nécessaire

```text
Correction nécessaire = Résultat brut retenu - Seuil final
```

Le Destin est éligible uniquement si :

- le résultat est un échec ordinaire non automatique ;
- le seuil final est strictement supérieur à `5` ;
- la réserve est suffisante pour couvrir la correction nécessaire.

## 14.2 Déclenchement réussi

Si le test secret à `80 %` réussit :

```text
→ l’échec devient une réussite ordinaire
→ toute la réserve est consommée
→ la réserve revient à 0
```

### Seuil final non double

```text
Résultat définitif = Seuil final
```

### Seuil final double

Le Destin ne doit jamais fabriquer une réussite critique.

```text
Résultat définitif = Seuil final - 1
```

Exemple :

```text
Seuil final : 44
Résultat brut : 51
Réserve : 15
Destin éligible et déclenché

Résultat définitif : 43
→ réussite ordinaire
→ réserve nouvelle : 0
```

## 14.3 Déclenchement raté

Si le test secret échoue :

```text
→ le résultat brut est conservé
→ aucune réserve n’est consommée
→ la réserve augmente de 5, maximum 30
```

## 14.4 Réserve insuffisante

```text
Réserve < Correction nécessaire
→ aucun test secret
→ résultat brut conservé
→ réserve +5, maximum 30
```

## 14.5 Seuil final inférieur ou égal à 5

Le Destin ne peut pas transformer un échec en réussite lorsque le seuil final vaut `5` ou moins.

```text
Seuil final <= 5
+ échec ordinaire
→ aucun test de Destin pour obtenir une réussite
→ résultat brut conservé
→ réserve +5, maximum 30
```

Dans cette zone, seule la valeur naturelle `1 à 5` peut produire une réussite automatique.

Un échec critique non automatique reste néanmoins éligible à l’amortissement décrit à la section suivante si sa réserve atteint le minimum requis.

---

# 15. Destin après un échec critique non automatique

Décision validée :

> Un échec critique non automatique ne peut jamais être transformé en réussite par le Destin.

Le Destin peut seulement le ramener à un échec ordinaire.

## 15.1 Réserve minimale

Valeur par défaut validée :

```text
15
```

Si la réserve est inférieure à `15` :

```text
→ aucun test secret
→ échec critique conservé
→ réserve +5, maximum 30
```

## 15.2 Déclenchement réussi

Si la réserve vaut au moins `15` et que le test secret à `80 %` réussit :

```text
→ l’échec critique devient un échec ordinaire
→ toute la réserve est consommée
→ la réserve revient à 0
```

Pour retirer le double sans transformer accidentellement l’échec en réussite :

```text
Essayer Résultat brut - 1

Si cette valeur reste un échec
→ la conserver

Sinon
→ utiliser Résultat brut + 1
```

Exemple :

```text
Seuil final : 54
Résultat brut : 55
→ échec critique

55 - 1 = 54
→ deviendrait une réussite
→ valeur refusée

Résultat définitif : 56
→ échec ordinaire
→ réserve nouvelle : 0
```

## 15.3 Déclenchement raté

```text
→ échec critique conservé
→ aucune réserve consommée
→ réserve +5, maximum 30
```

## 15.4 Exclusion des échecs automatiques

Cette règle ne s’applique jamais à `99` ou `100`.

Ils appartiennent à la zone d’échec automatique et restent hors de portée du Destin.

---

# 16. Résultat définitif et requalification

Après l’étape du Destin :

```text
→ déterminer le résultat définitif
→ requalifier ce résultat
```

Cas possibles :

- résultat brut inchangé ;
- échec ordinaire transformé en réussite ordinaire ;
- échec critique transformé en échec ordinaire.

Le résultat naturel ou brut d’origine doit rester conservé dans les données du jet même lorsqu’il n’est pas l’information principale affichée.

---

# 17. Calcul des marges

La marge est calculée :

- après l’avantage ou le désavantage ;
- après l’intervention éventuelle du Destin ;
- sur le résultat définitif ;
- par tranches complètes de `10`.

Le reliquat est ignoré.

## 17.1 Marge de réussite

```text
Marge de réussite =
max(0, floor((Seuil final - Résultat définitif) / 10))
```

## 17.2 Marge d’échec

```text
Marge d’échec =
max(0, floor((Résultat définitif - Seuil final) / 10))
```

## 17.3 Exemples

| Seuil final | Résultat définitif | Résolution | Marge |
|---:|---:|---|---:|
| 60 | 60 | réussite | 0 |
| 60 | 51 | réussite | 0 |
| 60 | 50 | réussite | 1 |
| 60 | 39 | réussite | 2 |
| 60 | 61 | échec | 0 |
| 60 | 70 | échec | 1 |
| 60 | 84 | échec | 2 |

## 17.4 Destin et marge

Exemple :

```text
Seuil final : 60
Résultat brut : 67
Destin déclenché
Résultat définitif : 60

→ réussite
→ marge de réussite : 0
```

Avec un seuil double :

```text
Seuil final : 55
Résultat brut : 62
Destin déclenché
Résultat définitif : 54

→ réussite ordinaire
→ marge de réussite : 0
```

## 17.5 Critiques et marges

La qualification critique et la marge sont deux informations distinctes.

```text
Seuil final : 70
Résultat définitif : 55

→ réussite critique
→ marge de réussite : 1
```

Le moteur transmet les deux informations sans leur associer de conséquence narrative automatique.

## 17.6 Zone automatique opposée au seuil

Le bornage à `0` évite une marge négative lorsque la règle automatique contredit numériquement le seuil.

Exemple :

```text
Seuil final : 2
Résultat naturel : 5

5 → réussite automatique
Écart numérique défavorable

→ marge de réussite : 0
```

---

# 18. Arbre complet de résolution

```text
ENTRÉES
→ Compétence
→ Talent
→ niveaux de Blessure
→ niveaux de Stress
→ mode normal / avantage / désavantage
→ réserve de Destin du personnage
→ paramètres MJ

1. CALCULER LE SEUIL
→ seuil de base = Compétence + Talent
→ malus d’état = (Blessures + Stress) × coefficient d’état
→ seuil final = seuil de base - malus d’état
→ intégrer ultérieurement seulement les autres ajustements validés

2. LANCER
→ normal : lancer 1D100
→ avantage : lancer 2D100
→ désavantage : lancer 2D100

3. QUALIFIER CHAQUE DÉ NATUREL
→ réussite automatique
→ réussite
→ réussite critique
→ super réussite critique
→ échec
→ échec critique
→ échec automatique
→ super échec critique

4. SÉLECTIONNER LE RÉSULTAT BRUT
→ normal : conserver le seul dé
→ avantage : conserver la meilleure issue mécanique
→ désavantage : conserver la pire issue mécanique
→ à qualité identique :
   avantage = valeur la plus basse
   désavantage = valeur la plus haute

5. APPLIQUER LE DESTIN

SI réussite brute :
   → résultat définitif = résultat brut
   → réserve = 0

SINON SI résultat brut entre 96 et 100 :
   → aucune intervention
   → résultat définitif = résultat brut
   → réserve = min(réserve + 5, 30)

SINON SI échec critique non automatique :
   SI réserve >= 15 :
      → test secret à 80 %
      SI déclenché :
         → retirer le critique en conservant un échec
         → résultat définitif = brut -1 si cela reste un échec
           sinon brut +1
         → réserve = 0
      SINON :
         → résultat définitif = résultat brut
         → réserve = min(réserve + 5, 30)
   SINON :
      → aucun test
      → résultat définitif = résultat brut
      → réserve = min(réserve + 5, 30)

SINON SI échec ordinaire non automatique :
   → correction nécessaire = résultat brut - seuil final

   SI seuil final > 5
   ET réserve >= correction nécessaire :
      → test secret à 80 %

      SI déclenché :
         SI seuil final est un double :
            → résultat définitif = seuil final - 1
         SINON :
            → résultat définitif = seuil final
         → réserve = 0

      SINON :
         → résultat définitif = résultat brut
         → réserve = min(réserve + 5, 30)

   SINON :
      → aucun test
      → résultat définitif = résultat brut
      → réserve = min(réserve + 5, 30)

6. REQUALIFIER LE RÉSULTAT DÉFINITIF

7. CALCULER LA MARGE
→ sur le seuil final et le résultat définitif
→ par tranches complètes de 10
→ minimum 0

8. PRODUIRE LA SORTIE
→ qualification finale
→ résultat définitif
→ marge
→ intervention ou non du Destin
→ nouvelle réserve
→ détails internes conservés
```

---

# 19. Données fonctionnelles à conserver pour chaque jet

La structure technique reste à définir par GPT Foundry, mais la résolution doit permettre de retrouver au minimum :

```text
mode de jet
seuil de base
niveaux de Blessure
niveaux de Stress
coefficient d’état
malus d’état
seuil final
liste des dés naturels
qualification de chaque dé
dé sélectionné
résultat brut retenu
réserve de Destin avant le jet
éligibilité du Destin
test de déclenchement effectué ou non
résultat du test secret, si effectué
type d’intervention du Destin
correction appliquée
résultat définitif
qualification définitive
marge
réserve de Destin après le jet
```

Ces informations servent :

- au moteur ;
- aux tests ;
- au diagnostic ;
- à l’affichage détaillé ;
- à la prévention des incohérences.

Leur stockage permanent ou temporaire reste une décision technique ultérieure.

---

# 20. Orientation d’affichage à confirmer

## 20.1 Résultat principal dans le chat

Orientation envisagée :

```text
Afficher principalement le résultat définitif
```

Lorsque le Destin intervient, le résultat principal ne doit pas donner l’impression que la valeur de la compétence a changé.

## 20.2 Détail au survol

Orientation envisagée :

```text
Résultat affiché : résultat définitif

Au survol :
→ résultat naturel ou brut retenu
→ correction du Destin
→ résultat définitif
```

Exemple :

```text
Résultat affiché : 48

Survol :
Résultat brut : 56
Destin : -8
Résultat définitif : 48
```

Cette présentation reste à confirmer lors de la conception de l’interface.

## 20.3 Dice So Nice

Exigence fonctionnelle formulée par l’utilisateur :

> Lorsqu’un Destin intervient, Dice So Nice devrait représenter le résultat définitif et non le résultat naturel.

La faisabilité et la méthode exactes devront être vérifiées par GPT Foundry avec la version ciblée de Foundry VTT et l’intégration de Dice So Nice.

Le moteur doit dans tous les cas conserver le résultat naturel, même si l’animation principale représente le résultat définitif.

---

# 21. Cas de test fonctionnels minimaux

Ces cas devront être transformés en tests lors de la phase Foundry.

## T01 — Réussite ordinaire

```text
Seuil final : 50
Jet : 42
Destin avant : 10

Attendu :
→ réussite ordinaire
→ résultat définitif : 42
→ marge : 0
→ Destin après : 0
```

## T02 — Réussite critique

```text
Seuil final : 50
Jet : 44
Destin avant : 20

Attendu :
→ réussite critique
→ résultat définitif : 44
→ Destin après : 0
```

## T03 — Super réussite critique

```text
Seuil final : 0
Jet : 1

Attendu :
→ réussite automatique
→ super réussite critique
→ résultat définitif : 1
```

## T04 — Échec automatique

```text
Seuil final : 100
Jet : 96
Destin avant : 25

Attendu :
→ échec automatique
→ aucune intervention du Destin
→ résultat définitif : 96
→ Destin après : 30
```

## T05 — Échec automatique critique

```text
Seuil final : 100
Jet : 99
Destin avant : 15

Attendu :
→ échec automatique critique
→ aucune intervention du Destin
→ résultat définitif : 99
→ Destin après : 20
```

## T06 — Super échec critique

```text
Seuil final : 100
Jet : 100
Destin avant : 30

Attendu :
→ super échec critique
→ aucune intervention du Destin
→ résultat définitif : 100
→ Destin après : 30
```

## T07 — Avantage choisissant une réussite critique

```text
Seuil final : 50
Mode : avantage
Dés : 43 et 44

Attendu :
→ 44 retenu
→ réussite critique
```

## T08 — Désavantage choisissant un échec critique

```text
Seuil final : 50
Mode : désavantage
Dés : 55 et 56

Attendu :
→ 55 retenu
→ échec critique
```

## T09 — Avantage avec même qualité

```text
Seuil final : 50
Mode : avantage
Dés : 31 et 42

Attendu :
→ 31 retenu
→ réussite ordinaire
```

## T10 — Désavantage avec même qualité

```text
Seuil final : 50
Mode : désavantage
Dés : 63 et 78

Attendu :
→ 78 retenu
→ échec ordinaire
```

## T11 — Destin insuffisant

```text
Seuil final : 50
Jet brut : 62
Destin avant : 10

Attendu :
→ correction nécessaire : 12
→ aucun test secret
→ résultat définitif : 62
→ échec
→ Destin après : 15
```

## T12 — Destin suffisant mais non déclenché

```text
Seuil final : 50
Jet brut : 57
Destin avant : 10
Test secret : échec

Attendu :
→ résultat définitif : 57
→ échec
→ Destin après : 15
```

## T13 — Destin suffisant et déclenché

```text
Seuil final : 50
Jet brut : 57
Destin avant : 10
Test secret : réussite

Attendu :
→ résultat définitif : 50
→ réussite ordinaire
→ marge : 0
→ Destin après : 0
```

## T14 — Destin avec seuil double

```text
Seuil final : 44
Jet brut : 51
Destin avant : 15
Test secret : réussite

Attendu :
→ résultat définitif : 43
→ réussite ordinaire
→ pas de critique artificiel
→ Destin après : 0
```

## T15 — Seuil inférieur ou égal à 5

```text
Seuil final : 4
Jet brut : 7
Destin avant : 30

Attendu :
→ aucun test pour transformer en réussite
→ résultat définitif : 7
→ échec
→ Destin après : 30
```

## T16 — Critique avec réserve insuffisante

```text
Seuil final : 40
Jet brut : 55
Destin avant : 10

Attendu :
→ aucun test secret
→ échec critique conservé
→ Destin après : 15
```

## T17 — Critique amorti par le Destin

```text
Seuil final : 40
Jet brut : 55
Destin avant : 15
Test secret : réussite

Attendu :
→ résultat définitif : 54
→ échec ordinaire
→ Destin après : 0
```

## T18 — Critique proche du seuil

```text
Seuil final : 54
Jet brut : 55
Destin avant : 15
Test secret : réussite

Attendu :
→ 54 refusé car ce serait une réussite
→ résultat définitif : 56
→ échec ordinaire
→ Destin après : 0
```

## T19 — Critique non amorti

```text
Seuil final : 40
Jet brut : 55
Destin avant : 20
Test secret : échec

Attendu :
→ résultat définitif : 55
→ échec critique
→ Destin après : 25
```

## T20 — Marge après intervention du Destin

```text
Seuil final : 60
Jet brut : 67
Destin avant : 10
Test secret : réussite

Attendu :
→ résultat définitif : 60
→ réussite
→ marge : 0
```

---

# 22. Éléments volontairement ouverts

Les points suivants ne sont pas tranchés dans cette transmission :

1. les autres bonus ou malus circonstanciels éventuels ;
2. les règles d’attribution de l’avantage ou du désavantage ;
3. la gestion d’éventuelles sources multiples d’avantage ou de désavantage ;
4. le traitement complet des scores de seuil supérieurs à `100` ;
5. le rendu visuel final du chat ;
6. la formulation exacte des infobulles ;
7. la visibilité du détail du Destin selon les permissions ;
8. la méthode d’intégration avec Dice So Nice ;
9. l’architecture et le stockage Foundry ;
10. les conséquences mécaniques éventuelles de certaines marges dans les autres sous-systèmes.

GPT Foundry ne doit pas combler silencieusement ces points.

Il peut :

- signaler une dépendance ;
- proposer des options ;
- demander un arbitrage lorsque la phase technique les rencontre.

---

# 23. Décisions impératives à ne pas perdre

```text
1 à 5
→ réussite automatique

96 à 100
→ échec automatique

1
→ super réussite critique

100
→ super échec critique

Double réussi
→ réussite critique

Double échoué
→ échec critique

Avantage
→ meilleure issue mécanique

Désavantage
→ pire issue mécanique

Destin
→ individuel
→ automatique mais non garanti
→ test secret à 80 % seulement lorsqu’il peut agir
→ +5 après chaque échec final sans utilisation
→ plafond 30
→ consommation intégrale
→ réussite brute : remise à 0
→ ne touche jamais 96 à 100
→ ne crée jamais de réussite automatique ou critique
→ critique non automatique : seulement amorti en échec ordinaire
→ réserve minimale 15 pour amortir un critique

Marge
→ calculée sur le résultat définitif
→ une marge par tranche complète de 10
```

---

# 24. Prochaine action recommandée pour GPT Foundry

Lors de l’ouverture de la phase Foundry :

> Lire cette transmission, restituer l’arbre de résolution, identifier uniquement les dépendances techniques et les éventuelles ambiguïtés bloquantes, puis proposer une architecture d’implémentation sans modifier les règles validées.

Aucun développement ne doit commencer sur la base d’un comportement inventé pour les éléments encore ouverts.

---

# 25. Résumé ultra-court

```text
Phase d’origine : 00A — Consolidation et équilibrage
Résultat : arbre de résolution D100 consolidé
Base : décisions explicites de l’utilisateur
Noyau : seuil → lancer → sélection → Destin → résultat définitif → marge
Paramètres MJ : état -3, Destin +5 / plafond 30 / déclenchement 80 % / critique 15
Statut : règles du noyau validées
Suite : architecture et implémentation par GPT Foundry dans une phase dédiée
```
