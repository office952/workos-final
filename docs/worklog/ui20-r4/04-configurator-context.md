# UI20-R4 — Configurator context

Mental model: construction bench. Canonical stack stays: Față / Volum / Spate / Iluminare.

| State | Node | 1280 | 768 |
| --- | --- | --- | --- |
| VOLUM selected | `72:455` | `72:627` | `72:799` |
| FAȚĂ selected | `72:541` | `72:713` | `72:820` |

Volum keeps depth chips and `Confirmă adâncimea`. Față keeps the stack, changes the lens to Plexiglas opal 3 mm, hides depth chips, and labels context `CONTEXT STABIL`. The user should feel they are working on this part, not opening another form section.

| | SELECT | SELECT back |
| --- | --- | --- |
| Source | `72:455` via `72:489` Față | `72:541` via `72:581` Volum |
| Destination | `72:541` | `72:455` |
| Trigger | ON_CLICK | ON_CLICK |
| Transition | SMART_ANIMATE EASE_OUT | SMART_ANIMATE EASE_OUT |
| Duration | 150 ms | 150 ms |
| Stays | construction stack | construction stack |
| Changes | selected part + contextual panel | selected part + contextual panel |

Quietest verb. The page does not move as a whole.

Grammar card: `35:99`.
