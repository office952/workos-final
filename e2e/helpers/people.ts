import { expect, type APIRequestContext, type Locator, type Page } from "@playwright/test";

export const TEST_EXECUTOR_NAME = "Executor test E2E";
export const TEST_OPERATOR_PIN = "246810";

const LETTERS_EXECUTION_SKILL_CODES = [
  "SK_CNC_OPERATOR",
  "SK_LETTER_CANT_OPERATOR",
  "SK_ASSEMBLY",
  "SK_VINYL_APPLICATOR",
  "SK_ELECTRICIAN",
] as const;

type PersonRecord = {
  personId: string;
  displayName: string;
  status: string;
};

type SkillRecord = {
  skillId: string;
  code: string;
};

export async function ensureTestExecutor(
  request: APIRequestContext,
  displayName = TEST_EXECUTOR_NAME,
): Promise<PersonRecord> {
  const listed = await request.get("/api/people");
  const body = (await listed.json()) as { people?: PersonRecord[] };
  const existing = (body.people ?? []).find(
    (person) => person.displayName === displayName && person.status === "ACTIVE",
  );
  const person = existing
    ? existing
    : ((await (
        await request.post("/api/people", {
          data: { displayName },
        })
      ).json()) as { person: PersonRecord }).person;
  await assignLettersExecutionSkills(request, person.personId);
  return person;
}

export async function assignLettersExecutionSkills(
  request: APIRequestContext,
  personId: string,
): Promise<void> {
  const listed = await request.get("/api/people/skills");
  expect(listed.ok()).toBeTruthy();
  const body = (await listed.json()) as { skills?: SkillRecord[] };
  const skills = body.skills ?? [];
  expect(skills.length).toBeGreaterThan(0);
  for (const code of LETTERS_EXECUTION_SKILL_CODES) {
    const skill = skills.find((item) => item.code === code);
    if (!skill) {
      continue;
    }
    const assigned = await request.post(`/api/people/${personId}/skills`, {
      data: { skillId: skill.skillId },
    });
    expect(assigned.ok() || assigned.status() === 409).toBeTruthy();
  }
}

export async function assignExecutorIfNeeded(card: Locator, personName = TEST_EXECUTOR_NAME) {
  const assign = card.getByRole("button", { name: "Alocă executant" });
  if (!(await assign.isVisible())) {
    return;
  }
  await card.getByRole("combobox", { name: "Executant" }).selectOption({
    label: personName,
  });
  await assign.click();
  await expect(card.getByText(`Executant: ${personName}`)).toBeVisible();
}

export async function identifyTestExecutorViaApi(
  request: APIRequestContext,
  personId: string,
  pin = TEST_OPERATOR_PIN,
) {
  await configureTestExecutorPin(request, personId, pin);
  const identified = await request.post("/api/operator-session", {
    data: { personId, pin },
  });
  expect(identified.ok()).toBeTruthy();
}

export async function configureTestExecutorPin(
  request: APIRequestContext,
  personId: string,
  pin = TEST_OPERATOR_PIN,
) {
  const configured = await request.put(
    `/api/people/${encodeURIComponent(personId)}/operator-pin`,
    { data: { pin, confirmPin: pin } },
  );
  expect(configured.ok()).toBeTruthy();
}

export async function identifyTestExecutorOnPage(
  page: Page,
  displayName = TEST_EXECUTOR_NAME,
  pin = TEST_OPERATOR_PIN,
) {
  if (await page.getByRole("button", { name: "Ieși" }).isVisible()) {
    return;
  }
  const pagePin = page.locator("form.operator-identify-form").getByLabel("PIN");
  if (await pagePin.count()) {
    await page.locator("form.operator-identify-form").getByLabel("Persoană").selectOption({
      label: displayName,
    });
    await pagePin.fill(pin);
    await page.locator("form.operator-identify-form").getByRole("button", { name: "Confirmă" }).click();
    await expect(page.getByRole("button", { name: "Ieși" })).toBeVisible();
    return;
  }
  await page.getByRole("button", { name: "Identifică-te" }).click();
  await page.getByLabel("Persoană").selectOption({ label: displayName });
  await page.getByRole("textbox", { name: "PIN" }).fill(pin);
  await page.getByRole("button", { name: "Confirmă" }).click();
  await expect(page.getByRole("button", { name: "Ieși" })).toBeVisible();
}

export async function assignProviderIfNeeded(card: Locator, providerLabel?: string) {
  const assign = card.getByRole("button", { name: "Alocă utilaj", exact: true });
  if (!(await assign.isVisible())) {
    return;
  }
  if (providerLabel) {
    await card.getByRole("combobox", { name: "Utilaj dedicat" }).selectOption({
      label: providerLabel,
    });
  }
  await assign.click();
  await expect(card.getByText(/Alocat:/)).toBeVisible();
}

export async function openPeopleAdmin(page: Page) {
  await page.goto("/admin");
  await page.getByRole("link", { name: "Oameni" }).click();
  await expect(page.getByRole("heading", { name: "Oameni" })).toBeVisible();
}
