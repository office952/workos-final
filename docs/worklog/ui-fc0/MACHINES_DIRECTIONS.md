# UI-FC0 — Machines direction studies

Conceptual information-architecture studies for Utilaje și zone, read against Procese operaționale. Not implementation. Not React. Not CSS. Not a Machine Admin GO. Not an Atelier factory map.

```text
LANE                              = A_PRODUCT + B_USER
DOCUMENT_KIND                     = CONCEPTUAL_IA_STUDY
STUDIED_COUNT                     = 3
IMPLEMENTATION                    = NO
NO_FAKE_CAPACITY                  = YES
NO_FAKE_TELEMETRY                 = YES
NO_FAKE_UTILIZATION               = YES
NO_BUSY_IDLE                      = YES
NO_INVENTED_SCHEDULE              = YES
NO_MACHINE_HOUR_RATE              = YES
UNIVERSAL_MACHINE_ADMIN           = DEFERRED
SHOP_FLOOR_MAP_REPLACES_ATELIER   = NO
CLASS                             = FIGMA_CANDIDATE
HEAD                              = bb5952051abace00078a7aa1bf5930ce72cc4abe
SOURCE_PAGES                      = /admin/workcenters · /admin/processes
SOURCE_FILES                      = WorkcentersAdminPage.tsx · ProcessesAdminPage.tsx · OwnerCatalogView.tsx
CANONS                            = WORKCENTERS_AND_MACHINES_CANON · OPERATIONAL_PROCESSES_CANON
RELATED                           = MACHINE_STRICT_MANUAL_WORK_AREAS_FLEXIBLE_V1
UI_UX_CANON_READ                  = YES
ROADMAP_READ                      = YES
DIRECTION_CONFLICT                = NO
THEME_IMPACT                      = NONE
NEW_HARDCODED_CSS                 = NO
BACKEND_DETAILS_EXPOSED           = NO
CURRENT DELIVERY STATE            = READ ACTIVE ROADMAP
THIS_BUILD                        = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5
NEXT_PROGRAM_PRIORITY             = WORKOS_UI_UX_FINAL_CLOSURE_V1
UI_GENERAL_REDESIGN               = CLOSED_FOR_V1
```

`DIRECTION_CONFLICT = NO`: these candidates redesign how the existing workcenter/machine catalog is *read*. They do not authorize Machine Admin CRUD, capacity, scheduling, MachineRun, or replacing Atelier's inbox with a shop-floor map. Direction canon lists those as DEFERRED.

```text
ROADMAP_READ
UI_UX_CANON_READ
DIRECTION_CONFLICT
```

---

## Why this study exists

`/admin/workcenters` already has an honest information model (zones, machines, capabilities, “Fără furnizor”, no occupancy). `/admin/processes` has the strongest operation → capability → provider model in the app (9/10). Both pages render through the same `OwnerCatalogView`, so Utilaje looks like another admin dump: workshop groups as categories, **zone and machine as peer rows in one list**.

`PAGE_MACHINES_PEOPLE_PROCESSES.md` required three directions without gauges. This file is that study.

```text
WORKCENTER     → physical / organizational production area
MACHINE        → concrete technical equipment in a Workcenter
CAPABILITY     → technical eligibility a provider can offer
OPERATIONAL PROCESS → reusable operation that requires a Capability
RESOURCE / RECIPE   → internal cost basis, owned elsewhere
```

A process never stores `machineId`. Execution later chooses a provider. Coverage means “the catalog has an ACTIVE provider.” It does not mean a job can run now.

---

## Law that every candidate must preserve

### Machine versus manual area

| Kind | Live examples | Provides | Start rule |
| --- | --- | --- | --- |
| Dedicated machine | CNC 4020, CNC Cant Litere, welders, plotter, laser, laminators | machine-specific capabilities | Process `REQUIRED` → Start needs eligible machine + executor |
| Manual area / table | Masă asamblare 1, Masă asamblare 2, Montaj LED / electric | workstation / human-skill capabilities (`MANUAL_ASSEMBLY`, `ELECTRICAL_ASSEMBLY`) | Process `NOT_REQUIRED` → Start needs executor only; assigning a table is `ineligible_provider` |

```text
DEDICATED_MACHINE        = STRICT
MANUAL_TABLE_OR_AREA     = FLEXIBLE
```

The two assembly tables are not catch-alls. They are `MANUAL_ASSEMBLY` only. LED post is electrical, not a machine. Steel weld and aluminium weld are distinct machines in one welding station. CNC 4020 and the styro cutter share a zone and **do not share a capability**.

### Capabilities

Shop-floor capability IDs live in Operational Processes. Workcenters/Machines consume them. Available capability ≠ Letters-required capability. A welding machine does not add welding to LETTERS composition.

Letters-required: `CNC_ROUTING`, `PROFILE_FORMING`, `VINYL_APPLICATION`, `MANUAL_ASSEMBLY`, `ELECTRICAL_ASSEMBLY`, `PAINTING`, `QUALITY_CONTROL`, `PACKAGING`.

Also live because equipment exists: weld steel/alu, metal cutting, printing, lamination, laser, styro, rigid-film lamination, plotter.

Coverage: `COVERED` | `PROVIDER_PLANNED` | `NO_PROVIDER`.

### Process relation

```text
PROCESS DEFINITION  ≠  PROCESS COMPOSITION  ≠  EXECUTION INSTANCE
```

The process owns `REQUIRED` / `NOT_REQUIRED`. The join to providers is derived: process requires capability; machine or area provides capability. UI may show the join. UI may not assign a machine onto the process definition.

### Eligibility

Eligibility is a rule, not a live state:

- Machine-required process + no eligible machine on the task → blocked at Start (execution), not a Utilaje occupancy light.
- Manual process + skilled operator → can start without a table.
- Manual process + assign table/machine → rejected (`ineligible_provider`).
- Missing skill → `ineligible_executor` (People, not this page).
- Incomplete dependencies → execution, not this page.

Utilaje shows **catalog eligibility**: who *can* provide. Atelier / Execution show **this task, now**.

### Missing provider

Shown as an honest gap. Do not mint a zone or machine to make the map look complete. `PAINTING`, `QUALITY_CONTROL`, `PACKAGING` may have no dedicated provider — that is a first-class row, not a failure of the page.

### Constraints (show; do not invent more)

- Machines in the same zone are not interchangeable if capabilities differ.
- FACE and BACK are component roles, not two CNCs.
- Product configuration does not select a machine.
- Recipe/cost gap may be projected (`SERVICE_RECIPE_MISSING`, …). The page does not fill the cost.
- Lifecycle `ACTIVE` / `PLANNED` / `RETIRED` is structural only.
- People, skills, pontaj, payroll stay out.
- Capacity, calendars, concurrency, employee limits: `NOT_MODELED`.

### Future capacity extension point

Every candidate reserves a place named for later capacity **without drawing it**:

```text
CAPACITATE = NEIMPLEMENTATĂ
Owner later: Machine / Workcenter will own technical capacity and availability.
Execution / Scheduling will consume it.
Product System and Processes do not own it.
This reserved band must not grow a gauge, a calendar, or a % in this study.
```

### Forbidden chrome

```text
utilization % · busy / idle · online / offline · Gantt
machine-hour rate · invented schedule · live telemetry
task concurrency numbers · employee limits · Infinity
shop-floor map as Atelier replacement · Machine CRUD
```

---

## How the three candidates differ

| | A Machine Profile Workspace | B Capability Map | C Operation → Capability → Eligible Machine |
| --- | --- | --- | --- |
| Primary noun | one machine (or one manual area) | one capability | one operational process |
| First question | what is this equipment / table? | what can the shop do, and what is missing? | how is this operation provided? |
| Zone's job | location on the profile | a provider kind among others | usually hidden unless it is the provider |
| Missing provider | not the hero (page is about existing objects) | first-class gap rows | empty third column |
| Closest current page | neither (new object workspace) | the buried “Fără furnizor” category, promoted | `/admin/processes` information model, given its own floorplan |
| Risk | Client Hub clone with fake gauges | factory-map temptation | Utilaje disappears into Procese |

Do not average them into “one nicer OwnerCatalogView.”

---

## A. MACHINE PROFILE WORKSPACE

### NAME

Machine Profile Workspace

A machine is an operational object. The page is a profile, not a row in a mixed zone+machine list. A manual area is a **different profile kind**, not a machine with empty telemetry.

### PRIMARY_USER

Owner / atelier lead who must name what a piece of equipment is, what it can provide, and which processes that implies — without being told it is “free” or “busy.”

### PRIMARY_OBJECT

One Machine, or one Workcenter that is itself a manual area / station without a unique machine.

### FIRST_3_SECONDS

1. Kind: **Utilaj** or **Zonă manuală** — visually distinct, not a shared chip set.
2. Name and home zone (for a machine) or “masă / post, nu utilaj” (for an area).
3. What it can do (capabilities) and whether Start of those operations is machine-strict.

### LAYOUT_MODEL

Object workspace. Master list is **machines and manual areas as two labeled groups**, never interleaved as look-alike rows. Opening one replaces the page with a profile.

```text
┌────────────────────────────┬────────────────────────────────────┐
│ FURNIZORI                  │  CNC 4020                          │
│                            │  Utilaj  ·  Zonă CNC  ·  Activ     │
│ Utilaje                    │                                    │
│  ● CNC 4020                │  POATE FACE                        │
│    CNC Cant Litere         │  Debitare CNC (tablă)              │
│    Debitator metale        │                                    │
│    …                       │  STRICT LA START                   │
│                            │  Debitarea CNC cere acest tip de   │
│ Zone manuale               │  utilaj. Fără el, taskul rămâne    │
│    Masă asamblare 1        │  blocat. Nu spune dacă e liber.    │
│    Masă asamblare 2        │                                    │
│    Montaj LED / electric   │  PROCESE PE CARE LE POATE ACOPERI  │
│                            │  Debitare CNC tablă  →  derivat    │
│                            │  (Față / Spate / ACM — același     │
│                            │   proces, nu două utilaje)         │
│                            │                                    │
│                            │  CONSTRÂNGERI                      │
│                            │  În aceeași zonă: cutter styro     │
│                            │  — altă capabilitate, nu înlocuitor│
│                            │                                    │
│                            │  COST / REȚETĂ (proiecție)         │
│                            │  Rețetă: existentă | lipsă         │
│                            │  Tarif: nu pe utilaj  → Resurse    │
│                            │                                    │
│                            │  CAPACITATE                        │
│                            │  Neimplementată. Extindere viitoare│
│                            │  (fără orar, fără %).              │
└────────────────────────────┴────────────────────────────────────┘
```

Manual-area profile (same IA, different bands):

```text
Masă asamblare 1
Zonă manuală · Asamblare · Activ

POATE FACE
  Asamblare manuală

LA START
  Nu este poartă. Lipsa mesei nu blochează un task
  manual eligibil. Alocarea mesei pe task este respinsă.

PROCESE PE CARE ZONA LE POATE ACOPERI (catalog)
  Lipire corp, închidere, etc. — procesele rămân NOT_REQUIRED.

CAPACITATE
  Neimplementată. Nu inventa „2 mese = 2 joburi.”
```

### PERSISTENT_REGION

Grouped provider list + profile identity header (kind, name, zone, lifecycle). The honest notice that scheduling is not here stays in the header, compact.

### SELECTABLE_REGION

One provider. Zones that only *contain* machines (Zonă CNC, Zonă formare) are location context on the machine profile, or a thin “zonă” index — they are not fake machines.

### DETAIL_REGION

The profile bands: capabilities, start rule, derived processes, constraints, recipe/cost projection, reserved capacity slot, used-by, technical identity behind Detalii.

### PRIMARY_ACTION

Inspect. This slice has **no Machine write**. People and labels of equipment are not display-label Product System writes. If a later Owner GO adds naming, it is a later write path — not part of this IA.

### Machine versus manual area

Two templates. Machine template leads with equipment and strict Start. Area template leads with “nu blochează startul” and refuses occupancy language. They must not share a “stație” chrome that hides the difference.

### Capabilities

The hero of the profile after identity. Listed in workshop language. IDs stay in Detalii.

### Process relation

Derived list: processes whose required capability this provider offers. Caption: “Procesul nu alege utilajul din produs.” FACE/BACK sharing `CUT_SHEET_CNC` appears as one process, two component roles, one machine class.

### Eligibility

Catalog eligibility only: this machine *can* satisfy `CNC_ROUTING`. No “eligibil acum”, no operator name, no current job. Link: “Eligibilitatea pe task se vede în Execuție / Atelier.”

### Missing provider

Not a band on a machine that exists. A small footer on the list: “N capabilități fără furnizor — vezi harta de capabilități” (candidate B) or a single “Fără furnizor” group at the bottom of the master list, visually a gap list, not a third kind of machine.

### Constraints

Dedicated band. Same-zone non-substitutability. Assembly tables are not vinyl/electrical/QC/packing. Welding steel ≠ welding aluminium.

### Future capacity extension point

Last band, always present, always empty of metrics:

```text
Capacitate — neimplementată
Va aparține utilajului / zonei. Execuția o va consuma.
Nu orar. Nu ocupat/liber. Nu procent.
```

### DYNAMIC_BEHAVIOR

- Opening CNC 4020 vs styro cutter: same zone caption, different capability, different process list.
- Opening Masă 1 vs Masă 2: two organizational areas, same capability; no “load balancing.”
- Filter: Utilaje / Zone manuale / Gaps. Not workshop-group categories as the primary IA (groups may remain as list headings).
- No polling, no live refresh of shop state.

### RESPONSIVE_BEHAVIOR

Same as Client Hub: split on 1440/1280; list-then-profile on 768. Profiles stay readable without gauges that “need desktop.”

### ADVANTAGES

- Ends zone/machine peer-row confusion.
- Makes STRICT vs FLEXIBLE a property of the object you opened.
- Natural home for the future capacity model without drawing it now.
- Distinct signature from Procese (object vs operation).

### RISKS

- Designers will put a status light on the header. Forbidden.
- “Folosit de” can drift into live jobs. Keep derived catalog uses only.
- Zone-only pages (Zonă CNC with two non-interchangeable machines) need a small index, or users will think the zone is the provider.
- Looks like Client Hub if commercial chrome is copied.

### WHY_WORKOS / WHY_NOT_GENERIC_SAAS

A generic CMMS profile is hours, meters, downtime, and a rate card. This profile is **eligibility identity**: what class of work this physical thing may satisfy, and whether Start is allowed to depend on it. Money stays in Resources. Time stays unimplemented. The workshop table is not a broken machine.

---

## B. CAPABILITY MAP

### NAME

Capability Map

The shop is read as a map of **what can be provided**. Each capability is a row. Providers hang off the row. Missing providers are the scannable thing — not a last category after Laser.

This is a coverage ledger, not a floor plan. No drawing of the hall. Atelier remains the inbox.

### PRIMARY_USER

Owner who must see gaps (pictură, control, ambalare, or any `NO_PROVIDER`) in one glance, and see that a capability may have several providers or none.

### PRIMARY_OBJECT

Capability class.

### FIRST_3_SECONDS

1. How many capabilities are covered vs without provider.
2. The gap rows.
3. That “acoperit” means catalog presence, not “free to take a job.”

### LAYOUT_MODEL

A capability table / stack with an inspector. Rows are capabilities. Columns are facts, not machines-as-peers.

```text
┌─────────────────────────────────────────────────────────────────┐
│ CAPABILITĂȚI ATELIER                                            │
│ Acoperite 12  ·  Fără furnizor 3  ·  Planificate 0              │
│ Acoperirea = există furnizor în catalog. Nu = se poate lucra.   │
├──────────────┬──────────┬──────────────────┬────────────────────┤
│ Capabilitate │ Fel      │ Furnizori        │ Cerută de          │
├──────────────┼──────────┼──────────────────┼────────────────────┤
│ Debitare CNC │ Utilaj   │ CNC 4020         │ Debitare CNC tablă │
│ Formare cant │ Utilaj   │ CNC Cant Litere  │ Formare profil Al  │
│ Asamblare    │ Zonă     │ Masă 1, Masă 2   │ Lipire, închidere  │
│              │ manuală  │                  │ (nu cer alocare)   │
│ Electric     │ Post     │ Montaj LED       │ LED, cablare, PSU  │
│              │          │                  │ (nu cer alocare)   │
│ Pictură      │ —        │ FĂRĂ FURNIZOR    │ Vopsire RAL        │
│ Control      │ —        │ FĂRĂ FURNIZOR    │ Verificări         │
│ Ambalare     │ —        │ FĂRĂ FURNIZOR    │ Ambalare           │
│ Sudură oțel  │ Utilaj   │ Sudură oțel      │ Sudură oțel        │
│ Sudură Al    │ Utilaj   │ Sudură aluminiu  │ Sudură aluminiu    │
└──────────────┴──────────┴──────────────────┴────────────────────┘
        │
        ▼ row selected: Pictură
┌─────────────────────────────────────────────────────────────────┐
│ Pictură  ·  Fără furnizor                                       │
│ Procese care o cer: Vopsire RAL                                 │
│ Furnizori: niciunul. Nu inventăm o cabină.                      │
│ LETTERS o cere când volumul e vopsit. ACM nu o adaugă singură.  │
│ Capacitate: neimplementată (nu există ce programa).             │
└─────────────────────────────────────────────────────────────────┘
```

Gap rows stay at the top or pinned. They are not a souvenir category after Plotter.

### PERSISTENT_REGION

The capability ledger + the coverage summary (counts only of catalog coverage, never %).

### SELECTABLE_REGION

A capability row.

### DETAIL_REGION

Selected capability: kind (MACHINE / WORKSTATION / HUMAN_SKILL), providers with kind, processes that require it, Letters-required vs shop-only, recipe-gap projection per linked process, reserved capacity note, technical id in Detalii.

### PRIMARY_ACTION

Scan gaps. Secondary: open a provider profile (candidate A) or a process (candidate C). No “Adaugă furnizor” until a real Machine Admin GO.

### Machine versus manual area

A column: provider kind. Masă 1 is “zonă manuală.” CNC 4020 is “utilaj.” They can share a capability row only if they truly provide the same capability (the two tables both provide `MANUAL_ASSEMBLY`). They never share `CNC_ROUTING`.

### Capabilities

The map *is* the capability catalog. Workcenters do not recreate it. Extra shop capabilities (weld, print, laser) appear even when no LETTERS product demands them — caption: “există pentru că există echipament, nu pentru că LETTERS le cere.”

### Process relation

“Cerută de” is the reverse join. One capability, many processes. Selecting the row does not edit the process.

### Eligibility

Row-level: if any ACTIVE provider exists → COVERED. Detail lists who is eligible **in the catalog**. Manual capability + tables present still shows the process-owned `NOT_REQUIRED` so nobody thinks Masă 1 must be assigned.

### Missing provider

Hero. `NO_PROVIDER` rows use warning treatment (actionable — Owner must notice). `PROVIDER_PLANNED` is calmer. Do not draw a silhouette machine.

### Constraints

Detail of `CNC_ROUTING`: styro cutter is a different row (`STYRO_CUTTING`), even though the zone is shared. Detail of welding: two rows, two metals. Vinyl application ≠ plotter cutting ≠ rigid-film lamination.

### Future capacity extension point

On a COVERED capability:

```text
Capacitate viitoare se va agrea pe furnizorii acestei capabilități,
nu pe capabilitate ca resursă abstractă.
Neimplementată.
```

On a gap row, the slot says there is nothing to extend until a provider exists.

### DYNAMIC_BEHAVIOR

- Filter: Letters-required / all shop / gaps only.
- Selecting a row does not imply a live queue.
- Counts update only when the catalog projection changes, not on a timer.

### RESPONSIVE_BEHAVIOR

1440: full ledger. 1280: provider column may wrap. 768: each capability is a card (name, coverage, provider names, process names). Cards keep gap-first sort. Do not turn cards into a map of rooms.

### ADVANTAGES

- Makes “Fără furnizor” the point of the page.
- One capability → many providers is finally scannable.
- Separates shop existence from Letters demand.
- Strongest honesty about coverage ≠ execution.

### RISKS

- Designers will draw the factory. Canon forbids replacing Atelier with a machine map.
- A table invites utilization columns. Leave the column out.
- Human-skill capabilities can pull People records in. Keep “fel: calificare umană” and point to Oameni.
- Shop-only rows can look like LETTERS now welds. Caption must stay.

### WHY_WORKOS / WHY_NOT_GENERIC_SAAS

A generic MES capability matrix is stations × hours × load. This map is a **coverage truth table**: which technical eligibility exists in the organization catalog, who provides it, and which reusable operations depend on it. Empty is allowed. Load is not a fact.

---

## C. OPERATION → CAPABILITY → ELIGIBLE MACHINE

### NAME

Operation → Capability → Eligible Machine

Work is read in the order the domain already owns: an operation says how work is done; it requires a capability class; eligible providers are derived. This is the Processes information model given a floorplan that Utilaje currently lacks — a **join path**, not a catalog of machines and not a dump of processes.

### PRIMARY_USER

Owner / technician tracing “de ce acest task cere CNC 4020” or “de ce lipirea nu cere masă.” Closest to how Execution will later pick a provider without mutating the process.

### PRIMARY_OBJECT

One Operational Process, then its required capability, then the eligible provider set.

### FIRST_3_SECONDS

1. The operation (Debitare CNC tablă / Formare cant / Lipire…).
2. What it requires (capability + REQUIRED vs NOT_REQUIRED).
3. Who may provide it now in the catalog — or that nobody does.

### LAYOUT_MODEL

Three linked regions. Selecting left to right is the only story.

```text
┌──────────────────┬──────────────────┬───────────────────────────┐
│ 1 OPERAȚIE       │ 2 CAPABILITATE   │ 3 FURNIZORI ELIGIBILI     │
│                  │                  │                           │
│ Debitare         │ Debitare CNC     │ Utilaj                    │
│ ● Debitare CNC   │ Fel: utilaj      │ ● CNC 4020                │
│   Debitare metal │                  │   (zonă CNC)              │
│   Plotter        │ Cerință proces:  │                           │
│   Laser          │ OBLIGATORIE      │ Nu eligibil               │
│ Formare          │                  │   cutter styro — altă     │
│   Formare cant   │                  │   capabilitate            │
│   Casetă manuală │                  │   mesele — nu utilaj      │
│ Asamblare        │                  │                           │
│   Lipire corp    │                  │                           │
│   …              │                  │                           │
│ Electric         │                  │                           │
│ …                │                  │                           │
├──────────────────┴──────────────────┴───────────────────────────┤
│ Lipire corp · Asamblare                                         │
│ Necesită: asamblare manuală                                     │
│ Utilaj dedicat: NU  ·  Acoperire: zone existente                │
│ Furnizori catalog: Masă 1, Masă 2                               │
│ La start: operator eligibil. Masa NU se alocă.                  │
│ Resursă / rețetă: referință → Costuri  (fără tarif aici)        │
│ Capacitate: neimplementată                                      │
└─────────────────────────────────────────────────────────────────┘
```

Empty third column when the process is `REQUIRED` and capability is `NO_PROVIDER`:

```text
3 FURNIZORI ELIGIBILI
  Fără furnizor configurat.
  Nu inventăm o zonă ca să fie acoperit.
```

### PERSISTENT_REGION

The three-step path. Process categories (Debitare, Formare, Sudură, …) are list headings — they already exist in Processes admin and belong here as operation groups, not as Utilaje workshop groups.

### SELECTABLE_REGION

A process. Capability is determined (not a free pick). Providers in column 3 are selectable to open a profile (A) but selecting them does not bind the process.

### DETAIL_REGION

The footing: process outcome, provider requirement, coverage, derived providers, condition-when-it-appears (from product composition, if any), recipe/resource reference, reserved capacity, used-by products — all read-only, matching what Processes already projects.

### PRIMARY_ACTION

Trace the join. Secondary: open Procese for the full composition graph; open a machine profile. No process write (already forbidden on `/admin/processes`).

### Machine versus manual area

Column 3 labels kind. For `NOT_REQUIRED` processes, column 3 may list tables as **catalog locations that provide the capability**, with an explicit line that they are not assignable and not Start gates. For `REQUIRED` processes, column 3 lists only machines that provide that capability.

### Capabilities

Column 2 is the process's single required capability. The UI does not let the user pick a different one. Kind (MACHINE / WORKSTATION / HUMAN_SKILL) is shown in words.

### Process relation

The process is the root. This IA *is* the relation. Product process composition (FACE:CUT vs BACK:CUT, BODY bond, dependencies) stays a door to the existing “Compoziții produse” inspection — not redrawn as machines.

### Eligibility

Three layers, kept distinct in copy:

1. **Catalog eligibility** — column 3 (this study).
2. **Task eligibility** — Execution (provider assigned or not; skill; dependencies). Not drawn here.
3. **Provider requirement** — owned by the process (`REQUIRED` / `NOT_REQUIRED`).

Never collapse (1) and (2). A COVERED CNC process still does not say “CNC 4020 e liber.”

### Missing provider

Column 3 empty + coverage warning. Same honesty as Processes today, but spatially obvious because the column is reserved even when empty.

### Constraints

Column 3 includes a “Nu eligibil în aceeași zonă” footnote when sibling machines share a workcenter and not a capability. Forming does not accept an assembly table. Manual fold `FORM_SHEET_CASSETTE` is `MANUAL_ASSEMBLY`, not a bending machine — column 2/3 must not grow a ghost bender.

### Future capacity extension point

On column 3, under the provider list:

```text
Când capacitatea va exista, se va aplica pe acești furnizori
la alegerea din Execuție. Procesul nu va primi ore.
Neimplementată.
```

The process column never shows duration, planned hours, or machine-hours.

### DYNAMIC_BEHAVIOR

- Selecting another process replaces columns 2 and 3 together (capability is not sticky).
- Switching from `CUT_SHEET_CNC` to `FORM_ALUMINIUM_PROFILE` changes both the capability and the single eligible machine class.
- Switching to `PLACE_LED_MODULES` shows ELECTRICAL_ASSEMBLY, LED post as catalog location, and “nu se alocă.”
- Composition conditions (“apare când…”) update the footing, not the machine list.
- No live assignment stream.

### RESPONSIVE_BEHAVIOR

1440: three columns. 1280: columns 2+3 may stack beside a narrower process list. 768: one column wizard (Operație → Capabilitate → Furnizori) with a visible step index. Do not drop column 3 when empty — the empty state is the point.

### ADVANTAGES

- Matches the best existing information model.
- Explains machine-strict vs manual-flexible in the only place the rule is owned (the process).
- Natural cross-link: Utilaje and Procese stop being two clones of `OwnerCatalogView`.
- Future Execution “choose provider” can consume the same path without a new authority.

### RISKS

- Utilaje loses a reason to exist if this page lives only under Procese. Keep a Utilaje entry that opens this path **from a provider** (reverse: machine → processes it can cover) or treat this as a shared floorplan with two doors.
- Three columns invite a scheduling swimlane. Keep them as derived sets.
- Showing tables on `NOT_REQUIRED` rows can re-teach “must assign a table.” The rejection line must be louder than the table names.
- Capability IDs and process codes must stay in Detalii.

### WHY_WORKOS / WHY_NOT_GENERIC_SAAS

A generic routing UI binds operation → machine code and a standard time. WorkOS binds operation → **capability class** → derived providers, and separately records whether a provider is required at Start. Time, wage, and machine-hour are not on the path. The third column may be empty. That emptiness is domain truth.

---

## Comparison for Owner selection

| Question | Prefer |
| --- | --- |
| Is the confusion “masă and CNC look like the same row”? | A Profile |
| Is the job “what is missing in the shop”? | B Capability Map |
| Is the job “why does this operation need / not need a machine”? | C Join path |
| Where should future capacity land? | A (owned by machine/area), consumed later from C's column 3 |
| What must not happen? | A factory map (forbidden vs Atelier); gauges on any candidate |

Recommended reading order for a later Figma compare: **B for gaps**, **A for identity**, **C for the rule**. They can share objects later; they must not share one chrome today.

---

## Shared non-goals

```text
NO utilization, busy/idle, telemetry, calendars, Gantt
NO machine-hour rates, wages, invented recipes
NO Machine CRUD / universal Machine Admin
NO Atelier replacement shop-floor map
NO assigning providers onto process definitions
NO employee records on the machine
NO Infinity / concurrency / headcount limits
NO implementing these IAs from this document
```

People remain `/admin/people` and skills. Processes remain the composer of product routes. Resources remain money. Execution remains Start / Alocă / complete.

---

## Relation to current pages

| Current | A | B | C |
| --- | --- | --- | --- |
| `OwnerCatalogView` workshop groups | replace with grouped provider list | replace with capability ledger | replace with three-step path |
| Zone + machine peer rows | split into two profile kinds | providers as cells, not rows | providers only in column 3 |
| “Fără furnizor” last category | footer / link | hero rows | empty column 3 |
| `/admin/processes` | door from profile | door from capability | same model, new floorplan; keep composition graph there |
| Honest “programarea nu e aici” notice | keep, shorter, on every candidate | keep | keep |

---

## Studied

```text
MACHINES_DIRECTIONS_STUDIED = 3
  A = MACHINE_PROFILE_WORKSPACE
  B = CAPABILITY_MAP
  C = OPERATION_CAPABILITY_ELIGIBLE_MACHINE
OWNER_SELECTION             = NOT_MADE
IMPLEMENTATION_GO           = NOT_AUTHORIZED
CAPACITY                    = EXTENSION_POINT_ONLY
```
