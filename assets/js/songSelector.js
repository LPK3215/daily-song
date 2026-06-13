/* songSelector.js —— 按日期轮播选歌（播完循环） */
import { ANCHOR_FALLBACK, MS_PER_DAY } from "./config.js";

export function pickTodaySong(data) {
  const songs = data && Array.isArray(data.songs) ? data.songs : [];
  if (songs.length === 0) return null; // 空歌单兜底，避免 % 0 得 NaN

  const anchor = new Date((data.anchorDate || ANCHOR_FALLBACK) + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayIndex = Math.floor((today - anchor) / MS_PER_DAY);
  const i = ((dayIndex % songs.length) + songs.length) % songs.length;
  return songs[i];
}
