import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const oldRoot = "C:/w/psiso/frontend/src";

function extractRoutePaths(source) {
  const paths = [];
  const re = /<Route\b([^>]*)>/g;
  let match;
  while ((match = re.exec(source))) {
    const attrs = match[1];
    const pathMatch = attrs.match(/\bpath=["']([^"']+)["']/);
    const index = /\bindex\b/.test(attrs);
    const element = attrs.match(/\belement=\{([^}]+)\}/);
    paths.push({
      pattern: pathMatch ? pathMatch[1] : index ? "(index)" : "(layout)",
      element: element ? element[1].replace(/\s+/g, " ").slice(0, 80) : "",
      redirect: /Navigate/.test(attrs),
    });
  }
  return paths;
}

const newApp = readFileSync(join(repo, "apps/web/src/App.tsx"), "utf8");
const oldApp = readFileSync(join(oldRoot, "App.tsx"), "utf8");
const oldEmp = readFileSync(join(oldRoot, "pages/EmployeeMobileApp.tsx"), "utf8");
const oldEmp2 = readFileSync(join(oldRoot, "pages/EmployeeMobileV2App.tsx"), "utf8");

const inventory = [
  ...extractRoutePaths(newApp).map((row) => ({ app: "NEW", source: "apps/web/src/App.tsx", ...row })),
  ...extractRoutePaths(oldApp).map((row) => ({ app: "OLD", source: "C:/w/psiso/frontend/src/App.tsx", ...row })),
  ...extractRoutePaths(oldEmp).map((row) => ({
    app: "OLD",
    source: "C:/w/psiso/frontend/src/pages/EmployeeMobileApp.tsx",
    ...row,
    pattern: row.pattern === "(index)" ? "/employee-app" : `/employee-app/${row.pattern.replace(/^\//, "")}`,
  })),
  ...extractRoutePaths(oldEmp2).map((row) => ({
    app: "OLD",
    source: "C:/w/psiso/frontend/src/pages/EmployeeMobileV2App.tsx",
    ...row,
    pattern: row.pattern === "(index)" ? "/employee-app-v2" : `/employee-app-v2/${row.pattern.replace(/^\//, "")}`,
  })),
];

const out = join(here, "..", "source-route-inventory.csv");
writeFileSync(
  out,
  ["app,source_file,route_pattern,element,redirect"].join("\n") +
    "\n" +
    inventory
      .map((row) =>
        [row.app, row.source, row.pattern, JSON.stringify(row.element), row.redirect ? "yes" : "no"].join(","),
      )
      .join("\n") +
    "\n",
);
console.log(`SOURCE_ROUTES_NEW=${inventory.filter((row) => row.app === "NEW").length}`);
console.log(`SOURCE_ROUTES_OLD=${inventory.filter((row) => row.app === "OLD").length}`);
console.log(`WROTE=${out}`);
