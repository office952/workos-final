import type { Hono } from "hono";
import { getProductSystem, type ApiEnv } from "../cloud/context.js";

export function registerJobRoutes(app: Hono<ApiEnv>): void {
  app.get("/api/jobs", (c) => {
    const runtime = getProductSystem(c);
    return c.json({ overview: runtime.listJobOverview() });
  });
}
