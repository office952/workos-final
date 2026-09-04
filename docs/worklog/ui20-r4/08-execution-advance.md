# UI20-R4 — Execution advance

Mental model: active work station. Most focused surface.

| State | 1440 | 1280 | 768 | Dark |
| --- | --- | --- | --- | --- |
| CURRENT | `72:1285` | `72:1351` | `72:1417` | — |
| ADVANCED | `72:1318` | `72:1384` | `72:1450` | `72:1483` |

CURRENT: Cant aluminiu dominates. ADVANCED: Cant compresses into `ÎNCHEIAT · comprimat`; Montare LED becomes OPERAȚIE CURENTĂ. Object `LUC-88` stays.

| | |
| --- | --- |
| Source | `72:1285` via trigger `72:1311` |
| Destination | `72:1318` |
| Trigger | ON_CLICK Marchează operația încheiată |
| Transition | SMART_ANIMATE EASE_IN_AND_OUT | 
| Duration | 200 ms |
| Stays | LUC identity, commercial dossier |
| Changes | current operation compresses into history; next operation gains focus |

Different from ENTER_WORK: work advances through production; it does not change ownership.

No fake telemetry, HMI, or progress theatre. 768 uses compact Meniu chrome.

Grammar cards: ADVANCE `73:130` (`80:28`), COMPLETE `73:134` (`80:31`, `80:34`), COMPRESS `73:138` (`80:35`). Video: `docs/worklog/ui20-r4/evidence/complete.mp4`.
