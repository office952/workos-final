export {
  FULL_ALUMINIUM_VOLUMETRIC_LETTERS_CATEGORY_ID,
  FRONT_LIT_VOLUMETRIC_LETTERS_CATEGORY_ID,
  HALO_LIT_VOLUMETRIC_LETTERS_CATEGORY_ID,
  LIGHTED_VOLUMETRIC_SIGNS_FAMILY_ID,
  buildCatalogTree,
  categoryHasCycle,
  getProductCategory,
  getProductFamily,
  isLeafCategory,
  productCategories,
  productFamilies,
} from "./catalog.js";
export { projectProductCatalog } from "./catalogProjection.js";
export {
  compileAggregate,
  compileDefinition,
  confirmReviewedDefinition,
  definitionReviewId,
  isFieldVisible,
  selectedComponentIds,
} from "./compiler.js";
export {
  COMPONENT_VARIANT_IDS,
  getComponentContract,
  listComponentContracts,
} from "./componentRegistry.js";
export {
  COMPONENT_ROLES,
  projectComponentArchitecture,
} from "./componentProjection.js";
export { BACK_COMPONENT_ID, backForex10mmContract } from "./back.js";
export {
  FACE_AREA_FIELD,
  FACE_COMPONENT_ID,
  faceAreaSquareMeters,
  facePlexiglas3mmContract,
} from "./face.js";
export {
  CANONICAL_PRODUCT_CODE,
  formSchemas,
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06Template,
  getFormSchema,
  getFormSchemaForTemplate,
  getProductTemplate,
  productTemplates,
} from "./frontlitPlexiAl06.js";
export { LIGHTING_COMPONENT_ID, lightingFrontLedContract } from "./lighting.js";
export {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  componentTechnicalSettingsRegistry,
  createTechnicalSettingsRegistry,
  listVariantTechnicalSettings,
  projectTechnicalSettings,
} from "./technicalSettings.js";
export {
  VOLUME_COMPONENT_ID,
  VOLUME_PERIMETER_FIELD,
  volumeAluminium06Contract,
  volumeLinearMeters,
} from "./volume.js";
export type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
  ComponentContractProfile,
  SharedCalculationContext,
} from "./componentContract.js";
export type {
  ComponentRoleProjection,
  ComponentVariantProjection,
} from "./componentProjection.js";
export type {
  ComponentTechnicalSettingDefinition,
  ComponentTechnicalSettingProjection,
  TechnicalSettingsRegistry,
} from "./technicalSettings.js";
export type {
  CatalogTreeNode,
  ComponentCalculationStatus,
  ComponentInputMapping,
  ComponentRole,
  ComponentRuntimeStatus,
  ComponentSummary,
  ComponentVariantId,
  DraftConfiguration,
  DraftValue,
  DraftValues,
  FieldOption,
  FieldType,
  FormField,
  FormSchema,
  FormSection,
  MissingInput,
  ProductAggregate,
  ProductCategory,
  ProductComponent,
  ProductDefinition,
  ProductFamily,
  ProductIdentityFact,
  ProductTemplate,
  ProductTruth,
  TechnicalMeasurement,
  TechnicalQuantity,
  VisibilityRule,
} from "./types.js";
