# WorkOS V1 — Product Batch 1 discovery (partial, no invention)

```text
PROGRAM = PRODUCT_BATCH_1_REUSE_FIRST
BRANCH = feat/product-batch-1-reuse-first-v1
ORIGIN_MAIN = 20e57ea8a69e59f2e1918cd6219cb5616e0225bd
BASE_HEAD = 20e57ea8a69e59f2e1918cd6219cb5616e0225bd
UI_ACCEPTED_HEAD = 122d8693d7a9c6a76e2131dc6555b65bb6537901
STATUS = PARTIAL_NO_INVENTION
PRODUCT_BATCH_1 = PARTIAL_NO_INVENTION
OWNER_ACCEPTED_RUNTIME = YES
IMPLEMENTATION = NO
PRODUCT_DOMAIN_WRITE = NO
FORM_SCHEMA_WRITE = NO
COMPONENT_TYPE_WRITE = NO
RESOURCE_DEFINITION_WRITE = NO
PROCESS_COMPOSITION_WRITE = NO
GENERIC_WEB_WRITE = NO
API_WRITE = NO
DATABASE_SCHEMA_WRITE = NO
FIGMA_READ = NO
FIGMA_WRITE = NO
REAL_CLOUD_WRITE = NO
REAL_REQUEST_PATCH = NO
REAL_QUOTE_CREATE = NO
MERGE_MAIN = NO
```

```text
ROADMAP_READ       = YES
PRODUCT_CANON_READ = YES
UI_UX_CANON_READ   = YES
DIRECTION_CONFLICT = NO
```

Owner GO: prove the existing Product System can add up to two real products on the generic spine, without Composer, without product-specific frontend, and without inventing construction or rates.

This record is discovery plus selection. It does not add a ProductTemplate. It does not invent halo lighting, aluminium-face sheet identity, or AI rates to force Quote-ready.

## Identity

Verified against `origin/main` before the feature branch:

```text
REPO                 = office952/workos-final
ORIGIN_MAIN          = 20e57ea8a69e59f2e1918cd6219cb5616e0225bd
UI_ACCEPTED_HEAD     = 122d8693d7a9c6a76e2131dc6555b65bb6537901
PR_6                 = MERGED
CURRENT_TEMPLATES    = PRD-LETTERS-FRONTLIT-PLEXI-AL06, PRD-ACM-CASSETTE-NONE
```

`20e57ea` is documentation only. Its parent is the accepted UI head `122d869`.

## Current product baseline

Registry (`packages/domain/src/product/productRegistry.ts`) has exactly two templates. Both stay regression anchors.

| Code | Category | Types |
|---|---|---|
| `PRD-LETTERS-FRONTLIT-PLEXI-AL06` | `FRONT_LIT_VOLUMETRIC_LETTERS` | `PLEXIGLAS_FACE`, `ALUMINIUM_VOLUME`, `FOREX_BACK`, `LIGHTING_FRONT_LED` |
| `PRD-ACM-CASSETTE-NONE` | `ACM_CASSETTE_PANELS` | `ACM_CASSETTE_BODY`, `STEEL_INTERNAL_FRAME` |

Catalog categories `HALO_LIT_VOLUMETRIC_LETTERS` and `FULL_ALUMINIUM_VOLUMETRIC_LETTERS` exist and are empty. Categories are not ProductTemplates. Admin tests already treat them as deletable empties.

Live constructive types remain the six in `PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`. There is no `LIGHTING_HALO` and no `ALUMINIUM_FACE`. `lighting.mode: "halo"` appears only as a rejected draft override in compiler tests; the front-lit template keeps `front_lit`.

## Parallel discovery

Seven read-only lanes ran against current sources. No lane was told which product must win.

| Lane | Question | Result |
|---|---|---|
| A | Catalog / FormSchema / Product Truth | Both seeded categories are empty shells. No transferred dossier. |
| B | Constructive types | Halo lighting and aluminium face are different physical contracts. Config-only reuse would mislabel truth. |
| C | Resources / EIC | No halo geometry/rates. No aluminium sheet identity or purchase evidence. |
| D | Processes | LETTERS DAG is front-lit plexi + aluminium volume + forex. Both candidates `PROCESS_COMPOSITION_COMPLETE = NO`. |
| E | Commercial / Quote | Generic ACM path is ready for any EIC-COMPLETE product. Not the blocker. |
| F | UI renderer | Accepted Product Configuration page is schema-driven. No `productCode ===` business branch in `apps/web`. UI is not the blocker. |
| G | Smart modularity | Snapshots stay immutable. Catalog is still a global Layer B list. Adding a template later does not rewrite Quotes. |

## Candidate scorecard

Scoring uses the Owner GO weights. Architecture risk HIGH is a Batch 1 stop even if the usefulness score is high.

### HALO_LIT_VOLUMETRIC_LETTERS

| Criterion | Score | Why |
|---|---|---|
| BUSINESS_USEFULNESS | 26 / 30 | Real, frequent, commercially useful letters product. |
| CURRENT_PRIMITIVE_REUSE | 8 / 25 | Volume reuses. Face/back only if Owner confirms the same body. Lighting does not. |
| EIC_READINESS | 2 / 15 | No halo type, no geometry basis, no halo rates. |
| COMMERCIAL_READINESS | 8 / 10 | Generic projector exists after EIC COMPLETE. |
| PROCESS_REUSE | 3 / 10 | Front-lit electrical and plexi body gates are not halo truth. |
| UI_SCHEMA_REUSE | 10 / 10 | Same FormSchema kinds would suffice. |
| **Total** | **57 / 100** | |
| ARCHITECTURE_RISK | **HIGH** | New lighting contract plus missing Owner construction. |

Blockers:

1. No ProductTemplate or transferred construction dossier.
2. `LIGHTING_FRONT_LED` is perimeter front-lit math and front-lit process copy. Reusing it as halo invents quantity law.
3. Face material for halo is undefined (opal plexi is typical front-lit, not halo).
4. Back / closure / standoff construction is undefined.
5. No Owner-confirmed halo LED placement rule.

### FULL_ALUMINIUM_VOLUMETRIC_LETTERS

| Criterion | Score | Why |
|---|---|---|
| BUSINESS_USEFULNESS | 24 / 30 | Real shop product. Slightly less frequent than halo in the current HUB mix, still high value. |
| CURRENT_PRIMITIVE_REUSE | 6 / 25 | Volume reuses. Face cannot. Lighting mode is undefined. Back may or may not stay Forex. |
| EIC_READINESS | 1 / 15 | No aluminium sheet resource. Profile 3 EUR/m is not a face sheet rate. |
| COMMERCIAL_READINESS | 8 / 10 | Same generic path after EIC COMPLETE. |
| PROCESS_REUSE | 2 / 10 | Face CNC, bond, close, inspect are gated on `PLEXIGLAS_FACE`. |
| UI_SCHEMA_REUSE | 10 / 10 | Same measurement/finish field kinds. |
| **Total** | **51 / 100** | |
| ARCHITECTURE_RISK | **HIGH** | New FACE type plus missing sheet identity, rates, lighting, and assembly law. |

Blockers:

1. No `ALUMINIUM_FACE` type, contract, or resolver.
2. Resource catalog has aluminium **profile** only, not sheet.
3. No face purchase or aluminium-face CNC evidence.
4. Category says “luminoase” but does not fix front vs halo vs none.
5. Letter body processes require `PLEXIGLAS_FACE`.

## Fallback search

The GO forbids forcing a HIGH-risk seeded candidate and asks for the next documented, high-reuse, Quote-ready candidate.

Searched: product canons, catalog worklog, ACM second-product record, resources canon, processes canon, commercial/snapshot canons, `WORKOS_FINAL_ROADMAP_V1.md`, plans, and local workspace product dossiers.

| Fallback | Decision | Why not Batch 1 |
|---|---|---|
| Non-illuminated volumetric letters | Rejected | Not in the catalog. Family is lighted. Would invent a product identity to look productive. |
| Vinyl / painted variants of live products | Rejected | Configuration of existing templates, not a new product. Vinyl/RAL evidence is `LEGACY_EVIDENCE` and keeps EIC PARTIAL. |
| Illuminated ACM | Rejected | Explicitly later. Roadmap forbids full/illuminated ACM from this slice. |
| Logo | Rejected | Historical later item. No live types or rates. |
| Depth-specific LETTERS clones | Rejected | Depth is already order configuration on the live front-lit product. |
| Previous-repo TPL clones | Rejected | No local TPL dossier. Legacy front-lit scope transferred only plexi / aluminium / forex / front LED. |

No fallback is both documented and implementation-ready without inventing construction or rates.

## Selection

```text
SELECTED_PRODUCT_1 = NONE
SELECTED_PRODUCT_2 = NONE
SELECTION_REASON =
  both seeded candidates are HIGH architecture risk
  and lack Owner construction / rate truth;
  no documented fallback reuses the spine to Quote-ready
  without invention
```

ACM remains the second-product proof that the spine is already generic. Batch 1 must not rebuild it.

## What this proves about the engine

The engine is generic enough to accept a third ProductTemplate **after** construction, types, resources, and rates exist. ACM already did that:

```text
ProductTemplate + FormSchema
  → type-owned calculation
  → type-scoped recipes / processes
  → compileEic
  → projectCommercialPrice
  → freezeQuoteSnapshot
```

What Batch 1 cannot honestly claim: that empty catalog categories are enough to manufacture two Quote-ready products.

The missing primitives are reusable constructive types **plus Owner product truth**, not a Composer and not a product-specific React page.

## Owner decisions required to reopen a candidate

### Halo

1. Face material identity (opaque aluminium, painted metal, non-opal acrylic, or confirmed plexi).
2. Back / standoff / closure construction.
3. LED quantity basis (volume perimeter, rear outline, or other).
4. Whether that basis is still `LIGHTING_FRONT_LED` or a new reusable `LIGHTING_HALO_*` type.
5. Rates for any new material. `AI_DECISION` is allowed only after the identity exists.

### Full aluminium

1. Face sheet specification (thickness, form). That is not the 0.6 mm return profile.
2. Face purchase evidence, or an explicit Owner accept of classified `AI_DECISION` on a named sheet identity.
3. Face CNC rate and whether it shares `SVC-CNC-FACE` / perimeter basis.
4. Lighting mode (front, halo, or none).
5. Back material (Forex stays, or aluminium back).
6. Assembly method (plexi-style bond vs weld). Bond/close/inspect gates today require `PLEXIGLAS_FACE`.

Until those exist, do not add placeholder templates.

## Smart modularity (current spine, no new product)

| Gate | Fact |
|---|---|
| A Advanced company can use the spine | Yes — two live Quote-ready products. |
| B Smaller company without unrelated modules | Partial — unselected roles are silent inside a template; catalog is still global. |
| C Org can ignore a family | Not implemented. Layer B catalog is global. |
| D Adding a product later rewrites Quotes | No. Snapshots are immutable. |
| E Rate changes reprice frozen Quotes | No. Reads use stored payload. |
| F Customer-specific forks | No. `ProductTemplate.code` is the valid identity. |
| G Operable without Cursor | Operator path yes. New ProductTemplate registration is still code. |

## UI / Figma

```text
FIGMA_READ  = NO
FIGMA_WRITE = NO
NEW_PRODUCT_SPECIFIC_PAGE = NO
```

Figma read was not useful: no new product reached configuration. The accepted Product Configuration story stays closed.

## Files

This wave writes documentation only. Front-lit LETTERS and ACM cassette source are unchanged.

## Next step

Independent ChatGPT Product Batch 1 review of this discovery.

After that, Owner construction decisions for halo and/or full aluminium — or an explicit GO naming a different product that already has truth on the current spine.
