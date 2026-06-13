/* embedPlayer.js —— 平台外链 iframe（embed） */
import { $ } from "./utils.js";

export function setupEmbed(song) {
  const box = $("embed");
  box.hidden = false;
  const iframe = document.createElement("iframe");
  iframe.src = song.src;
  iframe.allow = "autoplay; encrypted-media";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer";
  box.appendChild(iframe);
}
