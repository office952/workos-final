import type { Hono } from "hono";
import type { ProductSystemRuntime } from "../productSystem/runtime.js";

export function registerQuoteRoutes(app: Hono, runtime: ProductSystemRuntime): void {
  app.get("/api/quotes", (c) => {
    return c.json({ overview: runtime.listQuoteOverview() });
  });
}
