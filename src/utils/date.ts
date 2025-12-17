/**
 * Parses an event date safely without timezone day-shifting.
 *
 * - If the input is a "date-only" string (YYYY-MM-DD), we treat it as a *local* calendar date.
 *   (Using `new Date("YYYY-MM-DD")` interprets as UTC and can shift to the previous day locally.)
 * - Otherwise we fall back to the built-in Date parsing.
 */
export function parseEventDate(date: string | Date): Date {
  if (date instanceof Date) return date;

  // Date-only ISO format (no time component)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (m) {
    const year = Number(m[1]);
    const monthIndex = Number(m[2]) - 1; // 0-based
    const day = Number(m[3]);
    return new Date(year, monthIndex, day);
  }

  return new Date(date);
}
