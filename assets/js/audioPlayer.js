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

  /* ===== Duration helper ===== */
  function getDuration() {
    return audio.duration;
  }
  function updateDurationDisplay() {
    $("dur").textContent = formatTime(audio.duration);
  }

  audio.addEventListener("ended", syncBtn);

  /* ===== Restart: back to 0:00 and play ===== */
  restartBtn.addEventListener("click", () => {
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
  let dragging = false;
  let lastDisplaySec = -1;
  audio.addEventListener("timeupdate", () => {
    // During drag the preview drives the UI; skip to avoid fighting it
    if (dragging) return;
    const dur = getDuration();
    const pct = dur ? (audio.currentTime / dur) * 100 : 0;
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    // Only update text when the displayed second changes
    const sec = Math.floor(audio.currentTime);
    if (sec !== lastDisplaySec) {
      $("cur").textContent = formatTime(audio.currentTime);
      progress.setAttribute("aria-valuenow", Math.round(pct));
      lastDisplaySec = sec;
    }
  });

  /* ===== Progress bar drag seek (scrubbing with live preview) ===== */
  function ratioFromClientX(clientX) {
    const rect = progress.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  // Move fill/thumb + time text to a preview position without seeking yet
  function showPreview(ratio) {
    const dur = getDuration();
    const pct = ratio * 100;
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    if (isFinite(dur) && dur > 0) {
      $("cur").textContent = formatTime(ratio * dur);
      progress.setAttribute("aria-valuenow", Math.round(pct));
    }
  }

  progress.addEventListener("pointerdown", (e) => {
    dragging = true;
    progress.classList.add("is-dragging");
    showPreview(ratioFromClientX(e.clientX));
    // Capture so we keep receiving moves even outside the bar (best-effort)
    try { progress.setPointerCapture(e.pointerId); } catch (_) {}
  });
  progress.addEventListener("pointermove", (e) => {
    if (dragging) showPreview(ratioFromClientX(e.clientX));
  });
  progress.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    progress.classList.remove("is-dragging");
    // Apply the actual seek once, on release
    const dur = getDuration();
    const ratio = ratioFromClientX(e.clientX);
    if (isFinite(dur) && dur > 0) {
      audio.currentTime = ratio * dur;
    }
    try { progress.releasePointerCapture(e.pointerId); } catch (_) {}
  });
  progress.addEventListener("pointercancel", (e) => {
    dragging = false;
    progress.classList.remove("is-dragging");
    try { progress.releasePointerCapture(e.pointerId); } catch (_) {}
    // Restore visuals to the real position (seek was cancelled)
    const dur = getDuration();
    if (isFinite(dur) && dur > 0) {
      showPreview(audio.currentTime / dur);
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
      const dur = getDuration();
      if (details.seekTime != null && isFinite(details.seekTime) && isFinite(dur)) {
        audio.currentTime = Math.max(0, Math.min(details.seekTime, dur));
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
