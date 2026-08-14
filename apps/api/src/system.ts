import { projectSystemGovernance } from "@workos-final/domain";
import type { Hono } from "hono";
import type { ProductSystemRuntime } from "./productSystem/runtime.js";

export function registerSystemProjectionRoutes(
  app: Hono,
  runtime: ProductSystemRuntime,
): void {
  app.get("/api/components", (c) => {
    return c.json({ roles: runtime.present().components });
  });

  app.get("/api/product-system-admin", (c) => {
    return c.json(runtime.present().admin);
  });

  app.get("/api/governance", (c) => {
    return c.json(projectSystemGovernance());
  });
}
