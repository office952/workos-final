import { useEffect, useId, useState, type FormEvent } from "react";
import type { OperatorCandidate } from "@workos-final/domain";
import { identifyErrorLabel } from "./cloudAuth";
import { useOperatorSession } from "./OperatorSessionContext";
import { fetchOperatorCandidates } from "./operatorSessionApi";
import { Field } from "./ui/Field";

export function OperatorIdentifyForm({
  onIdentified,
  submitLabel = "Confirmă",
}: {
  onIdentified?: () => void;
  submitLabel?: string;
}) {
  const { identify } = useOperatorSession();
  const [candidates, setCandidates] = useState<OperatorCandidate[]>([]);
  const [personId, setPersonId] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  useEffect(() => {
    let cancelled = false;
    void fetchOperatorCandidates()
      .then((list) => {
        if (cancelled) {
          return;
        }
        const withPin = list.filter((candidate) => candidate.pinConfigured);
        setCandidates(withPin);
        setPersonId((current) =>
          withPin.some((candidate) => candidate.personId === current)
            ? current
            : withPin[0]?.personId || "",
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError("Lista de operatori nu a putut fi încărcată.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await identify(personId, pin);
      if (!result.ok) {
        setError(identifyErrorLabel(result.error));
        setPin("");
        return;
      }
      setPin("");
      onIdentified?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="operator-identify-form" onSubmit={submit}>
      <p className="client-current-hint">
        PIN-ul spune cine lucrează acum pe acest terminal. Nu este cont Cloud, rol sau pontaj.
      </p>
      <Field label="Persoană">
        <select
          value={personId}
          onChange={(event) => setPersonId(event.target.value)}
          disabled={busy || candidates.length === 0}
        >
          {candidates.length === 0 ? (
            <option value="">Nicio persoană cu PIN</option>
          ) : (
            candidates.map((candidate) => (
              <option key={candidate.personId} value={candidate.personId}>
                {candidate.displayName}
                {candidate.availability === "TEMPORARILY_UNAVAILABLE"
                  ? ` (${candidate.availabilityLabel})`
                  : ""}
              </option>
            ))
          )}
        </select>
      </Field>
      <Field label="PIN">
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          disabled={busy}
          aria-describedby={error ? errorId : undefined}
        />
      </Field>
      {error ? (
        <p id={errorId} className="status-bad" role="alert">
          {error}
        </p>
      ) : null}
      <div className="operator-identify-actions">
        <button type="submit" disabled={busy || personId.length === 0 || pin.length < 4}>
          {busy ? "Se verifică…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
