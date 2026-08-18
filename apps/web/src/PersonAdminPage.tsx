import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { PersonRegistryItem, Skill } from "@workos-final/domain";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import { PeopleAdminNav } from "./PeopleAdminNav";
import {
  assignPersonSkill,
  fetchPerson,
  fetchSkills,
  removePersonSkill,
  retirePerson,
  updatePerson,
} from "./peopleApi";
import { setOperatorPin } from "./operatorSessionApi";
import { Field } from "./ui/Field";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "missing" }
  | {
      kind: "ready";
      item: PersonRegistryItem;
      skills: Skill[];
      operatorPinConfigured: boolean;
    };

export function PersonAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const { personId = "" } = useParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [until, setUntil] = useState("");
  const [skillId, setSkillId] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function reload() {
    const [loaded, skills] = await Promise.all([fetchPerson(personId), fetchSkills()]);
    if (!loaded?.item) {
      setPage({ kind: "missing" });
      return;
    }
    setName(loaded.item.displayName);
    setReason(loaded.item.unavailableReason ?? "");
    setUntil(loaded.item.unavailableUntil ?? "");
    setPin("");
    setConfirmPin("");
    setPage({
      kind: "ready",
      item: loaded.item,
      skills,
      operatorPinConfigured: loaded.operatorPinConfigured,
    });
  }

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void reload().catch(() => {
      if (!cancelled) {
        setPage({ kind: "error" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [personId]);

  if (page.kind === "loading") {
    return <p>Se încarcă persoana…</p>;
  }
  if (page.kind === "missing") {
    return <p>Persoana cerută nu este disponibilă.</p>;
  }
  if (page.kind === "error") {
    return <p>Persoana nu a putut fi încărcată.</p>;
  }

  const { item, skills, operatorPinConfigured } = page;
  const assignable = skills.filter(
    (skill) =>
      skill.status === "ACTIVE" &&
      !item.skills.some((current) => current.skillId === skill.skillId && current.status === "ACTIVE"),
  );

  async function run(action: () => Promise<void>, fallback: string) {
    setBusy(true);
    setNotice(null);
    try {
      await action();
      await reload();
    } catch (error) {
      setNotice(pinOrPeopleError(error, fallback));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="people-admin">
      <p>
        <Link to="/admin/people">← Oameni</Link>
      </p>
      <PeopleAdminNav />
      <header className="client-workspace-header">
        <div>
          <p className="client-kicker">Persoană</p>
          <h1>{item.displayName}</h1>
          {item.roleLabel ? <p className="client-header-meta">{item.roleLabel}</p> : null}
        </div>
        <div className="client-header-side">
          <StatusChip label={item.statusLabel} tone={item.status === "ACTIVE" ? "ok" : "neutral"} />
          <StatusChip
            label={item.availabilityLabel}
            tone={item.availability === "AVAILABLE" ? "progress" : "neutral"}
          />
        </div>
      </header>
      {notice ? <p className="status-bad">{notice}</p> : null}
      {!canAdminister ? <OwnerWriteHint /> : null}

      <article className="client-current-card">
        <h2>Identitate</h2>
        <form
          className="people-create"
          onSubmit={(event) => {
            event.preventDefault();
            void run(
              () => updatePerson(item.personId, { displayName: name }).then(() => undefined),
              "Numele nu a putut fi salvat.",
            );
          }}
        >
          <Field label="Nume">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={busy || !canAdminister}
            />
          </Field>
          {canAdminister ? (
            <button type="submit" disabled={busy || name.trim().length === 0}>
              Salvează numele
            </button>
          ) : null}
        </form>
      </article>

      <article className="client-current-card">
        <h2>PIN operator</h2>
        <p className="client-current-hint">
          PIN-ul identifică cine lucrează acum pe terminal. Nu este rol, cont sau pontaj. Valoarea nu
          este reafișată după salvare.
        </p>
        <p>
          Stare PIN: <strong>{operatorPinConfigured ? "Configurat" : "Neconfigurat"}</strong>
        </p>
        {canAdminister && item.status === "ACTIVE" ? (
          <form
            className="people-create"
            onSubmit={(event) => {
              event.preventDefault();
              void run(async () => {
                const result = await setOperatorPin(item.personId, pin, confirmPin);
                if (!result.ok) {
                  throw new Error(result.error);
                }
              }, "PIN-ul nu a putut fi salvat.");
            }}
          >
            <Field label={operatorPinConfigured ? "PIN nou" : "PIN"}>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                disabled={busy}
              />
            </Field>
            <Field label="Confirmă PIN">
              <input
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                value={confirmPin}
                onChange={(event) => setConfirmPin(event.target.value)}
                disabled={busy}
              />
            </Field>
            <button type="submit" disabled={busy || pin.length < 4 || confirmPin.length < 4}>
              {operatorPinConfigured ? "Resetează PIN" : "Setează PIN"}
            </button>
          </form>
        ) : (
          <p>Persoana retrasă nu mai poate primi PIN operațional.</p>
        )}
      </article>

      <article className="client-current-card">
        <h2>Disponibilitate operațională</h2>
        <p className="client-current-hint">
          Indisponibilitatea temporară scoate persoana din eligibilitatea curentă. Skill-urile rămân.
          Nu este concediu HR.
        </p>
        {canAdminister && item.status === "ACTIVE" ? (
          <form
            className="people-create"
            onSubmit={(event) => {
              event.preventDefault();
              void run(
                () =>
                  updatePerson(item.personId, {
                    availability:
                      item.availability === "AVAILABLE"
                        ? "TEMPORARILY_UNAVAILABLE"
                        : "AVAILABLE",
                    unavailableReason: reason,
                    unavailableUntil: until,
                  }).then(() => undefined),
                "Disponibilitatea nu a putut fi actualizată.",
              );
            }}
          >
            {item.availability === "AVAILABLE" ? (
              <>
                <Field label="Motiv">
                  <input
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Concediu"
                    disabled={busy}
                  />
                </Field>
                <Field label="Până la">
                  <input
                    value={until}
                    onChange={(event) => setUntil(event.target.value)}
                    placeholder="opțional"
                    disabled={busy}
                  />
                </Field>
                <button type="submit" disabled={busy}>
                  Marchează indisponibil temporar
                </button>
              </>
            ) : (
              <button type="submit" disabled={busy}>
                Revino disponibil
              </button>
            )}
          </form>
        ) : (
          <p>Persoana retrasă rămâne în istoric, fără eligibilitate viitoare.</p>
        )}
      </article>

      <article className="client-current-card">
        <h2>Skill-uri</h2>
        {item.skills.length === 0 ? (
          <p>Niciun skill curent.</p>
        ) : (
          <ul className="people-skill-list">
            {item.skills.map((skill) => (
              <li key={skill.skillId}>
                <span>
                  {skill.displayLabel}
                  <small> {skill.code}</small>
                </span>
                {canAdminister && item.status === "ACTIVE" ? (
                  <button
                    type="button"
                    className="button-quiet"
                    disabled={busy}
                    onClick={() =>
                      void run(
                        () => removePersonSkill(item.personId, skill.skillId),
                        "Skill-ul nu a putut fi scos din eligibilitatea curentă.",
                      )
                    }
                  >
                    Elimină din eligibilitatea curentă
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {canAdminister && item.status === "ACTIVE" && assignable.length > 0 ? (
          <form
            className="people-create"
            onSubmit={(event) => {
              event.preventDefault();
              if (!skillId) {
                return;
              }
              void run(
                () => assignPersonSkill(item.personId, skillId),
                "Skill-ul nu a putut fi adăugat.",
              );
            }}
          >
            <Field label="Adaugă skill">
              <select
                value={skillId}
                onChange={(event) => setSkillId(event.target.value)}
                disabled={busy}
              >
                <option value="">Alege skill</option>
                {assignable.map((skill) => (
                  <option key={skill.skillId} value={skill.skillId}>
                    {skill.displayLabel} ({skill.code})
                  </option>
                ))}
              </select>
            </Field>
            <button type="submit" disabled={busy || skillId.length === 0}>
              Adaugă skill
            </button>
          </form>
        ) : null}
      </article>

      {canAdminister && item.status === "ACTIVE" ? (
        <button
          type="button"
          className="button-secondary"
          disabled={busy}
          onClick={() =>
            void run(() => retirePerson(item.personId), "Persoana nu a putut fi retrasă.")
          }
        >
          Retrage persoana
        </button>
      ) : null}
    </section>
  );
}

function pinOrPeopleError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }
  switch (error.message) {
    case "has_active_task":
      return "Persoana are un task în lucru. Nu o retrage până nu se încheie.";
    case "invalid_pin":
      return "PIN-ul trebuie să aibă 4–8 cifre.";
    case "pin_mismatch":
      return "Confirmarea PIN nu coincidă.";
    case "retired_person":
      return "Persoana retrasă nu poate primi PIN.";
    default:
      return fallback;
  }
}
