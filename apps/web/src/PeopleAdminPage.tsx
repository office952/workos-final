import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PeopleRegistryProjection } from "@workos-final/domain";
import { PeopleAdminNav } from "./PeopleAdminNav";
import { createPerson, fetchPeopleRegistry } from "./peopleApi";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; registry: PeopleRegistryProjection };

export function PeopleAdminPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchPeopleRegistry()
      .then((registry) => {
        if (!cancelled) {
          setPage({ kind: "ready", registry });
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

  if (page.kind === "loading") {
    return <p>Se încarcă persoanele…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca persoanele.</p>;
  }

  const { registry } = page;

  return (
    <section className="people-admin">
      <PageHeader
        title="Oameni"
        lead="Catalog operațional: cine este în firmă, ce știe și dacă poate fi luat în calcul acum. Nu este HR, pontaj sau salariu."
        meta={
          <p className="page-summary">
            Activi {registry.summary.active}
            {" · "}
            Disponibili {registry.summary.available}
            {" · "}
            Indisponibili temporar {registry.summary.temporarilyUnavailable}
            {" · "}
            Retrasi {registry.summary.retired}
          </p>
        }
      />
      <PeopleAdminNav />
      <form
        className="people-create"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = name.trim();
          if (trimmed.length === 0) {
            return;
          }
          setBusy(true);
          setNotice(null);
          void createPerson(trimmed)
            .then((next) => {
              setName("");
              setPage({ kind: "ready", registry: next });
            })
            .catch(() => setNotice("Persoana nu a putut fi adăugată."))
            .finally(() => setBusy(false));
        }}
      >
        <Field label="Nume">
          <input value={name} onChange={(event) => setName(event.target.value)} disabled={busy} />
        </Field>
        <button type="submit" disabled={busy || name.trim().length === 0}>
          Adaugă persoană
        </button>
      </form>
      {notice ? <p className="status-bad">{notice}</p> : null}
      {registry.people.length === 0 ? (
        <EmptyState
          title="Nu există persoane active configurate."
          action={<p>Adaugă prima persoană.</p>}
        />
      ) : (
        <ul className="people-list">
          {registry.people.map((person) => (
            <li key={person.personId}>
              <div className="jobs-identity">
                <Link to={person.href}>{person.displayName}</Link>
                <span>
                  {person.roleLabel ?? "Fără rol descriptiv"}
                  {person.skills.length > 0
                    ? ` · ${person.skills.map((skill) => skill.displayLabel).join(", ")}`
                    : " · Fără skill-uri"}
                </span>
              </div>
              <div className="jobs-status">
                <StatusChip
                  label={person.statusLabel}
                  tone={person.status === "ACTIVE" ? "ok" : "neutral"}
                />
                <StatusChip
                  label={person.availabilityLabel}
                  tone={person.availability === "AVAILABLE" ? "progress" : "neutral"}
                />
              </div>
              <Link className="button-link" to={person.href}>
                Deschide
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
