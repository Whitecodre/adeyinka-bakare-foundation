# Component Catalogue

Status key: **Built** (exists in the repo) · **Build** (new, spec below, not yet in the repo).

**Built for the About page (October 2026):** `Section`, `SectionHeading`, `PageHero`, `Reveal`, `CTABanner`, `IconTile`, `FeatureCard`, `NumberedItem`, `Marquee`, `JourneyTimeline`, `Accordion` (`ui/accordion.tsx`, framer-motion, no new dependency). Files are in `components/public/` and `components/ui/`. Still to build: MobileMenu, ScrollProgress, BackToTop, TiltCard, SectionDots, Toast, and the other content components below.
Rule: before creating a component, check this list. After creating one, change its status here.
Import with the `@/` alias, for example `import { Button } from "@/components/ui/button"`.

---

## A. Primitives (`components/ui`): Built
Generic, unbranded building blocks (shadcn/ui style, using Radix for behaviour).

| Component | File | Variants / parts | Use for |
|---|---|---|---|
| **Button** | `button.tsx` | `variant`: default, secondary, outline, ghost, link, destructive · `size`: sm, default, lg, icon · `asChild` | All actions and CTA links |
| **Badge** | `badge.tsx` | `variant`: default, secondary, outline, destructive | Labels such as programme level, status |
| **Card** | `card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter | Any boxed content |
| **Input** | `input.tsx` | n/a | Single-line text fields (admin) |
| **Textarea** | `textarea.tsx` | n/a | Multi-line text (admin) |
| **Label** | `label.tsx` | n/a | Field labels |
| **Select** | `select.tsx` | Select, SelectTrigger, SelectContent, SelectItem... | Dropdown choice |
| **Switch** | `switch.tsx` | n/a | On/off setting |
| **Dialog** | `dialog.tsx` | Dialog, DialogContent, DialogHeader, DialogTitle... | Modals |
| **DropdownMenu** | `dropdown-menu.tsx` | standard Radix parts | Row actions, user menu |
| **Tabs** | `tabs.tsx` | Tabs, TabsList, TabsTrigger, TabsContent | Switching views |
| **Table** | `table.tsx` | Table, TableHeader, TableRow, TableCell... | Tabular data |
| **Avatar** | `avatar.tsx` | Avatar, AvatarImage, AvatarFallback | People and initials |
| **Separator** | `separator.tsx` | n/a | Divider lines |
| **ScrollArea** | `scroll-area.tsx` | n/a | Scrollable panels |

### Usage rules for primitives
- **One primary button per section.** The rest are `outline` or `ghost`.
- **Primary CTA** (Join, Apply): `<Button size="lg">`; on dark maroon use `className="bg-white text-primary hover:bg-white/90"`.
- Link-styled buttons: `<Button asChild><Link href="/x">Label</Link></Button>`. Do **not** wrap a `<Button>` inside a `<Link>` (it nests interactive elements; the homepage currently does this and should be fixed when touched).
- Don't override colours with hex. If you need a variant that doesn't exist (for example a brand-gradient button), **add a variant to `button.tsx`**, so every page gets it.
- **Cards:** default surface is `Card`. Hover lift is `hover:shadow-xl transition-shadow` on interactive cards only.

---

## B. Layout building blocks: Build
New small components every public page will use. They are the backbone of consistency: if every page uses `Section` and `SectionHeading`, spacing and type stay identical.

Location: `components/public/`

### `Section`
Wraps one band of a page.
```ts
interface SectionProps {
  tone?: "default" | "tint" | "dark";   // default: page bg · tint: bg-maroon-50/muted · dark: maroon gradient, white text
  width?: "wide" | "prose";             // wide: max-w-7xl · prose: max-w-3xl
  id?: string;                          // for anchor links
  className?: string;
  children: React.ReactNode;
}
```
Renders `<section>` with `py-16 md:py-24` and the container classes from foundations.md.

### `SectionHeading`
```ts
interface SectionHeadingProps {
  eyebrow?: string;          // small uppercase label
  title: string;             // renders <h2>
  description?: string;      // lead paragraph
  align?: "left" | "center"; // default center
  tone?: "default" | "inverse"; // inverse = white text on dark sections
}
```

### `PageHero`
The top of every inner page (About, Programmes, Events, and so on). Smaller and calmer than the homepage hero.
```ts
interface PageHeroProps {
  eyebrow?: string;
  title: string;             // the page's one <h1>
  description?: string;
  children?: React.ReactNode; // optional buttons
}
```
Look: soft gradient background (maroon-50 to cream), faint gold blob, centred text, `pt-16 pb-12 md:pt-24 md:pb-16`. Not full-screen.

### `Reveal`
Client component (`"use client"`) wrapping children in the standard fade-up from foundations.md, with `delay?: number`. Lets pages stay Server Components while still animating. Content must render on the server (no `mounted` check).

### `CTABanner`
The maroon gradient "Ready to join?" band, extracted from `components/homepage/cta-section.tsx`.
```ts
interface CTABannerProps {
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}
```
Then the homepage and every other page use the same banner.

---

## C. Content components: Build
Reusable content patterns. Each takes plain props so data can later come from Supabase.

| Component | Props (summary) | Used for |
|---|---|---|
| **IconTile** | `icon: LucideIcon`, `size?: "sm" \| "md"` | The maroon gradient rounded square holding an icon (already repeated in mission and feature sections) |
| **FeatureCard** | `icon`, `title`, `description` | Pillars, offerings, values (replaces the inline card in `mission-section.tsx`) |
| **ValueChip** | `label` | Pill for short values: Excellence, Leadership, Integrity, Innovation, Service |
| **StatBlock** | `value`, `label` | Big number with caption. **Only with verified numbers.** |
| **NumberedItem** | `number`, `title`, `description?` | Objectives list |
| **LevelStep** | `level` (e.g. "100 Level"), `programme`, `description`, `href?` | One step of the 100L to 400L programme journey |
| **RoleCard** | `role`, `description`, `name?`, `photo?` | Executive officer. Name and photo are optional, since the constitution gives roles only |
| **EligibilityList** | `items: string[]` | Check-marked list of requirements |
| **QuoteBlock** | `text`, `source?` | Vision statement and testimonial pull-quotes |
| **SocialLinks** | `links: {label, href, icon}[]` | WhatsApp, TikTok, Instagram, X (navbar-adjacent and footer) |
| **OfficialNotice** | `children` | Small "This is the official ABF site" note (proposal suggestion, for look-alike orgs) |

### Interactive components: Build
| Component | Notes |
|---|---|
| **MobileMenu** | Full-screen slide-in menu under 900px with a hamburger `Menu` / `X` icon; items stagger in; closes on link tap or Escape. **The current Navbar has no mobile menu, so this is the top gap.** |
| **ScrollProgress** | 3px gold-to-maroon bar at the top. Client component. |
| **BackToTop** | Round maroon button, appears after 600px. |
| **TiltCard** | `Card` wrapper: tilt + gold spotlight on mouse only. Wrap, don't fork `Card`. |
| **Accordion** | Not in `ui/` yet. Add via shadcn (`@radix-ui/react-accordion`). Smooth open/close, one or many open. |
| **JourneyTimeline** | Vertical on mobile, horizontal on desktop; the line fills as you scroll; each step is a button that shows its detail card. Data comes from `config/programme-levels.ts`. |
| **Marquee** | Decorative scrolling strip of values. `aria-hidden`, pauses on hover. |
| **SectionDots** | Desktop-only scroll-spy dots. Optional. |
| **Toast** | `hooks/use-toast.ts` already exists; add the visual component. |

`Tabs` already exists in `ui/tabs.tsx`; add the sliding-indicator styling to it rather than writing a new one.

---

## D. Existing public components (`components/public`)
| Component | Status | Notes |
|---|---|---|
| **Navbar** | Built | Floating pill that shrinks on scroll. Uses hex colours; switch to tokens when next edited. Only shows the first 5 nav items on desktop. Mobile has **no menu** yet, so this is a gap to fill. |
| **Footer** | Built | Uses tokens (good). Add `SocialLinks` and `OfficialNotice`. |
| **ProgrammeCard** | Built | Needs `next/image`; the arrow link style (`font-medium text-primary`) is the standard card link. |
| **BeneficiaryCard** | Built | Same. Show `programme` as a `secondary` Badge. |
| **EventCard** | Built | Date as an `outline` Badge. Replace the 📍 emoji with a lucide `MapPin`. |
| **NewsCard** | Built | Same. |
| **TestimonialCard** | Built | Fix unescaped quotes (lint). |
| **Hero** | Built, **off-brand** | Blue gradient. Delete; use `PageHero`. |
| **navbar-zyng-style** | Built, **unused** | Delete. |

### Card standard (all four content cards)
`Card` + optional top image (`h-48 object-cover`) + `CardContent p-6` (meta, `h3 text-xl font-semibold`, 2 to 3 line description with `line-clamp`) + `CardFooter` with the "Verb →" link. Cards in a grid use `gap-6`.

---

## E. Homepage sections (`components/homepage`): Built
HeroSection, StatsSection, FeatureCardsSection, MissionSection, ProgrammesSection, CTASection. They are client components (framer-motion). When refactoring, extract their repeated pieces into the Section C components (IconTile, FeatureCard, CTABanner), but only when a second page needs it.

---

## F. Admin components (`components/admin`): Built
`AdminHeader`, `Sidebar`, `PageHeader` (title, subtitle, actions), `DashboardCard` (title, value, trend), `DataTable` (headers, rows), `EmptyState` (title, description, action), `ConfirmDialog`, `LoadingState`. These are functional stubs. Restyle them with the same tokens when the admin is built. Admin is not a launch priority before the public pages.

---

## G. States every data-driven component must handle
| State | Component |
|---|---|
| Loading | `LoadingState` (admin) or a skeleton (`animate-pulse`, `bg-muted`) |
| Empty | `EmptyState`. Public copy should be encouraging ("New stories coming soon") |
| Error | Next.js `error.tsx` per route, plus a plain message |

---

## H. How to add a component (checklist)
1. Is there an existing one? Search this file and `components/`.
2. Pick the folder: generic goes in `ui/`; ABF-specific goes in `public/`.
3. Write typed props (interface above the component). No `any`.
4. Use tokens and `cn()`. Accept `className`.
5. Server Component unless it needs state or motion.
6. Add it to this catalogue and, if visual, to `index.html`.
