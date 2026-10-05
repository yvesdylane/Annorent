# Owner Dashboard Slice — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a working, tested `/[locale]/owner` dashboard on typed mock data, in the Stitch "Horizon Assurance" design language, plus the shared shell and primitives the remaining 11 owner routes will need.

**Architecture:** The dashboard renders server-side from a typed static data module (`src/lib/owner/dashboard.ts`) that mirrors the shapes the Core API will return, so swapping in a fetch stays a change to that one file — the same seam `src/lib/marketing/home.ts` already uses for the public site. A shared `AppShell` + `RoleSidebar` pair in `src/components/layout/` supplies chrome (rule 1: shared across all four roles); only genuinely owner-specific widgets live in `src/components/owner/` (rule 2). The role's RBAC guard is a clearly-labelled stub in `src/lib/auth/guards.ts`, called once from `owner/layout.tsx` (rule 12).

**Tech Stack:** Next.js 16.3.6 (App Router, typed routes), React 19.2.8, TypeScript 5 strict, Tailwind v4 (CSS-first `@theme`), Material Symbols Outlined ligature font, i18n via `src/lib/i18n`. Tests: Vitest 3 + jsdom + Testing Library.

## Global Constraints

These apply to **every** task. Copy them verbatim into any sub-agent prompt.

- **Naming** (`context/code-standards.md` §Naming): files `kebab-case.ts(x)`; types `PascalCase`; functions/variables `camelCase`. Route files keep Next's required names exactly.
- **No barrels** (rule 16): explicit imports from the real file. Never create an `index.ts` re-export — `src/lib/i18n/index.ts` is the sole exception.
- **One component per file** (rule 8): if a file grows a second *exported* component that isn't a tiny private subcomponent, split it. Consequence: `card.tsx` exports `Card` only (no `CardHeader`/`CardBody`); consumers compose plain `<div>`s.
- **Server component by default.** Add `"use client"` only for genuine interactivity. `Pagination` is the reference example: server, because its page numbers are `<a>` links.
- **i18n:** every user-visible string goes through `t(locale, namespace, key)`. No hardcoded copy in components. New namespaces ship **English + French only** — `t()` falls back per-key, so pt/ar/sw degrade to readable English rather than raw keys.
- **i18n key shape:** dot-namespaced strings, e.g. `"owner.dashboard.stats.active.label"`. The key literal **is** the source of truth; never nest objects for messages.
- **Tokens:** use only the `--color-*` / `--text-*` / `--radius-*` scale from `src/app/[locale]/globals.css`. Never a raw hex in a component. Radius is `rounded-md` (8px) for controls, `rounded-lg` for cards.
- **Icons:** `material-symbols-outlined` ligature spans, always `aria-hidden="true"`, always paired with an `sr-only` text label or a visible one. Never a bare icon-only control.
- **RTL:** logical properties only — `border-inline-end`, `padding-inline-start`, `text-start`. Never `-left`/`-right`/`ml-`/`mr-`/`pl-`/`pr-`/`text-left`/`text-right`. Directional chevrons take `rtl:rotate-180`.
- **Status colors** (`context/ui-context.md`): Verified/Confirmed/Available → success; Pending/awaiting review or payment → pending; Locked/Cancelled/Suspended → locked. One convention everywhere.
- **Accessibility:** status is never conveyed by color alone — every badge carries a text label.
- **Testing** (`code-standards.md` §Testing, rule 14): tests co-located as `src/**/*.test.ts(x)` next to the source. Behavior, not implementation details. Deterministic — pass `now` explicitly rather than reading the clock.
- **Verification order per task:** `npm test` → `npm run lint` → `npm run build` → `npx tsc --noEmit`.
- **`npx tsc --noEmit` is only meaningful AFTER `npm run build`.** `PageProps`/`LayoutProps` are Next-generated globals emitted to `.next/types/routes.d.ts`; on a fresh clone tsc reports 15 spurious `TS2304: Cannot find name 'PageProps'` errors. Always build first.
- **Do not commit.** The repo's `AGENTS.md` rule 15 forbids committing without an explicit human go-ahead. Every "commit" step below is marked GATED — prepare the change, stage nothing, and report.

---

### Task 1: Vitest harness + shared test render helper

Nothing else can be verified without this, so it goes first.

**Files:**
- Modify: `package.json` (add `test` scripts + devDependencies)
- Create: `vitest.config.ts` (currently 0 bytes)
- Create: `src/tests/setup.ts` (new file — update `file-structure.md` in Task 10)
- Create: `src/lib/utils/cn.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the `describe`/`it`/`expect` globals for every later test file, plus the `test`, `test:watch`, and `test:coverage` npm scripts.

> `src/tests/test-utils.tsx` stays 0 bytes in this phase. It is documented in
> `file-structure.md` as a future shared-render helper, but no test in this plan
> needs a shared wrapper (i18n is passed as props, not context), so creating it
> now would be unused infrastructure. Add it when a test genuinely needs it.

- [ ] **Step 1: Install devDependencies**

```bash
npm install -D vitest@^3.2.4 @vitejs/plugin-react@^5.0.4 jsdom@^26.1.0 \
  @testing-library/react@^16.3.0 @testing-library/jest-dom@^6.9.1 \
  @testing-library/user-event@^14.6.1
```

`package-lock.json` is committed by this project (code-standards §Dependencies), so the lockfile change is expected in `git status`.

> The pins above are deliberate, not arbitrary — they are the newest versions
> that are mutually compatible today. `@vitejs/plugin-react@6` requires
> `vite@^8` and `@vitejs/plugin-react@5.1+` pulls optional peers like
> `oxc-transform-react`; meanwhile `vitest@3.2.x` bundles `vite@^5 || ^6 || ^7`.
> Installing `@vitejs/plugin-react` unpinned would resolve to `6.x` and fail peer
> resolution against vitest's vite. Likewise `vitest@5` requires `vite@^8` and
> would force the plugin to `6.x` as well. Do not "upgrade to latest" these
> without checking the peer ranges.
>
> `@testing-library/jest-dom@^6` (not `^7`) pairs with this `@testing-library/react@^16` line.

- [ ] **Step 2: Add test scripts to `package.json`**

Insert alongside the existing `dev`/`build`/`start`/`lint` entries, preserving their exact style:

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 3: Write `vitest.config.ts`**

```ts
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest config.
 *
 * The `@` alias mirrors `tsconfig.json`'s `paths` (`@/*` -> `./src/*`); without
 * it every `@/...` import in a test fails to resolve.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
```

- [ ] **Step 4: Write `src/tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Write the harness smoke test `src/lib/utils/cn.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("joins plain strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values and keeps 0", () => {
    expect(cn("a", null, undefined, false, "", "b")).toBe("a b");
    expect(cn("n-", 0)).toBe("n- 0");
  });

  it("keeps keys whose flag is truthy", () => {
    expect(cn({ "is-open": true, "is-closed": false })).toBe("is-open");
  });

  it("flattens nested arrays", () => {
    expect(cn(["a", ["b", { c: true }]])).toBe("a b c");
  });
});
```

- [ ] **Step 6: Verify**

Run: `npm test`
Expected: 4 tests pass in `cn.test.ts`.

---

### Task 2: Status colour tokens

Closes the gap `context/ui-context.md:26-30` left open — it mandates a muted amber for Pending and says "pick one and use it everywhere", but never named one, and `globals.css` had no amber token.

**Files:**
- Modify: `src/app/[locale]/globals.css` (inside the existing `@theme` block, after the shape/spacing section)
No test file: `@theme` tokens are not unit-testable. The verification for this
task is measurement — the ratios are computed below and the results are recorded
in Task 10's `ui-context.md` edit. The only automated check is Step 2's build,
which catches a malformed `@theme` block.

**Interfaces:**
- Consumes: nothing.
- Produces: three Tailwind colour utilities `text-success`, `bg-success`, `border-success`, and the same for `pending` and `locked`.

- [ ] **Step 1: Add the tokens**

Append inside `@theme { ... }`, after the `/* ---- Shape & spacing ---- */` section:

```css
  /* ---- Status colours ----
     `context/ui-context.md` fixes the mapping — Verified/Confirmed/Available ->
     success, Pending/awaiting-review -> pending, Locked/Cancelled/Suspended ->
     locked — and required "one muted amber" for pending without ever naming it.
     These are that pick.

     All three are text-safe: measured >= 4.5:1 against both
     `--color-surface-container-lowest` (#ffffff) and the `--color-surface-container`
     (#e8edff) pill tint used by `ui/badge.tsx`, so a status pill needs no bespoke
     dark background.

     The brand green #36B373 from the design system is deliberately NOT a token
     here. Measured it is 2.67:1 on white — it fails WCAG AA as text and as a
     fill under white text — so it stays reserved for non-text decoration (icons,
     chart marks) where the text-contrast rule does not apply.
     `--color-tertiary-container` (#006844, 6.85:1 with white) remains the green
     that can carry white text. */
  --color-success: #1c7a4f;
  --color-pending: #8a5a00;
  --color-locked: #5f6470;
```

- [ ] **Step 2: Verify the build still passes**

Run: `npm run build`
Expected: succeeds. The 7 already-built marketing pages must be visually unchanged — these are *additions* to `@theme`, no existing token was retuned.

---

### Task 3: Formatters

`src/lib/utils/format.ts` is 0 bytes and is on the documented tree. The dashboard needs money (FCFA), counts, dates, and relative times in both English and French.

**Files:**
- Create: `src/lib/utils/format.ts`
- Create: `src/lib/utils/format.test.ts`

**Interfaces:**
- Consumes: `localeTags`, `Locale` from `@/lib/i18n`; `defaultLocale` for fallback.
- Produces:
  ```ts
  formatCfa(value: number, locale: Locale): string
  formatNumber(value: number, locale: Locale): string
  formatDate(iso: string, locale: Locale): string
  formatRelativeTime(iso: string, locale: Locale, now: Date): string
  ```

- [ ] **Step 1: Write the failing test `src/lib/utils/format.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  formatCfa,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "@/lib/utils/format";

/**
 * Reduces a formatted currency string to its digits and grouping marks only.
 *
 * `Intl` differs by locale in ways that make raw-string assertions brittle:
 * the symbol is a prefix in en ("F CFA 450,000") and a suffix in fr
 * ("450 000 F CFA"), and the grouping separator is a comma in en but a narrow
 * no-break space in fr. Stripping everything but digits/`,`/`.` leaves the
 * grouping convention visible while ignoring both symbol placement and space
 * flavour.
 */
function digits(formatted: string): string {
  return formatted.replace(/[^\d,.]/g, "");
}

describe("formatCfa", () => {
  it("formats XOF with no minor units", () => {
    // XOF has no minor unit, so no decimal ever appears.
    expect(digits(formatCfa(450000, "en"))).toBe("450,000");
  });

  it("groups per locale", () => {
    // en groups with a comma, fr with a narrow no-break space (U+202F).
    expect(digits(formatCfa(1250000, "en"))).toBe("1,250,000");
    expect(digits(formatCfa(1250000, "fr"))).toBe("1\u202f250\u202f000");
  });

  it("carries the currency label", () => {
    expect(formatCfa(450000, "en")).toContain("CFA");
  });

  it("keeps zero and negative values intact", () => {
    expect(digits(formatCfa(0, "en"))).toBe("0");
    expect(formatCfa(-50000, "en")).toContain("-");
  });
});

describe("formatNumber", () => {
  it("formats a plain count", () => {
    expect(formatNumber(4, "en")).toBe("4");
    expect(formatNumber(1234, "en").replace(/,/g, "")).toBe("1234");
  });
});

describe("formatDate", () => {
  it("renders a stable ISO date", () => {
    expect(formatDate("2026-03-14T09:00:00.000Z", "en")).toBe("Mar 14, 2026");
    expect(formatDate("2026-03-14T09:00:00.000Z", "fr")).toContain("2026");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-03-14T12:00:00.000Z");

  it("describes recent instants in the past", () => {
    const twoHoursAgo = new Date("2026-03-14T10:00:00.000Z").toISOString();
    expect(formatRelativeTime(twoHoursAgo, "en", now)).toContain("2");
  });

  it("is locale-dependent", () => {
    const twoHoursAgo = new Date("2026-03-14T10:00:00.000Z").toISOString();
    expect(formatRelativeTime(twoHoursAgo, "fr", now)).not.toBe(
      formatRelativeTime(twoHoursAgo, "en", now),
    );
  });

  it("reports days for distant instants", () => {
    const threeDaysAgo = new Date("2026-03-11T12:00:00.000Z").toISOString();
    expect(formatRelativeTime(threeDaysAgo, "en", now)).toContain("3");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- format`
Expected: FAIL — `Failed to resolve import "@/lib/utils/format"`.

- [ ] **Step 3: Implement `src/lib/utils/format.ts`**

```ts
import { defaultLocale, localeTags, type Locale } from "@/lib/i18n";

/**
 * Display formatters for the owner's surfaces.
 *
 * Owns: turning stored numbers and ISO strings into locale-aware display text —
 * West/Central African CFA franc amounts, plain counts, calendar dates, and
 * relative times.
 * Does not own: any network call, any currency conversion, or rate logic. These
 * are pure display helpers; the money *arithmetic* lives with the domain that
 * owns it (see `context/code-standards.md` — no business logic in the render
 * layer), and the raw integer amounts stay the single source of truth.
 *
 * `now` is a parameter on the relative formatter rather than read from the clock
 * so that callers and tests are deterministic.
 */

function tag(locale: Locale): string {
  return localeTags[locale] ?? localeTags[defaultLocale];
}

export function formatCfa(value: number, locale: Locale): string {
  return new Intl.NumberFormat(tag(locale), {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(tag(locale)).format(value);
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(tag(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

export function formatRelativeTime(iso: string, locale: Locale, now: Date): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return iso;

  const deltaMs = then.getTime() - now.getTime();
  const formatter = new Intl.RelativeTimeFormat(tag(locale), { numeric: "auto" });

  for (const [unit, msPerUnit] of RELATIVE_UNITS) {
    if (Math.abs(deltaMs) >= msPerUnit) {
      return formatter.format(Math.round(deltaMs / msPerUnit), unit);
    }
  }

  return formatter.format(Math.round(deltaMs / 1000), "second");
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- format`
Expected: PASS, 10 tests.

> If the `"not.toContain('.00')"` assertion fails because a runtime inserts a narrow no-break space or because `Intl` emits `.00`, loosen it to assert on the absence of a decimal *grouping* rather than the literal string. Do not weaken the other assertions.

- [ ] **Step 5: Commit — GATED**

Do not commit. `AGENTS.md` rule 15. Report the change set instead.

---

### Task 4: Domain types + owner dashboard data

Mirrors the `src/lib/marketing/*` seam: typed static data shaped like the API response, so wiring a fetch later touches only this file.

**Files:**
- Create: `src/lib/domain/property.ts`
- Create: `src/lib/owner/dashboard.ts`
- Create: `src/lib/owner/dashboard.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  ```ts
  // @/lib/domain/property
  export const propertyStatuses: readonly PropertyStatus[]  // 6 members
  export type PropertyStatus = "draft" | "pending_review" | "active" | "locked" | "sold" | "rented"
  export type TransactionType = "sale" | "rent" | "flexible_rent"
  export type OwnerProperty = { id, title, transactionType, status, district, priceCfa,
                               bedrooms, areaSqm, isVerified, views30d, updatedAtIso, image, imageAlt }
  export type OwnerActivity = { id, kind, titleKey, occurredAtIso, amountCfa? }
  export type OwnerStat = { id, labelKey, kind, icon, valueCfa?, value?, unit? }
  // @/lib/owner/dashboard
  export const OWNER_PROPERTIES: readonly OwnerProperty[]
  export const OWNER_STATS: readonly OwnerStat[]
  export const OWNER_ACTIVITY: readonly OwnerActivity[]
  ```

- [ ] **Step 1: Write the failing test `src/lib/owner/dashboard.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { propertyStatuses, type PropertyStatus } from "@/lib/domain/property";
import {
  OWNER_ACTIVITY,
  OWNER_PROPERTIES,
  OWNER_STATS,
} from "@/lib/owner/dashboard";

describe("owner dashboard data", () => {
  it("uses only statuses the badge can render", () => {
    const allowed = new Set<string>(propertyStatuses);
    for (const property of OWNER_PROPERTIES) {
      expect(allowed.has(property.status), `${property.id} -> ${property.status}`).toBe(true);
    }
  });

  it("gives every property a unique id", () => {
    const ids = OWNER_PROPERTIES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least one property in each badge-relevant status", () => {
    const present = new Set<PropertyStatus>(OWNER_PROPERTIES.map((p) => p.status));
    expect(present.has("active")).toBe(true);
    expect(present.has("pending_review")).toBe(true);
    expect(present.has("locked")).toBe(true);
  });

  it("requires non-negative prices and views", () => {
    for (const property of OWNER_PROPERTIES) {
      expect(property.priceCfa).toBeGreaterThan(0);
      expect(property.views30d).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps stat ids unique", () => {
    const ids = OWNER_STATS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives each stat either an amount or a count, never neither", () => {
    for (const stat of OWNER_STATS) {
      const hasAmount = typeof stat.valueCfa === "number";
      const hasCount = typeof stat.value === "number";
      expect(hasAmount || hasCount, `${stat.id} has no value`).toBe(true);
    }
  });

  it("gives every activity item a unique id and a valid timestamp", () => {
    const ids = OWNER_ACTIVITY.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of OWNER_ACTIVITY) {
      expect(Number.isNaN(new Date(item.occurredAtIso).getTime())).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- owner/dashboard`
Expected: FAIL — cannot resolve `@/lib/domain/property` / `@/lib/owner/dashboard`.

- [ ] **Step 3: Write `src/lib/domain/property.ts`**

```ts
/**
 * Property domain types shared by the owner's surfaces.
 *
 * Owns: the vocabulary of a property as this frontend models it — status,
 * transaction type, and the record shapes the owner dashboard renders.
 * Does not own: DTOs from the Core API. Those are machine-generated into
 * `src/lib/domain/generated/` from the backend's OpenAPI spec via
 * `scripts/generate-api-types.mjs` and are never hand-written here — see
 * `context/code-standards.md` §Shared types and file-structure.md rule 4.
 *
 * These are the hand-written domain objects those generated types map *onto*,
 * which is why the row→domain mapping lives here in one place rather than
 * being scattered across components.
 */

/** Lifecycle of a listing. Keep in sync with the `properties.status` enum. */
export const propertyStatuses = [
  "draft",
  "pending_review",
  "active",
  "locked",
  "sold",
  "rented",
] as const;

export type PropertyStatus = (typeof propertyStatuses)[number];

/** How a property is offered. Mirrors `properties.transaction_type`. */
export const transactionTypes = ["sale", "rent", "flexible_rent"] as const;

export type TransactionType = (typeof transactionTypes)[number];

export type OwnerProperty = {
  id: string;
  title: string;
  transactionType: TransactionType;
  status: PropertyStatus;
  district: string;
  /** Whole CFA francs. XOF has no minor unit, so this is always an integer. */
  priceCfa: number;
  bedrooms: number;
  areaSqm: number;
  isVerified: boolean;
  views30d: number;
  /** ISO 8601, UTC. */
  updatedAtIso: string;
  /** Path under `/public/images/listings/`. */
  image: string;
  /** Required: the listing grid is icon-and-text, never image-only. */
  imageAlt: string;
};

export type OwnerStatKind = "money" | "count";

export type OwnerStat = {
  id: string;
  /** Key into the `owner` i18n namespace. */
  labelKey: string;
  kind: OwnerStatKind;
  /** Material Symbols ligature name. */
  icon: string;
  /** Present when `kind === "money"`. */
  valueCfa?: number;
  /** Present when `kind === "count"`. */
  value?: number;
  /** Set on counts that are ratios, so the card renders "78%". */
  unit?: "percent";
};

export type OwnerActivityKind = "booking" | "payment" | "message" | "verification";

export type OwnerActivity = {
  id: string;
  kind: OwnerActivityKind;
  /** Key into the `owner` i18n namespace. */
  titleKey: string;
  /** ISO 8601, UTC. */
  occurredAtIso: string;
  /** Present for `payment` and `booking` kinds. */
  amountCfa?: number;
};
```

- [ ] **Step 4: Write `src/lib/owner/dashboard.ts`**

Use this exact content — the i18n keys named here MUST exist by Task 5:

```ts
import type { OwnerActivity, OwnerProperty, OwnerStat } from "@/lib/domain/property";

/**
 * Static owner-dashboard content.
 *
 * Owns: the mock records the `/[locale]/owner` dashboard renders before the Core
 * API exists. The shapes mirror the API response, so replacing this with a fetch
 * is a change to this file only — the same seam `src/lib/marketing/home.ts` uses
 * for the public site (see file-structure.md §3).
 * Does not own: any real authorization or ownership check. Every record here
 * belongs to one hard-coded owner id; the real per-owner scoping is server-side
 * in the Core API (`context/security.md` §RBAC), never in this file.
 *
 * `updatedAtIso` / `occurredAtIso` are fixed absolute instants rather than
 * offsets from "now", so a rendered dashboard does not churn between requests.
 * The relative-time formatter is called with an explicit `now` for the same
 * reason.
 */

export const OWNER_STATS: readonly OwnerStat[] = [
  { id: "active", labelKey: "owner.dashboard.stats.active", kind: "count", icon: "home_work", value: 6 },
  { id: "pending", labelKey: "owner.dashboard.stats.pending", kind: "count", icon: "hourglass_top", value: 2 },
  { id: "occupancy", labelKey: "owner.dashboard.stats.occupancy", kind: "count", icon: "donut_large", value: 78, unit: "percent" },
  { id: "revenue", labelKey: "owner.dashboard.stats.revenue", kind: "money", icon: "payments", valueCfa: 8400000 },
];

export const OWNER_PROPERTIES: readonly OwnerProperty[] = [
  {
    id: "prop-cocody-villa",
    title: "Villa Cocody Ambassades",
    transactionType: "sale",
    status: "active",
    district: "Cocody",
    priceCfa: 145000000,
    bedrooms: 5,
    areaSqm: 420,
    isVerified: true,
    views30d: 1284,
    updatedAtIso: "2026-10-02T08:30:00.000Z",
    image: "/images/listings/properties-01.jpg",
    imageAlt:
      "Contemporary villa facade in Cocody with a walled garden and mature trees",
  },
  {
    id: "prop-plateau-duplex",
    title: "Duplex Le Magnolia",
    transactionType: "rent",
    status: "active",
    district: "Cocody Danga",
    priceCfa: 750000,
    bedrooms: 4,
    areaSqm: 310,
    isVerified: true,
    views30d: 902,
    updatedAtIso: "2026-10-01T14:10:00.000Z",
    image: "/images/listings/properties-02.jpg",
    imageAlt:
      "Duplex in Cocody Danga with a double-height living room and planted terrace",
  },
  {
    id: "prop-yopougon-studio",
    title: "Studio Résidence La Baie",
    transactionType: "flexible_rent",
    status: "pending_review",
    district: "Yopougon Niangon",
    priceCfa: 180000,
    bedrooms: 1,
    areaSqm: 42,
    isVerified: false,
    views30d: 145,
    updatedAtIso: "2026-09-28T11:45:00.000Z",
    image: "/images/listings/properties-03.jpg",
    imageAlt:
      "Compact studio apartment in Yopougon with a kitchenette and large window",
  },
  {
    id: "prop-bietry-penthouse",
    title: "Penthouse Marina Biétry",
    transactionType: "sale",
    status: "locked",
    district: "Biétry Marina",
    priceCfa: 210000000,
    bedrooms: 4,
    areaSqm: 350,
    isVerified: true,
    views30d: 2140,
    updatedAtIso: "2026-09-20T09:00:00.000Z",
    image: "/images/listings/rentals-01.jpg",
    imageAlt:
      "Penthouse living space at Biétry Marina with floor-to-ceiling lagoon windows",
  },
  {
    id: "prop-marcory-terrace",
    title: "Appartement Terrasse Marcory",
    transactionType: "rent",
    status: "rented",
    district: "Marcory Zone 4",
    priceCfa: 520000,
    bedrooms: 3,
    areaSqm: 165,
    isVerified: true,
    views30d: 640,
    updatedAtIso: "2026-09-15T16:20:00.000Z",
    image: "/images/listings/rentals-02.jpg",
    imageAlt:
      "Three-bedroom apartment in Marcory with a corner terrace and fitted kitchen",
  },
];

export const OWNER_ACTIVITY: readonly OwnerActivity[] = [
  {
    id: "act-1",
    kind: "payment",
    titleKey: "owner.dashboard.activity.paymentReceived",
    amountCfa: 750000,
    occurredAtIso: "2026-10-04T09:15:00.000Z",
  },
  {
    id: "act-2",
    kind: "booking",
    titleKey: "owner.dashboard.activity.viewingRequested",
    occurredAtIso: "2026-10-03T15:40:00.000Z",
  },
  {
    id: "act-3",
    kind: "verification",
    titleKey: "owner.dashboard.activity.submittedForReview",
    occurredAtIso: "2026-10-01T08:05:00.000Z",
  },
  {
    id: "act-4",
    kind: "message",
    titleKey: "owner.dashboard.activity.newMessage",
    occurredAtIso: "2026-09-29T19:30:00.000Z",
  },
];
```

- [ ] **Step 5: Verify the image paths exist**

```bash
ls public/images/listings/
```

The five `image` values above already point at files verified to exist:
`properties-01/02/03.jpg` and `rentals-01/02.jpg`. If a name above no longer
resolves, re-run `ls` and substitute a real filename — do not invent new image
files and do not ship a dashboard with broken images.

`rentals-03.jpg` is intentionally unused: the five mock rows already need five
distinct images, and reusing a sixth would only add another 404 to check.

- [ ] **Step 6: Run to verify it passes**

Run: `npm test -- owner/dashboard`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit — GATED**

---

### Task 5: `owner` and `common` i18n namespaces

`src/lib/i18n/messages/owner.ts` and `common.ts` are 0 bytes, and `src/lib/i18n/index.ts:56-59` registers only `auth` and `marketing`.

**Files:**
- Create: `src/lib/i18n/messages/owner.ts`
- Create: `src/lib/i18n/messages/common.ts`
- Modify: `src/lib/i18n/index.ts` (imports, `messages` record, re-exported key types)
- Create: `src/lib/i18n/owner-messages.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `t(locale, "owner", key)` and `t(locale, "common", key)`; `OwnerKey`, `CommonKey` types. New namespaces `"owner"` and `"common"` added to the `Namespace` union.

- [ ] **Step 1: Write the failing test `src/lib/i18n/owner-messages.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { locales, t, type Locale } from "@/lib/i18n";
import { owner } from "@/lib/i18n/messages/owner";
import { common } from "@/lib/i18n/messages/common";
import {
  OWNER_ACTIVITY,
  OWNER_PROPERTIES,
  OWNER_STATS,
} from "@/lib/owner/dashboard";

/** Locales this phase actually ships copy for; the rest fall back to English. */
const shipped: Locale[] = ["en", "fr"];

/**
 * Every key the owner data can ask for, derived rather than hand-listed, so a
 * new record added to `lib/owner/dashboard` is covered automatically.
 */
const derivedKeys = [
  ...OWNER_STATS.map((stat) => stat.labelKey),
  ...OWNER_ACTIVITY.map((item) => item.titleKey),
  ...OWNER_PROPERTIES.map((property) => `owner.status.${property.status}`),
  ...OWNER_PROPERTIES.map((property) => `owner.transaction.${property.transactionType}`),
];

describe("owner i18n namespace", () => {
  it.each(shipped)("resolves every data-derived owner key in %s", (locale) => {
    for (const key of derivedKeys) {
      expect(t(locale, "owner", key), `${locale}:${key}`).not.toBe(key);
    }
  });

  it("resolves every static owner key the components ask for", () => {
    const staticKeys = [
      "owner.nav.dashboard",
      "owner.nav.properties",
      "owner.nav.rentals",
      "owner.nav.messages",
      "owner.nav.payments",
      "owner.nav.profile",
      "owner.dashboard.title",
      "owner.dashboard.greeting",
      "owner.dashboard.subtitle",
      "owner.dashboard.stats.active",
      "owner.dashboard.stats.pending",
      "owner.dashboard.stats.occupancy",
      "owner.dashboard.stats.revenue",
      "owner.dashboard.activity.title",
      "owner.dashboard.listings.title",
      "owner.dashboard.listings.empty",
      "owner.dashboard.listings.column.property",
      "owner.dashboard.listings.column.price",
      "owner.dashboard.listings.column.status",
      "owner.dashboard.listings.column.views",
      "owner.dashboard.listings.column.updated",
      "owner.dashboard.actions.addProperty",
      "owner.dashboard.actions.addRental",
      "owner.dashboard.actions.viewAll",
      "owner.stats.percent",
    ];
    for (const locale of shipped) {
      for (const key of staticKeys) {
        expect(t(locale, "owner", key), `${locale}:${key}`).not.toBe(key);
      }
    }
  });

  it("has identical key sets in English and French", () => {
    expect(Object.keys(owner.fr).sort()).toEqual(Object.keys(owner.en).sort());
    expect(Object.keys(common.fr).sort()).toEqual(Object.keys(common.en).sort());
  });

  it("never returns an empty string in any shipped locale", () => {
    for (const locale of shipped) {
      for (const key of Object.keys(owner.en)) {
        expect(t(locale, "owner", key).length, `${locale}:${key}`).toBeGreaterThan(0);
      }
      for (const key of Object.keys(common.en)) {
        expect(t(locale, "common", key).length, `${locale}:${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("falls back to English in the locales that ship no owner copy", () => {
    const fallback = locales.filter((locale) => !shipped.includes(locale));
    expect(fallback.length).toBeGreaterThan(0);
    for (const locale of fallback) {
      expect(t(locale, "owner", "owner.dashboard.title")).toBe(
        owner.en["owner.dashboard.title"],
      );
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- owner-messages`
Expected: FAIL — `@/lib/i18n/messages/owner` has no exported member.

- [ ] **Step 3: Write `src/lib/i18n/messages/owner.ts`**

```ts
/**
 * Property-owner surface copy.
 *
 * English and French only so far — Portuguese, Arabic, and Swahili are required
 * by `context/ui-context.md` (F11) and land with the remaining locales. `t()`
 * falls back to English per key, so a missing translation degrades to readable
 * copy rather than a raw key.
 *
 * The dashboard's `labelKey` / `titleKey` values in `src/lib/owner/dashboard.ts`
 * must resolve here — `owner-messages.test.ts` fails the build otherwise.
 */

export const owner = {
  en: {
    "owner.nav.dashboard": "Dashboard",
    "owner.nav.properties": "Properties",
    "owner.nav.rentals": "Rentals",
    "owner.nav.messages": "Messages",
    "owner.nav.payments": "Payments",
    "owner.nav.profile": "Profile",

    "owner.dashboard.title": "Owner dashboard",
    "owner.dashboard.greeting": "Welcome back",
    "owner.dashboard.subtitle":
      "Your listings, occupancy, and escrow payouts across Abidjan.",

    "owner.dashboard.stats.active": "Active listings",
    "owner.dashboard.stats.pending": "Awaiting review",
    "owner.dashboard.stats.occupancy": "Occupancy rate",
    "owner.dashboard.stats.revenue": "Revenue this month",

    "owner.dashboard.activity.title": "Recent activity",
    "owner.dashboard.activity.paymentReceived": "Escrow payment received",
    "owner.dashboard.activity.viewingRequested": "Viewing requested",
    "owner.dashboard.activity.submittedForReview": "Listing submitted for review",
    "owner.dashboard.activity.newMessage": "New message from a tenant",

    "owner.dashboard.listings.title": "Your listings",
    "owner.dashboard.listings.empty":
      "You have no listings yet. Add your first property to get started.",
    "owner.dashboard.listings.column.property": "Property",
    "owner.dashboard.listings.column.price": "Price",
    "owner.dashboard.listings.column.status": "Status",
    "owner.dashboard.listings.column.views": "Views (30d)",
    "owner.dashboard.listings.column.updated": "Updated",

    "owner.dashboard.actions.addProperty": "Add property",
    "owner.dashboard.actions.addRental": "Add rental unit",
    "owner.dashboard.actions.viewAll": "View all",

    "owner.status.draft": "Draft",
    "owner.status.pending_review": "Pending review",
    "owner.status.active": "Active",
    "owner.status.locked": "Locked",
    "owner.status.sold": "Sold",
    "owner.status.rented": "Rented",

    "owner.transaction.sale": "For sale",
    "owner.transaction.rent": "For rent",
    "owner.transaction.flexible_rent": "Flexible rental",

    "owner.stats.percent": "%",
  },
  fr: {
    "owner.nav.dashboard": "Tableau de bord",
    "owner.nav.properties": "Biens",
    "owner.nav.rentals": "Locations",
    "owner.nav.messages": "Messagerie",
    "owner.nav.payments": "Paiements",
    "owner.nav.profile": "Profil",

    "owner.dashboard.title": "Tableau de bord propriétaire",
    "owner.dashboard.greeting": "Bon retour",
    "owner.dashboard.subtitle":
      "Vos biens, votre taux d'occupation et vos versements sous séquestre à Abidjan.",

    "owner.dashboard.stats.active": "Biens actifs",
    "owner.dashboard.stats.pending": "En cours de vérification",
    "owner.dashboard.stats.occupancy": "Taux d'occupation",
    "owner.dashboard.stats.revenue": "Revenus du mois",

    "owner.dashboard.activity.title": "Activité récente",
    "owner.dashboard.activity.paymentReceived": "Paiement sous séquestre reçu",
    "owner.dashboard.activity.viewingRequested": "Visite demandée",
    "owner.dashboard.activity.submittedForReview": "Bien soumis à vérification",
    "owner.dashboard.activity.newMessage": "Nouveau message d'un locataire",

    "owner.dashboard.listings.title": "Vos biens",
    "owner.dashboard.listings.empty":
      "Vous n'avez pas encore de biens. Ajoutez votre premier bien pour commencer.",
    "owner.dashboard.listings.column.property": "Bien",
    "owner.dashboard.listings.column.price": "Prix",
    "owner.dashboard.listings.column.status": "Statut",
    "owner.dashboard.listings.column.views": "Vues (30 j)",
    "owner.dashboard.listings.column.updated": "Mis à jour",

    "owner.dashboard.actions.addProperty": "Ajouter un bien",
    "owner.dashboard.actions.addRental": "Ajouter une unité",
    "owner.dashboard.actions.viewAll": "Tout voir",

    "owner.status.draft": "Brouillon",
    "owner.status.pending_review": "En vérification",
    "owner.status.active": "Actif",
    "owner.status.locked": "Verrouillé",
    "owner.status.sold": "Vendu",
    "owner.status.rented": "Loué",

    "owner.transaction.sale": "À vendre",
    "owner.transaction.rent": "À louer",
    "owner.transaction.flexible_rent": "Location flexible",

    "owner.stats.percent": "%",
  },
} as const;

/** Keys the owner surface can ask for. */
export type OwnerKey = keyof (typeof owner)["en"];
```

- [ ] **Step 4: Write `src/lib/i18n/messages/common.ts`**

```ts
/**
 * Labels shared by more than one role's screens.
 *
 * Owns: strings that are genuinely cross-role — the shell chrome and the
 * affordances the tenant, owner, hotel-owner, and admin sections all render.
 * Does not own: page copy. A label used by exactly one role goes in that role's
 * namespace (`owner.ts`, `account.ts`, `hotel.ts`, `admin.ts`) per
 * file-structure.md rule 2.
 *
 * Deliberate omission: `marketing.ts` already carries its own `common.pagination`,
 * `common.of`, `common.previous`, and `common.next` keys for the public browse
 * pages. They are NOT duplicated here — one string gets one home, and a second
 * copy would be free to drift. The browse pages keep calling the `marketing`
 * namespace for those four; when the public surface is next revisited they should
 * move here in one pass, together.
 */

export const common = {
  en: {
    "common.appName": "Annorent",
    "common.skipToContent": "Skip to main content",
    "common.primaryNavigation": "Primary",
    "common.mainContent": "Main content",
    "common.loading": "Loading",
    "common.retry": "Try again",
    "common.signOut": "Sign out",
    "common.language": "Language",
  },
  fr: {
    "common.appName": "Annorent",
    "common.skipToContent": "Aller au contenu principal",
    "common.primaryNavigation": "Navigation principale",
    "common.mainContent": "Contenu principal",
    "common.loading": "Chargement",
    "common.retry": "Réessayer",
    "common.signOut": "Se déconnecter",
    "common.language": "Langue",
  },
} as const;

/** Keys the shared labels can be asked for. */
export type CommonKey = keyof (typeof common)["en"];
```

- [ ] **Step 5: Register both namespaces in `src/lib/i18n/index.ts`**

After the `marketing` import (line 14):

```ts
import { common, type CommonKey } from "./messages/common";
import { owner, type OwnerKey } from "./messages/owner";
```

Replace the `messages` record (lines 56-59) with:

```ts
const messages = {
  auth: auth as unknown as PartialLocaleMessages,
  marketing: marketing as unknown as PartialLocaleMessages,
  owner: owner as unknown as PartialLocaleMessages,
  common: common as unknown as PartialLocaleMessages,
} satisfies Record<string, PartialLocaleMessages>;
```

Replace the final re-export (line 74) with:

```ts
export type { AuthKey, CommonKey, MarketingKey, OwnerKey };
```

- [ ] **Step 6: Run to verify it passes**

Run: `npm test`
Expected: all suites PASS — `cn`, `format`, `owner/dashboard`, `owner-messages`.

- [ ] **Step 7: Commit — GATED**

---

### Task 6: Shared UI primitives

All ten `src/components/ui/*` files are 0 bytes. This task fills the four the
dashboard consumes (`button`, `card`, `badge`, `table`) plus `skeleton`;
`input`, `select`, `modal`, `tabs`, `toast` stay 0-byte until something needs
them (YAGNI).

`Skeleton` is the one exception to "only what the dashboard consumes": it is a
shared primitive with no caller in this slice. It is included because it is
cheap, it is listed on the documented tree, and rule 18 treats an out-of-date
structure doc as a bug — but if you would rather keep the diff strictly
load-bearing, skip `skeleton.tsx` here and leave it 0-byte like the others.
Say which you are doing rather than deciding silently.

**Files:**
- Create: `src/components/ui/button.tsx` + `button.test.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx` + `badge.test.tsx`
- Create: `src/components/ui/table.tsx`
- Create: `src/components/ui/skeleton.tsx` (documented on the tree; see the note
  below on why it lands here despite nothing consuming it yet)

**Interfaces:**
- Consumes: `cn` from `@/lib/utils/cn`; the `--color-*` scale from `globals.css`.
- Produces:
  ```ts
  // ui/button
  export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
  export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant; size?: "sm" | "md" }): React.JSX.Element
  // ui/card
  export function Card(props: { className?: string; children: React.ReactNode }): React.JSX.Element
  // ui/badge
  export type BadgeTone = "success" | "pending" | "locked" | "neutral"
  export function Badge(props: { tone: BadgeTone; children: React.ReactNode; className?: string }): React.JSX.Element
  // ui/table
  export function Table(props: { className?: string; children: React.ReactNode }): React.JSX.Element
  // ui/skeleton
  export function Skeleton(props: { className?: string }): React.JSX.Element
  ```

- [ ] **Step 1: Write the failing test `src/components/ui/badge.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it.each([
    ["success", "text-success"],
    ["pending", "text-pending"],
    ["locked", "text-locked"],
    ["neutral", "text-on-surface-variant"],
  ] as const)("maps %s tone to %s", (tone, expected) => {
    render(<Badge tone={tone}>Label</Badge>);
    expect(screen.getByText("Label")).toHaveClass(expected);
  });

  it("renders its label as text, so status is never colour-only", () => {
    render(<Badge tone="pending">Pending review</Badge>);
    expect(screen.getByText("Pending review")).toBeVisible();
  });

  it("merges an incoming className without dropping the tone class", () => {
    render(
      <Badge tone="locked" className="mt-2">
        Locked
      </Badge>,
    );
    const badge = screen.getByText("Locked");
    expect(badge).toHaveClass("text-locked");
    expect(badge).toHaveClass("mt-2");
  });
});
```

- [ ] **Step 2: Write the failing test `src/components/ui/button.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("defaults to type=button so it cannot submit an outer form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("applies a variant and size class", () => {
    render(<Button variant="ghost" size="sm">Cancel</Button>);
    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button.className).toContain("text-primary");
    expect(button.className).toContain("h-9");
  });

  it("honours an explicit type", () => {
    render(<Button type="submit">Go</Button>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute("type", "submit");
  });

  it("forwards disabled", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });
});
```

- [ ] **Step 3: Run to verify both fail**

Run: `npm test -- ui/`
Expected: FAIL — cannot resolve `@/components/ui/badge`, `@/components/ui/button`.

- [ ] **Step 4: Implement `src/components/ui/badge.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Status pill.
 *
 * Owns: the one status-to-colour mapping the whole product shares —
 * `context/ui-context.md` fixes Verified/Confirmed/Available to success,
 * Pending/awaiting-review to pending, and Locked/Cancelled/Suspended to locked,
 * and requires that convention be identical on listings, bookings, reservations,
 * and users. Status is carried by the label text as well as the colour, so it is
 * never conveyed by colour alone.
 *
 * Does not own: what a status *means* for a given entity, or any transition
 * between statuses — it only renders one.
 *
 * The four tones map onto the three status tokens added to `globals.css` plus
 * the existing neutral, on a `bg-surface-container` (`#e8edff`) pill. Measured
 * contrast for that exact pairing:
 *
 * | tone | on pill   | on white |
 * |------|-----------|----------|
 * | success     | 4.56:1 | 5.32:1 |
 * | pending     | 5.08:1 | 5.93:1 |
 * | locked      | 5.08:1 | 5.93:1 |
 * | neutral     | 8.02:1 | 9.36:1 |
 *
 * All clear 4.5:1 (WCAG AA for normal text), which is why the status colours
 * are new tokens rather than the brand `#36B373` — that measures 2.67:1 on
 * white and fails. Do not swap a tone back to `text-primary` on the assumption
 * that a darker brand reads better; the measured numbers are what the palette
 * was chosen for.
 */

export type BadgeTone = "success" | "pending" | "locked" | "neutral";

const TONE_CLASS: Record<BadgeTone, string> = {
  success: "text-success",
  pending: "text-pending",
  locked: "text-locked",
  neutral: "text-on-surface-variant",
};

export function Badge({
  tone,
  children,
  className,
}: {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1",
        "font-label-sm text-label-sm whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Implement `src/components/ui/button.tsx`**

```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Button.
 *
 * Owns: the four button intents and the two control heights, so every action
 * across all four roles looks and behaves the same.
 * Does not own: icons — callers pass a `<span className="material-symbols-outlined">`
 * as children. Does not own: loading state; a caller that needs one swaps in its
 * own `Skeleton` and sets `disabled`.
 *
 * `type` defaults to `"button"`: most of these sit near unrelated forms, and a
 * default of `"submit"` would silently post them.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-container",
  // The `outline-variant` border measures 1.70:1 against white, which is below
  // the 3:1 that WCAG 1.4.11 (non-text contrast) asks of a control boundary.
  // An outlined button is therefore only safe when its own label carries the
  // affordance, which it does at 9.81:1 — but if a variant ever needs to rely
  // on the border alone, swap it for `border-outline` first.
  secondary: "bg-surface-container-lowest text-primary border border-outline-variant hover:bg-surface-container",
  ghost: "bg-transparent text-primary hover:bg-surface-container",
  danger: "bg-error text-on-error hover:opacity-90",
};

const SIZE_CLASS = {
  sm: "h-9 px-4 text-label-md",
  md: "h-11 px-6 text-label-md",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof SIZE_CLASS;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md",
        "font-label-md transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 6: Implement `src/components/ui/card.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Card.
 *
 * Owns: the elevated surface treatment shared by the dashboard's stat tiles,
 * table panel, and activity feed.
 * Does not own: inner structure. There is deliberately no `CardHeader` /
 * `CardBody` pair — file-structure.md rule 8 allows one exported component per
 * file, and callers compose plain `<div>`s inside `<Card>` instead. Revisit this
 * only if three or more call sites end up repeating the same inner markup.
 */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-container-lowest border border-outline-variant",
        "shadow-[0_4px_20px_rgba(23,43,77,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 7: Implement `src/components/ui/table.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Table surface.
 *
 * Owns: only the frame — rounded, bordered, horizontally scrollable. Callers
 * write their own `<thead>` / `<tbody>` / `<th>` / `<td>` so a table can be a
 * data grid or a definition list without a second component (rule 8).
 * Does not own: column definitions, sorting, or pagination.
 */

export function Table({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-start">{children}</table>
    </div>
  );
}
```

- [ ] **Step 8: Implement `src/components/ui/skeleton.tsx`**

```tsx
import { cn } from "@/lib/utils/cn";

/**
 * Loading placeholder.
 *
 * Owns: a pulsing block matching the shape of content that has not arrived.
 * Does not own: layout. The parent reserves the space — the skeleton only fills
 * it. Every current usage reserves correct dimensions, so nothing shifts when
 * data lands (no layout jump).
 */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-surface-container", className)}
    />
  );
}
```

- [ ] **Step 9: Verify**

Run: `npm test`
Expected: all suites PASS, including the two new component suites.

- [ ] **Step 10: Commit — GATED**

---

### Task 7: Role shell

`src/components/layout/app-shell.tsx` and `role-sidebar.tsx` are both 0 bytes. They go in `layout/` because rule 1 puts anything used by more than one role in a shared folder — `account/`, `hotel/`, and `admin/` all inherit these next.

**Files:**
- Create: `src/components/layout/role-sidebar.tsx` + `role-sidebar.test.tsx`
- Create: `src/components/layout/app-shell.tsx`

**Interfaces:**
- Consumes: `cn`, `Badge`, `Locale`, `t`.
- Produces:
  ```ts
  export type NavItem = { href: string; label: string; icon: string; badgeCount?: number }
  export function RoleSidebar(props: { locale: Locale; items: readonly NavItem[] }): React.JSX.Element
  export function AppShell(props: {
    locale: Locale; items: readonly NavItem[]; children: ReactNode
  }): React.JSX.Element
  ```

- [ ] **Step 1: Write the failing test `src/components/layout/role-sidebar.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RoleSidebar, type NavItem } from "@/components/layout/role-sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr/owner/properties" }));

// `next/link` needs an App Router context that a bare render does not provide;
// a plain anchor exercises the same href/aria-current contract.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const items: NavItem[] = [
  { href: "/fr/owner", label: "Tableau de bord", icon: "dashboard" },
  { href: "/fr/owner/properties", label: "Biens", icon: "home_work", badgeCount: 2 },
  { href: "/fr/owner/rentals", label: "Locations", icon: "desk" },
];

describe("RoleSidebar", () => {
  it("renders a navigation landmark with the provided items", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Biens/ })).toHaveAttribute(
      "href",
      "/fr/owner/properties",
    );
  });

  it("marks the current route with aria-current", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    expect(screen.getByRole("link", { name: /Biens/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /Locations/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("does not mark the dashboard active when a child route is current", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    expect(screen.getByRole("link", { name: /Tableau de bord/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows a badge count when present and omits it otherwise", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByTestId("nav-badge")).toHaveLength(1);
  });

  it("hides the icon from assistive tech and labels the link with text", () => {
    const { container } = render(<RoleSidebar locale="fr" items={items} />);
    expect(container.querySelector(".material-symbols-outlined")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- role-sidebar`
Expected: FAIL — cannot resolve `@/components/layout/role-sidebar`.

- [ ] **Step 3: Implement `src/components/layout/role-sidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { t, type Locale } from "@/lib/i18n";

/**
 * Role sidebar navigation.
 *
 * Owns: rendering one role's navigation list and deciding which entry is
 * current. Shared by all four role sections (`account`, `owner`, `hotel`,
 * `admin`) per file-structure.md rule 1 — each supplies its own `items`, and no
 * role's labels are hardcoded here.
 *
 * Does not own: the nav items themselves (they come from the role's data module),
 * or authorization — it renders links the RBAC guard in the role's `layout.tsx`
 * has already allowed through.
 *
 * A client component only because active-item tracking needs `usePathname`.
 * Marking is exact-match plus a `/`-boundary prefix, so `/owner` does not stay
 * highlighted while the user is on `/owner/properties`.
 */

export type NavItem = {
  /** Already locale-prefixed, e.g. "/fr/owner/properties". */
  href: string;
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  badgeCount?: number;
};

function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function RoleSidebar({
  locale,
  items,
}: {
  locale: Locale;
  items: readonly NavItem[];
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={t(locale, "common", "common.primaryNavigation")}
      className="flex h-full flex-col gap-1 border-inline-end border-outline-variant bg-surface-container-lowest p-4"
    >
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2",
                  "font-label-md transition-colors",
                  current
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
                  <span
                    data-testid="nav-badge"
                    className="rounded-full bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-on-surface-variant"
                  >
                    {item.badgeCount}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

The nav label comes from the `common` namespace (Task 5) rather than being hardcoded, so it resolves in all five locales via the English fallback.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- role-sidebar`
Expected: PASS, 5 tests.

- [ ] **Step 5: Implement `src/components/layout/app-shell.tsx`**

```tsx
import type { ReactNode } from "react";
import { t, type Locale } from "@/lib/i18n";
import { RoleSidebar, type NavItem } from "@/components/layout/role-sidebar";

/**
 * Authenticated application shell.
 *
 * Owns: the chrome every role section renders inside — a sidebar on the inline
 * start edge and a scrollable main column — so `account`, `owner`, `hotel`, and
 * `admin` share one frame instead of four (file-structure.md rule 1).
 *
 * Does not own: which nav items appear (the caller passes them), and the RBAC
 * guard (that lives in each role's `layout.tsx` per rule 12, not here — this shell
 * is shared, so it cannot know the role it is guarding).
 *
 * A server component: it only composes. `RoleSidebar` is the single client
 * island, because active-link tracking is the only interactive part.
 */

export function AppShell({
  locale,
  items,
  children,
}: {
  locale: Locale;
  items: readonly NavItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-72 shrink-0 lg:block">
        <RoleSidebar locale={locale} items={items} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
          <p className="font-headline-sm text-headline-sm text-on-surface">
            {t(locale, "common", "common.appName")}
          </p>
        </header>

        <main
          id="main-content"
          aria-label={t(locale, "common", "common.mainContent")}
          className="flex-1 px-6 py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
```

`AppShell` deliberately omits `LocaleSwitcher` (also 0 bytes, and outside this
task's scope). A header carrying only the wordmark is honest; a half-built
switcher is worse than none. When `locale-switcher.tsx` is implemented, mount it
in the header alongside the wordmark.

- [ ] **Step 6: Write the test `src/components/layout/app-shell.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/layout/app-shell";
import type { NavItem } from "@/components/layout/role-sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/owner" }));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const items: NavItem[] = [{ href: "/en/owner", label: "Dashboard", icon: "dashboard" }];

describe("AppShell", () => {
  it("renders the navigation and the main content landmark", () => {
    render(
      <AppShell locale="en" items={items}>
        <p>Dashboard body</p>
      </AppShell>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders its children inside main", () => {
    render(
      <AppShell locale="en" items={items}>
        <p>Dashboard body</p>
      </AppShell>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveTextContent("Dashboard body");
  });

  it("shows the product name from the common namespace", () => {
    render(
      <AppShell locale="en" items={items}>
        <p>body</p>
      </AppShell>,
    );
    expect(screen.getByText("Annorent")).toBeVisible();
  });
});
```

- [ ] **Step 7: Verify**

Run: `npm test`
Expected: all suites PASS, including the new `app-shell` suite.

- [ ] **Step 8: Commit — GATED**

---

### Task 8: Owner dashboard components

The three widgets plus the page body. Note `src/components/owner/listing-table.tsx` already exists as a 0-byte file with a documented name — reuse it rather than inventing a new one.

**Files:**
- Create: `src/components/owner/dashboard-stat-card.tsx` + test
- Create: `src/components/owner/listing-table.tsx` + test
- Create: `src/components/owner/dashboard-activity-feed.tsx` + test
- Create: `src/components/owner/owner-dashboard.tsx` + `owner-dashboard.test.tsx`

**Interfaces:**
- Consumes: `OwnerStat`/`OwnerProperty`/`OwnerActivity` types; `OWNER_STATS`/`OWNER_PROPERTIES`/`OWNER_ACTIVITY`; `Badge`, `Card`, `Table`, `Skeleton`, `Button`; `formatCfa`, `formatNumber`, `formatDate`, `formatRelativeTime`; `t`.
- Produces: `DashboardStatCard`, `ListingTable`, `DashboardActivityFeed`, `OwnerDashboard`.

- [ ] **Step 1: Write the failing test `src/components/owner/listing-table.test.tsx`**

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingTable } from "@/components/owner/listing-table";
import { OWNER_PROPERTIES } from "@/lib/owner/dashboard";

function rowTitles(): string[] {
  const body = screen.getByRole("tablebody");
  // The property name cell is a <th scope="row">, so its ARIA role is
  // `rowheader`, not `cell`.
  return within(body)
    .getAllByRole("row")
    .map((row) => within(row).getByRole("rowheader").textContent ?? "");
}

describe("ListingTable", () => {
  it("renders one row per property", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    expect(screen.getAllByRole("row")).toHaveLength(OWNER_PROPERTIES.length + 1);
  });

  it("renders a row per property, in data order", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    // A row header cell holds the title plus the transaction-type label, so
    // assert containment rather than exact equality.
    rowTitles().forEach((cell, index) => {
      expect(cell).toContain(OWNER_PROPERTIES[index].title);
    });
  });

  it("gives every column a header and every body row five cells", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    const headerCells = within(screen.getAllByRole("row")[0]).getAllByRole("columnheader");
    expect(headerCells).toHaveLength(5);

    const firstBodyRow = screen.getAllByRole("row")[1];
    // One row header (the property cell) + four data cells.
    expect(within(firstBodyRow).getByRole("rowheader")).toBeInTheDocument();
    expect(within(firstBodyRow).getAllByRole("cell")).toHaveLength(4);
  });

  it("renders a text status badge for every row", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    for (const label of ["Active", "Pending review", "Locked", "Rented"]) {
      expect(screen.getByText(label)).toBeVisible();
    }
  });

  it("labels every thumbnail image", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(OWNER_PROPERTIES.length);
    for (const image of images) {
      expect(image).toHaveAttribute("alt");
      expect(image.getAttribute("alt")).not.toBe("");
    }
  });

  it("shows an empty state instead of a bare table", () => {
    render(<ListingTable locale="en" properties={[]} />);
    expect(
      screen.getByText("You have no listings yet. Add your first property to get started."),
    ).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Write the failing test `src/components/owner/dashboard-stat-card.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardStatCard } from "@/components/owner/dashboard-stat-card";

describe("DashboardStatCard", () => {
  it("renders a money stat as a formatted CFA amount", () => {
    render(
      <DashboardStatCard
        locale="en"
        label="Revenue this month"
        icon="payments"
        valueCfa={8400000}
      />,
    );
    expect(screen.getByText(/8[,. ]?400[,. ]?000/)).toBeVisible();
  });

  it("renders a count stat without a unit suffix", () => {
    render(<DashboardStatCard locale="en" label="Active listings" icon="home_work" value={6} />);
    expect(screen.getByText("6")).toBeVisible();
    // Guard against a percent suffix leaking onto plain counts.
    expect(screen.queryByText(/6%/)).not.toBeInTheDocument();
  });

  it("appends the localized percent unit only when asked", () => {
    render(
      <DashboardStatCard
        locale="en"
        label="Occupancy"
        icon="donut_large"
        value={78}
        unit="percent"
      />,
    );
    expect(screen.getByText("78%")).toBeVisible();
  });

  it("hides the decorative icon from assistive tech", () => {
    const { container } = render(
      <DashboardStatCard locale="en" label="Active listings" icon="home_work" value={6} />,
    );
    expect(container.querySelector(".material-symbols-outlined")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
```

- [ ] **Step 3: Write the failing test `src/components/owner/dashboard-activity-feed.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardActivityFeed } from "@/components/owner/dashboard-activity-feed";
import { OWNER_ACTIVITY } from "@/lib/owner/dashboard";

const NOW = new Date("2026-10-05T12:00:00.000Z");

describe("DashboardActivityFeed", () => {
  it("renders one item per activity", () => {
    render(<DashboardActivityFeed locale="en" items={OWNER_ACTIVITY} now={NOW} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(OWNER_ACTIVITY.length);
  });

  it("translates each item title", () => {
    render(<DashboardActivityFeed locale="en" items={OWNER_ACTIVITY} now={NOW} />);
    expect(screen.getByText("Escrow payment received")).toBeVisible();
  });

  it("shows the amount for a payment item", () => {
    render(<DashboardActivityFeed locale="en" items={OWNER_ACTIVITY} now={NOW} />);
    expect(screen.getByText(/750[,. ]?000/)).toBeVisible();
  });

  it("omits an amount for items that have none", () => {
    render(
      <DashboardActivityFeed
        locale="en"
        items={OWNER_ACTIVITY.filter((a) => a.amountCfa === undefined)}
        now={NOW}
      />,
    );
    expect(screen.queryByText(/750[,. ]?000/)).not.toBeInTheDocument();
  });
});
```

> The `now` prop is deliberate: it makes relative time deterministic instead of depending on when the test runs (Global Constraints).

- [ ] **Step 4: Run to verify they fail**

Run: `npm test -- components/owner`
Expected: FAIL — cannot resolve the three modules.

- [ ] **Step 5: Implement `src/components/owner/dashboard-stat-card.tsx`**

```tsx
import { t, type Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { formatCfa, formatNumber } from "@/lib/utils/format";

/**
 * One figure in the dashboard's stat row.
 *
 * Owns: rendering a single labelled metric — a CFA amount or a plain count —
 * with its decorative icon. The dashboard tiles four of these in a grid.
 *
 * Lives in `components/owner/` per file-structure.md rule 2: only the owner
 * dashboard uses it today. When the tenant or hotel dashboard needs the same
 * tile, this file moves to `components/ui/` in that same PR — do not leave a
 * second copy behind.
 *
 * A server component: the value is already formatted on the server, and an
 * interactive tile is not warranted. The percentage unit is looked up rather than
 * hardcoded so it localizes.
 */

export function DashboardStatCard({
  locale,
  label,
  icon,
  valueCfa,
  value,
  unit,
}: {
  locale: Locale;
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  valueCfa?: number;
  value?: number;
  /** `"percent"` renders the localized percent unit after the number. */
  unit?: "percent";
}) {
  // Exactly one of `valueCfa` / `value` is set. `unit` is opt-in so that plain
  // counts (listings, reviews) never acquire a stray "%".
  const display =
    typeof valueCfa === "number"
      ? formatCfa(valueCfa, locale)
      : `${formatNumber(value ?? 0, locale)}${unit === "percent" ? t(locale, "owner", "owner.stats.percent") : ""}`;

  return (
    <Card className="flex items-start gap-4 p-5">
      <span
        aria-hidden="true"
        className="material-symbols-outlined text-[28px] text-primary"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-label-md text-label-md text-on-surface-variant">{label}</p>
        <p className="mt-1 font-headline-md text-headline-md text-on-surface">{display}</p>
      </div>
    </Card>
  );
}
```

- [ ] **Step 6: Implement `src/components/owner/listing-table.tsx`**

```tsx
import Image from "next/image";
import { t, type Locale } from "@/lib/i18n";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { formatCfa, formatDate } from "@/lib/utils/format";
import type { OwnerProperty, PropertyStatus } from "@/lib/domain/property";

/**
 * The owner's listings table.
 *
 * Owns: rendering one row per property with its thumbnail, price, status, view
 * count, and last-updated date. Rows are not yet links — `properties/[id]/edit`
 * is an unbuilt route, so there is nowhere to point at. Wiring the link is part
 * of that route's task, not this one.
 *
 * Does not own: filtering, sorting, or pagination. The dashboard shows the
 * owner's whole portfolio; those arrive with the properties list route.
 *
 * The status mapping below is the `context/ui-context.md` convention applied to
 * the domain's six states: `draft` and `sold`/`rented` are terminal or
 * not-yet-listed, and render in neutral gray rather than being given a colour of
 * their own.
 */

/** Header labels, in column order — five entries, matching the five cells below. */
const COLUMN_KEYS = [
  "owner.dashboard.listings.column.property",
  "owner.dashboard.listings.column.price",
  "owner.dashboard.listings.column.status",
  "owner.dashboard.listings.column.views",
  "owner.dashboard.listings.column.updated",
] as const;

const STATUS_TONE: Record<PropertyStatus, BadgeTone> = {
  draft: "neutral",
  pending_review: "pending",
  active: "success",
  locked: "locked",
  sold: "neutral",
  rented: "neutral",
};

const STATUS_KEY: Record<PropertyStatus, string> = {
  draft: "owner.status.draft",
  pending_review: "owner.status.pending_review",
  active: "owner.status.active",
  locked: "owner.status.locked",
  sold: "owner.status.sold",
  rented: "owner.status.rented",
};

export function ListingTable({
  locale,
  properties,
}: {
  locale: Locale;
  properties: readonly OwnerProperty[];
}) {
  if (properties.length === 0) {
    return (
      <p className="rounded-lg bg-surface-container px-4 py-8 text-center text-body-md text-on-surface-variant">
        {t(locale, "owner", "owner.dashboard.listings.empty")}
      </p>
    );
  }

  return (
    <Table>
      <thead>
        <tr className="border-b border-outline-variant">
          {COLUMN_KEYS.map((key) => (
            <th
              key={key}
              scope="col"
              className="px-4 py-3 text-start font-label-sm text-label-sm text-on-surface-variant"
            >
              {t(locale, "owner", key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property.id} className="border-b border-outline-variant last:border-0">
            <th scope="row" className="px-4 py-3 text-start font-normal">
              <span className="flex items-center gap-3">
                <Image
                  src={property.image}
                  alt={property.imageAlt}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-md object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate font-label-md text-label-md text-on-surface">
                    {property.title}
                  </span>
                  <span className="block text-label-sm text-label-sm text-on-surface-variant">
                    {t(locale, "owner", `owner.transaction.${property.transactionType}`)}
                  </span>
                </span>
              </span>
            </th>
            <td className="px-4 py-3 text-label-md text-label-md text-on-surface">
              {formatCfa(property.priceCfa, locale)}
            </td>
            <td className="px-4 py-3">
              <Badge tone={STATUS_TONE[property.status]}>
                {t(locale, "owner", STATUS_KEY[property.status])}
              </Badge>
            </td>
            <td className="px-4 py-3 text-label-md text-label-md text-on-surface-variant">
              {property.views30d}
            </td>
            <td className="px-4 py-3 text-label-md text-label-md text-on-surface-variant">
              {formatDate(property.updatedAtIso, locale)}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
```

- [ ] **Step 7: Implement `src/components/owner/dashboard-activity-feed.tsx`**

```tsx
import { t, type Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { formatCfa, formatRelativeTime } from "@/lib/utils/format";
import type { OwnerActivity } from "@/lib/domain/property";

/**
 * Recent-activity list for the owner dashboard.
 *
 * Owns: an ordered feed of the owner's latest bookings, payments, messages, and
 * verification events, each with its relative timestamp and — for money events —
 * its amount.
 *
 * `now` is a required prop rather than being read from the clock, so the rendered
 * output is deterministic for tests and identical between the server render and
 * any later hydration.
 *
 * A server component: nothing here is interactive.
 */

const ACTIVITY_ICON: Record<OwnerActivity["kind"], string> = {
  booking: "event",
  payment: "account_balance_wallet",
  message: "chat",
  verification: "verified",
};

export function DashboardActivityFeed({
  locale,
  items,
  now,
}: {
  locale: Locale;
  items: readonly OwnerActivity[];
  now: Date;
}) {
  return (
    <Card className="p-5">
      <h2 className="font-headline-sm text-headline-sm text-on-surface">
        {t(locale, "owner", "owner.dashboard.activity.title")}
      </h2>

      <ul className="mt-4 flex flex-col divide-y divide-outline-variant">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[20px] text-primary"
            >
              {ACTIVITY_ICON[item.kind]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-md text-on-surface">
                {t(locale, "owner", item.titleKey)}
              </span>
              <span className="block text-label-sm text-label-sm text-on-surface-variant">
                {formatRelativeTime(item.occurredAtIso, locale, now)}
              </span>
            </span>
            {typeof item.amountCfa === "number" ? (
              <span className="font-label-md text-label-md text-success">
                {formatCfa(item.amountCfa, locale)}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
```

- [ ] **Step 8: Write the failing test `src/components/owner/owner-dashboard.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OwnerDashboard } from "@/components/owner/owner-dashboard";
import { OWNER_ACTIVITY, OWNER_PROPERTIES, OWNER_STATS } from "@/lib/owner/dashboard";

const NOW = new Date("2026-10-05T12:00:00.000Z");

describe("OwnerDashboard", () => {
  it("renders exactly one page-level heading", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders one region per stat", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    expect(screen.getAllByRole("region")).toHaveLength(OWNER_STATS.length);
  });

  it("passes the current time to the activity feed, not a hardcoded one", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    // The newest activity is 2026-10-04T09:15Z — 26h45m before NOW, which
    // rounds to -1 day, and `numeric: "auto"` renders that as "yesterday".
    // If the component ignored `now` and called `new Date()` internally, every
    // label would collapse to "x seconds ago" and this would fail.
    expect(screen.getByText("yesterday")).toBeVisible();
  });

  it("renders a row per property", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    expect(screen.getAllByRole("row")).toHaveLength(OWNER_PROPERTIES.length + 1);
  });

  it("renders one item per activity", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(OWNER_ACTIVITY.length);
  });
});
```

- [ ] **Step 9: Implement `src/components/owner/owner-dashboard.tsx`**

```tsx
import { t, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardActivityFeed } from "@/components/owner/dashboard-activity-feed";
import { DashboardStatCard } from "@/components/owner/dashboard-stat-card";
import { ListingTable } from "@/components/owner/listing-table";
import {
  OWNER_ACTIVITY,
  OWNER_PROPERTIES,
  OWNER_STATS,
} from "@/lib/owner/dashboard";
import { formatNumber } from "@/lib/utils/format";

/**
 * The owner dashboard body — `/[locale]/owner`.
 *
 * Owns: the composition and ordering of the dashboard's three regions (stat row,
 * listings table, activity feed) plus its heading and quick actions. A server
 * component throughout: nothing on this screen is interactive yet, because every
 * control here either links to an unbuilt route or acts on data the API does not
 * serve.
 *
 * Does not own: the shell (the role's `layout.tsx` supplies `AppShell`), the RBAC
 * guard (also the layout), or any data fetching (the records arrive as props from
 * the page so this component stays presentational and testable in isolation).
 *
 * `now` is threaded down to the activity feed so relative timestamps do not drift
 * between the server render and the browser.
 */

export function OwnerDashboard({
  locale,
  now,
}: {
  locale: Locale;
  now: Date;
}) {
  return (
    <div className="mx-auto flex max-w-container-max flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface md:font-display-lg md:text-display-lg">
            {t(locale, "owner", "owner.dashboard.title")}
          </h1>
          <p className="mt-2 text-body-lg text-body-lg text-on-surface-variant">
            {t(locale, "owner", "owner.dashboard.greeting")} —{" "}
            {t(locale, "owner", "owner.dashboard.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Both routes exist but are still the 0-byte scaffold stubs; these
              buttons are deliberately non-navigating until that work lands. */}
          <Button variant="secondary" disabled title="Available once the properties route is built">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              add_home_work
            </span>
            {t(locale, "owner", "owner.dashboard.actions.addProperty")}
          </Button>
          <Button variant="primary" disabled title="Available once the rentals route is built">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              add_business
            </span>
            {t(locale, "owner", "owner.dashboard.actions.addRental")}
          </Button>
        </div>
      </header>

      <section
        aria-label={t(locale, "owner", "owner.dashboard.title")}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {OWNER_STATS.map((stat) => (
          <DashboardStatCard
            key={stat.id}
            locale={locale}
            label={t(locale, "owner", stat.labelKey)}
            icon={stat.icon}
            valueCfa={stat.valueCfa}
            value={stat.value}
            unit={stat.unit}
          />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {t(locale, "owner", "owner.dashboard.listings.title")}
            </h2>
            <p className="text-label-sm text-label-sm text-on-surface-variant">
              {formatNumber(OWNER_PROPERTIES.length, locale)}
            </p>
          </div>
          <ListingTable locale={locale} properties={OWNER_PROPERTIES} />
        </Card>

        <DashboardActivityFeed locale={locale} items={OWNER_ACTIVITY} now={now} />
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Verify**

Run: `npm test`
Expected: all suites PASS.

- [ ] **Step 11: Lint and build**

Run: `npm run lint && npm run build`
Expected: both clean. `next build` will statically prerender `/[locale]/owner` for all five locales.

- [ ] **Step 12: Confirm the `now` decision on `owner/page.tsx`**

Task 8's `page.tsx` passes `now={new Date()}`. Because this route is statically
prerendered, that timestamp is baked in at build time and the relative labels
("2 days ago") go stale until the page is rebuilt. Check whether this project
already declares a revalidation window on the marketing routes:

```bash
grep -rn "revalidate" src/app
```

If nothing else uses `revalidate`, decide explicitly and record the choice in
Task 10:

- **Dynamic** (recommended for relative timestamps) — add
  `export const dynamic = "force-dynamic";` to `owner/page.tsx`. Costs a render
  per request, which is correct here because "2 hours ago" must be true.
- **Static with regeneration** — add `export const revalidate = 60;` instead.
  Cheaper, and labels are at most a minute stale.
- **Fully static** — leave as-is and accept labels frozen at build time. Only
  defensible if the feed is later replaced by server-fetched absolute dates.

Do **not** hardcode a date in `page.tsx`; that makes the page permanently wrong.

- [ ] **Step 13: Commit — GATED**

---

### Task 9: RBAC guard stub + owner routes

`src/lib/auth/guards.ts` is 0 bytes and is the documented home for the guard. `owner/layout.tsx` is a bare pass-through and `owner/page.tsx` returns `null`.

**Files:**
- Create: `src/lib/auth/guards.ts`
- Create: `src/lib/owner/navigation.ts`
- Modify: `src/app/[locale]/owner/layout.tsx`
- Modify: `src/app/[locale]/owner/page.tsx`
- Create: `src/lib/auth/guards.test.ts`

**Interfaces:**
- Consumes: `NavItem` from `@/components/layout/role-sidebar`; `AppShell`; `OwnerDashboard`; `t`; `OWNER_PROPERTIES` (for the nav badge count).
- Produces: `Role` type, `Session` type, `MOCK_SESSION`, `requireRole(locale, role)`, `ownerNav(locale)`.

- [ ] **Step 1: Write the failing test `src/lib/auth/guards.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MOCK_SESSION, requireRole } from "@/lib/auth/guards";

// `vi.mock` factories are hoisted above imports, so the mock function must be
// created with `vi.hoisted` or the factory would capture an uninitialised
// binding at module-evaluation time.
const { redirectMock } = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
);

vi.mock("next/navigation", () => ({
  redirect: (href: string) => redirectMock(href),
}));

beforeEach(() => {
  redirectMock.mockClear();
});

describe("requireRole", () => {
  it("returns the session when the role matches", () => {
    expect(requireRole("en", "property_owner")).toEqual(MOCK_SESSION);
  });

  it("redirects to login when the role does not match", () => {
    // `redirect()` throws NEXT_REDIRECT; the mock records it.
    expect(() => requireRole("en", "admin")).toThrow();
    expect(redirectMock).toHaveBeenCalledWith("/en/login");
  });

  it("redirects to the locale-prefixed login, not the default locale", () => {
    expect(() => requireRole("fr", "admin")).toThrow();
    expect(redirectMock).toHaveBeenCalledWith("/fr/login");
  });
});
```

> `redirectMock` must be declared with `vi.hoisted`. Vitest hoists `vi.mock`
> calls to the top of the file, above the imports under test — a plain
> `const redirectMock = vi.fn()` would still be in the temporal dead zone when
> the factory runs and would throw
> `Cannot access 'redirectMock' before initialization`.

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- guards`
Expected: FAIL — cannot resolve `@/lib/auth/guards`.

- [ ] **Step 3: Implement `src/lib/auth/guards.ts`**

```ts
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n";

/**
 * Role guards for the authenticated sections.
 *
 * Owns: the single place that answers "may this request proceed as role X?" for
 * the `account`, `owner`, `hotel`, and `admin` sections. Every role's
 * `layout.tsx` calls it once at its root, so individual pages never re-check
 * (file-structure.md rule 12).
 *
 * ! STUB — this is not authorization yet. It returns a hard-coded session and
 * performs no verification of any kind. The real implementation reads the
 * httpOnly session cookie, calls the Core API's `GET /api/v1/users/me`, and
 * compares the returned `role` server-side; per `context/security.md` §RBAC the
 * check must never be trusted to the client, and ownership checks
 * (`owner_id` matching) are enforced by the API per mutating endpoint, not here.
 * Delete `MOCK_SESSION` in the same change that adds the API call — leaving it
 * reachable would be a real hole.
 *
 * Does not own: ownership (which property a given owner may edit — that is an
 * API-side check per endpoint), or session issuance.
 */

export type Role = "tenant" | "property_owner" | "hotel_owner" | "admin";

export type Session = {
  userId: string;
  role: Role;
  displayName: string;
  isVerified: boolean;
};

export const MOCK_SESSION: Session = {
  userId: "user-owner-001",
  role: "property_owner",
  displayName: "Awa N'Guessan",
  isVerified: true,
};

export function requireRole(locale: Locale, role: Role): Session {
  const session = MOCK_SESSION;
  if (session.role !== role) {
    redirect(`/${locale}/login`);
  }
  return session;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- guards`
Expected: PASS, 3 tests.

- [ ] **Step 5: Write `src/lib/owner/navigation.ts`**

```ts
import { t, type Locale } from "@/lib/i18n";
import type { NavItem } from "@/components/layout/role-sidebar";
import { OWNER_PROPERTIES } from "@/lib/owner/dashboard";

/**
 * Owner sidebar navigation.
 *
 * Owns: the nav labels, hrefs, and icons for the `property_owner` section. Lives
 * with the rest of the owner's data so `AppShell` — which is shared across all
 * four roles — stays role-agnostic and hardcodes no labels of its own.
 *
 * The `properties` badge shows how many listings are awaiting review, since that
 * is the one number an owner needs to act on and it is the natural driver for the
 * most likely next click. Hrefs point at routes that are still 0-byte scaffolds.
 */

export function ownerNav(locale: Locale): NavItem[] {
  const pending = OWNER_PROPERTIES.filter(
    (property) => property.status === "pending_review",
  ).length;

  return [
    {
      href: `/${locale}/owner`,
      label: t(locale, "owner", "owner.nav.dashboard"),
      icon: "dashboard",
    },
    {
      href: `/${locale}/owner/properties`,
      label: t(locale, "owner", "owner.nav.properties"),
      icon: "home_work",
      badgeCount: pending,
    },
    {
      href: `/${locale}/owner/rentals`,
      label: t(locale, "owner", "owner.nav.rentals"),
      icon: "desk",
    },
    {
      href: `/${locale}/owner/messages`,
      label: t(locale, "owner", "owner.nav.messages"),
      icon: "chat",
    },
    {
      href: `/${locale}/owner/payments`,
      label: t(locale, "owner", "owner.nav.payments"),
      icon: "payments",
    },
    {
      href: `/${locale}/owner/profile`,
      label: t(locale, "owner", "owner.nav.profile"),
      icon: "person",
    },
  ];
}
```

- [ ] **Step 6: Rewrite `src/app/[locale]/owner/layout.tsx`**

```tsx
import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/guards";
import { ownerNav } from "@/lib/owner/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Property-owner section layout — the frame for every `/owner/**` route.
 *
 * Owns: the RBAC guard for the `property_owner` role, applied once here so no
 * page beneath re-checks it (file-structure.md rule 12), and the shared app
 * shell the section renders inside.
 *
 * Does not own: any per-page layout decision, or session creation.
 */

export default async function OwnerLayout({
  params,
  children,
}: LayoutProps<"/[locale]/owner">) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  // Called for its side effect: a role mismatch redirects and throws. The
  // returned session is deliberately not rendered here — the personalized
  // greeting belongs to `OwnerDashboard`, and duplicating the name in an
  // `sr-only` element would just be noise for screen-reader users.
  requireRole(locale, "property_owner");

  return (
    <AppShell locale={locale} items={ownerNav(locale)}>
      {children}
    </AppShell>
  );
}
```

- [ ] **Step 7: Rewrite `src/app/[locale]/owner/page.tsx`**

```tsx
import { OwnerDashboard } from "@/components/owner/owner-dashboard";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Owner dashboard — `/[locale]/owner`.
 *
 * Composition only (file-structure.md rule 11): the page resolves the locale and
 * passes it down. All markup lives in `components/owner/owner-dashboard.tsx`.
 *
 * `now` is computed here and handed to the dashboard so the activity feed's
 * relative timestamps are computed once, on the server, from a single instant.
 */

export default async function OwnerPage(props: PageProps<"/[locale]/owner">) {
  const { locale: raw } = await props.params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  return <OwnerDashboard locale={locale} now={new Date()} />;
}
```

- [ ] **Step 8: Verify the full chain**

Run: `npm test && npm run lint && npm run build && npx tsc --noEmit`
Expected: all clean. `next build` output must show `/[locale]/owner` prerendered for all five locales.

- [ ] **Step 9: Verify Arabic renders RTL**

Run: `npm run dev`, then open `http://localhost:3000/ar/owner`.
Expected: the sidebar sits on the right, `dir="rtl"` is on `<html>`, and the table columns read start-to-right. Copy is English (ar messages do not exist yet — that is expected and documented), but the *layout* must be mirrored, per `context/ui-context.md` §Internationalization.

- [ ] **Step 10: Commit — GATED**

---

### Task 10: Bring the four context docs back in sync

Required, not optional. file-structure.md rule 13: the sitemap and the file tree "must never drift apart". Rule 18: "treat an out-of-date structure doc as a bug".

**Files:**
- Modify: `context/file-structure.md`
- Modify: `context/developer-map.md`
- Modify: `context/sitemap.md`
- Modify: `context/ui-context.md`

- [ ] **Step 1: `context/file-structure.md` — add `lib/owner/` to the canonical tree**

Insert after the `marketing/` block (which ends with `map.ts`), keeping the tree's comment-column style:

```
│   │   ├── owner/                     # Property-owner dashboard content
│   │   │   ├── dashboard.ts           # /owner stats, listings, activity
│   │   │   └── navigation.ts          # Owner sidebar labels + hrefs
```

Also extend the existing `components/owner/` block with the three new files, matching the existing comments:

```
│   │   │   ├── owner-dashboard.tsx        # /owner body: stat row + listings + activity
│   │   │   ├── dashboard-stat-card.tsx    # One labelled metric (moves to ui/ on 2nd usage)
│   │   │   ├── dashboard-activity-feed.tsx # Recent bookings/payments/messages
│   │   │   ├── listing-table.tsx
│   │   │   ├── property-form.tsx
│   │   │   └── availability-calendar.tsx
```

Add `dashboard-stat-card` as a leading comment on the `owner-dashboard.tsx` line noting the rule-2 move obligation, and add `src/tests/setup.ts` to the `tests/` block:

```
│   │   ├── tests/
│   │   │   ├── setup.ts              # Vitest setup: jest-dom matchers
│   │   │   ├── test-utils.tsx
│   │   │   └── mock-api.ts
```

Finally, add `docs/superpowers/plans/` to the root-level listing, since this plan file is a new top-level path not previously in the tree.

- [ ] **Step 2: `context/file-structure.md` — extend §3 with the status-token note**

After the `tailwind.config.ts is not part of this project's tree` bullet, add:

```markdown
- **Status colours live in `globals.css`, not in a component.** `ui-context.md`
  fixes the mapping but deliberately left the amber unpicked; it is now
  `--color-pending: #8a5a00`, alongside `--color-success: #1c7a4f` and
  `--color-locked: #5f6470`. All three clear 4.5:1 as text on white and on the
  `--color-surface-container` pill tint. The brand green `#36B373` is **not** a
  token: measured at 2.67:1 on white it fails WCAG AA for text and under white
  text, so it stays decoration-only (icons, chart marks).
```

- [ ] **Step 3: `context/developer-map.md` — add the owner row**

Find the "where to find what" table and add after the auth row:

```markdown
| Where do the owner pages live? | `src/app/[locale]/owner/**/page.tsx` — thin composition over `src/components/owner/` (`owner-dashboard.tsx`, `dashboard-stat-card.tsx`, `dashboard-activity-feed.tsx`, `listing-table.tsx`) inside `src/components/layout/app-shell.tsx`. The RBAC guard is `requireRole()` in `src/lib/auth/guards.ts`, called once from `owner/layout.tsx`. Data + sidebar labels in `src/lib/owner/`. |
```

- [ ] **Step 4: `context/sitemap.md` — flip the Owner design-status row**

Replace line 99's row:

```markdown
| Property owner `/owner` — **dashboard only** | **Built** from Stitch screen `88c0f2cb2247429286c407b14b3e00e0` ("Tableau de Bord Manager - Annorent") — stat row, listings table with status badges, recent-activity feed, quick actions, inside the shared `AppShell`. **Composition pending visual verification**: the reference could not be fetched while building (the Stitch CDN is unreachable from the build sandbox), so the region order and contents are inferred from `project-overview.md` and `database-schema.md` rather than read off the screen. Re-check against the reference before treating it as final. |
| Property owner `/owner` — other 10 routes | **Not yet designed** — no Stitch screen exists for properties list/new/edit, rentals list/new/availability/pricing, messages, payments, or profile |
```

- [ ] **Step 5: `context/sitemap.md` — note the disabled quick actions**

After the "Inert controls on `/map`" table, add a paragraph:

```markdown
**Inert controls on `/owner`.** The dashboard's "Add property" and "Add rental
unit" buttons render with the reference's visual state but are `disabled` with an
explanatory `title`, because `/owner/properties/new` and `/owner/rentals/new` are
still 0-byte scaffolds — there is nothing to navigate to. They follow the same
convention as the inert map controls: real elements, explicitly disabled, never
left looking clickable.
```

- [ ] **Step 6: `context/ui-context.md` — close the amber gap**

Replace the status table with the concrete pick:

```markdown
| Status | Token | Hex | Contrast on white / on `--color-surface-container` |
|---|---|---|---|
| Verified / Confirmed / Available | `--color-success` | `#1C7A4F` | 5.32:1 / 4.56:1 |
| Pending / Awaiting review or payment | `--color-pending` | `#8A5A00` | 5.93:1 / 5.08:1 |
| Locked / Cancelled / Suspended | `--color-locked` | `#5F6470` | 5.93:1 / 5.08:1 |

The amber the previous revision called for but never named is `#8A5A00`. Use it
and no other pending tone, everywhere a status appears.

The brand green `#36B373` is deliberately **not** a status token: at 2.67:1 on
white it fails WCAG AA both as text and under white text. It remains available for
non-text decoration — icons, chart marks — where the contrast rule does not apply.
Where green must carry text, use `--color-tertiary-container` (`#006844`, 6.85:1
with white).
```

- [ ] **Step 7: Verify nothing else drifted**

```bash
npm test && npm run lint && npm run build && npx tsc --noEmit
git status --short
```

Expected: all four commands clean; `git status` lists only the files this plan
created or modified, plus `.next/` (gitignored) and `package-lock.json`.

- [ ] **Step 8: Commit — GATED**

Per `AGENTS.md` rule 15, do not commit. Report the full file list to the user and
let them decide the commit boundary.

---

## Verification Summary

Run this before reporting the slice complete:

```bash
npm test          # all suites green
npm run lint      # no eslint errors
npm run build     # prerenders /[locale]/owner for en/fr/pt/ar/sw
npx tsc --noEmit  # clean (ONLY meaningful after a build — see Global Constraints)
git status --short
```

Then confirm by hand in the browser:

1. `/en/owner` — stat row, listings table with text status badges, activity feed.
2. `/fr/owner` — every string in French, `lang="fr"` on `<html>`.
3. `/ar/owner` — layout mirrored (`dir="rtl"`, sidebar on the right); copy still
   English, which is expected until the ar namespace lands.
4. Both quick-action buttons are visibly disabled with a tooltip.
5. Tab through the sidebar — focus is visible, active item is `aria-current="page"`.
6. Narrow the window below `lg` — the sidebar hides and the content does not
   overflow.

## Out of Scope (deliberately)

- The other 10 `/owner` routes.
- Playwright / `e2e/owner-listing.spec.ts` — needs a real backend for the RBAC
  redirect to be meaningful.
- pt / ar / sw message namespaces (ar gets layout support now, copy later).
- Any API wiring; `src/lib/api/*`, `src/server/*`, and `src/lib/domain/generated/`
  stay 0-byte.
- `input`, `select`, `modal`, `tabs`, `toast` primitives and the `account/`,
  `hotel/`, `admin/` components — nothing in this slice consumes them.
- `owner/property-form.tsx` and `owner/availability-calendar.tsx` — these belong
  to the `properties/new` and `rentals` routes, which stay 0-byte here. They
  stay on the documented tree as 0-byte entries.
- `locale-switcher.tsx` — 0 bytes and shared, but `AppShell` renders the
  wordmark alone rather than a half-built switcher.
- `src/tests/test-utils.tsx` and `src/tests/mock-api.ts` — no test in this
  slice needs a shared render wrapper (i18n is passed as props, not context) or
  an API mock (there is no API call to mock). Both stay 0-byte.
- Moving `components/marketing/pagination.tsx` to `ui/` — the dashboard does not
  paginate. Do it in the PR that first gives a second role a paginated list
  (rule 2).