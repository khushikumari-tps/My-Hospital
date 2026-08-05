import re
import os

files = ['index.html', 'the-story-of-pancreacare.html', 'understanding-the-normal-pancreas.html', 'advitya_team.html', 'gallery.html']

with open('understanding-the-normal-pancreas.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Update title
template = re.sub(r'<title>.*?</title>', '<title>About Us | Advitya Healthcares</title>', template)

# Replace Inner Hero
inner_hero_pattern = r'(<!-- Inner Hero Section -->.*?)(?=<!-- Content Section -->)'
new_hero = '''<!-- Inner Hero Section -->
    <section class="inner-hero">
        <div class="container">
            <h1 data-aos="fade-up">Our Journey</h1>
            <p data-aos="fade-up" data-aos-delay="200">Bringing Expert Surgery to Tier 2 Cities</p>
            <div style="margin-top: 30px; font-size: 1.2rem; opacity: 0.85; font-weight: 500;" data-aos="fade-up" data-aos-delay="400">
                Home / About Us
            </div>
        </div>
    </section>

    '''
template = re.sub(inner_hero_pattern, new_hero, template, flags=re.DOTALL)

new_content_section = '''<!-- Content Section -->
    <section class="about-section" style="padding: 60px 0; background: #fbfbfb;">
        <div class="container" style="max-width: 1000px;">
            <h2 style="font-size: 2.8rem; color: #000; font-weight: 700; margin-bottom: 30px; text-align: center;" data-aos="fade-up">The Journey of Advitya</h2>
            <p style="font-size: 1.25rem; line-height: 1.8; color: #444; margin-bottom: 50px; text-align: center; font-weight: 500;" data-aos="fade-up" data-aos-delay="100">We were not born in a boardroom or conceived in an investor's plan. We were moulded in hospital corridors, in the waiting rooms of overcrowded clinics, amidst the anxious whispers of families who had travelled miles, desperate for care.</p>
            
            <div class="timeline" style="margin-top: 40px;">
                <!-- 2003-2008 -->
                <div style="margin-bottom: 40px; background: #fff; border: 1px solid #eaeaea; border-left: 5px solid var(--primary); border-radius: 8px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h3 style="color: var(--primary); font-size: 1.8rem; margin-bottom: 15px;">2003-2008: The First Glimpse into Healthcare</h3>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">We witnessed their silent prayers and unspoken fears. We saw the exhaustion in their eyes, not just from long journeys, but from the despair of realising that the care they needed was missing in their homes.</p>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555;">Big cities boasted world-class hospitals, yet outside them, access to specialised healthcare was severely limited. We witnessed families leaving their homes, their livelihoods, everything they cherished, just to grasp a few more moments with their loved ones. It was during those times that we realised something profound—treatment and healing are not the same. Medicine should not be restricted by geography. Healthcare should not be a privilege.</p>
                </div>

                <!-- 2009-2015 -->
                <div style="margin-bottom: 40px; background: #fff; border: 1px solid #eaeaea; border-left: 5px solid var(--primary); border-radius: 8px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h3 style="color: var(--primary); font-size: 1.8rem; margin-bottom: 15px;">2009-2015: Learning the Language of Surgery and Cancer Care</h3>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555;">As we grew, we found ourselves in the realm of surgery and oncology. Surgery was not merely about technical skill; it was about responsibility, about standing at the threshold between despair and hope. It is a place where a few minutes and a single decision can alter the course of a life. We learned from mentors who showed us that surgery is not merely an act, but a commitment—to ethics, to morality, and to the individuals who place their trust in our hands. We witnessed how cancer patients suffered and how their loved ones did everything possible to spend another day with them. With every lesson, we understood our purpose more clearly: expertise should not be confined to a few institutions, it should be accessible where people need it most.</p>
                </div>

                <!-- 2015-2023 -->
                <div style="margin-bottom: 40px; background: #fff; border: 1px solid #eaeaea; border-left: 5px solid var(--primary); border-radius: 8px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h3 style="color: var(--primary); font-size: 1.8rem; margin-bottom: 15px;">2015-2023: Recognizing the Gaps, Preparing for Change</h3>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">As we delved deeper, our understanding of healthcare inequities became more acute. We observed that the highest level of surgical and cancer expertise was concentrated in only a handful of institutions, while extensive areas continued to be underserved. Patients from smaller towns faced an impossible dilemma: travel to a distant city for specialised care, often too late, or settle for what was available, even if it wasn't sufficient.</p>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">We met families who delayed life-saving surgeries and cancer care, not because they didn't desire treatment but because they couldn't afford the weeks of travel, accommodation, and lost wages. We witnessed people making devastating sacrifices—selling land, exhausting their savings—to reach hospitals with the needed expertise, and sometimes, even when they arrived, it was too late.</p>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555;">We realised then that this wasn't merely a logistical challenge but a fundamental flaw in healthcare delivery. Why should world-class treatment be limited to a select few hospitals? Why should a person's survival depend on their ability to travel? We were no longer merely observing a problem but getting ready to be the solution.</p>
                </div>

                <!-- 2023-2025 -->
                <div style="margin-bottom: 40px; background: #fff; border: 1px solid #eaeaea; border-left: 5px solid var(--primary); border-radius: 8px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h3 style="color: var(--primary); font-size: 1.8rem; margin-bottom: 15px;">2023-2025: The Birth of Advitya</h3>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">By 2023, we were no longer merely a thought. We had become a mission, a movement, a force taking shape.</p>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">We were named Advitya (meaning unique) to reflect our character and purpose. To ensure our perpetual existence, we were formally incorporated on February 21, 2025. However, you will realise that we have been around for a long time, and when you meet us, you will feel that you have missed us all along. We were born from a simple yet powerful belief: If patients cannot access the finest surgical and cancer care, the finest care should be brought to them.</p>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">We have re-imagined our approach. Instead of merely being just another large hospital in a metropolitan area, we chose a different route: collaborating with hospitals in second- and third-tier cities, equipping them with expertise, technology, and training to provide world-class gastrointestinal, hepatopancreatobiliary surgical care, and cancer care.</p>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">This Alliance Model goes beyond merely expanding services. It focuses on keeping families together when they need one another the most. It aims at strengthening hospitals, empowering local doctors, and ensuring that people don't just receive treatment but genuinely heal—physically, emotionally, and financially.</p>
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #555; margin-bottom: 15px;">We are evolving. With each partnership, every successful surgery, and every patient who no longer has to leave their home for the best care, our purpose becomes ever stronger.</p>
                    <p style="font-size: 1.2rem; line-height: 1.7; color: #000; font-weight: 700;">We were born from a problem, yet we exist to provide a solution.</p>
                </div>
            </div>
        </div>
    </section>

    '''
content_pattern = r'(<!-- Content Section -->.*?)(?=<!-- Call to Action Section -->)'
template = re.sub(content_pattern, new_content_section, template, flags=re.DOTALL)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(template)

# Update navigation links from "index.html#about" or "#about" to "about.html"
for file in files + ['about.html']:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace <a href="index.html#about"...>About Us</a> 
    # But wait, index.html itself might have #about links. We should probably only replace it in the navbar.
    # The navbar link looks like this: <a href="index.html#about" class="active">About Us</a> or <a href="index.html#about">About Us</a>
    content = re.sub(r'<a\s+href="index\.html#about"(.*?)>About Us</a>', r'<a href="about.html"\1>About Us</a>', content)
    content = re.sub(r'<a\s+href="#about"(.*?)>About Us</a>', r'<a href="about.html"\1>About Us</a>', content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("About Us page created and linked")
