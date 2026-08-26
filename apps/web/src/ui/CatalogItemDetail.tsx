import type { ReactNode } from "react";
import type { CatalogChip, CatalogItem } from "../ownerCatalog";
import { StatePill } from "../StatePill";
import { StatusChip } from "./StatusChip";

export function CatalogItemDetail({
  item,
  actions,
}: {
  item: CatalogItem;
  actions?: ReactNode;
}) {
  return (
    <article className="owner-catalog-detail">
      <p className="catalog-kind">{item.kindLabel}</p>
      <h2>{item.label}</h2>
      <ChipRow chips={item.chips} />
      {item.summary ? <p className="page-lead">{item.summary}</p> : null}
      {actions}
      {item.groups.map((group) => {
        const hideChrome = group.title === item.label;
        return (
          <div
            key={group.id}
            className={hideChrome ? "owner-catalog-group is-inline" : "owner-catalog-group"}
          >
            {hideChrome ? null : (
              <>
                <p className="catalog-kind">{group.kindLabel}</p>
                <h3>{group.title}</h3>
                <ChipRow chips={group.chips} />
              </>
            )}
            {group.sections.map((section) =>
              section.technical ? (
                <details key={section.id}>
                  <summary>{section.title}</summary>
                  <SectionBody section={section} />
                </details>
              ) : (
                <CatalogSection
                  key={section.id}
                  title={section.title}
                  headingLevel={hideChrome ? "h3" : "h4"}
                  section={section}
                />
              ),
            )}
          </div>
        );
      })}
    </article>
  );
}

function CatalogSection({
  title,
  headingLevel,
  section,
}: {
  title: string;
  headingLevel: "h3" | "h4";
  section: CatalogItem["groups"][number]["sections"][number];
}) {
  const Heading = headingLevel;
  return (
    <div className="owner-catalog-section">
      <Heading className="owner-catalog-section-title">{title}</Heading>
      <SectionBody section={section} />
    </div>
  );
}

function ChipRow({ chips }: { chips?: readonly CatalogChip[] }) {
  if (!chips || chips.length === 0) {
    return null;
  }
  return (
    <p className="owner-catalog-chips">
      {chips.map((chip) => (
        <StatusChip key={chip.label} label={chip.label} tone={chip.tone} />
      ))}
    </p>
  );
}

function SectionBody({
  section,
}: {
  section: CatalogItem["groups"][number]["sections"][number];
}) {
  return (
    <>
      {section.facts ? (
        <dl className="owner-catalog-facts">
          {section.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd className={fact.emphasize ? "is-emphasis" : undefined}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {section.lines ? (
        <ul>
          {section.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      {section.statusLines ? (
        <ul className="authority-list">
          {section.statusLines.map((line) => (
            <li key={line.label}>
              <div className="authority-head">
                <strong>{line.label}</strong>
                {line.state ? <StatePill state={line.state} /> : null}
              </div>
              {line.note ? <p>{line.note}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {section.settingLines ? (
        <ul className="authority-list">
          {section.settingLines.map((line) => (
            <li key={line.label}>
              <div className="authority-head">
                <strong>{line.label}</strong>
                <span
                  className={
                    line.statusLabel === "Setat"
                      ? "state-pill state-implemented"
                      : "state-pill state-planned"
                  }
                >
                  {line.statusLabel}
                </span>
              </div>
              <p className="owner-catalog-setting-value">{line.valueDisplay}</p>
              <p>
                {line.sourceLabel}. {line.administrationLabel}.
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
