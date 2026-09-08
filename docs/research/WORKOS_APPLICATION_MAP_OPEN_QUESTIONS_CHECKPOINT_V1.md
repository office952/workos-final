# WorkOS — Application Map Open Questions Checkpoint V1

**Status:** `ACTIVE_RESEARCH_EVIDENCE / CHECKPOINT`  
**Date:** 2026-09-09  
**Authority:** none. Current runtime, living roadmap and current canons win.  
**Parent inventory:** `docs/research/WORKOS_APPLICATION_INVENTORY_DRAFT_V1.md`

## Purpose

Resolve the high-impact open questions that can hide real blockers before the final Application Map and the Minimum Useful WorkOS vertical slice.

This checkpoint does **not** authorize Cursor product implementation, Figma application-screen construction, Cloud mutation, or a new domain.

---

# 1. Money visibility on Ofertă and Lucrare — RESOLVED

The accepted money contract already exists and is stronger than current page composition.

```text
MONEY_POLICY                 = ALT_B_SCOPED
DEFAULT                      = DENY
OWNER                        = client price + internal cost + markup + margin
MEMBER_IN_COMMERCIAL         = client net + VAT + gross only
OPERATOR_ATELIER_EXECUTION   = no financial payload
UNAUTHENTICATED              = no financial payload
API_ENFORCEMENT_REQUIRED     = YES
NEW_SELLER_ROLE              = NO
```

### Application-map consequence

`Ofertă` and `Lucrare` may contain two semantic money zones for Owner:

```text
COMMERCIAL VALUE
- net client
- VAT
- gross client

INTERNAL ECONOMICS — OWNER ONLY
- planned internal cost / EIC
- actual internal cost when available
- markup
- margin
```

For a normal Cloud `member`, only `COMMERCIAL VALUE` may be present. For Atelier/Execution there is no money section at all.

The UI must consume the already-scoped read model; CSS hiding is never the authorization mechanism.

### Current-page observation

Current `QuoteInspectionPage` and `JobDetailPage` render internal cost/markup/margin only when those keys exist. That is compatible with server-side scoped payloads, but the final UI must visually separate internal economics from customer commercial value rather than presenting them as one generic block.

```text
QUESTION_1 = CLOSED
APPLICATION_MAP_CHANGE = no new page; add actor-scoped money sub-surface semantics
```

---

# 2. Admin self-service vs ADMIN_TOOLING_DEBT — PARTIALLY RESOLVED

## Customer-operable now through UI

### Seller identity

Owner can edit seller/company data on `/admin/seller`. Frozen Quotes keep historical seller identity.

```text
SELLER_ADMIN = CUSTOMER_OPERABLE
```

### People / operator identity

Owner can:

- create operational people;
- rename;
- set/reset operator PIN;
- mark temporary availability;
- assign/remove skills;
- retire a person.

```text
PEOPLE_ADMIN = CUSTOMER_OPERABLE
HR_DEPTH = NOT_REQUIRED
```

### Skills

Owner can create and retire skill definitions; skill assignments are handled on Person.

```text
SKILLS_ADMIN = CUSTOMER_OPERABLE
```

### Internal cost evidence

Owner can create/supersede applicable cost evidence in `/admin/resources` when the projection is write-ready. Resource identity and recipes are not universally authored there.

```text
COST_EVIDENCE_ADMIN = CUSTOMER_OPERABLE
RESOURCE_IDENTITY_AUTHORING = NOT_GENERAL_UI
RECIPE_AUTHORING = NOT_GENERAL_UI
```

### Stock BASIC

Owner can record initial stock / bounded adjustments. Movements and derived balance remain visible.

```text
STOCK_BASIC_ADMIN = CUSTOMER_OPERABLE
PURCHASING_RESERVATIONS_VALUATION = NOT_IMPLEMENTED
```

### Operational service organization mode

Owner can set site-install offer mode:

```text
SERVICE_DISABLED | INTERNAL | SUBCONTRACTED | BOTH
```

on `/admin/operational-services`.

```text
OPERATIONAL_SERVICE_MODE_ADMIN = CUSTOMER_OPERABLE
```

### Customer lifecycle

Current `/admin/customers` supports create / rename / retire and links back to the daily Client workspace.

```text
CUSTOMER_LIFECYCLE_ADMIN = UI_PRESENT
PERMISSION_ENFORCEMENT = VERIFY_AT_FINAL_ACCEPTANCE
```

The UI is functional, but general-customer acceptance must still verify backend Owner enforcement rather than infer it from buttons.

## Material ADMIN_TOOLING_DEBT still open

### Product System authoring

Current `/admin/product-system` persists display labels only. Product composition and adjustable technical settings are still largely typed canonical configuration. The technical-settings canon explicitly says controlled persistent/versioned Owner editing is **not implemented yet**.

```text
PRODUCT_SYSTEM_DISPLAY_LABELS = CUSTOMER_OPERABLE
PRODUCT_SYSTEM_TECHNICAL_SETTINGS = ADMIN_TOOLING_DEBT
PRODUCT_COMPOSITION_AUTHORING = ADMIN_TOOLING_DEBT / VERIFY PER CURRENT TEMPLATE SCOPE
FORM_SCHEMA_AUTHORING = ADMIN_TOOLING_DEBT / VERIFY
```

### Processes

Current `/admin/processes` is a read projection. It explicitly says editing is unavailable.

```text
PROCESS_DEFINITION_ADMIN = READ_ONLY
ADMIN_TOOLING_DEBT = YES if organization-specific process authoring is required
```

### Workcenters / machines

Current `/admin/workcenters` is read-only. It describes capability truth, but does not provide full organization machine/work-area configuration.

```text
WORKCENTER_MACHINE_ADMIN = READ_ONLY
ADMIN_TOOLING_DEBT = YES for general new-organization machine setup
```

## Owner-impact conclusion

For the HUB MEDIA pilot, existing canonical configuration can support the first product-only job without first building universal Admin authoring.

For **general customer readiness**, WorkOS is not yet self-configurable enough. The critical debt is not HR or Reporting; it is:

```text
1. Product System controlled authoring/versioning
2. organization machine/work-area setup where machine-strict operations exist
3. only the process configuration that genuinely varies by organization
```

Do not solve this with source edits per customer.

```text
QUESTION_2 = PARTIALLY_CLOSED
PILOT_BLOCKER = NO, if required current truth already exists
GENERAL_CUSTOMER_BLOCKER = YES
```

---

# 3. Product System admin depth required — RESOLVED AS A TWO-GATE MODEL

## Gate A — Minimum Useful WorkOS / first real pilot

Do **not** build a universal Product System studio before the first real product-only job.

Required now:

- current selected ProductTemplate exists;
- correct component composition exists;
- ProductDefinition/ProductAggregate compile one canonical graph;
- adjustable technical settings used by the pilot have canonical values;
- required resource/cost evidence is customer-operable;
- no runtime source edit is needed during normal processing of that specific job.

Existing template setup may remain platform/product-development managed for the pilot.

## Gate B — General-customer readiness

Before a second/third organization can independently configure its production offer without development intervention, supported administration must cover the legitimately adjustable layer:

```text
Catalog organization
→ family/category/template lifecycle

Template composition
→ choose approved shared component variants / optional modules

Component technical settings
→ persistent + versioned Owner values
→ validate
→ activate new configuration version

Form/schema configuration
→ only fields that are genuinely product-configurable

Historical protection
→ existing accepted Quotes/Orders keep frozen truth
```

What stays product-development/code-owned:

```text
calculation semantics
quantity formulas
compiler behavior
hashing / freeze mechanics
software implementation constants
```

This is the shortest generalizable boundary. It avoids both extremes:

- code fork per organization;
- a no-code programming language inside Product System.

```text
PRODUCT_SYSTEM_RICH_EDITOR = NEXT
FIRST_REAL_JOB_DEPENDENCY = NO
GENERAL_CUSTOMER_READINESS_DEPENDENCY = YES
QUESTION_3 = CLOSED
```

---

# 4. Minimum field execution for installation-inclusive completion — RESOLVED AT ARCHITECTURE LEVEL

Current Operational Services canon already fixes the architecture:

```text
Quote / Acceptance / Order / Production Release
→ ExecutionPlan
→ package kind = atelier | teren
→ tasks
→ actuals
```

Installation must not create a second execution universe.

## Minimum OS-S8 capability

For a frozen Order containing `SITE_INSTALLATION`:

1. create a `teren` work package only after Production Release / explicit plan action;
2. derive field tasks from frozen Order service truth, never from mutable Cerere text;
3. support provider mode `INTERNAL | SUBCONTRACTED` as frozen truth;
4. preserve same task lifecycle semantics used by Execution;
5. surface site context needed by the operator without making ProductDefinition own installation;
6. allow completion/failure/block outcome;
7. do not create profitability or reprice logic.

## Minimum OS-S9 actuals needed to call the installation-inclusive job operationally complete

For `INTERNAL`:

- who executed / crew attribution where applicable;
- actual duration or equivalent service actual needed by the selected policy;
- completion outcome / note;
- applicable consumed service/material evidence only where the selected execution contract requires it.

For `SUBCONTRACTED`:

- provider/supplier evidence associated with the frozen service context;
- completion outcome;
- actual supplier/service cost only when known and permitted as internal actual truth.

Do **not** require before first field completion unless Owner business truth explicitly makes it necessary:

```text
GPS
site photos
advanced access-equipment scheduling
full inventory reservation
Pontaj
profitability
Control Tower
```

`ACCESS_METHOD_AND_EQUIPMENT`, `FIXINGS_CONSUMABLES`, and `SITE_PHOTOS` remain known incomplete facts/capabilities; they must not silently become universal blockers without a separate business decision.

```text
INSTALLATION_FULL_E2E_MINIMUM = OS-S8 + minimum OS-S9
OS-S10_PROFITABILITY_REQUIRED = NO
QUESTION_4 = CLOSED_AT_ARCHITECTURE_LEVEL
RUNTIME_IMPLEMENTATION = NOT_AUTHORIZED
```

---

# 5. Shop Floor — NEXT only when a coordination problem is demonstrated

Shop Floor remains a valid OLD job, but is not a first-job prerequisite.

```text
ATELIER
answers: what can/should I execute now?

SHOP_FLOOR_OVERVIEW
would answer: what is happening across the workshop now?
```

The second view should be built only when Lucrări + Atelier no longer give a manager enough situational awareness because multiple jobs/workcenters/tasks are active concurrently.

### Trigger

Promote Shop Floor from reserve to implementation candidate when real use repeatedly requires a cross-job, cross-workcenter operational overview.

Do not require an arbitrary number of jobs; use demonstrated coordination pain.

```text
SHOP_FLOOR = NEXT_CONDITIONAL
FIRST_REAL_JOB_BLOCKER = NO
AUTO_NEXT_AFTER_FIRST_JOB = NO
QUESTION_5 = CLOSED
```

---

# 6. Tablet / kiosk strategy — ARCHITECTURE CLOSED, UX EVIDENCE OPEN

There must be one Execution truth.

```text
Desktop / normal
Atelier → Execution

Tablet / kiosk
same routes/contracts/state machine
→ responsive or attention-focused presentation
```

Do not restore OLD `/tablet/*` as a separate operational authority.

The exact kiosk shell, station-selection behavior and breakpoints must be decided from real workshop observation after the core responsive Execution surface exists.

```text
TABLET_SEPARATE_BACKEND = NO
TABLET_SEPARATE_TASK_MODEL = NO
TABLET_PRESENTATION_MODE = POSSIBLE_LATER
FIRST_REAL_JOB = use responsive core when sufficient
QUESTION_6_ARCHITECTURE = CLOSED
QUESTION_6_VISUAL_DETAILS = EVIDENCE_DEPENDENT
```

---

# 7. Supplier master trigger — RESOLVED WITHOUT AN ARBITRARY COUNT

Current subcontract installation cost evidence can carry supplier label + validity directly with the cost-evidence row. That is enough for an isolated pilot.

Do **not** build a Supplier master merely because OLD had `/colaboratori`.

Create a reusable Supplier domain/registry when supplier identity needs independent lifecycle outside a single evidence row, for example when the same supplier must be referenced by two or more business contexts such as:

```text
cost evidence
+ execution/provider assignment
+ purchasing
+ contact / legal identity
+ contract validity
+ multiple operational services
```

The trigger is **cross-domain reuse/lifecycle**, not a magic row count.

```text
SUPPLIER_MASTER = NEXT_OPTIONAL
CURRENT_COST_EVIDENCE_SUPPLIER_LABEL = SUFFICIENT_FOR_ISOLATED_PILOT
QUESTION_7 = CLOSED
```

---

# 8. Reporting / Control Tower — RESOLVED AS AN EVIDENCE-BUILT PROJECTION

Do not choose a final Reporting route/name or dashboard layout before real operational history exists.

First feedback loop remains contextual:

```text
Lucrare / Execution
→ Planned vs Actual
```

After real jobs accumulate:

```text
canonical actuals
→ repeated management question
→ metric definition
→ read-only projection
→ report / overview
```

Possible later projections may include:

- completion / delay patterns;
- planned-vs-actual quantity or duration deviation;
- workcenter load/throughput when capacity exists;
- Owner-only profitability after actual cost truth exists.

No report may become a second source of business truth or feed back into historical Quote values.

`Home / Control Tower` remains unaccepted until there is a proven cross-domain daily job that cannot be served by Lucrări plus domain registries.

```text
PLANNED_VS_ACTUAL_CONTEXTUAL = CORE_NOW
OPERATIONAL_REPORTING = NEXT_OR_LATER_BY_EVIDENCE
PROFITABILITY = LATER / OWNER_ONLY
CONTROL_TOWER = LATER / UNACCEPTED
FINAL_REPORT_ROUTE = UNDECIDED_BY_DESIGN
QUESTION_8 = CLOSED_AT_PRODUCT_LEVEL
```

---

# Resulting Minimum Useful WorkOS decision

The unresolved-item review does **not** justify expanding the first useful slice.

The fastest product-only vertical remains:

```text
Client
→ Cerere
→ Catalog
→ Configurator
→ Quote
→ Acceptance
→ Lucrare
→ Release / Plan
→ Atelier
→ Execution
→ Complete
→ Planned vs Actual
```

The most important pre-general-customer debt discovered is configuration self-service, especially Product System and machine/work-area setup. It should be solved **after** the first real job proves the core, unless the selected pilot itself cannot proceed without a missing Admin write.

## Updated readiness statuses

```text
MONEY_VISIBILITY                         = CLOSED
ADMIN_TOOLING_DEBT_MAP                   = MATERIAL_GAPS_IDENTIFIED
PRODUCT_SYSTEM_PILOT_DEPTH               = CLOSED
PRODUCT_SYSTEM_GENERAL_CUSTOMER_DEPTH    = CLOSED_AS_TARGET / NOT_IMPLEMENTED
FIELD_EXECUTION_MINIMUM                  = CLOSED_AS_TARGET / NOT_IMPLEMENTED
SHOP_FLOOR_POSITION                      = CLOSED / NEXT_CONDITIONAL
TABLET_ARCHITECTURE                      = CLOSED / VISUAL_EVIDENCE_LATER
SUPPLIER_MASTER_TRIGGER                  = CLOSED
REPORTING_PRODUCT_POSITION               = CLOSED / ROUTE_UNDECIDED
```

## Application Map consequence

The final map can now distinguish:

```text
CORE NOW
SUPPORT CORE
NEXT-CONDITIONAL
LATER / OPTIONAL
INTERNAL
RETIRE
```

without using OLD page count as scope.

## Remaining work before final flowchart

1. finish Design Bible gate;
2. reconcile this checkpoint into the application inventory;
3. verify any Admin permission ambiguity that matters to the chosen pilot;
4. build the final page × floorplan × actor × lifecycle matrix;
5. draw the full application/system flowchart only after those are stable.

## Stop rules

```text
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
FIGMA_APPLICATION_SCREEN_BUILD = HOLD
REAL_CLOUD_MUTATION = OWNER_GATE_ONLY
NEW_DOMAIN = HOLD
```
