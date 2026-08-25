import { createHash } from "node:crypto";
import { readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const shotRoot = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1");
const manifestPath = join(here, "..", "screenshot-manifest.csv");

const DELETE = [
  "new/admin-seller__empty-form-labels-only__desktop__full.png",
  "new/admin-people-list__populated-names-masked__desktop__full.png",
  "new/admin-person-detail__populated-names-masked__desktop__full.png",
  "new/admin-person-detail__populated-names-masked__desktop__top.png",
  "new/admin-person-detail__populated-names-masked__desktop__mid.png",
  "new/admin-person-detail__populated-names-masked__desktop__bottom.png",
  "new/admin-skills__populated__desktop__full.png",
  "new/admin-skills__populated__desktop__top.png",
  "new/admin-skills__populated__desktop__mid.png",
  "new/admin-skills__populated__desktop__bottom.png",
  "old/client-tab-cereri__opened__desktop__full.png",
  "old/client-tab-oferte__opened__desktop__full.png",
  "old/client-tab-comenzi__opened__desktop__full.png",
  "old/ps-studio-tab-operațional__opened__desktop__full.png",
  "old/ps-studio-tab-structură__opened__desktop__full.png",
  "old/intake-v6-standalone__admin-preview__desktop__full.png",
  "old/execution-detail__opened__desktop__full.png",
  "old/auth-config-missing__auth-503__desktop__full.png",
  "old/auth-config-missing__auth-503-intercept__desktop__full.png",
  "old/comenzi-detail__opened-or-list__desktop__full.png",
];

const RENAME = [
  ["old/gov-tab-adevăr__opened__desktop__full.png", "old/gov-tab-adevar__opened__desktop__full.png"],
  ["old/settings-tab-integrări__opened__desktop__full.png", "old/settings-tab-integrations__opened__desktop__full.png"],
  ["old/settings-tab-plăți-repetitive__opened__desktop__full.png", "old/settings-tab-payments-repetitive__opened__desktop__full.png"],
];

const ROUTES = {
  "jobs-overview": "/",
  "atelier-inbox": "/atelier",
  "requests-overview": "/requests",
  "request-detail": "/requests/:requestId",
  "quotes-overview": "/quotes",
  "clients-overview": "/clients",
  "client-workspace-prezentare": "/clients/:customerId",
  "client-workspace-cereri": "/clients/:customerId",
  "client-workspace-oferte": "/clients/:customerId",
  "client-workspace-lucrari": "/clients/:customerId",
  "product-catalog": "/products",
  "product-config-letters-edit": "/products/:productCode",
  "product-config-acm-edit": "/products/:productCode",
  "product-config-letters-confirmed": "/products/:productCode",
  "product-config-quote-restore": "/products/:productCode",
  "admin-home": "/admin",
  "admin-seller": "/admin/seller",
  "admin-customers-lifecycle": "/admin/customers",
  "admin-people-list": "/admin/people",
  "admin-person-detail": "/admin/people/:personId",
  "admin-skills": "/admin/people/skills",
  "admin-resources-catalog": "/admin/resources",
  "admin-resources-catalog-categories": "/admin/resources",
  "admin-stock-overview": "/admin/stock",
  "admin-stock-item": "/admin/stock/:resourceId",
  "admin-processes-catalog": "/admin/processes",
  "admin-processes-catalog-categories": "/admin/processes",
  "admin-workcenters-catalog": "/admin/workcenters",
  "admin-workcenters-catalog-categories": "/admin/workcenters",
  "admin-product-system": "/admin/product-system",
  "admin-product-system-categories": "/admin/product-system",
  "components-inspection": "/components",
  "components-inspection-categories": "/components",
  "governance-inspection": "/governance",
  "governance-inspection-categories": "/governance",
  "system-status": "/system",
  "execution-workspace": "/execution/:planId",
  "cloud-login": "/login",
  "app-boot-unavailable": "(boot)",
  "catch-all-redirect": "*",
  "operator-identify-dialog": "/",
  "operator-session": "/",
  "client-tab-overview": "/clients/:clientName",
  "client-tab-cereri": "/clients/:clientName",
  "client-tab-oferte": "/clients/:clientName",
  "client-tab-comenzi": "/clients/:clientName",
  "client-workspace": "/clients/:clientName",
  "ps-studio-tab-structure": "/product-system/products/:templateCode",
  "ps-studio-tab-operational": "/product-system/products/:templateCode",
  "ps-studio-tab-form-system": "/product-system/products/:templateCode",
  "ps-studio-tab-general": "/product-system/products/:templateCode",
  "intake-v6-standalone-operator": "/intake-v6-app/:workspaceId/operator",
  "comenzi-detail": "/orders/:orderId",
  "execution-dashboard": "/execution",
  "execution-detail": "/execution/:order_id",
  "login-gate": "*",
  "gov-tab-adevar": "/governance",
  "settings-tab-integrations": "/settings",
  "settings-tab-payments-repetitive": "/settings",
};

const ASSERTIONS = {
  "admin-seller": "Date firma + Audit Synthetic SRL; CIF IBAN address empty",
  "admin-people-list": "Oameni + Operator Eligible + Operator Ineligible",
  "admin-person-detail": "Identitate + Operator Eligible name field",
  "admin-skills": "Skill-uri heading + Operator Eligible eligibility",
  "atelier-inbox": "Atelier / Munca mea",
  "execution-workspace": "Plan de executie",
  "operator-identify-dialog": "Identifica operatorul",
  "operator-session": "Operator Eligible identified",
  "cloud-login": "Autentificare",
  "client-tab-overview": "local client tab Overview",
  "client-tab-cereri": "local client tab Cereri",
  "client-tab-oferte": "local client tab Oferte",
  "client-tab-comenzi": "local client tab Comenzi",
  "ps-studio-tab-structure": "Product Compiler / structure tab",
  "ps-studio-tab-operational": "Resurse operationale tab",
  "ps-studio-tab-form-system": "Form System tab",
  "ps-studio-tab-general": "Informatii generale tab",
  "intake-v6-standalone-operator": "Intake V6 operator workspace",
  "comenzi-detail": "DEMO-ORDER-001 detail pane",
  "execution-dashboard": "Executie heading + Comenzi in executie + DEMO-ORDER-001",
  "execution-detail": "Rezultat executie + DEMO-ORDER-001",
  "login-gate": "LoginGate unauthenticated",
};

const EXPLAINED = [
  {
    app: "OLD",
    route: "*",
    screen_id: "auth-config-missing",
    state: "duplicate-of-login-gate",
    assertion: "same LoginGate pixels as login-gate__unauthenticated; not a distinct visible state",
    reason: "auth-503 intercept rendered LoginGate, not a separate auth_config_missing page",
  },
  {
    app: "OLD",
    route: "/intake-v6-app",
    screen_id: "intake-v6-standalone-index",
    state: "blank-index",
    assertion: "index is not a designed page",
    reason: "/intake-v6-app has no index route; live redirect/workspace is /intake-v6-app/:id/operator, now captured",
  },
];

function posixRel(abs) {
  return relative(repo, abs).replaceAll("\\", "/");
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function parseName(name) {
  const stem = name.replace(/\.png$/i, "");
  const parts = stem.split("__");
  if (parts.length < 4) {
    return null;
  }
  const region = parts.at(-1);
  const viewport = parts.at(-2);
  const state = parts.at(-3);
  const screenId = parts.slice(0, -3).join("__");
  return { screenId, state, viewport, region };
}

for (const rel of DELETE) {
  const abs = join(shotRoot, rel);
  try {
    unlinkSync(abs);
    console.log(`DELETED ${rel}`);
  } catch {
    console.log(`MISSING_ALREADY ${rel}`);
  }
}

for (const [from, to] of RENAME) {
  const src = join(shotRoot, from);
  const dest = join(shotRoot, to);
  try {
    renameSync(src, dest);
    console.log(`RENAMED ${from} -> ${to}`);
  } catch (error) {
    console.log(`RENAME_SKIP ${from} ${error.code ?? error.message}`);
  }
}

const rows = [
  [
    "app",
    "route",
    "screen_id",
    "state",
    "role",
    "runtime_fixture",
    "viewport",
    "region",
    "file",
    "sha256",
    "visible_assertion",
    "route_assertion",
    "problems",
    "status",
  ].join(","),
];

const files = [];
for (const appDir of ["new", "old"]) {
  for (const name of readdirSync(join(shotRoot, appDir))) {
    if (!name.endsWith(".png")) {
      continue;
    }
    files.push({ app: appDir === "new" ? "NEW" : "OLD", abs: join(shotRoot, appDir, name), name });
  }
}

files.sort((a, b) => a.name.localeCompare(b.name));

const nonAscii = [];
for (const file of files) {
  if (/[^\x00-\x7F]/.test(file.name)) {
    nonAscii.push(file.name);
  }
  const parsed = parseName(file.name);
  if (!parsed) {
    throw new Error(`unparseable filename ${file.name}`);
  }
  const route = ROUTES[parsed.screenId] ?? "";
  const hash = sha256File(file.abs);
  rows.push(
    [
      file.app,
      route || parsed.screenId,
      parsed.screenId,
      parsed.state,
      file.app === "NEW" ? "operator-dev" : "admin-dev-preview",
      file.app === "NEW" ? "single-plane-dev-isolated-synthetic" : "old-demo-db-copy-isolated",
      parsed.viewport,
      parsed.region,
      posixRel(file.abs),
      hash,
      ASSERTIONS[parsed.screenId] ?? parsed.screenId,
      route || parsed.screenId,
      "",
      "captured",
    ].join(","),
  );
}

for (const row of EXPLAINED) {
  rows.push(
    [
      row.app,
      row.route,
      row.screen_id,
      row.state,
      "admin-dev-preview",
      "old-demo-db-copy-isolated",
      "desktop",
      "none",
      "",
      "",
      row.assertion,
      row.route,
      row.reason,
      "explained",
    ].join(","),
  );
}

writeFileSync(manifestPath, rows.join("\n") + "\n", "utf8");

const captured = files.length;
const hashes = new Map();
for (const file of files) {
  const hash = sha256File(file.abs);
  hashes.set(hash, [...(hashes.get(hash) ?? []), file.name]);
}
const dupes = [...hashes.entries()].filter(([, names]) => names.length > 1);

console.log(`CAPTURED_ROWS=${captured}`);
console.log(`ACTUAL_PNG=${captured}`);
console.log(`EXPLAINED_ROWS=${EXPLAINED.length}`);
console.log(`NON_ASCII_FILENAMES=${nonAscii.length}`);
console.log(`DUPLICATE_HASH_GROUPS=${dupes.length}`);
for (const [hash, names] of dupes) {
  console.log(`DUPE ${hash} ${names.join(" | ")}`);
}
if (nonAscii.length) {
  throw new Error(`non-ascii filenames remain: ${nonAscii.join(",")}`);
}
