with open('styles.css', 'r') as f:
    css = f.read()

# Fix class name that we changed in HTML
css = css.replace('.gold-text', '.bronze-text')

# Fix shadow issues from search/replace
css = css.replace('var(--shadow-gold)', 'var(--shadow-bronze)')
css = css.replace('rgba(250, 247, 242, 0.95)', 'rgba(255, 255, 255, 0.95)') # Nav background
css = css.replace('var(--text-main); /* Was var(--bg-alt) */', 'var(--bg-alt);')

# Let's ensure text readability on the hero gradient
css = css.replace('text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);', 'text-shadow: 0 4px 30px rgba(255, 255, 255, 0.5);')

# The btn-primary uses var(--gradient-bronze) and color #FFFFFF
css = css.replace('color: #FFFFFF;', 'color: #FFFFFF;')

with open('styles.css', 'w') as f:
    f.write(css)

import os
with open('script.js', 'r') as f:
    js = f.read()

# Update particle color to match bronze
js = js.replace('rgba(232, 212, 139,', 'rgba(146, 112, 59,')

with open('script.js', 'w') as f:
    f.write(js)
