import { expect, test } from "./fixtures";
import { clickPrimaryDestination } from "./helpers/navigation";
import { selectProductChoice } from "./helpers/productChoices";

const ORACAL_ROLL_1260 = "roll:shared:oracal:1260";
const PRINT_ROLL_1370 = "roll:shared:print:1370";

async function openLetters(page: import("@playwright/test").Page) {
  await page.goto("/");
  await clickPrimaryDestination(page, "Catalog");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    }),
  ).toBeVisible();
}

async function fillLettersCommon(page: import("@playwright/test").Page) {
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await selectProductChoice(page, "Adâncime volum (mm)", "60");
  await selectProductChoice(page, "Finisaj volum", "none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
}

async function pickCatalogColor(page: import("@playwright/test").Page, query: string, name: string) {
  await page.getByRole("button", { name: /Culoare/ }).click();
  await page.getByLabel("Caută culoare după cod sau nume").fill(query);
  await page.getByRole("option", { name, exact: true }).click();
}

test.describe("FC2B LETTERS FACE V2", () => {
  test("desktop Oracal 651 complete path", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersCommon(page);
    await selectProductChoice(page, "Finisaj față", "oracal");
    await selectProductChoice(page, "Serie Oracal", "651");
    await pickCatalogColor(page, "010", "010 — White");
    await selectProductChoice(page, "Rolă", ORACAL_ROLL_1260);
    await expect(page.getByRole("button", { name: /010 — White/ })).toBeVisible();
    await expect(page.locator(".choice-chips.cfg-segmented").filter({ hasText: "010" })).toHaveCount(0);
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Oracal 651", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Rolă 1260 mm", { exact: true }).first()).toBeVisible();
  });

  test("desktop Oracal 8500 path", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersCommon(page);
    await selectProductChoice(page, "Finisaj față", "oracal");
    await selectProductChoice(page, "Serie Oracal", "8500");
    await pickCatalogColor(page, "White", "010 — White");
    await selectProductChoice(page, "Rolă", ORACAL_ROLL_1260);
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Oracal 8500", { exact: true }).first()).toBeVisible();
  });

  test("desktop print plus lamination path", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openLetters(page);
    await fillLettersCommon(page);
    await selectProductChoice(page, "Finisaj față", "print");
    await selectProductChoice(page, "Rolă print", PRINT_ROLL_1370);
    await selectProductChoice(page, "Laminare", "laminated");
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Cu laminare", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Rolă 1370 mm", { exact: true }).first()).toBeVisible();
  });

  test("missing Oracal color stays blocked", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersCommon(page);
    await selectProductChoice(page, "Finisaj față", "oracal");
    await selectProductChoice(page, "Serie Oracal", "651");
    await selectProductChoice(page, "Rolă", ORACAL_ROLL_1260);
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Completează acest câmp.").first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("NECONFIGURAT", { exact: true }).first()).toBeVisible();
  });

  test("768 keeps editor then blueprint and does not overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await page.setViewportSize({ width: 768, height: 1100 });
    const editorBox = await page.locator(".cfg-editor").boundingBox();
    const blueprintBox = await page.locator(".cfg-blueprint").boundingBox();
    expect(editorBox && blueprintBox).toBeTruthy();
    if (editorBox && blueprintBox) {
      expect(editorBox.y).toBeLessThan(blueprintBox.y);
    }
    await selectProductChoice(page, "Finisaj față", "oracal");
    await selectProductChoice(page, "Serie Oracal", "651");
    await page.getByRole("button", { name: /Culoare/ }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  });
});
