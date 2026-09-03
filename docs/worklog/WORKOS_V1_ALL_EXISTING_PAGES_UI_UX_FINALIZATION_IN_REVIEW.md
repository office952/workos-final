# WorkOS V1 — all existing pages UI/UX finalization (local in review)

```text
PROGRAM = WORKOS_V1_ALL_EXISTING_PAGES_UI_UX_FINALIZATION
BRANCH = feat/ui-v3-all-pages-finalization-v1
PR = #6
ORIGIN_MAIN = e2dee3c20127cb533ca63e6e13afdb23422541b5
BASE_HEAD = e2dee3c20127cb533ca63e6e13afdb23422541b5
HEAD_BEFORE_VERIFY = a574187381cd74363869a17e20adbd49a6af2688
STATUS = INTEGRATED_ON_MAIN
OWNER_ACCEPTED_RUNTIME = YES
MERGE_MAIN = YES
ALL_EXISTING_PAGES_UI_V3 = INTEGRATED_ON_MAIN
ALL_EXISTING_PAGES_UI_V3_RUNTIME = OWNER_ACCEPTED
ACCEPTED_HEAD = 122d8693d7a9c6a76e2131dc6555b65bb6537901
UI_V3_GENERAL_COMPLETION_GATE = CLOSED_FOR_INTEGRATION
DOMAIN_WRITE = NO
API_WRITE = NO
DATABASE_WRITE = NO
REAL_CLOUD_WRITE = NO
FIGMA_READ = YES
FIGMA_WRITE = NO
FIGMA_FILE = 1ev5lg7m2Ze1h3Vqmax8ho
REPAIR_PASS_USED = 1
```

```text
ROADMAP_READ            = YES
UI_UX_CANON_READ        = YES
DIRECTION_CONFLICT      = NO
THEME_IMPACT            = BOTH
NEW_HARDCODED_CSS       = NO
BACKEND_DETAILS_EXPOSED = NO
```

Owner GO: finish V3 baseline on every existing runtime page before product expansion. Not pixel-perfect. One program branch. Sequential batches. References stay Clienți, Client Hub, Cereri, Product Configuration C.

This record now includes the **final verification + one targeted repair pass**. It does not reopen architecture and does not start Product Batch 1.

## What the implementation wave did

- Inventoried every `App.tsx` runtime route.
- Converged Oferte / Lucrări registries and quote/job objects onto Cereri/Clienți patterns.
- Aligned Catalog toolbar/lead with the same registry chrome.
- Gave Atelier a metric band and Execution an object back + quieter identity.
- Converted Stoc and Oameni lists to registry rows; PageStatus on people/skills/utilaje.
- PageHeader/PageStatus on admin/inspection pages; `/admin/customers` points at Clienți.
- Stare sistem uses PageHeader.

## Figma READ (verification wave)

Mandatory accepted references read from file `1ev5lg7m2Ze1h3Vqmax8ho`. Write was not used.

| Reference | Node | Character used as law |
|---|---|---|
| CERERI_REGISTRY | `107:4394` | Registry scanability, 256 sidebar, PageHeader + 44 primary, MetricBand, 68/8 rows |
| CLIENT_HUB | `49:2569` | Object: back + H1 + quiet/primary, identity, local sections |
| PRODUCT_CONFIGURATION_READY | `176:5183` | Decision: customer total dominant, internal cost secondary, CTA 44 |
| CERERE OBJECT | `107:6506` | Object facts as lines, related hairline lists |

Visual law: light industrial, hairline borders, restrained status. Coherence means correct archetype, not identical composition.

## Route classification (recomputed from `App.tsx`)

31 `<Route>` entries. 29 signed-in destinations. `/` and `/jobs` share Lucrări.

```text
TOTAL_RUNTIME_ROUTES = 31
TOTAL_USER_FACING_PAGES = 28 unique compositions / 29 signed-in destinations
V3_REFERENCE_CLOSED = 5
V3_CONVERGED = 24
DOMAIN_BLOCKED = 0
INTENTIONALLY_REDIRECTED = 2
INTENTIONALLY_HIDDEN_BUT_VALIDATED = login gates + hidden nav labels
LEGACY_PAGE_COUNT = 0
NOT_REVIEWED_COUNT = 0
UNKNOWN_UI_STATUS_COUNT = 0
```

V3_REFERENCE_CLOSED: `/clients`, `/clients/*`, `/requests`, `/requests/*`, `/products/:productCode`.

INTENTIONALLY_REDIRECTED: `/commercial` → `/requests`; `*` → `/`.

Hidden nav (not routes): Acasă, Furnizori, Achiziții, Pontaj, Plăți și avansuri, Politici. Validated by `e2e/v3-navigation-shell.spec.ts`.

Login gates (`boot`, `network`, `auth_config_missing`, `unauthenticated`, `session_expired`) are not signed-in routes. Validated by `LoginPage` source and unit tests. DEV single-plane e2e does not mount the Cloud login wall.

## One repair pass

Repaired only P1 / UX-S1 / material UX-S2 / CI harness drift. No second design wave.

1. Decorative registry chevrons are `aria-hidden` spans on Stoc, Lucrări, Oferte, Oameni. Name link + action link remain.
2. Quote customer price uses existing `.commercial-job-preview` / `.commercial-job-total-value`. Net / TVA / internal / markup / margin stay in facts.
3. Atelier metric band compacted once (icon 1.25rem, tighter padding, 2-col at 768). No Atelier redesign.
4. `.choice-select-native` containment so sr-only product selects cannot become 100vw.
5. Hardcoded light status borders on danger/success/focus rows moved to tokens.
6. E2E selectors: `.requests-list` on people/jobs registries; stock sold as `dt`/`dd`; people back copy `Înapoi la Oameni`.
7. All-route matrix + 10-shot visual pack + representative keyboard/target smoke in `e2e/ui-v3-all-pages-route-matrix.spec.ts`.
8. `e2e/hf-wave1-foundation.spec.ts` now asserts quote `Preț client` instead of the old `Brut:` string.
9. Mobile Meniu focus restore: stable `onClose` plus microtask restore. Same intended a11y behavior; not a drawer redesign.

Not repaired: UX-S3, 4–8px, admin hub catalog-family classes, `/system` “Backend” jargon, IdentityMenu focus trap, mobile Meniu focus-restore flake.

## Representative visual pack

Ignored path: `.tmp/ui-v3-all-pages/final-proof/`

1. Oferte 1440 Light
2. Lucrări 1440 Light
3. Ofertă object 1440 Light
4. Lucrare object 1440 Light
5. Atelier 1440 Light (identified operator inbox)
6. Execution 1440 Light
7. Resources 1440 Light
8. Catalog 768 Light
9. Cereri 1440 Dark
10. Ofertă object 1440 Dark

## Specific visual-risk verdicts

- Atelier metric band: still an operational inbox after compact. Four cards remain; they no longer dominate the scan.
- Quote: Preț client is the commercial hero. Internal cost is secondary. Primary lifecycle action is in the object header.
- Job: state, next step, and Deschide execuția sit in the header before configuration/price. Not a second Atelier.
- Catalog 768: detail pane hidden; product name links go to configuration; no duplicate mobile selection UI.

## What this wave did not do

- No domain/API/database/Cloud writes.
- No Figma frames or Figma write.
- No Product Batch 1.
- Implementation worktree did not rewrite commits. Integration was fast-forward only.

## Integration

Owner accepted runtime. `origin/main` fast-forwarded `e2dee3c` → `122d869`. PR #6 merged by containment. No merge commit, rebase, squash, or force.

Advisory backlog remains nonblocking: IdentityMenu focus trap, `/system` “Backend” terminology, admin grouping/class naming, later Atelier metric refinement, micro spacing/copy, React component complexity.

## Next

`NEXT_PROGRAM_PRIORITY = PRODUCT_DEVELOPMENT`. Recommended next build is `PRODUCT_BATCH_1_DISCOVERY_AND_IMPLEMENTATION`. Do not start it from this record. First real LETTERS job stays `BLOCKED_BEFORE_QUOTE` on the real-pilot track. No more broad global UI rewrite.
