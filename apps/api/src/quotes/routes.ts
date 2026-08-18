import type { Hono } from "hono";
import { getProductSystem, type ApiEnv } from "../cloud/context.js";

export function registerQuoteRoutes(app: Hono<ApiEnv>): void {
  app.get("/api/quotes", (c) => {
    const runtime = getProductSystem(c);
    return c.json({ overview: runtime.listQuoteOverview() });
  });
}
