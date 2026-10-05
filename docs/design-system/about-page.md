# About Page Design (`/about`)

File to build: `src/app/(public)/about/page.tsx` (Server Component).
Visual mock: [about-preview.html](about-preview.html).
All copy below comes from the constitution (`docs/ABF_Details.md`). Items marked **NEEDS ABF** are not in any document and must be supplied. Do not invent them.

## 1. The design approach

**Type of design: an editorial "story and trust" page.** A single, calm, long-scroll page that reads like a well-organised magazine feature, not a dashboard.

Why:
- **Purpose.** The proposal says the About page's job is trust ("builds long-term trust, helps ABF stand apart from similarly named organisations"). Trust comes from clarity, real content and visible structure, not flashy effects.
- **Audience.** A first-year student on a phone, or a sponsor checking ABF is real. Both want to answer "who are they, what do they stand for, what can I get, who runs it" quickly.
- **Brand.** Cream backgrounds, serif headings (Libre Baskerville) and maroon accents already give the site a warm, scholarly tone. Editorial layout suits that.
- **Rhythm.** Alternate light, tinted and one dark band so the long page never feels monotonous, and so each section is clearly separate when scrolling on a phone.
- **Restraint.** The homepage already has the big animation. The About page uses only the standard gentle fade-up.

Layout principle: **one idea per band, one headline per band, and every band is built from the same `Section` + `SectionHeading`**.

## 2. Page structure (top to bottom)

| # | Band | Tone | Purpose |
|---|---|---|---|
| 1 | **PageHero** | soft maroon-50 gradient | Say what this page is |
| 2 | **Who we are** | default | Introduce ABF and its values |
| 3 | **Vision and Mission** | tint | The core statements |
| 4 | **Objectives** | default | What ABF sets out to do |
| 5 | **The ABF journey** (programmes by level) | tint | What's in it for me, 100L to 400L |
| 6 | **Membership** | default | Who can join and what members get |
| 7 | **Leadership** | tint | Who runs it (roles) |
| 8 | **Governance and transparency** | default | Proof it's legitimate |
| 9 | **CTA banner** | dark maroon | The next step |

Eight content bands plus a CTA is deliberate. Phones scroll easily; each band is short. If time is short, build bands 1, 2, 3, 5, 9 first; add the rest after.

## 3. Band by band

### 1. PageHero
- Eyebrow: `About ABF`
- H1: **Who we are**
- Lead: "The Adeyinka Bakare Fellowship exists to empower students through scholarships, mentorship, career development, and collaborative learning." *(constitution, preamble)*
- No buttons here. Keep it quiet.

### 2. Who we are
- Layout: two columns on desktop (text left, an `OfficialNotice` and logo card right); stacked on mobile.
- Text (paraphrase the preamble): ABF is a student association of the Department of Information Technology, University of Ilorin, "united by a commitment to academic excellence, leadership, integrity, innovation, and service."
- **Values strip** with five `ValueChip`s: Academic excellence · Leadership · Integrity · Innovation · Service. *(preamble)*
- `OfficialNotice`: "The name is Adeyinka Bakare Fellowship, also referred to as ABF Fellowship." *(Article 1)*. This also quietly addresses similarly named organisations, as the proposal suggests.
- **NEEDS ABF:** how and when ABF began, and who founded it. Show a clearly marked "Our history" placeholder only in development; **remove it before launch rather than invent it.**

### 3. Vision and Mission
- Layout: **Vision** as a large `QuoteBlock` (serif, gold left border); **Mission** as five `FeatureCard`s (icon + short line) in a 2 or 3 column grid. Use the constitution's exact wording.
- Vision: "To support intentional undergraduate students of the Department of Information Technology with a strong commitment to learning and good character through its fellowship programme, enabling them to achieve academic success, complete their studies at the University and prepare them for their career pursuits."
- Mission, five points: need-based and merit-based scholarships and grants · mentorship and career development · a supportive academic and professional community · leadership, innovation and lifelong learning · connecting members with opportunities for growth and impact.
- *Note:* the homepage currently labels the vision text as "Our Mission". Per Article 2, that sentence is the **Vision**. Fix it on the homepage when touched.

### 4. Objectives
- Six `NumberedItem`s in a 2 or 3 column grid: (1) support deserving IT students through scholarships, (2) establish a mentorship programme, (3) promote networking among students and professionals, (4) develop leadership skills, (5) encourage innovation and collaboration, (6) build career-focused clusters for specialised learning.
- Numerals in a maroon circle, serif title, no body text needed.

### 5. The ABF journey (programmes by level)
- Layout: four `LevelStep`s in a row on desktop (connected by a thin line), vertical stack on mobile. Reads as a journey through university.
  - **100 Level:** Need-Based Scholarship
  - **200 Level:** Need-Based and Merit-Based Scholarship
  - **300 Level:** Internship Programme
  - **400 Level:** Mentorship Programme (career guidance, professional development, leadership coaching, CV and interview preparation, networking, industry mentorship)
- Footer link: `Button variant="outline"` to `/programmes` ("Explore all programmes").
- Note: the current homepage shows 200 Level as merit-only; the constitution (Article 5.2) says both. Keep both pages identical by sharing one data array (`config/programme-levels.ts`) later.

### 6. Membership
- Layout: two columns. Left: **Who can join**, an `EligibilityList`: registered University of Ilorin student · registered student of any level in the Department of Information Technology · registered with the Fellowship through the registration link. Right: **Membership categories** (Active, Executive, Alumni as three small cards) and **What members get** (treated fairly and respectfully; vote and contest executive positions; take part in programmes; access opportunities; mentorship support).
- Button: `Join the Fellowship` to `/get-involved`.

### 7. Leadership
- Six `RoleCard`s: President, General Secretary, Public Relations Officer, Financial Secretary, Cluster Coordinator, Designer. Each has a one-line description from Article 4.1 (for example, President: "Chief leader; ensures the vision and goals are met.").
- Names and photos: **NEEDS ABF** (current executives). Build `RoleCard` with optional `name` and `photo`, so it works now with roles only and fills in later (the `members` table already exists in the schema).
- Short line under the grid: executives are elected or appointed through a screening, interview and selection process (Article 4.3).

### 8. Governance and transparency
- Layout: three compact cards with an icon each.
  1. **Finance:** funds come from sponsors, alumni, partners and well-wishers, are used solely for ABF's objectives, and every expenditure is approved before it is paid; records are kept and reported to the Executive Council and members (Article 6).
  2. **Fair process:** a written disciplinary code, with the right to be heard and to appeal within seven days (Article 7).
  3. **Constitution:** ABF is governed by a written constitution, and anyone can read it. Link: a "Read the constitution" `Button variant="outline"`. **To do:** copy the PDF into `public/` (for example `public/documents/abf-constitution.pdf`) so it can be linked. **Ask ABF** for permission to publish it first.
- Why this band matters: it is the strongest answer to "is ABF real?"

### 9. CTA banner
`CTABanner`: "Ready to be part of ABF?" Primary: Join the Fellowship → `/get-involved`. Secondary: Contact us → `/contact`.

## 3b. Interaction and icons per band
Open `about-preview.html` to try all of this.

| Band | Interaction | Icons (Lucide) |
|---|---|---|
| Hero | Words animate in; blobs float and follow the mouse; scroll cue bobs | `ChevronDown` |
| Who we are | Slides in from the sides; chips pop on hover; logo card tilts | `BookOpen`, `Crown`, `ShieldCheck`, `Lightbulb`, `Heart`, `BadgeCheck` |
| Values strip | Slow marquee, pauses on hover | `Star` |
| Vision and Mission | Gold-to-maroon bar draws down the vision quote; mission cards stagger in and tilt | `GraduationCap`, `Compass`, `Users`, `Lightbulb`, `Sprout` |
| Objectives | Cards stagger in and lift; numerals fill and spin on hover | none (numerals) |
| Journey | **Line fills as you scroll and stages light up in turn; tap a stage to read its eligibility** | `Wallet`, `Award`, `Briefcase`, `Compass`, `Check` |
| Membership | Tabs with a sliding indicator: Who can join / Categories / Your rights / Your part | `Check`, `ArrowRight` |
| Leadership | Role accordion: tap to see each role's duties | `Crown`, `PenLine`, `Megaphone`, `Wallet`, `Network`, `Palette` |
| Governance | Accordion, one open at a time | `Landmark`, `Scale`, `ScrollText`, `FileText` |
| CTA | Magnetic primary button with shine; floating blobs | `ArrowRight`, `Mail` |
| Whole page | Progress bar; back-to-top; section dots (desktop) | `ArrowUp` |

Membership "rights" and "responsibilities" come from Article 3.4 and 3.5; role duties from Article 4.1; programme eligibility from Article 5.2; finance and discipline from Articles 6 and 7.

## 4. Responsive behaviour
The page is designed at 375px first and checked at 375, 768 and 1100+. Rules: no horizontal scroll; tap targets at least 44px; mouse-only effects are disabled on touch; the navbar becomes a full-screen menu under 900px; grids go 1 column, then 2, then 3. Use the device switcher in `index.html` > "Responsive" to test.
| Band | Mobile (under 768px) | Desktop (768px and up) |
|---|---|---|
| Hero | Centred, `text-4xl` | `text-5xl`, more padding |
| Who we are | Stacked | Two columns |
| Vision and Mission | Quote, then cards stacked | Quote full width, cards in 3 columns |
| Objectives | 1 column | 2 to 3 columns |
| Journey | Vertical timeline | Horizontal, 4 steps |
| Membership | Stacked | Two columns |
| Leadership | 1 column (2 at `sm`) | 3 columns |
| Governance | Stacked | 3 columns |

## 5. Technical notes (for the build)
- `page.tsx` is a Server Component with `export const metadata` (title "About ABF | Adeyinka Bakare Fellowship", plus a meta description) for SEO.
- Only `Reveal` (and nothing else) is a client component.
- Static content: no database call needed. Keep it in typed arrays at the top of the page file or in `config/`.
- One `h1`, then `h2` per band, `h3` for cards.
- Build the Section B and C components **first** (see [components.md](components.md)); the page is then mostly composition.

## 6. Open questions for ABF / your partner
1. Founding story and date? (Not in the constitution)
2. Names and photos of current executives? Are they allowed to be published?
3. May the constitution PDF be linked publicly?
4. Real impact figures (scholarships awarded, members) for the stats? None are in the docs.
