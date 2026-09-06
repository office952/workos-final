# WorkOS UI20 — Implementation Readiness Contract (Figma → React)

```text
STATUS                            = OWNER_ACCEPTED
UI20_IMPLEMENTATION_READINESS     = OWNER_ACCEPTED
UI20_IR1                          = OWNER_ACCEPTED
AUTHORITY                         = IMPLEMENTATION_CONTRACT_UNDER_ACCEPTED_UI20_CANON
NOT_A_NEW_UI_CANON                = YES
UI20_IMPLEMENTATION               = NOT_YET_EXECUTED
REACT                             = NOT_AUTHORIZED
ACCEPTANCE_AUTHORITY              = OWNER_DELEGATE_CHATGPT
BASE_HEAD                         = 7c79ae2f3fe5701a177a9859fca3b67cd5f8706f
FIGMA_FILE                        = 0XP0yGa1siWQdTTL7ou8xz
SHELL_MIGRATION_STRATEGY          = STRATEGY_A_GLOBAL_SHELL_FIRST
FIRST_REACT_WAVE_ID               = UI20_RW1_QUIET_TOP_SHELL
FIRST_REACT_WAVE                  = OWNER_DELEGATE_APPROVED_AS_NEXT_WAVE
RW1_EXECUTION_GO                  = NOT_THIS_GO
```

This contract answers how to implement accepted UI20 in the existing React product without losing business truth, route continuity, page personality, responsive/a11y behavior, or modularity. It does not authorize React execution.

Living UI direction: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.  
Implemented presentation baseline remains V3: `docs/architecture/UI_UX_FOUNDATION_CANON.md`.  
Evidence worklog: `docs/worklog/WORKOS_UI20_IR1_IMPLEMENTATION_READINESS.md`.

---

## 0. Closed decisions (do not reopen)

```text
FINAL_IA                          = OWNER_ACCEPTED
UI20_FINAL_IA                     = IA3_QUIET_DESTINATIONS_OBJECT_CONTINUITY
UI20_FINAL_SHELL                  = CANDIDATE_A_QUIET_TOP_SHELL
GLOBAL_L1_SIDEBAR                 = NO
FINAL_VISUAL_DIRECTION_UI20       = OWNER_ACCEPTED
UI20_FINAL_VISUAL_DIRECTION       = G_LIVING_FABRICATION_INSTRUMENT
VISUAL_SYNTHESIS                  = CALM_PRECISION + SELECTIVE_FABRICATION_ENERGY
VIS1 / VIS1A                      = ACCEPTED
VIS1B                             = NOT_REQUIRED
```

Polish policy (Owner-delegate clarification 2026-09-06; locked in IR1A):

```text
PER_WAVE_POLISH                   = REQUIRED_FOR_INTEGRATION
MASTER_POLISH                     = AFTER_UI20_RUNTIME_COHERENT
MASTER_POLISH_NOW                 = NO
MASTER_POLISH_STATUS              = NOT_STARTED
```

Each React wave must include: screenshot comparison; 1440 / 1280 / 768 where applicable; spacing / hierarchy correction; theme verification; focus / keyboard; overflow / clipping; long Romanian copy; relevant Figma reconciliation.

---

## 1. Current runtime inventory (source truth)

| Fact | Value |
|---|---|
| CURRENT_RUNTIME_SHELL | `AppShell` + `StableSidebar` (rail) + `MobileNavigationDrawer` + `IdentityMenu` |
| CURRENT_ROOT_ROUTE | `/` → `JobsOverviewPage` (Lucrări) |
| `/jobs` | same `JobsOverviewPage` |
| CURRENT_ROUTE_COUNT | ~30 App routes (see worklog matrix) |
| Acasă | registry `not_implemented`, `href: null` — **no route** |
| Capability filter | exists in `visibleNavigation.ts`; **AppShell never passes capabilities**; all registry `requiredCapability = null` |
| Theme | light / dark / system via `ThemeProvider` + `data-theme` |

No UI20 quiet-top shell exists in runtime. No “Mai multe” secondary chrome.

---

## 2. Shell migration contract

### Target shell

Candidate A quiet top:

- Global L1: Acasă · Cereri · Comercial · Lucrări · Atelier  
- Comercial L2: Clienți · Oferte · Catalog  
- Secondary: Mai multe → Resurse · Oameni · enabled optionals only  
- Cont → Administrare → local Admin nav  
- GLOBAL L1 SIDEBAR = NO  
- Local sidebar = Admin + true master-detail only  
- Reduced chrome on Atelier / Execution

### Accepted migration strategy

```text
SHELL_MIGRATION_STRATEGY = STRATEGY_A_GLOBAL_SHELL_FIRST
```

**STRATEGY A (accepted):** Replace global shell first; temporarily adapt legacy page bodies under the new shell until floorplan waves catch up.

Why not B (accumulate off-main until shell+family ready): delays operator-visible IA coherence and prolongs dual-system risk.  
Why not C: no superior source-grounded alternative found.

### No mixed-IA main rule

Forbidden on main:

- top shell on some normal routes + global sidebar on others  
- new global nav + duplicated old global categories  
- UI20 object-context + conflicting V3 breadcrumb ownership

Integration unit for Wave 1 must ship shell + nav ownership + object-context primitive together.

---

## 3. Acasă / root route contract (Owner-delegate final)

```text
ACASA_ROUTE_CONTRACT              = OWNER_DELEGATE_ACCEPTED
HOME_ROUTE_CREATED                = NO
/home                             = DO_NOT_CREATE

RW1 through RW5:
  `/`                             = LUCRĂRI = JobsOverviewPage
  `/jobs`                         = LUCRĂRI canonical list
  ACASĂ                           = NOT RENDERED WHILE NOT IMPLEMENTED
    (destination availability: hidden, no dead L1 link, no Coming Soon)

RW6 only (atomic cutover):
  implement real Acasă hub
  AND change `/`                  = ACASĂ
  while `/jobs`                   = LUCRĂRI

DEEP_LINKS_UNCHANGED =
  /jobs/* /requests/* /quotes/* /clients/* /products/* /execution/*

Unknown-route fallback may remain `/` and therefore changes semantic
destination only in the same RW6 atomic cutover.

RATIONALE =
  no transient route debt
  no duplicate Home canon
  no dead L1 link
  preserves current bookmarks during RW1–RW5
  final accepted IA reached atomically in RW6

TRANSITIONAL_L1_BEHAVIOR =
  Use destination availability. Acasă hidden until RW6.
  When RW6 lands, route + destination availability change together.
```

IR1 / IR1A do **not** mutate routes.

---

## 4. Navigation contracts

### Global L1 / L2 / secondary / account

| Contract | Law |
|---|---|
| GLOBAL_L1 | Acasă, Cereri, Comercial, Lucrări, Atelier |
| COMMERCIAL_L2 | Clienți, Oferte, Catalog under Comercial |
| SECONDARY_NAV | Mai multe → Resurse, Oameni, enabled optionals only |
| ACCOUNT_ORG | Cont → org switch / identity; Administrare separate |
| LOCAL_ADMIN_NAV | Cont → Administrare → local collection nav |
| GLOBAL_L1_SIDEBAR | NO |

### Capability / smart modularity

```text
NAVIGATION_CAPABILITY_CONTRACT =
  Reuse visibleNavigation capability filter.
  Map each UI20 destination to requiredCapability when org projection exposes it.
  Hide empty L1 / empty Mai multe / dead links.
  No Coming Soon furniture.
  No client-specific fork.

CAPABILITY_PROJECTION_GAP         = ACCEPTED_CARRY
CAPABILITY_GAP_DOES_NOT_BLOCK     = RW1_PRESENTATION_SHELL_MIGRATION
CAPABILITY_GAP_BLOCKS             =
  CAPABILITY_AWARE_NAV_FINALIZATION
  + FINAL_UI20_RUNTIME_ACCEPTANCE

Current facts (unchanged):
  1. AppShell does not pass organization capabilities into visibility context.
  2. Registry destinations all have requiredCapability = null.
  3. Org projection capability set for UI20 module toggles not confirmed as complete for:
     Machines / Stock / Execution / People / optional operational modules.

RW1_CAPABILITY_POLICY             = PRESERVE_EXISTING_VISIBILITY_TRUTH
FRONTEND_CAPABILITY_INVENTION     = FORBIDDEN

RW1 may reorganize destinations already considered visible by current supported logic.
RW1 may NOT invent module adoption, hardcode HUB MEDIA capability choices,
add frontend-only module flags, infer Stock/Machines/Execution/People adoption,
or create client-specific forks.

A later product/backend projection contract must resolve the gap before
capability-aware visibility is claimed complete.
```

Scenarios to prove in later capability-aware waves: advanced company; small company (Clients/Requests/Quotes/Jobs); Machines off; Stock off; Execution off; module enabled later.

---

## 5. Object context contract

Quiet semantic strip. UI formats; UI does not invent lineage/status/readiness.

```text
OBJECT_CONTEXT_IMPLEMENTATION     = PURE PRESENTATIONAL PRIMITIVE (RW1)
OBJECT_CONTEXT_RW1_BOUNDARY       =
  UI may receive explicit truthful props and format:
    object type / display id / display name / return target / explicit parent data
  UI may NOT derive:
    business lineage / readiness / commercial state / execution state / eligibility
  If a truthful projection is absent: DO NOT FABRICATE CONTENT.
  No DATA_PROJECTION_GAP may be silently solved in React.
  Route-level population occurs in the relevant page waves.
```

| Route family | Object type | Display sources (projection) | Return target | Gap |
|---|---|---|---|---|
| Cerere | Request | existing request detail projection | Cereri list | — |
| Config | Product configuration in request/product context | product + request projections | Cerere / Catalog | confirm selected-role context fields |
| Ofertă | Quote snapshot | quote inspection projection | Oferte | — |
| Lucrare | Job | job detail projection | Lucrări | — |
| Atelier | Worklist row → job/op | atelier list projection | — | — |
| Execution | Execution plan/op | execution workspace projection | Lucrare / Atelier | — |
| Client Hub | Client | client workspace projection | Clienți | — |

```text
DATA_PROJECTION_GAPS =
  - Explicit “parent lineage” fields for ObjectContextStrip may need a thin read DTO
    if current pages assemble lineage ad hoc in UI (audit per page wave).
  - Do not invent commercial/execution state in the strip.
```

---

## 6. Admin / operator contracts

**Admin:** Cont → Administrare → local nav. Keep domain hubs (Product System, Resources, People, Seller, Operational Services). No global Settings dump. Account context ≠ editable org configuration.

**Operator:** Identify/switch/exit remain Atelier/Execution-scoped. Reduced global chrome allowed. Preserve job/task identity, safe return, current operation, next action. Office pages must not gain operator-control noise.

---

## 7. Page personality → React boundaries

| Personality | Shared OK | Must stay page-specific |
|---|---|---|
| RESOLUTION FIELD | shell, ObjectContext, Notice/AttentionEdge, buttons | known/unresolved spatial relation |
| CONSTRUCTION COMPOSITION + LENS | shell, ObjectContext, focus | composition graph + Context Lens |
| COMMERCIAL SHEET | shell, ObjectContext | serif artifact sheet, frozen settle |
| PRODUCTION TRAVELER | shell, ObjectContext | past/current/next traveler layout |
| DISPATCH FLOOR | shell, ledger row, AttentionEdge | high-density row plane |
| WORKSTATION | minimal chrome | focus hierarchy + intentional open space |
| RELATIONSHIP WORKSPACE | shell, master-detail | chronology + related objects |
| EVIDENCE LEDGER | shell, tabular row | dense rate ledger |
| QUIET CONTROL | local admin nav | calm configuration surfaces |

```text
FORBIDDEN_ABSTRACTIONS =
  UniversalPage
  UniversalOperationalCard
  one Workspace that flattens all instruments
```

### Minimum shared component proposal

| Component | Semantic contract |
|---|---|
| GlobalShellTop | Candidate A quiet top + utilities |
| GlobalNavigation | L1/L2/Mai multe |
| ObjectContextStrip | quiet orientation only |
| IdentityMenu | Cont / org / theme |
| MobileNavigation | Candidate A mobile menu law |
| AttentionEdge | local exception energy |
| LedgerRow | Atelier/Resources dense rows |
| StatusNotice | blocked/current with cause |
| SemanticButton | primary/secondary/destructive |

Names are proposals; evidence may rename.

---

## 8. Token / theme / responsive / a11y / motion

### Token bridge (no CSS write now)

| Current runtime | UI20 semantic | Action |
|---|---|---|
| IBM/system stack via CSS | IBM Plex Sans/Mono (+ Serif Ofertă) | ADD fonts; REMAP type scale |
| `--surface-*`, `--text-*`, `--action-primary` | canvas/paper/ink/primary green | KEEP/REMAP after calibration |
| `--status-blocked` / danger | terracotta local blocked | REMAP carefully |
| `--sidebar-*` | shell width tokens | DEPRECATE_LATER after sidebar removal |
| gradients | forbidden | none |

Do not blindly freeze Figma hex. Calibrate in runtime against contrast/a11y.

### Theme

LIGHT / DARK / SYSTEM keep same hierarchy, state energy, focus, personality. No second dark brand. Explicit proofs: Ofertă frozen dark, Execution dark.

### Responsive

Preserve 1440 / 1280 / 768 as proof targets; map to CSS after audit. Critical: Config/Lucrare/Client Hub/Atelier 1280; flagship 768 set. Semantic transform, not shrink.

### Accessibility (required in waves, not Master Polish)

skip-link, landmarks, headings, keyboard order, visible focus, 44×44, no color-only meaning, named icons, reduced motion, 200% zoom, long Romanian copy — each mapped to component/test/evidence in wave plans.

### Motion

SELECT / RESOLVE / FREEZE / ENTER_WORK / ADVANCE|COMPLETE only. Short, one-shot, reduced-motion = end state. No animation framework unless proven necessary.

---

## 9. Business truth boundary

UI owns layout, hierarchy, interaction, presentation, ephemeral UI state, responsive transforms.  
UI does **not** own Product Truth, readiness, pricing, cost, eligibility, task/business transitions, snapshot truth, commercial totals, module capability truth.

```text
PRODUCT_SPECIFIC_NO_GO =
  Analyzer / DWG / new templates / ACM expansion / new pricing /
  inventing inventory|machine|people|execution requirements via UI20
```

---

## 10. Visual regression contract

Viewports: 1440 / 1280 / 768.  
Representatives: Cerere, Config, Ofertă, Lucrare, Atelier, Execution, Client Hub, Resources, Admin.  
Synthetic fixtures only; classify privacy; map expected Figma node IDs from VIS1/VIS1A.

---

## 11. Implementation wave plan

| Wave | Objective | Main safety |
|---|---|---|
| **RW1** | Candidate A shell + nav ownership + ObjectContextStrip + theme font bridge; legacy bodies adapted | No mixed sidebar/top on normal routes |
| **RW2** | Cerere Resolution Field + Config Composition/Lens | Preserve spine personality |
| **RW3** | Comercial: Client Hub + Ofertă sheet | Artifact + relationship |
| **RW4** | Lucrare traveler + Atelier dispatch + Execution workstation | Operator chrome rules |
| **RW5** | Resources ledger + Admin quiet control + secondary Mai multe | Density survival |
| **RW6** | Acasă hub + root ownership cutover (`/` → Acasă; `/jobs` stays Lucrări) | Deep-link safety; no `/home` |
| **POST** | Figma↔runtime reconciliation → Master Polish V1 | Cross-product only |

Each wave: PER_WAVE_POLISH required; screenshots; a11y; no business-truth invention.

### First React wave (approved as next; not executed here)

```text
FIRST_REACT_WAVE_ID               = UI20_RW1_QUIET_TOP_SHELL
FIRST_REACT_WAVE                  = OWNER_DELEGATE_APPROVED_AS_NEXT_WAVE
RW1_EXECUTION_GO                  = NOT_THIS_GO

FIRST_REACT_WAVE_SCOPE  =
  GlobalShellTop + GlobalNavigation (L1/L2/Mai multe/Cont)
  + ObjectContextStrip primitive (truthful props only)
  + MobileNavigation Candidate A
  + remove StableSidebar from normal office routes
  + adapt existing page bodies under new chrome
  + preserve Atelier/Execution reduced-chrome rules
  + font/token bridge start (Plex)
  + preserve existing visibility truth (no capability invention)
  + per-wave polish
  + tests: nav visibility, skip-link, 768 menu, no mixed IA

WHY_THIS_FIRST =
  IA and shell are the largest coherence risk; without them every page wave re-works chrome.

WHY_NOT_SMALLER =
  Shell without nav ownership / object context recreates mixed IA.

WHY_NOT_LARGER =
  Bundling Cerere/Config floorplans into RW1 expands blast radius before shell proves stable.
```

### Branch / integration strategy

```text
BRANCH_TOPOLOGY =
  docs/ui20-ir1-implementation-readiness (this gate; accepted)
  then design/ui20-rw1-* for first React wave after separate ChatGPT RW1 execution GO

V3 StableSidebar remains runtime authority until RW1 merges.
Remove dead sidebar CSS only after RW1+ verification.
No long-lived dual shell on main.
```

---

## 12. Figma source lock (read-only)

Accepted nodes include VIS1 `233:66`, VIS1A `239:66`, Owner board `242:66`, Control `242:941`, Final IA `229:66`, and listed 1440/1280/768 proofs in the IR1 worklog. FIGMA_WRITE = NO.

---

## 13. Closed readiness gates / remaining advisories

**Closed by IR1A (Owner-delegate):**

1. Contract accepted with required amendments  
2. Acasă / root contract finalized (no temporary `/home`)  
3. Capability gap accepted as carry; nonblocking for RW1 presentation shell  
4. First React wave approved as next wave (execution GO separate)

**Still required before claiming complete UI20 runtime:**

- Separate RW1…RW6 execution GOs  
- Capability-aware nav finalization (backend/product projection contract)  
- Master Polish after coherent runtime  

**Nonblocking advisories:**

- Token hex calibration deferred to waves  
- Historical dated canon snapshots may still say NOT_SELECTED (left intact)  
- PER_WAVE_POLISH required; MASTER_POLISH later  

---

## 14. STOP

```text
UI20_IR1                          = OWNER_ACCEPTED
UI20_IMPLEMENTATION_READINESS     = OWNER_ACCEPTED
UI20_IMPLEMENTATION               = NOT_YET_EXECUTED
REACT                             = NOT_AUTHORIZED
RW1_EXECUTION                     = NOT_STARTED
NEXT_STEP                         = CHATGPT_VERIFY_IR1_ACCEPTED_ON_MAIN_AND_ISSUE_UI20_RW1_EXECUTION_GO
```
