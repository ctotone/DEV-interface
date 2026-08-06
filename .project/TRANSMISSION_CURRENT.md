# Transmission courante — Système D100 Interface

**Dernière mise à jour :** 6 août 2026  
**Coordinateur :** GPT Pilote  
**Spécialiste principal du dernier complément :** GPT Foundry  
**Identifiant technique :** `interface`  
**Dépôt :** `ctotone/DEV-interface`  
**Branche :** `main`  
**Commit de clôture de la phase 03 :** `72a2d32ff51661e548f3900792fca263e8b75b98`  
**Dernier commit observé avant intégration des compendiums :** `7d7e7d7cb994951fa41cba9f6520a591900c7dfe`  
**Commit d’intégration du complément :** à communiquer après intégration et push

## Finalité

Créer un système Foundry VTT générique, léger et orienté narration pour le Système D100 Interface.

## Statut

```text
Phases 00A, 00B, 01, 02 et 03 : VALIDÉES
Phase 03 : CLÔTURÉE
Complément post-clôture — Compendiums d’armes et d’objets : VALIDÉ
Version package : 0.1.0
Version schéma : 1
Publication : NON ENGAGÉE
```

## Base de reprise

Utiliser la présente archive complète.

Elle contient :

- la base technique issue du commit `7d7e7d7cb994951fa41cba9f6520a591900c7dfe` ;
- les compendiums validés et leurs sources ;
- les corrections de descriptions en texte brut ;
- la consolidation documentaire du complément.

Le futur commit d’intégration remplacera cette archive comme base distante de reprise, sans remplacer le commit historique de clôture de la phase 03.

## Ordre de lecture

1. présent fichier ;
2. `.project/PROJECT_STATE.md` ;
3. `.project/ROADMAP.md` ;
4. `.project/decisions/PHASE_03_PREMIERE_TRANCHE_JOUABLE.md` ;
5. `.project/decisions/COMPENDIUMS_SYSTEME_OBJETS_ARMES.md` ;
6. `.project/reports/COMPENDIUMS_SYSTEME_CANDIDATE.md` ;
7. `tests/protocols/COMPENDIUMS_SYSTEME_FOUNDRY_V14_365.md` ;
8. spécifications 00A, 01 et 02 selon le sujet.

## État stable obtenu

- système installable sous Foundry V14 ;
- Actor `character` et Item `equipment` ;
- moteur D100, Destin et marges ;
- assistant de création ;
- fiche Actor et fiche Item ;
- Inventaire et Armes ;
- deux compendiums natifs :
  - `interface.objects` ;
  - `interface.weapons` ;
- 60 objets et 42 armes ;
- 11 dossiers ;
- 102 descriptions en texte brut ;
- sources lisibles sous `packs-src/` ;
- reconstruction par `tools/build-compendiums.mjs`.

## Décisions impératives du complément

### Identifiants

```text
Objets : interface.objects
Armes  : interface.weapons
```

Ne pas les renommer sans migration et analyse d’impact.

### Source de vérité

```text
packs-src/
→ modification et revue humaines

tools/build-compendiums.mjs
→ reconstruction contrôlée

packs/
→ bases Foundry installables
```

Ne pas modifier uniquement les bases compilées en oubliant les sources.

### Contenu

- `Mitrailleuse lourde` conserve la formule `3D6+1` ;
- les descriptions restent en texte brut tant que la fiche Item utilise une zone de texte simple ;
- les prompts de génération d’images ne sont pas intégrés aux descriptions visibles.

## Validations

```text
Tests Foundry T1 à T11 : OK
Contrôles hors Foundry : 718 OK
Modules JavaScript vérifiés : 22
Tests unitaires : 3
Chargement isolé et enregistrements init simulés : OK
```

Les outils automatiques ne remplacent pas les futurs tests joueur, multijoueur ou de publication.

## Éléments non finalisés

- cartes de chat finales ;
- dégâts depuis le chat ;
- initiative complète ;
- progression assistée ;
- Dice So Nice ;
- migrations ;
- concurrence d’écriture ;
- identité visuelle finale ;
- stabilisation ;
- audit des droits et de la publication.

## Observation méthodologique

**[CANDIDATE D’ÉVOLUTION — outillage transversal Foundry]**

Les outils créés pour Interface pourront être évalués en fin de projet selon leur apport réel. Aucune transformation en framework permanent n’est décidée. Un REX séparé de GPT Foundry vers GPT Architecte est annoncé et devra être relié à cette observation lorsqu’il sera disponible.

## Responsabilités

- **Utilisateur :** tests réels, validation, intégration Git, commits, push, version et publication.
- **GPT Pilote :** consolidation, recalibrage de roadmap et transmissions.
- **GPT Foundry :** développement Foundry et REX technique.
- **GPT Architecte :** évaluation ultérieure de l’intérêt transversal de l’outillage.

## Conventions opérationnelles des archives

- `.git/` et `.gitignore` peuvent être présents dans les archives entrantes et sont ignorés silencieusement ;
- un suffixe automatique du ZIP n’indique pas une version ;
- les écarts de hash ne sont signalés qu’en cas de divergence réelle de contenu, de branche ou de base.

## Prochaine action exacte

Intégrer cette archive, effectuer le commit et le push du complément post-clôture, puis communiquer le nouveau hash à GPT Pilote.
