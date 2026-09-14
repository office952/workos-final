import { mkdir } from "node:fs/promises";
import { expect, test } from "./fixtures";
import { clickPrimaryDestination } from "./helpers/navigation";

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 1100 },
  { name: "1280", width: 1280, height: 900 },
  { name: "768", width: 768, height: 1100 },
] as const;

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
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    }),
  ).toBeVisible();
}

async function fillLettersComun(page: import("@playwright/test").Page) {
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("vinyl");
  await page.getByLabel("Culoare față").fill("alb");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
}

function workspaceFacts(page: import("@playwright/test").Page) {
  return page.locator(".cfg-blueprint").innerText();
}

async function workspaceColumnCount(page: import("@playwright/test").Page) {
  return page.locator(".cfg-workspace").evaluate((element) => {
    return getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length;
  });
}

test.describe("configurator final 219:3", () => {
  test.beforeAll(async () => {
    await mkdir(".tmp/configurator-final-proof", { recursive: true });
  });

  test("C/D/G/H product truth holds across 1440 / 1280 / 768", async ({ page }) => {
    await openLetters(page);

    const incompleteByViewport: string[] = [];
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.getByRole("button", { name: "LITERE" })).toBeVisible();
      await expect(page.getByRole("button", { name: "COMPOZIȚIE" })).toBeVisible();
      await expect(page.getByRole("button", { name: "ANSAMBLARE" })).toHaveCount(0);
      await expect(page.getByText("Configurezi:")).toHaveCount(0);
      await expect(page.getByText("2 din 4 module validate")).toBeVisible();
      await expect(page.locator(".cfg-blueprint").getByText("NECONFIGURAT").first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Verifică configurația" })).toBeVisible();
      if (viewport.width <= 768) {
        expect(await workspaceColumnCount(page)).toBe(1);
      } else {
        expect(await workspaceColumnCount(page)).toBe(2);
      }
      incompleteByViewport.push(await workspaceFacts(page));
      await page.screenshot({
        path: `.tmp/configurator-final-proof/h-incomplete-${viewport.name}.png`,
        fullPage: true,
      });
    }
    expect(new Set(incompleteByViewport).size).toBe(1);

    await page.setViewportSize({ width: 1440, height: 1100 });
    await fillLettersComun(page);
    await expect(page.getByText("Configurare completă")).toBeVisible();
    await expect(page.getByText("Plexiglas 3 mm opal")).toBeVisible();
    await expect(page.getByText("60 mm").first()).toBeVisible();

    const filledByViewport: string[] = [];
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.getByText("Configurare completă")).toBeVisible();
      await expect(page.getByText("Ansamblu ACM + litere volumetrice")).toHaveCount(0);
      await expect(page.getByText("GRĂDINIȚA")).toHaveCount(0);
      filledByViewport.push(await workspaceFacts(page));
      await page.screenshot({
        path: `.tmp/configurator-final-proof/c-litere-comun-${viewport.name}.png`,
        fullPage: true,
      });
    }
    expect(new Set(filledByViewport).size).toBe(1);

    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.getByRole("button", { name: "COMPOZIȚIE" }).click();
    await expect(page.getByRole("button", { name: "Editează în LITERE" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Verifică configurația" })).toHaveCount(0);
    await expect(page.getByText("Configurare completă").first()).toBeVisible();

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.getByRole("button", { name: "Editează în LITERE" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Verifică configurația" })).toHaveCount(0);
      await page.screenshot({
        path: `.tmp/configurator-final-proof/g-compozitie-${viewport.name}.png`,
        fullPage: true,
      });
    }
  });

  test("A — ACM simple uses cassette contract and hides Ansamblare", async ({ page }) => {
    await page.goto("/");
    await clickPrimaryDestination(page, "Catalog");
    await page.getByRole("link", { name: "Panou ACM casetat" }).click();
    await expect(page.getByRole("heading", { name: "Panou ACM casetat" })).toBeVisible();
    await expect(page.getByRole("button", { name: "PANOU ACM" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ANSAMBLARE" })).toHaveCount(0);
    await expect(page.getByText("Material casetă: ACM 3 mm")).toBeVisible();
    await expect(page.getByLabel("Lățime exterioară (mm)")).toBeVisible();
    await expect(page.getByText("buză interioară", { exact: false })).toHaveCount(0);
    await page.screenshot({
      path: ".tmp/configurator-final-proof/a-panou-acm-1440.png",
      fullPage: true,
    });
  });

  test("keyboard can move between scopes and keep focus visible", async ({ page }) => {
    await openLetters(page);
    await page.getByRole("button", { name: "COMPOZIȚIE" }).focus();
    await expect(page.getByRole("button", { name: "COMPOZIȚIE" })).toBeFocused();
    await page.getByRole("button", { name: "COMPOZIȚIE" }).press("Enter");
    await expect(page.getByRole("button", { name: "COMPOZIȚIE" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(page.getByRole("button", { name: "Editează în LITERE" })).toBeVisible();
  });
});
