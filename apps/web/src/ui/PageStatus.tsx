import type { AriaRole, ReactNode } from "react";

type PageStatusKind = "loading" | "error" | "forbidden" | "missing";

type StatusAnnouncement = {
  role?: AriaRole;
  "aria-live"?: "polite";
};

function announcementFor(kind: PageStatusKind): StatusAnnouncement {
  switch (kind) {
    case "loading":
      return { role: "status", "aria-live": "polite" };
    case "error":
      return { role: "alert" };
    case "forbidden":
    case "missing":
      return {};
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function PageStatus({
  kind,
  children,
}: {
  kind: PageStatusKind;
  children: ReactNode;
}) {
  return (
    <p className={`page-status page-status-${kind}`} {...announcementFor(kind)}>
      {children}
    </p>
  );
}
