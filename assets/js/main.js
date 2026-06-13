/* main.js - Application entry point
   Loading priority: date-songs.json (exact date match) > default-songs.json (date-based rotation)
   Supports ?date=YYYY-MM-DD to preview songs for specific dates */
import { $, formatDate, formatDateKey } from "./utils.js";
import { loadActiveSong } from "./activeSongLoader.js";
import { renderMeta, showError, animateCardContent } from "./render.js";
import { setupAudioPlayer } from "./audioPlayer.js";
import { setupEmbed } from "./embedPlayer.js";
import { initThemeSwitcher } from "./themeSwitch.js";

async function main() {
  // Wait for DOM before initializing theme switcher
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }

  initThemeSwitcher();

  // Display date: use URL param or today
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date");
  let displayDate = new Date();
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const d = new Date(dateParam + "T00:00:00");
    if (!isNaN(d.getTime())) {
      displayDate = d;
    }
  }
  $("date").textContent = formatDate(displayDate);

  let song;
  try {
    song = await loadActiveSong();
  } catch (e) {
    showError(e.message || "Failed to load song");
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
      showError("Unknown source type: " + song.source);
      return;
  }

  animateCardContent();
}

main();
