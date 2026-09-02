import { useState } from "react";
import type { ResourcesAdminProjection } from "@workos-final/domain";
import { createCostEvidence, patchCostEvidence } from "./systemApi";

type CostEvidenceItem = ResourcesAdminProjection["costEvidence"][number];

type CostEvidenceEditorProps = {
  evidence?: CostEvidenceItem;
  createFor?: {
    resourceId: string;
    unitLabel: string;
    requiresSupplier: boolean;
  };
  onSaved: (admin: ResourcesAdminProjection) => void;
};

export function CostEvidenceEditor({
  evidence,
  createFor,
  onSaved,
}: CostEvidenceEditorProps) {
  const creating = Boolean(createFor) && !evidence;
  const [editing, setEditing] = useState(creating);
  const [draft, setDraft] = useState(evidence ? String(evidence.amount) : "");
  const [note, setNote] = useState(evidence?.note ?? "");
  const [supplierLabel, setSupplierLabel] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const unitLabel = createFor?.unitLabel ?? evidence?.unitLabel ?? "";
  const requiresSupplier = createFor?.requiresSupplier ?? false;

  function startEdit() {
    setDraft(evidence ? String(evidence.amount) : "");
    setNote(evidence?.note ?? "");
    setError(null);
    setEditing(true);
  }

  function cancel() {
    if (creating) {
      setDraft("");
      setNote("");
      setSupplierLabel("");
      setValidFrom("");
      setValidUntil("");
    } else {
      setDraft(evidence ? String(evidence.amount) : "");
      setNote(evidence?.note ?? "");
    }
    setError(null);
    setEditing(false);
  }

  async function save() {
    const amount = Number(draft.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Tariful trebuie să fie un număr mai mare decât zero.");
      return;
    }
    if (requiresSupplier && (!supplierLabel.trim() || !validUntil.trim())) {
      setError("Subcontractul cere furnizor și dată de valabilitate.");
      return;
    }
    if (!creating && !evidence?.evidenceRowId) {
      setError("Salvarea a eșuat. Tariful curent nu a fost schimbat.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const admin = creating
        ? await createCostEvidence({
            resourceId: createFor?.resourceId ?? "",
            amount,
            note,
            ...(requiresSupplier
              ? {
                  supplierLabel: supplierLabel.trim(),
                  validFrom: validFrom.trim() || undefined,
                  validUntil: validUntil.trim(),
                }
              : {}),
          })
        : await patchCostEvidence({
            evidenceRowId: evidence?.evidenceRowId ?? "",
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
          {requiresSupplier ? (
            <>
              <div className="form-row">
                <label htmlFor="cost-evidence-supplier">Furnizor</label>
                <input
                  id="cost-evidence-supplier"
                  value={supplierLabel}
                  onChange={(event) => setSupplierLabel(event.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="form-row">
                <label htmlFor="cost-evidence-valid-from">Valid de la</label>
                <input
                  id="cost-evidence-valid-from"
                  type="date"
                  value={validFrom}
                  onChange={(event) => setValidFrom(event.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="form-row">
                <label htmlFor="cost-evidence-valid-until">Valid până la</label>
                <input
                  id="cost-evidence-valid-until"
                  type="date"
                  value={validUntil}
                  onChange={(event) => setValidUntil(event.target.value)}
                  disabled={saving}
                />
              </div>
            </>
          ) : null}
          <dl className="owner-catalog-facts">
            <div>
              <dt>Unitate</dt>
              <dd>{unitLabel}</dd>
            </div>
            <div>
              <dt>Monedă</dt>
              <dd>{evidence?.currency ?? "EUR"}</dd>
            </div>
            {evidence?.qualifierLabel ? (
              <div>
                <dt>Calificativ</dt>
                <dd>{evidence.qualifierLabel}</dd>
              </div>
            ) : null}
          </dl>
          {error ? <p className="status-bad">{error}</p> : null}
          <div className="action-row">
            <button type="button" onClick={() => void save()} disabled={saving}>
              Confirmă tarif
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
          <p className="display-label-current">
            {evidence?.amountDisplay ?? "Fără dovadă activă"}
          </p>
          <dl className="owner-catalog-facts">
            <div>
              <dt>Unitate</dt>
              <dd>{unitLabel}</dd>
            </div>
            <div>
              <dt>Monedă</dt>
              <dd>{evidence?.currency ?? "EUR"}</dd>
            </div>
            {evidence?.qualifierLabel ? (
              <div>
                <dt>Calificativ</dt>
                <dd>{evidence.qualifierLabel}</dd>
              </div>
            ) : null}
          </dl>
          {error ? <p className="status-bad">{error}</p> : null}
          <div className="action-row">
            <button type="button" onClick={startEdit}>
              {creating ? "Adaugă evidență" : "Confirmă tarif"}
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
    case "already_exists":
      return "Există deja o dovadă activă pentru această resursă.";
    case "invalid_supplier":
      return "Furnizorul sau valabilitatea nu sunt complete.";
    case "invalid_validity":
      return "Intervalul de valabilitate nu este valid.";
    default:
      return "Salvarea a eșuat. Tariful curent nu a fost schimbat.";
  }
}
