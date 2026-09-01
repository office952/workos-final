# UI review — Clients Figma final runtime evidence

```text
IMPLEMENTATION_BRANCH = feat/ui-v3-commercial-content-wave1
IMPLEMENTATION_SHA    = 2c8daf3a7624277cad6eec34d4bceee9a9ee8e37
START_HEAD            = 05929e4fb704e8d972c883d69eb6767c2fc2c965
ORIGIN_MAIN           = c32281da1aed93307f0779ce568878f5d371fb23
REVIEW_BRANCH         = review/ui-v3-commercial-wave1-visual
DRAFT_PR              = https://github.com/office952/workos-final/pull/1
FIGMA_FILE_KEY        = 1ev5lg7m2Ze1h3Vqmax8ho
FIGMA_FILE            = WorkOS V3 — Clients Final Design
SOURCE_OF_VISUAL_TRUTH = FIGMA_FINAL
SOURCE_OF_BUSINESS_TRUTH = CURRENT_WORKOS_DOMAIN
FIXTURE_CLASS         = SYNTHETIC_LOCAL
PRIVACY_CLASS         = NO_REAL_CUSTOMER_PII
OWNER_ACCEPTED        = NO
OWNER_ACCEPTED_SCOPE  = CLIENTS_FIGMA_FINAL_DIRECTION
RUNTIME_OWNER_ACCEPTED = NO
NEVER_MERGE_TO_MAIN   = YES
PAGINATION_RUNTIME_IMPLEMENTED = NO
RETURN_PAGE           = DEFERRED_NOT_SUPPORTED
```

This branch is evidence transport only. Do not merge it into `main`.

## Figma nodes used

```text
1920 Light = 2:383
1920 Dark  = 4:314
1440 Light = 4:379
1440 Dark  = 4:444
1280       = 4:509
768        = 4:1734
Client Card / States = 2:365
Metric Card / States = 6:1611
Pagination / States  = 6:1653
Tokens / UX Lock     = 4:1912
```

## Runtime captures

Viewport files are viewport-framed, not full-page dumps. Theme is forced via `workos.theme`. Data is the local/synthetic e2e registry, not Figma fixture names.

```text
viewport  theme   file                              figma_node
1920      light   runtime/clients_1920_light.png    2:383
1920      dark    runtime/clients_1920_dark.png     4:314
1440      light   runtime/clients_1440_light.png    4:379
1440      dark    runtime/clients_1440_dark.png     4:444
1280      light   runtime/clients_1280.png          4:509
768       light   runtime/clients_768.png           4:1734
```

Figma screenshots for the same nodes live under `ui-review/model/`.

Sibling shell regression (brand / header / width / overflow only):

```text
runtime/requests_1440.png
runtime/quotes_1440.png
runtime/jobs_1440.png
runtime/atelier_1440.png
runtime/admin_1440.png
```

## Raw GitHub URLs

Base: `https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/`

### Figma model

- [ui-review/model/clients_1920_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1920_light.png)
- [ui-review/model/clients_1920_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1920_dark.png)
- [ui-review/model/clients_1440_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1440_light.png)
- [ui-review/model/clients_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1440_dark.png)
- [ui-review/model/clients_1280.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_1280.png)
- [ui-review/model/clients_768.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/model/clients_768.png)

### Runtime

- [ui-review/runtime/clients_1920_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1920_light.png)
- [ui-review/runtime/clients_1920_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1920_dark.png)
- [ui-review/runtime/clients_1440_light.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1440_light.png)
- [ui-review/runtime/clients_1440_dark.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1440_dark.png)
- [ui-review/runtime/clients_1280.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_1280.png)
- [ui-review/runtime/clients_768.png](https://raw.githubusercontent.com/office952/workos-final/review/ui-v3-commercial-wave1-visual/ui-review/runtime/clients_768.png)

## Tests at IMPLEMENTATION_SHA

```text
UNIT_TESTS = PASS 163
TYPECHECK  = PASS
BUILD      = PASS
E2E_FOCUSED = PASS clients-registry + smoke + client-workspace + v3-navigation-shell + sibling overviews
```
