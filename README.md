<div align="center">

![Daily Song Banner](./docs/images/banner.svg)

# Daily Song 🎵

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://lpk3215.github.io/daily-song/)
[![Pure Static](https://img.shields.io/badge/build-none-blue)](https://github.com/LPK3215/daily-song)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-purple)](https://github.com/LPK3215/daily-song)
[![Code Size](https://img.shields.io/badge/code-~2.1k%20lines-informational)](https://github.com/LPK3215/daily-song)

**A minimalist "daily song" web player that automatically switches songs every day.**  
Pure static frontend • Zero build tools • Zero backend • GitHub Pages ready

[🎵 Live Demo](https://lpk3215.github.io/daily-song/) • [📖 Documentation](#documentation) • [🚀 Quick Start](#quick-start) • [🤝 Contributing](./CONTRIBUTING.md)

</div>

---

## ✨ Features

- **📅 Date-based Scheduling**: Arrange songs by date via `data/date-songs.json`, plan days or weeks ahead
- **🎵 Three Audio Sources**: Local MP3 / Direct URL / Platform embed (YouTube, Bilibili, Spotify, etc.)
- **🎮 Custom Player**: Large play button + draggable progress bar + time display + keyboard shortcuts
- **🎨 Dual Theme System**: 4 backgrounds × 7 accent colors = 28 theme combinations
- **⚡ Zero Dependencies**: Native ES Modules + vanilla JavaScript, no frameworks or bundlers
- **📱 Mobile-First**: Responsive design with frosted glass cards and smooth animations
- **🌐 PWA Ready**: Installable to home screen, works offline with Service Worker
- **♿ Accessible**: Full keyboard navigation, ARIA labels, semantic HTML

## 🎹 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Play / Pause |
| `←` / `→` | Seek backward / forward 5 seconds |
| `T` | Switch accent color theme |
| `B` | Switch background theme |
| `ESC` | Exit fullscreen |

---

## 🏗️ Architecture

![Architecture Diagram](./docs/images/architecture.svg)

### Project Structure

```
daily-song/
├── index.html              # Entry point (GitHub Pages)
├── assets/
│   ├── css/                # Modular stylesheets (~800 lines)
│   │   ├── base.css        #   Reset + theme variables + star background
│   │   ├── card.css        #   Card layout + cover + song info
│   │   ├── player.css      #   Player controls + progress bar
│   │   └── theme.css       #   Theme system (4 × 7 combinations)
│   ├── js/                 # ES Modules (~1300 lines)
│   │   ├── main.js         #   Entry point, orchestrates all modules
│   │   ├── config.js       #   Global constants
│   │   ├── utils.js        #   Date/time formatting utilities
│   │   ├── activeSongLoader.js # Load date-scheduled songs
│   │   ├── songSelector.js #   Select song from rotation list
│   │   ├── audioPlayer.js  #   Custom HTML5 audio player
│   │   ├── embedPlayer.js  #   Platform iframe embed player
│   │   ├── render.js       #   DOM rendering and animations
│   │   ├── themeSwitch.js  #   Theme switching logic
│   │   ├── dataLoader.js   #   JSON data loading
│   │   └── keyboard.js     #   Keyboard shortcut handlers
│   └── pwa/                # Progressive Web App files
│       ├── manifest.json   #   App manifest for installation
│       └── sw.js           #   Service Worker for offline mode
├── data/                   # Configuration (JSON)
│   ├── date-songs.json     #   [Priority] Date-to-song mapping
│   └── default-songs.json  #   [Fallback] Rotation song list
├── media/                  # Media assets
│   ├── audio/              #   Self-hosted MP3 files
│   └── covers/             #   Album cover images
├── docs/                   # Documentation assets
│   ├── images/             #   SVG diagrams and banners
│   └── scripts/            #   SVG generation scripts
├── README.md               # This file
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
├── CODE_OF_CONDUCT.md      # Community guidelines
├── .gitignore              # Git ignore rules
└── .gitattributes          # Line ending rules
```

---

## 🚀 Quick Start

### Prerequisites

A static file server (any one):
- Python 3: `python -m http.server 8080`
- Node.js: `npx serve .`
- PHP: `php -S localhost:8080`

> ⚠️ Double-clicking `index.html` won't work due to ES Modules requiring HTTP protocol.

### Local Preview

```bash
# Clone the repository
git clone https://github.com/LPK3215/daily-song.git
cd daily-song

# Start local server (choose one)
python -m http.server 8080   # Python
npx serve .                  # Node.js

# Open browser
open http://localhost:8080
```

### Deploy to GitHub Pages

1. Fork or clone this repository
2. Push to your GitHub account
3. Go to **Settings** → **Pages**
4. Select **Source**: `main` branch, `/` (root)
5. Wait for deployment (~1-2 minutes)
6. Visit `https://<your-username>.github.io/daily-song/`

---

## 📝 Configuration

### Song Scheduling

Edit `data/date-songs.json` to schedule specific songs for specific dates:

```json
{
  "2026-06-13": ["Song Title", "Artist Name", "song.mp3"],
  "2026-06-14": ["Another Song", "Artist", "https://cdn.com/song.mp3", "cover.jpg"],
  "2026-12-25": ["Christmas Song", "Artist", "xmas.mp3", "xmas.jpg", "Merry Christmas!"]
}
```

**Array Format**:
- `[0]` Song title (required)
- `[1]` Artist name (required)
- `[2]` Audio source (required) - local filename or full URL
- `[3]` Cover image (optional) - local filename or full URL
- `[4]` Daily note (optional) - displayed below song info

### Rotation List

Edit `data/default-songs.json` for daily rotation (used when date not in schedule):

```json
{
  "anchor": "2026-06-13",
  "songs": [
    ["Song 1", "Artist 1", "song1.mp3"],
    ["Song 2", "Artist 2", "song2.mp3", "cover2.jpg"],
    ["Song 3", "Artist 3", "song3.mp3", "cover3.jpg", "Daily inspiration"]
  ]
}
```

**Loading Priority**: `date-songs.json` → `default-songs.json`

### Audio Sources

| Type | Example | Notes |
|------|---------|-------|
| **Local** | `song.mp3` | Place in `media/audio/`, auto-prefixed |
| **Direct URL** | `https://cdn.com/song.mp3` | Must support CORS and hotlinking |
| **Embed** | `https://music.163.com/outchain/...` | Platform iframe player |

---

## 🎨 Theme Customization

The dual theme system provides 28 combinations:

**Backgrounds** (Press `B`):
- 🌑 Dark (default)
- ☀️ Light
- 🔥 Warm
- 💜 Purple Night

**Accent Colors** (Press `T`):
- 💙 Neon Blue (default)
- 💗 Cyber Pink
- 💚 Electric Green
- 🧡 Sunset Orange
- 🩵 Neon Cyan
- 💜 Violet
- ❤️ Rose Red

Themes persist in `localStorage` and sync across page reloads.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES Modules) |
| **Styles** | Pure CSS3 (Custom Properties) |
| **Audio** | Native HTML5 `<audio>` API |
| **PWA** | Service Worker + Web App Manifest |
| **Build** | None (zero build tools) |
| **Hosting** | GitHub Pages |
| **Dependencies** | Zero npm packages |

---

## 📖 Documentation

- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [Changelog](./CHANGELOG.md) - Version history
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community guidelines
- [Configuration Guide](./data/README.md) - Detailed config docs (Chinese)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) first.

### Development Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/daily-song.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes and test locally
python -m http.server 8080

# 4. Commit with conventional commits
git commit -m "feat: add amazing feature"

# 5. Push and create pull request
git push origin feature/amazing-feature
```

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**LPK3215**
- GitHub: [@LPK3215](https://github.com/LPK3215)
- Email: 17538703215@163.com
- Project: [Daily Song](https://github.com/LPK3215/daily-song)

---

## 🌟 Acknowledgments

- Design inspiration from modern music players
- Icon font: Native SVG shapes
- Background: Pure CSS star animation

---

## 📊 Project Stats

- **Code Lines**: ~2,100 (JavaScript + CSS)
- **Modules**: 11 ES Modules
- **Themes**: 28 combinations (4 × 7)
- **Zero**: Build time, dependencies, backend

---

<div align="center">

**[⬆ Back to Top](#daily-song-)**

Made with ❤️ by [LPK3215](https://github.com/LPK3215)

</div>
