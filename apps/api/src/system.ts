import {
  projectComponentArchitecture,
  projectProductSystemAdministration,
  projectSystemGovernance,
} from "@workos-final/domain";
import type { Hono } from "hono";

export function registerSystemProjectionRoutes(app: Hono): void {
  app.get("/api/components", (c) => {
    return c.json({ roles: projectComponentArchitecture() });
  });

  app.get("/api/product-system-admin", (c) => {
    return c.json(projectProductSystemAdministration());
  });

  app.get("/api/governance", (c) => {
    return c.json(projectSystemGovernance());
  });
}
