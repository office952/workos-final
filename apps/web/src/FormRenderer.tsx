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
}: FormRendererProps) {
  const selectedIds = selectedComponentIds(template, values);

  return (
    <div className="form-stack">
      {schema.sections.map((section) => {
        const visibleFields = section.fields.filter((field) =>
          isFieldVisible(field, values, selectedIds),
        );
        if (visibleFields.length === 0) {
          return null;
        }

        return (
          <fieldset key={section.id} className="form-section">
            <legend>
              {section.title}
              {visibleFields.some((field) => field.required) ? " – obligatoriu" : ""}
            </legend>
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
                  {field.type === "select" && field.options && field.options.length > 0 ? (
                    <div className="choice-chips" aria-hidden="true">
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
