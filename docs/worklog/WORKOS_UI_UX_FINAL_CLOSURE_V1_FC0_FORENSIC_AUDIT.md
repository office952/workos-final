# WorkOS UI/UX Final Closure V1 — FC0 forensic audit

```text
PROGRAM = WORKOS_UI_UX_FINAL_CLOSURE_V1
WAVE = UI_FC0
WAVE_NAME = FORENSIC_PAGE_INVENTORY_USER_FIRST_UX_FIGMA_RUNTIME_RECONCILIATION
STATUS = LOCAL_IN_REVIEW
IMPLEMENTATION = NO
UI_CODE_WRITE = NO
CSS_WRITE = NO
FIGMA_WRITE = NO
FIGMA_READ = YES
MERGE_MAIN = NO
REAL_CLOUD_WRITE = NO
OS_S8 = HOLD
NEXT_STEP = CHATGPT_INDEPENDENT_UI_FC0_REVIEW
```

```text
ROADMAP_READ = YES
UI_UX_CANON_READ = YES
FOUNDATION_CANON_READ = YES
DIRECTION_CONFLICT = NO
```

Living roadmap `NEXT_PROGRAM_PRIORITY = WORKOS_UI_UX_FINAL_CLOSURE_V1` wins over stale `POST_INTEGRATION_RECOMMENDED_PROGRAM = WORKOS_PERFORMANCE_AND_LOGIC_EFFICIENCY_V1` and over direction-canon `NEXT_PROGRAM_PRIORITY = PRODUCT_DEVELOPMENT`. PERF_1–3 stay historically complete. This pack does not invent PERF_4, Halo/Full Aluminium, or UI implementation.

```text
REPO = office952/workos-final
WORKTREE = C:/Users/offic/workspace/workos-final-ui-fc0
BRANCH = design/ui-fc0-forensic-audit-v1
EXPECTED_ORIGIN_MAIN = bb5952051abace00078a7aa1bf5930ce72cc4abe
AUDIT_BASE_HEAD = bb5952051abace00078a7aa1bf5930ce72cc4abe
ONE_SYNTHESIS_WRITER = YES
AVERAGED_AWAY = NO
```

Supporting lane files live under `docs/worklog/ui-fc0/`.

## Authority read

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`
- `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`
- `docs/architecture/PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md`
- `docs/architecture/PRODUCT_SYSTEM_PERSISTENCE_CANON.md`
- `docs/worklog/WORKOS_V1_ALL_EXISTING_PAGES_UI_UX_FINALIZATION_IN_REVIEW.md`
- Current `App.tsx`, `navigationRegistry.ts`, page sources

`UI_V3_BASELINE = HISTORICALLY_COMPLETE` means existing routes received V3 chrome convergence. It does **not** mean every page had a dedicated first-principles study. This FC0 pack is that study.

## Plugin

```text
FIGMA_PLUGIN_AVAILABLE = YES
FIGMA_PLUGIN_NAMESPACE = user-figma
FIGMA_PLUGIN_USED = YES
FIGMA_PLUGIN_TOOLS = get_metadata
FIGMA_PLUGIN_FILES_TOUCHED = 7elwvIscvMPDiEHrX4f6kQ, 1ev5lg7m2Ze1h3Vqmax8ho
FIGMA_PLUGIN_RESULT = IA_FILE_PAGE_LIST_THIN_ONLY_0_1; V3_FILE_LISTED_SCREENS_AND_COMPONENTS; WRITE_UNUSED
FIGMA_WRITE_ATTEMPTED = NO
```

Third file `Q8zfu4MZhsxLjJMGLHUHZh` classified from committed worklogs and the Figma lane, not rewritten.

## Runtime inventory

Derived from `apps/web/src/App.tsx`. Detail: `docs/worklog/ui-fc0/ROUTE_INVENTORY.md`.

```text
CURRENT_ROUTE_ENTRY_COUNT = 31
REDIRECT_COUNT = 2
UNIQUE_ROUTE_MOUNTED_PAGE_COMPONENTS = 27
LOGIN_PRE_SHELL = 1
UNIQUE_PAGE_COUNT_INCL_LOGIN = 28
OVERLAY_DRAWER_SURFACES = 12
NAV_DESTINATIONS_IN_REGISTRY = 20
NAV_IMPLEMENTED_WITH_HREF = 14
NAV_HIDDEN_NOT_IMPLEMENTED = 6
INVENTED_PAGES = NO
```

Redirects: `/commercial` → `/requests`; `*` → `/`. Hidden map-only: Acasă, Furnizori, Achiziții, Pontaj, Plăți și avansuri, Politici.

## Figma inventory

Detail: `docs/worklog/ui-fc0/FIGMA_INVENTORY.md`.

```text
FIGMA_FILE_COUNT = 3
FIGMA_V3_STRONG_MATCH_ROUTE_FAMILIES = 4
FIGMA_HF_ACCEPTED_NO_V3_FINAL = 6
FIGMA_RUNTIME_NO_DEDICATED_ACCEPTED_PAGE = 14
FIGMA_MAP_ONLY_NO_ROUTE = 6
UI_FIGMA_RUNTIME_RECONCILIATION = FC0_CLASSIFIED_NOT_PIXEL_CLOSED
```

| File | Role |
| --- | --- |
| `7elwvIscvMPDiEHrX4f6kQ` | IA + first HF lot. MCP list thin (`0:1` only). On-canvas Read Me status is **stale**. Shell frames are top-nav. |
| `1ev5lg7m2Ze1h3Vqmax8ho` | V3 Clienți / Hub / Cereri / prequote. Also later Resources flat frames. |
| `Q8zfu4MZhsxLjJMGLHUHZh` | Architecture C simulation. Not living nav. |

**Strong V3 MATCH:** `/clients`, `/clients/*`, `/requests`, `/requests/*`, `/products/:code` prequote.

**HF accepted, no V3-final page file:** Lucrări, Oferte, Catalog list, Atelier, Execution, Login.

**Runtime, no dedicated accepted page Figma:** Product System, Components, Utilaje, Oameni, Procese, Stoc, Firmă, Servicii operaționale, Guvernanță, System, Admin hub, Customer admin.

**Known drift:** HF/Arch C top-nav vs V3 sidebar; Cereri UX LOCK still has superseded NEW→ATTENTION lines; Resources has three archetypes (HF cascade / Arch C `?selected=` / V3 flat `203:1734`); custom Figma icons not installed.

Resources runtime amend is `INTEGRATED_ON_MAIN`. V3-final Owner accept of the flat Figma family is **not** closed.

## Scores — Product System and Machines

```text
PRODUCT_SYSTEM_CURRENT_UI_SCORE = 5
PRODUCT_SYSTEM_REDESIGN_PRIORITY = CRITICAL_UI_UX
PRODUCT_SYSTEM_REDESIGN_DIRECTION_COUNT = 3
MACHINES_CURRENT_UI_SCORE = 7
MACHINES_REDESIGN_PRIORITY = CRITICAL_UI_UX
MACHINES_REDESIGN_DIRECTION_COUNT = 3
```

Product System directions (IA/UX only; domain law unchanged):

1. VERTICAL PRODUCT BLUEPRINT
2. MASTER-DETAIL / PRODUCT CONSTRUCTION WORKSPACE
3. DOMAIN MAP TREE (admin) or COMMERCIAL STAGE DOOR (configurator)

Machines directions (no fake gauges / utilization / telemetry):

1. MACHINE PROFILE
2. CAPABILITY MAP
3. OPERATION → CAPABILITY → MACHINE

Preserve: ROLE → CONSTRUCTIVE TYPE → CONFIGURATION → MATERIAL → TECHNICAL SETTINGS → CALCULATION. Display-label write only. Technical settings stay read-only. Unselected module stays silent. Resource owns rate. Commercial owns selling price.

## Floorplan family

Current runtime families:

```text
REGISTRY
OBJECT_WORKSPACE
VERTICAL_JOURNEY
DISPATCH
FOCUSED_EXECUTION
CONFIGURATION_WORKSPACE
MASTER_DETAIL
ADMIN_CONTROL
OWNER_CATALOG
CONFIGURATOR
```

Proposed additions (study only):

```text
VERTICAL_PRODUCT_BLUEPRINT
MACHINE_PROFILE
CAPABILITY_MAP
```

`OWNER_CATALOG` is the shared generic admin primitive. It is honest for Guvernanță. It is the wrong primary language for Product System and Utilaje.

Full scores: `docs/worklog/ui-fc0/PAGE_MATRIX.md`.

## End-to-end journey visualization study

Operator path that must remain one spine:

```text
Client → Cerere → Catalog → Configurare → Confirmare → Ofertă înghețată → Acceptare → Lucrare / Order copy → Release → Atelier → Execuție
```

| Hop | Runtime visualization | Gap |
| --- | --- | --- |
| Client | Strong registry + Hub | Keep |
| Cerere | Object + vertical facts | Stack vs primary CTA |
| Catalog | Family list + thin detail | Detail does not preview ROLE→TYPE |
| Configurare | Schema form stack | Roles are not a visible construction |
| Confirmare / prequote | Decision rail (strongest signature) | Default edit mode is generic form |
| Ofertă | Object facts | Internal-cost facts encoded on the page |
| Lucrare | Next-step object | Same money presentation issue |
| Atelier | Dispatch lanes | Keep; not a factory map |
| Execuție | Focused plan | Keep |

The journey is commercially readable until Product System and Machines, where the user falls into a peer-category registry that does not look like construction or capability.

UI must not invent journey status, prices, or readiness. Those stay API projections.

## Dynamic form / schema study

`FormRenderer` is the correct law: schema from `TemplateProjection`; visibility via `isFieldVisible` + `selectedComponentIds`; empty sections omitted. UI does not invent LETTERS/ACM fields.

Gap: schema **sections** are not encoded as ROLE columns. Modular product law is in the contract, not in the floorplan. Confirmed/prequote paths already differentiate; edit mode does not.

Do not add a second calculator, hardcoded modules, or technical-settings admin on this form.

## Page records (synthesis)

Lane detail:

- `docs/worklog/ui-fc0/PAGE_PRODUCT_SYSTEM.md`
- `docs/worklog/ui-fc0/PAGE_MACHINES_PEOPLE_PROCESSES.md`
- `docs/worklog/ui-fc0/PAGE_COMMERCIAL_EXECUTION.md`

### Keep (do not redesign for novelty)

Clienți, Client Hub, Atelier, Execuție, Login, Guvernanță, Date firmă, Stoc item.

### Critical rebuild (UI/UX IA only)

1. `/admin/product-system` + `/components` — same `OwnerCatalogView`; no ROLE→TYPE blueprint.
2. `/admin/workcenters` — honest gaps, weak machine identity; zone and machine share one list.
3. `/admin/people` — Cereri/Clienți clone; person object borrows Hub cards.

### High, not rebuild-from-zero

Configurator (add blueprint, keep spine), Catalog detail, Oferte/Lucrări chrome, Cereri filters/stack, Resources desktop master-detail, Operational Services Admin L2, dual client door, quote/job money presentation.

## Operator money presentation (S2 refined)

Quote inspection and job detail **encode** Cost intern / Adaos / Marjă as ordinary facts.

Domain `ALT_B_SCOPED` already strips `internalCost` and related keys for `commercial` (non-owner) via `scopeQuoteSnapshot`. This pack does **not** claim a proven API leak.

Residual issue: Owner financials sit on the same commercial decision page operators use. Canon wants Owner cost evidence on Owner/admin surfaces. HF Wave 1 money contract put scoped facts on quote/job. Do not average this away. Do not “fix” it in FC0.

## Lane disagreements (not averaged)

See `docs/worklog/ui-fc0/LANE_DISAGREEMENTS.md`.

1. Procese info model 9/10 vs same chrome as Utilaje.
2. `/components` richer ROLE projection vs worst signature.
3. Figma top-nav vs runtime V3 sidebar.
4. Three Resources archetypes.
5. Stale NEXT fields vs living UI/UX program.
6. Strong commercial V3 ≠ Product System closed.
7. Quote/job money presentation vs operator-UI canon (API scoped).
8. `/clients` create vs `/admin/customers` lifecycle.

## Visual / accessibility this wave

```text
VISUAL_A11Y_PASS = NOT_FRESHLY_CAPTURED_THIS_WAVE
FRESH_1440_1280_768 = NO
FRESH_LIGHT_DARK = NO
FRESH_KEYBOARD_FOCUS = NO
HISTORICAL_V3_PACKS_EXIST = YES
```

Historical evidence remains in prior V3 / HF worklogs and `docs/worklog/screenshots/`. FC0 does not claim new viewport or focus proof. Do not treat old V3 screenshots as this audit’s runtime capture.

## Roadmap contradiction resolution

| Field | Living value | Action |
| --- | --- | --- |
| `NEXT_PROGRAM_PRIORITY` | `WORKOS_UI_UX_FINAL_CLOSURE_V1` | Wins |
| `NEXT_RECOMMENDED_BUILD` | `WORKOS_UI_UX_FINAL_CLOSURE_V1` | Wins |
| `POST_INTEGRATION_RECOMMENDED_PROGRAM` | `WORKOS_PERFORMANCE_AND_LOGIC_EFFICIENCY_V1` | Mark **STALE**; do not execute; do not rewrite PERF history |
| Direction canon `NEXT_PROGRAM_PRIORITY` | `PRODUCT_DEVELOPMENT` | Stale vs living roadmap; not rewritten in this wave |
| `UI_V3_BASELINE` | `HISTORICALLY_COMPLETE` | Keep; does not equal page-by-page study |
| `UI_PAGE_BY_PAGE_FINAL_CLOSURE` | this pack | `FC0_AUDIT_PACK_IN_REVIEW` |
| `UI_FIGMA_RUNTIME_RECONCILIATION` | this pack | `FC0_AUDIT_PACK_IN_REVIEW` |

## Proposed implementation batches (not started)

No React, CSS, or Figma write from this list until a later GO.

```text
PROPOSED_BATCH_COUNT = 5
UI_FC1_STARTED = NO
```

1. **FC1 — Product System construction workspace** — CRITICAL. Blueprint or master-detail for `/admin/product-system` + `/components`. Label write only. Study 2–3 floorplans already listed.
2. **FC2 — Machines / People identity** — CRITICAL. Machine profile + capability map. People stops cloning commercial registry. Processes keep the information model.
3. **FC3 — Commercial presentation** — HIGH. Oferte/Lucrări chrome; Cereri filter duplicate; Owner-gate money facts on quote/job; dual client door.
4. **FC4 — Admin consistency** — HIGH. Resources desktop master-detail; Operational Services into Admin L2; Stoc search.
5. **FC5 — Figma reconciliation** — after FC1–FC2 direction chosen. New Product System / Machines frames; Oferte/Lucrări V3-final only with Owner GO. No Figma write now.

Do not start OS-S8 from this pack. Do not start Oferte V3 or Lucrări V3 as a fashion pass.

## What UI must not invent (program law)

Rates, capacity %, busy/idle, telemetry, commercial formulas, readiness, composition edits, technical-setting Edit/Save, Halo/Full Aluminium construction, parallel Product entity, Analyzer as product truth, pontaj, payroll, fake Home.

## Stop line

```text
UI_FC0_IMPLEMENTATION = NO
UI_FC1 = NOT_STARTED
FIGMA_WRITE = NO
OS_S8 = HOLD_UNTIL_UI_UX_FINAL_CLOSURE
REAL_CLOUD = NO
NEXT_STEP = CHATGPT_INDEPENDENT_UI_FC0_REVIEW
```
