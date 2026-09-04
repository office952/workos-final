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
- heading is **Dimensiuni confirmate** (R4A; former poetic line removed)
- AttentionEdge quiets; no confetti

| | |
| --- | --- |
| Source | `72:4` via trigger `72:82` |
| Destination | `72:87` |
| Trigger | ON_CLICK Completează dimensiunile |
| Transition | SMART_ANIMATE EASE_OUT |
| Duration | 180 ms |
| Stays | CER identity, CUNOSCUT / LIPSEȘTE structure |
| Changes | resolved item, blocker retreat, next action |

Meaning: informația a fost rezolvată. Not a new page load.

Grammar card: `73:122`. Resolved-item track `80:19`; blocker fade `80:21`.
