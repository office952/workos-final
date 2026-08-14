import { describe, expect, it } from "vitest";
import {
  compileAggregate,
  compileDefinition,
  confirmTruth,
  selectedComponentIds,
} from "./compiler.js";
import { lettersFormSchema, lettersTemplate } from "./letters.js";
import type { DraftConfiguration } from "./types.js";

function draft(values: DraftConfiguration["values"]): DraftConfiguration {
  return { templateCode: "letters", values };
}

const readyValues = {
  "root.inscription": "WORKOS",
  "face.material": "plexiglas",
  "face.finish": "none",
  "returnCant.material": "aluminum",
  "returnCant.depthMm": 60,
  "returnCant.finish": "none",
  "back.material": "forex",
  "lighting.selected": false,
};

describe("LETTERS template", () => {
  it("has a stable identity and unique component ids", () => {
    expect(lettersTemplate.code).toBe("letters");
    expect(lettersTemplate.family.id).toBe("LETTERS");
    expect(lettersTemplate.formSchemaId).toBe(lettersFormSchema.id);
    const ids = lettersTemplate.components.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps form field ids unique and bound to known components", () => {
    const fields = lettersFormSchema.sections.flatMap((section) => section.fields);
    const fieldIds = fields.map((field) => field.id);
    expect(new Set(fieldIds).size).toBe(fieldIds.length);
    const componentIds = new Set([
      "ROOT",
      ...lettersTemplate.components.map((item) => item.id),
    ]);
    for (const field of fields) {
      expect(componentIds.has(field.componentId)).toBe(true);
      if (field.type === "select") {
        expect(field.options?.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("module law", () => {
  it("keeps unselected lighting silent", () => {
    const definition = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft(readyValues),
    );
    expect(selectedComponentIds(lettersTemplate, readyValues)).not.toContain(
      "LIGHTING",
    );
    expect(definition.values["lighting.mode"]).toBeUndefined();
    expect(definition.missing.map((item) => item.fieldId)).not.toContain(
      "lighting.mode",
    );
  });

  it("requires lighting mode only when lighting is selected", () => {
    const blocked = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft({ ...readyValues, "lighting.selected": true }),
    );
    expect(blocked.readiness).toBe("blocked");
    expect(blocked.missing.some((item) => item.fieldId === "lighting.mode")).toBe(
      true,
    );

    const ready = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft({
        ...readyValues,
        "lighting.selected": true,
        "lighting.mode": "front_lit",
      }),
    );
    expect(ready.readiness).toBe("ready");
    expect(ready.selectedComponentIds).toContain("LIGHTING");
    expect(ready.values["lighting.mode"]).toBe("front_lit");
  });
});

describe("ProductDefinition", () => {
  it("compiles a valid draft to ready", () => {
    const definition = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft(readyValues),
    );
    expect(definition.readiness).toBe("ready");
    expect(definition.missing).toEqual([]);
    expect(definition.selectedComponentIds).toEqual([
      "FACE",
      "RETURN_CANT",
      "BACK",
    ]);
  });

  it("blocks when a selected required field is missing", () => {
    const definition = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft({ ...readyValues, "root.inscription": "" }),
    );
    expect(definition.readiness).toBe("blocked");
    expect(definition.missing.some((item) => item.fieldId === "root.inscription")).toBe(
      true,
    );
  });

  it("ignores inactive lighting fields", () => {
    const definition = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft({
        ...readyValues,
        "lighting.selected": false,
        "lighting.mode": "front_lit",
      }),
    );
    expect(definition.readiness).toBe("ready");
    expect(definition.values["lighting.mode"]).toBeUndefined();
  });
});

describe("ProductTruth and ProductAggregate", () => {
  it("forbids confirmation while definition is blocked", () => {
    const definition = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft({ ...readyValues, "root.inscription": "" }),
    );
    const result = confirmTruth(definition);
    expect(result).toEqual({ ok: false, definition });
  });

  it("confirms only the active scope and derives aggregate from truth", () => {
    const definition = compileDefinition(
      lettersTemplate,
      lettersFormSchema,
      draft(readyValues),
    );
    const truth = confirmTruth(definition, "2026-08-14T18:00:00.000Z");
    expect("ok" in truth ? truth.ok : true).toBe(true);
    if ("ok" in truth) {
      throw new Error("expected confirmed truth");
    }
    expect(truth.status).toBe("CONFIRMED_IN_RUNTIME");
    expect(truth.selectedComponentIds).not.toContain("LIGHTING");
    expect(truth.values["lighting.mode"]).toBeUndefined();

    const aggregate = compileAggregate(truth, lettersTemplate, lettersFormSchema);
    expect(aggregate.derivedFrom).toBe("ProductTruth");
    expect(aggregate.inscription).toBe("WORKOS");
    expect(aggregate.components.map((item) => item.id)).toEqual([
      "FACE",
      "RETURN_CANT",
      "BACK",
    ]);
    expect(aggregate.unavailable.join(" ")).toMatch(/Preț/);
    expect(JSON.stringify(aggregate)).not.toMatch(/price|EIC|quote/i);
  });
});
