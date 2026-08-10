# Phase 04 — États, Destin et réglages MJ

## Référence

- **Projet :** DEV-interface
- **Statut :** VALIDÉE
- **Date d’ouverture :** 7 août 2026
- **Date de clôture :** 7 août 2026
- **Version du produit :** `0.1.0`
- **Version de schéma :** `1`
- **Branche :** `main`
- **Base de départ :** `386c71c5e73f9d9833905430c6d341344cfaf717`
- **Commit technique observé :** `eb6dc6196a71e3413f851d876a1b617dba3938af`
- **Commit de clôture documentaire :** `a56d68838a93398fffdb35aa7ee9feed3eb5dc71`
- **Foundry de référence :** V14 build `14.365`

# 1. Objectif de la phase

Vérifier la complétude réelle des États, du Destin et des réglages MJ déjà largement produits en Phase 03, corriger uniquement les lacunes démontrées, puis clôturer ce domaine sans réimplémentation inutile.

# 2. Résultat de l’audit

```text
DÉJÀ PRODUIT ET TESTÉ : ensemble du périmètre validé
PRODUIT MAIS À RETESTER : aucun élément principal
MANQUANT : aucune exigence validée
REPORTÉ : éléments explicitement hors Phase 04
```

Aucune lacune fonctionnelle n’a été identifiée.

# 3. Éléments validés

Sont confirmés :

- Blessures et Stress `0–15` ;
- niveaux `0–5` et libellés narratifs ;
- coefficient mondial de malus ;
- calcul et recalcul du malus d’état ;
- application du malus aux jets D100 ;
- settings monde du Destin ;
- menu de configuration réservé MJ ;
- accumulation, plafond, remise à zéro et consommation de la réserve ;
- intervention automatique du Destin ;
- traitement des échecs automatiques et critiques ;
- persistance ;
- permissions directement liées ;
- projection publique filtrée du Destin ;
- persistance des settings monde.

# 4. Arbitrages utilisateur

## 4.1 D100 secret du Destin calculé côté client

Le calcul secret est effectué sur le client qui lance le jet.

La projection publique n’expose ni le résultat secret, ni la chance configurée, ni le diagnostic interne.

L’utilisateur accepte ce niveau de confidentialité et ne souhaite pas ajouter d’architecture socket / autorité MJ pour ce besoin.

**Statut : VALIDÉ.**

## 4.2 Abaissement de `destinyCap` sous une réserve existante

Une réserve déjà acquise au-dessus du nouveau plafond peut encore être utilisée pour l’éligibilité du jet suivant. Si le jet échoue sans intervention, le gain suivant ramène la réserve au plafond courant.

L’utilisateur accepte ce comportement.

**Statut : VALIDÉ.**

# 5. Modifications fonctionnelles de Phase 04

```text
AUCUNE
```

Aucun changement de DataModel, setting, flag, permission, schéma, moteur D100, comportement du Destin ou persistance n’a été nécessaire.

# 6. Opération technique connexe — compendiums

Le protocole de développement des compendiums a été arbitré séparément pendant la Phase 04.

Deux fichiers techniques ont été modifiés :

```text
system.json
tests/static/check-project.mjs
```

Cette opération ne modifie aucune règle fonctionnelle de la Phase 04.

Document d’autorité :

```text
.project/decisions/GESTION_COMPENDIUMS_MODE_DEVELOPPEMENT.md
```

# 7. Tests et contrôles

Tests Foundry déjà acquis et toujours applicables :

```text
Phase 03 — Foundry VTT 14.365
T1 à T35 : VALIDÉS UTILISATEUR
```

Contrôles rejoués pendant la Phase 04 :

```text
708 contrôles hors Foundry : OK
22 modules JavaScript vérifiés
3 tests unitaires exécutés
chargement isolé et enregistrements init simulés : OK

derived-values.test.mjs : OK
d100-engine.test.mjs : T01 à T20 + cas complémentaires OK
character-creation.test.mjs : OK
```

Le code fonctionnel du domaine n’ayant pas changé, aucun nouveau scénario Foundry lourd n’était requis.

Le protocole compendiums désactivés a été testé réellement par l’utilisateur sous Foundry VTT `14.365`.

# 8. Limites conservées

- calcul secret du Destin local au client, accepté ;
- pas de verrou distribué global sur les écritures concurrentes ;
- cartes de chat encore provisoires ;
- pas de compatibilité V15 garantie ;
- pas de migration générale ;
- publication non engagée.

# 9. Éléments reportés

- cartes de chat finales ;
- dégâts depuis le chat ;
- initiative complète ;
- progression assistée ;
- design graphique final ;
- refonte visuelle du halo Destin ;
- Dice So Nice ;
- migrations générales ;
- tests globaux de concurrence multijoueur ;
- publication / release ;
- compatibilité V15.

# 10. Décision de clôture

```text
Phase 04 — États, Destin et réglages MJ : VALIDÉE
Lacunes fonctionnelles : AUCUNE
Patch fonctionnel : AUCUN
Publication : NON
```

La phase est clôturée sur la base de l’audit de complétude, des tests antérieurs toujours applicables, des contrôles rejoués et des arbitrages utilisateur explicitement validés.

# 11. Conséquences pour la suite

La Phase 05 peut partir directement de la base courante.

Elle doit être recalibrée avant développement, car son socle est déjà partiellement produit.

Pendant les phases de développement suivantes :

```text
compendiums désactivés dans system.json
```

Avant candidate / release `1.0.0` :

```text
réactiver + reconstruire + contrôler + tester les compendiums
```

# 12. Prochaine phase

- **Phase :** 05
- **Titre :** Conflits, initiative et armes
- **GPT principal :** GPT Foundry
- **Première action :** audit de complétude et recalibrage du périmètre réel avant toute modification.

# 13. Résumé ultra-court

```text
Phase : 04
Objectif : vérifier et clôturer États / Destin / réglages MJ
Résultat : périmètre complet, aucune lacune
Code fonctionnel modifié : non
Arbitrages : confidentialité Destin + baisse du cap acceptées
Compendiums : désactivés pendant le développement
Tests : acquis + contrôles rejoués OK
Statut : VALIDÉE
Suite : Phase 05 à recalibrer
```
