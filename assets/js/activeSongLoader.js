/* activeSongLoader.js - Load currently playing song
   Query chain: date-songs.json (exact date match) → default-songs.json (date-based rotation fallback)
   Supports ?date=YYYY-MM-DD to preview songs for specific dates */

import { SONGS_URL } from "./config.js";
import { pickTodaySong } from "./songSelector.js";
import { formatDateKey } from "./utils.js";
import { normalizeEntry } from "./normalizer.js";

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

/** Validate song entry (support both new and old formats) */
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

/**
 * Load currently playing song
 * @returns {Promise<object>} { title, artist, source, src, cover, note }
 */
export async function loadActiveSong() {
  const targetKey = getTargetDateKey();

  // 1. Read date-songs.json, match by target date
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
    // date-songs.json doesn't exist or format error, fallback
  }

  if (entry) return normalizeEntry(entry);

  // 2. Fallback: rotation from default-songs.json by date
  let data;
  try {
    const res = await fetch(`${SONGS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (_) {
    throw new Error("Song list loading failed (default-songs.json read error)");
  }

  const song = pickTodaySong(data);
  if (!song) {
    throw new Error("Song list is empty, please add songs to data/default-songs.json.");
  }
  return song;
}
