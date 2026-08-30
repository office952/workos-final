import { describe, expect, it } from "vitest";
import { NAVIGATION_DESTINATIONS } from "./navigationRegistry";
import {
  DEFAULT_NAVIGATION_VISIBILITY,
  hiddenNotImplementedDestinations,
  resolveVisibleDestinations,
  visibleMenuSignature,
} from "./visibleNavigation";

describe("visibleNavigation", () => {
  it("hides destinations that are not implemented", () => {
    const visible = resolveVisibleDestinations(DEFAULT_NAVIGATION_VISIBILITY);
    expect(visible.map((item) => item.id)).toEqual([
      "clients",
      "requests",
      "quotes",
      "catalog",
      "jobs",
      "atelier",
      "costs",
      "stock",
      "machines",
      "people",
      "firm",
      "operational-services",
      "product-system",
      "governance",
    ]);
    expect(hiddenNotImplementedDestinations().map((item) => item.label)).toEqual([
      "Acasă",
      "Furnizori",
      "Achiziții",
      "Pontaj",
      "Plăți și avansuri",
      "Politici",
    ]);
    expect(visible.every((item) => item.href)).toBe(true);
  });

  it("does not hide implemented destinations by role or capability in this wave", () => {
    const owner = resolveVisibleDestinations({
      mode: "cloud",
      role: "owner",
      organizationId: "org:1",
    });
    const member = resolveVisibleDestinations({
      mode: "cloud",
      role: "member",
      organizationId: "org:1",
    });
    expect(visibleMenuSignature(owner)).toBe(visibleMenuSignature(member));
    expect(visibleMenuSignature(owner)).toBe(
      visibleMenuSignature(resolveVisibleDestinations(DEFAULT_NAVIGATION_VISIBILITY)),
    );
  });

  it("can hide a destination by capability without changing registry order", () => {
    const withCapability = NAVIGATION_DESTINATIONS.map((item) =>
      item.id === "operational-services"
        ? { ...item, requiredCapability: "SITE_INSTALLATION" }
        : item,
    );
    const hidden = resolveVisibleDestinations(
      { ...DEFAULT_NAVIGATION_VISIBILITY, capabilities: new Set() },
      withCapability,
    );
    const shown = resolveVisibleDestinations(
      {
        ...DEFAULT_NAVIGATION_VISIBILITY,
        capabilities: new Set(["SITE_INSTALLATION"]),
      },
      withCapability,
    );
    expect(hidden.some((item) => item.id === "operational-services")).toBe(false);
    expect(shown.some((item) => item.id === "operational-services")).toBe(true);
    expect(shown.map((item) => item.id)).toEqual([
      ...hidden.map((item) => item.id).slice(0, 11),
      "operational-services",
      ...hidden.map((item) => item.id).slice(11),
    ]);
  });
});
