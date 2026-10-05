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