/* render.js —— 封面 / 歌曲信息 / 寄语 / 错误兜底 */
import { $ } from "./utils.js";

export function renderMeta(song) {
  $("title").textContent = song.title || "未命名";
  $("artist").textContent = song.artist || "";

  if (song.cover) {
    const img = new Image();
    img.alt = song.title || "封面";
    img.onload = () => {
      $("coverFallback").hidden = true;
      $("cover").prepend(img);
    };
    img.onerror = () => { /* 加载失败保留渐变兜底 */ };
    img.src = song.cover;
  }

  if (song.note) {
    $("note").textContent = song.note;
    $("note").hidden = false;
  }
}

export function showError(msg) {
  $("error").textContent = msg || "今日歌曲加载失败 😢";
  $("error").hidden = false;
  $("controls").hidden = true;
  $("embed").hidden = true;
}
