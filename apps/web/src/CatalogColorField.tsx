import type { CatalogColorOption, DraftValue } from "@workos-final/domain";
import { useId, useMemo, useState, type KeyboardEvent } from "react";

export function CatalogColorField({
  fieldId,
  label,
  value,
  colors,
  required,
  invalid,
  onChange,
  configurator,
}: {
  fieldId: string;
  label: string;
  value: DraftValue | undefined;
  colors: readonly CatalogColorOption[];
  required: boolean;
  invalid: boolean;
  onChange: (value: DraftValue) => void;
  configurator: boolean;
}) {
  const labelId = useId();
  const searchId = useId();
  const listId = useId();
  const summaryId = useId();
  const errorId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedId = typeof value === "string" ? value : "";
  const selected = colors.find((item) => item.id === selectedId);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return colors;
    }
    return colors.filter(
      (item) =>
        item.code.toLowerCase().includes(needle) ||
        item.displayName.toLowerCase().includes(needle),
    );
  }, [colors, query]);

  function choose(id: string) {
    onChange(id);
    setOpen(false);
    setQuery("");
  }

  function focusColorOption(from: HTMLElement, index: number) {
    const options = from.parentElement?.querySelectorAll<HTMLElement>("[data-color-option]");
    options?.[index]?.focus();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      const item = filtered[index];
      if (item) {
        event.preventDefault();
        choose(item.id);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusColorOption(event.currentTarget, index + 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index === 0) {
        document.getElementById(searchId)?.focus();
        return;
      }
      focusColorOption(event.currentTarget, index - 1);
    }
  }

  return (
    <div
      className={
        configurator && invalid
          ? "field field-catalog-color field-invalid"
          : "field field-catalog-color"
      }
    >
      <span
        id={labelId}
        className="field-label"
        data-required={configurator && required ? "" : undefined}
      >
        {label}
      </span>
      <button
        type="button"
        className="cfg-color-summary"
        aria-labelledby={`${labelId} ${summaryId}`}
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-describedby={invalid ? errorId : undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className="cfg-color-swatch"
          style={{ background: selected?.swatch || "#d7d3cc" }}
          aria-hidden="true"
        />
        <span id={summaryId} className="cfg-color-copy">
          {selected ? (
            <>
              <strong>{selected.code}</strong>
              <span> — {selected.displayName}</span>
            </>
          ) : (
            "Alegeți culoarea…"
          )}
        </span>
      </button>
      {open ? (
        <div className="cfg-color-popover" id={listId}>
          <label className="visually-hidden" htmlFor={searchId}>
            Caută culoare după cod sau nume
          </label>
          <input
            id={searchId}
            className="cfg-color-search"
            type="search"
            value={query}
            placeholder="Cod sau nume"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
              }
              if (event.key === "ArrowDown") {
                event.preventDefault();
                event.currentTarget.parentElement
                  ?.querySelector<HTMLElement>("[data-color-option]")
                  ?.focus();
              }
            }}
          />
          <div role="listbox" aria-labelledby={labelId} className="cfg-color-list">
            {filtered.map((item, index) => {
              const checked = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  data-color-option={item.id}
                  aria-selected={checked}
                  className={checked ? "cfg-color-option is-selected" : "cfg-color-option"}
                  onClick={() => choose(item.id)}
                  onKeyDown={(event) => onOptionKeyDown(event, index)}
                >
                  <span
                    className="cfg-color-swatch"
                    style={{ background: item.swatch }}
                    aria-hidden="true"
                  />
                  <span className="cfg-color-copy">
                    <strong>{item.code}</strong>
                    <span> — {item.displayName}</span>
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 ? (
              <p className="cfg-color-empty" role="status">
                Nicio culoare nu corespunde căutării.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      {invalid ? (
        <p id={errorId} className="field-error" role="alert">
          Completează acest câmp.
        </p>
      ) : null}
      <input type="hidden" name={fieldId} value={selectedId} readOnly />
    </div>
  );
}
