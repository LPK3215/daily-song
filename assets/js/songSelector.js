/* songSelector.js - Date-based song rotation (cycles when list is exhausted)
   Rotation list format (either is accepted):
   1. Flat numeric keys: { "1": [...], "2": [...] }  (collected in ascending order)
   2. Legacy array:      { "songs": [[...], [...]] }
*/
import { ANCHOR_FALLBACK, MS_PER_DAY } from "./config.js";
import { normalizeEntry } from "./normalizer.js";

/** Collect the rotation list from a `songs` array or numeric-keyed entries */
function collectSongs(data) {
  if (!data) return [];
  if (Array.isArray(data.songs)) return data.songs;
  return Object.keys(data)
    .filter((k) => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => data[k]);
}

export function pickTodaySong(data, dateKey) {
  const songs = collectSongs(data);
  if (songs.length === 0) return null;

  const anchor = new Date((data.anchorDate || data.anchor || ANCHOR_FALLBACK) + "T00:00:00");
  const target = dateKey ? new Date(dateKey + "T00:00:00") : new Date();
  const today = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const dayIndex = Math.floor((today - anchor) / MS_PER_DAY);
  const i = ((dayIndex % songs.length) + songs.length) % songs.length;

  return normalizeEntry(songs[i]);
}
