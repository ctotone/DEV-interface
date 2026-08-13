# PROPOSITION V2 — ÉTATS DE BLESSURES ET DE STRESS

**Statut :** proposition visuelle et narrative  
**Usage :** affichage indicatif sous les jauges Blessures et Stress  
**Effet mécanique :** aucun effet supplémentaire ; les libellés accompagnent uniquement les paliers existants

---

# BLESSURES

| Valeur | Palier | État | Couleur | Code hexadécimal |
|---:|---:|---|---|---|
| `0` | 0 | **Indemne** | Gris neutre | `#7A7F87` |
| `1–3` | 1 | **Touché** | Vert désaturé | `#718F78` |
| `4–6` | 2 | **Meurtri** | Ocre | `#B39A45` |
| `7–9` | 3 | **Blessé** | Ambre | `#C97932` |
| `10–12` | 4 | **Brisé** | Rouge brique | `#B84A3A` |
| `13–15` | 5 | **Critique** | Bordeaux sombre | `#762F3A` |

Progression :

```text
Indemne → Touché → Meurtri → Blessé → Brisé → Critique
```

---

# STRESS

| Valeur | Palier | État | Couleur | Code hexadécimal |
|---:|---:|---|---|---|
| `0` | 0 | **Stable** | Gris neutre | `#7A7F87` |
| `1–3` | 1 | **Tendu** | Vert désaturé | `#718F78` |
| `4–6` | 2 | **Éprouvé** | Ocre | `#B39A45` |
| `7–9` | 3 | **Ébranlé** | Ambre | `#C97932` |
| `10–12` | 4 | **Submergé** | Rouge brique | `#B84A3A` |
| `13–15` | 5 | **Rupture** | Bordeaux sombre | `#762F3A` |

Progression :

```text
Stable → Tendu → Éprouvé → Ébranlé → Submergé → Rupture
```

---

# PRINCIPE VISUEL

La même échelle de couleur est utilisée pour Blessures et Stress :

```text
Gris neutre
→ Vert désaturé
→ Ocre
→ Ambre
→ Rouge brique
→ Bordeaux sombre
```

La couleur accompagne le niveau de gravité, sans différencier mécaniquement Blessures et Stress.

Les termes employés restent purement narratifs et indicatifs. Ils ne déclenchent automatiquement ni incapacité, ni perte de contrôle, ni conséquence supplémentaire.
