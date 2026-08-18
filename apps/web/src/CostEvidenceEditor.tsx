import { useState } from "react";
import type { ResourcesAdminProjection } from "@workos-final/domain";
import { patchCostEvidence } from "./systemApi";

type CostEvidenceItem = ResourcesAdminProjection["costEvidence"][number];

type CostEvidenceEditorProps = {
  evidence: CostEvidenceItem;
  onSaved: (admin: ResourcesAdminProjection) => void;
};

export function CostEvidenceEditor({ evidence, onSaved }: CostEvidenceEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(evidence.amount));
  const [note, setNote] = useState(evidence.note);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setDraft(String(evidence.amount));
    setNote(evidence.note);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setDraft(String(evidence.amount));
    setNote(evidence.note);
    setError(null);
    setEditing(false);
  }

  async function save() {
    const amount = Number(draft.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Tariful trebuie să fie un număr mai mare decât zero.");
      return;
    }
    if (!evidence.evidenceRowId) {
      setError("Salvarea a eșuat. Tariful curent nu a fost schimbat.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const admin = await patchCostEvidence({
        evidenceRowId: evidence.evidenceRowId,
        amount,
        note,
      });
      try {
        onSaved(admin);
      } catch {
        // PATCH already confirmed. A later UI refresh must not become a failed Save.
      }
      setEditing(false);
    } catch (cause) {
      setError(messageForWriteError(cause));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="display-label-editor">
      <p className="catalog-kind">Tarif intern</p>
      {editing ? (
        <div className="form-stack">
          <div className="form-row">
            <label htmlFor="cost-evidence-amount">Tarif</label>
            <input
              id="cost-evidence-amount"
              inputMode="decimal"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={saving}
            />
          </div>
          <div className="form-row">
            <label htmlFor="cost-evidence-note">Notă</label>
            <input
              id="cost-evidence-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={saving}
            />
          </div>
          <dl className="owner-catalog-facts">
            <div>
              <dt>Unitate</dt>
              <dd>{evidence.unitLabel}</dd>
            </div>
            <div>
              <dt>Monedă</dt>
              <dd>{evidence.currency}</dd>
            </div>
            {evidence.qualifierLabel ? (
              <div>
                <dt>Calificativ</dt>
                <dd>{evidence.qualifierLabel}</dd>
              </div>
            ) : null}
          </dl>
          {error ? <p className="status-bad">{error}</p> : null}
          <div className="action-row">
            <button type="button" onClick={() => void save()} disabled={saving}>
              Salvează
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={cancel}
              disabled={saving}
            >
              Renunță
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="display-label-current">{evidence.amountDisplay}</p>
          <dl className="owner-catalog-facts">
            <div>
              <dt>Unitate</dt>
              <dd>{evidence.unitLabel}</dd>
            </div>
            <div>
              <dt>Monedă</dt>
              <dd>{evidence.currency}</dd>
            </div>
            {evidence.qualifierLabel ? (
              <div>
                <dt>Calificativ</dt>
                <dd>{evidence.qualifierLabel}</dd>
              </div>
            ) : null}
          </dl>
          {error ? <p className="status-bad">{error}</p> : null}
          <div className="action-row">
            <button type="button" onClick={startEdit}>
              Editează
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function messageForWriteError(cause: unknown): string {
  const code = cause instanceof Error ? cause.message : "";
  switch (code) {
    case "invalid_amount":
      return "Tariful trebuie să fie un număr mai mare decât zero.";
    case "invalid_note":
      return "Nota nu este validă.";
    case "not_found":
    case "unknown_resource":
      return "Dovada de cost nu a fost găsită.";
    case "stale_cost_evidence":
      return "Tariful a fost schimbat între timp. Reîncarcă și încearcă din nou.";
    default:
      return "Salvarea a eșuat. Tariful curent nu a fost schimbat.";
  }
}
