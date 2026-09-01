# UI review — V3 Commercial Wave 1 visual evidence

```text
IMPLEMENTATION_BRANCH = feat/ui-v3-commercial-content-wave1
IMPLEMENTATION_SHA    = fdca09d51fec98ad9efe41ff3a864fe48eb03de4
REVIEW_BRANCH         = review/ui-v3-commercial-wave1-visual
ORIGIN_MAIN           = c32281da1aed93307f0779ce568878f5d371fb23
MODEL_SOURCE          = .tmp/workos-v3-whole-app-content/board/index.html
RUNTIME_URL           = http://127.0.0.1:5318
FIXTURE_CLASS         = SYNTHETIC_LOCAL
PRIVACY_CLASS         = NO_REAL_CUSTOMER_PII
OWNER_ACCEPTED        = NO
NEVER_MERGE_TO_MAIN   = YES
```

This branch is evidence transport only. Do not merge it into `main`.

## Test results at IMPLEMENTATION_SHA

```text
UNIT_TESTS = PASS 157
TYPECHECK  = PASS
BUILD      = PASS
E2E        = PASS 22 / SKIP 1
E2E_SET    = client-workspace, requests-overview, quotes-overview, jobs-overview,
             quote-acceptance, customer-identity, commercial-experience,
             request-installation-facts, optional-site-installation, os-s1-org-capability
E2E_SKIP   = jobs-overview empty list (shared store already has jobs)
```

## Viewports / themes

```text
1440 dark  clients, client hub, requests, quotes, jobs, model clients, side-by-side
1440 light clients, model clients, side-by-side
1280 dark  clients
768 dark   clients
```

## Screenshot list and raw GitHub URLs

Base: `https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/`

### Model

- [ui-review/model/clients_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1440_dark.png)
- [ui-review/model/clients_1440_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1440_light.png)

### Runtime

- [ui-review/runtime/clients_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1440_dark.png)
- [ui-review/runtime/clients_1440_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1440_light.png)
- [ui-review/runtime/clients_1280_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1280_dark.png)
- [ui-review/runtime/clients_768_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_768_dark.png)
- [ui-review/runtime/client-hub_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/client-hub_1440_dark.png)
- [ui-review/runtime/requests_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/requests_1440_dark.png)
- [ui-review/runtime/quotes_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/quotes_1440_dark.png)
- [ui-review/runtime/jobs_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/jobs_1440_dark.png)

### Comparisons

- [ui-review/comparisons/clients_1440_dark_model_vs_runtime.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/comparisons/clients_1440_dark_model_vs_runtime.png)
- [ui-review/comparisons/clients_1440_light_model_vs_runtime.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/comparisons/clients_1440_light_model_vs_runtime.png)

Blob paths (GitHub UI):

- https://github.com/office952/workos-final/blob/review/ui-v3-commercial-wave1-visual/ui-review/manifest.md
- https://github.com/office952/workos-final/tree/review/ui-v3-commercial-wave1-visual/ui-review

## Measured layout at 1440

```text
.content width     = 1184 (equals .app-shell-column)
.metric-band width = 1136
.registry-row width= 1136
.status-chip width = 44
.open target       = 44 x 44
overflow-x         = 0
content max-width  = 90rem / 1440px
content margin     = 0 (not centered)
```

## Contrast

```text
LIGHT row meta #3d4754 on #ffffff = 9.43:1
DARK  row meta #c3cad3 on #1d242e = 9.46:1
MUTED_ON_SELECTED still forbidden (4.30 / 4.10)
```

Computed values also live in `ui-review/measures.json`.
