# WorkOS Figma ↔ Runtime Registry

```text
ROLE                       = TRACEABILITY_REGISTRY
OWNS                       = EXACT_RUNTIME_STATE_TO_FIGMA_FRAME_MAPPING
DOES_NOT_OWN               = PRODUCT_TRUTH, DOMAIN, PRICING, EXECUTION, ROADMAP
LIVE_STATE_DEPENDENCY      = YES
UPDATE_RULE                = UPDATE_WHEN_A_CANONICAL_UI_STATE_IS_IMPORTED, ACCEPTED, IMPLEMENTED, SUPERSEDED, OR_REVERIFIED
```

This registry makes the relationship between runtime and Figma explicit and durable across Cursor / ChatGPT sessions.

It is not a second UI canon and not a design backlog. The current runtime, living canons, and explicit Owner acceptance remain the authorities.

## Status vocabulary

```text
RUNTIME_IMPORT
DESIGN_CANDIDATE
OWNER_ACCEPTED_DESIGN
IMPLEMENTED
CURRENT_VALID_MIRROR
SUPERSEDED
HISTORICAL
ARCHIVE
```

There may be several `CURRENT_VALID_MIRROR` frames for one route when they represent different states, products, viewports, or themes.

There must not be two competing current frames for the exact same tuple:

```text
SURFACE + VARIANT + ROUTE + STATE + VIEWPORT + THEME
```

## Required registry fields

| Field | Meaning |
|---|---|
| SURFACE | WorkOS surface, e.g. Configurator |
| VARIANT | Product / capability variant, e.g. LETTERS |
| ROUTE | Runtime route |
| STATE | Exact UI state: edit, validation, review, composition, etc. |
| VIEWPORT | 1440 / 1280 / 768 or another explicitly validated size |
| THEME | light / dark / system where material |
| FIGMA_FILE_KEY | Live verified Figma file key |
| FIGMA_NODE_ID | Live verified exact node id |
| FIGMA_FRAME_NAME | Frame name visible in Figma |
| STATUS | One status from the vocabulary above |
| SOURCE_RUNTIME_COMMIT | Commit used for the runtime import/evidence |
| SOURCE_TEMPLATE_VERSION | ProductTemplate version if applicable |
| SOURCE_FORM_SCHEMA_VERSION | FormSchema/version identity if applicable |
| LAST_SYNC_DATE | Date of last proven synchronization |
| OWNER_STATUS | NOT_REVIEWED / DIRECTION_ACCEPTED / OWNER_ACCEPTED |
| SUPERSEDES | Previous node/state identity if applicable |
| SUPERSEDED_BY | Replacement node/state identity if applicable |
| NOTES | Short explanation only; no Product Truth duplication |

## Authority law

```text
FUNCTIONAL_BUSINESS_AUTHORITY = DOMAIN + CODE + VERIFIED_RUNTIME
VISUAL_AUTHORITY              = OWNER_ACCEPTED_FIGMA_FOR_EXACT_REGISTERED_STATE
CURRENT_VALID_IMPLEMENTATION  = VERIFIED_RUNTIME_AFTER_ACCEPTED_DESIGN_DELTA
CURRENT_VALID_FIGMA_MIRROR    = REGISTERED_FRAME_AFTER_RUNTIME_PARITY
```

If Figma and runtime differ:

- `RUNTIME_IMPORT` or `DESIGN_CANDIDATE` does not override runtime;
- `OWNER_ACCEPTED_DESIGN` authorizes the presentation delta for that exact state only;
- any semantic/Product Truth delta returns to Owner/domain review;
- after Cursor implements the accepted design and runtime parity is proven, the frame may become `CURRENT_VALID_MIRROR`.

## Roundtrip rule

For an existing accepted surface:

```text
PRODUCT / DOMAIN CONTRACT
→ CURSOR FUNCTIONAL IMPLEMENTATION
→ RUNTIME + TESTS + BROWSER EVIDENCE
→ CHATGPT INDEPENDENT REVIEW
→ RUNTIME / SOURCE HTML → FIGMA
→ FIGMA POLISH
→ OWNER / CHATGPT DESIGN REVIEW
→ OWNER_ACCEPTED_DESIGN
→ CURSOR DESIGN-DELTA IMPLEMENTATION
→ RUNTIME PARITY
→ CURRENT_VALID_MIRROR
```

For a new major surface whose layout/floorplan is not yet decided:

```text
RESEARCH
→ FIGMA DIRECTION CANDIDATE
→ OWNER DIRECTION ACCEPTANCE
→ CURSOR IMPLEMENTATION
→ RUNTIME PROOF
→ PARITY REVIEW
→ REGISTRY UPDATE
```

## What Figma may polish without Product Truth authority

- layout
- spacing
- typography
- visual hierarchy
- density
- grouping
- control presentation
- responsive composition
- accessibility presentation

Figma must not silently change fields, allowed values, requiredness, validation, readiness, formulas, pricing, permissions, lifecycle, Product Truth, or execution semantics.

## Design delta classification

Cursor must classify every material Figma → runtime difference as one of:

```text
PRESENTATION_ONLY
LAYOUT
SPACING
TYPOGRAPHY
CONTROL_PRESENTATION
RESPONSIVE
ACCESSIBILITY

SEMANTIC_CHANGE
PRODUCT_TRUTH_CHANGE
NEW_FIELD
REMOVED_FIELD
VALIDATION_CHANGE
STATE_CHANGE
```

Only the presentation group is implementable under a UI-only design-delta scope. Semantic/Product Truth changes require a separate Owner/domain decision.

## Current registry policy

Do not backfill guessed historical node ids from memory. Existing Figma references stay governed by `docs/development/WORKOS_FIGMA_WORKFLOW.md` until live-reverified and entered here.

The next full Configurator registry population should happen after the current FC2 FACE + VOLUME/CANT functional slices are stable and the Source-HTML/runtime → Figma refresh is performed.

## Registry entries

_No exact `CURRENT_VALID_MIRROR` rows are added by this policy-only change. Populate rows only from live Figma verification + exact runtime evidence._
