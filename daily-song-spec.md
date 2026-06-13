# 每日一歌 — 项目技术方案（种子文档）

> 这是新项目的种子规格文档。把本文件复制到新建的项目目录后，AI 可直接据此实现代码。
> 本文档写于 sci-plot 仓库根目录，仅供复制，**不属于 sci-plot 项目**，复制后可从 sci-plot 删除。

---

## 1. 项目名称

| 项 | 值 |
|---|---|
| **推荐仓库名** | `daily-song` |
| 中文显示名 | 每日一歌 |
| 备选名 | `song-of-the-day` / `daily-tune` / `one-song-daily` / `today-song` |
| GitHub Pages 地址（示例） | `https://<你的用户名>.github.io/daily-song/` |

---

## 2. 一句话目标

极简的「每日一歌」**单曲**网页，发布到 GitHub Pages。别人点开链接，看到一张漂亮卡片（封面 + 歌名 + 歌手 + 大播放按钮 + 今日日期/寄语），点一下即听。每天按日期自动切换为不同的一首。

---

## 3. 平台本质（务必理解，已与作者确认）

- **GitHub Pages 只能托管静态文件**：HTML/CSS/JS/图片/音频原样发给浏览器，**不跑任何后端代码**（无服务器进程、无数据库、无"上传接口"）。
- 因此**做不了前后端分离**（"后端上传、前端实时响应"是云服务器的能力，与 GitHub Pages 互斥）。
- "上传新歌"的真实流程 = **本地放文件 → git commit → git push → Pages 自动重新发布 → 访客刷新即更新**。git 充当上传通道，仓库充当资源服务器。
- 访客看到的本质就是一个网页，它只是去公开仓库**抓取资源**（songs.json / mp3 / 封面）。
- **自托管音频 = 公开可下载**：能播放就意味着有公开 URL，访客可下载，静态托管无法"只听不下"。

---

## 4. 核心需求与约束（已确认）

| 维度 | 决策 |
|---|---|
| 页面形态 | **只显示今日单曲**（不做歌单列表/日历） |
| 换歌机制 | 按日期自动轮播（同一天所有人同一首，每天换，播完循环） |
| 音源 | 多类型混合：`local` 仓库 mp3 / `url` 任意直链 / `embed` 平台 iframe |
| 技术栈 | 纯静态前端（HTML + CSS + 原生 JS），无框架、无构建、无后端 |
| 部署 | GitHub Pages |
| 歌词 | 暂不做（以后再议） |

### 自动播放限制
浏览器禁止页面加载即自动出声，**必须用户先交互一次**。故设计**大而醒目的播放按钮**，点开即听（点一下）。

### 仓库大小坑 ⚠️
- GitHub 单文件硬限制 100MB，仓库建议 < 1GB。
- **从工作区删 mp3 并 push，仓库体积不会变小**——文件仍在 git 历史里，`.git` 会持续膨胀。
- 长期加删会让仓库越来越大。真要瘦身需重写历史（git filter-repo / BFG）或定期重建仓库。
- **缓解办法**：能用 `url` / `embed` 外链的就别全塞进仓库，自托管只留原创/已授权/必须本地化的。

---

## 5. 音源三种类型（关键设计）

| type | 含义 | src 示例 | 能否播放的前提 |
|---|---|---|---|
| `local` | 仓库内 mp3 | `audio/001.mp3` | 总能播 |
| `url` | 任意**直链音频文件** | `https://cdn.x.com/a.mp3` | ① 必须是音频文件本身(.mp3/.m4a/.ogg)，不是网页；② 该服务器允许跨站(不防盗链/不验Referer/链接不过期/CORS放行) |
| `embed` | 平台 iframe 播放器 | `https://music.163.com/outchain/player?type=2&id=XXXX&auto=0` | 平台提供外链播放器即可；UI 是平台的，无法自定义控件 |

**重要提醒（写进 README，避免踩坑）**：
- 网易云/QQ/YouTube **"复制"出来的链接是网页，且 CDN 防盗链** → `url` 方式放不了，只能用 `embed` iframe。
- `url` 真正能用的场景：你自己服务器的 mp3、允许热链的 CDN、archive.org 等。

---

## 6. 数据模型：songs.json

```json
{
  "anchorDate": "2026-01-01",
  "songs": [
    {
      "title": "歌名",
      "artist": "歌手",
      "source": "local",
      "src": "audio/001.mp3",
      "cover": "covers/001.jpg",
      "note": "今日寄语（可选）"
    },
    {
      "title": "某首歌",
      "artist": "某歌手",
      "source": "url",
      "src": "https://example.com/song.mp3",
      "cover": "",
      "note": ""
    },
    {
      "title": "网易云的歌",
      "artist": "某歌手",
      "source": "embed",
      "src": "https://music.163.com/outchain/player?type=2&id=XXXX&auto=0",
      "cover": "",
      "note": ""
    }
  ]
}
```

- `anchorDate`：轮播起算日。
- `songs`：有序数组，按日期轮播，播完循环。
- `source` ∈ `local|url|embed`，决定前端怎么渲染播放器。
- `cover`/`note` 可空，前端兜底（无封面用渐变色块，无寄语隐藏该行）。

---

## 7. 按日期选歌算法

```js
function pickTodaySong(data) {
  const songs = data.songs;
  const anchor = new Date(data.anchorDate + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const MS_PER_DAY = 86400000;
  const dayIndex = Math.floor((today - anchor) / MS_PER_DAY);
  const i = ((dayIndex % songs.length) + songs.length) % songs.length;
  return songs[i];
}
```

---

## 8. 页面设计（极简单曲页）

```
┌─────────────────────────────┐
│       每日一歌  ·  6月13日     │
│                             │
│        ┌───────────┐        │
│        │   封面     │        │   ← 无封面则渐变色块
│        └───────────┘        │
│                             │
│           歌  名             │
│           歌  手             │
│                             │
│           ▶  播放            │   ← 核心交互：大播放按钮
│        ──────●────────       │   ← 进度条 + 时间（local/url 时）
│                             │
│   "今日寄语……"（可选）        │
└─────────────────────────────┘
```

渲染分支：
- `source = local | url` → 隐藏原生 `<audio>`，用**自定义控件**（大播放/暂停按钮、可拖动进度条、时间显示）。音频 404 / 跨域失败时提示"今日歌曲加载失败"。
- `source = embed` → 直接渲染平台 iframe（自定义控件不可用，按钮区让位给 iframe）。

风格：移动端优先，居中卡片（桌面约 360–420px），柔和渐变背景 + 毛玻璃卡片 + 一种主题色，精致克制。

---

## 9. 目录结构

```
daily-song/
├── index.html
├── style.css
├── app.js
├── songs.json
├── audio/            # 自托管 mp3
├── covers/           # 封面图（可选）
├── README.md
├── LICENSE
└── .gitignore
```

---

## 10. 部署到 GitHub Pages

1. 新建仓库 `daily-song`，推送代码到 `main`。
2. Settings → Pages → Source 选 `main` / 根目录 `/`。
3. 访问 `https://<用户名>.github.io/daily-song/`，把链接发给别人。
4. 可选：加 SEO/OG meta，分享到微信/社交有卡片预览。

---

## 11. 如何加歌（写进 README）

- **本地歌**：mp3 放 `audio/`、封面放 `covers/` → songs.json 加一条 `source:"local"`。
- **直链歌**：songs.json 加一条 `source:"url"`，`src` 填音频文件直链（注意第 5 节前提）。
- **平台歌**：songs.json 加一条 `source:"embed"`，`src` 填外链播放器地址。
- 提交推送即生效。

---

## 12. 实现路线图（AI 按序写代码）

1. [ ] 初始化结构 + `.gitignore` + `README.md` + `LICENSE`
2. [ ] `songs.json` 示例（含 local/url/embed 各一条占位）
3. [ ] `index.html` 骨架 + OG meta
4. [ ] `style.css`：居中卡片、响应式、毛玻璃/渐变、自定义播放器样式
5. [ ] `app.js`：fetch songs.json → 按日期选歌 → 按 source 分支渲染 → 自定义播放器(播放/暂停/进度/seek/时间) → iframe 分支 → 错误兜底
6. [ ] 放测试音频（自己的/无版权）+ 本地静态服务器验证三种 source
7. [ ] 推送 + 开启 Pages + 线上验证
8. [ ] （可选）favicon、loading 动画、暗色模式

---

## 13. 验收标准

- [ ] 打开看到当天卡片（封面/歌名/歌手/日期）
- [ ] local 与 url 歌曲：点播放出声、可暂停、可拖进度
- [ ] embed 歌曲：iframe 正常加载播放
- [ ] 改系统日期到明天，刷新后变成歌单下一首
- [ ] 手机端布局正常、按钮好点
- [ ] Pages 链接发给别人能正常听
