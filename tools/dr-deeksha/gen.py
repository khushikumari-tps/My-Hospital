import json, html
from pathlib import Path

SC = Path(__file__).parent
pubs = json.load(open(SC / "pubs.json"))
chaps = json.load(open(SC / "chapters.json"))
e = html.escape

TEL = "+919211221551"
TEL_H = "+91 92112 21551"
WA = "https://wa.me/919211221551?text=Hello%2C%20I%20would%20like%20to%20consult%20Dr.%20Deeksha%20Kapoor."

# ------------------------------------------------------------------ data
education = [
    # (years, title, institution, second line, tag above title, award below)
    ("2023 - 2024", "Fellowship in HPB Surgical Oncology", "Tata Memorial Hospital, Mumbai", "", "Ethicon Fellow 2023", ""),
    ("August 2023", "Robotic Surgeon", "Console-trained on Da Vinci Xi", "", "", ""),
    ("2016 - 2019", "DNB Surgical Gastroenterology", "Medanta – The Medicity, Gurugram", "", "", ""),
    ("2011 - 2014", "DNB General Surgery", "Bangalore Baptist Hospital, Bangalore", "", "", "“Dr. B. Ramamurthi” Gold Medal (National Level, June 2014)"),
    ("2004 - 2009", "MBBS", "Maulana Azad Medical College (MAMC), New Delhi", "Lok Nayak Hospital", "", ""),
]

globe = [
    # (country code, place, title, when, body, focus)
    ("JP", "Tokyo, Japan", "International Travelling Fellowship (SEF)", "Nov 2022 • 1 Month",
     "Minimal access pancreatic surgery under the mentorship of <strong>Prof. Yuichi Nagakawa</strong>", "Robotic Pancreatic Surgery"),
    ("JP", "Japan", "Visiting Scholar", "2022",
     "Department of Pancreato-Biliary Surgery, Japanese Foundation of Cancer Research under the mentorship of <strong>Prof. Yosuke Inoue</strong>", "Surgery for Locally Advanced Pancreatic Cancer"),
    ("DE", "Heidelberg, Germany", "Visiting Scholar", "Dec 2021 • 3 Weeks",
     "Department of General Visceral &amp; Transplant Surgery, University of Heidelberg under the mentorship(s) of <strong>Prof. Markus Buechler &amp; Prof. Thilo Hackert</strong>", "Vascular Resections in Pancreatic Surgery"),
    ("FR", "Paris, France", "Visiting Scholar", "Nov 2021 • 3 Weeks",
     "Department of HPB &amp; Transplant Surgery, Beaujon Hospital under the mentorship(s) of <strong>Prof. Alain Sauvanet &amp; Prof. Mickael Lesurtel</strong>", "Laparoscopic Pancreatic Surgery &amp; Vascular Resections"),
]

experience = [
    ("Senior Consultant", "April 2024 — May 2025", "BLK Max Super Speciality Hospital, Pusa Road, Rajendra Place, New Delhi – 110005", "GI Surgery and GI Oncology"),
    ("Senior Fellow", "September 2023 — February 2024", "Tata Memorial Hospital, Mumbai, Maharashtra", "Pancreatic and Gastric Surgery, Hepatobiliary and GI Services"),
    ("Consultant", "February 2021 – March 2024", "Medanta – The Medicity, Sector 38, Gurugram, Haryana, India", "Department of GI Surgery, GI Oncology and Minimal Access Surgery"),
    ("Associate Consultant", "February 2019 – February 2021", "Medanta – The Medicity, Sector 38, Gurugram, Haryana, India", "Department of GI Surgery, GI Oncology and Minimal Access Surgery"),
    ("DNB Surgical Gastroenterology", "February 2016 – February 2019", "Medanta – The Medicity", "Department of GI Surgery, GI Oncology and Minimal Access Surgery"),
    ("Senior Resident", "February 2015 – May 2015", "G B Pant Hospital", "Department of Surgical Gastroenterology"),
    ("DNB General Surgery", "August 2011 – October 2014", "Bangalore Baptist Hospital", ""),
    ("Internship", "January 2009 – January 2010", "Lok Nayak Hospital and Maulana Azad Medical College", ""),
]

talk_years = [
    ("2025", [
        ("Total Pancreatectomy – Techniques &amp; Challenges", "Indian Chapter of IHPBA, Mid-term meet, AIIMS, New Delhi (Aug)"),
        ("Medical-legal scenarios in Surgery (Panel)", "Indian Chapter of IHPBA, Annual Conf, Kolkata (Mar)"),
        ("Vascular Resections in Pancreatic Cancer", "Purbanchal Cancer Congress, Nepal (Jan)"),
        ("Landmark Publications in Pancreatic Surgery", "IHPBA Certificate Course, Faridabad (Jan)"),
    ]),
    ("2024", [
        ("Acute Pancreatitis – A Surgeon’s Role", "IHPBA Certificate Course, Mumbai (Dec)"),
        ("Laparoscopic Anatomy of Colon and Rectum", "FALS Online Course (Oct)"),
        ("Research Methodology &amp; Components", "Research Workshop for Surgical Residents, BLK Max Institute (Jul)"),
        ("Trans-anal Total Mesorectal Excision", "Update on Rectal Cancer, Chattogram, Bangladesh (Jun)"),
    ]),
    ("2023", [
        ("When to suspect Gallbladder Cancer", "Jaipur Surgical Festival, Consensus meeting (ISG)"),
        ("Gall Bladder Polyps (Panel)", "IASGCON 2023, Hyderabad"),
        ("Abdominal Wall Closures &amp; Hernia Prevention", "Deep Impact, Delhi (Mar)"),
        ("Nutrition in Acute Pancreatitis", "IHPBA India Midterm CME, Srinagar (Mar)"),
    ]),
]
talks_past = [
    ("Body Composition and impact on Cancer Surgery", "2nd Foundation Day CME, PGI Chandigarh (Aug 2022)"),
    ("Management of Infected Pancreatic Necrosis", "11th TUGS India Academic program (Aug 2022)"),
    ("Trans-anal total mesorectal excision", "Advances in Colorectal Cancer, Delhi (Feb 2020)"),
    ("Pain Mechanisms in Chronic Pancreatitis", "Pancreas India, Delhi (2017)"),
]
n_talks = sum(len(t) for _, t in talk_years) + len(talks_past)
conferences = [
    "Indian Chapter of IHPBA 2025 (AIIMS) - Faculty", "Indian Chapter of IHPBA Kolkata 2025 - Faculty",
    "Purbanchal Cancer Congress Nepal 2025 - Faculty", "IHPBA Certificate Course Faridabad 2025 - Faculty",
    "APA/IAP/CPA/JPS Hawaii 2024", "IHPBA Certificate Course Mumbai 2024 - Faculty", "FALS Colorectal Online Course 2024 - Faculty",
    "Japanese Society of HPB Surgery (Web) 2024 - Discussant", "Cancer Conclave Raipur 2024 - Faculty",
    "Debates in Pancreatology Ganga Ram 2024 - Faculty", "PancreaFest Cincinnati USA 2024", "Pancreas Club Cincinnati USA 2024",
    "HPB Surgery Week Seoul 2024", "Update on Rectal Cancer Bangladesh 2024 - Faculty", "Jaipur Surgical Festival 2023",
    "IASGCON Hyderabad 2023", "AP-HPBA Bangalore 2023", "Deep Impact Hernia Delhi 2023", "IHPBA India Midterm Srinagar 2023",
    "Pancreas India 2023", "PGI Chandigarh Foundation Day 2022", "HBP Surgery Week Korea 2021", "14th World Congress IHPBA (Virtual)",
    "ACS Clinical Congress 2020", "Oncology Summit Delhi 2020", "PancreAsia Bangkok 2018", "IASG Pondicherry 2017", "IASG Coimbatore 2016",
]
presentations = [
    ("Poster Presentation", "Hawaii, December 2024", "Real World Evidence of Portal Vein Resections with Pancreatectomy Multicentre Indian Study (PVR-IM)", "APA/IAP/CPA/JPS, 2024"),
    ("Poster Presentation", "Hawaii, December 2024", "Utility of Mesopancreas Triangle Clearance with Level 2 Mesopancreas Dissection in Pancreaticoduodenectomy for Resectable Periampullary Carcinomas", "Early results of an ongoing prospective study - APA/IAP/CPA/JPS, 2024"),
    ("Poster Presentation", "United States of America, July 2024", "Long-term Survival after Concomitant Portal Vein Resection with Pancreatectomy for Pancreatic Cancer", "Pancreas Club, Cincinnati"),
    ("Poster Presentation", "United States of America, July 2024", "External Validation of the ISGPS Classification of ‘High-Risk’ Pancreas for Predicting Clinically Relevant Pancreatic Fistula. Have we cracked the whip yet?", "Pancreas Club, Cincinnati"),
    ("Poster Presentation", "Seoul, Korea, March 2024", "Factors predicting major complications following portal vein resections with pancreatectomy", "HBP Surgery Week"),
    ("Mini Oral Presentation", "AHPBA 2021", "Hepatectomy as an upfront surgical modality for Strasberg E4 biliary injuries", "AHPBA 2021"),
    ("Mini Oral Presentation", "AHPBA 2021", "Can preoperative liver enzymes predict early mortality after pancreatoduodenectomy?", "AHPBA 2021"),
    ("Oral Paper Presentation", "20th Annual Congress, June 2021 (Virtual)", "Can Sarcopenia Predict the need of Nutritional Support following Pancreatoduodenectomy?", "Korean Society for Parenteral and Enteral Nutrition"),
    ("Oral Paper Presentation", "20th Annual Congress, June 2021 (Virtual)", "Impact of psoas muscle area and density on postoperative outcomes following pancreatoduodenectomy", "Korean Society of Surgical Metabolism and Nutrition"),
    ("E-Poster Presentation", "Korea, 2021 (Virtual Conference)", "Can we predict the need for supplemental nutrition after pancreatoduodenectomy", "HBP Surgery Week"),
    ("Surgical Video Presentation", "New Delhi, 2019", "Transanal total mesorectal excision", "IASGCON 2019"),
    ("Thesis Presentation", "Gurugram, 2019", "Sarcopenia in pancreato-biliary cancers and its effect on postoperative outcomes", "Super-speciality training in Surgical Gastroenterology during 2016-2019 under the guidance of Dr. Adarsh Chaudhary"),
    ("Paper Presentation", "Chandigarh, 2018", "Sarcopenia in the Indian population", "IASG 2018, Chandigarh"),
    ("Poster Presentation", "Chandigarh, 2018", "Management of Entero-atmospheric fistulae", "IASG 2018, Chandigarh"),
    ("Poster Presentation", "IASG 2017, Puducherry", "Sarcopenia in pancreatic cancers", "IASG 2017, Puducherry"),
    ("Poster Presentation", "IASG 2017, Puducherry", "Surgical management of esophageal leiomyomas", "IASG 2017, Puducherry"),
    ("Poster Presentation", "IASG 2016, Coimbatore", "Asymptomatic leaks following anterior resection", "IASG 2016 and awarded the Best Poster Award"),
    ("Thesis Presentation", "Bengaluru, 2014", "Clinical Study of Preoperative Factors Predicting Difficult Laparoscopic Cholecystectomy", "DNB General Surgery during 2011-2014 at Bangalore Baptist Hospital under the guidance of Dr. Anil Kumar and Dr. Venkatanarsimhan"),
    ("Paper Presentation", "Bengaluru, 2014", "Blunt abdominal trauma", "Surgical Society of Bangalore and awarded the Best Oral Paper Presentation Award"),
    ("Presentation", "Bengaluru, 2014", "Nasal reconstruction", "Surgical Society of Bangalore"),
    ("Poster Presentation", "Bengaluru, 2013", "Splenic abscess", "Surgical Society of Bangalore"),
]
reviewer = ["Journal of Gastrointestinal Surgery", "World Journal of Surgery", "Annals of Surgical Oncology", "World Journal of Surgical Oncology",
            "Langenbeck’s Archives of Surgery", "Scientific Reports", "Indian Journal of Surgery", "Digestive Disease and Sciences",
            "BMC Gastroenterology", "European Journal of Clinical Nutrition"]

# ------------------------------------------------------------------ helpers
def li_talks(items, keep=None):
    out = []
    for n, (t, w) in enumerate(items):
        extra = ' class="is-extra"' if keep is not None and n >= keep else ''
        out.append(f"<li{extra}><b>{t}</b><span>{w}</span></li>")
    return "\n".join(out)

def talk_groups():
    out = []
    for n, (yr, items) in enumerate(talk_years):
        extra = ' is-extra' if n >= 2 else ''
        lis = "\n".join(f"<li><b>{t}</b><span>{w}</span></li>" for t, w in items)
        out.append(f'<div class="dk-talk-yr{extra}"><span class="dk-talk-year">{yr}</span><ul class="dk-talks">{lis}</ul></div>')
    return "\n".join(out)

def more_btn(target, total, label):
    return (f'<button type="button" class="dk-more" data-more="{target}" aria-expanded="false">'
            f'<span class="dk-more-show">Show all {total} {label}</span><span class="dk-more-hide">Show fewer</span>'
            f' <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>')

def pub_card(p, extra=False):
    links = []
    if p.get("doi"):
        links.append(f'<a href="https://doi.org/{e(p["doi"])}" target="_blank" rel="noopener"><i class="fa-solid fa-link" aria-hidden="true"></i> DOI</a>')
    if p.get("pubmed"):
        links.append(f'<a href="{e(p["pubmed"])}" target="_blank" rel="noopener"><i class="fa-solid fa-book-medical" aria-hidden="true"></i> PubMed</a>')
    if p.get("researchgate"):
        links.append(f'<a href="{e(p["researchgate"])}" target="_blank" rel="noopener"><i class="fa-brands fa-researchgate" aria-hidden="true"></i> ResearchGate</a>')
    first = p.get("summary", [])
    first = first[0] if first else ""
    first = first.split(". ", 1)[1] if first[:2].rstrip(".").isdigit() and ". " in first else first
    first = first.lstrip("1.\t ")
    summ = f'<p class="dk-pub-sum">{e(first)}</p>' if first else ""
    meta = f'<em>{e(p["journal"])}</em>'
    if p.get("authors"): meta += f' · {e(p["authors"])}'
    if p.get("date"): meta += f' · {e(p["date"])}'
    return f'''
        <details class="dk-pub{' is-extra' if extra else ''}" data-year="{e(p["year"])}">
            <summary>
                <div class="dk-pub-year">{e(p["year"])}</div>
                <div>
                    <h3>{e(p["title"])}</h3>
                    <p class="dk-pub-meta">{meta}</p>
                    <span class="dk-pub-toggle">Summary <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></span>
                </div>
                <span class="dk-pub-type">{e(p.get("type") or "Article")}</span>
            </summary>
            <div class="dk-pub-body">
                {summ}
                <div class="dk-pub-links">{"".join(links)}</div>
            </div>
        </details>'''

years = sorted({p["year"] for p in pubs}, reverse=True)
pub_html = "\n".join(pub_card(p, n >= 8) for n, p in enumerate(pubs))
filter_html = '<button type="button" class="is-on" data-year="all">All ' + str(len(pubs)) + '</button>' + "".join(
    f'<button type="button" data-year="{y}">{y}</button>' for y in years)

chap_html = ""
n_chap = 0
for grp in chaps:
    for c in grp["chapters"]:
        n_chap += 1
        lines = [f'<p class="dk-chap-in"><span>In:</span> {e(c["book"])}</p>']
        if c.get("authors"):
            lines.append(f'<p class="dk-chap-line">{e(c["authors"])}</p>')
        if c.get("editor"):
            lines.append(f'<p class="dk-chap-line"><span>Editor(s):</span> {e(c["editor"].replace("In: ", ""))}</p>')
        if c.get("publisher"):
            lines.append(f'<p class="dk-chap-line">{e(c["publisher"])}</p>')
        if c.get("details"):
            lines.append(f'<p class="dk-chap-line">{e(c["details"])}</p>')
        chap_html += f'''
        <article class="dk-chap dk-chap2 dk-reveal">
            <span class="dk-chap-ic"><i class="fa-solid fa-book-bookmark" aria-hidden="true"></i></span>
            <div>
                <h3>{e(c["title"])}</h3>
                {"".join(lines)}
            </div>
        </article>'''

edu_html = ""
edu_icons = ["fa-award", "fa-robot", "fa-stethoscope", "fa-user-doctor", "fa-graduation-cap"]
for n, (when, what, where, note, tag, gold) in enumerate(education):
    t = f'<span class="dk-edu-tag">{e(tag)}</span>' if tag else ""
    nt = f'<p class="dk-edu-note"><i class="fa-regular fa-hospital" aria-hidden="true"></i> {e(note)}</p>' if note else ""
    gd = f'<p class="dk-edu-gold"><i class="fa-solid fa-medal" aria-hidden="true"></i> {e(gold)}</p>' if gold else ""
    edu_html += f'''
                <article class="dk-edu-card dk-reveal">
                    <div class="dk-edu-top">
                        <span class="dk-edu-ic"><i class="fa-solid {edu_icons[n]}" aria-hidden="true"></i></span>
                        <span class="dk-edu-when">{e(when)}</span>
                    </div>
                    {t}
                    <h3>{e(what)}</h3>
                    <p class="dk-edu-where"><i class="fa-solid fa-building-columns" aria-hidden="true"></i> {e(where)}</p>
                    {nt}{gd}
                </article>'''

exp_html = ""
for role, when, where, dept in experience:
    d = f'<p class="dk-tl-note">{e(dept)}</p>' if dept else ""
    exp_html += f'''
            <article class="dk-tl dk-reveal">
                <div class="dk-tl-top"><h3>{e(role)}</h3><span class="dk-tl-when">{e(when)}</span></div>
                <p class="dk-tl-where">{e(where)}</p>
                {d}
            </article>'''

globe_html = ""
for code, place, title, when, body, focus in globe:
    globe_html += f'''
            <article class="dk-globe-card dk-globe2 dk-reveal">
                <div class="dk-globe-top">
                    <span class="dk-globe-place"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> {place}</span>
                    <span class="dk-globe-when"><i class="fa-regular fa-calendar" aria-hidden="true"></i> {when}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                <div class="dk-focus"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i><span>Focus Area</span><b>{focus}</b></div>
            </article>'''

def conf_li(n, c):
    cls = ' class="is-extra"' if n >= 14 else ''
    if " - " in c:
        name, role = c.split(" - ", 1)
        return f"<li{cls}>{e(name)} <em>· {e(role)}</em></li>"
    return f"<li{cls}>{e(c)}</li>"

conf_html = "".join(conf_li(n, c) for n, c in enumerate(conferences))

pres_html = "".join(f'''
            <li{' class="is-extra"' if n >= 6 else ''}><small>{e(kind)}<span>{e(when)}</span></small><b>{e(title)}</b><span class="dk-pres-at">{e(at)}</span></li>''' for n, (kind, when, title, at) in enumerate(presentations))

rev_html = "".join(f"<li>{e(j)}</li>" for j in reviewer)

# ------------------------------------------------------------------ page
page = f'''<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="apple-touch-icon" href="/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dr. Deeksha Kapoor | Surgical Gastroenterologist &amp; HPB Surgical Oncologist</title>
    <meta name="description" content="Dr. Deeksha Kapoor: DNB Surgical Gastroenterology, HPB &amp; GI Surgical Oncology Fellow (Tata Memorial Hospital), console-trained robotic surgeon, CEO &amp; Medical Head, Advitya Healthcares. Education, experience, awards, publications and academic roles.">
    <link rel="canonical" href="https://advityahealthcares.com/dr-deeksha-kapoor.html">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="profile">
    <meta property="og:title" content="Dr. Deeksha Kapoor | Surgical Gastroenterologist &amp; HPB Surgical Oncologist">
    <meta property="og:description" content="Surgical Gastroenterologist and HPB &amp; GI Surgical Oncologist. National gold medallist, Tata Memorial Hospital fellow, robotic surgeon, CEO &amp; Medical Head of Advitya Healthcares.">
    <meta property="og:url" content="https://advityahealthcares.com/dr-deeksha-kapoor.html">
    <meta property="og:site_name" content="Advitya Healthcares">
    <meta property="og:locale" content="en_IN">
    <meta property="og:image" content="https://advityahealthcares.com/images/dr-deeksha/portrait.webp">
    <meta name="twitter:card" content="summary_large_image">

    <link rel="preload" href="assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/fonts/manrope-variable.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/fonts/cormorant-garamond-variable.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="css/brand.css?v=2">
    <link rel="stylesheet" href="css/lp-fonts.css?v=1">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
    <link rel="stylesheet" href="css/dr-deeksha.css?v=75">
    <script>document.documentElement.classList.add('js');</script>

    <script type="application/ld+json">{{"@context":"https://schema.org","@type":"Physician","name":"Dr. Deeksha Kapoor","image":"https://advityahealthcares.com/images/dr-deeksha/portrait.webp","url":"https://advityahealthcares.com/dr-deeksha-kapoor.html","jobTitle":"CEO & Medical Head","medicalSpecialty":["Surgical Gastroenterology","Hepato-Pancreato-Biliary Surgery","GI Surgical Oncology"],"email":"deekshakapoor@advityahealthcares.com","telephone":"{TEL}","worksFor":{{"@type":"MedicalClinic","name":"Advitya Healthcares","url":"https://advityahealthcares.com"}},"alumniOf":[{{"@type":"CollegeOrUniversity","name":"Maulana Azad Medical College, New Delhi"}},{{"@type":"Hospital","name":"Bangalore Baptist Hospital"}},{{"@type":"Hospital","name":"Medanta – The Medicity, Gurugram"}},{{"@type":"Hospital","name":"Tata Memorial Hospital, Mumbai"}}],"memberOf":[{{"@type":"Organization","name":"International Hepato-Pancreato-Biliary Association"}},{{"@type":"Organization","name":"The Society for Surgery of the Alimentary Tract"}},{{"@type":"Organization","name":"Association of Surgeons of India"}},{{"@type":"Organization","name":"Indian Association of Surgical Gastroenterology"}}],"award":["Dr. B. Ramamurthi National Gold Medal, DNB General Surgery (June 2014)","Young Investigator’s Travel Grant Award, APA/IAP/CPA/JPS Hawaii 2024","Ethicon Fellow 2023"]}}</script>
</head>

<body class="dk">

    <a class="dk-skip" href="#top">Skip to content</a>

    <!-- ============================ navbar =========================== -->
    <div class="dk-topline" aria-hidden="true"></div>
    <header class="dk-head">
        <div class="dk-wrap dk-head-in">
            <a class="dk-brand" href="#home">
                <img src="images/dr-deeksha/monogram.svg" width="80" height="88" alt="">
                <span>Dr. Deeksha Kapoor</span>
            </a>
            <nav class="dk-nav" aria-label="Page sections">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#roles">Academic Roles</a></li>
                    <li><a href="#lectures">Lectures</a></li>
                    <li><a href="#awards">Awards &amp; Distinctions</a></li>
                    <li><a href="#publications">Publications &amp; Paper</a></li>
                    <li><a href="#chapters">Book Chapter</a></li>
                </ul>
            </nav>
            <a class="dk-contact-btn" href="contact.html"><i class="fa-solid fa-phone" aria-hidden="true"></i> Contact Me</a>
        </div>
    </header>

    <main id="top">

    <!-- ============================= hero ============================= -->
    <section class="dk-hero dk-ed" id="home">
        <div class="dk-wrap dk-ed-grid">
            <div class="dk-ed-copy">
                <h1 class="dk-ed-name"><small>Dr.</small> Deeksha <em>Kapoor</em></h1>
                <ul class="dk-ed-creds-list">
                    <li>MBBS, DNB General Surgery, DNB Surgical Gastroenterology</li>
                    <li>HPB and GI Surgical Oncology Fellowship - TMH</li>
                    <li>Console-trained Robotic Surgeon</li>
                </ul>
                <p class="dk-ed-lede">A leading Surgical Gastroenterologist and HPB &amp; GI Surgical Oncologist, known for combining high-end surgical precision with ethical, outcome-driven, and patient-friendly care. She completed her MBBS, went on to do DNB General Surgery, and later specialised through DNB Surgical Gastroenterology. She also completed a highly competitive HPB &amp; GI Surgical Oncology Fellowship, and is console-trained in robotic surgery on the Da Vinci Xi platform.</p>
                <div class="dk-ed-acts">
                    <a class="dk-ed-link" href="#publications">View Publications <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
                </div>
                <nav class="dk-quick" aria-label="Profile highlights">
                    <a href="#education"><span class="dk-quick-ic"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i></span><b>Education</b></a>
                    <a href="#global"><span class="dk-quick-ic"><i class="fa-solid fa-earth-asia" aria-hidden="true"></i></span><b>Global<br>Exposure</b></a>
                    <a href="#experience"><span class="dk-quick-ic"><i class="fa-solid fa-user-doctor" aria-hidden="true"></i></span><b>Experience</b></a>
                </nav>
            </div>
            <div class="dk-ed-art">
                <div class="dk-ed-outline" aria-hidden="true"></div>
                <figure class="dk-ed-photo">
                    <img src="images/dr-deeksha/portrait.webp" width="648" height="813" alt="Dr. Deeksha Kapoor" fetchpriority="high">
                </figure>
            </div>
        </div>
        <div class="dk-wrap">
            <div class="dk-ed-stats">
                <div><b data-count="{len(pubs)}" data-suffix="+">{len(pubs)}+</b><span>Peer-reviewed publications</span></div>
                <div><b data-count="{n_chap}">{n_chap}</b><span>Textbook chapters</span></div>
                <div><b data-count="15" data-suffix="+">15+</b><span>Years in surgical practice</span></div>
                <div><b data-count="4">4</b><span>International fellowships</span></div>
            </div>
        </div>
    </section>

    <!-- ======================= institution ribbon ===================== -->
    <div class="dk-ribbon" aria-label="Institutions">
        <div class="dk-ribbon-track">
            <span>Tata Memorial Hospital, Mumbai</span><i></i>
            <span>Medanta – The Medicity, Gurugram</span><i></i>
            <span>BLK Max Super Speciality Hospital, New Delhi</span><i></i>
            <span>University of Heidelberg, Germany</span><i></i>
            <span>Beaujon Hospital, Paris</span><i></i>
            <span>Japanese Foundation of Cancer Research, Tokyo</span><i></i>
            <span>Maulana Azad Medical College, New Delhi</span><i></i>
            <span>Bangalore Baptist Hospital</span><i></i>
            <span>Tata Memorial Hospital, Mumbai</span><i></i>
            <span>Medanta – The Medicity, Gurugram</span><i></i>
            <span>BLK Max Super Speciality Hospital, New Delhi</span><i></i>
            <span>University of Heidelberg, Germany</span><i></i>
            <span>Beaujon Hospital, Paris</span><i></i>
            <span>Japanese Foundation of Cancer Research, Tokyo</span><i></i>
            <span>Maulana Azad Medical College, New Delhi</span><i></i>
            <span>Bangalore Baptist Hospital</span><i></i>
        </div>
    </div>

    <!-- =========================== education ========================== -->
    <section class="dk-sec dk-sec-alt" id="education">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Education &amp; <em>Credentials</em></h2>
                </div>
                <p class="dk-lede">Gained knowledge and achieved academic excellence at esteemed institutions</p>
            </div>
            <div class="dk-edu2">{edu_html}
            </div>
            <div class="dk-early dk-reveal">
                <h3><i class="fa-solid fa-school" aria-hidden="true"></i> Early Foundation</h3>
                <div class="dk-early-row">
                    <div>
                        <span class="dk-edu-when">Class XII (2003)</span>
                        <b>Sanskriti School (CBSE)</b>
                        <span class="dk-early-note"><i class="fa-solid fa-trophy" aria-hidden="true"></i> 2nd in School</span>
                    </div>
                    <div>
                        <span class="dk-edu-when">Class X (2001)</span>
                        <b>Holy Child Auxilium School (CBSE)</b>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ======================= global exposure ======================== -->
    <section class="dk-sec" id="global">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Global Exposure &amp; <em>Advanced Learning</em></h2>
                </div>
                <p class="dk-lede">Aligned with global best practices through focused mentorships at world-renowned centers</p>
            </div>
            <div class="dk-globe">{globe_html}
            </div>
        </div>
    </section>

    <!-- =========================== experience ========================= -->
    <section class="dk-sec dk-sec-alt" id="experience">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Professional &amp; <em>Clinical Experience</em></h2>
                </div>
                <p class="dk-lede">A trajectory defined by high-volume surgical units and specialized oncology care</p>
            </div>
            <div class="dk-exp-grid">
                <div class="dk-timeline">{exp_html}
                </div>
                <aside class="dk-exp-side dk-reveal">
                <div class="dk-appt">
                    <article class="dk-appt-card is-lead">
                        <span class="dk-tag">Present Appointment</span>
                        <h3>CEO &amp; Medical Head</h3>
                        <h4 style="color:var(--dk-accent)">Advitya Healthcares Pvt Ltd</h4>
                        <p>Driving clinical excellence and leadership in specialized healthcare delivery.</p>
                        <div class="dk-appt-logos">
                            <img src="images/advitya_logo.png" width="150" height="150" alt="Advitya Healthcares" loading="lazy">
                            <img src="images/dr-deeksha/pancreacare-logo.png" width="235" height="69" alt="PancreaCare" loading="lazy">
                        </div>
                    </article>
                    <article class="dk-appt-card">
                        <span class="dk-tag">Visiting</span>
                        <h3>Visiting Consultant</h3>
                        <h4>BLK Max Superspeciality Hospital</h4>
                        <p>Department of GI Surgery and GI Oncosurgery, New Delhi</p>
                    </article>
                    <article class="dk-appt-card">
                        <span class="dk-tag">Consultant</span>
                        <h3>APAR Health</h3>
                        <p>As a company, APAR Health envisions providing effective and affordable clinical courses in research and academic medicine.</p>
                        <p>A team of doctors has founded the company to utilise Edutech and elevate healthcare skilling to the next level.</p>
                    </article>
                </div>
                    <article class="dk-appt-card dk-kc">
                        <span class="dk-tag">Key Surgical Competencies</span>
                        <h3>Specialized Surgical Portfolio</h3>
                        <ul class="dk-kc-list">
                            <li><span class="dk-comp-ic"><img src="images/dr-deeksha/icon-hepatobiliary.svg" width="29" height="24" alt=""></span>Hepato-Pancreato-Biliary (HPB) Surgery</li>
                            <li><span class="dk-comp-ic"><img src="images/dr-deeksha/icon-gi-oncology.svg" width="28" height="27" alt=""></span>GI Surgical Oncology</li>
                            <li><span class="dk-comp-ic"><i class="fa-solid fa-robot" aria-hidden="true"></i></span>Minimal Access &amp; Robotic Surgery</li>
                        </ul>
                    </article>
                </aside>
            </div>
        </div>
    </section>

    <!-- ========================== affiliations ======================== -->
    <section class="dk-sec" id="affiliations">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Affiliations and <em>Memberships</em></h2>
                </div>
                <p class="dk-lede">Professional recognition and commitments</p>
            </div>
            <div class="dk-aff">
                <div class="dk-aff-card dk-reveal">
                    <div class="dk-aff-head">
                        <h3><i class="fa-solid fa-people-group" aria-hidden="true"></i> Societies &amp; Associations</h3>
                        <span class="dk-aff-sub">Global &amp; National</span>
                    </div>
                    <ul class="dk-aff-list dk-aff-list2">
                        <li><span class="dk-aff-abbr">IHPBA</span><span class="dk-aff-name">International Hepato-Pancreato-Biliary Association</span></li>
                        <li><span class="dk-aff-abbr">SSAT</span><span class="dk-aff-name">The Society for Surgery of the Alimentary Tract</span></li>
                        <li><span class="dk-aff-abbr">ASI</span><span class="dk-aff-name">Association of Surgeons of India</span></li>
                        <li><span class="dk-aff-abbr">IASG</span><span class="dk-aff-name">Indian Association of Surgical Gastroenterology</span></li>
                    </ul>
                </div>
                <div class="dk-aff-card is-dark dk-reveal">
                    <div class="dk-aff-head">
                        <h3><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Medical Registration</h3>
                        <span class="dk-aff-verified"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Verified Status</span>
                    </div>
                    <ul class="dk-reg dk-reg2">
                        <li><span class="dk-reg-no">DMC-47391</span><span>Delhi Medical Council</span></li>
                        <li><span class="dk-reg-no">MCI/10-36368</span><span>Medical Council of India</span></li>
                        <li class="is-lic"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Licensed to Practice in India</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================= vision =========================== -->
    <section class="dk-sec dk-sec-alt" id="vision">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Present Engagement in <em>Advitya &amp; PancreaCare</em></h2>
                </div>
                <p class="dk-lede">Dedication to excellence and contribution to society</p>
            </div>
            <div class="dk-vision">
                <div class="dk-vision-art dk-reveal">
                    <img src="images/dr-deeksha/vision.jpg" width="500" height="607" alt="Dr. Deeksha Kapoor" loading="lazy">
                </div>
                <div class="dk-vision-copy dk-reveal">
                    <div class="dk-vis-card">
                        <div class="dk-vis-head">
                            <span class="dk-vis-ic"><i class="fa-solid fa-eye" aria-hidden="true"></i></span>
                            <div>
                                <h3>Dr. Kapoor Vision</h3>
                                <span class="dk-vis-role">CEO and Medical Head at Advitya Healthcares</span>
                            </div>
                        </div>
                        <p>Dr. Kapoor's vision is to make <strong>world-class pancreatic, biliary, liver, and GI cancer surgery</strong> accessible to families in tier-2 and tier-3 regions, without compromising safety or outcomes.</p>
                        <p class="dk-vis-lead">She is intensely focused on:</p>
                        <ul class="dk-checks dk-checks2">
                            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Precision surgery plus structured recovery pathways</li>
                            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Evidence-based protocols translated into simple, patient-friendly guidance</li>
                            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Affordable, ethical care so that no family feels forced to leave their city for the proper treatment</li>
                            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Improving postoperative outcomes in major GI surgical procedures</li>
                            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Affordable and apt medical care across various strata of society</li>
                            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Research in Healthcare</li>
                            <li><i class="fa-solid fa-check" aria-hidden="true"></i> National-level surgical and oncological registries</li>
                        </ul>
                    </div>
                    <div class="dk-vis-card is-pc">
                        <div class="dk-vis-head">
                            <img class="dk-pc-logo" src="images/dr-deeksha/pancreacare-logo.png" width="235" height="69" alt="PancreaCare" loading="lazy">
                            <h3>At PancreaCare</h3>
                        </div>
                        <p>Dr. Kapoor stands for calm leadership, transparent communication, and long-term healing—ensuring every patient receives not only excellent surgery, but a complete, confident recovery journey.</p>
                    </div>
                    <div class="dk-vision-links">
                        <a class="dk-btn dk-btn-primary" href="https://advitya-hospital-baripur.netlify.app/" target="_blank" rel="noopener"><i class="fa-solid fa-hospital" aria-hidden="true"></i> Visit Advitya Healthcares</a>
                        <a class="dk-btn dk-btn-ghost" href="https://www.pancreacare.com/" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Visit PancreaCare</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================ pull quote ======================== -->
    <section class="dk-quoteband">
        <div class="dk-wrap dk-reveal">
            <i class="fa-solid fa-quote-left" aria-hidden="true"></i>
            <blockquote>World-class pancreatic, biliary, liver and GI cancer surgery should be accessible to every family, in every city, without compromising safety or outcomes.</blockquote>
            <cite>Dr. Deeksha Kapoor · CEO &amp; Medical Head, Advitya Healthcares</cite>
        </div>
    </section>

    <!-- ============================= awards =========================== -->
    <section class="dk-sec" id="awards">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Awards &amp; <em>Distinctions</em></h2>
                </div>
                <p class="dk-lede">Recognition of commitment to surgical precision, academic research, and clinical excellence on both national and international platforms</p>
            </div>

            <div class="dk-award-hero dk-reveal">
                <div class="dk-medal"><i class="fa-solid fa-medal" aria-hidden="true"></i></div>
                <div>
                    <span class="dk-tag">National Level Recognition</span>
                    <h3>Dr. B. Ramamurthi National Gold Medal</h3>
                    <p class="dk-award-sub">DNB General Surgery — Batch of June 2014</p>
                    <p>Awarded for securing the highest marks nationally in the Diplomate of National Board examinations, marking a benchmark of academic and surgical excellence.</p>
                </div>
            </div>

            <div class="dk-award-group dk-reveal">
                <h3>International Travel &amp; Research Grants</h3>
                <div class="dk-award-grid">
                    <article class="dk-award">
                        <div class="dk-award-top">
                            <i class="fa-solid fa-plane-departure" aria-hidden="true"></i>
                            <span class="dk-award-when">Dec 2024</span>
                        </div>
                        <h3>Young Investigator’s Travel Grant Award</h3>
                        <p class="dk-award-where">Young Investigator’s Travel Grant Award – APA/IAP/CPA/JPS, Hawaii</p>
                        <p class="dk-award-topic"><span>Topic:</span> Real World Evidence of Portal Vein Resections with Pancreatectomy – Multicentre Indian Study (PVR-IM)</p>
                    </article>
                    <article class="dk-award">
                        <div class="dk-award-top">
                            <i class="fa-solid fa-plane-departure" aria-hidden="true"></i>
                            <span class="dk-award-when">2021</span>
                        </div>
                        <h3>E-Poster Travel Grant Award</h3>
                        <p class="dk-award-where">HBP Surgery Week, Korea (Virtual)</p>
                        <p class="dk-award-topic"><span>Topic:</span> Can we predict the need of supplemental nutrition after pancreatoduodenectomy?</p>
                    </article>
                    <article class="dk-award">
                        <div class="dk-award-top">
                            <i class="fa-solid fa-plane-departure" aria-hidden="true"></i>
                            <span class="dk-award-when">2021</span>
                        </div>
                        <h3>KSSMN Travel Grant Award</h3>
                        <p class="dk-award-where">Korean Society for Surgical Metabolism and Nutrition</p>
                        <p class="dk-award-topic"><span>Paper:</span> Impact of psoas muscle area and density on postoperative outcomes following pancreatoduodenectomy</p>
                    </article>
                </div>
            </div>

            <div class="dk-award-group dk-reveal">
                <h3>Professional Accolades</h3>
                <div class="dk-award-grid">
                    <article class="dk-award">
                        <div class="dk-award-top">
                            <i class="fa-solid fa-trophy" aria-hidden="true"></i>
                            <span class="dk-award-when">IASG 2016</span>
                        </div>
                        <h3>Best Poster Award</h3>
                        <p class="dk-award-topic">“Asymptomatic leaks following anterior resection”</p>
                    </article>
                    <article class="dk-award">
                        <div class="dk-award-top">
                            <i class="fa-solid fa-user-graduate" aria-hidden="true"></i>
                            <span class="dk-award-when">2014</span>
                        </div>
                        <h3>Best Outgoing Surgical Trainee</h3>
                        <p class="dk-award-where">Bangalore Baptist Hospital</p>
                    </article>
                    <article class="dk-award">
                        <div class="dk-award-top">
                            <i class="fa-solid fa-microphone" aria-hidden="true"></i>
                            <span class="dk-award-rank">1st</span>
                        </div>
                        <h3>Best Oral Presentation</h3>
                        <p class="dk-award-where">Surgical Society of Bangalore, 2014</p>
                        <p class="dk-award-topic"><span>Topic:</span> Blunt Abdominal Trauma</p>
                    </article>
                    <article class="dk-award">
                        <div class="dk-award-top">
                            <i class="fa-solid fa-file-lines" aria-hidden="true"></i>
                            <span class="dk-award-rank">1st</span>
                        </div>
                        <h3>Paper Presentation Prize</h3>
                        <p class="dk-award-where">State Meetings of Surgical Society, 2013</p>
                    </article>
                </div>
            </div>

            <div class="dk-acad dk-reveal">
                <h3>Academic Foundation</h3>
                <div class="dk-acad-grid">
                    <div class="dk-acad-card">
                        <h4><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> MBBS Training</h4>
                        <ul>
                            <li>Gold Medal in Paediatrics (Final Year)</li>
                            <li>Highest marks in Pathology</li>
                            <li>Distinction in Physiology</li>
                        </ul>
                    </div>
                    <div class="dk-acad-card">
                        <h4><i class="fa-solid fa-school" aria-hidden="true"></i> Early Education</h4>
                        <ul>
                            <li>Top Three in School — Class 12 Boards</li>
                            <li>Top Three in School — Class 10 Boards</li>
                            <li>Awarded Academic Proficiency throughout school tenure</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ========================== academic roles ====================== -->
    <section class="dk-sec dk-sec-alt" id="roles">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Academic <em>Roles</em></h2>
                </div>
                <p class="dk-lede">Fostering research integrity, mentoring the next generation of surgeons, and contributing to the global scientific community through editorial leadership.</p>
            </div>
            <div class="dk-roles">
                <article class="dk-role dk-reveal">
                    <i class="dk-role-ic fa-solid fa-earth-asia" aria-hidden="true"></i>
                    <h3>Global Committees</h3>
                    <ul><li><b>Research Committee Member</b><span>Asian Pacific Hepato-Pancreato-Biliary Association (A-PHPBA) · 2025 – 2027</span></li></ul>
                </article>
                <article class="dk-role dk-reveal">
                    <i class="dk-role-ic fa-solid fa-pen-nib" aria-hidden="true"></i>
                    <h3>Editorial Boards</h3>
                    <ul>
                        <li><b>Editorial Board Member</b><span>Journal of Gastrointestinal Surgery</span></li>
                        <li><b>Editorial Board Member</b><span>Newsletter of the Indian Association of Surgical Gastroenterology</span></li>
                    </ul>
                </article>
                <article class="dk-role dk-reveal">
                    <i class="dk-role-ic fa-solid fa-building-columns" aria-hidden="true"></i>
                    <h3>Institutional Leadership</h3>
                    <ul>
                        <li><b>Medanta Institutional Review Board (IRB)</b><span>Involved in the scientific and regulatory outline and methodological vigour for all research at Medanta Hospital under the Medanta Institutional Ethics Committee. Accreditations: OHRP (IRB00007595) • CDSCO • NABH</span></li>
                        <li><b>Student Mentor</b><span>On the IRB, supporting postgraduate trainees in research methodology and guiding their thesis work.</span></li>
                        <li><b>Academic Coordinator</b><span>Regular DNB academic sessions: topic seminars, case discussions, and journal clubs.</span></li>
                    </ul>
                </article>
                <article class="dk-role dk-role-span dk-reveal">
                    <div>
                        <i class="dk-role-ic fa-solid fa-magnifying-glass-chart" aria-hidden="true"></i>
                        <h3>Peer Reviewer</h3>
                        <p>Contributing to the scientific integrity of major international journals through rigorous peer review.</p>
                    </div>
                    <ul class="dk-journals">{rev_html}</ul>
                </article>
            </div>
        </div>
    </section>

    <!-- ============================ lectures ========================== -->
    <section class="dk-sec" id="lectures">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Lectures &amp; <em>Presentations</em></h2>
                </div>
                <p class="dk-lede">A comprehensive record of talks and lectures delivered, participation in national and international conferences, and scientific and research paper and poster presentations</p>
            </div>
            <div class="dk-ihpba-head dk-reveal"><span>IHPBA INDIA 2026</span></div>
            <div class="dk-gallery dk-gallery-v2 dk-reveal">
                <figure class="g-tall"><img src="images/dr-deeksha/gallery-2.webp" width="960" height="1280" alt="Dr. Deeksha Kapoor speaking at IHPBA India 2026" loading="lazy" style="object-position:50% 20%"><figcaption>IHPBA India 2026</figcaption></figure>
                <figure class="g-wide"><img src="images/dr-deeksha/gallery-1.webp" width="960" height="811" alt="Dr. Deeksha Kapoor presenting on stage at IHPBA India 2026" loading="lazy" style="object-position:50% 55%"><figcaption>IHPBA India 2026</figcaption></figure>
                <figure class="g-tall g-right"><img src="images/dr-deeksha-kapoor-1024.webp" width="1023" height="1537" alt="Dr. Deeksha Kapoor" loading="lazy" style="object-position:0% 0%"><figcaption>Advitya Healthcares</figcaption></figure>
                <figure class="g-wide"><img src="images/dr-deeksha/gallery-3.webp" width="960" height="716" alt="Presentation slide on patient selection at IHPBA India 2026" loading="lazy" style="object-position:50% 40%"><figcaption>IHPBA India 2026</figcaption></figure>
            </div>
            <div class="dk-lect">
                <div class="dk-panel dk-reveal dk-collapse" id="dk-talks">
                    <h3><i class="fa-solid fa-microphone-lines" aria-hidden="true"></i> Talks Delivered <small>{n_talks} talks</small></h3>
                    {talk_groups()}
                    <div class="is-extra">
                        <p class="dk-talks-sub">Selected Past Talks</p>
                        <ul class="dk-talks">{li_talks(talks_past)}</ul>
                    </div>
                    {more_btn("dk-talks", n_talks, "talks")}
                </div>
                <div class="dk-panel dk-reveal dk-collapse" id="dk-conf">
                    <h3><i class="fa-solid fa-users-rectangle" aria-hidden="true"></i> Conferences <small>{len(conferences)} meetings</small></h3>
                    <ul class="dk-conf">{conf_html}</ul>
                    {more_btn("dk-conf", len(conferences), "conferences")}
                </div>
            </div>
            <div class="dk-panel dk-reveal dk-collapse" id="dk-pres" style="margin-top:24px;">
                <h3><i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i> Paper &amp; Poster Presentations <small>{len(presentations)} presentations</small></h3>
                <ul class="dk-pres" style="margin-top:0">{pres_html}
                </ul>
                {more_btn("dk-pres", len(presentations), "presentations")}
            </div>
        </div>
    </section>

    <!-- ========================== publications ======================== -->
    <section class="dk-sec dk-sec-alt" id="publications">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Publications &amp; <em>Papers</em></h2>
                </div>
                <p class="dk-lede">Advancing surgical gastroenterology through rigorous clinical studies, real-world evidence, and predictive modeling for better patient outcomes</p>
            </div>
            <div class="dk-pubs dk-collapse" id="dk-pubs">{pub_html}
            </div>
            <div class="dk-more-row">{more_btn("dk-pubs", len(pubs), "publications")}</div>
        </div>
    </section>

    <!-- ========================== book chapters ======================= -->
    <section class="dk-sec" id="chapters">
        <div class="dk-wrap">
            <div class="dk-sec-head dk-reveal">
                <div>
                    <h2>Book <em>Chapters</em></h2>
                </div>
                <p class="dk-lede">A comprehensive list of authored chapters in prominent medical textbooks and surgical journals</p>
            </div>
            <div class="dk-chapters">{chap_html}
            </div>
        </div>
    </section>

    </main>

    <!-- ============================= footer =========================== -->
    <footer class="dk-foot">
        <div class="dk-wrap">
            <div class="dk-foot-grid">
                <div class="dk-foot-col dk-foot-about">
                    <div class="dk-foot-brand">
                        <span class="dk-foot-mark"><img src="images/dr-deeksha/monogram.svg" width="80" height="88" alt=""></span>
                        <div><b>Dr. Deeksha Kapoor</b><span>Academic Portfolio</span></div>
                    </div>
                    <p>Dedicated to advancing medical knowledge through research, academic excellence, and clinical practice.</p>
                </div>
                <div class="dk-foot-col">
                    <h4>Quick Navigation</h4>
                    <ul class="dk-foot-nav">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#roles">Academic Roles</a></li>
                        <li><a href="#lectures">Lectures</a></li>
                        <li><a href="#awards">Awards &amp; Distinctions</a></li>
                        <li><a href="#publications">Publications &amp; Paper</a></li>
                        <li><a href="#chapters">Book Chapter</a></li>
                    </ul>
                </div>
                <div class="dk-foot-col">
                    <h4>Contact &amp; Connect</h4>
                    <a class="dk-foot-mail" href="mailto:dr.deeksha.kapoor@gmail.com"><i class="fa-regular fa-envelope" aria-hidden="true"></i> dr.deeksha.kapoor@gmail.com</a>
                </div>
            </div>
            <div class="dk-foot-copy">
                <span>&copy; <span id="dk-year">2026</span> Dr. Deeksha Kapoor. All rights reserved.</span>
                <span class="dk-visits"><i class="fa-regular fa-eye" aria-hidden="true"></i> <b id="dk-visits">1</b> Visits</span>
            </div>
        </div>
    </footer>

    <!-- ========================= sticky mobile CTA ==================== -->
    <nav class="dk-sticky" aria-label="Contact actions">
        <div class="dk-sticky-in">
            <a class="is-call" href="tel:{TEL}"><i class="fa-solid fa-phone" aria-hidden="true"></i> Call</a>
            <a class="is-wa" href="{WA}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
            <a class="is-book" href="contact.html"><i class="fa-regular fa-calendar-check" aria-hidden="true"></i> Book</a>
        </div>
    </nav>

    <a class="dk-top" href="#top" aria-label="Back to top"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></a>

    <script>
    (function () {{
        document.getElementById('dk-year').textContent = new Date().getFullYear();

        /* visit count for this browser, kept locally */
        try {{
            var vk = 'dk-visits', vn = parseInt(localStorage.getItem(vk) || '0', 10) + 1;
            localStorage.setItem(vk, vn);
            document.getElementById('dk-visits').textContent = vn;
        }} catch (err) {{
            document.getElementById('dk-visits').textContent = '1';
        }}

        /* header shadow + back-to-top visibility */
        var head = document.querySelector('.dk-head'), top = document.querySelector('.dk-top');
        function onScroll() {{
            var y = window.scrollY;
            head.classList.toggle('is-scrolled', y > 24);
            top.classList.toggle('is-show', y > 900);
        }}
        window.addEventListener('scroll', onScroll, {{ passive: true }});
        onScroll();

        /* animated counters */
        var counters = document.querySelectorAll('[data-count]');
        function runCounter(el) {{
            var end = parseInt(el.getAttribute('data-count'), 10), suf = el.getAttribute('data-suffix') || '';
            var t0 = null, dur = 1400;
            function step(ts) {{
                if (!t0) t0 = ts;
                var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(end * e) + suf;
                if (p < 1) requestAnimationFrame(step);
            }}
            requestAnimationFrame(step);
        }}
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {{
            var cio = new IntersectionObserver(function (entries) {{
                entries.forEach(function (en) {{ if (en.isIntersecting) {{ runCounter(en.target); cio.unobserve(en.target); }} }});
            }}, {{ threshold: 0.5 }});
            counters.forEach(function (c) {{ cio.observe(c); }});
        }}

        /* scroll reveal */
        var els = document.querySelectorAll('.dk-reveal');
        if ('IntersectionObserver' in window) {{
            var io = new IntersectionObserver(function (entries) {{
                entries.forEach(function (en) {{
                    if (en.isIntersecting) {{ en.target.classList.add('is-in'); io.unobserve(en.target); }}
                }});
            }}, {{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }});
            els.forEach(function (el) {{ io.observe(el); }});
        }} else {{
            els.forEach(function (el) {{ el.classList.add('is-in'); }});
        }}
        setTimeout(function () {{ els.forEach(function (el) {{ el.classList.add('is-in'); }}); }}, 2500);

        /* show all / show fewer */
        document.querySelectorAll('.dk-more').forEach(function (b) {{
            b.addEventListener('click', function () {{
                var box = document.getElementById(b.getAttribute('data-more'));
                var open = !box.classList.contains('is-open');
                box.classList.toggle('is-open', open);
                b.setAttribute('aria-expanded', open ? 'true' : 'false');
                if (!open) box.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
            }});
        }});


        /* sub nav active state */
        var links = document.querySelectorAll('.dk-nav a');
        var secs = [];
        links.forEach(function (a) {{
            var s = document.querySelector(a.getAttribute('href'));
            if (s) secs.push({{ a: a, s: s }});
        }});
        function setActive() {{
            var y = window.scrollY + 170, cur = null;
            secs.forEach(function (o) {{ if (o.s.offsetTop <= y) cur = o; }});
            links.forEach(function (a) {{ a.classList.remove('is-active'); }});
            if (cur) {{
                cur.a.classList.add('is-active');
                var box = cur.a.closest('ul');
                var left = cur.a.offsetLeft - box.clientWidth / 2 + cur.a.clientWidth / 2;
                box.scrollTo({{ left: left, behavior: 'smooth' }});
            }}
        }}
        window.addEventListener('scroll', setActive, {{ passive: true }});
        setActive();
    }})();
    </script>
</body>

</html>
'''

out = SC.parent.parent / "dr-deeksha-kapoor.html"
out.write_text(page, encoding="utf-8")
print("wrote", out, len(page), "bytes; pubs", len(pubs), "chapters", n_chap)
