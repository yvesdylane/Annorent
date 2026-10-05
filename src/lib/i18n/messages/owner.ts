/**
 * Property-owner surface copy.
 *
 * English only, deliberately. `context/ui-context.md` F11 requires fr/pt/ar/sw
 * eventually, but the owner surface ships as a single-language table for now so
 * no locale shows a half-finished translation. `t()` falls back per key, so
 * every locale — fr, pt, ar, sw — renders exactly these English strings until
 * its own table is added.
 *
 * When a translation does land, add a sibling `<locale>` table here rather than
 * editing the English one; `owner-messages.test.ts` fails if the locales drift
 * apart or if a non-English locale starts returning anything else.
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
} as const;

/** Keys the owner surface can ask for. */
export type OwnerKey = keyof (typeof owner)["en"];