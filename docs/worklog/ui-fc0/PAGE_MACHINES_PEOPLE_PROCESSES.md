# UI-FC0 — Utilaje, Oameni, Procese

```text
LANE = A_PRODUCT + B_USER
HEAD = bb5952051abace00078a7aa1bf5930ce72cc4abe
NO_FAKE_CAPACITY = YES
NO_FAKE_TELEMETRY = YES
```

## Scores

| Route | Signature | Info model | Notes |
| --- | --- | --- | --- |
| `/admin/workcenters` | 6/10 | 8/10 | Honest gaps; zone and machine share one list |
| `/admin/processes` | 6/10 | 9/10 | Best operation→capability→provider model |
| `/admin/people` | 4/10 | 6/10 | Cereri/Clients registry clone |
| `/admin/people/:id` | 5/10 | 8/10 | Client Hub card stack |
| `/admin/people/skills` | 5/10 | 7/10 | Eligibility preview is honest |

```text
MACHINES_CURRENT_UI_SCORE = 7
MACHINES_REDESIGN_PRIORITY = CRITICAL_UI_UX
MACHINES_REDESIGN_DIRECTION_COUNT = 3
```

## Utilaje — directions (no gauges)

1. **MACHINE PROFILE** — machine as operational object; zone secondary; capabilities and supported processes; no live state.
2. **CAPABILITY MAP** — capability → providers + gap rows (makes „Fără furnizor” scannable).
3. **OPERATION → CAPABILITY → MACHINE** — cross-link with `/admin/processes`.

UI must not invent: utilization %, busy/idle, calendars, machine-hour rates, live telemetry, payroll, pontaj, RBAC-as-skills.

## Lane disagreement

Processes has the strongest information model and the weakest visual distinction from Utilaje (same `OwnerCatalogView`). People has the weakest signature because it borrows commercial registry chrome. Do not average these into one “admin catalog is fine” verdict.
