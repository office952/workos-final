import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { openExecutionWorkspace } from "./helpers/execution";
import {
  assignExecutorIfNeeded,
  assignProviderIfNeeded,
  ensureTestExecutor,
} from "./helpers/people";

function uniqueInscription(prefix: string) {
  return `${prefix}${randomBytes(2).toString("hex")}`.toUpperCase();
}

const productName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function createReleasedPlan(page: Page, inscription: string) {
  await page.goto("/products");
  await page.getByRole("link", { name: productName }).click();
  await page.getByLabel("Textul literelor").fill(inscription);
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Îngheață oferta" }).click();
  await expect(
    quote.getByRole("heading", { name: /Ofertă salvată|Ofertă acceptată/ }),
  ).toBeVisible();
  if ((await quote.getByRole("button", { name: "Acceptă oferta" }).count()) > 0) {
    await quote.getByRole("button", { name: "Acceptă oferta" }).click();
  }
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  const createOrder = quote.getByRole("button", { name: "Creează comanda" });
  if ((await createOrder.count()) > 0) {
    await createOrder.click();
  }
  const order = page.locator(".order-section");
  await expect(order.getByRole("heading", { name: "Comandă creată" })).toBeVisible();
  const releaseButton = order.getByRole("button", { name: "Eliberează pentru producție" });
  if ((await releaseButton.count()) > 0) {
    await releaseButton.click();
  }
  await expect(page.getByRole("heading", { name: "Eliberată pentru producție" })).toBeVisible();
  const createPlan = page.getByRole("button", { name: "Creează planul de execuție" });
  if ((await createPlan.count()) > 0) {
    await createPlan.click();
  }
  await expect(page.getByRole("link", { name: "Deschide execuția" })).toBeVisible();
}

function taskCard(page: Page, processLabel: string, scopeLabel: string) {
  return page.locator(".execution-plan .production-op").filter({
    has: page.getByRole("heading", { name: new RegExp(`\\d+\\. ${processLabel}`) }),
  }).filter({
    hasText: `Componentă: ${scopeLabel}`,
  });
}

test("opens a dedicated commercial execution workspace and persists a real task", async ({
  page,
  request,
}) => {
  await ensureTestExecutor(request);
  await createReleasedPlan(page, uniqueInscription("WS"));
  await expect(page.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Comandă creată" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Eliberată pentru producție" })).toBeVisible();
  await expect(page.getByText("Plan de execuție creat.").first()).toBeVisible();
  await expect(page.locator(".execution-plan")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-handoff.png",
    fullPage: true,
  });

  await openExecutionWorkspace(page);
  const plan = page.locator(".execution-plan");
  await expect(page.locator(".page-lead")).toContainText("Eliberată din comandă");
  await expect(plan.getByText(/\/ 12 finalizate/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blocate" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Urmează" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Necesită configurare atelier" })).toHaveCount(0);
  await expect(plan.getByText("Fără furnizor: 0")).toBeVisible();
  await expect(page.getByText("624,82")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-initial.png",
    fullPage: true,
  });

  const faceCnc = taskCard(page, "Debitare foaie CNC", "Față");
  const inspect = taskCard(page, "Control calitate final", "Produs");
  await expect(faceCnc.getByText("Executant nealocat")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-blocked.png",
    fullPage: true,
  });
  await expect(inspect.getByText("Nu necesită echipament")).toBeVisible();
  await expect(inspect.getByText("Necesită configurare atelier")).toHaveCount(0);
  await expect(inspect.getByRole("button", { name: "Alocă", exact: true })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-gap.png",
    fullPage: true,
  });

  await expect(faceCnc.getByRole("combobox", { name: "Echipament / zonă" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-manual-provider-required.png",
    fullPage: true,
  });
  await assignProviderIfNeeded(faceCnc, "CNC 4020");
  await expect(faceCnc.getByText("Alocat: CNC 4020")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-assigned.png",
    fullPage: true,
  });
  await assignExecutorIfNeeded(faceCnc);
  await expect(faceCnc.getByRole("button", { name: "Pornește" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-next.png",
    fullPage: true,
  });
  await faceCnc.getByRole("button", { name: "Pornește" }).click();
  await expect(faceCnc.getByText("Stare: În lucru")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-in-progress.png",
    fullPage: true,
  });

  if (await faceCnc.getByText("Consum real", { exact: true }).isVisible()) {
    await faceCnc.getByText("Consum real", { exact: true }).click();
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-execution-workspace-actuals.png",
      fullPage: true,
    });
  }
  await faceCnc.getByRole("button", { name: "Finalizează" }).click();
  await expect(faceCnc.getByText("Stare: Finalizat")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-completed.png",
    fullPage: true,
  });

  await page.reload();
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toBeVisible();
  await expect(taskCard(page, "Debitare foaie CNC", "Față").getByText("Stare: Finalizat")).toBeVisible();
  await expect(taskCard(page, "Control calitate final", "Produs").getByText("Stare: Planificat")).toBeVisible();
});

test("keeps the execution workspace readable at 390px", async ({ page, request }) => {
  await ensureTestExecutor(request);
  await page.setViewportSize({ width: 390, height: 844 });
  await createReleasedPlan(page, uniqueInscription("WN"));
  await openExecutionWorkspace(page);
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-workspace-narrow.png",
    fullPage: true,
  });
});
