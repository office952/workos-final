import { backForex10mmContract } from "./back.js";
import type { ComponentCalculationContract } from "./componentContract.js";
import { facePlexiglas3mmContract } from "./face.js";
import { lightingFrontLedContract } from "./lighting.js";
import type { ComponentVariantId } from "./types.js";
import { volumeAluminium06Contract } from "./volume.js";

export const COMPONENT_VARIANT_IDS = [
  "FACE_PLEXIGLAS_3MM",
  "VOLUME_ALUMINIUM_06",
  "BACK_FOREX_10MM",
  "LIGHTING_FRONT_LED",
] as const satisfies readonly ComponentVariantId[];

export function listComponentContracts(): ComponentCalculationContract[] {
  return COMPONENT_VARIANT_IDS.map((id) => getComponentContract(id));
}

export function getComponentContract(
  variantId: ComponentVariantId,
): ComponentCalculationContract {
  switch (variantId) {
    case "FACE_PLEXIGLAS_3MM":
      return facePlexiglas3mmContract;
    case "VOLUME_ALUMINIUM_06":
      return volumeAluminium06Contract;
    case "BACK_FOREX_10MM":
      return backForex10mmContract;
    case "LIGHTING_FRONT_LED":
      return lightingFrontLedContract;
    default: {
      const _exhaustive: never = variantId;
      throw new Error(`Unknown component variant: ${_exhaustive}`);
    }
  }
}
