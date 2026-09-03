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
};

export function Field({
  label,
  hint,
  error,
  hideLabel = false,
  variant = "default",
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
      })
    : children;
  const variantClass = fieldVariantClass(variant);
  const fieldClass = ["field", error ? "field-invalid" : null, variantClass || null]
    .filter((item): item is string => Boolean(item))
    .join(" ");

  return (
    <label className={fieldClass}>
      <span className={hideLabel ? "visually-hidden" : "field-label"}>{label}</span>
      {control}
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
