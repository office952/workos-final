import { randomBytes } from "node:crypto";
import type { APIRequestContext } from "@playwright/test";
import { CANONICAL_PRODUCT_CODE } from "./jobs";

const readyValues = {
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

type JsonObject = Record<string, unknown>;

export type CreatedQuote = {
  inscription: string;
  quoteSnapshotId: string;
  productCode: string;
  orderSnapshotId?: string;
};

export function uniqueQuoteInscription(prefix: string) {
  return `${prefix}${randomBytes(2).toString("hex")}`.toUpperCase();
}

async function readJson(response: { json: () => Promise<unknown> }): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

export async function createCommercialQuote(
  request: APIRequestContext,
  inscription: string,
): Promise<CreatedQuote> {
  const compiled = await request.post(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
    data: { values: { ...readyValues, "root.inscription": inscription } },
  });
  const compiledBody = await readJson(compiled);
  const customer = await request.post("/api/customers", {
    data: { displayName: `Client ${inscription}` },
  });
  const customerId = ((await readJson(customer)).customer as JsonObject).customerId as string;
  const quote = await request.post(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
    data: {
      definition: compiledBody.definition,
      reviewId: compiledBody.reviewId,
      customerId,
    },
  });
  const quoteSnapshot = (await readJson(quote)).quoteSnapshot as JsonObject;
  return {
    inscription,
    quoteSnapshotId: quoteSnapshot.quoteSnapshotId as string,
    productCode: quoteSnapshot.productCode as string,
  };
}

export async function acceptCommercialQuote(
  request: APIRequestContext,
  quote: CreatedQuote,
): Promise<CreatedQuote> {
  await request.post(
    `/api/products/${quote.productCode}/quote-snapshots/${quote.quoteSnapshotId}/acceptance`,
  );
  return quote;
}

export async function createOrderFromQuote(
  request: APIRequestContext,
  quote: CreatedQuote,
): Promise<CreatedQuote> {
  const order = await request.post(
    `/api/products/${quote.productCode}/quote-snapshots/${quote.quoteSnapshotId}/order`,
  );
  const orderSnapshot = (await readJson(order)).orderSnapshot as JsonObject;
  return {
    ...quote,
    orderSnapshotId: orderSnapshot.orderSnapshotId as string,
  };
}
