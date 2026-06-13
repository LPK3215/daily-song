/* audioPlayer.js - Core player: play/pause, restart, progress bar, time display, volume */
import { $, formatTime } from "./utils.js";
import { showError } from "./render.js";

export function setupAudioPlayer(song) {
  const audio = $("audio");
  const playBtn = $("playBtn");
  const restartBtn = $("restartBtn");
  const volumeBtn = $("volumeBtn");
  const iconPlay = playBtn.querySelector(".icon-play");
  const iconPause = playBtn.querySelector(".icon-pause");
  const progress = $("progress");
  const fill = $("progressFill");
  const thumb = $("progressThumb");
  const cover = document.querySelector(".cover");

  $("controls").hidden = false;
  audio.src = song.src;

  /* ===== Play/Pause button state sync ===== */
  function syncBtn() {
    const playing = !audio.paused && !audio.ended;
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");

    // Cover rotation
    if (cover) {
      cover.classList.toggle("is-playing", playing);
    }
  }

  syncBtn();

  /* ===== Play/Pause toggle ===== */
  function togglePlay() {
    if (audio.paused) {
      audio.play().catch(() => showError("Browser blocked playback. Please click again."));
    } else {
      audio.pause();
    }
  }

  playBtn.addEventListener("click", togglePlay);

  // Cover click to play/pause
  if (cover) {
    cover.addEventListener("click", togglePlay);
  }

  audio.addEventListener("play", syncBtn);
  audio.addEventListener("pause", syncBtn);

  /* ===== VBR duration correction (MP3 without Xing header) ===== */
  let correctedDuration = null;
  function getDuration() {
    return correctedDuration || audio.duration;
  }
  function updateDurationDisplay() {
    $("dur").textContent = formatTime(getDuration());
  }

  audio.addEventListener("ended", () => {
    syncBtn();
    // Detect real duration: if audio ends significantly before reported duration,
    // the MP3 has no Xing header and browser overestimated the duration
    if (audio.currentTime > 10 && audio.duration > 10 && audio.currentTime < audio.duration * 0.95) {
      correctedDuration = audio.currentTime;
      updateDurationDisplay();
    }
  });

  /* ===== Restart: back to 0:00 and play ===== */
  restartBtn.addEventListener("click", () => {
    correctedDuration = null;
    audio.currentTime = 0;
    audio.play().catch(() => showError("Browser blocked playback. Please click again."));
  });

  /* ===== Volume: mute/unmute toggle ===== */
  function updateVolIcon() {
    volumeBtn.classList.toggle("is-muted", audio.muted);
    volumeBtn.setAttribute("aria-label", audio.muted ? "Unmute" : "Mute");
  }

  volumeBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    updateVolIcon();
  });

  /* ===== Audio error ===== */
  audio.addEventListener("error", () => {
    showError("Failed to load audio (invalid URL or CORS blocked)");
  });

  /* ===== Duration display ===== */
  audio.addEventListener("loadedmetadata", () => {
    updateDurationDisplay();
  });

  /* ===== Progress update ===== */
  audio.addEventListener("timeupdate", () => {
    const dur = getDuration();
    const pct = dur ? (audio.currentTime / dur) * 100 : 0;
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    $("cur").textContent = formatTime(audio.currentTime);
    progress.setAttribute("aria-valuenow", Math.round(pct));
  });

  /* ===== Progress bar drag seek ===== */
  function seekFromClientX(clientX) {
    const rect = progress.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const dur = getDuration();
    if (isFinite(dur) && dur > 0) {
      audio.currentTime = ratio * dur;
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

  /* ===== Keyboard: arrow keys ±5s ===== */
  progress.addEventListener("keydown", (e) => {
    const dur = getDuration();
    if (!isFinite(dur) || dur <= 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      audio.currentTime = Math.min(audio.currentTime + 5, dur);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    }
  });

  /* ===== Media Session API (system media controls) ===== */
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
        audio.currentTime = Math.min(details.seekTime, getDuration());
      }
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      const dur = getDuration();
      if (isFinite(dur)) {
        audio.currentTime = Math.min(dur, audio.currentTime + 10);
      }
    });
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
  }
}
