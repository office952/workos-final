import {
  isFieldVisible,
  selectedComponentIds,
  type DraftValue,
  type DraftValues,
  type FormField,
  type FormSchema,
  type ProductTemplate,
} from "@workos-final/domain";
import { Field } from "./ui/Field";

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
          className="choice-select-native"
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
                  <Field label={field.label} hint={field.hint}>
                    <FieldControl
                      field={field}
                      value={values[field.id]}
                      onChange={(value) => onChange(field.id, value)}
                    />
                  </Field>
                  {field.required && isEmptyField(values[field.id]) ? (
                    <p className="cfg-necessary" role="status">
                      NECESAR
                    </p>
                  ) : null}
                  {field.type === "select" && field.options && field.options.length > 0 ? (
                    <div
                      className={configurator ? "choice-chips cfg-segmented" : "choice-chips"}
                      aria-hidden="true"
                    >
                      {field.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={
                            values[field.id] === option.value
                              ? "choice-chip is-selected"
                              : "choice-chip"
                          }
                          aria-pressed={values[field.id] === option.value}
                          onClick={() => onChange(field.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
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
