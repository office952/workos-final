import { expect, test } from "@playwright/test";

async function confirmLetters(page: import("@playwright/test").Page) {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}

function taskCard(
  page: import("@playwright/test").Page,
  processLabel: string,
  scopeLabel: string,
) {
  return page.locator(".execution-plan .production-op").filter({
    has: page.getByRole("heading", { name: new RegExp(`\\d+\\. ${processLabel}`) }),
  }).filter({
    hasText: `Componentă: ${scopeLabel}`,
  });
}

test("assigns a provider and starts/completes a LETTERS production task", async ({
  page,
}) => {
  await confirmLetters(page);
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await expect(
    page.getByRole("heading", { name: /Snapshot (producție creat|deja acceptat)/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  const plan = page.locator(".execution-plan");
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();

  const backCnc = taskCard(page, "Debitare foaie CNC", "Spate");
  const lighting = taskCard(page, "Montare module LED", "Iluminare");
  const assembly = taskCard(page, "Lipire față-volum", "Corp");
  const inspect = taskCard(page, "Control calitate final", "Produs");

  if (await backCnc.getByText("Alocare: Nealocat").isVisible()) {
    await expect(backCnc.getByRole("button", { name: "Pornește" })).toHaveCount(0);
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-task-unassigned.png",
      fullPage: true,
    });
    await expect(backCnc.getByRole("combobox", { name: "Alocare" })).toContainText("CNC 4020");
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-task-provider-selector.png",
      fullPage: true,
    });
    await backCnc.getByRole("button", { name: "Alocă" }).click();
  }
  await expect(backCnc.getByText("Alocat: CNC 4020")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-task-assigned.png",
    fullPage: true,
  });

  if (await lighting.getByText(/Așteaptă:/).isVisible()) {
    await expect(lighting.getByRole("button", { name: "Pornește" })).toHaveCount(0);
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-task-dependency-blocked.png",
      fullPage: true,
    });
  }

  if (await backCnc.getByRole("button", { name: "Pornește" }).isVisible()) {
    await backCnc.getByRole("button", { name: "Pornește" }).click();
  }
  if (await backCnc.getByRole("button", { name: "Finalizează" }).isVisible()) {
    await expect(backCnc.getByText("Stare: În lucru")).toBeVisible();
    await expect(backCnc.getByText(/Pornit la:/)).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-task-in-progress.png",
      fullPage: true,
    });
    await expect(backCnc.getByLabel("Cantitate realizată")).toHaveValue("12.5");
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-completion-form.png",
      fullPage: true,
    });
    await backCnc.getByRole("button", { name: "Finalizează" }).click();
    await expect(backCnc.getByText("Realizat: 12,5 m")).toBeVisible();
    await expect(backCnc.getByText("Conform planului")).toBeVisible();
  }

  await expect(backCnc.getByText("Stare: Finalizat")).toBeVisible();
  await expect(backCnc.getByText(/Finalizat la:/)).toBeVisible();
  await expect(backCnc.getByRole("button", { name: "Pornește" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-task-completed.png",
    fullPage: true,
  });

  await expect(lighting.getByText("Așteaptă:")).toHaveCount(0);
  if (await lighting.getByRole("button", { name: "Alocă" }).isVisible()) {
    await lighting.getByRole("combobox", { name: "Alocare" }).selectOption({
      label: "Montaj LED / electric",
    });
    await lighting.getByRole("button", { name: "Alocă" }).click();
  }
  await expect(lighting.getByText("Alocat: Montaj LED / electric")).toBeVisible();
  if (await lighting.getByText("Stare: Planificat").isVisible()) {
    await expect(lighting.getByRole("button", { name: "Pornește" })).toBeVisible();
  }
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-task-dependency-released.png",
    fullPage: true,
  });

  if (await assembly.getByRole("button", { name: "Alocă" }).isVisible()) {
    await expect(assembly.getByRole("combobox", { name: "Alocare" })).toContainText(
      "Masă asamblare 1",
    );
    await expect(assembly.getByRole("combobox", { name: "Alocare" })).toContainText(
      "Masă asamblare 2",
    );
    await assembly.getByRole("combobox", { name: "Alocare" }).selectOption({
      label: "Masă asamblare 2",
    });
    await assembly.getByRole("button", { name: "Alocă" }).click();
    await expect(assembly.getByText("Alocat: Masă asamblare 2")).toBeVisible();
  } else {
    await expect(assembly.getByText(/Alocat: Masă asamblare [12]/)).toBeVisible();
  }
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-task-assembly-providers.png",
    fullPage: true,
  });

  await expect(inspect.getByText("Fără furnizor disponibil")).toBeVisible();
  await expect(inspect.getByRole("button", { name: "Alocă" })).toHaveCount(0);
  await expect(inspect.getByRole("button", { name: "Pornește" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-task-no-provider.png",
    fullPage: true,
  });

  await expect(plan.getByText("Cost intern din snapshot: 595,00 EUR (parțial)")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await expect(page.getByText("Pontaj")).toHaveCount(0);
  await expect(page.getByText("Angajat")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(backCnc.getByText("Stare: Finalizat")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-task-execution-narrow.png",
    fullPage: true,
  });
});
