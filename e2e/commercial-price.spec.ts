import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const productName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function confirmLetters(
  page: Page,
  values: { inscription: string; depth: string; faceFinish?: string },
) {
  await page.goto("/products");
  await page.getByRole("link", { name: productName }).click();
  await page.getByLabel("Textul literelor").fill(values.inscription);
  await page.getByLabel("Finisaj față").selectOption(values.faceFinish ?? "none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption(values.depth);
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}

test("shows complete customer price after confirmed 60 mm internal cost", async ({
  page,
}) => {
  await confirmLetters(page, { inscription: "COM60", depth: "60" });
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Complet")).toBeVisible();
  const commercial = page.locator(".commercial-section");
  await expect(commercial.getByRole("heading", { name: "Preț client" })).toBeVisible();
  await expect(commercial.getByText("Complet")).toBeVisible();
  await expect(commercial.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await expect(commercial.getByText("382,50 EUR")).toBeVisible();
  await expect(commercial.getByText("35%")).toBeVisible();
  await expect(commercial.getByText("516,38 EUR")).toBeVisible();
  await expect(commercial.getByText("21% · 108,44 EUR")).toBeVisible();
  await expect(commercial.getByLabel("Discount")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Plan de producție" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-60mm-relation.png",
    fullPage: true,
  });
  await commercial.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-60mm-summary.png",
  });
  await commercial.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-60mm-breakdown.png",
  });
});

test("keeps 30 mm customer price partial and not final", async ({ page }) => {
  await confirmLetters(page, { inscription: "COM30", depth: "30" });
  await expect(page.getByText("Total cost intern estimat: 345,00 EUR")).toBeVisible();
  const commercial = page.locator(".commercial-section");
  await expect(commercial.getByRole("heading", { name: "Preț client" })).toBeVisible();
  await expect(commercial.getByText("Parțial", { exact: true })).toBeVisible();
  await expect(commercial.getByText("Parțial / indisponibil pentru finalizare")).toBeVisible();
  await expect(
    commercial.getByText("Costul intern nu este complet pentru această configurație."),
  ).toBeVisible();
  await expect(commercial.getByText("Preț final client")).toHaveCount(0);
  await expect(commercial.getByText("624,82 EUR")).toHaveCount(0);
  await commercial.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-30mm-partial.png",
  });
});

test("keeps commercial readable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await confirmLetters(page, { inscription: "COMN", depth: "60" });
  const commercial = page.locator(".commercial-section");
  await expect(commercial.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await commercial.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-narrow.png",
  });
});
