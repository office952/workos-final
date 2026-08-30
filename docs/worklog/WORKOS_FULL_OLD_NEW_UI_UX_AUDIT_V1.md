# WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1

Read-only audit of the old operational WorkOS app and WorkOS Final, plus the evidence-pack correction and Owner acceptance record. No product UI was changed. No Figma. No canon edit.

```text
VERDICT = ACCEPTED
INDEPENDENT_REVIEW = PASS
OLD_EXECUTION_DASHBOARD_DIRECT_CAPTURE = YES
OLD_EXECUTION_DETAIL = CAPTURED
EVIDENCE_PACK = ACCEPTED
```

## A. Verdict

The first pack was rejected. This file is the corrected pack. Route inventory is now proven from router source. It is not full page coverage and not full state coverage.

```text
ROUTE_SOURCE_INVENTORY_PROVEN = YES
SOURCE_ROUTES_NEW             = 26
SOURCE_ROUTES_OLD             = 102
NEW_SOURCE_CAPTURED           = 26
OLD_SOURCE_CAPTURED           = 67
OLD_SOURCE_EXPLAINED          = 21
OLD_SOURCE_NOT_APPLICABLE     = 14
UNEXPLAINED_ROUTE_GAPS        = 0
ROUTE_COVERAGE                = SOURCE_PROVEN_NOT_FULL_PAGE
PAGE_COVERAGE                 = REPRESENTATIVE_NOT_CARTESIAN
STATE_COVERAGE                = TARGETED_IA_PLUS_HISTORICAL_REF
VISUAL_REVIEW                 = FLAGGED_SCREENS_PLUS_OCR_PASS
RUNTIME_E2E                   = SYNTHETIC_SPINE_PLUS_THROWING_RECAPTURES
CAPTURED_ROWS                 = 283
ACTUAL_PNG                    = 283
NEW_PNG                       = 157
OLD_PNG                       = 126
DUPLICATE_HASH_GROUPS         = 3
```

Authoritative route proof: `docs/worklog/ui-ux-audit-v1/source-to-manifest-reconciliation.md`. The first-pack `route-inventory-reconciliation.txt` is superseded.

## B. Repository identity

```text
REPO                 = office952/workos-final
WORKTREE             = C:\Users\offic\workspace\workos-final-ui-ux-audit
BRANCH               = audit/full-old-new-ui-ux-v1
HEAD                 = 9c2c4246b5fd873a3ca5b3630e1198a273fd9e7e
EXPECTED_ORIGIN_MAIN = 9c2c4246b5fd873a3ca5b3630e1198a273fd9e7e
ORIGIN_MAIN          = 9c2c4246b5fd873a3ca5b3630e1198a273fd9e7e
REMOTE               = https://github.com/office952/workos-final.git
PRE_COMMIT_HEAD      = 9c2c4246b5fd873a3ca5b3630e1198a273fd9e7e
COMMIT               = YES
PUSH                 = NO
verify-this          = VERIFIED (.tmp/verify-this/repo-identity/; .tmp/verify-this/acceptance-identity/)
```

A fresh worktree from current `origin/main` was reused. This GO records the accepted pack and the roadmap checkpoint in one local commit. It does not push. After that commit, branch HEAD is ahead of `origin/main`.

## C. Canon readback

All six required documents were read in full before captures.

```text
ROADMAP_READ       = YES
UI_UX_CANON_READ   = YES
DIRECTION_CONFLICT = NO
CURRENT_MILESTONE  = HUB_MEDIA_CLEAN_PILOT
CURRENT_STEP       = FULL_OLD_AND_NEW_UI_UX_AUDIT
```

Owner acceptance authorizes a factual roadmap checkpoint only: `FULL_OLD_AND_NEW_UI_UX_AUDIT = COMPLETE` and `NEXT_STEP = UI_UX_CANON_UPDATE_FROM_EVIDENCE`. Direction canon forbids declaring a sidebar final and forbids UI implementation; this record obeys both. The UI/UX direction canon is not edited in this GO.

## D. Tool / plugin routing

Used:

- `verify-this` — repo identity and pack integrity claims
- `ce-plan` / `ce-work` knowledge-work — correction plan, no product commits
- Router source parse (`apps/web/src/App.tsx` and old App + employee routers)
- Isolated local runtimes (not the real Cloud root)
- Playwright — targeted recaptures only; critical assertions throw
- Local tesseract.js OCR under `.tmp` — pixel privacy scan, not a product dependency

Not used: Figma, shadcn, 21st.dev, React Doctor, BrowserStack/Percy, Sentry, WorkOS AuthKit, Context7 (not needed), any plugin that writes to an external service.

Installed / already-local Cursor plugins (read-only inventory, nothing installed in this GO):

| Plugin | Local status | This audit |
| --- | --- | --- |
| Figma | installed | forbidden |
| Compound Engineering | installed | plan already supplied by GO |
| Cursor Team Kit (`verify-this`, `control-ui`) | installed | repo identity and pack integrity |
| Playwright MCP | installed | used via local Playwright runner |
| Context7 | installed | unused |
| shadcn | installed | unused |
| 21st.dev | installed | unused |
| React Doctor | installed | unused |
| BrowserStack | installed | unused (paid / external) |
| Subtext | installed | unused |
| Modern Web Guidance | installed | unused |
| Docs Canvas | installed | unused |
| CLI for Agents | installed | unused |
| Agent Compatibility | installed | unused |
| browse | installed | unused |

## E. Old app identity / runtime

Discovered, not assumed:

```text
OLD_APP        = C:\w\psiso
OLD_REPO       = office952/workos-vscode
OLD_BRANCH     = feat/f7i-owner-rate-activation
OLD_SHA        = e35813252e6b7cb0fad30c92a689ed6bfb9700ac
OLD_STACK      = FastAPI + React/Vite
OWNER_DB       = C:\w\psiso\backend\dev.db   (never opened)
DEMO_DB_SOURCE = C:\w\psiso\backend\demo\workos_demo.db
ISOLATED_DB    = <worktree>\.tmp\ui-ux-audit-v1\old-runtime\workos_demo.db
API            = http://127.0.0.1:8010
WEB            = http://127.0.0.1:3010
AUTH_PREVIEW   = http://127.0.0.1:3011 (VITE_ENABLE_DEV_AUTH=false, intercept only)
```

```text
OLD_APP = OPERATIONAL_AND_BUSINESS_EVIDENCE
OLD_APP = NOT_VISUAL_BLUEPRINT
```

Official `demo-start.ps1` was not run (it writes into the old repo). Uvicorn ran from the audit `.tmp` copy with `PYTHONPYCACHEPREFIX` in `.tmp`. Residual risk: Vite on 3010/3011 may have touched `C:\w\psiso\frontend\node_modules\.vite`. No old DB, source, or Owner data was edited.

Demo people/clients are synthetic (`Demo Assembler`, `Demo Client Alpha`). No CNP, IBAN, or real customer files appear in kept OLD shots.

## F. New app identity / runtime

```text
NEW_APP            = this worktree @ 9c2c4246
DEV_API            = http://127.0.0.1:8787
DEV_WEB            = http://127.0.0.1:5173
DEV_DATA           = <worktree>\.tmp\ui-ux-audit-v1\new-data
TEMP_CLOUD_ROOT    = <worktree>\.tmp\ui-ux-audit-v1\temp-cloud-root
CLOUD_API          = http://127.0.0.1:8790
CLOUD_WEB          = http://127.0.0.1:5181
CLOUD_ORG          = Audit Synthetic Org
CLOUD_USER         = audit-owner@example.test
REAL_CLOUD_ROOT    = UNTOUCHED
```

`C:\Users\offic\workos-cloud-data\hub-media-pilot` was not opened, copied, or used.

Single-plane DEV walked a synthetic LETTERS commercial spine (confirm → quote → accept → order → release → plan → execution). Cloud captures used only the temporary root.

## G. Route inventory reconciliation

Route patterns were parsed from the live router files, not from a hand list.

NEW source: `apps/web/src/App.tsx` (26 `<Route>` entries, including `*`).
OLD source: `C:/w/psiso/frontend/src/App.tsx` plus `EmployeeMobileApp.tsx` and `EmployeeMobileV2App.tsx` (102 registered patterns).

```text
SOURCE_ROUTES                 = 128
NEW_SOURCE_CAPTURED           = 26
OLD_SOURCE_CAPTURED           = 67
OLD_SOURCE_EXPLAINED          = 21
OLD_SOURCE_NOT_APPLICABLE     = 14
UNEXPLAINED_ROUTE_GAPS        = 0
```

Every non-captured OLD pattern has an exact reason in `source-to-manifest-reconciliation.md`. Typical reasons: layout/redirect wrappers; DEV demos; Product System planned placeholder sections; tablet/machine-run rows missing in demo; OIDC protocol pages; distinct `auth_config_missing` panel not reached (LoginGate was).

OLD `/execution` and `/execution/:order_id` are now captured from the isolated demo: dashboard heading `Execuție` plus `DEMO-ORDER-001`; detail `Rezultat execuție` plus `DEMO-ORDER-001` at `/execution/1` (isolated `order_id=1` populated state only). Proof: `docs/worklog/ui-ux-audit-v1/old-execution-source-proof.md`.

NEW non-route surfaces (not `<Route>` entries): cloud LoginPage, boot unavailable, operator identify dialog, operator session chrome. Loading boot remains transient and is explained as not a designed page.

Do not treat `UNEXPLAINED_ROUTE_GAPS=0` as full page coverage or full state coverage.

```text
DYNAMIC_EMPLOYEE_MOBILE_ROUTES =
EXPLICITLY_DEFERRED_OUTSIDE_DESKTOP_V1_AUDIT
HISTORICAL_MACHINE_STRICT_PIXELS =
REFERENCE_ONLY_NOT_PART_OF_ACCEPTED_283_PNG_PACK
```

Dynamic employee-mobile `path={section.path}` routes are recorded here as deferred outside the desktop V1 audit. They are not a desktop IA blocker and must not be read as cartesian mobile coverage. Historical Machine Strict files stay path+SHA references only. Later Figma and canon work must not treat them as captures of this accepted 283-PNG pack.

## H. Screenshot coverage reconciliation

| App | Unique PNGs | Desktop | Tablet/narrow | Long-page crops |
| --- | ---: | --- | --- | --- |
| NEW | 157 | primary | shell, lists, letters form, execution, people, resources rail | admin/catalog/execution/atelier |
| OLD | 126 | primary + execution dashboard/detail | shell, lists, settings, mobile home | when scroll exceeded viewport |

`screenshot-manifest.csv` is rebuilt from files actually kept. Every `status=captured` row is one existing PNG. Explained rows have no file. Blocked attempts are not counted as captures.

Correction recaptures (isolated synthetic fixture only): seller legal-name-only; people list; person detail including the name field; skills (`Skill-uri`); populated Atelier; machine-blocked execution; eligible session; ineligible operator; invalid PIN; narrow resources category+item rail.

Historical Machine Strict files for manual-startable / in-progress / completed are referenced with path + SHA in `historical-machine-strict-provenance.md`. They are not newly captured and are not among the 283 captured rows in the manifest (explained rows have no file and are extra).

Targeted closure added: OLD `execution-dashboard__direct-demo-populated` and `execution-detail__demo-order-001-populated`.

Withdrawn and deleted (do not restore): first-pack seller empty-form with real legal values; `*-populated-names-masked-*` people/person/skills; duplicate LoginGate-as-auth-503; mis-clicked OLD client/studio/intake/execution files; diacritic filenames renamed to ASCII.

## I. Old application findings

Perceived in the first five seconds: a dense production ERP with a long left sidebar, STAGING/Live DB chrome, and English/Romanian mix.

What it does well:

- Separates **Produse** (template catalog / Product System studio) from **Cereri** / Intake V6 (the request form).
- Uses master/detail on Oferte and Clienți: list left, work on the right.
- Operator home is Atelier, not a commercial catalog.
- Role landings shrink the sidebar (operator sees production, not the full admin tree).
- Next-step banners are common.

What harms IA and scale:

- Global nav already mixes work, production, people, resources, relations, management, admin, and DEV tooling. At 50–100 items this sidebar becomes the page.
- Selected category and its children live in the same scrolling menu (Owner observation is correct).
- COMPAT / AUDIT / PREVIEW / Live DB / tick badges compete with work.
- Settings is a mega-page.
- Product System studio still shows compiler vocabulary on an operator-facing path.
- Login wall on 3011 also showed a backend-compat debug banner — honesty is good, debug text is not operator UI.

## J. New application findings

Perceived in the first five seconds: a short top nav and a calm work list. Primary action is usually obvious (`Deschide execuția`, `Intră`, `Identifică-te`).

What is architecturally righter:

- Five global items. Comercial is a zone, not four top-level siblings.
- Product System administration is under Administrare, not under the operator catalog.
- Registries are searchable lists with filters, not a second calculator.
- Empty states tell the next action.
- Cloud login is a gate outside the shell.

What is still confusing or thin:

- Top-nav **Produse** opens a catalog/configurator that can freeze a quote. That is not Product System. Empty Lucrări even says “Deschide produsele pentru a crea o comandă”.
- Administrare card **Sistem produs** is the real Product System admin, but the label is easy to miss.
- `/components` and `/governance` are inspection, not daily work, and still sit one click from admin.
- Light-only. No theme switch, no `prefers-color-scheme`.
- Operator PIN uses `<dialog open>` without `showModal()`; login lives outside `<main>`.
- Jobs/quotes are lists, not tables — harder for keyboard/scan of many rows.
- Isolated evidence used synthetic people (`Operator Eligible`, `Operator Ineligible`, `Operator Retired 03-10`) so this pack does not publish real staff identities. Authorized production People UI may show the real operational workforce. The defect is real identities in demo/evidence or unauthorized exposure, not the presence of real names in the authorized People catalog.

## K. Product System clarification

Owner observation:

> Butonul „Produse” pare să deschidă un catalog/configurator sau un formular pentru cerere/ofertă. Unde este echivalentul real al Product System?

**The observation is correct as a naming/IA confusion, not as a missing domain.**

| Surface | OLD | NEW | Class |
| --- | --- | --- | --- |
| Nav **Produse** | `/product-system/products` — template catalog + studio | `/products` — sellable catalog → configure → commercial spine | OLD: PRODUCT_DEFINITION / CATALOG. NEW: CATALOG + CONFIGURATOR + REQUEST_INTAKE |
| Request form | `/intake`, Intake V6 workspace | `/requests` + `?request=` on product | REQUEST_INTAKE |
| Product System admin | same Produse studio + settings/governance | `/admin/product-system` | PRODUCT_ADMINISTRATION |
| Component inspection | mostly studio / governance | `/components` | PRODUCT_DEFINITION (inspection) |
| Processes / resources / cost | Inventar, Prețuri, Utilaje, Setări | `/admin/processes`, `/admin/resources`, `/admin/stock` | PRODUCT_ADMINISTRATION / BACKEND projected |
| Pricing | inventory/pricing + quote workspace | projected from EIC + policy; no Commercial admin write | PRICING |
| Execution | Planificare, Atelier, tablet, ops-graph | `/execution/:planId` after release + plan | EXECUTION_PROJECTION |

Confusion source: both apps label the commercial entry **Produse**. In the old app that word still means Product System. In the new app it means “pick a product and configure a job”.

Exists as domain truth with weak or no daily UI in NEW: full template studio, compiler diagnostics, structure deep-links, Intake V6 SVG layers. Those are not a pilot hole if LETTERS/ACM configure on `/products/:code`.

Intentionally backend-only / owner-inspection: governance maturity, raw capability IDs, bootstrap markers.

Do not expose to the operator: template codes as primary titles, `Live DB`, COMPAT/AUDIT, compiler steps.

Rename/regroup candidates (not implemented): nav **Produse** → something like “Catalog lucrări” / “Configurează”; keep **Sistem produs** in Administrare.

## L. Navigation scalability analysis

Owner problem: category selected in the menu, subcategories and items still appear in the same menu.

OLD exhibits this today (sidebar sections + long item lists + badges). NEW avoids it globally (5 items) but repeats a similar tree inside `/products` and several admin catalogs (family → category → product still in one scrolling column).

Do **not** declare a sidebar as the final solution.

| Hypothesis | Advantages | Limits | Scale threshold | Fit |
| --- | --- | --- | --- | --- |
| 1. Global nav + local tabs + searchable list/detail | Matches NEW shell and OLD Oferte/Clienți; one primary action; deep links stay on the page | Tabs fail if a zone has 15 peers | ~10–30 entities per list before search is mandatory; ~50+ needs filters | Registries: Lucrări, Cereri, Oferte, Clienți, Persoane, Stoc |
| 2. Global collapsible nav + work-area landing pages | OLD already uses landings (Atelier, Control producție); good for roles | Collapsed sidebar still hides siblings; landings can become second homes | Breaks when landings become sitemaps | Atelier, Administrare, maybe Comercial |
| 3. Command/search for large catalogs | Scales to 100–500; does not grow chrome | Operators must know names; bad for first-week pilot | Needed at ~100+ products/resources | Product System library, resources, processes — later |
| 4. Seen in audit: master/detail split + stepper | OLD Oferte/PS studio; keeps selection visible | Dual scroll; easy to lose on narrow | Narrow 768px already compresses it | Quote/client hubs, template studio — not global nav |

Pilot candidate: keep NEW’s short global nav; treat `/products` and admin catalogs as **searchable list/detail**, not as a growing second menu. Revisit command palette after the catalog leaves two live products.

## M. Theme / CSS readiness

NEW authority is one file: `apps/web/src/index.css`. TSX has no inline `style={{}}`. Tokens exist (`--bg`, `--surface`, `--ink`, `--accent`, status colors, spacing). Drift: hardcoded hex/rgba still appear (~37 color literals), `--muted, #667` fallbacks, overlay `rgba(18,22,28,0.45)`, focus color on task rows.

| Type | Existing authority | Drift | Risk | Future consolidation candidate |
| --- | --- | --- | --- | --- |
| Canvas / page | `--bg` | page-local greys in long CSS | medium | semantic `canvas` |
| Surface | `--surface`, `--surface-raised` | `#fff` fallbacks | medium | `surface`, `surface-raised` |
| Ink | `--ink`, `--muted` | duplicate `--text-muted` | low | `ink`, `ink-muted` |
| Line | `--line` / `--border` duplicates | mixed names | low | `border` |
| Accent / status | `--accent`, `--ok`, `--bad`, `--status-*` | two badge systems (`StatusChip` vs leftover pills) | high for dark mode | one status token set |
| Overlay | none | raw rgba | high | `overlay` |
| Focus | none | hardcoded on some rows | a11y | `focus-ring` |
| Dark / system | none | light-only | blocks direction | `LIGHT` + `DARK` + `SYSTEM` from one token system |
| Persistence | none | — | — | later, with tokens |

Direction remains:

```text
LIGHT  = REQUIRED
DARK   = REQUIRED
SYSTEM = REQUIRED
ONE_SEMANTIC_TOKEN_SYSTEM = REQUIRED
```

Do not hardcode page CSS to “fix” this. Do not implement theme in this GO.

OLD already has a theme toggle in chrome; that is evidence of need, not a skin to copy.

## N. Accessibility findings

Manual + code; no automated axe run (BrowserStack/OverlayQA not used).

| Check | NEW | OLD |
| --- | --- | --- |
| Keyboard | Links/buttons generally reachable; PIN dialog not modal | Dense sidebar; many icon-only controls |
| Focus visible | Partial; some rows hardcode focus | Browser default + custom components |
| Focus order | Header then content; login outside landmarks | Sidebar first, then huge main |
| Labels | `Field` used on login/seller | Mixed; search placeholders often act as labels |
| Dialogs | Operator `<dialog open>` — no trap/return | Intake create dialog exists |
| Headings | Usually one `h1` per page | Multiple competing titles + banners |
| Landmarks | Weak (`main` missing on login) | Shell present; login isolated |
| Tables | Lists instead of tables | Some tables (HR, documents) |
| Contrast | Light theme generally ok; muted grey on beige needs later measure | Blue-on-white ok; red banners + color hearts |
| Targets | Primary buttons ok; quiet filters small | Sidebar items tight |
| Zoom 200% | Not separately captured | — |
| Color-independent status | Chips have text | Some hearts/dots are color-first |
| Reduced motion | No token | Theme toggle present; motion not audited |

Do not fix now.

## O. Old-vs-new matrix

| Concept / flow | Old app | New app | Business truth | UX value | Decision candidate |
| --- | --- | --- | --- | --- | --- |
| Global nav | Long sidebar, role-filtered | 5 top items | Domain map | NEW scales; OLD orients production people | KEEP NEW global; INVESTIGATE zone landings |
| Produse | Product System catalog | Sellable catalog + configurator | Product System ≠ job configure | High confusion | RESTRUCTURE naming |
| Cerere / intake | Queue + Intake V6 workspace | Cereri registry + product `?request=` | Request is intake, not product truth | OLD form is richer; NEW is cleaner | KEEP NEW spine; INVESTIGATE which V6 steps are still needed |
| Ofertă | Master/detail + readiness chrome | Frozen snapshot registry | Quote is immutable snapshot | NEW is truer; OLD is easier to inspect one quote | KEEP NEW; RESTRUCTURE toward master/detail |
| Comandă / Lucrări | Separate Comenzi list | Lucrări projects orders | Order is commercial job | NEW matches canon | KEEP |
| Atelier | Shop-floor grid + legacy tablet | Munca mea inbox | Task inbox ≠ machine map | Both needed later | KEEP NEW inbox; DEFER shop map UI |
| Product System | Studio on nav Produse | Admin + `/components` | Template/admin truth | Hidden in NEW | RESTRUCTURE labels only |
| People | Angajați + HR + pontaj + plăți | Operational people only | HR out of scope | NEW is honest | KEEP NEW boundary |
| Theme | Toggle in chrome | Light only | Direction requires 3 modes | OLD proves the need | INVESTIGATE tokens first |
| Badges | COMPAT/AUDIT/Live DB | Fewer; some status chips | Actionable status only | OLD over-badges | REMOVE OLD pattern |
| Search | Global top search | Per-registry search | Findability | OLD global is a hint | INVESTIGATE later |
| Role homes | Strong | Cloud owner vs operator PIN | Role-adapted UI | OLD clearer for shop floor | INVESTIGATE |
| Settings dump | Mega /settings | Domain admin cards | One owner per domain | NEW is correct | KEEP NEW; REMOVE OLD dump |

What OLD knew: next step, master/detail, role-skinny nav, Produse ≠ Cerere.

What NEW is righter: one commercial spine, no second Product System in the top nav, no HR in the operator path, short chrome.

What was lost: at-a-glance shop floor; obvious Product System door; quote detail pane.

What not to copy: sidebar length, compiler stepper as operator UI, DEV tooling in nav, debug banners.

Where NEW exposes architecture: “Sistem produs”, inspection catalogs, capability-ish empty categories, bootstrap people identities.

## P. Keep / restructure / remove candidates

Candidates only. Not canon.

**KEEP**

- NEW global five + Comercial subnav
- NEW commercial spine (confirm → quote → accept → order → release → plan → execution)
- NEW admin domain cards
- OLD master/detail behavior on quotes/clients
- OLD separation of Intake vs Product System (as a naming lesson)
- Romanian operator copy

**RESTRUCTURE**

- Label of NEW **Produse**
- `/products` tree into list/detail + search before more products land
- Product System door so owners find it without thinking it is the configurator
- Quote/job rows toward denser, keyboard-friendly lists
- Theme tokens before any skin

**REMOVE** (from future UI, not from this audit)

- COMPAT / AUDIT / Live DB / tick chrome
- Compiler vocabulary on operator paths
- Global settings dump

**EVIDENCE HYGIENE** (not a production People-UI ban)

- Keep real staff identities out of demo fixtures, audit screenshots, and other unauthorized exposure. Authorized production People UI may show the real operational workforce.

**INVESTIGATE**

- Whether Intake V6 layers/SVG are still a pilot path
- Shop-floor map vs inbox
- Command palette timing
- How to show Product System without a second product app

## Q. Pilot blockers vs deferred work

```text
P0 = none found that blocks opening the isolated apps or walking a synthetic job
P1 = Produse / Product System naming; shop-floor “Lipsă utilaj dedicat” on the synthetic job; keep real staff identities out of demo/evidence (authorized People UI may show the real workforce)
P2 = catalog-in-menu growth; light-only tokens; list vs table; admin inspection density
P3 = badge polish, crop consistency, duplicate category-walk tails
```

| Bucket | Items |
| --- | --- |
| PILOT_BLOCKER | None for this audit pack. First real HUB MEDIA job still depends on later recovery/config GOs, not on a missing screenshot. |
| BEFORE_FIRST_REAL_JOB | Naming of Produse vs Sistem produs; dedicated-machine honesty on the real floor; cloud login in the real (not temp) root — out of this GO |
| AFTER_PILOT | Theme LIGHT/DARK/SYSTEM; IA Figma; large-catalog search; a11y pass; shop-floor map |
| DEFER | Full Intake V6 recreation, tablet legacy, HR/pontaj, command palette, sidebar decision |

Do not use this audit as a pretext for a total redesign before pilot.

## R. Plugin Marketplace recommendations

Nothing installed. At most three later, after independent review:

1. **OverlayQA MCP** (`@overlayqa/mcp`)
   - Problem: WCAG, contrast, and token-health on a live localhost URL after the token system exists.
   - Stage: after canon update / before or during scoped UI implementation.
   - Data: page URL, DOM/CSS, OverlayQA account token at `~/.overlayqa/auth.json`.
   - Overlap: BrowserStack accessibility (already installed, paid/external — not for this repo’s default loop).
   - Risks: external account; scans leave their cloud.
   - Cost: free tier with scan limits; paid for volume ([overlayqa.com/mcp](https://overlayqa.com/mcp/)).
   - Install (official): Marketplace listing or `~/.cursor/mcp.json` `{ "mcpServers": { "overlayqa": { "command": "npx", "args": ["@overlayqa/mcp@latest"] } } }`. First run opens a browser to connect the account.

2. **Local axe MCP** (candidate: community `@dallask/a11y-mcp-srv` or equivalent localhost server)
   - Problem: same WCAG checks without a SaaS account, against `127.0.0.1` only.
   - Stage: a11y pass after tokens.
   - Data: local page DOM.
   - Overlap: OverlayQA, BrowserStack `scan-and-fix-accessibility`.
   - Risks: unmaintained community servers; confirm Marketplace identity before adding.
   - Cost: free if local.
   - Install: only from the exact Marketplace/npm page after Owner review.

3. **Deque Axe MCP**
   - Problem: richer remediation guidance.
   - Stage: only if OverlayQA + local axe are insufficient.
   - Data: source + Deque account / API key.
   - Overlap: high with 1–2 and BrowserStack.
   - Risks / cost: commercial; external.
   - Install: [deque.com/axe/mcp-server](https://www.deque.com/axe/mcp-server/). Skip if BrowserStack later covers the same.

Do not install WorkOS AuthKit. Name collision; auth is not in this GO.

## S. Evidence pack and archive

Index: `docs/worklog/ui-ux-audit-v1/evidence-index.md`.

```text
ARCHIVE                 = docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1_EVIDENCE.zip
ARCHIVE_SHA256          = EXTERNAL_SIDECAR_ONLY
SIDECAR                 = docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1_EVIDENCE.zip.sha256
CAPTURED_ROWS           = 283
ACTUAL_PNG              = 283
OLD_PNG                 = 126
NEW_PNG                 = 157
CAPTURED_ROW_WITHOUT_FILE = 0
PNG_WITHOUT_MANIFEST_ROW  = 0
HASH_MISMATCH             = 0
PNG_DECODE_FAILURES       = 0
MISSING_ASSERTION_MARKERS = 0
DUPLICATE_HASH_GROUPS     = 3
```

The zip contains the report, manifests, harness, source reconciliation, historical provenance note, and `screenshots/ui-ux-audit-v1/{old,new}`. It does not contain `.tmp`, the temporary Cloud root, passwords, PINs, credential hashes, password verifiers, PIN salts, or Owner `dev.db`. It does not contain this zip's own checksum. Screenshot and sidecar SHA-256 are integrity evidence, not secrets. The shipped harness is for isolated fixture capture only; do not re-run it against REAL_CLOUD_ROOT, OWNER_OLD_DB, or any runtime that still holds real staff.

Duplicate hash groups (not bugs):

1. NEW Product System vs Components category-walk bottoms — same rail tail, different routes.
2. NEW execution ineligible vs machine-blocked bottoms — same task-list tail; operator identity is in the header/top crop.
3. NEW execution ineligible vs machine-blocked mids — same mid-list crop.

## T. Privacy / security statement

```text
REAL_CLOUD_ROOT            = UNTOUCHED
REAL_CLOUD_ROOT_MTIME      = 2026-08-22T06:40:12.282Z
REAL_BUSINESS_DATA_WRITE   = NO
OWNER_OLD_DB               = UNOPENED
PASSWORDS_IN_REPORT        = NO
PIN_VALUES                 = NOT_CAPTURED
REAL_CUSTOMER_FILES        = NOT_IN_PACK
REAL_PEOPLE_IDENTITIES     = NOT_IN_PACK
PIXEL_PRIVACY_SCAN         = PASS
```

Isolated NEW data lived under `.tmp/ui-ux-audit-v1/new-data`. Seller and people were rewritten only there. The real Cloud root was not opened or written. Temp cloud password was piped to provision stdin and is not stored in the pack. Invalid-credentials used a throwaway wrong password. Invalid PIN is masked as `••••` plus `PIN gresit.`

Host and Cloud paths in this report are identity proof only. Do not republish them as a data-store map. Independent review may receive the report, manifests, zip, and sidecar. Do not send `.tmp` (privacy blocklist, OCR reports, isolated DBs, temp Cloud root). The local blocklist is itself a PII artifact. Capture-time text filters catch IBAN-like values and the retired legacy-person prefix from the first pack; `REAL_PEOPLE_IDENTITIES` is a synthetic-fixture plus visual-review plus local OCR claim. OLD `LIVE DB` badges are product chrome on the isolated demo copy, not proof OWNER_OLD_DB was opened.

## U. Repo / worktree diff

```text
PRODUCT_CODE_DIFF = NONE
```

This recording commit contains only the accepted report, manifests, reconciliation, provenance, 283 PNGs, zip, sidecar, and the roadmap checkpoint. `.tmp/` stays gitignored and is not committed.

## V. Roadmap checkpoint

```text
MILESTONE     = HUB_MEDIA_CLEAN_PILOT
STEP_DONE     = FULL_OLD_AND_NEW_UI_UX_AUDIT
EVIDENCE_PACK = ACCEPTED
NEXT_STEP     = UI_UX_CANON_UPDATE_FROM_EVIDENCE
CANON_UPDATE  = NOT_STARTED
FIGMA         = NOT_STARTED
THEME         = NOT_STARTED
UI_IMPLEMENT  = NOT_STARTED
```

## W. Exact next step

Owner accepted this pack after independent review. Do not send `.tmp`. The sidecar is written only after the zip is final; any zip rewrite needs a new sidecar. Do not put the digest inside the zip or inside the zipped copy of this report.

The next authorized step is `UI_UX_CANON_UPDATE_FROM_EVIDENCE`. Only a later GO may authorize, in this order:

1. Update UI/UX canon from evidence
2. Information architecture in Figma
3. Design system LIGHT/DARK/SYSTEM
4. Visual acceptance
5. Limited UI implementation

No implementation prompt. No canon edit. Stop.

## X. Evidence-pack correction

First independent review rejected the first archive (`b7343825…` sidecar). Defects and repairs:

| Defect | Repair |
| --- | --- |
| Seller PNG showed real legal / bank / address values | Deleted; recaptured `admin-seller__synthetic-legal-name-only` with empty CIF/IBAN/address |
| Person detail masked the heading only | Deleted; recaptured synthetic name in the heading and the name field |
| Skills showed real names and a recorded missing-heading marker | Deleted; recaptured `Skill-uri` with throwing assertions |
| 10 stale captured rows pointed at deleted people PNGs | Manifest rebuilt from files on disk |
| Diacritic filenames | Renamed to ASCII (`adevar`, `integrations`, `payments-repetitive`) |
| LoginGate == auth-config-missing | Duplicate PNGs deleted; explained, not captured twice |
| OLD client tabs opened the wrong chrome | Recaptured from the local tab rail |
| OLD Product Studio "Operational" opened reports | Recaptured Product Compiler / Resurse operationale / Form System / Informatii generale |
| Blank Intake standalone | Explained; live workspace `/intake-v6-app/:id/operator` captured |
| Execution detail was Ops Graph | Withdrawn; later targeted closure captured real `/execution/:order_id` |
| Ambiguous order detail | Recaptured DEMO-ORDER-001 detail pane |
| Route gaps claimed from a hand list | Replaced by source-derived inventory + reconciliation |
| ZIP SHA inside the zip | Removed; sidecar only, written after the zip is final |
| Soft assertions that recorded a missing-text marker and continued | `requireVisibleText` now throws; first-pack helper also throws |
| OLD `/execution` explained, not captured | Direct capture of ExecutionDashboard + `/execution/1` DEMO-ORDER-001 |

Known limitations:

- Not every OLD source route is a captured page. 21 are explained. 14 are redirects/layouts.
- Manual startable / in-progress / completed task pixels are historical Machine Strict references, not part of the accepted 283-PNG pack.
- Older first-pass rows still use screen ID as the stored assertion text. Critical correction recaptures used throwing visible-text checks.
- OCR/text privacy scans are local artifacts under `.tmp`; they are not inside the zip.
- Authorized People UI may show real staff. This pack uses synthetic people so evidence does not become an unauthorized copy of those identities.

## Y. Owner acceptance

Independent read-only review of the closure pack passed (`ARCHIVE_SHA256` verified as `3a81c567…` before this acceptance record). Residuals above are classified, not recaptured.

```text
INDEPENDENT_REVIEW                  = PASS
FULL_OLD_AND_NEW_UI_UX_AUDIT        = COMPLETE
EVIDENCE_PACK                       = ACCEPTED
NEXT_STEP                           = UI_UX_CANON_UPDATE_FROM_EVIDENCE
UI_UX_CANON_CHANGE                  = FORBIDDEN_IN_THIS_GO
FIGMA                               = NOT_STARTED
```

Authorized production People UI may show real staff. The pack defect remains real identities in demo, fixture, evidence, or unauthorized exposure.

## Final stop

```text
PRODUCT_CODE_DIFF        = NONE
UI_IMPLEMENTATION        = NOT_STARTED
FIGMA                    = NOT_STARTED
CANON_UPDATE             = NOT_STARTED
PLUGIN_INSTALLATION      = NONE
REAL_CLOUD_ROOT          = UNTOUCHED
REAL_BUSINESS_DATA_WRITE = NO
COMMIT                   = YES
PUSH                     = NO
```

## Z. Later Owner decision — V3 navigation design

Recorded 2026-08-30. This section does not rewrite the 283-PNG audit or its verdict.

Owner accepted V3 as living navigation direction: one stable sidebar, six discrete categories, twenty pages. Implementation is not authorized.

```text
UI_UX_NAVIGATION_V3_DESIGN           = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION   = IMPLEMENTED_LOCAL_IN_REVIEW
PACK_SHA256                          = 8cd54c20144d8d1c25c59551f8c1655e163e358fbcee8af0d1d762206166b70e
PACK_NAME                            = WORKOS_MAP_V3_COLLAPSIBLE_SIDEBAR_REVIEW_PACK
OUT_EMP_REQUESTS                     = Oameni / Angajați / /people
```

The pack is local evidence under `.tmp`. It is not part of this git tree. Living law is `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`. The implemented shell remains the five-item top nav in `docs/architecture/UI_UX_FOUNDATION_CANON.md`.
