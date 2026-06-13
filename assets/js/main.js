/* main.js - 应用入口
   加载优先级: schedule.json 按日期匹配 > songs.json 按日期轮播
   支持 ?date=YYYY-MM-DD 预览指定日期歌曲 */
import { $, formatDate } from "./utils.js";
import { loadActiveSong } from "./activeSongLoader.js";
import { renderMeta, showError, animateCardContent } from "./render.js";
import { setupAudioPlayer } from "./audioPlayer.js";
import { setupEmbed } from "./embedPlayer.js";
import { initThemeSwitcher } from "./themeSwitch.js";

async function main() {
  // 等待 DOM 完全加载后再初始化主题切换器
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }

  // 初始化主题切换器
  initThemeSwitcher();

  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date");
  let displayDate;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const d = new Date(dateParam + "T00:00:00");
    if (!isNaN(d.getTime())) {
      displayDate = d;
    }
  }
  if (!displayDate) displayDate = new Date();

  $("date").textContent = formatDate(displayDate);

  let song;
  try {
    song = await loadActiveSong();
  } catch (e) {
    showError(e.message || "歌曲加载失败");
    return;
  }

  renderMeta(song);

  switch (song.source) {
    case "local":
    case "url":
      setupAudioPlayer(song);
      break;
    case "embed":
      setupEmbed(song);
      break;
    default:
      showError("未知音源类型: " + song.source);
      return;
  }

  animateCardContent();
}

main();
