# UI-FC0 — Figma file inventory (read-only)

```text
LANE = C_FIGMA
FIGMA_WRITE = NO
PLUGIN_AVAILABLE = YES
PLUGIN_USED = user-figma get_metadata
PLUGIN_RESULT = IA_FILE_PAGE_LIST_THIN; V3_FILE_SCREENS_AND_COMPONENTS_LISTED; WRITE_UNUSED
HEAD = bb5952051abace00078a7aa1bf5930ce72cc4abe
FIGMA_FILE_COUNT = 3
FIGMA_V3_STRONG_MATCH_ROUTE_FAMILIES = 4
FIGMA_HF_ACCEPTED_NO_V3_FINAL = 6
FIGMA_RUNTIME_NO_DEDICATED_ACCEPTED_PAGE = 14
FIGMA_MAP_ONLY_NO_ROUTE = 6
```

## Files

| Key | Role in docs | MCP page list |
| --- | --- | --- |
| `7elwvIscvMPDiEHrX4f6kQ` | WorkOS V1 Information Architecture + first HF lot | Thin: only page `0:1` `00 — Read Me & Evidence` listed |
| `1ev5lg7m2Ze1h3Vqmax8ho` | Clients / Client Hub / Cereri V3 | Live: `0:1` Screens, `1:2` Components |

Known from prior implementation worklogs: MCP page list on `7elwvIscvMPDiEHrX4f6kQ` is thin; frames still resolve by node id.

## File `7elwvIscvMPDiEHrX4f6kQ` — live Read Me (node `0:1`)

Read Me canvas still carries **stale on-canvas status**:

```text
INFORMATION_ARCHITECTURE = ACCEPTED
HIGH_FIDELITY = NOT_STARTED
IMPLEMENTATION = NOT_AUTHORIZED
GLOBAL_NAV = A_TOP_NAV
FINAL_VISUAL_STYLE = NOT_SELECTED
```

Living roadmap and direction canon disagree: HF lot is Owner-accepted, V3 sidebar is on main, page-content baseline is historically complete. Treat the Read Me frame as **HISTORICAL / SUPERSEDED status text**, not living authority.

Documented pages from worklogs (not all returned by MCP list):

| Pages | Status in docs |
| --- | --- |
| 00–08 / 00–09 IA | ACCEPTED_CURRENT for IA; visual A later superseded top-nav |
| 10 iconography / tokens | ACCEPTED_WITH_ADVISORIES |
| 11 A/B/C compare | B/C HISTORICAL reference; A ACCEPTED direction |
| 12–21 first HF lot | ACCEPTED_CURRENT lot screens |

## File `1ev5lg7m2Ze1h3Vqmax8ho`

Live Screens page `0:1` currently contains:

- `Clients / 1920 / Light|Dark`, `1440 / Light|Dark`, `1280`, `768` — ACCEPTED_CURRENT for Clients registry
- `RESOURCES_AND_COSTS_V3_FLAT_OWNER_WORKSPACE / 1440|768 / Light` — later Resources V3 frames on the same file

Cited in worklogs as ACCEPTED_CURRENT also for Client Hub and Cereri. Those frames need a second pass; this first MCP dump is Clients + Resources, not a complete Hub/Cereri catalog. Runtime for Clients / Hub / Cereri is Owner-accepted on main.

## Third file

| Key | Role | Status |
| --- | --- | --- |
| `Q8zfu4MZhsxLjJMGLHUHZh` | Architecture C simulation | ACCEPTED as simulation evidence; NOT living nav. Top-nav L1. `/admin/resources` Wave 1 patterns only. Library not published. |

## File `7elwvIscvMPDiEHrX4f6kQ` — documented page map

| Pages | Status |
| --- | --- |
| 00 Read Me | ACCEPTED IA record; **on-canvas status SUPERSEDED** |
| 02 Domain / 05 Screen Architecture | ACCEPTED_CURRENT IA labels |
| 03 IA A/B/C | HISTORICAL — living nav is V3 sidebar |
| 07 Evidence scores | HISTORICAL |
| 08–09 HF proposal / scope | ACCEPTED_CURRENT as scope, not build order |
| 10 Visual foundation | ACCEPTED_CURRENT |
| 11 Direction review | A ACCEPTED; B/C HISTORICAL |
| 12–21 First HF lot | ACCEPTED_CURRENT lot; shell frames SUPERSEDED by V3 sidebar |
| 15 Comercial HF | PARTIALLY SUPERSEDED by V3 Clients/Cereri/Hub file |
| 19 Admin resources HF | Conflicts later with Arch C and V3 flat amend |

## Strong V3 Figma ↔ runtime

| Runtime | File | Status |
| --- | --- | --- |
| `/clients` | `1ev5lg7m2Ze1h3Vqmax8ho` Clients frames | ACCEPTED_CURRENT |
| `/clients/:id` | same, Client Hub | ACCEPTED_CURRENT |
| `/requests`, `/requests/:id` | same, Cereri | ACCEPTED_CURRENT geometry; 2 business lines superseded |
| `/products/:code` prequote | same `176:5183` | ACCEPTED_CURRENT |

HF lot remains accepted design for Lucrări, Oferte, Catalog, Atelier, Execution, Login — not V3-final page files. Oferte V3 and Lucrări V3 are not accepted.

## Drift already visible

- Read Me in IA file is stale versus living V3 / HF / roadmap.
- Direction canon still says `NEXT_PROGRAM_PRIORITY = PRODUCT_DEVELOPMENT` while living roadmap is `WORKOS_UI_UX_FINAL_CLOSURE_V1`.
- Roadmap still has stale `POST_INTEGRATION_RECOMMENDED_PROGRAM = WORKOS_PERFORMANCE_AND_LOGIC_EFFICIENCY_V1` next to the new UI priority.
- Runtime route count is now 31; IA Read Me still cites 26 NEW routes.

## Runtime without dedicated current Figma (provisional)

Pending full node resolution. Strong candidates from source vs worklogs:

- `/admin/product-system`
- `/admin/workcenters`
- `/admin/people` and person/skills
- `/admin/processes`
- `/admin/operational-services`
- `/admin/stock`
- `/system`
- `/components`
- `/admin` hub

Do not mark these as MATCH until live frames are resolved by node id.
