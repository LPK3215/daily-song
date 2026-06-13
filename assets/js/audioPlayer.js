/* audioPlayer.js —— 自定义音频播放器（local / url）
   播放/暂停、进度填充、拖动 seek、键盘 ±5s、时间显示 */
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

  $("controls").hidden = false;
  audio.src = song.src;

  audio.addEventListener("error", () => {
    showError("今日歌曲加载失败 😢（音频地址无效或跨域被拦）");
  });

  // 初始化图标状态（默认暂停态）
  syncBtn();

  // 播放 / 暂停
  function syncBtn() {
    const playing = !audio.paused && !audio.ended;
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
    playBtn.setAttribute("aria-label", playing ? "暂停" : "播放");
  }
  playBtn.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => showError("浏览器拒绝播放，请再点一次。"));
    else audio.pause();
  });
  audio.addEventListener("play", syncBtn);
  audio.addEventListener("pause", syncBtn);
  audio.addEventListener("ended", syncBtn);

  // 重新开始：回到 0:00 并播放
  restartBtn.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play().catch(() => showError("浏览器拒绝播放，请再点一次。"));
  });

  // 时间 / 进度
  audio.addEventListener("loadedmetadata", () => {
    $("dur").textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    $("cur").textContent = formatTime(audio.currentTime);
    progress.setAttribute("aria-valuenow", Math.round(pct));
  });

  // 拖动 / 点击 seek
  function seekFromClientX(clientX) {
    const rect = progress.getBoundingClientRect();
    const ratio = Math.min(0.995, Math.max(0, (clientX - rect.left) / rect.width));
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

  // 键盘可达性：左右方向键 ±5s
  progress.addEventListener("keydown", (e) => {
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration - 0.1, audio.currentTime + 5);
    else if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
}
