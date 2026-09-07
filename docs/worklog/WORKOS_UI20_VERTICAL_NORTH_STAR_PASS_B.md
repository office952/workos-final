# WORKOS UI20 — Vertical North Star Pass B

```text
STATUS                            = IMPLEMENTED_LOCAL_IN_REVIEW
PASS_A                            = ACCEPTED_FUNCTIONAL_VERTICAL_SKELETON
PASS_B                            = OPERATIONAL_INSTRUMENT_DEPTH
PASS_C                            = NO
OWNER_ACCEPTED                    = NO
MERGE_AUTHORIZED                  = NO
HOME                              = NO
PARTIAL_MAIN_UI_INTEGRATION       = FORBIDDEN
REAL_DATA                         = NO
CLOUD_WRITE                       = NO
FIGMA_WRITE                       = NO
DOMAIN_WRITE                      = NO
API_WRITE                         = NO
THEME_IMPACT                      = LIGHT + DARK (ui20 tokens only)
BACKEND_DETAILS_EXPOSED           = NO
```

Pass B turns the six Pass A skeletons into distinct operational instruments on the same isolated preview and the same commercial spine. Current `App.tsx` runtime stays unchanged.

```text
Cerere        = resolution field (Cunoscut / Nerezolvat)
Product Pick  = contextual available products
Configurator  = composition map + context lens
Ofertă        = frozen commercial sheet
Lucrare       = Trecut / Current / Următor traveler
Atelier       = flat dispatch worklist
Execuție      = focused workstation
```

Visual direction remains `G_LIVING_FABRICATION_INSTRUMENT` / Calm Precision + Selective Fabrication Energy. Figma file `0XP0yGa1siWQdTTL7ou8xz` supplied mental models only. Specimen commercial values and fake telemetry were not copied.

```text
UNCONDITIONAL_ATELIER_GLOBAL_LINK = NO
CONFIGURATOR_COMMERCIAL_PRICE_VISIBLE = NO
OFERTA_COMMERCIAL_VALUE_VISIBLE = YES
REQUEST_INVENTED_PRODUCT_STATE = NO
OLD_UI_CONTAMINATION = NONE
VERTICAL_E2E_ORDER = LUCRARE_TO_ATELIER_TO_EXECUTION
```

```text
VERTICAL_E2E              = PASS  (playwright.ui20.config.ts)
CURRENT_RUNTIME_TESTS     = PASS  quote-acceptance + requests-overview
WEB_TESTS                 = PASS  68 files / 250
DOMAIN_TESTS              = PASS  72 files / 453
API_TESTS                 = PASS  48 files / 302
TYPECHECK                 = PASS
LINT                      = PASS  warnings only; pre-existing plus ObjectContinuity export
BUILD                     = PASS  current vite index.html bundle
BUSINESS_FACT_PARITY      = PASS
```

Evidence (gitignored, not committed): `.tmp/ui20-vertical-pass-b/`
