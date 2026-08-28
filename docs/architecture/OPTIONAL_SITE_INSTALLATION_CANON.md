# Optional site installation canon

Canonical current law for site installation as an associated commercial and operational scope.
Runtime wins if this document disagrees.

```text
CAPABILITY_NAME        = OPTIONAL_SITE_INSTALLATION
STABLE_SCOPE_ID        = SITE_INSTALLATION
DEFAULT_REQUEST_STATE  = UNSELECTED
CONFIGURATION_SURFACE  = Cerere → Montaj la locație
PRODUCT_RELATION       = associated scope, never a LETTERS component or module
NO_CLIENT_CODE_FORK    = YES
```

## Owner decision 2026-08-28

Recorded. Does not authorize Phase 2 write, live Cerere PATCH, or quote create.

```text
PHASE_1                    = INTEGRATED_ON_MAIN
MAIN_SHA                   = 2596cd076af631b1679c4530df90dcf22de46bbb
MAIN_CI_RUN                = 33187511745
MAIN_CI_STATUS             = SUCCESS
PHASE_2                    = NOT_STARTED / NOT_AUTHORIZED
PHASE_2_WRITE              = NO
TRANSPORT_IMPLEMENTATION   = NOT_STARTED / NOT_AUTHORIZED
LIVE_REQUEST_PATCH         = NO
QUOTE_CREATE               = NO
INSTALLATION_MODES         = INTERNAL + SUBCONTRACTED
TRANSPORT_MODEL            = SEPARATE_OPTIONAL_QUOTE_LINE
MONTAJ_200_EUR_PLUS_VAT    = CUSTOMER_COMMERCIAL_PRICE
ORPHAN_LINK_GATE           = CLOSED
OLD_VS_NEW_CERERE_CONFIGURATOR_AUDIT = CLOSED_WITH_ADVISORIES
AUDIT_GATE                 = CLOSED_WITH_ADVISORIES
AUDIT_MODE                 = READ_ONLY
AUDIT_REOPENS_PHASE_1      = NO
```

Historical branch state before integration: `STOPPED_ON_BRANCH` on `feat/optional-site-installation-v1`.

`200 EUR + TVA` is a customer selling price for montaj. It is not internal cost, not subcontract cost, and it cannot make `INSTALLATION_EIC` COMPLETE.

Transport has its own EIC and commercial price. It may exist with or without montaj. It is not an installation subcomponent.

Phase 2 still needs Owner-confirmed internal evidence for: internal crew cost; subcontractor cost; consumables and fixings; access equipment; site electrical connection.

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
- separate PARTIAL commercial projection via `projectCommercialPrice` only
- operator view does not present 0 EUR as cost or price
- **Creează oferta** stays visible and disabled, with reason `Montajul nu are încă un cost complet.`
- quote-snapshot POST refuses `incomplete_offer` before `freezeQuoteSnapshot`, `persistQuoteSnapshot`, and `linkRequestQuote`
- `linkCommercialRequestQuote` reuses the same readiness refusal before inserting `commercial_request_quote_links`. A product-only orphan Quote may still be created. Linking it to a Request whose selected installation scope is not COMPLETE is refused. The Quote is not rewritten. When installation EIC becomes COMPLETE, the same check allows the link.

Persistence: additive `commercial_request_optional_scopes (request_id, scope_id, selected_at)`, primary key `(request_id, scope_id)`. Existing requests read `optionalScopeIds = []`. No seed. No backfill.

Owner-decided modes, not implemented now:

```text
NOT_SELECTED
INTERNAL_INSTALLATION
SUBCONTRACTED_INSTALLATION
```

## Phase 2 — completeness contract (not implemented)

Montajul is a reusable service for more than one product and company. Completeness facts are typed. They are not all mandatory. A fact becomes required only when the selected mode or site condition needs it.

| Fact | When applicable |
| --- | --- |
| Execution site address, distinct from customer address | Selected install |
| Site measurements | Internal or subcontracted install that prices from geometry |
| Height and access method | Work above reachable height or when access equipment is required |
| Support / facade | Always when install is selected |
| Fixing system | Always when install is selected |
| Transport | Separate optional commercial scope; own EIC and price; may exist with or without montaj |
| Distance / travel | Only if Owner policy requires it |
| Unload and handling | When site access is not workshop-equivalent |
| Site electrical connection | When the installed product needs site power |
| Crew size | Internal install |
| Estimated internal duration | Internal install |
| Access equipment | When height/access method requires it |
| Install consumables | When the fixing system consumes stockable materials |
| Internal vs subcontractor provider | When mode is chosen |
| Valid cost evidence | Always before INSTALLATION_EIC can be COMPLETE |
| Exclusions and customer responsibilities | Always on a COMPLETE commercial install offer |

Economic rules:

- installation has its own EIC
- internal cost is not customer price
- employee cost does not become hours × salary on the customer offer
- machines and capacity do not become automatic commercial rates
- subcontracting consumes valid cost evidence
- a customer selling price does not complete installation EIC
- `200 EUR + TVA` is customer commercial price only
- missing rates stay PARTIAL
- no zero fallback

### Owner data gate — PARTIAL → COMPLETE

Do not invent EUR amounts. Confirm these values before Phase 2 write.

| COST_ELEMENT | UNIT | WHEN_APPLICABLE | REQUIRED_OWNER_VALUE | EXISTING_EVIDENCE | MISSING_EVIDENCE | RECOMMENDED_CONFIGURATION_SURFACE |
| --- | --- | --- | --- | --- | --- | --- |
| Internal install labor | EUR / hour or EUR / job | INTERNAL_INSTALLATION | Owner-confirmed install labor evidence, not workshop forming/CNC rates | Workshop LETTERS labor/service recipes exist; they are manufacture, not site install | Site-install labor evidence | Resources / Cost — new install resource, not a LETTERS recipe |
| Subcontracted install | EUR / job or EUR / documented unit | SUBCONTRACTED_INSTALLATION | Valid supplier cost evidence and validity window | None | All | Resources / Cost — supplier evidence, not a commercial markup |
| Fixing / consumables | EUR / documented unit | When the chosen fixing system consumes stock | Resource identity + amount + classification | None for facade fixings | All | Resources / Cost |
| Access equipment | EUR / documented unit | Height/access method requires it | Hire or owned-equipment cost evidence | Shop-floor machines are workshop CNC/weld/forming | Site-access equipment | Resources / Cost or later provider catalog |
| Transport | EUR / trip or EUR / km | Separate optional quote line; with or without montaj | Transport cost evidence for TRANSPORT_EIC, then own commercial price | None | All | Own scope / Resources / Cost — not inside installation EIC |
| Travel / distance | EUR / km or included | Only if Owner policy requires it | Policy + rate | None | All | Commercial / install policy, not Product System settings |
| Site electrical attendance | EUR / job | When site power work is included | Cost evidence or explicit exclusion | LETTERS electrical finish is workshop close-out | Site electrical | Resources / Cost or exclusion text |
| LED mount service | do not reuse | Never as site install | — | `LED installation service` is workshop module mounting | Must not be copied | Keep on LETTERS LIGHTING only |

`INSTALLATION_EIC = COMPLETE` only when every applicable installation row has Owner-confirmed **internal** evidence. Customer `200 EUR + TVA` does not satisfy this gate. Transport completeness is a separate `TRANSPORT_EIC` gate. Until then Phase 2 write stays closed.

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

`TRANSPORT_MODEL = SEPARATE_OPTIONAL_QUOTE_LINE`. Transport is not nested under montaj. Height access stays inside installation until a later Owner decision. Current law has no transport commercial engine yet. Do not invent both a line and a hidden subcomponent for the same cost.

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
AVAILABLE_MODES                    = NOT_SELECTED now; INTERNAL + SUBCONTRACTED Owner-decided, not implemented
DEFAULT_MODE                       = NOT_SELECTED
DISABLED_BEHAVIOR                  = silent
INTERNAL_MODE_BEHAVIOR             = own PARTIAL/COMPLETE EIC + own commercial; workshop tasks stay LETTERS
SUBCONTRACTED_MODE_BEHAVIOR        = consumes supplier cost evidence; still not a LETTERS module
DEPENDENCIES                       = Request selection; later site facts and cost evidence
SAFE_FALLBACK                      = unselected / PARTIAL / freeze refused
DATA_RETENTION                     = selection rows only in Phase 1; later snapshots freeze lines
SNAPSHOT_IMPACT                    = Phase 1 creates no Quote; later quotes freeze selected scopes
PERMISSION_MODEL                   = existing Request PATCH / commercial freeze gates
ADMIN_TOOLING_DEBT                 = YES — no org-level on/off control
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
HIDDEN_CREATE_QUOTE                = REJECTED
LIVE_REQUEST_PATCH_WITHOUT_GO      = REJECTED
```

The orphan-quote + request-link bypass is closed in `linkCommercialRequestQuote`. The old-versus-new Cerere and Configurator audit is closed with deferred UI advisories. Neither reopens Phase 1.
