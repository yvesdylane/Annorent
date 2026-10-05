# Annorent Web App — File Structure & Governing Rules

> This is now the
> canonical structural reference and lives in `context/` alongside the other
> reference docs, per the standing `/context` convention — not scattered at repo
> root. Every file the app needs is listed below; nothing here is illustrative.

---

## 1. Complete file tree

```
annorent-web/
├── context/
│   ├── project-overview.md
│   ├── ui-context.md
│   ├── api-reference.md
│   ├── architecture.md
│   ├── code-standards.md
│   ├── database-schema.md
│   ├── security.md
│   ├── workflows.md
│   ├── developer-map.md
│   ├── file-structure.md              # this file
│   └── sitemap.md
├── public/
│   ├── logo-mark.svg
│   ├── logo-wordmark.svg
│   ├── favicon.ico
│   ├── hero-bg.jpg                    # Home hero photographic background
│   ├── images/
│   │   └── listings/                  # Home listing/map imagery, self-hosted
│   │       ├── map-abidjan.png
│   │       ├── properties-01..03.jpg
│   │       ├── rentals-01..03.jpg
│   │       └── hotels-01..03.jpg
│   └── fonts/
│       └── material-symbols-outlined.woff2   # Self-hosted icon font (see §3 perf note)
├── scripts/
│   └── generate-api-types.mjs
├── e2e/
│   ├── auth.spec.ts
│   ├── booking-flow.spec.ts
│   ├── owner-listing.spec.ts
│   └── admin-verification.spec.ts
├── src/
│   ├── proxy.ts
│   ├── app/
│   │   ├── layout.tsx                  # Minimal root shell — html/body only, no providers (§3)
│   │   ├── not-found.tsx               # Catch-all for paths outside any locale segment
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── favicon.ico
│   │   ├── [locale]/
│   │   │   ├── layout.tsx              # Real root layout: fonts, providers, generateStaticParams
│   │   │   ├── globals.css
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx           # Locale-aware 404 (translated copy)
│   │   │   ├── (marketing)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── properties/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── rentals/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── hotels/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── map/page.tsx
│   │   │   │   ├── partners/page.tsx
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── contact/page.tsx
│   │   │   │   └── legal/
│   │   │   │       ├── terms/page.tsx
│   │   │   │       └── privacy/page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── owner/page.tsx
│   │   │   │   │   └── hotel/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   ├── reset-password/page.tsx
│   │   │   │   └── verify-email/page.tsx
│   │   │   ├── account/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── bookings/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── appointments/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── messages/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [conversationId]/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   ├── saved/page.tsx
│   │   │   │   ├── notifications/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   ├── owner/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── properties/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   ├── rentals/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── availability/page.tsx
│   │   │   │   │       └── pricing/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   ├── hotel/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── rooms/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   ├── reservations/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── users/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── listings/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/review/page.tsx
│   │   │       ├── rentals/page.tsx
│   │   │       ├── hotels/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/review/page.tsx
│   │   │       ├── media/page.tsx
│   │   │       ├── advertisements/page.tsx
│   │   │       ├── transactions/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       └── settings/page.tsx
│   │   └── api/
│   │       ├── session/
│   │       │   ├── route.ts
│   │       │   └── logout/route.ts
│   │       ├── locale/route.ts
│   │       └── revalidate/route.ts
│   ├── components/
│   │   ├── providers.tsx
│   │   ├── marketing/
│   │   │   ├── hero.tsx                  # Home hero (server)
│   │   │   ├── search-bar.tsx            # Hero search card — the one client island
│   │   │   ├── trust-metrics.tsx         # Trust row under the hero (server)
│   │   │   ├── map-band.tsx              # "Explore by neighborhood" dark band (server)
│   │   │   ├── listing-card.tsx          # Shared listing card, all three variants
│   │   │   ├── listing-grid-section.tsx  # Section header + 3-col grid wrapper
│   │   │   ├── owner-cta.tsx             # Closing owner/institutional CTA (server)
│   │   │   ├── document-lang-sync.tsx    # Mirrors locale lang/dir onto <html>
│   │   │   ├── site-footer.tsx           # Public link grid + legal bar
│   │   │   ├── featured-listing-card.tsx
│   │   │   ├── active-filter-chips.tsx   # Dismissible "Active filters" strip
│   │   │   ├── assurance-strip.tsx       # shield/verified callout row (2 variants)
│   │   │   ├── filter-panel.tsx          # Sticky /properties filter sidebar
│   │   │   ├── pagination.tsx            # "Showing 1-6 of 248" + page links
│   │   │   ├── search-result-card.tsx    # /properties result card
│   │   │   ├── sort-select.tsx           # Shared "Sort by :" native select
│   │   │   ├── workspace-card.tsx        # /rentals workspace card
│   │   │   ├── hotel-card.tsx            # /hotels hotel card
│   │   │   └── map/
│   │   │       ├── abidjan-map.tsx       # Stylised Abidjan vector map (server) — zoom scales the viewBox
│   │   │       └── map-discovery.tsx     # /map: the one client island (filters, pins, popup, zoom)
│   │   ├── auth/
│   │   │   ├── auth-shell.tsx            # Split-screen shell: form card + trust panel (server)
│   │   │   ├── auth-tabs.tsx             # Sign In / Create Account / Pro & Hospitality links
│   │   │   ├── auth-fields.tsx           # Shared labelled inputs: text, phone, password, select
│   │   │   ├── identity-form.tsx         # /login + /register form, account-type switch
│   │   │   ├── business-register-form.tsx# /register/owner + /register/hotel, shared body
│   │   │   └── recovery-forms.tsx        # forgot-password / reset-password / verify-email
│   │   ├── account/
│   │   │   ├── booking-card.tsx
│   │   │   ├── appointment-list.tsx
│   │   │   └── saved-listings-grid.tsx
│   │   ├── owner/
│   │   │   ├── owner-dashboard.tsx        # /owner body: stat row + listings + activity
│   │   │   ├── dashboard-stat-card.tsx    # One labelled metric — moves to ui/ on a 2nd role's use (rule 2)
│   │   │   ├── dashboard-activity-feed.tsx # Recent bookings/payments/messages
│   │   │   ├── listing-table.tsx
│   │   │   ├── property-form.tsx
│   │   │   └── availability-calendar.tsx
│   │   ├── hotel/
│   │   │   ├── room-status-grid.tsx
│   │   │   └── reservation-row.tsx
│   │   ├── admin/
│   │   │   ├── verification-panel.tsx
│   │   │   ├── user-table.tsx
│   │   │   └── transaction-table.tsx
│   │   ├── booking/
│   │   │   ├── booking-flow.tsx
│   │   │   ├── checkout-modal.tsx
│   │   │   └── price-summary.tsx
│   │   ├── chat/
│   │   │   ├── conversation-list.tsx
│   │   │   ├── message-thread.tsx
│   │   │   └── attachment-picker.tsx
│   │   ├── map/
│   │   │   ├── map-canvas.tsx
│   │   │   ├── pin-cluster.tsx
│   │   │   └── list-map-panel.tsx
│   │   ├── media/
│   │   │   ├── photo-gallery.tsx
│   │   │   ├── video-tour-player.tsx
│   │   │   ├── tour-3d-viewer.tsx
│   │   │   └── media-uploader.tsx
│   │   ├── recommendations/
│   │   │   └── recommendation-carousel.tsx
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── role-sidebar.tsx
│   │   │   ├── site-header.tsx            # Fixed public header (marketing pages)
│   │   │   └── locale-switcher.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       ├── modal.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── toast.tsx
│   │       └── skeleton.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   └── errors.ts
│   │   ├── domain/
│   │   │   ├── property.ts
│   │   │   ├── booking.ts
│   │   │   ├── user.ts
│   │   │   ├── payment.ts
│   │   │   ├── message.ts
│   │   │   └── generated/              # .generated.ts output only — never hand-created
│   │   ├── auth/
│   │   │   ├── use-session.ts
│   │   │   └── guards.ts
│   │   ├── i18n/
│   │   │   ├── index.ts
│   │   │   └── messages/
│   │   │       ├── common.ts
│   │   │       ├── auth.ts                # Sign-in / registration / recovery copy
│   │   │       ├── marketing.ts           # Home, /properties, /rentals, /hotels, /map
│   │   │       ├── account.ts
│   │   │       ├── owner.ts
│   │   │       ├── hotel.ts
│   │   │       └── admin.ts
│   │   ├── realtime/
│   │   │   ├── socket-client.ts
│   │   │   ├── use-chat.ts
│   │   │   └── use-notifications.ts
│   │   ├── maps/
│   │   │   └── client.ts
│   │   ├── payments/
│   │   │   └── money.ts
│   │   ├── ai/
│   │   │   └── recommendations-client.ts
│   │   ├── validation/
│   │   │   ├── property.ts
│   │   │   └── booking.ts
│   │   ├── hooks/
│   │   │   ├── use-debounce.ts
│   │   │   └── use-media-query.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       └── format.ts
│   ├── marketing/                   # Static public-site content, one file per page
│   │   ├── types.ts                 # Shapes shared across the browse pages
│   │   ├── home.ts                  # Home listing + map-band content
│   │   ├── property-search.ts       # /properties results, filter groups, pagination
│   │   ├── property-details.ts      # /properties/[id] gallery, amenities, pricing
│   │   ├── rentals.ts               # /rentals workspace cards, categories, billing
│   │   ├── hotels.ts                # /hotels cards, destinations, quick filters
│   │   └── map.ts                   # /map listings, pins, clusters, rent bounds, inert list
│   ├── owner/                       # Property-owner dashboard content
│   │   ├── dashboard.ts             # /owner stats, listings, activity
│   │   └── navigation.ts            # Owner sidebar labels + hrefs
│   ├── server/
│   │   ├── session.ts
│   │   ├── locale.ts
│   │   ├── proxy.ts
│   │   └── config.ts
│   ├── assets/
│   │   └── images/
│   └── tests/
│       ├── setup.ts              # Vitest setup: jest-dom matchers
│       ├── test-utils.tsx
│       └── mock-api.ts
├── docs/                          # superpowers plans and specs
├── .env.example
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── next.config.ts
├── tsconfig.json
├── playwright.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── .prettierrc
└── .gitignore
```

---

## 2. Rules governing this structure

### Placement rules

1. **A component used by more than one role's screens goes in a shared domain
   folder** (`booking/`, `chat/`, `map/`, `media/`, `layout/`, `ui/`) — never
   duplicated into each role's folder.
2. **A component used by exactly one role's screens goes in that role's folder**
   (`account/`, `owner/`, `hotel/`, `admin/`, `marketing/`, `auth/`). If a second
   role later needs it, move it to a shared folder in the same PR that introduces
   the second usage — don't leave a copy behind.
3. **Never create a new top-level folder under `src/components/` or `src/lib/`
   without updating this file and `context/developer-map.md` in the same PR.**
   An undocumented new folder is an out-of-band decision, not a shortcut.
4. **`src/lib/domain/generated/` is machine-written only.** Nothing in it is ever
   hand-edited; regenerate via `scripts/generate-api-types.mjs` instead of patching
   a generated file directly.
5. **`src/server/` stays a thin BFF.** Session, locale, and request-proxying code
   only. If a PR adds a repository, a service with business rules, or direct
   database access here, that logic belongs in the NestJS core API instead — this
   is the single most important rule in this document; see `security.md` and
   `architecture.md` for why.

### Naming rules

6. Files: `kebab-case.ts` / `kebab-case.tsx`. Route files keep Next.js's required
   names exactly (`page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`,
   `not-found.tsx`, `proxy.ts`).
7. Component default exports: `PascalCase`, matching the file's purpose, not
   necessarily the filename verbatim (`booking-flow.tsx` exports `BookingFlow`).
8. One component per file. If a file grows a second exported component that isn't
   a tiny private subcomponent, split it.
9. Route group folders use parentheses exactly as shown — `(marketing)`,
   `(auth)` — and dynamic segments use brackets exactly as shown — `[id]`,
   `[conversationId]`.
10. **`[locale]` is a reserved dynamic segment, not a content route.** Every
    page-rendering route (marketing, auth, account, owner, hotel, admin) lives
    under `src/app/[locale]/`, added now rather than deferred, per NFR-SC3
    ("i18n architected in, not bolted on") — restructuring after more sections
    are built would be far more expensive than doing it at this stage. `api/`
    routes stay outside `[locale]/` since they aren't localized pages.
    `proxy.ts` (Next.js 16's replacement for the deprecated `middleware.ts`
    convention — see file-structure.md's boot exceptions in §3) now also
    handles locale negotiation/redirect (cookie → `Accept-Language` → default
    locale, redirecting an unprefixed request to its `/[locale]/...`
    equivalent) in addition to the RBAC guards described in rule 12 below.

### Route rules

11. `page.tsx` files are composition only — they assemble components from
    `src/components/`, they don't contain business logic or large inline JSX
    trees. If a page file is getting long, that's a signal to extract a
    component, not a reason to keep growing the page file.
12. `layout.tsx` at each role's root (`account/layout.tsx`, `owner/layout.tsx`,
    `hotel/layout.tsx`, `admin/layout.tsx`) is where the RBAC guard for that role
    lives — every page under it inherits the guard; don't re-check the role
    inside individual `page.tsx` files.
13. Every new route added to `src/app/` must be added to `context/sitemap.md` in
    the same PR — the sitemap and the file tree describe the same thing from two
    angles and must never drift apart.

### Testing rules

14. Unit/component tests are co-located as `*.test.ts` / `*.test.tsx` next to the
    file they test — not gathered into a separate mirrored test tree.
15. `e2e/` holds only cross-cutting, multi-page flows (auth+RBAC, full booking,
    listing verification) — a single-component behavior test belongs co-located,
    not in `e2e/`.

### Barrel files / re-exports

16. **No `index.ts` barrel re-export files**, except `lib/i18n/index.ts`
    (which is a real module, not a re-export barrel). Explicit imports from the
    actual file keep import graphs traceable and avoid circular-import risk as
    the codebase grows — don't add a barrel "for convenience" in `components/ui/`
    or elsewhere.

### Empty folders

17. Any folder that's intentionally empty at scaffold time gets a `.gitkeep` —
    remove the `.gitkeep` the moment a real file lands in that folder, don't leave
    both.

### Keeping this document current

18. This file, `context/sitemap.md`, and `context/developer-map.md`'s "where to
    find what" table are the three places a structural change must be reflected.
    A PR that adds/moves/removes a route, a top-level component/lib folder, or a
    service boundary is incomplete without updating the relevant one(s) of these
    three — treat an out-of-date structure doc as a bug, not a documentation
    nice-to-have, since it's what opencode and new developers rely on to place
    new code correctly.

---

## 3. Boot & Next.js-required exceptions to "empty"

"Structure-only" scaffolding still has to boot. A handful of files are exempt
from the literal 0-byte rule because Next.js's own build system — not product
content — requires something valid in them:

- **`src/app/layout.tsx` is a minimal shell only** — `<html>`/`<body>` and
  nothing else, no providers. **`src/app/[locale]/layout.tsx` is the real root
  layout** — fonts, `I18nProvider`, `AuthProvider`, `ToastProvider`,
  `SocketProvider`, and a `generateStaticParams()` returning the supported
  locales, plus a locale-validity check that calls `notFound()` for anything
  not in that list. `globals.css` (Tailwind entry + `@theme` brand tokens, see
  `ui-context.md`) lives under `[locale]/` since it's loaded by that layout.
  Keep both to the minimum needed to boot — never actual page content.
- **Only one layout may own `<html>`, so the root shell does.** The root
  layout sits *above* `[locale]` and is handed `params = {}` (verified on Next
  16.3.6, not assumed), so it cannot know the active locale. `lang`/`dir` are
  therefore set on a wrapper element in `[locale]/layout.tsx`, and
  `DocumentLangSync` mirrors them onto `<html>` on mount. Without that mirror,
  `<html lang>` is stuck on `en` for every locale, which misleads screen-reader
  pronunciation and search engines.
- **A `next/font` variable must go on the element that wraps the content.**
  CSS custom properties inherit downward, so declaring `--font-inter` on a
  sibling or empty child element leaves every type token in `@theme` resolving
  to its fallback stack. It belongs on the same wrapper as the page content.
- **A `fixed` site header needs a matching offset, or it overlaps the page.**
  `site-header.tsx` is `fixed top-0` and `h-20`, so it is out of flow. There are
  two correct patterns, and picking the wrong one either overlaps the header or
  opens a phantom gap.
  - *Full-bleed hero* (Home only): the page wrapper takes `pt-20` and the hero
    takes `-mt-20`. The values cancel exactly — both are
    `calc(var(--spacing) * 20)` = 5rem — so the photograph bleeds to the top of
    the viewport while the first section *below* it still clears the bar. Drop
    `pt-20` and the header sits on top of the content; drop `-mt-20` and the
    hero gets a 5rem gap under the header. They must stay in step.
  - *Solid first section* (`/properties`, `/properties/[id]`, `/rentals`,
    `/hotels`): the page wrapper takes `pt-20` **only**. There is no
    `-mt-20`, because the first section is an opaque context/hero band that is
    meant to start below the header, not slide underneath it. Applying the
    Home pair here pulls the band up under the translucent header bar.
  So: every marketing page needs `pt-20` on the wrapper; only a page whose
  first section is artwork-bleeding adds `-mt-20` to that section.
- **`src/lib/marketing/` holds static public-site content, one file per page.**
  The listing and map copy ported from the Stitch reference live in
  `home.ts`; `property-search.ts`, `property-details.ts`, `rentals.ts`, and
  `hotels.ts` hold the browse-page content, and `types.ts` holds the shapes they
  share. These are plain typed data modules, not API clients, so the marketing
  surface renders without the backend. The shapes mirror the API response so
  swapping in a fetch stays a change to these files. Imagery is self-hosted
  under `public/images/listings/`, `public/images/search/`,
  `public/images/details/`, `public/images/rentals/`, and
  `public/images/hotels/` rather than hotlinked from the design tool's CDN.
  There is deliberately no `src/lib/marketing/index.ts` barrel — see the
  no-barrel rule above.
- **Every other Next.js special file** (`page.tsx`, `layout.tsx` elsewhere,
  `route.ts`, `error.tsx`, `not-found.tsx`, `proxy.ts`) needs a minimal
  valid stub — a bare default export or handler, nothing else — because Next's
  dev/build process requires one to recognize the route at all. E.g.
  `export default function Page() { return null; }`. A true 0-byte file here
  fails `next build` and errors the moment the route is visited in dev.
- **`proxy.ts`, not `middleware.ts`.** Next.js 16 deprecated the `middleware`
  file convention in favor of `proxy` (same location, `src/proxy.ts`). This
  project uses `proxy.ts` from the start — if any generated code or an older
  reference still creates `middleware.ts`, migrate it with
  `npx @next/codemod@canary middleware-to-proxy .` and delete the old file
  rather than letting both exist.
- **Binary/auto-served assets** (`public/favicon.ico`,
  `src/app/opengraph-image.png` + `.alt.txt`) are never faked as empty files.
  Keep the real favicon `create-next-app` generated until a designed one
  exists; don't create `opengraph-image.png` at all until the real asset is
  ready — document the expected path, don't scaffold a broken placeholder.
  `public/logo-mark.svg` / `logo-wordmark.svg` can stay genuinely empty since
  nothing references or auto-serves them yet.
- **`tailwind.config.ts` is not part of this project's tree.** Tailwind v4
  (per `package.json`) uses CSS-first configuration — brand tokens live in the
  `@theme` block inside `src/app/[locale]/globals.css`, not a separate config
  file. If a future version needs a config file again (custom content globs,
  plugins), add it back deliberately with real content, not as an empty
  placeholder.
- **Status colours live in `globals.css`, not in a component.** `ui-context.md`
  fixes the mapping but deliberately left the amber unpicked; it is now
  `--color-pending: #8a5a00`, alongside `--color-success: #1c7a4f` and
  `--color-locked: #5f6470`. All three clear 4.5:1 as text on white and on the
  `--color-surface-container` pill tint. The brand green `#36B373` is **not** a
  token: measured at 2.67:1 on white it fails WCAG AA for text and under white
  text, so it stays decoration-only (icons, chart marks).
- **`src/app/` vs. a root-level `app/`:** this project uses the `src/` layout,
  exclusively. If a fresh `create-next-app` run (or a teammate's local setup)
  ever regenerates a root-level `app/`, consolidate into `src/app/` and delete
  the root one immediately — the two must never coexist.
- **`tsconfig.json`'s `@/*` path alias** must point at `./src/*` for every
  `@/...` import in this tree to resolve. This is a correction to a
  misconfigured generated file, not new feature work — fix it directly; the
  "don't touch create-next-app files" rule was never meant to protect an
  incorrect setting.
- **`package.json`** is intentionally not part of the scaffold target — it's
  managed by `npm`/`create-next-app`/dependency changes, not hand-created
  structure. It's omitted from the tree for that reason, not by oversight.