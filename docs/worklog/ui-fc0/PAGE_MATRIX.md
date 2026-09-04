# UI-FC0 — page score matrix

```text
HEAD = bb5952051abace00078a7aa1bf5930ce72cc4abe
UNIQUE_ROUTE_MOUNTED_PAGE_COMPONENTS = 27
LOGIN_PRE_SHELL = 1
UNIQUE_PAGE_COUNT_INCL_LOGIN = 28
MATRIX_ROWS = 29
```

29 rows because `/admin/stock` overview and item are two compositions of one component, and `/` + `/jobs` share one Lucrări row.

| # | Route | Page | Floorplan now | Sig | Info | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Login (`AppGate`) | Autentificare | ADMIN_CONTROL gate | 8 | 8 | KEEP |
| 2 | `/` `/jobs` | Lucrări | REGISTRY | 7 | 7 | HIGH chrome |
| 3 | `/jobs/*` | Lucrare | OBJECT_WORKSPACE | 8 | 7 | HIGH money presentation |
| 4 | `/atelier` | Atelier | DISPATCH | 9 | 8 | KEEP |
| 5 | `/execution/*` | Execuție | FOCUSED_EXECUTION | 8 | 8 | KEEP |
| 6 | `/clients` | Clienți | REGISTRY | 8 | 8 | KEEP |
| 7 | `/clients/*` | Client Hub | OBJECT_WORKSPACE | 9 | 8 | KEEP |
| 8 | `/requests` | Cereri | REGISTRY | 8 | 7 | HIGH filter duplicate |
| 9 | `/requests/*` | Cerere | OBJECT + VERTICAL_JOURNEY | 8 | 7 | HIGH stack |
| 10 | `/quotes` | Oferte | REGISTRY | 7 | 7 | HIGH chrome |
| 11 | `/quotes/*` | Ofertă | OBJECT_WORKSPACE | 8 | 7 | HIGH money presentation |
| 12 | `/products` | Catalog | REGISTRY split | 5 | 6 | HIGH composition preview |
| 13 | `/products/:code` | Configurator | CONFIGURATOR + spine | 7 | 7 | HIGH ROLE blueprint |
| 14 | `/admin/product-system` | Sistem produs | OWNER_CATALOG | 3 | 5 | **CRITICAL** |
| 15 | `/components` | Module și componente | OWNER_CATALOG | 2 | 6 | **CRITICAL** |
| 16 | `/admin/workcenters` | Utilaje | OWNER_CATALOG | 6 | 8 | **CRITICAL** |
| 17 | `/admin/processes` | Procese | OWNER_CATALOG | 6 | 9 | HIGH chrome |
| 18 | `/admin/people` | Oameni | REGISTRY clone | 4 | 6 | **CRITICAL** identity |
| 19 | `/admin/people/:id` | Persoană | OBJECT clone | 5 | 8 | HIGH |
| 20 | `/admin/people/skills` | Competențe | ADMIN_CONTROL | 5 | 7 | HIGH |
| 21 | `/admin/resources` | Resurse și costuri | CONFIGURATION + drawer | 7 | 6 | HIGH master-detail |
| 22 | `/admin/stock` | Stoc | REGISTRY light | 6 | 6 | HIGH search |
| 23 | `/admin/stock/:id` | Material | OBJECT_WORKSPACE | 7 | 7 | KEEP |
| 24 | `/admin/seller` | Date firmă | ADMIN_CONTROL | 7 | 7 | KEEP |
| 25 | `/admin/operational-services` | Servicii operaționale | ADMIN_CONTROL | 6 | 6 | HIGH Admin L2 |
| 26 | `/admin` | Administrare | REGISTRY cards | 7 | 7 | KEEP |
| 27 | `/admin/customers` | Clienți admin | ADMIN_CONTROL | 5 | 5 | HIGH dual door |
| 28 | `/governance` | Guvernanță | MASTER_DETAIL | 8 | 8 | KEEP |
| 29 | `/system` | Stare sistem | ADMIN_CONTROL | 5 | 6 | LOW |

Row 29 is the same unique-page set as login + 27 signed-in compositions when `/` and `/jobs` share one row. `/commercial` and `*` are redirects, not pages.
