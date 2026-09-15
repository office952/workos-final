import { describe, expect, it } from "vitest";
import { frontlitPlexiAl06FormSchema, frontlitPlexiAl06Template } from "../product/frontlitPlexiAl06.js";

describe("FC2A does not promote finish Product Truth", () => {
  it("leaves the live LETTERS FormSchema and template finish tokens unchanged", () => {
    const fieldIds = frontlitPlexiAl06FormSchema.sections.flatMap((section) =>
      section.fields.map((field) => field.id),
    );
    expect(fieldIds).toEqual([
      "root.inscription",
      "face.finish",
      "face.color",
      "face.confirmedAreaMm2",
      "volume.depthMm",
      "volume.finish",
      "volume.color",
      "volume.confirmedPerimeterMm",
    ]);
    const faceFinish = frontlitPlexiAl06FormSchema.sections
      .flatMap((section) => section.fields)
      .find((field) => field.id === "face.finish");
    expect(faceFinish?.options?.map((option) => option.value)).toEqual(["none", "vinyl"]);
    expect(frontlitPlexiAl06Template.formSchemaId).toBe("prd-letters-frontlit-plexi-al06-form-v1");
  });
});
