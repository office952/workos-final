import { describe, expect, it } from "vitest";
import { appLocation, appPathname, decodeRouteSegment, pathIdAfter } from "./routePath";

describe("routePath", () => {
  it("reads encoded and raw colon identities after a prefix", () => {
    expect(
      pathIdAfter(
        "/quotes/qts%3APRD-LETTERS-FRONTLIT-PLEXI-AL06%3Aabc",
        "/quotes/",
      ),
    ).toBe("qts:PRD-LETTERS-FRONTLIT-PLEXI-AL06:abc");
    expect(pathIdAfter("/requests/crq:11111111-2222-3333-4444-555555555555", "/requests/")).toBe(
      "crq:11111111-2222-3333-4444-555555555555",
    );
    expect(pathIdAfter("/jobs", "/jobs/")).toBe("");
  });

  it("keeps navigate/Link targets as pathname objects", () => {
    expect(appPathname("/quotes/qts%3Aabc")).toEqual({ pathname: "/quotes/qts%3Aabc" });
    expect(decodeRouteSegment("qts%3Aabc")).toBe("qts:abc");
    expect(appLocation("/execution/exp:aps:hash?task=task%3A1")).toEqual({
      pathname: "/execution/exp:aps:hash",
      search: "?task=task%3A1",
    });
  });
});
