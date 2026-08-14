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
  DISPLAY_LABEL_MAX_LENGTH,
  PRODUCT_SYSTEM_ENTITY_KINDS,
  createDisplayLabelCatalog,
  displayLabelKey,
  isKnownProductSystemEntity,
  isProductSystemEntityKind,
  presentedTemplate,
  seedDisplayLabelRecords,
  seededDisplayLabelCatalog,
  validateDisplayLabel,
  type DisplayLabelCatalog,
  type DisplayLabelRecord,
  type ProductSystemEntityKind,
} from "./displayMetadata.js";
export { presentProductSystem } from "./productSystemPresentation.js";
export {
  compileAggregate,
  compileDefinition,
  confirmReviewedDefinition,
  definitionReviewId,
  isFieldVisible,
  selectedComponentIds,
} from "./compiler.js";
export {
  COMPONENT_TYPE_IDS,
  getComponentContract,
  listComponentContracts,
} from "./componentRegistry.js";
export {
  ATTRIBUTE_OWNERSHIPS,
  attributeKindLabel,
  attributeOwnershipLabel,
  componentTypes,
  getComponentType,
  listComponentTypesForRole,
  liveResourceIdsForType,
  resolveTypeResources,
} from "./componentTypes.js";
export {
  COMPONENT_ROLES,
  projectComponentArchitecture,
} from "./componentProjection.js";
export {
  adminEditClassLabel,
  adminLifecycleLabel,
  collectChildCategoryIds,
  computeCategoryDepth,
  projectProductSystemAdministration,
} from "./productSystemAdmin.js";
export { BACK_COMPONENT_ID, forexBackContract } from "./back.js";
export {
  FACE_AREA_FIELD,
  FACE_COMPONENT_ID,
  faceAreaSquareMeters,
  plexiglasFaceContract,
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
export {
  LIGHTING_COMPONENT_ID,
  LIGHTING_MISSING_LED_GEOMETRY,
  LIGHTING_MISSING_LED_LOAD,
  LIGHTING_MISSING_PSU_CAPACITY,
  LIGHTING_MISSING_PSU_SELECTION,
  lightingFrontLedContract,
  requiredPsuCapacityW,
} from "./lighting.js";
export {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  componentTechnicalSettingsRegistry,
  createTechnicalSettingsRegistry,
  listTypeTechnicalSettings,
  projectTechnicalSettings,
  resolvedSettingValue,
} from "./technicalSettings.js";
export {
  VOLUME_COMPONENT_ID,
  VOLUME_PERIMETER_FIELD,
  aluminiumVolumeContract,
  volumeLinearMeters,
} from "./volume.js";
export type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
  ComponentContractProfile,
  ComponentInspectionLine,
  SharedCalculationContext,
} from "./componentContract.js";
export type {
  ComponentConfigurationAttribute,
  ComponentProductConfiguration,
  ComponentRoleProjection,
  ComponentTypeProjection,
} from "./componentProjection.js";
export type {
  AttributeOwnership,
  ComponentAttributeDefinition,
  ComponentAttributeKind,
  ComponentTypeDefinition,
  ResourceResolution,
} from "./componentTypes.js";
export type {
  ComponentTechnicalSettingDefinition,
  ComponentTechnicalSettingProjection,
  TechnicalSettingsRegistry,
} from "./technicalSettings.js";
export type {
  AdminCategoryRecord,
  AdminEditClass,
  AdminFamilyRecord,
  AdminLifecycleState,
  AdminProductRecord,
  AdminReadiness,
  AdminTypeRecord,
  ProductSystemAdminProjection,
} from "./productSystemAdmin.js";
export type {
  CatalogTreeNode,
  ComponentCalculationStatus,
  ComponentInputMapping,
  ComponentRole,
  ComponentTypeId,
  ComponentRuntimeStatus,
  ComponentSummary,
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
