/* activeSongLoader.js —— 加载当前应播放的歌曲
   查询链路：schedule.json（日期精确匹配） → songs.json（按日期轮播回退）
   设计意图：
   - schedule.json 是规划层：{ "2026-06-13": {...}, "2026-06-14": {...} }
   - 管理页面可读写 schedule.json 编排未来日期
   - 系统层只读：按当天日期查 schedule，没有则回退轮播 */

import { SONGS_URL } from "./config.js";
import { pickTodaySong } from "./songSelector.js";
import { formatDateKey } from "./utils.js";

const SCHEDULE_URL = "data/schedule.json";

/** 校验歌曲条目合法性 */
function isValidEntry(obj) {
  if (!obj || typeof obj !== "object") return false;
  if (!obj.source || !obj.src) return false;
  if (!["local", "url", "embed"].includes(obj.source)) return false;
  return true;
}

/** 补全可选字段默认值 */
function normalizeEntry(entry) {
  return {
    title: entry.title || "未命名",
    artist: entry.artist || "",
    source: entry.source,
    src: entry.src,
    cover: entry.cover || "",
    note: entry.note || "",
  };
}

/**
 * 加载当前应播放的歌曲对象
 * @returns {Promise<object>} { title, artist, source, src, cover, note }
 */
export async function loadActiveSong() {
  // 1. 读取 schedule.json，按当天日期精确匹配
  let entry = null;
  try {
    const res = await fetch(`${SCHEDULE_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const schedule = await res.json();
      const todayKey = formatDateKey(new Date());
      const matched = schedule[todayKey];
      if (isValidEntry(matched)) {
        entry = matched;
      }
    }
  } catch (_) {
    // schedule.json 不存在或格式错误，走回退
  }

  if (entry) return normalizeEntry(entry);

  // 2. 回退：按日期从 songs.json 轮播
  let data;
  try {
    const res = await fetch(`${SONGS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (_) {
    throw new Error("歌单加载失败（songs.json 读取错误）");
  }

  const song = pickTodaySong(data);
  if (!song) {
    throw new Error("歌单为空，请在 data/songs.json 中添加歌曲。");
  }
  return song;
}
