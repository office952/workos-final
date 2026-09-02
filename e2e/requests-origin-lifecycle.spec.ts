import { expect, test } from "./fixtures";
import {
  createNamedCustomer,
  createNamedRequest,
  createRequestNeedingAction,
  uniqueRequestToken,
} from "./helpers/requests";

function requestObjectPath(requestId: string) {
  return `/requests/${encodeURIComponent(requestId)}`;
}

test("hub origin does not survive a later direct visit", async ({ page, request }) => {
  const token = uniqueRequestToken("HUBO");
  const customerName = `Client ${token}`;
  const title = `Fațadă ${token}`;
  const customer = await createNamedCustomer(request, customerName);
  expect(customer.ok).toBeTruthy();
  if (!customer.customerId) {
    throw new Error("customer_missing");
  }

  await page.goto(`/clients/${encodeURIComponent(customer.customerId)}`);
  await expect(page.getByRole("heading", { name: customerName })).toBeVisible();
  await page.getByRole("link", { name: "Cerere nouă" }).click();
  await expect(page.getByRole("dialog", { name: "Cerere nouă" })).toBeVisible();
  const createForm = page.locator("form.people-create");
  await expect(createForm.getByRole("combobox", { name: "Client" })).toBeDisabled();
  await expect(createForm.getByRole("combobox", { name: "Client" })).not.toHaveValue("");
  await createForm.getByLabel("Titlu").fill(title);
  await createForm.getByLabel("Descriere").fill(
    "Clientul sună pentru litere luminoase pe fațadă, text scurt, adâncime 60 mm.",
  );
  await createForm.getByRole("button", { name: "Creează cererea" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  const requestUrl = page.url();
  expect(requestUrl).toMatch(/\/requests\/crq/);
  const requestId = decodeURIComponent(new URL(requestUrl).pathname.split("/").pop() ?? "");
  await expect(page.getByRole("link", { name: `Înapoi la ${customerName}` })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toHaveCount(0);

  await page.goBack();
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByRole("link", { name: `Înapoi la ${customerName}` })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toHaveCount(0);

  await page.getByRole("link", { name: `Înapoi la ${customerName}` }).click();
  await expect(page).toHaveURL(/\/clients\/cus.*[?&]section=cereri/);
  await expect(page.getByRole("heading", { name: customerName })).toBeVisible();

  await page.goto(requestObjectPath(requestId));
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toBeVisible();
  await expect(page.getByRole("link", { name: `Înapoi la ${customerName}` })).toHaveCount(0);
});

test("registry origin does not survive a later direct visit", async ({ page, request }) => {
  const token = uniqueRequestToken("REGO");
  const customer = await createNamedCustomer(request, `Client ${token}`);
  expect(customer.ok).toBeTruthy();
  if (!customer.customerId) {
    throw new Error("customer_missing");
  }
  const created = await createRequestNeedingAction(request, customer.customerId, `Gata ${token}`);
  expect(created.ok).toBeTruthy();
  if (!created.requestId) {
    throw new Error("request_missing");
  }

  const registrySearch = `?q=${encodeURIComponent(token)}&status=ready&attention=1`;
  await page.goto(`/requests${registrySearch}`);
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expect(page.getByLabel("Caută cerere")).toHaveValue(token);
  await expect(page.getByRole("button", { name: "Necesită atenție" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const row = page.locator(".requests-list li").filter({ hasText: created.title });
  await expect(row).toBeVisible();
  await row.getByRole("link", { name: created.title }).click();
  await expect(page.getByRole("heading", { name: created.title })).toBeVisible();
  const registryBack = page.getByRole("link", { name: "Înapoi la Cereri" });
  await expect(registryBack).toBeVisible();
  await expect(registryBack).toHaveAttribute("href", `/requests${registrySearch}`);

  await registryBack.click();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/requests");
  expect(new URL(page.url()).search).toBe(registrySearch);
  await expect(row).toBeVisible();

  await page.goto(requestObjectPath(created.requestId));
  await expect(page.getByRole("heading", { name: created.title })).toBeVisible();
  const freshBack = page.getByRole("link", { name: "Înapoi la Cereri" });
  await expect(freshBack).toBeVisible();
  await expect(freshBack).toHaveAttribute("href", "/requests");
  await freshBack.click();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/requests");
  expect(new URL(page.url()).search).toBe("");
  await expect(page.getByLabel("Caută cerere")).toHaveValue("");
});

test("downstream product exit does not resurrect origin", async ({ page, request }) => {
  const token = uniqueRequestToken("DSTO");
  const customer = await createNamedCustomer(request, `Client ${token}`);
  expect(customer.ok).toBeTruthy();
  if (!customer.customerId) {
    throw new Error("customer_missing");
  }
  const created = await createNamedRequest(request, {
    customerId: customer.customerId,
    title: `Produs ${token}`,
  });
  expect(created.ok).toBeTruthy();
  if (!created.requestId) {
    throw new Error("request_missing");
  }

  const registrySearch = `?q=${encodeURIComponent(token)}`;
  await page.goto(`/requests${registrySearch}`);
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await page.locator(".requests-list li").filter({ hasText: created.title }).getByRole("link", {
    name: created.title,
  }).click();
  await expect(page.getByRole("heading", { name: created.title })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toHaveAttribute(
    "href",
    `/requests${registrySearch}`,
  );
  await page.getByRole("link", { name: "Alege produs" }).click();
  await expect(page).toHaveURL(new RegExp(`/products\\?request=${encodeURIComponent(created.requestId)}`));

  await page.goto(requestObjectPath(created.requestId));
  await expect(page.getByRole("heading", { name: created.title })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toHaveAttribute(
    "href",
    "/requests",
  );
});

test("browser forward keeps the history-entry registry origin", async ({ page, request }) => {
  const token = uniqueRequestToken("FWD");
  const customer = await createNamedCustomer(request, `Client ${token}`);
  expect(customer.ok).toBeTruthy();
  if (!customer.customerId) {
    throw new Error("customer_missing");
  }
  const created = await createNamedRequest(request, {
    customerId: customer.customerId,
    title: `Istoric ${token}`,
  });
  expect(created.ok).toBeTruthy();
  if (!created.requestId) {
    throw new Error("request_missing");
  }

  const registrySearch = `?q=${encodeURIComponent(token)}`;
  await page.goto(`/requests${registrySearch}`);
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await page.locator(".requests-list li").filter({ hasText: created.title }).getByRole("link", {
    name: created.title,
  }).click();
  await expect(page.getByRole("heading", { name: created.title })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toHaveAttribute(
    "href",
    `/requests${registrySearch}`,
  );

  await page.goBack();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/requests");
  expect(new URL(page.url()).search).toBe(registrySearch);

  await page.goForward();
  await expect(page.getByRole("heading", { name: created.title })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toHaveAttribute(
    "href",
    `/requests${registrySearch}`,
  );
});
