# 每日一歌 🎵

极简的「每日单曲」网页：每天自动切换一首歌，访客点开即听。纯静态前端（无构建、无后端），部署在 GitHub Pages。

> 在线地址：`https://<你的用户名>.github.io/daily-song/`

## 特性

- **日期编排**：通过 `data/schedule.json` 按日期精确安排歌曲，支持提前规划未来多天。
- **三种音源**：仓库内 mp3（`local`）/ 任意直链（`url`）/ 平台外链播放器（`embed`）。
- **自定义播放器**：大播放按钮 + 可拖动进度条 + 时间显示（`local`/`url` 模式）。
- **零依赖、模块化**：原生 ES Modules + 按职责拆分的 CSS，无框架、无打包工具。
- 移动端优先、毛玻璃卡片、自动暗色模式。

## 目录结构

```
daily-song/
├── index.html              # 入口（GitHub Pages 要求在根目录）
├── assets/
│   ├── css/                # 样式（按职责拆分）
│   │   ├── base.css        #   reset + 主题变量 + 背景
│   │   ├── card.css        #   卡片 / 封面 / 信息 / 寄语
│   │   ├── player.css      #   自定义播放器 / 进度条 / embed
│   │   └── theme.css       #   暗色模式
│   └── js/                 # 脚本（原生 ES 模块）
│       ├── main.js         #   入口，编排各模块
│       ├── config.js       #   常量
│       ├── utils.js        #   formatDate / formatTime / $
│       ├── dataLoader.js   #   加载 songs.json
│       ├── songSelector.js #   按日期选歌
│       ├── activeSongLoader.js # 加载 schedule.json（日期匹配，优先）
│       ├── render.js       #   封面 / 信息 / 寄语 / 错误
│       ├── audioPlayer.js  #   自定义播放器（local/url）
│       └── embedPlayer.js  #   iframe（embed）
├── data/
│   ├── schedule.json       # 【核心】按日期编排歌曲（可提前规划多天）
│   └── songs.json          # 歌曲仓库（按日期轮播，作为无 schedule 时的回退）
├── media/
│   ├── audio/              # 自托管 mp3
│   └── covers/             # 封面图（可选）
├── README.md
├── LICENSE
└── .gitignore
```

> 关注点分离：**表现**(css) / **行为**(js) / **数据**(data) / **媒体**(media) 各归各位，根目录只留 `index.html` 这一个入口。

## 本地预览

本项目用了原生 ES 模块 + `fetch`，**双击 `index.html`（`file://` 协议）会被浏览器拦截**。请起一个本地静态服务器：

```bash
# 任选其一
python -m http.server 8000
npx serve .
```

然后打开 <http://localhost:8000>。

## 如何编排歌曲（日常操作）

**只需改一个文件：`data/schedule.json`**。按日期为键，值为当天要播放的歌曲。系统根据当天日期自动匹配。

```jsonc
{
  "_comment": "日期格式 YYYY-MM-DD，系统按当天日期精确匹配",
  "2026-06-13": {
    "title": "空白",
    "artist": "佚名",
    "source": "local",
    "src": "media/audio/空白.mp3",
    "cover": "",
    "note": ""
  },
  "2026-06-14": {
    "title": "明天的歌",
    "artist": "某歌手",
    "source": "url",
    "src": "https://cdn.example.com/song.mp3",
    "cover": "",
    "note": "明天寄语"
  }
}
```

三种 source 的 `src` 填写规则：
| source | src 示例 | 说明 |
|---|---|---|
| `local` | `media/audio/xxx.mp3` | 仓库内 mp3，最稳 |
| `url` | `https://cdn.example.com/song.mp3` | 远程直链，需服务器允许跨域 |
| `embed` | `https://music.163.com/outchain/player?type=2&id=XXXX` | 平台外链播放器 |

**加载优先级**：`schedule.json`（按当天日期匹配）→ `songs.json`（按日期轮播回退）。`schedule.json` 不存在时页面照样能用。

**未来管理页面**：读写 `schedule.json` 这一个文件即可——选日期、选歌曲、保存。系统层只读，操作层只写。

## 如何加歌（扩充歌曲仓库）

编辑 `data/songs.json` 的 `songs` 数组，按需追加一条：

| source | 怎么填 | 前提 |
|---|---|---|
| `local` | mp3 放 `media/audio/`、封面放 `media/covers/`，`src` 填 `media/audio/xxx.mp3` | 总能播 |
| `url` | `src` 填**音频文件直链**（.mp3/.m4a/.ogg） | 服务器允许跨站热链（不防盗链/不验 Referer/CORS 放行/链接不过期） |
| `embed` | `src` 填平台**外链播放器**地址 | 平台提供 iframe；UI 由平台决定，自定义控件不可用 |

```jsonc
{
  "title": "歌名",
  "artist": "歌手",
  "source": "local",            // local | url | embed
  "src": "media/audio/001.mp3",
  "cover": "media/covers/001.jpg", // 可空，空则用渐变兜底
  "note": "今日寄语"               // 可空，空则隐藏
}
```

`anchorDate` 是轮播起算日，一般不用改。提交推送即生效。

### ⚠️ 常见坑

- 网易云 / QQ 音乐 / YouTube **"复制"出来的是网页链接且 CDN 防盗链** → 用不了 `url`，只能 `embed`。
- `url` 真正能用的场景：你自己服务器的 mp3、允许热链的 CDN、archive.org 等。
- **自托管音频 = 公开可下载**，静态托管无法"只听不下"。
- **删 mp3 不会让仓库变小**：文件仍在 git 历史里，`.git` 会持续膨胀。能用外链就别全塞进仓库；真要瘦身需重写历史（git filter-repo / BFG）。
- 单文件硬限制 100MB，仓库建议 < 1GB。

## 部署到 GitHub Pages

1. 新建仓库 `daily-song`，推送代码到 `main`。
2. Settings → Pages → Source 选 `main` 分支、根目录 `/`。
3. 等待发布，访问 `https://<用户名>.github.io/daily-song/`。

## License

[MIT](./LICENSE)
