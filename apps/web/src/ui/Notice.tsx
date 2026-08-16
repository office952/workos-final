import type { ReactNode } from "react";

export type NoticeTone = "info" | "ok" | "warn";

type NoticeProps = {
  children: ReactNode;
  tone?: NoticeTone;
  compact?: boolean;
};

export function Notice({ children, tone = "info", compact = false }: NoticeProps) {
  const extra =
    tone === "ok" ? " notice-ok" : tone === "warn" ? " notice-blocked" : "";
  return (
    <div className={`notice${extra}${compact ? " notice-compact" : ""}`}>{children}</div>
  );
}
