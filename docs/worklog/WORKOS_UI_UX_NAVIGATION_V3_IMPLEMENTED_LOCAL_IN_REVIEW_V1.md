# V3 navigation Wave 1 — implemented local in review

```text
DATE                               = 2026-08-31
BRANCH                             = feat/ui-v3-stable-sidebar-shell
BASE_HEAD                          = ff046ef9ac994f0e3057817694e2289b5970c988
UI_UX_NAVIGATION_V3_DESIGN         = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION = IMPLEMENTED_LOCAL_IN_REVIEW
RUNTIME_ACCEPTED                   = NO
INTEGRATED_ON_MAIN                 = NO
OS_S3                              = HOLD
NEXT_WAVE                          = NO
```

Wave 1 replaces the five-item top nav with the accepted stable sidebar. It projects existing runtime routes only. It does not add Home, Pontaj, Plăți, Furnizori, Achiziții, Politici, OS-S3, or page-content redesign.

## Route decision

```text
HOME_ROUTE        = HIDDEN
ROOT_SEMANTICS    = Lucrări list (JobsOverviewPage)
LUCRARI_CANONICAL = /jobs
LUCRARI_ALIAS     = / remains the same list
```

`/` is not relabelled as Acasă. No fake operational home.

## Visibility

```text
TARGET_REGISTRY_COUNT     = 20
VISIBLE_IMPLEMENTED_COUNT = 14
HIDDEN_NOT_IMPLEMENTED    = Acasă, Furnizori, Achiziții, Pontaj, Plăți și avansuri, Politici
HIDDEN_BY_ROLE            = none
HIDDEN_BY_CAPABILITY      = none
```

Owner/member write gates stay on pages. This wave does not add navigation RBAC.

## Shell

```text
EXPANDED_WIDTH  = 256px
COLLAPSED_WIDTH = 72px
DRAWER_WIDTH    = min(88vw, 384px)
```

Duplicated persistent chrome removed: Comercial L2, AdminSidebar, AdminDomainLinks. People Listă / Calificări remains a labelled page tool.

## Colon identities

React Router `useParams` and string `Link to` truncate `qts:…`, `ord:…`, `crq:…`, `exp:…`, and `per:…` at the first colon. Wave 1 keeps those deep links with splat routes plus `usePathIdAfter` / `appLocation`. The API reads the same identities with `httpPathIdentity` on quotes, requests, jobs, execution plans/tasks.

## Evidence

Live runtime screenshots: `docs/worklog/screenshots/v3-nav-*.png` (1440 / 1280 / 768, not the reconstructed board).

```text
WORKSPACE_TESTS = PASS (domain + api + web)
LINT            = PASS (0 errors, existing refresh warnings)
TYPECHECK       = PASS
BUILD           = PASS
E2E             = PASS isolated 5189/8799: 74 passed, 5 skipped, 1 PIN locator fail later fixed, 1 Chromium worker flake that passed on retry
E2E_FOLLOW_UP   = PASS hf-wave3 + golden-path; PASS admin-people-executor + v3-navigation-shell after people splat
INDEPENDENT_VERIFIER = pending live script .tmp/v3-nav-wave1/verify-app-readonly.mjs
```

Do not mark runtime accepted or integrated on main.
