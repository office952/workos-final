# Optional site installation V1

```text
STATUS                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_DECISION                 = OPTION_2
PHASE                          = OPTIONAL_INSTALLATION_PARTIAL_FOUNDATION
QUOTE_CREATE                   = NO
REAL_CLOUD_WRITE               = NO
LIVE_REQUEST_PATCH             = NO
BRANCH                         = feat/optional-site-installation-v1
```

Phase 1 adds selectable `SITE_INSTALLATION` on CommercialRequest. Unselected stays silent. Selected projects a separate PARTIAL EIC and PARTIAL commercial view, keeps LETTERS totals unchanged, and refuses quote freeze before any persist.

Later phases (cost completeness, multi-line Quote/PDF, live job resume, install execution, Architecture C Wave 2) are documented in `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md` and remain not started.

Do not select montaj on `CER-E5D190D8` from this record.
