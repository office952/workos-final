import {
  projectOperationalProcessesAdministration,
  projectResourcesAdministration,
  projectSystemGovernance,
  projectWorkcentersAdministration,
} from "@workos-final/domain";
import type { Hono } from "hono";
import { getProductSystem, type ApiEnv } from "./cloud/context.js";
import { requireOwnerRole } from "./cloud/middleware.js";

export function registerSystemProjectionRoutes(app: Hono<ApiEnv>): void {
  app.get("/api/components", (c) => {
    const runtime = getProductSystem(c);
    return c.json({ roles: runtime.present().components });
  });

  app.get("/api/product-system-admin", (c) => {
    const runtime = getProductSystem(c);
    return c.json(runtime.present().admin);
  });

  app.get("/api/resources-admin", (c) => {
    const runtime = getProductSystem(c);
    return c.json(projectResourcesAdministration(runtime.listActiveCostEvidence()));
  });

  app.patch(
    "/api/resources-admin/cost-evidence/:evidenceRowId",
    requireOwnerRole(),
    async (c) => {
      const runtime = getProductSystem(c);
      const body = (await c.req.json().catch(() => null)) as {
        amount?: unknown;
        note?: unknown;
      } | null;
      const result = runtime.supersedeCostEvidence(
        c.req.param("evidenceRowId"),
        body?.amount,
        body?.note,
      );
      if (!result.ok) {
        switch (result.error) {
          case "invalid_amount":
          case "invalid_note":
            return c.json({ error: result.error }, 400);
          case "unknown_resource":
          case "not_found":
            return c.json({ error: result.error }, 404);
          case "stale_cost_evidence":
            return c.json({ error: result.error }, 409);
          default: {
            const _exhaustive: never = result.error;
            return c.json({ error: _exhaustive }, 500);
          }
        }
      }
      return c.json({
        evidence: result.evidence,
        admin: projectResourcesAdministration(runtime.listActiveCostEvidence()),
      });
    },
  );

  app.get("/api/operational-processes", (c) => {
    const runtime = getProductSystem(c);
    return c.json(
      projectOperationalProcessesAdministration(
        runtime.listActiveCostEvidence(),
        runtime.providerRegistry,
      ),
    );
  });

  app.get("/api/workcenters", (c) => {
    const runtime = getProductSystem(c);
    return c.json(
      projectWorkcentersAdministration(
        runtime.providerRegistry,
        runtime.listActiveCostEvidence(),
      ),
    );
  });

  app.get("/api/governance", (c) => {
    return c.json(projectSystemGovernance());
  });
}
