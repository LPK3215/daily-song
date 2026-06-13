import re
import os

translations = {
    # activeSongLoader.js
    "加载当前应播放的歌曲": "Load currently playing song",
    "查询链路：schedule.json（日期精确匹配） → songs.json（按日期轮播回退）": "Query chain: date-songs.json (exact date match) → default-songs.json (date-based rotation fallback)",
    "设计意图：": "Design intent:",
    "是规划层：": "is planning layer:",
    "管理页面可读写 schedule.json 编排未来日期": "Admin page can read/write schedule.json to plan future dates",
    "系统层只读：按当天日期查 schedule，没有则回退轮播": "System layer read-only: query schedule by current date, fallback to rotation if not found",
    "从 URL 参数读取预览日期，返回格式化的日期键；无参数则返回当天": "Read preview date from URL params, return formatted date key; return today if no params",
    "校验歌曲条目合法性（支持新旧两种格式）": "Validate song entry (support both new and old formats)",
    "新格式：数组": "New format: array",
    "旧格式：对象": "Old format: object",
    "将数组格式转换为标准对象格式": "Convert array format to standard object format",
    "自动判断 source 类型": "Auto-detect source type",
    "补全路径": "Complete path",
    "补全可选字段默认值（旧格式）": "Fill optional fields with defaults (old format)",
    "统一入口：支持新旧两种格式": "Unified entry: support both new and old formats",
    "加载当前应播放的歌曲对象": "Load currently playing song object",
    "支持 ?date=YYYY-MM-DD 预览指定日期歌曲": "Support ?date=YYYY-MM-DD to preview songs for specific dates",
    "读取 schedule.json，按目标日期精确匹配": "Read schedule.json, match by target date",
    "不存在或格式错误，走回退": "doesn't exist or format error, fallback",
    "回退：按日期从 songs.json 轮播": "Fallback: rotation from songs.json by date",
    "歌单加载失败": "Song list loading failed",
    "歌单为空，请在 data/songs.json 中添加歌曲。": "Song list is empty, please add songs to data/default-songs.json.",
    
    # audioPlayer.js
    "核心播放器": "Core player",
    "精简版: 仅保留核心播放功能": "Simplified version: core playback only",
    "播放/暂停 按钮状态同步": "Play/pause button state sync",
    "封面旋转": "Cover rotation",
    "播放/暂停": "Play/pause",
    "重听: 回到 0:00 并播放": "Restart: back to 0:00 and play",
    "音频错误": "Audio error",
    "时长显示": "Duration display",
    "进度更新": "Progress update",
    "进度条拖动 seek": "Progress bar dragging seek",
    "键盘: 方向键 +-5s": "Keyboard: arrow keys +-5s",
    "系统媒体控件": "System media controls",
    
    # main.js
    "应用入口": "Application entry",
    "加载优先级": "Loading priority",
    "按日期匹配": "match by date",
    "按日期轮播": "date-based rotation",
    "支持": "support",
    "预览指定日期歌曲": "preview songs for specific dates",
    "等待 DOM 完全加载后再初始化主题切换器": "Wait for DOM to fully load before initializing theme switcher",
    "初始化主题切换器": "Initialize theme switcher",
    
    # render.js
    "封面 / 歌曲信息 / 寄语 / 错误兜底 / 入场动画": "Cover / song info / note / error fallback / entrance animation",
    "加载失败保留音符兜底": "Keep music note fallback on load failure",
    "卡片内容交错入场": "Card content staggered entrance",
    "驱动": "driven",
    
    # songSelector.js
    "按日期轮播选歌（播完循环）": "Select song by date rotation (loop after completion)",
    "空歌单兜底，避免 % 0 得 NaN": "Empty song list fallback, avoid % 0 getting NaN",
    "计算天数差": "Calculate day difference",
    
    # themeSwitch.js
    "双重主题切换器": "Dual theme switcher",
    "强调色主题": "Accent themes",
    "背景主题": "Background themes",
    "从 localStorage 读取保存的主题": "Read saved themes from localStorage",
    "强调色切换": "Accent switching",
    "背景主题切换": "Background switching",
    "按钮点击切换": "Button click switching",
    "监听键盘": "Listen keyboard",
    "检查是否在输入框中": "Check if in input field",
    "切换强调色": "Switch accent",
    "切换背景色": "Switch background",
    "首次加载显示快捷键提示": "Show keyboard shortcuts hint on first load",
    "移除旧提示": "Remove old toast",
    "创建新提示": "Create new toast",
    "秒后移除": "Remove after N seconds",
    "检查是否已经显示过": "Check if already shown",
    "添加动画样式": "Add animation styles",
    
    # utils.js
    "通用工具": "Utility functions",
    "用于 schedule.json 日期键": "for schedule.json date keys",
    "秒": "seconds",
    
    # config.js
    "全局常量集中管理": "Centralized global constants management",
    
    # dataLoader.js 和其他
    "数据加载": "Data loading",
}

def translate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for cn, en in translations.items():
        content = content.replace(cn, en)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Translated: {filepath}")
        return True
    return False

# Process all JS files
js_files = [
    'assets/js/activeSongLoader.js',
    'assets/js/audioPlayer.js',
    'assets/js/config.js',
    'assets/js/dataLoader.js',
    'assets/js/embedPlayer.js',
    'assets/js/main.js',
    'assets/js/render.js',
    'assets/js/songSelector.js',
    'assets/js/themeSwitch.js',
    'assets/js/utils.js',
]

translated_count = 0
for filepath in js_files:
    if os.path.exists(filepath):
        if translate_file(filepath):
            translated_count += 1

print(f"\n✅ Total files translated: {translated_count}/{len(js_files)}")
