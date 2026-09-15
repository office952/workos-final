import type { ColorCatalogItem, FinishCatalogItem, FinishSelectionSnapshot, RollProfile } from "./types.js";

export function snapshotFinishSelection(input: {
  application: FinishCatalogItem;
  color?: ColorCatalogItem | null;
  roll?: RollProfile | null;
  laminated?: boolean | null;
}): FinishSelectionSnapshot {
  return {
    applicationId: input.application.applicationId,
    colorId: input.color?.id ?? null,
    colorCode: input.color?.code ?? null,
    colorDisplayName: input.color?.displayName ?? null,
    swatch: input.color?.swatch ?? null,
    rollProfileId: input.roll?.id ?? null,
    rollWidthMm: input.roll?.widthMm ?? null,
    laminated:
      input.laminated ??
      (input.application.lamination === "required"
        ? true
        : input.application.finishFamily === "print"
          ? false
          : null),
  };
}
