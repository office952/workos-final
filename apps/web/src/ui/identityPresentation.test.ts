import { describe, expect, it } from "vitest";
import { identityTriggerAccessibleName } from "./identityPresentation";

describe("identityTriggerAccessibleName", () => {
  it("uses organization then account, and does not invent a person name", () => {
    expect(identityTriggerAccessibleName("HUB MEDIA", "remus@company.ro")).toBe(
      "HUB MEDIA. remus@company.ro",
    );
    expect(identityTriggerAccessibleName("Atelier Demo")).toBe("Atelier Demo");
    expect(identityTriggerAccessibleName("Atelier Demo", "Atelier Demo")).toBe("Atelier Demo");
  });
});
