# WorkOS First HF lot UI implementation Wave 1

```text
GO                         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1
BRANCH                     = feat/first-hf-lot-ui-wave1-foundation-routes-access-v1
BASE                       = 00c9aed9dd5dba24e6317ebbe27f8bf0a85732f7
ORIGIN_MAIN                = 00c9aed9dd5dba24e6317ebbe27f8bf0a85732f7
CURRENT_MILESTONE          = HUB_MEDIA_CLEAN_PILOT
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_1_REVIEW = PASS
OWNER_DECISION             = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
WAVE_1_GATE                = CLOSED
UI_IMPLEMENTATION_COMPLETE = NO
FULL_FIRST_HF_LOT_IMPLEMENTED = NO
WAVE_2                     = NOT_STARTED
NEXT_STEP                  = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2_COMMERCIAL_CATALOG_CONFIGURATOR_OWNER_GO
```

## Authority

Owner GO for foundation, stable routes, and financial access V1. Same chat, same worktree `C:\Users\offic\workspace\workos-final-pilot-hf-scope`. No second worktree. No Job entity. No `seller` Cloud role. Owner review is `PASS` / `ACCEPTED_WITH_ADVISORIES`. Wave 1 gate is closed. Full first HF lot is not implemented. Wave 2 is not started.

Figma `7elwvIscvMPDiEHrX4f6kQ` was the accepted visual baseline. This GO did not write to Figma.

## What this wave implements

1. `ALT_B_SCOPED` financial filtering on API/read models.
2. Stable loaders `GET /api/jobs/:jobId` and `GET /api/quotes/:quoteSnapshotId`.
3. UI routes `/jobs/:jobId` and `/quotes/:quoteSnapshotId`.
4. Industrial Clarity token foundation: LIGHT / DARK / SYSTEM.
5. Level 1 label `Catalog`.
6. Job detail and quote inspection screens.
7. Minimal href remaps. Legacy `?order=` and `?quote=` remain.

## Financial matrix

| Context | Client net / VAT / gross | Internal / markup / margin / EIC / rates |
| --- | --- | --- |
| Owner on commercial or job detail | YES | YES |
| Member on commercial or job detail | YES | NO — keys absent, not null |
| Any role on Atelier / Execution | NO | NO |
| Unauthenticated | 401 | 401 |

Enforcement is `resolveFinancialAccess({ family, isOwner })` plus `omitForbiddenFinancialFields`. Workshop family is always workshop, including Owner. Job-detail planned-versus-actual may show Owner internal totals because that read model is commercial family; the Execution workspace payload stays workshop-stripped.

No UI component derives permission. No `seller` role.

## Routes

| Before | After |
| --- | --- |
| Lucrări next action → `?order=` or `/execution/:planId` | `/jobs/:orderSnapshotId` |
| Oferte next action → `?quote=` or `?order=` | `/quotes/:quoteSnapshotId` |
| Configurator continue | still `?order=` / `?quote=` |
| Execution workspace | still `/execution/:planId` — not job detail |

`OF-…` remains display only.

## Theme and shell

- Semantic tokens: surface / text / border / action / focus / status.
- Legacy `--bg`, `--ink`, `--accent` alias the same tokens. No universal CSS rewrite.
- DARK is a separate palette from Figma `68:431`, not an invert.
- SYSTEM follows `prefers-color-scheme` until the user saves LIGHT or DARK in `localStorage` key `workos.theme`.
- Skip link, landmarks, 44 px targets, visible focus, reduced motion.
- Utilities (`Temă`, `Cont`, operator) stay reachable at 768. `Administrare` stays a full word.

## Intended Figma differences

- Catalog Level 1 and page `h1` are both `Catalog`. `Produse` remains the collection/lead copy, not a second destination name.
- Job/quote amounts show a visible `EUR` suffix (`624,82 EUR`, `TVA 21%`). Figma frames omit the suffix; Owner review rejected that as an intended diff.
- Job/quote screens use the existing Romanian primitives, not a pixel-perfect component library.
- Spacing and type are IBM Plex + accepted radii, not a second design kit.
- Operator 01 customer-gross on Atelier is superseded by `OPERATOR_FINANCIAL_PAYLOAD = NONE`.
- Execution remains `/execution/:planId`.

## Verification executed

| Gate | Result |
| --- | --- |
| Domain unit | 369 passed |
| API unit | 207 passed, including `financial-access`, `jobs`, `quotes-overview`, `cloud-isolation` |
| Web unit/component | 94 passed |
| Typecheck | domain, API, web passed |
| Web lint | 0 errors, 13 warnings (pre-existing hooks/fast-refresh + ThemeProvider export) |
| API lint | 3 unused-symbol errors, **identical** on `00c9aed` stdin vs HEAD files: `renameCustomer` `store.ts:4:3`, `dirname` `attachmentStorage.ts:11:10`, `quoteB` `customer-workspace.test.ts:95:11`. Those three files have empty diff vs base. |
| Web production build | passed |
| Playwright full isolated suite | 66 passed, 5 skipped, 0 failed on ports 8805/5191, `WORKOS_E2E_DATA_DIR=.tmp/e2e-wave1-review-full5`, `WORKOS_CLOUD_ROOT` unset. Skipped: 3 Cloud isolation (no Cloud root), jobs empty-state (store already has jobs), people-hardening-after (pointer from another isolated dir). |

No axe/lighthouse plugin was installed. Keyboard: skip-link is reachable by Shift+Tab from the logo and moves focus to `#continut-principal`. Route change focuses `main` so the first Tab after navigation does not return to the skip link.

## Screenshots

- `docs/worklog/screenshots/hf-wave1-job-1440-light.png`
- `docs/worklog/screenshots/hf-wave1-job-1280-light.png`
- `docs/worklog/screenshots/hf-wave1-job-768-light.png`
- `docs/worklog/screenshots/hf-wave1-job-1440-dark.png`
- `docs/worklog/screenshots/hf-wave1-quote-1440-light.png`
- `docs/worklog/screenshots/hf-wave1-quote-1280-light.png`
- `docs/worklog/screenshots/hf-wave1-quote-768-light.png`
- `docs/worklog/screenshots/hf-wave1-quote-1440-dark.png`
- `docs/worklog/screenshots/hf-wave1-fidelity-home-1440-light.png`
- `docs/worklog/screenshots/hf-wave1-fidelity-job-404-light.png`
- `docs/worklog/screenshots/hf-wave1-fidelity-job-noplan-light.png`

SYSTEM was verified: no stored preference follows OS live; explicit LIGHT/DARK survive OS change and reload; return to SYSTEM removes `workos.theme`. Contrast pairs from the accepted token set. 768 keeps `Cont`, theme, and the full word `Administrare`. Primary action is visible. Amounts include `EUR`.

Independent review captures: `docs/worklog/screenshots/hf-wave1-review-*.png` (home, job, quote, atelier, execution, catalog, quotes, admin × 1440/1280/768 × LIGHT/DARK).

## Independent review corrections

Same commit, amend only. No Wave 2. No push.

| Item | Before | After |
| --- | --- | --- |
| Currency | Job/quote amounts without `EUR` | `formatCustomerMoneyAmount` → `624,82 EUR`; VAT label `TVA 21%`. PDF `formatCustomerMoney` unchanged. |
| Catalog naming | L1 `Catalog`, page H1 `Produse` | H1 `Catalog`; lead `Produsele din catalog. Alegeți un produs.` Route `/products` unchanged. |
| SYSTEM theme | Choosing SYSTEM could leave a stored LIGHT/DARK override | `localStorage.removeItem("workos.theme")` on SYSTEM. |
| Member resources leak | `GET /api/resources-admin` omitted `amount`/`rate` but kept `amountDisplay` (`"3,00 EUR / m"`) | `omitResourceCostAmounts` also strips `amountDisplay`. |
| Requests e2e | Expected product-page headings after remapped accept/order links | Quote inspection / job detail assertions; `Deschide oferta` href `/quotes/`. |
| Execution e2e | Several specs never identified the operator after Wave 1 claim-on-start | `identifyTestExecutorOnPage` on stock / actuals / commercial execution / people specs. |
| Resources e2e copy | Expected retired lead sentence | Matches current owner notice. |
| Hardening-after e2e | Leftover `.tmp/hardening-person.json` from another data dir failed the person heading | Skips when the person is not in this isolated store. |
| Dark list CTA contrast | `a.button-link` hardcoded `color:#fff` on `--accent` `#6fa3d0` (~2.68:1) | Uses `--action-on-primary` (same pair as skip-link / native buttons). |
| Dark body-link contrast | Job `Deschide configuratorul` / `Ofertă` / `Plan de execuție` used browser `#0000EE` | `.decision-workspace a:not(.button-link)` uses `--action-primary`. |
| Done-chip contrast | `status-chip-done` used `--muted` (~4.1–4.3:1) | Uses `--text-secondary`. |
| Quote accept next-action | Inspection wrote `stage` / `nextAction` locally after accept | Refetches `GET /api/quotes/:id`. |
| Living status headers | Direction + readiness still said Wave 1 `NOT_STARTED` | Factual `IN_REVIEW` / `WAVE_1_FOUNDATION_ROUTES_ACCESS` aligned to the roadmap. Not Owner PASS. |

Four-lane independent re-review (read-only; Figma + Playwright MCP; no plugin install):

| Lane | Result |
| --- | --- |
| Security | `FINANCIAL_PAYLOAD_LEAKS = 0`. Owner commercial JSON keeps client + internal + markup/margin. Member Cloud fixture: client only; internals absent. Workshop: no money. Unauth Cloud: 401. |
| Routing / regression | Direct / refresh / back-forward / encoded IDs / 404 / legacy `?order=` `?quote=` PASS. `/execution/:planId` stays workspace. API lint baseline re-proven identical. |
| Canon / scope | `SCOPE_OK = YES`. Wave 2 not started. Status headers and quote accept next-action corrected above. `scopeFrozenCommercial` COMPLETE/0 when EIC is omitted was not changed: live fixture has real EIC; Security saw no leak; no second price formula. |
| Visual / a11y | Catalog naming, currency with EUR, SYSTEM theme PASS. Overflow 0. Clipping 0. Dark CTA / body-link contrast closed in this amend. |

## Reviews before commit

| Review | Verdict |
| --- | --- |
| Security / payload | P0 closed: workshop strips all money including Owner; member commercial/job omit internal keys (absent, not null); member resources also omit `amountDisplay`; isolation attacks include `/api/quotes/:id` and `/api/jobs/:id`. PDF still renders from the stored full snapshot. |
| Domain | No Job entity. `jobId === orderSnapshotId`. `OF-…` display only. Accept/order/release truth unchanged. |
| Routing / refresh | `/jobs/:id` and `/quotes/:id` load from API. Legacy `?order=` / `?quote=` kept. `/execution/:planId` is not job detail. |
| UX / IA | Catalog at Level 1. One primary action. `Acceptată` is status. Loading / 404 / forbidden / empty plan projected. |
| Visual / responsive | LIGHT and designed DARK. 1440 / 1280 / 768 captured. Not pixel-identical to Figma; tokens + IBM Plex. |
| Accessibility | Skip link, landmarks, one `h1`, 44 px targets, visible focus, reduced motion. No audit plugin. |
| Regression | Product confirm still exposes Owner EIC. Execution UI no longer shows planned/actual cost. |
| Scope guardian | No Job table, no `seller` role, no full Comercial/Atelier/Catalog rewrite, no plugin install. |
| Adversarial privacy | Owner on Execution GET has no `eicTotal` / `actualInternalCost`. Member job GET has client prices only. |

## Final visual fidelity correction

Owner returned `VISUAL_FIDELITY = NOT_YET_ACCEPTED`. Same commit, amend only. No Wave 2. No push. No route, IA, contract, or money-policy change.

Figma baseline re-resolved on `7elwvIscvMPDiEHrX4f6kQ` (nodes still exist even when the page list is thin):

| Screen | Frame | Route | State |
| --- | --- | --- | --- |
| Detaliu lucrare blocată | `68:353` | `/jobs/:jobId` | blocked |
| Detaliu lucrare recuperată | `68:316` | `/jobs/:jobId` | ready / same job |
| Detaliu 768 | `68:392` | `/jobs/:jobId` | responsive |
| Detaliu DARK | `68:431` | `/jobs/:jobId` | dark |
| Ofertă member | `70:298` | `/quotes/:quoteSnapshotId` | member |
| Ofertă Owner | `93:1185` | `/quotes/:quoteSnapshotId` | owner |
| Ofertă DARK | `70:337` | `/quotes/:quoteSnapshotId` | dark |

| Before | After |
| --- | --- |
| Job/quote generic card stacks | Composed workspace: title + chip, identity, next step, 2-column grid, full-width plan, one primary |
| Job money sat in the right column and unbalanced the Figma grid | Client/Owner money stays on the commercial job read model, as a compact strip above actions |
| Search ~33 px, client/row links ~21 px, header capped at 72 rem so utilities wrapped at 1280/1440 | Search 448×44, theme 44×44, Cont 44, row/client links 44, header full width, `flex-wrap: nowrap` on desktop |
| 768 stacked brand → domains → utilities, Cont inside utilities | 768 grid: brand + Cont, domains, theme + Identifică-te. `Administrare` stays a full word |

Intended remaining diffs vs Figma: inscription instead of invented `LUC-` ids; no Față/Finisaj/hours unless on the payload; live primary is API-driven (`Deschide execuția` / `Deschide lucrarea`), not Figma `Eliberează` + PDF; no `Pornește` on job detail; EUR suffix required.

Recovered state is the same page with Blocaj replaced by Stare. Live review fixture stays blocked (`Lipsă utilaj dedicat`). Member quote layout is proven by component test; this single-plane runtime is Owner.

Additional captures: `hf-wave1-quote-1280-light.png`, `hf-wave1-quote-768-light.png`, `hf-wave1-fidelity-home-1440-light.png`, `hf-wave1-fidelity-job-404-light.png`, `hf-wave1-fidelity-job-noplan-light.png`.

Measured after correction: desktop header 44 px one row at 1440 and 1280; `under44 = 0` on job, quote, home (search 44); contrast samples ≥ 5.03; overflow-x 0.

## Owner accept

```text
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_1_REVIEW = PASS
OWNER_DECISION                              = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1       = OWNER_ACCEPTED
WAVE_1_GATE                                 = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED                = NO
WAVE_2                                      = NOT_STARTED
```

Accepted as implemented foundation for `ALT_B_SCOPED` financial access, stable job and quote routes, LIGHT/DARK/SYSTEM, semantic tokens, Industrial Clarity shell, `Catalog` navigation, 1440/1280/768, composed job detail, composed quote inspection, and 44 px targets. This is not acceptance of the entire first HF lot.

Readiness contracts stay the accepted route, access, mapping, and wave plan. Their living `IN_REVIEW` headers are superseded by this Owner accept and by the roadmap. Those contracts were not rewritten in this accept GO.

## Accepted advisories

These remain visible. They are not Wave 1 defects and do not reopen the gate.

- On 768, financial information may require scroll.
- An unidentified local session does not show `Ieșire`.
- Quote PDF is not implemented on the inspection screen.
- The single-plane fixture cannot open a member quote visually.
- Member quote projection is proven by a deterministic component / read-model test.
- Catalog and the configurator are not fully restyled to the first HF lot.
- The rest of Comercial is not yet first-lot HF.
- Atelier, Execution, and Resources are not yet implemented to the full first-lot design.
- Figma and runtime may differ when Figma uses codes or actions that do not exist on the live payload.
- Runtime must not invent `LUC-`, `Eliberează`, PDF, or `Pornește`.
- Pixel-identical is not the criterion when structure, hierarchy, truth, and behavior are correct.

## Remaining risks

- Isolation fixture snapshots lack `eic`; scoping is now defensive so GET does not 500.
- Job-detail PvA for Owner uses the commercial job read model, not `/api/execution-plans/:id`.
- Shared `.tmp/e2e-data` leftovers can multiply list actions; Playwright now accepts `WORKOS_E2E_DATA_DIR`.
- Configurator still shows Owner money on confirm — in scope for commercial family.
- Member quote inspection UI cannot be opened on this single-plane DEV runtime; member payloads were proven via isolated Cloud fixture JSON, not a second live app.

## Runtime isolation

Review and Playwright use a worktree temp data dir. `WORKOS_CLOUD_ROOT` and the real `WORKOS_SQLITE_PATH` stay unset. No real HUB MEDIA data. No new DB table.

## Dead pieces / out of scope

- Full Comercial, Atelier, Catalog/configurator restyle, Resources, Product System, universal CRUD.
- New Job table or aggregate.
- Mobile-first rewrite.
- Audit plugin install.
- Remaining first-lot screens.

## Next

```text
NEXT_STEP = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2_COMMERCIAL_CATALOG_CONFIGURATOR_OWNER_GO
```

Wave 2, only after a separate Owner GO: Clienți list/detail and workspace; Cereri list/detail; Oferte list plus the already-accepted inspection; Catalog HF; commercial configurator HF; Comercial → lucrare continuity. Do not start Wave 2 from this record.
