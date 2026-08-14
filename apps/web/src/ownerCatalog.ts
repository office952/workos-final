import type {
  ComponentRoleProjection,
  GovernanceProjection,
  ImplementationState,
} from "@workos-final/domain";

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
          groups: role.variants.map((variant) => ({
            id: variant.variantId,
            kindLabel: "Variantă",
            title: variant.label,
            sections: [
              {
                id: "general",
                title: "General",
                facts: [
                  { label: "Variantă", value: variant.label },
                  {
                    label: "Calcul independent",
                    value: variant.independentCalculation ? "Da" : "Nu",
                  },
                ],
              },
              ...(variant.technicalSettings.length > 0
                ? [
                    {
                      id: "technical-settings",
                      title: "Setări tehnice",
                      settingLines: variant.technicalSettings.map((setting) => ({
                        label: setting.label,
                        valueDisplay: setting.valueDisplay,
                        statusLabel: setting.statusLabel,
                        sourceLabel: setting.sourceLabel,
                        administrationLabel: setting.administrationLabel,
                      })),
                    },
                  ]
                : []),
              {
                id: "calculation",
                title: "Calcul",
                facts: [
                  { label: "Măsurare", value: variant.measurement },
                  { label: "Cantitate", value: variant.quantity },
                ],
              },
              {
                id: "resources",
                title: "Resurse / cost",
                facts: [{ label: "Cost intern", value: variant.eic }],
              },
              {
                id: "used-by",
                title: "Produse care o folosesc",
                lines:
                  variant.usedBy.length === 0
                    ? ["niciun produs încă"]
                    : variant.usedBy.map((item) =>
                        item.inputNote
                          ? `${item.productLabel} (${item.inputNote})`
                          : item.productLabel,
                      ),
              },
              {
                id: "gaps",
                title: "Lipsă",
                lines:
                  variant.gaps.length > 0
                    ? variant.gaps
                    : ["Nicio lipsă înregistrată"],
              },
              {
                id: "technical",
                title: "Tehnic",
                technical: true,
                facts: [
                  { label: "Rol", value: role.role },
                  { label: "Variantă internă", value: variant.variantId },
                ],
              },
            ],
          })),
        })),
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
