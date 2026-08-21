# Medical review checklist - Google Ads surgical landing pages

Every clinical statement on the six landing pages is **pending review**. Nothing here
is presented as medically approved until the treating clinician signs it off.

The copy was written from the development brief and from the existing Advitya
website. No claim, statistic, success rate, award or credential was invented for it.
If a statement is wrong, replace it with the correct wording - the marketing side is
not to reword clinical content to make it sound stronger.

## How to sign a page off

1. Read the sections listed under the page below.
2. Correct anything inaccurate, in the HTML or by sending the corrected wording.
3. Change every `data-medical-review="pending"` on that page to `"approved"`.
4. Put the review date into `"lastReviewed"` in the page MedicalWebPage JSON-LD block.
5. Tick the page in the table below.

| Page | Sections pending | FAQs | Signed off by | Date |
| --- | --- | --- | --- | --- |
| Hernia Surgery (`hernia-surgery.html`) | 6 | 7 |  |  |
| Gallbladder Stone Surgery (`gallbladder-stone-surgery.html`) | 6 | 7 |  |  |
| Colorectal Cancer Surgery (`colorectal-cancer-surgery.html`) | 6 | 7 |  |  |
| Liver Cancer & HPB Surgery (`liver-cancer-hpb-surgery.html`) | 8 | 8 |  |  |
| Pancreatic Cancer Surgery + Whipple Procedure (`pancreatic-cancer-surgery.html`) | 11 | 16 |  |  |
| Gallbladder Cancer Surgery (`gallbladder-cancer-surgery.html`) | 6 | 7 |  |  |

## What needs reading, page by page

### Hernia Surgery

`hernia-surgery.html` - sections flagged: `#condition`, `#symptoms`, `#diagnosis`, `#treatment`, `#surgery`, `#faq`

Headings:

- Understanding hernia
- When should you seek medical evaluation?
- How the diagnosis is reached
- Treatment options
- Surgical approach
- What this unit brings to hernia surgery
- Meet your surgeon
- What happens, in order
- Consultation and surgery locations
- Questions people ask before booking
- Book a consultation with our surgical team

FAQ questions:

- When should I see a surgeon about a hernia?
- Can a hernia be cured with medicine or exercise?
- Does every hernia need surgery?
- Is laparoscopic hernia surgery suitable for everyone?
- Is mesh always used?
- How long does recovery take?
- What should I bring to the consultation?

### Gallbladder Stone Surgery

`gallbladder-stone-surgery.html` - sections flagged: `#condition`, `#symptoms`, `#diagnosis`, `#treatment`, `#surgery`, `#faq`

Headings:

- Understanding gallstones
- When should you seek medical evaluation?
- How the diagnosis is reached
- Treatment options
- Laparoscopic gallbladder surgery
- What this unit brings to gallbladder stone surgery
- Meet your surgeon
- What happens, in order
- Consultation and surgery locations
- Questions people ask before booking
- Book a consultation with our surgical team

FAQ questions:

- Do gallstones always need surgery?
- Can gallstones be dissolved with medicine?
- Can I digest food normally without a gallbladder?
- Is the operation done by keyhole surgery?
- What happens if a stone is stuck in the bile duct?
- How soon can I return to work?
- What should I bring to my consultation?

### Colorectal Cancer Surgery

`colorectal-cancer-surgery.html` - sections flagged: `#condition`, `#symptoms`, `#diagnosis`, `#treatment`, `#surgery`, `#faq`

Headings:

- Understanding colorectal cancer
- When should you seek medical evaluation?
- How the diagnosis is reached
- Treatment options
- Surgical treatment
- What this unit brings to colorectal cancer surgery
- Meet your surgeon
- What happens, in order
- Consultation and surgery locations
- Questions people ask before booking
- Book a consultation with our surgical team

FAQ questions:

- Does blood in the stool mean cancer?
- How is colorectal cancer diagnosed?
- Will I need a stoma?
- Is surgery always the first treatment?
- Can colorectal cancer surgery be done laparoscopically?
- What follow-up is needed after treatment?
- What should I bring to my consultation?

### Liver Cancer & HPB Surgery

`liver-cancer-hpb-surgery.html` - sections flagged: `#condition`, `#symptoms`, `#hpb`, `#conditions`, `#diagnosis`, `#treatment`, `#surgery`, `#faq`

Headings:

- Understanding liver and HPB disease
- When should you seek medical evaluation?
- What is HPB surgery?
- Liver and HPB conditions seen at this unit
- How the diagnosis is reached
- Treatment options
- Surgical options
- What this unit brings to liver and HPB surgery
- Meet your surgeon
- What happens, in order
- Consultation and surgery locations
- Questions people ask before booking
- Book a consultation with our surgical team

FAQ questions:

- What does HPB surgery mean?
- What conditions does an HPB surgeon treat?
- Is jaundice always caused by cancer?
- Can part of the liver be removed safely?
- Can liver secondaries from bowel cancer be operated on?
- What if surgery is not possible?
- How long is recovery after liver surgery?
- What should I bring to my consultation?

### Pancreatic Cancer Surgery + Whipple Procedure

`pancreatic-cancer-surgery.html` - sections flagged: `#condition`, `#symptoms`, `#diagnosis`,
`#treatment`, `#surgery`, `#whipple`, `#whipple-anatomy`, `#whipple-steps`, `#whipple-who`,
`#recovery`, `#faq`

Headings:

- What is pancreatic cancer?
- Possible symptoms of pancreatic cancer (including the note that these symptoms have many causes)
- Diagnosis and evaluation
- Pancreatic cancer treatment
- Surgical evaluation and options
- Whipple Procedure / Pancreaticoduodenectomy - what the operation is, why it may be recommended,
  which part of the pancreas is involved, what the operation involves
- What happens during a Whipple procedure? - the list of what may be removed and what is rebuilt,
  and the illustration `images/whipple-anatomy.svg`, which was drawn for this page and shows the
  head of the pancreas, the duodenum, the gallbladder and the lower bile duct as the resected block
- From assessment to recovery - the five stages of the Whipple pathway
- When may a Whipple procedure be considered? - including the statement that not every pancreatic
  cancer patient requires the operation
- After the Whipple procedure - recovery, nutrition, enzymes, blood sugar, follow-up, ongoing
  cancer care, and the paragraph that declines to promise a recovery period
- Why consult our pancreatic surgery specialist?
- Meet our pancreatic surgery specialist
- Your pathway, stage by stage
- Consultation and surgery locations
- Questions people ask before booking
- Book a pancreatic cancer consultation

FAQ questions:

- What is pancreatic cancer?
- Is pancreatic cancer always inoperable?
- What is the Whipple procedure?
- Why is the Whipple procedure performed?
- What part of the pancreas is involved in a Whipple procedure?
- Is every pancreatic cancer patient a candidate for Whipple surgery?
- How is pancreatic cancer evaluated?
- What happens during the first consultation?
- How is the treatment plan decided?
- Why might chemotherapy be given before surgery?
- Can pancreatic surgery be done by keyhole or robotic techniques?
- What should I expect after Whipple surgery?
- Will I become diabetic after pancreatic surgery?
- How long does recovery take?
- What should I bring to my consultation?
- Can I send my reports before travelling?

Note for the reviewer: the surgical expertise section (`#expertise`) is not flagged, because it
lists only procedures already stated in the surgeon's verified profile. Tell us if any entry there
should not be advertised.

### Gallbladder Cancer Surgery

`gallbladder-cancer-surgery.html` - sections flagged: `#condition`, `#symptoms`, `#diagnosis`, `#treatment`, `#surgery`, `#faq`

Headings:

- Understanding gallbladder cancer
- When should you seek medical evaluation?
- How the diagnosis is reached
- Treatment options
- Surgical options
- What this unit brings to gallbladder cancer surgery
- Meet your surgeon
- What happens, in order
- Consultation and surgery locations
- Questions people ask before booking
- Book a consultation with our surgical team

FAQ questions:

- Do gallstones cause gallbladder cancer?
- How is gallbladder cancer diagnosed?
- Cancer was found after my gallbladder was removed. What now?
- Is a simple gallbladder removal enough?
- Is chemotherapy needed as well as surgery?
- Can the surgery be done laparoscopically?
- What should I bring to my consultation?

## Also awaiting approval (not clinical)

- Medical disclaimer wording, repeated at the foot of every landing page.
- `privacy-policy.html` and `terms.html` - both describe what the site actually does,
  but the final wording is for Advitya Healthcares to approve.

## Added since this list was generated

### Pancreas specialist profile

`pancreas-specialist.html` - sections flagged: `#specialisation`, `#surgery`, `#conditions`, `#journey`,
plus the areas-of-expertise list in the profile.

The credentials on that page are reproduced from `our-team.html`,
`the-story-of-pancreacare.html` and the landing pages. Years in practice,
registration number, memberships, publications and languages are left as
marked placeholders (`data-assets-pending="doctor-profile-details"`), as is the
question of whether pancreatic neuroendocrine tumours should be listed
(`data-assets-pending="conditions-list"`).

### Hernia types

`hernia-surgery.html` - a `#types` section was added (inguinal, umbilical and
paraumbilical, incisional, femoral, epigastric, recurrent). Six short
descriptions, all needing the same review as the rest of that page.
