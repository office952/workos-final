import {
  isFieldVisible,
  selectedComponentIds,
  type DraftValue,
  type DraftValues,
  type FormField,
  type FormSchema,
  type ProductTemplate,
} from "@workos-final/domain";
import { useId, type KeyboardEvent } from "react";
import { Field } from "./ui/Field";

function SelectChoiceField({
  field,
  value,
  onChange,
  configurator,
}: {
  field: FormField;
  value: DraftValue | undefined;
  onChange: (value: DraftValue) => void;
  configurator: boolean;
}) {
  const labelId = useId();
  const hintId = useId();
  const options = field.options ?? [];
  const selected = typeof value === "string" ? value : "";
  const selectedIndex = options.findIndex((option) => option.value === selected);

  function selectValue(next: string) {
    onChange(next === "" ? null : next);
  }

  function moveSelection(event: KeyboardEvent<HTMLDivElement>, nextIndex: number) {
    const next = options[nextIndex];
    if (!next) {
      return;
    }
    event.preventDefault();
    selectValue(next.value);
    const target = event.currentTarget.querySelector<HTMLElement>(
      `[data-choice-value="${next.value}"]`,
    );
    target?.focus();
  }

  function onGroupKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (options.length === 0) {
      return;
    }
    const focusedValue =
      event.target instanceof HTMLElement ? event.target.dataset.choiceValue : undefined;
    const focusedIndex = options.findIndex((option) => option.value === focusedValue);
    const fromIndex = focusedIndex >= 0 ? focusedIndex : selectedIndex;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        moveSelection(event, fromIndex < 0 ? 0 : (fromIndex + 1) % options.length);
        return;
      case "ArrowLeft":
      case "ArrowUp":
        moveSelection(
          event,
          fromIndex < 0
            ? options.length - 1
            : (fromIndex - 1 + options.length) % options.length,
        );
        return;
      case "Home":
        moveSelection(event, 0);
        return;
      case "End":
        moveSelection(event, options.length - 1);
        return;
      default:
        return;
    }
  }

  return (
    <div className="field field-choice">
      <span id={labelId} className="field-label">
        {field.label}
      </span>
      <select
        id={`field-${field.id}`}
        name={field.id}
        className="choice-select-native"
        tabIndex={-1}
        aria-hidden="true"
        value={selected}
        onChange={(event) => selectValue(event.target.value)}
      >
        <option value="">Alegeți…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={field.hint ? hintId : undefined}
        className={configurator ? "choice-chips cfg-segmented" : "choice-chips"}
        onKeyDown={onGroupKeyDown}
      >
        {options.map((option, index) => {
          const checked = selected === option.value;
          const tabStop = checked || (selected === "" && index === 0);
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={tabStop ? 0 : -1}
              data-choice-value={option.value}
              className={checked ? "choice-chip is-selected" : "choice-chip"}
              onClick={() => selectValue(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {field.hint ? (
        <p id={hintId} className="field-hint">
          {field.hint}
        </p>
      ) : null}
    </div>
  );
}

type FormRendererProps = {
  template: ProductTemplate;
  schema: FormSchema;
  values: DraftValues;
  onChange: (fieldId: string, value: DraftValue) => void;
  includeComponentIds?: readonly string[];
  sectionTitleFor?: (componentId: string, fallback: string) => string;
  presentation?: "default" | "configurator";
};

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: DraftValue | undefined;
  onChange: (value: DraftValue) => void;
}) {
  const id = `field-${field.id}`;

  switch (field.type) {
    case "text":
      return (
        <input
          id={id}
          name={field.id}
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "number":
      return (
        <input
          id={id}
          name={field.id}
          type="number"
          min={field.min}
          value={typeof value === "number" ? value : ""}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next === "" ? null : Number(next));
          }}
        />
      );
    case "select":
      return (
        <select
          id={id}
          name={field.id}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value || null)}
        >
          <option value="">Alegeți…</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "boolean":
      return (
        <input
          id={id}
          name={field.id}
          type="checkbox"
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
        />
      );
    default: {
      const _exhaustive: never = field.type;
      return _exhaustive;
    }
  }
}

export function FormRenderer({
  template,
  schema,
  values,
  onChange,
  includeComponentIds,
  sectionTitleFor,
  presentation = "default",
}: FormRendererProps) {
  const selectedIds = selectedComponentIds(template, values);
  const configurator = presentation === "configurator";

  return (
    <div className={configurator ? "form-stack cfg-form" : "form-stack"}>
      {schema.sections.map((section) => {
        if (
          includeComponentIds &&
          !includeComponentIds.includes(section.componentId)
        ) {
          return null;
        }
        const visibleFields = section.fields.filter((field) =>
          isFieldVisible(field, values, selectedIds),
        );
        if (visibleFields.length === 0) {
          return null;
        }

        const title = sectionTitleFor
          ? sectionTitleFor(section.componentId, section.title)
          : section.title;

        return (
          <fieldset key={section.id} className="form-section">
            {title ? (
              <legend>
                {title}
                {visibleFields.some((field) => field.required) && !configurator
                  ? " – obligatoriu"
                  : ""}
              </legend>
            ) : null}
            <div className="form-section-fields">
              {visibleFields.map((field) => (
                <div
                  key={field.id}
                  className={
                    field.type === "boolean"
                      ? "field-span field-inline"
                      : field.type === "select"
                        ? "field-span"
                        : undefined
                  }
                >
                  {field.type === "select" && field.options && field.options.length > 0 ? (
                    <SelectChoiceField
                      field={field}
                      value={values[field.id]}
                      onChange={(value) => onChange(field.id, value)}
                      configurator={configurator}
                    />
                  ) : (
                    <Field label={field.label} hint={field.hint}>
                      <FieldControl
                        field={field}
                        value={values[field.id]}
                        onChange={(value) => onChange(field.id, value)}
                      />
                    </Field>
                  )}
                  {field.required && isEmptyField(values[field.id]) ? (
                    <p className="cfg-necessary" role="status">
                      NECESAR
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

function isEmptyField(value: DraftValue | undefined): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  return false;
}
