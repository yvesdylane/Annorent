import { describe, expect, it } from "vitest";
import { locales, t, type Locale } from "@/lib/i18n";
import { owner } from "@/lib/i18n/messages/owner";
import { common } from "@/lib/i18n/messages/common";
import {
  OWNER_ACTIVITY,
  OWNER_PROPERTIES,
  OWNER_STATS,
} from "@/lib/owner/dashboard";

/** The only locale the owner surface ships its own copy for. */
const shipped: Locale[] = ["en"];

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

  it("ships English only — no locale table other than `en` exists", () => {
    // Guards the deliberate single-language decision. If a translator adds `fr`
    // here without updating the plan, this fails loudly rather than silently
    // showing one visitor French copy and the next English.
    expect(Object.keys(owner)).toEqual(["en"]);
    expect(Object.keys(common)).toEqual(["en"]);
  });

  it("renders the English string in every supported locale", () => {
    // `Object.keys` widens to `string[]`; these keep the literal key union so
    // indexing the `as const` tables stays type-checked.
    const ownerKeys = Object.keys(owner.en) as (keyof typeof owner.en)[];
    const commonKeys = Object.keys(common.en) as (keyof typeof common.en)[];
    for (const locale of locales) {
      for (const key of ownerKeys) {
        expect(t(locale, "owner", key), `${locale}:${key}`).toBe(owner.en[key]);
      }
      for (const key of commonKeys) {
        expect(t(locale, "common", key), `${locale}:${key}`).toBe(common.en[key]);
      }
    }
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