import {
  createContext,
  useContext,
  useLayoutEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ObjectContextStripProps } from "./ui/ObjectContextStrip";

export const ObjectWorkbenchSetContext = createContext<Dispatch<
  SetStateAction<ObjectContextStripProps>
> | null>(null);

export function useObjectWorkbench(value: ObjectContextStripProps): void {
  const setValue = useContext(ObjectWorkbenchSetContext);
  const objectType = value.objectType ?? "";
  const displayId = value.displayId ?? "";
  const displayName = value.displayName ?? "";
  const returnHref = value.returnTarget?.href ?? "";
  const returnLabel = value.returnTarget?.label ?? "";
  const parentHref = value.explicitParent?.href ?? "";
  const parentLabel = value.explicitParent?.label ?? "";

  useLayoutEffect(() => {
    if (!setValue) {
      return;
    }
    setValue({
      objectType: objectType || null,
      displayId: displayId || null,
      displayName: displayName || null,
      returnTarget:
        returnHref && returnLabel ? { href: returnHref, label: returnLabel } : null,
      explicitParent: parentLabel
        ? { href: parentHref || null, label: parentLabel }
        : null,
    });
    return () => {
      setValue({});
    };
  }, [
    setValue,
    objectType,
    displayId,
    displayName,
    returnHref,
    returnLabel,
    parentHref,
    parentLabel,
  ]);
}
