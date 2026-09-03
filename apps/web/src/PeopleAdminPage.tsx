import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, UserCheck, UserMinus, Users } from "lucide-react";
import { appLocation } from "./navigation/routePath";
import type { PeopleRegistryProjection } from "@workos-final/domain";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import { PeopleAdminNav } from "./PeopleAdminNav";
import { createPerson, fetchPeopleRegistry } from "./peopleApi";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { MetricCard } from "./ui/MetricCard";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; registry: PeopleRegistryProjection };

export function PeopleAdminPage() {
  const canAdminister = useCanAdministerOrganization();
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
    return (
      <section className="people-admin requests-overview">
        <PageHeader
          title="Oameni"
          lead="Catalog operațional: cine este în firmă, ce știe și dacă poate fi luat în calcul acum. Nu este HR, pontaj sau salariu."
        />
        <PageStatus kind="loading">Se încarcă oamenii…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section className="people-admin requests-overview">
        <PageHeader
          title="Oameni"
          lead="Catalog operațional: cine este în firmă, ce știe și dacă poate fi luat în calcul acum. Nu este HR, pontaj sau salariu."
        />
        <PageStatus kind="error">Nu s-au putut încărca oamenii.</PageStatus>
      </section>
    );
  }

  const { registry } = page;

  return (
    <section className="people-admin requests-overview">
      <PageHeader
        title="Oameni"
        lead="Catalog operațional: cine este în firmă, ce știe și dacă poate fi luat în calcul acum. Nu este HR, pontaj sau salariu."
      />
      <div className="metric-band">
        <MetricCard
          label="Activi"
          value={registry.summary.active}
          icon={<Users size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Disponibili"
          value={registry.summary.available}
          icon={<UserCheck size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Retrasi"
          value={registry.summary.retired}
          icon={<UserMinus size={40} strokeWidth={1.5} />}
        />
      </div>
      <PeopleAdminNav />
      {!canAdminister ? <OwnerWriteHint /> : null}
      {canAdminister ? (
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
      ) : null}
      {notice ? <p className="status-bad">{notice}</p> : null}
      {registry.people.length === 0 ? (
        <EmptyState
          title="Nu există persoane active configurate."
          action={canAdminister ? <p>Adaugă prima persoană.</p> : undefined}
        />
      ) : (
        <ul className="requests-list">
          {registry.people.map((person) => (
            <li key={person.personId}>
              <div className="registry-row">
                <div className="registry-row-identity">
                  <Link className="registry-row-name" to={appLocation(person.href)}>
                    {person.displayName}
                  </Link>
                  <span className="registry-row-meta">
                    {person.roleLabel ?? "Fără rol descriptiv"}
                    {person.skills.length > 0
                      ? ` · ${person.skills.map((skill) => skill.displayLabel).join(", ")}`
                      : " · Fără calificări"}
                  </span>
                </div>
                <div className="requests-row-status">
                  <span>{person.statusLabel}</span>
                  <span>{person.availabilityLabel}</span>
                </div>
                <Link className="requests-row-action" to={appLocation(person.href)}>
                  Deschide
                </Link>
                <Link
                  className="registry-row-open"
                  to={appLocation(person.href)}
                  aria-label={`Deschide ${person.displayName}`}
                >
                  <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
