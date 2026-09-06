# 04 — Page personality map

Do not invent a universal template. Density is semantic, not global.

| PAGE / ROUTE FAMILY | PERSONALITY | FIGMA SOURCE | CURRENT REACT | CURRENT IMPLEMENTATION STATUS | TARGET UI20 STATUS | KIT PRIMITIVES USED | PAGE-SPECIFIC STRUCTURE |
|---|---|---|---|---|---|---|---|
| Cerere `/requests/:id` | RESOLUTION FIELD | `239:69` 1440; `241:161` 768 | `RequestDetailPage.tsx` | V3 object header + facts + related rows + drawers | RW2 target | Shell, ObjectContext, Notice/AttentionEdge, Field, ActionDock | Known plane vs Unresolved plane; not card wall |
| Cereri list `/requests` | registry (not a personality lock) | IAF1A shell over list | `RequestsOverviewPage.tsx` | HF-lot registry + local search | Keep registry; do not kit as Cerere | Ledger-ish row, quiet filters | Status chips → select at <1920 |
| Config `/products/:code` | CONSTRUCTION COMPOSITION + CONTEXT LENS | `234:103` 1440; `240:66` 1280; `241:66` 768 | `ProductConfigurationPage.tsx` + `FormRenderer` + `ProductConfigurationViews.tsx` | Schema form + sticky summary; LETTERS-shaped CSS possible | RW2 target | Shell, ObjectContext, Field, StateCause/Readiness | Composition from `template.components`; Lens = selected-part facts. ACM must work without fake VOLUME/LIGHTING |
| Ofertă `/quotes/:id` | COMMERCIAL SHEET | `235:66` 1440; `241:100` 768 | `QuoteInspectionPage.tsx` | Frozen snapshot inspection | RW3 | Shell, ObjectContext, ActionDock | Serif artifact **later**; Source Serif not in runtime today |
| Oferte list `/quotes` | registry | shell | `QuotesOverviewPage.tsx` | Frozen quote rows | Keep | Ledger-ish row | No Draft/Sent chips |
| Lucrare `/jobs/:id` | PRODUCTION TRAVELER | `240:115` 1280; `241:183` 768 | `JobDetailPage.tsx` | Decision/workspace leftovers + execution handoff | RW4 | Shell, ObjectContext, LedgerRow | Past / current / next; not dashboard |
| Lucrări `/` `/jobs` | worklist | RW1 evidence `224:96` over jobs | `JobsOverviewPage.tsx` | Compact rows; `/` = Lucrări | Keep until RW6 | Ledger-ish row | Not Acasă |
| Atelier `/atelier` | DISPATCH FLOOR | `240:198` 1280; `241:126` 768 | `AtelierPage.tsx` | Lane lists + metric band + reduced chrome | RW4 | LedgerRow, AttentionEdge, reduced shell | High scan density; not staffing dashboard |
| Execution `/execution/:planId` | WORKSTATION | VIS1/VIS1A exec; `241:202` 768 | `ExecutionWorkspacePage.tsx` | Task lanes + actions; reduced chrome | RW4 | ActionDock, reduced shell | Focused; open space; not ObjectRegister theatre |
| Client Hub `/clients/:id` | RELATIONSHIP WORKSPACE | `240:160` 1280 | `ClientWorkspacePage.tsx` | Closest to UI20 of commercial objects | RW3 polish | Shell, ObjectContext, AttentionEdge, drawer | Chronology + related objects; not KPI hub |
| Clienți `/clients` | registry | HF clients | `ClientsOverviewPage.tsx` | Dense registry | Keep | Row + local search | Metric band is page-local, not kit dashboard |
| Resources `/admin/resources` | EVIDENCE LEDGER | VIS1 resources | `ResourcesAdminPage.tsx` | Rate table / inventory rows | RW5 | LedgerRow, Field | High density; rates from backend |
| Admin `/admin` + domain pages | QUIET CONTROL | VIS1 admin; Cont `225:90` | `AdminHomePage.tsx` + `*AdminPage.tsx` | Local sidebar/floorplan; compact triggers at 768 | RW5 | Local nav, Field, MasterSelector | No global Settings dump |
| Acasă | ROLE-AWARE WORK RADAR | `224:96` shows Acasă; runtime hides | **No route / no page** | Hidden until RW6; `/` is Lucrări | RW6 only | None canonized now | Not KPI dashboard. See §28 note |
| Login / boot | gate | `166:325` historical | `LoginPage.tsx` | Theme + form | Keep | Theme, Field | Not kit flagship |

## Density contract (do not normalize)

| PAGE | DENSITY |
|---|---|
| Ofertă | LOW–MEDIUM |
| Cerere | MEDIUM |
| Config | MEDIUM |
| Client Hub | MEDIUM |
| Lucrare | MEDIUM–HIGH |
| Atelier | HIGH |
| Execution | FOCUSED |
| Resources | HIGH |
| Admin | MEDIUM–HIGH |
| Acasă | n/a (not designed here) |

## Acasă future contract (no UI now)

```text
ACASA                 = ROLE-AWARE WORK RADAR
NOT                   = KPI dashboard
LIKELY_NEEDS          = attention, blocked, decisions, changes, startable/current/next
CANONIZED_COMPONENTS  = NONE
OWNER                 = RW6
```

## Search future contract

```text
GLOBAL_SEARCH         = NOT_CURRENTLY_FUNCTIONAL
RUNTIME               = no Search control in GlobalShellTop
FIGMA_CHROME          = still draws ⌕ / search on 224:96 and many VIS1 frames
KIT_LAW               = NO DEAD SEARCH CONTROL
FUTURE_JUSTIFICATION  = real identifiers CER / OF / LUC / client / product / truthful task
```
