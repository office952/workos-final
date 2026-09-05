# UI20-C1 — Route coverage matrix

```text
SOURCE = apps/web/src/App.tsx
NAV = apps/web/src/navigation/navigationRegistry.ts
ADMIN_NAV = apps/web/src/adminNavigation.ts
INVENTED_ROUTES = NO
```

`/` and `/jobs` are one composition. `/commercial` is a redirect, not a page. Login is an AppGate, counted once. Stock overview and stock item are two compositions.

| ROUTE | PAGE | AUDIENCE | PRIMARY_JOB | FAMILY | PERSONALITY | RISK_IF_GENERIC | UI20_STATUS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AppGate | Autentificare | operator | enter organization | QUIET | calm consequence | SaaS login splash | COVERED |
| `/` `/jobs` | Lucrări | production | position + work + blocker | REGISTRY | production ledger | Kanban / metric cards | COVERED |
| `/jobs/*` | Lucrare | production | living job sheet | OBJECT | compressed history | PM timeline | COVERED |
| `/atelier` | Atelier | operator | what can start | OBJECT | inbox | factory map | COVERED |
| `/requests` | Cereri | commercial | missing truth + readiness | REGISTRY | clarification list | generic inbox | COVERED |
| `/requests/*` | Cerere | commercial | resolve missing | OBJECT | known / missing | form wizard | COVERED |
| `/quotes` | Oferte | commercial | state + revision + value | REGISTRY | commercial ledger | CRM pipeline | COVERED |
| `/quotes/*` | Ofertă | commercial | freeze artifact | OBJECT | paper + serif | Cerere with serif | COVERED |
| `/clients` | Clienți | commercial | relationship + activity | REGISTRY | relationship list | CRM table | COVERED |
| `/clients/*` | Client Hub | commercial | belonging objects + attention | HUB | dossier, not CRM | Salesforce clone | COVERED |
| `/system` | Stare sistem | owner | health | QUIET | low theatre | ops dashboard | MAPPED_BY_FAMILY |
| `/products` | Catalog | commercial | identity + family + configurable | REGISTRY | product identity | shop grid | COVERED |
| `/products/:code` | Configurator | commercial | construction bench | OBJECT | stack of parts | CAD | COVERED |
| `/execution/*` | Execuție | operator | one active station | OBJECT | focal station | SCADA | COVERED |
| `/components` | Module | owner | inspect roles | PRODUCT | inspection | component gallery | MAPPED_BY_FAMILY |
| `/governance` | Guvernanță | owner | authority limits | QUIET | precise limits | settings dump | COVERED |
| `/admin` | Administrare | owner | domain index | ADMIN | quiet authority | marketplace | COVERED |
| `/admin/product-system` | Sistem produs | owner | template → composition | PRODUCT | construction definition | CAD / FC1B | COVERED |
| `/admin/resources` | Resurse | owner | internal rates | OBJECT | ledger | price dashboard | COVERED |
| `/admin/stock` | Stoc | owner | balance | STOCK | sold, not price | inventory ERP | COVERED |
| `/admin/stock/:id` | Material | owner | movements | STOCK | identity + sold | SKU page | COVERED |
| `/admin/processes` | Procese | owner | how work is done | PRODUCT | capability, not graph | backend graph | COVERED |
| `/admin/workcenters` | Utilaje | owner | what a place can do | MACHINES | capability profile | telemetry | COVERED |
| `/admin/people` | Oameni | owner | who can work | PEOPLE | eligibility | HRIS cards | COVERED |
| `/admin/people/skills` | Calificări | owner | operational skill | PEOPLE | capability catalog | permission matrix | COVERED |
| `/admin/people/*` | Persoană | owner | one operator | PEOPLE | identity + eligibility | employee file | COVERED |
| `/admin/customers` | Clienți admin | owner | lifecycle | ADMIN | add / rename / retire | second CRM | MAPPED_BY_FAMILY |
| `/admin/seller` | Date firmă | owner | seller on new quotes | QUIET | legal identity | company settings | MAPPED_BY_FAMILY |
| `/admin/operational-services` | Servicii operaționale | owner | what org may offer | ADMIN | modular offer | service marketplace | MAPPED_BY_FAMILY |

## Not routes

| NAV ID | LABEL | AVAILABILITY | STATUS |
| --- | --- | --- | --- |
| home | Acasă | not_implemented | PRODUCT_HOLD |
| suppliers | Furnizori | not_implemented | PRODUCT_HOLD |
| purchasing | Achiziții | not_implemented | PRODUCT_HOLD |
| attendance | Pontaj | not_implemented | PRODUCT_HOLD |
| payments | Plăți și avansuri | not_implemented | PRODUCT_HOLD |
| policies | Politici | not_implemented | PRODUCT_HOLD |

```text
UNIQUE_PAGE_COMPOSITIONS = 29
UI20_ALREADY_COVERED = 7
UI20_NOT_COVERED_BEFORE_C1 = 17
UI20_CONTRACT_ONLY_BEFORE_C1 = 3
UI20_HOLD_BY_PRODUCT_TRUTH = 6
UNEXPLAINED_GAPS = 0
```
