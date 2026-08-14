import {
  adminEditClassLabel,
  type AdminReadiness,
  type AdminTypeRecord,
  type ComponentRoleProjection,
  type ComponentTypeProjection,
  type GovernanceProjection,
  type ImplementationState,
  type ProductSystemAdminProjection,
  type ProductSystemEntityKind,
} from "@workos-final/domain";

export type CatalogEditTarget = {
  entityKind: ProductSystemEntityKind;
  entityId: string;
  displayLabel: string;
  revision: number;
  identityLabel: string;
};

export type CatalogFact = {
  label: string;
  value: string;
};

export type CatalogStatusLine = {
  label: string;
  state?: ImplementationState;
  note?: string;
};

export type CatalogSettingLine = {
  label: string;
  valueDisplay: string;
  statusLabel: string;
  sourceLabel: string;
  administrationLabel: string;
};

export type CatalogDetailSection = {
  id: string;
  title: string;
  facts?: readonly CatalogFact[];
  lines?: readonly string[];
  statusLines?: readonly CatalogStatusLine[];
  settingLines?: readonly CatalogSettingLine[];
  technical?: boolean;
};

export type CatalogGroup = {
  id: string;
  kindLabel: string;
  title: string;
  sections: readonly CatalogDetailSection[];
};

export type CatalogItem = {
  id: string;
  label: string;
  kindLabel: string;
  summary?: string;
  groups: readonly CatalogGroup[];
  editTarget?: CatalogEditTarget;
};

export type CatalogCategory = {
  id: string;
  label: string;
  kindLabel: string;
  items: readonly CatalogItem[];
};

export type OwnerCatalog = {
  categories: readonly CatalogCategory[];
};

const TECHNICAL_SETTING_SCOPE_LINES = [
  "Setări tehnice de sistem. Configurabil înseamnă că valoarea aparține tipului, nu formularului de comandă.",
  "Nu se editează în acest ecran.",
] as const;

function technicalSettingsSection(
  settings: readonly {
    label: string;
    valueDisplay: string;
    statusLabel: string;
    sourceLabel: string;
    administrationLabel: string;
  }[],
): CatalogDetailSection {
  return {
    id: "technical-settings",
    title: "Setări tehnice",
    settingLines: settings.map((setting) => ({
      label: setting.label,
      valueDisplay: setting.valueDisplay,
      statusLabel: setting.statusLabel,
      sourceLabel: setting.sourceLabel,
      administrationLabel: setting.administrationLabel,
    })),
    lines: [...TECHNICAL_SETTING_SCOPE_LINES],
  };
}

function calculationInspectionSections(type: {
  calculationInputs: readonly { label: string; value: string }[];
  calculationResults: readonly { label: string; value: string }[];
}): CatalogDetailSection[] {
  const sections: CatalogDetailSection[] = [];
  if (type.calculationInputs.length > 0) {
    sections.push({
      id: "calculation-inputs",
      title: "Intrări tehnice",
      facts: type.calculationInputs.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    });
  }
  if (type.calculationResults.length > 0) {
    sections.push({
      id: "calculation-results",
      title: "Rezultate calculate",
      facts: type.calculationResults.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    });
  }
  return sections;
}

export function buildComponentCatalog(
  roles: readonly ComponentRoleProjection[],
): OwnerCatalog {
  if (roles.length === 0) {
    return { categories: [] };
  }

  return {
    categories: [
      {
        id: "product-components",
        label: "Componente de produs",
        kindLabel: "Categorie",
        items: roles.map((role) => ({
          id: role.role,
          label: role.label,
          kindLabel: "Componentă",
          summary: `Deține: ${role.owns.join("; ")}.`,
          groups: role.types.map((type) => ({
            id: type.typeId,
            kindLabel: "Tip constructiv",
            title: type.label,
            sections: typeDetailSections(type),
          })),
        })),
      },
    ],
  };
}

export function buildProductSystemAdminCatalog(
  admin: ProductSystemAdminProjection,
): OwnerCatalog {
  const componentItems = groupTypesByRole(admin);
  const settingItems = admin.types
    .filter((type) => type.technicalSettings.length > 0)
    .map((type) => ({
      id: `settings:${type.typeId}`,
      label: type.label,
      kindLabel: "Setări tip",
      summary: "Setările tehnice aparțin tipului constructiv, nu produsului.",
      groups: [
        {
          id: type.typeId,
          kindLabel: "Tip constructiv",
          title: type.label,
          sections: [
            technicalSettingsSection(type.technicalSettings),
            {
              id: "used-by",
              title: "Produse care o folosesc",
              lines:
                type.usedByLabels.length === 0
                  ? ["niciun produs încă"]
                  : [...type.usedByLabels],
            },
          ],
        },
      ],
    }));

  return {
    categories: [
      {
        id: "families",
        label: "Familii",
        kindLabel: "Categorie",
        items: admin.families.map((family) => ({
          id: `family:${family.id}`,
          label: family.label,
          kindLabel: "Familie",
          summary: family.description,
          groups: [
            {
              id: family.id,
              kindLabel: "Familie",
              title: family.label,
              sections: [
                {
                  id: "general",
                  title: "General",
                  facts: [
                    { label: "Etichetă", value: family.label },
                    { label: "Categorii", value: String(family.categoryIds.length) },
                    { label: "Produse", value: String(family.productCodes.length) },
                  ],
                  lines: family.categoryIds.map(
                    (id) =>
                      admin.categories.find((item) => item.id === id)?.label ?? id,
                  ),
                },
                readinessSection(family.readiness),
                {
                  id: "technical",
                  title: "Tehnic",
                  technical: true,
                  facts: [{ label: "Identitate stabilă", value: family.id }],
                },
              ],
            },
          ],
        })),
      },
      {
        id: "categories",
        label: "Categorii",
        kindLabel: "Categorie",
        items: admin.categories.map((category) => ({
          id: `category:${category.id}`,
          label: category.label,
          kindLabel: "Categorie",
          summary: category.parentLabel
            ? `În ${category.familyLabel}, sub ${category.parentLabel}.`
            : `În ${category.familyLabel}.`,
          groups: [
            {
              id: category.id,
              kindLabel: "Categorie",
              title: category.label,
              sections: [
                {
                  id: "general",
                  title: "General",
                  facts: [
                    { label: "Etichetă", value: category.label },
                    { label: "Familie", value: category.familyLabel },
                    { label: "Părinte", value: category.parentLabel ?? "rădăcină" },
                    {
                      label: "Subcategorii",
                      value: String(category.childCategoryIds.length),
                    },
                    { label: "Produse", value: String(category.productCodes.length) },
                  ],
                  lines:
                    category.productCodes.length === 0
                      ? ["Niciun produs în această categorie."]
                      : category.productCodes.map(
                          (code) =>
                            admin.products.find((item) => item.code === code)?.label ??
                            code,
                        ),
                },
                readinessSection(category.readiness),
                {
                  id: "technical",
                  title: "Tehnic",
                  technical: true,
                  facts: [{ label: "Identitate stabilă", value: category.id }],
                },
              ],
            },
          ],
        })),
      },
      {
        id: "products",
        label: "Produse",
        kindLabel: "Categorie",
        items: admin.products.map((product) => ({
          id: `product:${product.code}`,
          label: product.label,
          kindLabel: "Produs",
          summary: product.description,
          groups: [
            {
              id: product.code,
              kindLabel: "Produs",
              title: product.label,
              sections: [
                {
                  id: "general",
                  title: "General",
                  facts: [
                    { label: "Etichetă", value: product.label },
                    { label: "Familie", value: product.familyLabel },
                    { label: "Categorie", value: product.categoryLabel },
                    { label: "Stare șablon", value: product.templateStatus },
                    {
                      label: "Formular",
                      value: product.formBound
                        ? "Schemă de configurare legată"
                        : "fără formular",
                    },
                  ],
                },
                {
                  id: "composition",
                  title: "Compoziție",
                  lines: product.composition.map(
                    (line) => `${line.roleLabel} → ${line.typeLabel}`,
                  ),
                },
                {
                  id: "gaps",
                  title: "Zone nerezolvate",
                  lines:
                    product.unresolvedAreas.length > 0
                      ? product.unresolvedAreas
                      : ["Nicio zonă nerezolvată înregistrată"],
                },
                readinessSection(product.readiness),
                {
                  id: "technical",
                  title: "Tehnic",
                  technical: true,
                  facts: [
                    { label: "Identitate stabilă", value: product.code },
                    { label: "Schemă formular", value: product.formSchemaId },
                  ],
                },
              ],
            },
          ],
        })),
      },
      {
        id: "product-components",
        label: "Componente de produs",
        kindLabel: "Categorie",
        items: componentItems,
      },
      ...(settingItems.length > 0
        ? [
            {
              id: "technical-settings",
              label: "Setări tehnice",
              kindLabel: "Categorie",
              items: settingItems,
            },
          ]
        : []),
      {
        id: "compositions",
        label: "Compoziții",
        kindLabel: "Categorie",
        items: admin.products.map((product) => ({
          id: `composition:${product.code}`,
          label: product.label,
          kindLabel: "Compoziție",
          groups: [
            {
              id: product.code,
              kindLabel: "Produs",
              title: product.label,
              sections: [
                {
                  id: "composition",
                  title: "Compoziție",
                  lines: product.composition.map(
                    (line) => `${line.roleLabel} → ${line.typeLabel}`,
                  ),
                },
              ],
            },
          ],
        })),
      },
      {
        id: "lifecycle",
        label: "Stare și lifecycle",
        kindLabel: "Categorie",
        items: [
          ...admin.families.map((family) =>
            lifecycleItem(`life:family:${family.id}`, "Familie", family.label, family.readiness),
          ),
          ...admin.categories.map((category) =>
            lifecycleItem(
              `life:category:${category.id}`,
              "Categorie",
              category.label,
              category.readiness,
            ),
          ),
          ...admin.products.map((product) =>
            lifecycleItem(`life:product:${product.code}`, "Produs", product.label, product.readiness),
          ),
          ...admin.types.map((type) =>
            lifecycleItem(`life:type:${type.typeId}`, "Tip constructiv", type.label, type.readiness),
          ),
        ],
      },
    ],
  };
}

export function buildProductSystemAdministrationCatalog(
  admin: ProductSystemAdminProjection,
): OwnerCatalog {
  return {
    categories: [
      {
        id: "families",
        label: "Familii",
        kindLabel: "Catalog",
        items: admin.families.map((family) => ({
          id: `family:${family.id}`,
          label: family.label,
          kindLabel: "Familie",
          summary: family.description,
          editTarget: {
            entityKind: "PRODUCT_FAMILY" as const,
            entityId: family.id,
            displayLabel: family.label,
            revision: family.displayRevision,
            identityLabel: family.id,
          },
          groups: [
            {
              id: family.id,
              kindLabel: "Familie",
              title: family.label,
              sections: [
                {
                  id: "general",
                  title: "General",
                  facts: [
                    { label: "Etichetă afișată", value: family.label },
                    { label: "Categorii", value: String(family.categoryIds.length) },
                    { label: "Produse", value: String(family.productCodes.length) },
                  ],
                },
                readinessSection(family.readiness),
                {
                  id: "technical",
                  title: "Tehnic",
                  technical: true,
                  facts: [{ label: "Identitate stabilă", value: family.id }],
                },
              ],
            },
          ],
        })),
      },
      {
        id: "categories",
        label: "Categorii",
        kindLabel: "Catalog",
        items: admin.categories.map((category) => ({
          id: `category:${category.id}`,
          label: category.label,
          kindLabel: "Categorie",
          summary: category.parentLabel
            ? `În ${category.familyLabel}, sub ${category.parentLabel}.`
            : `În ${category.familyLabel}.`,
          editTarget: {
            entityKind: "PRODUCT_CATEGORY" as const,
            entityId: category.id,
            displayLabel: category.label,
            revision: category.displayRevision,
            identityLabel: category.id,
          },
          groups: [
            {
              id: category.id,
              kindLabel: "Categorie",
              title: category.label,
              sections: [
                {
                  id: "general",
                  title: "General",
                  facts: [
                    { label: "Etichetă afișată", value: category.label },
                    { label: "Familie", value: category.familyLabel },
                    { label: "Părinte", value: category.parentLabel ?? "rădăcină" },
                  ],
                },
                readinessSection(category.readiness),
                {
                  id: "technical",
                  title: "Tehnic",
                  technical: true,
                  facts: [{ label: "Identitate stabilă", value: category.id }],
                },
              ],
            },
          ],
        })),
      },
      {
        id: "products",
        label: "Produse",
        kindLabel: "Catalog",
        items: admin.products.map((product) => ({
          id: `product:${product.code}`,
          label: product.label,
          kindLabel: "Produs",
          summary: product.description,
          editTarget: {
            entityKind: "PRODUCT_TEMPLATE" as const,
            entityId: product.code,
            displayLabel: product.label,
            revision: product.displayRevision,
            identityLabel: product.code,
          },
          groups: [
            {
              id: product.code,
              kindLabel: "Produs",
              title: product.label,
              sections: [
                {
                  id: "general",
                  title: "General",
                  facts: [
                    { label: "Etichetă afișată", value: product.label },
                    { label: "Familie", value: product.familyLabel },
                    { label: "Categorie", value: product.categoryLabel },
                  ],
                },
                {
                  id: "composition",
                  title: "Compoziție",
                  lines: product.composition.map(
                    (line) => `${line.roleLabel} → ${line.typeLabel}`,
                  ),
                },
                readinessSection(product.readiness),
                {
                  id: "technical",
                  title: "Tehnic",
                  technical: true,
                  facts: [{ label: "Identitate stabilă", value: product.code }],
                },
              ],
            },
          ],
        })),
      },
      {
        id: "constructive-types",
        label: "Tipuri constructive",
        kindLabel: "Componente",
        items: admin.types.map((type) => ({
          id: `type:${type.typeId}`,
          label: type.label,
          kindLabel: "Tip constructiv",
          summary: type.description,
          editTarget: {
            entityKind: "COMPONENT_TYPE" as const,
            entityId: type.typeId,
            displayLabel: type.label,
            revision: type.displayRevision,
            identityLabel: type.typeId,
          },
          groups: [
            {
              id: type.typeId,
              kindLabel: "Tip constructiv",
              title: type.label,
              sections: adminTypeSections(type),
            },
          ],
        })),
      },
      {
        id: "technical-settings",
        label: "Setări tehnice",
        kindLabel: "Referință",
        items: admin.types
          .filter((type) => type.technicalSettings.length > 0)
          .map((type) => ({
            id: `settings:${type.typeId}`,
            label: type.label,
            kindLabel: "Setări tip",
            summary: "Setările tehnice nu sunt editabile în acest write path.",
            groups: [
              {
                id: type.typeId,
                kindLabel: "Tip constructiv",
                title: type.label,
                sections: [technicalSettingsSection(type.technicalSettings)],
              },
            ],
          })),
      },
      {
        id: "compositions",
        label: "Compoziții",
        kindLabel: "Referință",
        items: admin.products.map((product) => ({
          id: `composition:${product.code}`,
          label: product.label,
          kindLabel: "Compoziție",
          groups: [
            {
              id: product.code,
              kindLabel: "Produs",
              title: product.label,
              sections: [
                {
                  id: "composition",
                  title: "Compoziție",
                  lines: product.composition.map(
                    (line) => `${line.roleLabel} → ${line.typeLabel}`,
                  ),
                },
              ],
            },
          ],
        })),
      },
      {
        id: "lifecycle",
        label: "Stare și lifecycle",
        kindLabel: "Referință",
        items: [
          ...admin.families.map((family) =>
            lifecycleItem(`life:family:${family.id}`, "Familie", family.label, family.readiness),
          ),
          ...admin.categories.map((category) =>
            lifecycleItem(
              `life:category:${category.id}`,
              "Categorie",
              category.label,
              category.readiness,
            ),
          ),
          ...admin.products.map((product) =>
            lifecycleItem(`life:product:${product.code}`, "Produs", product.label, product.readiness),
          ),
          ...admin.types.map((type) =>
            lifecycleItem(`life:type:${type.typeId}`, "Tip constructiv", type.label, type.readiness),
          ),
        ],
      },
    ].filter((category) => category.items.length > 0),
  };
}

function groupTypesByRole(admin: ProductSystemAdminProjection): CatalogItem[] {
  const roles: {
    role: string;
    label: string;
    types: AdminTypeRecord[];
  }[] = [];
  for (const type of admin.types) {
    const existing = roles.find((item) => item.role === type.role);
    if (existing) {
      existing.types.push(type);
      continue;
    }
    roles.push({ role: type.role, label: type.roleLabel, types: [type] });
  }

  return roles.map((role) => ({
    id: role.role,
    label: role.label,
    kindLabel: "Rol",
    summary: "Rolul rămâne stabil. Tipul constructiv și configurația pot varia.",
    groups: role.types.map((type) => ({
      id: type.typeId,
      kindLabel: "Tip constructiv",
      title: type.label,
      sections: adminTypeSections(type),
    })),
  }));
}

function typeDetailSections(type: ComponentTypeProjection): CatalogDetailSection[] {
  return [
    {
      id: "general",
      title: "General",
      facts: [
        { label: "Rol", value: "funcție în produs" },
        { label: "Tip constructiv", value: type.label },
        {
          label: "Calcul independent",
          value: type.independentCalculation ? "Da" : "Nu",
        },
      ],
      lines: [type.description],
    },
    ...configurationSections(type.configurations),
    ...(type.technicalSettings.length > 0
      ? [technicalSettingsSection(type.technicalSettings)]
      : []),
    ...calculationInspectionSections(type),
    {
      id: "calculation",
      title: "Calcul",
      facts: [
        { label: "Măsurare", value: type.measurement },
        { label: "Cantitate", value: type.quantity },
      ],
    },
    {
      id: "resources",
      title: "Resurse / cost",
      facts: [{ label: "Cost intern", value: type.eic }],
    },
    ...(type.processRequirements.length > 0
      ? [
          {
            id: "processes",
            title: "Procese necesare",
            lines: type.processRequirements.map((item) => item.label),
          },
        ]
      : []),
    {
      id: "used-by",
      title: "Produse care o folosesc",
      lines:
        type.usedBy.length === 0
          ? ["niciun produs încă"]
          : type.usedBy.map((item) =>
              item.inputNote ? `${item.productLabel} (${item.inputNote})` : item.productLabel,
            ),
    },
    {
      id: "gaps",
      title: "Lipsă",
      lines: type.gaps.length > 0 ? type.gaps : ["Nicio lipsă înregistrată"],
    },
    {
      id: "technical",
      title: "Tehnic",
      technical: true,
      facts: [{ label: "Identitate tip", value: type.typeId }],
    },
  ];
}

function adminTypeSections(type: AdminTypeRecord): CatalogDetailSection[] {
  return [
    {
      id: "general",
      title: "General",
      facts: [
        { label: "Rol", value: type.roleLabel },
        { label: "Tip constructiv", value: type.label },
        {
          label: "Calcul independent",
          value: type.independentCalculation ? "Da" : "Nu",
        },
      ],
      lines: [type.description],
    },
    ...configurationSections(type.configurations),
    ...(type.technicalSettings.length > 0
      ? [technicalSettingsSection(type.technicalSettings)]
      : []),
    ...calculationInspectionSections(type),
    {
      id: "calculation",
      title: "Calcul",
      facts: [
        { label: "Măsurare", value: type.measurement },
        { label: "Cantitate", value: type.quantity },
      ],
    },
    {
      id: "resources",
      title: "Resurse / cost",
      facts: [
        { label: "Cost intern", value: type.resourceReadiness },
        {
          label: "Referințe resursă",
          value:
            type.resourceReferences.length === 0
              ? "nicio referință de resursă"
              : type.resourceReferences.map((item) => item.label).join("; "),
        },
      ],
      lines: ["Tarifele rămân la Resurse / Cost. Procesele nu dețin prețul."],
    },
    ...(type.processReferences.length > 0
      ? [
          {
            id: "processes",
            title: "Procese necesare",
            lines: type.processReferences.map((item) => item.label),
          },
        ]
      : []),
    {
      id: "used-by",
      title: "Produse care o folosesc",
      lines:
        type.usedByLabels.length === 0 ? ["niciun produs încă"] : [...type.usedByLabels],
    },
    {
      id: "gaps",
      title: "Lipsă",
      lines: type.gaps.length > 0 ? type.gaps : ["Nicio lipsă înregistrată"],
    },
    readinessSection(type.readiness),
    {
      id: "technical",
      title: "Tehnic",
      technical: true,
      facts: [{ label: "Identitate tip", value: type.typeId }],
    },
  ];
}

function configurationSections(
  configurations: AdminTypeRecord["configurations"],
): CatalogDetailSection[] {
  if (configurations.length === 0) {
    return [];
  }
  return configurations.map((configuration) => ({
    id: `configuration:${configuration.productCode}`,
    title: "Atribute / configurație",
    facts: configuration.attributes
      .filter((attribute) => attribute.ownership !== "MEASUREMENT")
      .map((attribute) => ({
        label: `${attribute.label} (${attribute.ownershipLabel})`,
        value: attribute.valueDisplay,
      })),
    lines: configuration.attributes
      .filter((attribute) => attribute.kindLabel.includes("Culoare de finisaj"))
      .map(() => "Culoarea aplicată nu este aceeași cu proprietatea optică a materialului."),
  }));
}

function readinessSection(readiness: AdminReadiness): CatalogDetailSection {
  return {
    id: "lifecycle",
    title: "Stare și eligibilitate",
    facts: [
      { label: "Stare", value: readiness.lifecycleLabel },
      { label: "Poate fi retrasă", value: readiness.canRetire ? "Da" : "Nu" },
      { label: "Poate fi ștearsă", value: readiness.canDelete ? "Da" : "Nu" },
    ],
    lines: [
      ...readiness.deleteBlockers.map((item) => `Ștergere blocată: ${item}`),
      ...readiness.retireBlockers.map((item) => `Retragere blocată: ${item}`),
      ...readiness.editClasses.map((item) => adminEditClassLabel(item)),
      ...readiness.futureTransitions,
    ],
  };
}

function lifecycleItem(
  id: string,
  kindLabel: string,
  label: string,
  readiness: AdminReadiness,
): CatalogItem {
  return {
    id,
    label,
    kindLabel,
    groups: [
      {
        id,
        kindLabel,
        title: label,
        sections: [readinessSection(readiness)],
      },
    ],
  };
}

export function buildGovernanceCatalog(
  governance: GovernanceProjection,
): OwnerCatalog {
  const categories: CatalogCategory[] = [
    {
      id: "authority",
      label: "Autoritate și adevăr",
      kindLabel: "Categorie",
      items: [
        {
          id: "owners",
          label: "Cine deține adevărul",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "owners",
              kindLabel: "Secțiune",
              title: "Cine deține adevărul",
              sections: [
                {
                  id: "owners",
                  title: "Autorități",
                  statusLines: governance.authorities.map((item) => ({
                    label: item.label,
                    state: item.state,
                    note: `Deține: ${item.owns.join("; ")}.`,
                  })),
                },
              ],
            },
          ],
        },
        {
          id: "sources",
          label: "Surse de adevăr",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "sources",
              kindLabel: "Secțiune",
              title: "Surse de adevăr",
              sections: [
                {
                  id: "sources",
                  title: "Surse",
                  lines: governance.sources,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "limits",
      label: "Limite și protecții",
      kindLabel: "Categorie",
      items: [
        {
          id: "boundaries",
          label: "Limitele sistemelor",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "boundaries",
              kindLabel: "Secțiune",
              title: "Limitele sistemelor",
              sections: [
                {
                  id: "boundaries",
                  title: "Limite",
                  statusLines: governance.boundaries.map((item) => ({
                    label: item.label,
                    state: item.state,
                    note: item.statement,
                  })),
                },
              ],
            },
          ],
        },
        {
          id: "protection",
          label: "Reguli de protecție",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "protection",
              kindLabel: "Secțiune",
              title: "Reguli de protecție",
              sections: [
                {
                  id: "protection",
                  title: "Reguli",
                  lines: governance.protectionRules,
                },
              ],
            },
          ],
        },
        {
          id: "gates",
          label: "Owner gates",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "gates",
              kindLabel: "Secțiune",
              title: "Owner gates",
              sections: [
                {
                  id: "gates",
                  title: "Gate-uri",
                  lines: governance.ownerGates.map((item) => item.statement),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "maturity",
      label: "Stare și maturitate",
      kindLabel: "Categorie",
      items: [
        {
          id: "roadmap",
          label: "Roadmap",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "roadmap",
              kindLabel: "Secțiune",
              title: "Roadmap",
              sections: [
                {
                  id: "roadmap",
                  title: "Pași",
                  statusLines: governance.roadmap.map((item) => ({
                    label: item.label,
                    state: item.state,
                  })),
                },
              ],
            },
          ],
        },
        {
          id: "freeze",
          label: "Freeze",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "freeze",
              kindLabel: "Secțiune",
              title: governance.freeze.label,
              sections: [
                {
                  id: "freeze",
                  title: "Politică",
                  statusLines: [
                    {
                      label: governance.freeze.label,
                      state: governance.freeze.state,
                      note: governance.freeze.note,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "capabilities",
          label: "Capabilități",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "capabilities",
              kindLabel: "Secțiune",
              title: "Nucleu de capabilități",
              sections: [
                {
                  id: "note",
                  title: "Notă",
                  lines: [governance.capabilityKernelNote],
                },
                {
                  id: "kernel",
                  title: "Status kernel",
                  technical: true,
                  lines: governance.capabilityKernelStatuses.map(
                    (item) => `${item.id}: ${item.status}`,
                  ),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "ui",
      label: "UI și proiecții",
      kindLabel: "Categorie",
      items: [
        {
          id: "ui-rules",
          label: "Reguli UI",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "ui-rules",
              kindLabel: "Secțiune",
              title: "Reguli UI",
              sections: [
                {
                  id: "ui-rules",
                  title: "Reguli",
                  lines: governance.uiRules,
                },
              ],
            },
          ],
        },
        {
          id: "terminology",
          label: "Terminologie",
          kindLabel: "Secțiune",
          groups: [
            {
              id: "terminology",
              kindLabel: "Secțiune",
              title: "Terminologie",
              sections: [
                {
                  id: "terminology",
                  title: "Termeni",
                  lines: [
                    `Termen principal: ${governance.terminology.componentTerm}.`,
                    governance.terminology.moduleNote,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return {
    categories: categories.filter((category) => category.items.length > 0),
  };
}
