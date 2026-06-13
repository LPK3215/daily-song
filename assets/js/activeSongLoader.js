/* activeSongLoader.js —— Load currently playing song
   Query chain: date-songs.json (exact date match) → default-songs.json (date-based rotation fallback)
   Design intent:
   - schedule.json is planning layer:{ "2026-06-13": {...}, "2026-06-14": {...} }
   - Admin page can read/write schedule.json to plan future dates
   - System layer read-only: query schedule by current date, fallback to rotation if not found */

import { SONGS_URL } from "./config.js";
import { pickTodaySong } from "./songSelector.js";
import { formatDateKey } from "./utils.js";

const SCHEDULE_URL = "data/date-songs.json";

/** Read preview date from URL params, return formatted date key; return today if no params */
function getTargetDateKey() {
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date");
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const d = new Date(dateParam + "T00:00:00");
    if (!isNaN(d.getTime())) {
      return formatDateKey(d);
    }
  }
  return formatDateKey(new Date());
}

/** Validate song entry (support both new and old formats)*/
function isValidEntry(obj) {
  // New format: array [title, artist, src, cover?, note?]
  if (Array.isArray(obj)) {
    return obj.length >= 3 && typeof obj[0] === "string" && typeof obj[1] === "string" && typeof obj[2] === "string";
  }

  // Old format: object { title, artist, source, src, ... }
  if (!obj || typeof obj !== "object") return false;
  if (!obj.source || !obj.src) return false;
  if (!["local", "url", "embed"].includes(obj.source)) return false;
  return true;
}

/** Convert array format to standard object format */
function normalizeArrayEntry(arr) {
  const [title, artist, src, cover = "", note = ""] = arr;

  // Auto-detect source type
  let source = "local";
  if (src.startsWith("http://") || src.startsWith("https://")) {
    source = "url";
  } else if (src.includes("youtube.com") || src.includes("bilibili.com") || src.includes("spotify.com")) {
    source = "embed";
  }

  // Complete path
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

/** Fill optional fields with defaults (old format)*/
function normalizeObjectEntry(entry) {
  return {
    title: entry.title || "Untitled",
    artist: entry.artist || "",
    source: entry.source,
    src: entry.src,
    cover: entry.cover || "",
    note: entry.note || "",
  };
}

/** Unified entry: support both new and old formats */
function normalizeEntry(entry) {
  if (Array.isArray(entry)) {
    return normalizeArrayEntry(entry);
  }
  return normalizeObjectEntry(entry);
}

/**
 * Load currently playing song对象
 * Support ?date=YYYY-MM-DD to preview songs for specific dates
 * @returns {Promise<object>} { title, artist, source, src, cover, note }
 */
export async function loadActiveSong() {
  const targetKey = getTargetDateKey();

  // 1. Read schedule.json, match by target date
  let entry = null;
  try {
    const res = await fetch(`${SCHEDULE_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const schedule = await res.json();
      const matched = schedule[targetKey];
      if (isValidEntry(matched)) {
        entry = matched;
      }
    }
  } catch (_) {
    // schedule.json doesn't exist or format error, fallback
  }

  if (entry) return normalizeEntry(entry);

  // 2. Fallback: rotation from songs.json by date
  let data;
  try {
    const res = await fetch(`${SONGS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (_) {
    throw new Error("Song list loading failed（songs.json 读取错误）");
  }

  const song = pickTodaySong(data);
  if (!song) {
    throw new Error("Song list is empty, please add songs to data/default-songs.json.");
  }
  return song;
}
