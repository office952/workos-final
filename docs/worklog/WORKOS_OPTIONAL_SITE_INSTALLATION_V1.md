# Optional site installation V1

```text
STATUS                         = STOPPED_ON_BRANCH
CI                             = VERIFIED_SUCCESS
OWNER_DECISION                 = OPTION_2
PHASE                          = OPTIONAL_INSTALLATION_PARTIAL_FOUNDATION
PHASE_2_WRITE                  = NO
QUOTE_CREATE                   = NO
REAL_CLOUD_WRITE               = NO
LIVE_REQUEST_PATCH             = NO
MAIN_MERGE                     = NO
BRANCH                         = feat/optional-site-installation-v1
```

Phase 1 adds selectable `SITE_INSTALLATION` on CommercialRequest. Unselected stays silent. Selected projects a separate PARTIAL EIC and PARTIAL commercial view, keeps LETTERS totals unchanged, and refuses quote freeze before any persist.

Owner decision 2026-08-28:

```text
INSTALLATION_MODES             = INTERNAL + SUBCONTRACTED
TRANSPORT_MODEL                = SEPARATE_OPTIONAL_QUOTE_LINE
MONTAJ_200_EUR_PLUS_VAT        = CUSTOMER_COMMERCIAL_PRICE
ORPHAN_LINK_BYPASS             = LATER_GO_BEFORE_MAIN_MERGE
```

`200 EUR + TVA` cannot complete installation EIC. Phase 2 still needs internal crew cost, subcontractor cost, consumables/fixings, access equipment, and site electrical evidence. Transport has its own EIC and price and may exist without montaj.

Old-versus-new Cerere and Configurator audit remains required before Owner accept and merge. Read-only. Does not reopen Phase 1.

Later phases remain not started. See `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`.

Do not select montaj on `CER-E5D190D8` from this record.
