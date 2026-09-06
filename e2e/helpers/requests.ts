import { randomBytes } from "node:crypto";
import type { APIRequestContext, Page } from "@playwright/test";

export const CANONICAL_LETTERS_PRODUCT_CODE = "PRD-LETTERS-FRONTLIT-PLEXI-AL06";

type JsonObject = Record<string, unknown>;

export function uniqueRequestToken(prefix: string) {
  return `${prefix}${randomBytes(2).toString("hex")}`.toUpperCase();
}

async function readJson(response: { json: () => Promise<unknown> }): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

export async function listRequestOverview(request: APIRequestContext) {
  const response = await request.get("/api/requests");
  const body = await readJson(response);
  return {
    ok: response.ok(),
    overview: body.overview as JsonObject,
  };
}

export async function createNamedCustomer(request: APIRequestContext, displayName: string) {
  const response = await request.post("/api/customers", { data: { displayName } });
  const body = await readJson(response);
  return {
    ok: response.ok(),
    customerId: (body.customer as JsonObject | undefined)?.customerId as string | undefined,
    displayName,
  };
}

export async function createNamedRequest(
  request: APIRequestContext,
  input: { customerId: string; title: string; description?: string },
) {
  const response = await request.post("/api/requests", {
    data: {
      customerId: input.customerId,
      title: input.title,
      description: input.description ?? "Descriere pentru verificarea cererii.",
    },
  });
  const body = await readJson(response);
  return {
    ok: response.ok(),
    requestId: (body.request as JsonObject | undefined)?.requestId as string | undefined,
    title: input.title,
  };
}

export async function updateRequestStatus(
  request: APIRequestContext,
  requestId: string,
  status: string,
) {
  const response = await request.patch(`/api/requests/${encodeURIComponent(requestId)}`, {
    data: { status },
  });
  return { ok: response.ok() };
}

export async function createRequestNeedingAction(
  request: APIRequestContext,
  customerId: string,
  title: string,
  description = "Cerere sintetică pentru atenție de birou.",
) {
  const created = await createNamedRequest(request, { customerId, title, description });
  if (!created.ok || !created.requestId) {
    return created;
  }
  const patched = await updateRequestStatus(request, created.requestId, "READY_FOR_QUOTE");
  return { ...created, ok: patched.ok };
}

export function overviewRequestByTitle(overview: JsonObject, title: string) {
  const requests = (overview.requests as Array<JsonObject> | undefined) ?? [];
  return requests.find((item) => item.title === title) ?? null;
}

export async function configureCanonicalLettersForRequest(page: Page, requestId: string) {
  await page.goto(`/products?request=${encodeURIComponent(requestId)}`);
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
}

export async function selectConstructionNode(page: Page, name: string | RegExp) {
  const tab = page.getByRole("tab", { name });
  if ((await tab.count()) > 0) {
    await tab.click();
  }
}

export async function fillCanonicalLettersConfiguration(
  page: Page,
  inscription: string,
  options?: {
    depth?: string;
    faceFinish?: string;
    volumeFinish?: string;
    area?: string;
    perimeter?: string;
  },
) {
  await selectConstructionNode(page, /^Produs/);
  await page.getByLabel("Textul literelor").fill(inscription);
  await selectConstructionNode(page, /^Față/);
  await page.getByLabel("Finisaj față").selectOption(options?.faceFinish ?? "none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill(options?.area ?? "250000");
  await selectConstructionNode(page, /^Volum/);
  await page.getByLabel("Adâncime volum (mm)").selectOption(options?.depth ?? "60");
  await page.getByLabel("Finisaj volum").selectOption(options?.volumeFinish ?? "none");
  await page.getByLabel("Perimetru confirmat (mm)").fill(options?.perimeter ?? "12500");
}

export async function confirmCanonicalLettersOnPage(
  page: Page,
  inscription: string,
) {
  await fillCanonicalLettersConfiguration(page, inscription);
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
}
