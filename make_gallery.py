import re
import os

files = ['index.html', 'the-story-of-pancreacare.html', 'understanding-the-normal-pancreas.html', 'advitya_team.html']

with open('understanding-the-normal-pancreas.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Update title
template = re.sub(r'<title>.*?</title>', '<title>Gallery | Advitya Healthcares</title>', template)

# Replace Inner Hero
inner_hero_pattern = r'(<!-- Inner Hero Section -->.*?)(?=<!-- Content Section -->)'
new_hero = '''<!-- Inner Hero Section -->
    <section class="inner-hero">
        <div class="container">
            <h1 data-aos="fade-up">Our Gallery</h1>
            <p data-aos="fade-up" data-aos-delay="200">Take a look inside our state-of-the-art facilities</p>
            <div style="margin-top: 30px; font-size: 1.2rem; opacity: 0.85; font-weight: 500;" data-aos="fade-up" data-aos-delay="400">
                Home / Gallery
            </div>
        </div>
    </section>

    '''
template = re.sub(inner_hero_pattern, new_hero, template, flags=re.DOTALL)

# Find the images grid from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Extract the grid itself
grid_inner_match = re.search(r'(<div style="display: grid; grid-template-columns: repeat\(auto-fill, minmax\(280px, 1fr\)\); gap: 20px;">.*?</div>)', index_html, re.DOTALL)
grid_inner_html = grid_inner_match.group(1) if grid_inner_match else ''

new_content_section = f'''<!-- Content Section -->
    <section class="gallery-section" style="padding: 60px 0;">
        <div class="container">
            {grid_inner_html}
        </div>
    </section>

    '''
content_pattern = r'(<!-- Content Section -->.*?)(?=<!-- Call to Action Section -->)'
template = re.sub(content_pattern, new_content_section, template, flags=re.DOTALL)

with open('gallery.html', 'w', encoding='utf-8') as f:
    f.write(template)

# Now update navigation in all files
nav_pattern = r'<a href="(?:index\.html)?#"\s*onclick="document\.getElementById\(\'galleryModal\'\)\.style\.display=\'block\'; return false;">Gallery</a>'
new_nav = '<a href="gallery.html">Gallery</a>'

for file in files + ['gallery.html']:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(nav_pattern, new_nav, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Done")
