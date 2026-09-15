import { describe, expect, it } from "vitest";
import {
  LETTERS_FORM_SCHEMA_V1_ID,
  LETTERS_FORM_SCHEMA_V2_ID,
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06FormSchemaV1,
  frontlitPlexiAl06Template,
  frontlitPlexiAl06TemplateV1,
} from "../product/frontlitPlexiAl06.js";

describe("LETTERS form schema versions", () => {
  it("freezes the historical V1 FACE form", () => {
    expect(frontlitPlexiAl06TemplateV1.version).toBe("1");
    expect(frontlitPlexiAl06TemplateV1.formSchemaId).toBe(LETTERS_FORM_SCHEMA_V1_ID);
    expect(frontlitPlexiAl06FormSchemaV1.id).toBe(LETTERS_FORM_SCHEMA_V1_ID);
    const faceFields = frontlitPlexiAl06FormSchemaV1.sections
      .find((section) => section.id === "face")
      ?.fields.map((field) => field.id);
    expect(faceFields).toEqual(["face.finish", "face.color", "face.confirmedAreaMm2"]);
    const faceFinish = frontlitPlexiAl06FormSchemaV1.sections
      .flatMap((section) => section.fields)
      .find((field) => field.id === "face.finish");
    expect(faceFinish?.options?.map((option) => option.value)).toEqual(["none", "vinyl"]);
  });

  it("publishes the current V2 FACE form without VOLUME changes", () => {
    expect(frontlitPlexiAl06Template.version).toBe("2");
    expect(frontlitPlexiAl06Template.formSchemaId).toBe(LETTERS_FORM_SCHEMA_V2_ID);
    expect(frontlitPlexiAl06FormSchema.id).toBe(LETTERS_FORM_SCHEMA_V2_ID);
    const faceFields = frontlitPlexiAl06FormSchema.sections
      .find((section) => section.id === "face")
      ?.fields.map((field) => field.id);
    expect(faceFields).toEqual([
      "face.finish",
      "face.vinylSeries",
      "face.colorId",
      "face.rollProfileId",
      "face.printRollProfileId",
      "face.lamination",
      "face.confirmedAreaMm2",
    ]);
    const volumeFields = frontlitPlexiAl06FormSchema.sections
      .find((section) => section.id === "volume")
      ?.fields.map((field) => field.id);
    expect(volumeFields).toEqual([
      "volume.depthMm",
      "volume.finish",
      "volume.color",
      "volume.confirmedPerimeterMm",
    ]);
  });
});
