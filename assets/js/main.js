/* main.js - Application entry point
   Audio is hardcoded in HTML via <audio src="..."> to ensure complete playback.
   Song info and audio src are defined directly here, bypassing JSON config loading. */

import { $, formatDate } from "./utils.js";
import { setupAudioPlayer } from "./audioPlayer.js";
import { animateCardContent } from "./render.js";
import { initThemeSwitcher } from "./themeSwitch.js";

/* ---- Hardcoded song data (edit here to change song) ---- */
const SONG = {
  title: "空白",
  artist: "佚名",
  source: "local",
  // src not needed — audio element already has hardcoded src in HTML
  cover: "",
  note: "",
};

async function main() {
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }

  initThemeSwitcher();

  // Display today's date
  $("date").textContent = formatDate(new Date());

  // Apply song meta (hardcoded, not loaded from JSON)
  $("title").textContent = SONG.title;
  $("artist").textContent = SONG.artist;
  if (SONG.note) {
    $("note").textContent = SONG.note;
    $("note").hidden = false;
  }

  // Setup audio player with hardcoded song data
  setupAudioPlayer(SONG);

  animateCardContent();
}

main();
