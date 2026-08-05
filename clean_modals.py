import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The first modal
content = re.sub(r'<!-- Gallery Modal -->.*?<div id="galleryModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba\(0,0,0,0\.95\);.*?</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)

# The second modal (Swiper)
content = re.sub(r'<!-- Gallery Modal -->.*?<div id="galleryModal" class="modal" style="display: none; align-items: center; justify-content: center; position: fixed; top:0; left:0; width: 100%; height: 100%; z-index: 2000; background: rgba\(0,0,0,0\.95\);">.*?</div>\s*</div>', '', content, flags=re.DOTALL)

# Also remove the gallery swiper init script
content = re.sub(r'// 2\. Initialize Swiper for Gallery.*?const gallerySwiper = new Swiper\(\'\.gallery-swiper\', \{.*?\n        \}\);', '', content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned up modals")
