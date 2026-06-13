/* songSelector.js - Date-based song rotation (cycles when list is exhausted)
   Supports both formats:
   1. New format (array): ["Title", "Artist", "File", "Cover?", "Note?"]
   2. Old format (object): { title, artist, source, src, cover, note }
*/
import { ANCHOR_FALLBACK, MS_PER_DAY } from "./config.js";
import { normalizeEntry } from "./normalizer.js";

export function pickTodaySong(data, dateKey) {
  const songs = data && Array.isArray(data.songs) ? data.songs : [];
  if (songs.length === 0) return null;

  const anchor = new Date((data.anchorDate || data.anchor || ANCHOR_FALLBACK) + "T00:00:00");
  const target = dateKey ? new Date(dateKey + "T00:00:00") : new Date();
  const today = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const dayIndex = Math.floor((today - anchor) / MS_PER_DAY);
  const i = ((dayIndex % songs.length) + songs.length) % songs.length;

  return normalizeEntry(songs[i]);
}
