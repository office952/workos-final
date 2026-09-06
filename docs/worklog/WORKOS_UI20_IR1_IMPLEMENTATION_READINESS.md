# WORKOS UI20-IR1 — Implementation Readiness (Figma → React)

```text
GO                    = OWNER_DELEGATED_UI20_IR1
STATUS                = OWNER_ACCEPTED
BRANCH                = docs/ui20-ir1-implementation-readiness
BASE_HEAD             = 7c79ae2f3fe5701a177a9859fca3b67cd5f8706f
IR1_ORIGINAL_HEAD     = c8c049cab497451664c3c17ffe4e4632e14eaedc
MAIN_EXACT_HEAD_CI    = SUCCESS (34002619120 + 34002300217)
IR1_ORIGINAL_HEAD_CI  = SUCCESS (34003381479)
CONTRACT              = docs/architecture/WORKOS_UI20_IMPLEMENTATION_READINESS_CONTRACT.md
UI20_IMPLEMENTATION   = NOT_YET_EXECUTED
REACT                 = NOT_AUTHORIZED
MASTER_POLISH         = NOT_STARTED
FIGMA_WRITE           = NO
```

## Polish clarification (Owner-delegate, same session)

User asked: „cand facem polish?”

```text
PER_WAVE_POLISH = REQUIRED_FOR_INTEGRATION
MASTER_POLISH = AFTER_UI20_RUNTIME_COHERENT (final UI20 chapter)
MASTER_POLISH_NOW = NO
```

IR1 does not start Master Polish.

## Identity

```text
REPO = office952/workos-final
ORIGIN_MAIN = 7c79ae2f3fe5701a177a9859fca3b67cd5f8706f
PARENT = c498ad58cf046003e9d540f77a003fb5c9351534
```

## Doc coherence fix

Living flags updated:

```text
UI20_CURRENT_VISUAL_DIRECTION = OWNER_ACCEPTED
```

in Direction Canon living block + Roadmap living/checkpoint blocks.  
Historical dated snapshots left unchanged.  
`DIRECTION_CONFLICT_AFTER = NO` (living).

## Runtime audit summary

| Item | Fact |
|---|---|
| Shell | `StableSidebar` V3 (not UI20 top) |
| `/` | Lucrări (`JobsOverviewPage`) |
| Acasă | not_implemented, no route |
| Routes | ~30 in `App.tsx` |
| Capabilities | filter unused; all `requiredCapability=null` |
| Theme | light/dark/system |

Full inventory: contract §1 + explore audit of `App.tsx` / `AppShell.tsx` / `navigationRegistry.ts` / `visibleNavigation.ts`.

## Old → new (representative)

| Route | Current | UI20 target | Change type | Business truth |
|---|---|---|---|---|
| `/` | Lucrări overview | Acasă hub (RW6 atomic only) | ROUTE_MIGRATION | NO |
| `/jobs` | Lucrări | Lucrări traveler list | FLOORPLAN+VISUAL | NO |
| `/requests*` | Cereri V3 | Resolution Field | FLOORPLAN+VISUAL | NO |
| `/products/:code` | Config V3 | Composition + Lens | FLOORPLAN+VISUAL | NO |
| `/quotes*` | Quote inspect | Commercial Sheet | FLOORPLAN+VISUAL | NO |
| `/jobs/*` | Job detail | Production Traveler | FLOORPLAN+VISUAL | NO |
| `/atelier` | Atelier | Dispatch Floor | FLOORPLAN+VISUAL | NO |
| `/execution*` | Execution | Workstation | FLOORPLAN+VISUAL | NO |
| `/clients*` | Client hub V3 | Relationship workspace | FLOORPLAN+VISUAL | NO |
| `/admin/resources` | Resources admin | Evidence ledger | VISUAL+DENSITY | NO |
| `/admin*` | Admin hub + locals | Quiet control + local nav | SHELL+NAV | NO |
| Shell | StableSidebar | Candidate A top | SHELL_ONLY first | NO |

Complete route list lives in contract + `App.tsx`.

## Figma → route mapping classes

| Class | Examples |
|---|---|
| A DIRECT NORTH STAR | Cerere, Config, Ofertă, Lucrare, Atelier, Exec, Client Hub, Resources, Admin |
| B DERIVED | other admin locals from Quiet Control + domain truth |
| C V3 RETAINED TEMP | page bodies during RW1 shell-only |
| D OUT OF SCOPE | Analyzer, new templates |

## Decisions accepted (IR1A)

```text
SHELL_MIGRATION_STRATEGY = STRATEGY_A_GLOBAL_SHELL_FIRST
FIRST_REACT_WAVE_ID = UI20_RW1_QUIET_TOP_SHELL
ACASA_ROUTE_CONTRACT = OWNER_DELEGATE_ACCEPTED
  RW1–RW5: `/` = Lucrări; `/jobs` = Lucrări; Acasă hidden; `/home` = DO_NOT_CREATE
  RW6: `/` = Acasă; `/jobs` = Lucrări; atomic cutover
CAPABILITY_GAP = ACCEPTED_CARRY_NONBLOCKING_FOR_RW1
RW1_CAPABILITY_POLICY = PRESERVE_EXISTING_VISIBILITY_TRUTH
OBJECT_CONTEXT_RW1_BOUNDARY = PURE PRESENTATIONAL PRIMITIVE (no invented lineage)
```

## Gaps

```text
CAPABILITY_PROJECTION_GAP =
  - capabilities not passed from AppShell
  - registry capabilities all null
  - org module capability projection completeness unproven
  - ACCEPTED_CARRY; blocks capability-aware finalization + final UI20 runtime acceptance
  - does NOT block RW1 presentation shell migration

DATA_PROJECTION_GAP =
  - ObjectContextStrip may need thin lineage DTO if pages assemble ad hoc
  - must not be silently solved in React
```

## Wave plan

RW1 shell → RW2 Cerere/Config → RW3 Comercial → RW4 Lucrare/Atelier/Exec → RW5 Resources/Admin → RW6 Acasă/root → Master Polish after coherent runtime.

## Evidence

`docs/worklog/ui20-ir1/evidence/` — route inventory manifest only (no real customer data).

## ChatGPT independent IR1 review (IR1A)

```text
CHATGPT_IR1_INDEPENDENT_REVIEW = COMPLETE
CHATGPT_VERDICT                 = ACCEPTED_WITH_REQUIRED_CONTRACT_AMENDMENTS
IR1                             = OWNER_ACCEPTED
UI20_IMPLEMENTATION_READINESS   = OWNER_ACCEPTED
SHELL_STRATEGY                  = A_GLOBAL_SHELL_FIRST
ACASA_ROUTE_CONTRACT            = OWNER_DELEGATE_ACCEPTED
CAPABILITY_GAP                  = ACCEPTED_CARRY_NONBLOCKING_FOR_RW1
FIRST_REACT_WAVE                = UI20_RW1_QUIET_TOP_SHELL
FIRST_REACT_WAVE_DECISION       = APPROVED_AS_NEXT_WAVE
RW1_EXECUTION                   = NOT_STARTED
PER_WAVE_POLISH                 = REQUIRED
MASTER_POLISH                   = NOT_STARTED
DIRECTION_CONFLICT              = NO
```

Amendments applied in this acceptance commit: Acasă final contract, capability carry policy, ObjectContext RW1 boundary, first-wave decision, polish lock, living roadmap next = RW1.

## STOP

```text
NEXT_STEP = CHATGPT_VERIFY_IR1_ACCEPTED_ON_MAIN_AND_ISSUE_UI20_RW1_EXECUTION_GO
```
