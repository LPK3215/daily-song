/* themeSwitch.js - Dual theme switcher */

// Accent color themes
const accentThemes = ['blue', 'pink', 'cyan', 'green', 'orange', 'violet', 'rose'];
let accentIndex = 0;

// Background themes
const bgThemes = ['dark', 'light', 'warm', 'purple'];
let bgIndex = 0;

export function initThemeSwitcher() {
  // Restore saved themes from localStorage
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

  // Accent color switch
  function switchAccent() {
    accentIndex = (accentIndex + 1) % accentThemes.length;
    const newTheme = accentThemes[accentIndex];
    document.body.setAttribute('data-accent', newTheme);
    localStorage.setItem('accent-theme', newTheme);
  }

  // Background theme switch
  function switchBg() {
    bgIndex = (bgIndex + 1) % bgThemes.length;
    const newTheme = bgThemes[bgIndex];
    document.body.setAttribute('data-bg', newTheme);
    localStorage.setItem('bg-theme', newTheme);
  }

  // Button click handlers
  const accentBtn = document.getElementById('themeBtn');
  const bgBtn = document.getElementById('bgBtn');

  if (accentBtn) {
    accentBtn.addEventListener('click', switchAccent);
  }

  if (bgBtn) {
    bgBtn.addEventListener('click', switchBg);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // T key: switch accent color
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      switchAccent();
    }

    // B key: switch background
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      switchBg();
    }
  });

  // Show keyboard shortcuts hint on first visit
  setTimeout(() => {
    showKeyboardHint();
  }, 2000);
}

function showKeyboardHint() {
  if (localStorage.getItem('keyboard-hint-shown')) return;
  injectHintStyles();

  const hint = document.createElement('div');
  hint.className = 'keyboard-hint';
  hint.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">Keyboard Shortcuts</div>
    <div style="opacity: 0.8; font-size: 13px;">
      Press <kbd>T</kbd> to switch accent color<br>
      Press <kbd>B</kbd> to switch background<br>
      Press <kbd>Space</kbd> to play/pause<br>
      Press <kbd>&larr;</kbd>/<kbd>&rarr;</kbd> to seek &plusmn;5s
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

  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (hint.parentNode) {
      hint.style.animation = 'toastOut 0.3s ease';
      setTimeout(() => hint.remove(), 300);
      localStorage.setItem('keyboard-hint-shown', 'true');
    }
  }, 8000);
}

// Add animation styles for keyboard hint (injected on demand)
let styleInjected = false;
function injectHintStyles() {
  if (styleInjected) return;
  styleInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
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
}
