import { mkdir } from "node:fs/promises";
import { expect, test } from "./fixtures";
import { identityMenuTrigger, openAccountMenu } from "./helpers/account";
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
      level: 1,
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    }),
  ).toBeVisible();
  await expect(page.locator(".cfg-blueprint")).toBeVisible();
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

type PanelBox = { x: number; y: number; width: number; height: number };

async function panelGeometry(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const blueprint = document.querySelector(".cfg-blueprint");
    const editor =
      document.querySelector(".cfg-editor") ?? document.querySelector(".cfg-review");
    if (!blueprint || !editor) {
      throw new Error("Configurator panels missing");
    }
    const blueprintBox = blueprint.getBoundingClientRect();
    const editorBox = editor.getBoundingClientRect();
    const content = document.getElementById("continut-principal");
    const root = document.scrollingElement;
    return {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      rootScroll: root instanceof HTMLElement ? root.scrollTop : 0,
      contentScroll: content instanceof HTMLElement ? content.scrollTop : 0,
      blueprint: {
        x: blueprintBox.x,
        y: blueprintBox.y,
        width: blueprintBox.width,
        height: blueprintBox.height,
      },
      editor: {
        x: editorBox.x,
        y: editorBox.y,
        width: editorBox.width,
        height: editorBox.height,
      },
      gap: editorBox.left - blueprintBox.right,
    };
  });
}

type RailBox = { x: number; width: number; center: number; labelX: number; hugRight: number };

type RailGeometry = {
  group: RailBox;
  product: RailBox;
  composition: RailBox;
  gap: number;
  scrollY: number;
};

async function railGeometry(page: import("@playwright/test").Page): Promise<RailGeometry> {
  return page.evaluate(() => {
    const group = document.querySelector(".cfg-rail-items");
    const items = [...document.querySelectorAll(".cfg-rail-item")];
    if (!group || items.length < 2) {
      throw new Error("Scope rail missing");
    }
    const groupBox = group.getBoundingClientRect();
    const boxes = items.map((item) => {
      const box = item.getBoundingClientRect();
      const label = item.querySelector(".cfg-rail-text");
      const hug = item.querySelector(".cfg-rail-hug");
      if (!label || !hug) {
        throw new Error("Scope hug missing");
      }
      return {
        x: box.x,
        width: box.width,
        center: box.x + box.width / 2,
        labelX: label.getBoundingClientRect().x,
        hugRight: hug.getBoundingClientRect().right,
      };
    });
    const product = boxes[0];
    const composition = boxes[1];
    if (!product || !composition) {
      throw new Error("Scope items missing");
    }
    return {
      group: {
        x: groupBox.x,
        width: groupBox.width,
        center: groupBox.x + groupBox.width / 2,
        labelX: groupBox.x,
        hugRight: groupBox.right,
      },
      product,
      composition,
      gap: composition.x - (product.x + product.width),
      scrollY: window.scrollY,
    };
  });
}

function expectStableRail(before: RailGeometry, after: RailGeometry) {
  expect(Math.abs(after.product.x - before.product.x)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.product.width - before.product.width)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.product.center - before.product.center)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.product.labelX - before.product.labelX)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.composition.x - before.composition.x)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.composition.width - before.composition.width)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.composition.center - before.composition.center)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.composition.labelX - before.composition.labelX)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.group.x - before.group.x)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.group.width - before.group.width)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.gap - before.gap)).toBeLessThanOrEqual(0.5);
  expect(after.scrollY).toBe(before.scrollY);
}

function expectStablePanel(before: PanelBox, after: PanelBox, axis: "desktop" | "stack") {
  expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(after.width - before.width)).toBeLessThanOrEqual(1);
  if (axis === "desktop") {
    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
  }
}

async function activateControl(locator: import("@playwright/test").Locator) {
  await locator.evaluate((node: HTMLElement) => {
    node.click();
  });
}

function expectStablePageOrigin(
  before: { scrollY: number; rootScroll?: number; contentScroll?: number },
  after: { scrollY: number; rootScroll?: number; contentScroll?: number },
) {
  expect(after.scrollY).toBe(before.scrollY);
  expect(after.rootScroll ?? 0).toBe(before.rootScroll ?? 0);
  expect(after.contentScroll ?? 0).toBe(before.contentScroll ?? 0);
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
      await expect(page.getByRole("button", { name: "LITERE", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "COMPOZIȚIE", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "LITERE Complet" })).toHaveCount(0);
      await expect(page.getByRole("button", { name: "COMPOZIȚIE Complet" })).toHaveCount(0);
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
    await expect(page.getByRole("button", { name: "LITERE Complet" })).toBeVisible();
    await expect(page.getByRole("button", { name: "COMPOZIȚIE Complet" })).toBeVisible();
    await expect(page.getByText("Plexiglas 3 mm opal", { exact: true })).toBeVisible();
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
    await expect(page.getByRole("heading", { name: "Configurare litere" })).toBeVisible();
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Confirmă configurația" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Modifică configurația" })).toBeVisible();
    const reviewFacts = await workspaceFacts(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(reviewFacts);
    await page.setViewportSize({ width: 768, height: 1100 });
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(reviewFacts);
    expect(await workspaceColumnCount(page)).toBe(1);
    const stacked = await panelGeometry(page);
    expect(stacked.editor.y).toBeLessThan(stacked.blueprint.y);

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
    await expect(page.getByRole("navigation", { name: "Module de configurare" })).toHaveAttribute(
      "data-rail-mode",
      "group",
    );
    await expect(page.getByRole("button", { name: "ANSAMBLARE" })).toHaveCount(0);
    await expect(page.getByText("ACM 3 mm", { exact: true })).toBeVisible();
    await expect(page.locator(".cfg-blueprint").getByText("Material:")).toBeVisible();
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
    await expect(page.getByRole("button", { name: "PANOU ACM Complet" })).toBeVisible();
    await expect(page.getByRole("button", { name: "COMPOZIȚIE Complet" })).toBeVisible();
    const acmReady = await workspaceFacts(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    expect(await workspaceFacts(page)).toBe(acmReady);
    await page.setViewportSize({ width: 768, height: 1100 });
    expect(await workspaceFacts(page)).toBe(acmReady);
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await expect(page.getByRole("heading", { name: "Configurare Panou ACM" })).toBeVisible();
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toHaveCount(0);
    const acmReview = await workspaceFacts(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(acmReview);
    await page.setViewportSize({ width: 768, height: 1100 });
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    expect(await workspaceFacts(page)).toBe(acmReview);
    const acmStacked = await panelGeometry(page);
    expect(acmStacked.editor.y).toBeLessThan(acmStacked.blueprint.y);
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
    await expect(page.getByRole("heading", { name: "Configurare litere" })).toBeVisible();
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

  test("desktop columns match 740:580 and selection does not shift panels", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await expect(page.locator(".cfg-editor")).toBeVisible();
    await expect(identityMenuTrigger(page)).toBeVisible();
    await expect(identityMenuTrigger(page)).toContainText("Atelier Demo");
    await expect(identityMenuTrigger(page)).not.toContainText("HUB MEDIA");
    await openAccountMenu(page);
    await expect(page.getByRole("dialog", { name: "Datele contului" })).toContainText("Atelier Demo");
    await expect(page.getByRole("link", { name: "Administrare" })).toBeVisible();
    await page.keyboard.press("Escape");
    const titleRailGap = await page.evaluate(() => {
      const identity = document.querySelector(".cfg-page-identity");
      const rail = document.querySelector(".cfg-rail");
      if (!identity || !rail) {
        throw new Error("Title or rail missing");
      }
      return rail.getBoundingClientRect().top - identity.getBoundingClientRect().bottom;
    });
    expect(titleRailGap).toBeGreaterThanOrEqual(16);
    expect(titleRailGap).toBeLessThanOrEqual(20);

    const start = await panelGeometry(page);
    expect(start.scrollY).toBe(0);
    const usable1440 = start.blueprint.width + start.gap + start.editor.width;
    expect(start.gap).toBeGreaterThanOrEqual(23);
    expect(start.gap).toBeLessThanOrEqual(25);
    expect(start.blueprint.width / (usable1440 - start.gap)).toBeCloseTo(740 / 1320, 2);
    expect(start.editor.width / (usable1440 - start.gap)).toBeCloseTo(580 / 1320, 2);
    expect(start.blueprint.width).toBeGreaterThan(start.editor.width);
    await expect(page.getByText("INCOMPLET")).toHaveCount(0);
    await expect(page.getByText("Necesar")).toHaveCount(0);
    await expect(page.locator(".cfg-blueprint").getByText("Complet")).toHaveCount(2);
    const rail = page.getByRole("navigation", { name: "Module de configurare" });
    await expect(rail).toHaveAttribute("data-rail-mode", "group");
    await expect(rail).toHaveAttribute("data-rail-count", "2");
    await expect(page.getByRole("button", { name: "PANOU ACM" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "ANSAMBLARE" })).toHaveCount(0);
    const railItems = page.locator(".cfg-rail-item");
    await expect(railItems).toHaveCount(2);
    const firstRail = await railItems.nth(0).boundingBox();
    const secondRail = await railItems.nth(1).boundingBox();
    const railGap = (secondRail?.x ?? 0) - ((firstRail?.x ?? 0) + (firstRail?.width ?? 0));
    expect(railGap).toBeGreaterThanOrEqual(32);
    expect(railGap).toBeLessThanOrEqual(48);
    const verifyBox = await page.getByRole("button", { name: "Verifică configurația" }).boundingBox();
    expect(verifyBox?.width ?? 0).toBeGreaterThanOrEqual(256);
    expect(verifyBox?.width ?? 0).toBeLessThanOrEqual(260);
    expect(verifyBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    const titleBox = await page.locator("#cfg-page-title").boundingBox();
    const blueprintBox = await page.locator(".cfg-blueprint").boundingBox();
    expect(Math.abs((titleBox?.x ?? 0) - (blueprintBox?.x ?? 0))).toBeLessThanOrEqual(2);

    await page.locator(".cfg-blueprint").getByRole("button", { name: "CANT" }).click();
    const afterCant = await panelGeometry(page);
    expect(afterCant.scrollY).toBe(start.scrollY);
    expect(afterCant.scrollX).toBe(start.scrollX);
    expectStablePanel(start.blueprint, afterCant.blueprint, "desktop");
    expectStablePanel(start.editor, afterCant.editor, "desktop");

    await page.locator(".cfg-blueprint").getByRole("button", { name: "FAȚĂ" }).click();
    await page.getByRole("radio", { name: "Colantat" }).first().click();
    const afterFace = await panelGeometry(page);
    expect(afterFace.scrollY).toBe(start.scrollY);
    expectStablePanel(start.blueprint, afterFace.blueprint, "desktop");
    expect(Math.abs(afterFace.editor.x - start.editor.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(afterFace.editor.width - start.editor.width)).toBeLessThanOrEqual(1);

    const railBefore = await railGeometry(page);
    await page.getByRole("button", { name: "COMPOZIȚIE" }).click();
    await expect(page.getByRole("button", { name: "Editează în LITERE" })).toBeVisible();
    const afterComposition = await panelGeometry(page);
    expect(afterComposition.scrollY).toBe(start.scrollY);
    expectStablePanel(start.blueprint, afterComposition.blueprint, "desktop");
    expect(Math.abs(afterComposition.editor.x - start.editor.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(afterComposition.editor.width - start.editor.width)).toBeLessThanOrEqual(1);
    expectStableRail(railBefore, await railGeometry(page));
    await page.getByRole("button", { name: /^LITERE$/ }).click();
    expectStableRail(railBefore, await railGeometry(page));

    await page.setViewportSize({ width: 1280, height: 900 });
    const at1280 = await panelGeometry(page);
    const usable1280 = at1280.blueprint.width + at1280.gap + at1280.editor.width;
    expect(Math.abs(at1280.gap - 24)).toBeLessThanOrEqual(2);
    expect(at1280.blueprint.width / (usable1280 - at1280.gap)).toBeCloseTo(740 / 1320, 2);
    expect(at1280.editor.width / (usable1280 - at1280.gap)).toBeCloseTo(580 / 1320, 2);
  });

  test("scope rail geometry stays immutable across mouse and keyboard", async ({ page }) => {
    for (const width of [1440, 1280, 768] as const) {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await openLetters(page);
      await page.evaluate(() => document.fonts.ready);
      await page.setViewportSize({ width, height: 1100 });
      await page.evaluate(() => document.fonts.ready);
      const incompleteRail = await railGeometry(page);
      expect(incompleteRail.gap).toBeGreaterThanOrEqual(39.5);
      expect(incompleteRail.gap).toBeLessThanOrEqual(40.5);
      await page.getByRole("button", { name: /^COMPOZIȚIE$/ }).click();
      expectStableRail(incompleteRail, await railGeometry(page));
      await page.getByRole("button", { name: /^LITERE$/ }).click();
      expectStableRail(incompleteRail, await railGeometry(page));
      await fillLettersComun(page);
      await expect(page.getByRole("button", { name: "LITERE Complet" })).toBeVisible();
      const startRail = await railGeometry(page);
      expect(Math.abs(startRail.product.labelX - incompleteRail.product.labelX)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(startRail.product.x - incompleteRail.product.x)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(startRail.product.center - incompleteRail.product.center)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(startRail.composition.x - incompleteRail.composition.x)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(startRail.group.x - incompleteRail.group.x)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(startRail.gap - incompleteRail.gap)).toBeLessThanOrEqual(0.5);
      expect(startRail.product.hugRight).toBeGreaterThan(incompleteRail.product.hugRight + 8);
      expect(startRail.gap).toBeGreaterThanOrEqual(39.5);
      expect(startRail.gap).toBeLessThanOrEqual(40.5);
      await page.getByRole("button", { name: "COMPOZIȚIE Complet" }).click();
      expectStableRail(startRail, await railGeometry(page));
      await page.getByRole("button", { name: "LITERE Complet" }).click();
      expectStableRail(startRail, await railGeometry(page));
      await page.getByRole("button", { name: "LITERE Complet" }).focus();
      await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: "COMPOZIȚIE Complet" })).toBeFocused();
      await page.keyboard.press("Enter");
      expectStableRail(startRail, await railGeometry(page));
      await page.getByRole("button", { name: "LITERE Complet" }).click();
      expectStableRail(startRail, await railGeometry(page));
    }
  });

  test("edit review edit keeps editor grammar and card geometry", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await fillLettersComun(page);
    await expect(page.getByText("Configurare completă")).toBeVisible();
    const editGeometry = await panelGeometry(page);
    const editRail = await railGeometry(page);
    await activateControl(page.getByRole("button", { name: "Verifică configurația" }));
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Configurare litere" })).toBeVisible();
    await expect(page.locator(".cfg-editor .cfg-editor-accent")).toBeVisible();
    await expect(page.locator('.cfg-editor [data-fact-id="face.confirmedAreaMm2"]')).toBeVisible();
    await expect(page.locator("ul.review-facts")).toHaveCount(0);
    const confirmBox = await page.getByRole("button", { name: "Confirmă configurația" }).boundingBox();
    expect(confirmBox?.width ?? 0).toBeGreaterThanOrEqual(256);
    expect(confirmBox?.width ?? 0).toBeLessThanOrEqual(260);
    expect(confirmBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    const reviewGeometry = await panelGeometry(page);
    expectStablePanel(editGeometry.blueprint, reviewGeometry.blueprint, "desktop");
    expectStablePanel(editGeometry.editor, reviewGeometry.editor, "desktop");
    expectStablePageOrigin(editGeometry, reviewGeometry);
    expectStableRail(editRail, await railGeometry(page));
    await activateControl(page.getByRole("button", { name: "Modifică configurația" }));
    await expect(page.getByRole("button", { name: "Verifică configurația" })).toBeVisible();
    const back = await panelGeometry(page);
    expectStablePanel(editGeometry.blueprint, back.blueprint, "desktop");
    expectStablePanel(editGeometry.editor, back.editor, "desktop");
    expectStablePageOrigin(editGeometry, back);
    expectStableRail(editRail, await railGeometry(page));

    await page.goto("/");
    await clickPrimaryDestination(page, "Catalog");
    await page.getByRole("link", { name: "Panou ACM casetat" }).click();
    await expect(page.getByRole("heading", { name: "Panou ACM casetat" })).toBeVisible();
    await fillAcmSimple(page);
    await expect(page.getByText("Configurare completă")).toBeVisible();
    const acmEdit = await panelGeometry(page);
    const acmRail = await railGeometry(page);
    await activateControl(page.getByRole("button", { name: "Verifică configurația" }));
    await expect(page.getByRole("heading", { name: "Configurare Panou ACM" })).toBeVisible();
    await expect(
      page.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeVisible();
    const acmReview = await panelGeometry(page);
    expectStablePanel(acmEdit.blueprint, acmReview.blueprint, "desktop");
    expectStablePanel(acmEdit.editor, acmReview.editor, "desktop");
    expectStablePageOrigin(acmEdit, acmReview);
    expectStableRail(acmRail, await railGeometry(page));
    await activateControl(page.getByRole("button", { name: "Modifică configurația" }));
    await expect(page.getByRole("button", { name: "Verifică configurația" })).toBeVisible();
    const acmBack = await panelGeometry(page);
    expectStablePanel(acmEdit.blueprint, acmBack.blueprint, "desktop");
    expectStablePanel(acmEdit.editor, acmBack.editor, "desktop");
    expectStablePageOrigin(acmEdit, acmBack);
    expectStableRail(acmRail, await railGeometry(page));
  });

  test("768 stacks the active editor before Blueprint, composition stays review-first", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await openLetters(page);
    await page.setViewportSize({ width: 768, height: 1100 });
    const stacked = await panelGeometry(page);
    expect(stacked.editor.y).toBeLessThan(stacked.blueprint.y);
    await page.getByRole("button", { name: /^COMPOZIȚIE$/ }).click();
    const composition = await panelGeometry(page);
    expect(composition.blueprint.y).toBeLessThan(composition.editor.y);
  });
});
