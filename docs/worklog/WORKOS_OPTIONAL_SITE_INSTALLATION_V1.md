# Optional site installation V1

```text
STATUS                         = INTEGRATED_ON_MAIN
PHASE_1                        = INTEGRATED_ON_MAIN
MAIN_SHA                       = 2596cd076af631b1679c4530df90dcf22de46bbb
MAIN_CI_RUN                    = 33187511745
MAIN_CI_STATUS                 = SUCCESS
OWNER_DECISION                 = OPTION_2
PHASE                          = OPTIONAL_INSTALLATION_PARTIAL_FOUNDATION
PHASE_2                        = NOT_STARTED / NOT_AUTHORIZED
PHASE_2_WRITE                  = NO
TRANSPORT_IMPLEMENTATION       = NOT_STARTED / NOT_AUTHORIZED
QUOTE_CREATE                   = NO
REAL_CLOUD_WRITE               = NO
LIVE_REQUEST_PATCH             = NO
AUDIT_GATE                     = CLOSED_WITH_ADVISORIES
ORPHAN_LINK_GATE               = CLOSED
```

Historical branch state before integration: `STOPPED_ON_BRANCH` on `feat/optional-site-installation-v1`.

Phase 1 adds selectable `SITE_INSTALLATION` on CommercialRequest. Unselected stays silent. Selected projects a separate PARTIAL EIC and PARTIAL commercial view, keeps LETTERS totals unchanged, and refuses quote freeze before any persist.

Owner decision 2026-08-28:

```text
INSTALLATION_MODES             = INTERNAL + SUBCONTRACTED
TRANSPORT_MODEL                = SEPARATE_OPTIONAL_QUOTE_LINE
MONTAJ_200_EUR_PLUS_VAT        = CUSTOMER_COMMERCIAL_PRICE
ORPHAN_LINK_BYPASS             = CLOSED
OLD_VS_NEW_AUDIT_GATE          = CLOSED_WITH_ADVISORIES
```

`200 EUR + TVA` cannot complete installation EIC. Phase 2 still needs internal crew cost, subcontractor cost, consumables/fixings, access equipment, and site electrical evidence. Transport has its own EIC and price and may exist without montaj.

Orphan product-only Quote create remains allowed. Linking that Quote to a Request with selected and incomplete `SITE_INSTALLATION` is refused by `linkCommercialRequestQuote` with the same `incomplete_offer` contract as freeze. The Quote snapshot is not rewritten.

Old-versus-new Cerere and Configurator audit is closed with deferred UI advisories. Does not reopen Phase 1.

Later phases remain not started. See `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`.

Do not select montaj on `CER-E5D190D8` from this record.
