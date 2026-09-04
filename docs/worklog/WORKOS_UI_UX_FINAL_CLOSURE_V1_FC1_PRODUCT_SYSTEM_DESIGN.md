# WorkOS UI/UX Final Closure V1 — FC1 Product System design

```text
PROGRAM = WORKOS_UI_UX_FINAL_CLOSURE_V1
WAVE = UI_FC1_PRODUCT_SYSTEM_DESIGN
STATUS = LOCAL_IN_REVIEW
CHATGPT_REVIEW_1 = CHANGES_REQUIRED_FIGMA_REFINEMENT
PRIMARY_DIRECTION = VERTICAL_PRODUCT_BLUEPRINT
A2_SYNTHESIS = LOCAL_IN_REVIEW
IMPLEMENTATION = NO
UI_CODE_WRITE = NO
CSS_WRITE = NO
FIGMA_WRITE = YES
FIGMA_LIBRARY_PUBLISH = NO
FIGMA_READ = YES
MERGE_MAIN = NO
REAL_CLOUD_WRITE = NO
OS_S8 = HOLD_UNTIL_UI_UX_FINAL_CLOSURE
NEXT_STEP = CHATGPT_INDEPENDENT_UI_FC1A_FIGMA_REVIEW
```

```text
ROADMAP_READ = YES
UI_UX_CANON_READ = YES
DIRECTION_CONFLICT = NO
```

Living program remains `WORKOS_UI_UX_FINAL_CLOSURE_V1`. FC0 is integrated on main. This wave is design-first. It does not implement Product System React, does not publish a Figma library, and does not start Machines FC2.

```text
REPO = office952/workos-final
WORKTREE = C:/Users/offic/workspace/workos-final-ui-fc1
BRANCH = design/ui-fc1-product-system-blueprint-v1
FC0_INTEGRATED_HEAD = f4ff1b903b40d88ac8a3e75f33e97fbf7f998623
FC0_DOC_CLOSURE_HEAD = fb0acbb0151236fd55d1a3a17b6746fbfd6f630d
FC1_BASE_HEAD = fb0acbb0151236fd55d1a3a17b6746fbfd6f630d
PR_12_STATE = MERGED
```

## Authority read

- FC0 `PAGE_RECORDS`, `PRODUCT_SYSTEM_DIRECTIONS`, `DYNAMIC_FORMS`, `JOURNEY`, `FULL_WIDTH_LAYOUT`, `FIGMA_LIVE`
- `PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON`
- `PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON`
- `ProductSystemAdminPage`, `ComponentsPage`, `ProductConfigurationPage`, `FormRenderer`
- Current V3 shell in file `1ev5lg7m2Ze1h3Vqmax8ho`

No Code Connect files exist in this repo (`*.figma.ts` / `*.figma.tsx` = 0). Frames reuse the V3 Clients chrome (sidebar 256 / content plane 1184) and Color/Space variables. New work lives only on page `UI-FC1 — Sistem produs (explorare)`.

## Plugin

```text
FIGMA_PLUGIN_AVAILABLE = YES
FIGMA_PLUGIN_NAMESPACE = user-figma
FIGMA_PLUGIN_USED = YES
FIGMA_PLUGIN_TOOLS = whoami, use_figma, get_screenshot
FIGMA_FILE = 1ev5lg7m2Ze1h3Vqmax8ho
FIGMA_PAGE = UI-FC1 — Sistem produs (explorare)
FIGMA_PAGE_ID = 236:2821
FIGMA_WRITE = YES
FIGMA_LIBRARY_PUBLISH = NO
ACCEPTED_CLIENTS_CERERI_RESOURCES_FRAMES = UNTOUCHED
```

## What was designed

Three genuinely distinct Product System directions. Not three skins of `OwnerCatalogView`.

### A — VERTICAL PRODUCT BLUEPRINT

The product is read as construction layers. LETTERS shows FAȚĂ / VOLUM / SPATE / ILUMINARE. ACM shows only FAȚĂ / SPATE. Product-level operations sit as a thin footing, not a fifth role. Focused layer owns type, configuration ownership, resource identity, cost-readiness without rate, and the type process contract.

### B — PRODUCT CONSTRUCTION MASTER-DETAIL

The master list is ProductTemplates only (two live, Halo/Aluminiu empty). The inspector is one object: composition band, selected-role tabs, contract, settings/process/resource as bands. ACM tabs omit Volum and Iluminare.

### C — DOMAIN MAP / GRAPH

A single ownership tree. Settings appear only on the type that owns them (LED față). ACM node has no LED-settings folder. Empty Halo / Aluminiu stay empty.

### Configurator concept

Same blueprint language on the commercial door: select Volum → schema-owned pe-comandă fields → needs-input. Schema remains authority. No second calculator. Catalog nav current, not Sistem produs.

## Frames

See `docs/worklog/ui-fc1/FRAMES.md`. Evidence: `docs/worklog/ui-fc1/evidence/`.

```text
LETTERS_PROOF = YES
ACM_PROOF = YES
1440_LIGHT = YES_ALL_THREE
1440_DARK = A_AND_B
1280_LIGHT = A_ONLY
768_LIGHT = A_AND_B_AND_C
DYNAMIC_FORM_CONCEPT = A_CONFIGURATOR_VOLUME
FULL_WIDTH_RULE = FULL_WIDTH_WITHIN_WORKOS_CONTENT_PLANE
```

## Scores (independent; not averaged)

| Axis | A Blueprint | B Master-detail | C Domain map |
| --- | ---: | ---: | ---: |
| USER_ORIENTATION | 9 | 8 | 6 |
| PRODUCT_TRUTH_VISIBILITY | 9 | 8 | 8 |
| ROLE_TYPE_CONFIGURATION_CLARITY | 9 | 8 | 7 |
| VISUAL_INFORMATION_MODEL | 9 | 7 | 6 |
| PAGE_SIGNATURE | 9 | 6 | 7 |
| DYNAMIC_FORM_COMPATIBILITY | 9 | 6 | 5 |
| MULTI_PRODUCT_GENERALITY | 7 | 9 | 8 |
| SMART_MODULARITY | 9 | 8 | 8 |
| RESPONSIVE | 7 | 7 | 6 |
| ACCESSIBILITY | 6 | 6 | 6 |
| IMPLEMENTATION_COMPLEXITY | 7 | 6 | 8 |
| RISK_OF_DOMAIN_LEAK | 3 | 5 | 4 |

Fatal if chosen alone:

- B can be read as Client Hub with extra facts (PAGE_SIGNATURE 6).
- C orients an architect, not a workshop reader (USER_ORIENTATION 6).
- A scales less obviously when many templates exist (MULTI_PRODUCT_GENERALITY 7).

Accessibility is not pixel-proven. Focus rings stay `REQUIRED_BY_FINAL_IMPLEMENTATION_ACCEPTANCE`.

## Recommendation (Cursor; not self-accepted)

```text
PRIMARY_DIRECTION_RECOMMENDED = VERTICAL_PRODUCT_BLUEPRINT
SECONDARY_ELEMENTS_TO_BORROW = B_PRODUCT_ONLY_MASTER_WHEN_TEMPLATE_COUNT_GROWS; C_SETTINGS_ONLY_ON_OWNING_TYPE
REJECTED_ELEMENTS = SEVEN_PEER_CATALOGS; GHOST_ACM_VOLUME_OR_LIGHTING; SETTINGS_AS_ROOT; COMPOSITION_EDITOR; RATES_IN_PRODUCT_SYSTEM
```

A is the only candidate that is recognizable without the H1 as a construction system. B is the better list mechanic later. C is the better authority map, not the daily Owner page.

## Conceptual validation

| Situation | Holds? |
| --- | --- |
| Advanced company, many templates | B list + A inspector, or A with a product switcher borrowed from B |
| Small company, two products | A is enough; B's list is almost empty chrome |
| Unused families ignored | C shows empty Halo/Aluminiu honestly; A never draws them as layers |
| Later product enablement | New template rebuilds A's stack from composition; no React product branch |
| Configuration after accepted quotes/jobs | Admin stays read/label-only; configurator remains the order door |

Normal reading/administration does not require Cursor, CLI, or direct DB.

## Honesty / remaining design gaps

- 1280 exists only for A LETTERS.
- 1440 Dark exists for A and B LETTERS, not C and not ACM.
- 768 hides the sidebar rather than designing a dedicated collapsed chrome.
- ACM 768 was not drawn; silence of missing roles is proven at 1440.
- Sidebar instances still use the Clients shell; only Current variant was switched to Sistem produs.
- Cover status frame still uses Inter; screens use IBM Plex Sans.

These are design-pack advisories, not a reason to implement React.

## Law preserved

```text
DISPLAY_LABEL_WRITE_ONLY = YES
TECHNICAL_SETTINGS = READ_ONLY
UNSELECTED_MODULE = SILENT
RESOURCE_OWNS_RATE = YES
COMMERCIAL_OWNS_PRICE = YES
NO_COMPOSITION_EDITOR = YES
NO_NEW_PRODUCT_ENTITY = YES
NO_HARDCODED_LETTERS_FIELDS = YES
NO_HALO_FULL_ALUMINIUM_INVENTION = YES
```

## ChatGPT review 1

```text
CHATGPT_REVIEW_1 = CHANGES_REQUIRED_FIGMA_REFINEMENT
PRIMARY_DIRECTION = VERTICAL_PRODUCT_BLUEPRINT
DIRECTION_B = REJECT_AS_PRIMARY
DIRECTION_C = REJECT_AS_PRIMARY
A2_SYNTHESIS = LOCAL_IN_REVIEW
```

A/B/C exploration frames are kept as history. They were not overwritten.

## A2 — Product Construction Blueprint

New Figma section `UI_FC1A_FINAL_DIRECTION_CANDIDATE` (`240:2503`).

```text
PRODUCT_SWITCHER_MODEL = COMPACT_CHIPS_TWO_LIVE_TEMPLATES
BLUEPRINT_SPINE_MODEL = FACE_THEN_VOLUME_WITH_LIGHTING_BRANCH_THEN_BACK_THEN_WHOLE
LIGHTING_RELATION_MODEL = BRANCH_FROM_VOLUME_NOT_FOURTH_CARD
WHOLE_PRODUCT_REGION = DASHED_FOOTING_OUTSIDE_ROLE_OWNERSHIP
CONTEXT_INSPECTOR_MODEL = STRUCTURED_GROUPS_HUG
DYNAMIC_FORM_MODEL = SCHEMA_PROJECTED_CHIPS_DEPTH_AND_FINISH
NAV_PRODUCT_SYSTEM = CORRECT
NAV_CONFIGURATOR = CORRECT
MOBILE_MENU = CORRECT
FULL_WIDTH = PASS
NO_GIANT_EMPTY_PANEL = PASS
GENERIC_CARD_STACK = PASS
RECOGNIZABLE_WITHOUT_H1 = PASS
LETTERS_COMPOSITION_TRUTH = PASS
ACM_COMPOSITION_TRUTH = PASS
RESOURCE_OWNERSHIP = PASS
COMMERCIAL_OWNERSHIP = PASS
NO_COMPOSITION_EDITOR = PASS
```

| Key | NODE_ID |
| --- | --- |
| A2_LETTERS_1440_LIGHT | 240:2956 |
| A2_LETTERS_1440_DARK | 240:9168 |
| A2_LETTERS_1280_LIGHT | 240:9345 |
| A2_LETTERS_768_LIGHT | 240:10312 |
| A2_ACM_1440_LIGHT | 240:9712 |
| A2_ACM_768_LIGHT | 240:10429 |
| A2_CONFIGURATOR_NEEDS_INPUT | 240:9890 |
| A2_CONFIGURATOR_COMPLETE | 240:10101 |
| A2_LIGHTING_SELECTED | 240:9522 |

SidebarNavItem `Current=True` resets the label to Clienți. A2 restores labels from icon identity after any variant change.

768 uses the accepted Clients 768 chrome: Meniu + Cont. Not a hidden-desktop-sidebar.

## Stop line

```text
UI_CODE_WRITE = NO
FIGMA_LIBRARY_PUBLISH = NO
MACHINES_FC2 = NOT_STARTED
NEXT_STEP = CHATGPT_INDEPENDENT_UI_FC1A_FIGMA_REVIEW
```
