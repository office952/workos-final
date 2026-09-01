import type { ReactNode } from "react";
import { Field } from "./ui/Field";

type RegistrySearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  resultSummary?: string | null;
  hideLabel?: boolean;
  leadingIcon?: ReactNode;
};

export function RegistrySearchField({
  label,
  placeholder,
  value,
  onChange,
  resultSummary,
  hideLabel = false,
  leadingIcon,
}: RegistrySearchFieldProps) {
  return (
    <div className="registry-search">
      <Field label={label} hideLabel={hideLabel}>
        <div className="registry-search-controls">
          {leadingIcon ? (
            <span className="registry-search-icon" aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            enterKeyHint="search"
          />
          {value ? (
            <button
              type="button"
              className="button-quiet registry-search-clear"
              onClick={() => onChange("")}
            >
              Șterge
            </button>
          ) : null}
        </div>
      </Field>
      {resultSummary ? <p className="registry-search-summary">{resultSummary}</p> : null}
    </div>
  );
}

export function registrySearchResultSummary(input: {
  visibleCount: number;
  poolCount: number;
  totalCount: number;
  query: string;
  nounPlural: string;
}): string | null {
  if (input.totalCount === 0) {
    return null;
  }
  const searching = input.query.trim().length > 0;
  if (!searching && input.visibleCount === input.totalCount) {
    return null;
  }
  if (searching) {
    return `${input.visibleCount} din ${input.poolCount} ${input.nounPlural}`;
  }
  return `${input.visibleCount} din ${input.totalCount} ${input.nounPlural}`;
}
