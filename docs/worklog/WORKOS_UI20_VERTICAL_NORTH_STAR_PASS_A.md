# WORKOS UI20 — Vertical North Star Pass A

```text
STATUS                            = IMPLEMENTED_LOCAL_AND_REMOTE_IN_REVIEW
PASS_A                            = FUNCTIONAL_VERTICAL_SKELETON
OWNER_ACCEPTED                    = NO
MERGE_AUTHORIZED                  = NO
PASS_B                            = NO
PASS_C                            = NO
HOME                              = NO
PARTIAL_MAIN_UI_INTEGRATION       = FORBIDDEN
REAL_DATA                         = NO
CLOUD_WRITE                       = NO
FIGMA_WRITE                       = NO
DOMAIN_WRITE                      = NO
API_WRITE                         = NO
```

Isolated clean-sheet preview for the North Star journey:

```text
Cerere → Product Pick → Configurator → Ofertă
→ Acceptance → Order Snapshot → Production Release
→ Lucrare → Execution Plan → Atelier → Execuție
```

Shared bootstrap (`SessionedApp`) is extracted from the current `App.tsx` so Ui20 and the living runtime share auth / session / ThemeProvider / APIs. Default routes and current page bodies stay unchanged. `/` remains Lucrări.

RW2 selective extraction: `requestResolutionView.ts` and `constructionCompositionModel.ts` only. No RW2 CSS, page tree, or cherry-pick of `69ecd7b`.

```text
VERTICAL_E2E              = PASS
CURRENT_RUNTIME_TESTS     = PASS requests-overview
WEB_TESTS                 = PASS
DOMAIN_TESTS              = PASS
API_TESTS                 = PASS
TYPECHECK                 = PASS
LINT                      = PASS warnings only, pre-existing plus ObjectContinuity export
BUILD                     = PASS web
BUSINESS_FACT_PARITY      = PASS
```

Evidence (gitignored, not committed): `.tmp/ui20-vertical-pass-a/`
