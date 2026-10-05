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