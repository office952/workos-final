# WORKOS UI20-KIT1 — GitHub → Figma operational kit handoff

```text
STATUS                            = PREPARED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                    = NO
GO                                = OWNER_DELEGATED_UI20_KIT1
REPO                              = office952/workos-final
BRANCH                            = docs/ui20-kit1-figma-handoff
BASE_HEAD                         = 8c168dc6417af040eff0f79f033e287fbd9b807c
EXPECTED_ORIGIN_MAIN              = 8c168dc6417af040eff0f79f033e287fbd9b807c
EXPECTED_PARENT                   = 61f7721001603bde03414b3e9e3d680f4a78310d
ORIGIN_MAIN_VERIFIED              = YES
DIRTY_AT_START                    = UNTRACKED docs/worklog/ui20-rw2/ ONLY
RW2_BRANCH_AT_START               = design/ui20-rw2-cerere-config-composition @ 8c168dc (no implementation commits)
RW1                               = INTEGRATED_ON_MAIN
RW2_DIRECTION                     = AUTHORIZED
RW2_IMPLEMENTATION                = HOLD_FOR_UI20_KIT1_HANDOFF_REVIEW
CURRENT_RUNTIME_SHELL             = CANDIDATE_A_QUIET_TOP_SHELL
GLOBAL_L1_SIDEBAR                 = NO
FIGMA_FILE                        = 0XP0yGa1siWQdTTL7ou8xz
FIGMA_READ                        = YES
FIGMA_WRITE                       = NO
OLD_APP_REFERENCE                 = docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md
OLD_APP_SOURCE_READ               = NO_THIS_GO
PRODUCT_CODE_WRITE                = NO
CSS_WRITE                         = NO
REACT_WRITE                       = NO
BACKEND_WRITE                     = NO
CLOUD_WRITE                       = NO
REAL_DATA                         = NO
TEST_WRITE                        = NO
PR_CREATE                         = NO
MAIN_MERGE                        = NO
```

## Identity

`git fetch origin` then exact SHA match on `origin/main` and parent `61f7721…`.  
Created `docs/ui20-kit1-figma-handoff` from that SHA. No rebase, no merge, no implementation branch.

## Sources read

- `AGENTS.md`
- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `docs/architecture/WORKOS_UI20_IMPLEMENTATION_READINESS_CONTRACT.md`
- `docs/worklog/WORKOS_UI20_FINAL_VISUAL_OWNER_DELEGATE_ACCEPTANCE.md`
- `docs/worklog/WORKOS_UI20_RW1_QUIET_TOP_SHELL.md`
- `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md` (carry-forward sections)
- SIG1 / SIG1A / SIG1B / DL1 / C1 / VIS1 / VIS1A / IAF1 / IAF1A via existing worklogs + live Figma nodes
- Runtime: `App.tsx`, `AppShell.tsx`, `index.css`, `index.html`, `navigation/**`, `ui/**`, `theme/**`, `FormRenderer.tsx`, page families listed in kit `02`/`04`
- Tests: shell/nav/theme/form/object-context unit + `e2e/v3-navigation-shell.spec.ts`

Canons were **not** rewritten. Stale roadmap/IR1 flags recorded as advisories.

## Runtime audit (summary)

- Quiet top shell is live. StableSidebar is unused leftover.
- L1: Cereri · Comercial · Lucrări · Atelier · Mai multe · Cont. Acasă hidden. Search not rendered.
- Tokens: 47 root custom properties + 5 shell locals; `--text`/`--canvas` undefined references.
- Identity green is `--ui20-shell-accent` only. `--action-primary` is V3 blue.
- Fonts: IBM Plex Sans + Mono via Google Fonts. Source Serif 4 absent.
- ObjectContextStrip implemented, mounted empty.
- FormRenderer a11y gap (chips under aria-hidden).
- Theme: system/light/dark via `data-theme`.

## Figma read

Inspected by ID (write = no): `229:66`, `224:96`, `224:115`, `225:66`, `225:90`, `222:66`, `233:69`, `239:69`, `234:103`, `235:66`, `240:66`, `242:66`, `242:941`.  
Accepted VIS1A family nodes recorded from Owner visual acceptance (`240:115`, `240:160`, `240:198`, `241:*`).  
`get_variable_defs(233:69)` = `{}`.

## Old-app reference use

Accepted old/new audit only. No `workos-vscode` source checkout this GO.

## Token / component / primitive decisions

See kit `01`–`03`. Kit is **not** a generic design system. Page personality stays page-specific.

## Traceability gaps

Listed in the index handoff. None fabricated.

## Smart modularity

`NO_CLIENT_CODE_FORK = YES`. LETTERS role tiles are specimen, not kit anatomy.

## Files produced

- `docs/design-system/WORKOS_UI20_FIGMA_OPERATIONAL_KIT_HANDOFF.md`
- `docs/design-system/ui20-figma-kit/*` (01–12, MANIFEST, mapping.json)
- this worklog

No new screenshot pack. Reused RW1 / VIS1 references.

## Independent Cursor opinion

The handoff is honest enough for ChatGPT to build a **narrow operational kit** (foundations, controls, nav, object context, state/line grammar) without guessing hex from memory. It is **not** honest to treat Figma Config LETTERS tiles, Search, or Acasă as implemented runtime. RW2 should wait for the kit so Cerere/Config do not invent a second visual dialect. I would not remap `--action-primary` in the kit publish step.

Do not self-accept.
