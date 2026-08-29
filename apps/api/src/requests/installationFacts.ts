import {
  applySiteInstallationFactsPatch,
  isSiteInstallationElectricalState,
  isSiteInstallationFacadeType,
  isSiteInstallationFixingMethod,
  isSiteInstallationMeasurementStatus,
  type SiteInstallationFacts,
  type SiteInstallationFactsMutationResult,
  type SiteInstallationFactsPatch,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";

type FactsRow = {
  request_id: string;
  version: number;
  site_name: string | null;
  street: string;
  city: string;
  county: string | null;
  postal_code: string | null;
  country_code: string;
  contact_name: string | null;
  contact_phone: string | null;
  access_notes: string | null;
  measurement_status: string;
  mounting_surface_width_mm: number | null;
  mounting_surface_height_mm: number | null;
  installation_elevation_mm: number | null;
  measured_at: string | null;
  measurement_notes: string | null;
  facade_type: string;
  facade_other_note: string | null;
  fixing_method: string;
  fixing_other_note: string | null;
  site_electrical: string;
  created_at: string;
  updated_at: string;
};

function factsFromRow(row: FactsRow): SiteInstallationFacts | null {
  if (
    !isSiteInstallationMeasurementStatus(row.measurement_status) ||
    !isSiteInstallationFacadeType(row.facade_type) ||
    !isSiteInstallationFixingMethod(row.fixing_method) ||
    !isSiteInstallationElectricalState(row.site_electrical)
  ) {
    return null;
  }
  return {
    requestId: row.request_id,
    version: row.version,
    siteName: row.site_name,
    street: row.street,
    city: row.city,
    county: row.county,
    postalCode: row.postal_code,
    countryCode: row.country_code,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    accessNotes: row.access_notes,
    measurementStatus: row.measurement_status,
    mountingSurfaceWidthMm: row.mounting_surface_width_mm,
    mountingSurfaceHeightMm: row.mounting_surface_height_mm,
    installationElevationMm: row.installation_elevation_mm,
    measuredAt: row.measured_at,
    measurementNotes: row.measurement_notes,
    facadeType: row.facade_type,
    facadeOtherNote: row.facade_other_note,
    fixingMethod: row.fixing_method,
    fixingOtherNote: row.fixing_other_note,
    siteElectrical: row.site_electrical,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getInstallationFacts(
  db: SqliteDatabase,
  requestId: string,
): SiteInstallationFacts | null {
  const row = db
    .prepare(
      `
      SELECT request_id, version, site_name, street, city, county, postal_code,
             country_code, contact_name, contact_phone, access_notes,
             measurement_status, mounting_surface_width_mm, mounting_surface_height_mm,
             installation_elevation_mm, measured_at, measurement_notes,
             facade_type, facade_other_note, fixing_method, fixing_other_note,
             site_electrical, created_at, updated_at
      FROM commercial_request_installation_facts
      WHERE request_id = ?
    `,
    )
    .get(requestId) as FactsRow | undefined;
  return row ? factsFromRow(row) : null;
}

export function deleteInstallationFacts(db: SqliteDatabase, requestId: string): void {
  db.prepare(
    `
    DELETE FROM commercial_request_installation_facts
    WHERE request_id = ?
  `,
  ).run(requestId);
}

export function persistInstallationFacts(
  db: SqliteDatabase,
  facts: SiteInstallationFacts,
): void {
  db.prepare(
    `
    INSERT INTO commercial_request_installation_facts (
      request_id, version, site_name, street, city, county, postal_code,
      country_code, contact_name, contact_phone, access_notes,
      measurement_status, mounting_surface_width_mm, mounting_surface_height_mm,
      installation_elevation_mm, measured_at, measurement_notes,
      facade_type, facade_other_note, fixing_method, fixing_other_note,
      site_electrical, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(request_id) DO UPDATE SET
      version = excluded.version,
      site_name = excluded.site_name,
      street = excluded.street,
      city = excluded.city,
      county = excluded.county,
      postal_code = excluded.postal_code,
      country_code = excluded.country_code,
      contact_name = excluded.contact_name,
      contact_phone = excluded.contact_phone,
      access_notes = excluded.access_notes,
      measurement_status = excluded.measurement_status,
      mounting_surface_width_mm = excluded.mounting_surface_width_mm,
      mounting_surface_height_mm = excluded.mounting_surface_height_mm,
      installation_elevation_mm = excluded.installation_elevation_mm,
      measured_at = excluded.measured_at,
      measurement_notes = excluded.measurement_notes,
      facade_type = excluded.facade_type,
      facade_other_note = excluded.facade_other_note,
      fixing_method = excluded.fixing_method,
      fixing_other_note = excluded.fixing_other_note,
      site_electrical = excluded.site_electrical,
      updated_at = excluded.updated_at
  `,
  ).run(
    facts.requestId,
    facts.version,
    facts.siteName,
    facts.street,
    facts.city,
    facts.county,
    facts.postalCode,
    facts.countryCode,
    facts.contactName,
    facts.contactPhone,
    facts.accessNotes,
    facts.measurementStatus,
    facts.mountingSurfaceWidthMm,
    facts.mountingSurfaceHeightMm,
    facts.installationElevationMm,
    facts.measuredAt,
    facts.measurementNotes,
    facts.facadeType,
    facts.facadeOtherNote,
    facts.fixingMethod,
    facts.fixingOtherNote,
    facts.siteElectrical,
    facts.createdAt,
    facts.updatedAt,
  );
}

export function persistUpdatedInstallationFacts(
  db: SqliteDatabase,
  requestId: string,
  patch: SiteInstallationFactsPatch,
  context: {
    selected: boolean;
    hasLinkedQuotes: boolean;
    expectedVersion?: number;
  },
): SiteInstallationFactsMutationResult {
  const current = getInstallationFacts(db, requestId);
  const updated = applySiteInstallationFactsPatch({
    selected: context.selected,
    hasLinkedQuotes: context.hasLinkedQuotes,
    current,
    patch,
    expectedVersion: context.expectedVersion,
    requestId,
  });
  if (!updated.ok || updated.alreadyApplied) {
    return updated;
  }
  persistInstallationFacts(db, updated.facts);
  return updated;
}
