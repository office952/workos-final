import { describe, expect, it } from "vitest";
import {
  compileAggregate,
  compileDefinition,
  confirmReviewedDefinition,
} from "../product/compiler.js";
import { compileEic } from "../resources/eic.js";
import { seededDisplayLabelCatalog } from "../product/displayMetadata.js";
import {
  CANONICAL_PRODUCT_CODE,
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06Template,
} from "../product/frontlitPlexiAl06.js";
import {
  APPLY_SURFACE_FINISH_ID,
  BOND_LETTER_BODY_ID,
  CLOSE_LETTER_BODY_ID,
  CUT_SHEET_CNC_ID,
  FORM_ALUMINIUM_PROFILE_ID,
  INSPECT_FINISHED_LETTER_ID,
  INSTALL_OR_CONNECT_PSU_ID,
  PACK_PRODUCT_ID,
  PAINT_RAL_ID,
  PLACE_LED_MODULES_ID,
  TEST_ILLUMINATION_UNIFORMITY_ID,
  TEST_LIGHTING_IGNITION_ID,
  WIRE_LIGHTING_ID,
} from "./catalog.js";
import {
  composeProductProcesses,
  composeProductProcessesFromTruth,
  composeTypeProcessNodes,
  compositionNodeId,
  topologicalOrder,
} from "./composition.js";
import { resolvedProcessRequirementsForType } from "./requirements.js";

const noneFinish = {
  "face.finish": "none",
  "volume.finish": "none",
} as const;

const vinylFinish = {
  "face.finish": "vinyl",
  "volume.finish": "vinyl",
} as const;

describe("letters process composition", () => {
  it("gives FACE a CNC requirement and BACK a distinct node of the same process", () => {
    const composition = composeProductProcesses(frontlitPlexiAl06Template, noneFinish);
    const faceCut = composition.nodes.find(
      (item) => item.id === compositionNodeId("FACE", CUT_SHEET_CNC_ID),
    );
    const backCut = composition.nodes.find(
      (item) => item.id === compositionNodeId("BACK", CUT_SHEET_CNC_ID),
    );
    expect(faceCut?.processId).toBe(CUT_SHEET_CNC_ID);
    expect(backCut?.processId).toBe(CUT_SHEET_CNC_ID);
    expect(faceCut?.id).not.toBe(backCut?.id);
    expect(faceCut?.scope).toBe("FACE");
    expect(backCut?.scope).toBe("BACK");
  });

  it("gives VOLUME forming and keeps finish silent when none is selected", () => {
    const composition = composeProductProcesses(frontlitPlexiAl06Template, noneFinish);
    expect(
      composition.nodes.some((item) => item.processId === FORM_ALUMINIUM_PROFILE_ID),
    ).toBe(true);
    expect(
      composition.nodes.some((item) => item.processId === APPLY_SURFACE_FINISH_ID),
    ).toBe(false);
  });

  it("requires vinyl finish only when selected and orders volume vinyl before forming", () => {
    const composition = composeProductProcesses(frontlitPlexiAl06Template, vinylFinish);
    const faceVinyl = composition.nodes.find(
      (item) => item.id === compositionNodeId("FACE", APPLY_SURFACE_FINISH_ID),
    );
    const volumeVinyl = composition.nodes.find(
      (item) => item.id === compositionNodeId("VOLUME", APPLY_SURFACE_FINISH_ID),
    );
    const volumeForm = composition.nodes.find(
      (item) => item.id === compositionNodeId("VOLUME", FORM_ALUMINIUM_PROFILE_ID),
    );
    expect(faceVinyl?.dependsOn).toEqual([compositionNodeId("FACE", CUT_SHEET_CNC_ID)]);
    expect(volumeForm?.dependsOn).toEqual([volumeVinyl?.id]);
    expect(composition.derivedOrder.indexOf(volumeVinyl?.id ?? "")).toBeLessThan(
      composition.derivedOrder.indexOf(volumeForm?.id ?? ""),
    );
  });

  it("gives bonding explicit prerequisites and keeps lighting required but blocked", () => {
    const composition = composeProductProcesses(frontlitPlexiAl06Template, vinylFinish);
    const bond = composition.nodes.find(
      (item) => item.id === compositionNodeId("BODY", BOND_LETTER_BODY_ID),
    );
    const lighting = composition.nodes.find(
      (item) => item.id === compositionNodeId("LIGHTING", PLACE_LED_MODULES_ID),
    );
    expect(bond?.dependsOn).toEqual([
      compositionNodeId("FACE", CUT_SHEET_CNC_ID),
      compositionNodeId("FACE", APPLY_SURFACE_FINISH_ID),
      compositionNodeId("VOLUME", FORM_ALUMINIUM_PROFILE_ID),
    ]);
    expect(lighting?.nodeReadiness).toBe("REQUIRED_BLOCKED");
    expect(composition.completeness).toBe("BLOCKED");
  });

  it("does not treat painted volume as vinyl and composes RAL after closure", () => {
    const composition = composeProductProcesses(frontlitPlexiAl06Template, {
      "face.finish": "none",
      "volume.finish": "painted",
    });
    const paint = composition.nodes.find(
      (item) => item.id === compositionNodeId("VOLUME", PAINT_RAL_ID),
    );
    const close = composition.nodes.find(
      (item) => item.id === compositionNodeId("BODY", CLOSE_LETTER_BODY_ID),
    );
    expect(
      composition.nodes.some((item) => item.processId === APPLY_SURFACE_FINISH_ID),
    ).toBe(false);
    expect(paint?.condition).toEqual({
      kind: "fieldEquals",
      fieldId: "volume.finish",
      value: "painted",
    });
    expect(paint?.dependsOn).toEqual([close?.id]);
    expect(composition.derivedOrder.indexOf(close?.id ?? "")).toBeLessThan(
      composition.derivedOrder.indexOf(paint?.id ?? ""),
    );
    expect(composition.missingProcesses).toEqual([]);
  });

  it("keeps electrical stages distinct and closes the body only after ignition", () => {
    const composition = composeProductProcesses(frontlitPlexiAl06Template, noneFinish);
    const placeLed = compositionNodeId("LIGHTING", PLACE_LED_MODULES_ID);
    const wire = compositionNodeId("LIGHTING", WIRE_LIGHTING_ID);
    const psu = compositionNodeId("LIGHTING", INSTALL_OR_CONNECT_PSU_ID);
    const ignition = compositionNodeId("LIGHTING", TEST_LIGHTING_IGNITION_ID);
    const close = compositionNodeId("BODY", CLOSE_LETTER_BODY_ID);
    const uniformity = compositionNodeId("LIGHTING", TEST_ILLUMINATION_UNIFORMITY_ID);
    const inspect = compositionNodeId("PRODUCT", INSPECT_FINISHED_LETTER_ID);
    const pack = compositionNodeId("PRODUCT", PACK_PRODUCT_ID);
    expect(composition.nodes.find((item) => item.id === wire)?.dependsOn).toEqual([
      placeLed,
    ]);
    expect(composition.nodes.find((item) => item.id === psu)?.dependsOn).toEqual([wire]);
    expect(composition.nodes.find((item) => item.id === ignition)?.dependsOn).toEqual([
      wire,
      psu,
    ]);
    expect(composition.nodes.find((item) => item.id === close)?.dependsOn).toEqual([
      compositionNodeId("BODY", BOND_LETTER_BODY_ID),
      compositionNodeId("BACK", CUT_SHEET_CNC_ID),
      ignition,
    ]);
    expect(composition.derivedOrder.indexOf(ignition)).toBeLessThan(
      composition.derivedOrder.indexOf(close),
    );
    expect(composition.derivedOrder.indexOf(close)).toBeLessThan(
      composition.derivedOrder.indexOf(uniformity),
    );
    expect(composition.nodes.find((item) => item.id === pack)?.dependsOn).toEqual([
      inspect,
    ]);
    expect(composition.nodes.find((item) => item.id === psu)?.nodeReadiness).toBe(
      "REQUIRED_BLOCKED",
    );
  });

  it("keeps the graph acyclic, deterministic, and free of execution identity", () => {
    const first = composeProductProcesses(frontlitPlexiAl06Template, vinylFinish);
    const second = composeProductProcesses(frontlitPlexiAl06Template, vinylFinish);
    expect(first.derivedOrder).toEqual(second.derivedOrder);
    expect(first.derivedOrder).toEqual(topologicalOrder(first.nodes));
    expect(JSON.stringify(first)).not.toMatch(
      /machineId|employeeId|orderId|ExecutionPlan|ExecutionTask|"sequence"/,
    );
    expect(first.nodes.every((item) => item.id !== item.processId)).toBe(true);
  });

  it("reuses the same type process contract standalone and in the product", () => {
    const values = { "face.finish": "vinyl" };
    const standalone = composeTypeProcessNodes("FACE", "PLEXIGLAS_FACE", values);
    const product = composeProductProcesses(frontlitPlexiAl06Template, vinylFinish);
    const productFace = product.nodes.filter((item) => item.scope === "FACE");
    expect(standalone.map((item) => item.processId)).toEqual(
      resolvedProcessRequirementsForType("PLEXIGLAS_FACE", values).map(
        (item) => item.processId,
      ),
    );
    expect(productFace.map((item) => item.processId).sort()).toEqual(
      standalone.map((item) => item.processId).sort(),
    );
    expect(standalone.some((item) => item.processId === BOND_LETTER_BODY_ID)).toBe(
      false,
    );
  });

  it("does not change ProductAggregate or EIC", () => {
    const definition = compileDefinition(
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      {
        templateCode: CANONICAL_PRODUCT_CODE,
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      },
    );
    const truth = confirmReviewedDefinition(definition, definition.reviewId);
    if ("ok" in truth) {
      throw new Error("expected confirmed truth");
    }
    const aggregate = compileAggregate(
      truth,
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      seededDisplayLabelCatalog(),
    );
    const fromTruth = composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template);
    expect(compileEic(aggregate).total).toBe(320.5);
    expect(JSON.stringify(aggregate)).not.toMatch(/CUT_SHEET_CNC|derivedOrder/);
    expect(fromTruth.productCode).toBe(CANONICAL_PRODUCT_CODE);
    expect(fromTruth.nodes.some((item) => item.processId === CUT_SHEET_CNC_ID)).toBe(
      true,
    );
  });
});
