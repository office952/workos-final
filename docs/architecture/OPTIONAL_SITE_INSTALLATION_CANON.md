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
STATUS  = IMPLEMENTED_LOCAL_IN_REVIEW
```

Unselected: no install EIC, no install commercial projection, no install UI section on the confirmed product, no extra freeze rule.

Selected:

- separate PARTIAL EIC with empty lines and typed missing-evidence reasons
- separate PARTIAL commercial projection via `projectCommercialPrice` only
- operator view does not present 0 EUR as cost or price
- **Creează oferta** stays visible and disabled, with reason `Montajul nu are încă un cost complet.`
- quote-snapshot POST refuses `incomplete_offer` before `freezeQuoteSnapshot`, `persistQuoteSnapshot`, and `linkRequestQuote`

Persistence: additive `commercial_request_optional_scopes (request_id, scope_id, selected_at)`, primary key `(request_id, scope_id)`. Existing requests read `optionalScopeIds = []`. No seed. No backfill.

Future modes must remain possible and are not implemented now:

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
| Transport | When product leaves the workshop; own line only after Owner decision |
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
| Transport | EUR / trip or EUR / km | When product leaves the workshop and Owner keeps it inside install | Transport cost evidence | None | All | Resources / Cost; line vs component is a Phase 3 Owner decision |
| Travel / distance | EUR / km or included | Only if Owner policy requires it | Policy + rate | None | All | Commercial / install policy, not Product System settings |
| Site electrical attendance | EUR / job | When site power work is included | Cost evidence or explicit exclusion | LETTERS electrical finish is workshop close-out | Site electrical | Resources / Cost or exclusion text |
| LED mount service | do not reuse | Never as site install | — | `LED installation service` is workshop module mounting | Must not be copied | Keep on LETTERS LIGHTING only |

`INSTALLATION_EIC = COMPLETE` only when every applicable row has Owner-confirmed evidence. Until then Phase 2 write stays closed.

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
| Transport, if separate | own | own | logistics |
| Height access, if separate | own | own | resource/service |

Transport and height access stay **inside installation** until Owner decides they are own commercial lines. Current law has no transport or access commercial engine. Do not invent both a line and a hidden subcomponent for the same cost.

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
AVAILABLE_MODES                    = NOT_SELECTED now; INTERNAL / SUBCONTRACTED later
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
HIDDEN_CREATE_QUOTE                = REJECTED
LIVE_REQUEST_PATCH_WITHOUT_GO      = REJECTED
```
