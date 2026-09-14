import { mkdir } from "node:fs/promises";
import { expect, test } from "./fixtures";
import { clickPrimaryDestination } from "./helpers/navigation";
import { selectProductChoice } from "./helpers/productChoices";

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

async function fillAcmSimple(page: import("@playwright/test").Page) {
  await page.getByLabel("Denumire lucrare").fill("PANOU ACM");
  await selectProductChoice(page, "Sistem de prindere", "steel_angle");
  await page.getByLabel("Lățime exterioară (mm)").fill("1000");
  await page.getByLabel("Înălțime exterioară (mm)").fill("500");
  await selectProductChoice(page, "Adâncime casetă (mm)", "40");
  await selectProductChoice(page, "Număr de îndoituri", "1");
}

async function fillLettersComun(page: import("@playwright/test").Page) {
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await selectProductChoice(page, "Finisaj față", "vinyl");
  await page.getByLabel("Culoare față").fill("alb");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await selectProductChoice(page, "Adâncime volum (mm)", "60");
  await selectProductChoice(page, "Finisaj volum", "none");
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
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirmă configurația" })).toBeVisible();
    const reviewFacts = await workspaceFacts(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(reviewFacts);
    await page.setViewportSize({ width: 768, height: 1100 });
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(reviewFacts);
    expect(await workspaceColumnCount(page)).toBe(1);

    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.getByRole("button", { name: "COMPOZIȚIE" }).click();
    await expect(page.getByRole("button", { name: "Editează în LITERE" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Verifică configurația" })).toHaveCount(0);
    await expect(
      page.getByText("Rezumat numai-citire al acestui produs. Nu se modifică aici."),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Editează în PANOU ACM" })).toHaveCount(0);
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

    const acmIncomplete: string[] = [];
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.locator(".cfg-blueprint").getByText("NECONFIGURAT").first()).toBeVisible();
      if (viewport.width <= 768) {
        expect(await workspaceColumnCount(page)).toBe(1);
      } else {
        expect(await workspaceColumnCount(page)).toBe(2);
      }
      acmIncomplete.push(await workspaceFacts(page));
    }
    expect(new Set(acmIncomplete).size).toBe(1);

    await page.setViewportSize({ width: 1440, height: 1100 });
    await fillAcmSimple(page);
    await expect(page.getByText("Configurare completă")).toBeVisible();
    const acmReady = await workspaceFacts(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    expect(await workspaceFacts(page)).toBe(acmReady);
    await page.setViewportSize({ width: 768, height: 1100 });
    expect(await workspaceFacts(page)).toBe(acmReady);
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toBeVisible();
    const acmReview = await workspaceFacts(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(acmReview);
    await page.setViewportSize({ width: 768, height: 1100 });
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(acmReview);
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.getByRole("button", { name: "COMPOZIȚIE" }).click();
    await expect(page.getByRole("button", { name: "Editează în PANOU ACM" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Editează în LITERE" })).toHaveCount(0);
    await expect(
      page.getByText("Rezumat numai-citire al acestui produs. Nu se modifică aici."),
    ).toBeVisible();
    const acmComposition = await workspaceFacts(page);
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.getByRole("button", { name: "Editează în PANOU ACM" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Verifică configurația" })).toHaveCount(0);
      expect(await workspaceFacts(page)).toBe(acmComposition);
    }
    await page.screenshot({
      path: ".tmp/configurator-final-proof/a-panou-acm-1440.png",
      fullPage: true,
    });
  });

  test("keyboard uses visible segmented choices, not the hidden select", async ({
    page,
  }) => {
    await openLetters(page);
    const group = page.getByRole("radiogroup", { name: "Finisaj față" });
    const none = page.getByRole("radio", { name: "Fără finisaj" }).first();
    const vinyl = page.getByRole("radio", { name: "Colantat" }).first();
    const native = page.locator('select[name="face.finish"]');

    await expect(group).toBeVisible();
    await expect(native).toHaveAttribute("aria-hidden", "true");
    expect(await none.evaluate((element) => element.closest("[aria-hidden='true']"))).toBeNull();

    await page.getByLabel("Textul literelor").focus();
    await page.keyboard.press("Tab");
    await expect(none).toBeFocused();
    const outline = await none.evaluate((element) => {
      const style = getComputedStyle(element);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
    expect(outline.style).not.toBe("none");

    await page.keyboard.press("ArrowRight");
    await expect(vinyl).toHaveAttribute("aria-checked", "true");
    await expect(vinyl).toBeFocused();
    await expect(native).toHaveValue("vinyl");
  });

  test("keyboard can move between scopes and keep focus visible", async ({ page }) => {
    await openLetters(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Anatomie fizică litere" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Configurezi literele" })).toBeVisible();
    const rail = page.getByRole("button", { name: "LITERE" });
    const verify = page.getByRole("button", { name: "Verifică configurația" });
    for (const target of [rail, verify]) {
      const box = await target.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
    await page.getByRole("button", { name: "LITERE" }).focus();
    await page.keyboard.press("Tab");
    const compositionScope = page.getByRole("button", { name: "COMPOZIȚIE" });
    await expect(compositionScope).toBeFocused();
    const outline = await compositionScope.evaluate((element) => {
      const style = getComputedStyle(element);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
    expect(outline.style).not.toBe("none");
    await compositionScope.press("Enter");
    await expect(page.getByRole("button", { name: "COMPOZIȚIE" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    const edit = page.getByRole("button", { name: "Editează în LITERE" });
    await expect(edit).toBeVisible();
    expect((await edit.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    await expect(page.getByText("NECONFIGURAT").first()).toBeVisible();
    await expect(page.getByText("Incomplet").first()).toBeVisible();
  });
});
