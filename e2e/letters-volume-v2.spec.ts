import { expect, test } from "./fixtures";
import { clickPrimaryDestination } from "./helpers/navigation";
import { selectProductChoice } from "./helpers/productChoices";

const ORACAL_ROLL_1260 = "roll:shared:oracal:1260";

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

async function fillLettersFaceNone(page: import("@playwright/test").Page) {
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await selectProductChoice(page, "Finisaj față", "none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
}

async function pickCatalogColor(
  page: import("@playwright/test").Page,
  label: RegExp,
  query: string,
  name: string,
) {
  await page.getByRole("button", { name: label }).click();
  await page.getByLabel("Caută culoare după cod sau nume").fill(query);
  await page.getByRole("option", { name, exact: true }).click();
}

test.describe("FC2C LETTERS VOLUME V2", () => {
  test("desktop Oracal 651 1440 path", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersFaceNone(page);
    await selectProductChoice(page, "Adâncime volum (mm)", "80");
    await selectProductChoice(page, "Finisaj volum", "oracal");
    await selectProductChoice(page, "Serie Oracal", "651");
    await pickCatalogColor(page, /Culoare/, "010", "010 — White");
    await selectProductChoice(page, "Rolă", ORACAL_ROLL_1260);
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Oracal 651", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("010 — White", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Rolă 1260 mm", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("80 mm", { exact: true }).first()).toBeVisible();
  });

  test("desktop Oracal 641 path", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersFaceNone(page);
    await selectProductChoice(page, "Adâncime volum (mm)", "60");
    await selectProductChoice(page, "Finisaj volum", "oracal");
    await selectProductChoice(page, "Serie Oracal", "641");
    await pickCatalogColor(page, /Culoare/, "010", "010 — White");
    await selectProductChoice(page, "Rolă", ORACAL_ROLL_1260);
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Oracal 641", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Oracal 8500")).toHaveCount(0);
  });

  test("desktop RAL path with code and name search", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersFaceNone(page);
    await selectProductChoice(page, "Adâncime volum (mm)", "80");
    await selectProductChoice(page, "Finisaj volum", "painted");
    await expect(page.getByLabel("Serie Oracal")).toHaveCount(0);
    await page.getByRole("button", { name: /Culoare RAL/ }).click();
    await page.getByLabel("Caută culoare după cod sau nume").fill("9005");
    await page.getByRole("option", { name: "9005 — Jet black", exact: true }).click();
    await page.getByRole("button", { name: /RAL 9005/ }).click();
    await page.getByLabel("Caută culoare după cod sau nume").fill("Jet black");
    await expect(page.getByRole("option", { name: "9005 — Jet black", exact: true })).toBeVisible();
    await page.getByRole("option", { name: "9005 — Jet black", exact: true }).click();
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Vopsit RAL", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("RAL 9005 — Jet black", { exact: true }).first()).toBeVisible();
  });

  test("switch Oracal to RAL drops stale Oracal truth", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersFaceNone(page);
    await selectProductChoice(page, "Adâncime volum (mm)", "80");
    await selectProductChoice(page, "Finisaj volum", "oracal");
    await selectProductChoice(page, "Serie Oracal", "651");
    await pickCatalogColor(page, /Culoare/, "010", "010 — White");
    await selectProductChoice(page, "Rolă", ORACAL_ROLL_1260);
    await selectProductChoice(page, "Finisaj volum", "painted");
    await expect(page.getByLabel("Serie Oracal")).toHaveCount(0);
    await expect(page.getByLabel("Rolă")).toHaveCount(0);
    await page.getByRole("button", { name: /Culoare RAL/ }).click();
    await page.getByLabel("Caută culoare după cod sau nume").fill("9005");
    await page.getByRole("option", { name: "9005 — Jet black", exact: true }).click();
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Vopsit RAL", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Oracal 651")).toHaveCount(0);
    await expect(page.locator(".cfg-blueprint").getByText("Rolă 1260 mm")).toHaveCount(0);
  });

  test("768 keeps editor then blueprint without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await page.setViewportSize({ width: 768, height: 1100 });
    const editorBox = await page.locator(".cfg-editor").boundingBox();
    const blueprintBox = await page.locator(".cfg-blueprint").boundingBox();
    expect(editorBox && blueprintBox).toBeTruthy();
    if (editorBox && blueprintBox) {
      expect(editorBox.y).toBeLessThan(blueprintBox.y);
    }
    await selectProductChoice(page, "Finisaj volum", "oracal");
    await selectProductChoice(page, "Serie Oracal", "651");
    await page.getByRole("button", { name: /Culoare/ }).click();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });
});
