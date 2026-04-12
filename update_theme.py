import re

with open('styles.css', 'r') as f:
    css = f.read()

# 1. Update CSS variables in :root
root_replacements = {
    '--green-darkest: #061a10;': '--bg-main: #FAF7F2;',
    '--green-dark: #0A2E1C;': '--bg-alt: #FFFFFF;',
    '--green-medium: #14532D;': '--bg-card: #F9F6F0;',
    '--green-light: #1B6B3A;': '--border-light: #E5E0D8;',
    '--green-accent: #22c55e;': '--accent-teal: #7A8B83;',

    '--gold: #C8A951;': '--accent-bronze: #92703B;',
    '--gold-light: #E8D48B;': '--accent-bronze-light: #B89762;',
    '--gold-bright: #FFD700;': '--accent-bronze-bright: #C2A06E;',
    '--gold-dark: #8B7332;': '--accent-bronze-dark: #664E29;',

    '--cream: #FDF8F0;': '--text-main: #1C1C1E;',
    '--cream-dark: #F0E6D3;': '--text-main-light: #2D2D30;',
    '--white: #FFFFFF;': '--white: #FFFFFF;',
    '--black: #000000;': '--black: #000000;',
    '--text-light: #d4d4d8;': '--text-secondary: #4A4A4F;',
    '--text-muted: #a1a1aa;': '--text-muted: #71717A;',

    '--gradient-gold: linear-gradient(135deg, #C8A951 0%, #FFD700 50%, #C8A951 100%);': '--gradient-bronze: linear-gradient(135deg, #92703B 0%, #B89762 50%, #92703B 100%);',
    '--gradient-green: linear-gradient(180deg, #0A2E1C 0%, #14532D 50%, #0A2E1C 100%);': '--gradient-bg: linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%);',
    '--gradient-hero: linear-gradient(180deg, rgba(6, 26, 16, 0.85) 0%, rgba(10, 46, 28, 0.7) 40%, rgba(6, 26, 16, 0.9) 100%);': '--gradient-hero: linear-gradient(180deg, rgba(250, 247, 242, 0.8) 0%, rgba(255, 255, 255, 0.7) 40%, rgba(250, 247, 242, 0.9) 100%);',
    '--gradient-card: linear-gradient(145deg, rgba(20, 83, 45, 0.4) 0%, rgba(10, 46, 28, 0.6) 100%);': '--gradient-card: linear-gradient(145deg, rgba(255, 255, 255, 1) 0%, rgba(250, 247, 242, 1) 100%);',

    '--shadow-gold: 0 0 30px rgba(200, 169, 81, 0.15);': '--shadow-bronze: 0 8px 30px rgba(146, 112, 59, 0.1);',
    '--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);': '--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.05);',
    '--shadow-glow: 0 0 20px rgba(200, 169, 81, 0.3);': '--shadow-glow: 0 0 20px rgba(146, 112, 59, 0.15);',
}

for old, new in root_replacements.items():
    css = css.replace(old, new)

# 2. Variable usages mappings
var_mappings = {
    'var(--green-darkest)': 'var(--bg-main)',
    'var(--green-dark)': 'var(--bg-alt)',
    'var(--green-medium)': 'var(--bg-card)',
    'var(--green-light)': 'var(--border-light)',
    'var(--gold)': 'var(--accent-bronze)',
    'var(--gold-light)': 'var(--accent-bronze-light)',
    'var(--cream)': 'var(--text-main)',
    'var(--text-light)': 'var(--text-secondary)',
    'var(--gradient-gold)': 'var(--gradient-bronze)',
    'var(--gradient-card)': 'var(--gradient-card)',
    'var(--shadow-gold)': 'var(--shadow-bronze)',
    'rgba(6, 26, 16,': 'rgba(250, 247, 242,',
    'rgba(10, 46, 28,': 'rgba(255, 255, 255,',
    'rgba(20, 83, 45,': 'rgba(240, 234, 225,',
    'rgba(200, 169, 81,': 'rgba(146, 112, 59,',
}

for old, new in var_mappings.items():
    css = css.replace(old, new)

# specific text tweaks in CSS
# .nav-links a { color: var(--text-main); font-weight: 500; }
css = css.replace('color: var(--cream);', 'color: var(--text-main);')
css = css.replace('color: var(--green-dark);', 'color: var(--bg-alt);')
css = css.replace('border-bottom: 1px solid rgba(146, 112, 59, 0.15);', 'border-bottom: 1px solid rgba(0, 0, 0, 0.05);')
css = css.replace('border: 1px solid rgba(146, 112, 59, 0.15);', 'border: 1px solid rgba(0, 0, 0, 0.05);')
css = css.replace('border: 1px solid rgba(146, 112, 59, 0.1);', 'border: 1px solid rgba(0, 0, 0, 0.05);')

# Fix button colors so text is readable
css = css.replace('color: var(--bg-alt);', 'color: #FFFFFF;')

with open('styles.css', 'w') as f:
    f.write(css)

import os
with open('index.html', 'r') as f:
    html = f.read()

html = html.replace('👑', '✦')
html = html.replace('gold-text', 'bronze-text')

with open('index.html', 'w') as f:
    f.write(html)
