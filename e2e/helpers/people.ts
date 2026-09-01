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

async function completeOperatorIdentifyForm(
  page: Page,
  displayName: string,
  pin: string,
) {
  const dialog = page.getByRole("dialog", { name: "Identifică operatorul" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Persoană").selectOption({ label: displayName });
  await dialog.getByRole("textbox", { name: "PIN" }).fill(pin);
  await dialog.getByRole("button", { name: "Confirmă" }).click();
  await expect(dialog).toBeHidden();
}

async function identifyOperatorFromPageRequest(
  page: Page,
  displayName: string,
  pin: string,
) {
  const listed = await page.request.get("/api/people");
  expect(listed.ok()).toBeTruthy();
  const body = (await listed.json()) as { people?: PersonRecord[] };
  const person = (body.people ?? []).find(
    (item) => item.displayName === displayName && item.status === "ACTIVE",
  );
  expect(person).toBeTruthy();
  if (!person) {
    return;
  }
  const identified = await page.request.post("/api/operator-session", {
    data: { personId: person.personId, pin },
  });
  expect(identified.ok()).toBeTruthy();
}

async function operatorAlreadyIdentified(page: Page): Promise<boolean> {
  if (await page.getByRole("button", { name: "Ieși" }).isVisible()) {
    return true;
  }
  const chip = page.getByLabel("Operator curent");
  if ((await chip.count()) === 0) {
    return false;
  }
  return (await chip.locator("strong").count()) > 0;
}

async function settleOperatorChrome(page: Page) {
  await expect(page.getByText("Se verifică operatorul…")).toHaveCount(0);
}

export async function identifyTestExecutorOnPage(
  page: Page,
  displayName = TEST_EXECUTOR_NAME,
  pin = TEST_OPERATOR_PIN,
) {
  await settleOperatorChrome(page);
  if (await operatorAlreadyIdentified(page)) {
    return;
  }
  const pageForm = page.locator("form.operator-identify-form");
  const pagePin = pageForm.getByRole("textbox", { name: "PIN" });
  if (await pagePin.count()) {
    await pageForm.getByLabel("Persoană").selectOption({
      label: displayName,
    });
    await pagePin.fill(pin);
    await pageForm.getByRole("button", { name: "Confirmă" }).click();
    await expect(page.getByRole("button", { name: "Ieși" })).toBeVisible();
    return;
  }
  const identify = page.getByRole("button", { name: "Identifică-te" });
  if (await identify.isVisible()) {
    await identify.click();
    await completeOperatorIdentifyForm(page, displayName, pin);
    await expect(page.getByRole("button", { name: "Ieși" })).toBeVisible();
    return;
  }
  await identifyOperatorFromPageRequest(page, displayName, pin);
}

export async function assignProviderIfNeeded(card: Locator, providerLabel?: string) {
  const assign = card.getByRole("button", { name: "Alocă utilaj", exact: true });
  if ((await assign.count()) === 0) {
    return;
  }
  await expect(assign).toBeVisible();
  if (providerLabel) {
    await card.getByRole("combobox", { name: "Utilaj dedicat" }).selectOption({
      label: providerLabel,
    });
  }
  await assign.click();
  await expect(card.getByText(providerLabel ? `Alocat: ${providerLabel}` : /Alocat:/)).toBeVisible();
}

export async function openPeopleAdmin(page: Page) {
  await page.goto("/admin/people");
  await expect(page.getByRole("heading", { name: "Oameni" })).toBeVisible();
}
