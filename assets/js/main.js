/* main.js —— 应用入口：编排各模块
   加载优先级：data/active-song.json > songs.json 按日期轮播 */
import { $, formatDate } from "./utils.js";
import { loadActiveSong } from "./activeSongLoader.js";
import { renderMeta, showError } from "./render.js";
import { setupAudioPlayer } from "./audioPlayer.js";
import { setupEmbed } from "./embedPlayer.js";

async function main() {
  $("date").textContent = formatDate(new Date());

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
      showError("未知音源类型：" + song.source);
  }
}

main();
