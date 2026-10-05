# Annorent — Developer Map

> Start here if you're new — human or agent. This is the index; every other file in
> `/context` is the detail.

## The system in one paragraph

Annorent is a real estate & hospitality marketplace (property sales, long-term
leases, flexible/coworking rentals, hotel bookings) serving Cameroon → Africa →
international. One versioned NestJS core API serves a Next.js web app and a Flutter
mobile app identically. Realtime chat/notifications, AI recommendations, and virtual
tour processing are separate services behind that same API — never called directly
by clients. PostgreSQL + PostGIS is the system of record, accessed via raw `pg`
queries (no ORM), never an ORM. Redis caches and queues. Media lives in object
storage behind a CDN, never proxied through app compute. Payments run through a
Mobile Money aggregator.

## Repos (assumed layout — confirm against actual repo names)

| Repo | Contains |
|---|---|
| `annorent-web` | Next.js frontend — see `annorent-web-file-structure.md` |
| `annorent-mobile` | Flutter app |
| `annorent-api` | NestJS core API — modules M1–M13 |
| `annorent-ai-services` | Python FastAPI (recommendations) + Celery/RQ workers (tour processing) |

Each repo keeps its own `/context` copy (or symlinks to a shared docs source) so
opencode always has this reference material loaded regardless of which repo it's
working in.

## Where to find what

| Question | Read |
|---|---|
| What is this product, who's it for, what modules exist? | `project-overview.md` |
| What should a screen look/feel like, and where does it live? | `ui-context.md` |
| How do clients call the backend? What's the response shape? | `api-reference.md` |
| How are services split, and why? | `architecture.md` |
| How should this code be written/structured? | `code-standards.md` |
| What tables exist, how do they relate? | `database-schema.md` |
| What's the auth model, RBAC rule, payment-security rule? | `security.md` |
| How do I branch, test, deploy, and work with opencode? | `workflows.md` |
| Where does a given file/component actually live in the web repo? | `file-structure.md` |
| What routes exist and who can see them, and what's designed vs. not yet? | `sitemap.md` |
| Where do the brand colour/type tokens live, and how do I add one? | `src/app/[locale]/globals.css` — the `@theme` block |
| Where does the home hero live? | `src/components/marketing/hero.tsx` (server), `search-bar.tsx` (the one client island), `trust-metrics.tsx` |
| Where does the site chrome live? | `src/components/layout/site-header.tsx` (fixed bar), `src/components/marketing/site-footer.tsx` (link grid + legal bar) |
| Where does the rest of the home page live? | `map-band.tsx`, `listing-grid-section.tsx` (header + grid), `listing-card.tsx` (shared card), `owner-cta.tsx` |
| Where does the home page's listing content come from? | `src/lib/marketing/home.ts` — static typed data ported from the Stitch reference |
| Where does `/properties` live? | `src/app/[locale]/(marketing)/properties/page.tsx`, with `filter-panel.tsx`, `search-result-card.tsx`, `active-filter-chips.tsx`, `sort-select.tsx`, `pagination.tsx`, `assurance-strip.tsx` in `src/components/marketing/` |
| Where does `/properties/[id]` live? | `src/app/[locale]/(marketing)/properties/[id]/page.tsx` — the gallery mosaic, spec row, amenity grid, legal certificate, and the sticky booking form are all inline in the page; there is no separate detail-page component yet |
| Where does `/rentals` live? | `src/app/[locale]/(marketing)/rentals/page.tsx`, with `workspace-card.tsx`, `assurance-strip.tsx`, `pagination.tsx`, and `sort-select.tsx` |
| Where does `/hotels` live? | `src/app/[locale]/(marketing)/hotels/page.tsx`, with `hotel-card.tsx`, `assurance-strip.tsx`, `pagination.tsx`, and `sort-select.tsx` |
| Where does the browse-page content come from? | `src/lib/marketing/{property-search,property-details,rentals,hotels}.ts` — static typed data, one file per route, shapes in `types.ts`. No barrel file by project rule. |
| Where does `/map` live? | `src/app/[locale]/(marketing)/map/page.tsx` (server: resolves copy, wires `SiteHeader`/`SiteFooter`) → `src/components/marketing/map/map-discovery.tsx` (the one client island: filters, pins, popup, zoom) → `map/abidjan-map.tsx` (server: the stylised SVG). Data in `src/lib/marketing/map.ts`, which also holds `MAP_INERT_CONTROLS`. |
| Why does the map need no map library? | The base map is a hand-drawn SVG of Abidjan, not tiles, and pins are HTML positioned in percentages over it. So there is no API key, no tile server, and no geocoder — and zoom scales the SVG `viewBox` rather than panning. `MAP_INERT_CONTROLS` lists what that rules out. |
| Where do the auth pages live? | `src/app/[locale]/(auth)/**/page.tsx` — seven routes, all thin, over `src/components/auth/`: `auth-shell.tsx` (split screen: form card + trust panel), `auth-tabs.tsx`, `auth-fields.tsx` (shared labelled inputs), `identity-form.tsx` (`/login` + `/register`), `business-register-form.tsx` (`/register/owner` + `/register/hotel`), `recovery-forms.tsx` (forgot / reset / verify). Copy in `src/lib/i18n/messages/auth.ts`. |
| How do the auth pages avoid the site header? | The `(auth)` layout is pass-through and `AuthShell` renders its own full-height split with no `SiteHeader`/`SiteFooter` and no `pt-20` — unlike every `(marketing)` page. See `file-structure.md` §3. |
| Where do the owner pages live? | `src/app/[locale]/owner/**/page.tsx` — thin composition over `src/components/owner/` (`owner-dashboard.tsx`, `dashboard-stat-card.tsx`, `dashboard-activity-feed.tsx`, `listing-table.tsx`) inside `src/components/layout/app-shell.tsx`. The RBAC guard is `requireRole()` in `src/lib/auth/guards.ts`, called once from `owner/layout.tsx`. Data + sidebar labels in `src/lib/owner/`. |
| Why does `/[locale]/owner` render per request? | `page.tsx` sets `force-dynamic` because the activity feed shows relative timestamps ("2 hours ago"). No other route declares `revalidate`, so there is no existing convention; revisit when the feed comes from the API with absolute dates. |
| How do I add a marketing page without overlapping the header? | `file-structure.md` → "A `fixed` site header needs a matching offset" — `pt-20` on the wrapper always; `-mt-20` on the first section **only** if that section is artwork-bleeding (Home). |

## Read order for a new developer or a fresh opencode session

1. `project-overview.md` — what and why.
2. `architecture.md` — how the pieces fit and why they're split this way.
3. `database-schema.md` — the data model everything builds on.
4. `api-reference.md` — the contract every client speaks.
5. `security.md` — the non-negotiables.
6. `code-standards.md` — how to actually write it.
7. `ui-context.md` — for anything touching a screen.
8. `file-structure.md` — for anything in the web repo specifically.
9. `workflows.md` — how to ship it.

## Non-negotiables worth repeating here

These come up across almost every doc above, which is itself a signal of how central
they are:

- **No ORM. Ever.** Raw `pg`, parameterized queries, repository layer.
- **One API contract for web and mobile.** No client-specific response shapes.
- **Media never touches app-server compute.** Object storage + CDN, always.
- **Booking + payment is atomic.** A DB transaction, every time, no exceptions for
  "quick" flows.
- **GPS hidden until booking confirmed.** Enforced server-side, not client-side.
- **API versioned from day one.** Mobile clients can't be force-updated.
- **`src/server/` in the web repo stays a thin BFF.** Business logic belongs in the
  Core API, not the frontend repo.

## Keeping this map current

If a new service, module, or major table gets added, update this file's "repos"
and "where to find what" tables in the same PR — an out-of-date developer map is
worse than none, since it actively points the next reader (or agent) somewhere
stale.