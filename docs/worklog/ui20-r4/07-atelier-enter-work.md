# UI20-R4 — Atelier enter work

Canonical Atelier remains locked: current-operator inbox. No assignment, dispatch, or manager controls.

S1-A kept: `LUC-88` register, one worklist, În lucru / Disponibile / Urmează.

| State | 1440 | 1280 | 768 |
| --- | --- | --- | --- |
| AVAILABLE | `72:957` | `72:1095` | `72:1233` |
| IN_PROGRESS | `72:1026` | `72:1164` | `72:1259` |

Transition: ready row Debitare CNC față → **Pornește** → row sits under ÎN LUCRU with `A intrat la mine` and **Continuă**.

| | |
| --- | --- |
| Source | `72:957` via trigger `72:1007` |
| Destination | `72:1026` |
| Trigger | ON_CLICK Pornește |
| Transition | SMART_ANIMATE EASE_OUT |
| Duration | 200 ms |
| Stays | LUC identity, other lanes |
| Changes | row relocates DISPONIBILE → ÎN LUCRU; Pornește → Continuă |

Prototype shows the post-confirmation state only. It does not fake backend confirmation.

No drag-drop. No Kanban. Display order is still not production scheduling.

Grammar card: `73:126`. Row track `80:26`. Video: `docs/worklog/ui20-r4/evidence/enter-work.mp4`.
