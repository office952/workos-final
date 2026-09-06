# WORKOS UI20-RW2 — Cerere Resolution Field + Config composition / lens

```text
GO                         = OWNER_GO_UI20_RW2
OWNER_DECISION             = GO
PROGRAM                    = WORKOS_UI_UX_2_0_E2E
WAVE                       = UI20_RW2_CERERE_RESOLUTION_FIELD_CONFIG_COMPOSITION_LENS
TASK_CLASS                 = UI_UX
STATUS                     = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED             = NO
INTEGRATED_ON_MAIN         = NO
NEXT_WAVE                  = NO
PUSH                       = NO
MERGE_MAIN                 = NO
FIGMA_WRITE                = NO
CLOUD_WRITE                = NO
REAL_DATA_MUTATION         = NO
```

## Identity

```text
REPO                       = office952/workos-final
WORKTREE                   = C:\Users\offic\workspace\workos-final-wt\ui20-rw2-cerere-config
BRANCH                     = design/ui20-rw2-cerere-config-composition-lens
BASE_HEAD                  = 8c168dc6417af040eff0f79f033e287fbd9b807c
ORIGIN_MAIN                = 8c168dc6417af040eff0f79f033e287fbd9b807c
COMMON_GIT_DIR             = C:/Users/offic/workspace/workos-final/.git
```

## Source reads

```text
ROADMAP_READ                          = YES
AGENTS_READ                           = YES
UI_UX_CANON_READ                      = YES
FOUNDATION_CANON_READ                 = YES
COMMERCIAL_REQUEST_CANON_READ         = YES
PRODUCT_CONFIG_CANON_READ             = YES
RESOURCES_COST_CANON_READ             = YES
FINAL_IA_ACCEPTANCE_READ              = YES
FINAL_VISUAL_ACCEPTANCE_READ          = YES
RW1_WORKLOG_READ                      = YES
VIS1_GATE_READ                        = YES
H1_HYGIENE_AND_MAP_READ               = YES
DIRECTION_CONFLICT                    = NO
```

Roadmap and UI canon still record `UI20_RW2 = NOT_STARTED_NOT_AUTHORIZED` on `origin/main`. This Owner GO is the authorization for the local wave. Canons were not rewritten.

## Figma (read-only)

```text
FIGMA_FILE                 = WorkOS UI UX 2.0 — E2E
FILE_KEY                   = 0XP0yGa1siWQdTTL7ou8xz
FIGMA_WRITE                = NO
PRIMARY                    = 234:66 (Cerere) · 234:103 (Config)
VIS1A                      = 239:69 · 240:66 · 241:161 · 241:66
SUPPORT                    = 242:66 · 242:941
```

Mental models used:

- Cerere = Cunoscut / Nerezolvat + local consequence + one dominant next verb
- Config = ANCHOR → RELATION → LENS; roles are construction, not steps
- 768 Cerere = vertical field; 768 Config = mini-map remains, lens sequential

## Old WorkOS semantic evidence

Local `office952/workos-vscode` clone was not present. Semantic comparison used the existing read-only audit `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md` plus current runtime.

```text
OLD_GOOD_MENTAL_MODEL   = request identity and customer stay visible while configuring; missing facts stay near the work
OLD_BAD_COMPLEXITY      = Intake V6 as a second product authority; SVG/layer theatre; CRM-like request forms
CURRENT_RUNTIME_LIMIT   = generic V3 object/form pages; ObjectContextStrip empty; long LETTERS form
UI20_SOLUTION           = Resolution Field from CommercialRequest projection; schema-driven composition + Context Lens
```

Intake terminology was not resurrected. `CommercialRequest` remains the canonical object.

## Baseline

Isolated local runtime on ports 8788 / 5178 with synthetic request `CER-937E9F9F`.

Before RW2:

- Cerere was a V3 object header plus stacked sections
- Config was a long form plus sticky summary
- Object context strip was empty
- No Known / Unresolved instrument
- No composition map

## Implementation

Changed routes:

- `/requests/:requestId` — Resolution Field
- `/products/:productCode?request=:requestId` — Construction composition + Context Lens while editing

Unchanged authorities:

- CommercialRequest does not own Product Truth, EIC, materials, quote/order/execution
- ROLE ≠ TYPE ≠ CONFIGURATION ≠ RESOURCE ≠ RATE
- FACE / VOLUME / BACK / LIGHTING are projected from the live template, not hardcoded as a universal UI
- Rates stay in Resources/Cost; Figma `16,00 EUR / m²` is omitted
- Confirm / EIC / quote / snapshot semantics unchanged

Contract gaps deferred (no backend change):

```text
CONTRACT_GAP              = request contact person, intended product, dimensions, material blockers are not CommercialRequest truth
FIGMA_BEHAVIOR_DEFERRED   = Confirmă material / Confirmă FAȚĂ; specimen prices; CRM contact block
```

Primary Cerere verbs remain existing contract verbs: `Alege produs`, `Deschide oferta`, `Completează montajul`, `Alege un mod oferit`.

## Files

Web / presentation:

- `apps/web/src/RequestResolutionField.tsx`
- `apps/web/src/requestResolutionView.ts`
- `apps/web/src/ConstructionComposition.tsx`
- `apps/web/src/constructionCompositionModel.ts`
- `apps/web/src/ContextLens.tsx`
- `apps/web/src/objectWorkbenchContext.tsx`
- `apps/web/src/RequestDetailPage.tsx`
- `apps/web/src/ProductConfigurationPage.tsx`
- `apps/web/src/FormRenderer.tsx`
- `apps/web/src/AppShell.tsx`
- `apps/web/src/index.css`

Tests:

- focused web tests for resolution, composition, FormRenderer lens filter
- `e2e/ui20-rw2-cerere-config.spec.ts`
- composition-tab clicks in existing LETTERS / ACM Playwright helpers and specs
- scoped locators where Resolution Field duplicated visible copy

## Tests

```text
WEB_UNIT                   = 244 PASS
DOMAIN_UNIT                = 453 PASS
API_UNIT                   = 302 PASS
LINT                       = PASS (11 preexisting warnings, 0 errors)
TYPECHECK                  = PASS
BUILD                      = PASS
PLAYWRIGHT_FOCUSED_RW2     = PASS
PLAYWRIGHT_FULL            = 111 PASS / 5 SKIPPED after locator fixes
  first full run           = 109 PASS / 2 FAIL / 5 SKIPPED
  fixes                    = request-installation-facts + requests-overview strict-mode duplicates
  rerun of failed files    = PASS
REACT_DOCTOR               = 83/100 (preexisting complexity on AppShell / RequestDetail / ProductConfiguration)
COMPILER_CHECK             = PASS
DESLOP                     = indent-only AppShell cleanup; no semantic change
```

## Runtime evidence

Ignored directory: `.tmp/ui20-rw2-evidence/`  
Manifest: `.tmp/ui20-rw2-evidence/MANIFEST.md`  
Screenshots are not committed.

```text
PRIVACY_SCAN               = PASS
REAL_DATA                  = NO
CLOUD_WRITE                = NO
OVERFLOW                   = NONE on required viewports
```

## Intentional differences vs Figma

- No specimen contact / intended product / dimensions on Cerere
- No per-role Confirmă FAȚĂ / Confirmă material
- No fabricated rates
- Existing `Fapte fixe`, files, related offers, and Rezumat sidebar remain (contract / existing commercial spine)
- Composition is semantic tabs, not an illustrated fabrication drawing
- BACK / LIGHTING with no operator fields show an honest empty lens
- Object context uses the RW1 strip, not a breadcrumb wall
- 768 composition may use a compact map with contained overflow; the page does not scroll horizontally

```text
FIGMA_RUNTIME_MATCH        = DIRECTIONAL_PASS
```

## Business boundary

```text
BACKEND_DIFF               = NONE
DOMAIN_DIFF                = NONE
API_CONTRACT_DIFF          = NONE
DB_DIFF                    = NONE
COMMERCIAL_CALCULATION_DIFF = NONE
PRODUCT_CALCULATION_DIFF   = NONE
SNAPSHOT_DIFF              = NONE
```

## Advisories

- Attention-edge terracotta is mixed quieter than R5; blocked install reasons stay local
- Rezumat + Fapte fixe still add older furniture beside the new instruments
- Roadmap/canon flags still say RW2 not started until Owner accepts and integrates
- React Doctor complexity warnings are preexisting page size, not a new parallel architecture

## Stop state

```text
STOP_AFTER_LOCAL_COMMIT_AND_REPORT = YES
OWNER_ACCEPTED                     = NO
INTEGRATED_ON_MAIN                 = NO
NEXT_WAVE                          = NO
MASTER_POLISH                      = NO
PUSH                               = NO
NEXT_STEP                          = RETURN_TO_CHATGPT_FOR_INDEPENDENT_RW2_REVIEW
```
