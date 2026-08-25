import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const auditDir = join(here, "..");
const repo = join(here, "..", "..", "..", "..");
const shotRoot = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1");
const routePath = join(auditDir, "route-manifest.csv");
const shotPath = join(auditDir, "screenshot-manifest.csv");

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    values.push(current);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
}

function fold(value) {
  return String(value)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function aliases(screenId) {
  return new Set(
    [
      screenId,
      screenId.replaceAll("_", "-"),
      screenId.replace("intake-v6-step-layers", "intake-v6-straturi"),
      screenId.replace("intake-v6-step-review", "intake-v6-configurare"),
      screenId.replace("intake-v6-step-confirm", "intake-v6-confirmare"),
      screenId.replace("ps-studio-tab-structure", "ps-studio-tab-structura"),
      screenId.replace("ps-studio-tab-operational", "ps-studio-tab-operational"),
      screenId.replace("client-workspace", "client-workspace-prezentare"),
      screenId.replace("client-workspace-overview", "client-workspace-prezentare"),
      screenId.replace("client-tab-overview", "client-workspace"),
      screenId.replace("gov-tab-ownership", "gov-tab-autoritate"),
      screenId.replace("gov-tab-boundaries", "gov-tab-limite"),
      screenId.replace("gov-tab-truth", "gov-tab-adevar"),
      screenId.replace("gov-tab-ui-rules", "gov-tab-ui"),
      screenId.replace("settings-tab-plati-repetitive", "settings-tab-plati-repetitive"),
      screenId.replace("settings-tab-integrari", "settings-tab-integrari"),
    ].map(fold),
  );
}

const routes = parseCsv(readFileSync(routePath, "utf8"));
const shots = parseCsv(readFileSync(shotPath, "utf8")).filter((row) => {
  if (row.status !== "captured") {
    return true;
  }
  if (!row.file) {
    return false;
  }
  try {
    return statSync(row.file).isFile();
  } catch {
    return false;
  }
});

const capturedIds = new Map();
for (const shot of shots) {
  if (shot.status !== "captured" || !shot.file) {
    continue;
  }
  const key = `${shot.app}::${shot.screen_id}`;
  const list = capturedIds.get(key) ?? [];
  list.push(shot);
  capturedIds.set(key, list);
}

const required = routes.filter((row) => row.capture_required === "yes");
const skipped = routes.filter((row) => row.capture_required === "no");
const captured = [];
const blocked = [];
const explained = [];
const unexplained = [];

const explanations = {
  "NEW::app-boot-loading": "transient boot; capture_required=no",
  "NEW::catch-all-redirect": "redirect captured after wait; required=no",
  "OLD::role-home-redirect": "role landings captured; required=no",
  "OLD::intake-legacy-redirect": "instant redirect; required=no",
  "OLD::redirect-pricing": "instant redirect; required=no",
  "OLD::redirect-products": "instant redirect; required=no",
  "OLD::ps-planned-section": "placeholder; required=no",
  "OLD::demo-commercial-spine": "dev demo; required=no",
  "OLD::demo-volumetric-preview": "dev demo; required=no",
  "OLD::client-tab-facturi": "placeholder; required=no",
  "OLD::client-tab-documente": "placeholder; required=no",
  "OLD::client-tab-note": "placeholder; required=no",
  "OLD::auth-config-missing": "Dedicated 503 honesty page not isolated on 3011; LoginGate plus backend-compat banner captured. Explained, not an inventory gap.",
  "OLD::ps-studio-tab-form-system": "Form tab not present on ACM support template studio.",
  "OLD::ps-studio-tab-general": "General tab not present on ACM support template studio.",
  "OLD::ps-structure-volume-al": "Deep link not owned by ACM support template; router returned catalog.",
  "OLD::ps-structure-back": "Deep link not owned by ACM support template; router returned catalog.",
  "OLD::ps-structure-led": "Deep link not owned by ACM support template; router returned catalog.",
  "OLD::intake-v6-review-finisaje": "Review domain not separately addressable on demo workspace beyond captured Configurare/Straturi/Confirmare.",
  "OLD::intake-v6-review-iluminare": "Same as finisaje; demo workspace did not expose a distinct iluminare surface.",
  "OLD::intake-v6-review-panou-carcasa": "Same as finisaje.",
  "OLD::intake-v6-review-montaj-comercial": "Same as finisaje.",
  "OLD::gov-tab-status-flows": "Governance uses different tab labels; captured Autoritate/Limite/Adevăr/Gates/UI.",
  "OLD::gov-tab-agents": "No Agents tab visible in captured governance.",
  "OLD::gov-tab-products-ref": "No products-ref tab visible in captured governance.",
  "OLD::emp-mobile-v1-order-blueprint": "employee-app/personal navigation timed out; same mobile shell already captured.",
  "OLD::emp-mobile-v2-task-detail": "No v2 task row with a distinct detail route in demo.",
  "OLD::machine-run-detail": "Machine-runs list empty in demo; no row to open.",
  "OLD::tablet-station-queue": "Tablet station-select captured; demo cards did not expose a /tablet/:id href.",
  "OLD::tablet-task-detail": "Blocked on missing station queue; same legacy tablet family already captured.",
  "OLD::client-tab-timeline": "Client hub captured; Timeline tab not present as a distinct local tab on Demo Client Alpha.",
  "OLD::document-detail-drawer": "Document center list captured; no table row opened a drawer in demo.",
  "OLD::gov-tab-guardrails": "Guardrails is not a visible governance tab in this build; Gates/UI captured.",
};

for (const route of required) {
  const key = `${route.app}::${route.screen_id}`;
  const names = aliases(route.screen_id);
  let found = capturedIds.get(key);
  if (!found) {
    for (const [shotKey, list] of capturedIds) {
      const screenId = shotKey.slice(shotKey.indexOf("::") + 2);
      if (shotKey.startsWith(`${route.app}::`) && names.has(fold(screenId))) {
        found = list;
        break;
      }
    }
  }
  if (found?.length) {
    captured.push(route);
    continue;
  }
  if (explanations[key]) {
    explained.push({ ...route, explain: explanations[key] });
    continue;
  }
  unexplained.push(route);
}

for (const shot of shots) {
  if (shot.status === "blocked") {
    blocked.push(shot);
  }
}

const oldFiles = readdirSync(join(shotRoot, "old")).filter((name) => name.endsWith(".png"));
const newFiles = readdirSync(join(shotRoot, "new")).filter((name) => name.endsWith(".png"));
const hashCounts = new Map();
for (const shot of shots) {
  if (!shot.sha256) {
    continue;
  }
  hashCounts.set(shot.sha256, (hashCounts.get(shot.sha256) ?? 0) + 1);
}
const duplicateHashes = [...hashCounts.entries()].filter(([, count]) => count > 1);

const withdrawn = [
  "admin-people-list__populated__*.png withdrawn: real workforce names",
  "admin-person-detail__populated__*.png withdrawn: real workforce names",
];

const reconciliation = [
  `ROUTES_DISCOVERED=${routes.length}`,
  `ROUTES_CAPTURE_REQUIRED=${required.length}`,
  `ROUTES_CAPTURE_SKIPPED=${skipped.length}`,
  `ROUTES_CAPTURED=${captured.length}`,
  `ROUTES_BLOCKED=${blocked.length}`,
  `ROUTES_EXPLAINED=${explained.length}`,
  `UNEXPLAINED_ROUTE_GAPS=${unexplained.length}`,
  `OLD_PNG=${oldFiles.length}`,
  `NEW_PNG=${newFiles.length}`,
  `SCREENSHOT_ROWS_KEPT=${shots.length}`,
  `DUPLICATE_HASH_GROUPS=${duplicateHashes.length}`,
  `WITHDRAWN_PII=${withdrawn.length}`,
  "",
  "EXPLAINED",
  ...explained.map((row) => `${row.app},${row.screen_id},${row.explain}`),
  "",
  "UNEXPLAINED",
  ...unexplained.map((row) => `${row.app},${row.screen_id},${row.route}`),
].join("\n");

writeFileSync(join(auditDir, "route-inventory-reconciliation.txt"), reconciliation, "utf8");

const updatedRoutes = routes.map((row) => {
  const key = `${row.app}::${row.screen_id}`;
  if (captured.some((item) => item.app === row.app && item.screen_id === row.screen_id)) {
    return { ...row, status: "captured" };
  }
  if (explained.some((item) => item.app === row.app && item.screen_id === row.screen_id)) {
    return { ...row, status: "explained" };
  }
  if (row.capture_required === "no") {
    return { ...row, status: "not-applicable" };
  }
  return { ...row, status: "gap" };
});

writeFileSync(
  routePath,
  [
    Object.keys(updatedRoutes[0]).join(","),
    ...updatedRoutes.map((row) =>
      Object.values(row)
        .map((value) => {
          const text = String(value ?? "");
          return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
        })
        .join(","),
    ),
  ].join("\n") + "\n",
  "utf8",
);

console.log(reconciliation);
console.log(`duplicate_groups=${duplicateHashes.length}`);
