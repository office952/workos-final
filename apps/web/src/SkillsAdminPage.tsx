import { useEffect, useState } from "react";
import { productionCapabilityClasses, type Skill } from "@workos-final/domain";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { AdminDomainLinks } from "./AdminDomainLinks";
import { OwnerWriteHint } from "./OwnerWriteHint";
import { PeopleAdminNav } from "./PeopleAdminNav";
import { createSkill, fetchEligibility, fetchSkills, retireSkill } from "./peopleApi";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";
import { StatusChip } from "./ui/StatusChip";

export function SkillsAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [capabilityId, setCapabilityId] = useState("CNC_ROUTING");
  const [eligible, setEligible] = useState<Array<{ personId: string; displayName: string }>>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function reload() {
    const next = await fetchSkills();
    setSkills(next);
    const preview = await fetchEligibility(capabilityId);
    setEligible(preview.eligiblePeople);
  }

  useEffect(() => {
    void reload().catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <section className="people-admin">
        <PageHeader
          title="Calificări"
          lead="Calificări operaționale configurabile. Eticheta se poate schimba; codul rămâne stabil. Nu sunt permisiuni de aplicație."
        />
        <AdminDomainLinks current="people" />
        <p>Calificările nu au putut fi încărcate.</p>
      </section>
    );
  }
  if (!skills) {
    return (
      <section className="people-admin">
        <PageHeader
          title="Calificări"
          lead="Calificări operaționale configurabile. Eticheta se poate schimba; codul rămâne stabil. Nu sunt permisiuni de aplicație."
        />
        <AdminDomainLinks current="people" />
        <p>Se încarcă calificările…</p>
      </section>
    );
  }

  return (
    <section className="people-admin">
      <PageHeader
        title="Calificări"
        lead="Calificări operaționale configurabile. Eticheta se poate schimba; codul rămâne stabil. Nu sunt permisiuni de aplicație."
      />
      <AdminDomainLinks current="people" />
      <PeopleAdminNav />
      {!canAdminister ? <OwnerWriteHint /> : null}
      {canAdminister ? (
      <form
        className="people-create"
        onSubmit={(event) => {
          event.preventDefault();
          setBusy(true);
          setNotice(null);
          void createSkill({ code, displayLabel: label })
            .then((next) => {
              setSkills(next);
              setCode("");
              setLabel("");
            })
            .catch(() => setNotice("Calificarea nu a putut fi creată."))
            .finally(() => setBusy(false));
        }}
      >
        <Field label="Cod">
          <input value={code} onChange={(event) => setCode(event.target.value)} disabled={busy} placeholder="SK_LASER" />
        </Field>
        <Field label="Etichetă">
          <input value={label} onChange={(event) => setLabel(event.target.value)} disabled={busy} />
        </Field>
        <button type="submit" disabled={busy || code.trim().length === 0 || label.trim().length === 0}>
          Adaugă calificare
        </button>
      </form>
      ) : null}
      {notice ? <p className="status-bad">{notice}</p> : null}
      {skills.length === 0 ? (
        <EmptyState title="Nu există calificări." />
      ) : (
        <ul className="people-list">
          {skills.map((skill) => (
            <li key={skill.skillId}>
              <div className="jobs-identity">
                <p>{skill.displayLabel}</p>
                <details>
                  <summary>Detalii</summary>
                  <p>{skill.code}</p>
                </details>
              </div>
              <StatusChip
                label={skill.status === "ACTIVE" ? "Activ" : "Retras"}
                tone={skill.status === "ACTIVE" ? "ok" : "neutral"}
              />
              {canAdminister && skill.status === "ACTIVE" ? (
                <button
                  type="button"
                  className="button-quiet"
                  disabled={busy}
                  onClick={() =>
                    void retireSkill(skill.skillId)
                      .then(setSkills)
                      .catch(() => setNotice("Calificarea nu a putut fi retrasă."))
                  }
                >
                  Retrage calificarea
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <article className="client-current-card">
        <h2>Eligibilitate curentă</h2>
        <p className="client-current-hint">
          Proiecție de citire. Nu alocă task-uri și nu pornește execuția.
        </p>
        <form
          className="people-create"
          onSubmit={(event) => {
            event.preventDefault();
            void fetchEligibility(capabilityId)
              .then((preview) => setEligible(preview.eligiblePeople))
              .catch(() => setNotice("Eligibilitatea nu a putut fi citită."));
          }}
        >
          <Field label="Capabilitate cerută">
            <select
              value={capabilityId}
              onChange={(event) => setCapabilityId(event.target.value)}
            >
              {productionCapabilityClasses.map((capability) => (
                <option key={capability.id} value={capability.id}>
                  {capability.label}
                </option>
              ))}
            </select>
          </Field>
          <button type="submit">Arată eligibilii</button>
        </form>
        {eligible.length === 0 ? (
          <p>Nicio persoană eligibilă acum.</p>
        ) : (
          <ul className="people-skill-list">
            {eligible.map((person) => (
              <li key={person.personId}>{person.displayName}</li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
