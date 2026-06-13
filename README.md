# Daily Song 🎵

A minimalist "daily song" web page: automatically switches songs every day, visitors can listen instantly. Pure static frontend (no build tools, no backend), deployed on GitHub Pages.

> Live demo: `https://<your-username>.github.io/daily-song/`

## Features

- **Date-based scheduling**: Arrange songs by date via `data/date-songs.json`, plan days or weeks ahead.
- **Three audio sources**: Local mp3 (`local`) / Direct URL (`url`) / Platform embed (`embed`).
- **Custom player**: Large play button + draggable progress bar + time display (`local`/`url` modes).
- **Zero dependencies, modular**: Native ES Modules + responsibility-based CSS splitting, no frameworks, no bundlers.
- Mobile-first, frosted glass cards, automatic dark mode.

## Directory Structure

```
daily-song/
├── index.html              # Entry point (required at root for GitHub Pages)
├── assets/
│   ├── css/                # Styles (split by responsibility)
│   │   ├── base.css        #   Reset + theme variables + background
│   │   ├── card.css        #   Card / cover / info / note
│   │   ├── player.css      #   Custom player / progress bar / embed
│   │   └── theme.css       #   Dark mode
│   ├── js/                 # Scripts (native ES modules)
│   │   ├── main.js         #   Entry point, orchestrates modules
│   │   ├── config.js       #   Constants
│   │   ├── utils.js        #   formatDate / formatTime / $
│   │   ├── dataLoader.js   #   Load default-songs.json
│   │   ├── songSelector.js #   Select song by date
│   │   ├── activeSongLoader.js # Load date-songs.json (date matching, priority)
│   │   ├── render.js       #   Cover / info / note / error
│   │   ├── audioPlayer.js  #   Custom player (local/url)
│   │   ├── embedPlayer.js  #   iframe (embed)
│   │   └── themeSwitch.js  #   Theme switching
│   └── pwa/                # PWA files
│       ├── manifest.json   #   App manifest
│       └── sw.js           #   Service worker
├── data/
│   ├── date-songs.json     # [CORE] Schedule songs by date (can plan ahead)
│   └── default-songs.json  # Song library (date-based rotation, fallback)
├── media/
│   ├── audio/              # Self-hosted mp3
│   └── covers/             # Cover images (optional)
├── README.md
├── LICENSE
└── .gitignore
```

> Separation of concerns: **Presentation** (css) / **Behavior** (js) / **Data** (data) / **Media** (media) are organized separately, with only `index.html` at root.

## Local Preview

This project uses native ES modules + `fetch`, **double-clicking `index.html` (`file://` protocol) will be blocked by browsers**. Please start a local static server:

```bash
# Choose one
python -m http.server 8000
npx serve .
```

Then open <http://localhost:8000>.

## How to Schedule Songs (Daily Operations)

**Just edit one file: `data/date-songs.json`**. Use dates as keys, values are songs to play that day. System automatically matches by current date.

```json
{
  "2026-06-13": ["Song Title", "Artist", "song.mp3"],
  "2026-06-14": ["Tomorrow's Song", "Artist 2", "https://example.com/song.mp3", "cover.jpg", "Daily note"]
}
```

New simplified format:
- Position 1: Song title (required)
- Position 2: Artist (required)
- Position 3: Audio file (required) - local filename or full URL
- Position 4: Cover image (optional)
- Position 5: Daily note (optional)

**Loading priority**: `date-songs.json` (match by date) → `default-songs.json` (rotation fallback). Page works even without `date-songs.json`.

## How to Add Songs (Expand Library)

Edit `data/default-songs.json`, add entries to the `songs` array:

```json
{
  "anchor": "2026-06-13",
  "songs": [
    ["Song 1", "Artist 1", "song1.mp3"],
    ["Song 2", "Artist 2", "https://cdn.com/song2.mp3", "cover2.jpg"],
    ["Song 3", "Artist 3", "song3.mp3", "cover3.jpg", "Daily quote"]
  ]
}
```

### ⚠️ Common Pitfalls

- NetEase Music / QQ Music / YouTube **"copy link" gives webpage URLs with hotlink protection** → Can't use `url`, only `embed`.
- `url` actually works for: Your own server's mp3, hotlink-friendly CDNs, archive.org, etc.
- **Self-hosted audio = publicly downloadable**, static hosting can't prevent downloads.
- **Deleting mp3 won't reduce repo size**: Files remain in git history, `.git` keeps growing. Use external links when possible; use git filter-repo / BFG to truly remove.
- Single file hard limit: 100MB, repo recommended: < 1GB.

## Deploy to GitHub Pages

1. Create repo `daily-song`, push code to `main` branch.
2. Settings → Pages → Source: select `main` branch, root `/`.
3. Wait for deployment, visit `https://<username>.github.io/daily-song/`.

## Keyboard Shortcuts

- `Space` / `Enter` - Play/Pause
- `←` / `→` - Seek backward/forward 5 seconds
- `T` - Switch accent color
- `B` - Switch background theme
- `ESC` - Exit fullscreen

## License

[MIT](./LICENSE)
