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

export async function confirmCanonicalLettersOnPage(
  page: Page,
  inscription: string,
) {
  await page.getByLabel("Textul literelor").fill(inscription);
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
}
