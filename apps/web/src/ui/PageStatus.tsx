import type { ReactNode } from "react";

type PageStatusKind = "loading" | "error" | "forbidden" | "missing";

export function PageStatus({
  kind,
  children,
}: {
  kind: PageStatusKind;
  children: ReactNode;
}) {
  return <p className={`page-status page-status-${kind}`}>{children}</p>;
}
