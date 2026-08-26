import { expect, test } from "./fixtures";
import {
  createCommercialOrder,
  createCommercialPlan,
  releaseCommercialOrder,
  uniqueJobInscription,
} from "./helpers/jobs";
import {
  assignLettersExecutionSkills,
  configureTestExecutorPin,
  ensureTestExecutor,
  identifyTestExecutorOnPage,
  TEST_EXECUTOR_NAME,
} from "./helpers/people";

const shot = (name: string) => `docs/worklog/screenshots/hf-wave3-${name}.png`;
const financialKeys = ["internalCost", "markupPercent", "marginAmount", "eicTotal", "grossPrice"];

test("cloud missing-config stays distinct from a wrong password", async ({ page }) => {
  let releaseSession: (() => void) | null = null;
  const held = new Promise<void>((resolve) => {
    releaseSession = resolve;
  });
  await page.route("**/api/cloud/session", async (route) => {
    await held;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        mode: "cloud",
        authConfigured: false,
        user: null,
        organization: null,
        memberships: [],
      }),
    });
  });
  const navigation = page.goto("/atelier");
  await expect(page.getByRole("heading", { name: "Se încarcă" })).toBeVisible();
  await page.screenshot({ path: shot("cloud-loading"), fullPage: true });
  releaseSession?.();
  await navigation;
  await expect(page.getByRole("heading", { name: "Autentificare indisponibilă" })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveCount(0);
  await page.screenshot({ path: shot("auth-config-missing"), fullPage: true });
});

test("atelier execution and planned versus actual stay workshop-safe", async ({
  page,
  request,
}) => {
  test.setTimeout(90_000);
  const inscription = uniqueJobInscription("W3");
  const person = await ensureTestExecutor(request);
  await assignLettersExecutionSkills(request, person.personId);
  await configureTestExecutorPin(request, person.personId);
  const ineligible = await request.post("/api/people", {
    data: { displayName: `Operator neeligibil ${inscription}` },
  });
  expect(ineligible.ok()).toBeTruthy();
  const ineligibleId = ((await ineligible.json()) as { person: { personId: string } }).person
    .personId;
  await configureTestExecutorPin(request, ineligibleId);

  const job = await createCommercialPlan(
    request,
    await releaseCommercialOrder(request, await createCommercialOrder(request, inscription)),
  );
  expect(job.planId).toBeTruthy();
  const plan = (await (await request.get(`/api/execution-plans/${job.planId}`)).json()) as {
    executionPlan: { tasks: Array<{ taskId: string; processLabel: string; scopeLabel: string }> };
  };
  const back = plan.executionPlan.tasks.find(
    (task) => task.processLabel === "Debitare foaie CNC" && task.scopeLabel === "Spate",
  );
  expect(back).toBeTruthy();
  await request.post(`/api/execution-tasks/${back?.taskId}/provider`, {
    data: { providerId: "MCH-CNC-4020" },
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Autentificare" })).toHaveCount(0);

  await page.goto("/atelier");
  await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
  await page.screenshot({ path: shot("atelier-unidentified"), fullPage: true });
  const pinField = page.locator("form.operator-identify-form").getByLabel("PIN");
  await expect(pinField).toHaveAttribute("type", "password");
  await page.locator("form.operator-identify-form").getByLabel("Persoană").selectOption({
    label: TEST_EXECUTOR_NAME,
  });
  await pinField.fill("0000");
  await page.screenshot({ path: shot("pin-masked"), fullPage: true });
  await page.locator("form.operator-identify-form").getByRole("button", { name: "Confirmă" }).click();
  await expect(page.getByRole("alert")).toHaveText("PIN greșit.");
  await expect(page.getByText("0000")).toHaveCount(0);
  await page.screenshot({ path: shot("pin-invalid"), fullPage: true });

  await identifyTestExecutorOnPage(page);
  await expect(page.getByRole("heading", { name: "Blocate" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pot porni acum" })).toBeVisible();
  const laneHeadings = await page.locator(".atelier-lane h2").allTextContents();
  expect(laneHeadings[0]).toBe("Blocate");
  await expect(page.getByText("Necesită utilaj dedicat înainte de pornire.").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Pornește" }).first()).toBeVisible();
  await page.screenshot({ path: shot("atelier-populated"), fullPage: true });
  await page.screenshot({ path: shot("task-startable"), fullPage: true });
  await page.screenshot({ path: shot("machine-blocked"), fullPage: true });

  await page.getByRole("button", { name: "Schimbă" }).click();
  const drawer = page.getByRole("dialog", { name: "Identifică operatorul" });
  await drawer.getByLabel("Persoană").selectOption({ label: `Operator neeligibil ${inscription}` });
  await drawer.getByLabel("PIN").fill("246810");
  await drawer.getByRole("button", { name: "Confirmă" }).click();
  await expect(page.getByRole("button", { name: "Pornește" })).toHaveCount(0);
  await page.screenshot({ path: shot("operator-ineligible"), fullPage: true });
  await page.getByRole("button", { name: "Ieși" }).click();
  await expect(page.locator("form.operator-identify-form").getByLabel("PIN")).toBeVisible();
  await identifyTestExecutorOnPage(page);
  await expect(page.getByRole("button", { name: "Pornește" }).first()).toBeVisible();

  const startButton = page.getByRole("button", { name: "Pornește" }).first();
  await startButton.click();
  await expect(page.getByRole("link", { name: "Continuă" })).toBeVisible();

  await page
    .getByRole("listitem")
    .filter({ hasText: inscription })
    .getByRole("link", { name: "Continuă" })
    .click();
  await expect(page).toHaveURL(/\/execution\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la lucrare" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Planificat versus realizat" })).toBeVisible();
  await expect(page.getByText("Necunoscut").first()).toBeVisible();
  for (const key of financialKeys) {
    await expect(page.locator("body")).not.toContainText(key);
  }
  await expect(page.getByText(/Cost intern/)).toHaveCount(0);
  const planPayload = await request.get(`/api/execution-plans/${job.planId}`);
  const planText = await planPayload.text();
  for (const key of financialKeys) {
    expect(planText).not.toContain(key);
  }
  await page.screenshot({ path: shot("execution-blocked"), fullPage: true });
  await page.screenshot({ path: shot("pva"), fullPage: true });

  await page.goto(`/execution/${encodeURIComponent(job.planId ?? "")}`);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await expect(page.getByText("Stare: În lucru").first()).toBeVisible();
  await page.screenshot({ path: shot("execution-in-progress"), fullPage: true });

  const complete = page.getByRole("button", { name: "Finalizează" }).first();
  if (await complete.isVisible()) {
    await complete.click();
    await expect(page.getByText("Finalizat").first()).toBeVisible();
    await page.screenshot({ path: shot("completed"), fullPage: true });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: shot("1440-execution"), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: shot("1280-execution"), fullPage: true });
  await page.goto("/atelier");
  await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: shot("768-atelier"), fullPage: true });
  await page.getByRole("button", { name: "Întunecată" }).click();
  await page.screenshot({ path: shot("dark-atelier"), fullPage: true });
  await page.getByRole("button", { name: "Deschisă" }).click();
  await page.screenshot({ path: shot("light-atelier"), fullPage: true });
});
