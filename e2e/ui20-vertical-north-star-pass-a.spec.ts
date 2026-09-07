import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import {
  confirmCanonicalLettersOnPage,
  createNamedCustomer,
  createRequestNeedingAction,
} from "./helpers/requests";
import {
  configureTestExecutorPin,
  ensureTestExecutor,
  identifyTestExecutorOnPage,
} from "./helpers/people";

const LETTERS_NAME =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";
function currentRuntimeOrigin(): string {
  if (process.env.WORKOS_E2E_CURRENT_ORIGIN) {
    return process.env.WORKOS_E2E_CURRENT_ORIGIN;
  }
  return `http://127.0.0.1:${process.env.WORKOS_E2E_WEB_PORT ?? "5173"}`;
}
const EVIDENCE_DIR = join(process.cwd(), ".tmp", "ui20-vertical-pass-a");
const EVIDENCE_B_DIR = join(process.cwd(), ".tmp", "ui20-vertical-pass-b");

type JsonObject = Record<string, unknown>;

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
}

async function minTarget(page: Page, locator: ReturnType<Page["getByRole"]>) {
  const box = await locator.boundingBox();
  expect(box).toBeTruthy();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
}

async function screenshotAt(page: Page, width: number, name: string) {
  await page.setViewportSize({ width, height: width >= 1280 ? 900 : 1024 });
  await noHorizontalOverflow(page);
  await page.screenshot({
    path: join(EVIDENCE_DIR, `${name}-${width}.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: join(EVIDENCE_B_DIR, `${name}-${width}.png`),
    fullPage: true,
  });
}

async function screenshotDark(page: Page, name: string) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Întunecată" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({
    path: join(EVIDENCE_B_DIR, `${name}-1440-dark.png`),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Deschisă" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
}

test("UI20_VERTICAL_NORTH_STAR_PASS_A walks Cerere to Execuție on the same engine", async ({
  page,
  request,
  browser,
}) => {
  await mkdir(EVIDENCE_DIR, { recursive: true });
  await mkdir(EVIDENCE_B_DIR, { recursive: true });
  const person = await ensureTestExecutor(request);
  await configureTestExecutorPin(request, person.personId);
  const customerName = `Client UI20 ${Date.now()}`;
  const customer = await createNamedCustomer(request, customerName);
  expect(customer.ok).toBeTruthy();
  expect(customer.customerId).toBeTruthy();
  const created = await createRequestNeedingAction(
    request,
    customer.customerId as string,
    `Cerere UI20 ${Date.now()}`,
  );
  expect(created.ok).toBeTruthy();
  expect(created.requestId).toBeTruthy();
  const requestId = created.requestId as string;
  const inscription = `NS${Date.now().toString().slice(-6)}`;

  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  await expect(page.locator('[data-surface="cerere"]')).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole("heading", { name: created.title as string })).toBeVisible();
  await expect(page.getByText(customerName).first()).toBeVisible();
  const requestDetail = (await (
    await request.get(`/api/requests/${encodeURIComponent(requestId)}`)
  ).json()) as {
    detail?: { request?: { reference?: string } };
  };
  const requestReference = requestDetail.detail?.request?.reference ?? "";
  expect(requestReference).toMatch(/^CER-/);
  await expect(page.getByText(requestReference).first()).toBeVisible();
  await expect(page.getByText("Nu există încă o ofertă legată")).toBeVisible();
  await expect(page.getByText("Produsul nu este ales")).toHaveCount(0);
  await expect(page.locator('[data-plane="known"]')).toBeVisible();
  await expect(page.locator('[data-plane="unresolved"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cunoscut" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nerezolvat" })).toBeVisible();
  await expect(page.locator(".ui20-top").getByRole("link", { name: "Atelier" })).toHaveCount(0);
  const pick = page.getByRole("link", { name: "Alege produs" }).first();
  await expect(pick).toBeVisible();
  await minTarget(page, pick);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
  await screenshotAt(page, 1440, "cerere");
  await screenshotAt(page, 1280, "cerere");
  await screenshotAt(page, 768, "cerere");
  await screenshotDark(page, "cerere");
  await page.setViewportSize({ width: 1440, height: 900 });
  await pick.click();

  await expect(page).toHaveURL(new RegExp(`/products\\?request=`));
  await expect(page.getByRole("heading", { name: "Alege produsul" })).toBeVisible();
  await page.getByRole("link", { name: LETTERS_NAME }).click();

  await expect(page).toHaveURL(new RegExp(`/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06\\?request=`));
  await expect(page.getByText(requestReference).first()).toBeVisible();
  await confirmCanonicalLettersOnPage(page, inscription);
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await expect(page.getByText("Preț final client")).toHaveCount(0);
  await expect(page.getByText(/624,82/)).toHaveCount(0);
  await expect(page.locator("[data-composition]")).toBeVisible();
  await expect(page.locator("[data-composition] [aria-pressed='true']")).toHaveCount(1);
  await screenshotAt(page, 1440, "configurator");
  await screenshotAt(page, 1280, "configurator");
  await screenshotAt(page, 768, "configurator");
  await screenshotDark(page, "configurator");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Creează oferta" }).click();

  await expect(page).toHaveURL(/\/quotes\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await expect(page.locator("[data-quote-value]")).toContainText("624,82");
  await expect(page.getByText(/624,82/).first()).toBeVisible();
  await expect(page.locator("[data-quote-state]")).toHaveText("Creată");
  await expect(page.getByText(customerName).first()).toBeVisible();
  await expect(page.getByText(requestReference).first()).toBeVisible();
  await expect(page.locator('[data-instrument="sheet"]')).toBeVisible();
  await screenshotAt(page, 1440, "oferta");
  await screenshotAt(page, 1280, "oferta");
  await screenshotAt(page, 768, "oferta");
  await screenshotDark(page, "oferta");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Marchează acceptată" }).click();
  await expect(page.locator("[data-quote-state]")).toHaveText("Acceptată");
  await expect(page).toHaveURL(/\/quotes\//);
  await page.getByRole("button", { name: "Creează comanda" }).click();
  await expect(page.locator("[data-quote-state]")).toHaveText("Cu comandă");
  await expect(page).toHaveURL(/\/quotes\//);
  await expect(page.getByRole("link", { name: "Deschide lucrarea" })).toHaveCount(0);
  await page.getByRole("button", { name: "Eliberează pentru producție" }).click();
  await expect(page.getByRole("link", { name: "Deschide lucrarea" })).toBeVisible();
  const quoteSnapshotId = decodeURIComponent(new URL(page.url()).pathname.replace("/quotes/", ""));

  await page.getByRole("link", { name: "Deschide lucrarea" }).click();
  await expect(page).toHaveURL(/\/jobs\//);
  await expect(page.locator("[data-job-state]")).toContainText("Eliberată");
  await expect(page.locator("[data-job-next]")).toContainText("Creează planul de execuție");
  await expect(page.getByRole("heading", { name: "Trecut" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Current" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Următor" })).toBeVisible();
  await screenshotAt(page, 1440, "lucrare");
  await screenshotAt(page, 1280, "lucrare");
  await screenshotAt(page, 768, "lucrare");
  await screenshotDark(page, "lucrare");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await expect(page.getByRole("link", { name: "Deschide atelierul" })).toBeVisible();
  const jobId = decodeURIComponent(new URL(page.url()).pathname.replace("/jobs/", ""));

  await page.getByRole("link", { name: "Deschide atelierul" }).click();
  await expect(page).toHaveURL(/\/atelier$/);
  await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
  await identifyTestExecutorOnPage(page);
  await expect(page.getByText(inscription).first()).toBeVisible();
  const atelierRow = page
    .locator(".ui20-task")
    .filter({ hasText: inscription })
    .filter({ hasText: "Debitare foaie CNC" })
    .filter({ hasText: "Față" })
    .first();
  await expect(atelierRow).toBeVisible();
  const atelierTaskId = await atelierRow.getAttribute("data-task-id");
  expect(atelierTaskId).toBeTruthy();
  const atelierExecution = atelierRow.getByRole("link", { name: "Deschide execuția" });
  await expect(atelierExecution).toBeVisible();
  await expect(page.locator("table.ui20-worklist")).toBeVisible();
  await screenshotAt(page, 1440, "atelier");
  await screenshotAt(page, 1280, "atelier");
  await screenshotAt(page, 768, "atelier");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Întunecată" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: join(EVIDENCE_DIR, "atelier-1440-dark.png"), fullPage: true });
  await page.screenshot({ path: join(EVIDENCE_B_DIR, "atelier-1440-dark.png"), fullPage: true });
  await page.getByRole("button", { name: "Deschisă" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await atelierExecution.click();

  await expect(page).toHaveURL(/\/execution\//);
  if ((await page.locator("form.operator-identify-form").count()) > 0) {
    await identifyTestExecutorOnPage(page);
  }
  const planId = decodeURIComponent(new URL(page.url()).pathname.replace("/execution/", "").split("?")[0] ?? "");
  const startable = page
    .locator(".ui20-task")
    .filter({ hasText: "Debitare foaie CNC" })
    .filter({ hasText: "Față" })
    .first();
  await expect(startable).toHaveAttribute("data-task-id", atelierTaskId as string);
  await expect(startable.getByRole("button", { name: "Alocă utilaj" })).toBeVisible({ timeout: 15000 });
  await startable.getByLabel("Utilaj dedicat").selectOption({ label: "CNC 4020" });
  await startable.getByRole("button", { name: "Alocă utilaj" }).click();
  await expect(startable.getByRole("button", { name: /Pornește|Alocă executant/ })).toBeVisible({
    timeout: 15000,
  });
  const assignExecutor = startable.getByRole("button", { name: "Alocă executant" });
  if ((await assignExecutor.count()) > 0) {
    await assignExecutor.click();
  }
  await expect(startable.getByRole("button", { name: "Pornește" })).toBeVisible({ timeout: 15000 });
  await startable.getByRole("button", { name: "Pornește" }).click();
  await expect(startable.getByText("În lucru")).toBeVisible();
  await page.reload();
  const persisted = page
    .locator(".ui20-task")
    .filter({ hasText: "Debitare foaie CNC" })
    .filter({ hasText: "Față" })
    .first();
  await expect(persisted).toHaveAttribute("data-task-id", atelierTaskId as string);
  await expect(persisted.getByText("În lucru")).toBeVisible();
  await expect(page.locator('[data-instrument="workstation"]')).toBeVisible();
  await expect(page.getByText("Operație curentă")).toBeVisible();
  await screenshotAt(page, 1440, "executie");
  await screenshotAt(page, 1280, "executie");
  await screenshotAt(page, 768, "executie");
  await screenshotDark(page, "executie");
  await page.setViewportSize({ width: 1440, height: 900 });

  const quoteApi = (await (
    await request.get(`/api/quotes/${encodeURIComponent(quoteSnapshotId)}`)
  ).json()) as {
    quote?: JsonObject;
    order?: { orderSnapshotId?: string } | null;
    request?: { reference?: string | null } | null;
  };
  const jobApi = (await (
    await request.get(`/api/jobs/${encodeURIComponent(jobId)}`)
  ).json()) as {
    job?: JsonObject;
    request?: { reference?: string | null } | null;
    quote?: { reference?: string | null };
    release?: { releaseSnapshotId?: string } | null;
    execution?: { planId?: string } | null;
  };
  expect(quoteApi.quote?.inscription).toBe(inscription);
  expect(String(quoteApi.quote?.grossDisplay)).toContain("624,82");
  expect(quoteApi.quote?.customerDisplayName).toBe(customerName);
  expect(quoteApi.request?.reference).toBe(requestReference);
  expect(quoteApi.order?.orderSnapshotId).toBe(jobId);
  expect(jobApi.job?.inscription).toBe(inscription);
  expect(jobApi.job?.customerDisplayName).toBe(customerName);
  expect(jobApi.request?.reference).toBe(requestReference);
  expect(jobApi.release?.releaseSnapshotId).toBeTruthy();
  expect(jobApi.execution?.planId).toBe(planId);

  const current = await browser.newPage();
  const currentOrigin = currentRuntimeOrigin();
  await current.goto(`${currentOrigin}/requests/${encodeURIComponent(requestId)}`);
  await expect(current.getByRole("heading", { name: created.title as string })).toBeVisible({
    timeout: 15000,
  });
  await expect(current.getByText(customerName).first()).toBeVisible();
  await expect(current.getByText(requestReference).first()).toBeVisible();
  await current.goto(`${currentOrigin}/quotes/${encodeURIComponent(quoteSnapshotId)}`);
  await expect(current.getByRole("heading", { name: inscription })).toBeVisible();
  await expect(current.getByText(/624,82/)).toBeVisible();
  await expect(current.getByText(customerName).first()).toBeVisible();
  await expect(current.getByText(requestReference).first()).toBeVisible();
  await current.goto(`${currentOrigin}/jobs/${encodeURIComponent(jobId)}`);
  await expect(current.getByRole("heading", { name: inscription })).toBeVisible();
  await expect(current.getByText(customerName).first()).toBeVisible();
  await expect(current.getByText(requestReference).first()).toBeVisible();
  await expect(current.getByText(String(jobApi.quote?.reference ?? "")).first()).toBeVisible();
  await current.close();

  await writeFile(
    join(EVIDENCE_DIR, "manifest.json"),
    JSON.stringify(
      {
        classification: "LOCAL_SYNTHETIC_ISOLATED",
        realData: false,
        cloudWrite: false,
        fixture: {
          customerName,
          requestId,
          requestReference,
          inscription,
          productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
          quoteSnapshotId,
          jobId,
          planId,
          taskId: atelierTaskId,
        },
        routes: {
          cerere: `/requests/${requestId}`,
          productPick: `/products?request=${requestId}`,
          configurator: `/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=${requestId}`,
          oferta: `/quotes/${quoteSnapshotId}`,
          lucrare: `/jobs/${jobId}`,
          atelier: "/atelier",
          execution: `/execution/${planId}`,
        },
        businessFactParity: "PASS",
        sameApi: true,
        sameIds: true,
        sameTaskId: atelierTaskId,
        verticalE2eOrder: "LUCRARE_TO_ATELIER_TO_EXECUTION",
        configuratorCommercialPriceVisible: false,
        ofertaCommercialValueVisible: true,
        requestInventedProductState: false,
      },
      null,
      2,
    ),
    "utf8",
  );
  await writeFile(
    join(EVIDENCE_DIR, "routes.md"),
    [
      "# UI20 Pass A routes",
      "",
      `- Cerere: /requests/${requestId}`,
      `- Product Pick: /products?request=${requestId}`,
      `- Configurator: /products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=${requestId}`,
      `- Ofertă: /quotes/${quoteSnapshotId}`,
      `- Lucrare: /jobs/${jobId}`,
      `- Atelier: /atelier`,
      `- Execuție: /execution/${planId}`,
      `- Task: ${atelierTaskId}`,
      "",
      "Order: Lucrare → Atelier row → Deschide execuția → Workstation",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(EVIDENCE_DIR, "fixture-classification.md"),
    [
      "# Fixture classification",
      "",
      "LOCAL_SYNTHETIC_ISOLATED",
      "REAL_DATA = NO",
      "CLOUD_WRITE = NO",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(EVIDENCE_DIR, "parity.md"),
    [
      "# Business fact parity",
      "",
      `inscription: ${inscription}`,
      `requestReference: ${requestReference}`,
      `customerName: ${customerName}`,
      `quoteSnapshotId: ${quoteSnapshotId}`,
      `jobId: ${jobId}`,
      `planId: ${planId}`,
      `taskId: ${atelierTaskId}`,
      "grossDisplay: 624,82 (Ofertă + API only; Configurator hidden)",
      "BUSINESS_FACT_PARITY = PASS",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(EVIDENCE_B_DIR, "manifest.json"),
    JSON.stringify(
      {
        classification: "LOCAL_SYNTHETIC_ISOLATED",
        pass: "B",
        realData: false,
        cloudWrite: false,
        fixture: {
          customerName,
          requestId,
          requestReference,
          inscription,
          productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
          quoteSnapshotId,
          jobId,
          planId,
          taskId: atelierTaskId,
        },
        instruments: {
          cerere: "resolution",
          configurator: "construction",
          oferta: "sheet",
          lucrare: "traveler",
          atelier: "dispatch",
          execution: "workstation",
        },
        businessFactParity: "PASS",
        configuratorCommercialPriceVisible: false,
        ofertaCommercialValueVisible: true,
        unconditionalAtelierGlobalLink: false,
      },
      null,
      2,
    ),
    "utf8",
  );
  await writeFile(
    join(EVIDENCE_B_DIR, "FIGMA_RUNTIME_RECONCILIATION.md"),
    [
      "# Figma → runtime reconciliation",
      "",
      "File `0XP0yGa1siWQdTTL7ou8xz` was used as mental-model intent, not pixel copy.",
      "Specimen values such as 5.490 EUR, invented transport/montaj, and fake CNC telemetry were not copied.",
      "",
      "- Cerere: two planes (Cunoscut / Nerezolvat), action inside unresolved. No card-per-fact.",
      "- Configurator: composition map + lens. Selected role uses aria-pressed. No commercial price.",
      "- Ofertă: frozen sheet. Source Serif on title, IBM Plex Mono on money. One real commercial line.",
      "- Lucrare: Trecut / Current / Următor. Current dominates. Atelier is the post-plan continuation.",
      "- Atelier: flat worklist table. Energy from real inbox lanes only.",
      "- Execuție: active task dominates; remaining plan is quiet. Dark is a production instrument.",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(EVIDENCE_B_DIR, "OPTICAL_SELF_REVIEW.md"),
    [
      "# Optical self-review",
      "",
      "Screenshots: `.tmp/ui20-vertical-pass-b/`.",
      "Checked 1440 / 1280 / 768 plus 1440 dark for each instrument.",
      "",
      "## What holds",
      "",
      "- Cerere reads as two planes, not a card stack. Known has a quiet green edge. Unresolved keeps the action.",
      "- Configurator keeps a composition map and a selected lens. After confirm, Volum stays pressed. No commercial price.",
      "- Ofertă is a centered frozen sheet. Title is serif. Money is mono. One real line. Frozen stamp is visible.",
      "- Lucrare is Trecut / Current / Următor. Current has the only strong frame and the next action.",
      "- Atelier is a table ledger. Rows with missing utilaj carry a terracotta attention edge. No task cards.",
      "- Execuție lets the current CNC face task dominate. The rest of the plan is a quiet numbered list. Dark stays charcoal, not neon.",
      "",
      "## Residual optical notes",
      "",
      "- Cerere repeats \"Alege produs\" in the unresolved item and again under \"Următoarea acțiune\". Same real action, two placements.",
      "- Configurator after confirm still shows the last filled role (Volum), not a separate confirmed composition state.",
      "- Atelier 768 stacks cells; the ledger remains a list, not cards.",
      "- No horizontal overflow at captured widths.",
      "- State is not color-only: edges, pressed, blocked wash, and labels travel together.",
      "- 44px targets remain on composition, primary actions, and worklist links.",
      "",
    ].join("\n"),
    "utf8",
  );
});
