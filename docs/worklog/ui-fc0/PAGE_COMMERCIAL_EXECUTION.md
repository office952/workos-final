# UI-FC0 — Comercial, execuție, admin auxiliar

```text
LANE = B_USER + D_RUNTIME
HEAD = bb5952051abace00078a7aa1bf5930ce72cc4abe
SOURCE = apps/web page files + App.tsx
UI_MUST_NOT_INVENT_RATES = YES
NO_FAKE_CAPACITY = YES
```

Heuristic scores from implementation vs page law. Severity only where a real UX/product risk exists.

## Commercial spine

| Route | Page | Floorplan | Signature | Info model | Severity |
| --- | --- | --- | --- | --- | --- |
| `/clients` | Clienți | REGISTRY | 8/10 | 8/10 | — |
| `/clients/*` | Client Hub | OBJECT_WORKSPACE | 9/10 | 8/10 | — |
| `/requests` | Cereri | REGISTRY | 8/10 | 7/10 | **S1** duplicate status (chips + select) |
| `/requests/*` | Cerere | OBJECT_WORKSPACE + VERTICAL_JOURNEY | 8/10 | 7/10 | **S1** long stack; montaj competes with CTA |
| `/quotes` | Oferte | REGISTRY | 7/10 | 7/10 | **S1** same CSS family as Cereri/Lucrări |
| `/quotes/*` | Ofertă | OBJECT_WORKSPACE | 8/10 | 7/10 | **S2** internal cost / adaos / marjă on operator page |
| `/` + `/jobs` | Lucrări | REGISTRY | 7/10 | 7/10 | **S1** `/` alias vs hidden Acasă |
| `/jobs/*` | Lucrare | OBJECT_WORKSPACE + VERTICAL_JOURNEY | 8/10 | 7/10 | **S2** internal cost on job object |

Keep: Client Hub as the strongest commercial object workspace. Do not flatten Hub into a registry row dump.

## Execution

| Route | Page | Floorplan | Signature | Info model | Severity |
| --- | --- | --- | --- | --- | --- |
| `/atelier` | Atelier | DISPATCH | 9/10 | 8/10 | — |
| `/execution/*` | Execuție | FOCUSED_EXECUTION | 8/10 | 8/10 | — |

Atelier is inbox lanes, not a factory map. UI must not invent eligibility, utilization, or live shop telemetry.

## Admin / support

| Route | Page | Floorplan | Signature | Info model | Severity |
| --- | --- | --- | --- | --- | --- |
| `/admin/resources` | Resurse și costuri | CONFIGURATION_WORKSPACE (tabs + table + drawer) | 7/10 | 6/10 | **S1** master-detail collapsed into drawers |
| `/admin/stock` | Stoc | REGISTRY (light) | 6/10 | 6/10 | **S1** no search/filter at scale |
| `/admin/stock/:id` | Material | OBJECT_WORKSPACE | 7/10 | 7/10 | — |
| `/admin/seller` | Date firmă | ADMIN_CONTROL | 7/10 | 7/10 | — |
| `/admin/operational-services` | Servicii operaționale | ADMIN_CONTROL | 6/10 | 6/10 | **S1** breaks Admin L2 consistency |
| `/governance` | Guvernanță | MASTER_DETAIL (`owner-catalog`) | 8/10 | 8/10 | — |
| `/system` | Stare sistem | ADMIN_CONTROL | 5/10 | 6/10 | — |
| `/admin` | Administrare hub | REGISTRY cards | 7/10 | 7/10 | — |
| `/admin/customers` | Clienți admin | ADMIN_CONTROL | 5/10 | 5/10 | **S2** overlaps `/clients` create path |
| Login (`AppGate`) | Autentificare | Gate card, no shell | 8/10 | 8/10 | — |

## What UI must not invent

- Attention, status, CUI, commercial counts, quote totals, stage transitions
- Installation modes/prices, attachment rules, snapshot immutability
- Tariff confirmation, variant qualifiers, stock balances, seller legal identity
- Execution task states, PvA totals, health probe results
- Parallel client truth between `/clients` and `/admin/customers`

## Highest severities

1. **S2** — quote/job expose internal cost / adaos / marjă to general operators.
2. **S2** — two client surfaces (`/clients` create + `/admin/customers` lifecycle).
3. **S1** — commercial registries share one chrome family; Resources detail is drawer-only; Operational Services is off the Admin L2 pattern.

## Floorplan family (this lane)

REGISTRY · OBJECT_WORKSPACE · VERTICAL_JOURNEY · DISPATCH · FOCUSED_EXECUTION · CONFIGURATION_WORKSPACE · MASTER_DETAIL · ADMIN_CONTROL
