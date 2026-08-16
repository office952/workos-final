import { describe, expect, it } from "vitest";
import {
  createPerson,
  generatePersonId,
  renamePerson,
  retirePerson,
} from "./identity.js";

describe("operational person identity", () => {
  it("creates an ACTIVE person with a stable generated id", () => {
    const created = createPerson("Maria Ionescu", {
      createdAt: "2026-08-16T17:00:00.000Z",
    });
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }
    expect(created.person.personId.startsWith("per:")).toBe(true);
    expect(created.person.displayName).toBe("Maria Ionescu");
    expect(created.person.status).toBe("ACTIVE");
    expect(created.person.retiredAt).toBeNull();
    expect(created.person.personId).not.toBe("Maria Ionescu");
  });

  it("keeps personId when the display name changes", () => {
    const created = createPerson("Maria Ionescu", {
      personId: "per:test-stable",
    });
    if (!created.ok) {
      throw new Error("expected person");
    }
    const renamed = renamePerson(created.person, "Maria I.");
    expect(renamed).toEqual({
      ok: true,
      alreadyApplied: false,
      person: {
        ...created.person,
        displayName: "Maria I.",
      },
    });
    expect(generatePersonId().startsWith("per:")).toBe(true);
  });

  it("retires a person without deleting identity", () => {
    const created = createPerson("Executor test");
    if (!created.ok) {
      throw new Error("expected person");
    }
    const retired = retirePerson(created.person, "2026-08-16T17:10:00.000Z");
    expect(retired.ok).toBe(true);
    if (!retired.ok) {
      return;
    }
    expect(retired.person.personId).toBe(created.person.personId);
    expect(retired.person.status).toBe("RETIRED");
    expect(retired.person.retiredAt).toBe("2026-08-16T17:10:00.000Z");
    expect(retirePerson(retired.person, "2026-08-16T18:00:00.000Z")).toEqual({
      ok: true,
      alreadyApplied: true,
      person: retired.person,
    });
  });

  it("rejects an empty or oversized name", () => {
    expect(createPerson("   ")).toEqual({ ok: false, error: "invalid_name" });
    expect(createPerson("x".repeat(81))).toEqual({ ok: false, error: "invalid_name" });
  });
});
