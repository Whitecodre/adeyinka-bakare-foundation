# Foundations

Source of truth: `src/app/globals.css`. If this file and the CSS disagree, the CSS wins. Fix this file.

## 1. Colour

### Brand palette (CSS variables)
**Maroon** is the ABF brand colour. Use it for actions, links and key headings.

| Token | Hex | Typical use |
|---|---|---|
| `--abf-maroon-50` | `#fbf4f1` | Tinted section background |
| `--abf-maroon-100` | `#f6e3dd` | Icon tile background, soft text on dark maroon |
| `--abf-maroon-200` | `#ebc3b9` | Decorative blobs, borders |
| `--abf-maroon-300` | `#d88f7f` | Decorative only |
| `--abf-maroon-400` | `#c45d4f` | Hover on light surfaces |
| `--abf-maroon-500` | `#aa322b` | **Primary brand colour** (buttons, links) |
| `--abf-maroon-600` | `#922821` | Primary hover, headings |
| `--abf-maroon-700` | `#73201c` | Dark gradient end, pressed |
| `--abf-maroon-800` | `#551a18` | Dark surfaces |
| `--abf-maroon-900` | `#3b1314` | Darkest |

**Gold** is the accent. Use it sparingly for highlights, badges and decoration.

| Token | Hex | Typical use |
|---|---|---|
| `--abf-gold-50` | `#fff9eb` | Soft highlight background |
| `--abf-gold-100` | `#fff0c6` | Page background glow |
| `--abf-gold-200` | `#ffe08a` | Decorative blobs |
| `--abf-gold-300` | `#f8c84d` | Accent fills |
| `--abf-gold-400` | `#efb11f` | **Accent colour** (secondary button, highlights) |
| `--abf-gold-500` to `900` | `#d9960d` to `#4d3310` | Darker accents; `gold-700` or darker is the only gold safe for text |

**Neutrals:** `--abf-cream #fffdf8` (page), `--abf-sand #f8f2e8` (page gradient end), `--abf-ink #2d1816` (text).

### Semantic tokens (what you actually write in components)
Defined as HSL components in `:root` and mapped to Tailwind in `@theme inline`.

| Tailwind class | Meaning | Light value |
|---|---|---|
| `bg-background` / `text-foreground` | Page and body text | cream / dark maroon-ink |
| `bg-card` / `text-card-foreground` | Cards | white |
| `bg-primary` / `text-primary-foreground` | Main action | maroon / white |
| `bg-secondary` / `text-secondary-foreground` | Accent action | gold / ink |
| `bg-muted` / `text-muted-foreground` | Quiet surfaces, secondary text | sand / warm grey |
| `bg-accent` / `text-accent-foreground` | Hover and soft highlight | pale gold / ink |
| `bg-destructive` | Delete, errors | red |
| `border-border`, `border-input`, `ring-ring` | Borders, fields, focus ring | warm grey, warm grey, gold |

A `.dark` set exists in the CSS (gold becomes the primary). Dark mode is **not a launch requirement**; do not design for it yet.

### Rules
- **Text colours:** body `text-foreground`; secondary `text-muted-foreground`; links and eyebrows `text-primary`. Never `text-gray-*`.
- **Gold is never used as text colour on light backgrounds** (about 1.9:1 contrast, fails). Use it for fills and decoration only. Text on gold is `text-secondary-foreground` (ink).
- **White on maroon-500 or darker** passes WCAG AA (about 7:1). White on maroon-400 or lighter does not.
- **One strong colour per section.** A maroon CTA band, or a gold highlight, not both fighting.
- **Brand gradient** (hero text, CTA band, icon tiles): `from-maroon-500 via-maroon-600 to-maroon-700`.

## 2. Typography
Fonts are loaded in `src/app/layout.tsx`.

| Role | Font | Where |
|---|---|---|
| Display (headings) | **Libre Baskerville** (serif), 400 and 700 | `h1` to `h4` automatically, via `--font-display` |
| Body and UI | **Manrope** (sans) | everything else |

Headings get `letter-spacing: -0.02em` and body paragraphs `line-height: 1.75` from `globals.css`. You get these for free.

### Type scale (mobile, then `md:` and up)
| Style | Classes | Use |
|---|---|---|
| Display | `text-4xl md:text-6xl font-bold` | Homepage hero only |
| Page title (H1) | `text-4xl md:text-5xl font-bold` | One per page |
| Section title (H2) | `text-3xl md:text-4xl font-bold` | Section headings |
| Card title (H3) | `text-xl font-semibold` | Cards, list items |
| Lead paragraph | `text-lg md:text-xl text-muted-foreground` | Intro under a heading |
| Body | `text-base` | Default |
| Small / meta | `text-sm text-muted-foreground` | Dates, captions |
| Eyebrow | `text-xs font-semibold uppercase tracking-[0.2em] text-primary` | Small label above a heading |

Rules: one `h1` per page; do not skip heading levels; keep line length to about 65 characters (`max-w-prose` or `max-w-3xl`).

## 3. Layout and spacing
- **Container:** `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` for wide content; `max-w-3xl` or `max-w-4xl` for reading text.
- **Section spacing:** `py-16 md:py-24`. The homepage uses `py-24`; use `py-16` on mobile.
- **Gaps:** cards `gap-6`; text stacks `space-y-4`; heading to content `mb-12`.
- **Grid:** 1 column on mobile; `md:grid-cols-2` or `md:grid-cols-3`; `lg:grid-cols-4` only for small items.
- **Breakpoints (Tailwind default):** `sm 640`, `md 768`, `lg 1024`, `xl 1280`. The navbar switches at `md`.
- **Navbar offset:** the public layout already adds `pt-[72px]` to `main`. A page hero should add its own top padding on top of that.
- Use a 4px spacing rhythm (Tailwind's scale). Avoid arbitrary values like `mt-[13px]`.

## 4. Shape and depth
| Token | Value | Use |
|---|---|---|
| `rounded-md` | radius minus 2px (6px) | Buttons, inputs |
| `rounded-xl` | 12px | Cards (`Card` default) |
| `rounded-2xl` | 16px | Feature cards, logo, big tiles |
| `rounded-full` | pill | Navbar buttons, badges when pill-shaped |
| `shadow` | subtle | Cards at rest |
| `hover:shadow-xl` | strong | Card hover |
| `shadow-lg shadow-primary/30` | tinted | Primary CTA buttons |
| `.glass`, `.glass-card` | blur and translucent white | Floating surfaces over imagery (use sparingly) |

## 5. Motion and interaction
The goal is a site that feels alive and rewards scrolling, without hurting speed or accessibility. Open `index.html` > "Motion lab" to try each effect.

| Effect | Where | Notes |
|---|---|---|
| Scroll progress bar | Top of every page | Gold to maroon, 3px |
| Reveal on scroll (fade up, staggered) | Every section | `Reveal` component |
| Headline word-by-word entrance | Page hero | Short titles only |
| Floating gradient blobs + mouse parallax | Heroes, CTA | Parallax: mouse only |
| Floating navbar that shrinks on scroll | Desktop | Already built |
| Full-screen mobile menu, items slide in | Under 900px | **Missing in the real navbar; build it** |
| Card tilt + cursor-following gold spotlight | Feature cards | Mouse only |
| Lift + shadow on hover, icon tile spins | Cards | |
| Button shine sweep, press ripple, arrow nudge | All buttons | |
| Magnetic primary buttons | Main CTAs | Mouse only |
| Sliding-indicator tabs | Membership | Radix Tabs |
| Smooth accordion | Leadership, governance | Needs Radix Accordion |
| Scroll-driven timeline + clickable steps | Programme journey | |
| Marquee strip | Between bands | Pauses on hover; decorative (`aria-hidden`) |
| Section dots (scroll-spy) | Desktop, 1180px and up | Long pages only |
| Back-to-top button | After 600px of scroll | |
| Toast | Small confirmations | |

**Rules**
- Animate only `opacity` and `transform` (fast, no layout jank). Each effect under about 1 second; use the `--ease` curve `cubic-bezier(.16,1,.3,1)`.
- **Touch and mouse:** effects that need a pointer (tilt, magnetic, parallax) only run under `@media (hover:hover) and (pointer:fine)`. On phones, tap feedback (ripple, accordion, tabs) replaces them.
- **Reduced motion:** everything switches off and content is simply visible (`prefers-reduced-motion`).
- **Keyboard:** tabs use arrow keys; accordions are real `<button>`s with `aria-expanded`; focus ring stays visible.
- **No animation on important text until read.** Content always exists in the server HTML.
- Tap targets at least 44px tall.

### Implementation
- Library: `framer-motion`. Components that use it need `"use client"`.
- **Standard entrance:** fade up, `initial={{ opacity: 0, y: 30 }}` to `{ opacity: 1, y: 0 }`, `duration 0.5 to 0.8`, `viewport={{ once: true }}`.
- **Stagger:** `delay: index * 0.1`.
- **Hover:** `transition-shadow`, `group-hover:translate-x-1` on arrows.
- Respect reduced motion (the CSS utilities already do; for framer-motion use `useReducedMotion`).
- **Never hide content until JavaScript runs.** Content must be in the server HTML (this was the homepage SEO bug). Animate opacity from 0 to 1; do not render `null`.
- Wrap animation in a small `Reveal` component (see components.md) so pages stay Server Components.

## 6. Icons and images
- **Icons: `lucide-react` only**, the same library the homepage uses. **Never emoji or system/Windows-native icons**; they render differently on every device. Icons never carry meaning alone; add text.
  - Size: `size-5` inline, `size-6` inside an `IconTile`. Colour comes from the text colour (`text-primary`, `text-white` on tiles).
  - Already used in the code, so reuse these first: **homepage** `GraduationCap`, `Users`, `Target`, `Briefcase`, `Award`, `BookOpen`, `TrendingUp`, `Zap`, `ArrowRight`; **ui kit** `Check`, `ChevronDown`, `ChevronUp`, `ChevronRight`, `Circle`, `X`.
  - Meaning map: scholarships `GraduationCap` or `Wallet` · mentorship `Compass` · community `Users` · innovation `Lightbulb` · growth `Sprout` · leadership `Crown` · integrity `ShieldCheck` · service `Heart` · programmes `Briefcase` · finance `Landmark` · fairness `Scale` · documents `ScrollText` or `FileText` · contact `Mail` · official `BadgeCheck`.
  - `index.html` > "Icons" has a searchable gallery; click an icon to copy its import.
  - Known leftovers to replace: the 📍 emoji in `event-card.tsx` becomes `MapPin`.
- Images: `next/image` with `alt` text always; real ABF photos once supplied, no stock-photo claims about beneficiaries. Remote hosts must be allowed in `next.config.ts`.
- Logo: `/brand/logo.png` (rounded corners `rounded-lg` or `rounded-2xl`).

## 7. Accessibility checklist (every page)
- [ ] One `h1`; headings in order
- [ ] Text contrast at least 4.5:1 (3:1 for large text)
- [ ] All images have meaningful `alt` (or `alt=""` if decorative)
- [ ] Everything works with keyboard; focus ring visible
- [ ] Tap targets at least 40px on mobile
- [ ] Page works at 375px wide with no horizontal scroll
- [ ] Links say where they go ("View programmes", not "Click here")

## 8. Implementation to-do (small code changes this system assumes)
Add to `@theme inline` in `globals.css` so the brand scales get utilities (`bg-maroon-500`, `text-gold-700`):
```css
@theme {
  --color-maroon-50: var(--abf-maroon-50);
  /* ...repeat 100 to 900 */
  --color-gold-50: var(--abf-gold-50);
  /* ...repeat 100 to 900 */
  --color-cream: var(--abf-cream);
  --color-sand: var(--abf-sand);
  --color-ink: var(--abf-ink);
}
```
Until then, use `primary` / `secondary` tokens, which already cover maroon-500 and gold-400.
