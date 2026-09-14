import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";

type FieldVariant = "default" | "choice";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  variant?: FieldVariant;
  suffix?: string;
  visibleLabel?: string;
  required?: boolean;
  children: ReactNode;
};

function fieldVariantClass(variant: FieldVariant): string {
  switch (variant) {
    case "default":
      return "";
    case "choice":
      return "field-choice";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

type FieldControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  "aria-label"?: string;
  required?: boolean;
};

export function Field({
  label,
  hint,
  error,
  hideLabel = false,
  variant = "default",
  suffix,
  visibleLabel,
  required = false,
  children,
}: FieldProps) {
  const errorId = useId();
  const hintId = useId();
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter((id): id is string => id !== null)
    .join(" ");
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<FieldControlProps>, {
        "aria-describedby": describedBy || undefined,
        ...(error ? { "aria-invalid": true } : {}),
        ...(required ? { "aria-required": true, required: true } : {}),
        ...(suffix ? { "aria-label": label } : {}),
      })
    : children;
  const variantClass = fieldVariantClass(variant);
  const fieldClass = ["field", error ? "field-invalid" : null, variantClass || null]
    .filter((item): item is string => Boolean(item))
    .join(" ");

  return (
    <label className={fieldClass}>
      <span
        className={hideLabel ? "visually-hidden" : "field-label"}
        data-visual={visibleLabel && !hideLabel ? visibleLabel : undefined}
        data-required={required && !hideLabel ? "" : undefined}
      >
        {label}
      </span>
      {suffix ? (
        <span className="cfg-input-wrap">
          {control}
          <span className="cfg-input-unit">{suffix}</span>
        </span>
      ) : (
        control
      )}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </label>
  );
}
