import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const DESKTOP = { name: "desktop", width: 1440, height: 900 };
export const TABLET = { name: "tablet", width: 1024, height: 768 };
export const NARROW = { name: "narrow", width: 768, height: 900 };

const PII_PATTERNS = [
  /\bRO\d{2}[A-Z]{4}\d{16}\b/i,
  /per:legacy:/i,
];

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function initScreenshotManifest(path) {
  ensureDir(dirname(path));
  writeFileSync(
    path,
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
    ].join(",") + "\n",
    "utf8",
  );
}

export function appendScreenshotRow(path, row) {
  appendFileSync(
    path,
    [
      row.app,
      row.route,
      row.screen_id,
      row.state,
      row.role,
      row.runtime_fixture,
      row.viewport,
      row.region,
      row.file,
      row.sha256,
      row.visible_assertion,
      row.route_assertion,
      row.problems,
      row.status,
    ]
      .map(csvEscape)
      .join(",") + "\n",
    "utf8",
  );
}

export async function pageText(page) {
  return page.locator("body").innerText().catch(() => "");
}

export function findPii(text) {
  return PII_PATTERNS.some((pattern) => pattern.test(text));
}

export async function waitSettled(page) {
  try {
    await page.waitForLoadState("domcontentloaded", { timeout: 8000 });
  } catch {
    // Keep capturing even if the page never reaches a clean load state.
  }
  await page.waitForTimeout(250);
}

export async function requireVisibleText(page, text) {
  const visible = await page
    .getByText(text, { exact: false })
    .first()
    .isVisible()
    .catch(() => false);
  if (!visible) {
    throw new Error(`ASSERTION_FAILED missing visible text: ${JSON.stringify(text)} at ${page.url()}`);
  }
  return text;
}

export async function requireUrlMatch(page, pattern) {
  const url = page.url();
  const matched =
    typeof pattern === "string" ? url.includes(pattern) : pattern.test(url);
  if (!matched) {
    throw new Error(`ASSERTION_FAILED url ${url} does not match ${pattern}`);
  }
  return url;
}

export async function captureShot(page, options) {
  const {
    app,
    route,
    screenId,
    state,
    role,
    runtime,
    viewport,
    outDir,
    manifestPath,
    assertion,
    routeAssertion,
  } = options;

  await waitSettled(page);
  const text = await pageText(page);
  if (findPii(text)) {
    appendScreenshotRow(manifestPath, {
      app,
      route,
      screen_id: screenId,
      state,
      role,
      runtime_fixture: runtime,
      viewport: viewport.name,
      region: "full",
      file: "",
      sha256: "",
      visible_assertion: assertion,
      route_assertion: routeAssertion,
      problems: "PII_PATTERN_BLOCKED",
      status: "blocked",
    });
    return { status: "blocked", reason: "PII_PATTERN_BLOCKED" };
  }

  ensureDir(outDir);
  const base = `${screenId}__${state}__${viewport.name}`;
  const fullPath = join(outDir, `${base}__full.png`);
  await page.screenshot({ path: fullPath, fullPage: true });
  const hash = sha256File(fullPath);
  appendScreenshotRow(manifestPath, {
    app,
    route,
    screen_id: screenId,
    state,
    role,
    runtime_fixture: runtime,
    viewport: viewport.name,
    region: "full",
    file: fullPath,
    sha256: hash,
    visible_assertion: assertion,
    route_assertion: routeAssertion,
    problems: "",
    status: "captured",
  });

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  if (scrollHeight > viewport.height + 240) {
    const regions = [
      { name: "top", y: 0 },
      { name: "mid", y: Math.floor(scrollHeight / 2) - Math.floor(viewport.height / 2) },
      { name: "bottom", y: scrollHeight },
    ];
    for (const region of regions) {
      await page.evaluate((y) => window.scrollTo(0, Math.max(0, y)), region.y);
      await page.waitForTimeout(200);
      const regionPath = join(outDir, `${base}__${region.name}.png`);
      await page.screenshot({ path: regionPath });
      appendScreenshotRow(manifestPath, {
        app,
        route,
        screen_id: screenId,
        state,
        role,
        runtime_fixture: runtime,
        viewport: viewport.name,
        region: region.name,
        file: regionPath,
        sha256: sha256File(regionPath),
        visible_assertion: assertion,
        route_assertion: routeAssertion,
        problems: "",
        status: "captured",
      });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  return { status: "captured", file: fullPath, sha256: hash };
}

export async function setViewport(page, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
}

export async function safeClick(locator) {
  if ((await locator.count()) === 0) {
    return false;
  }
  const first = locator.first();
  if (!(await first.isVisible().catch(() => false))) {
    return false;
  }
  await first.click();
  return true;
}

export async function clickEach(locator, limit = 12) {
  const count = Math.min(await locator.count(), limit);
  for (let index = 0; index < count; index += 1) {
    const item = locator.nth(index);
    if (await item.isVisible().catch(() => false)) {
      await item.click();
      await item.page().waitForTimeout(200);
    }
  }
}
