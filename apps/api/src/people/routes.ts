import type { PersonMutationError } from "@workos-final/domain";
import type { Hono } from "hono";
import type { ProductSystemRuntime } from "../productSystem/runtime.js";

export function registerPeopleRoutes(app: Hono, runtime: ProductSystemRuntime): void {
  app.get("/api/people", (c) => {
    return c.json({ people: runtime.listPeople() });
  });

  app.post("/api/people", async (c) => {
    const displayName = readDisplayName(await c.req.json().catch(() => null));
    if (displayName === null) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.createPerson(displayName);
    if (!result.ok) {
      return c.json({ error: result.error }, personHttpStatus(result.error));
    }
    return c.json({ person: result.person, people: runtime.listPeople() }, 201);
  });

  app.patch("/api/people/:personId", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const payload = body as { displayName?: unknown; status?: unknown };
    if (payload.status === "RETIRED") {
      const result = runtime.retirePerson(c.req.param("personId"));
      if (!result.ok) {
        return c.json({ error: result.error }, personHttpStatus(result.error));
      }
      return c.json({
        alreadyApplied: result.alreadyApplied,
        person: result.person,
        people: runtime.listPeople(),
      });
    }
    if (typeof payload.displayName !== "string") {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.renamePerson(c.req.param("personId"), payload.displayName);
    if (!result.ok) {
      return c.json({ error: result.error }, personHttpStatus(result.error));
    }
    return c.json({
      alreadyApplied: result.alreadyApplied,
      person: result.person,
      people: runtime.listPeople(),
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

function personHttpStatus(error: PersonMutationError): 400 | 404 {
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
