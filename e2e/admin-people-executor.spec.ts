import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";
import { openExecutionWorkspace } from "./helpers/execution";
import { openPeopleAdmin } from "./helpers/people";

const ACTIVE_NAME = "Executor PEOPLE E2E";
const RETIRED_NAME = "Executor retras PEOPLE E2E";

async function confirmLetters(page: Page) {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("PEOPLE");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
}

function taskCard(page: Page, processLabel: string, scopeLabel: string) {
  return page.locator(".execution-plan .production-op").filter({
    has: page.getByRole("heading", { name: new RegExp(`\\d+\\. ${processLabel}`) }),
  }).filter({
    hasText: `Componentă: ${scopeLabel}`,
  });
}

async function ensureNamedPerson(page: Page, name: string) {
  const activeItem = page.locator(".people-list li").filter({ hasText: name }).first();
  if (await activeItem.isVisible()) {
    return;
  }
  await page.locator(".people-create").getByLabel("Nume").fill(name);
  await page.getByRole("button", { name: "Adaugă persoană" }).click();
  await expect(page.locator(".people-list li").filter({ hasText: name }).first()).toBeVisible();
}

test("assigns an owner-created executor and keeps attribution after complete", async ({
  page,
}) => {
  await openPeopleAdmin(page);
  if (await page.getByText("Nu există persoane active configurate.").isVisible()) {
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-people-empty.png",
      fullPage: true,
    });
  }

  await page.screenshot({
    path: "docs/worklog/screenshots/letters-people-add.png",
    fullPage: true,
  });
  await ensureNamedPerson(page, ACTIVE_NAME);
  await ensureNamedPerson(page, RETIRED_NAME);
  await expect(page.getByText(ACTIVE_NAME).first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-people-active.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-people.png",
    fullPage: true,
  });

  const retiredRow = page.locator(".people-list li").filter({ hasText: RETIRED_NAME }).first();
  if (await retiredRow.getByRole("button", { name: "Retrage persoana" }).isVisible()) {
    await retiredRow.getByRole("button", { name: "Retrage persoana" }).click();
  }
  await expect(page.getByRole("heading", { name: "Retrase" })).toBeVisible();
  await expect(page.getByText(RETIRED_NAME)).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-people-retired.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-people-retired.png",
    fullPage: true,
  });

  await confirmLetters(page);
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await expect(
    page.getByRole("heading", { name: "Acceptat pentru producție" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await openExecutionWorkspace(page);
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();

  const backCnc = taskCard(page, "Debitare foaie CNC", "Spate");
  const inspect = taskCard(page, "Control calitate final", "Produs");

  if (await backCnc.getByText("Alocare: Nealocat").isVisible()) {
    await backCnc.getByRole("button", { name: "Alocă", exact: true }).click();
  }
  await expect(backCnc.getByText("Alocat: CNC 4020")).toBeVisible();
  if (await backCnc.getByText("Executant: Nealocat").isVisible()) {
    await expect(backCnc.getByRole("button", { name: "Pornește" })).toHaveCount(0);
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-people-executor-missing.png",
      fullPage: true,
    });
    await expect(backCnc.getByRole("combobox", { name: "Executant" })).toContainText(ACTIVE_NAME);
    await expect(backCnc.getByRole("combobox", { name: "Executant" })).not.toContainText(
      RETIRED_NAME,
    );
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-people-executor-selector.png",
      fullPage: true,
    });
    await backCnc.getByRole("combobox", { name: "Executant" }).selectOption({
      label: ACTIVE_NAME,
    });
    await backCnc.getByRole("button", { name: "Alocă executant" }).click();
  }
  await expect(backCnc.getByText(`Executant: ${ACTIVE_NAME}`)).toBeVisible();
  if (await backCnc.getByText("Stare: Planificat").isVisible()) {
    await expect(backCnc.getByRole("button", { name: "Pornește" })).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-people-start-available.png",
      fullPage: true,
    });
    await backCnc.getByRole("button", { name: "Pornește" }).click();
    await expect(backCnc.getByText("Stare: În lucru")).toBeVisible();
  }
  if (await backCnc.getByRole("button", { name: "Finalizează" }).isVisible()) {
    await expect(backCnc.getByText("Stare: În lucru")).toBeVisible();
    await expect(backCnc.getByText(`Executant: ${ACTIVE_NAME}`)).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-people-in-progress.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "docs/worklog/screenshots/ui-execution-in-progress.png",
      fullPage: true,
    });
    await backCnc.getByLabel("Cantitate realizată").fill("12.5");
    await backCnc.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(backCnc.getByText("Stare: Finalizat")).toBeVisible({ timeout: 15000 });
  await expect(backCnc.getByText(`Executant: ${ACTIVE_NAME}`)).toBeVisible();
  await expect(page.getByText("Finalizat de utilizatorul autentificat")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-people-completed.png",
    fullPage: true,
  });

  await expect(inspect.getByText("Nu necesită echipament")).toBeVisible();
  await expect(inspect.getByRole("button", { name: "Alocă", exact: true })).toHaveCount(0);
  await expect(inspect.getByRole("button", { name: "Pornește" })).toHaveCount(0);
  if (await inspect.getByRole("button", { name: "Alocă executant" }).isVisible()) {
    await inspect.getByRole("combobox", { name: "Executant" }).selectOption({
      label: ACTIVE_NAME,
    });
    await inspect.getByRole("button", { name: "Alocă executant" }).click();
    await expect(inspect.getByText(`Executant: ${ACTIVE_NAME}`)).toBeVisible();
    await expect(inspect.getByRole("button", { name: "Pornește" })).toHaveCount(0);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(backCnc.getByText(`Executant: ${ACTIVE_NAME}`)).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-people-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-people-narrow.png",
    fullPage: true,
  });
});
