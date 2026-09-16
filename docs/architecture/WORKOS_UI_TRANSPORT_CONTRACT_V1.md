# WorkOS UI transport contract V1

Canonical current law for the presentation-safe HTTP boundary used by any frontend,
including an isolated UI20 repository.

Runtime wins if this document disagrees.

```text
ROLE                       = AUTHORITY
OWNS                       = UI_TRANSPORT_CONTRACT_V1
DOES_NOT_OWN               = PRODUCT_TRUTH, PRICING, FIGMA, DELIVERY_SEQUENCE, CURRENT_WEB_PRESENTATION
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = YES
LAST_RECONCILIATION_RULE   = UPDATE_WHEN_PREVIEW_CONFIRM_QUOTE_OR_CONTRACT_ID_CHANGES
```

```text
API_CONTRACT_ID                    = workos-ui-contract-v1
PREFERRED_PRODUCTION_TOPOLOGY      = SAME_ORIGIN
REPOSITORY_SEPARATION              = YES
NETWORK_ORIGIN_SEPARATION          = NO
CORS_CHANGED                       = NO
COOKIE_POLICY_CHANGED              = NO
CSRF_CHANGED                       = NO
AUTH_BYPASS                        = NO
PRODUCTDEFINITION_BROWSER_ROUNDTRIP_REQUIRED = NO
```

This version identifies the **transport** contract. It is not a database schema
version, not `QuoteSnapshot.schemaVersion`, and not a ProductDefinition version.

## Topology

Repository separation does not imply network-origin separation.

```text
https://<workos-host>/        presentation
https://<workos-host>/api/*   canonical WorkOS API
```

Local isolated UI20 development may later use a same-origin-style proxy to `/api`.
Cross-origin authentication is future work only if a proven deployment requirement
exists. This contract does not authorize CORS expansion, `SameSite=None`, wildcard
origins, or weaker authentication.

## Ownership

```text
WORKOS DOMAIN  →  WORKOS API  →  TRANSPORT DTO  →  UI ADAPTER  →  PRESENTATION MODEL  →  UI
```

`workos-final` owns Product Truth, compile, visibility, readiness, selected-module
semantics, quantities, EIC, pricing, commercial state, quote/order/release,
execution eligibility, and business transitions.

A frontend must not import `@workos-final/domain` to decide those facts. It must
not copy `compileDefinition`, `isFieldVisible`, `selectedComponentIds`,
`projectCommercialExperience`, `siteInstallationIsPrequoteReady`, or
`getProductTemplate` for business use.

API owns **what** state or action is valid. UI owns **how** it looks.

## Contract identity

`GET /api/health` returns:

```json
{ "status": "ok", "service": "workos-final-api", "apiContractId": "workos-ui-contract-v1" }
```

An isolated frontend must fail closed if the required contract identity is absent
or different.

## Configuration preview

`POST /api/products/:productCode/preview`

Request:

```json
{ "values": { "root.inscription": "WORKOS" }, "requestId": "crq:… optional" }
```

The server compiles with the canonical `compileDefinition` / visibility /
selection helpers. It does not accept or return a ProductDefinition graph.

Response facts:

| Field | Meaning |
| --- | --- |
| `product` | Presentation identity: code, label, family, version, identity facts, template `fixedValues` |
| `values` | Echoed draft values |
| `formSchema` | Visible configurable subset only; remaining fields are `visibleWhen: always` |
| `selectedComponents` | Active modules required for honest rendering |
| `readiness` | `ready` or `blocked` |
| `missing` | Operator-facing missing / invalid facts |
| `reviewId` | `crv1:…` when ready; `null` when blocked |
| `installation` | `{ selected, prequoteReady, incompleteReasons }` |

`reviewId` is a configuration-review identity: FNV of the canonical
`definitionReviewId` plus the used technical-settings snapshot of selected
component types. A later settings change produces a different identity and
fail-closes confirmation.

Do not expose measurements, internal component graphs, or a generic Formula API.

## Confirm the exact reviewed configuration

`POST /api/products/:productCode/confirm`

Safe contract:

```json
{ "values": { }, "reviewId": "crv1:…", "requestId": "optional" }
```

The server recompiles the submitted values, recomputes `crv1`, and confirms only
when that identity matches. Value edits after preview cannot confirm the stale
review (`409 review_mismatch`). Settings changes after review also mismatch.

The browser must not construct, persist, mutate, or resubmit ProductDefinition
as business authority.

Legacy current-web body remains valid:

```json
{ "definition": { }, "reviewId": "<hex definitionReviewId>" }
```

Confirm also returns server-owned `commercialExperience` and
`installationPrequoteReady` so the browser does not run those helpers.

## Quote freeze

`POST /api/products/:productCode/quote-snapshots`

Safe contract uses the same values + `crv1` review identity, plus `customerId`
and optional `requestId`. The server re-verifies the exact reviewed
configuration, then freezes through the existing quote snapshot engine.

Legacy `{ definition, reviewId }` remains for the current runtime.

Selected site installation that is not prequote-ready continues to refuse freeze.
The response includes `commercialExperience` derived from the frozen snapshot.

Historical Quote / Order snapshots stay immutable. A later configuration or
settings change does not rewrite them.

## Commercial and installation projections

`commercialExperience` tells the client:

- commercial stage
- completeness via existing commercial/internal-cost completeness
- allowed next business action
- blocking reason where applicable

It does not encode button styling or layout.

`installation` / `installationPrequoteReady` tells the client whether optional
site installation is selected and whether it is prequote-ready. An unselected
optional service stays silent. Enabling the service later is an organization
offer change, not a product-code fork.

ACM preview uses ACM schema and selected FACE + BACK only. It does not inherit
LETTERS VOLUME / LIGHTING fields.

## Legacy compatibility

Current `apps/web` may keep using compile + definition confirm. Those endpoints
are not removed. GET `/api/products/:productCode` still returns the raw template
and schema for the current runtime. Isolated UI20 must prefer preview rather
than interpreting ProductTemplate as business authority.

## Financial and permission scope

Confirm, quote, and installation projections continue to use the existing
financial-access and Cloud role rules. This contract does not change owner /
member / operator authorization.
