# WorkOS V3 — Cereri Figma Final — Owner accepted

```text
DATE                           = 2026-09-02
OWNER_DECISION                 = ACCEPT CERERI V3 FIGMA FINAL
OWNER_ACCEPTED_SCOPE           = CERERI_V3_FIGMA_FINAL
REQUESTS_DIRECTION             = OWNER_ACCEPTED
CERERI_V3_FIGMA_FINAL          = OWNER_ACCEPTED
FIGMA_REOPEN_REQUIRED          = NO
REQUESTS_RUNTIME               = NOT_AUTHORIZED
REACT_WRITE                    = NO
DOMAIN_WRITE                   = NO
API_WRITE                      = NO
BACKEND_WRITE                  = NO
DATABASE_WRITE                 = NO
CLOUD_WRITE                    = NO
COMMIT                         = NO
PUSH                           = NO
NEXT_WAVE                      = NO
OS_S3                          = NO
```

Owner accepted the Cereri V3 Figma as final design truth for `/requests` and `/requests/:requestId`. This record does not authorize React, domain, API, or runtime change. Page-content transformation stays `IN_PROGRESS`. Oferte and Lucrări remain unaccepted.

## Identity

```text
REPO               = office952/workos-final
FIGMA_FILE         = WorkOS V3 — Clients Final Design
FIGMA_FILE_KEY     = 1ev5lg7m2Ze1h3Vqmax8ho
FIGMA_PAGE         = WorkOS V3 — Cereri
FIGMA_PAGE_ID      = 105:4078
UX_LOCK            = 105:4079 / 105:4081
A11Y               = 107:8424 / 107:8426
```

## Accepted direction locks

```text
ATTENTION_LAW
  NEW                         → ATTENTION / De preluat
  IN_REVIEW                   → NO_ATTENTION
  WAITING_CUSTOMER            → NO_ATTENTION
  READY_FOR_QUOTE_NO_QUOTE    → ATTENTION / Urmează oferta
  BLOCKED                     → ATTENTION / Blocat
  CANCELLED                   → NO_ATTENTION
  LINKED_QUOTE_NON_BLOCKED    → NO_REQUEST_ATTENTION

REQUEST_INLINE_CLIENT_CREATE  = secondary + canonical client profile
CLIENT_HUB_REQUEST_ENTRY      = customer locked · no alternate create
1920_TOOLBAR                  = status chips + attention + count | search
1440_1280_768_TOOLBAR         = StatusFilter compact + attention + count
STATUS_FILTER_PARITY          = all 7 statuses in compact control
REQUEST_OBJECT_FLOORPLAN      = no Hub rail · no local tabs
LOCK_BACKEND_COPY             = ABSENT
EDITARE                       = Disponibilă — fără ofertă · Blocată după ofertă
LONG_DESCRIPTION              = SHORT full text · no Arată tot | OVERFLOW Arată tot | EXPANDED Restrânge
RELATED                       = Oferte și lucrări legate · Ofertă + Lucrare · no Cerere row
INSTALLATION_INCOMPATIBLE     = Modul salvat nu mai este oferit de organizație.
```

## Post-acceptance Owner amendment — 2026-09-02

```text
SUPERSEDES_BUSINESS_LINES_ONLY = YES
FIGMA_GEOMETRY_REOPENED        = NO
FIGMA_WRITE                    = NO
```

On 2026-09-02 Owner amended two business lines after Figma acceptance. The original Figma UX LOCK (`105:4079` / `105:4081`) remains historical visual evidence. These later Owner business semantics govern implementation. Do not modify the Figma file. Do not rewrite the timestamps above or pretend this amendment existed before Figma acceptance.

```text
ATTENTION =
  BLOCKED +
  READY_FOR_QUOTE_WITHOUT_LINKED_QUOTE
NEW_ATTENTION              = NO
IN_REVIEW_ATTENTION        = NO
WAITING_CUSTOMER_ATTENTION = NO
CANCELLED_ATTENTION        = NO
QUICK_CLIENT_CREATE        = MINIMAL_NAME_ONLY_ON_REQUESTS_REGISTRY
HUB_ENTRY                  = CUSTOMER_LOCKED
NO_QUICK_CREATE            = YES
DEFAULT_SORT               = CREATED_AT_DESC
ATTENTION_SORT             = NO
```

The Figma 1920 frame still draws NEW with Signal Edge and `De preluat`. Runtime must not reproduce that semantic. The accepted geometry stays; only those business lines are superseded.

## Accepted frames

| Frame | Node |
|---|---|
| UX LOCK · Cereri V3 | `105:4079` |
| Cereri / 1920 / Light / Populated | `105:4152` |
| Cereri / 1920 / Dark / Populated | `107:4317` |
| Cereri / 1440 / Light / Populated | `107:4394` |
| Cereri / 1280 / Light / Populated | `107:4471` |
| Cereri / 1920 / Light / Empty | `107:4548` |
| Cereri / 1920 / Light / Attention filter | `107:4625` |
| Cereri / 1920 / Light / Search miss | `107:4702` |
| Cereri / 1920 / Light / Long title | `107:4779` |
| Cerere / 1920 / Light / Object | `107:6506` |
| Cerere / 1920 / Light / Attention · De preluat | `107:6584` |
| Cerere / 1920 / Light / Installation incomplete | `107:6663` |
| Cerere / 1920 / Light / Edit drawer | `107:6735` |
| Cerere / 768 / Light / Object | `107:6819` |
| Cereri / 768 / Light / Populated | `107:6865` |
| Cerere / 1920 / Light / Create drawer · Client nou | `107:7943` |
| Cerere / 1920 / Light / Attention · Urmează oferta | `107:8027` |
| Cerere / 1920 / Light / Cancelled | `107:8106` |
| Cerere / 1920 / Light / Files | `107:8184` |
| Cerere / 1920 / Light / Installation locked | `107:8262` |
| Cerere / 1920 / Light / Confirm deselect montaj | `107:8340` |
| A11Y · Cereri V3 | `107:8424` |
| Cereri / 768 / Dark / Populated | `108:7284` |
| Cereri / 1920 / Light / Create drawer · Registry | `108:7454` |
| Cerere / 1920 / Light / Create drawer · Hub locked | `108:7553` |
| Cerere / 1920 / Light / Installation mode incompatible | `109:7489` |

Local components on the same page: `StatusFilter` `109:7288`, `RequestFactLine` `109:7292`.

## Closed graphic issues

```text
DARK_WHITE_ISLANDS              = CLOSED
1440_TOOLBAR                    = CLOSED
1280_TOOLBAR                    = CLOSED
768_FILTER_PARITY               = CLOSED
REQUEST_OBJECT_FLOORPLAN_DRIFT  = CLOSED
INSTALLATION_HIERARCHY          = CLOSED
INCOMPATIBLE_MODE_STATE         = CLOSED
LOCK_VISIBLE                    = NO
SHORT_DESCRIPTION_FAKE_EXPAND   = NO
RELATED_REQUEST_ROW_RESIDUE     = NO
```

## Not authorized by this accept

```text
REQUESTS_REDESIGN_INTEGRATED   = NO
QUOTES_REDESIGN                = NO
JOBS_REDESIGN                  = NO
COMMERCIAL_PAGE_REORGANIZATION = NOT_COMPLETE
```

This file does not start Cereri React. A later Owner GO is required for implementation.

## Canon

Living status is recorded in:

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `AGENTS.md`
