# Admin Dashboard Design System

The public site's design system ([foundations.md](foundations.md), [components.md](components.md)) does not cover the
dashboard. This file does. Same palette, same tokens, same rules. Only the **density and patterns** differ,
because admins work in the dashboard for long sessions, mostly on laptops, sometimes on phones.

Status key: **Built** (in the repo) · **Restyle** (exists, off-system, needs the new look) · **Build** (new).

---

## 1. Principles
1. **Calm and scannable.** Cream surface, white cards, one maroon action per view. No decoration that does not help a task.
2. **Same brand, tighter spacing.** Public pages breathe (`py-16`). Admin uses `space-y-6` between blocks and `p-4`/`p-6` in cards.
3. **Tokens only.** No `#aa322b`, `#2d1816`, `#e9ddd3`, `text-[#2d1816]/60`. Use the table in section 2.
4. **Every action gives feedback.** Pressed state, loading state on the button, a toast on success or failure, a visible result.
5. **Every list handles four states:** loading (skeleton), empty, error, data.
6. **Destructive actions always confirm.** Delete, deactivate and role changes go through `ConfirmDialog`.
7. **Phone-usable.** 375px first, no horizontal page scroll, 44px tap targets, tables become card lists below `md`.
8. **Lucide icons only.** Same rule as the public site.
9. **Serif for headings only** (h1 to h4 already get it from `globals.css`). Do not write `font-['Libre_Baskerville']`.

---

## 2. Token map (replace hex with these)
| Old hex / class | Token | Meaning |
|---|---|---|
| `#fffdf8` page bg | `bg-background` | Page surface (cream) |
| `bg-white` / `#fffdf8` card | `bg-card` | Card, dialog, popover |
| `#2d1816` | `text-foreground` | Body and headings |
| `#2d1816/60`, `/70` | `text-muted-foreground` | Secondary text |
| `#2d1816/40` | `text-muted-foreground/70` | Tertiary (timestamps) |
| `#e9ddd3` | `border-border` | All borders and dividers |
| `#e9ddd3/30` hover | `hover:bg-muted` | Row and ghost-button hover |
| `#aa322b`, `#922821` | `text-primary`, `bg-primary`, `maroon-600` for hover | Brand action |
| `#aa322b/10` | `bg-primary/10` | Tinted maroon surface |
| `#f8c84d` | `bg-secondary`, `gold-300` | Gold highlight |
| `#2d1816` sidebar bg | `bg-ink` | Dark sidebar (the only place `ink` is a surface) |
| red-500/600 | `text-destructive`, `bg-destructive` | Errors, delete |

### New status tokens (Build; needs a shared-file change in `globals.css`)
The admin needs success, warning and info colours, which the system lacks. Add to `:root` / `.dark` and `@theme inline`:
```
--success: 142 55% 32%;   --success-foreground: 0 0% 100%;   --success-soft: 142 55% 94%;
--warning: 38 90% 38%;    --warning-foreground: 0 0% 100%;   --warning-soft: 41 100% 93%;
--info:    210 60% 38%;   --info-foreground: 0 0% 100%;      --info-soft: 210 60% 95%;
```
Used as `bg-success-soft text-success`. Never raw `green-100`/`yellow-50`.

---

## 3. Page anatomy
Every admin page is built from the same five blocks, in this order:

```
AdminShell (layout: Sidebar + AdminHeader)
  PageHeader      title, one-line subtitle, primary action (right on desktop, full-width on phone)
  StatRow         optional, 2-4 StatCards
  Toolbar         search, filters, view toggle, bulk actions
  Content         ListRow cards (people, media) or DataTable (dense records)
  Dialogs         FormDialog (create/edit), ConfirmDialog (delete)
```
Content width: `max-w-7xl`, padded `p-4 md:p-6 lg:p-8`. Page enter animation: `abf-fade-in`.

---

## 4. Component catalogue

### Primitives: changes to `components/ui`
| Change | Detail |
|---|---|
| **Button: add `brand` variant** (Build) | The maroon gradient + shadow used by auth, admin and CTAs: `bg-linear-to-r from-maroon-500 to-maroon-600 text-white shadow-lg shadow-primary/30 hover:from-maroon-600 hover:to-maroon-700`. Replaces every hand-written gradient. |
| **Button: `loading` prop** (Build) | Shows a Lucide `Loader2` spinner, disables the button, keeps its width. |
| **Button: `size="icon"` is 44px on touch** | `size-11 md:size-9`. |
| **Badge: add `success`, `warning`, `info`** (Build) | Soft background + coloured text, from the status tokens. |
| **Skeleton** (Build) | `animate-pulse rounded-md bg-muted`. Replaces spinners in lists. |
| **Dialog** (Restyle) | `bg-card`, `rounded-2xl`, scroll inside on small screens (`max-h-[90dvh] overflow-y-auto`), footer stacks on phones. |
| **Input / Select / Textarea** (Restyle) | Admin form height `h-11`, error state via `aria-invalid:border-destructive`. |

### Admin components (`components/admin`)
| Component | Status | Props / behaviour |
|---|---|---|
| **Sidebar** | Restyle | `bg-ink`, gold active indicator, grouped sections (Content, People, Site, Security), collapsed icon-only mode (exists), drawer on phones with backdrop. Tokens only. |
| **AdminHeader** | Restyle | Menu button (44px), search trigger (`Cmd/Ctrl+K`), notifications, user menu. |
| **PageHeader** | Restyle | `title`, `subtitle?`, `backHref?`, `actions?` (rendered with `Button`, not hand-built). Stacks on phone, actions full-width. |
| **StatCard** (was DashboardCard) | Restyle | `title`, `value`, `icon`, `change?`, `trend?`. Count-up on first view, hover lift. Uses `IconTile`. |
| **Toolbar** | Build | `search` input + `children` slot for filters. One row on desktop, wraps on phone. |
| **ListRow** | Build | The row card used for people and records: `avatar/icon`, `title`, `badges`, `meta`, `actions`. Hover lifts, stagger-enters (framer-motion, 40ms steps, max 10). |
| **RowActions** | Build | Inline Edit/Delete icon buttons on desktop; a `DropdownMenu` (`MoreVertical`) below `md`. Every button has an `aria-label`. |
| **StatusBadge** | Build | `status: "active" \| "inactive" \| "suspended" \| "draft" \| "published" \| ...` maps to a Badge variant + dot. One mapping, used everywhere. |
| **RoleBadge** | Build | `super_admin` (gold, `Crown`), `admin` (maroon, `Shield`), `editor` (outline). |
| **FormField** | Build | `label`, `htmlFor`, `error?`, `hint?`, `required?`, `children`. Gives every form the same label, hint and error layout. |
| **FormDialog** | Build | Dialog wrapper: `title`, `description?`, `onSubmit`, `submitting`, `submitLabel`. Footer has Cancel + brand `loading` button; Enter submits; focus returns to the trigger. |
| **ConfirmDialog** | Restyle | Add `destructive` flag (red confirm button), `loading`, and use `Button`'s loading prop. |
| **EmptyState** | Restyle | `IconTile`, serif title, muted description, optional action. Tokens. |
| **LoadingState** | Restyle | Replaced in lists by `Skeleton` rows (`ListSkeleton`, `TableSkeleton`). Keep a centered spinner only for full-page loads. |
| **DataTable** | Restyle | Sticky header, hover rows, sortable columns (later), turns into stacked cards below `md`. |
| **ImageUpload** | Restyle | Tokens, drag-over state, progress, preview, remove button (44px). |
| **ErrorState** (Build) | Build | `title`, `description`, `onRetry`. For failed loads. |

---

## 5. Interaction rules
| Moment | Behaviour |
|---|---|
| Hover / press | Cards `hover:shadow-md`, buttons `active:scale-[0.98]`, 150ms transitions |
| List enter | Stagger fade-up, capped at 10 rows |
| Row add / remove | `AnimatePresence` fade and collapse |
| Save | Button shows spinner, dialog stays open until it resolves, then closes and toasts |
| Toggle (Switch) | Optimistic flip, revert and toast on failure |
| Delete | `ConfirmDialog` → row animates out → toast with context ("Admin removed") |
| Search | Filters as you type, debounced 200ms, shows the count |
| Keyboard | Visible focus ring everywhere, `Esc` closes dialogs, `Cmd/Ctrl+K` opens search |
| Reduced motion | All motion respects `prefers-reduced-motion` |

---

## 6. Responsive rules
- **< 768px:** sidebar is an off-canvas drawer; page actions go full width; `ListRow` stacks (avatar and title on top, actions below); `DataTable` becomes cards; dialogs are near full-screen.
- **768 to 1023px:** sidebar collapsed to icons by default.
- **≥ 1024px:** full sidebar, inline row actions, 2-column forms in dialogs.

---

## 7. Rollout status (October 2026)
**Built:** status tokens; `Button` (`brand`, `loading`, touch-size icon), `Badge` (success, warning, info, muted), `Skeleton`, `Dialog` restyle; Sidebar, AdminHeader, layout; PageHeader, DashboardCard (kept its name), EmptyState, LoadingState + `ListSkeleton`, ConfirmDialog, `ErrorState`, `Toolbar`, `ListRow`, `RowActions`, `StatusBadge`, `RoleBadge`, `FormField`, `FormDialog`; ImageUpload, SearchModal, LogoutDialog tokenised. **Admins** is the finished pilot page. Every other admin page has had its hex colours converted to tokens; their layouts still use the old structure and move to the shared components one by one.

**Still to do:** `DataTable` card layout on phones, count-up on stats, and migrating each page's list, form and dialog to `ListRow` / `FormDialog` / `FormField`.

## 8. Rollout order
1. Tokens: add the status tokens to `globals.css` (shared file: tell your partner first).
2. `ui`: Button (`brand`, `loading`), Badge variants, Skeleton.
3. Shell: Sidebar, AdminHeader, `PageHeader`.
4. Shared pieces: StatCard, Toolbar, ListRow, RowActions, StatusBadge, RoleBadge, FormField, FormDialog, ConfirmDialog, EmptyState, ErrorState, skeletons.
5. **Pilot page: Admins** (most varied UI: list, search, dialog, switch, delete, badges).
6. Apply to the remaining pages by group: dashboard home; content (programmes, events, news, testimonials, beneficiaries); people (members, volunteers); site (contents, footer, social links, media, settings); security and notifications.

Only the visual layer changes. Page logic and the partner's API routes are untouched until we agree to wire them up.
