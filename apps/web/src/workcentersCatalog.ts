import type { WorkcentersAdminProjection } from "@workos-final/domain";
import type {
  CatalogChip,
  CatalogDetailSection,
  CatalogItem,
  OwnerCatalog,
} from "./ownerCatalog";

type WorkcenterRecord = WorkcentersAdminProjection["workcenters"][number];
type MachineRecord = WorkcentersAdminProjection["machines"][number];
type CapabilityRecord = WorkcentersAdminProjection["capabilities"][number];

type WorkshopGroup = {
  id: string;
  label: string;
  workcenterIds: readonly string[];
};

const WORKSHOP_GROUPS: readonly WorkshopGroup[] = [
  { id: "cnc", label: "CNC", workcenterIds: ["WC_CNC_ROUTING"] },
  { id: "forming", label: "Formare", workcenterIds: ["WC_LETTER_FORMING"] },
  { id: "welding", label: "Sudură", workcenterIds: ["WC_WELDING"] },
  { id: "metal-cutting", label: "Debitare metal", workcenterIds: ["WC_METAL_CUTTING"] },
  { id: "assembly", label: "Asamblare", workcenterIds: ["WC_ASSEMBLY_01", "WC_ASSEMBLY_02"] },
  { id: "electrical", label: "Electric", workcenterIds: ["WC_LED_ASSEMBLY"] },
  { id: "print", label: "Print", workcenterIds: ["WC_PRINT"] },
  { id: "laminate", label: "Laminare", workcenterIds: ["WC_LAMINATE"] },
  { id: "vinyl", label: "Aplicare folie", workcenterIds: ["WC_VINYL_APPLICATION"] },
  { id: "plotter", label: "Plotter", workcenterIds: ["WC_CUT"] },
  { id: "laser", label: "Laser", workcenterIds: ["WC_LASER_CUTTING"] },
];

export type WorkcentersAdminSummary = {
  zones: number;
  machines: number;
  coveredCapabilities: number;
  withoutProvider: number;
};

export function workcentersAdminSummary(
  admin: WorkcentersAdminProjection,
): WorkcentersAdminSummary {
  return {
    zones: admin.overview.workcenterCount,
    machines: admin.overview.machineCount,
    coveredCapabilities: admin.overview.coveredCapabilityCount,
    withoutProvider: admin.overview.missingCapabilityCount,
  };
}

export function formatWorkcentersAdminSummary(summary: WorkcentersAdminSummary): string {
  return [
    `Zone ${summary.zones}`,
    `Utilaje ${summary.machines}`,
    `Capabilități acoperite ${summary.coveredCapabilities}`,
    `Fără furnizor ${summary.withoutProvider}`,
  ].join(" · ");
}

export function buildWorkcentersCatalog(
  admin: WorkcentersAdminProjection,
): OwnerCatalog {
  const groupedIds = new Set(WORKSHOP_GROUPS.flatMap((group) => [...group.workcenterIds]));
  const leftover = admin.workcenters.filter((item) => !groupedIds.has(item.id));
  return {
    categories: [
      ...WORKSHOP_GROUPS.map((group) => workshopCategory(group, admin)).filter(
        (category) => category.items.length > 0,
      ),
      ...leftover.map((workcenter) => ({
        id: workcenter.id,
        label: workcenter.label,
        kindLabel: "Categorie",
        items: zoneItems(workcenter, machinesInZone(workcenter.id, admin)),
      })),
      gapCategory(admin),
    ].filter((category) => category.items.length > 0),
  };
}

function workshopCategory(
  group: WorkshopGroup,
  admin: WorkcentersAdminProjection,
): OwnerCatalog["categories"][number] {
  const workcenters = group.workcenterIds
    .map((id) => admin.workcenters.find((item) => item.id === id))
    .filter((item): item is WorkcenterRecord => item !== undefined);
  return {
    id: group.id,
    label: group.label,
    kindLabel: "Categorie",
    items: workcenters.flatMap((workcenter) =>
      zoneItems(workcenter, machinesInZone(workcenter.id, admin)),
    ),
  };
}

function zoneItems(
  workcenter: WorkcenterRecord,
  machines: readonly MachineRecord[],
): CatalogItem[] {
  return [workcenterItem(workcenter, machines), ...machines.map(machineItem)];
}

function machinesInZone(
  workcenterId: string,
  admin: WorkcentersAdminProjection,
): MachineRecord[] {
  return admin.machines.filter((item) => item.workcenterId === workcenterId);
}

function workcenterItem(
  workcenter: WorkcenterRecord,
  machines: readonly MachineRecord[],
): CatalogItem {
  const stationKind =
    machines.length === 0 ? "Zonă / post de lucru" : "Zonă / stație";
  const covered = workcenter.capabilityIds.length > 0;
  const manual = isManualArea(workcenter.id);
  return {
    id: `workcenter:${workcenter.id}`,
    label: workcenter.label,
    kindLabel: stationKind,
    summary: workcenter.description,
    listHint: covered
      ? "Acoperită"
      : machines.length === 0
        ? "Fără utilaj"
        : `${machines.length} utilaje`,
    chips: [
      { label: "Zonă", tone: "neutral" },
      ...(manual ? [{ label: "Zonă manuală", tone: "progress" as const }] : []),
      ...(covered ? [{ label: "Acoperită", tone: "ok" as const }] : []),
    ],
    groups: [
      {
        id: workcenter.id,
        kindLabel: stationKind,
        title: workcenter.label,
        chips: [
          { label: "Zonă", tone: "neutral" },
          ...(manual ? [{ label: "Zonă manuală", tone: "progress" as const }] : []),
          ...(covered ? [{ label: "Acoperită", tone: "ok" as const }] : []),
        ],
        sections: workcenterSections(workcenter, machines, stationKind),
      },
    ],
  };
}

function workcenterSections(
  workcenter: WorkcenterRecord,
  machines: readonly MachineRecord[],
  stationKind: string,
): CatalogDetailSection[] {
  return [
    {
      id: "provider",
      title: "Zonă",
      facts: [
        { label: "Tip", value: stationKind, emphasize: true },
        {
          label: "Poate face",
          value:
            workcenter.capabilityLabels.length === 0
              ? "nicio capabilitate directă"
              : workcenter.capabilityLabels.join("; "),
        },
        {
          label: "Utilaje în zonă",
          value:
            machines.length === 0
              ? "niciun utilaj"
              : machines.map((item) => item.label).join("; "),
        },
        {
          label: "Procese susținute",
          value:
            workcenter.processLabels.length === 0
              ? "niciun proces încă"
              : workcenter.processLabels.join("; "),
        },
      ],
      lines: [
        "Zona spune unde se lucrează. Utilajul spune cu ce. Capabilitatea spune ce poate furniza.",
        "Procesele rămân în Procese operaționale. Costul intern rămâne în Resurse. Oamenii rămân în Oameni.",
        isManualArea(workcenter.id)
          ? "Zona manuală nu este poartă de start. Lipsa mesei sau a postului nu blochează un task manual eligibil."
          : machines.length > 1
            ? "Utilajele din aceeași zonă nu sunt interschimbabile dacă au capabilități diferite."
            : "Programarea și starea ocupat / liber nu sunt aici.",
      ],
    },
    {
      id: "used-by",
      title: "Folosit de",
      lines:
        workcenter.usedBy.length === 0
          ? ["nicio utilizare derivată încă"]
          : [...workcenter.usedBy],
    },
    {
      id: "details",
      title: "Detalii",
      technical: true,
      facts: [
        { label: "Identitate zonă", value: workcenter.id },
        { label: "Stare", value: workcenter.lifecycleLabel },
        ...(workcenter.capabilityIds.length > 0
          ? [
              {
                label: "Identități capabilitate",
                value: workcenter.capabilityIds.join("; "),
              },
            ]
          : []),
      ],
    },
  ];
}

function machineItem(machine: MachineRecord): CatalogItem {
  const required = isMachineRequired(machine.capabilityIds);
  return {
    id: `machine:${machine.id}`,
    label: machine.label,
    kindLabel: "Utilaj",
    summary: machine.description,
    listHint: machine.workcenterLabel ?? "Acoperită",
    chips: [
      { label: "Utilaj", tone: "neutral" },
      ...(required ? [{ label: "Obligatoriu la start", tone: "warn" as const }] : []),
      { label: "Acoperită", tone: "ok" },
    ],
    groups: [
      {
        id: machine.id,
        kindLabel: "Utilaj",
        title: machine.label,
        chips: [
          { label: "Utilaj", tone: "neutral" },
          ...(required ? [{ label: "Obligatoriu la start", tone: "warn" as const }] : []),
          { label: "Acoperită", tone: "ok" },
        ],
        sections: machineSections(machine),
      },
    ],
  };
}

function machineSections(machine: MachineRecord): CatalogDetailSection[] {
  return [
    {
      id: "provider",
      title: "Utilaj",
      facts: [
        { label: "Tip", value: "Utilaj", emphasize: true },
        { label: "Zonă", value: machine.workcenterLabel ?? "fără zonă" },
        {
          label: "Poate face",
          value:
            machine.capabilityLabels.length === 0
              ? "nicio capabilitate"
              : machine.capabilityLabels.join("; "),
        },
        {
          label: "Procese susținute",
          value:
            machine.processLabels.length === 0
              ? "niciun proces încă"
              : machine.processLabels.join("; "),
        },
      ],
      lines: [
        "Utilajul furnizează capabilitatea. Procesul nu alege utilajul din produs.",
        "Fața și spatele sunt roluri de componentă, nu utilaje separate.",
        isMachineRequired(machine.capabilityIds)
          ? "Debitarea CNC și formarea cer un utilaj eligibil. Fără el, taskul rămâne blocat."
          : "Programarea și starea ocupat / liber nu sunt aici.",
      ],
    },
    {
      id: "used-by",
      title: "Folosit de",
      lines:
        machine.usedBy.length === 0
          ? ["nicio utilizare derivată încă"]
          : [...machine.usedBy],
    },
    {
      id: "details",
      title: "Detalii",
      technical: true,
      facts: [
        { label: "Identitate utilaj", value: machine.id },
        { label: "Stare", value: machine.lifecycleLabel },
        ...(machine.capabilityIds.length > 0
          ? [
              {
                label: "Identități capabilitate",
                value: machine.capabilityIds.join("; "),
              },
            ]
          : []),
        ...(machine.recipeRows.length > 0
          ? [
              {
                label: "Stare rețetă / cost",
                value: machine.recipeRows
                  .map((item) =>
                    item.processLabel
                      ? `${item.processLabel}: ${item.stateLabel}`
                      : `${item.capabilityLabel}: ${item.stateLabel}`,
                  )
                  .join("; "),
              },
            ]
          : []),
      ],
    },
  ];
}

function gapCategory(
  admin: WorkcentersAdminProjection,
): OwnerCatalog["categories"][number] {
  return {
    id: "gaps",
    label: "Fără furnizor",
    kindLabel: "Categorie",
    items: admin.capabilities
      .filter((item) => item.coverage === "NO_PROVIDER")
      .map(gapItem),
  };
}

function gapItem(capability: CapabilityRecord): CatalogItem {
  return {
    id: `gap:${capability.id}`,
    label: capability.label,
    kindLabel: "Capabilitate",
    summary: capability.description,
    listHint: "Fără furnizor",
    chips: coverageChips("NO_PROVIDER", capability.coverageLabel),
    groups: [
      {
        id: capability.id,
        kindLabel: "Capabilitate",
        title: capability.label,
        chips: coverageChips("NO_PROVIDER", capability.coverageLabel),
        sections: [
          {
            id: "gap",
            title: "Acoperire",
            facts: [
              { label: "Acoperire", value: capability.coverageLabel, emphasize: true },
              { label: "Furnizori actuali", value: "Fără furnizor configurat" },
              {
                label: "Procese care o cer",
                value:
                  capability.requiredByProcesses.length === 0
                    ? "niciun proces încă"
                    : capability.requiredByProcesses.map((item) => item.label).join("; "),
              },
            ],
            lines: [
              "Lipsa furnizorului este afișată onest. Nu inventăm o zonă sau un utilaj ca să fie totul acoperit.",
            ],
          },
          {
            id: "details",
            title: "Detalii",
            technical: true,
            facts: [{ label: "Identitate capabilitate", value: capability.id }],
          },
        ],
      },
    ],
  };
}

function isManualArea(workcenterId: string): boolean {
  return (
    workcenterId === "WC_ASSEMBLY_01" ||
    workcenterId === "WC_ASSEMBLY_02" ||
    workcenterId === "WC_LED_ASSEMBLY"
  );
}

function isMachineRequired(capabilityIds: readonly string[]): boolean {
  return capabilityIds.some((id) => id === "CNC_ROUTING" || id === "PROFILE_FORMING");
}

function coverageChips(
  coverage: CapabilityRecord["coverage"],
  label: string,
): CatalogChip[] {
  switch (coverage) {
    case "COVERED":
      return [{ label, tone: "ok" }];
    case "NO_PROVIDER":
      return [{ label, tone: "warn" }];
    case "PROVIDER_PLANNED":
      return [{ label, tone: "neutral" }];
    default: {
      const _exhaustive: never = coverage;
      return _exhaustive;
    }
  }
}
