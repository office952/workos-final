import { useState } from "react";
import type { CatalogEditTarget } from "./ownerCatalog";
import { patchDisplayLabel } from "./systemApi";

type DisplayLabelEditorProps = {
  target: CatalogEditTarget;
  onSaved: () => Promise<void>;
};

export function DisplayLabelEditor({ target, onSaved }: DisplayLabelEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(target.displayLabel);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setDraft(target.displayLabel);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setDraft(target.displayLabel);
    setError(null);
    setEditing(false);
  }

  async function save() {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      setError("Eticheta nu poate fi goală.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await patchDisplayLabel({
        entityKind: target.entityKind,
        entityId: target.entityId,
        displayLabel: draft,
        revision: target.revision,
      });
      await onSaved();
      setEditing(false);
    } catch (cause) {
      setError(messageForWriteError(cause));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="display-label-editor">
      <p className="catalog-kind">Etichetă afișată</p>
      {editing ? (
        <div className="form-stack">
          <div className="form-row">
            <label htmlFor="display-label-input">Etichetă afișată</label>
            <input
              id="display-label-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={saving}
            />
          </div>
          <dl className="owner-catalog-facts">
            <div>
              <dt>Identitate tehnică</dt>
              <dd>{target.identityLabel}</dd>
            </div>
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
          <p className="display-label-current">{target.displayLabel}</p>
          <dl className="owner-catalog-facts">
            <div>
              <dt>Identitate tehnică</dt>
              <dd>{target.identityLabel}</dd>
            </div>
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
    case "invalid_label":
      return "Eticheta nu este validă.";
    case "unknown_entity":
    case "invalid_kind":
      return "Entitatea nu a fost găsită.";
    case "revision_conflict":
      return "Eticheta a fost schimbată între timp. Reîncarcă și încearcă din nou.";
    default:
      return "Salvarea a eșuat. Eticheta curentă nu a fost schimbată.";
  }
}
