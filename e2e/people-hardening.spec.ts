import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { APIRequestContext, Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { openExecutionWorkspace } from "./helpers/execution";
import {
  assignLettersExecutionSkills,
  assignProviderIfNeeded,
  openPeopleAdmin,
} from "./helpers/people";
import { uniqueRequestToken } from "./helpers/requests";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const HARDENING_PERSON_PATH = join(process.cwd(), ".tmp", "hardening-person.json");

function taskCard(page: Page, processLabel: string, scopeLabel: string) {
  return page.locator(".execution-plan .production-op").filter({
    has: page.getByRole("heading", { name: new RegExp(`\\d+\\. ${processLabel}`) }),
  }).filter({
    hasText: `Componentă: ${scopeLabel}`,
  });
}

test("removed skill stays removed and planned start revalidates availability", async ({
  page,
  request,
}) => {
  const removedName = `Mihai Hardening ${uniqueRequestToken("HR")}`;
  const startName = `Mihai Start ${uniqueRequestToken("ST")}`;

  await openPeopleAdmin(page);
  await page.locator(".people-create").getByLabel("Nume").fill(removedName);
  await page.getByRole("button", { name: "Adaugă persoană" }).click();
  const removedRow = page.locator(".people-list li").filter({ hasText: removedName }).first();
  await expect(removedRow).toBeVisible();
  await removedRow.getByRole("link", { name: "Deschide" }).click();
  await page.getByLabel("Adaugă skill").selectOption({ label: "CNC (SK_CNC_OPERATOR)" });
  await page.getByRole("button", { name: "Adaugă skill" }).click();
  await expect(page.locator(".people-skill-list").getByText("CNC")).toBeVisible();
  await page.getByRole("button", { name: "Elimină din eligibilitatea curentă" }).click();
  await expect(page.locator(".people-skill-list").getByText("CNC")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/people-skill-removal-before-restart.png",
    fullPage: true,
  });
  mkdirSync(dirname(HARDENING_PERSON_PATH), { recursive: true });
  writeFileSync(
    HARDENING_PERSON_PATH,
    JSON.stringify({ href: new URL(page.url()).pathname, name: removedName }),
  );

  await page.goto("/admin/people");
  await page.locator(".people-create").getByLabel("Nume").fill(startName);
  await page.getByRole("button", { name: "Adaugă persoană" }).click();
  const listed = await request.get("/api/people");
  const people = ((await listed.json()) as { people?: Array<{ personId: string; displayName: string }> })
    .people ?? [];
  const startPerson = people.find((item) => item.displayName === startName);
  expect(startPerson).toBeTruthy();
  if (startPerson) {
    await assignLettersExecutionSkills(request, startPerson.personId);
  }

  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("HARD");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await openExecutionWorkspace(page);
  const executionUrl = page.url();

  const backCnc = taskCard(page, "Debitare foaie CNC", "Spate");
  await assignProviderIfNeeded(backCnc, "CNC 4020");
  await expect(backCnc.getByText("Alocat: CNC 4020")).toBeVisible();
  await backCnc.getByRole("combobox", { name: "Executant" }).selectOption({ label: startName });
  await backCnc.getByRole("button", { name: "Alocă executant" }).click();
  await expect(backCnc.getByText(`Executant: ${startName}`)).toBeVisible();
  const planId = new URL(executionUrl).pathname.split("/").pop();
  expect(planId).toBeTruthy();
  if (!startPerson || !planId) {
    return;
  }

  await page.goto(`/admin/people/${encodeURIComponent(startPerson.personId)}`);
  await expect(page.getByRole("heading", { name: startName })).toBeVisible();
  await page.getByLabel("Motiv").fill("Concediu");
  await page.getByRole("button", { name: "Marchează indisponibil temporar" }).click();
  await expect(page.getByText("Indisponibil temporar", { exact: true })).toBeVisible();
  const unavailable = await request.get(`/api/people/${encodeURIComponent(startPerson.personId)}`);
  expect(((await unavailable.json()) as { person?: { availability?: string } }).person?.availability).toBe(
    "TEMPORARILY_UNAVAILABLE",
  );
  await expect
    .poll(async () => {
      const task = await readBackCnc(request, planId);
      return { canStart: task?.canStart ?? null, reason: task?.startBlockReason ?? null };
    })
    .toEqual({ canStart: false, reason: "unavailable_person" });
  const startRejected = await request.post(
    `/api/execution-tasks/${(await readBackCnc(request, planId))?.taskId}/start`,
  );
  expect(startRejected.status()).toBe(422);
  expect(((await startRejected.json()) as { error?: string }).error).toBe("unavailable_person");

  await page.goto(executionUrl);
  await expect(backCnc.getByText(`Executant: ${startName}`)).toBeVisible();
  await expect(backCnc.getByRole("button", { name: "Pornește" })).toHaveCount(0);
  await expect(
    backCnc.getByText("Persoana alocată este indisponibilă temporar. Startul este blocat."),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/execution-start-blocked-unavailable.png",
    fullPage: true,
  });

  await page.goto(`/admin/people/${encodeURIComponent(startPerson.personId)}`);
  await page.getByRole("button", { name: "Revino disponibil" }).click();
  await expect(page.getByText("Disponibil", { exact: true }).first()).toBeVisible();
  await expect
    .poll(async () => (await readBackCnc(request, planId))?.canStart ?? false)
    .toBe(true);
  await page.goto(executionUrl);
  await expect(backCnc.getByRole("button", { name: "Pornește" })).toBeVisible();
});

async function readBackCnc(request: APIRequestContext, planId: string) {
  const body = (await (await request.get(`/api/execution-plans/${planId}`)).json()) as {
    executionPlan?: {
      tasks?: Array<{
        taskId: string;
        processLabel: string;
        scopeLabel: string;
        canStart: boolean;
        startBlockReason: string | null;
      }>;
    };
  };
  return (
    body.executionPlan?.tasks?.find(
      (item) => item.processLabel === "Debitare foaie CNC" && item.scopeLabel === "Spate",
    ) ?? null
  );
}
