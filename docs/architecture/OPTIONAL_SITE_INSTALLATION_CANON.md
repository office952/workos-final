# Optional site installation canon

Installation-specific law for the first Operational Services capability.
Application-wide spine: `docs/architecture/OPERATIONAL_SERVICES_CANON.md`.
Runtime wins if this document disagrees.

```text
CAPABILITY_NAME        = OPTIONAL_SITE_INSTALLATION
STABLE_SCOPE_ID        = SITE_INSTALLATION
INSTALLATION_ROLE      = FIRST_REAL_CAPABILITY
DEFAULT_REQUEST_STATE  = UNSELECTED
CONFIGURATION_SURFACE  = Cerere → Montaj la locație
PRODUCT_RELATION       = associated scope, never a LETTERS component or module
NO_CLIENT_CODE_FORK    = YES
```

## Owner decision 2026-08-28

Phase 1 integration recorded earlier the same day. Architecture closure below does not authorize implementation.

```text
PHASE_1                    = INTEGRATED_ON_MAIN
MAIN_SHA                   = 2596cd076af631b1679c4530df90dcf22de46bbb
MAIN_CI_RUN                = 33187511745
MAIN_CI_STATUS             = SUCCESS
PHASE_2                    = IMPLEMENTED_LOCAL_IN_REVIEW
PHASE_2_WRITE              = OS_S2_FACTS_ONLY
OS_S1                      = IMPLEMENTED_CURRENT / BASIC
OS_S1_IMPLEMENTATION       = INTEGRATED_ON_MAIN
OS_S2_DESIGN               = OWNER_ACCEPTED
OS_S2_IMPLEMENTATION       = IMPLEMENTED_LOCAL_IN_REVIEW
TRANSPORT_IMPLEMENTATION   = NOT_STARTED / NOT_AUTHORIZED
LIVE_REQUEST_PATCH         = NO
QUOTE_CREATE               = NO
INSTALLATION_MODES         = INTERNAL + SUBCONTRACTED
TRANSPORT_MODEL            = SEPARATE_OPTIONAL_CAPABILITY
MONTAJ_200_EUR_PLUS_VAT    = MANUAL_FIXED_PER_REQUEST / FIRST_REAL_JOB_ONLY
ORPHAN_LINK_GATE           = CLOSED
OLD_VS_NEW_CERERE_CONFIGURATOR_AUDIT = CLOSED_WITH_ADVISORIES
AUDIT_GATE                 = CLOSED_WITH_ADVISORIES
AUDIT_MODE                 = READ_ONLY
AUDIT_REOPENS_PHASE_1      = NO
ARCHITECTURE_DIRECTION     = OWNER_ACCEPTED_WITH_AMENDMENTS
```

Historical branch state before integration: `STOPPED_ON_BRANCH` on `feat/optional-site-installation-v1`.

Approved installation laws (target; not runtime unless marked CURRENT_RUNTIME):

```text
Q_ORG_DEFAULT              = SERVICE_DISABLED
Q_LOCK_AFTER_QUOTE         = LOCK_SELECTION_AND_MODE_AFTER_FIRST_LINKED_QUOTE
Q_FACT_VS_SERVICE          = MEASUREMENT_ACCESS_SITE_ELECTRICAL_ARE_TYPED_INSTALLATION_FACTS
Q_INSTALL_COMMERCIAL       = MANUAL_FIXED_PER_REQUEST
FIRST_REAL_JOB_PRICE       = 200 EUR + TVA
NOT_ORG_UNIVERSAL_DEFAULT  = YES
NOT_EIC                    = YES
NOT_COST_PLUS              = YES
Q_INTERNAL_UNIT            = EUR_PER_PERSON_HOUR
INTERNAL_LABOR_EIC         = crew_size × planned_duration_hours × internal_site_labor_rate_per_person_hour
INTERNAL_LABOR_RATE        ≠ EMPLOYEE_SALARY
INTERNAL_LABOR_RATE        ≠ CUSTOMER_PRICE
PONTAJ_ACTUALS             ≠ COMMERCIAL_FORMULA
Q_SUBCONTRACT_VALIDITY     = COST_PER_JOB_WITH_VALIDITY_WINDOW
Q_ACCESS_TRIGGER           = OFFICE_EXPLICITLY_SELECTS_ACCESS_METHOD_AND_EQUIPMENT_REQUIREMENT
FIXINGS_CONSUMABLES        = typed resource lines; package-per-job allowed; Inventory optional
SITE_ELECTRICAL            = UNCONFIRMED | INCLUDED | SUBCONTRACTED | EXCLUDED_CUSTOMER_RESPONSIBILITY | NOT_APPLICABLE
```

`200 EUR + TVA` is the first real installation Request/offer selling price. It is not an organization-wide list price, not internal cost, not subcontract cost, and it cannot make `INSTALLATION_EIC` COMPLETE. Completing install EIC must not activate product cost-plus on that service.

Transport is a separate Operational Services capability with its own EIC and commercial price. It may exist with or without montaj. It is not an installation subcomponent and must not remain an installation incomplete reason after OS-S1.

Owner-confirmed internal evidence is still required before any later EIC write: internal person-hour labor; subcontract cost per job with validity; consumables and fixings; access equipment when the office selects it; site electrical when included or subcontracted.

Migration safety lives in `docs/architecture/OPERATIONAL_SERVICES_CANON.md`. A persisted `SITE_INSTALLATION` selection stays visible and keeps its freeze/link gate if the organization has no config or is later disabled. Missing config is `SERVICE_DISABLED` only for new selections. Mode is not inferred.

## Permanent separation

```text
LETTERS Product Truth     workshop manufacture
SITE_INSTALLATION         associated scope on the same Request / later job
EIC                       separate product / installation
Commercial projection     separate product / installation
Quote (Phase 3)           one Quote Snapshot with separate immutable lines
Execution (Phase 5)       atelier tasks vs teren tasks
```

Montajul nu este FACE, VOLUME, BACK, LIGHTING, ProductDefinition LETTERS, EIC-ul LETTERS, cele 12 taskuri LETTERS, sau prețul produsului.

Do not parse the Request description. Selection is an explicit office fact.

## Phase 1 — current runtime

```text
PHASE_1 = OPTIONAL_INSTALLATION_PARTIAL_FOUNDATION
STATUS  = INTEGRATED_ON_MAIN
MAIN_SHA = 2596cd076af631b1679c4530df90dcf22de46bbb
MAIN_CI_RUN = 33187511745
MAIN_CI_STATUS = SUCCESS
```

Unselected: no install EIC, no install commercial projection, no install UI section on the confirmed product, no extra freeze rule.

Selected:

- separate PARTIAL EIC with empty lines and typed missing-evidence reasons
- separate PARTIAL commercial projection via the current product projector `projectCommercialPrice` only. That is CURRENT_RUNTIME, not the accepted service strategy
- operator view does not present 0 EUR as cost or price
- **Creează oferta** stays visible and disabled, with reason `Montajul nu are încă un cost complet.`
- quote-snapshot POST refuses `incomplete_offer` before `freezeQuoteSnapshot`, `persistQuoteSnapshot`, and `linkRequestQuote`
- `linkCommercialRequestQuote` reuses the same readiness refusal before inserting `commercial_request_quote_links`. A product-only orphan Quote may still be created. Linking it to a Request whose selected installation scope is not COMPLETE is refused. The Quote is not rewritten. When installation EIC becomes COMPLETE, the same check allows the link.

Persistence: additive `commercial_request_optional_scopes (request_id, scope_id, selected_at)`, primary key `(request_id, scope_id)`. Existing requests read `optionalScopeIds = []`. No seed. No backfill.

Owner-accepted modes, not implemented now:

```text
NOT_SELECTED
INTERNAL
SUBCONTRACTED
```

`CURRENT_RUNTIME` locks selection and mode after the first linked Quote. A later revision workflow is **NOT_IMPLEMENTED**.

## Phase 2 — completeness contract (design accepted; write not authorized)

Montajul is a reusable service for more than one product and company. Completeness facts are typed. They are not all mandatory. A fact becomes required only when the selected mode or site condition needs it.

OS-S2 typed shape — Owner-accepted and implemented locally in review:

```text
ADDRESS_MODEL = STRUCTURED_REQUEST_OWNED
REUSABLE_LOCATION_ENTITY = NO_IN_V1
siteName?
street
city
county?
postalCode?
countryCode = RO
contactName?
contactPhone?
accessNotes?

measurementStatus = UNCONFIRMED | CUSTOMER_PROVIDED | OFFICE_MEASURED
mountingSurfaceWidthMm?
mountingSurfaceHeightMm?
installationElevationMm?
measuredAt?
measurementNotes?
PRODUCT_WIDTH = NO
PRODUCT_HEIGHT = NO
PRODUCT_AREA = NO
PRODUCT_PERIMETER = NO
confirmedAreaMm2 = NO

facadeType =
  UNCONFIRMED | CONCRETE | BRICK | METAL | ACM | THERMAL_INSULATION |
  DRYWALL | GLASS | WOOD | OTHER
fixingMethod =
  UNCONFIRMED | MECHANICAL_ANCHOR | CHEMICAL_ANCHOR | SCREW | RIVET |
  ADHESIVE | SUBSTRUCTURE | OTHER
OTHER_REQUIRES_NOTE = YES
ADMIN_FACADE_FIXING_CATALOG = NO

siteElectrical =
  UNCONFIRMED | INCLUDED | SUBCONTRACTED |
  EXCLUDED_CUSTOMER_RESPONSIBILITY | NOT_APPLICABLE
NOT_APPLICABLE = explicit selection, not fallback

MODEL = ONE_TYPED_ROW_PER_REQUEST_AND_CAPABILITY
TABLE = commercial_request_installation_facts
JSON = NO
SEED = NO
BACKFILL = NO
MIGRATION = ADDITIVE
DESELECT = DELETE fact row; UI confirmation if facts exist
```

The address is distinct from the Customer address. The structure may later accept a reusable location registry. Do not build that registry in OS-S2.

| Fact | When applicable |
| --- | --- |
| Execution site address, distinct from customer address | Selected install |
| Site measurements | Internal or subcontracted install that prices from geometry |
| Height and access method | When the office explicitly selects the access method and whether access equipment is required |
| Support / facade | Always when install is selected |
| Fixing system | Always when install is selected |
| Transport | Separate capability; not an installation completeness fact. `CURRENT_RUNTIME` no longer lists `TRANSPORT_UNCONFIRMED` inside install reasons |
| Distance / travel | Only if Owner policy requires it |
| Unload and handling | When site access is not workshop-equivalent |
| Site electrical connection | When the office contract is `INCLUDED` or `SUBCONTRACTED`. `EXCLUDED_CUSTOMER_RESPONSIBILITY` and `NOT_APPLICABLE` need no electrical cost row |
| Crew size | Internal install |
| Estimated internal duration | Internal install |
| Access equipment | When the office explicitly marks access equipment required |
| Install consumables | When the chosen fixing system has typed resource lines. A package-per-job is allowed. Inventory is optional |
| Internal vs subcontractor provider | When mode is chosen |
| Valid cost evidence | Always before INSTALLATION_EIC can be COMPLETE |
| Exclusions and customer responsibilities | Always on a COMPLETE commercial install offer |

Economic rules:

- installation has its own EIC
- internal cost is not customer price
- internal labor rate is not employee salary and not the customer price
- pontaj actuals are not the commercial formula
- internal labor EIC, when implemented, is crew × planned hours × Owner-confirmed person-hour rate
- machines and capacity do not become automatic commercial rates
- subcontracting consumes valid cost-per-job evidence with a validity window
- a customer selling price does not complete installation EIC
- `200 EUR + TVA` is a manual fixed price for the first real installation Request/offer, not an org-wide default
- completing install EIC must not activate product cost-plus on the service
- missing rates stay PARTIAL
- no zero fallback

### Owner data gate — PARTIAL → COMPLETE

Do not invent EUR amounts. Confirm these values before Phase 2 write.

| COST_ELEMENT | UNIT | WHEN_APPLICABLE | REQUIRED_OWNER_VALUE | EXISTING_EVIDENCE | MISSING_EVIDENCE | RECOMMENDED_CONFIGURATION_SURFACE |
| --- | --- | --- | --- | --- | --- | --- |
| Internal install labor | EUR / person-hour | INTERNAL | Owner-confirmed site labor rate. EIC = crew × planned hours × rate. Not workshop forming/CNC. Not salary | Workshop LETTERS labor/service recipes exist; they are manufacture, not site install | Site-install labor evidence and person-hour unit | Resources / Cost — new install resource, not a LETTERS recipe |
| Subcontracted install | EUR / job + validity window | SUBCONTRACTED | Valid supplier cost evidence and validity window | None | All | Resources / Cost — supplier evidence, not a commercial markup |
| Fixing / consumables | EUR / documented unit | When the chosen fixing has typed lines | Resource identity + amount + classification. Package-per-job allowed. Inventory optional | None for facade fixings | All | Resources / Cost |
| Access equipment | EUR / documented unit | Office explicitly requires access equipment | Hire or owned-equipment cost evidence | Shop-floor machines are workshop CNC/weld/forming | Site-access equipment | Resources / Cost or later provider catalog — not a workshop machine |
| Transport | EUR / trip or EUR / km | Separate capability; with or without montaj | Transport cost evidence for TRANSPORT_EIC, then own commercial price | None | All | Own capability / Resources / Cost — not inside installation EIC |
| Travel / distance | EUR / km or included | Only if Owner policy requires it | Policy + rate | None | All | Commercial / install policy, not Product System settings |
| Site electrical attendance | EUR / job | When contract is INCLUDED or SUBCONTRACTED | Cost evidence for those modes. EXCLUDED_CUSTOMER_RESPONSIBILITY and NOT_APPLICABLE need no cost row | LETTERS electrical finish is workshop close-out | Site electrical | Resources / Cost or exclusion text |
| LED mount service | do not reuse | Never as site install | — | `LED installation service` is workshop module mounting | Must not be copied | Keep on LETTERS LIGHTING only |

`INSTALLATION_EIC = COMPLETE` only when every applicable installation row has Owner-confirmed **internal** evidence. Customer `200 EUR + TVA` does not satisfy this gate and must not trigger cost-plus. Transport completeness is a separate `TRANSPORT_EIC` gate. OS-S2 design decisions 1–5 are closed. OS-S2 write is implemented locally in review. OS-S3 remains closed until a later Owner GO.

## Phase 3 — one Quote, separate lines (not implemented)

```text
One Request
→ one product configuration
→ zero or more optional commercial scopes
→ one Quote Snapshot
→ separate immutable Quote Lines
→ one commercial total
```

Current Quote Snapshot is product-only. Historical snapshots stay readable. Phase 3 must add lines additively and must not rewrite existing hashes.

Target lines:

| Line | EIC | Commercial price | Execution |
| --- | --- | --- | --- |
| LETTERS product | own | own | workshop processes |
| Site installation | own | own | site processes |
| Transport | own | own | logistics |
| Height access, if later separate | own | own | resource/service |

`TRANSPORT_MODEL = SEPARATE_OPTIONAL_CAPABILITY`. Transport is not nested under montaj. Height access stays an installation fact until a later Owner decision. Current law has no transport commercial engine yet. Do not invent both a line and a hidden subcomponent for the same cost. The old-app SKU “Montaj + transport” is rejected.

Frozen line facts: identity, commercial label, quantity and commercial unit, planned EIC used, commercial policy, net / VAT / gross per line, grand total, relevant technical configuration, version and provenance.

PDF target: product, installation, optional transport, optional access, net subtotal, VAT, total, included, excluded. `OWNER_AUTHORIZED_SYNTHETIC_PILOT` must be visible on preview/PDF when the offer uses synthetic data. Do not create a live PDF now.

## Phase 4 — first real job resume (not implemented)

```text
Owner confirms installation evidence
→ installation EIC COMPLETE
→ product EIC remains COMPLETE
→ Quote preview with separate lines
→ Owner price review
→ explicit QUOTE_CREATE GO
→ freeze Quote Snapshot
→ verify PDF
→ Owner Acceptance GO
→ Order
→ Production Release
→ ExecutionPlan
```

No single Owner confirm authorizes the whole chain. `CER-E5D190D8` is not patched until an explicit single-PATCH GO.

## Phase 5 — execution (not implemented)

Installation tasks exist only after Quote → Acceptance → Order → Production Release. Do not materialize install tasks from a Request or description.

```text
Product execution tasks      = atelier
Installation execution tasks = teren
```

ExecutionPlan reads only frozen upstream truth. Future contract: product ready before install; eligible crew; access equipment when required; transport; completion evidence; actual consumables; actual cost; planned-vs-actual; no customer repricing.

`10_EXECUTION_PLAN_TASK_GRAPH.md` was not available. This wave does not implement install tasks.

## Phase 6 — Architecture C UI Wave 2 (not implemented)

```text
ARCHITECTURE_C_UI_WAVE_1 = INTEGRATED_ON_MAIN
ARCHITECTURE_C_UI_WAVE_2 = NOT_STARTED
```

Wave 2 must be designed on these contracts, not on the old UI. Surfaces: Cerere optional services; product configuration; installation configuration; product-complete vs job-complete; multi-line offer; Owner price review; PDF; job detail; atelier vs teren; planned-vs-actual.

Phase 1 UI stays Industrial Clarity on the current shell. Dangerous actions stay visible, disabled, and explained. A product status `Complet` is not `Lucrare completă`.

## Smart modularity

```text
AVAILABLE_MODES                    = NOT_SELECTED | INTERNAL | SUBCONTRACTED in CURRENT_RUNTIME
ORG_DEFAULT                        = SERVICE_DISABLED for new selections when unconfigured
DEFAULT_REQUEST_STATE              = UNSELECTED
DISABLED_BEHAVIOR                  = silent for new selections only; persisted selections stay visible and keep freeze/link gates
INTERNAL_MODE_BEHAVIOR             = own PARTIAL EIC; workshop tasks stay LETTERS
SUBCONTRACTED_MODE_BEHAVIOR        = recorded mode only; supplier evidence is later
DEPENDENCIES                       = org offer; Request selection; later site facts and cost evidence
SAFE_FALLBACK                      = unselected / PARTIAL / freeze refused
DATA_RETENTION                     = selection and mode rows; later snapshots freeze lines
SNAPSHOT_IMPACT                    = Phase 1 creates no Quote; later quotes freeze selected scopes
PERMISSION_MODEL                   = existing Request PATCH / commercial freeze gates; selection and mode lock after first linked Quote
ADMIN_TOOLING_DEBT                 = reduced — Owner org offer exists; OS-S11 still open
NO_CLIENT_CODE_FORK                = YES
CUSTOMER_OPERABLE_WITHOUT_CURSOR   = YES for Phase 1 select/deselect after deploy
```

Do not build a global Settings dump to close the admin-tooling advisory.

## Rejected

```text
LETTERS_MODULE                     = REJECTED
DESCRIPTION_PARSING                = REJECTED
INVENTED_RATES                     = REJECTED
ZERO_AS_PRICE                      = REJECTED
CUSTOMER_PRICE_AS_EIC              = REJECTED
SERVICE_COST_PLUS                  = REJECTED
ORG_WIDE_200_EUR_LIST_PRICE        = REJECTED
INTERNAL_JOB_RATE_AS_SELECTED_LABOR = REJECTED
EMPLOYEE_SALARY_AS_LABOR_RATE      = REJECTED
OLD_MONTAJ_PLUS_TRANSPORT_SKU      = REJECTED
HIDDEN_CREATE_QUOTE                = REJECTED
LIVE_REQUEST_PATCH_WITHOUT_GO      = REJECTED
```

The orphan-quote + request-link bypass is closed in `linkCommercialRequestQuote`. The old-versus-new Cerere and Configurator audit is closed with deferred UI advisories. Neither reopens Phase 1.
