import type { SellerMutationError, SellerProfileInput } from "@workos-final/domain";
import type { Hono } from "hono";
import type { ProductSystemRuntime } from "../productSystem/runtime.js";

export function registerSellerRoutes(app: Hono, runtime: ProductSystemRuntime): void {
  app.get("/api/seller", (c) => {
    return c.json({ seller: runtime.getSellerProfile() });
  });

  app.patch("/api/seller", async (c) => {
    const input = readSellerInput(await c.req.json().catch(() => null));
    if (!input) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.updateSellerProfile(input);
    if (!result.ok) {
      return c.json({ error: result.error }, sellerHttpStatus(result.error));
    }
    return c.json({
      alreadyApplied: result.alreadyApplied,
      seller: result.profile,
    });
  });
}

function readSellerInput(body: unknown): SellerProfileInput | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }
  const payload = body as Record<string, unknown>;
  const legalName = payload.legalName;
  if (typeof legalName !== "string") {
    return null;
  }
  return {
    legalName,
    brand: readOptionalString(payload.brand),
    fiscalId: readOptionalString(payload.fiscalId),
    tradeRegister: readOptionalString(payload.tradeRegister),
    address: readOptionalString(payload.address),
    locality: readOptionalString(payload.locality),
    iban: readOptionalString(payload.iban),
    bank: readOptionalString(payload.bank),
  };
}

function readOptionalString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function sellerHttpStatus(error: SellerMutationError): 400 | 404 {
  switch (error) {
    case "invalid_profile":
      return 400;
    case "not_found":
      return 404;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
