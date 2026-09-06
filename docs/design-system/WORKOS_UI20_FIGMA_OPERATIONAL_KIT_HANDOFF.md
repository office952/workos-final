# WorkOS UI20 — GitHub → Figma Operational Kit handoff

```text
PACKAGE              = WORKOS_UI20_OPERATIONAL_KIT_HANDOFF
STATUS               = PREPARED_LOCAL_IN_REVIEW
OWNER_ACCEPTED       = NO
FIGMA_WRITE          = NO
PRODUCT_CODE_WRITE   = NO
RW2_DIRECTION        = AUTHORIZED
RW2_IMPLEMENTATION   = HOLD_FOR_UI20_KIT1_HANDOFF_REVIEW
NEXT                 = CHATGPT_INDEPENDENT_KIT1_REVIEW_THEN_BUILD_UI20_OPERATIONAL_KIT_IN_FIGMA
```

This is a **source-grounded handoff**, not a published design system and not a React wave.

Detail lives in `docs/design-system/ui20-figma-kit/`.

## North star the kit must obey

QUIET SHELL + STRONG WORK SURFACES + OBJECT CONTINUITY + CONTEXTUAL DENSITY + TRUTHFUL STATE / CONSEQUENCE.

Density is semantic, not global.

## Identity at preparation

```text
REPO                 = office952/workos-final
BRANCH               = docs/ui20-kit1-figma-handoff
ORIGIN_MAIN          = 8c168dc6417af040eff0f79f033e287fbd9b807c
EXPECTED_PARENT      = 61f7721001603bde03414b3e9e3d680f4a78310d
RW1                  = INTEGRATED_ON_MAIN
CURRENT_RUNTIME_SHELL = CANDIDATE_A_QUIET_TOP_SHELL
GLOBAL_L1_SIDEBAR    = NO
FIGMA_FILE           = 0XP0yGa1siWQdTTL7ou8xz
```

Existing local branch `design/ui20-rw2-cerere-config-composition` was at the same SHA with only an untracked RW2 GO file. KIT1 does not implement RW2 and does not commit that file.

## What ChatGPT should do next

1. Independent KIT1 review (what is actually reusable).
2. Build the UI20 Operational Kit in Figma using `ui20-figma-kit/12-figma-build-brief.md`.
3. Only then release RW2 implementation against the kit.

## Quality gates (local package)

```text
CURRENT_MAIN_VERIFIED                 = YES
CURRENT_TOKENS_EXTRACTED              = YES
CURRENT_COMPONENTS_CLASSIFIED         = YES
PAGE_PERSONALITIES_MAPPED             = YES
FIGMA_ACCEPTED_NODES_MAPPED           = YES
FIGMA_REACT_MAPPING_COMPLETE          = YES
SEMANTIC_PRIMITIVES_REVIEWED          = YES
STATE_TAXONOMY_COMPLETE               = YES
DENSITY_CONTRACT_COMPLETE             = YES
RESPONSIVE_CONTRACT_COMPLETE          = YES
A11Y_CONTRACT_COMPLETE                = YES
LIGHT_DARK_SYSTEM_MAPPED              = YES
OLD_APP_CARRY_FORWARD_EXPLICIT        = YES
SMART_MODULARITY_GUARD                = PASS
NO_CLIENT_FORK                        = YES
TRACEABILITY_GAPS_EXPLICIT            = YES
FIGMA_BUILD_BRIEF_READY               = YES
FIGMA_WRITE                           = NO
PRODUCT_CODE_WRITE                    = NO
```

## Advisories (do not expand scope)

- Living roadmap still records `ORIGIN_MAIN = 7c79ae2…` and `UI20_RW2 = NOT_STARTED_NOT_AUTHORIZED`. Actual main is `8c168dc…`. RW2 direction is authorized by Owner-delegate and **held** for this handoff. Canons were not rewritten.
- IR1 inventory still describes StableSidebar as current shell — stale after RW1. Foundation Canon is current for implemented shell.
- Figma MCP listed only page `00 — North Star`; accepted node IDs on other pages still resolve.
- `get_variable_defs` on Visual DNA `233:69` returned empty. Variables are a future proposal, not extracted from Figma.
- Source Serif 4 is accepted for Ofertă and **not loaded** in runtime.
- `--action-primary` remains V3 blue; `--ui20-shell-accent` is the only deep-green identity token.
- `FormRenderer` has focusable controls under `aria-hidden`.
- ObjectContextStrip is mounted empty.
- Figma chrome still draws Acasă + Search; runtime correctly hides both.

## Traceability gaps (do not fabricate)

- No published Figma variables on DNA node
- No runtime Source Serif
- No populated ObjectContext
- No Resolution Field / Composition-Lens implementation or e2e
- `--text` / `--canvas` referenced but undefined
- Capability-aware nav projection incomplete (IR1 accepted carry)
- Old app source not re-read this GO (audit only)
