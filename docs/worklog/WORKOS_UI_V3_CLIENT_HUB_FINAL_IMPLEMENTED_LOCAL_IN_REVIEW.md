# WorkOS V3 — Client Hub Final — implemented, local in review

```text
OWNER_DECISION                 = ACCEPT CLIENT HUB FIGMA FINAL
OWNER_ACCEPTED_SCOPE           = CLIENT_HUB_FIGMA_FINAL_DIRECTION
CLIENT_HUB_DIRECTION           = OWNER_ACCEPTED
CLIENT_HUB_FIGMA_FINAL         = OWNER_ACCEPTED
FIGMA_REOPEN_REQUIRED          = NO
CLIENT_HUB_IMPLEMENTATION      = AUTHORIZED
CLIENT_HUB_RUNTIME_ACCEPTED    = NO
CLIENT_HUB_INTEGRATED_ON_MAIN  = NO
CLIENTS_V3                     = CLOSED
CLIENTS_REOPEN                 = NO
NEXT_WAVE                      = NO
MAIN_MERGE                     = NOT_AUTHORIZED
```

Owner explicitly accepted the final Client Hub Figma and authorized React implementation of `/clients/:customerId` only. The four leftover graphic-design notes stay runtime watch items. This file is the implementation worklog. It does not rewrite the roadmap or the UI/UX canons.

## Identity

```text
REPO                 = office952/workos-final
WORKTREE             = C:/Users/offic/workspace/workos-final-clients-main-ff
BRANCH               = feat/ui-v3-client-hub-final-v1
ORIGIN_MAIN          = 1228397d15799c12df6d861a08260d83c859debd
DOC_ANCESTOR         = b88fc13e311d41cf96f61d6498da9eb055e0ddb5
DOC_STATUS_COMMIT    = b88fc13e311d41cf96f61d6498da9eb055e0ddb5
DOC_STATUS_COMMIT_AMENDED = NO
CLIENTS_PRODUCT      = 6190207b72fb723ef0c0276864d74dcb2bc7aa4a
PR_1                 = OPEN / DRAFT / NON-AUTHORITATIVE / NOT REUSED
FIGMA_FILE           = WorkOS V3 — Clients Final Design
FIGMA_FILE_KEY       = 1ev5lg7m2Ze1h3Vqmax8ho
FIGMA_PAGE           = WorkOS V3 — Client Hub Final
```

History:

```text
1228397  docs: record Clients V3 integrated on main
   ↓
b88fc13  docs: sync UI V3 page-content status after Clients integration
   ↓
Client Hub implementation commit(s)
```

## Figma source nodes

Read via Figma MCP `get_design_context`. Figma was not written.

| Frame | Node |
|---|---|
| 1920 Light / Active | `49:2447` |
| 1920 Dark / Active | `49:2508` |
| 1440 Light / Active | `49:2569` |
| 1440 Dark / Active | `49:2630` |
| 1280 Light | `49:2691` |
| 768 Light / Active | `49:2752` |
| 768 Dark / Active | `54:3795` |
| Attention | `54:3277` |
| Retired | `54:3351` |
| Empty | `54:3425` |
| Cereri | `54:3499` |
| Oferte | `54:3573` |
| Lucrări | `54:3647` |
| Edit Drawer on Oferte | `54:3721` |
| Long Name | `54:3837` |
| Oferte empty | `56:3698` |
| UX LOCK | `47:2356` |
| A11Y | `56:4525` |

## Business source

Unchanged `CustomerWorkspaceProjection` and current customer / request / quote / job APIs.

```text
BUSINESS_LOGIC_CHANGE = NO
DOMAIN_CHANGE         = NO
API_CHANGE            = NO
BACKEND_CHANGE        = NO
DATABASE_CHANGE       = NO
CLOUD_WRITE           = NO
NEW_DEPENDENCIES      = NO
NEW_FRAMEWORKS        = NO
```

## Return Context

Explicit origin marker, not `history.length` or `document.referrer`.

- Session key: `workos.clients.workspaceOrigin`
- Written on Clients registry card click (`markClientsWorkspaceOrigin`) together with location state
- Scroll at click time is persisted; render-time `scrollY` is treated as stale
- `← Clienți` (`aria-label="Înapoi la Clienți"`) returns `/clients` + stored `q` / `status` / `attention` and restores scroll
- Deep link / no matching origin: `/clients` with `{ clientsFreshVisit: true }` (top)
- Sidebar Clienți remains a fresh visit
- Ordinary browser Back is unchanged

## Attention gate

Attention exists only when `summary.requestNeedsAction`, `summary.quoteNeedsAction`, or `summary.jobNeedsAction` is greater than zero.

The fallback next action `Creează o cerere de ofertă` is ordinary next-step behavior and does not open the attention block.

When attention exists it renders before Date client. Signal Edge is used only on the attention block and on collection rows with `needsAttention`.

## Profile edit

`Editează datele` opens the existing `ActionDrawer` titled **Editează clientul**.

- Width 448px, inner padding 24px, close 44×44 named Închide
- Sticky Anulează / Salvează
- Opening, cancel, close, and save do not mutate `?section=`
- Escape closes; focus returns to the previously focused control

## Floorplan

Route remains `/clients/:customerId`. Operator UI does not say Client Hub or Workspace.

- H1 = `customer.displayName`, natural casing
- Secondary: CUI · contact · city
- Primary: Cerere nouă when `canCreateRequest`
- Secondary quiet: Editează datele
- Non-clickable summary rail: requestCount / quoteCount / jobCount
- Local editorial nav: `?section=prezentare|cereri|oferte|lucrari` with `aria-current`
- Prezentare no longer duplicates full collections
- Retired: no Cerere nouă; `Retras · Istoricul rămâne vizibil.`
- Empty: `Clientul nu are încă activitate comercială.` / `Nicio activitate înregistrată.`
- Missing values: `Nesetat`
- 768: 3-column rail, 2-column Date client, wrapping action cluster

## Runtime visual watch

Implemented the accepted structure first. Tiny semantic-token CSS only:

| Watch | Result | Adjustment |
|---|---|---|
| DATE_CLIENT_SURFACE_RUNTIME | adjusted minimally | Date client border uses `color-mix(..., var(--border-subtle) 70%, transparent)` so the panel reads as grouped information, not a disabled form |
| SUMMARY_RAIL_RUNTIME | adjusted minimally | Rail and separators use `color-mix(..., var(--border-subtle) 40%, transparent)` so the full-width rail stays restrained at 1920 |
| QUIET_ACTION_RUNTIME | PASS | `Editează datele` stays `button-quiet`; 44px target, hover surface, visible focus |
| OFFER_ROW_RUNTIME | PASS | Identity column takes remaining flexible width; amount is tabular/right-aligned; 768 wraps instead of compressing |

No new visual concept. No Figma reopen.

## Evidence

Synthetic / local fixture data only. Runtime screenshots:

`.tmp/client-hub-final-evidence/`

```text
REAL_CLOUD_WRITE     = NO
SYNTHETIC_EVIDENCE   = YES
```

## Scope exclusions

- No global Cereri / Oferte / Lucrări page-content redesign
- Clients registry visual design not reopened; only the origin marker was added
- No Wave 2, no OS-S3
- PR #1 not reused, not cherry-picked, not merged

## Tests

```text
LINT                         = PASS (pre-existing react-refresh / hook warnings only)
TYPECHECK                    = PASS
BUILD                        = PASS
WEB_UNIT                     = 180 passed
DOMAIN_UNIT                  = 395 passed
API_UNIT                     = 251 passed on isolated retry
UNIT_FLAKES_IN_FULL_PARALLEL = api-shutdown SIGTERM timeout; cloud-provision two-process SQLITE_ERROR
UNIT_FLAKES_ISOLATED_RETRY   = PASS
FOCUSED_PLAYWRIGHT           = 21 passed / 0 failed
CLIENT_HUB_PLAYWRIGHT        = 9 passed
CLIENT_WORKSPACE_PLAYWRIGHT  = PASS
CLIENTS_REGISTRY_PLAYWRIGHT  = PASS
NAV_SHELL_PLAYWRIGHT         = PASS
SMOKE_PLAYWRIGHT             = PASS
ATELIER_OPERATOR_REGRESSION  = PASS
EXECUTION_OPERATOR_REGRESSION = PASS
FULL_E2E_CONTINUOUS          = Vite died at hf-wave2 after 42 passed / 4 skipped; later failures were ECONNREFUSED 5186
FULL_E2E_REMAINING_RERUN     = 48 passed / 2 skipped / 0 failed
FULL_E2E_PRODUCT_FAILURE     = NO
```

Unit coverage: active identity, attention from `summary.*NeedsAction`, next-action fallback is not attention, retired (no Cerere nouă), empty, section routing, drawer preserves `?section=`, registry origin marker, deep-link fallback `/clients`, long name, Prezentare without full lists.

Playwright journeys: registry return (q / status / attention / scroll), deep-link fallback, drawer cancel/save stay on Oferte, retired, attention before profile, empty, 768 two-line name, dark no white islands, visual evidence pack, global `/clients` `/requests` `/quotes` `/jobs` page-content regression.

## Runtime visual watch after recapture

Screenshots in `.tmp/client-hub-final-evidence/` are real workspace frames (not loading). Compared against accepted Figma floorplan.

```text
DATE_CLIENT_SURFACE_RUNTIME = adjusted minimally
SUMMARY_RAIL_RUNTIME        = adjusted minimally
QUIET_ACTION_RUNTIME        = PASS
OFFER_ROW_RUNTIME           = PASS
```

Tiny semantic-token CSS only. No new visual concept. No Figma reopen.

## GitHub

```text
DRAFT_PR              = https://github.com/office952/workos-final/pull/3
PR_1_REUSED           = NO
PUSH_MAIN             = NO
MERGE_MAIN            = NO
GITHUB_CI_RUN         = 33554629580
GITHUB_CI_URL         = https://github.com/office952/workos-final/actions/runs/33554629580
GITHUB_CI_STATUS      = completed
GITHUB_CI_CONCLUSION  = success
PUSH_CI_RUN           = 33554597986
PUSH_CI_CONCLUSION    = success
FULL_E2E_CI           = 90 passed / 5 skipped / 0 failed
```

Draft PR against `origin/main` (`1228397`). New PR. PR #1 not reused. Merge not authorized. Runtime not Owner accepted.
