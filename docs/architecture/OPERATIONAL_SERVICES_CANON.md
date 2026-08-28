# Operational Services canon

Application-wide law for optional operational services that travel with a commercial job: capability, organization offer, Request selection, per-request facts, cost evidence, service EIC, service commercial price, Quote lines, Order copy, execution packages, actuals, and profitability.

Runtime wins if this document disagrees with implemented code.
Do not treat target law as implemented.

Installation-specific facts live in `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`.
Commercial strategy ownership lives in `docs/architecture/COMMERCIAL_PRICE_RULES_CANON.md`.
Sequence and status live in `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.

```text
ARCHITECTURE_DIRECTION     = OWNER_ACCEPTED_WITH_AMENDMENTS
OPERATIONAL_SERVICES_SPINE = OWNER_ACCEPTED
INSTALLATION_ROLE          = FIRST_REAL_CAPABILITY
OWNER_DECISION_DATE        = 2026-08-28
OS_S1                      = READY_FOR_SEPARATE_OWNER_GO
OS_S1_IMPLEMENTATION       = NOT_AUTHORIZED
OS_S2_TO_OS_S11            = NOT_STARTED
PHASE_2_IMPLEMENTATION     = NOT_AUTHORIZED
TRANSPORT_IMPLEMENTATION   = NOT_AUTHORIZED
NO_CLIENT_CODE_FORK        = YES
```

## How to read this document

```text
CURRENT_RUNTIME         = what code does today
OWNER_ACCEPTED_TARGET   = accepted law, not yet implemented unless also CURRENT_RUNTIME
NOT_IMPLEMENTED         = accepted or planned, absent from runtime
FUTURE_SLICE            = OS-S1 … OS-S11 that may implement the target
```

Names below are working architecture labels, not final TypeScript identities.

## Permanent ownership

```text
Request              = mutable client intent + selected services + office service facts
Product Truth        = what is manufactured
Service Config       = how associated work is performed for this job
Resources / Cost     = identities and internal or supplier evidence
EIC                  = internal estimate per product or per service
Commercial Price     = customer price per line
Quote                = immutable offered lines
Order                = immutable accepted truth
ExecutionPlan        = tasks derived from frozen Order / Release
Actuals              = what really happened
Profitability        = comparison, never repricing
People               = who may execute; not the sold rate
Inventory            = optional stock movements; not required to sell a service
Organization config  = what the company offers
```

Rejected leaks:

```text
INSTALLATION_AS_LETTERS_MODULE
INSTALLATION_AS_PRODUCTDEFINITION_FIELD
TRANSPORT_NESTED_IN_INSTALLATION
CUSTOMER_PRICE_AS_EIC
SERVICE_COST_PLUS
EMPLOYEE_WAGE_OR_PONTAJ_AS_CUSTOMER_PRICE
WORKSHOP_LED_OR_ELECTRICAL_AS_SITE_INSTALL
WORKSHOP_MACHINE_AS_ACCESS_EQUIPMENT
FIELD_TASKS_FROM_CERERE_OR_DESCRIPTION
HUB_MEDIA_RATES_HARDCODED
GLOBAL_SETTINGS_DUMP
QUOTE_REPRICE_FROM_ACTUALS
OLD_MONTAJ_PLUS_TRANSPORT_SKU
CLIENT_CODE_FORK
```

---

## Capability catalog

`CURRENT_RUNTIME`: one optional scope id, `SITE_INSTALLATION`. Registry is `OPTIONAL_COMMERCIAL_SCOPE_IDS`. Transport is not a selectable scope. The install projection still emits `TRANSPORT_UNCONFIRMED` as an installation incomplete reason. That is a runtime honesty label, not a transport engine.

`OWNER_ACCEPTED_TARGET`: a thin platform catalog of operational-service capabilities. V1 offered capability: `SITE_INSTALLATION`. V1 reserved capability, not selectable until its slice: `TRANSPORT`. Measurement, access equipment, and site electrical are **typed installation facts**, not sold capabilities.

`FUTURE_SLICE`: OS-S1 introduces the catalog and stops treating transport as an installation EIC reason. OS-S6 offers `TRANSPORT`.

---

## Organization service configuration

`CURRENT_RUNTIME`: no org-level on/off. Every organization sees the Cerere montaj checkbox. New Cerere defaults to unselected.

`OWNER_ACCEPTED_TARGET`:

```text
Q_ORG_DEFAULT              = SERVICE_DISABLED
AVAILABLE_ORG_MODES        = SERVICE_DISABLED | INTERNAL | SUBCONTRACTED | BOTH
NEW_ORGANIZATION_DEFAULT   = SERVICE_DISABLED
HUB_MEDIA                  = first validation organization, not a code fork
CONFIGURATION_SURFACE      = Administrare → Operațiuni, domain-owned; not a Settings dump
OWNER_WRITE                = YES
```

Disabled: silent — no checkbox, no service EIC, no extra freeze rule.
INTERNAL / SUBCONTRACTED: org offers that path.
BOTH: org allows both; the Cerere chooses one mode per job.
Later enablement is allowed. Live disable does not rewrite frozen Quotes or Orders.

`FUTURE_SLICE`: OS-S1 persists org configuration. OS-S11 completes multi-company admin.

---

## Request service selection

`CURRENT_RUNTIME`: `optionalScopeIds` on CommercialRequest, persisted in `commercial_request_optional_scopes`. Any Cloud member may PATCH selection. After a Quote is linked, `customerId` is locked; **selection remains mutable**.

`OWNER_ACCEPTED_TARGET`:

```text
Q_LOCK_AFTER_QUOTE = LOCK_SELECTION_AND_MODE_AFTER_FIRST_LINKED_QUOTE
```

Unselected remains silent. Selected services stay office facts until freeze. After the first linked Quote, selection and mode lock. A later explicit Request/Quote revision workflow may allow controlled changes without rewriting historical snapshots. That workflow is **NOT_IMPLEMENTED** and is not OS-S1.

Org must offer the capability; otherwise the control is silent.

`FUTURE_SLICE`: OS-S1 implements the lock and org gate.

---

## Per-request service configuration

`CURRENT_RUNTIME`: no typed site facts. Selected install always shows five static incomplete reasons.

`OWNER_ACCEPTED_TARGET`: typed facts on `(requestId, capabilityId)`. Not Product Truth. Not a generic JSON bag.

Installation facts — see the installation canon. In this spine:

```text
Q_FACT_VS_SERVICE =
  MEASUREMENT_ACCESS_SITE_ELECTRICAL_ARE_TYPED_INSTALLATION_FACTS
  TRANSPORT_REMAINS_SEPARATE_CAPABILITY
```

Transport facts belong to `TRANSPORT`, never inside installation EIC.

`FUTURE_SLICE`: OS-S2.

---

## Provider mode

`CURRENT_RUNTIME`: not modeled. Selection is boolean only.

`OWNER_ACCEPTED_TARGET`:

```text
NOT_SELECTED
INTERNAL
SUBCONTRACTED
```

Mode is required once the service is selected and the org is not `SERVICE_DISABLED`. Constrained by org allowed modes. Hidden when the org offers only one path. Frozen onto the later Quote line.

`FUTURE_SLICE`: OS-S1 persists mode. Completeness rows that depend on mode land in OS-S2 / OS-S3.

---

## Resources / Cost evidence

`CURRENT_RUNTIME`: workshop catalog only. Units `m` / `m2` / `buc`. Owner can supersede amounts on `/admin/resources`. No site-install labor, no supplier identity, no validity window, no person-hour unit.

`OWNER_ACCEPTED_TARGET`:

```text
INTERNAL_LABOR_RATE ≠ EMPLOYEE_SALARY
INTERNAL_LABOR_RATE ≠ CUSTOMER_PRICE
PONTAJ_ACTUALS      ≠ COMMERCIAL_FORMULA
Q_INTERNAL_UNIT     = EUR_PER_PERSON_HOUR
INTERNAL_LABOR_EIC  = crew_size × planned_duration_hours × internal_site_labor_rate_per_person_hour
Q_SUBCONTRACT_VALIDITY = COST_PER_JOB_WITH_VALIDITY_WINDOW
FIXINGS_CONSUMABLES =
  typed resource lines;
  package-per-job allowed;
  Inventory optional
```

Workshop LETTERS recipes, `SVC-PLACE-LED-MODULES`, and `SVC-ELECTRICAL-FINISH` must not be reused as site install. Access equipment is not a shop-floor CNC/weld machine.

`FUTURE_SLICE`: OS-S3. Do not invent EUR amounts in documentation or code.

---

## Service EIC

`CURRENT_RUNTIME`: selected `SITE_INSTALLATION` projects a PARTIAL `EicResult` with empty lines and total 0. Operator view strips money. Freeze and link refuse `incomplete_offer`. There is no COMPLETE path.

`OWNER_ACCEPTED_TARGET`: each selected capability has its own EIC compiler and `EicResult`. COMPLETE only when every **applicable** internal or supplier row has Owner-confirmed evidence. Customer selling price cannot complete EIC. Transport completeness is a separate `TRANSPORT_EIC` gate.

Person-hour labor math is **TARGET_ONLY**. Runtime has no hour unit and no crew/duration inputs.

`FUTURE_SLICE`: OS-S3.

---

## Service commercial price

`CURRENT_RUNTIME`: `projectCommercialPrice` is the only projector and is cost-plus on EIC. Selected install therefore projects PARTIAL commercial from a 0 total. `200 EUR + TVA` is not in code.

`OWNER_ACCEPTED_TARGET`:

```text
SERVICE_COMMERCIAL_STRATEGY = MANUAL_FIXED_PER_REQUEST
PRODUCT_STRATEGY            = COST_PLUS   (unchanged)
SERVICE_COST_PLUS           = REJECTED
FIRST_REAL_JOB_PRICE        = 200 EUR + TVA
NOT_ORG_UNIVERSAL_DEFAULT   = YES
NOT_EIC                     = YES
```

The first real installation offer uses `200 EUR + TVA` as a **manual fixed customer price on that Request/offer**. It is not a company list price, not install EIC, and not markup on install EIC. It may be frozen only after required readiness gates (selected service facts and install EIC COMPLETE, plus the later multi-line Quote). Later policy or rate changes never rewrite frozen Quotes.

See `docs/architecture/COMMERCIAL_PRICE_RULES_CANON.md`.

`FUTURE_SLICE`: OS-S4 projection; OS-S5 freeze.

---

## Quote service lines

`CURRENT_RUNTIME`: Quote Snapshot schema v1 is product-only: one EIC, one commercial block, one LETTERS `productionInput`.

`OWNER_ACCEPTED_TARGET`: one Quote Snapshot, additive lines (product, installation, optional transport), one job total. Historical v1 snapshots stay readable. Hashes of old snapshots are not rewritten.

`FUTURE_SLICE`: OS-S5. `QUOTE_CREATE = NO` until an explicit later GO.

---

## Order service truth

`CURRENT_RUNTIME`: Order copies the accepted product freeze. No service package.

`OWNER_ACCEPTED_TARGET`: Order copies all frozen lines. Copy, do not recalculate.

`FUTURE_SLICE`: OS-S7.

---

## Execution work packages

`CURRENT_RUNTIME`: one ExecutionPlan from ORDER or PILOT snapshot. LETTERS workshop DAG, 12 tasks. Installation does not leak into that DAG.

`OWNER_ACCEPTED_TARGET`: same plan/task model, package kind `atelier` | `teren` | later logistics. Tasks exist only after Quote → Acceptance → Order → Production Release → explicit plan action. Never from Cerere or description.

`FUTURE_SLICE`: OS-S8.

---

## Actuals

`CURRENT_RUNTIME`: workshop `ActualConsumptionEntry` plus actual internal cost from frozen snapshot rates. Pontaj is `NOT_IMPLEMENTED`.

`OWNER_ACCEPTED_TARGET`: reuse the actuals pattern for field and subcontract quantities. Pontaj, if added later, is a signal. It is not the commercial formula.

`FUTURE_SLICE`: OS-S9.

---

## Profitability

`CURRENT_RUNTIME`: no profitability domain. Execution can show planned-versus-actual quantities and owner-scoped actual internal cost.

`OWNER_ACCEPTED_TARGET`: read-only Reporting projection: frozen sold price, frozen planned EIC, actuals. Never reprices.

`FUTURE_SLICE`: OS-S10.

---

## Multi-company behavior

```text
CURRENT_RUNTIME              = one codebase; plane isolation; no org service flag
OWNER_ACCEPTED_TARGET        = plane-local org service config; HUB MEDIA enables INTERNAL later; a company without teren stays DISABLED
CUSTOMER_OPERABLE_WITHOUT_CURSOR = required after the matching slices deploy
ADMIN_TOOLING_DEBT           = YES until OS-S1 / OS-S11
```

---

## Permissions

| Action | CURRENT_RUNTIME | OWNER_ACCEPTED_TARGET |
| --- | --- | --- |
| Select a service on Cerere | Any member, always visible | Any member, only if org offers it |
| Change selection after first linked Quote | Allowed | Locked (OS-S1) |
| Write cost evidence | Owner | Owner |
| Configure org services | Absent | Owner |
| Freeze Quote | Product COMPLETE; install selected → refused | All selected service lines COMPLETE under their own commercial rule |
| Create field tasks | Absent | Only from frozen Order / Release |
| See money | ALT_B_SCOPED | Unchanged |

---

## Lifecycle and snapshots

```text
Organization enables capability
→ Request selects service
→ facts + mode
→ evidence resolved
→ service EIC COMPLETE
→ manual fixed commercial on that Request
→ Quote lines frozen
→ Acceptance
→ Order copies
→ Release
→ atelier + teren packages
→ assignment
→ actuals
→ profitability
→ recommendations without retroactive repricing
```

Immutable boundaries begin at Quote freeze. Request stays mutable office truth except for the approved V1 lock after the first linked Quote.

---

## Implementation program

None of these slices is authorized by this document.

| Slice | Purpose | Status |
| --- | --- | --- |
| OS-S1 | Org capability, request mode, lock after Quote, remove transport from install reasons | `READY_FOR_SEPARATE_OWNER_GO` |
| OS-S2 | Typed install facts | `NOT_STARTED` |
| OS-S3 | Evidence and service EIC | `NOT_STARTED` |
| OS-S4 | Manual fixed service commercial | `NOT_STARTED` |
| OS-S5 | Multi-line Quote | `NOT_STARTED` |
| OS-S6 | Transport capability | `NOT_STARTED` |
| OS-S7 | Order copies service lines | `NOT_STARTED` |
| OS-S8 | Field execution package | `NOT_STARTED` |
| OS-S9 | Service actuals | `NOT_STARTED` |
| OS-S10 | Profitability projection | `NOT_STARTED` |
| OS-S11 | Admin and multi-company readiness | `NOT_STARTED` |

OS-S1 is the next candidate slice in the living V1 roadmap. It does not invent rates, complete install EIC, add Quote lines, or create teren tasks.

Every future Owner-facing page for this program requires an old-versus-new UI/UX/code audit before implementation.

---

## Runtime gaps versus target

| Gap | CURRENT_RUNTIME | Closes in |
| --- | --- | --- |
| No org service configuration | Checkbox always shown | OS-S1 |
| Selection mutable after linked Quote | `optionalScopeIds` still PATCH-able | OS-S1 |
| Transport reason inside install | `TRANSPORT_UNCONFIRMED` | OS-S1 / OS-S6 |
| No mode | Boolean selection only | OS-S1 |
| No site facts | Static reasons | OS-S2 |
| No person-hour labor evidence | Workshop units only | OS-S3 |
| No supplier validity | Supersede only | OS-S3 |
| Cost-plus is the only projector | `projectCommercialPrice` | OS-S4 |
| Quote is product-only | Schema v1 | OS-S5 |
| No transport capability | Not selectable | OS-S6 |
| No teren package | LETTERS DAG only | OS-S8 |
| No profitability domain | Absent | OS-S10 |
