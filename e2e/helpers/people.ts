import { expect, type APIRequestContext, type Locator, type Page } from "@playwright/test";

export const TEST_EXECUTOR_NAME = "Executor test E2E";

type PersonRecord = {
  personId: string;
  displayName: string;
  status: string;
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
  if (existing) {
    return existing;
  }
  const created = await request.post("/api/people", {
    data: { displayName },
  });
  const createdBody = (await created.json()) as { person: PersonRecord };
  return createdBody.person;
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
    await card.getByRole("combobox", { name: "Alocare" }).selectOption({
      label: providerLabel,
    });
  }
  await assign.click();
  await expect(card.getByText(/Alocat:/)).toBeVisible();
}

export async function openPeopleAdmin(page: Page) {
  await page.goto("/admin");
  await page.getByRole("link", { name: "Persoane" }).click();
  await expect(page.getByRole("heading", { name: "Persoane" })).toBeVisible();
}
