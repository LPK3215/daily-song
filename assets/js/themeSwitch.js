/* themeSwitch.js - 双重主题切换器 */

// 强调色主题
const accentThemes = ['blue', 'pink', 'cyan', 'green', 'orange', 'violet', 'rose'];
let accentIndex = 0;

// 背景主题
const bgThemes = ['dark', 'light', 'warm', 'purple'];
let bgIndex = 0;

export function initThemeSwitcher() {
  console.log('initThemeSwitcher called');

  // 从 localStorage 读取保存的主题
  const savedAccent = localStorage.getItem('accent-theme');
  const savedBg = localStorage.getItem('bg-theme');

  if (savedAccent && accentThemes.includes(savedAccent)) {
    document.body.setAttribute('data-accent', savedAccent);
    accentIndex = accentThemes.indexOf(savedAccent);
  }

  if (savedBg && bgThemes.includes(savedBg)) {
    document.body.setAttribute('data-bg', savedBg);
    bgIndex = bgThemes.indexOf(savedBg);
  }

  // 强调色切换
  function switchAccent() {
    console.log('switchAccent called');
    accentIndex = (accentIndex + 1) % accentThemes.length;
    const newTheme = accentThemes[accentIndex];
    document.body.setAttribute('data-accent', newTheme);
    localStorage.setItem('accent-theme', newTheme);
    showThemeToast('accent', newTheme);
  }

  // 背景主题切换
  function switchBg() {
    console.log('switchBg called');
    bgIndex = (bgIndex + 1) % bgThemes.length;
    const newTheme = bgThemes[bgIndex];
    document.body.setAttribute('data-bg', newTheme);
    localStorage.setItem('bg-theme', newTheme);
    showThemeToast('bg', newTheme);
  }

  // 按钮点击切换
  const accentBtn = document.getElementById('themeBtn');
  const bgBtn = document.getElementById('bgBtn');

  console.log('accentBtn:', accentBtn);
  console.log('bgBtn:', bgBtn);

  if (accentBtn) {
    accentBtn.addEventListener('click', switchAccent);
    console.log('Accent button listener added');
  } else {
    console.error('themeBtn not found!');
  }

  if (bgBtn) {
    bgBtn.addEventListener('click', switchBg);
    console.log('Background button listener added');
  } else {
    console.error('bgBtn not found!');
  }

  // 监听键盘
  document.addEventListener('keydown', (e) => {
    // 检查是否在输入框中
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // T 键：切换强调色
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      switchAccent();
    }

    // B 键：切换背景色
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      switchBg();
    }
  });

  // 首次加载显示快捷键提示
  setTimeout(() => {
    showKeyboardHint();
  }, 2000);
}

function showThemeToast(type, theme) {
  const accentNames = {
    blue: 'Neon Blue',
    pink: 'Cyber Pink',
    cyan: 'Neon Cyan',
    green: 'Electric Green',
    orange: 'Sunset Orange',
    violet: 'Violet',
    rose: 'Rose Red'
  };

  const bgNames = {
    dark: 'Dark',
    light: 'Light',
    warm: 'Warm',
    purple: 'Purple Night'
  };

  // 移除旧提示
  const old = document.querySelector('.theme-toast');
  if (old) old.remove();

  // 创建新提示
  const toast = document.createElement('div');
  toast.className = 'theme-toast';

  if (type === 'accent') {
    toast.textContent = `Accent: ${accentNames[theme]}`;
  } else {
    toast.textContent = `Background: ${bgNames[theme]}`;
  }

  toast.style.cssText = `
    position: fixed;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: toastIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  // 2秒后移除
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function showKeyboardHint() {
  // 检查是否已经显示过
  if (localStorage.getItem('keyboard-hint-shown')) {
    return;
  }

  const hint = document.createElement('div');
  hint.className = 'keyboard-hint';
  hint.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">💡 Keyboard Shortcuts</div>
    <div style="opacity: 0.8; font-size: 13px;">
      Press <kbd>T</kbd> to switch accent color<br>
      Press <kbd>B</kbd> to switch background<br>
      Press <kbd>Space</kbd> to play/pause
    </div>
  `;
  hint.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 40px;
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 9999;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: toastIn 0.5s ease;
    cursor: pointer;
  `;

  hint.addEventListener('click', () => {
    hint.style.animation = 'toastOut 0.3s ease';
    setTimeout(() => hint.remove(), 300);
    localStorage.setItem('keyboard-hint-shown', 'true');
  });

  document.body.appendChild(hint);

  // 8秒后自动移除
  setTimeout(() => {
    if (hint.parentNode) {
      hint.style.animation = 'toastOut 0.3s ease';
      setTimeout(() => hint.remove(), 300);
      localStorage.setItem('keyboard-hint-shown', 'true');
    }
  }, 8000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes toastOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
  kbd {
    display: inline-block;
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    font-weight: 600;
    margin: 0 2px;
  }
`;
document.head.appendChild(style);
