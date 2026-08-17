import type { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { ProductSystemRuntime } from "../productSystem/runtime.js";
import { OPERATOR_SESSION_COOKIE } from "./store.js";

const SESSION_MAX_AGE_SEC = 12 * 60 * 60;

export function registerOperatorRoutes(app: Hono, runtime: ProductSystemRuntime): void {
  app.get("/api/operator-candidates", (c) => {
    return c.json({ candidates: runtime.listOperatorCandidates() });
  });

  app.get("/api/operator-session", (c) => {
    const resolved = runtime.resolveOperatorSession(getCookie(c, OPERATOR_SESSION_COOKIE));
    if (!resolved.ok) {
      return c.json({ operator: null, session: null });
    }
    return c.json({
      operator: {
        personId: resolved.person.personId,
        displayName: resolved.person.displayName,
        availability: resolved.person.availability,
      },
      session: {
        sessionId: resolved.session.sessionId,
        expiresAt: resolved.session.expiresAt,
      },
    });
  });

  app.post("/api/operator-session", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (typeof body !== "object" || body === null) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const personId =
      typeof (body as { personId?: unknown }).personId === "string"
        ? (body as { personId: string }).personId.trim()
        : "";
    const pin =
      typeof (body as { pin?: unknown }).pin === "string"
        ? (body as { pin: string }).pin
        : "";
    if (!personId || !pin) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = await runtime.identifyOperator(personId, pin);
    if (!result.ok) {
      return c.json({ error: result.error }, operatorHttpStatus(result.error));
    }
    setCookie(c, OPERATOR_SESSION_COOKIE, result.rawToken, {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
      maxAge: SESSION_MAX_AGE_SEC,
    });
    return c.json({
      operator: {
        personId: result.person.personId,
        displayName: result.person.displayName,
        availability: result.person.availability,
      },
      session: {
        sessionId: result.session.sessionId,
        expiresAt: result.session.expiresAt,
      },
    });
  });

  app.delete("/api/operator-session", (c) => {
    runtime.logoutOperatorSession(getCookie(c, OPERATOR_SESSION_COOKIE));
    deleteCookie(c, OPERATOR_SESSION_COOKIE, { path: "/" });
    return c.json({ ok: true });
  });

  app.get("/api/operator-task-inbox", (c) => {
    const resolved = runtime.resolveOperatorSession(getCookie(c, OPERATOR_SESSION_COOKIE));
    if (!resolved.ok) {
      return c.json({ operator: null, inbox: null });
    }
    const inbox = runtime.getOperatorTaskInbox(resolved.person.personId);
    if (!inbox) {
      return c.json({ operator: null, inbox: null });
    }
    return c.json({
      operator: {
        personId: inbox.operator.personId,
        displayName: inbox.operator.displayName,
        availability: inbox.operator.availability,
      },
      inbox,
    });
  });

  app.put("/api/people/:personId/operator-pin", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (typeof body !== "object" || body === null) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const pin =
      typeof (body as { pin?: unknown }).pin === "string" ? (body as { pin: string }).pin : "";
    const confirmPin =
      typeof (body as { confirmPin?: unknown }).confirmPin === "string"
        ? (body as { confirmPin: string }).confirmPin
        : "";
    const result = await runtime.setOperatorPin(c.req.param("personId"), pin, confirmPin);
    if (!result.ok) {
      return c.json({ error: result.error }, operatorHttpStatus(result.error));
    }
    return c.json({
      configured: true,
      personId: c.req.param("personId"),
    });
  });
}

function operatorHttpStatus(error: string): 400 | 401 | 404 | 409 | 429 {
  switch (error) {
    case "invalid_pin":
    case "pin_mismatch":
    case "not_configured":
      return 400;
    case "invalid_session":
    case "expired_session":
    case "revoked_session":
      return 401;
    case "unknown_person":
      return 404;
    case "retired_person":
      return 409;
    case "rate_limited":
      return 429;
    default:
      return 400;
  }
}
