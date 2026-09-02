# WorkOS V3 — Cereri — implemented, local in review

```text
OWNER_DECISION                 = GO IMPLEMENT CERERI V3
OWNER_ACCEPTED_SCOPE           = CERERI_V3_FIGMA_FINAL
CERERI_V3_FIGMA_FINAL          = OWNER_ACCEPTED
REQUESTS_DIRECTION             = OWNER_ACCEPTED
FIGMA_REOPEN_REQUIRED          = NO
REQUESTS_IMPLEMENTATION        = AUTHORIZED
REQUESTS_RUNTIME               = IMPLEMENTED_LOCAL_IN_REVIEW
REQUESTS_RUNTIME_ACCEPTED      = NO
REQUESTS_INTEGRATED_ON_MAIN    = NO
NEXT_WAVE                      = NO
MAIN_MERGE                     = NO
```

Owner authorized React implementation of the accepted Cereri V3 Figma for `/requests` and `/requests/:requestId` only. This file is the implementation worklog. It does not rewrite the Figma accept record and does not accept runtime or integrate on main.

## Identity

```text
REPO                 = office952/workos-final
WORKTREE             = C:/Users/offic/workspace/workos-final-clients-main-ff
BRANCH               = feat/ui-v3-cereri-final-v1
ORIGIN_MAIN          = 3d9e8e98234c0fa7db7a0dc0832e905cce4d7d8f
CLIENT_HUB_PRODUCT   = 05b8ae2ccf769f82ee9c702b37950a108d8203a2
FIGMA_FILE           = WorkOS V3 — Clients Final Design
FIGMA_FILE_KEY       = 1ev5lg7m2Ze1h3Vqmax8ho
FIGMA_PAGE           = WorkOS V3 — Cereri
FIGMA_PAGE_ID        = 105:4078
UX_LOCK              = 105:4079 / 105:4081
A11Y                 = 107:8424 / 107:8426
```

## Direction report

```text
ROADMAP_READ            = YES
UI_UX_CANON_READ        = YES
DIRECTION_CONFLICT      = YES — Figma UX LOCK 105:4079 still lists NEW → ATTENTION / De preluat and a full client profile create. Owner amend 2026-09-02 overrides those two business lines. Visual geometry stays Figma. No Figma write.
CURRENT_MILESTONE       = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP               = Independent ChatGPT final technical review, then Owner runtime inspection/acceptance.
THEME_IMPACT            = BOTH
NEW_HARDCODED_CSS       = NO
BACKEND_DETAILS_EXPOSED = NO
```

This GO does not contradict the V1 roadmap or the UI/UX direction canon. Page-content transformation stays `IN_PROGRESS`. Oferte and Lucrări stay unaccepted.

## Business source

Existing request, customer, quote, and job APIs. Attention labels move to domain so the UI does not invent them.

```text
BUSINESS_LOGIC_CHANGE = YES / ATTENTION_LAW_ONLY
DOMAIN_CHANGE         = YES / deriveRequestOverviewAttention
API_CHANGE            = NO
BACKEND_CHANGE        = NO
DATABASE_CHANGE       = NO
CLOUD_WRITE           = NO
NEW_DEPENDENCIES      = NO
NEW_FRAMEWORKS        = NO
```

Owner-accepted attention law (overrides the Figma UX LOCK business line for NEW):

```text
ATTENTION_LAW =
BLOCKED +
READY_FOR_QUOTE_WITHOUT_LINKED_QUOTE
NEW_ATTENTION = NO
IN_REVIEW_ATTENTION = NO
WAITING_CUSTOMER_ATTENTION = NO
CANCELLED_ATTENTION = NO
DEFAULT_SORT = CREATED_AT_DESC
ATTENTION_SORT = NO
```

`deriveRequestOverviewAttention` therefore produces:

```text
BLOCKED                  → needsAttention=true  / Blocat
READY_FOR_QUOTE no quote → needsAttention=true  / Urmează oferta
READY_FOR_QUOTE + quote  → needsAttention=false
NEW                      → needsAttention=false
IN_REVIEW                → needsAttention=false
WAITING_CUSTOMER         → needsAttention=false
CANCELLED                → needsAttention=false
LINKED_QUOTE + not BLOCKED → needsAttention=false
```

"De preluat" is not an `attentionLabel`, not a Signal Edge trigger, and not an attention-count input. Client Hub `requestNeedsAction` continues to count `request.needsAttention` from the same projection. No Hub-specific attention logic.

## Registry `/requests`

Pattern follows Clients V3: metric band, toolbar, one whole-row link, origin/scroll restore.

- Metrics: Cereri / Necesită atenție / Noi / Gata de ofertă
- 1920: seven status chips + independent attention + count | search
- ≤1919 (1440 / 1280 / 768): compact `Stare` select with the same seven statuses
- Search: `Caută titlu, CER- sau client.`
- Whole row is one link to the request object. Next action is text. Client is not a second link.
- Attention edge uses domain `needsAttention`
- Create drawer: **Clientul nu e în listă** expands to **Nume client** + **Creează clientul** only. No CUI, email, telefon, adresă, note, or full Client profile.
- After minimal create: the new client is selected, the quick-create collapses, request creation continues
- Hub `?customer=` locks the select and hides quick-create
- No pagination
- Default order is `createdAt` DESC. Attention filter reduces the set and does not reorder it

```text
QUICK_CLIENT_CREATE = MINIMAL_NAME_ONLY
HUB_CLIENT_LOCKED = YES
BACK_FROM_REGISTRY = ← Cereri
BACK_FROM_CLIENT_HUB = ← {customerDisplayName} → /clients/:id?section=cereri
BACK_CONTEXT_MECHANISM = location.state current-entry origin + transient session bridge
REQUEST_ORIGIN_LIFECYCLE = TRANSIENT / NO_STALE_DIRECT_REVISIT
```

Session keys: `workos.requests.workspaceOrigin` and `workos.requests.pendingClientHubOrigin`. `location.state` is the source of truth for the current history entry. Session storage is only a transient bridge: the Request Object binds the current entry and consumes the matching session fallback so a later direct or deep visit cannot resurrect Hub or registry origin. Registry mount still clears leftover storage. Hub entry with `?customer=` writes a pending Hub origin; a successful create binds `requestId` and navigates with that origin. Registry row clicks write `{ kind: "registry" }` and restore search/scroll. Browser Forward into an old history entry still reads that entry's `location.state`. No `history.length`, `document.referrer`, or TTL.

## Object `/requests/:requestId`

Editorial object, not a Hub rail and not local tabs.

- H1 = title; meta = reference · client · date · status
- Quiet **Editează cererea**; primary from `requestObjectPrimaryAction`
- **Ce a cerut**: description + facts (Client, Stare, Progres, Montaj, Fișiere)
- Long description: short text has no control; overflow shows **Arată tot** / **Restrânge**
- Installation stays on the page (OS-S2 path). **Editare** is `Disponibilă — fără ofertă` or `Blocată după ofertă`. No `Lock`
- Incompatible mode: `Modul salvat nu mai este oferit de organizație.`
- Operator-actionable missing facts first; cost-evidence remains in the facts form
- **Oferte și lucrări legate**: Ofertă + Lucrare only. No Cerere row. Jobs come from linked quotes that have `orderSnapshotId`
- Product choice is **Alege produs** → `/products?request=`. No product catalog list on the object

Primary action order:

1. incompatible mode → **Alege un mod oferit**
2. selected + writable + operator-incomplete → **Completează montajul**
3. first linked quote → **Deschide oferta**
4. not cancelled → **Alege produs**
5. else none

## Scope exclusions

- No Oferte / Lucrări page-content redesign
- No new commercial engine, API, database, or Cloud write
- No fake LUC- IDs
- No pagination
- No Figma write
- Runtime not Owner-accepted
- Not integrated on main
- Runtime not Owner-accepted
- Not integrated on main

## Figma nodes used as final visual authority (read-only)

```text
FIGMA_FILE_KEY                 = 1ev5lg7m2Ze1h3Vqmax8ho
FIGMA_REGISTRY_1920_NODE       = 105:4152 / toolbar chips 106:2044 (7 FilterControl)
FIGMA_REGISTRY_1440_NODE       = 107:4394 / StatusFilter 109:7329
FIGMA_REGISTRY_1280_NODE       = 107:4471 / StatusFilter 109:7333
FIGMA_REGISTRY_768_NODE        = 107:6865 / StatusFilter 109:7337
FIGMA_BACK_CONTEXT_NODE        = 107:6506 / Object Back Context 107:6547 = Cereri
FIGMA_QUICK_CREATE_NODE        = 108:7454 / drawer 108:7434; extra profile fields hidden
UX_LOCK                        = 105:4079 / 105:4081
```

1920 chips stay. 1440/1280/768 stay compact StatusFilter. Object back visual lock is `← Cereri`. Hub-named back is Owner runtime origin law, not a second Figma object frame.

## Tests

```text
LINT                         = PASS (0 errors / 11 existing warnings)
TYPECHECK                    = PASS
DOMAIN_UNIT                  = 397 passed
WEB_UNIT                     = 203 passed
API_UNIT                     = 251 passed
BUILD                        = PASS
PLAYWRIGHT_REQUESTS_OVERVIEW = 2 passed
PLAYWRIGHT_PRECOMMIT_CLOSURE = 1 passed
PLAYWRIGHT_CLIENT_WORKSPACE  = 1 passed
PLAYWRIGHT_ORIGIN_LIFECYCLE  = 4 passed / repeat-each=3 = 12 passed
FOCUSED_PLAYWRIGHT           = 8 passed / 0 failed / retries=0
FOCUSED_ORIGIN_REPEAT        = 12 passed / 0 failed / 0 flaky
```

The two API failures on the first full `pnpm test` are Cloud/shutdown timing, not Cereri. Isolated re-run of those files passed. Focused Playwright used ports `8805` / `5195` and `.tmp/e2e-data-cereri-amend`.

GitHub PR CI then failed 5 Client Hub / Clients registry e2e tests: they seeded `NEW` requests and still expected `requestNeedsAction` / Signal Edge. Those fixtures now create `READY_FOR_QUOTE` without a linked quote so they follow the same Owner attention truth. No Hub or Clients visual change.

A later independent review found one P2: Hub / downstream exits never remounted `/requests`, so the session fallback could resurrect an old origin on a later direct visit to the same request. Request Object now consumes the matching session once the current history entry owns the origin. A later direct visit without `location.state` is a fresh `← Cereri`. Browser Forward still uses that entry's stored origin.

```text
REQUEST_ORIGIN_LIFECYCLE              = TRANSIENT / NO_STALE_DIRECT_REVISIT
HUB_STALE_ORIGIN_TEST                 = PASS
REGISTRY_STALE_ORIGIN_TEST            = PASS
DOWNSTREAM_EXIT_STALE_ORIGIN_TEST     = PASS
HISTORY_FORWARD_ORIGIN                = PASS
OWNER_AMENDMENT_DOC_RECONCILED        = YES
```

The Figma accept record now carries an explicit post-acceptance Owner amendment for the two superseded business lines. Figma was not edited. Attention, sort, and quick-create were not reopened.

## Browser verification

Real local runtime against that API, not mocks.

```text
REGISTRY_1920_CHIPS     = PASS
REGISTRY_1440_COMPACT   = PASS
REGISTRY_768_COMPACT    = PASS
REGISTRY_768_OVERFLOW   = NO
CREATE_DRAWER           = PASS
QUICK_CLIENT_NAME_ONLY  = PASS
HUB_CLIENT_LOCK         = PASS
OBJECT_NO_LOCK          = PASS
OBJECT_EDITARE          = PASS
OBJECT_PRIMARY          = PASS
RELATED_NO_CERERE_ROW   = PASS
CATALOG_FROM_REQUEST    = PASS
DARK_NO_WHITE_ISLANDS   = PASS
CONSOLE_ERRORS          = 0
```

Local evidence (not worklog screenshots): `.tmp/cereri-v3-768-registry.png`, `.tmp/cereri-v3-768-dark.png`, `.tmp/cereri-v3-1920-dark.png`, `.tmp/cereri-v3-1920-object.png`.

Playwright also wrote `docs/worklog/screenshots/requests-overview-desktop.png`, `request-detail.png`, `request-product-context.png`, `request-linked-quote.png`, and `requests-narrow.png`.

## GitHub

```text
COMMIT                = YES — after Owner pre-commit closure
PUSH_FEATURE_BRANCH   = YES
DRAFT_PR              = YES — new draft, not PR #1
PUSH_MAIN             = NO
MERGE_MAIN            = NO
FORCE                 = NO
OWNER_RUNTIME_ACCEPTED = NO
```

Independent code, CI, runtime, and graphic review are required before any merge.
