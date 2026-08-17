# Builds search-index.js from the site's own pages, so the header search box
# always points at URLs that exist.
#
#   python build-search-index.py
#
# Re-run after adding, renaming or deleting a page.
import glob, io, json, os, re, html

os.chdir(os.path.dirname(os.path.abspath(__file__)))

SKIP = {
    'blogs.previous.html', 'index-light-backup.html', 'our-team-demo.html',
    'advitya_team.html', 'liver-operation-patient-booklet.html',
}

# Pages that are really one section of another page, plus the in-page anchors
# the Clinical Services mega menu points at.
SERVICES = [
    ('Gastroenterology', 'clinical-services.html#gastroenterology', 'Clinical Services', 'digestive stomach gut acidity ibs gastro'),
    ('Pancreatic Disorders', 'clinical-services.html#pancreatic-disorders', 'Clinical Services', 'pancreas pancreatitis'),
    ('Pancreatitis Care', 'clinical-services.html#pancreatitis', 'Clinical Services', 'acute chronic pancreatitis'),
    ('Pancreatic Cancer Care', 'clinical-services.html#pancreatic-cancer', 'Clinical Services', 'whipple tumour oncology'),
    ('Liver Care', 'clinical-services.html#liver-care', 'Clinical Services', 'hepatology fatty liver cirrhosis'),
    ('Endoscopy', 'clinical-services.html#endoscopy', 'Clinical Services', 'gastroscopy ercp scope upper gi'),
    ('GI Surgery', 'clinical-services.html#gi-surgery', 'Clinical Services', 'laparoscopic surgery operation'),
    ('Surgical Care', 'clinical-services.html#surgical-care', 'Clinical Services', 'operation theatre surgery'),
    ('Colonoscopy', 'clinical-services.html#colonoscopy', 'Clinical Services', 'colon rectum screening scope'),
    ('Nutrition & Dietetics', 'clinical-services.html#nutrition', 'Clinical Services', 'diet dietician food plan'),
    ('Preventive Health Checkups', 'clinical-services.html#preventive-health', 'Clinical Services', 'screening package health check'),
    ('Emergency Care', 'clinical-services.html#emergency-care', 'Clinical Services', 'casualty ambulance urgent 24x7'),
]

ANCHORS = [
    ('Our Locations', 'index.html#location', 'Contact', 'address hospital branch kolkata ranchi bokaro baruipur map directions'),
    ('Book an Appointment', 'index.html#contactModal', 'Contact', 'contact enquiry call booking consultation'),
]

BUCKET = [
    (re.compile(r'^diseases/'), 'Disease Library'),
    (re.compile(r'^(pancreas|gallbladder|liver|large-intestine|stomach|esophagus)\.html$'), 'FAQs'),
    (re.compile(r'^(about|from-ceos-desk|from-directors-desk|vision-mission|our-team|what-we-do|the-story-of-pancreacare)\.html$'), 'About Us'),
    (re.compile(r'^(clinical-services|pancrea-care|related-diseases)\.html$'), 'Clinical Services'),
    (re.compile(r'^(careers|gallery|testimonials|faqs|blogs|contact)\.html$'), 'Advitya Healthcares'),
]

TAIL = re.compile(r'\s*(\||\u2014|-)\s*(Advitya Healthcares|PancreaCare).*$', re.I)
TAG = re.compile(r'<[^>]+>')


def text(s):
    return re.sub(r'\s+', ' ', html.unescape(TAG.sub(' ', s))).strip()


def grab(pat, s, group=1):
    m = re.search(pat, s, re.I | re.S)
    return text(m.group(group)) if m else ''


def bucket(url, title):
    for pat, name in BUCKET:
        if pat.search(url):
            return name
    return 'Blog'


def main():
    posts = {}
    src = io.open('blog-data.js', encoding='utf-8').read()
    # blog-data.js is a plain array of object literals; pull url + excerpt pairs
    for block in re.findall(r'\{\s*url:[\s\S]*?\n    \}', src):
        u = re.search(r'url:\s*"([^"]+)"', block)
        e = re.search(r'excerpt:\s*"((?:[^"\\]|\\.)*)"', block)
        c = re.search(r'primary:\s*"([^"]+)"', block)
        if u:
            posts[u.group(1)] = (
                text(e.group(1)) if e else '',
                (c.group(1) if c else '').replace('-', ' '),
            )

    files = sorted(glob.glob('*.html')) + sorted(glob.glob('diseases/*/index.html'))
    out = []
    seen = set()

    for f in files:
        url = f.replace('\\', '/')
        if os.path.basename(url) in SKIP:
            continue
        if url.endswith('/index.html') and url != 'index.html':
            url = url[: -len('index.html')]
        s = io.open(f, encoding='utf-8', errors='replace').read()

        title = TAIL.sub('', grab(r'<title>(.*?)</title>', s)) or grab(r'<h1[^>]*>(.*?)</h1>', s)
        if not title:
            continue
        desc = grab(r'<meta\s+name="description"\s+content="([^"]*)"', s)
        h1 = grab(r'<h1[^>]*>(.*?)</h1>', s)

        excerpt, cat = posts.get(f, ('', ''))
        keys = desc or excerpt or h1

        # descriptions often open by restating the title; the result row shows
        # the title already, so that half is dead space
        low, tl = keys.lower(), title.lower()
        if low.startswith(tl):
            keys = keys[len(title):].lstrip(' .:—-|')
        if cat and cat.lower() not in keys.lower():
            keys = (keys + ' ' + cat).strip()
        keys = keys[:200]

        if url in seen:
            continue
        seen.add(url)
        out.append({'t': title, 'u': url, 's': bucket(url, title), 'k': keys})

    for t, u, s_, k in SERVICES + ANCHORS:
        if u not in seen:
            seen.add(u)
            out.append({'t': t, 'u': u, 's': s_, 'k': k})

    # A page the reader is most likely hunting for should not sit behind a
    # blog post that happens to share a word, so section order breaks ties.
    rank = {'Clinical Services': 0, 'Contact': 1, 'About Us': 2, 'FAQs': 3,
            'Disease Library': 4, 'Advitya Healthcares': 5, 'Blog': 6}
    out.sort(key=lambda e: (rank.get(e['s'], 9), e['t'].lower()))

    body = ',\n'.join(
        '    ' + json.dumps(e, ensure_ascii=False, sort_keys=True) for e in out
    )
    js = (
        '/* ===================================================================\n'
        '   search-index.js \u2014 what the header search box searches.\n\n'
        '   Generated from the site\'s own pages, so every entry points at a URL\n'
        '   that exists. t = title, u = url, s = section, k = extra keywords.\n'
        '   Regenerate after adding or renaming a page.\n'
        '   =================================================================== */\n'
        'window.ADV_SEARCH_INDEX = [\n' + body + '\n];\n'
    )
    io.open('search-index.js', 'w', encoding='utf-8').write(js)
    print('entries:', len(out))
    from collections import Counter
    for k, v in Counter(e['s'] for e in out).most_common():
        print(' ', k, v)


main()
