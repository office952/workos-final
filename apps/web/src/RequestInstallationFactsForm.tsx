import { useEffect, useState } from "react";
import {
  SITE_INSTALLATION_ELECTRICAL_STATES,
  SITE_INSTALLATION_FACADE_TYPES,
  SITE_INSTALLATION_FIXING_METHODS,
  SITE_INSTALLATION_MEASUREMENT_STATUSES,
  siteInstallationElectricalStateLabel,
  siteInstallationFacadeTypeLabel,
  siteInstallationFixingMethodLabel,
  siteInstallationMeasurementStatusLabel,
  type SiteInstallationElectricalState,
  type SiteInstallationFacadeType,
  type OperationalServiceProviderMode,
  type SiteInstallationFacts,
  type SiteInstallationFactsPatch,
  type SiteInstallationFixingMethod,
  type SiteInstallationIncompleteReason,
  type SiteInstallationMeasurementStatus,
} from "@workos-final/domain";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";

type FormState = {
  siteName: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  countryCode: string;
  contactName: string;
  contactPhone: string;
  accessNotes: string;
  measurementStatus: SiteInstallationMeasurementStatus;
  mountingSurfaceWidthMm: string;
  mountingSurfaceHeightMm: string;
  installationElevationMm: string;
  measuredAt: string;
  measurementNotes: string;
  facadeType: SiteInstallationFacadeType;
  facadeOtherNote: string;
  fixingMethod: SiteInstallationFixingMethod;
  fixingOtherNote: string;
  siteElectrical: SiteInstallationElectricalState;
  crewSize: string;
  plannedDurationHours: string;
};

export function RequestInstallationFactsForm({
  facts,
  reasons,
  locked,
  busy,
  notice,
  providerMode = null,
  costEvidenceReady = false,
  onSave,
}: {
  facts: SiteInstallationFacts | null;
  reasons: readonly SiteInstallationIncompleteReason[];
  locked: boolean;
  busy: boolean;
  notice: { tone: "ok" | "warn"; text: string } | null;
  providerMode?: OperationalServiceProviderMode | null;
  costEvidenceReady?: boolean;
  onSave: (patch: SiteInstallationFactsPatch) => void;
}) {
  const [form, setForm] = useState<FormState>(() => formFromFacts(facts));

  useEffect(() => {
    setForm(formFromFacts(facts));
  }, [facts]);

  const disabled = busy || locked;
  const dirty = !installationFormsEqual(form, formFromFacts(facts));

  return (
    <section className="result-section request-installation-facts">
      <h3>Date de montaj</h3>
      <p>
        Datele sunt ale locului de execuție, nu ale clientului.
        {costEvidenceReady
          ? " Evidența de cost pentru montaj este confirmată."
          : " Costul de montaj rămâne incomplet până există evidență de cost."}
      </p>
      {reasons.length > 0 ? (
        <ul className="request-installation-facts-reasons">
          {reasons.map((reason) => (
            <li key={reason.id}>{reason.label}</li>
          ))}
        </ul>
      ) : null}
      {notice ? (
        <Notice tone={notice.tone} compact>
          <p>{notice.text}</p>
        </Notice>
      ) : null}
      {locked ? (
        <p>Datele de montaj sunt blocate după prima ofertă legată.</p>
      ) : null}
      <form
        className="request-installation-facts-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (locked) {
            return;
          }
          onSave(patchFromForm(form));
        }}
      >
        <fieldset className="request-installation-facts-group">
          <legend>Locație</legend>
          <Field label="Denumire locație">
            <input
              value={form.siteName}
              disabled={disabled}
              onChange={(event) => setForm({ ...form, siteName: event.target.value })}
            />
          </Field>
          <Field
            label="Stradă"
            error={
              !form.street.trim()
                ? "Completează strada locului de execuție."
                : undefined
            }
          >
            <input
              value={form.street}
              disabled={disabled}
              aria-invalid={!form.street.trim()}
              onChange={(event) => setForm({ ...form, street: event.target.value })}
            />
          </Field>
          <Field
            label="Localitate"
            error={!form.city.trim() ? "Completează localitatea." : undefined}
          >
            <input
              value={form.city}
              disabled={disabled}
              aria-invalid={!form.city.trim()}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
            />
          </Field>
          <Field label="Județ">
            <input
              value={form.county}
              disabled={disabled}
              onChange={(event) => setForm({ ...form, county: event.target.value })}
            />
          </Field>
          <Field label="Cod poștal">
            <input
              value={form.postalCode}
              disabled={disabled}
              onChange={(event) => setForm({ ...form, postalCode: event.target.value })}
            />
          </Field>
          <Field label="Țară" hint="Implicit România.">
            <input
              value={form.countryCode}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, countryCode: event.target.value.toUpperCase() })
              }
            />
          </Field>
          <Field label="Persoană de contact">
            <input
              value={form.contactName}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, contactName: event.target.value })
              }
            />
          </Field>
          <Field label="Telefon contact">
            <input
              value={form.contactPhone}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, contactPhone: event.target.value })
              }
            />
          </Field>
          <Field label="Note de acces">
            <textarea
              value={form.accessNotes}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, accessNotes: event.target.value })
              }
            />
          </Field>
        </fieldset>
        <fieldset className="request-installation-facts-group">
          <legend>Măsurători</legend>
          <Field label="Stare măsurători">
            <select
              value={form.measurementStatus}
              disabled={disabled}
              onChange={(event) =>
                setForm({
                  ...form,
                  measurementStatus: event.target
                    .value as SiteInstallationMeasurementStatus,
                })
              }
            >
              {SITE_INSTALLATION_MEASUREMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {siteInstallationMeasurementStatusLabel(status)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lățime suprafață de montaj (mm)">
            <input
              inputMode="numeric"
              value={form.mountingSurfaceWidthMm}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, mountingSurfaceWidthMm: event.target.value })
              }
            />
          </Field>
          <Field label="Înălțime suprafață de montaj (mm)">
            <input
              inputMode="numeric"
              value={form.mountingSurfaceHeightMm}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, mountingSurfaceHeightMm: event.target.value })
              }
            />
          </Field>
          <Field label="Înălțime de montaj (mm)">
            <input
              inputMode="numeric"
              value={form.installationElevationMm}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, installationElevationMm: event.target.value })
              }
            />
          </Field>
          <Field label="Data măsurătorii">
            <input
              type="date"
              value={form.measuredAt}
              disabled={disabled}
              onChange={(event) => setForm({ ...form, measuredAt: event.target.value })}
            />
          </Field>
          <Field label="Note măsurători">
            <textarea
              value={form.measurementNotes}
              disabled={disabled}
              onChange={(event) =>
                setForm({ ...form, measurementNotes: event.target.value })
              }
            />
          </Field>
        </fieldset>
        <fieldset className="request-installation-facts-group">
          <legend>Execuție montaj</legend>
          <Field label="Fațadă">
            <select
              value={form.facadeType}
              disabled={disabled}
              onChange={(event) =>
                setForm({
                  ...form,
                  facadeType: event.target.value as SiteInstallationFacadeType,
                })
              }
            >
              {SITE_INSTALLATION_FACADE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {siteInstallationFacadeTypeLabel(type)}
                </option>
              ))}
            </select>
          </Field>
          {form.facadeType === "OTHER" ? (
            <Field
              label="Explicație fațadă"
              error={
                !form.facadeOtherNote.trim()
                  ? "Pentru „Altul” este nevoie de o explicație."
                  : undefined
              }
            >
              <textarea
                value={form.facadeOtherNote}
                disabled={disabled}
                aria-invalid={!form.facadeOtherNote.trim()}
                onChange={(event) =>
                  setForm({ ...form, facadeOtherNote: event.target.value })
                }
              />
            </Field>
          ) : null}
          <Field label="Prindere">
            <select
              value={form.fixingMethod}
              disabled={disabled}
              onChange={(event) =>
                setForm({
                  ...form,
                  fixingMethod: event.target.value as SiteInstallationFixingMethod,
                })
              }
            >
              {SITE_INSTALLATION_FIXING_METHODS.map((method) => (
                <option key={method} value={method}>
                  {siteInstallationFixingMethodLabel(method)}
                </option>
              ))}
            </select>
          </Field>
          {form.fixingMethod === "OTHER" ? (
            <Field
              label="Explicație prindere"
              error={
                !form.fixingOtherNote.trim()
                  ? "Pentru „Altul” este nevoie de o explicație."
                  : undefined
              }
            >
              <textarea
                value={form.fixingOtherNote}
                disabled={disabled}
                aria-invalid={!form.fixingOtherNote.trim()}
                onChange={(event) =>
                  setForm({ ...form, fixingOtherNote: event.target.value })
                }
              />
            </Field>
          ) : null}
          <Field
            label="Electric de șantier"
            hint="„Nu se aplică” trebuie ales explicit."
          >
            <select
              value={form.siteElectrical}
              disabled={disabled}
              onChange={(event) =>
                setForm({
                  ...form,
                  siteElectrical: event.target.value as SiteInstallationElectricalState,
                })
              }
            >
              {SITE_INSTALLATION_ELECTRICAL_STATES.map((state) => (
                <option key={state} value={state}>
                  {siteInstallationElectricalStateLabel(state)}
                </option>
              ))}
            </select>
          </Field>
          {providerMode === "INTERNAL" ? (
            <>
              <Field label="Persoane în echipă">
                <input
                  inputMode="numeric"
                  value={form.crewSize}
                  disabled={disabled}
                  onChange={(event) => setForm({ ...form, crewSize: event.target.value })}
                />
              </Field>
              <Field label="Durată planificată (ore)">
                <input
                  inputMode="decimal"
                  value={form.plannedDurationHours}
                  disabled={disabled}
                  onChange={(event) =>
                    setForm({ ...form, plannedDurationHours: event.target.value })
                  }
                />
              </Field>
            </>
          ) : null}
        </fieldset>
        {locked ? null : (
          <p className="request-installation-facts-submit">
            <button
              type="submit"
              className={dirty ? "button-secondary" : "button-quiet"}
              disabled={busy}
            >
              Salvează datele de montaj
            </button>
          </p>
        )}
      </form>
    </section>
  );
}

function installationFormsEqual(left: FormState, right: FormState): boolean {
  const keys = Object.keys(left) as Array<keyof FormState>;
  return keys.every((key) => left[key] === right[key]);
}

function formFromFacts(facts: SiteInstallationFacts | null): FormState {
  return {
    siteName: facts?.siteName ?? "",
    street: facts?.street ?? "",
    city: facts?.city ?? "",
    county: facts?.county ?? "",
    postalCode: facts?.postalCode ?? "",
    countryCode: facts?.countryCode ?? "RO",
    contactName: facts?.contactName ?? "",
    contactPhone: facts?.contactPhone ?? "",
    accessNotes: facts?.accessNotes ?? "",
    measurementStatus: facts?.measurementStatus ?? "UNCONFIRMED",
    mountingSurfaceWidthMm: facts?.mountingSurfaceWidthMm?.toString() ?? "",
    mountingSurfaceHeightMm: facts?.mountingSurfaceHeightMm?.toString() ?? "",
    installationElevationMm: facts?.installationElevationMm?.toString() ?? "",
    measuredAt: facts?.measuredAt?.slice(0, 10) ?? "",
    measurementNotes: facts?.measurementNotes ?? "",
    facadeType: facts?.facadeType ?? "UNCONFIRMED",
    facadeOtherNote: facts?.facadeOtherNote ?? "",
    fixingMethod: facts?.fixingMethod ?? "UNCONFIRMED",
    fixingOtherNote: facts?.fixingOtherNote ?? "",
    siteElectrical: facts?.siteElectrical ?? "UNCONFIRMED",
    crewSize: facts?.crewSize?.toString() ?? "",
    plannedDurationHours: facts?.plannedDurationHours?.toString() ?? "",
  };
}

function patchFromForm(form: FormState): SiteInstallationFactsPatch {
  return {
    siteName: form.siteName,
    street: form.street,
    city: form.city,
    county: form.county,
    postalCode: form.postalCode,
    countryCode: form.countryCode || "RO",
    contactName: form.contactName,
    contactPhone: form.contactPhone,
    accessNotes: form.accessNotes,
    measurementStatus: form.measurementStatus,
    mountingSurfaceWidthMm: readOptionalNumber(form.mountingSurfaceWidthMm),
    mountingSurfaceHeightMm: readOptionalNumber(form.mountingSurfaceHeightMm),
    installationElevationMm: readOptionalNumber(form.installationElevationMm),
    measuredAt: form.measuredAt,
    measurementNotes: form.measurementNotes,
    facadeType: form.facadeType,
    facadeOtherNote: form.facadeOtherNote,
    fixingMethod: form.fixingMethod,
    fixingOtherNote: form.fixingOtherNote,
    siteElectrical: form.siteElectrical,
    crewSize: readOptionalInteger(form.crewSize),
    plannedDurationHours: readOptionalNumber(form.plannedDurationHours),
  };
}

function readOptionalInteger(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function readOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return Number(trimmed);
}
