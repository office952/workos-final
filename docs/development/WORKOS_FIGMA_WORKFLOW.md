# WorkOS Figma workflow

```text
ROLE                       = AUTHORITY
OWNS                       = HOW_FIGMA_IS_USED_AND_WHICH_REFS_ARE_RECORDED
DOES_NOT_OWN               = PRODUCT_TRUTH, DOMAIN, PRICING, EXECUTION, LIVE_GITHUB_STATE
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = YES
LAST_RECONCILIATION_RULE   = RECONCILE_WHEN_A_CANON_CHANGES_ITS_FIGMA_FILE_OR_SECTION
```

## Law

```text
FIGMA                          = VISUAL / INTERACTION AUTHORITY WHERE EXPLICITLY RECORDED
FIGMA                         != PRODUCT_TRUTH
FIGMA                         != DOMAIN_AUTHORITY
FIGMA                         != PRICING_AUTHORITY
FIGMA                         != EXECUTION_AUTHORITY
FIGMA_WRITE                    = REQUIRES_EXPLICIT_OWNER_GO
```

A Figma frame may freeze chrome, spacing, and interaction grammar only when a current canon or frozen framework records that file and node. It must not invent fields, options, readiness, materials, or prices.

## Classification

| Class | Meaning |
|---|---|
| VISUAL_AUTHORITY | Current recorded visual / interaction grammar for a named surface |
| INTERACTION_REFERENCE_ONLY | Motion or click grammar. Not static visual authority. Not Product Truth |
| HISTORICAL | Accepted earlier, superseded for living direction |
| ARCHIVE | Kept as evidence. Do not implement from it |

## Current recorded references

Verified against the repository on this slice. Live MCP reads are recorded separately.

### Configurator V1 — VISUAL_AUTHORITY

Repository: `docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md`

```text
FIGMA_FILE                     = hu6gJrm0KM2NPkaIpQ8Kfo
FIGMA_SECTION                  = 219:3
URL                            = https://www.figma.com/design/hu6gJrm0KM2NPkaIpQ8Kfo?node-id=219-3
LIVE_MCP_READ_2026_09_15       = YES
LIVE_SECTION_NAME              = FINAL CONFIGURATOR — OWNER REVIEW CANDIDATE
```

Only section `219:3` is Configurator implementation visual authority. Archive `219:2` remains historical.

### Configurator Make file — INTERACTION_REFERENCE_ONLY

Repository: `docs/worklog/WORKOS_CONFIGURATOR_FINAL_FIGMA_V1_IMPLEMENTED_LOCAL_IN_REVIEW.md`

```text
MAKE_FILE                      = OqSF7nXn1SMjh6fQiua9HP
MAKE_NAME                      = App Builder
MAKE_ROLE                      = INTERACTION_REFERENCE_ONLY
LIVE_MCP_READ_THIS_RUN         = NOT_REVERIFIED
```

Figma MCP `get_metadata` does not support Make files. Do not copy Make synthetic data, COMUN / groups / logo, or hardcoded product values.

### UI20 E2E file — VISUAL_AUTHORITY for UI20 direction only

Repository: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` (`NEW_FIGMA_FILE_KEY`) and living roadmap `NEW_FIGMA`

```text
FIGMA_FILE                     = 0XP0yGa1siWQdTTL7ou8xz
URL                            = https://www.figma.com/design/0XP0yGa1siWQdTTL7ou8xz
LIVE_MCP_READ_2026_09_15       = YES
LIVE_TOP_LEVEL_PAGE            = 547:11 00 — WORKOS ZERO-BASE CANONICAL HANDOFF V1
```

This is UI20 visual direction, not Configurator Product Truth, and not a second roadmap.

### First HF / IA file — HISTORICAL

```text
FIGMA_FILE                     = 7elwvIscvMPDiEHrX4f6kQ
CLASS                          = HISTORICAL
CANON_POINTER                  = WORKOS_UI_UX_DIRECTION_CANON FIGMA_FILE_KEY
```

### V3 Clients / Cereri file — HISTORICAL

```text
FIGMA_FILE                     = 1ev5lg7m2Ze1h3Vqmax8ho
CLASS                          = HISTORICAL
```

Accepted V3 Clients / Client Hub / Cereri geometry remains historical evidence. Living presentation direction is UI20.

## When to use Figma MCP

Use a **read-only** Figma MCP call when:

- a current canon names a file/section and the session must confirm that node still exists
- visual comparison against frozen Configurator chrome is material
- Owner visual review needs the live frame, not a remembered id

Figma read is optional when the work does not touch recorded visual authority.

Owner visual review is required when a change claims visual acceptance or would reopen a frozen framework.

Product / domain truth overrides mockup content whenever the mockup shows fields, modules, groups, prices, or readiness that current ProductTemplates do not own.

`FIGMA_WRITE` requires an explicit Owner GO. This slice performed no write, no publish, and no new file.

## Code Connect

```text
CODE_CONNECT_STATUS            = NOT_VERIFIED
```

Do not claim Code Connect mappings exist in this repository.

## MCP verification this run

```text
FIGMA_MCP_LIVE_VERIFICATION    = VERIFIED_CONNECTED
FIGMA_WRITE                    = NO
WHOAMI                         = AUTHENTICATED_HANDSHAKE_ONLY
IDENTITIES                     = NOT_RECORDED_HERE
```
