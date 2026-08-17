import { expect, type APIRequestContext, type Page } from "@playwright/test";

type CustomerRecord = {
  customerId: string;
  displayName: string;
  status: string;
};

export async function createCustomer(
  request: APIRequestContext,
  displayName: string,
): Promise<CustomerRecord> {
  const created = await request.post("/api/customers", {
    data: { displayName },
  });
  const body = (await created.json()) as { customer: CustomerRecord };
  return body.customer;
}

export async function selectOrCreateCustomer(page: Page, displayName: string) {
  const quote = page.locator(".quote-section");
  const select = quote.getByRole("combobox", { name: "Client" });
  await expect(select).toBeVisible();
  const option = select.locator("option", { hasText: displayName });
  if ((await option.count()) > 0) {
    await select.selectOption({ label: displayName });
    return;
  }
  await quote.getByRole("textbox", { name: "Nume client" }).fill(displayName);
  await quote.getByRole("button", { name: "Adaugă client" }).click();
  await expect(select).not.toHaveValue("");
  await expect(select.locator("option:checked")).toHaveText(displayName);
}
