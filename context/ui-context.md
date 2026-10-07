# Annorent — UI Context

> What the product should look and feel like, and where every screen lives. Pair with
> `annorent-web-file-structure.md` for where the code for each screen actually goes.

## Design language

**Tone:** clean, trustworthy fintech-meets-marketplace — Airbnb's warmth crossed with a
banking app's credibility. This platform handles property transactions and payments;
every screen should read as secure and professional first, welcoming second. Avoid
heavy gradients or playful illustration.

## Brand palette

| Token | Hex | Role |
|---|---|---|
| Primary | `#0052CC` | Buttons, links, active states, primary CTAs |
| Secondary | `#F4F5F7` | Page/card backgrounds, subtle surfaces |
| Tertiary | `#36B373` | Success states, verified badges, positive confirmations — used sparingly |
| Neutral | `#172B4D` | Headings, body text, nav/footer chrome — never pure black |

Status/badge color convention (keep consistent everywhere a status appears — listings,
bookings, reservations, users):

| Status | Color |
|---|---|
| Verified / Confirmed / Available | Success — token `--color-success: #1c7a4f`. **Not** tertiary `#36B373`: measured 2.67:1 on white, which fails WCAG AA as text and under white text. The brand green stays decoration-only (icons, chart marks). |
| Pending / Awaiting review or payment | Pending — token `--color-pending: #8a5a00`, the muted amber, now picked and used everywhere |
| Locked / Cancelled / Suspended | Locked — token `--color-locked: #5f6470` |

All three tokens live in the `@theme` block in `src/app/[locale]/globals.css`, not in
a component. They clear 4.5:1 as text on white **and** on the
`--color-surface-container` badge tint (success 4.56:1, pending 5.08:1, locked 5.08:1),
so status badges are legible both as pills and as bare text.

## Typography & shape

Modern geometric sans-serif, generous line height, confident heading weights. Rounded
corners (8–12px), soft shadows, generous whitespace. Desktop-first, fully responsive.

## Internationalization & layout

F11 is currently scoped to English, French, Portuguese, and Swahili (all LTR).
Arabic was dropped from the shipped set so no RTL locale exists yet; when an
RTL locale is added, it still affects more than string translation:
- Use logical CSS properties (`margin-inline-start` not `margin-left`) wherever
  layout direction matters, from day one, not retrofitted later.
- Icons implying direction (arrows, chevrons) must flip in RTL.
- Test every new layout in at least one RTL locale before merging, not just at
  translation-review time.
- **Missing translations fall back per key, not per namespace.** `t()` returns
  English when a key is absent for the requested locale, so a half-translated
  namespace degrades to readable copy instead of showing raw keys.
- **The owner surface ships English-only by decision.** `messages/owner.ts` and
  `messages/common.ts` carry an `en` table and nothing else, so `/fr`, `/pt`,
  and `/sw` all render English. This is a temporary call, not a rejection of
  F11: a half-finished translation reads worse than an honest English screen.
  F11's four locales are still owed — add a sibling locale table when the copy
  is actually translated, and update the same commit. `owner-messages.test.ts`
  asserts the owner table has no extra locales yet, so it cannot drift silently.

## Admin tone is different on purpose

Tenant, owner, and hotel-owner screens are warm and spacious. **Admin screens are
deliberately denser and more utilitarian** — this is an internal ops tool, and
information density matters more than warmth there. Don't apply the same generous
whitespace treatment to admin tables/queues.

## Shared components (don't rebuild per role)

| Component group | Used by | Notes |
|---|---|---|
| Booking/checkout flow | Public detail pages, account | Embedded in property/rental/hotel detail pages, never a standalone route — losing booking context on redirect is a real failure mode to avoid |
| Chat | Tenant, owner, hotel owner | One message-thread component, one conversation-list component |
| Map | Marketing search, `/map`, admin | Pin clustering, list-synced-to-map panel |
| Media viewer | Public detail pages, owner/hotel forms | Photo gallery, video tour player, 3D tour viewer, drag-and-drop uploader |
| Status badges | Everywhere | One badge component, colors per the status convention above |

## Sitemap

Full detail lives in `docs/SITEMAP.md` (already delivered as a standalone doc) — this
is the summary an agent needs to know which section a screen belongs to:

- **Public/marketing** (no auth): home, property search + detail, flexible rental
  search + detail, hotel search + detail, map discovery, partner page, about, contact,
  legal, auth (login/register/register-owner/register-hotel/forgot-password)
- **`/account`** (tenant): overview, bookings, appointments, messages, payments,
  saved, notifications, profile
- **`/owner`** (property owner): dashboard, properties (list/new/edit), rentals
  (list/new/availability/pricing), messages, payments, profile
- **`/hotel`** (hotel/guest house owner): dashboard, rooms, reservations, messages,
  payments, profile
- **`/admin`**: dashboard, users, listings (verification), rentals (verification),
  hotels (approval), media, advertisements, transactions, reports, settings

## SEO-critical pages

`/properties/[id]`, `/rentals/[id]`, `/hotels/[id]` are publicly crawlable and change
infrequently — these are the ISR (incremental static regeneration) candidates. Every
other authenticated route should not attempt SEO optimization.

## Mobile (Flutter) parity notes

The mobile app mirrors this same information architecture as native screens, not
routes. Key adaptations when translating a web screen to Flutter:
- Modals on web (e.g. a filter panel) generally become full screens on mobile.
- Bottom navigation replaces the sidebar for primary role navigation.
- Keep the same color tokens, status conventions, and component behavior — the visual
  language should feel like one product across web and mobile, not two.
