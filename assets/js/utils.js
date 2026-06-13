/* utils.js —— 通用工具 */
export const $ = (id) => document.getElementById(id);

/** June 13 */
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' });
export function formatDate(d) {
  return dateFmt.format(d);
}

/** 2026-06-13（用于 schedule.json 日期键） */
export function formatDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Validate that year/month/day form a real calendar date */
function isValidYMD(y, mo, d) {
  const y2 = +y, mo2 = +mo, d2 = +d;
  if (mo2 < 1 || mo2 > 12 || d2 < 1) return false;
  const dt = new Date(y2, mo2 - 1, d2);
  return dt.getFullYear() === y2 && dt.getMonth() === mo2 - 1 && dt.getDate() === d2;
}

/**
 * Parse a date key in multiple formats. Returns { type, key } or null.
 *   YYYY-MM-DD / YYYY/M/D        -> { type: "full",   key: "YYYY-MM-DD" }
 *   MM-DD / M-D / MM/DD / M/D    -> { type: "annual", key: "MM-DD" }
 * Non-date strings (e.g. "_comment", "_format") return null so they can be skipped.
 */
export function parseDateKey(raw) {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (m) {
    const [, y, mo, d] = m;
    if (!isValidYMD(y, mo, d)) return null;
    return { type: "full", key: `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}` };
  }
  m = s.match(/^(\d{1,2})[-/](\d{1,2})$/);
  if (m) {
    const [, mo, d] = m;
    // validate against a leap year so Feb 29 is accepted as an annual key
    if (!isValidYMD(2000, mo, d)) return null;
    return { type: "annual", key: `${mo.padStart(2, "0")}-${d.padStart(2, "0")}` };
  }
  return null;
}

/** Parse a flexible full-date string into a Date (local midnight), or null */
export function parseFullDate(raw) {
  const parsed = parseDateKey(raw);
  if (!parsed || parsed.type !== "full") return null;
  const d = new Date(parsed.key + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

/** 秒 -> m:ss */
export function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
