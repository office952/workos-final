import {
  isFieldVisible,
  projectProductConfigurationOptions,
  selectedComponentIds,
  type DraftValue,
  type DraftValues,
  type FormField,
  type FormSchema,
  type ProductConfigurationOptions,
  type ProductTemplate,
} from "@workos-final/domain";
import { useId, type KeyboardEvent } from "react";
import { CatalogColorField } from "./CatalogColorField";
import {
  fieldUnitFromLabel,
  projectVisualLabel,
} from "./configurator/configuratorPresentation";
import { Field } from "./ui/Field";

function SelectChoiceField({
  field,
  value,
  onChange,
  configurator,
  invalid,
}: {
  field: FormField;
  value: DraftValue | undefined;
  onChange: (value: DraftValue) => void;
  configurator: boolean;
  invalid: boolean;
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
    target?.focus({ preventScroll: true });
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

  const visibleLabel = configurator ? projectVisualLabel(field.label) : field.label;

  return (
    <div className={configurator && invalid ? "field field-choice field-invalid" : "field field-choice"}>
      <span
        id={labelId}
        className="field-label"
        data-visual={configurator ? visibleLabel : undefined}
        data-required={configurator && field.required ? "" : undefined}
      >
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
        aria-describedby={
          [field.hint ? hintId : null, invalid ? `${hintId}-error` : null]
            .filter((id): id is string => id !== null)
            .join(" ") || undefined
        }
        aria-invalid={invalid || undefined}
        aria-required={field.required || undefined}
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
        <p id={hintId} className={configurator ? "field-hint visually-hidden" : "field-hint"}>
          {field.hint}
        </p>
      ) : null}
      {invalid ? (
        <p id={`${hintId}-error`} className="field-error" role="alert">
          Completează acest câmp.
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
  invalidFieldIds?: readonly string[];
  configurationOptions?: ProductConfigurationOptions | null;
};

function resolvePresentedField(
  field: FormField,
  options: ProductConfigurationOptions | null,
): FormField {
  const selectOptions = options?.selectOptions[field.id];
  if (selectOptions) {
    return { ...field, options: selectOptions };
  }
  if (field.type === "catalog_roll") {
    const rolls = options?.catalogRolls[field.id] ?? [];
    return {
      ...field,
      type: "select",
      options: rolls.map((item) => ({ value: item.id, label: item.label })),
    };
  }
  return field;
}

function FieldControl({
  field,
  value,
  onChange,
  ...controlProps
}: {
  field: FormField;
  value: DraftValue | undefined;
  onChange: (value: DraftValue) => void;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
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
          {...controlProps}
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
          {...controlProps}
        />
      );
    case "select":
      return (
        <select
          id={id}
          name={field.id}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value || null)}
          {...controlProps}
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
          {...controlProps}
        />
      );
    case "catalog_color":
    case "catalog_roll":
      return null;
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
  invalidFieldIds = [],
  configurationOptions,
}: FormRendererProps) {
  const selectedIds = selectedComponentIds(template, values);
  const configurator = presentation === "configurator";
  const invalidIds = new Set(invalidFieldIds);
  const options =
    configurationOptions ?? projectProductConfigurationOptions(template, values);

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
              {groupConfiguratorFields(visibleFields, configurator).map((row) => (
                <div
                  key={row.map((field) => field.id).join(":")}
                  className={
                    row.length > 1
                      ? "cfg-field-row"
                      : row[0]?.type === "boolean"
                        ? "field-span field-inline"
                        : row[0]?.type === "select"
                          ? "field-span"
                          : undefined
                  }
                >
                  {row.map((field) => {
                    const presented = resolvePresentedField(field, options);
                    const missing = field.required && isEmptyField(values[field.id]);
                    const invalid = configurator && invalidIds.has(field.id);
                    return (
                    <div key={field.id}>
                      {field.type === "catalog_color" ? (
                        <CatalogColorField
                          fieldId={field.id}
                          label={configurator ? projectVisualLabel(field.label) : field.label}
                          value={values[field.id]}
                          colors={options?.catalogColors[field.id] ?? []}
                          required={field.required}
                          invalid={invalid}
                          configurator={configurator}
                          onChange={(value) => onChange(field.id, value)}
                        />
                      ) : presented.type === "select" &&
                        presented.options &&
                        presented.options.length > 0 ? (
                        <SelectChoiceField
                          field={presented}
                          value={values[field.id]}
                          onChange={(value) => onChange(field.id, value)}
                          configurator={configurator}
                          invalid={invalid}
                        />
                      ) : (
                        <Field
                          label={field.label}
                          hint={configurator ? undefined : field.hint}
                          error={invalid ? "Completează acest câmp." : undefined}
                          hideLabel={false}
                          required={configurator && field.required}
                          visibleLabel={
                            configurator ? projectVisualLabel(field.label) : undefined
                          }
                          suffix={
                            configurator ? fieldUnitFromLabel(field.label) ?? undefined : undefined
                          }
                        >
                          <FieldControl
                            field={field}
                            value={values[field.id]}
                            onChange={(value) => onChange(field.id, value)}
                          />
                        </Field>
                      )}
                      {!configurator && missing ? (
                        <p className="cfg-necessary" role="status">
                          NECESAR
                        </p>
                      ) : null}
                    </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

function groupConfiguratorFields(
  fields: readonly FormField[],
  configurator: boolean,
): FormField[][] {
  if (!configurator) {
    return fields.map((field) => [field]);
  }
  const rows: FormField[][] = [];
  for (let index = 0; index < fields.length; index += 1) {
    const current = fields[index];
    const next = fields[index + 1];
    if (
      current &&
      next &&
      current.type === "number" &&
      next.type === "number" &&
      fieldUnitFromLabel(current.label) &&
      fieldUnitFromLabel(next.label)
    ) {
      rows.push([current, next]);
      index += 1;
      continue;
    }
    if (current) {
      rows.push([current]);
    }
  }
  return rows;
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
