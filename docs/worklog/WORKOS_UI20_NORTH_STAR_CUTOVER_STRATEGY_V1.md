# WorkOS UI20 — North Star Cutover Strategy V1

```text
STATUS                            = ACCEPTED_WITH_BINDING_AMENDMENTS
AUTHORITY                         = OWNER_GO_UI20_NORTH_STAR_CUTOVER_STRATEGY_V1
ACCEPTANCE_AUTHORITY              = OWNER_DELEGATE_CHATGPT
CUTOVER_STRATEGY                  = ACCEPTED_THEN_REVOKED_FOR_COVERAGE_FIRST
PR_STRATEGY                       = CONTINUE_PR23
NEW_CUTOVER_PR                    = NO
PRODUCT_ROUTE_COMPATIBILITY       = REQUIRED
GLOBAL_NAV_VISIBILITY_TRUTH       = REQUIRED
LEGACY_BODY_COMPATIBILITY         = OUT_OF_SPINE_ONLY
LEGACY_SHELL_NESTING              = FORBIDDEN
DELETE_AFTER_SOAK                 = YES
DELETE_DURING_CUTOVER             = NO
IMPLEMENTATION                    = NO
CUTOVER_GO                        = REVOKED
ROOT_SWAP                         = NO
NEXT_PROGRAM                      = UI20_CLEAN_SHEET_COVERAGE_EXPANSION
MERGE                             = NO
CUTOVER                           = NO
HOME                              = NO
PARTIAL_MAIN_UI_INTEGRATION       = FORBIDDEN_UNTIL_FINAL_CUTOVER_MECHANICS
FIGMA_WRITE                       = NO
DOMAIN_REBUILD                    = NO
BACKEND_REBUILD                   = NO
API_REBUILD                       = NO
PRODUCT_TRUTH_REBUILD             = NO
```

```text
ROADMAP_READ
UI_UX_CANON_READ
FOUNDATION_CANON_READ
DIRECTION_CONFLICT = NO
```

## Identity

```text
REPO           = office952/workos-final
BRANCH         = design/ui20-vertical-north-star-clean-sheet
PR23           = https://github.com/office952/workos-final/pull/23
PR23_STATE     = DRAFT / OPEN
ORIGIN_MAIN    = c93ae03bfefcffd58e1e687eb3793f6b989f9a7e
NORTH_STAR_HEAD= 70cdb73cecb21eaa9e460e6c5db48a75c542b7a4
PASS_A         = ACCEPTED
PASS_B         = ACCEPTED
PASS_C         = ACCEPTED
ISOLATED_PREVIEW = OWNER_DELEGATE_ACCEPTED
NORTH_STAR_FINAL_RUNTIME = OWNER_DELEGATE_ACCEPTED
FINAL_VISUAL_RUNTIME_GATE = PASSED
CURRENT_RUNTIME_ON_MAIN = UNCHANGED
MERGE_NOW = NO
CUTOVER_NOW = NO
CORRECTION_WAVE = NO
```

This document is cutover control only. It does not authorize React cutover,
merge, Home, polish, Figma write, or domain/API change.

Canon already forbids page-by-page live migration. Accepted architecture already
defines one cutover after whole-spine acceptance. Pass A–C closed that product
acceptance gate for the isolated vertical. What remains is the executable
integration plan.

---

## Verdict

```text
VERDICT = CUTOVER_STRATEGY_ACCEPTED_WITH_BINDING_AMENDMENTS
CUTOVER_AUTHORIZED_NOW = NO
NEXT_EXECUTABLE_BUILD  = UI20_NORTH_STAR_CUTOVER_IMPLEMENTATION
PR23_ROLE              = CONTINUE_SAME_PR_AS_ATOMIC_INTEGRATION_CANDIDATE
CUTOVER_PR_ROLE        = NO_NEW_PR
```

Do not create another cutover PR. Continue PR #23.  
Do not start coverage for Clients / Admin / Resources before cutover.  
Do not reopen visual research.  
Do not nest AppShell under Ui20Shell.  
Product `/products` and `/products/:code` remain query-context compatible.

---

## What cutover means

Cutover = **one presentation-root swap** on the living web entry:

```text
BEFORE  main.tsx → App → SessionedApp → AppShell → living *Page.tsx
AFTER   main.tsx → Ui20App → SessionedApp → Ui20Shell → route table
```

Same pathnames. Same `*Api.ts`. Same domain/API/IDs. Same Cloud / Operator
session gate. No second business engine.

Forbidden reading of “partial”:

- replacing only Cerere or only Configurator on main while other spine routes
  keep old chrome as the new product
- keeping two operator shells (AppShell + Ui20Shell) as dual living grammars

Allowed reading of hybrid during first cutover (explicit final mechanics):

- **one** shell (`Ui20Shell`)
- North Star surfaces for the accepted spine
- existing `*Page.tsx` bodies temporarily mounted **inside** `Ui20Shell` for
  out-of-spine destinations (Clients, Admin, Resources, overviews) until later
  coverage waves rewrite them

That hybrid is coverage deferral under one shell, not horizontal page migration.

---

## Cutover phases

### Phase 0 — Isolated preview (DONE)

```text
ui20.html + previewMain → Ui20App
App.tsx living runtime unchanged
```

### Phase 1 — Pass A / B / C on one branch (DONE)

```text
PASS_A = functional vertical skeleton
PASS_B = instrument depth
PASS_C = optical convergence
```

### Phase 2 — Owner-delegate product acceptance (DONE)

```text
ISOLATED_NORTH_STAR = ACCEPTED
OWNER_ACCEPTED_FINAL_RUNTIME_ON_MAIN = NO
```

### Phase 3 — Cutover implementation (NOT AUTHORIZED YET)

Requires explicit Owner / Owner-delegate **CUTOVER GO** after this strategy is
accepted.

Exact mechanics:

1. **Bootstrap**
   - Living `main.tsx` renders `Ui20App` (or thin alias) instead of `App`.
   - Keep `SessionedApp` as the single Cloud + Operator gate.
   - Keep one `ThemeProvider` + `BrowserRouter`.
   - Retire isolated-only `previewMain` / `ui20.html` as the operator entry
     after cutover (may remain temporarily as diagnostic entry only if useful;
     default operator path is `index.html`).

2. **Shell**
   - Living chrome becomes `Ui20Shell`.
   - Stop mounting `AppShell` / `GlobalShellTop` / `GlobalNavigation` /
     `ObjectContextStrip` / `MobileNavigationDrawer` as living grammar.
   - Navigation completeness for out-of-spine destinations uses existing
     visibility truth, projected quietly into Ui20 shell destinations — not a
     restored L1 sidebar.

3. **Route table (same pathnames)**

| Path | After cutover owner | Notes |
|---|---|---|
| `/` | Lucrări list (existing jobs overview truth, Ui20 presentation or thin `JobsLaunch`) | **Not** Acasă |
| `/jobs`, `/jobs/*` | `ProductionTraveler` / jobs launch | spine |
| `/requests/*` | `ResolutionField` | spine; overview `/requests` stays living page body in Ui20Shell until coverage |
| `/products?request=` | `ProductPickBridge` | contextual bridge |
| `/products/:productCode` | `ConstructionWorkspace` | spine |
| `/quotes/*` | `CommercialSheet` | spine; `/quotes` overview deferred |
| `/atelier` | `DispatchFloor` | spine |
| `/execution/*` | `Workstation` | spine |
| `/clients`, `/clients/*` | existing Client pages inside Ui20Shell | coverage later |
| `/admin/**`, Resources, Product System, People, Stock, etc. | existing admin pages inside Ui20Shell | coverage later |
| `/system`, `/components`, `/governance` | existing pages inside Ui20Shell | coverage later |

4. **Parity lock**
   - No domain/API/DB/migration/seed writes in the cutover PR.
   - No pricing / Product Truth / snapshot law changes.
   - Business facts for the same IDs must match pre-cutover living runtime.

5. **Stop rules inside Phase 3**
   - No Home / Acasă root migration.
   - No Master Polish program.
   - No Figma write.
   - No deleting obsolete pages until post-cutover gate (Phase 4).

### Phase 4 — Delete-later after proven cutover (AFTER Phase 3 acceptance)

Only after living e2e + CI prove the cutover head and Owner-delegate accepts
runtime on main.

Delete or archive presentation that no longer has a living consumer. Do not
delete domain, API, or shared view-models that still feed Ui20.

### Phase 5 — Coverage waves (OUT OF THIS STRATEGY EXECUTION)

Separate later builds: Requests/Quotes overviews, Client Hub, Resources,
Admin, then Home launchpad contract. Not part of first cutover.

---

## Bootstrap / shared-provider strategy

```text
KEEP AS SHARED AUTHORITY
  SessionedApp
  CloudSessionProvider / useCloudSession
  OperatorSessionProvider
  ThemeProvider
  LoginPage gates
  *Api.ts clients
  requestResolutionView / constructionCompositionModel / other pure projections
  FormRenderer schema semantics (presentation chrome may stay Ui20 lens)

REPLACE AS LIVING PRESENTATION ROOT
  App + AppShell route mounting
  → Ui20App + Ui20Shell route mounting

ISOLATED ENTRY AFTER CUTOVER
  previewMain / ui20.html / vite.ui20.config.ts
  → optional diagnostic only; not the operator default
```

No second auth stack. No second theme system. No `ui20` parallel API.

---

## Parity requirements

Before cutover is called PASS:

```text
DOMAIN_DIFF              = NONE
API_DIFF                 = NONE
DB_DIFF                  = NONE
PRODUCT_TRUTH_DIFF       = NONE
PRICE_LOGIC_DIFF         = NONE
SNAPSHOT_LOGIC_DIFF      = NONE
SAME_IDS                 = YES
SAME_REQUEST_REFERENCE   = YES
SAME_QUOTE_GROSS         = YES (Ofertă only)
CONFIG_HIDES_COMMERCIAL  = YES
NO_FAKE_UI_TRUTH         = YES
UNCONDITIONAL_ATELIER_GLOBAL_LINK = NO
ACASA_ROOT               = NOT_AUTHORIZED
```

Side-by-side proof on one synthetic fixture:

1. Create request → product → confirm → quote → accept → order → release → plan
2. Compare living-before and cutover-after for the same IDs
3. Operator path after cutover is only the North Star spine chrome for those
   routes

---

## Test gates required before merge of cutover

Must all be green on the **exact cutover SHA**:

1. Domain unit suite  
2. API unit/integration suite  
3. Web unit suite (living + ui20)  
4. Typecheck / lint / web build  
5. Isolated vertical e2e (`e2e:ui20-pass-a` or successor cutover e2e)  
6. Living Playwright spine-critical set at minimum:
   - `quote-acceptance`
   - `requests-overview`
   - one execution / atelier golden path already used in CI
7. Full CI on the cutover PR  
8. Explicit parity manifest (same IDs, same commercial value location)  
9. Keyboard / focus / no horizontal overflow spot-check on cutover entry  
10. Smoke that out-of-spine routes still open under Ui20Shell (Clients, one
    Admin page) without inventing new IA

Do not weaken assertions to make cutover green.

---

## Rollback / fallback

```text
ROLLBACK_UNIT = GIT_REVERT_OR_REDEPLOY_PREVIOUS_MAIN_SHA
```

Mechanics:

1. Cutover is one presentation-root commit series. Prefer a single mergeable
   cutover PR so revert restores previous `main.tsx`/`App` wiring cleanly.
2. Keep previous living page modules in tree until Phase 4 deletion gate.  
   Rollback must not require restoring deleted files.
3. Feature flag is **not** required if revert is clean and Phase 4 has not
   deleted old pages. Optional temporary entry switch is allowed only if Owner
   demands belt-and-suspenders; default strategy is clean atomic swap + keep
   old pages until proven.
4. Data rollback is out of scope: cutover must not mutate business DB truth.
5. If cutover exposes a business-truth bug, STOP and fix truth in domain/API —
   do not paper over with UI.

---

## Delete-later map

### Delete after Phase 3 acceptance + soak (Phase 4)

Spine presentation replacements (when no longer imported):

| Obsolete presentation | Replaced by |
|---|---|
| `RequestDetailPage.tsx` living composition for `/requests/*` | `ResolutionField` |
| `ProductConfigurationPage.tsx` living composition for configurator spine | `ConstructionWorkspace` |
| `ProductCatalogPage.tsx` when only contextual pick remains for request flow | `ProductPickBridge` (+ later catalog coverage) |
| `QuoteInspectionPage.tsx` for `/quotes/*` | `CommercialSheet` |
| `JobDetailPage.tsx` for `/jobs/*` | `ProductionTraveler` |
| `AtelierPage.tsx` | `DispatchFloor` |
| `ExecutionWorkspacePage.tsx` | `Workstation` |
| `AppShell.tsx` + RW1 final chrome stack as living shell | `Ui20Shell` |
| `ui/StableSidebar.tsx` | already unused by RW1; delete when nothing imports it |
| orphan V3 page/card grammar CSS no longer referenced | `ui20/tokens/ui20.css` |

### Keep through first cutover (do not delete in Phase 3)

- All out-of-spine `*Page.tsx` (Clients, Admin, Resources, overviews, System)
- Shared APIs, session, LoginPage, FormRenderer semantics
- Pure view-models under `apps/web/src/` used by ui20
- Living e2e helpers

### Never delete as “UI cleanup”

- `packages/domain/**`
- `apps/api/**`
- Product Truth / commercial / execution engines

### Isolated tooling

After cutover default entry is living `index.html`:

- `ui20.html` / `vite.ui20.config.ts` / `previewMain.tsx` may remain for
  forensic preview or be removed in a tidy PR — not blocking cutover PASS.

---

## PR strategy

```text
PR23
  ROLE     = NORTH_STAR_PRODUCT_BRANCH_EVIDENCE
  STATE    = KEEP_DRAFT
  MERGE    = NO
  SPLIT    = NO (do not explode into page PRs)

FOLLOW-ON
  NAME     = UI20_NORTH_STAR_CUTOVER_IMPLEMENTATION
  BASE     = same branch continuing from accepted North Star head
            OR new PR from that branch to main after CUTOVER GO
  CONTENT  = presentation-root swap + route table + tests/parity only
  MERGE    = only after cutover gates + Owner-delegate accept
```

Recommendation:

1. Leave PR #23 Draft. It already contains accepted Pass A–C.  
2. Do **not** merge PR #23 without cutover mechanics — main would still be
   living App while the branch is “accepted product” only.  
3. After this strategy is accepted and Owner issues **CUTOVER GO**, implement
   cutover on the same branch and open / convert a **cutover PR** to main.  
4. Prefer one cutover PR review surface (“wiring + gates”), not a reopen of
   Pass C visual debate.

---

## Forbidden actions in this strategy task / until CUTOVER GO

```text
IMPLEMENTATION ON LIVING PRODUCT CODE = NO
MERGE_MAIN                            = NO
CUTOVER_NOW                           = NO
HOME / ACASA_ROOT                     = NO
FIGMA_WRITE                           = NO
DOMAIN / API / DB / MIGRATION / SEED  = NO
PRODUCT_TRUTH / PRICING REDESIGN      = NO
PARTIAL SPINE ROUTE CUTOVER ON MAIN   = NO
VISUAL RESEARCH REOPEN                = NO
PASS_C POLISH REOPEN                  = NO
DELETE_LATER EXECUTION NOW            = NO
CLIENTS / ADMIN / RESOURCES REBUILD   = NO
```

---

## Risk map

| Risk | Severity | Mitigation |
|---|---|---|
| Dual shell if AppShell left half-alive | High | One root: Ui20Shell only |
| Out-of-spine pages break under new shell | Medium | Mount existing pages inside Ui20Shell; smoke Clients + one Admin |
| Accidental `/` → Acasă | High | Explicit `/` = Lucrări; Home later |
| Business truth drift during cutover | Critical | No domain/API/DB writes; parity ID proof |
| Premature deletion of old pages | High | Phase 4 only after soak |
| Merging PR23 without wiring | High | Keep Draft; cutover PR separate/follow-on |
| Navigation vacuum for Admin/Clients | Medium | Quiet destinations from existing visibility truth, not fake L1 |

---

## Blockers before cutover implementation may start

```text
STRATEGY_ACCEPTED_BY_OWNER_DELEGATE = REQUIRED
EXPLICIT_CUTOVER_GO                 = REQUIRED
PR23_REMAINS_DRAFT_UNTIL_THEN       = YES
NO_OTHER_BLOCKER_FROM_PASS_C        = YES
```

No technical blocker in isolated product acceptance. The only gate is
authorization for Phase 3.

---

## Next executable build

```text
NEXT_STEP = RETURN_FOR_STRATEGY_ACCEPTANCE
THEN      = UI20_NORTH_STAR_CUTOVER_IMPLEMENTATION
```

When Owner-delegate accepts this strategy and issues CUTOVER GO, the next
Cursor prompt must:

1. lock identity on the North Star branch  
2. swap living presentation root to Ui20App / Ui20Shell  
3. wire the route table above  
4. keep non-spine pages temporarily inside Ui20Shell  
5. run the test gates  
6. keep DELETE_LATER for a follow-up after acceptance  
7. stop before Home / coverage rebuild / Figma write  

Until that GO: **STOP.**
