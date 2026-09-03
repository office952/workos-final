# WorkOS — First Real Letters pre-quote V1 — implemented, local in review

```text
OWNER_DECISION                         = FIRST_REAL_LETTERS_PREQUOTE_V1
FIRST_REAL_LETTERS_PREQUOTE_V1         = AUTHORIZED
SCOPE                                  = OS-S3 + OS-S4 + OS-S5
SERVICE_MANUAL_PRICE_WRITE_PERMISSION  = OWNER_ONLY
INSTALLATION_EIC_MODES_TO_IMPLEMENT    = INTERNAL + SUBCONTRACTED
FIRST_REAL_JOB_PROVIDER_MODE           = NOT_DECIDED_YET / REQUEST_DATA_LATER
FIRST_REAL_JOB_PRICE                   = 200 EUR + TVA
MANUAL_FIXED_PER_REQUEST               = YES
TRANSPORT_OS_S6                        = NOT_AUTHORIZED
OFERTE_V3                              = NOT_AUTHORIZED
LUCRARI_V3                             = NOT_AUTHORIZED
REAL_CLOUD_WRITE                       = NO
REAL_REQUEST_PATCH                     = NO
QUOTE_CREATE                           = NO
QUOTE_FREEZE                           = NO
LIVE_REQUEST_TO_V2_QUOTE_CREATE_ROUTE  = DISABLED
LIVE_V2_FREEZE_BUTTON                  = DISABLED
LIVE_V2_QUOTE_PERSIST                  = NO
LIVE_V2_REQUEST_LINK                   = NO
LIVE_V2_ACCEPTANCE                     = DISABLED
LIVE_V2_PDF                            = DISABLED
REAL_CLOUD_V2_QUOTE_MUTATION           = NO
OWNER_ACCEPTED_RUNTIME                 = NO
INTEGRATED_ON_MAIN                     = NO
IMPLEMENTED_LOCAL_IN_REVIEW            = YES
NEXT_GATE                              = INDEPENDENT_SCREENSHOT_REVIEW_THEN_OWNER_INSPECTION
```

Owner authorized one coherent vertical pre-quote wave so the first real LETTERS job is not blocked by an architectural wall at OS-S3 or OS-S4 alone. This file is the implementation record. It does not accept the runtime, write Cloud, patch a real Cerere, freeze a real Quote, or integrate on `main`.

## Identity

```text
REPO              = office952/workos-final
WORKTREE          = C:/Users/offic/workspace/workos-final-clients-main-ff
BRANCH            = feat/first-real-letters-prequote-v1
ORIGIN_MAIN       = 33c2f9fae4402b152f2840c96cf6da98a1c74a03
CERERI_PRODUCT    = 03f2d747036b5ac219f283f5a969d575a9a707c9
MIGRATION         = 028_first_real_letters_prequote.sql
```

## Direction report

```text
ROADMAP_READ            = YES
UI_UX_CANON_READ        = YES
DIRECTION_CONFLICT      = NO_EXECUTION_CONFLICT
DOC_AMBIGUITY           = DOC-P3 / NON_BLOCKING — living UI still names NEXT_PROGRAM_PRIORITY = UI_V3_COMMERCIAL_PAGE_REORGANIZATION while CURRENT_STEP on this branch is FIRST_REAL_LETTERS_PREQUOTE_V1. Those are concurrent: program UI direction versus the current operational sequence. Resources canon historically said “No hourly costing”; site-install INTERNAL labor is an additive person_hour resource, not LETTERS workshop hourly or pontaj. Cereri Figma UX LOCK still shows historical NEW → ATTENTION / full client-profile create; Owner amend 2026-09-02 remains. Do not reopen Cereri or write Figma.
CURRENT_MILESTONE       = HUB_MEDIA_CLEAN_PILOT
CURRENT_STEP            = FIRST_REAL_LETTERS_PREQUOTE_V1
NEXT_STEP               = independent ChatGPT technical review + uploaded screenshot graphic review
THEME_IMPACT            = BOTH
NEW_HARDCODED_CSS       = NO
BACKEND_DETAILS_EXPOSED = NO
```

This GO does not authorize Oferte V3, Lucrări V3, Architecture C Wave 2, OS-S6 transport, OS-S7+, real Cloud write, or a live first-job quote.

## Permanent boundaries

```text
LETTER PRODUCT EIC              ≠ INSTALLATION SERVICE EIC
INSTALLATION INTERNAL COST      ≠ INSTALLATION CUSTOMER PRICE
PRODUCT COMMERCIAL              = COST_PLUS
INSTALLATION COMMERCIAL         = MANUAL_FIXED_PER_REQUEST
Request                         = mutable until first linked Quote lock
Quote freeze                    = immutable
NO_CLIENT_CODE_FORK             = YES
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES_FOR_IMPLEMENTED_PREQUOTE_PATHS
200 EUR                         = Owner-entered net on that Request, not a catalog default
VAT                             = net 200 + 21% = 242 gross
INTERNAL EIC PROOF              = 3 × 4 × 25 = 300 ≠ 200
SUBCONTRACT_EVIDENCE_RENEWAL_UI = YES
SITE_ELECTRICAL_INCLUDED_PREQUOTE = NO_COMPLETE_PATH_IN_THIS_WAVE
SITE_ELECTRICAL_SUBCONTRACTED_PREQUOTE = NO_COMPLETE_PATH_IN_THIS_WAVE
VALID_UNTIL_INCLUSIVE           = YES
```

## What landed

### OS-S3 — facts, evidence, install EIC

- Request facts gained `crewSize` (1–99) and `plannedDurationHours` (>0, ≤1000). Crew and hours appear only for INTERNAL.
- Code-owned resources, no seed amounts:
  - `LAB-SITE-INSTALL` — LABOR, `person_hour`, Manoperă montaj la locație
  - `SVC-SITE-INSTALL-SUBCONTRACT` — SERVICE, `job`, Montaj la locație subcontractat
- Cost evidence may carry `supplierLabel`, `validFrom`, `validUntil`. Subcontract create requires supplier + `validUntil`.
- INTERNAL EIC: `crew × hours × Owner-confirmed person-hour rate`.
- SUBCONTRACTED EIC: one job line from Owner-confirmed supplier evidence inside the validity window.
- Incomplete EIC stays empty lines and total 0. Do not show 0 EUR as a sold price.
- These resources do not enter LETTERS product recipes or `liveResourceIdsForType`.

### OS-S4 — Owner-only manual fixed service commercial

- `projectManualFixedServicePrice`: markup 0, COMPLETE only when net > 0.
- `PATCH /api/requests/:id/installation-price` requires Owner. Cloud member receives 403.
- First cost-evidence create for the new resources requires Owner.
- Deselect clears the manual price. First linked Quote locks the write.

### OS-S5 — additive Quote v2 domain, live mutation gated

- Product-only freeze stays schema v1. Hashed v1 content is unchanged when installation is omitted.
- Domain `freezeQuoteSnapshot` can still construct schema v2 for synthetic tests: discriminated `PRODUCT` / `SITE_INSTALLATION` lines with `commercialStrategy`, `providerMode`, source Request provenance, typed technical configuration, and immutable evidence projection. Job total comes only from `projectLiveJobCommercial`. There is no arithmetic fallback.
- Live `POST /api/products/:code/quote-snapshots` refuses a Request with selected SITE_INSTALLATION (`service_quote_freeze_not_authorized`) before persist or request link. The configurator shows the two-line preview and keeps **Creează oferta** disabled.
- Live v2 acceptance is refused (`service_quote_not_acceptable`). Live v2 PDF is refused. Order from v2 stays `service_lines_not_orderable`.
- `isSupportedQuoteSnapshot` for v2 requires the exact line contract, not merely two lines and a COMPLETE job total.
- `scopeQuoteSnapshot` projects v2 lines explicitly. Owner keeps evidence, EIC, and supplier provenance. Commercial and workshop never receive `evidence`, supplier identity, or internal EIC. Live v2 persist stays disabled.
- `VALID_UNTIL_INCLUSIVE = YES`. Coverage compares UTC calendar dates: `validFrom <= asOfDate <= validUntil`. `2027-12-31T23:59:59Z` is valid; `2028-01-01T00:00:00Z` is not.

## Persistence

Migration `028_first_real_letters_prequote.sql`:

- `commercial_request_installation_facts.crew_size`
- `commercial_request_installation_facts.planned_duration_hours`
- `commercial_requests.installation_manual_net_eur`
- `resource_cost_evidence.supplier_label`
- `resource_cost_evidence.valid_from`
- `resource_cost_evidence.valid_until`

## Operator / Owner surfaces

- Cerere: crew and planned hours when mode is INTERNAL; Owner-only montaj net price.
- Configurator confirm with `?request=`: two-line preview when `jobCommercial` is COMPLETE; **Creează oferta** stays disabled with the prequote-only reason.
- Resurse: uncosted category plus first-evidence create; existing subcontract evidence can renew Furnizor / Valid de la / Valid până la through the normal editor. Workshop materials do not show those fields.
- No Oferte V3 page. No Lucrări V3 page.

## Proof

```text
LINT              = PASS (0 errors; 11 pre-existing web warnings only)
TYPECHECK         = packages/domain + apps/api + apps/web PASS
BUILD             = PASS
DOMAIN_VITEST     = 416 passed
API_VITEST        = 259 passed
WEB_VITEST        = 216 passed
QUOTE_V1_GOLDEN_HASH = 35e562617d45f4caabb4f582b9c6385e6be5c1edc345c1dd31d688b25add2f27
QUOTE_V1_HASH_VS_ORIGIN_MAIN = EQUAL
FOCUSED_E2E       = first-real-letters-prequote, quote-snapshot,
                    request-installation-facts, optional-site-installation
                    = 8 passed, retries 0
LOCAL_FULL_E2E    = PASS
                    98 passed / 5 skipped / 0 failed
                    retries 0
                    ports 8912 / 5312
                    isolated data dir
GITHUB_CI_PUSH    = 33695359066 SUCCESS on 561584bffa08990414597dd6bd7fbb9291448e3b
GITHUB_CI_PR      = 33695363565 SUCCESS on the same head
```

Synthetic INTERNAL path: facts + crew 3 + 4 h + labor 25 + Owner price 200 → confirm job 866.82 → live freeze refused. Product-only freeze stays v1.

Synthetic SUBCONTRACTED path: supplier evidence 180 + Owner price 200 → confirm install EIC 180 and install commercial 242 → live freeze refused.

Cloud member: price write 403, first install evidence create 403.

## Still closed

```text
OWNER_ACCEPTED_RUNTIME     = NO
REAL_CLOUD_WRITE           = NO
REAL_REQUEST_PATCH         = NO
QUOTE_CREATE               = NO
QUOTE_FREEZE               = NO
LIVE_REQUEST_TO_V2_QUOTE_CREATE_ROUTE = DISABLED
LIVE_V2_FREEZE_BUTTON      = DISABLED
LIVE_V2_QUOTE_PERSIST      = NO
LIVE_V2_ACCEPTANCE         = DISABLED
REAL_CLOUD_V2_QUOTE_MUTATION = NO
TRANSPORT_OS_S6            = NOT_AUTHORIZED
OFERTE_V3                  = NOT_AUTHORIZED
LUCRARI_V3                 = NOT_AUTHORIZED
ORDER_FROM_QUOTE_V2        = REFUSED
SITE_ELECTRICAL_INCLUDED_PREQUOTE = NO_COMPLETE_PATH_IN_THIS_WAVE
SITE_ELECTRICAL_SUBCONTRACTED_PREQUOTE = NO_COMPLETE_PATH_IN_THIS_WAVE
VALID_UNTIL_INCLUSIVE      = YES
BEFORE_LIVE_V2_ENABLE_ADVISORY = commercial v2 omits technicalConfiguration and sourceRequestId by construction; SUBCONTRACTED freeze now requires supplier + validUntil; remaining live-v2 enablement is a later GO
ADMIN_TOOLING_DEBT         = LOW / UX-S2 — BOTH-mode gate, LAB post-save redirect, expired resource badge closed in this amend; remaining density / 44px / date-placeholder advisories stay out of scope
ACCESS_METHOD_AND_EQUIPMENT = NOT_IMPLEMENTED
FIXINGS_CONSUMABLES        = NOT_IMPLEMENTED
SITE_PHOTOS                = NOT_IMPLEMENTED
PONTAJ                     = NOT_IMPLEMENTED
```

`200 EUR` must not be hardcoded as a catalog or org default. Tests may write it as an Owner-entered value.

## Owner-inspection amend

Independent review held Owner runtime acceptance because the Owner could not see install EIC, `Complet` meant commercial completeness only, job preview stacked three equal prices, Request price notice nested `<p>` in `<p>`, and BOTH-mode checkbox was a no-op until a mode existed.

```text
AMEND                         = OWNER_INSPECTION_CLOSURE
OWNER_ECONOMICS_VISIBILITY    = YES — presentSiteInstallationScope projects canonical EIC total only when COMPLETE; React does not recompute crew × hours × rate
OWNER_INSTALL_EIC_INTERNAL    = 300 EUR from eic.total (LAB-SITE-INSTALL)
OWNER_INSTALL_EIC_SUBCONTRACT = 180 EUR from eic.total (SVC-SITE-INSTALL-SUBCONTRACT)
OWNER_INSTALL_EIC_SOURCE      = domain presentOwnerInternalCost from canonical EIC lines
COMMERCIAL_INSTALL_EIC_LEAK   = NO — scopeSiteInstallationOperatorView strips ownerInternalCost
WORKSHOP_INSTALL_EIC_LEAK     = NO
PREQUOTE_READINESS_LAW        = eicCompleteness COMPLETE AND commercialCompleteness COMPLETE AND no incompleteReasons
EXPIRED_OVERALL_COMPLETE      = NO
REQUEST_FALSE_COMPLETE_LABELS = audited; installation uses Pregătit pentru ofertă / partial Romanian labels
TOTAL_CLIENT_HIERARCHY        = Total ofertă client dominant; Produs + Montaj breakdown
BOTH_MODE_NOOP_TRAP           = CLOSED — mode required before new selection
INVALID_HTML                  = CLOSED — price confirm uses action-row, not nested p
LAB_RESOURCE_POST_SAVE_NAV    = resource:LAB-SITE-INSTALL redirects to created cost item
EXPIRED_RESOURCE_BADGE        = Expirat · calendar date when projection proves validUntil
SYNTHETIC_ONLY                = YES
GITHUB_CI_PUSH                = 33695359066 SUCCESS
GITHUB_CI_PR                  = 33695363565 SUCCESS
OWNER_ACCEPTED_RUNTIME        = NO
INTEGRATED_ON_MAIN            = NO
```

Do not declare Owner-accepted runtime or integrate on `main` from this amend.

## Focused graphic composition pass

Owner graphic review of the seven amend screenshots authorized one composition pass. No architecture, EIC, pricing, database, Figma, Resources, or live v2 change.

```text
GRAPHIC_PASS                      = COMPOSITION_HIERARCHY
REQUEST_DECISION_STACK            = stare → preț client → cost intern → următorul pas
MONTAJ_CHECKBOX                   = native field-choice, label + hint, 44×44 hit via wrapping label
INSTALLATION_FORM_GROUPS          = Locație / Măsurători / Execuție montaj
COMMERCIAL_TOTAL                  = 866,82 dominant; Produs + Montaj compact
INTERNAL_COST_SECONDARY           = yes
DISABLED_QUOTE_STATE              = muted button + supporting reason
EXPIRED_COPY                      = Total ofertă indisponibil; no Preț client neconfirmat when install price exists
RESOURCES_REDESIGN                = NO / UX_ADVISORY_FOR_LATER
SYNTHETIC_CAPTURE                 = .tmp/review/first-real-letters-prequote-v1-composition/screenshots
OWNER_ACCEPTED_RUNTIME            = NO
INTEGRATED_ON_MAIN                = NO
```

## Next gate

Independent ChatGPT screenshot review, then Owner inspection. Do not merge `main` and do not mark Owner-accepted from this file.
