# Annorent Web — Sitemap

> Companion to `file-structure.md` — every route here must have a matching
> entry in that file's tree, and vice versa (see file-structure.md rule 12).
> This doc describes routes and who can see them; file-structure.md describes
> the files that implement them.

**Locale prefix:** every route sits under `/[locale]/...` (e.g. `/en/properties`,
`/fr/properties`) per F11 (English, French, Portuguese, Arabic, Swahili, +).
Locale is omitted below for readability. Arabic requires RTL layout — see
`ui-context.md`.

---

## 1. Public / marketing (no auth) — route group `(marketing)`

- `/` — Home: unified journey (Search → Connect → Book/Schedule → Pay), featured listings
- `/properties` — Property search & listing (sale + long-term rent)
  - `/properties/[id]` — Property detail (ISR)
- `/rentals` — Flexible rentals & coworking search
  - `/rentals/[id]` — Rental unit detail (ISR)
- `/hotels` — Hotel & guest house search
  - `/hotels/[id]` — Hotel/guest house detail (ISR)
- `/map` — Full map-based discovery
- `/partners` — Partner opportunity page
- `/about`
- `/contact`
- `/legal/terms`
- `/legal/privacy`

## 2. Auth (no auth) — route group `(auth)`

- `/login`
- `/register` — Tenant/user signup
- `/register/owner` — Property owner business registration
- `/register/hotel` — Hotel/guest house business registration
- `/forgot-password`
- `/reset-password`
- `/verify-email`

## 3. Tenant / user (role: `tenant`) — `account/`

- `/account` — Overview
- `/account/bookings` — list + `/account/bookings/[id]`
- `/account/appointments` — list + `/account/appointments/[id]`
- `/account/messages` — list + `/account/messages/[conversationId]`
- `/account/payments`
- `/account/saved`
- `/account/notifications`
- `/account/profile`

## 4. Property owner (role: `property_owner`) — `owner/`

- `/owner` — Dashboard
- `/owner/properties` — list, `/owner/properties/new`, `/owner/properties/[id]/edit`
- `/owner/rentals` — list, `/owner/rentals/new`, `/owner/rentals/[id]/availability`, `/owner/rentals/[id]/pricing`
- `/owner/messages`
- `/owner/payments`
- `/owner/profile`

## 5. Hotel / guest house owner (role: `hotel_owner`) — `hotel/`

- `/hotel` — Dashboard
- `/hotel/rooms` — list, `/hotel/rooms/new`, `/hotel/rooms/[id]/edit`
- `/hotel/reservations` — list + `/hotel/reservations/[id]`
- `/hotel/messages`
- `/hotel/payments`
- `/hotel/profile`

## 6. Administrator (role: `admin`) — `admin/`

- `/admin` — Dashboard
- `/admin/users` — list + `/admin/users/[id]`
- `/admin/listings` — list + `/admin/listings/[id]/review`
- `/admin/rentals` — verification queue
- `/admin/hotels` — list + `/admin/hotels/[id]/review`
- `/admin/media`
- `/admin/advertisements`
- `/admin/transactions`
- `/admin/reports`
- `/admin/settings`

## Design status (Stitch)

Tracked here so it's obvious what's still unbuilt at the design layer, not
just the code layer:

| Section | Status |
|---|---|
| Home `/` | **Built** from Stitch screen `53edc501418847e6ba5066b915f3b3da` ("Home - Annorent Marketplace") — fixed header, hero + search card, trust row, neighborhood map band, the three listing grids (properties / rentals / hotels), the owner CTA, and the footer. |
| Property search `/properties` | **Built** from Stitch screen `8dd45e1def024c899757214e76101f5e` ("Property Search - Annorent") — context bar with live count + alert/map actions, active-filter chips, sort control, sticky filter sidebar (budget, type, bedrooms, neighborhoods, amenities), verified-assurance bar, 6-card result grid, district map preview, pagination. |
| Property detail `/properties/[id]` | **Built** from Stitch screen `ad6d0ce30328440b8d379c7c71308307` ("Property Details - Villa Cocody - Annorent") — breadcrumb, 5-image gallery mosaic with photo-count overlay, certification chips, spec row, about copy, power-continuity callout, 9-amenity grid, location map, legal certificate, sticky booking form with price breakdown + lease terms + agent card. Dynamic (not prerendered) because it resolves `[id]`. |
| Coworking `/rentals` | **Built** from Stitch screen `2415b3c5330b4bcdaaa16ce14927e258` ("Flexible Rentals & Coworking - Annorent") — hero with category chips + billing toggle, 2-item assurance row, 6 workspace cards with dual price tiers, enterprise CTA band, pagination, per-page selector. |
| Hotels `/hotels` | **Built** from Stitch screen `55151c6f54ec458f9f83f6f67fda3d28` ("Hotels & Residences - Annorent") — escrow badge, labelled search panel (destination/dates/guests), 3-item assurance row, 7 quick-filter chips, sort control, 3 hotel cards with star ratings, escrow-guarantee band, pagination. |
| Map discovery `/map` | **Built** from Stitch screen `1567d9d5515a48da855f69e63632b78b` ("Interactive Map Discovery - Annorent") — pinned multi-filter bar (free-text location field, 5 category pills, max-rent slider, reset), results rail with a live count and 5 horizontal listing cards, and a full-height stylised vector map of Abidjan with 5 price pins, 2 density clusters, a pin popup, floating map utilities, and a working zoom control. |
| Auth: login, register, register/owner, register/hotel | **Built** from Stitch screen `414cc749887a4a6fbe5acfcba6b7cfbf` ("Sign In & Registration - Annorent") — one split-screen shell (form card left, trust panel right) serving all four routes, with the reference's `Sign In` / `Create Account` / `Pro & Hospitality` tabs. |
| Auth: forgot-password, reset-password, verify-email | **Built by derivation** — no Stitch screen exists for these; they reuse the same `AuthShell` with the account tabs hidden. See "Deriving the undesigned auth routes" below. |
| Public/marketing (remaining routes above) | Fully prompted in `annorent-stitch-prompts.md` |
| Owner `/owner` dashboard | **Built by derivation** — no Stitch screen was reachable for it; composition follows the established dashboard pattern (stat row → listings table → activity feed → role sidebar). |
| Tenant, Hotel Owner, Admin sections | **Not yet designed** — next Stitch pass after public/marketing ships |

**Inert controls on the four browse pages.** Every filter, sort, chip, chip-removal,
quick-filter, date/guest field, and pagination control is rendered with the
Stitch visual state but is not yet wired to query params or a backend — sorting
and filtering do not yet change the result set, and the search panel does not
submit. This is deliberate: the reference artwork specifies appearance, not the
query-parameter contract. All of them are real native controls (`<select>`,
`<input type=checkbox|radio|date>`, `<button>`, `<a>`) with programmatically
associated labels rather than div-with-onclick, so wiring them up is a matter of
adding a submit handler and a router update, not a rewrite. See §"Wiring the
browse filters" below before implementing.

**Inert controls on `/map`.** Unlike the browse pages, the map's filters *are*
wired: the location field, the five category pills, and the max-rent slider all
narrow the result list and the map pins together, and the count updates with
them. Zoom, card↔pin highlighting, and the pin popup are live too. Four
controls remain inert, and `MAP_INERT_CONTROLS` in `lib/marketing/map.ts` is the
canonical list:

| Inert control | Why it cannot work yet |
|---|---|
| Sort by relevance | Ordering needs a live listing query to sort against. |
| Satellite / map mode | The base map is a hand-drawn vector of Abidjan, not tiles — there is no second imagery layer to switch to. |
| Recentre on my location | Needs a geolocation permission prompt and coordinates to recentre onto. |
| 3D navigation view | The base map is flat and has no 3D geometry or camera to tilt. |
| "Search as I move the map" | Follows from there being no panning to trigger a re-search. |

All five are rendered as real `<button>`/`<input>` elements and explicitly
`disabled` with an explanatory `title` tooltip, rather than left looking
clickable.

**Deriving the undesigned auth routes.** Only one auth screen exists
(`414cc749887a4a6fbe5acfcba6b7cfbf`, with an FR twin
`33cafd2ac5dd4440b05560075ca0b3f0`), and it covers sign-in, tenant
registration, and the Pro & Hospitality account type in one tabbed design.
`/forgot-password`, `/reset-password`, and `/verify-email` have no reference, so
they are derived from that shell rather than invented: same split-screen layout
and trust panel, with the account-mode tabs hidden and the form swapped for the
recovery step. `/register/owner` and `/register/hotel` share one
`BusinessRegisterForm` with the account type fixed by the route. If a later
Stitch pass covers these, the components are already split so only the bodies
change.


Stitch project: **"Remix of Annorent Property Management Platform."**

## Notes on structure

- **Search state lives in query params, not new routes** — `/properties?type=apartment&city=...`.
- **Every role's authenticated section is a separate top-level segment**, not shared tabs on one `/dashboard`.
- **`/properties/[id]`, `/rentals/[id]`, `/hotels/[id]` are the SEO/ISR-critical pages.**
- Payment checkout is a step inside the booking flow, never a standalone route.

## Keeping this current

Any route added, moved, or removed updates this file **and** `file-structure.md`
in the same PR (file-structure.md rules 13/18). Update the "Design status" table
above whenever a new Stitch pass covers another section.
