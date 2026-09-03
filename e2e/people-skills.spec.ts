import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { uniqueRequestToken } from "./helpers/requests";
import { openPeopleAdmin } from "./helpers/people";

test("configures people, skills and current CNC eligibility", async ({ page }) => {
  const name = `Mihai Skills ${uniqueRequestToken("SK")}`;

  await openPeopleAdmin(page);
  await expect(page.getByText("Florin CNC")).toBeVisible();
  await expect(page.getByText("Chirila Cristian")).toBeVisible();
  await expect(page.getByLabel("Salariu")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/people-overview.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Calificări" }).click();
  await expect(page.getByRole("heading", { name: "Calificări" })).toBeVisible();
  await expect(page.locator(".people-list").getByText("CNC", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/skill-catalog.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Listă" }).click();
  await page.locator(".people-create").getByLabel("Nume").fill(name);
  await page.getByRole("button", { name: "Adaugă persoană" }).click();
  const row = page.locator(".requests-list li").filter({ hasText: name }).first();
  await expect(row).toBeVisible();
  await row.getByRole("link", { name: "Deschide" }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
  await page.getByLabel("Adaugă skill").selectOption({ label: "CNC (SK_CNC_OPERATOR)" });
  await page.getByRole("button", { name: "Adaugă skill" }).click();
  await expect(assignedOperatorSkill(page, "CNC")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/person-skills.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Calificări" }).click();
  await page.getByLabel("Capabilitate cerută").selectOption("CNC_ROUTING");
  await page.getByRole("button", { name: "Arată eligibilii" }).click();
  const eligible = page.locator(".people-skill-list");
  await expect(eligible.getByText("Florin CNC")).toBeVisible();
  await expect(eligible.getByText("Andrei Goghi")).toBeVisible();
  await expect(eligible.getByText(name)).toBeVisible();
  await expect(eligible.getByText("Chirila Cristian")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/eligibility-before.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Listă" }).click();
  await page.locator(".requests-list li").filter({ hasText: name }).getByRole("link", { name: "Deschide" }).click();
  await page.getByLabel("Motiv").fill("Concediu");
  await page.getByRole("button", { name: "Marchează indisponibil temporar" }).click();
  await expect(page.getByText("Indisponibil temporar")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/person-temporarily-unavailable.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Calificări" }).click();
  await page.getByLabel("Capabilitate cerută").selectOption("CNC_ROUTING");
  await page.getByRole("button", { name: "Arată eligibilii" }).click();
  await expect(page.locator(".people-skill-list").getByText(name)).toHaveCount(0);
  await expect(page.locator(".people-skill-list").getByText("Florin CNC")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/eligibility-after-unavailable.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Listă" }).click();
  await page.locator(".requests-list li").filter({ hasText: name }).getByRole("link", { name: "Deschide" }).click();
  await page.getByRole("button", { name: "Revino disponibil" }).click();
  await expect(page.getByText("Disponibil").first()).toBeVisible();

  await page.getByRole("link", { name: "Calificări" }).click();
  await page.getByRole("button", { name: "Arată eligibilii" }).click();
  await expect(page.locator(".people-skill-list").getByText(name)).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/new-employee-eligible.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Listă" }).click();
  await expect(page.getByText(name)).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByText("Florin CNC")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/people-narrow.png",
    fullPage: true,
  });
});

function assignedOperatorSkill(page: Page, label: string) {
  return page
    .locator("article.client-current-card")
    .filter({ has: page.getByRole("heading", { name: "Calificări", exact: true }) })
    .locator("ul.people-skill-list > li")
    .filter({
      has: page.getByRole("button", { name: "Elimină din eligibilitatea curentă" }),
    })
    .filter({
      has: page.locator(`xpath=./span[normalize-space(text())=${JSON.stringify(label)}]`),
    });
}
