import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  iconTone?: "default" | "warning";
};

export function MetricCard({
  label,
  value,
  hint,
  icon,
  iconTone = "default",
}: MetricCardProps) {
  return (
    <div className={icon ? "metric-card has-icon" : "metric-card"}>
      {icon ? (
        <span
          className={
            iconTone === "warning" ? "metric-card-icon is-warning" : "metric-card-icon"
          }
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div className="metric-card-copy">
        <p className="metric-card-label">{label}</p>
        <p className="metric-card-value">{value}</p>
        {hint ? <p className="metric-card-hint">{hint}</p> : null}
      </div>
    </div>
  );
}
