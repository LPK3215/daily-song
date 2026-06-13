/* utils.js —— 通用工具 */
export const $ = (id) => document.getElementById(id);

/** 6月13日 */
export function formatDate(d) {
  return `${d.getMonth() + 1}月${d.getDate()}日`;
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
