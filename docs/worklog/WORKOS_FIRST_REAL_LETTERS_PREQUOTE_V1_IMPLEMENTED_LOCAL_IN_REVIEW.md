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
LIVE_REQUEST_TO_V2_QUOTE_CREATE_ROUTE  = ENABLED
LIVE_V2_FREEZE_BUTTON                  = ENABLED
REAL_CLOUD_V2_QUOTE_MUTATION           = NO
OWNER_ACCEPTED_RUNTIME                 = NO
INTEGRATED_ON_MAIN                     = NO
IMPLEMENTED_LOCAL_IN_REVIEW            = YES
NEXT_GATE                              = PUBLISH_FOR_INDEPENDENT_REVIEW
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
DIRECTION_CONFLICT      = YES — living UI still names NEXT_PROGRAM_PRIORITY = UI_V3_COMMERCIAL_PAGE_REORGANIZATION; this wave follows CURRENT_STEP = FIRST_REAL_LETTERS_JOB. Resources canon historically said “No hourly costing”; site-install INTERNAL labor is an additive person_hour resource, not LETTERS workshop hourly or pontaj. Cereri Figma UX LOCK still shows historical NEW → ATTENTION / full client-profile create; Owner amend 2026-09-02 remains. Do not reopen Cereri or write Figma.
CURRENT_MILESTONE       = HUB_MEDIA_CLEAN_PILOT
CURRENT_STEP            = FIRST_REAL_LETTERS_PREQUOTE_V1
NEXT_STEP               = independent ChatGPT review → synthetic runtime verification → Owner inspection
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
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES for new Owner surfaces
200 EUR                         = Owner-entered net on that Request, not a catalog default
VAT                             = net 200 + 21% = 242 gross
INTERNAL EIC PROOF              = 3 × 4 × 25 = 300 ≠ 200
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

### OS-S5 — additive Quote v2

- Product-only freeze stays schema v1. Hashed v1 content is unchanged when installation is omitted. The existing `POST /api/products/:code/quote-snapshots` route can emit v2 when a Request has selected COMPLETE installation. That is a reusable capability plus synthetic proof, not a real-Cloud or HUB MEDIA mutation GO.
- When installation is selected and both product and install are COMPLETE, freeze writes schema v2: `lines[]` (`PRODUCT` | `SITE_INSTALLATION`) plus `jobCommercial`. Top-level `eic` and `commercial` stay product-only (canonical 624.82). Job total 866.82 = 624.82 + 242.
- `projectLiveJobCommercial` is the single job-total projector. Confirm returns it. The UI displays it. It does not add prices in the browser.
- v2 acceptance is allowed. Order from v2 is refused (`service_lines_not_orderable`). Create Order stays hidden on a v2 snapshot.
- PDF v1 unchanged. PDF v2 adds line labels and uses `jobCommercial` for totals.

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
- Configurator confirm with `?request=`: two-line preview when `jobCommercial` is COMPLETE; freeze stays disabled while install is incomplete.
- Resurse: uncosted category plus first-evidence create; subcontract supplier and validity.
- No Oferte V3 page. No Lucrări V3 page.

## Proof

```text
LINT              = PASS (0 errors; pre-existing web warnings only)
TYPECHECK         = packages/domain + apps/api + apps/web PASS
BUILD             = PASS
DOMAIN_VITEST     = 407 passed
API_VITEST        = 254 passed
WEB_VITEST        = 205 passed
QUOTE_V1_GOLDEN_HASH = 35e562617d45f4caabb4f582b9c6385e6be5c1edc345c1dd31d688b25add2f27
QUOTE_V1_HASH_VS_ORIGIN_MAIN = EQUAL
FOCUSED_E2E       = first-real-letters-prequote, optional-site-installation,
                    request-installation-facts, os-s1-admin, os-s1-org-capability
                    = 6 passed, retries 0, ports 8871 / 5271
LOCAL_FULL_E2E    = NOT_PASS
                    48 passed / 51 failed / 3 skipped
                    first failure = jobs-overview apiRequestContext.post ECONNRESET
                    remaining failures = ECONNREFUSED after web-server death
                    not a wave product assertion
                    GitHub CI is authoritative after push
```

Synthetic INTERNAL path: facts + crew 3 + 4 h + labor 25 + Owner price 200 → confirm job 866.82 → freeze v2. Product-only freeze stays v1.

Synthetic SUBCONTRACTED path: supplier evidence 180 + Owner price 200 → freeze v2 with install EIC 180 and install commercial 242.

Cloud member: price write 403, first install evidence create 403.

## Still closed

```text
OWNER_ACCEPTED_RUNTIME     = NO
REAL_CLOUD_WRITE           = NO
REAL_REQUEST_PATCH         = NO
QUOTE_CREATE               = NO
QUOTE_FREEZE               = NO
LIVE_REQUEST_TO_V2_QUOTE_CREATE_ROUTE = ENABLED
LIVE_V2_FREEZE_BUTTON      = ENABLED
REAL_CLOUD_V2_QUOTE_MUTATION = NO
TRANSPORT_OS_S6            = NOT_AUTHORIZED
OFERTE_V3                  = NOT_AUTHORIZED
LUCRARI_V3                 = NOT_AUTHORIZED
ORDER_FROM_QUOTE_V2        = REFUSED
SITE_ELECTRICAL INCLUDED / SUBCONTRACTED = still SITE_ELECTRICAL_COST_REQUIRED
ACCESS_METHOD_AND_EQUIPMENT = NOT_IMPLEMENTED
FIXINGS_CONSUMABLES        = NOT_IMPLEMENTED
SITE_PHOTOS                = NOT_IMPLEMENTED
PONTAJ                     = NOT_IMPLEMENTED
```

`200 EUR` must not be hardcoded as a catalog or org default. Tests may write it as an Owner-entered value.

## Next gate

Independent ChatGPT review of the Draft PR diff and GitHub CI. If that technical gate passes: synthetic runtime / visual review before Owner acceptance. Do not merge `main` and do not mark Owner-accepted from this file.
