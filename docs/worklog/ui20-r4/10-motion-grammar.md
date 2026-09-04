# UI20-R4 — Semantic motion grammar

Existing accepted research: SELECT ≈ 150 ms, FREEZE ≈ 200 ms.

| Verb | Node | Trigger | Stays | Changes | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| SELECT | `73:122` is RESOLVE; SELECT remains `35:99` | part click | construction stack | context lens | 150 ms | end context is enough |
| RESOLVE | `73:122` | Completează dimensiunile | CER object, known facts | missing item, block, next action | 180 ms | resolved structure is enough |
| ENTER_WORK | `73:126` | Pornește | LUC, other lanes | row enters ÎN LUCRU | 180 ms | moved row is enough |
| ADVANCE | `73:130` | after complete | LUC-88 | current operation | 200 ms | new focus is enough |
| COMPLETE | `73:134` | Marchează operația încheiată | object, station | current → history | 200 ms | compressed history is enough |
| COMPRESS | `73:138` | with ADVANCE | object identity | past height | 160–200 ms | one history line is enough |
| FREEZE | `35:105` | Îngheață oferta | totals, provenance | controls retreat | 200 ms | frozen artifact is enough |

No loop. No idle animation. Prototype transitions are dissolve EASE_OUT. Meaning does not depend on motion.
