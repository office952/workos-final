import { forexBackContract } from "./back.js";
import type { ComponentCalculationContract } from "./componentContract.js";
import { plexiglasFaceContract } from "./face.js";
import { lightingFrontLedContract } from "./lighting.js";
import { COMPONENT_TYPE_IDS, type ComponentTypeId } from "./componentTypes.js";
import { aluminiumVolumeContract } from "./volume.js";

export { COMPONENT_TYPE_IDS };

export function listComponentContracts(): ComponentCalculationContract[] {
  return COMPONENT_TYPE_IDS.map((id) => getComponentContract(id));
}

export function getComponentContract(
  typeId: ComponentTypeId,
): ComponentCalculationContract {
  switch (typeId) {
    case "PLEXIGLAS_FACE":
      return plexiglasFaceContract;
    case "ALUMINIUM_VOLUME":
      return aluminiumVolumeContract;
    case "FOREX_BACK":
      return forexBackContract;
    case "LIGHTING_FRONT_LED":
      return lightingFrontLedContract;
    default: {
      const _exhaustive: never = typeId;
      throw new Error(`Unknown component type: ${_exhaustive}`);
    }
  }
}
