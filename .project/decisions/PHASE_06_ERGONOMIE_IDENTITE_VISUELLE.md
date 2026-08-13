# Phase 06 — Ergonomie et identité visuelle

## Référence

- **Projet :** DEV-interface
- **Statut :** VALIDÉE ET CLÔTURÉE
- **Date de clôture :** 13 août 2026
- **Version package :** `0.1.0`
- **Version de schéma :** `1`
- **Branche :** `main`
- **Base distante de départ :** `1c8dde5f2f9b8855ca2e886a919619f1b5d1961e`
- **Commit de clôture Phase 06 :** à communiquer après intégration et push utilisateur
- **Foundry de référence :** V14 build `14.365`
- **Publication :** NON ENGAGÉE

# 1. Organisation de la phase

```text
6A   — audit ergonomique et visuel
6A.5 — fondation technique multi-thèmes
6B   — direction visuelle avec GPT Visuel
6C   — intégration technique avec GPT Foundry
6D   — validation réelle et consolidation
```

Le ressenti utilisateur sur la lisibilité de ce découpage est conservé pour le REX transversal final, sans remettre en cause la clôture de la phase.

# 2. Résultat général

La Phase 06 produit une identité visuelle sombre cohérente sur les principales surfaces du système :

- fiche Actor ;
- assistant de création ;
- Items ;
- dialogs ;
- cartes D100 ;
- sélection d'arme ;
- cartes de dégâts ;
- Destin ;
- réglages système.

Le thème `default` reste la seule résolution actuelle.

L'infrastructure multi-thèmes est prête, mais aucun choix utilisateur, setting, flag, DataModel ou mécanisme de persistance de thème n'est introduit.

# 3. Fiche Actor

Décisions validées :

- fiche verticale en une colonne ;
- portrait carré `1:1` ;
- `Blessures / Initiative / Stress` sous l'identité ;
- suppression de `État :` sous Blessures et Stress ;
- suppression de la valeur `+X` sous Initiative ;
- Compétences rétractables sur l'Actor ;
- six Compétences dans des cartes sombres ;
- Talents en grille `3 x 2` ;
- sections ouvertes avec contenu et bordure intérieure décalés de `10px` ;
- ordre : Compétences, Talents, Combat, Armes, Inventaire / Objets, Spécialisations, Notes, Progression ;
- Armes et Inventaire restent voisins ;
- quantité retirée de l'affichage de la section Armes ;
- infobulles descriptives sur Compétences et Talents.

# 4. Progression

Le fonctionnement persistant existant est conservé.

Lorsque l'XP atteint `3`, le message suivant est affiché :

```text
XP complet : choisissez un gain ci-dessous, appliquez-le manuellement à votre fiche, puis cochez le choix correspondant.
```

Les indicateurs `1 / 2 / 3` sont remplacés par trois cases graphiques.

Aucune attribution automatique d'un gain n'est ajoutée.

# 5. Assistant de création

L'assistant est reskinné pour rejoindre l'identité de l'Actor sans modifier sa logique métier.

Points validés :

- fond sombre ;
- Electrolize ;
- liserés rouges ;
- compétences / talents / dérivés harmonisés ;
- jetons restylisés ;
- portrait carré ;
- structure identité équilibrée ;
- Compétences non rétractables dans l'assistant ;
- infobulles Compétences / Talents.

# 6. Items

Invariant :

```text
Item.type = equipment
system.category = ordinary | weapon
```

Aucun nouveau type Item.

Décisions :

- skin sombre harmonisée ;
- libellé utilisateur `Objet` ;
- arme avec formule de dégâts ;
- quantité affichée selon pertinence ;
- bouton `Enregistrer` sauvegarde puis ferme ;
- autosave existant conservé.

# 7. Pré-lancer et dialogs

Pré-lancer D100 final :

- Désavantage ;
- Normal ;
- Avantage ;
- Bonus / Malus ;
- bouton de lancement ;
- **slider supprimé et validation utilisateur acquise**.

Dialogs harmonisés :

- ajout Objet / Arme ;
- suppression ;
- avertissement création ;
- choix dégâts Normaux / Maximum.

# 8. Cartes D100 et Destin

Les cartes D100 sont reskinnées en sombre.

Les catégories fonctionnelles restent inchangées.

Le signal visuel Destin final validé est :

```css
.interface-chat-card--destiny {
  border: 2px solid rgb(11 180 245);
}
```

Le halo existant reste complémentaire.

# 9. Dégâts — flux trois cartes

Évolution fonctionnelle validée pendant la Phase 06 :

```text
Carte 1 → résultat D100
Carte 2 → sélection d'arme
Carte 3 → résultat autonome des dégâts
```

La carte 2 reste réutilisable et chaque clic valide produit une nouvelle carte 3 sans supprimer les précédentes.

Snapshots, permissions et logique normale / maximum restent conservés.

# 10. Réglages système

Skin sombre validée sans modification de disposition ni de logique.

# 11. Invariants techniques

Aucun changement silencieux de :

```text
id système
types Actor / Item
version schéma
settings persistés
flags structurants
UUID
permissions
API publique
structure / ids compendium
migrations
moteur D100
États
Destin fonctionnel
initiative
snapshots
absence d'application automatique des Blessures
absence de moteur tactique
```

# 12. Compendiums

Toujours désactivés pendant le développement.

Identifiants protégés :

```text
interface.objects
interface.weapons
```

Avant candidate / release `1.0.0` :

```text
réactiver
→ reconstruire depuis packs-src/
→ contrôler
→ tester sous Foundry
```

# 13. Validation

Contrôles automatisés finaux rapportés par GPT Foundry :

```text
790 contrôles hors Foundry : OK
29 modules JavaScript vérifiés
5 tests unitaires exécutés
chargement isolé / init simulée : OK
```

Validation réelle Foundry réalisée et acceptée par l'utilisateur au fil des itérations.

# 14. Point non testé

```text
F2 — simultanéité multijoueur : NON TESTÉ
```

Ce point reste reporté à la Phase 07.

# 15. REX architecture IA distinct de la clôture projet

Un REX ciblé de GPT Foundry sur la valeur du passage par GPT Visuel est demandé séparément pour alimenter l'analyse d'architecture IA et le futur REX transversal destiné à GPT Architecte.

Son absence ne bloque pas la clôture de la Phase 06, car il n'a pas pour objet de modifier ou valider le livrable projet.

Le REX transversal devra notamment mettre en perspective :

- utilité et lisibilité du découpage 6A / 6A.5 / 6B / 6C / 6D ;
- fatigue et disponibilité utilisateur signalées ;
- charge des captures ;
- friction liée à la non-lecture initiale HBS/CSS par GPT Visuel ;
- qualité graphique réelle de GPT Visuel ;
- coût de transmission Foundry → Visuel → Foundry ;
- propre coordination de GPT Pilote.

# 16. Décision de clôture

```text
Phase 06 : VALIDÉE ET CLÔTURÉE
Phase 07 : PROCHAINE
Publication : NON
F2 : NON TESTÉ
REX architecture IA : séparé, non bloquant
```
