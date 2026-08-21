# Launch checklist — Google Ads surgical landing pages

Six landing pages, one thank-you page, two legal pages. Everything below is
either done and verified, or waiting on something only Advitya Healthcares can
supply. **The pages are not launch-ready until every unticked box is ticked.**

| Page | URL to point the campaign at |
| --- | --- |
| Hernia Surgery | `/hernia-surgery` |
| Gallbladder Stone Surgery | `/gallbladder-stone-surgery` |
| Colorectal Cancer Surgery | `/colorectal-cancer-surgery` |
| Liver Cancer & HPB Surgery | `/liver-cancer-hpb-surgery` |
| Pancreatic Cancer Surgery + Whipple | `/pancreatic-cancer-surgery` |
| Gallbladder Cancer Surgery | `/gallbladder-cancer-surgery` |
| Thank you (conversion page) | `/thank-you` |

Each campaign must send its traffic to its own page. Sending several campaigns
to one page throws away the message match the pages were built for.

---

## 1. Tracking — WAITING ON CLIENT

`js/lp-config.js` holds four placeholders:

```js
GTM_ID: 'GTM-XXXXXXX',
GA4_ID: 'G-XXXXXXXXXX',
ADS_ID: 'AW-XXXXXXXXXX',
ADS_LEAD_LABEL: 'XXXXXXXXXXXXXXXXXX',
```

While any of them contains `XXXX` the GTM container is **not** injected — the
pages stay clean and nothing half-fires. Every event still reaches
`window.dataLayer`, so the pages can be exercised in the console today.

- [ ] Replace the four IDs with the real containers.
- [ ] In GTM, map the dataLayer events below to GA4 events and Ads conversions.
- [ ] Fire each event once with GTM Preview and confirm it arrives in GA4 DebugView.
- [ ] Confirm the Ads conversion records against `appointment_booking`.
- [ ] Re-check in production, after publishing the container, on a real phone.

### Events the pages push

| Event | Fires when | Payload |
| --- | --- | --- |
| `page_view` | any page loads | `page_type`, `page_service` |
| `phone_click` | any `tel:` link | `cta_location`, `phone` |
| `whatsapp_click` | any WhatsApp link | `cta_location` |
| `appointment_request` | a CTA scrolls the visitor to the form | `cta_location`, `step` |
| `form_start` | first keystroke in the form | `form_id` |
| `form_error` | submit blocked by validation | `form_id`, `field` |
| `generate_lead` | valid submit | `form_id`, `method` |
| `form_submit` | valid submit | `form_id`, `method` |
| `form_endpoint_error` | endpoint POST failed, mail fallback used | `form_id`, `error` |
| `appointment_booking` | the thank-you page loads | `form_id`, `service_slug` |
| `scroll_depth` | 25 / 50 / 75 / 100 % | `percent_scrolled` |
| `faq_open` | an FAQ is opened | `question` |
| `map_open` | the map is loaded on request | `venue` |

**The Ads conversion is `appointment_booking`, and only that.**
`appointment_request` means the visitor moved towards the form, which is a
different thing — mapping both to one conversion would double-count.

---

## 2. Medical review — WAITING ON CLINICIAN

Every clinical section carries `data-medical-review="pending"`. Find them with:

```
grep -l 'data-medical-review="pending"' *.html
```

- [ ] Work through `MEDICAL-REVIEW.md` page by page.
- [ ] Flip each attribute to `"approved"` once signed off.
- [ ] Fill `"lastReviewed"` in each page's MedicalWebPage JSON-LD.

No clinical wording may be changed for marketing reasons — only by the reviewer.

---

## 3. Hospital photographs — WAITING ON CLIENT

The `#hospital` section carries `data-assets-pending="hospital-photographs"` and
an HTML comment marking exactly where the photographs go. It currently shows the
venues, addresses, directions links and a map — all verifiable — and **no
facility imagery at all**, because nothing on the site is verified as such.
Camp, conference and event photographs must never stand in for facilities.

What to send:

| Shot | Notes |
| --- | --- |
| Hospital exterior | Landscape, daylight, whole frontage |
| Reception | Landscape, no identifiable patients |
| Consultation room | Landscape, empty or with staff who have consented |
| Operation theatre / procedure room | Only if appropriate to publish |
| Patient care area / ward | No identifiable patients |
| Diagnostic facility | Imaging or endoscopy suite |

Landscape, at least 1600px wide, JPEG or PNG straight off the camera — they will
be resized, converted and lazy-loaded here. Written consent is needed for anyone
identifiable in them.

- [ ] Supply the photographs, with venue names, so each is captioned truthfully.

---

## 4. Form backend — WAITING ON CLIENT (optional)

Today the enquiry is handed to the visitor's mail client and the visitor is sent
to `/thank-you`, which is what Ads counts. To POST it to a real endpoint
instead, set one line in `js/lp-config.js`:

```js
formEndpoint: 'https://api.example.com/lead',
```

The page then POSTs JSON:

```json
{ "service": "...", "slug": "...", "name": "...", "phone": "...",
  "preferred_date": "...", "preferred_time": "...", "condition": "...",
  "message": "...", "consent": true, "page_url": "..." }
```

Answer `2xx` on success. Any other status, or a network failure, falls back to
the mail route so a lead is never dropped, and pushes `form_endpoint_error`.
Validation, tracking and the thank-you redirect are identical on both routes.

- [ ] Provide the endpoint URL (HTTPS, and it must allow the site origin via CORS).
- [ ] Confirm where the leads land — inbox, CRM, sheet — and who watches it.

---

## 5. Legal wording — WAITING ON CLIENT

Both legal pages carry `data-legal-review="unapproved"` on their content wrapper.

- [ ] Approve the medical disclaimer used at the foot of every landing page.
- [ ] Approve `privacy-policy.html`.
- [ ] Approve `terms.html`.
- [ ] Update the privacy policy if a form backend or CRM is added — it currently
      states that the website itself stores nothing, which is true only while
      the mail route is in use.

---

## 6. Hosting

The site deploys to Netlify, and `netlify.toml` already covers the parts that
would otherwise need doing by hand:

- Clean URLs. `/hernia-surgery` serves `hernia-surgery.html` with a 200, not a
  redirect, so the ad URL, the address bar and the canonical tag agree. The same
  is set up for the other five pages, `/thank-you`, `/privacy-policy` and
  `/terms`.
- Caching. A year on `/images/*` and `/assets/*`, a week on `/css/*` and
  `/js/*`, which are versioned with `?v=` so they can be busted on deploy.
- Security headers, and `Access-Control-Allow-Origin` on the fonts, which the
  preload needs even same-origin.
- Compression. Netlify gzips and brotlis text responses itself; the numbers
  below assume that.

Left to confirm after the first deploy:

- [ ] HTTPS is on (the privacy policy states it).
- [ ] `/thank-you` returns 200 on the clean path.
- [ ] `thank-you.html` stays `noindex` (already set in the markup).
- [ ] Add the six clean URLs to a sitemap and submit it in Search Console.

---

## Verified already — no action needed

Tested in Chrome against the real pages, cold cache, gzip on:

- **Responsive.** 1920 / 1440 / 1024 / 768 / 480 / 375 / 360 px on all nine
  pages: `scrollWidth === clientWidth` in all 63 combinations. No horizontal
  scroll, no clipped content, sticky mobile CTA below 861px.
- **Form.** Invalid submit is blocked with per-field messages tied to the field
  by `aria-describedby`, focus moves to the first bad field, nothing is sent.
  Valid submit reaches `/thank-you?service=…` on all three delivery routes
  (endpoint 2xx, endpoint failure with mail fallback, mail default).
- **Events.** All thirteen events above observed firing on all six pages.
- **GTM guard.** With placeholder IDs, zero requests to googletagmanager.com,
  google-analytics.com or googleads.com; `dataLayer` still records everything.
- **Accessibility.** Skip link first in tab order, one H1 per page, no skipped
  heading levels, alt text on every image, every control labelled, full keyboard
  traversal with a visible 3px focus ring, FAQ and map operable from the keyboard.
- **SEO.** Unique title (≤62 chars) and description (≤139) per page, canonical
  on every page, Open Graph and Twitter card meta with a per-page share image,
  three JSON-LD blocks per landing page (MedicalWebPage, FAQPage, Physician).
- **Performance.** Throttled to 4× CPU and 1.5 Mbps at 390px, cold cache:
  **LCP 692–756 ms, CLS 0, ~128 KB** per page. No third-party frame or tag
  loads until the visitor asks for the map.

### Assets built from what already existed

| File | From | Why |
| --- | --- | --- |
| `images/dr-deeksha-kapoor-avatar.webp` | the existing photograph | 4KB, for the 52px hero chip that used to load 209KB |
| `images/dr-deeksha-kapoor-680.webp` | the same | 35KB for the doctor card |
| `images/advitya-logo-nav-120.webp` | `advitya_logo_nav.png` | 11KB instead of 51KB, colours untouched |
| `images/gallstones-anatomy.svg` | drawn for the stone page | each page needs its own visual |
| `images/hpb-anatomy.svg` | drawn for the HPB page | liver, ducts and pancreas together |
| `images/og/*.jpg` | `tools/og-card-template.html` | share cards, six of them, from each page's own heading and illustration |
| `assets/fonts/*.woff2` + `css/lp-fonts.css` | Google Fonts API (SIL OFL) | removes two third-party hosts from the critical path |

Originals are untouched; the main site still uses them.
