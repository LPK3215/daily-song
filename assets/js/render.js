/* render.js - 封面 / 歌曲信息 / 寄语 / 错误兜底 / 入场动画 */
import { $ } from "./utils.js";

export function renderMeta(song) {
  $("title").textContent = song.title || "Untitled";
  $("artist").textContent = song.artist || "";

  if (song.cover) {
    const img = new Image();
    img.alt = song.title || "封面";
    img.onload = () => {
      // Prevent duplicate cover images
      const coverEl = $("cover");
      if (coverEl.querySelector("img")) return;
      $("coverFallback").hidden = true;
      coverEl.prepend(img);
    };
    img.onerror = () => {
      /* 加载失败保留音符兜底 */
    };
    img.src = song.cover;
  }

  if (song.note) {
    $("note").textContent = song.note;
    $("note").hidden = false;
  }
}

/** 卡片内容交错入场 (CSS class 驱动) */
export function animateCardContent() {
  const card = document.getElementById("card");
  if (card) {
    requestAnimationFrame(() => {
      card.classList.add("card--reveal");
    });
  }
}

export function showError(msg) {
  const errEl = $("error");
  const controlsEl = $("controls");
  const embedEl = $("embed");
  if (errEl) {
    errEl.textContent = msg || "Failed to load. Please refresh.";
    errEl.hidden = false;
  }
  if (controlsEl) controlsEl.hidden = true;
  if (embedEl) embedEl.hidden = true;
}
