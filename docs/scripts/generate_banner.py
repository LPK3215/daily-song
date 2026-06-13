"""
SVG Banner Generator for Daily Song Project
============================================

Purpose: Generate project banner with gradient background and feature tags
Dependencies: None (pure SVG text generation)
Output: docs/images/banner.svg

Usage:
    python docs/scripts/generate_banner.py

Customization:
- Modify TITLE/SUBTITLE for project name changes
- Adjust FEATURES list to add/remove feature tags
- Change GRADIENT colors for different themes
"""

TITLE = "Daily Song"
SUBTITLE = "One song a day, immersive music experience"
FEATURES = [
    "🎵 Pure Static",
    "🎨 PWA Ready",
    "⚡ Zero Build"
]

GRADIENT = {
    "start": "#667eea",
    "end": "#764ba2"
}

def generate_banner():
    """Generate banner SVG with current project info"""

    svg_template = f'''<svg width="1200" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{GRADIENT['start']};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{GRADIENT['end']};stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1200" height="300" fill="url(#bg)"/>

  <text x="50" y="80" font-size="60" fill="rgba(255,255,255,0.15)" font-family="Arial">♪</text>
  <text x="1100" y="220" font-size="60" fill="rgba(255,255,255,0.15)" font-family="Arial">♫</text>
  <text x="950" y="100" font-size="40" fill="rgba(255,255,255,0.1)" font-family="Arial">♬</text>

  <text x="600" y="120" font-family="'Arial Black', sans-serif" font-size="72" font-weight="bold" fill="#ffffff" text-anchor="middle" filter="url(#glow)">
    {TITLE}
  </text>

  <text x="600" y="170" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    {SUBTITLE}
  </text>
'''

    # Add feature tags
    tag_x = 300
    for feature in FEATURES:
        width = len(feature) * 10 + 40
        svg_template += f'''
  <g transform="translate({tag_x}, 220)">
    <rect x="0" y="0" width="{width}" height="40" rx="20" fill="rgba(255,255,255,0.2)"/>
    <text x="{width//2}" y="26" font-family="Arial" font-size="16" fill="#ffffff" text-anchor="middle">{feature}</text>
  </g>
'''
        tag_x += width + 20

    svg_template += '\n</svg>'

    with open('docs/images/banner.svg', 'w', encoding='utf-8') as f:
        f.write(svg_template)

    print("✅ Banner generated: docs/images/banner.svg")

if __name__ == '__main__':
    generate_banner()
