import { listComponentContracts } from "./componentRegistry.js";
import type { ComponentEicReadiness, ComponentMeasurementKind } from "./componentContract.js";
import { productTemplates } from "./frontlitPlexiAl06.js";
import {
  projectTechnicalSettings,
  type ComponentTechnicalSettingProjection,
} from "./technicalSettings.js";
import type { ComponentRole, ComponentVariantId, ProductTemplate } from "./types.js";

export const COMPONENT_ROLES: readonly ComponentRole[] = [
  "FACE",
  "VOLUME",
  "BACK",
  "LIGHTING",
];

export type ComponentProductUse = {
  productCode: string;
  productLabel: string;
  inputNote: string | null;
};

export type ComponentVariantProjection = {
  variantId: ComponentVariantId;
  label: string;
  independentCalculation: boolean;
  measurement: string;
  quantity: string;
  eic: string;
  gaps: readonly string[];
  usedBy: readonly ComponentProductUse[];
  technicalSettings: readonly ComponentTechnicalSettingProjection[];
};

export type ComponentRoleProjection = {
  role: ComponentRole;
  label: string;
  owns: readonly string[];
  variants: readonly ComponentVariantProjection[];
};

function measurementCopy(kind: ComponentMeasurementKind): string {
  switch (kind) {
    case "confirmed_area_mm2":
      return "Suprafață confirmată de operator (mm²)";
    case "confirmed_perimeter_mm":
      return "Perimetru confirmat de operator (mm)";
    case "supplied_area_mm2":
      return "Suprafață primită din compoziția produsului (mm²)";
    case "none":
      return "Nicio măsurătoare calculabilă acum";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function quantityCopy(unit: "m" | "m2" | null): string {
  switch (unit) {
    case "m":
      return "m";
    case "m2":
      return "m²";
    case null:
      return "Nicio cantitate tehnică";
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

function eicCopy(readiness: ComponentEicReadiness): string {
  switch (readiness) {
    case "material":
      return "Disponibil: material";
    case "material_and_operation":
      return "Disponibil: material și operație";
    case "unavailable":
      return "Indisponibil";
    default: {
      const _exhaustive: never = readiness;
      return _exhaustive;
    }
  }
}

function ownsCopy(role: ComponentRole): readonly string[] {
  switch (role) {
    case "FACE":
      return [
        "Măsurătoarea de suprafață",
        "Cantitatea tehnică",
        "Cererea de material",
      ];
    case "VOLUME":
      return [
        "Măsurătoarea de perimetru",
        "Cantitatea tehnică",
        "Cererea de profil și formare",
      ];
    case "BACK":
      return [
        "Transformarea suprafeței primite în cantitate",
        "Cererea de material",
      ];
    case "LIGHTING":
      return [
        "Contractul de calcul",
        "Consumul setărilor tehnice",
        "Starea de disponibilitate",
      ];
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

function roleLabel(role: ComponentRole): string {
  for (const template of productTemplates) {
    const component = template.components.find((item) => item.id === role);
    if (component) {
      return component.label;
    }
  }
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

function identityValue(template: ProductTemplate, factId: string): string | undefined {
  return template.identityFacts.find((item) => item.id === factId)?.value;
}

function variantLabel(variantId: ComponentVariantId, role: ComponentRole): string {
  for (const template of productTemplates) {
    const used = template.components.some((item) => item.variantId === variantId);
    if (!used) {
      continue;
    }
    switch (role) {
      case "FACE":
        return identityValue(template, "face.material") ?? variantId;
      case "VOLUME":
        return identityValue(template, "volume.material") ?? variantId;
      case "BACK":
        return identityValue(template, "back.material") ?? variantId;
      case "LIGHTING":
        return identityValue(template, "lighting") ?? variantId;
      default: {
        const _exhaustive: never = role;
        return _exhaustive;
      }
    }
  }
  return variantId;
}

function inputNote(template: ProductTemplate, role: ComponentRole): string | null {
  const component = template.components.find((item) => item.id === role);
  const source = component?.inputMapping?.confirmedAreaMm2FromComponentId;
  if (!source) {
    return null;
  }
  const sourceLabel =
    template.components.find((item) => item.id === source)?.label ?? source;
  return `Primește suprafața de la ${sourceLabel} în acest produs`;
}

function productsUsing(variantId: ComponentVariantId, role: ComponentRole): ComponentProductUse[] {
  return productTemplates
    .filter((template) =>
      template.components.some((item) => item.variantId === variantId),
    )
    .map((template) => ({
      productCode: template.code,
      productLabel: template.label,
      inputNote: inputNote(template, role),
    }));
}

export function projectComponentArchitecture(): ComponentRoleProjection[] {
  const contracts = listComponentContracts();
  return COMPONENT_ROLES.map((role) => ({
    role,
    label: roleLabel(role),
    owns: ownsCopy(role),
    variants: contracts
      .filter((contract) => contract.role === role)
      .map((contract) => ({
        variantId: contract.variantId,
        label: variantLabel(contract.variantId, role),
        independentCalculation: contract.profile.independentCalculation,
        measurement: measurementCopy(contract.profile.measurement),
        quantity: quantityCopy(contract.profile.quantityUnit),
        eic: eicCopy(contract.profile.eic),
        gaps: contract.profile.structuralGaps,
        usedBy: productsUsing(contract.variantId, role),
        technicalSettings: projectTechnicalSettings(contract.variantId),
      })),
  }));
}
