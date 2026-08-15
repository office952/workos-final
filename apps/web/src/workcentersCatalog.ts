import type { WorkcentersAdminProjection } from "@workos-final/domain";
import type { CatalogDetailSection, CatalogItem, OwnerCatalog } from "./ownerCatalog";

export function buildWorkcentersCatalog(
  admin: WorkcentersAdminProjection,
): OwnerCatalog {
  return {
    categories: [
      {
        id: "overview",
        label: "Prezentare",
        kindLabel: "Categorie",
        items: [overviewItem(admin)],
      },
      {
        id: "workcenters",
        label: "Zone / Workcenters",
        kindLabel: "Categorie",
        items:
          admin.workcenters.length === 0
            ? [emptyProviderItem("workcenter-empty", "Nicio zonă confirmată", "workcenter")]
            : admin.workcenters.map(workcenterItem),
      },
      {
        id: "machines",
        label: "Utilaje",
        kindLabel: "Categorie",
        items:
          admin.machines.length === 0
            ? [emptyProviderItem("machine-empty", "Niciun utilaj confirmat", "machine")]
            : admin.machines.map(machineItem),
      },
      {
        id: "capabilities",
        label: "Capabilități",
        kindLabel: "Categorie",
        items: admin.capabilities.map(capabilityItem),
      },
      {
        id: "coverage",
        label: "Acoperire procese",
        kindLabel: "Categorie",
        items: [
          lettersCoverageItem(admin),
          ...admin.lettersCoverage.compositions.map((composition) =>
            compositionCoverageItem(composition),
          ),
        ],
      },
    ],
  };
}

function overviewItem(admin: WorkcentersAdminProjection): CatalogItem {
  return {
    id: "overview",
    label: "Utilaje și capacitate",
    kindLabel: "Domeniu",
    summary: "Cine / unde poate furniza o capabilitate de producție.",
    groups: [
      {
        id: "overview",
        kindLabel: "Domeniu",
        title: "Utilaje și capacitate",
        sections: [
          {
            id: "identity",
            title: "Stare fundație",
            facts: [
              { label: "Zone confirmate", value: String(admin.overview.workcenterCount) },
              { label: "Utilaje confirmate", value: String(admin.overview.machineCount) },
              {
                label: "Capabilități acoperite",
                value: String(admin.overview.coveredCapabilityCount),
              },
              {
                label: "Capabilități fără furnizor",
                value: String(admin.overview.missingCapabilityCount),
              },
            ],
            lines: [
              "Procesul cere o capabilitate. Workcenter sau utilajul o furnizează. Execuția alege ulterior furnizorul.",
              "Planificarea de capacitate nu este implementată. Acest catalog nu spune dacă un job poate rula acum.",
            ],
          },
          {
            id: "boundaries",
            title: "Limite",
            facts: [
              { label: "Planificare capacitate", value: "Neimplementat" },
              { label: "Programare", value: "Neimplementat" },
              { label: "Execuție", value: "Neimplementat" },
              { label: "Write administrare", value: "Neimplementat" },
            ],
            lines: [
              "Nu există ore-mașină, calendar de disponibilitate, limită de sarcini sau limită de angajați.",
              "Cele două mese de asamblare sunt zone canonice. Lucrul manual poate avea loc și în altă parte în hală, fără a modela locuri ad-hoc.",
              "Utilajele rămân neconfirmate. Nu inventăm CNC sau cabină de vopsit.",
            ],
          },
        ],
      },
    ],
  };
}

function emptyProviderItem(
  id: string,
  label: string,
  kind: "workcenter" | "machine",
): CatalogItem {
  return {
    id,
    label,
    kindLabel: kind === "workcenter" ? "Zonă / workcenter" : "Utilaj",
    summary:
      kind === "workcenter"
        ? "Nicio zonă de producție nu are încă identitate confirmată."
        : "Niciun utilaj concret nu are încă identitate confirmată.",
    groups: [
      {
        id,
        kindLabel: kind === "workcenter" ? "Zonă / workcenter" : "Utilaj",
        title: label,
        sections: [
          {
            id: "empty",
            title: "Lipsă identitate",
            lines: [
              kind === "workcenter"
                ? "Un workcenter este o zonă sau o stație, nu un alt nume pentru utilaj."
                : "Un utilaj este un echipament concret. Nu creăm utilaje fictive pentru munca manuală.",
              "Acoperirea rămâne «Fără furnizor» până există evidență confirmată.",
            ],
          },
        ],
      },
    ],
  };
}

function workcenterItem(
  workcenter: WorkcentersAdminProjection["workcenters"][number],
): CatalogItem {
  return {
    id: `workcenter:${workcenter.id}`,
    label: workcenter.label,
    kindLabel: "Zonă / workcenter",
    summary: workcenter.description,
    groups: [
      {
        id: workcenter.id,
        kindLabel: "Zonă / workcenter",
        title: workcenter.label,
        sections: [
          {
            id: "identity",
            title: "Identitate",
            facts: [
              { label: "Stare", value: workcenter.lifecycleLabel },
              {
                label: "Capabilități",
                value:
                  workcenter.capabilityLabels.length === 0
                    ? "nicio capabilitate"
                    : workcenter.capabilityLabels.join("; "),
              },
              {
                label: "Procese care o cer",
                value:
                  workcenter.processLabels.length === 0
                    ? "niciun proces încă"
                    : workcenter.processLabels.join("; "),
              },
              {
                label: "Utilaje în zonă",
                value:
                  workcenter.machineLabels.length === 0
                    ? "niciun utilaj"
                    : workcenter.machineLabels.join("; "),
              },
            ],
            lines: [workcenter.description],
          },
          {
            id: "used-by",
            title: "Cerut de",
            lines:
              workcenter.usedBy.length === 0
                ? ["nicio utilizare derivată încă"]
                : [...workcenter.usedBy],
          },
          {
            id: "technical",
            title: "Tehnic",
            technical: true,
            facts: [{ label: "Identitate zonă", value: workcenter.id }],
          },
        ],
      },
    ],
  };
}

function machineItem(
  machine: WorkcentersAdminProjection["machines"][number],
): CatalogItem {
  return {
    id: `machine:${machine.id}`,
    label: machine.label,
    kindLabel: "Utilaj",
    summary: machine.description,
    groups: [
      {
        id: machine.id,
        kindLabel: "Utilaj",
        title: machine.label,
        sections: [
          {
            id: "identity",
            title: "Identitate",
            facts: [
              { label: "Stare", value: machine.lifecycleLabel },
              { label: "Zonă", value: machine.workcenterLabel ?? "fără zonă" },
              {
                label: "Capabilități",
                value:
                  machine.capabilityLabels.length === 0
                    ? "nicio capabilitate"
                    : machine.capabilityLabels.join("; "),
              },
            ],
            lines: [machine.description],
          },
          {
            id: "used-by",
            title: "Cerut de",
            lines:
              machine.usedBy.length === 0
                ? ["nicio utilizare derivată încă"]
                : [...machine.usedBy],
          },
          {
            id: "technical",
            title: "Tehnic",
            technical: true,
            facts: [{ label: "Identitate utilaj", value: machine.id }],
          },
        ],
      },
    ],
  };
}

function capabilityItem(
  capability: WorkcentersAdminProjection["capabilities"][number],
): CatalogItem {
  return {
    id: `capability:${capability.id}`,
    label: capability.label,
    kindLabel: "Clasă de capabilitate",
    summary: capability.description,
    groups: [
      {
        id: capability.id,
        kindLabel: "Clasă de capabilitate",
        title: capability.label,
        sections: [
          {
            id: "identity",
            title: "Identitate",
            facts: [
              { label: "Fel", value: capability.kindLabel },
              { label: "Acoperire catalog", value: capability.coverageLabel },
              {
                label: "Furnizori",
                value:
                  capability.providers.length === 0
                    ? "niciun furnizor confirmat"
                    : capability.providers
                        .map((item) => `${item.kindLabel}: ${item.label}`)
                        .join("; "),
              },
              {
                label: "Procese care o cer",
                value:
                  capability.requiredByProcesses.length === 0
                    ? "niciun proces încă"
                    : capability.requiredByProcesses.map((item) => item.label).join("; "),
              },
            ],
            lines: [
              capability.description,
              "Acoperirea înseamnă că există un furnizor în catalog, nu că un job poate fi executat acum.",
            ],
          },
          {
            id: "technical",
            title: "Tehnic",
            technical: true,
            facts: [{ label: "Identitate capabilitate", value: capability.id }],
          },
        ],
      },
    ],
  };
}

function lettersCoverageItem(admin: WorkcentersAdminProjection): CatalogItem {
  return {
    id: "letters-coverage",
    label: "Letters — acoperire capabilități",
    kindLabel: "Acoperire",
    summary: "Comparație între cererea traseului Letters și furnizorii actuali.",
    groups: [
      {
        id: "letters-coverage",
        kindLabel: "Acoperire",
        title: "Letters — acoperire capabilități",
        sections: [
          {
            id: "status",
            title: "Acoperire catalog",
            facts: [
              {
                label: "Acoperite",
                value: coverageList(admin.lettersCoverage.coveredCapabilityIds, admin),
              },
              {
                label: "Planificate",
                value: coverageList(admin.lettersCoverage.plannedCapabilityIds, admin),
              },
              {
                label: "Fără furnizor",
                value: coverageList(admin.lettersCoverage.missingCapabilityIds, admin),
              },
            ],
            lines: [
              "Aceasta este acoperire de catalog, nu pregătire de execuție.",
              "Lipsa furnizorului este afișată onest. Nu inventăm zone sau utilaje ca să fie totul verde.",
            ],
          },
        ],
      },
    ],
  };
}

function compositionCoverageItem(
  composition: WorkcentersAdminProjection["lettersCoverage"]["compositions"][number],
): CatalogItem {
  return {
    id: `coverage:${composition.inspectionId}`,
    label: composition.label,
    kindLabel: "Traseu Letters",
    summary: "Proces → capabilitate → furnizor actual.",
    groups: [
      {
        id: composition.inspectionId,
        kindLabel: "Traseu Letters",
        title: composition.label,
        sections: composition.processes.map(
          (process): CatalogDetailSection => ({
            id: process.processId,
            title: process.processLabel,
            facts: [
              { label: "Capabilitate", value: process.capabilityLabel },
              { label: "Acoperire", value: process.coverageLabel },
              {
                label: "Furnizori",
                value:
                  process.providers.length === 0
                    ? "niciun furnizor"
                    : process.providers.map((item) => item.label).join("; "),
              },
            ],
          }),
        ),
      },
    ],
  };
}

function coverageList(
  ids: readonly string[],
  admin: WorkcentersAdminProjection,
): string {
  if (ids.length === 0) {
    return "niciuna";
  }
  return ids
    .map((id) => admin.capabilities.find((item) => item.id === id)?.label ?? id)
    .join("; ");
}
