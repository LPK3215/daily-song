/* songSelector.js —— 按日期轮播选歌（播完循环）
   支持两种格式：
   1. 新格式（数组）：["歌名", "歌手", "文件", "封面?", "寄语?"]
   2. 旧格式（对象）：{ title, artist, source, src, cover, note }
*/
import { ANCHOR_FALLBACK, MS_PER_DAY } from "./config.js";

/** 将数组格式转换为标准对象 */
function normalizeArrayEntry(arr) {
  const [title, artist, src, cover = "", note = ""] = arr;

  // 自动判断 source 类型
  let source = "local";
  if (src.startsWith("http://") || src.startsWith("https://")) {
    source = "url";
  } else if (src.includes("youtube.com") || src.includes("bilibili.com") || src.includes("spotify.com")) {
    source = "embed";
  }

  // 补全路径
  const fullSrc = source === "local" ? `media/audio/${src}` : src;
  const fullCover = cover && !cover.startsWith("http") ? `media/covers/${cover}` : cover;

  return {
    title: title || "Untitled",
    artist: artist || "",
    source: source,
    src: fullSrc,
    cover: fullCover,
    note: note || "",
  };
}

/** 将对象格式补全默认值 */
function normalizeObjectEntry(entry) {
  return {
    title: entry.title || "Untitled",
    artist: entry.artist || "",
    source: entry.source || "local",
    src: entry.src,
    cover: entry.cover || "",
    note: entry.note || "",
  };
}

/** 统一入口：支持新旧两种格式 */
function normalizeSong(song) {
  if (Array.isArray(song)) {
    return normalizeArrayEntry(song);
  }
  return normalizeObjectEntry(song);
}

export function pickTodaySong(data) {
  const songs = data && Array.isArray(data.songs) ? data.songs : [];
  if (songs.length === 0) return null; // 空歌单兜底，避免 % 0 得 NaN

  const anchor = new Date((data.anchorDate || data.anchor || ANCHOR_FALLBACK) + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayIndex = Math.floor((today - anchor) / MS_PER_DAY);
  const i = ((dayIndex % songs.length) + songs.length) % songs.length;

  return normalizeSong(songs[i]);
}
