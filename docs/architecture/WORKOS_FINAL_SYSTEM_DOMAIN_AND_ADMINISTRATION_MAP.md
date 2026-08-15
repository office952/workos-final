# WorkOS Final — system domain and administration map

Canonical current architecture for cross-system ownership and future administration.
Runtime wins if this document disagrees with implemented code.
This document does not store adjustable runtime values.

Related current canons:

- `docs/architecture/PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md` — technical settings single-truth
- `docs/architecture/RESOURCES_AND_COST_CANON.md` — resource identity and cost evidence
- `docs/architecture/SERVICE_AND_LABOR_RECIPES_CANON.md` — service / labor recipe layer
- `docs/architecture/OPERATIONAL_PROCESSES_CANON.md` — process definition and capability class
- `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` — construction order and finalization status
- `packages/domain/src/capabilities.ts` — frozen capability IDs (kernel status remains PLANNED by design)
- `packages/domain/src/governance/projection.ts` — honest implemented vs planned runtime projection

## Purpose

WorkOS Final already has a product spine. The next risk is fragmentation: Product System, People, Machines, Pontaj, and Execution each inventing a different administration model.

This map defines shared principles and domain boundaries **before** CRUD systems are built.

## Cross-system administration law

Every administrable business entity must answer:

- What is it?
- Who owns it?
- Where is it configured?
- What is its stable ID?
- What is its display label?
- What is its lifecycle?
- Who may edit it?
- Can it be retired?
- Can it be deleted?
- What references it?
- What settings belong to it?
- What calculations consume it?
- What becomes frozen or versioned?
- What is history vs active truth?

Entities need not share one schema. They must share these principles.

## Shared principles

**One active truth.** One active configurable value or entity definition has one authority.

**Stable identity.** Stable ID is distinct from the editable display label.

**Lifecycle.** Default future vocabulary where suitable: `DRAFT` → `ACTIVE` → `RETIRED`. A domain may use another lifecycle if the domain requires it.

**Delete is exceptional.** Referenced business entities normally `RETIRE`. Hard delete only when genuinely unused and unreferenced.

**Settings are owned.** Settings live with the system or entity that owns them. There is no global Settings table that owns all truth.

**Documentation is not runtime authority.** Docs explain architecture and history.

**UI admin projects canonical truth.** React does not create a second configuration authority.

**Future freeze / versioning.** Accepted or frozen truth must become protected and version-aware. No freeze engine in this build.

**Retirement of old sources.** When a canonical system replaces old active truth: migrate consumers, remove the duplicate authority, keep history only as evidence, update canonical docs, no “just in case” compatibility.

## System map

```text
WorkOS Final
├── Product System                          IMPLEMENTED_CURRENT (typed structure + persisted display labels)
│   ├── ProductFamily / ProductCategory
│   ├── ProductTemplate
│   ├── ComponentRole / ComponentVariant
│   ├── Component technical settings
│   ├── Form schema
│   ├── ProductDefinition / ProductTruth
│   └── ProductAggregate
├── Resources / Cost                        FOUNDATION_ONLY (catalog + EIC)
│   ├── Resource identity
│   ├── Cost evidence / rates
│   └── Labor / service recipes             FOUNDATION_ONLY
├── Operational Processes                   FOUNDATION_ONLY (typed catalog + Letters technological route)
│   ├── Process definition
│   ├── Production capability class
│   ├── Component process requirements
│   └── Product process composition         FOUNDATION_ONLY (deterministic, not ExecutionPlan)
├── Governance / owner projections          IMPLEMENTED_CURRENT (read-only)
├── Analyzer                                NOT_IMPLEMENTED (separate app; proposal only)
├── Commercial                              PLANNED
│   ├── Commercial rules / customer price
│   ├── Quote Snapshot
│   └── Order Snapshot
├── Execution                               PLANNED
│   ├── ExecutionPlan
│   ├── Operations / tasks / dependencies
│   ├── Assignments
│   └── Actuals / MachineRun
├── People / Angajați                       PLANNED
│   ├── Employee master
│   ├── Role / skill / availability
│   └── Attendance / Pontaj
├── Machines / Utilaje                      FOUNDATION
│   ├── Machine / machine type              FOUNDATION (live catalog empty)
│   ├── Workcenter                          FOUNDATION (2 assembly tables live)
│   └── Capacity / availability             NOT_IMPLEMENTED
├── Reporting                               PLANNED (projection only)
└── Documents                               PLANNED (output, not truth)
```

Capability kernel IDs stay frozen and `PLANNED`. That does not mean the first product is missing. Governance projection is the honest operational status for what the pilot actually does.

## Domain ownership matrix

| Domain | Owns | Does not own |
|---|---|---|
| Product System | Family, category, template, composition, variants, component technical settings, allowed configuration | Purchase rates, commercial price, execution actuals, attendance |
| Form / Intake | Schema, fields, visibility, order-specific operator input | System technical settings, formulas, rates, Product Truth |
| Truth compiler | ProductDefinition, confirmation of the reviewed definition, ProductTruth, ProductAggregate | Resource catalogs, commercial price, actuals |
| Resources / Cost | Resource identity, material family/spec, cost evidence, EIC | Process identity, customer price, stock, Product Truth, attendance |
| Operational Processes | Process definition, required capability class, type applicability, product/component process composition | Resource price, ExecutionTask, machine identity, employee |
| Commercial | Customer price rules, Quote Snapshot, Order commercial freeze | EIC authority, ProductTemplate, execution actuals |
| Execution | Plan, tasks, assignments, MachineRun, operational actuals | Attendance truth, rewriting Product Truth, historical commercial reprice |
| People | Employee master, attendance / Pontaj, payments, advances | Execution session, labor recipe / cost basis, Product Truth |
| Machines / Workcenters | Machine identity, workcenter identity, capability-provider mapping | Process definition, commercial hourly price, capacity calendar, Execution selection |
| Reporting | Read-only projections | Underlying business truth |
| Documentation | Explanation, history, architecture | Active configurable values |
| Analyzer | Geometric proposals after operator confirmation | Product Truth, settings, price |

## Product System

Administrable later: family, category, template identity/composition, form schema, component variant metadata, technical settings.

Remains code/contract: quantity formulas, compiler semantics, reviewId confirmation, component calculation contracts.

Owner will edit: catalog organization, which variants a template composes, resolved technical settings, form fields that are truly product-configurable.

Needs persistence before real editing: yes. Until then, typed domain configuration is the canonical active configuration.

Lifecycle: `DRAFT` / `ACTIVE` / `RETIRED` for catalog and settings versions. Templates referenced by confirmed truth must not hard-delete.

`/products` consumes the catalog and template as operator workflow. Components are reused by variant ID, not by copying formulas into each product.

## Resources / Cost

Canonical law: `docs/architecture/RESOURCES_AND_COST_CANON.md`.

Separate facts:

1. Resource identity
2. Material family vs purchasable specification
3. Resource cost evidence
4. Component applicability (which component demands the resource)
5. Quantity demand (owned by the component calculation)

Do not merge internal cost with Commercial. Do not put stock here.

Admin inspection lives under `/admin` → Resurse și cost intern. No resource write yet.

Current live catalog: Plexiglas 3 mm opal, Forex 10 mm, aluminium return profile 0.6 mm, forming service. Labor recipes remain planned. Operational processes are a separate foundation.

## People / Angajați

Not implemented. Capability kernel already splits People from Execution and from labor cost basis.

Likely entities: Employee, HR role, skill/capability, employment/cost profile, availability, status.

Clarify later:

- employee identity
- employee internal cost profile
- availability / Pontaj
- permissions (auth role ≠ HR role)
- skills (assignment eligibility)
- actual work (Execution sessions)

Do not put named employees on product templates. Templates may require a skill or station class.

## Machines / Utilaje

Foundation implemented. See `docs/architecture/WORKCENTERS_AND_MACHINES_CANON.md`.

Processes must require a **capability class**, not a hardcoded machine identity. The live shop-floor map includes the accepted assembly tables plus real welding, metal-cutting, CNC, forming, electrical, print and related stations. Those real capabilities now have reusable Operational Processes. Capacity planning is not implemented.

```text
OperationalProcess → requires Capability class
Workcenter / Machine → provides Capability class
Execution (later) → may pin a concrete provider
```

Do not put machine SKU on ProductTemplate or EIC.

Architectural `capabilities.ts` IDs are **system ownership**, not shop-floor machine capabilities. Do not conflate the two.

## Pontaj

Not implemented. Pontaj must not become isolated timesheet data that prices products.

```text
Employee
→ Execution task / operation
→ time actual
→ optional Machine / Workcenter
→ actual labor cost signal (internal)
```

Distinguish planned duration from actual worked time.

Time is not the default technical or commercial pricing authority. Labor recipes stay in Resources / Cost. Attendance stays in People. Task sessions stay in Execution.

## Execution

Not implemented. Eventual feed:

```text
Order Snapshot (frozen)
→ ExecutionPlan
→ Tasks / Operations
→ Employee assignment
→ Machine / Workcenter allocation
→ Pontaj / actuals
→ actual cost
→ Reporting
```

Execution consumes frozen order truth plus ProductAggregate / EIC. It does not rebuild Product Truth and does not reprice accepted commercial totals.

## Commercial

Not implemented. Future law:

```text
mutable config
→ confirmed Product Truth
→ Quote Snapshot
→ acceptance / freeze
→ Order Snapshot
→ execution consumes frozen order truth
```

EIC ≠ customer price. Product Truth confirmation ≠ Quote Snapshot. `reviewId` ≠ commercial freeze.

## Reporting

Reporting is projection only. Likely later views: production status, employee productivity, machine utilization, internal cost, order profitability, work-in-progress.

Reports must not write business truth, reprice quotes, or become a second calculator.

## Cross-system relationship graph

```text
ProductTemplate
  → ComponentVariant
    → TechnicalSettings
    → calculate()
      → ResourceRequirements
        → Resources
          → Cost evidence
            → EIC

ProductTemplate + FormSchema
  → ProductDefinition
    → ProductTruth
      → ProductAggregate
        → EIC

[later] ProductTruth + EIC + Commercial rules
  → Quote Snapshot
    → Order Snapshot
      → ExecutionPlan
        → Tasks / Operations
          → Employee assignment
          → Machine / Workcenter allocation
            → Pontaj / Execution actuals
              → actual cost
                → Reporting
```

Ownership arrows: Product System owns composition and settings; component contracts own calculation; Resources own rates; Commercial owns customer price; Execution owns plan and actuals; People own attendance; Reporting owns none of those facts.

## Administration model

Do not add a top-nav link per domain.

Current primary nav:

- Stare sistem
- Produse
- Module și componente
- Guvernanța sistemului
- Administrare

Inside Administrare, use catalog navigation (category → item → detail), not fifteen header links:

```text
Administrare
├── Sistem produs
├── Resurse și cost intern
├── Procese operaționale
└── Utilaje și capacitate
```

Persoane, Execuție, Pontaj and platform Settings stay off this catalog until they have real truth. Utilaje și capacitate is present because the capability-provider model exists; live asset rows remain empty on purpose. Do not invent machines to fill the catalog.

## Operator vs admin surfaces

| Kind | Use | Current / future example |
|---|---|---|
| Operator | Daily workflow | `/products` configure → review → confirm |
| Owner projection | System honesty / inspection | `/components`, `/governance` |
| Admin | Configure or inspect system truth | `/admin` — Product System display-label write; Resources, Processes and Workcenters inspection |

Do not mix system configuration into daily workflow.

Pontaj entry is operator. People definitions are admin.
Product configuration is operator. Template and LED pitch are admin.
Task board is operator. Execution planning policy is admin.

## Settings ownership strategy

Each domain owns its settings.

| Example | Owner |
|---|---|
| LED pitch, PSU reserve | Product System / component variant |
| Waste / tolerance later | Product System / that component variant |
| Purchase rates | Resources / Cost |
| Machine capacity parameters | Machines / Workcenters |
| Employee cost profile / availability rules | People |
| Planning policy parameters | Execution |
| Pontaj rounding / allowed rules | People / Pontaj |
| Commercial markup / VAT later | Commercial |

A higher-level Administrare area may **navigate** these settings. It must not **own** them.

Do not create one gigantic Settings page.

## Lifecycle / retire / delete

Default: `DRAFT` → `ACTIVE` → `RETIRED`.

Hard delete only if no ProductTruth, Order Snapshot, ExecutionPlan, or other business record references the entity.

Settings versions: keep previous active values as history after a new version is saved. Do not silently mutate a value already frozen into a snapshot.

## Current / foundation / planned / rejected

| System | Classification |
|---|---|
| Product catalog, first template, form, compiler, aggregate | IMPLEMENTED_CURRENT |
| Component-first FACE / VOLUME / BACK / LIGHTING roles + constructive types | IMPLEMENTED_CURRENT |
| Product System component configuration law (role / type / configuration) | IMPLEMENTED_CURRENT |
| Component technical settings (typed, read-only projection) | IMPLEMENTED_CURRENT |
| Owner surfaces `/components`, `/governance` | IMPLEMENTED_CURRENT |
| Product System administration foundation (inspection on `/components`) | IMPLEMENTED_CURRENT |
| Product System persisted display-label write + `/admin` | IMPLEMENTED_CURRENT |
| Pilot resource catalog + partial EIC | FOUNDATION_ONLY |
| Settings edit / persistence / versioning | PLANNED |
| Global Administrare nav / display-label write | IMPLEMENTED_CURRENT |
| Operational Processes foundation (typed catalog + capability class) | DONE / FOUNDATION |
| Process admin write, labor recipes | PLANNED / NOT_IMPLEMENTED |
| Workcenters / Machines capability-provider foundation | DONE / FOUNDATION |
| Capacity planning, scheduling, MachineRun | NOT_IMPLEMENTED |
| People, Pontaj, Execution | PLANNED |
| Commercial, Quote Snapshot, Order Snapshot | PLANNED |
| Reporting, Documents | PLANNED |
| Analyzer runtime | PLANNED / NOT_IMPLEMENTED |
| Capability kernel promotion to ACTIVE | FOUNDATION_ONLY (IDs frozen) |
| CostEngine / QuoteOrchestrator / unified Pricing UI | REJECTED_LEGACY_PATTERN |
| Parallel product calculators / Intake V2–V6 quote paths | REJECTED_LEGACY_PATTERN |
| Docs-owned adjustable values | REJECTED_LEGACY_PATTERN |
| Dossier as technical authority | REJECTED_LEGACY_PATTERN |
| HR hourly or pontaj as commercial price | REJECTED_LEGACY_PATTERN |
| Machine SKU on product / process | REJECTED_LEGACY_PATTERN |
| Giant Settings page owning all domains | REJECTED_LEGACY_PATTERN |
| Intake task dry-run as ExecutionPlan | REJECTED_LEGACY_PATTERN |
| Fake admin Edit/Save without persistence | REJECTED_LEGACY_PATTERN |

## Legacy lessons — do not recreate

Evidence from `office952/workos-vscode` and `office952/workflow-adv` contracts:

- Duplicate pricing authorities (CostEngine, QuoteOrchestrator, intake quote bridges, pricing registry)
- Hardcoded dropdown / template-local business truth
- Parallel product calculators and frontend business math
- Docs or dossier as runtime authority
- Disconnected HR / Pontaj used as price
- Machine-specific process coupling and `machine_code ?? machine_type` coalescing
- Three parallel task sources (V3 catalog, dossier rules, product graph)
- 24-item sidebar and a multi-thousand-line Settings page mixing company, cost engine, and integrations

Useful legacy workflows to keep as **concepts**: explicit Product Truth confirm; material price provenance; capability-class assignment; Quote/Order snapshot freeze; operational reports as read-only GET.

## Next implementation order

This map does **not** authorize the next build. Owner GO is still required.

Recommended rank:

1. **Versioned technical-setting write**
   Display-label persistence exists. Settings writes need versioning. Do not treat LED pitch or PSU reserve as automatic.

2. **Lighting Resources / Cost completion**
   PSU reserve is resolved. Remaining Lighting blockers are LED geometry, module watts, and PSU catalog identity/cost.

3. **Lifecycle retire** later, when more live entities exist.

Do not start People, Pontaj, Execution, or Commercial next. They depend on later snapshots and would recreate isolated systems. Workcenters / Machines foundation exists; capacity planning and Execution selection do not.

## Owner decisions

### Blocking now

1. Authorize the next write: versioned technical settings, Resources foundation, or another Product System metadata field. Do not treat LED pitch as automatic.
2. Persistence is now bounded Product System display metadata. Do not grow it into a universal business database without Owner GO.

### Can defer

- LED module wattage, geometric basis for module quantity, and PSU catalog policy
- People before or after Execution (current roadmap keeps Execution first)
- Attendance model (exception calendar vs daily grid)
- Confirmed live workcenter / machine identities, if any
- Capacity model after provider identities exist
- Commercial measurement rules and snapshot schema
- When to promote capability kernel statuses from PLANNED to ACTIVE
