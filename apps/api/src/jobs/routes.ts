import type { Hono } from "hono";
import type { ProductSystemRuntime } from "../productSystem/runtime.js";

export function registerJobRoutes(app: Hono, runtime: ProductSystemRuntime): void {
  app.get("/api/jobs", (c) => {
    return c.json({ overview: runtime.listJobOverview() });
  });
}
