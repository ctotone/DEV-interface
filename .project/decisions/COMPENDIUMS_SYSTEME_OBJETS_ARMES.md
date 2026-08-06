# Décision — Compendiums système Objets et Armes

**Date :** 6 août 2026  
**Statut :** validé par l’utilisateur  
**Package :** système `interface`  
**Foundry ciblé :** 14.365

## Identifiants structurants

```text
Compendium visible : Objets
ID technique       : objects
Collection         : interface.objects

Compendium visible : Armes
ID technique       : weapons
Collection         : interface.weapons
```

Ces identifiants sont désormais persistants et ne doivent pas être renommés
silencieusement.

## Dossiers visibles

### Objets

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

### Armes

```text
ARMES ANCIENNES
ARMES MODERNES
ARMES FUTURISTES
```

## Sources de contenu

```text
.project/references/compendiums/PROPOSITION_V2_COMPENDIUM_ARMES_D100_INTERFACE.md
.project/references/compendiums/PROPOSITION_V2_COMPENDIUM_OBJETS_D100_INTERFACE.md
```

Les prompts d’images ne sont pas intégrés dans les descriptions visibles.

## Arbitrage particulier

À la demande explicite de l’utilisateur :

```text
Nom source initial : Mitrailleuse légère
Nom intégré        : Mitrailleuse lourde
Formule conservée  : 3D6+1
```

La description et la formule de la V2 restent inchangées.

## Structure des Items

```text
Document : Item
Type     : equipment
Quantité : 1

Pack objects
→ system.category : ordinary
→ system.damage.formula : vide

Pack weapons
→ system.category : weapon
→ system.damage.formula : formule V2
```

Aucun changement de DataModel ou de schéma n’est introduit.
