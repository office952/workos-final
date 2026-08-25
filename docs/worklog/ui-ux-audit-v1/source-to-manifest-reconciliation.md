# Source-to-manifest route reconciliation

Derived from router source files, then joined to `screenshot-manifest.csv` screen IDs.

## Source files

- NEW: `apps/web/src/App.tsx`
- OLD: `C:/w/psiso/frontend/src/App.tsx`
- OLD: `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx`
- OLD: `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx`

Non-route NEW surfaces (not `<Route>` entries; listed so they are not treated as route gaps):

| Surface | Screen ID | Classification | Reason |
| --- | --- | --- | --- |
| AppGate loading | | explained | Transient `Se incarca`; not a designed page |
| AppGate unavailable | app-boot-unavailable | captured | Backend unreachable |
| LoginPage (cloud mode) | cloud-login | captured | Not a path route; gate before Routes |
| Operator identify dialog | operator-identify-dialog | captured | Overlay; empty PIN and invalid PIN |
| Operator session chrome | operator-session | captured | Eligible identified session |

## Counts

| App | Source rows | captured | explained | not-applicable | unexplained |
| --- | ---: | ---: | ---: | ---: | ---: |
| NEW | 26 | 26 | 0 | 0 | 0 |
| OLD | 102 | 67 | 21 | 14 | 0 |

`UNEXPLAINED_ROUTE_GAPS=0`

```text
DYNAMIC_EMPLOYEE_MOBILE_ROUTES =
EXPLICITLY_DEFERRED_OUTSIDE_DESKTOP_V1_AUDIT
```

Dynamic `path={section.path}` employee-mobile blueprint pages are outside the desktop V1 audit. They do not add a source-row gap and they do not change the 102-row join. Do not read captured v1/v2 mobile homes as cartesian mobile coverage.

Do not read this as full page or full state coverage. It only proves every **source-registered route pattern** has a captured screen, an exact non-capture reason, or is a wrapper/redirect.

The first-pack file `route-inventory-reconciliation.txt` was harness-authored and is superseded.

## Rows

| App | Source | Pattern | Screen | Class | Reason |
| --- | --- | --- | --- | --- | --- |
| NEW | `apps/web/src/App.tsx` | `/` | jobs-overview | captured | Jobs overview captured empty/populated and search-empty |
| NEW | `apps/web/src/App.tsx` | `/atelier` | atelier-inbox | captured | Empty/no-session and session-populated-or-ready |
| NEW | `apps/web/src/App.tsx` | `/requests` | requests-overview | captured | Cereri registry |
| NEW | `apps/web/src/App.tsx` | `/requests/:requestId` | request-detail | captured | Request detail |
| NEW | `apps/web/src/App.tsx` | `/quotes` | quotes-overview | captured | Oferte registry |
| NEW | `apps/web/src/App.tsx` | `/clients` | clients-overview | captured | Client registry |
| NEW | `apps/web/src/App.tsx` | `/clients/:customerId` | client-workspace-prezentare | captured | Client workspace plus local Prezentare/Cereri/Oferte/Lucrari projections |
| NEW | `apps/web/src/App.tsx` | `/system` | system-status | captured | System status |
| NEW | `apps/web/src/App.tsx` | `/products` | product-catalog | captured | Sellable catalog |
| NEW | `apps/web/src/App.tsx` | `/products/:productCode` | product-config-letters-edit | captured | LETTERS and ACM edit, confirmed, quote restore, order restore, request restore |
| NEW | `apps/web/src/App.tsx` | `/execution/:planId` | execution-workspace | captured | Planned workspace, machine-blocked, ineligible operator |
| NEW | `apps/web/src/App.tsx` | `/components` | components-inspection | captured | Inspection plus category walk |
| NEW | `apps/web/src/App.tsx` | `/governance` | governance-inspection | captured | Inspection plus category walk |
| NEW | `apps/web/src/App.tsx` | `/admin` | admin-home | captured | Admin home desktop/tablet/narrow |
| NEW | `apps/web/src/App.tsx` | `/admin/product-system` | admin-product-system | captured | Product System admin plus category walk |
| NEW | `apps/web/src/App.tsx` | `/admin/resources` | admin-resources-catalog | captured | Resources plus desktop and narrow category walks |
| NEW | `apps/web/src/App.tsx` | `/admin/stock` | admin-stock-overview | captured | Stock overview |
| NEW | `apps/web/src/App.tsx` | `/admin/stock/:resourceId` | admin-stock-item | captured | Stock item |
| NEW | `apps/web/src/App.tsx` | `/admin/processes` | admin-processes-catalog | captured | Processes plus category walk |
| NEW | `apps/web/src/App.tsx` | `/admin/workcenters` | admin-workcenters-catalog | captured | Workcenters plus category walk |
| NEW | `apps/web/src/App.tsx` | `/admin/people` | admin-people-list | captured | Synthetic people list desktop and narrow |
| NEW | `apps/web/src/App.tsx` | `/admin/people/skills` | admin-skills | captured | Skill-uri heading; synthetic eligibility |
| NEW | `apps/web/src/App.tsx` | `/admin/people/:personId` | admin-person-detail | captured | Synthetic person; name field populated |
| NEW | `apps/web/src/App.tsx` | `/admin/customers` | admin-customers-lifecycle | captured | Customer admin |
| NEW | `apps/web/src/App.tsx` | `/admin/seller` | admin-seller | captured | Audit Synthetic SRL; CIF/IBAN/address empty |
| NEW | `apps/web/src/App.tsx` | `*` | catch-all-redirect | captured | Unknown path redirects to jobs overview |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `operator` | intake-v6-standalone-operator | captured | Relative Intake V6 standalone operator route; live URL is /intake-v6-app/:workspaceId/operator |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `:workspaceId/operator` | intake-v6-standalone-operator | captured | Same standalone operator workspace as /intake-v6-app/:workspaceId/operator |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `(layout)` |  | not-applicable | Layout/outlet wrapper; no designed page of its own |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/employee-app/*` | emp-mobile-v1-home | captured | Employee mobile v1 shell; child routes captured separately |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/employee-app-v2/*` | emp-mobile-v2-home | captured | Employee mobile v2 shell; child routes captured separately |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/intake-v6-app/*` | intake-v6-standalone-operator | captured | Standalone Intake V6 app; index is not a designed page (see explained intake-v6-standalone-index) |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `(layout)` |  | not-applicable | Layout/outlet wrapper; no designed page of its own |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/` | role-home-redirect | captured | Role home redirect |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/dashboard` | planificare-dashboard | captured | Planificare dashboard |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/shop-floor` | control-productie | captured | Control productie / shop floor |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/operator` | operator-task-legacy | captured | Legacy operator task view |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/tablet` | tablet-station-select | captured | Tablet station selector |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/tablet/:stationId` |  | explained | Demo station cards did not expose a /tablet/:stationId href; selector captured instead |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/tablet/:stationId/:taskId` |  | explained | Blocked on missing station-queue href; same legacy tablet family already captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/clients` | clienti-list | captured | Client list |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/clients/:clientName` | client-workspace | captured | Client hub plus local tabs overview/cereri/oferte/comenzi clicked inside the local tab rail |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/documents` | document-center | captured | Document center list; no demo row opened a drawer |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/intake` | new-intake-dialog | captured | WorkIntake / new intake surface |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/intake/:id` |  | explained | IntakeLegacyRoute; demo had no distinct legacy intake id row separate from Intake V6 workspace |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/quotes/:quoteId` | oferte-detail | captured | Offer detail pane |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/quotes` | oferte-list | captured | Offer list |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/orders/:orderId` | comenzi-detail | captured | DEMO-ORDER-001 detail pane visible |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/orders` | comenzi-list | captured | Order list |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/execution` | execution-dashboard | captured | Direct /execution ExecutionDashboard; heading Executie plus DEMO-ORDER-001 |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/execution/reality-review` | operational-reality-review | captured | Operational reality review |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/execution/ops-graph` | ops-graph | captured | Ops Graph; earlier mislabeled execution-detail withdrawn |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/execution/machine-runs` | machine-runs-list | captured | Machine-runs list |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/execution/machine-runs/:machineRunId` |  | explained | Machine-runs list empty in demo; no row to open a detail |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/execution/:order_id` | execution-detail | captured | Isolated demo order_id=1 DEMO-ORDER-001; Rezultat executie captured without writes |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/demo/commercial-spine` |  | explained | DEV commercial-spine demo; not an operator IA page; skipped as development tooling |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/demo/volumetric-letter-preview` |  | explained | DEV volumetric preview demo; not an operator IA page; skipped as development tooling |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/intake-v6/operator` | intake-v6-workspace | captured | In-shell Intake V6 operator workspace |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/intake-v6/:workspaceId/operator` | intake-v6-workspace | captured | Same Intake V6 workspace with workspace id |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/inventory` | inventar | captured | Inventory plus local material tabs |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/inventory/pricing` | preturi | captured | Pricing |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/inventory/material-price-registry` |  | not-applicable | Source redirect to /inventory/pricing; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/inventory/commercial-markup-policy` |  | not-applicable | Source redirect to /inventory/pricing; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/inventory/productsystem-pricing-preview` |  | not-applicable | Source redirect to /inventory/pricing; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/product-system` | product-system-catalog | captured | Product System layout; index redirects to products catalog |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `(index)` | product-system-catalog | not-applicable | Product System index redirects into products catalog; catalog captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products` | product-system-catalog | captured | Nested /product-system/products catalog |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode` | product-system-editor | captured | Template studio plus local studio tabs |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode/structure/vizual-fata` | ps-structure-face | captured | Letters face structure |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode/structure/volum-aluminiu` | ps-structure-volume-al | captured | Letters volume structure |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode/structure/capac-spate` | ps-structure-back | captured | Letters back structure |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode/structure/sistem-led` | ps-structure-led | captured | Letters LED structure |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode/structure/conexiune-litere-acm-preturi` | ps-structure-acm-prices | captured | ACM composition prices |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode/structure/composer-litere-acm` |  | explained | ACM composer mock page; no distinct designed operator studio beyond ACM prices/support template already captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `products/:templateCode/structure/:stepId` |  | explained | ACM boxed structure catch-all; ACM support template has no Letters structure deep links; studio captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `components` |  | explained | ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `resources` |  | explained | ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `operations` |  | explained | ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `dependencies` |  | explained | ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `validation` |  | explained | ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `advanced` |  | explained | ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/product-system/blueprint-dossier` | blueprint-dossier-studio | captured | Blueprint dossier studio |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/product-system/dossier-completion` |  | not-applicable | Source redirect to /product-system/blueprint-dossier; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/pricing` |  | not-applicable | Source redirect to /inventory/pricing; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/product-system/output-blocks-preview` | output-blocks-preview | captured | Output blocks preview |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/products` |  | not-applicable | Source redirect to /product-system/products; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/templates` |  | not-applicable | Source redirect to /product-system/products; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/personal` |  | not-applicable | Source redirect to /employees; destination captured |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/employees` | angajati-registry | captured | Operational employees; demo synthetic names |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/employees-records` | evidenta-hr-list | captured | HR evidence list |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/employees-records/:employeeId` | employee-profile | captured | Employee profile from demo row |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/attendance` | pontaj | captured | Attendance |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/attendance/effects` | attendance-effects | captured | Attendance effects |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/employee-payments` | plati-angajati | captured | Employee payments |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/employee-advances` | avansuri | captured | Employee advances |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/colaboratori` | colaboratori | captured | Collaborators |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/utilaje` | utilaje | captured | Machines / utilaje |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/reports` | rapoarte | captured | Reports |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/reports/operational` | operational-reports | captured | Operational reports |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/modules` | harta-module | captured | Module chain |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/governance` | guvernanta | captured | Governance plus visible tabs Autoritate/Limite/Adevar/Gates/UI |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/settings` | setari-shell | captured | Settings shell plus representative local tabs |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `*` | login-gate | captured | Outer * is AuthGate (LoginGate captured). Inner * is RoleHomeRedirect (role-home-redirect captured). Distinct auth_config_missing RuntimeStatePanel was not reached; intercept showed LoginGate (explained duplicate, not a second capture) |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/auth/callback` |  | explained | OIDC callback protocol page; isolated preview did not complete a real OIDC callback |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/auth/error` |  | explained | OIDC error protocol page; not opened without a real auth-error payload |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/auth/logout` |  | explained | Logout callback protocol page; not an operator IA page |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `/logout-callback` |  | explained | Logout callback alias; not an operator IA page |
| OLD | `C:/w/psiso/frontend/src/App.tsx` | `*` | login-gate | captured | Outer * is AuthGate (LoginGate captured). Inner * is RoleHomeRedirect (role-home-redirect captured). Distinct auth_config_missing RuntimeStatePanel was not reached; intercept showed LoginGate (explained duplicate, not a second capture) |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/(layout)` | emp-mobile-v1-home | not-applicable | Employee v1 layout wrapper |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app` | emp-mobile-v1-home | captured | Employee v1 home |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/requests` | emp-mobile-v1-requests | captured | Employee v1 requests |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/team` | emp-mobile-v1-team | captured | Employee v1 team |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/review` | emp-mobile-v1-review | captured | Employee v1 review |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/attendance` | emp-mobile-v1-attendance | captured | Employee v1 attendance |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/tasks/orders/:orderId/blueprint` |  | explained | employee-app order blueprint; demo personal navigation did not open a distinct blueprint route |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/tasks` | emp-mobile-v1-tasks | captured | Employee v1 tasks |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/personal` | emp-mobile-v1-personal | captured | Employee v1 personal |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/info` |  | explained | Employee v1 info; same mobile shell captured; no distinct info content beyond personal/home |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx` | `/employee-app/(layout)` | emp-mobile-v1-home | not-applicable | Employee v1 layout wrapper |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/(layout)` | emp-mobile-v2-home | not-applicable | Employee v2 layout wrapper |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2` | emp-mobile-v2-home | captured | Employee v2 home |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/tasks` | emp-mobile-v2-tasks | captured | Employee v2 tasks |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/tasks/:taskId` |  | explained | No v2 task row opened a distinct /tasks/:taskId detail in demo |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/pipeline` | emp-mobile-v2-pipeline | captured | Employee v2 pipeline |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/documents` | emp-mobile-v2-documents | captured | Employee v2 documents |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/blockers` | emp-mobile-v2-blockers | captured | Employee v2 blockers |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/upcoming` | emp-mobile-v2-upcoming | captured | Employee v2 upcoming |
| OLD | `C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx` | `/employee-app-v2/personal/*` | emp-mobile-v2-personal-hub | captured | Employee v2 personal splat; hub plus local personal pages captured |
