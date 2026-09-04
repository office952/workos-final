# UI-FC0 — current route inventory

```text
SOURCE = apps/web/src/App.tsx
NAV_REGISTRY = apps/web/src/navigation/navigationRegistry.ts
HEAD = bb5952051abace00078a7aa1bf5930ce72cc4abe
LANE = D_RUNTIME
INVENTED_PAGES = NO
```

Derived only from current source. Verified against `App.tsx` Routes block (31 entries).

```text
CURRENT_ROUTE_ENTRY_COUNT = 31
REDIRECT_COUNT = 2
UNIQUE_ROUTE_MOUNTED_PAGE_COMPONENTS = 27
LOGIN_PRE_SHELL = 1
UNIQUE_PAGE_COUNT_INCL_LOGIN = 28
OVERLAY_DRAWER_SURFACES = 12
NAV_DESTINATIONS_IN_REGISTRY = 20
NAV_IMPLEMENTED_WITH_HREF = 14
NAV_HIDDEN_NOT_IMPLEMENTED = 6
```

## Route entries

| # | Path | Component | Kind |
| --- | --- | --- | --- |
| 1 | `/` | `JobsOverviewPage` | alias of Lucrări |
| 2 | `/jobs` | `JobsOverviewPage` | |
| 3 | `/jobs/*` | `JobDetailPage` | |
| 4 | `/atelier` | `AtelierPage` | |
| 5 | `/commercial` | redirect → `/requests` | redirect |
| 6 | `/requests` | `RequestsOverviewPage` | |
| 7 | `/requests/*` | `RequestDetailPage` | |
| 8 | `/quotes` | `QuotesOverviewPage` | |
| 9 | `/quotes/*` | `QuoteInspectionPage` | |
| 10 | `/clients` | `ClientsOverviewPage` | |
| 11 | `/clients/*` | `ClientWorkspacePage` | |
| 12 | `/system` | `SystemStatusPage` | matched under Guvernanță |
| 13 | `/products` | `ProductCatalogPage` | sidebar Catalog |
| 14 | `/products/:productCode` | `ProductConfigurationPage` | |
| 15 | `/execution/*` | `ExecutionWorkspacePage` | matched under Atelier |
| 16 | `/components` | `ComponentsPage` | matched under Sistem produs |
| 17 | `/governance` | `GovernancePage` | |
| 18 | `/admin` | `AdminHomePage` | not a sidebar href |
| 19 | `/admin/product-system` | `ProductSystemAdminPage` | |
| 20 | `/admin/resources` | `ResourcesAdminPage` | |
| 21 | `/admin/stock` | `StockAdminPage` | overview |
| 22 | `/admin/stock/:resourceId` | `StockAdminPage` | detail |
| 23 | `/admin/processes` | `ProcessesAdminPage` | not a sidebar href |
| 24 | `/admin/workcenters` | `WorkcentersAdminPage` | sidebar Utilaje |
| 25 | `/admin/people` | `PeopleAdminPage` | |
| 26 | `/admin/people/skills` | `SkillsAdminPage` | |
| 27 | `/admin/people/*` | `PersonAdminPage` | |
| 28 | `/admin/customers` | `CustomerAdminPage` | not a sidebar href |
| 29 | `/admin/seller` | `SellerAdminPage` | sidebar Firmă |
| 30 | `/admin/operational-services` | `OperationalServicesAdminPage` | |
| 31 | `*` | redirect → `/` | redirect |

Redirects: `/commercial` → `/requests`; unknown paths → `/`.

Pre-shell: `LoginPage` via `AppGate` (`boot` / `network` / `auth_config_missing` / `unauthenticated` / `session_expired`).

## Hidden registry destinations (no route)

Acasă, Furnizori, Achiziții, Pontaj, Plăți și avansuri, Politici.

## Routed but not primary sidebar href

`/admin`, `/admin/customers`, `/admin/processes`, `/admin/people/skills`, `/system`, `/components`, `/execution/*`.

## Distinct composition variants (same component)

- Client Hub sections: `prezentare` / `cereri` / `oferte` / `lucrari`
- Resources tabs: `costuri` / `resurse` / `retete`
- Stock overview vs item
- Product config: quote/order/request restore; editing / reviewing / confirmed
- Atelier: identify vs inbox

## Gates

- Cloud `AppGate` → LoginPage
- API 403 commercial read → `PageStatus forbidden`
- Owner write via `canAdministerOrganization()`
- Operator session on `/atelier` and `/execution/*`
