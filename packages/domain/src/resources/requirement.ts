export type ResourceRequirement = {
  componentId: string;
  resourceId: string;
  quantity: number;
  unit: "m" | "m2" | "buc";
};
