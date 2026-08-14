import { getComponentType } from "../product/componentTypes.js";
import { productTemplates } from "../product/frontlitPlexiAl06.js";
import type { ComponentRole, ComponentTypeId } from "../product/types.js";
import { getOperationalProcess } from "./catalog.js";

export type ProcessUse = {
  processId: string;
  typeId: ComponentTypeId;
  role: ComponentRole;
  typeLabel: string;
  productCode: string;
  productLabel: string;
  displayLine: string;
};

export function processWhereUsed(processId: string): ProcessUse[] {
  const process = getOperationalProcess(processId);
  if (!process) {
    return [];
  }
  return productTemplates.flatMap((template) =>
    template.components
      .filter((component) => process.applicableTypeIds.includes(component.typeId))
      .map((component) => {
        const typeLabel = getComponentType(component.typeId).label;
        const role = component.id as ComponentRole;
        const roleLabel = componentRoleLabel(role);
        return {
          processId,
          typeId: component.typeId,
          role,
          typeLabel,
          productCode: template.code,
          productLabel: template.label,
          displayLine: `${template.label} — ${roleLabel} / ${typeLabel}`,
        };
      }),
  );
}

function componentRoleLabel(role: ComponentRole): string {
  switch (role) {
    case "FACE":
      return "Față";
    case "VOLUME":
      return "Volum";
    case "BACK":
      return "Spate";
    case "LIGHTING":
      return "Iluminare";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}
