/* embedPlayer.js —— 平台外链 iframe（embed） */
import { $ } from "./utils.js";

export function setupEmbed(song) {
  // Embed source uses an external iframe; hide the (non-functional) audio controls
  $("controls").hidden = true;
  const box = $("embed");
  box.hidden = false;
  const iframe = document.createElement("iframe");
  iframe.src = song.src;
  iframe.allow = "autoplay; encrypted-media";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer";
  box.appendChild(iframe);
}
