import type { ExecutionPlanView } from "@workos-final/domain";
import { measuredLabel, projectPlannedVersusActual } from "./pvaProjection";
import { StatusChip } from "./ui/StatusChip";

export function PlannedVersusActual({ view }: { view: ExecutionPlanView }) {
  const rows = projectPlannedVersusActual(view);
  return (
    <section className="pva-panel" aria-labelledby="pva-title">
      <h2 id="pva-title">Planificat versus realizat</h2>
      <p className="client-current-hint">
        Adevăr operațional. Fără costuri. Necunoscut și nemăsurat sunt stări diferite.
      </p>
      <div className="pva-table-wrap">
        <table className="pva-table">
          <thead>
            <tr>
              <th scope="col">Operație</th>
              <th scope="col">Planificat</th>
              <th scope="col">Realizat</th>
              <th scope="col">Diferență</th>
              <th scope="col">Durată</th>
              <th scope="col">Stare</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.taskId}>
                <th scope="row">
                  <span className="pva-op">
                    {row.seqLabel}. {row.processLabel}
                  </span>
                  <span className="pva-op-meta">
                    {row.scopeLabel}
                    {row.operatorLabel ? ` · ${row.operatorLabel}` : ""}
                    {row.providerLabel ? ` · ${row.providerLabel}` : ""}
                    {row.deviationReason ? ` · ${row.deviationReason}` : ""}
                  </span>
                </th>
                <td>{measuredLabel(row.planned)}</td>
                <td>{measuredLabel(row.actual)}</td>
                <td>{measuredLabel(row.difference)}</td>
                <td>{measuredLabel(row.duration)}</td>
                <td>
                  <StatusChip
                    label={row.statusLabel}
                    tone={
                      row.statusLabel === "Finalizat"
                        ? "done"
                        : row.statusLabel === "În lucru"
                          ? "progress"
                          : "neutral"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
