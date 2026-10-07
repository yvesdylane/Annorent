import { t, type Locale } from "@/lib/i18n";
import type { NavItem } from "@/components/layout/role-sidebar";
import { OWNER_LISTINGS } from "@/lib/owner/listings";

/**
 * Owner sidebar navigation.
 *
 * Owns: the nav labels, hrefs, and icons for the `property_owner` section. Lives
 * with the rest of the owner's data so `AppShell` — which is shared across all
 * four roles — stays role-agnostic and hardcodes no labels of its own.
 *
 * Mirrors the owner portal reference's 8-entry sidebar (Dashboard, My Listings,
 * Add Property, Availability & Calendar, Inquiries & Tenants, Payouts & Escrow,
 * Documents & Cadastre, Settings). Hrefs are chosen from the approved mapping:
 * My Listings -> `/properties`, Availability & Calendar -> `/rentals`, Settings
 * -> `/profile`, and Documents & Cadastre -> the new `/documents` route.
 *
 * The `properties` badge counts listings awaiting notary review — the one number
 * an owner must act on, and the natural driver for the most likely next click.
 */

export function ownerNav(locale: Locale): NavItem[] {
  const pending = OWNER_LISTINGS.filter(
    (listing) => listing.status === "pending",
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
      href: `/${locale}/owner/properties/new`,
      label: t(locale, "owner", "owner.nav.addProperty"),
      icon: "add_circle",
    },
    {
      href: `/${locale}/owner/rentals`,
      label: t(locale, "owner", "owner.nav.rentals"),
      icon: "calendar_month",
    },
    {
      href: `/${locale}/owner/messages`,
      label: t(locale, "owner", "owner.nav.messages"),
      icon: "chat",
    },
    {
      href: `/${locale}/owner/payments`,
      label: t(locale, "owner", "owner.nav.payments"),
      icon: "account_balance",
    },
    {
      href: `/${locale}/owner/documents`,
      label: t(locale, "owner", "owner.nav.documents"),
      icon: "verified_user",
    },
    {
      href: `/${locale}/owner/profile`,
      label: t(locale, "owner", "owner.nav.profile"),
      icon: "settings",
    },
  ];
}