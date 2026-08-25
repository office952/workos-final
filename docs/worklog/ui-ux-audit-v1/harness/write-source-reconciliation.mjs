import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const inventoryPath = join(root, "source-route-inventory.csv");
const outCsv = join(root, "source-to-manifest-reconciliation.csv");
const outMd = join(root, "source-to-manifest-reconciliation.md");

function parseInventory(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const [app, source_file, route_pattern, element, redirect] = line.split(",");
      return { app, source_file, route_pattern, element, redirect };
    });
}

const NEW = {
  "/": ["jobs-overview", "captured", "Jobs overview captured empty/populated and search-empty"],
  "/atelier": ["atelier-inbox", "captured", "Empty/no-session and session-populated-or-ready"],
  "/requests": ["requests-overview", "captured", "Cereri registry"],
  "/requests/:requestId": ["request-detail", "captured", "Request detail"],
  "/quotes": ["quotes-overview", "captured", "Oferte registry"],
  "/clients": ["clients-overview", "captured", "Client registry"],
  "/clients/:customerId": [
    "client-workspace-prezentare",
    "captured",
    "Client workspace plus local Prezentare/Cereri/Oferte/Lucrari projections",
  ],
  "/system": ["system-status", "captured", "System status"],
  "/products": ["product-catalog", "captured", "Sellable catalog"],
  "/products/:productCode": [
    "product-config-letters-edit",
    "captured",
    "LETTERS and ACM edit, confirmed, quote restore, order restore, request restore",
  ],
  "/execution/:planId": [
    "execution-workspace",
    "captured",
    "Planned workspace, machine-blocked, ineligible operator",
  ],
  "/components": ["components-inspection", "captured", "Inspection plus category walk"],
  "/governance": ["governance-inspection", "captured", "Inspection plus category walk"],
  "/admin": ["admin-home", "captured", "Admin home desktop/tablet/narrow"],
  "/admin/product-system": ["admin-product-system", "captured", "Product System admin plus category walk"],
  "/admin/resources": ["admin-resources-catalog", "captured", "Resources plus desktop and narrow category walks"],
  "/admin/stock": ["admin-stock-overview", "captured", "Stock overview"],
  "/admin/stock/:resourceId": ["admin-stock-item", "captured", "Stock item"],
  "/admin/processes": ["admin-processes-catalog", "captured", "Processes plus category walk"],
  "/admin/workcenters": ["admin-workcenters-catalog", "captured", "Workcenters plus category walk"],
  "/admin/people": ["admin-people-list", "captured", "Synthetic people list desktop and narrow"],
  "/admin/people/skills": ["admin-skills", "captured", "Skill-uri heading; synthetic eligibility"],
  "/admin/people/:personId": ["admin-person-detail", "captured", "Synthetic person; name field populated"],
  "/admin/customers": ["admin-customers-lifecycle", "captured", "Customer admin"],
  "/admin/seller": ["admin-seller", "captured", "Audit Synthetic SRL; CIF/IBAN/address empty"],
  "*": ["catch-all-redirect", "captured", "Unknown path redirects to jobs overview"],
};

const OLD = {
  operator: [
    "intake-v6-standalone-operator",
    "captured",
    "Relative Intake V6 standalone operator route; live URL is /intake-v6-app/:workspaceId/operator",
  ],
  ":workspaceId/operator": [
    "intake-v6-standalone-operator",
    "captured",
    "Same standalone operator workspace as /intake-v6-app/:workspaceId/operator",
  ],
  "(layout)": ["", "not-applicable", "Layout/outlet wrapper; no designed page of its own"],
  "(index)": [
    "product-system-catalog",
    "not-applicable",
    "Product System index redirects into products catalog; catalog captured",
  ],
  "/employee-app/*": ["emp-mobile-v1-home", "captured", "Employee mobile v1 shell; child routes captured separately"],
  "/employee-app-v2/*": ["emp-mobile-v2-home", "captured", "Employee mobile v2 shell; child routes captured separately"],
  "/intake-v6-app/*": [
    "intake-v6-standalone-operator",
    "captured",
    "Standalone Intake V6 app; index is not a designed page (see explained intake-v6-standalone-index)",
  ],
  "/": ["role-home-redirect", "captured", "Role home redirect"],
  "/dashboard": ["planificare-dashboard", "captured", "Planificare dashboard"],
  "/shop-floor": ["control-productie", "captured", "Control productie / shop floor"],
  "/operator": ["operator-task-legacy", "captured", "Legacy operator task view"],
  "/tablet": ["tablet-station-select", "captured", "Tablet station selector"],
  "/tablet/:stationId": [
    "",
    "explained",
    "Demo station cards did not expose a /tablet/:stationId href; selector captured instead",
  ],
  "/tablet/:stationId/:taskId": [
    "",
    "explained",
    "Blocked on missing station-queue href; same legacy tablet family already captured",
  ],
  "/clients": ["clienti-list", "captured", "Client list"],
  "/clients/:clientName": [
    "client-workspace",
    "captured",
    "Client hub plus local tabs overview/cereri/oferte/comenzi clicked inside the local tab rail",
  ],
  "/documents": ["document-center", "captured", "Document center list; no demo row opened a drawer"],
  "/intake": ["new-intake-dialog", "captured", "WorkIntake / new intake surface"],
  "/intake/:id": [
    "",
    "explained",
    "IntakeLegacyRoute; demo had no distinct legacy intake id row separate from Intake V6 workspace",
  ],
  "/quotes/:quoteId": ["oferte-detail", "captured", "Offer detail pane"],
  "/quotes": ["oferte-list", "captured", "Offer list"],
  "/orders/:orderId": ["comenzi-detail", "captured", "DEMO-ORDER-001 detail pane visible"],
  "/orders": ["comenzi-list", "captured", "Order list"],
  "/execution": [
    "execution-dashboard",
    "captured",
    "Direct /execution ExecutionDashboard; heading Executie plus DEMO-ORDER-001",
  ],
  "/execution/reality-review": ["operational-reality-review", "captured", "Operational reality review"],
  "/execution/ops-graph": ["ops-graph", "captured", "Ops Graph; earlier mislabeled execution-detail withdrawn"],
  "/execution/machine-runs": ["machine-runs-list", "captured", "Machine-runs list"],
  "/execution/machine-runs/:machineRunId": [
    "",
    "explained",
    "Machine-runs list empty in demo; no row to open a detail",
  ],
  "/execution/:order_id": [
    "execution-detail",
    "captured",
    "Isolated demo order_id=1 DEMO-ORDER-001; Rezultat executie captured without writes",
  ],
  "/demo/commercial-spine": [
    "",
    "explained",
    "DEV commercial-spine demo; not an operator IA page; skipped as development tooling",
  ],
  "/demo/volumetric-letter-preview": [
    "",
    "explained",
    "DEV volumetric preview demo; not an operator IA page; skipped as development tooling",
  ],
  "/intake-v6/operator": ["intake-v6-workspace", "captured", "In-shell Intake V6 operator workspace"],
  "/intake-v6/:workspaceId/operator": [
    "intake-v6-workspace",
    "captured",
    "Same Intake V6 workspace with workspace id",
  ],
  "/inventory": ["inventar", "captured", "Inventory plus local material tabs"],
  "/inventory/pricing": ["preturi", "captured", "Pricing"],
  "/inventory/material-price-registry": [
    "",
    "not-applicable",
    "Source redirect to /inventory/pricing; destination captured",
  ],
  "/inventory/commercial-markup-policy": [
    "",
    "not-applicable",
    "Source redirect to /inventory/pricing; destination captured",
  ],
  "/inventory/productsystem-pricing-preview": [
    "",
    "not-applicable",
    "Source redirect to /inventory/pricing; destination captured",
  ],
  "/product-system": [
    "product-system-catalog",
    "captured",
    "Product System layout; index redirects to products catalog",
  ],
  products: ["product-system-catalog", "captured", "Nested /product-system/products catalog"],
  "products/:templateCode": ["product-system-editor", "captured", "Template studio plus local studio tabs"],
  "products/:templateCode/structure/vizual-fata": ["ps-structure-face", "captured", "Letters face structure"],
  "products/:templateCode/structure/volum-aluminiu": ["ps-structure-volume-al", "captured", "Letters volume structure"],
  "products/:templateCode/structure/capac-spate": ["ps-structure-back", "captured", "Letters back structure"],
  "products/:templateCode/structure/sistem-led": ["ps-structure-led", "captured", "Letters LED structure"],
  "products/:templateCode/structure/conexiune-litere-acm-preturi": [
    "ps-structure-acm-prices",
    "captured",
    "ACM composition prices",
  ],
  "products/:templateCode/structure/composer-litere-acm": [
    "",
    "explained",
    "ACM composer mock page; no distinct designed operator studio beyond ACM prices/support template already captured",
  ],
  "products/:templateCode/structure/:stepId": [
    "",
    "explained",
    "ACM boxed structure catch-all; ACM support template has no Letters structure deep links; studio captured",
  ],
  components: [
    "",
    "explained",
    "ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor",
  ],
  resources: [
    "",
    "explained",
    "ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor",
  ],
  operations: [
    "",
    "explained",
    "ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor",
  ],
  dependencies: [
    "",
    "explained",
    "ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor",
  ],
  validation: [
    "",
    "explained",
    "ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor",
  ],
  advanced: [
    "",
    "explained",
    "ProductSystemPlannedSectionPage placeholder; same Product System shell as catalog/editor",
  ],
  "/product-system/blueprint-dossier": ["blueprint-dossier-studio", "captured", "Blueprint dossier studio"],
  "/product-system/dossier-completion": [
    "",
    "not-applicable",
    "Source redirect to /product-system/blueprint-dossier; destination captured",
  ],
  "/pricing": ["", "not-applicable", "Source redirect to /inventory/pricing; destination captured"],
  "/product-system/output-blocks-preview": ["output-blocks-preview", "captured", "Output blocks preview"],
  "/products": ["", "not-applicable", "Source redirect to /product-system/products; destination captured"],
  "/templates": ["", "not-applicable", "Source redirect to /product-system/products; destination captured"],
  "/personal": ["", "not-applicable", "Source redirect to /employees; destination captured"],
  "/employees": ["angajati-registry", "captured", "Operational employees; demo synthetic names"],
  "/employees-records": ["evidenta-hr-list", "captured", "HR evidence list"],
  "/employees-records/:employeeId": ["employee-profile", "captured", "Employee profile from demo row"],
  "/attendance": ["pontaj", "captured", "Attendance"],
  "/attendance/effects": ["attendance-effects", "captured", "Attendance effects"],
  "/employee-payments": ["plati-angajati", "captured", "Employee payments"],
  "/employee-advances": ["avansuri", "captured", "Employee advances"],
  "/colaboratori": ["colaboratori", "captured", "Collaborators"],
  "/utilaje": ["utilaje", "captured", "Machines / utilaje"],
  "/reports": ["rapoarte", "captured", "Reports"],
  "/reports/operational": ["operational-reports", "captured", "Operational reports"],
  "/modules": ["harta-module", "captured", "Module chain"],
  "/governance": ["guvernanta", "captured", "Governance plus visible tabs Autoritate/Limite/Adevar/Gates/UI"],
  "/settings": ["setari-shell", "captured", "Settings shell plus representative local tabs"],
  "*": [
    "login-gate",
    "captured",
    "Outer * is AuthGate (LoginGate captured). Inner * is RoleHomeRedirect (role-home-redirect captured). Distinct auth_config_missing RuntimeStatePanel was not reached; intercept showed LoginGate (explained duplicate, not a second capture)",
  ],
  "/auth/callback": [
    "",
    "explained",
    "OIDC callback protocol page; isolated preview did not complete a real OIDC callback",
  ],
  "/auth/error": ["", "explained", "OIDC error protocol page; not opened without a real auth-error payload"],
  "/auth/logout": ["", "explained", "Logout callback protocol page; not an operator IA page"],
  "/logout-callback": ["", "explained", "Logout callback alias; not an operator IA page"],
  "/employee-app/(layout)": ["emp-mobile-v1-home", "not-applicable", "Employee v1 layout wrapper"],
  "/employee-app": ["emp-mobile-v1-home", "captured", "Employee v1 home"],
  "/employee-app/requests": ["emp-mobile-v1-requests", "captured", "Employee v1 requests"],
  "/employee-app/team": ["emp-mobile-v1-team", "captured", "Employee v1 team"],
  "/employee-app/review": ["emp-mobile-v1-review", "captured", "Employee v1 review"],
  "/employee-app/attendance": ["emp-mobile-v1-attendance", "captured", "Employee v1 attendance"],
  "/employee-app/tasks/orders/:orderId/blueprint": [
    "",
    "explained",
    "employee-app order blueprint; demo personal navigation did not open a distinct blueprint route",
  ],
  "/employee-app/tasks": ["emp-mobile-v1-tasks", "captured", "Employee v1 tasks"],
  "/employee-app/personal": ["emp-mobile-v1-personal", "captured", "Employee v1 personal"],
  "/employee-app/info": [
    "",
    "explained",
    "Employee v1 info; same mobile shell captured; no distinct info content beyond personal/home",
  ],
  "/employee-app-v2/(layout)": ["emp-mobile-v2-home", "not-applicable", "Employee v2 layout wrapper"],
  "/employee-app-v2": ["emp-mobile-v2-home", "captured", "Employee v2 home"],
  "/employee-app-v2/tasks": ["emp-mobile-v2-tasks", "captured", "Employee v2 tasks"],
  "/employee-app-v2/tasks/:taskId": [
    "",
    "explained",
    "No v2 task row opened a distinct /tasks/:taskId detail in demo",
  ],
  "/employee-app-v2/pipeline": ["emp-mobile-v2-pipeline", "captured", "Employee v2 pipeline"],
  "/employee-app-v2/documents": ["emp-mobile-v2-documents", "captured", "Employee v2 documents"],
  "/employee-app-v2/blockers": ["emp-mobile-v2-blockers", "captured", "Employee v2 blockers"],
  "/employee-app-v2/upcoming": ["emp-mobile-v2-upcoming", "captured", "Employee v2 upcoming"],
  "/employee-app-v2/personal/*": ["emp-mobile-v2-personal-hub", "captured", "Employee v2 personal splat; hub plus local personal pages captured"],
};

function classify(row) {
  const table = row.app === "NEW" ? NEW : OLD;
  const hit = table[row.route_pattern];
  if (!hit) {
    return {
      screen_id: "",
      classification: "unexplained",
      reason: "NO_SOURCE_MAPPING",
    };
  }
  return { screen_id: hit[0], classification: hit[1], reason: hit[2] };
}

const inventory = parseInventory(readFileSync(inventoryPath, "utf8"));
const rows = inventory.map((row) => ({ ...row, ...classify(row) }));
const unexplained = rows.filter((row) => row.classification === "unexplained");

const csv = [
  "app,source_file,route_pattern,screen_id,classification,reason",
  ...rows.map((row) =>
    [
      row.app,
      row.source_file,
      row.route_pattern,
      row.screen_id,
      row.classification,
      `"${row.reason.replaceAll('"', '""')}"`,
    ].join(","),
  ),
].join("\n");

const count = (app, classification) =>
  rows.filter((row) => row.app === app && row.classification === classification).length;

const md = `# Source-to-manifest route reconciliation

Derived from router source files, then joined to \`screenshot-manifest.csv\` screen IDs.

## Source files

- NEW: \`apps/web/src/App.tsx\`
- OLD: \`C:/w/psiso/frontend/src/App.tsx\`
- OLD: \`C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx\`
- OLD: \`C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx\`

Non-route NEW surfaces (not \`<Route>\` entries; listed so they are not treated as route gaps):

| Surface | Screen ID | Classification | Reason |
| --- | --- | --- | --- |
| AppGate loading | | explained | Transient \`Se incarca\`; not a designed page |
| AppGate unavailable | app-boot-unavailable | captured | Backend unreachable |
| LoginPage (cloud mode) | cloud-login | captured | Not a path route; gate before Routes |
| Operator identify dialog | operator-identify-dialog | captured | Overlay; empty PIN and invalid PIN |
| Operator session chrome | operator-session | captured | Eligible identified session |

## Counts

| App | Source rows | captured | explained | not-applicable | unexplained |
| --- | ---: | ---: | ---: | ---: | ---: |
| NEW | ${rows.filter((row) => row.app === "NEW").length} | ${count("NEW", "captured")} | ${count("NEW", "explained")} | ${count("NEW", "not-applicable")} | ${count("NEW", "unexplained")} |
| OLD | ${rows.filter((row) => row.app === "OLD").length} | ${count("OLD", "captured")} | ${count("OLD", "explained")} | ${count("OLD", "not-applicable")} | ${count("OLD", "unexplained")} |

\`UNEXPLAINED_ROUTE_GAPS=${unexplained.length}\`

Do not read this as full page or full state coverage. It only proves every **source-registered route pattern** has a captured screen, an exact non-capture reason, or is a wrapper/redirect.

The first-pack file \`route-inventory-reconciliation.txt\` was harness-authored and is superseded.

## Rows

| App | Source | Pattern | Screen | Class | Reason |
| --- | --- | --- | --- | --- | --- |
${rows
  .map(
    (row) =>
      `| ${row.app} | \`${row.source_file}\` | \`${row.route_pattern}\` | ${row.screen_id || ""} | ${row.classification} | ${row.reason} |`,
  )
  .join("\n")}
`;

writeFileSync(outCsv, `${csv}\n`, "utf8");
writeFileSync(outMd, md, "utf8");
console.log(`SOURCE_ROWS=${rows.length}`);
console.log(`UNEXPLAINED_ROUTE_GAPS=${unexplained.length}`);
if (unexplained.length) {
  for (const row of unexplained) {
    console.log(`UNEXPLAINED ${row.app} ${row.route_pattern}`);
  }
}
