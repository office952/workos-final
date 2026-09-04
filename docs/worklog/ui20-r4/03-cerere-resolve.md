# UI20-R4 — Cerere resolve

Mental model: clarification field. S1-A baseline kept.

| State | Node | 1280 | 768 | Dark |
| --- | --- | --- | --- | --- |
| CERERE_MISSING | `72:4` | `72:170` | `72:336` | — |
| CERERE_RESOLVED | `72:87` | `72:253` | `72:354` | `72:372` |

Transition: operator completes **Dimensiunile finale**.

Fixture-safe geometry already used in LETTERS tests: **1000 × 500 mm**. Depth 60 mm stays a proposal until confirmed. Letter text stays missing.

After resolve:

- item leaves LIPSEȘTE and joins CUNOSCUT
- `Blocat: lipsesc dimensiunile finale` becomes `Blocajul de geometrie a dispărut`
- primary action becomes **Confirmă adâncimea**
- object strip shows `1000 × 500 mm`
- AttentionEdge quiets; no confetti

Reaction: `72:82` → `72:87`, 180 ms dissolve (RESOLVE).
