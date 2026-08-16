export type CostQualifier = {
  volumeDepthMm?: number;
};

export type ResourceRequirement = {
  componentId: string;
  resourceId: string;
  quantity: number;
  unit: "m" | "m2" | "buc";
  costQualifier?: CostQualifier;
};
