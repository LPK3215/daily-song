/* keyboard.js —— 键盘快捷键 + 快捷键速查面板 + 封面单击播放/暂停 */

import { $ } from "./utils.js";

const card = $("card");
const cover = $("cover");

/* ===== 快捷键速查面板 ===== */
const kbdPanel = $("kbdPanel");

function openKbdPanel() {
  kbdPanel.hidden = false;
}

function closeKbdPanel() {
  kbdPanel.hidden = true;
}

kbdPanel.addEventListener("click", (e) => {
  if (e.target === kbdPanel) closeKbdPanel();
});

document.addEventListener("keydown", (e) => {
  if (!kbdPanel.hidden && e.key !== "?") {
    closeKbdPanel();
  }
});

/* ===== 键盘快捷键 ===== */
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  const audio = $("audio");

  switch (e.key) {
    case "?":
      e.preventDefault();
      if (kbdPanel.hidden) {
        openKbdPanel();
      } else {
        closeKbdPanel();
      }
      break;

    case " ":
      e.preventDefault();
      if (!audio.src) return;
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
      break;

    case "ArrowLeft":
      e.preventDefault();
      if (isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      }
      break;

    case "ArrowRight":
      e.preventDefault();
      if (isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Math.min(audio.duration - 0.1, audio.currentTime + 5);
      }
      break;

    case "m":
    case "M":
      e.preventDefault();
      audio.muted = !audio.muted;
      const volumeWrap = $("volumeWrap");
      volumeWrap.classList.toggle("volume--muted", audio.muted);
      const iconBtn = $("volumeIconBtn");
      if (iconBtn) {
        iconBtn.querySelector(".volume__icon--on").hidden = audio.muted;
        iconBtn.querySelector(".volume__icon--off").hidden = !audio.muted;
        iconBtn.setAttribute("aria-label", audio.muted ? "取消静音" : "静音");
      }
      const volSlider = $("volumeSlider");
      if (audio.muted) {
        volSlider.value = 0;
      } else {
        volSlider.value = Math.round(audio.volume * 100);
      }
      break;

    case "r":
    case "R":
      e.preventDefault();
      {
        const spdBtn = $("speedBtn");
        if (!spdBtn || !audio.src) break;
        const speeds = [0.5, 1, 1.5, 2];
        let curIdx = speeds.indexOf(audio.playbackRate);
        if (curIdx < 0) curIdx = 1;
        curIdx = (curIdx + 1) % speeds.length;
        audio.playbackRate = speeds[curIdx];
        spdBtn.textContent = speeds[curIdx] + "x";
        if (speeds[curIdx] !== 1) {
          spdBtn.style.background = "rgba(108, 92, 231, 0.2)";
          spdBtn.style.borderColor = "var(--accent)";
          spdBtn.style.color = "var(--accent)";
        } else {
          spdBtn.style.background = "";
          spdBtn.style.borderColor = "";
          spdBtn.style.color = "";
        }
      }
      break;
  }
});

/* ===== 封面单击：播放/暂停 ===== */
let coverClickTimer = null;

cover.addEventListener("click", (e) => {
  if (e.target !== cover && e.target.tagName !== "IMG") return;

  if (coverClickTimer) {
    clearTimeout(coverClickTimer);
    coverClickTimer = null;
    return;
  } else {
    coverClickTimer = setTimeout(() => {
      coverClickTimer = null;
      const audio = $("audio");
      if (!audio.src) return;
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }, 280);
  }
});
