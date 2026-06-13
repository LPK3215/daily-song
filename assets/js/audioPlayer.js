/* audioPlayer.js - 核心播放器: 播放/暂停 / 重听 / 进度条 / 时间显示
   精简版: 仅保留核心播放功能 */
import { $, formatTime } from "./utils.js";
import { showError } from "./render.js";

export function setupAudioPlayer(song) {
  const audio = $("audio");
  const playBtn = $("playBtn");
  const restartBtn = $("restartBtn");
  const iconPlay = playBtn.querySelector(".icon-play");
  const iconPause = playBtn.querySelector(".icon-pause");
  const progress = $("progress");
  const fill = $("progressFill");
  const thumb = $("progressThumb");
  const cover = document.querySelector(".cover");

  $("controls").hidden = false;
  audio.src = song.src;

  /* ===== 播放/暂停 按钮状态同步 ===== */
  function syncBtn() {
    const playing = !audio.paused && !audio.ended;
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");

    // 封面旋转
    if (cover) {
      if (playing) {
        cover.classList.add("is-playing");
      } else {
        cover.classList.remove("is-playing");
      }
    }
  }

  syncBtn();

  /* ===== 播放/暂停 ===== */
  function togglePlay() {
    if (audio.paused) {
      audio.play().catch(() => showError("Browser blocked playback. Please click again."));
    } else {
      audio.pause();
    }
  }

  playBtn.addEventListener("click", togglePlay);

  // 封面点击播放/暂停
  if (cover) {
    cover.addEventListener("click", togglePlay);
  }

  audio.addEventListener("play", syncBtn);
  audio.addEventListener("pause", syncBtn);
  audio.addEventListener("ended", syncBtn);

  /* ===== 重听: 回到 0:00 并播放 ===== */
  restartBtn.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play().catch(() => showError("Browser blocked playback. Please click again."));
  });

  /* ===== 音频错误 ===== */
  audio.addEventListener("error", () => {
    showError("Failed to load audio (invalid URL or CORS blocked)");
  });

  /* ===== 时长显示 ===== */
  audio.addEventListener("loadedmetadata", () => {
    $("dur").textContent = formatTime(audio.duration);
  });

  /* ===== 进度更新 ===== */
  audio.addEventListener("timeupdate", () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    $("cur").textContent = formatTime(audio.currentTime);
    progress.setAttribute("aria-valuenow", Math.round(pct));
  });

  /* ===== 进度条拖动 seek ===== */
  function seekFromClientX(clientX) {
    const rect = progress.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = ratio * audio.duration;
    }
  }

  let dragging = false;
  progress.addEventListener("pointerdown", (e) => {
    dragging = true;
    progress.setPointerCapture(e.pointerId);
    seekFromClientX(e.clientX);
  });
  progress.addEventListener("pointermove", (e) => {
    if (dragging) seekFromClientX(e.clientX);
  });
  progress.addEventListener("pointerup", (e) => {
    dragging = false;
    progress.releasePointerCapture(e.pointerId);
  });

  /* ===== 键盘: 方向键 +-5s ===== */
  progress.addEventListener("keydown", (e) => {
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    }
  });

  /* ===== Media Session API (系统媒体控件) ===== */
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title || "Daily Song",
      artist: song.artist || "",
      album: "Daily Song",
      artwork: song.cover
        ? [{ src: song.cover, sizes: "512x512", type: "image/jpeg" }]
        : [],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audio.play().catch(() => {});
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audio.pause();
    });
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null && isFinite(details.seekTime)) {
        audio.currentTime = Math.min(details.seekTime, audio.duration);
      }
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      if (isFinite(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
      }
    });
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
  }
}
