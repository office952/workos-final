import type { ReactNode } from "react";

export function Ui20RegistryToolbar({
  filterLabel,
  filters,
  searchLabel,
  searchPlaceholder,
  query,
  onQueryChange,
  countLabel,
  trailing,
}: {
  filterLabel: string;
  filters: ReactNode;
  searchLabel: string;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (next: string) => void;
  countLabel: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="ui20-registry-toolbar">
      <div className="ui20-registry-toolbar-primary">
        <div className="ui20-filter-row" role="group" aria-label={filterLabel}>
          {filters}
        </div>
        <p className="ui20-registry-count">{countLabel}</p>
      </div>
      <label className="ui20-registry-search">
        <span className="visually-hidden">{searchLabel}</span>
        <input
          type="search"
          value={query}
          placeholder={searchPlaceholder}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      {trailing}
    </div>
  );
}

export function Ui20FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="ui20-filter-chip"
      aria-pressed={pressed}
      data-selected={pressed ? "true" : "false"}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
