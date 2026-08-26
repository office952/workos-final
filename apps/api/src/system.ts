import {
  omitForbiddenFinancialFields,
  projectOperationalProcessesAdministration,
  projectResourcesAdministration,
  projectSystemGovernance,
  projectWorkcentersAdministration,
} from "@workos-final/domain";
import type { Hono } from "hono";
import { getProductSystem, isOwner, type ApiEnv } from "./cloud/context.js";
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
    const projection = projectResourcesAdministration(runtime.listActiveCostEvidence());
    if (isOwner(c)) {
      return c.json(projection);
    }
    return c.json(omitResourceCostAmounts(projection));
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
    const projection = projectOperationalProcessesAdministration(
      runtime.listActiveCostEvidence(),
      runtime.providerRegistry,
    );
    if (isOwner(c)) {
      return c.json(projection);
    }
    return c.json(omitForbiddenFinancialFields(projection, "commercial"));
  });

  app.get("/api/workcenters", (c) => {
    const runtime = getProductSystem(c);
    const projection = projectWorkcentersAdministration(
      runtime.providerRegistry,
      runtime.listActiveCostEvidence(),
    );
    if (isOwner(c)) {
      return c.json(projection);
    }
    return c.json(omitForbiddenFinancialFields(projection, "commercial"));
  });

  app.get("/api/governance", (c) => {
    return c.json(projectSystemGovernance());
  });
}

function omitResourceCostAmounts(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(omitResourceCostAmounts);
  }
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      if (
        key === "amount" ||
        key === "amountDisplay" ||
        key === "rate" ||
        key === "cost" ||
        key === "activeAmount" ||
        key === "unitAmount"
      ) {
        continue;
      }
      next[key] = omitResourceCostAmounts(child);
    }
    return next;
  }
  return value;
}
