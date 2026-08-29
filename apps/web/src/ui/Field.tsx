import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

type FieldControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function Field({ label, hint, error, children }: FieldProps) {
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

  return (
    <label className={error ? "field field-invalid" : "field"}>
      <span className="field-label">{label}</span>
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
