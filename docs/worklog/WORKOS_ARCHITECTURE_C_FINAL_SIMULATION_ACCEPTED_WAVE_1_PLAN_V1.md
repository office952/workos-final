# WorkOS Architecture C final simulation — Owner accept and Wave 1 plan

```text
GO                         = OWNER_ACCEPT_ARCHITECTURE_C_FINAL_SIMULATION_AND_AUTHORIZE_WAVE_1_PLANNING
DATE                       = 2026-08-26
BRANCH                     = feat/hub-media-organization-configuration-clean-pilot-v1
HEAD                       = f06d7ecc56cc0bc285d974d2dd360fcc6077eaa6
ORIGIN_MAIN                = e0a5e53a335334433bb6574966687b6b3c1de1a6
CURRENT_MILESTONE          = HUB_MEDIA_CLEAN_PILOT
FIRST_HF_LOT_UI            = OWNER_ACCEPTED
OWNER_ACCEPTED_SIMULATION  = YES
OWNER_DECISION             = ACCEPTED_WITH_ADVISORIES
ARCHITECTURE_C_DIRECTION   = OWNER_ACCEPTED
ARCHITECTURE_C_FINAL_SIMULATION = OWNER_ACCEPTED_WITH_ADVISORIES
ARCHITECTURE_C_UI_WAVE_1_PLANNING = AUTHORIZED
ARCHITECTURE_C_UI_WAVE_1_IMPLEMENTATION = NOT_STARTED
ARCHITECTURE_C_UI_IMPLEMENTATION_AUTHORIZED = NO
FIGMA_LIBRARY_PUBLISHED    = NO
FIGMA_WRITE                = NO
PRODUCT_IMPLEMENTATION     = NOT_STARTED
FIRST_REAL_LETTERS_JOB     = NOT_STARTED
HUB_SEQUENCE_NEXT_STEP     = OWNER_HUB_MEDIA_ORGANIZATION_CONFIGURATION_REVIEW
SESSION_CONTINUITY         = SAME_CHAT_SAME_WORKTREE
PUSH                       = NO
```

## Authority

Owner accepted the Architecture C final simulation with advisories and authorized **planning** of UI Wave 1. The Figma library stays unpublished. Implementation does not start until a separate Owner GO.

This record does not reopen first-HF Waves 1–5. Those remain `OWNER_ACCEPTED`. It does not authorize HUB Cloud writes, Confirmă tarif on live HUB, or the first real LETTERS job. It does not change `NEXT_STEP` inside `HUB_MEDIA_CLEAN_PILOT`.

```text
ROADMAP_READ        = YES
UI_UX_CANON_READ    = YES
V21A_CONTRACT_READ  = YES
SIMULATION_PACKS    = CITED_NOT_OVERWRITTEN
DIRECTION_CONFLICT  = NO
```

## What was accepted

Architecture C populated simulation on Figma page `09 — Final Simulation` (`Q8zfu4MZhsxLjJMGLHUHZh`), after the targeted correction pass.

Route simulated: `/admin/resources`. Floorplan: L1 Administrare, Admin L2 ≠ MasterSelector, detail with live-shaped tariff chrome, 768 drawers, SkipLink FocusVisible as a demo frame only.

Evidence (do not overwrite):

- `.tmp/workos-figma-architecture-c-final-simulation-review/`
- `.tmp/workos-figma-architecture-c-final-simulation-correction-review/`

Desktop zip copies exist for Owner review. They are not the repository source of truth and must not be overwritten by later work.

## Advisories consumed by the Wave 1 plan

1. IdentityMenu Open on the accepted 59px Figma instance overflows. Product Cont must be ≥44px and keep the open menu in viewport. The Figma overflow must not ship.
2. At 768, Catalog lives in Meniu overflow, not as a persistent L1 chip. Desktop L1 still shows Catalog.
3. Figma amounts such as `4,25 EUR/m` are synthetic demonstration data. Runtime projects live Resources/Cost evidence only.
4. SkipLink is **Sari la conținut**, visible only when focused. The Accessibility frame is a focus demo, not a permanently visible row.
5. Brand is **WorkOS Final**. `Organizație` is not a brand or placeholder company. Live chrome uses the session organization display name; **Atelier Demo** is only demonstration when no live org name exists.
6. Library remains unpublished. Implementation, when later authorized, follows this plan, the V2.1a worked example, and CSS tokens — not a published Figma library.
7. Do not use real HUB clients, people, or inventory as UI chrome.
8. Product interactive targets on the Wave 1 route must meet 44×44. The Figma Cont glyph residual is not a product license.

## What this GO produced

- Plan: `docs/plans/WORKOS_ARCHITECTURE_C_UI_IMPLEMENTATION_WAVE_1_PLAN.md`
- Roadmap: Architecture C track recorded as planned, not authorized for code
- Direction canon: Architecture C accepted as the next UI lot; first-lot Industrial Clarity record kept
- Foundation canon: current runtime stays first-lot law until an implementation GO

## What this GO did not do

- No React, CSS, route, or test changes
- No Figma publish, no new Figma file, no page 09 rewrite
- No Cloud / HUB write
- No first real LETTERS job
- No second implementation-readiness contract file
- No commit unless the Owner asks separately

## Next Owner gates

```text
1. OWNER_HUB_MEDIA_ORGANIZATION_CONFIGURATION_REVIEW   = still the Cloud sequence next step
2. ARCHITECTURE_C_UI_WAVE_1_IMPLEMENTATION             = requires a separate GO
3. FIGMA_LIBRARY_PUBLISH                               = not authorized
```
