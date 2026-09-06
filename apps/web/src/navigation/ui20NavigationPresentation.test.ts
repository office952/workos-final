import { describe, expect, it } from "vitest";
import { NAVIGATION_DESTINATIONS } from "./navigationRegistry";
import {
  buildUi20PresentationModel,
  resolveActiveSlot,
} from "./ui20NavigationPresentation";

const implemented = NAVIGATION_DESTINATIONS.filter(
  (destination) => destination.availability === "implemented" && destination.href,
);

describe("ui20NavigationPresentation", () => {
  it("hides Acasă while not implemented and places Cereri as L1 not under Comercial", () => {
    const model = buildUi20PresentationModel(implemented, { pathname: "/requests", search: "" });
    expect(model.home).toBeNull();
    expect(model.requests?.destination.id).toBe("requests");
    expect(model.commercial.map((item) => item.destination.id)).toEqual([
      "clients",
      "quotes",
      "catalog",
    ]);
    expect(model.activeSlot).toBe("requests");
  });

  it("activates Comercial children and Lucrări root ownership", () => {
    expect(
      buildUi20PresentationModel(implemented, { pathname: "/clients/cus:1", search: "" }).activeSlot,
    ).toBe("commercial");
    expect(buildUi20PresentationModel(implemented, { pathname: "/", search: "" }).activeSlot).toBe(
      "jobs",
    );
    expect(
      buildUi20PresentationModel(implemented, {
        pathname: "/products/letters",
        search: "?request=crq:1",
      }).activeSlot,
    ).toBe("requests");
    expect(
      buildUi20PresentationModel(implemented, {
        pathname: "/products/letters",
        search: "?quote=q:1",
      }).activeSlot,
    ).toBe("commercial");
  });

  it("groups Mai multe from visible Resurse and Oameni only", () => {
    const model = buildUi20PresentationModel(implemented, {
      pathname: "/admin/resources",
      search: "",
    });
    expect(model.moreGroups.map((group) => group.id)).toEqual(["resources", "people"]);
    expect(model.activeSlot).toBe("more");
    expect(resolveActiveSlot(model.activeDestination)).toBe("more");
  });
});
