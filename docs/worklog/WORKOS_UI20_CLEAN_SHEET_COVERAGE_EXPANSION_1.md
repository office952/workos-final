# WorkOS UI20 — Clean-sheet coverage expansion 1

```text
STATUS                            = IN_REVIEW
PROGRAM                           = UI20_CLEAN_SHEET_COVERAGE_EXPANSION
COVERAGE_SET                      = 1_ENTRY_COMMERCIAL_REGISTRIES
NORTH_STAR                        = ACCEPTED
PASS_A / PASS_B / PASS_C          = ACCEPTED
CUTOVER_GO                        = REVOKED
ROOT_SWAP                         = NO
MERGE                             = NO
CURRENT_RUNTIME_UNCHANGED         = YES
OLD_UI_PRESENTATION_REUSED        = NO
REAL_DATA                         = NO
CLOUD_WRITE                       = NO
FIGMA_WRITE                       = NO
DOMAIN_WRITE                      = NO
API_WRITE                         = NO
```

```text
ROADMAP_READ
UI_UX_CANON_READ
DIRECTION_CONFLICT = NO
```

## Aborted cutover

Owner/ChatGPT revoked cutover because production root-swap reused V3 page bodies
under Ui20Shell. Local aborted diff preserved under `.tmp/ui20-aborted-cutover/`.
Product tree restored to accepted North Star HEAD `70cdb73`.

Strategy document remains historical planning evidence only:
`docs/worklog/WORKOS_UI20_NORTH_STAR_CUTOVER_STRATEGY_V1.md`

## This coverage set (isolated UI20 runtime only)

| Route | Surface | Floorplan |
|---|---|---|
| `/`, `/jobs` | JobsRegistry | OPERATIONAL REGISTRY / WORKLIST |
| `/requests` | RequestsRegistry | RESOLUTION QUEUE / REGISTRY |
| `/quotes` | QuotesRegistry | COMMERCIAL REGISTER |
| `/products` (no request) | CatalogBrowse | CATALOG |
| `/products?request=` | ProductPickBridge | (existing) |
| `/clients` | ClientsRegistry | RELATIONSHIP WORKLIST |
| `/clients/:id` | ClientHub | RELATIONSHIP WORKSPACE |

Accepted spine object routes unchanged:
`/requests/:id`, `/products/:code?request=`, `/quotes/:id`, `/jobs/:id`, `/atelier`, `/execution/:planId`

Default `App.tsx` remains SessionedApp → AppShell → current pages.

## Next coverage plan (docs only)

Group later: Resources, Stock, Processes, Workcenters, People, Product System,
Operational Services, Governance, System, Admin — by Evidence Ledger /
Admin Master-Detail / Configuration Workspace. Not implemented here.
