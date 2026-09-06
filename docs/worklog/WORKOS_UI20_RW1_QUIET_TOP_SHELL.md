# WORKOS UI20-RW1 — Quiet Top Shell

```text
GO                         = OWNER_DELEGATED_UI20_RW1
BRANCH                     = design/ui20-rw1-quiet-top-shell
BASE_HEAD                  = 4e2a8363ce249b65148bb2950a3d4ec24364d791
STATUS                     = OWNER_ACCEPTED_INTEGRATION_CANDIDATE
REACT                      = YES_RW1_ONLY
CSS                        = YES_RW1_ONLY
FIGMA_WRITE                = NO
MAIN_MERGE                 = AUTHORIZED_AFTER_CANON_RECONCILIATION
PR                         = NO
PER_WAVE_POLISH            = REQUIRED
MASTER_POLISH              = NO
OWNER_ACCEPTED_RUNTIME     = YES
CHATGPT_RW1A_REVIEW        = COMPLETE
RW1_RUNTIME                = RUNTIME_VERIFIED
RW1A                       = ACCEPTED
CI_EXACT_ACCEPTED_HEAD     = 23ad126209163cfee2c8cba44f2889a41ae4579a
CI_RUN                     = 34017485584 SUCCESS
RW1B                       = NOT_REQUIRED
INTEGRATION                = AUTHORIZED_AFTER_CANON_RECONCILIATION
```

## Closed upstream

```text
CP_MIG1                    = INTEGRATED_ON_MAIN
UI20_IR1                   = OWNER_ACCEPTED
UI20_IMPLEMENTATION_READINESS = OWNER_ACCEPTED
FINAL_IA / FINAL_VISUAL    = OWNER_ACCEPTED
SHELL_MIGRATION_STRATEGY   = STRATEGY_A_GLOBAL_SHELL_FIRST
```

## Implementation shape

- Candidate A quiet top shell replaces global StableSidebar presentation on normal routes
- Presentation model: `apps/web/src/navigation/ui20NavigationPresentation.ts`
- Shell: `GlobalShellTop`, `GlobalNavigation`, `ObjectContextStrip` (empty presentational mount)
- L1: Cereri · Comercial ▾ · Lucrări · Atelier · Mai multe ▾ · Cont ▾
- Acasă hidden; `/` remains Lucrări; `/home` not created
- Comercial L2: Clienți · Oferte · Catalog (Cereri not duplicated)
- Mai multe: Resurse + Oameni from existing visibility truth
- Cont → Administrare → `/admin`
- Operator reduced chrome on `/atelier` + `/execution/*`
- Mobile nested Meniu for Comercial / Mai multe
- Quiet Cont + Meniu triggers (no strong pill chrome)
- RW1A: brand accessible name `WorkOS`; Escape focus restore; nested mobile focus; scoped `--ui20-shell-accent`

## Polish passes executed

```text
PASS_1_1440        = DONE
PASS_2_1280        = DONE
PASS_3_768         = DONE
PASS_4_LIGHT_DARK  = DONE
PASS_5_KEYBOARD    = UNIT_COVERED
PASS_6_LONG_COPY   = PARTIAL (identity wrap styles retained)
PASS_7_OVERFLOW    = SPOT_CHECKED
PASS_8_FIGMA_READ  = DONE (224:96 / 224:115 / 226:66)
```

## Evidence

See `docs/worklog/ui20-rw1/evidence/MANIFEST.md`.

## Intentional differences

```text
ACASA_HIDDEN_UNTIL_RW6
SEARCH_OMITTED_UNTIL_FUNCTIONAL
OBJECT_CONTEXT_ROUTE_POPULATION_DEFERRED
FULL_ADMIN_LOCAL_NAV_FLOORPLAN_DEFERRED_RW5
CAPABILITY_AWARE_VISIBILITY_DEFERRED
LEGACY_PAGE_BODIES_TEMPORARILY_RETAINED
```

## Validation (local)

```text
WEB_UNIT_TESTS             = 239/239 PASS
MONOREPO_LINT              = PASS (preexisting warnings only)
MONOREPO_TYPECHECK         = PASS
MONOREPO_TEST              = PASS (web 239 + api 302)
MONOREPO_BUILD             = PASS
E2E_FULL                   = PASS (110 passed / 5 skipped / isolated ports)
BRANCH_CI                  = 34017485584 SUCCESS on 23ad126
```

## RW1A targeted closure

```text
GO                         = OWNER_DELEGATED_UI20_RW1A
STATUS                     = ACCEPTED
BRAND_ACCESSIBLE_NAME      = WorkOS
DESKTOP_POPOVER_ESCAPE_FOCUS = RESTORES_TRIGGER
MOBILE_NESTED_INITIAL_FOCUS = DETERMINISTIC
SHELL_ACCENT               = --ui20-shell-accent (#1f332e / #8fb5a4 dark)
GLOBAL_ACTION_PRIMARY      = UNCHANGED_V3_BLUE
TERRACOTTA_NAV_ACCENT      = NO
MAIN_MERGE                 = AUTHORIZED_AFTER_CANON_RECONCILIATION
```

See `docs/worklog/ui20-rw1/CHATGPT_RW1A_EXECUTION_GO.txt` and `docs/worklog/ui20-rw1/CHATGPT_RW1_INTEGRATION_GO.txt`.


## Permissions respected

```text
BACKEND_WRITE = NO
CLOUD_WRITE = NO
REAL_DATA = NO
FIGMA_WRITE = NO
MAIN_FF = PENDING_PHASE_A_DOC_CI
```
