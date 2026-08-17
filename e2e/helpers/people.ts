import { expect, type APIRequestContext, type Locator, type Page } from "@playwright/test";

export const TEST_EXECUTOR_NAME = "Executor test E2E";

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

export async function assignProviderIfNeeded(card: Locator, providerLabel?: string) {
  const assign = card.getByRole("button", { name: "Alocă", exact: true });
  if (!(await assign.isVisible())) {
    return;
  }
  if (providerLabel) {
    await card.getByRole("combobox", { name: "Echipament / zonă" }).selectOption({
      label: providerLabel,
    });
  }
  await assign.click();
  await expect(card.getByText(/Alocat:/)).toBeVisible();
}

export async function openPeopleAdmin(page: Page) {
  await page.goto("/admin");
  await page.getByRole("link", { name: "Persoane" }).click();
  await expect(page.getByRole("heading", { name: "Oameni" })).toBeVisible();
}
