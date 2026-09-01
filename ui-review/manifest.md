# UI review — V3 Commercial Wave 1 final Clients convergence

```text
IMPLEMENTATION_BRANCH = feat/ui-v3-commercial-content-wave1
IMPLEMENTATION_SHA    = 05929e4fb704e8d972c883d69eb6767c2fc2c965
BASE_SHA              = fdca09d51fec98ad9efe41ff3a864fe48eb03de4
REVIEW_BRANCH         = review/ui-v3-commercial-wave1-visual
ORIGIN_MAIN           = c32281da1aed93307f0779ce568878f5d371fb23
DRAFT_PR              = https://github.com/office952/workos-final/pull/1
MODEL_SOURCE          = .tmp/workos-v3-whole-app-content/board/index.html
RUNTIME_URL           = http://127.0.0.1:5318
FIXTURE_CLASS         = SYNTHETIC_LOCAL
PRIVACY_CLASS         = NO_REAL_CUSTOMER_PII
OWNER_ACCEPTED        = NO
NEVER_MERGE_TO_MAIN   = YES
APP_CONTENT_MAX_WIDTH = none
```

This branch is evidence transport only. Do not merge it into `main`.

## Width matrix

```text
viewport  column  content  band   row    dead  gutter
1440      1184    1184     1136   1136   0     24
1536      1280    1280     1232   1232   0     24
1920      1664    1664     1616   1616   0     24
2048      1792    1792     1744   1744   0     24
1280      1024    1024     976    976    0     24
768       768     768      720    720    0     24
```

`contentMaxWidth = none` at desktop. RIGHT_DEAD_SPACE_PX is the shell-column remainder, not the intentional identity-to-summary gap inside a row.

## Raw GitHub URLs

Base: `https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/`

### Model

- [ui-review/model/clients_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1440_dark.png)
- [ui-review/model/clients_1440_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1440_light.png)

### Runtime

- [ui-review/runtime/clients_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1440_dark.png)
- [ui-review/runtime/clients_1440_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1440_light.png)
- [ui-review/runtime/clients_1536_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1536_dark.png)
- [ui-review/runtime/clients_1920_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1920_dark.png)
- [ui-review/runtime/clients_2048_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_2048_dark.png)
- [ui-review/runtime/clients_1280_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1280_dark.png)
- [ui-review/runtime/clients_768_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_768_dark.png)
- [ui-review/runtime/client-hub_1920_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/client-hub_1920_dark.png)
- [ui-review/runtime/requests_1920_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/requests_1920_dark.png)
- [ui-review/runtime/quotes_1920_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/quotes_1920_dark.png)
- [ui-review/runtime/jobs_1920_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/jobs_1920_dark.png)

### Comparisons

- [ui-review/comparisons/clients_1440_dark_model_vs_runtime.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/comparisons/clients_1440_dark_model_vs_runtime.png)
- [ui-review/comparisons/clients_1440_light_model_vs_runtime.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/comparisons/clients_1440_light_model_vs_runtime.png)

## Tests at IMPLEMENTATION_SHA

```text
UNIT_TESTS = PASS 157
TYPECHECK  = PASS
BUILD      = PASS
E2E        = PASS 22 / SKIP 1
```
