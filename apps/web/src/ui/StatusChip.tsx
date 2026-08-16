export type StatusTone = "neutral" | "progress" | "done" | "warn" | "ok";

type StatusChipProps = {
  label: string;
  tone?: StatusTone;
};

export function StatusChip({ label, tone = "neutral" }: StatusChipProps) {
  return <span className={`status-chip status-chip-${tone}`}>{label}</span>;
}
