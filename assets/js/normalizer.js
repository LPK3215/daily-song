/* normalizer.js - Song entry normalization (shared by activeSongLoader & songSelector) */

const EMBED_HOSTS = ["youtube.com", "youtu.be", "bilibili.com", "spotify.com", "music.163.com"];

/** True if the URL's hostname is an embed host or a subdomain of one */
function isEmbedHost(src) {
  let hostname;
  try {
    hostname = new URL(src).hostname;
  } catch (_) {
    return false;
  }
  return EMBED_HOSTS.some(h => hostname === h || hostname.endsWith("." + h));
}

/** Detect source type from URL string */
export function detectSourceType(src) {
  if (typeof src !== "string") return "local";
  if (src.startsWith("http://") || src.startsWith("https://")) {
    if (isEmbedHost(src)) return "embed";
    return "url";
  }
  return "local";
}

/** Convert array format to standard object format */
export function normalizeArrayEntry(arr) {
  const [title, artist, src, cover = "", note = ""] = arr;

  const source = detectSourceType(src);
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

/** Fill optional fields with defaults (old object format) */
export function normalizeObjectEntry(entry) {
  entry = entry && typeof entry === "object" ? entry : {};
  return {
    title: entry.title || "Untitled",
    artist: entry.artist || "",
    source: entry.source || "local",
    src: entry.src,
    cover: entry.cover || "",
    note: entry.note || "",
  };
}

/** Unified entry: support both new (array) and old (object) formats */
export function normalizeEntry(entry) {
  if (Array.isArray(entry)) {
    return normalizeArrayEntry(entry);
  }
  return normalizeObjectEntry(entry);
}
