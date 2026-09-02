import { describe, expect, it } from "vitest";
import {
  calendarDateOrderIsValid,
  parseCanonicalCalendarDate,
} from "./calendarDate.js";

describe("canonical calendar dates", () => {
  it("accepts a real YYYY-MM-DD date", () => {
    expect(parseCanonicalCalendarDate("2026-02-28")).toEqual({
      ok: true,
      date: "2026-02-28",
    });
  });

  it("rejects impossible and malformed dates without normalizing them", () => {
    expect(parseCanonicalCalendarDate("2026-02-30")).toEqual({ ok: false });
    expect(parseCanonicalCalendarDate("2026-13-01")).toEqual({ ok: false });
    expect(parseCanonicalCalendarDate("abcd-01-01")).toEqual({ ok: false });
    expect(parseCanonicalCalendarDate("2026-02-28T00:00:00.000Z")).toEqual({
      ok: false,
    });
  });

  it("requires validFrom to be on or before validUntil", () => {
    expect(calendarDateOrderIsValid("2026-01-01", "2026-12-31")).toBe(true);
    expect(calendarDateOrderIsValid("2026-12-31", "2026-01-01")).toBe(false);
    expect(calendarDateOrderIsValid(null, "2026-01-01")).toBe(true);
  });
});
