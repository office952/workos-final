import { useEffect, useState } from "react";
import type { Person } from "@workos-final/domain";
import { createPerson, fetchPeople, renamePerson, retirePerson } from "./peopleApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; people: Person[] };

export function PeopleAdminPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchPeople()
      .then((people) => {
        if (!cancelled) {
          setPage({ kind: "ready", people });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function apply(action: () => Promise<Person[]>) {
    setBusy(true);
    setNotice(null);
    try {
      const people = await action();
      setPage({ kind: "ready", people });
    } catch {
      setNotice("Acțiunea nu a putut fi aplicată.");
    } finally {
      setBusy(false);
    }
  }

  if (page.kind === "loading") {
    return <p>Se încarcă persoanele…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca persoanele.</p>;
  }

  const active = page.people.filter((person) => person.status === "ACTIVE");
  const retired = page.people.filter((person) => person.status === "RETIRED");

  return (
    <section>
      <h1>Persoane</h1>
      <p className="page-lead">
        Identitate operațională pentru executantul de task. Nu este HR, pontaj,
        salariu sau programare.
      </p>
      <form
        className="people-create"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = name.trim();
          if (trimmed.length === 0) {
            return;
          }
          void apply(async () => {
            const people = await createPerson(trimmed);
            setName("");
            return people;
          });
        }}
      >
        <label>
          Nume
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={busy}
          />
        </label>
        <button type="submit" disabled={busy || name.trim().length === 0}>
          Adaugă persoană
        </button>
      </form>
      {notice ? <p className="status-bad">{notice}</p> : null}
      <h2>Active</h2>
      {active.length === 0 ? <p>Nu există persoane active configurate.</p> : null}
      <ul className="people-list">
        {active.map((person) => (
          <li key={person.personId}>
            {editingId === person.personId ? (
              <>
                <label>
                  Nume
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    disabled={busy}
                  />
                </label>
                <button
                  type="button"
                  disabled={busy || draft.trim().length === 0}
                  onClick={() =>
                    void apply(async () => {
                      const people = await renamePerson(person.personId, draft);
                      setEditingId(null);
                      return people;
                    })
                  }
                >
                  Salvează
                </button>
              </>
            ) : (
              <>
                <p>{person.displayName}</p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setEditingId(person.personId);
                    setDraft(person.displayName);
                  }}
                >
                  Editează nume
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  disabled={busy}
                  onClick={() => void apply(() => retirePerson(person.personId))}
                >
                  Retrage persoana
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2>Retrase</h2>
      {retired.length === 0 ? <p>Nicio persoană retrasă.</p> : null}
      <ul className="people-list">
        {retired.map((person) => (
          <li key={person.personId}>
            <p>{person.displayName}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
