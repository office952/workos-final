import { describe, expect, it } from "vitest";
import {
  NAVIGATION_CATEGORY_LABELS,
  NAVIGATION_DESTINATION_IDS,
  NAVIGATION_DESTINATIONS,
  destinationAccessibleName,
  findActiveDestination,
  isOperationalOperatorRoute,
} from "./navigationRegistry";

const CANONICAL_ORDER = [
  "home",
  "clients",
  "requests",
  "quotes",
  "catalog",
  "jobs",
  "atelier",
  "costs",
  "stock",
  "machines",
  "suppliers",
  "purchasing",
  "people",
  "attendance",
  "payments",
  "firm",
  "policies",
  "operational-services",
  "product-system",
  "governance",
] as const;

describe("navigationRegistry", () => {
  it("contains exactly 20 target destinations in canonical order", () => {
    expect(NAVIGATION_DESTINATIONS.map((item) => item.id)).toEqual([...CANONICAL_ORDER]);
    expect(NAVIGATION_DESTINATION_IDS).toEqual(CANONICAL_ORDER);
    expect(NAVIGATION_DESTINATIONS).toHaveLength(20);
  });

  it("gives every page a Lucide icon name and every category a label without an icon", () => {
    for (const destination of NAVIGATION_DESTINATIONS) {
      expect(destination.icon.length).toBeGreaterThan(0);
      expect(NAVIGATION_CATEGORY_LABELS[destination.category]).toMatch(/^[A-ZĂÂÎȘȚ]/);
    }
  });

  it("maps object deep links to the parent page", () => {
    expect(findActiveDestination({ pathname: "/clients/cus:1", search: "" })?.id).toBe("clients");
    expect(findActiveDestination({ pathname: "/requests/crq:1", search: "" })?.id).toBe("requests");
    expect(
      findActiveDestination({
        pathname: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        search: "?request=crq:1",
      })?.id,
    ).toBe("requests");
    expect(
      findActiveDestination({
        pathname: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        search: "?quote=qts:1",
      })?.id,
    ).toBe("quotes");
    expect(
      findActiveDestination({
        pathname: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        search: "?order=ord:1",
      })?.id,
    ).toBe("jobs");
    expect(
      findActiveDestination({
        pathname: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        search: "",
      })?.id,
    ).toBe("catalog");
    expect(findActiveDestination({ pathname: "/", search: "" })?.id).toBe("jobs");
    expect(findActiveDestination({ pathname: "/jobs", search: "" })?.id).toBe("jobs");
    expect(findActiveDestination({ pathname: "/jobs/ord:1", search: "" })?.id).toBe("jobs");
    expect(findActiveDestination({ pathname: "/execution/exp:1", search: "" })?.id).toBe("atelier");
    expect(findActiveDestination({ pathname: "/admin/stock/res:1", search: "" })?.id).toBe("stock");
    expect(findActiveDestination({ pathname: "/admin/people/skills", search: "" })?.id).toBe(
      "people",
    );
    expect(findActiveDestination({ pathname: "/components", search: "" })?.id).toBe(
      "product-system",
    );
    expect(findActiveDestination({ pathname: "/system", search: "" })?.id).toBe("governance");
    expect(findActiveDestination({ pathname: "/admin/processes", search: "" })).toBeNull();
  });

  it("treats only Atelier and Execution as interactive operator routes", () => {
    expect(isOperationalOperatorRoute("/atelier")).toBe(true);
    expect(isOperationalOperatorRoute("/execution/exp:1")).toBe(true);
    expect(isOperationalOperatorRoute("/clients")).toBe(false);
    expect(isOperationalOperatorRoute("/clients/cus:1")).toBe(false);
    expect(isOperationalOperatorRoute("/requests")).toBe(false);
    expect(isOperationalOperatorRoute("/quotes")).toBe(false);
    expect(isOperationalOperatorRoute("/")).toBe(false);
    expect(isOperationalOperatorRoute("/jobs/ord:1")).toBe(false);
    expect(isOperationalOperatorRoute("/products")).toBe(false);
    expect(isOperationalOperatorRoute("/admin")).toBe(false);
    expect(isOperationalOperatorRoute("/admin/resources")).toBe(false);
    expect(isOperationalOperatorRoute("/governance")).toBe(false);
  });

  it("builds collapsed accessible names as Categorie — Pagină", () => {
    const governance = NAVIGATION_DESTINATIONS.find((item) => item.id === "governance");
    expect(governance).toBeDefined();
    expect(destinationAccessibleName(governance!)).toBe("Administrare — Guvernanță");
  });
});
