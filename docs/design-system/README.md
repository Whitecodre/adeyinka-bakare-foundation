# ABF Design System

One shared look for every page, so the site stays consistent no matter who builds it.
Everything here is derived from what is **already implemented** (`src/app/globals.css`,
`components/ui`, the homepage and the layout). Nothing here replaces the existing look.

## Files in this folder
| File | What it covers |
|---|---|
| [foundations.md](foundations.md) | Colour, typography, spacing, radius, shadow, motion, accessibility |
| [components.md](components.md) | Every component: existing ones, rules for using them, and new ones to build |
| [about-page.md](about-page.md) | Design and rationale for the About page |
| [index.html](index.html) | **Interactive** visual reference: colour (click to copy), type, buttons, motion lab, searchable icon gallery, device-size tester |
| [about-preview.html](about-preview.html) | **Interactive** mock of the About page (scroll, hover, tap; responsive) |
| `ds.css`, `ds.js`, `icons.js` | Support files for the two HTML previews only (not used by the app). `icons.js` is generated from the app's own `lucide-react`. Keep all files in the same folder. |

**To view:** double-click `index.html`, or run `start docs\design-system\index.html`. No server needed.

## Principles
1. **Credible first.** ABF's problem is trust (see the proposal). Calm layouts, real content, no gimmicks.
2. **Warm and student-friendly.** Cream backgrounds, maroon for action, gold for highlights.
3. **Mobile first.** Design at 375px wide, then enhance. Most visitors are on phones.
4. **Tokens, not hex.** Use `bg-primary`, `text-foreground`, `text-muted-foreground`. Never write `#aa322b` or `text-gray-600` in new code.
5. **Reuse before you build.** Check [components.md](components.md) first. If a component exists, use it. If you need a new one, add it there first.
6. **Content from the constitution only.** No invented facts, numbers or history.
7. **Icons are Lucide only.** Same library as the homepage (`lucide-react`). Never emoji, never system or Windows-native icons: they look different on every device.
8. **Interactive and alive, but responsive first.** Pages use scroll reveals, hover and tap feedback, and expandable content (see foundations.md, section 5). Every component must work at 375px with no horizontal scroll, and effects needing a mouse (tilt, magnetic) are desktop-only.
9. **Server by default.** Pages are Server Components. Add `"use client"` only to the small piece that needs state or animation.

## Rules every component follows
- Lives in `components/ui` (generic building block) or `components/public` / `components/admin` (ABF-specific).
- Styles with Tailwind utilities and the `cn()` helper from `lib/utils`.
- Variants use `cva` (class-variance-authority), like `Button` and `Badge`.
- Accepts `className` so callers can adjust spacing without editing the component.
- Has typed props. No `any`.
- Is keyboard-usable and has a visible focus ring (`focus-visible:ring-ring`).

## Known inconsistencies to clean up (not yet fixed)
| Where | Problem | Fix |
|---|---|---|
| `config/brand.ts` | Says blue and amber, which is not the ABF palette | Update to the maroon and gold below, or delete if unused |
| `components/public/hero.tsx` | Blue gradient hero, unused and off-brand | Delete, or replace with `PageHero` |
| `components/homepage/*` | Hardcoded `#aa322b`, `text-gray-*` | Swap for tokens during the next edit of each file |
| `@theme` in `globals.css` | `abf-maroon-*` and `abf-gold-*` exist as CSS variables but have no Tailwind utilities | Add `--color-maroon-*` / `--color-gold-*` (see foundations.md, "Implementation to-do") |
| `components/public/navbar-zyng-style.tsx` | Second navbar, unused | Delete |
| `components/public/*-card.tsx` | Use raw `<img>` and `text-gray-600` | Move to `next/image` and tokens |
