import type { CustomerMutationError } from "@workos-final/domain";
import type { Hono } from "hono";
import type { ProductSystemRuntime } from "../productSystem/runtime.js";

export function registerCustomerRoutes(app: Hono, runtime: ProductSystemRuntime): void {
  app.get("/api/customers", (c) => {
    return c.json({ customers: runtime.listCustomers() });
  });

  app.post("/api/customers", async (c) => {
    const displayName = readDisplayName(await c.req.json().catch(() => null));
    if (displayName === null) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.createCustomer(displayName);
    if (!result.ok) {
      return c.json({ error: result.error }, customerHttpStatus(result.error));
    }
    return c.json({ customer: result.customer, customers: runtime.listCustomers() }, 201);
  });

  app.patch("/api/customers/:customerId", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const payload = body as { displayName?: unknown; status?: unknown };
    if (payload.status === "RETIRED") {
      const result = runtime.retireCustomer(c.req.param("customerId"));
      if (!result.ok) {
        return c.json({ error: result.error }, customerHttpStatus(result.error));
      }
      return c.json({
        alreadyApplied: result.alreadyApplied,
        customer: result.customer,
        customers: runtime.listCustomers(),
      });
    }
    if (typeof payload.displayName !== "string") {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.renameCustomer(c.req.param("customerId"), payload.displayName);
    if (!result.ok) {
      return c.json({ error: result.error }, customerHttpStatus(result.error));
    }
    return c.json({
      alreadyApplied: result.alreadyApplied,
      customer: result.customer,
      customers: runtime.listCustomers(),
    });
  });
}

function readDisplayName(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("displayName" in body)) {
    return null;
  }
  const value = (body as { displayName: unknown }).displayName;
  return typeof value === "string" ? value : null;
}

function customerHttpStatus(error: CustomerMutationError): 400 | 404 {
  switch (error) {
    case "invalid_name":
      return 400;
    case "not_found":
    case "already_retired":
      return 404;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
