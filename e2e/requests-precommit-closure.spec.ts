import { expect, test } from "./fixtures";
import { CANONICAL_PRODUCT_CODE } from "./helpers/jobs";
import {
  createNamedCustomer,
  createNamedRequest,
  listRequestOverview,
  overviewRequestByTitle,
  uniqueRequestToken,
  updateRequestStatus,
} from "./helpers/requests";

type JsonObject = Record<string, unknown>;

async function readJson(response: { json: () => Promise<unknown> }): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

async function freezeQuoteForCustomer(
  request: import("@playwright/test").APIRequestContext,
  customerId: string,
  inscription: string,
) {
  const compiled = await request.post(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
    data: {
      values: {
        "face.finish": "none",
        "face.confirmedAreaMm2": 250000,
        "volume.depthMm": "60",
        "volume.finish": "none",
        "volume.confirmedPerimeterMm": 12500,
        "root.inscription": inscription,
      },
    },
  });
  expect(compiled.ok()).toBeTruthy();
  const compiledBody = await readJson(compiled);
  const quote = await request.post(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
    data: {
      definition: compiledBody.definition,
      reviewId: compiledBody.reviewId,
      customerId,
    },
  });
  expect(quote.ok()).toBeTruthy();
  return ((await readJson(quote)).quoteSnapshot as JsonObject).quoteSnapshotId as string;
}

function requestRow(page: import("@playwright/test").Page, title: string) {
  return page.locator(".requests-list li").filter({ hasText: title });
}

test("attention law, createdAt sort, registry back and Hub lock stay closed", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("ATT");
  const customer = await createNamedCustomer(request, `Client ${token}`);
  expect(customer.ok).toBeTruthy();
  if (!customer.customerId) {
    throw new Error("customer_missing");
  }

  const blocked = await createNamedRequest(request, {
    customerId: customer.customerId,
    title: `Blocat ${token}`,
  });
  expect(blocked.ok).toBeTruthy();
  if (!blocked.requestId) {
    throw new Error("blocked_missing");
  }
  expect((await updateRequestStatus(request, blocked.requestId, "BLOCKED")).ok).toBeTruthy();

  const waiting = await createNamedRequest(request, {
    customerId: customer.customerId,
    title: `Așteaptă ${token}`,
  });
  expect(waiting.ok).toBeTruthy();
  if (!waiting.requestId) {
    throw new Error("waiting_missing");
  }
  expect((await updateRequestStatus(request, waiting.requestId, "WAITING_CUSTOMER")).ok).toBeTruthy();

  const ready = await createNamedRequest(request, {
    customerId: customer.customerId,
    title: `Gata ${token}`,
  });
  expect(ready.ok).toBeTruthy();
  if (!ready.requestId) {
    throw new Error("ready_missing");
  }
  expect((await updateRequestStatus(request, ready.requestId, "READY_FOR_QUOTE")).ok).toBeTruthy();

  const fresh = await createNamedRequest(request, {
    customerId: customer.customerId,
    title: `Nouă ${token}`,
  });
  expect(fresh.ok).toBeTruthy();
  if (!fresh.requestId) {
    throw new Error("fresh_missing");
  }

  const linked = await createNamedRequest(request, {
    customerId: customer.customerId,
    title: `Legată ${token}`,
  });
  expect(linked.ok).toBeTruthy();
  if (!linked.requestId) {
    throw new Error("linked_missing");
  }
  expect((await updateRequestStatus(request, linked.requestId, "READY_FOR_QUOTE")).ok).toBeTruthy();
  const quoteSnapshotId = await freezeQuoteForCustomer(request, customer.customerId, token.slice(0, 8));
  const linkedQuote = await request.post(
    `/api/requests/${encodeURIComponent(linked.requestId)}/quotes`,
    { data: { quoteSnapshotId } },
  );
  expect(linkedQuote.ok()).toBeTruthy();

  const overview = await listRequestOverview(request);
  const projected = {
    blocked: overviewRequestByTitle(overview.overview, blocked.title),
    waiting: overviewRequestByTitle(overview.overview, waiting.title),
    ready: overviewRequestByTitle(overview.overview, ready.title),
    fresh: overviewRequestByTitle(overview.overview, fresh.title),
    linked: overviewRequestByTitle(overview.overview, linked.title),
  };
  expect(projected.blocked).toMatchObject({
    needsAttention: true,
    attentionLabel: "Blocat",
  });
  expect(projected.ready).toMatchObject({
    needsAttention: true,
    attentionLabel: "Urmează oferta",
  });
  expect(projected.fresh).toMatchObject({
    needsAttention: false,
    attentionLabel: null,
  });
  expect(projected.waiting).toMatchObject({
    needsAttention: false,
    attentionLabel: null,
  });
  expect(projected.linked).toMatchObject({
    needsAttention: false,
    attentionLabel: null,
  });

  const titles = ((overview.overview.requests as Array<JsonObject>) ?? [])
    .map((item) => item.title as string)
    .filter((title) => title.includes(token));
  expect(titles[0]).toBe(linked.title);
  expect(titles[titles.length - 1]).toBe(blocked.title);

  await page.goto("/requests");
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await page.getByLabel("Caută cerere").fill(token);
  await expect(requestRow(page, fresh.title)).toBeVisible();
  await expect(requestRow(page, fresh.title)).not.toContainText("De preluat");
  await expect(requestRow(page, fresh.title).locator("a.registry-row")).not.toHaveClass(
    /is-attention/,
  );
  await expect(requestRow(page, waiting.title).locator("a.registry-row")).not.toHaveClass(
    /is-attention/,
  );
  await expect(requestRow(page, ready.title)).toContainText("Urmează oferta");
  await expect(requestRow(page, ready.title).locator("a.registry-row")).toHaveClass(/is-attention/);
  await expect(requestRow(page, blocked.title)).toContainText("Blocat");
  await expect(requestRow(page, linked.title)).not.toContainText("Urmează oferta");
  await expect(requestRow(page, linked.title).locator("a.registry-row")).not.toHaveClass(
    /is-attention/,
  );

  const listed = page.locator(".requests-list li");
  const firstTitle = await listed.first().locator(".registry-row-name").innerText();
  const lastTitle = await listed.last().locator(".registry-row-name").innerText();
  expect(firstTitle).toBe(linked.title);
  expect(lastTitle).toBe(blocked.title);

  await page.getByRole("button", { name: "Necesită atenție" }).click();
  await expect(requestRow(page, ready.title)).toBeVisible();
  await expect(requestRow(page, blocked.title)).toBeVisible();
  await expect(requestRow(page, fresh.title)).toHaveCount(0);
  await expect(requestRow(page, waiting.title)).toHaveCount(0);
  await expect(requestRow(page, linked.title)).toHaveCount(0);

  await page.getByRole("button", { name: "Necesită atenție" }).click();
  await requestRow(page, fresh.title).getByRole("link", { name: fresh.title }).click();
  await expect(page.getByRole("heading", { name: fresh.title })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toBeVisible();
  await page.getByRole("link", { name: "Înapoi la Cereri" }).click();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expect(requestRow(page, fresh.title)).toBeVisible();

  const hub = await createNamedCustomer(request, `Hub ${token}`);
  expect(hub.ok).toBeTruthy();
  if (!hub.customerId) {
    throw new Error("hub_customer_missing");
  }
  await page.goto(`/requests?customer=${encodeURIComponent(hub.customerId)}`);
  const createForm = page.locator("form.people-create");
  await expect(page.getByRole("dialog", { name: "Cerere nouă" })).toBeVisible();
  await expect(createForm.getByRole("combobox", { name: "Client" })).toBeDisabled();
  await expect(createForm.getByRole("button", { name: "Clientul nu e în listă" })).toHaveCount(0);
});
