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

/** 秒 -> m:ss */
export function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
