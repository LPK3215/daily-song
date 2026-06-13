/* dataLoader.js —— 加载歌单数据 */
import { SONGS_URL } from "./config.js";

export async function loadSongs() {
  // 加时间戳 + no-store，确保推送后访客拿到最新 songs.json，不被缓存卡住
  const res = await fetch(`${SONGS_URL}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
