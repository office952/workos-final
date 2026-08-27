# Architecture C UI Wave 1 — Owner accepted with advisories

```text
DATE                               = 2026-08-27
BRANCH                             = feat/architecture-c-ui-wave1-shell-resources-v1
BASE_HEAD                          = e0a5e53a335334433bb6574966687b6b3c1de1a6
WAVE_1_ACCEPTED_CODE_HEAD          = be6d60227d9917f7cba267755c6919f51baf79c9
ARCHITECTURE_C_DIRECTION           = OWNER_ACCEPTED
DIRECTION_ACCEPTED                 = YES
IMPLEMENTED_LOCAL_IN_REVIEW        = YES
RUNTIME_VERIFIED                   = YES
OWNER_ACCEPTED_WITH_ADVISORIES     = YES
INTEGRATED_ON_MAIN                 = YES after the acceptance-record commit that follows be6d602
ARCHITECTURE_C_UI_WAVE_1           = OWNER_ACCEPTED_WITH_ADVISORIES
OWNER_ACCEPTED                     = YES_WITH_ADVISORIES
ARCHITECTURE_C_UI_WAVE_2           = NOT_STARTED
ARCHITECTURE_C_UI_WAVE_2_AUTHORIZED = NO
FIGMA_LIBRARY_PUBLISHED            = NO
TARGETED_FINDINGS_CLOSED           = 3/3
PRODUCTION_QUERY_FIXTURE           = REMOVED
LOADING_ACCESSIBILITY              = PASS
ERROR_ACCESSIBILITY                = PASS
RETRY_ACTION                       = PASS
CANONICAL_ADMIN_L2_ORDER           = STABLE
SMART_MODULARITY_IMPLEMENTED       = NO
SMART_MODULARITY_STRUCTURE_PREPARED = YES
CONFIGURATION_SURFACE              = NONE
ADMIN_TOOLING_DEBT                 = YES
NO_CLIENT_CODE_FORK                = YES
WEB                                = http://127.0.0.1:5189
API                                = http://127.0.0.1:8803
STASH_STATUS                       = KEPT
NEXT_STEP                          = roadmap selection after integration
```

This record keeps the implementation history and adds Owner acceptance. It does not authorize Wave 2 and does not declare smart modularity implemented.

```text
ROADMAP_READ        = YES
CURRENT_MILESTONE   = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP           = HUB_MEDIA_ORGANIZATION_CONFIGURATION
DIRECTION_CONFLICT  = NO
```

## Timeline

1. `DIRECTION_ACCEPTED` — Architecture C direction already Owner-accepted; Wave 1 planning complete.
2. `IMPLEMENTED_LOCAL_IN_REVIEW` — local commit implemented the shell plus `/admin/resources`.
3. `RUNTIME_VERIFIED` — isolated 5189/8803, targeted tests, and Owner evidence packs.
4. `OWNER_ACCEPTED_WITH_ADVISORIES` — Owner accepted code HEAD `be6d60227d9917f7cba267755c6919f51baf79c9`.
5. `INTEGRATED_ON_MAIN` — this acceptance-record commit fast-forwards onto `origin/main`. `be6d602` stays unmodified.

## What landed

Global Architecture C shell foundations plus the first migrated route `/admin/resources`. This is not a 27-pattern migration and not Wave 2.

- Brand **WorkOS Final**; L1 Lucrări / Atelier / Comercial / Catalog / Administrare; 768 **Meniu** overflow.
- Cont ≥44×44 with short name, optional legal name wrap, authenticated account, LIGHT/DARK/SYSTEM, logout.
- Office rule on `/admin`: no **Identifică-te** CTA; operator chip only if a session exists, compact and passive.
- Admin L2 distinct from MasterSelector. Canonical L2: Resurse, Utilaje și zone, Oameni, Procese, Guvernanță. `?nav=basic` is ignored on the production route.
- Selection authority: `/admin/resources?selected=<stable-catalog-item-id>` from `buildResourcesCatalog`. Live `GET /api/resources-admin`. No second catalog.
- 768: **Secțiuni** and **Alege elementul** drawers, one open, overlay, Escape, × `Închide`, focus trap, return focus, scroll lock.
- SkipLink compact, hidden until focus. Login wall: **Sari la autentificare**. Authenticated: **Sari la conținut**.
- Cost write label **Confirmă tarif** on the existing PATCH. No Figma `4,25 EUR/m`. No commercial price on Resurse.
- Targeted closure: production `nav` fixture removed; loading `role="status"` + `aria-live="polite"`; error `role="alert"`; **Reîncearcă** reissues GET without reload, session loss, or PATCH.

## Targeted findings closed

```text
P2_1 production-visible ?nav=basic  = CLOSED
P2_2 loading/error not announced    = CLOSED
P2_3 resources error has no retry   = CLOSED
```

## Test matrix

```text
web targeted unit              = 41 passed
API cost-evidence targeted     = 16 passed
typecheck web / api            = 0 errors
lint web                       = 0 errors, 11 baseline warnings
lint api                       = 3 unused-var errors in untouched files (baseline)
build web                      = success
isolated Wave 1 Playwright     = 4/4 passed
git diff --check BASE..HEAD    = clean
```

## Advisories accepted

1. Cont may wrap a long legal name.
2. SkipLink is compact and visible on focus.
3. Organization module configuration remains future work.
4. The three API lint errors in untouched files remain baseline.

Do not turn these advisories into another Wave 1 correction.

## Smart modularity

```text
SMART_MODULARITY_IMPLEMENTED         = NO
SMART_MODULARITY_STRUCTURE_PREPARED  = YES
CONFIGURATION_SURFACE                = NONE
CUSTOMER_OPERABLE_WITHOUT_CURSOR     = NO for module configuration
ADMIN_TOOLING_DEBT                   = YES
NO_CLIENT_CODE_FORK                  = YES
PRODUCTION_QUERY_FIXTURE             = REMOVED
```

`availableSectionIds` remains a reusable hook. Disabled/Basic/Advanced are not implemented.

## Product boundaries

```text
PRODUCT_DEFINITION_DIFF    = NONE
PRODUCT_AGGREGATE_DIFF     = NONE
PRICING_DIFF               = NONE
COST_ENGINE_DIFF           = NONE
TASK_GRAPH_SEMANTIC_DIFF   = NONE
AUTH_ARCHITECTURE_DIFF     = NONE
CLOUD_SCHEMA_DIFF          = NONE
REAL_CLOUD_ROOT            = UNTOUCHED
```

## Evidence

Owner review pack: `.tmp/workos-architecture-c-ui-wave1-owner-review/`
Desktop copy: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_REVIEW`
Zip: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_REVIEW.zip`

Targeted closure pack: `.tmp/workos-architecture-c-ui-wave1-targeted-closure/`
Desktop copy: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_TARGETED_CLOSURE`
Zip: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_TARGETED_CLOSURE.zip`
`manifest.sha256` = `0a1b44df78e59077a18b6269f6f46c2bff3c13d12eca388139d0113c8c493139`

Isolated Cloud root is synthetic and ignored. Credentials stay in that root only. Real HUB Cloud was not used.

## Stash

```text
stash@{0} = architecture-c-wave1-planning-docs-safety
STATUS    = KEPT
```

## Not authorized by this accept

Wave 2, Figma library publish, HUB organization-configuration accept, first real LETTERS job, product/CSS/test changes in the acceptance step.
