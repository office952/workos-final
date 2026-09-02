const CANONICAL_CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCanonicalCalendarDate(
  value: string,
): { ok: true; date: string } | { ok: false } {
  const match = CANONICAL_CALENDAR_DATE.exec(value);
  if (!match) {
    return { ok: false };
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return { ok: false };
  }
  return { ok: true, date: `${match[1]}-${match[2]}-${match[3]}` };
}

export function calendarDateOrderIsValid(
  from: string | null | undefined,
  until: string | null | undefined,
): boolean {
  if (!from || !until) {
    return true;
  }
  return from <= until;
}
